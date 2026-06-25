import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { collection, onSnapshot, query, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { genId } from '@/lib/storage'
import { downloadCSV } from '@/lib/csv'
import type { EPP } from '@/types'

const emptyForm: Omit<EPP, 'id'> = {
  trabajador: '', cargo: '', epp: '', cantidad: 1, fecha: '', observaciones: '',
}

export default function EPPPage() {
  const [list, setList] = useState<EPP[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(collection(db, 'epp'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EPP))
      setList(items)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const id = editing || genId()
      await setDoc(doc(db, 'epp', id), { id, ...form })
      if (editing) {
        toast.success('Dotación actualizada')
      } else {
        toast.success('Dotación agregada')
      }
      setForm(emptyForm); setEditing(null); setOpen(false)
    } catch (err) {
      toast.error('Error al guardar la dotación')
      console.error(err)
    }
  }

  const handleEdit = (r: EPP) => {
    setForm({ trabajador: r.trabajador, cargo: r.cargo, epp: r.epp, cantidad: r.cantidad, fecha: r.fecha, observaciones: r.observaciones })
    setEditing(r.id); setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'epp', id))
      toast.success('Dotación personalizada')
    } catch (err) {
      toast.error('Error al eliminar la dotación')
      console.error(err)
    }
  }

  const handleExport = () => {
    const headers = ['Trabajador', 'Cargo', 'EPP', 'Cantidad', 'Fecha', 'Observaciones']
    const rows = list.map(r => [r.trabajador, r.cargo, r.epp, String(r.cantidad), r.fecha, r.observaciones])
    downloadCSV('sst_epp', headers, rows)
  }

  return (
    <ModulePage title="Dotación de EPP" description="Registro de entrega de equipos de protección personal" onExportCSV={handleExport}
      action={
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) }}}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Nueva Dotación</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nueva'} dotación de EPP</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Trabajador</Label><Input value={form.trabajador} onChange={e => setForm(p => ({ ...p, trabajador: e.target.value }))} /></div>
                <div><Label>Cargo</Label><Input value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))} /></div>
                <div><Label>EPP Entregado</Label><Input value={form.epp} onChange={e => setForm(p => ({ ...p, epp: e.target.value }))} /></div>
                <div><Label>Cantidad</Label><Input type="number" min="1" value={form.cantidad || ''} onChange={e => setForm(p => ({ ...p, cantidad: +e.target.value }))} /></div>
                <div><Label>Fecha de Entrega</Label><Input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></div>
                <div><Label>Observaciones</Label><Input value={form.observaciones} onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))} /></div>
              </div>
              <Button type="submit">{editing ? 'Actualizar' : 'Agregar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <FormCard title="Registro de Dotación de EPP">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No hay dotaciones registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trabajador</TableHead><TableHead>Cargo</TableHead><TableHead>EPP</TableHead>
                <TableHead>Cant.</TableHead><TableHead>Fecha</TableHead><TableHead>Observaciones</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.trabajador || '-'}</TableCell>
                  <TableCell>{r.cargo || '-'}</TableCell>
                  <TableCell>{r.epp || '-'}</TableCell>
                  <TableCell>{r.cantidad}</TableCell>
                  <TableCell>{r.fecha || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs">{r.observaciones || '-'}</TableCell>
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
