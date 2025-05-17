# YouIngest

YouIngest is a web application that extracts captions from YouTube videos and formats them for use with Large Language Models (LLMs).

## Features

- Extract captions from any YouTube video
- Clean and format transcript text
- Automatic chunking for LLM compatibility
- Simple, copy-friendly interface

## Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Endpoints

- `POST /ingest`
  - Input: `{ "youtube_url": "https://www.youtube.com/watch?v=..." }`
  - Output: `{ "video_title": "...", "transcript": "...", "chunks": ["...", "..."] }`

## Development

### Backend Structure
```
backend/
├── main.py           # FastAPI application
└── requirements.txt  # Python dependencies
```

### Frontend Structure (Coming Soon)
```
frontend/
├── src/
│   ├── components/   # React components
│   ├── pages/       # Next.js pages
│   └── styles/      # CSS/Tailwind styles
└── package.json     # Node.js dependencies
```

## License

MIT License 