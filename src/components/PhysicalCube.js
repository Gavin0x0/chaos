import { useState } from "react";
import {useBox} from "@react-three/cannon";
// rotating cube
export const PhysicalCube = (props) => {
  // This reference will give us direct access to the mesh
  //const mesh = useRef(); //old
  const [mesh] = useBox(() => ({ mass: 1, ...props }))
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 3 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};
