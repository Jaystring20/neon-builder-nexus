import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import MomentumFlywheel from "@/components/MomentumFlywheel";

/**
 * The hero's engine, rendered in real 3D: "Projects end. Momentum doesn't."
 *
 * Three rings nested like a gyroscope (Brand, Platforms, People), each a
 * different material, around one core of cyan light (AI). The core ignites,
 * engages each ring in turn (its seams light, it starts to turn on its own
 * axis), and the whole engine spins up. Speeds approach their cruise values
 * gradually, so the acceleration itself is visible: momentum building.
 *
 * Each ring turns about a diameter, so the two points where that axis meets
 * the ring never move. Those are the bearing hubs, and that is where the
 * labels are pinned: they stay readable while everything else turns.
 *
 * Built imperatively with three.js inside one effect: no React renders per
 * frame. Rendering pauses off-screen and in background tabs; reduced motion
 * gets one still frame of the engaged engine; no WebGL falls back to the 2D
 * flywheel.
 */

interface RingSpec {
  label: string;
  radius: number;
  tube: number;
  /** Rotation axis, in the ring's plane (XY), so it is a diameter. */
  axis: THREE.Vector3;
  /** Cruise speed in rad/s. Signs differ so the rings counter-rotate. */
  cruise: number;
  /** Still pose used for reduced motion. */
  restAngle: number;
  /** Which hub carries the label (+1 or -1 along the axis). */
  labelHub: 1 | -1;
  /** Screen-space nudge for the label, in px, away from the hub. */
  labelOffset: [number, number];
  material: () => THREE.Material;
}

const CYAN = new THREE.Color("#4fd1c5");
const AMBER = new THREE.Color("#ff9a4d");

const RINGS: RingSpec[] = [
  {
    label: "Brand",
    radius: 1.6,
    tube: 0.085,
    axis: new THREE.Vector3(0, 1, 0),
    cruise: 0.55,
    restAngle: 0.95,
    labelHub: 1,
    labelOffset: [0, -30],
    // Brushed dark titanium.
    material: () =>
      new THREE.MeshPhysicalMaterial({ color: 0x7c8693, metalness: 1, roughness: 0.34, clearcoat: 0.35 }),
  },
  {
    label: "Platforms",
    radius: 1.22,
    tube: 0.075,
    axis: new THREE.Vector3(1, 0, 0),
    cruise: -0.8,
    restAngle: 0.7,
    labelHub: 1,
    labelOffset: [34, 0],
    // Smoked black glass: near-black base, mirror-hard clearcoat.
    material: () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x0c161d,
        metalness: 0.2,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        emissive: CYAN,
        emissiveIntensity: 0.05,
      }),
  },
  {
    label: "People",
    radius: 0.88,
    tube: 0.07,
    axis: new THREE.Vector3(1, 1, 0).normalize(),
    cruise: 1.1,
    restAngle: -0.8,
    labelHub: -1,
    labelOffset: [-30, 18],
    // Polished graphite ceramic.
    material: () =>
      new THREE.MeshPhysicalMaterial({ color: 0x262a32, metalness: 0.65, roughness: 0.18, clearcoat: 1 }),
  },
];

// Timeline in seconds.
const IGNITE_END = 1.0;
const FIRST_ENGAGE = 1.0;
const ENGAGE_GAP = 0.6;
const RAMP = 0.42; // how quickly speeds approach cruise (per second)

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

