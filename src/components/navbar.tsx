'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Trophy,
  DollarSign,
  Calendar,
  Cloud,
  Route,
  Building,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Overview of all HELiiX operations'
  },
  {
    name: 'FlexTime',
    href: '/scheduling',
    icon: Calendar,
    description: 'AI-powered intelligent scheduling'
  },
  {
    name: 'Weather',
    href: '/weather',
    icon: Cloud,
    description: 'Real-time weather command center'
  },
  {
    name: 'Awards',
    href: '/awards',
    icon: Trophy,
    description: 'Award management and tracking',
    subItems: [
      { name: 'Categories', href: '/awards/categories' },
      { name: 'Recipients', href: '/awards/recipients' }
    ]
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: DollarSign,
    description: 'Financial intelligence and budgets',
    subItems: [
      { name: 'Budgets', href: '/finance/budgets' },
      { name: 'Distributions', href: '/finance/distributions' }
    ]
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users,
    description: 'Team and venue management',
    subItems: [
      { name: 'Schools', href: '/teams/schools' },
      { name: 'Travel', href: '/teams/travel' },
      { name: 'Venues', href: '/teams/venues' }
    ]
  },
  {
    name: 'Operations',
    href: '/operations',
    icon: Settings,
    description: 'System operations and monitoring'
  }
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div className="hidden font-bold text-xl sm:block">
              HEL<span className="text-blue-600">ii</span>X
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-1">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.subItems ? (
                    <>
                      <NavigationMenuTrigger 
                        className={`${
                          isActive(item.href) 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                        } px-3 py-2 text-sm font-medium`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-80 gap-3 p-4">
                          <div className="row-span-3">
                            <div className="mb-2 text-sm font-medium">{item.description}</div>
                            <div className="space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`block rounded-md px-3 py-2 text-sm ${
                                    pathname === subItem.href
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                      } inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {/* User Profile */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Nick Williams</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Big 12 Conference</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">NW</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2 border-t">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  } flex items-center rounded-md px-3 py-2 text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
                {item.subItems && (
                  <div className="ml-8 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`${
                          pathname === subItem.href
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                        } block rounded-md px-3 py-2 text-sm`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile user profile */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center px-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">NW</span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Nick Williams</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Big 12 Conference</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}