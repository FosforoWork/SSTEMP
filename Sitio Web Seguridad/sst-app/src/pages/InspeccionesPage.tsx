import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { collection, onSnapshot, query, setDoc, deleteDoc } from 'firebase/firestore'
import { useUserDb } from '@/hooks/useUserDb'
import { genId } from '@/lib/storage'
import { downloadCSV } from '@/lib/csv'
import type { Inspeccion } from '@/types'

const emptyForm: Omit<Inspeccion, 'id'> = {
  fecha: '', lugar: '', responsable: '', tipo: 'General',
  hallazgos: '', recomendaciones: '', estado: 'Pendiente',
}

const ESTADO_VARIANT: Record<string, 'destructive' | 'warning' | 'success'> = {
  Pendiente: 'destructive',
  'En proceso': 'warning',
  Completada: 'success',
}

export default function InspeccionesPage() {
  const { getCollection, getDoc } = useUserDb()
  const [list, setList] = useState<Inspeccion[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(getCollection('inspecciones'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inspeccion))
      setList(items)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const id = editing || genId()
      await setDoc(getDoc('inspecciones', id), { id, ...form })
      if (editing) {
        toast.success('Inspección actualizada')
      } else {
        toast.success('Inspección agregada')
      }
      setForm(emptyForm); setEditing(null); setOpen(false)
    } catch (err) {
      toast.error('Error al guardar la inspección')
      console.error(err)
    }
  }

  const handleEdit = (r: Inspeccion) => {
    setForm({ fecha: r.fecha, lugar: r.lugar, responsable: r.responsable, tipo: r.tipo, hallazgos: r.hallazgos, recomendaciones: r.recomendaciones, estado: r.estado })
    setEditing(r.id); setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(getDoc('inspecciones', id))
      toast.success('Inspección eliminada')
    } catch (err) {
      toast.error('Error al eliminar la inspección')
      console.error(err)
    }
  }

  const handleExport = () => {

    const headers = ['Fecha', 'Lugar', 'Responsable', 'Tipo', 'Hallazgos', 'Recomendaciones', 'Estado']
    const rows = list.map(r => [r.fecha, r.lugar, r.responsable, r.tipo, r.hallazgos, r.recomendaciones, r.estado])
    downloadCSV('sst_inspecciones', headers, rows)
  }

  return (
    <ModulePage title="Inspecciones Internas" description="Registro de inspecciones de seguridad" onExportCSV={handleExport}
      action={
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) }}}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Nueva Inspección</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nueva'} inspección</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></div>
                <div><Label>Lugar / Área</Label><Input value={form.lugar} onChange={e => setForm(p => ({ ...p, lugar: e.target.value }))} /></div>
                <div><Label>Responsable</Label><Input value={form.responsable} onChange={e => setForm(p => ({ ...p, responsable: e.target.value }))} /></div>
                <div><Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Eléctrica">Eléctrica</SelectItem>
                      <SelectItem value="Mecánica">Mecánica</SelectItem>
                      <SelectItem value="Estructural">Estructural</SelectItem>
                      <SelectItem value="Higiene">Higiene</SelectItem>
                      <SelectItem value="Emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Hallazgos</Label><Textarea value={form.hallazgos} onChange={e => setForm(p => ({ ...p, hallazgos: e.target.value }))} /></div>
              <div><Label>Recomendaciones</Label><Textarea value={form.recomendaciones} onChange={e => setForm(p => ({ ...p, recomendaciones: e.target.value }))} /></div>
              <div><Label>Estado</Label>
                <Select value={form.estado} onValueChange={v => setForm(p => ({ ...p, estado: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En proceso">En proceso</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{editing ? 'Actualizar' : 'Agregar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <FormCard title="Registro de Inspecciones">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No hay inspecciones registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead><TableHead>Lugar</TableHead><TableHead>Responsable</TableHead>
                <TableHead>Tipo</TableHead><TableHead>Hallazgos</TableHead><TableHead>Recomendaciones</TableHead>
                <TableHead>Estado</TableHead><TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.fecha || '-'}</TableCell>
                  <TableCell className="font-medium">{r.lugar || '-'}</TableCell>
                  <TableCell>{r.responsable || '-'}</TableCell>
                  <TableCell>{r.tipo}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs">{r.hallazgos || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs">{r.recomendaciones || '-'}</TableCell>
                  <TableCell><Badge variant={ESTADO_VARIANT[r.estado] || 'default'}>{r.estado}</Badge></TableCell>
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
