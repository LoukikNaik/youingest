from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import yt_dlp
import webvtt
import os
import logging
import re
from typing import List, Optional, Dict, Tuple
from datetime import timedelta
import json
from fastapi.staticfiles import StaticFiles
from functools import lru_cache
import asyncio
from pathlib import Path
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="YouIngest API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/transcripts", StaticFiles(directory="transcripts"), name="transcripts")

# Add after the app initialization
DEMO_VIDEOS = {
    "neural_networks": {
        "url": "https://www.youtube.com/watch?v=aircAruvnKk",
        "title": "But what is a neural network? | Chapter 1, Deep learning",
        "description": "3Blue1Brown's Neural Networks"
    },
    "quantum_mechanics": {
        "url": "https://www.youtube.com/watch?v=7TycxwFmdB0",
        "title": "Quantum Mechanics Explained in Ridiculously Simple Words",
        "description": "Science ABC's Quantum Mechanics Explanation"
    },
    "misunderstood_concept": {
        "url": "https://www.youtube.com/watch?v=6Af6b_wyiwI",
        "title": "The Most Misunderstood Concept in Physics",
        "description": "Veritasium's The Most Misunderstood Concept"
    }
}

# Add after the app initialization
@app.on_event("startup")
async def startup_event():
    """Pre-cache demo videos on startup."""
    logger.info("Pre-caching demo videos...")
    for video_id, video_info in DEMO_VIDEOS.items():
        try:
            # Check if already cached
            transcript_file = f"transcripts/{video_id}_transcript.txt"
            plain_transcript_file = f"transcripts/{video_id}_notimestamp.txt"
            
            # Only process if either file is missing
            if not os.path.exists(transcript_file) or not os.path.exists(plain_transcript_file):
                logger.info(f"Caching demo video: {video_info['title']}")
                # Download and process the video with is_demo=True
                video_title, vtt_file = download_captions(video_info['url'], is_demo=True)
                transcript, speakers = parse_captions(vtt_file)
                
                # Save both timestamped and plain text versions
                save_transcript_to_file(transcript, video_title, video_id)
                
                # Clean up VTT file
                try:
                    os.remove(vtt_file)
                except Exception as e:
                    logger.warning(f"Failed to remove temporary file {vtt_file}: {str(e)}")
            else:
                logger.info(f"Demo video already cached: {video_info['title']}")
        except Exception as e:
            logger.error(f"Error caching demo video {video_info['title']}: {str(e)}")

class YouTubeURL(BaseModel):
    youtube_url: HttpUrl
    cookies: Optional[List[Dict[str, str]]] = None

class TranscriptResponse(BaseModel):
    video_title: str
    transcript: str
    chunks: List[str]
    speakers: List[str]
    transcript_file: str  # Path to the saved transcript file
    plain_transcript: str  # Add plain transcript to response

class YouTubeError(Exception):
    """Custom exception for YouTube-related errors"""
    def __init__(self, message, error_type="youtube_error"):
        self.message = message
        self.error_type = error_type
        super().__init__(self.message)

def format_timestamp(seconds: float) -> str:
    """Format seconds into HH:MM:SS format."""
    return str(timedelta(seconds=int(seconds)))

