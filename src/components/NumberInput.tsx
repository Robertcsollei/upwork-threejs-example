import "./NumberInput.css"

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  className
}: NumberInputProps) {
  return (
    <div className={`number-input ${className || ''}`}>
      <label className="number-input-label">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="number-input-field"
      />
    </div>
  )
}