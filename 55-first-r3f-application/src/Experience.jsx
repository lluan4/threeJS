import { useFrame, extend, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./CustomObject.jsx";

extend({ OrbitControls });

function Experience() {
  const cubeRef = useRef();
  const groupRef = useRef();

  const { camera, gl } = useThree();

  useFrame((state, delta) => {
    const angle = state.clock.elapsedTime;
    camera.position.x = Math.sin(angle) * 10;
    camera.position.z = Math.cos(angle) * 10;
    camera.lookAt(0, 0, 0);
    cubeRef.current.rotation.y += delta;
    //groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <>
      {/* <orbitControls args={[camera, gl.domElement]} /> */}

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <group ref={groupRef}>
        <mesh ref={cubeRef} scale={1.5} position-x={3}>
          <boxGeometry scale={1.5} />
          <meshStandardMaterial color="purple" />
        </mesh>
        <mesh position-x={-3}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </group>

      <mesh scale={10} rotation-x={-Math.PI * 0.5} position-y={-1}>
        <planeGeometry />
        <meshStandardMaterial color="green" />
      </mesh>

      <CustomObject />
    </>
  );
}

export default Experience;
