import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RotatingCube } from './scenes/RotatingCube'
import { WavePlane } from './scenes/WavePlane'
import { LineDrawing } from './scenes/LineDrawing'
import { Select } from './components/Select'
import { NumberInput } from './components/NumberInput'
import './App.css'

enum Scene {
  CUBE = 'cube',
  WAVE_PLANE = 'wave_plane',
  LINE_DRAWING = 'line_drawing'
}


function App() {
  const [currentScene, setCurrentScene] = useState<Scene>(Scene.CUBE)
  const [waveHeight, setWaveHeight] = useState(0.5)

  const renderScene = () => {
    switch (currentScene) {
      case Scene.CUBE:
        return <RotatingCube />
      case Scene.WAVE_PLANE:
        return <WavePlane height={waveHeight} />
      case Scene.LINE_DRAWING:
        return <LineDrawing />
      default:
        return <RotatingCube />
    }
  }

  const sceneOptions = [
    { value: Scene.CUBE, label: 'Rotating Cube' },
    { value: Scene.WAVE_PLANE, label: 'Wave Plane' },
    { value: Scene.LINE_DRAWING, label: 'Line Drawing' }
  ]

  return (
    <div className="App">
      <div className="scene-selector">
        <Select
          value={currentScene}
          onChange={(value) => setCurrentScene(value as Scene)}
          options={sceneOptions}
        />
        {currentScene === Scene.WAVE_PLANE && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '4px'
          }}>
            <NumberInput
              label="Wave Height"
              value={waveHeight}
              onChange={setWaveHeight}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
        )}
      </div>
      <Canvas>
        <OrbitControls enablePan={false} />
        <ambientLight />
        <pointLight position={[20, 10, 10]} intensity={1000} />
        {renderScene()}
      </Canvas>
    </div>
  )
}

export default App