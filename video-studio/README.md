# DCH video studio

Skills and agents for making and editing DCH and BuildWithJA video, then handing it to the DCH Social Studio (Postiz) as drafts.

Run `video-studio/install.sh`, then restart Claude Code.

## Agents (run in this order)

1. `dch-video-director`: story, hook, storyboard, captions
2. `dch-motion-builder`: HyperFrames builds (motion graphics)
3. `dch-video-editor`: real footage (ffmpeg, captions, Shorts)
4. `dch-video-qa`: read-only check before publishing
5. `dch-studio-publisher`: Postiz drafts only, after approval

## Not installed (and why)

- Ghost Editor: Apple-silicon Mac only.
- MotionClone: Windows only, needs a Codex CLI and ChatGPT account.
- openai-whisper: heavy PyTorch install; faster-whisper and HyperFrames transcribe cover it.
