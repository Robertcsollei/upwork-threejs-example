import { useEffect, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3, Raycaster, Plane, Vector2, BufferGeometry, Line, LineBasicMaterial } from 'three'

interface LineData {
  id: number
  start: Vector3
  end: Vector3
}

export function LineDrawing() {
  const { camera, gl } = useThree()
  const [lines, setLines] = useState<LineData[]>([])
  const [currentLineId, setCurrentLineId] = useState<number | null>(null)
  const [nextId, setNextId] = useState(0)
  const [dragOrigin, setDragOrigin] = useState<Vector3 | null>(null)
  const [dragPlane, setDragPlane] = useState<Plane | null>(null)

  const getMidpoint = (start: Vector3, end: Vector3) => {
    return start.clone().add(end).multiplyScalar(0.5)
  }

  const getMouseRay = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    console.log({ x, y })
    const raycaster = new Raycaster()
    raycaster.setFromCamera(new Vector2(x, y), camera)
    return raycaster
  }, [camera, gl])

  const intersectGroundPlane = useCallback((raycaster: Raycaster) => {
    const groundPlane = new Plane(new Vector3(0, 0, 1), 0)
    const intersection = new Vector3()
    raycaster.ray.intersectPlane(groundPlane, intersection)
    console.log({ intersection })
    return intersection
  }, [])

  const handleMouseDown = useCallback((event: MouseEvent) => {

    if (event.button !== 2) return

    const raycaster = getMouseRay(event)
    const worldPos = intersectGroundPlane(raycaster)
    console.log({ worldPos, raycaster })
    if (worldPos) {
      setDragOrigin(worldPos)

      const newLine: LineData = {
        id: nextId,
        start: worldPos.clone(),
        end: worldPos.clone()
      }

      setLines(prev => [...prev, newLine])
      setCurrentLineId(nextId)
      setNextId(prev => prev + 1)

      const cameraToPoint = worldPos.clone().sub(camera.position).normalize()
      const plane = new Plane(cameraToPoint, -worldPos.dot(cameraToPoint))
      setDragPlane(plane)
    }
  }, [getMouseRay, intersectGroundPlane, camera, nextId])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragOrigin || !dragPlane || currentLineId === null) return

    const raycaster = getMouseRay(event)
    const intersection = new Vector3()
    raycaster.ray.intersectPlane(dragPlane, intersection)

    if (intersection) {
      setLines(prev => prev.map(line =>
        line.id === currentLineId
          ? { ...line, end: intersection.clone() }
          : line
      ))
    }
  }, [dragOrigin, dragPlane, currentLineId, getMouseRay])

  const handleMouseUp = useCallback(() => {
    setDragOrigin(null)
    setDragPlane(null)
    setCurrentLineId(null)
  }, [])

  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl, handleMouseDown, handleMouseMove, handleMouseUp])



  return (
    <>
      {lines.map((line) => {
        const midpoint = getMidpoint(line.start, line.end)
        const points = [line.start, line.end]

        const geometry = new BufferGeometry().setFromPoints(points)

        return (
          <group key={line.id}>
            <primitive object={new Line(geometry, new LineBasicMaterial({ color: 'blue' }))} />
            <mesh position={[midpoint.x, midpoint.y, midpoint.z]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          </group>
        )
      })}
    </>
  )
}