from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
import base64
import json

from app.websocket.connection_manager import manager

router = APIRouter()


# ==========================================================
# Candidate
# ==========================================================

@router.websocket("/ws/candidate/{interview_id}")
async def candidate_socket(
    websocket: WebSocket,
    interview_id: int,
):

    await manager.connect_candidate(interview_id, websocket)

    print(f"Candidate connected: {interview_id}")

    try:

        while True:

            message = await websocket.receive()

            # -------------------------------
            # Video Frame (Binary)
            # -------------------------------
            if message.get("bytes") is not None:

                print("Frame received")


                frame = base64.b64encode(
                    message["bytes"]
                ).decode("utf-8")

                await manager.send_to_recruiter(
                    interview_id,
                    {
                        "type": "frame",
                        "data": frame,
                    },
                )

            # -------------------------------
            # JSON Messages
            # -------------------------------
            elif message.get("text") is not None:

                data = json.loads(message["text"])

                print("Candidate ->", data)

                await manager.send_to_recruiter(
                    interview_id,
                    data,
                )

    except WebSocketDisconnect:

        print(f"Candidate disconnected: {interview_id}")

        manager.disconnect_candidate(interview_id)


# ==========================================================
# Recruiter
# ==========================================================

@router.websocket("/ws/recruiter/{interview_id}")
async def recruiter_socket(
    websocket: WebSocket,
    interview_id: int,
):

    await manager.connect_recruiter(
        interview_id,
        websocket,
    )

    print(f"Recruiter connected: {interview_id}")

    try:

        while True:

            message = await websocket.receive()

            if message.get("text") is not None:

                data = json.loads(message["text"])

                print("Recruiter ->", data)

                await manager.send_to_candidate(
                    interview_id,
                    data,
                )

    except WebSocketDisconnect:

        print(f"Recruiter disconnected: {interview_id}")

        manager.disconnect_recruiter(interview_id)