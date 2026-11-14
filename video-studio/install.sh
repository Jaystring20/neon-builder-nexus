#!/usr/bin/env bash
# Reinstall the DCH video skill set and agents on a fresh machine or cloud session.
# Third-party skills run with full agent permissions: review before you run.
# Needs: Node 22+, Python 3.11+, ffmpeg, git, jq. Restart Claude Code afterwards.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p ~/.claude/skills ~/.claude/agents

# HyperFrames (HTML to video) + media tools
npx --yes hyperframes skills update hyperframes hyperframes-cli hyperframes-registry media-use

# FFmpeg editing toolkit
npx --yes ffmpeg-skill

# Motion packs (kinetic type, TikTok/Reels, explainers, data charts) and Three.js
for p in iart-ai/tiktok-video-skills iart-ai/explainer-video-skills iart-ai/data-animation-skills iart-ai/kinetic-typography-skills cloudai-x/threejs-skills; do
  npx --yes skills add "$p" -g -y
done

# yt-dlp (only for videos you own or may use) + faster-whisper for transcripts
python3 -m venv ~/.video-skill
~/.video-skill/bin/pip install -q -U "yt-dlp[default]" faster-whisper
ln -sf ~/.video-skill/bin/yt-dlp /usr/local/bin/yt-dlp 2>/dev/null || true

# Claude Shorts (long video to vertical clips). install.sh needs rsync, so copy by hand.
tmp="$(mktemp -d)"; git clone -q --depth 1 https://github.com/AgriciDaniel/claude-shorts.git "$tmp/cs"
mkdir -p ~/.claude/skills/shorts/{scripts,references,remotion}
cp "$tmp/cs/SKILL.md" ~/.claude/skills/shorts/
cp "$tmp"/cs/scripts/* ~/.claude/skills/shorts/scripts/ 2>/dev/null || true
cp "$tmp"/cs/references/*.md ~/.claude/skills/shorts/references/ 2>/dev/null || true
(cd "$tmp/cs/remotion" && tar --exclude=node_modules --exclude=.remotion -cf - .) | (cd ~/.claude/skills/shorts/remotion && tar xf -)

# DCH skill and agents from this repo
cp -r "$HERE/skills/dch-social-video" ~/.claude/skills/
cp "$HERE"/agents/*.md ~/.claude/agents/
echo "Done. Restart Claude Code."
