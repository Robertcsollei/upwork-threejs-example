import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'


export function RotatingCube() {
    const meshRef = useRef<Mesh>(null!)
    const ROTATION_SPEED = 0.5

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        meshRef.current.rotation.x = time * ROTATION_SPEED
        meshRef.current.rotation.y = time * ROTATION_SPEED
    })

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'hotpink'} />
        </mesh>
    )
}