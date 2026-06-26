import { Link } from 'react-router-dom'
import { Building2, FileStack, AlertTriangle, BarChart3, GraduationCap, ShieldCheck, ClipboardCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ModulePage from '@/components/shared/ModulePage'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc } from 'firebase/firestore'
import { useUserDb } from '@/hooks/useUserDb'

const modules = [
  { key: 'cambios' as const, label: 'Control Cambios', icon: FileStack, desc: 'Versiones y revisiones' },
  { key: 'iper' as const, label: 'Matriz IPER', icon: AlertTriangle, desc: 'Evaluación de riesgos' },
  { key: 'accidentes' as const, label: 'Accidentes', icon: BarChart3, desc: 'Estadísticas mensuales' },
  { key: 'capacitaciones' as const, label: 'Capacitaciones', icon: GraduationCap, desc: 'Registro de formación' },
  { key: 'epp' as const, label: 'Dotación EPP', icon: ShieldCheck, desc: 'Equipos de protección' },
  { key: 'inspecciones' as const, label: 'Inspecciones', icon: ClipboardCheck, desc: 'Inspecciones internas' },
]

export default function DashboardPage() {
  const { getCollection, getDoc } = useUserDb()
  const [empresa, setEmpresa] = useState<any>(null)
  const [activeCounts, setActiveCounts] = useState({
    cambios: 0,
    iper: 0,
    accidentes: 0,
    capacitaciones: 0,
    epp: 0,
    inspecciones: 0,
  })

  useEffect(() => {
    const unsubEmpresa = onSnapshot(getDoc('empresa', 'info'), (docSnap) => {
      if (docSnap.exists()) {
        setEmpresa(docSnap.data())
      } else {
        setEmpresa(null)
      }
    })

    const collections = ['cambios', 'iper', 'accidentes', 'capacitaciones', 'epp', 'inspecciones'] as const
    const unsubs = collections.map((col) => {
      return onSnapshot(getCollection(col), (snapshot) => {
        setActiveCounts((prev) => ({
          ...prev,
          [col]: snapshot.size,
        }))
      })
    })

    return () => {
      unsubEmpresa()
      unsubs.forEach((unsub) => unsub())
    }
  }, [])

  const empresaNombre = empresa?.nombre || 'Empresa no registrada'
  const empresaNit = empresa?.nit ? `NIT: ${empresa.nit}` : 'NIT no registrado'
  const empresaActividad = empresa?.actividad || 'Actividad principal no configurada'

  return (
    <ModulePage title="Dashboard" description="Resumen del sistema de gestión SST">
      <div className="space-y-6">
        {/* Banner de Empresa Registrada */}
        <Card className="premium-card bg-gradient-to-br from-primary/5 via-indigo-500/5 to-transparent border-primary/15">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  {empresaNombre}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{empresaNit}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <span>{empresaActividad}</span>
                </p>
              </div>
            </div>
            <Link to="/empresa" className="shrink-0">
              <Button variant="outline" size="sm" className="hover:bg-accent/80 transition-all duration-200">
                Gestionar Empresa
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map(({ key, label, icon: Icon, desc }) => {
            const count = activeCounts[key]
            return (
              <Link key={key} to={`/${key}`} className="block">
                <Card className="premium-card cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-primary/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-extrabold tracking-tight text-foreground">{count}</div>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>


      </div>
    </ModulePage>
  )
}

