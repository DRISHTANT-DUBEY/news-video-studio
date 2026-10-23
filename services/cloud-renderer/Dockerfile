# Placeholder for the native FFmpeg Cloud Run worker, not yet deployable.
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /app
CMD ["node", "-e", "console.log('Cloud worker not implemented')"]
