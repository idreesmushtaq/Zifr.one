import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function ZeroToOneMorphing() {
  const groupRef = useRef<any>(null);
  const zeroRef = useRef<any>(null);
  const oneRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    
    if (zeroRef.current && oneRef.current) {
      const progress = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      zeroRef.current.material.opacity = 1 - progress;
      oneRef.current.material.opacity = progress;
      
      zeroRef.current.scale.setScalar(1 + progress * 0.5);
      oneRef.current.scale.setScalar(0.5 + progress * 0.5);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* Zero */}
      <mesh ref={zeroRef} position={[-8, 0, 0]}>
        <torusGeometry args={[3, 1, 16, 100]} />
        <meshStandardMaterial 
          color="#00a9c0" 
          transparent 
          opacity={1}
          wireframe
        />
      </mesh>
      
      {/* One */}
      <mesh ref={oneRef} position={[8, 0, 0]}>
        <boxGeometry args={[1, 6, 1]} />
        <meshStandardMaterial 
          color="#6fce44" 
          transparent 
          opacity={0}
          wireframe
        />
      </mesh>
    </group>
  );
}

function InnovationParticles() {
  const ref = useRef<any>(null);
  
  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    
    for (let i = 0; i < 1500; i++) {
      // Create flowing pattern representing transformation
      const t = (i / 1500) * Math.PI * 2;
      const radius = 30 + Math.sin(t * 3) * 10;
      
      positions[i * 3] = Math.cos(t) * radius + (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.sin(t * 2) * 20 + (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = Math.sin(t) * radius + (Math.random() - 0.5) * 15;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00a9c0"
        size={2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function VisionSpheres() {
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any, index: number) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 3;
        child.rotation.x = state.clock.elapsedTime * (0.1 + index * 0.05);
        child.rotation.z = state.clock.elapsedTime * (0.05 + index * 0.02);
      });
    }
  });

  const spherePositions = [
    [15, 10, -5],
    [-15, -8, -8],
    [20, -12, -10],
    [-18, 15, -12]
  ];

  return (
    <group ref={groupRef}>
      {spherePositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? '#6fce44' : '#00a9c0'} 
            transparent 
            opacity={0.4}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[20, 20, 20]} intensity={0.6} color="#6fce44" />
      <pointLight position={[-20, -20, -20]} intensity={0.4} color="#00a9c0" />
      <spotLight position={[0, 30, 10]} intensity={0.8} angle={0.2} penumbra={1} />
      
      <InnovationParticles />
      <ZeroToOneMorphing />
      <VisionSpheres />
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
    console.error('Three.js About Background Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function AboutThreeBackground() {
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
          camera={{ position: [0, 0, 40], fov: 60 }}
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