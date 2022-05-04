import React from 'react'
import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text } from '@react-three/drei'
import create from 'zustand'
import { ChangableEnvironment } from '../components/ChangableEnvironment'

//全局状态管理
const useStore = create(set => ({
    imageID: '',
    setCurImageID: (id) => set({ imageID: id }),
}))
//黄金分割比
const GOLDENRATIO = 1.61803398875

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
    // Front
    { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1103970), imageID: 103970 },
    // Back
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430), imageID: 416430 },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452), imageID: 310452 },
    // Left
    { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482), imageID: 327482 },
    { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185), imageID: 325185 },
    { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(358574), imageID: 358574 },
    // Right
    { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(227675), imageID: 227675 },
    { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738), imageID: 911738 },
    { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986), imageID: 1738986 }
]
// Quaternion 四元数在three.js中用于表示 rotation（旋转）。
function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
    const ref = useRef()
    const clicked = useRef()
    const imageID = useStore((state) => state.imageID)
    const setCurImageID = useStore((state) => state.setCurImageID)
    useEffect(() => {
        clicked.current = ref.current.getObjectByName(imageID)
        if (clicked.current) {
            clicked.current.parent.updateWorldMatrix(true, true)
            clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
            clicked.current.parent.getWorldQuaternion(q)
        } else {
            p.set(0, 0, 5.5)
            q.identity()
        }
    })
    useFrame((state, dt) => {
        state.camera.position.lerp(p, 0.025)
        state.camera.quaternion.slerp(q, 0.025)
    })
    return (
        <group
            ref={ref}
            onClick={(e) => { e.stopPropagation(); setCurImageID(clicked.current === e.object ? 'null' : e.object.name) }}
            onPointerMissed={() => setCurImageID('null')}>
            {images.map((props) => <Frame key={props.imageID} {...props} /> /* prettier-ignore */)}
        </group>
    )
}

function Frame(props) {
    const { url, imageID } = props
    const [hovered, hover] = useState(false)
    const [rnd] = useState(() => Math.random())
    const image = useRef()
    const frame = useRef()
    const c = new THREE.Color()
    //从url中获取图片id
    const name = imageID
    useCursor(hovered)
    useFrame((state) => {
        image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
        image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.85 * (hovered ? 0.85 : 1), 0.1)
        image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.9 * (hovered ? 0.905 : 1), 0.1)
        frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white').convertSRGBToLinear(), 0.1)
    })
    return (
        <group {...props}>
            <mesh
                name={name}
                onPointerOver={(e) => { e.stopPropagation(); hover(true) }}
                onPointerOut={() => hover(false)}
                scale={[1, GOLDENRATIO, 0.05]}
                position={[0, GOLDENRATIO / 2, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
                <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
            </mesh>
            <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
                {name}
            </Text>
        </group>
    )
}

class GalleryImageDemo extends React.Component {
    render() {
        return (
            <Suspense fallback={null}>
                <div className="canvas-container" style={{ height: "100%", width: "100%" }}>
                    <Canvas gl={{ alpha: false }} dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
                        <ChangableEnvironment position={[0, -0.5, 4]} args={[0.1, 9, 9]} />
                        <color attach="background" args={['#191920']} />
                        <fog attach="fog" args={['#191920', 0, 15]} />
                        <group position={[0, -0.5, 0]}>
                            <Frames images={images} />
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                                <planeGeometry args={[50, 50]} />
                                <MeshReflectorMaterial
                                    blur={[300, 100]}
                                    resolution={2048}
                                    mixBlur={1}
                                    mixStrength={40}
                                    roughness={1}
                                    depthScale={1.2}
                                    minDepthThreshold={0.4}
                                    maxDepthThreshold={1.4}
                                    color="#101010"
                                    metalness={0.5}
                                />
                            </mesh>
                        </group>
                    </Canvas>
                </div>
            </Suspense>
        );
    }
}

export default GalleryImageDemo;