function pageBackground(): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
  const [h, s, l] = raw.split(/\s+/);
  return h && s && l ? new THREE.Color(`hsl(${h}, ${s}, ${l})`) : new THREE.Color("#0f1218");
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const MomentumEngine3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [supported] = useState(webglAvailable);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !supported) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;

    // Renderer and post-processing.
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = pageBackground();

    // Reflections come from a soft studio environment, kept dim so shadows
    // stay deep and only edges and highlights pick up light.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.2;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.35, 7.4);
    camera.lookAt(0, 0, 0);

    // Lights: a white key for specular, a hard cyan rim from behind, and the
    // core itself as the main light. No ambient, so blacks stay black.
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(-3.5, 4, 5);
    const rim = new THREE.DirectionalLight(CYAN, 1.8);
    rim.position.set(3.5, 1.2, -4);
    const coreLight = new THREE.PointLight(CYAN, 0, 4.5, 2);
    const amberLight = new THREE.PointLight(AMBER, 0, 3, 2);
    scene.add(key, rim, coreLight);

    const engine = new THREE.Group();
    engine.rotation.x = -0.12;
    scene.add(engine);

    const disposables: { dispose: () => void }[] = [envTexture, pmrem];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    // Core: dense cyan light with a faint shell around it.
    const coreMat = track(new THREE.MeshStandardMaterial({ color: 0x000000, emissive: CYAN, emissiveIntensity: 0 }));
    const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.32, 64, 64)), coreMat);
    const shellMat = track(
      new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const shell = new THREE.Mesh(track(new THREE.SphereGeometry(0.46, 48, 48)), shellMat);
    engine.add(core, shell);

    // Rings.
    const hubGeo = track(new THREE.CylinderGeometry(0.075, 0.075, 0.2, 32));
    const hubMat = track(new THREE.MeshPhysicalMaterial({ color: 0xb8c0cc, metalness: 1, roughness: 0.22 }));
    const hubGlowGeo = track(new THREE.TorusGeometry(0.095, 0.01, 12, 48));

    const rings = RINGS.map((spec) => {
      const pivot = new THREE.Group();
      engine.add(pivot);

      const ringMat = track(spec.material());
      const ring = new THREE.Mesh(track(new THREE.TorusGeometry(spec.radius, spec.tube, 32, 220)), ringMat);
      pivot.add(ring);

      // Seams: two hairlines of light set into the front and back faces.
      const seamMat = track(
        new THREE.MeshBasicMaterial({ color: CYAN.clone().multiplyScalar(1.5), transparent: true, opacity: 0, toneMapped: false })
      );
      const seamGeo = track(new THREE.TorusGeometry(spec.radius, 0.006, 8, 220));
      for (const z of [spec.tube * 0.92, -spec.tube * 0.92]) {
        const seam = new THREE.Mesh(seamGeo, seamMat);
        seam.position.z = z;
        pivot.add(seam);
      }

      // Energy streak racing along the ring.
      const streakMat = track(
        new THREE.MeshBasicMaterial({ color: CYAN.clone().multiplyScalar(2.2), transparent: true, opacity: 0, toneMapped: false })
      );
      const streak = new THREE.Mesh(track(new THREE.TorusGeometry(spec.radius, spec.tube * 0.6, 10, 48, 0.55)), streakMat);
      pivot.add(streak);

      // Bearing hubs where the axis meets the ring. They sit on the axis, so
      // they stay put while the ring turns.
      const hubs = [1, -1].map((side) => {
        const hub = new THREE.Group();
        hub.position.copy(spec.axis).multiplyScalar(spec.radius * side);
        hub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spec.axis);
        hub.add(new THREE.Mesh(hubGeo, hubMat));
        const glow = new THREE.Mesh(hubGlowGeo, seamMat);
        glow.rotation.x = Math.PI / 2;
        glow.position.y = side * 0.1;
        hub.add(glow);
        engine.add(hub);
        return hub;
      });

      return { spec, pivot, streak, seamMat, streakMat, hubs, angle: spec.restAngle, speed: 0, streakAngle: 0, streakSpeed: 0 };
    });

    // One warm accent on the outer ring.
    const spark = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.045, 24, 24)),
      track(new THREE.MeshBasicMaterial({ color: AMBER.clone().multiplyScalar(3), toneMapped: false }))
    );
    spark.position.set(Math.cos(0.6) * 1.6, Math.sin(0.6) * 1.6, 0.06);
    spark.add(amberLight);
    rings[0].pivot.add(spark);

    // Dust: depth cues drifting through the light.
    const dustCount = small ? 160 : 320;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 1.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dustPositions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.7, r * Math.sin(phi) * Math.sin(theta)], i * 3);
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = track(
      new THREE.PointsMaterial({ color: 0xbfeeea, size: 0.014, transparent: true, opacity: 0.35, depthWrite: false })
    );
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // Tight, selective bloom: only the core, seams and streaks are bright
    // enough to glow, so metal and glass keep their hard edges.
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.32, 0.62);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    track(composer);

    // Sizing.
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (reduce) frame(0, 0);
    };

    // Labels follow their hub on screen.
    const projected = new THREE.Vector3();
    const placeLabels = (engaged: number[]) => {
      const { width, height } = container.getBoundingClientRect();
      rings.forEach((r, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const hub = r.hubs[r.spec.labelHub === 1 ? 0 : 1];
        hub.getWorldPosition(projected).project(camera);
        const x = (projected.x * 0.5 + 0.5) * width + r.spec.labelOffset[0];
        const y = (-projected.y * 0.5 + 0.5) * height + r.spec.labelOffset[1];
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        el.style.opacity = String(engaged[i]);
      });
    };

    // Pointer: the engine leans toward the cursor, softly.
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = container.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
    };
    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // One frame of the scene at time t (seconds since start).
    function frame(t: number, dt: number) {
      const ignite = reduce ? 1 : easeOut(t / IGNITE_END);
      coreMat.emissiveIntensity = 1.7 * ignite + (reduce ? 0 : Math.sin(t * 1.6) * 0.25 * ignite);
      shellMat.opacity = 0.035 * ignite;
      coreLight.intensity = 3.2 * ignite;
      amberLight.intensity = 0.8 * ignite;

      const engaged = rings.map((r, i) => {
        const e = reduce ? 1 : easeOut((t - (FIRST_ENGAGE + ENGAGE_GAP * i)) / 0.5);
        r.seamMat.opacity = 0.9 * e;
        r.streakMat.opacity = e;

        if (reduce) {
          r.streakAngle = 1.2 + i;
        } else if (e > 0) {
          const k = 1 - Math.exp(-RAMP * dt);
          r.speed += (r.spec.cruise - r.speed) * k;
          r.streakSpeed += (Math.sign(r.spec.cruise) * 2.4 - r.streakSpeed) * k;
          r.angle += r.speed * dt;
          r.streakAngle += r.streakSpeed * dt;
        }
        r.pivot.quaternion.setFromAxisAngle(r.spec.axis, r.angle);
        r.streak.rotation.z = r.streakAngle;
        return e;
      });

      pointer.sx += (pointer.x - pointer.sx) * 0.06;
      pointer.sy += (pointer.y - pointer.sy) * 0.06;
      engine.rotation.y = (reduce ? 0.35 : Math.sin(t * 0.12) * 0.3 + 0.2) + pointer.sx * 0.5;
      engine.rotation.x = -0.12 + pointer.sy * 0.3;
      dust.rotation.y = t * 0.015;

      composer.render(dt);
      placeLabels(engaged);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Loop, paused when off-screen or in a background tab.
    let raf = 0;
    let visible = true;
    // The intro runs on wall-clock time so it finishes on schedule even on a
    // slow device; only the per-frame physics step is capped.
    let startedAt = 0;
    let pausedFor = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      frame((now - startedAt - pausedFor) / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    let stoppedAt = 0;
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      const now = performance.now();
      if (!startedAt) startedAt = now;
      else if (stoppedAt) pausedFor += now - stoppedAt;
      last = now;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      stoppedAt = performance.now();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) frame(0, 0);
    else start();

    return () => {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      disposables.forEach((d) => d.dispose());
      bloom.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [supported]);

  if (!supported) return <MomentumFlywheel />;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Brand, Platforms and People as three rings of one engine, turning around a core of AI and gathering speed"
      className="momentum-engine relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[520px] lg:max-w-none"
    >
      {RINGS.map((ring, i) => (
        <div
          key={ring.label}
          ref={(el) => (labelRefs.current[i] = el)}
          aria-hidden="true"
          className="flywheel-slab pointer-events-none absolute left-0 top-0 flex items-center gap-2 px-3 py-2 opacity-0 sm:gap-2.5 sm:px-4 sm:py-2.5"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="whitespace-nowrap font-heading text-xs font-medium tracking-tight text-foreground sm:text-sm">
            {ring.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MomentumEngine3D;
