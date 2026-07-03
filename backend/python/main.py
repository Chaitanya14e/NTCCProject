from fastapi import FastAPI, UploadFile, File
import shutil
import os
from detect import analyze_video
import time

app = FastAPI()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "AI Server Running"}


@app.post("/analyze")
async def analyze(video: UploadFile = File(...)):

    video_path = os.path.join(
        UPLOAD_FOLDER,
        f"{int(time.time())}_{video.filename}"
    )

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    result = analyze_video(video_path)

    return result