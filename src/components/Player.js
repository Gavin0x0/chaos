import React from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

// FPV camera controls
export const Player = () => {
  const { camera_pos } = useControls({
    camera_pos: {
      x: 0,
      z: 0,
    },
  });
  useFrame((state, delta) => {
    state.camera.position.x = camera_pos.x;
    state.camera.position.z = camera_pos.z;
  });
  return <></>;
};
