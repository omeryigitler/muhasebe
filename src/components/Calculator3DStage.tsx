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
      <ambientLight intensity={0.28} />
      <directionalLight position={[2.8, 4.2, 5]} intensity={1.55} color="#ffffff" />
      <pointLight position={[-3.7, 0.8, 3]} intensity={11} distance={9} color="#5265FF" />
      <pointLight position={[3.6, 1.1, 3]} intensity={9} distance={8} color="#FF6654" />
      <pointLight position={[0, -3.5, 2]} intensity={5.5} distance={7} color="#9A6AFF" />
      <pointLight position={[1.3, -2.5, 2]} intensity={2.2} distance={5} color="#D9FF43" />

      <group rotation={[-0.055, -0.045, 0.012]} position={[0, -0.12, 0]}>
        <RoundedBox args={[4.35, 6.15, 0.68]} radius={0.3} smoothness={8}>
          <meshPhysicalMaterial
            color="#111318"
            roughness={0.28}
            metalness={0.07}
            clearcoat={0.82}
            clearcoatRoughness={0.22}
          />
        </RoundedBox>

        <RoundedBox args={[4.08, 5.9, 0.14]} radius={0.26} smoothness={7} position={[0, 0.04, 0.41]}>
          <meshPhysicalMaterial
            color="#1D2026"
            roughness={0.44}
            metalness={0.02}
            clearcoat={0.24}
          />
        </RoundedBox>

        <RoundedBox args={[2.9, 0.11, 0.12]} radius={0.04} smoothness={5} position={[0, 3.0, 0.53]}>
          <meshStandardMaterial color="#08090b" roughness={0.75} />
        </RoundedBox>

        <RoundedBox args={[0.95, 0.09, 0.11]} radius={0.045} smoothness={5} position={[0, -3.18, 0.5]}>
          <meshStandardMaterial color="#9A6AFF" emissive="#9A6AFF" emissiveIntensity={3.4} />
        </RoundedBox>

        <mesh position={[-1.62, 2.86, 0.55]}>
          <sphereGeometry args={[0.065, 24, 24]} />
          <meshStandardMaterial color="#FF6654" emissive="#FF6654" emissiveIntensity={2.7} />
        </mesh>
        <mesh position={[-1.4, 2.86, 0.55]}>
          <sphereGeometry args={[0.065, 24, 24]} />
          <meshStandardMaterial color="#D9FF43" emissive="#D9FF43" emissiveIntensity={2.7} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, -3.62, -0.42]}
        opacity={0.46}
        scale={7.6}
        blur={2.5}
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
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[430px] mx-auto py-3 sm:py-4">
        <div className="absolute inset-[-5%] sm:inset-[-7%] pointer-events-none opacity-100" aria-hidden="true">
          <Canvas
            dpr={[1, 1.35]}
            camera={{ position: [0, 0.28, 8.9], fov: 32 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            frameloop="demand"
          >
            <PhysicalShell />
          </Canvas>
        </div>

        <div className="absolute inset-[-8%] pointer-events-none rounded-[42%] blur-3xl bg-[radial-gradient(circle_at_18%_58%,rgba(82,101,255,.24),transparent_40%),radial-gradient(circle_at_82%_28%,rgba(255,102,84,.20),transparent_36%),radial-gradient(circle_at_50%_88%,rgba(154,106,255,.20),transparent_32%)]" />

        <div
          className="relative z-10 origin-center transition-transform duration-500 ease-out"
          style={{ transform: 'perspective(1500px) rotateX(2.2deg) rotateY(-2.8deg) rotateZ(0.35deg)' }}
        >
          <Calculator
            ref={calculatorRef}
            isInteractive={isInteractive}
            onInteract={onInteract}
            visualVariant="hardware"
          />
        </div>
      </div>
    );
  }
);

Calculator3DStage.displayName = 'Calculator3DStage';
