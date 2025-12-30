import DrunkEffect from "./DrunkEffect";

function Drunk(props) {
  const effect = new DrunkEffect(props);
  return <primitive ref={props.ref} object={effect} dispose={null} />;
}

export default Drunk;
