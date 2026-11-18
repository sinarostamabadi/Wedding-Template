"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/** Seeded LCG — stable across renders (React Compiler / purity). */
function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function heartPosition(
  t: number,
  scale: number,
  jitter: number,
  rand: () => number,
) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  const j = () => (rand() - 0.5) * jitter;
  return new THREE.Vector3(
    (x + j()) * scale,
    (y + j()) * scale,
    j() * scale * 8,
  );
}

function makePoints(
  count: number,
  builder: (i: number, count: number) => THREE.Vector3,
) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const p = builder(i, count);
    arr[i * 3] = p.x;
    arr[i * 3 + 1] = p.y;
    arr[i * 3 + 2] = p.z;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return geo;
}

function Starfield({ count = 900 }: { count?: number }) {
  const geometry = useMemo(() => {
    const rand = createRng(0x5eed1);
    return makePoints(count, () => {
      const r = 18 + rand() * 28;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) - 8,
      );
    });
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.045}
        color="#f7e7c8"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function HeartConstellation({ opened }: { opened: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const rand = createRng(0xc0ffee);
    return makePoints(1400, (i, count) => {
      const t = (i / count) * Math.PI * 2;
      return heartPosition(t, 0.085, 1.4, rand);
    });
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.18;
    ref.current.rotation.x = Math.cos(t * 0.2) * 0.08;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.size = opened
      ? 0.055 + Math.sin(t * 2) * 0.008
      : 0.04 + Math.sin(t) * 0.006;
    mat.opacity = opened ? 0.95 : 0.72;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        color="#f0b7c2"
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function TwinRings({ opened }: { opened: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.35;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    const s = opened ? 1.15 : 1;
    group.current.scale.setScalar(
      group.current.scale.x + (s - group.current.scale.x) * 0.06,
    );
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.55, 0.035, 24, 120]} />
        <meshStandardMaterial
          color="#d4b07a"
          metalness={0.9}
          roughness={0.22}
          emissive="#8a6a35"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.1, -0.55, 0.4]}>
        <torusGeometry args={[1.55, 0.035, 24, 120]} />
        <meshStandardMaterial
          color="#e8a0b0"
          metalness={0.85}
          roughness={0.25}
          emissive="#7a4050"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function CoreOrb({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.6;
    const pulse = 1 + Math.sin(t * 2.2) * 0.04;
    const base = opened ? 0.72 : 1;
    mesh.current.scale.setScalar(base * pulse);
  });

  return (
    <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.55}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshPhysicalMaterial
          color="#f7dce3"
          transmission={0.55}
          thickness={0.7}
          roughness={0.12}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#c9788a"
          emissiveIntensity={opened ? 0.55 : 0.85}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight
        color="#f0b7c2"
        intensity={opened ? 1.4 : 2.2}
        distance={6}
        decay={2}
      />
    </Float>
  );
}

function SceneContents({
  opened,
  onOpen,
}: {
  opened: boolean;
  onOpen: () => void;
}) {
  const camZ = useRef(6.2);

  useFrame((state) => {
    const target = opened ? 5.1 : 6.2;
    camZ.current += (target - camZ.current) * 0.04;
    state.camera.position.z = camZ.current;
    state.camera.lookAt(0, 0.1, 0);
  });

  return (
    <>
      <color attach="background" args={["#0a0610"]} />
      <fog attach="fog" args={["#0a0610", 12, 42]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={0.55} color="#fff1df" />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#d4b07a" />
      <Starfield />
      <Sparkles
        count={60}
        scale={[8, 8, 8]}
        size={2.5}
        speed={0.35}
        opacity={0.55}
        color="#f5e6d3"
      />
      <HeartConstellation opened={opened} />
      <TwinRings opened={opened} />
      <CoreOrb opened={opened} onOpen={onOpen} />
    </>
  );
}

export function TwinOrbitScene({
  opened,
  onOpen,
}: {
  opened: boolean;
  onOpen: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 6.2], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#0a0610"), 1);
      }}
    >
      <SceneContents opened={opened} onOpen={onOpen} />
    </Canvas>
  );
}
