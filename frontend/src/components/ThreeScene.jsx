import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { Sphere, MeshWobbleMaterial } from "@react-three/drei";
import { useRef } from "react";

export default function ThreeScene({ impactData }) {
  const asteroidRef = useRef();

  // Optional: animate asteroid towards Earth
  const asteroidPosition = impactData
    ? [10 - impactData.crater_km / 50, 0, 0] // simple approach
    : [10, 0, 0];

  return (
    <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Earth */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial color="blue" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Asteroid */}
      <mesh ref={asteroidRef} position={asteroidPosition}>
        <sphereGeometry args={[impactData ? impactData.diameter_m / 500 : 0.5, 32, 32]} />
        <meshStandardMaterial color="gray" metalness={0.5} roughness={0.7} />
      </mesh>

      {/* Optional: Impact zone marker */}
      {impactData && (
        <Html position={[0, 0, 0]} center>
          <div
            style={{
              background: "rgba(255,0,0,0.5)",
              padding: "4px 8px",
              borderRadius: "4px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Predicted Impact
          </div>
        </Html>
      )}

      <OrbitControls />
    </Canvas>
  );
}
