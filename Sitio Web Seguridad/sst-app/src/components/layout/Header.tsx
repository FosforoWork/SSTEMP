import { Moon, Sun, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
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
  )
}
