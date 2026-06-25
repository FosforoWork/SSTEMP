import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { downloadCSV } from '@/lib/csv'
import type { Empresa } from '@/types'

const FIELDS: { id: keyof Empresa; label: string }[] = [
  { id: 'nombre', label: 'Nombre de la empresa' },
  { id: 'comercial', label: 'Nombre Comercial' },
  { id: 'nit', label: 'Nº de NIT' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'provincia', label: 'Provincia' },
  { id: 'zona', label: 'Zona' },
  { id: 'direccion', label: 'Dirección de actividades' },
  { id: 'telefono', label: 'Número de Teléfono' },
  { id: 'actividad', label: 'Actividad Principal' },
  { id: 'otras', label: 'Otras actividades' },
  { id: 'horas', label: 'Horas de trabajo' },
]

export default function EmpresaPage() {
  const [data, setData] = useState<Empresa>({})

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'empresa', 'info'), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as Empresa)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleChange = (field: keyof Empresa, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await setDoc(doc(db, 'empresa', 'info'), data)
      toast.success('Datos de la empresa guardados')
    } catch (err) {
      toast.error('Error al guardar datos de la empresa')
      console.error(err)
    }
  }

  const handleExport = () => {
    downloadCSV('sst_empresa', ['Campo', 'Valor'], FIELDS.map(f => [f.label, data[f.id] ?? '']))
  }

  const hasData = Object.values(data).some(v => v)

  return (
    <ModulePage title="Empresa" description="Información general de la compañía" onExportCSV={handleExport}>
      <FormCard title="Datos de la empresa">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map(({ id, label }) => (
              <div key={id} className={id === 'direccion' || id === 'otras' ? 'sm:col-span-2' : ''}>
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} value={data[id] ?? ''} onChange={e => handleChange(id, e.target.value)} />
              </div>
            ))}
          </div>
          <Button type="submit">
            <Save className="h-4 w-4" />
            Guardar Empresa
          </Button>
        </form>
      </FormCard>

      {hasData && (
        <Card>
          <CardHeader><CardTitle className="text-base">Datos Registrados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FIELDS.map(({ id, label }) =>
                  data[id] ? (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell>{data[id]}</TableCell>
                    </TableRow>
                  ) : null
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </ModulePage>
  )
}

