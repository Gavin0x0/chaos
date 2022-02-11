import React from "react";
import { Canvas } from "@react-three/fiber";
import { RotatingCube } from "../components/RotatingCube";

class Example1 extends React.Component {
  render() {
    return (
      <div className="canvas-container" style={{ height: "100%", width: "100%" }}>
        <Canvas
          gl={{ alpha: false }}
          camera={{ position: [0, 10, 10] }}
          dpr={window.devicePixelRatio}
        >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <RotatingCube position={[0,0,0]}/>
        </Canvas>
      </div>
    );
  }
}

export default Example1;