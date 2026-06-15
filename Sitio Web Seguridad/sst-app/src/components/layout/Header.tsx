import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Moon, Sun, FileText, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'
import { links } from './Sidebar'
import { cn } from '@/lib/utils'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close mobile navigation drawer when location changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent scrolling behind the drawer when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <FileText className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <h1 className="text-sm font-semibold leading-tight sm:text-base">
              Programa de Gestión de Seguridad y Salud en el Trabajo
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Sistema de registro y seguimiento SST
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Drawer Portal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-col bg-background p-6 shadow-xl animate-slide-in">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg text-foreground">SST Menú</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú"
                className="h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t pt-4 mt-auto">
              <p className="text-xs text-muted-foreground text-center">
                SST &copy; 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
