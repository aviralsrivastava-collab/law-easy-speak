import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Cinematic legal-tech 3D backdrop.
 * - Floating abstract shards (justice/document inspired geometry)
 * - Volumetric particles + sparkles
 * - Mouse parallax + slow auto camera drift
 * - Dark obsidian palette with cyan / teal / gold accents
 */

function Shard({
  position,
  scale = 1,
  color,
  geometry,
  speed = 0.4,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  geometry: "ico" | "oct" | "torus" | "plate";
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.3;
    ref.current.rotation.y = t * speed * 0.5;
  });

  const geom = useMemo(() => {
    switch (geometry) {
      case "ico":
        return <icosahedronGeometry args={[1, 0]} />;
      case "oct":
        return <octahedronGeometry args={[1, 0]} />;
      case "torus":
        return <torusGeometry args={[0.9, 0.06, 16, 64]} />;
      case "plate":
      default:
        return <boxGeometry args={[1.4, 0.04, 1]} />;
    }
  }, [geometry]);

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        {geom}
        <meshStandardMaterial
          color={color}
          metalness={0.85}
          roughness={0.22}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    // Soft mouse parallax + breathing motion
    const targetX = pointer.x * 0.8;
    const targetY = pointer.y * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  // Accent palette aligned with our cinematic tokens
  const cyan = "#22d3ee";
  const teal = "#14b8a6";
  const gold = "#d4af37";
  const steel = "#5b6b80";

  return (
    <>
      <color attach="background" args={["#070a12"]} />
      <fog attach="fog" args={["#070a12", 8, 22]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} color={cyan} />
      <pointLight position={[-6, -2, 4]} intensity={1.4} color={gold} />
      <pointLight position={[0, 4, -4]} intensity={0.8} color={teal} />

      {/* Foreground hero geometry */}
      <Shard position={[-2.4, 0.8, 0]} scale={0.9} color={cyan} geometry="ico" speed={0.35} />
      <Shard position={[2.6, -0.6, -1]} scale={1.05} color={teal} geometry="oct" speed={0.3} />
      <Shard position={[0, 1.5, -2.4]} scale={1.6} color={gold} geometry="torus" speed={0.18} />
      <Shard position={[1.4, 1.6, -3.5]} scale={0.7} color={steel} geometry="plate" speed={0.5} />
      <Shard position={[-2.2, -1.4, -2.5]} scale={0.55} color={cyan} geometry="oct" speed={0.45} />
      <Shard position={[3.4, 1.2, -5]} scale={0.5} color={gold} geometry="ico" speed={0.4} />
      <Shard position={[-3.6, -1.1, -5.2]} scale={0.6} color={teal} geometry="ico" speed={0.42} />

      <Sparkles count={70} scale={[10, 6, 6]} size={2.4} speed={0.35} color={cyan} opacity={0.7} />
      <Sparkles count={40} scale={[12, 8, 8]} size={1.4} speed={0.2} color={gold} opacity={0.5} />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <Rig />
    </>
  );
}

export default function CinematicScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Scene />
    </Canvas>
  );
}