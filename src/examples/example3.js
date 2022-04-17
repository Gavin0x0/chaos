import React from "react";
import "../css/spacePage.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Ground } from "../components/Ground";
import { Player } from "../components/Player";
import { PhysicalCube } from "../components/PhysicalCube";
import { Sky, PointerLockControls } from "@react-three/drei";


function CubeList(props) {
  const cubes = new Array(10).fill(0)
  console.log(cubes)
  const cubeList = cubes.map((cube, i) => {
    return (
      <PhysicalCube
        key={i}
        position={[-10,i,-10]}
      />
    );
  });
  return cubeList;
}

class Example3 extends React.Component {
  render() {
    return (
      <>
        <div
          id="PointerLockToggle"
        >
          Click here to control the camera
        </div>
        <Canvas
          gl={{ alpha: false }}
          camera={{ position: [0, 10, 10] }}
          dpr={window.devicePixelRatio}
          raycaster={{
            computeOffsets: (e) => ({ offsetX: e.target.width / 2, offsetY: e.target.height / 2 }),
          }}
        >
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Player />
            <PhysicalCube position={[1,1,1]}/>
            <CubeList />
          </Physics>
          <PointerLockControls/>
        </Canvas>
      </>
    );
  }
}

export default Example3;