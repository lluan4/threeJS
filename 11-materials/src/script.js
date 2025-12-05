import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GUI } from 'lil-gui'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


/**
 * Debug    
*/
const gui = new GUI();


/**
 * Texture
*/

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial()

// material.map = doorColorTexture;
// material.color = new THREE.Color('red');
// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial()

// material.map = doorColorTexture;
// material.color = new THREE.Color('red');
// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100;
// material.specular = new THREE.Color('red');

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial()
// // material.metalness = 0.7;
// // material.roughness = 0.2;
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMAp = alphaTexture;
// material.transparent = true;

const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0;
material.roughness = 0;
// material.map = doorColorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMAp = alphaTexture;
// material.transparent = true;

// // Clearcoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 1;

// // Sheen
// material.sheen = 1;
// material.sheenColor = new THREE.Color('red');
// material.sheenRoughness = 1;

// // Anisotropy
// material.anisotropy = 1;

// // Iridescence
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001);
// gui.add(material, 'iridescenceIOR').min(0).max(2.33).step(1);
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

// // Transmission
// material.transmission = 1;
// material.ior = 1.5;
// material.thickness = 0.5;

// gui.add(material, 'transmission').min(0).max(1).step(0.0001);
// gui.add(material, 'ior').min(0).max(2.33).step(1);
// gui.add(material, 'thickness').min(0).max(1).step(0.0001);


gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001);
// gui.add(material, 'sheen').min(0).max(1).step(0.0001);
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001);
// gui.add(material, 'anisotropy').min(0).max(1).step(0.0001);



const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = - 2

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.x = 0

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128)
const torus = new THREE.Mesh(torusGeometry, material)
torus.position.x = 2


scene.add(sphere, plane, torus)

/**
 * Lights
*/

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

/**
 * Environment map
*/

const rgbeLoader = new RGBELoader();
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
});


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
gsap.to([sphere.rotation, torus.rotation, plane.rotation], {
    y: "+=" + Math.PI * 2,
    x: "-=" + Math.PI * 2,
    duration: 20,
    repeat: -1,
    ease: "none",
    delay: 1
});


const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()