import React from "react";
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useControls, folder } from "leva";

// FPVC First Person View Controller 第一人称控制器的实现

const SPEED = 5 // 固定世界速度
const JUMP_SPEED = 10 // 跳跃时初始速度
const direction = new THREE.Vector3() //运动方向「正向速度与横向速度的复合」
const frontVector = new THREE.Vector3() //正向速度
const sideVector = new THREE.Vector3() //横向速度
//const rotation = new THREE.Vector3()
const speed = new THREE.Vector3()
// 按键绑定，按键按下时将对应的值设为 true
const keys = { KeyW: "forward", KeyS: "backward", KeyA: "left", KeyD: "right", Space: "jump" }
const moveFieldByKey = (key) => keys[key]
const usePlayerControls = () => {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false })
  useEffect(() => {
    const handleKeyDown = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    const handleKeyUp = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
    // 设置按键监听
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    return () => {
      // 在组件被销毁时解除按键监听
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
  return movement
}

// FPV camera controls
export const Player = (props) => {
  // 定义摄像机
  const { camera } = useThree()
  // 定义速度参数，使用Ref的好处是改变.current的值不会触发重新渲染
  const velocity = useRef([0, 0, 0])
  // 定义运动控制器
  const { forward, backward, left, right, jump } = usePlayerControls()
  // 设置 leva 插件里的观察者「xxx_watcher」以及观察者参数的setter函数「set_watcher」
  const [, set_watcher] = useControls(() => ({ pos_watcher: [.0, .0, .0], vel_watcher: [0, 0, 0], "controls": folder({ forward: false, backward: false, left: false, right: false, jump: false }) }))
  /**
   * useSphere hook 返回一个球形对象的引用和一个 api 接口
   * 就是说，物理引擎中发生的数值变化会通过 api 接口给到我们，在 useEffect 中订阅这个属性来获得每帧的更新
   * 当 api.velocity 发生变化时，useEffect 函数会激活，我们就会更新我们的 velocity 变量
   */
  const [playerRef, api] = useSphere(() => ({ mass: 1, type: "Dynamic", position: [0, 0, 0], ...props }))
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity])
  /**
   * 在 useFrame 通过 playerRef「球形对象」 的位置属性来更新 camera 的位置
   */
  useFrame((state) => {
    //current.getWorldPosition - 获取当前对象的世界坐标 <THREE.Object3D>
    playerRef.current.getWorldPosition(camera.position)
    // Z轴速度变量：后-前
    frontVector.set(0, 0, Number(backward) - Number(forward))
    // X轴速度变量：左-右
    sideVector.set(Number(left) - Number(right), 0, 0)
    // 设置移动方向，并设置速度，最后将速度的复合与摄像机角度结合获得实际移动方向
    // normalize — Normalize the Vector3 向量单位化
    // addVector — Adds the given Vector3 coordinates to this Vector3 向量相加
    // subVector — Subtracts the given Vector3 coordinates to this Vector3 向量相减
    // multiplyScalar — Multiplies this Vector3 coordinates by the given scalar 向量乘以一个数
    // applyEuler — Apply Euler angles to this Vector3 向量旋转
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
    // 速度参数，暂时不用管
    speed.fromArray(velocity.current)
    api.velocity.set(direction.x, velocity.current[1], direction.z)
    // 同步观察者数据「欧拉旋转后的速度」& 「位置」&「控制器」
    set_watcher({ vel_watcher: [direction.x, velocity.current[1], direction.z], pos_watcher: camera.position.toArray(), forward: forward, backward: backward, left: left, right: right, jump: jump })
    // 跳跃控制器：当 jump 为 true 且下落速度小于0.05即在地面时允许跳跃
    if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) api.velocity.set(velocity.current[0], JUMP_SPEED, velocity.current[2])
  })
  return <><mesh ref={playerRef} /></>;
};
