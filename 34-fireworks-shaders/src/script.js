import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import fireworkVertexShader from "./shaders/firework/vertex.glsl";
import fireworkFragmentShader from "./shaders/firework/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
textureLoader.setPath("/particles/");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
// Multiply resolution by pixel ratio for shaders for better quality on high dpi screens
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height).multiplyScalar(
  sizes.pixelRatio
);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(sizes.width, sizes.height);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.5, 0, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Fireworks
 */

const texture = [
  textureLoader.load("1.png"),
  textureLoader.load("2.png"),
  textureLoader.load("3.png"),
  textureLoader.load("4.png"),
  textureLoader.load("5.png"),
  textureLoader.load("6.png"),
  textureLoader.load("7.png"),
  textureLoader.load("8.png"),
];

const createFirework = (count, position, size, texture) => {
  //Geometry
  const positionArray = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    const i3 = i * 3;

    positionArray[i3 + 0] = Math.random() - 0.5;
    positionArray[i3 + 1] = Math.random() - 0.5;
    positionArray[i3 + 2] = Math.random() - 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionArray, 3)
  );

  //Material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uPixelRatio: new THREE.Uniform(sizes.pixelRatio),
      uTexture: new THREE.Uniform(texture),
    },
  });

  // Points
  const fireworks = new THREE.Points(geometry, material);
  fireworks.position.copy(position);
  scene.add(fireworks);
};

createFirework(1000, new THREE.Vector3(), 0.5, texture[7]);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
