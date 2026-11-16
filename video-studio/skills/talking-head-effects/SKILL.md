---
name: talking-head-effects
description: Effect vocabulary and build recipes for high-retention talking-head edits (person talking to camera with graphics that play in front of and behind them). Use when a talking-head, reel, short or explainer needs to look professionally edited, when someone asks for effects, b-roll graphics, a chapter list, a cutout or "behind the speaker" look, or to raise the quality of an edit that only has captions and cards.
---

# Talking-head effects

Learned from a reference reel the user supplied (a 30 s, 20-effects-in-20-seconds showcase by another creator). Use the TECHNIQUES. Never copy that creator's handle, face, wording, list design or assets, and never claim an effect we did not build.

## The five ideas that made the reference work

1. **A promise on frame 0.** Two stacked white pills state the payoff ("20 video effects in 20 seconds / built by Claude") before he finishes his first word. The hook is text, not just a face.
2. **A persistent progress list.** A dark panel on the right lists every item; the current one is a white highlight bar that steps down as he says it, with a counter ("09 / 20") on top. The viewer always knows where they are and how much is left. This is the retention engine.
3. **The speaker is a cutout.** Most effects sit BEHIND him (clock face, paper background, banknote frame, giant letters) or wrap AROUND him (orbiting text). That needs a foreground matte of the speaker, and it is what separates this from captions on top of video.
4. **One effect per spoken phrase, about 1 to 1.5 s each**, cut on the word. Each effect illustrates the words being said, then gets out of the way. Between effects the plain shot returns, so the eye rests.
5. **Full-frame interrupts.** Every 5 to 8 s the whole frame changes world for under a second (cream paper, newspaper page, banknote, comic "IMPACT" frame), then snaps back. Scene-change detection on the reference shows about 20 hard changes in 25 s.

Also: one palette (dark green panel, cream paper, white pills), serif display type for the "print" moments and a clean sans for UI, a mid-video CTA rather than only at the end (a comment-box graphic that types the keyword, then pills "Comment EDIT / to get access to these / + 40 more effects"), and a logo/handle end card over the dimmed last frame. Audio was a tight voice at about -14 LUFS with almost no dynamic range and a sound on most transitions.

## Effect catalogue (what each is, and what it needs)

Needs: **M** = speaker matte (cutout), **T** = word timings, **3D** = CSS/Three.js perspective, **F** = a still frame of the speaker.

| Effect | What happens | Needs | Difficulty |
|---|---|---|---|
| Hook pills | Stacked rounded white pills with the promise, on from frame 0 | - | easy |
| Chapter list | Right-hand panel, items listed, highlight bar steps with speech, counter on top | T | easy |
| Live cursor | A cursor with a name tag draws a selection box around the face, shows the pixel size | - | easy |
| Clone row | Copies of the speaker fan out behind him, smaller and dimmer | M | medium |
| Dial / clock | A printed dial fills the background and rotates behind him | M | medium |
| Predict keys | A phone keyboard and suggestion bar types the phrase he says | T | easy |
| Orbit ring | Letters orbit his head, passing behind and in front | M, 3D | hard |
| Code body | His body is redrawn as text characters (ASCII/halftone) | F or M | medium |
| Post wall | A grid of small tiles fills behind him with a counter ticking up | M | medium |
| Letter dive | Huge serif word on paper; the video shows through one letter, then zoom through it | - (mask) | medium |
| Comment drop | A comment box types the CTA keyword, then a comment card with a like | T | easy |
| Layer explode | The frame tilts in 3D and splits into stacked glass layers (text, speaker, UI, waveform) | M, 3D | hard |
| Sketch words | Background flips to paper; hand-drawn words scribble in | M | medium |
| Blade slice | A thin line cuts across, the two halves slide apart | - | easy |
| Head stack | Small labels pile up on top of his head | T, head position | medium |
| Rack focus | Background and foreground swap blur | M | medium |
| Banknote / print frame | Speaker as an engraved portrait inside a banknote or stamp with a big number | F | medium |
| Voice note | A chat voice-message bubble with a waveform | - | easy |
| Impact frame | One-frame comic: line-art face, speed lines, a big word | F | medium |
| Dolly zoom | Background scales while he stays the same size | M | medium |
| Press front | A newspaper front page with the headline and his halftone photo | F | medium |
| Paper tear | The frame tears to reveal the next shot | - | medium |
| Blow away | He dissolves into particles; the empty set remains | M, clean plate | hard |
| Logo end card | Dim the last frame, logo and handle centred | - | easy |

## How to build them here

- **Matte:** `npx hyperframes remove-background <video>` (see `media-use`) makes a transparent cutout of the speaker. Layer order is background plate, effect, cutout, UI. Check hair and fast hands frame by frame: motion blur and low-resolution sources matte badly. If the matte is poor, use only the effects that do not need one.
- **Stills** for print, banknote, comic and ASCII looks: grab a sharp frame with ffmpeg, then treat it (threshold, halftone, edge detect) with canvas or ffmpeg filters. Do not generate a synthetic face.
- **Timing:** every effect is keyed to word timestamps (faster-whisper word JSON). An effect starts about 0.1 s before its word and ends on the next phrase.
- **Build:** HyperFrames with GSAP. Use `hyperframes-registry` for ready blocks before hand-building. For 3D use CSS perspective first, Three.js only if needed. Keep each effect its own small composition.
- **Sound:** a short SFX on most transitions, low under the voice.

## Rules of taste

- Match density to content. A list of effects wants 20 changes in 20 s; advice or a story wants one visual idea per point, about every 3 to 6 s. Too many effects on a serious message cheapens it.
- Every effect must illustrate the words being spoken. Decoration with no meaning is cut.
- The face stays visible most of the time. No effect longer than about 2 s unless it carries information.
- One palette, two typefaces, one CTA.
- Text stays inside the platform safe areas; keep photosensitive safety (no rapid flashing; an impact frame is a single cut, not a strobe).
- Low-resolution footage (under 1080 wide) limits cutouts, big punch-ins and print effects. Say so and choose effects that survive it.
- Real person rules: only edit footage you have permission to use, do not put words in the speaker's mouth, do not invent numbers for counters or banknotes.

## Starter kits

- **Advice or list video (best fit for most client talking heads):** hook pills on frame 0, chapter list with the points, one full-frame print interrupt at the turn, a keyboard or comment-box moment for the CTA keyword mid-video, cutout with a dial or post-wall behind him once, logo end card.
- **Showcase or launch:** one effect per phrase, chapter list with a counter, three full-frame interrupts, particle or tear exit.
- **No-matte fallback:** hook pills, chapter list, predict keys, comment drop, blade slice, voice note, letter dive, print interrupt from a still, end card.
