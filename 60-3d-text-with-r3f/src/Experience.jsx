import {
  OrbitControls,
  Text3D,
  Center,
  useMatcapTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

export default function Experience() {
  //   const [torusGeometry, setTorusGeometry] = useState();
  //   const [material, setMaterial] = useState();
  //   const donutGroup = useRef();
  const donuts = useRef([]);

  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);

  useFrame((state, delta) => {
    // Animate donuts
    // donutGroup.current.rotation.z += delta * 0.01;
    // for (const donut of donutGroup.current.children) {
    //   donut.rotation.x += delta * 0.2;
    //   donut.rotation.y += delta * 0.1;
    // }

    for (const donut of donuts.current) {
      donut.rotation.x += delta * 0.2;
      donut.rotation.y += delta * 0.1;
    }
  });

  matcapTexture.colorSpace = THREE.SRGBColorSpace;
  material.matcap = matcapTexture;
  material.needsUpdate = true;
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} />
      <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} /> */}

      <Center>
        <Text3D
          material={material}
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Hello R3F!
        </Text3D>
      </Center>
      {/* <group ref={donutGroup}>
        {[...Array(100)].map((_, i) => (
          <mesh
            key={i}
            geometry={torusGeometry}
            material={material}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
            scale={0.2 + Math.random() * 0.2}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          />
        ))}
      </group> */}

      {[...Array(100)].map((_, i) => (
        <mesh
          ref={(el) => (donuts.current[i] = el)}
          key={i}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
    </>
  );
}
