"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// A katana model sweeping across the screen along a -50deg diagonal
// (lower-left -> upper-right). Driven purely by wall-clock time so it stays
// in sync with the CSS-intro timeline (the SVG blade it replaces was ~1.5s).
function Katana() {
  const { scene } = useGLTF("/models/katana.glb");
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Normalize: center the model and scale it to a consistent world size.
  const prepared = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    box.getSize(size);
    const max = Math.max(size.x, size.y, size.z) || 1;
    const scale = 4.2 / max;
    const center = new THREE.Vector3();
    box.getCenter(center);
    s.position.sub(center.multiplyScalar(scale));
    s.scale.setScalar(scale);
    return s;
  }, [scene]);

  useEffect(() => {
    // Strengthen blade sheen and boost texture detail for high-res look.
    prepared.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
        if (o.material) {
          o.material.metalness = Math.min(1, (o.material.metalness ?? 0.6) + 0.3);
          o.material.roughness = Math.max(0.1, (o.material.roughness ?? 0.4) - 0.1);
          if (o.material.map) {
            o.material.map.anisotropy = 16; // sharper textures at grazing angles
            o.material.map.colorSpace = THREE.SRGBColorSpace;
          }
          o.material.needsUpdate = true;
        }
      }
    });
  }, [prepared]);

  const start = useRef(0);

  useFrame((state) => {
    if (!group.current) return;
    if (start.current === 0) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current; // seconds since mount

    // The blade sweeps in sync with the CSS slash (--swe ≈ 1.5s) along the
    // -50deg diagonal, from lower-left (off-screen) to upper-right (off-screen).
    const dur = 1.5; // matches TIMING.intro.swe
    const angle = THREE.MathUtils.degToRad(-50); // lower-left -> upper-right

    // Distance to fully cross the screen along the diagonal.
    const span = Math.hypot(viewport.width, viewport.height) * 1.2;

    // Progress 0 → 1 across the sweep duration (clamped). easeOutCubic so it
    // starts snappy and glides out — a real slash motion, not a blur.
    const raw = Math.min(t / dur, 1);
    const ease = 1 - Math.pow(1 - raw, 3);

    // Fade in quickly at the very start, fade out at the very end.
    let opacity = 1;
    if (t < 0.15) opacity = t / 0.15;
    if (t > dur) opacity = Math.max(0, 1 - (t - dur) / 0.3);

    // Position along the diagonal, centered at t = dur/2.
    const dist = (ease - 0.5) * span;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    group.current.position.set(x, y, 0);

    // The katana's blade runs along its local +Y axis (seen in the model
    // bounds). Rotate Z by the path angle so the blade points along the
    // -50deg slash direction like a drawn cut.
    group.current.rotation.z = angle;
    // subtle roll toward camera for depth
    group.current.rotation.x = 0.25;

    group.current.traverse((o: any) => {
      if (o.isMesh && o.material) {
        o.material.transparent = true;
        o.material.opacity = opacity;
      }
    });
  });

  return <primitive object={prepared} ref={group} />;
}

export default function KatanaScene() {
  // If the browser can't create a WebGL context (headless, no GPU, etc.),
  // render nothing — the pathway + wordmark still play. Prevents the intro
  // from crashing where WebGL is unavailable.
  if (typeof window !== "undefined") {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGLRenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return null;
  }

  return (
    <Canvas
      // High resolution: render at up to 2x device pixels with antialiasing.
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 6 }}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      {/* Studio-style lighting so the blade catches a bright rim as it sweeps */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-4, -3, 3]} intensity={0.8} color="#ff8533" />
      <Environment preset="city" />
      <Katana />
    </Canvas>
  );
}

useGLTF.preload("/models/katana.glb");
