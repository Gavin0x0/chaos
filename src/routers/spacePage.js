import React from "react";
import "../css/spacePage.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky, PointerLockControls } from "@react-three/drei";
import { Ground } from "../components/Ground";
import { Player } from "../components/Player";
import { RotatingCube } from "../components/RotatingCube";

class Space extends React.Component {
  render() {
    return (
      <>
        <div
          id="PointerLockToggle"
        >
          Click here to control camera
        </div>
        <Canvas
          gl={{ alpha: false }}
          camera={{ position: [0, 10, 10] }}
          dpr={window.devicePixelRatio}
        >
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Player />
            <RotatingCube position={[-1.2, 2, 0]} />
            <RotatingCube position={[1.2, 2, 0]} />
            <RotatingCube position={[0, 1, -1]} />
          </Physics>
          <PointerLockControls selector="#PointerLockToggle" />
        </Canvas>
      </>
    );
  }
}
export default Space;
