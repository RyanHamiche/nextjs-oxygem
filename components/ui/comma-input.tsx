'use client'

import { useState, useEffect } from 'react'
import { Input } from './input'

interface CommaSeparatedInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export default function CommaSeparatedInput({
  value,
  onChange,
  placeholder,
}: CommaSeparatedInputProps) {
  const [raw, setRaw] = useState(value.join(', '))

  useEffect(() => {
    setRaw(value.join(', '))
  }, [value.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleBlur = () => {
    const parsed = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    onChange(parsed)
    setRaw(parsed.join(', '))
  }

  return (
    <Input
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  )
}
