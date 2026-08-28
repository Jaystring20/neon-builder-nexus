/**
 * Build guard: fail on undefined identifiers (TS2304).
 *
 * Why this exists: Vite builds with esbuild, which strips types but does NOT
 * typecheck. A free variable that was never imported — `image: vieraVivaImg`
 * with no matching import — compiles to a perfectly valid bundle and then
 * throws `ReferenceError` the moment the module is evaluated. React never
 * mounts, `#root` stays empty, and the deploy reports a green "Ready".
 *
 * That is exactly how the homepage went blank in production: the build passed,
 * Vercel went green, and the site served a bundle that crashed on load.
 *
 * `tsc` catches this as TS2304. We check only TS2304 rather than gating on a
 * full clean typecheck, because the repo carries pre-existing type errors that
 * are not fatal at runtime. TS2304 always is.
 */

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

// Resolve tsc's entry point directly so we never depend on a shell or on PATH,
// which differ between local Windows and Vercel's Linux builders.
const tscBin = createRequire(import.meta.url).resolve("typescript/bin/tsc");

/**
 * Unused backup copies of the discovery form, kept for reference. Neither is
 * imported by the app (src/pages/discovery.tsx mounts DiscoveryForm.v3), so
 * their TS2304s are never bundled and cannot crash the site. They each carry a
 * lost `useReducedMotion()` binding — if either is ever wired back up, fix the
 * missing `reduce` declaration first or /discovery will blank out the same way.
 */
const UNREACHABLE_FROM_ENTRY = [
  "src/components/DiscoveryForm.tsx",
  "src/components/DiscoveryForm.v2.tsx",
];

let tscOutput = "";
try {
  execFileSync(process.execPath, [tscBin, "--noEmit", "-p", "tsconfig.app.json"], {
    encoding: "utf8",
  });
} catch (err) {
  // tsc exits non-zero when it reports any diagnostic. We only care about TS2304,
  // so read the output rather than treating a non-zero exit as failure.
  tscOutput = `${err.stdout ?? ""}${err.stderr ?? ""}`;
}

const fatal = tscOutput
  .split(/\r?\n/)
  .filter((line) => line.includes("error TS2304"))
  .filter((line) => !UNREACHABLE_FROM_ENTRY.some((f) => line.startsWith(f)));

if (fatal.length > 0) {
  console.error(
    "\nBuild blocked: undefined identifier(s) found.\n" +
      "These compile cleanly but throw ReferenceError at runtime, which renders a blank page.\n"
  );
  for (const line of fatal) console.error(`  ${line}`);
  console.error("\nEach name must be imported or declared before this can ship.\n");
  process.exit(1);
}

console.log("✓ No undefined identifiers in shipped code.");
