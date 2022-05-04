import { usePlane } from "@react-three/cannon"
export const FackGround = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[200, 200]} />
    </mesh>
  )
}
