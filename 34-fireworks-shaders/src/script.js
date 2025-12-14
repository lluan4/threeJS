import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

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

const createFirework = (count, position, size, texture, radius, color) => {
  //Geometry
  const positionArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);

  for (let i = 0; i < count * 3; i++) {
    const i3 = i * 3;

    const spherical = new THREE.Spherical(
      radius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    const position = new THREE.Vector3().setFromSpherical(spherical);

    positionArray[i3 + 0] = position.x;
    positionArray[i3 + 1] = position.y;
    positionArray[i3 + 2] = position.z;

    sizesArray[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionArray, 3)
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizesArray, 1)
  );

  //Material
  texture.flipY = false;
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
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
  });

  // Points
  const fireworks = new THREE.Points(geometry, material);
  fireworks.position.copy(position);
  scene.add(fireworks);

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: () => {
      scene.remove(fireworks);
      geometry.dispose();
      material.dispose();
    },
  });
};

window.addEventListener("click", () => {
  createFirework(
    100,
    new THREE.Vector3(),
    0.5,
    texture[7],
    1,
    new THREE.Color("#8affff")
  );
});

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
