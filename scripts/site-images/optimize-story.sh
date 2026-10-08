#!/usr/bin/env sh
# Turns the full-size generated story images into web images. Needs ffmpeg.
#
#   sh scripts/site-images/optimize-story.sh
#
# Reads  media-src/story/<id>.png|jpg|webp   (full-size Higgsfield output)
# Writes src/assets/story/<id>.webp          (what the page loads)
#
# Each image is scaled to twice the largest size it is shown at and saved as
# WebP, which takes a 3-4 MB PNG to roughly 100-300 KB.
set -eu
cd "$(dirname "$0")/../.."
mkdir -p src/assets/story
for src in media-src/story/*; do
  [ -f "$src" ] || continue
  id=$(basename "$src"); id=${id%.*}
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1600,ih))':flags=lanczos" \
    -c:v libwebp -quality 82 -compression_level 6 "src/assets/story/$id.webp"
done
ls -lh src/assets/story
