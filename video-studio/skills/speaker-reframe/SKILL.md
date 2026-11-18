---
name: speaker-reframe
description: Auto-reframe a talking-head or single-speaker video to 9:16 by keeping the speaker centred (MediaPipe face detection, OpenCV frame processing, ffmpeg render). Use when a landscape or badly framed recording must become a vertical reel without losing the speaker, or when a face must be tracked for a graphic.
---

# Speaker reframe

Components, from the open-source pipeline shown in the user's reference:

- **MediaPipe** (Apache 2.0): face detection. Use the Tasks API (`mediapipe.tasks.python.vision.FaceDetector`) with a model file: `face_detector.tflite` (blaze_face short range). The legacy `mediapipe.solutions` API is not in mediapipe 1.x.
- **OpenCV** (Apache 2.0): frame read, crop and draw.
- **ffmpeg**: trim, crop and render.
- **WhisperX**: word-level caption alignment. Installed in `~/whisper-env` (Python 3.12, CPU PyTorch 2.8.0). faster-whisper in `~/.video-skill` is the fallback.

## Setup (validated on WSL Ubuntu)

1. System libraries, required before MediaPipe will import:
   `sudo apt install -y libegl1 libgl1 libgles2`
2. Python venv with the pinned MediaPipe and OpenCV:
   `python3 -m venv ~/.reframe-skill && ~/.reframe-skill/bin/pip install mediapipe==1.2.3 opencv-python-headless`
3. Model file, saved into the venv folder:
   `curl -L -o ~/.reframe-skill/face_detector.tflite https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite`
4. Check the setup: `~/.reframe-skill/bin/python -c "import mediapipe, cv2; print('ok')"`

## Procedure

1. Sample frames at 2 fps, detect the face box, and smooth the centre over time (exponential smoothing, so the crop does not jitter).
2. Crop a 9:16 window around the smoothed centre (keep the whole head with air above it).
3. Render with ffmpeg at 1080x1920, 30 fps, audio copied from the source.
4. Check the first frame, a few mid-frame moments and the hands; never crop the head out.

## Limits

- Single-speaker only. For several people use ByteTrack or LR-ASD, which are not installed.
- Low-resolution sources upscale soft.
