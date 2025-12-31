import * as THREE from "three";
import React from "react";

import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Text } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        material={floor1Material}
      />
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const [speed] = React.useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  const obstacleRef = React.useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const [timeOffset] = React.useState(() => Math.random() * Math.PI * 2);

  const obstacleRef = React.useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.15;
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const [timeOffset] = React.useState(() => Math.random() * Math.PI * 2);

  const obstacleRef = React.useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25;
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
        />
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF("./hamburger.glb");

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <Text
        font="./bebas-neue-v9-latin-regular.woff"
        scale={1}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        material={floor1Material}
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid" restitution={0.2} friction={0}>
        <mesh
          castShadow
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
        />
        <mesh
          receiveShadow
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
        />
        <mesh
          receiveShadow
          position={[0, 0.75, -(length * 4) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export function Level({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
  seed = 0,
}) {
  const blocks = React.useMemo(() => {
    const blocksArray = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocksArray.push(type);
    }
    return blocksArray;
  }, [count, types, seed]);
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
}