def download_captions(url: str, cookies: Optional[List[Dict[str, str]]] = None, is_demo: bool = False) -> tuple[str, str]:
    """Download video captions and return video title and captions file path.
    If is_demo is True, save the transcripts to files."""
    ydl_opts = {
        'writesubtitles': True,
        'writeautomaticsub': True,
        'subtitleslangs': ['en'],
        'skip_download': True,
        'outtmpl': '%(title)s.%(ext)s',
        'quiet': False,
        'no_warnings': False,
        'extract_flat': False,
        'ignoreerrors': True,
        'no_check_certificate': True,
        'prefer_insecure': True,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    }
    
    # Add cookies if provided
    if cookies:
        cookie_string = '; '.join([f"{cookie['name']}={cookie['value']}" for cookie in cookies])
        ydl_opts['http_headers']['Cookie'] = cookie_string
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract video info and download subtitles
            try:
                info = ydl.extract_info(url, download=True)
            except Exception as e:
                if "Video unavailable" in str(e):
                    raise YouTubeError("This video is unavailable. It might be private, deleted, or restricted.", "video_unavailable")
                elif "Sign in to confirm your age" in str(e):
                    raise YouTubeError("This video is age-restricted and requires sign-in to view.", "age_restricted")
                elif "Video is private" in str(e):
                    raise YouTubeError("This video is private and cannot be accessed.", "private_video")
                else:
                    raise YouTubeError(f"Could not access the video: {str(e)}", "access_error")
            
            if not info:
                raise YouTubeError("Could not get video information. The video might not exist.", "no_info")
            
            video_title = info.get('title', 'Unknown Title')
            logger.info(f"Successfully extracted video title: {video_title}")
            
            # Get the subtitle file path
            base_filename = ydl.prepare_filename(info)
            subtitle_file = f"{base_filename}.en.vtt"
            
            if not os.path.exists(subtitle_file):
                # Try to find any .vtt file as fallback
                for file in os.listdir('.'):
                    if file.endswith('.vtt'):
                        subtitle_file = file
                        break
            
            if not os.path.exists(subtitle_file):
                # Try to get subtitles directly from info
                if 'subtitles' in info and 'en' in info['subtitles']:
                    subtitle_url = info['subtitles']['en'][0]['url']
                    response = requests.get(subtitle_url)
                    if response.status_code == 200:
                        subtitle_file = f"{base_filename}.en.vtt"
                        with open(subtitle_file, 'w', encoding='utf-8') as f:
                            f.write(response.text)
                    else:
                        raise YouTubeError("No subtitles found for this video. The video might not have English captions.", "no_subtitles")
                else:
                    raise YouTubeError("No subtitles found for this video. The video might not have English captions.", "no_subtitles")
            
            logger.info(f"Found subtitle file: {subtitle_file}")
            return video_title, subtitle_file
            
    except YouTubeError as e:
        logger.error(f"YouTube error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail={
                "message": e.message,
                "error_type": e.error_type
            }
        )
    except Exception as e:
        logger.error(f"Error downloading captions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An unexpected error occurred while processing the video. Please try again later.",
                "error_type": "server_error"
            }
        )

def format_transcript_for_file(transcript: str, video_title: str) -> str:
    """Format transcript into a readable text format."""
    formatted_lines = []
    formatted_lines.append(f"Transcript for: {video_title}")
    formatted_lines.append("=" * (len(video_title) + 15))
    formatted_lines.append("")
    formatted_lines.append(transcript)
    return '\n'.join(formatted_lines)

def create_non_timestamp_transcript(txt_file: str, output_file: str):
    """Create a transcript without timestamps and without repeated phrases between consecutive blocks."""
    with open(txt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Extract video title from the first line
    video_title = None
    for line in lines:
        if line.startswith('Transcript for:'):
            video_title = line.replace('Transcript for:', '').strip()
            break
    
    # Extract only the text lines (skip header and timestamps)
    text_blocks = []
    current_block = []
    for line in lines:
        line = line.strip()
        if not line or re.match(r'^\[\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}\]$', line):
            if current_block:
                text_blocks.append(' '.join(current_block))
                current_block = []
            continue
        # Skip header lines
        if line.startswith('Transcript for:') or line.startswith('='):
            continue
        current_block.append(line)
    if current_block:
        text_blocks.append(' '.join(current_block))

    # Remove repeated phrases between consecutive blocks
    result = []
    prev_words = []
    for block in text_blocks:
        block_words = block.split()
        # Find overlap
        overlap = 0
        max_overlap = min(len(prev_words), len(block_words))
        for i in range(max_overlap, 0, -1):
            if prev_words[-i:] == block_words[:i]:
                overlap = i
                break
        # Add only the non-overlapping part
        result.extend(block_words[overlap:])
        prev_words = result[-len(block_words):] if block_words else prev_words
    
    # Format the plain text transcript with title
    formatted_lines = []
    if video_title:
        formatted_lines.append(f"Plain Text Transcript for: {video_title}")
        formatted_lines.append("=" * (len(video_title) + 25))  # Longer line for "Plain Text Transcript for:"
        formatted_lines.append("")
    formatted_lines.append(' '.join(result))
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(formatted_lines))

