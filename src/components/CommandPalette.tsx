"use client"

import { ReactNode } from 'react'

interface CommandPaletteProps {
  children: ReactNode
}

export function CommandPalette({ children }: CommandPaletteProps) {
  return <>{children}</>
}