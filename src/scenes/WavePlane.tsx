import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'

const vertexShader = `
  uniform float u_time;
  uniform float u_height;

  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    vec3 pos = position;

    vec2 center = vec2(0.5, 0.5);
    float distance = length(v_uv - center);
    float wave = sin(distance * 15.0 - u_time * 3.0) * u_height + 0.5;
    pos.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float u_time;
  varying vec2 v_uv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float distance = length(v_uv - center);

    vec3 color = vec3(0.2, 0.6, 1.0);
    float wave = sin(distance * 15.0 - u_time * 3.0) * 0.5 + 0.5;
    color *= wave;

    gl_FragColor = vec4(color, 1.0);
  }
`

interface WavePlaneProps {
  height?: number
}

export function WavePlane({ height = 0.5 }: WavePlaneProps) {
  const meshRef = useRef<Mesh>(null!)
  const materialRef = useRef<ShaderMaterial>(null!)

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_height: { value: height }
  }), [])

  useEffect(() => {
    uniforms.u_height.value = height;
  }, [height, uniforms]);

  useFrame((state) => {
    if (materialRef.current) {
      uniforms.u_time.value = state.clock.getElapsedTime();
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 4, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={2}
      />
    </mesh>
  )
}