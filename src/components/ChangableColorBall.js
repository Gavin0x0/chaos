import { useState } from 'react'
import { Vector3 } from 'three'

const colorList = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#00ffff',
    '#ff00ff',
    '#ffffff',
    '#000000',
]
/**
 * 可变色小球
 * @param {Number[]} props.position 小球的位置
 */
export const ChangableColorBall = (props) => {
    const position = new Vector3(...props.position)
    const [index, setIndex] = useState(0)
    //是否按下
    const [pressed, setPressed] = useState(false)
    //圆柱体按钮
    return (
        <>
            <mesh
                position={position}
                onClick={() => setIndex((index + 1) % colorList.length)} //点击切换环境
                onPointerOver={() => setPressed(true)}
                onPointerOut={() => setPressed(false)}
                scale={pressed ? 1.5 : 1}
            >
                <sphereGeometry attach="geometry" args={[0.5, 32, 32]} />
                <meshStandardMaterial color={colorList[index]} />
            </mesh>
        </>
    )
}