import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import ThreeFallback from './ThreeFallback';
import { useThree } from './ThreeProvider';

function AnimatedParticles() {
  const ref = useRef<any>(null);
  
  // Generate particle positions
  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(3000 * 3); // Reduced for performance
    
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00a9c0"
        size={1.2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function FloatingGeometry({ 
  position, 
  geometry = 'box',
  color = '#6fce44'
}: { 
  position: [number, number, number];
  geometry?: 'box' | 'torus';
  color?: string;
}) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (geometry === 'box') {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      } else {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
        meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
        meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.3) * 1.5;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'box' ? (
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      ) : (
        <torusGeometry args={[0.8, 0.25, 12, 48]} />
      )}
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.25}
        wireframe
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={0.6} />
      <pointLight position={[-8, -8, -8]} intensity={0.2} color="#6fce44" />
      
      <Suspense fallback={null}>
        <AnimatedParticles />
        
        {/* Reduced number of geometries for better performance */}
        <FloatingGeometry position={[10, 3, -8]} geometry="box" color="#6fce44" />
        <FloatingGeometry position={[-8, -5, -10]} geometry="box" color="#00a9c0" />
        
        <FloatingGeometry position={[-10, 6, -12]} geometry="torus" color="#00a9c0" />
        <FloatingGeometry position={[12, -3, -15]} geometry="torus" color="#6fce44" />
      </Suspense>
    </>
  );
}

export default function ThreeBackground() {
  const { isThreeLoaded, threeError } = useThree();
  const [mounted, setMounted] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Show fallback if not mounted, Three.js failed to load, or there's an error
  if (!mounted || threeError || hasError || !isThreeLoaded) {
    return <ThreeFallback />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 25], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Optimize for performance
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#FAFAFA', 0);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
        onError={() => setHasError(true)}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}