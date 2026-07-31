from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.candidates = {}
        self.recruiters = {}

    # ----------------------------
    # Candidate
    # ----------------------------

    async def connect_candidate(
        self,
        interview_id: int,
        websocket: WebSocket,
    ):
        await websocket.accept()
        self.candidates[interview_id] = websocket

    def disconnect_candidate(
        self,
        interview_id: int,
    ):
        self.candidates.pop(interview_id, None)

    # ----------------------------
    # Recruiter
    # ----------------------------

    async def connect_recruiter(
        self,
        interview_id: int,
        websocket: WebSocket,
    ):
        await websocket.accept()
        self.recruiters[interview_id] = websocket

    def disconnect_recruiter(
        self,
        interview_id: int,
    ):
        self.recruiters.pop(interview_id, None)

    # ----------------------------
    # Send to Recruiter
    # ----------------------------

    async def send_to_recruiter(
        self,
        interview_id: int,
        data,
    ):

        websocket = self.recruiters.get(interview_id)

        if websocket:

            await websocket.send_json(data)

    # ----------------------------
    # Send to Candidate
    # ----------------------------

    async def send_to_candidate(
        self,
        interview_id: int,
        data,
    ):

        websocket = self.candidates.get(interview_id)

        if websocket:

            await websocket.send_json(data)


manager = ConnectionManager()