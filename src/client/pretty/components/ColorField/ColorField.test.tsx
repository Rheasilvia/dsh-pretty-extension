// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ColorField } from './ColorField.tsx'

describe('ColorField', () => {
  it('keeps incomplete text local and commits only a valid color', () => {
    const onCommit = vi.fn()
    render(<ColorField label="Accent" value="#2563EB" errorMessage="Use #RRGGBB" onCommit={onCommit} />)
    const input = screen.getByLabelText('Accent')
    fireEvent.change(input, { target: { value: '#12' } })
    fireEvent.blur(input)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Use #RRGGBB')).toBeTruthy()
    expect(onCommit).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: '#a0b1c2' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onCommit).toHaveBeenCalledWith('#A0B1C2')
  })
})
