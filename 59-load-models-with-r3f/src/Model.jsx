import { useGLTF, Clone } from "@react-three/drei";

function Model() {
  // const model = useLoader(
  //   GLTFLoader,
  //   "./hamburger.glb",
  //   (loader) => {
  //     const dracoLoader = new DRACOLoader();
  //     dracoLoader.setDecoderPath("./draco/");
  //     loader.setDRACOLoader(dracoLoader);
  //   },
  //   (e) => {
  //     if (e.total) console.log((e.loaded / e.total) * 100);
  //     console.log(e.loaded);
  //     console.log(e.total);
  //   }
  // );
  const model = useGLTF("./hamburger-draco.glb");
  return <Clone object={model.scene} scale={0.35} />;
}

useGLTF.preload("./hamburger-draco.glb");

export default Model;
