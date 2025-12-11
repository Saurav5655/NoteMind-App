/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function Particles() {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <group ref={ref}>
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

export default function ThreeScene() {
    return (
        <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#0a0a0a]">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-10" />

            <Canvas camera={{ position: [0, 0, 1], fov: 45 }}>
                <Suspense fallback={null}>
                    <Particles />
                    {/* Subtle atmospheric fog */}
                    <fog attach="fog" args={['#0a0a0a', 5, 30]} />
                </Suspense>
            </Canvas>
        </div>
    );
}
