"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface TeamLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  team: string
  variant?: 'auto' | 'light' | 'dark'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6', 
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

// Map team names to logo file names
const teamFileNames: Record<string, string> = {
  'Arizona': 'arizona',
  'Arizona State': 'arizona_state',
  'Baylor': 'baylor', 
  'BYU': 'byu',
  'Cincinnati': 'cincinnati',
  'Colorado': 'colorado',
  'Houston': 'houston',
  'Iowa State': 'iowa_state',
  'Kansas': 'kansas',
  'Kansas State': 'kansas_state',
  'Oklahoma State': 'oklahoma_state',
  'TCU': 'tcu',
  'Texas Tech': 'texas_tech',
  'UCF': 'ucf',
  'Utah': 'utah',
  'West Virginia': 'west_virginia'
}

export function TeamLogo({ 
  team, 
  variant = 'auto', 
  size = 'md', 
  className, 
  ...props 
}: TeamLogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getLogoVariant = () => {
    if (variant !== 'auto') return variant
    
    if (!mounted) return 'light' // Default during SSR
    
    const currentTheme = theme === 'system' ? systemTheme : theme
    return currentTheme === 'dark' ? 'dark' : 'light'
  }

  const teamFileName = teamFileNames[team]
  if (!teamFileName) {
    console.warn(`No logo found for team: ${team}`)
    return null
  }

  const logoVariant = getLogoVariant()
  const logoPath = `/assets/logos/teams/${logoVariant}/${teamFileName}-${logoVariant}.svg`

  return (
    <img
      src={logoPath}
      alt={`${team} logo`}
      className={cn(
        sizeClasses[size],
        'object-contain',
        className
      )}
      {...props}
    />
  )
}