import '../styles/rigDemo.css'
import * as THREE from 'three'
import { Component, Suspense, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { CameraShake, OrbitControls } from '@react-three/drei'
import { ChangableEnvironment } from '../components/ChangableEnvironment'


function Plane(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    const { args = [1, 1] } = props
    return (
        <mesh ref={ref}>
            <planeGeometry args={args} />
        </mesh>
    )
}

function Cube(props) {
    //mass: 质量
    const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }))
    const { color = 'red', args = [1, 1, 1] } = props
    return (
        <mesh ref={ref}>
            <boxGeometry args={args} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

//依赖鼠标的视角控制器
function RigControls() {
    const [vec] = useState(() => new THREE.Vector3())
    const { camera, mouse } = useThree()
    //position.lerp: 位置逐帧变化，带插值
    useFrame(() => camera.position.lerp(vec.set(mouse.x * 20, 5, mouse.y * -20 + 10), 0.05))
    //让相机始终看向中间
    useFrame(() => camera.lookAt(vec.set(0, 3, 0)))
    return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4} />
}

//桌面端、移动端通用视角控制器
function CameraController() {
    //判断如果是移动设备
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
        //使用鼠标控制器
        return <OrbitControls enablePan={false} />
    } else {
        //使用RigControls控制器
        return <RigControls />
    }
}



class RigControlsDemo extends Component {
    //绘制基础场景
    render() {
        return (
            <div className='canvas-container'>
                <Suspense>
                    <Canvas>
                        <fog attach="fog" args={['#222222', 0, 60]} />
                        <ambientLight />
                        <pointLight position={[0, 10, 0]} />
                        <ChangableEnvironment position={[0, -0.5, 7]} />
                        <Physics>
                            <Plane args={[30, 30]} />
                            <Cube args={[5, 5, 5]} />
                            <Cube args={[3, 3, 3]} position={[6, 5, 2]} color={'gray'} />
                            <Cube args={[3, 3, 3]} position={[0, 5, -5]} color={'yellow'} />
                            <Cube args={[1, 2, 3]} position={[-0.5, 10, 0]} color={'green'} />
                            <Cube position={[0, 12, 0]} color={'purple'} />
                            <Cube position={[0, 13, 0]} color={'purple'} />
                            <Cube position={[0, 15, 0]} color={'purple'} />
                        </Physics>
                        <CameraController />
                    </Canvas>
                </Suspense>
            </div>
        )
    }
}
export default RigControlsDemo