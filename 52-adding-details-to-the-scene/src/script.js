import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import firefliesVertexShaders from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShaders from "./shaders/fireflies/fragment.glsl";

import portalVertexShaders from "./shaders/portal/vertex.glsl";
import portalFragmentShaders from "./shaders/portal/fragment.glsl";

/**
 * Base
 */
// Debug
const debugObject = {};
const gui = new GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

debugObject.portalColorStart = "#6F188C";
debugObject.portalColorEnd = "#340b41";

gui.addColor(debugObject, "portalColorStart").onChange((value) => {
  portalLightMaterial.uniforms.uColorStart.value.set(value);
});

gui.addColor(debugObject, "portalColorEnd").onChange((value) => {
  portalLightMaterial.uniforms.uColorEnd.value.set(value);
});

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShaders,
  fragmentShader: portalFragmentShaders,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: new THREE.Uniform(0),

    uColorStart: new THREE.Uniform(
      new THREE.Color(debugObject.portalColorStart)
    ),
    uColorEnd: new THREE.Uniform(new THREE.Color(debugObject.portalColorEnd)),
  },
});

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

/**
 * Model
 */
gltfLoader.load("portal.glb", (gltf) => {
  const model = gltf.scene;

  const bakedMesh = gltf.scene.children.find((child) => child.name === "baked");

  const portalLightMesh = gltf.scene.children.find(
    (child) => child.name === "Circle"
  );

  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === "Cube011"
  );
  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === "Cube015"
  );
  bakedMesh.material = bakedMaterial;
  portalLightMesh.material = portalLightMaterial;
  poleLightAMesh.material = poleLightMaterial;
  poleLightBMesh.material = poleLightMaterial;

  scene.add(model);
});

/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 3.9;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 3.9;
  scaleArray[i] = Math.random() * (1.0 - 0.8) + 0.8;
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  vertexShader: firefliesVertexShaders,
  fragmentShader: firefliesFragmentShaders,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uTime: new THREE.Uniform(0),

    uPixelRatio: new THREE.Uniform(Math.min(window.devicePixelRatio, 2)),
    uSize: new THREE.Uniform(100.0),
  },
});

gui
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("fireflies size");

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);

scene.add(fireflies);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = "#201919";
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update fireflies
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
