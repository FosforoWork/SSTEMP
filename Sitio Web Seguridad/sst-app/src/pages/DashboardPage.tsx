import { Building2, FileStack, AlertTriangle, BarChart3, GraduationCap, ShieldCheck, ClipboardCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getModule } from '@/lib/storage'
import ModulePage from '@/components/shared/ModulePage'

const modules = [
  { key: 'empresa' as const, label: 'Empresa', icon: Building2, desc: 'Datos de la compañía' },
  { key: 'cambios' as const, label: 'Control Cambios', icon: FileStack, desc: 'Versiones y revisiones' },
  { key: 'iper' as const, label: 'Matriz IPER', icon: AlertTriangle, desc: 'Evaluación de riesgos' },
  { key: 'accidentes' as const, label: 'Accidentes', icon: BarChart3, desc: 'Estadísticas mensuales' },
  { key: 'capacitaciones' as const, label: 'Capacitaciones', icon: GraduationCap, desc: 'Registro de formación' },
  { key: 'epp' as const, label: 'Dotación EPP', icon: ShieldCheck, desc: 'Equipos de protección' },
  { key: 'inspecciones' as const, label: 'Inspecciones', icon: ClipboardCheck, desc: 'Inspecciones internas' },
]

export default function DashboardPage() {
  return (
    <ModulePage title="Dashboard" description="Resumen del sistema de gestión SST">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map(({ key, label, icon: Icon, desc }) => {
          const data = getModule(key)
          const count = Array.isArray(data) ? data.length : Object.keys(data).length > 0 ? 1 : 0
          return (
            <Card key={key} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ModulePage>
  )
}
