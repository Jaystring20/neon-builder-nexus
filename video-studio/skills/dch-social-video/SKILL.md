---
name: dch-social-video
description: Make and edit short vertical videos for DCH (Digital Creatives Hub) and BuildWithJA content, then hand them to the DCH Social Studio (Postiz) as drafts. Use when someone asks for a reel, launch video, video series, caption video or video post for DCH or BuildWithJA, or to turn a carousel, brochure or post into video.
---

# DCH social video

Builds on three skills: `hook-story-post` (the story), `hyperframes` + `hyperframes-cli` + `media-use` (the video), and the Postiz MCP tools (the hand-off). Load them first.

## Rules (from the DCH build)

- **Source of truth for words.** Use the current DCH Company Brochure (2026) and the website copy. Hero is "Growth made possible." Never use retired lines ("Projects end. Momentum doesn't." is the old positioning; "The Future is Built. Not Bought." is retired). If the brochure is not in the session, ask for it before writing copy.
- **Never invent** numbers, clients, testimonials or dates. Flag doubtful source lines (for example the brochure's "2004 M00VE Challenge") and leave them out until confirmed.
- **Brand split.** DCH videos go to the DCH company page only. BuildWithJA videos go to the personal profile only, with no DCH branding.
- **No em-dashes** in on-screen text or captions.
- Real photos and real UI only. No stock or AI people presented as real.

## Look

- DCH: ground #0F131A, card #161B24, text #EFF4F4, muted #8D97A8, teal #4ED0CC (primary), orange #E0793E (one use, the last item). Square corners. Bricolage Grotesque 800 headlines, Poppins body, JetBrains Mono labels. Blueprint grid and soft teal glow.
- BuildWithJA: #210044 deep purple base, orange #FF9D03 accent only, Poppins ExtraBold, JetBrains Mono for counters only.
- Fonts and logo must be local files inside the composition (`assets/`), never remote.

## Structure

1. Pick the story shape with `hook-story-post` (Hook, Story, Next step). One idea per part.
2. Series, not one long reel: 8 to 13 seconds per part, 3 to 5 parts. Each part carries a `01 / 05` mono counter and a short label.
3. Smooth joins: a teal "thread" line at the left margin leaves the bottom of one part and enters the top of the next. Music continues by setting each part's `data-media-start` to the sum of the previous parts.
4. Frame 0 shows the headline (no blank first frame). Keep text inside the safe area: roughly y 300 to 1500 on a 1080x1920 canvas, clear of the platform UI at the top and bottom.
5. Reading time: about 0.5s plus 0.3s per word. Fast in, then hold. Last line at least 2s.
6. Sound: one music bed, sparse short SFX on reveals. Credit the music if it needs credit (the bundled bed is CC BY 4.0, Sascha Ende, ende.app).
7. One call to action per series, in the last part, with the real URL.

## Build loop

```
npx hyperframes init <dir> --resolution portrait --non-interactive --skip-skills
# write index.html, assets local, window.__timelines["main"] registered
npx hyperframes check          # must pass: lint, layout, motion, contrast, craft
npx hyperframes snapshot --at <seconds>   # LOOK at the frames before rendering
npx hyperframes render -o ../part1.mp4
```

GSAP rules that bit us: do not put a CSS `transform` on an element that GSAP scales (use `fromTo`); do not leave tiny sound clips with a long `data-duration` (set it to the clip length); stage content with `fromTo` so frame 0 is correct.

Join parts with ffmpeg concat (re-encode, keep audio). Pull a poster frame at a settled beat.

## Hand-off to the DCH Social Studio (Postiz)

1. Confirm the target channel with the Postiz tools (`integrationList`). DCH videos go only to the DCH company page; BuildWithJA videos only to the personal profile. If no matching channel is connected, stop and say so.
2. Write the caption with `hook-story-post`: line 1 works alone, one question or one instruction, no links in the body, no em-dashes. A series gets one caption per part, numbered.
3. Upload the MP4 to the Postiz media library using the Postiz public API with the user's API key from the environment. Never print or store the key. The video URL must be one Postiz hosts.
4. Save as a **draft** only (`integrationSchedulePostTool` with a draft type). Do not publish or schedule without the user's explicit approval of the exact caption, video and time.
5. Report back: channel, draft link, caption, and anything still unconfirmed.

## Final check (score 1 to 5, fix anything below 4)

1. Accuracy of every on-screen claim against the brochure or site.
2. Respectful language.
3. Hook strength in the first three seconds.
4. One clear next step.
