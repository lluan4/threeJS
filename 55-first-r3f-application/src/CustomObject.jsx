import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";

function CustomObject() {
  const verticesCount = 10 * 3;

  const geometryRef = useRef();

  const positions = useMemo(() => {
    const positionsArray = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 3;
    }
    return positionsArray;
  }, []);

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}

export default CustomObject;
