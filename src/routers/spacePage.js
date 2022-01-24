import React from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Ground } from "../components/Ground";
import { RotatingCube } from "../components/RotatingCube";
import "../css/spacePage.css";

// main scene
class Space extends React.Component {
  render() {
    return (
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={window.devicePixelRatio}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Physics gravity={[0, -30, 0]}>
          <Ground />
          <RotatingCube position={[-1.2, 0, 0]} />
          <RotatingCube position={[1.2, 0, 0]} />
          <RotatingCube position={[0, 1, -1]} />
        </Physics>
      </Canvas>
    );
  }
}

export default Space;
