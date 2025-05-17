import requests
import json

def test_ingest_video():
    # API endpoint
    url = "http://localhost:8000/ingest"
    
    # Test YouTube URL
    payload = {
        "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Example video URL
    }
    
    # Headers
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        # Make POST request
        response = requests.post(url, json=payload, headers=headers)
        
        # Check if request was successful
        response.raise_for_status()
        
        # Print response
        print("Status Code:", response.status_code)
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")

if __name__ == "__main__":
    test_ingest_video() 