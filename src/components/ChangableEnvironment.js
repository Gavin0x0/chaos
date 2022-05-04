import { useState } from 'react'
import { Environment } from '@react-three/drei'
import { Vector3 } from 'three'

const HDRI_FILES_PATH = [
    require('../assets/hdr/sunset.hdr'),
    require('../assets/hdr/photostudio.hdr'),
    require('../assets/hdr/christmas.hdr')
]

/**
 * 可变环境光及贴图「用一个立体圆按钮控制」
 * @param {Number[]} props.position 圆按钮的位置
 * @param {Boolean} props.enable_background 是否启用贴图作为背景，如果关闭仅加入环境光
 */
export const ChangableEnvironment = (props) => {
    const position = new Vector3(...props.position)
    const { args = [2, 32, 32], enable_background = true } = props
    const [index, setIndex] = useState(0)
    //是否选中
    const [selected, setSelected] = useState(false)
    //是否按下
    const [pressed, setPressed] = useState(false)
    // 按下时 position 的y值减0.5
    const pressedPosition = position.clone().setY(position.y - 0.5 * args[0])
    //圆柱体按钮
    return (
        <>
            <Environment background={enable_background} files={HDRI_FILES_PATH[index]} />
            <mesh
                position={pressed ? pressedPosition : position}
                onClick={() => setIndex((index + 1) % HDRI_FILES_PATH.length)} //点击切换环境
                onPointerOver={() => setSelected(true)}
                onPointerOut={() => setSelected(false)}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
            >
                <sphereGeometry attach="geometry" args={args} />
                <meshStandardMaterial color={selected ? '#ff6666' : '#aa6666'} />
            </mesh>
        </>
    )
}