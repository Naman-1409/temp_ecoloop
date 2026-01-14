import os
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("CRITICAL WARNING: GOOGLE_API_KEY is missing from .env file.")

genai.configure(api_key=GOOGLE_API_KEY)

# Using Gemini Flash (Latest) for fast video/image analysis
model = genai.GenerativeModel('gemini-flash-latest')

async def verify_task_submission(file_bytes: bytes, mime_type: str, task_description: str, task_type: str):
    """
    Verifies if an image or video specifically proves completion of a Daily or Monthly task.
    
    Args:
        file_bytes: The raw file data.
        mime_type: 'image/jpeg', 'video/mp4', etc.
        task_description: The text of the task (e.g., "Plant a sapling").
        task_type: "Daily Task" or "Monthly Task".
    """
    
    # Precise Prompt for Task Verification
    prompt = f"""
    You are the AI Validator for the 'EcoLoop' sustainability app. 
    
    USER CLAIM:
    The user claims to have completed a {task_type}.
    Task Description: "{task_description}"
    
    YOUR JOB:
    Analyze the attached media (Image or Video) and verify if it provides legitimate proof that this specific task was performed.
    
    PERFORM THESE CHECKS:
    1. RELEVANCE: Does the visual content directly show the action described in the task? (e.g., if task is 'Plant a tree', do you see a tree being planted?)
    2. AUTHENTICITY: Is this a real photo/video? Check for AI-generated artifacts or obvious fakes.
    3. VIDEO ANALYSIS (if applicable): If this is a video, does the action take place within the footage?
    
    Output JSON:
    {{
        "is_verified": true | false,
        "confidence_score": "High" | "Medium" | "Low",
        "feedback_message": "A short, encouraging message for the user. If failed, explain why.",
        "rejection_reason": "Specific reason why verification failed (null if verified, max 1 sentence).",
        "proof_detected": "Brief description of what you saw (e.g., 'I see a person holding a reusable bottle')."
    }}
    """

    try:
        content_parts = [
            {"mime_type": mime_type, "data": file_bytes},
            prompt
        ]

        response = model.generate_content(content_parts)
        print(f"DEBUG: Raw AI Response: {response.text}")
        
        # Clean response text (remove markdown code blocks if present)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        import json
        return json.loads(text)

    except Exception as e:
        print(f"Error in verify_task_submission: {e}")
        return {
            "error": "AI Service unavailable",
            "details": str(e),
            "feedback_message": "Could not verify task at this time.",
            "is_verified": False
        }
        print(f"Error in verify_task_submission: {e}")
        return {
            "error": "AI Service unavailable",
            "details": str(e)
        }
