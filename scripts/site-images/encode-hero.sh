#!/usr/bin/env sh
# Encodes the raw hero video for the web. Needs ffmpeg and ffprobe.
#
#   sh scripts/site-images/encode-hero.sh
#
# Reads  media-src/hero-momentum.mp4 (full-quality Seedance output)
# Writes src/assets/hero/hero-momentum.webm  VP9, smallest, for browsers that play it
#        src/assets/hero/hero-momentum.mp4   H.264 fallback, starts streaming at once
#        src/assets/hero/hero-poster.jpg     first frame: shown while loading, and
#                                            on its own under reduced motion
# The hero picks these files up automatically when they exist.
#
# Seedance returns close to, but not exactly on, its first frame, so the seam
# is hidden: the clip starts FADE seconds in, and its last FADE seconds
# dissolve into its own opening. The output therefore ends on the frame it
# starts with and loops without a visible jump.
set -eu
cd "$(dirname "$0")/../.."
src=media-src/hero-momentum.mp4
out=src/assets/hero
FADE=0.5
mkdir -p "$out"

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
offset=$(awk "BEGIN { print $dur - 2 * $FADE }")
loop="[0:v]split[a][b];[a]trim=start=$FADE,setpts=PTS-STARTPTS[body];[b]trim=end=$FADE,setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=$FADE:offset=$offset,scale=1920:-2:flags=lanczos,format=yuv420p[v]"

ffmpeg -y -loglevel error -i "$src" -an -filter_complex "$loop" -map "[v]" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 "$out/hero-momentum.webm"

ffmpeg -y -loglevel error -i "$src" -an -filter_complex "$loop" -map "[v]" \
  -c:v libx264 -preset slow -crf 23 -profile:v high -movflags +faststart "$out/hero-momentum.mp4"

ffmpeg -y -loglevel error -i "$out/hero-momentum.mp4" -frames:v 1 -q:v 3 "$out/hero-poster.jpg"

ls -lh "$out"
