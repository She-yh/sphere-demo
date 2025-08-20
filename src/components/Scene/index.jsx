import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import fragmentShader from "../../shaders/fragmentShader.glsl";
import vertexShader from "../../shaders/vertexShader.glsl";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import Beats from "../../assets/Beats.mp3";
export default function Scene() {
  const { scene, camera, gl: renderer } = useThree();
  const params = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    threshold: 0.1,
    strength: 0.2,
    radius: 0.8,
  };

  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight)
  );
  bloomPass.threshold = params.threshold;
  bloomPass.strength = params.strength;
  bloomPass.radius = params.radius;

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const outputPass = new OutputPass();
  bloomComposer.addPass(outputPass);

  const uniforms = {
    u_time: { type: "f", value: 0.0 },
    u_frequency: { type: "f", value: 0.0 },
    u_red: { type: "f", value: 1.0 },
    u_green: { type: "f", value: 1.0 },
    u_blue: { type: "f", value: 1.0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    fragmentShader: fragmentShader,
    vertexShader,
  });
  mat.wireframe = true;

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(Beats, function (buffer) {
    sound.setBuffer(buffer);
    window.addEventListener("click", function () {
      sound.play();
    });
  });

  const analyser = new THREE.AudioAnalyser(sound, 32);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener("mousemove", function (e) {
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) / 100;
    mouseY = (e.clientY - windowHalfY) / 100;
  });

  const clock = new THREE.Clock();
  function animate() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.5;
    camera.lookAt(scene.position);
    uniforms.u_time.value = clock.getElapsedTime();
    uniforms.u_frequency.value = analyser.getAverageFrequency();
    bloomComposer.render();
    requestAnimationFrame(animate);
  }
  animate();
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[4, 30]} />
        <primitive object={mat} />
        <meshStandardMaterial color="#0ff" emissive="#00f" />
      </mesh>
    </group>
  );
}
