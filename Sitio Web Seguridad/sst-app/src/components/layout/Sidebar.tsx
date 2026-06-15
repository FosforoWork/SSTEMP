import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Building2, FileStack, AlertTriangle, BarChart3,
  GraduationCap, ShieldCheck, ClipboardCheck, LayoutDashboard,
} from 'lucide-react'

export const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/empresa', label: 'Empresa', icon: Building2 },
  { to: '/cambios', label: 'Control Cambios', icon: FileStack },
  { to: '/iper', label: 'Matriz IPER', icon: AlertTriangle },
  { to: '/accidentes', label: 'Accidentes', icon: BarChart3 },
  { to: '/capacitaciones', label: 'Capacitaciones', icon: GraduationCap },
  { to: '/epp', label: 'Dotación EPP', icon: ShieldCheck },
  { to: '/inspecciones', label: 'Inspecciones', icon: ClipboardCheck },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-60 border-r bg-muted/30">
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
      <div className="border-t p-3">
        <p className="text-xs text-muted-foreground text-center">SST &copy; 2026</p>
      </div>
    </aside>
  )
}
