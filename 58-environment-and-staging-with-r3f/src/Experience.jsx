import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from "leva";

export default function Experience() {
  const cube = useRef();
  const directionalLight = useRef();

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    // const time = state.clock.getElapsedTime();
    // cube.current.position.x = 2 + Math.sin(time);
    cube.current.rotation.y += delta * 0.2;
  });

  const scene = useThree((state) => state.scene);

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  const { color, opacity, blur } = useControls("Contact Shadows", {
    color: "#1d8f75",
    opacity: {
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.01,
    },
    blur: {
      value: 2.8,
      min: 0,
      max: 10,
      step: 0.01,
    },
  });

  const { sunPosition } = useControls("Sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  useEffect(() => {
    scene.environmentIntensity = envMapIntensity;
  }, [envMapIntensity]);

  return (
    <>
      {
        <Environment
          preset="sunset"
          ground={{
            height: envMapHeight,
            radius: envMapRadius,
            scale: envMapScale,
          }}
        >
          <color args={["#000000"]} attach="background" />
          <Lightformer
            position-z={-5}
            scale={10}
            intensity={10}
            color="red"
            form="ring"
          />
          <mesh position-z={-5} scale={10}>
            <planeGeometry />
            <meshBasicMaterial color={[10, 0, 0]} />
          </mesh>
        </Environment>
      }
      {/* <BakeShadows /> */}
      {/* <SoftShadows size={25} samples={10} focus={0} /> */}
      // <color args={["ivory"]} attach="background" />
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      <ContactShadows
        position={[0, 0, 0]}
        resolution={512}
        far={5}
        scale={10}
        blur={blur}
        opacity={opacity}
        color={color}
        frames={1}
      />
      {/* <Sky sunPosition={sunPosition} /> */}
      {/* <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-camera-right={5}
      />
      <ambientLight intensity={1.5} /> */}
      {/* <mesh position-x={-2} position-y={1} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh ref={cube} position-x={2} position-y={1} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}
      {/* <mesh
        position-y={0}
        rotation-x={-Math.PI * 0.5}
        scale={10}
        // receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
    </>
  );
}
