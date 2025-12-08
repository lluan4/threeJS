import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
  scale: 1,
  positions: 2,
  objectsDistance: 4,
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

gui
  .add(parameters, "scale")
  .min(0.1)
  .max(3)
  .step(0.1)
  .onChange(() => {
    mesh1.scale.set(parameters.scale, parameters.scale, parameters.scale);
    mesh2.scale.set(parameters.scale, parameters.scale, parameters.scale);
    mesh3.scale.set(parameters.scale, parameters.scale, parameters.scale);
  });

gui
  .add(parameters, "positions")
  .min(0.1)
  .max(5)
  .step(0.1)
  .onChange(() => {
    mesh1.position.x = parameters.positions;
    mesh2.position.x = -1 * parameters.positions;
    mesh3.position.x = parameters.positions;
  });

gui
  .add(parameters, "objectsDistance")
  .min(1)
  .max(10)
  .step(0.1)
  .onChange(() => {
    mesh1.position.y = parameters.objectsDistance * 0;
    mesh2.position.y = -parameters.objectsDistance * 1;
    mesh3.position.y = parameters.objectsDistance * 2;
  });

window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    const objectsDistance = parameters.objectsDistance + 2;
    const scale = Math.round(window.innerWidth / 1066);

    mesh1.position.x = 0;
    mesh2.position.x = 0;
    mesh3.position.x = 0;

    mesh1.scale.set(scale, scale, scale);
    mesh2.scale.set(0.3, 0.3, 0.3);
    mesh3.scale.set(0.3, 0.3, 0.3);
  } else {
    mesh1.position.x = parameters.positions;
    mesh2.position.x = -1 * parameters.positions;
    mesh3.position.x = parameters.positions;

    mesh1.scale.set(parameters.scale, parameters.scale, parameters.scale);
    mesh2.scale.set(parameters.scale, parameters.scale, parameters.scale);
    mesh3.scale.set(parameters.scale, parameters.scale, parameters.scale);
  }
});
/**
 * Texture
 */

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

//Meshes
const objectsDistance = parameters.objectsDistance;
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = parameters.positions;
mesh2.position.x = -1 * parameters.positions;
mesh3.position.x = parameters.positions;

mesh1.scale.set(parameters.scale, parameters.scale, parameters.scale);
mesh2.scale.set(parameters.scale, parameters.scale, parameters.scale);
mesh3.scale.set(parameters.scale, parameters.scale, parameters.scale);

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];
/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();

scene.add(cameraGroup);

// Scroll
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // Render
  renderer.render(scene, camera);

  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = cursor.y * 0.5;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 2 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 2 * deltaTime;

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
