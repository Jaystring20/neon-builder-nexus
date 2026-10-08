#!/usr/bin/env sh
# Encodes the raw hero video for the web. Needs ffmpeg.
#
#   sh scripts/site-images/encode-hero.sh
#
# Reads  media-src/hero-momentum.mp4 (full-quality Seedance output)
# Writes src/assets/hero/hero-momentum.webm  VP9, smallest, for browsers that play it
#        src/assets/hero/hero-momentum.mp4   H.264 fallback, starts streaming at once
#        src/assets/hero/hero-poster.jpg     first frame: shown while loading, and
#                                            on its own under reduced motion
# The hero picks these files up automatically when they exist.
set -eu
cd "$(dirname "$0")/../.."
src=media-src/hero-momentum.mp4
out=src/assets/hero
mkdir -p "$out"

ffmpeg -y -loglevel error -i "$src" -an -vf "scale=1920:-2:flags=lanczos,format=yuv420p" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 "$out/hero-momentum.webm"

ffmpeg -y -loglevel error -i "$src" -an -vf "scale=1920:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 23 -profile:v high -movflags +faststart "$out/hero-momentum.mp4"

ffmpeg -y -loglevel error -i "$src" -vf "scale=1920:-2:flags=lanczos" -frames:v 1 -q:v 3 "$out/hero-poster.jpg"

ls -lh "$out"
