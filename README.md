# YouIngest

YouIngest is a modern web application that transforms YouTube videos into LLM-friendly transcripts. It provides a beautiful, user-friendly interface for extracting, formatting, and managing video captions.

![YouIngest Screenshot](screenshot.png)

## 🌟 Features

- **Smart Caption Extraction**: Automatically extracts captions from any YouTube video with English subtitles
- **Dual Format Support**: Get both timestamped and plain text versions of transcripts
- **Demo Videos**: Try the service instantly with pre-cached educational videos
- **Modern UI**: Beautiful, responsive interface with dark/light mode support
- **LLM Optimization**: Automatic chunking of transcripts for optimal LLM processing
- **Easy Export**: Copy or download transcripts in your preferred format
- **Error Handling**: Comprehensive error messages for various scenarios (private videos, no subtitles, etc.)

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- npm or yarn (for frontend)

### Backend Setup

1. Create and activate a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
cd backend
python main.py
```
The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm start
# or
yarn start
```
The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

Once the backend server is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `POST /ingest`
  - Input: `{ "youtube_url": "https://www.youtube.com/watch?v=..." }`
  - Output: Transcript data including title, timestamped text, and chunks

- `GET /demo-videos`
  - Returns list of available demo videos
  - No authentication required

- `GET /demo/{video_id}`
  - Returns cached transcript for a specific demo video
  - Example: `GET /demo/neural_networks`

## 🏗️ Project Structure

```
youingest/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── transcripts/         # Cached transcript storage
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── components/     # Reusable UI components
│   │   └── styles/        # CSS and Tailwind styles
│   └── package.json        # Node.js dependencies
└── README.md
```

## 🛠️ Technology Stack

### Backend
- FastAPI - Modern, fast web framework
- yt-dlp - YouTube video processing
- webvtt-py - Caption parsing
- uvicorn - ASGI server

### Frontend
- React - UI library
- Tailwind CSS - Styling
- Axios - HTTP client
- Font Awesome - Icons

## 🔧 Development

### Backend Development
- The backend uses FastAPI for high performance and automatic API documentation
- Transcripts are cached locally in the `backend/transcripts` directory
- Demo videos are pre-cached on server startup
- Error handling includes specific messages for various YouTube API issues

### Frontend Development
- Built with React and modern hooks
- Responsive design using Tailwind CSS
- Dark/light mode support with theme persistence
- Smooth transitions and loading states
- Error handling with user-friendly messages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [3Blue1Brown](https://www.youtube.com/c/3blue1brown) for educational content
- [Science ABC](https://www.youtube.com/c/ScienceABC) for science videos
- [Veritasium](https://www.youtube.com/c/veritasium) for physics content 