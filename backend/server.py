from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os
import asyncio
import resend
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ZasDevLabs Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

resend.api_key = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
OWNER_EMAIL = "skr@zasdevlabs.tech"


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "ZasDevLabs Portfolio API"}


@app.post("/api/contact")
async def contact(request: ContactRequest):
    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f0f0f0;">
      <div style="background: #1E1E1E; color: white; padding: 30px; border-radius: 16px;">
        <h2 style="color: #A8C7FA; margin: 0 0 24px 0; font-size: 20px;">New Portfolio Contact</h2>

        <div style="background: #282828; padding: 16px 20px; border-radius: 12px; margin-bottom: 12px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1.5px;">Name</p>
          <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">{request.name}</p>
        </div>

        <div style="background: #282828; padding: 16px 20px; border-radius: 12px; margin-bottom: 12px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1.5px;">Email</p>
          <a href="mailto:{request.email}" style="color: #A8C7FA; font-size: 15px; margin: 0; text-decoration: none;">{request.email}</a>
        </div>

        <div style="background: #282828; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1.5px;">Message</p>
          <p style="color: #e5e7eb; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">{request.message}</p>
        </div>

        <p style="color: #4b5563; font-size: 11px; margin: 0; text-align: center;">
          Sent from the ZasDevLabs portfolio contact form &mdash; zasdevlabs.tech
        </p>
      </div>
    </div>
    """

    params = {
        "from": SENDER_EMAIL,
        "to": [OWNER_EMAIL],
        "reply_to": request.email,
        "subject": f"Portfolio Contact: {request.name}",
        "html": html_body,
    }

    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "success", "message": "Message sent successfully", "id": email.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
