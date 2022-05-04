import React from 'react'
import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, PointerLockControls, Environment, TransformControls } from '@react-three/drei'
import create from 'zustand'
import { ButtonBall } from '../components/ButtonBall'
import { Login } from '../utils/accountUtils'
import RetrieveAssets from '../apis/OpenSea-API'
import { Physics } from "@react-three/cannon";
import { FackGround } from "../components/FackGround";
import { Player } from "../components/Player";
import "../styles/fpvDemo.css"
import { addCollection, getCollection, addGalleryItem, getGallery, updateGalleryItem } from '../apis/BackEnd-API'
import { Alert } from 'react-bootstrap'

//全局状态管理
const useStore = create(set => ({
    imageID: 'null',
    setCurImageID: (id) => set({ imageID: id }),
    transformMode: 'translate',
    setTransformMode: (mode) => set({ transformMode: mode }),
}))
//黄金分割比
const GOLDENRATIO = 1.61803398875

// 按键绑定，按键按下时将对应的值设为 true
const keys = { KeyR: "rotate", KeyT: "translate" }
const setModeByKey = (key) => keys[key]
const useTransformControls = () => {
    const setTransformMode = useStore((state) => state.setTransformMode)
    const transformMode = useStore((state) => state.transformMode)
    // 设置按键监听
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "KeyR" || e.code === "KeyT") {
                setTransformMode(setModeByKey(e.code))
                console.log(e.code, transformMode)
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            // 在组件被销毁时解除按键监听
            document.removeEventListener("keydown", handleKeyDown)
        }
    })
    return transformMode
}

// Quaternion 四元数在three.js中用于表示 rotation（旋转）。
function Frames({ lockCamera, images, q = new THREE.Quaternion(), p = new THREE.Vector3(0, 0, 5) }) {
    const ref = useRef()
    const clicked = useRef()
    const moveObj = useRef(false)
    const enableTransform = useRef(false)
    const imageID = useStore((state) => state.imageID)
    const setCurImageID = useStore((state) => state.setCurImageID)
    const transformMode = useTransformControls()
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
    const handleObjSave = (e) => {
        console.log('save', e)
        const Obj = ref.current.getObjectByName(e)
        console.log(Obj.position, Obj.rotation)
        updateGalleryItem({
            itemID: e,
            pX: Obj.position.x,
            pY: Obj.position.y,
            pZ: Obj.position.z,
            rX: Obj.quaternion.x,
            rY: Obj.quaternion.y,
            rZ: Obj.quaternion.z,
        }).then(res => {
            console.log(res)
        }
        )
    }
    const handleObjClick = (id) => {
        console.log('click', id)
        if (imageID === id) {
            setCurImageID('null')
            enableTransform.current = false
            if (!lockCamera) {
                handleObjSave(id)
            }
        } else {
            enableTransform.current = true
            setCurImageID(id)
        }
        moveObj.current = ref.current.getObjectByName(id)
    }
    return (
        <group
            ref={ref}
            onPointerMissed={() => setCurImageID('null')}>
            {(!lockCamera) && enableTransform.current && <TransformControls mode={transformMode} object={moveObj.current} space={'local'} />}
            {images.map((props) => <Frame key={props.imageID} lockCamera={lockCamera} {...props} handleClick={handleObjClick} handleSave={handleObjSave} />)}
        </group>
    )
}

function Frame(props) {
    const { url, imageID, name = 'unknow', lockCamera = false } = props
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
    const { handleClick, handleSave } = props
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
                {lockCamera ? <>

                </> : <>
                    <mesh>
                        <boxGeometry />
                        <Text maxWidth={1} anchorX="center" anchorY="top" position={[0, -0.5, 0]} fontSize={0.065} fillOpacity={hovered ? 1 : 0}>
                            Change Mode by ‘R’ ‘T’
                        </Text>
                    </mesh>
                    <mesh onClick={(e) => { e.stopPropagation(); handleSave(imageID) }}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} position={[0, -0.6, 0]} />
                        <Text maxWidth={1} anchorX="center" anchorY="top" position={[0, -0.6, 0]} fontSize={0.065} fillOpacity={hovered ? 1 : 0}>
                            Click Again To Save State
                        </Text>
                    </mesh>
                </>}
            </mesh>
        </group>
    )
}

