import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
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
  const [empresaNombre, setEmpresaNombre] = useState('Empresa no registrada')

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'empresa', 'info'), (docSnap) => {
      if (docSnap.exists()) {
        setEmpresaNombre((docSnap.data() as any).nombre || 'Empresa no registrada')
      } else {
        setEmpresaNombre('Empresa no registrada')
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-sidebar-background/60 backdrop-blur-sm">
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
          <Building2 className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground truncate" title={empresaNombre}>
            {empresaNombre}
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 border border-transparent',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10 border-primary/20'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-1'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4 space-y-1.5 bg-sidebar-background/20">
        <p className="text-[10px] text-muted-foreground text-center font-semibold tracking-wide">
          SISTEMA DE GESTIÓN SST
        </p>
        <p className="text-[9px] text-muted-foreground/80 text-center font-medium">
          Desarrollado por <span className="font-bold text-foreground/80">Samuel Aguilera</span>
        </p>
        <p className="text-[8px] text-muted-foreground/60 text-center uppercase tracking-wider">
          Licencia MIT &copy; 2026
        </p>
      </div>
    </aside>
  )
}
