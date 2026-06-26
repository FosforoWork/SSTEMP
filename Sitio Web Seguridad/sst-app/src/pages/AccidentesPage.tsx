import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ModulePage, { FormCard } from '@/components/shared/ModulePage'
import { collection, onSnapshot, query, setDoc, deleteDoc } from 'firebase/firestore'
import { useUserDb } from '@/hooks/useUserDb'
import { genId } from '@/lib/storage'
import { downloadCSV } from '@/lib/csv'
import type { Accidente } from '@/types'

const emptyForm: Omit<Accidente, 'id' | 'hh' | 'if' | 'ig' | 'ii'> = {
  mes: '', dias: 0, trabajadores: 0, horasDiarias: 0,
  total: 0, sinBaja: 0, conBaja: 0, diasBaja: 0, aclaracion: '',
}

export default function AccidentesPage() {
  const { getCollection, getDoc } = useUserDb()
  const [list, setList] = useState<Accidente[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(getCollection('accidentes'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Accidente))
      setList(items)
    })
    return () => unsubscribe()
  }, [])

  const hh = useMemo(() => form.dias * form.trabajadores * form.horasDiarias, [form.dias, form.trabajadores, form.horasDiarias])
  const ifVal = useMemo(() => (hh > 0 ? (form.conBaja / hh) * 1000000 : 0), [hh, form.conBaja])
  const igVal = useMemo(() => (hh > 0 ? (form.diasBaja / hh) * 1000000 : 0), [hh, form.diasBaja])
  const iiVal = useMemo(() => (ifVal * igVal) / 1000, [ifVal, igVal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const record = { ...form, hh, if: ifVal, ig: igVal, ii: iiVal }
    try {
      const id = editing || genId()
      await setDoc(getDoc('accidentes', id), { id, ...record })
      if (editing) {
        toast.success('Estadística actualizada')
      } else {
        toast.success('Estadística agregada')
      }
      setForm(emptyForm); setEditing(null); setOpen(false)
    } catch (err) {
      toast.error('Error al guardar la estadística')
      console.error(err)
    }
  }

  const handleEdit = (r: Accidente) => {
    setForm({ mes: r.mes, dias: r.dias, trabajadores: r.trabajadores, horasDiarias: r.horasDiarias, total: r.total, sinBaja: r.sinBaja, conBaja: r.conBaja, diasBaja: r.diasBaja, aclaracion: r.aclaracion })
    setEditing(r.id); setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(getDoc('accidentes', id))
      toast.success('Estadística eliminada')
    } catch (err) {
      toast.error('Error al eliminar la estadística')
      console.error(err)
    }
  }

  const handleExport = () => {
    const headers = ['Mes', 'Días', 'Trabajadores', 'HH', 'Acc. Totales', 'Sin Baja', 'Con Baja', 'Días Baja', 'IF', 'IG', 'II', 'Aclaración']
    const rows = list.map(r => [r.mes, String(r.dias), String(r.trabajadores), String(r.hh.toFixed(0)), String(r.total), String(r.sinBaja), String(r.conBaja), String(r.diasBaja), r.if.toFixed(2), r.ig.toFixed(2), r.ii.toFixed(2), r.aclaracion])
    downloadCSV('sst_accidentes', headers, rows)
  }

  return (
    <ModulePage title="Estadísticas de Accidentes" description="Registro mensual de accidentabilidad con IF, IG e II" onExportCSV={handleExport}
      action={
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) }}}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> Nueva Estadística</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nueva'} estadística mensual</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Mes</Label><Input value={form.mes} onChange={e => setForm(p => ({ ...p, mes: e.target.value }))} placeholder="Ej: ene-23" /></div>
                <div><Label>Prom. días trabajados</Label><Input type="number" value={form.dias || ''} onChange={e => setForm(p => ({ ...p, dias: +e.target.value }))} /></div>
                <div><Label>Prom. trabajadores</Label><Input type="number" value={form.trabajadores || ''} onChange={e => setForm(p => ({ ...p, trabajadores: +e.target.value }))} /></div>
                <div><Label>Horas diarias</Label><Input type="number" step="0.5" value={form.horasDiarias || ''} onChange={e => setForm(p => ({ ...p, horasDiarias: +e.target.value }))} /></div>
                <div><Label>Horas Hombre (HH)</Label><Input value={hh.toFixed(0)} readOnly className="font-bold" /></div>
                <div><Label>Nº Accidentes Totales</Label><Input type="number" value={form.total || ''} onChange={e => setForm(p => ({ ...p, total: +e.target.value }))} /></div>
                <div><Label>Nº Sin Baja</Label><Input type="number" value={form.sinBaja || ''} onChange={e => setForm(p => ({ ...p, sinBaja: +e.target.value }))} /></div>
                <div><Label>Nº Con Baja</Label><Input type="number" value={form.conBaja || ''} onChange={e => setForm(p => ({ ...p, conBaja: +e.target.value }))} /></div>
                <div><Label>Días de Baja</Label><Input type="number" value={form.diasBaja || ''} onChange={e => setForm(p => ({ ...p, diasBaja: +e.target.value }))} /></div>
                <div><Label>Aclaración</Label><Input value={form.aclaracion} onChange={e => setForm(p => ({ ...p, aclaracion: e.target.value }))} /></div>
                <div><Label>IF Mensual</Label><Input value={ifVal ? ifVal.toFixed(2) : '0'} readOnly /></div>
                <div><Label>IG Mensual</Label><Input value={igVal ? igVal.toFixed(2) : '0'} readOnly /></div>
              </div>
              <Button type="submit">{editing ? 'Actualizar' : 'Agregar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <FormCard title="Estadísticas de Accidentabilidad">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No hay estadísticas registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead><TableHead>Días</TableHead><TableHead>Trab.</TableHead>
                <TableHead>HH</TableHead><TableHead>Acc.Tot</TableHead><TableHead>S/Baja</TableHead>
                <TableHead>C/Baja</TableHead><TableHead>Días Baja</TableHead>
                <TableHead>IF</TableHead><TableHead>IG</TableHead><TableHead>II</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.mes}</TableCell>
                  <TableCell>{r.dias}</TableCell><TableCell>{r.trabajadores}</TableCell>
                  <TableCell>{r.hh.toFixed(0)}</TableCell><TableCell>{r.total}</TableCell>
                  <TableCell>{r.sinBaja}</TableCell><TableCell>{r.conBaja}</TableCell>
                  <TableCell>{r.diasBaja}</TableCell>
                  <TableCell className="font-mono text-xs">{r.if.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-xs">{r.ig.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-xs">{r.ii.toFixed(2)}</TableCell>
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
