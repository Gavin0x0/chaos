import { useRef, useState } from "react";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
// rotating cube
export const RotatingCube = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef(); //old
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const { cube_w, cube_h, cube_d } = useControls('cube',{
    cube_w: { value: 1, min: 0.1, max: 10 },
    cube_h: { value: 1, min: 0.1, max: 10 },
    cube_d: { value: 1, min: 0.1, max: 10 },
  });
  
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.z += 0.01;
    let s = active ? 3 : 1;
    mesh.current.scale.y = s*cube_h;
    mesh.current.scale.x = s*cube_w;
    mesh.current.scale.z = s*cube_d;
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};
