import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Environment } from '@react-three/drei';
import Robot from './Robot';

export default function ThreeScene() {
    return (
        <div className="h-screen w-full absolute top-0 left-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <color attach="background" args={['#050505']} />

                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    {/* Neon Lights */}
                    <pointLight position={[2, 3, 2]} intensity={2} color="#00ffcc" distance={5} />
                    <pointLight position={[-2, 1, 2]} intensity={2} color="#ff00ff" distance={5} />

                    <Robot position={[2, 0, 0]} rotation={[0, -0.4, 0]} scale={1.2} />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Sparkles count={50} scale={5} size={4} speed={0.4} opacity={0.5} color="#00ffcc" />

                    <Environment preset="city" />

                    {/* Prevent user from completely messing up the view, but allow some movement */}
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
                </Suspense>
            </Canvas>
        </div>
    );
}
