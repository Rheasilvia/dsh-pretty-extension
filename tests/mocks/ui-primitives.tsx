import type { ButtonHTMLAttributes, ReactNode, SVGAttributes } from 'react'

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; icon?: ReactNode }) {
  const { variant: _variant, size: _size, icon, children, ...rest } = props
  return <button {...rest}>{icon}{children}</button>
}

interface MenuItem { id: string; label: ReactNode; disabled?: boolean }
interface MenuLabel { type: 'label'; id: string; text: string }
interface MenuSeparator { type: 'separator'; id: string }
type MenuEntry = MenuItem | MenuLabel | MenuSeparator

export function Menu(props: {
  open: boolean
  anchor: ReactNode
  items: readonly MenuEntry[]
  selectedId?: string
  onSelect: (id: string) => void
  onClose: () => void
  className?: string
}) {
  return (
    <span className={props.className}>
      {props.anchor}
      {props.open && (
        <div role="menu">
          {props.items.map(entry => {
            if ('type' in entry && entry.type === 'label') return <div key={entry.id}>{entry.text}</div>
            if ('type' in entry && entry.type === 'separator') return <hr key={entry.id} />
            return (
              <button
                key={entry.id}
                type="button"
                role="menuitem"
                disabled={entry.disabled}
                onClick={() => { props.onSelect(entry.id) }}
              >
                {entry.label}
              </button>
            )
          })}
        </div>
      )}
    </span>
  )
}

export function IconChevronDownOutlineRegular(props: SVGAttributes<SVGSVGElement>) {
  return <svg {...props} aria-hidden="true" />
}
