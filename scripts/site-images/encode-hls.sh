#!/usr/bin/env bash
# Encodes a video into adaptive streaming (HLS) for the site: several quality
# levels cut into 4-second chunks, plus a master playlist. The player starts
# on the lightest level and moves up or down with the visitor's connection,
# so playback starts fast and keeps going on a weak network.
#
#   scripts/site-images/encode-hls.sh <source> <out dir> landscape|portrait|light [seconds]
#
# Landscape ladder: 270p 350k, 432p 800k, 720p 1600k.
# Portrait ladder:  360x640 450k, 720x1280 1300k.
# Light ladder:     360p 400k, 720p 900k (sources already encoded at a low
#                   bitrate, where a heavier top level would only add size).
# [seconds] trims the source (e.g. to drop an editor's end card).
set -euo pipefail

src="$1"; out="$2"; shape="$3"; dur="${4:-}"
mkdir -p "$out"
trim=(); [ -n "$dur" ] && trim=(-t "$dur")

if [ "$shape" = landscape ]; then
  sizes=("-2:270" "-2:432" "-2:720"); rates=(350k 800k 1600k)
elif [ "$shape" = light ]; then
  sizes=("-2:360" "-2:720"); rates=(400k 900k)
else
  sizes=("360:-2" "720:-2"); rates=(450k 1300k)
fi

n=${#sizes[@]}
split="[0:v]split=$n"; for i in $(seq 0 $((n-1))); do split+="[v$i]"; done; split+=";"
filters="$split"; maps=(); streams=""
for i in $(seq 0 $((n-1))); do
  filters+="[v$i]scale=${sizes[$i]}[o$i];"
  maps+=(-map "[o$i]" -map 0:a:0)
  maps+=(-c:v:$i libx264 -b:v:$i "${rates[$i]}" -maxrate:v:$i "${rates[$i]}" -bufsize:v:$i "${rates[$i]}")
  streams+="v:$i,a:$i "
done

ffmpeg -v error -y -i "$src" "${trim[@]}" -filter_complex "${filters%;}" "${maps[@]}" \
  -preset slow -profile:v main -pix_fmt yuv420p -g 120 -keyint_min 120 -sc_threshold 0 \
  -c:a aac -b:a 96k -ac 2 \
  -f hls -hls_time 4 -hls_playlist_type vod -hls_flags independent_segments \
  -hls_segment_filename "$out/%v/seg%03d.ts" -master_pl_name master.m3u8 \
  -var_stream_map "${streams% }" "$out/%v/index.m3u8"
