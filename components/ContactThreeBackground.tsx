import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function CommunicationNetwork() {
  const networkRef = useRef<any>(null);
  const nodesRef = useRef<any[]>([]);
  
  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    
    // Animate network nodes
    nodesRef.current.forEach((node, index) => {
      if (node) {
        node.position.y += Math.sin(state.clock.elapsedTime + index) * 0.02;
        node.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
      }
    });
  });

  const nodePositions = [
    [0, 0, 0],     // Center hub
    [8, 4, -5],    // Node 1
    [-8, 4, -5],   // Node 2
    [5, -6, 3],    // Node 3
    [-5, -6, 3],   // Node 4
    [0, 8, -8],    // Node 5
    [12, 0, -10],  // Node 6
    [-12, 0, -10], // Node 7
  ];

  return (
    <group ref={networkRef}>
      {nodePositions.map((position, index) => (
        <group key={index}>
          {/* Network Node */}
          <mesh 
            ref={(el) => {
              if (el) nodesRef.current[index] = el;
            }}
            position={position}
          >
            <sphereGeometry args={[index === 0 ? 1.5 : 0.8, 16, 16]} />
            <meshStandardMaterial 
              color={index === 0 ? '#6fce44' : '#00a9c0'} 
              transparent 
              opacity={index === 0 ? 0.8 : 0.6}
              emissive={index === 0 ? '#6fce44' : '#00a9c0'}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Connection lines to center */}
          {index > 0 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, ...position])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00a9c0" transparent opacity={0.3} />
            </line>
          )}
        </group>
      ))}
    </group>
  );
}

function MessageParticles() {
  const ref = useRef<any>(null);
  
  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      // Create flowing message paths
      const angle = (i / 1000) * Math.PI * 6;
      const radius = 15 + Math.sin(angle) * 8;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      // Simulate flowing messages
      const positions = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6fce44"
        size={1.8}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingContactElements() {
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any, index: number) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.8 + index * 2) * 0.02;
        child.rotation.x = state.clock.elapsedTime * 0.3 + index;
        child.rotation.z = state.clock.elapsedTime * 0.2 + index * 0.5;
      });
    }
  });

  const elementPositions = [
    [18, 8, -12],   // Email symbol
    [-18, -6, -15], // Phone symbol  
    [15, -10, -8],  // Chat symbol
    [-20, 12, -10], // Location symbol
  ];

  return (
    <group ref={groupRef}>
      {elementPositions.map((position, index) => (
        <mesh key={index} position={position}>
          {index % 2 === 0 ? (
            <boxGeometry args={[1.2, 0.8, 0.3]} />
          ) : (
            <cylinderGeometry args={[0.4, 0.4, 1.5, 8]} />
          )}
          <meshStandardMaterial 
            color="#00a9c0" 
            transparent 
            opacity={0.5}
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
      <pointLight position={[15, 15, 15]} intensity={0.7} color="#6fce44" />
      <pointLight position={[-15, -15, -15]} intensity={0.5} color="#00a9c0" />
      <spotLight position={[0, 25, 10]} intensity={0.6} angle={0.3} penumbra={1} />
      
      <MessageParticles />
      <CommunicationNetwork />
      <FloatingContactElements />
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
    console.error('Three.js Contact Background Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function ContactThreeBackground() {
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
          camera={{ position: [0, 0, 35], fov: 65 }}
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