import React from 'react'
import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, PointerLockControls, Environment } from '@react-three/drei'
import create from 'zustand'
import { ButtonBall } from '../components/ButtonBall'
import { Physics } from "@react-three/cannon";
import { FackGround } from "../components/FackGround";
import { Player } from "../components/Player";
import "../styles/fpvDemo.css"
import "../styles/GalleryByAccount.css"
import { getRandomItem } from '../apis/BackEnd-API'

//全局状态管理
const useStore = create(set => ({
    imageID: 'null',
    setCurImageID: (id) => set({ imageID: id }),
    transformMode: 'translate',
    setTransformMode: (mode) => set({ transformMode: mode }),
}))
//黄金分割比
const GOLDENRATIO = 1.61803398875

// Quaternion 四元数在three.js中用于表示 rotation（旋转）。
function Frames({ lockCamera, images, q = new THREE.Quaternion(), p = new THREE.Vector3(0, 0, 5) }) {
    const ref = useRef()
    const clicked = useRef()
    const enableTransform = useRef(false)
    const imageID = useStore((state) => state.imageID)
    const setCurImageID = useStore((state) => state.setCurImageID)
    useEffect(() => {
        clicked.current = (imageID === 'null') ? false : ref.current.getObjectByName(imageID)
        if (lockCamera) {
            if (clicked.current) {
                clicked.current.updateWorldMatrix(true, true)
                clicked.current.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
                clicked.current.getWorldQuaternion(q)
            } else {
                p.set(0, 0, 5)
                q.identity()
            }
        }
    })
    useFrame((state, dt) => {
        if (lockCamera) {
            state.camera.position.lerp(p, 0.025)
            state.camera.quaternion.slerp(q, 0.025)
        }
    })

    const handleObjClick = (id) => {
        console.log('click', id)
        if (imageID === id) {
            setCurImageID('null')
            enableTransform.current = false
        } else {
            enableTransform.current = true
            setCurImageID(id)
        }
    }
    return (
        <group
            ref={ref}
            onPointerMissed={() => setCurImageID('null')}>
            {images.map((props) => <Frame key={props.key} {...props} handleClick={handleObjClick} />)}
        </group>
    )
}

function Frame(props) {
    const { url, imageID, name = 'unknow', } = props
    const [hovered, hover] = useState(false)
    const [rnd] = useState(() => Math.random())
    const image = useRef()
    const frame = useRef()
    const c = new THREE.Color()
    //从url中获取图片id
    useCursor(hovered)
    useFrame((state) => {
        image.current.material.zoom = 1.5 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
        image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, (hovered ? 0.85 : 0.8), 0.1)
        image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, (hovered ? 0.85 : 0.8), 0.1)
        frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white').convertSRGBToLinear(), 0.1)
    })
    const { handleClick } = props
    return (
        <group {...props} name={imageID}>
            <mesh
                onPointerOver={(e) => { e.stopPropagation(); hover(true) }}
                onPointerOut={() => hover(false)}
                onClick={(e) => { e.stopPropagation(); handleClick(imageID) }}
                scale={[1, 1, 0.05]}
                position={[0, GOLDENRATIO / 2, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
                <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
                <Text raycast={() => null} maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, 1 / 2, 0]} fontSize={0.045}>
                    {name}
                </Text>
            </mesh>
        </group>
    )
}

class RandomTourPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [
            ],
            ifFPV: false,
            showCursor: false,
        }
    }

    clickEnter() {
        this.setState({ ifFPV: true })
    }


    componentDidMount() {
        getRandomItem().then(res => {
            console.log('RandomTourPage componentDidMount', res)
            const assets = res.data
            let my_images = []
            for (let [index, asset] of assets.entries()) {
                my_images.push({
                    key: index,
                    position: [((index % 2) ? -1 : 1) * (index - 12) * 0.3, 0, -0.5 * index],
                    rotation: [0, Math.PI / 6 * ((index % 2) ? -1 : 1), 0],
                    url: asset.itemURL,
                    imageID: asset.itemID,
                    name: asset.itemName
                })
            }
            return my_images
        }).then(my_images => {
            this.setState({ images: my_images })
        })
            .catch(err => { console.log("Back-End API Gallery ERROR") })
    }

    render() {
        return (
            <div className="canvas-container" style={{ height: "100%", width: "100%" }}>
                {this.state.showCursor && <div className='cursor'></div>}
                <Suspense fallback={null}>
                    <Canvas gl={{ alpha: false }} dpr={[1, 1.5]} camera={{ fov: 80, position: [0, 0, 0], near: 0.8 }}>
                        <Environment files={require('../assets/hdr/sunset.hdr')} />
                        <color attach="backFackground" args={['#191920']} />
                        <fog attach="fog" args={['#191920', 0, 15]} />
                        <group position={[0, -0.5, 0]}>
                            <Text anchorX="center" anchorY="bottom" position={[0, GOLDENRATIO + 1, -2]} fontSize={1}>Random Tour</Text>
                            <Text anchorX="center" anchorY="bottom" position={[0, GOLDENRATIO + 0.7, -2]} fontSize={0.2}></Text>
                            <Frames lockCamera={!this.state.ifFPV} images={this.state.images} p={new THREE.Vector3(0, 0, 7)} />
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
                        <ButtonBall position={[0, -0.4, 4]} args={[0.1, 16, 16]}
                            button_text={'Enter'}
                            button_fun={this.clickEnter.bind(this)}
                            fontSize={0.2}>

                        </ButtonBall>
                        {this.state.ifFPV && <PointerLockControls
                            onLock={() => this.setState({ showCursor: true })}
                            onUnlock={() => { this.setState({ showCursor: false, ifFPV: false }) }} />}
                        {this.state.ifFPV && <Physics gravity={[0, -30, 0]}>
                            <FackGround position={[0, -0.6, 0]} />
                            <Player position={[0, 1, 5]} playerHeight={0.1} />
                        </Physics>}
                    </Canvas>
                </Suspense>
            </div>
        );
    }
}

export default RandomTourPage;