"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ConferenceLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'auto' | 'primary' | 'white' | 'black' | 'reversed' | 'primary_white' | 'primary_black' | 'primary_reversed'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 'h-4 w-auto',
  sm: 'h-6 w-auto', 
  md: 'h-8 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto'
}

export function ConferenceLogo({ 
  variant = 'auto', 
  size = 'md', 
  className, 
  ...props 
}: ConferenceLogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getLogoVariant = () => {
    if (variant !== 'auto') {
      // Map simple variants to actual file names
      const variantMap: Record<string, string> = {
        'primary': 'primary',
        'white': 'primary_white', 
        'black': 'primary_black',
        'reversed': 'primary_reversed',
        'primary_white': 'primary_white',
        'primary_black': 'primary_black', 
        'primary_reversed': 'primary_reversed'
      }
      return variantMap[variant] || 'primary'
    }
    
    if (!mounted) return 'primary' // Default during SSR
    
    const currentTheme = theme === 'system' ? systemTheme : theme
    return currentTheme === 'dark' ? 'primary_white' : 'primary'
  }

  const logoVariant = getLogoVariant()
  const logoPath = `/assets/logos/conferences/big_12_${logoVariant}.svg`

  return (
    <img
      src={logoPath}
      alt="Big 12 Conference"
      className={cn(
        sizeClasses[size],
        'object-contain',
        className
      )}
      {...props}
    />
  )
}