import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene/index";
export default function App() {
  return (
    <div className="main-container">
      <div className="title-container">
        <h1>点击开始</h1>
      </div>
      <Canvas
        camera={{
          fov: 45,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000,
          position: [0, -2, 14],
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
