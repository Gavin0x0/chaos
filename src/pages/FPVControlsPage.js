import React, { Suspense } from "react";
import "../styles/fpvDemo.css"
import { Canvas } from "@react-three/fiber";
import { Physics, useBox, useCylinder } from "@react-three/cannon";
import { Ground } from "../components/Ground";
import { Player } from "../components/Player";
import { Sky, PointerLockControls } from "@react-three/drei";
import { ChangableColorBall } from "../components/ChangableColorBall";

function PhysicalBox(props) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 0, 0], ...props }))
  const { color = 'red', args = [1, 1, 1] } = props
  return (
    <mesh ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function PhysicalCylinder(props) {
  const [ref] = useCylinder(() => ({ mass: 1, position: [0, 0, 0], ...props }))
  const { color = 'red', args = [1, 1, 1] } = props
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

/**
 * 实现第一人称控制器仅需将Player放入物理空间
 * 加上一个PointerLockControls
 * 且放入<div className='cursor'></div>和相关变量
 */

class FPVControls extends React.Component {

  //如果鼠标被锁，则显示中心的光标
  constructor(props) {
    super(props);
    this.state = {
      showCursor: false,
    };
  }

  render() {
    return (
      <div className='canvas-container'>
        {this.state.showCursor && <div className='cursor'></div>}
        <Suspense>
          <Canvas
            dpr={window.devicePixelRatio}
          >
            <PointerLockControls onLock={() => this.setState({ showCursor: true })} onUnlock={() => this.setState({ showCursor: false })} />
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <ChangableColorBall position={[6, 2, -1]} />
            <Physics gravity={[0, -30, 0]}>
              <Ground />
              <Player position={[0, 1, 10]} />
              <PhysicalBox args={[5, 5, 5]} color={'blue'} position={[0, 10, 0]} />
              <PhysicalCylinder args={[2, 2, 2]} position={[0, 5, 0]} />
            </Physics>
          </Canvas>
        </Suspense>
      </div>
    );
  }
}

export default FPVControls;