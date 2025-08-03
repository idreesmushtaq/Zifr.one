import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function FloatingServiceIcons() {
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Service icon positions in a circular pattern
  const iconPositions = [
    [0, 8, 0],
    [6, 4, -6],
    [-6, 4, -6],
    [8, 0, 0],
    [-8, 0, 0],
    [4, -4, 6]
  ];

  return (
    <group ref={groupRef}>
      {iconPositions.map((position, index) => (
        <FloatingIcon key={index} position={position} delay={index * 0.5} iconIndex={index} />
      ))}
    </group>
  );
}

function FloatingIcon({ position, delay, iconIndex }: { position: number[]; delay: number; iconIndex: number }) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 1.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[position[0], position[1], position[2]]}>
      <icosahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial 
        color={iconIndex % 2 === 0 ? '#00a9c0' : '#6fce44'} 
        transparent 
        opacity={0.7}
        wireframe
      />
    </mesh>
  );
}

function ConnectingLines() {
  const linesRef = useRef<any>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const linePoints = [
    [[0, 0, 0], [10, 5, -5]],
    [[0, 0, 0], [-10, 5, -5]],
    [[0, 0, 0], [5, -8, 3]],
    [[0, 0, 0], [-5, -8, 3]],
    [[0, 0, 0], [0, 10, -8]]
  ];

  return (
    <group ref={linesRef}>
      {linePoints.map((line, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0], ...line[1]])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00a9c0" transparent opacity={0.3} />
        </line>
      ))}
    </group>
  );
}

function TechParticles() {
  const ref = useRef<any>(null);
  
  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // Create a tech-inspired distribution pattern
      const angle = (i / 2000) * Math.PI * 4;
      const radius = 20 + Math.random() * 40;
      
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6fce44"
        size={1.5}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[15, 15, 15]} intensity={0.8} color="#00a9c0" />
      <pointLight position={[-15, -15, -15]} intensity={0.4} color="#6fce44" />
      <spotLight position={[0, 25, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#ffffff" />
      
      <TechParticles />
      <FloatingServiceIcons />
      <ConnectingLines />
    </>
  );
}

// Error boundary specifically for Three.js
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Services Background Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function ServicesThreeBackground() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fallback = (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
  );

  if (!mounted) {
    return fallback;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <ThreeErrorBoundary fallback={fallback}>
        <Canvas 
          camera={{ position: [0, 0, 35], fov: 60 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#FAFAFA', 0);
          }}
        >
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}