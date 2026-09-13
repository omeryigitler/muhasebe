import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import { Calculator, type CalculatorHandle } from './Calculator';

interface Calculator3DStageProps {
  isInteractive: boolean;
  onInteract: () => void;
}

const PhysicalShell = () => {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3.5, 4.5, 5]} intensity={1.7} color="#ffffff" />
      <pointLight position={[-4, 1.2, 3]} intensity={14} distance={9} color="#5265FF" />
      <pointLight position={[4, 1.4, 3]} intensity={11} distance={8} color="#FF6654" />
      <pointLight position={[0, -4, 2]} intensity={7} distance={7} color="#9A6AFF" />
      <pointLight position={[1.8, -2.8, 2]} intensity={3.5} distance={5} color="#D9FF43" />

      <group rotation={[-0.12, -0.08, 0.025]} position={[0, -0.16, 0]}>
        <RoundedBox args={[4.65, 6.55, 0.72]} radius={0.28} smoothness={7}>
          <meshPhysicalMaterial
            color="#15171c"
            roughness={0.3}
            metalness={0.08}
            clearcoat={0.7}
            clearcoatRoughness={0.24}
          />
        </RoundedBox>

        <RoundedBox args={[4.34, 6.2, 0.16]} radius={0.24} smoothness={6} position={[0, 0.06, 0.42]}>
          <meshPhysicalMaterial
            color="#23252b"
            roughness={0.46}
            metalness={0.02}
            clearcoat={0.26}
          />
        </RoundedBox>

        <mesh position={[1.62, 2.22, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 64]} />
          <meshStandardMaterial color="#aeb2ba" metalness={0.95} roughness={0.18} />
        </mesh>
        <mesh position={[1.62, 2.22, 0.76]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.055, 18, 64]} />
          <meshStandardMaterial color="#9A6AFF" emissive="#9A6AFF" emissiveIntensity={4.5} />
        </mesh>

        <RoundedBox args={[1.0, 0.1, 0.12]} radius={0.05} smoothness={5} position={[0, -3.42, 0.5]}>
          <meshStandardMaterial color="#9A6AFF" emissive="#9A6AFF" emissiveIntensity={4} />
        </RoundedBox>

        <mesh position={[-1.68, 2.93, 0.56]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color="#FF6654" emissive="#FF6654" emissiveIntensity={3} />
        </mesh>
        <mesh position={[-1.45, 2.93, 0.56]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color="#D9FF43" emissive="#D9FF43" emissiveIntensity={3} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, -3.8, -0.45]}
        opacity={0.52}
        scale={8}
        blur={2.4}
        far={8}
        frames={1}
      />
    </>
  );
};

export const Calculator3DStage = forwardRef<CalculatorHandle, Calculator3DStageProps>(
  ({ isInteractive, onInteract }, ref) => {
    const calculatorRef = useRef<CalculatorHandle>(null);

    useImperativeHandle(ref, () => ({
      simulatePress: (key) => calculatorRef.current?.simulatePress(key),
      setDisplay: (value) => calculatorRef.current?.setDisplay(value),
      setDemo: (preset) => calculatorRef.current?.setDemo(preset),
    }));

    return (
      <div className="relative w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] mx-auto">
        <div className="absolute inset-[-14%] sm:inset-[-17%] pointer-events-none opacity-95" aria-hidden="true">
          <Canvas
            dpr={[1, 1.4]}
            camera={{ position: [0, 0.35, 8.4], fov: 34 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            frameloop="demand"
          >
            <PhysicalShell />
          </Canvas>
        </div>

        <div className="absolute inset-[-8%] pointer-events-none rounded-[36%] blur-3xl bg-[radial-gradient(circle_at_20%_55%,rgba(82,101,255,.30),transparent_38%),radial-gradient(circle_at_78%_30%,rgba(255,102,84,.24),transparent_34%),radial-gradient(circle_at_50%_86%,rgba(154,106,255,.24),transparent_30%)]" />

        <div
          className="relative z-10 origin-center transition-transform duration-500 ease-out"
          style={{ transform: 'perspective(1400px) rotateX(4deg) rotateY(-5deg) rotateZ(0.7deg)' }}
        >
          <Calculator ref={calculatorRef} isInteractive={isInteractive} onInteract={onInteract} />
        </div>
      </div>
    );
  }
);

Calculator3DStage.displayName = 'Calculator3DStage';
