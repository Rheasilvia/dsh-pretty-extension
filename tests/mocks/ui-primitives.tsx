import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; icon?: ReactNode }) {
  const { variant: _variant, size: _size, icon, children, ...rest } = props
  return <button {...rest}>{icon}{children}</button>
}
