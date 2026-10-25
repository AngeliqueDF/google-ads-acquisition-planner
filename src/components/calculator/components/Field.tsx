import type { ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  description: string
  children: ReactNode
}

export function Field({ id, label, description, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <small id={`${id}-description`}>{description}</small>
      {children}
    </div>
  )
}
