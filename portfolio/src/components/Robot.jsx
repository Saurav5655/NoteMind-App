import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function Robot(props) {
  const group = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Floating animation
    group.current.position.y = Math.sin(t * 1) * 0.2;
    
    // Gentle rotation
    group.current.rotation.y = Math.sin(t * 0.5) * 0.1;

    // Follow mouse (subtle)
    const mouseX = (state.mouse.x * Math.PI) / 10;
    const mouseY = (state.mouse.y * Math.PI) / 10;
    
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouseY, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX, 0.1);
  });

  const material = new THREE.MeshStandardMaterial({
    color: "#2a2a2a",
    roughness: 0.2,
    metalness: 0.8,
  });

  const glowMaterial = new THREE.MeshStandardMaterial({
    color: "#00ffcc",
    emissive: "#00ffcc",
    emissiveIntensity: 2,
    toneMapped: false
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Head */}
      <Sphere ref={headRef} args={[0.6, 32, 32]} position={[0, 1.2, 0]}>
        <meshStandardMaterial {...material} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.12, 32, 32]} position={[0.25, 1.3, 0.45]}>
        <primitive object={glowMaterial} />
      </Sphere>
      <Sphere args={[0.12, 32, 32]} position={[-0.25, 1.3, 0.45]}>
         <primitive object={glowMaterial} />
      </Sphere>

      {/* Body */}
      <Cylinder ref={bodyRef} args={[0.4, 0.3, 1.2, 32]} position={[0, 0.2, 0]}>
         <meshStandardMaterial {...material} />
      </Cylinder>

      {/* Neck */}
      <Cylinder args={[0.2, 0.2, 0.2, 32]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>

      {/* Arms */}
      <Box ref={leftArmRef} args={[0.2, 0.8, 0.2]} position={[0.6, 0.2, 0]}>
         <meshStandardMaterial {...material} />
      </Box>
      <Box ref={rightArmRef} args={[0.2, 0.8, 0.2]} position={[-0.6, 0.2, 0]}>
         <meshStandardMaterial {...material} />
      </Box>

      {/* Floating Ring/Halo */}
      <Torus args={[0.8, 0.05, 16, 100]} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <primitive object={glowMaterial} />
      </Torus>
    </group>
  );
}