def save_transcript_to_file(transcript: str, video_title: str, video_id: str) -> str:
    """Save formatted transcript to a text file and also create a non-timestamped version."""
    try:
        # Create transcripts directory if it doesn't exist
        os.makedirs('transcripts', exist_ok=True)
        
        # Format the transcript
        formatted_transcript = format_transcript_for_file(transcript, video_title)
        
        # Create filename
        filename = f"transcripts/{video_id}_transcript.txt"
        
        # Save to file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(formatted_transcript)
            
        logger.info(f"Successfully saved transcript to {filename}")
        
        # Create non-timestamped, deduplicated version
        non_timestamp_file = f"transcripts/{video_id}_notimestamp.txt"
        create_non_timestamp_transcript(filename, non_timestamp_file)
        logger.info(f"Successfully saved non-timestamped transcript to {non_timestamp_file}")
        
        return filename
        
    except Exception as e:
        logger.error(f"Error saving transcript to file: {str(e)}")
        raise Exception(f"Failed to save transcript: {str(e)}")

def remove_inline_tags(text: str) -> str:
    """Remove inline tags like <00:00:00.400><c> makes</c> from text."""
    # Remove <c>...</c> and <...>
    text = re.sub(r'<c>|</c>', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()

def parse_captions(vtt_file: str) -> Tuple[str, List[str]]:
    """Parse VTT file and return clean transcript text with speaker information and timestamps."""
    try:
        with open(vtt_file, 'r', encoding='utf-8') as f:
            content = f.read()
        blocks = content.strip().split('\n\n')
        transcript_dict = {}  # {timestamp: text}
        speakers = set()
        for block in blocks:
            lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
            if not lines:
                continue
            # Skip WEBVTT header
            if lines[0].startswith('WEBVTT'):
                continue
            # Find timestamp line
            timestamp_match = re.match(r'(\d{2}:\d{2}:\d{2})\.\d{3}\s*-->\s*(\d{2}:\d{2}:\d{2})\.\d{3}', lines[0])
            if not timestamp_match:
                continue
            start_time = timestamp_match.group(1)
            end_time = timestamp_match.group(2)
            # Skip blocks where start and end time are the same
            if start_time == end_time:
                continue
            timestamp = f"[{start_time} - {end_time}]"
            # Collect all text lines after timestamp
            text_lines = []
            for line in lines[1:]:
                # Remove alignment and position info
                line = re.sub(r'align:start position:\d+%', '', line).strip()
                if not line:
                    continue
                text_lines.append(line)
            if text_lines:
                text = remove_inline_tags(' '.join(text_lines))
                # Keep only the longest text for each timestamp
                if (timestamp not in transcript_dict) or (len(text) > len(transcript_dict[timestamp])):
                    transcript_dict[timestamp] = text
        transcript_parts = [f"{timestamp}\n{text}\n" for timestamp, text in transcript_dict.items()]
        return '\n'.join(transcript_parts), sorted(list(speakers))
    except Exception as e:
        logger.error(f"Error parsing VTT file: {str(e)}")
        raise Exception(f"Error parsing captions: {str(e)}")

def extract_speaker(text: str) -> Tuple[Optional[str], str]:
    """Extract speaker name from caption text if present."""
    patterns = [
        r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):\s*(.*)',  # "Speaker: text"
        r'^\[([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\]\s*(.*)',  # "[Speaker] text"
        r'^\(([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\)\s*(.*)',  # "(Speaker) text"
    ]
    
    for pattern in patterns:
        match = re.match(pattern, text)
        if match:
            return match.group(1), match.group(2)
    
    return None, text

def chunk_text(text: str, max_chunk_size: int = 4000) -> List[str]:
    """Split text into chunks of maximum size, preserving speaker turns and timestamps."""
    # Split by double newlines to preserve speaker turns
    parts = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_size = 0
    
    for part in parts:
        part_size = len(part) + 2  # +2 for newlines
        if current_size + part_size > max_chunk_size:
            if current_chunk:
                chunks.append('\n\n'.join(current_chunk))
            current_chunk = [part]
            current_size = part_size
        else:
            current_chunk.append(part)
            current_size += part_size
    
    if current_chunk:
        chunks.append('\n\n'.join(current_chunk))
    
    return chunks

def extract_video_id(url: str) -> str:
    """Extract video ID from YouTube URL."""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'youtu\.be\/([0-9A-Za-z_-]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return "unknown"

