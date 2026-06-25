import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { collection, onSnapshot, query, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { genId } from '@/lib/storage'
import { downloadCSV } from '@/lib/csv'
import type { Capacitacion } from '@/types'

const emptyForm: Omit<Capacitacion, 'id'> = {
  tema: '', tipo: 'Inducción', fecha: '', instructor: '', participantes: 0, duracion: 0,
}

export default function CapacitacionesPage() {
  const [list, setList] = useState<Capacitacion[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(collection(db, 'capacitaciones'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Capacitacion))
      setList(items)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const id = editing || genId()
      await setDoc(doc(db, 'capacitaciones', id), { id, ...form })
      if (editing) {
        toast.success('Capacitación actualizada')
      } else {
        toast.success('Capacitación agregada')
      }
      setForm(emptyForm); setEditing(null); setOpen(false)
    } catch (err) {
      toast.error('Error al guardar la capacitación')
      console.error(err)
    }
  }

  const handleEdit = (r: Capacitacion) => {
    setForm({ tema: r.tema, tipo: r.tipo, fecha: r.fecha, instructor: r.instructor, participantes: r.participantes, duracion: r.duracion })
    setEditing(r.id); setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'capacitaciones', id))
      toast.success('Capacitación eliminada')
    } catch (err) {
      toast.error('Error al eliminar la capacitación')
      console.error(err)
    }
  }

  const handleExport = () => {
    const headers = ['Tema', 'Tipo', 'Fecha', 'Instructor', 'Participantes', 'Duración (h)']
    const rows = list.map(r => [r.tema, r.tipo, r.fecha, r.instructor, String(r.participantes), String(r.duracion)])
    downloadCSV('sst_capacitaciones', headers, rows)
  }

  return (
    <ModulePage title="Capacitaciones" description="Registro de inducciones, conciencia y seguridad" onExportCSV={handleExport}
      action={
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) }}}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Nueva Capacitación</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nueva'} capacitación</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Tema</Label><Input value={form.tema} onChange={e => setForm(p => ({ ...p, tema: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inducción">Inducción</SelectItem>
                      <SelectItem value="Conciencia">Conciencia de Seguridad</SelectItem>
                      <SelectItem value="Seguridad">Seguridad Especializada</SelectItem>
                      <SelectItem value="Prevención">Prevención</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></div>
                <div><Label>Instructor</Label><Input value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} /></div>
                <div><Label>Participantes</Label><Input type="number" value={form.participantes || ''} onChange={e => setForm(p => ({ ...p, participantes: +e.target.value }))} /></div>
                <div><Label>Duración (horas)</Label><Input type="number" step="0.5" value={form.duracion || ''} onChange={e => setForm(p => ({ ...p, duracion: +e.target.value }))} /></div>
              </div>
              <Button type="submit">{editing ? 'Actualizar' : 'Agregar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <FormCard title="Registro de Capacitaciones">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No hay capacitaciones registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tema</TableHead><TableHead>Tipo</TableHead><TableHead>Fecha</TableHead>
                <TableHead>Instructor</TableHead><TableHead>Particip.</TableHead><TableHead>Duración</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.tema || '-'}</TableCell>
                  <TableCell>{r.tipo}</TableCell>
                  <TableCell>{r.fecha || '-'}</TableCell>
                  <TableCell>{r.instructor || '-'}</TableCell>
                  <TableCell>{r.participantes}</TableCell>
                  <TableCell>{r.duracion ? `${r.duracion} h` : '-'}</TableCell>
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
