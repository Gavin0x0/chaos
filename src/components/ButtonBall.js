import { useState } from 'react'
import { Text } from '@react-three/drei'
import { Vector3 } from 'three'


/**
 * 带文案的立体圆按钮
 * @param {Number[]} props.position 圆按钮的位置
 */
export const ButtonBall = (props) => {
    const position = new Vector3(...props.position)
    const { args = [1, 16, 16], button_fun, button_text = 'Button', fontSize = 0.25 } = props
    //是否选中
    const [selected, setSelected] = useState(false)
    //是否按下
    const [pressed, setPressed] = useState(false)
    // 按下时字体大小减0.05
    const pressedFontSize = fontSize * 0.8
    return (
        <group position={position}>
            <mesh
                position={[0, 0, 0]}
                onClick={() => button_fun()}
                onPointerOver={() => setSelected(true)}
                onPointerOut={() => setSelected(false)}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
            >
                <sphereGeometry attach="geometry" args={args} />
                <meshStandardMaterial color={selected ? '#66b' : '#666'} />
            </mesh>
            <Text maxWidth={1} anchorX="center" anchorY="bottom" position={[0, 0.1, 0]} fontSize={pressed ? pressedFontSize : fontSize} fillOpacity={0} strokeWidth={'1%'} strokeColor={selected ? '#fff' : '#666'}>
                {button_text}
            </Text>
        </group>
    )
}