@app.post("/ingest", response_model=TranscriptResponse)
async def ingest_video(url_data: YouTubeURL):
    """Process YouTube video and return cleaned transcript without saving files."""
    try:
        # Download captions with cookies
        video_title, vtt_file = download_captions(
            str(url_data.youtube_url),
            cookies=url_data.cookies,
            is_demo=False
        )
        
        # Parse captions
        try:
            transcript, speakers = parse_captions(vtt_file)
        except Exception as e:
            logger.error(f"Error parsing captions: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to parse video captions. The captions might be in an unsupported format.",
                    "error_type": "parse_error"
                }
            )
        
        # Extract video ID for filename (only used for response, not for saving)
        video_id = extract_video_id(str(url_data.youtube_url))
        
        # Format transcripts without saving to files
        formatted_transcript = format_transcript_for_file(transcript, video_title)
        
        # Create plain text version without saving
        text_blocks = []
        current_block = []
        for line in formatted_transcript.split('\n'):
            line = line.strip()
            if not line or re.match(r'^\[\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}\]$', line):
                if current_block:
                    text_blocks.append(' '.join(current_block))
                    current_block = []
                continue
            # Skip header lines
            if line.startswith('Transcript for:') or line.startswith('='):
                continue
            current_block.append(line)
        if current_block:
            text_blocks.append(' '.join(current_block))

        # Remove repeated phrases between consecutive blocks
        result = []
        prev_words = []
        for block in text_blocks:
            block_words = block.split()
            # Find overlap
            overlap = 0
            max_overlap = min(len(prev_words), len(block_words))
            for i in range(max_overlap, 0, -1):
                if prev_words[-i:] == block_words[:i]:
                    overlap = i
                    break
            # Add only the non-overlapping part
            result.extend(block_words[overlap:])
            prev_words = result[-len(block_words):] if block_words else prev_words

        # Format plain text transcript
        plain_transcript_lines = []
        plain_transcript_lines.append(f"Plain Text Transcript for: {video_title}")
        plain_transcript_lines.append("=" * (len(video_title) + 25))
        plain_transcript_lines.append("")
        plain_transcript_lines.append(' '.join(result))
        plain_transcript = '\n'.join(plain_transcript_lines)
        
        # Clean up the temporary VTT file
        try:
            os.remove(vtt_file)
        except Exception as e:
            logger.warning(f"Failed to remove temporary file {vtt_file}: {str(e)}")
        
        # Chunk the transcript
        chunks = chunk_text(transcript)
        
        return TranscriptResponse(
            video_title=video_title,
            transcript=formatted_transcript,
            chunks=chunks,
            speakers=speakers,
            transcript_file="",  # Empty string since we're not saving files
            plain_transcript=plain_transcript
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An unexpected error occurred. Please try again later.",
                "error_type": "server_error"
            }
        )

# Add new endpoint for demo videos
@app.get("/demo-videos")
async def get_demo_videos():
    """Get list of available demo videos."""
    return {
        "videos": [
            {
                "id": video_id,
                "url": info["url"],
                "title": info["title"],
                "description": info["description"]
            }
            for video_id, info in DEMO_VIDEOS.items()
        ]
    }

@app.get("/demo/{video_id}")
async def get_demo_video(video_id: str):
    """Get cached transcript for a demo video."""
    if video_id not in DEMO_VIDEOS:
        raise HTTPException(
            status_code=404,
            detail={
                "message": "Demo video not found",
                "error_type": "demo_not_found"
            }
        )
    
    try:
        # Read the cached transcript files
        transcript_file = f"transcripts/{video_id}_transcript.txt"
        plain_transcript_file = f"transcripts/{video_id}_notimestamp.txt"
        
        if not os.path.exists(transcript_file) or not os.path.exists(plain_transcript_file):
            raise HTTPException(
                status_code=404,
                detail={
                    "message": "Demo video transcript not found in cache",
                    "error_type": "cache_miss"
                }
            )
        
        with open(transcript_file, 'r', encoding='utf-8') as f:
            transcript = f.read()
        
        with open(plain_transcript_file, 'r', encoding='utf-8') as f:
            plain_transcript = f.read()
        
        # Extract video title from transcript
        video_title = DEMO_VIDEOS[video_id]["title"]
        
        # Chunk the transcript
        chunks = chunk_text(transcript)
        
        return TranscriptResponse(
            video_title=video_title,
            transcript=transcript,
            chunks=chunks,
            speakers=[],  # Demo videos don't need speaker info
            transcript_file=transcript_file,
            plain_transcript=plain_transcript  # Add plain transcript to response
        )
        
    except Exception as e:
        logger.error(f"Error retrieving demo video {video_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Error retrieving demo video transcript",
                "error_type": "server_error"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 