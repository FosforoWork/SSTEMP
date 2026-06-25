import type { ReactNode } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface ModulePageProps {
  title: string
  description?: string
  action?: ReactNode
  onExportCSV?: () => void
  children: ReactNode
}

export default function ModulePage({ title, description, action, onExportCSV, children }: ModulePageProps) {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto py-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {action}
          {onExportCSV && (
            <Button variant="outline" size="sm" onClick={onExportCSV} className="rounded-xl hover:bg-accent/80 transition-all duration-200">
              <Download className="h-4 w-4 mr-1.5" />
              Exportar CSV
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="premium-card">
      <CardHeader className="border-b border-border/35 pb-4 mb-4">
        <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