function AlertShareLink(props) {
    const { address, handleClose } = props
    return (
        <Alert variant={'primary'} onClose={handleClose} dismissible>
            这是为你生成的
            <Alert.Link target="_blank" href={`http://localhost:3000/share?address=${address}`}> Gallery分享链接 </Alert.Link>
            ，分享给你的朋友，他们可以在他们的设备上查看你的Gallery。
        </Alert>)

}

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const homePageimages = [
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
class GalleryByAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            curAddress: 'public playground',
            images: homePageimages,
            ifLogin: false,
            ifFPV: false,
            showCursor: false,
            showAlert: false,
        }
    }

    clickLogin() {
        Login().then((address) => {
            console.log('GalleryByAccount Login', address)
            getGallery().then(res => {
                const assets = res.data
                if (assets.length === 0) {
                    this.initGallery()
                } else {
                    let my_images = []
                    for (let asset of assets) {
                        my_images.push({
                            position: [asset.pX, asset.pY, asset.pZ],
                            rotation: [asset.rX, asset.rY, asset.rZ],
                            url: asset.itemURL,
                            imageID: asset.itemID,
                            name: asset.itemName
                        })
                    }
                    return my_images
                }
            }).then(my_images => {
                this.setState({ images: my_images, ifLogin: true, curAddress: address })
            })
                .catch(err => { console.log("Back-End API Gallery ERROR") })

            // this.initGallery()
        }).catch((err) => {
            console.log('GalleryByAccount Login err', err)
        })
    }

    clickLogout() {
        this.setState({ ifLogin: false, curAddress: 'public playground', images: homePageimages })
        //清理JWT
        localStorage.setItem('chaos_jwt_token', '')
    }
    clickRandom() {
        console.log('clickRandom')
        //使用原生页面跳转到 /random
        window.location.href = '/random'
    }

    clickEnter() {
        this.setState({ ifFPV: true })
    }

    clickShare() {
        this.setState({ ifFPV: false, showAlert: true })

    }
    //从OS获取NFT缓存到数据库
    getCollectionFromOS(address) {
        //临时测试address
        const tmp_address = '0xb65893E83bbD9FA5326446251E32Cab8eCC01544'
        RetrieveAssets({ owner: tmp_address }).then(res => {
            console.log('OpenSea API GET:', res)
            const assets = res.assets
            for (let asset of assets) {
                addCollection({
                    itemID: asset.id,
                    itemName: asset.name,
                    itemURL: asset.image_preview_url,
                    itemOSURL: asset.permalink
                })
            }
        }).catch(err => console.log("Opensea API ERROR"))
    }
    //从后台首次获取数据生成展馆「一般是20个」
    initGallery() {
        getCollection().then(res => {
            console.log('getCollection', res)
            const assets = res.data
            for (let [index, asset] of assets.entries()) {
                addGalleryItem({
                    itemID: asset.itemID,
                    pX: ((index % 2) ? -1 : 1) * (index - 22) * 0.2,
                    pY: 0,
                    pZ: -0.5 * index,
                    rX: 0,
                    rY: Math.PI / 6 * ((index % 2) ? -1 : 1),
                    rZ: 0,
                })
            }
        }).catch(err => { console.log("Back-End API ERROR") })
    }


    componentDidMount() {
        console.log('GalleryByAccount componentDidMount')

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
                            <Text anchorX="center" anchorY="bottom" position={[0, GOLDENRATIO + 1, -2]} fontSize={1}>{this.state.ifLogin?'Personal Space':'Chaos NFT Gallery'}</Text>
                            <Text anchorX="center" anchorY="bottom" position={[0, GOLDENRATIO + 0.7, -2]} fontSize={0.2}>{this.state.curAddress}</Text>
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
                            button_fun={this.clickEnter.bind(this)}>
                        </ButtonBall>
                        {this.state.ifLogin && <ButtonBall
                            position={[-0.5, -0.4, 4]}
                            args={[0.08, 16, 16]}
                            fontSize={0.1}
                            button_text='logout'
                            button_fun={this.clickLogout.bind(this)} />
                        }
                        {!this.state.ifLogin && <ButtonBall
                            position={[-0.6, -0.4, 4]}
                            args={[0.08, 16, 16]}
                            fontSize={0.1}
                            button_text='Login'
                            button_fun={this.clickLogin.bind(this)} />
                        }

                        {this.state.ifLogin && <ButtonBall
                            position={[0.5, -0.4, 4]}
                            args={[0.08, 16, 16]}
                            fontSize={0.1}
                            button_text='share'
                            button_fun={this.clickShare.bind(this)} />
                        }
                        {!this.state.ifLogin && <ButtonBall
                            position={[0.6, -0.4, 4]}
                            args={[0.08, 16, 16]}
                            fontSize={0.1}
                            button_text='random tour'
                            button_fun={this.clickRandom.bind(this)} />
                        }
                        {this.state.ifFPV && <PointerLockControls
                            onLock={() => this.setState({ showCursor: true })}
                            onUnlock={() => { this.setState({ showCursor: false, ifFPV: false }) }} />}
                        {this.state.ifFPV && <Physics gravity={[0, -30, 0]}>
                            <FackGround position={[0, -0.6, 0]} />
                            <Player position={[0, 1, 5]} playerHeight={0.1} />
                        </Physics>}
                    </Canvas>
                </Suspense>
                <div className='alert-container'>
                    {this.state.showAlert && <AlertShareLink address={this.state.curAddress} handleClose={() => this.setState({ showAlert: false })} />}
                </div>
            </div>
        );
    }
}

export default GalleryByAccount;