import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { collection, onSnapshot, query, setDoc, deleteDoc } from 'firebase/firestore'
import { useUserDb } from '@/hooks/useUserDb'
import { genId } from '@/lib/storage'
import { downloadCSV } from '@/lib/csv'
import { calcNivel } from '@/types'
import type { IPER } from '@/types'

const emptyForm: Omit<IPER, 'id' | 'gp' | 'nivel'> = {
  riesgo: '', causa: '', consecuencias: 0, exposicion: 0, probabilidad: 0, controles: '',
}

const NIVEL_VARIANT: Record<string, 'danger' | 'warning' | 'default' | 'success' | 'info'> = {
  'Muy Alto': 'danger',
  Alto: 'warning',
  Notable: 'default',
  Moderado: 'success',
  Bajo: 'info',
}

export default function IPERPage() {
  const { getCollection, getDoc } = useUserDb()
  const [list, setList] = useState<IPER[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(getCollection('iper'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IPER))
      setList(items)
    })
    return () => unsubscribe()
  }, [])

  const gp = useMemo(() => form.consecuencias * form.exposicion * form.probabilidad, [form.consecuencias, form.exposicion, form.probabilidad])
  const nivel = useMemo(() => calcNivel(gp), [gp])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const record = { ...form, gp, nivel }
    try {
      const id = editing || genId()
      await setDoc(getDoc('iper', id), { id, ...record })
      if (editing) {
        toast.success('Riesgo actualizado')
      } else {
        toast.success('Riesgo agregado')
      }
      setForm(emptyForm); setEditing(null); setOpen(false)
    } catch (err) {
      toast.error('Error al guardar el riesgo')
      console.error(err)
    }
  }

  const handleEdit = (r: IPER) => {
    setForm({ riesgo: r.riesgo, causa: r.causa, consecuencias: r.consecuencias, exposicion: r.exposicion, probabilidad: r.probabilidad, controles: r.controles })
    setEditing(r.id); setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(getDoc('iper', id))
      toast.success('Riesgo eliminado')
    } catch (err) {
      toast.error('Error al eliminar el riesgo')
      console.error(err)
    }
  }

  const handleExport = () => {
    const headers = ['Riesgo identificado', 'Causa', 'C', 'E', 'P', 'GP', 'Nivel', 'Controles']
    const rows = list.map(r => [r.riesgo, r.causa, String(r.consecuencias), String(r.exposicion), String(r.probabilidad), String(r.gp), r.nivel, r.controles])
    downloadCSV('sst_iper', headers, rows)
  }

  return (
    <ModulePage title="Matriz IPER" description="Identificación de Peligros y Evaluación de Riesgos (Método Fine)" onExportCSV={handleExport}
      action={
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) }}}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Nuevo Riesgo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nuevo'} riesgo</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Riesgo Identificado</Label><Input value={form.riesgo} onChange={e => setForm(p => ({ ...p, riesgo: e.target.value }))} /></div>
              <div><Label>Causa y Contexto</Label><Textarea value={form.causa} onChange={e => setForm(p => ({ ...p, causa: e.target.value }))} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Consecuencias (C)</Label><Input type="number" value={form.consecuencias || ''} onChange={e => setForm(p => ({ ...p, consecuencias: +e.target.value }))} /></div>
                <div><Label>Exposición (E)</Label><Input type="number" step="0.1" value={form.exposicion || ''} onChange={e => setForm(p => ({ ...p, exposicion: +e.target.value }))} /></div>
                <div><Label>Probabilidad (P)</Label><Input type="number" step="0.1" value={form.probabilidad || ''} onChange={e => setForm(p => ({ ...p, probabilidad: +e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Grado Peligrosidad (GP)</Label><Input value={gp || ''} readOnly className="font-bold" /></div>
                <div><Label>Nivel de Riesgo</Label><Input value={nivel} readOnly className="font-semibold" /></div>
              </div>
              <div><Label>Controles Propuestos</Label><Textarea value={form.controles} onChange={e => setForm(p => ({ ...p, controles: e.target.value }))} /></div>
              <Button type="submit">{editing ? 'Actualizar' : 'Agregar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <FormCard title="Matriz de Riesgos">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No hay riesgos registrados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Riesgo</TableHead><TableHead>Causa</TableHead>
                <TableHead className="w-10">C</TableHead><TableHead className="w-10">E</TableHead><TableHead className="w-10">P</TableHead>
                <TableHead className="w-14">GP</TableHead><TableHead className="w-24">Nivel</TableHead>
                <TableHead>Controles</TableHead><TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.riesgo}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs">{r.causa}</TableCell>
                  <TableCell>{r.consecuencias}</TableCell>
                  <TableCell>{r.exposicion}</TableCell>
                  <TableCell>{r.probabilidad}</TableCell>
                  <TableCell className="font-bold">{r.gp}</TableCell>
                  <TableCell><Badge variant={NIVEL_VARIANT[r.nivel] || 'default'}>{r.nivel}</Badge></TableCell>
                  <TableCell className="max-w-xs truncate text-xs">{r.controles}</TableCell>
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
