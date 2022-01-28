import React from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

// FPV camera controls
export const Player = () => {
  const { camera_pos } = useControls({
    camera_pos: {
      value: { x: 0, y: 0},
      step: 1,
    },
  });
  useFrame((state, delta) => {
    //console.log(camera_pos)
    state.camera.position.x = camera_pos.x.toFixed(0);
    state.camera.position.z = camera_pos.y.toFixed(0);
  });
  return <></>;
};
