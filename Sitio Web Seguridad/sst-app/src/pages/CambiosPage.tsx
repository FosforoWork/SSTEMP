import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { collection, onSnapshot, query, setDoc, deleteDoc } from 'firebase/firestore'
import { useUserDb } from '@/hooks/useUserDb'
import { genId } from '@/lib/storage'
import { downloadCSV } from '@/lib/csv'
import type { Cambio } from '@/types'

const emptyForm: Omit<Cambio, 'id'> = {
  version: '', fecha: '', descripcion: '',
  cargoElab: '', nombreElab: '', cargoRev: '', nombreRev: '', cargoApr: '', nombreApr: '',
}

export default function CambiosPage() {
  const { getCollection, getDoc } = useUserDb()
  const [list, setList] = useState<Cambio[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(getCollection('cambios'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cambio))
      setList(items)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const id = editing || genId()
      await setDoc(getDoc('cambios', id), { id, ...form })
      if (editing) {
        toast.success('Registro actualizado')
      } else {
        toast.success('Registro agregado')
      }
      setForm(emptyForm)
      setEditing(null)
      setOpen(false)
    } catch (err) {
      toast.error('Error al guardar el registro')
      console.error(err)
    }
  }

  const handleEdit = (r: Cambio) => {
    setForm({
      version: r.version, fecha: r.fecha, descripcion: r.descripcion,
      cargoElab: r.cargoElab, nombreElab: r.nombreElab,
      cargoRev: r.cargoRev, nombreRev: r.nombreRev,
      cargoApr: r.cargoApr, nombreApr: r.nombreApr,
    })
    setEditing(r.id)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(getDoc('cambios', id))
      toast.success('Registro eliminado')
    } catch (err) {
      toast.error('Error al eliminar el registro')
      console.error(err)
    }
  }

  const handleExport = () => {
    const headers = ['Versión', 'Fecha', 'Descripción', 'Elaboración Cargo', 'Elaboración Nombre', 'Revisión Cargo', 'Revisión Nombre', 'Aprobación Cargo', 'Aprobación Nombre']
    const rows = list.map(r => [r.version, r.fecha, r.descripcion, r.cargoElab, r.nombreElab, r.cargoRev, r.nombreRev, r.cargoApr, r.nombreApr])
    downloadCSV('sst_cambios', headers, rows)
  }


  return (
    <ModulePage title="Control de Cambios" description="Registro de versiones y revisiones del documento" onExportCSV={handleExport}
      action={
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) }}}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Nuevo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nuevo'} registro de cambio</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Versión</Label><Input value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} /></div>
                <div><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></div>
                <div className="sm:col-span-2"><Label>Descripción de cambios</Label><Textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} /></div>
                <div><Label>Cargo - Elaboración</Label><Input value={form.cargoElab} onChange={e => setForm(p => ({ ...p, cargoElab: e.target.value }))} /></div>
                <div><Label>Nombre - Elaboración</Label><Input value={form.nombreElab} onChange={e => setForm(p => ({ ...p, nombreElab: e.target.value }))} /></div>
                <div><Label>Cargo - Revisión</Label><Input value={form.cargoRev} onChange={e => setForm(p => ({ ...p, cargoRev: e.target.value }))} /></div>
                <div><Label>Nombre - Revisión</Label><Input value={form.nombreRev} onChange={e => setForm(p => ({ ...p, nombreRev: e.target.value }))} /></div>
                <div><Label>Cargo - Aprobación</Label><Input value={form.cargoApr} onChange={e => setForm(p => ({ ...p, cargoApr: e.target.value }))} /></div>
                <div><Label>Nombre - Aprobación</Label><Input value={form.nombreApr} onChange={e => setForm(p => ({ ...p, nombreApr: e.target.value }))} /></div>
              </div>
              <Button type="submit">{editing ? 'Actualizar' : 'Agregar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <FormCard title="Registros de Control de Cambios">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No hay registros. Crea uno nuevo.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Versión</TableHead><TableHead>Fecha</TableHead><TableHead>Descripción</TableHead>
                <TableHead>Elaboración</TableHead><TableHead>Revisión</TableHead><TableHead>Aprobación</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.version || '-'}</TableCell>
                  <TableCell>{r.fecha || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{r.descripcion || '-'}</TableCell>
                  <TableCell className="text-xs">{r.cargoElab && `${r.cargoElab}: ${r.nombreElab}`}</TableCell>
                  <TableCell className="text-xs">{r.cargoRev && `${r.cargoRev}: ${r.nombreRev}`}</TableCell>
                  <TableCell className="text-xs">{r.cargoApr && `${r.cargoApr}: ${r.nombreApr}`}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </FormCard>
    </ModulePage>
  )
}
