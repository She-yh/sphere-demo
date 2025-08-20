import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function AudioVisualizer({ audioData }) {
  const meshRef = useRef();
  const particlesRef = useRef([]);

  // 初始化粒子系统
  useEffect(() => {
    const count = 200;
    const temp = [];
    for (let i = 0; i < count; i++) {
      const particle = new THREE.Object3D();
      particle.position.set(
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
        Math.random() * 800 - 400
      );
      particlesRef.current.push(particle);
      meshRef.current.add(particle);
    }
  }, []);

  // 音频数据驱动动画
  useFrame(() => {
    if (!audioData) return;

    particlesRef.current.forEach((particle, i) => {
      const intensity = audioData[i % audioData.length] / 255;
      particle.scale.set(intensity, intensity, intensity);
      particle.rotation.y += 0.01 * intensity;
    });
  });

  return (
    <group ref={meshRef}>
      {[...Array(200)].map((_, i) => (
        <mesh key={i}>
          <dodecahedronGeometry args={[10, 0]} />
          <meshStandardMaterial color="#0ff" emissive="#00f" />
        </mesh>
      ))}
    </group>
  );
}
