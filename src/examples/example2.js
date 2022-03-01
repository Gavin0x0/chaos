import React from "react";
import { Canvas } from "@react-three/fiber";
import { RotatingCube } from "../components/RotatingCube";
import { Sky } from "@react-three/drei";

class Example2 extends React.Component {
  render() {
    return (
      <div className="canvas-container" style={{ height: "100%", width: "100%" }}>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 10, 10] }}
        dpr={window.devicePixelRatio}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube position={[0,0,0]}/>
      </Canvas>
    </div>
    );
  }
}

export default Example2;