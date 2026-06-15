export interface Empresa {
  nombre?: string
  comercial?: string
  nit?: string
  departamento?: string
  provincia?: string
  zona?: string
  direccion?: string
  telefono?: string
  actividad?: string
  otras?: string
  horas?: string
}

export interface Cambio {
  id: string
  version: string
  fecha: string
  descripcion: string
  cargoElab: string
  nombreElab: string
  cargoRev: string
  nombreRev: string
  cargoApr: string
  nombreApr: string
}

export interface IPER {
  id: string
  riesgo: string
  causa: string
  consecuencias: number
  exposicion: number
  probabilidad: number
  gp: number
  nivel: string
  controles: string
}

export interface Accidente {
  id: string
  mes: string
  dias: number
  trabajadores: number
  horasDiarias: number
  hh: number
  total: number
  sinBaja: number
  conBaja: number
  diasBaja: number
  aclaracion: string
  if: number
  ig: number
  ii: number
}

export interface Capacitacion {
  id: string
  tema: string
  tipo: string
  fecha: string
  instructor: string
  participantes: number
  duracion: number
}

export interface EPP {
  id: string
  trabajador: string
  cargo: string
  epp: string
  cantidad: number
  fecha: string
  observaciones: string
}

export interface Inspeccion {
  id: string
  fecha: string
  lugar: string
  responsable: string
  tipo: string
  hallazgos: string
  recomendaciones: string
  estado: string
}

export type ModuleKey = 'empresa' | 'cambios' | 'iper' | 'accidentes' | 'capacitaciones' | 'epp' | 'inspecciones'

export const NIVEL_RIESGO = {
  'Muy Alto': { color: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400', min: 400 },
  Alto: { color: 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400', min: 200 },
  Notable: { color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400', min: 85 },
  Moderado: { color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400', min: 18 },
  Bajo: { color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400', min: 0 },
} as const

export function calcNivel(gp: number): string {
  if (gp > 400) return 'Muy Alto'
  if (gp > 200) return 'Alto'
  if (gp > 85) return 'Notable'
  if (gp > 18) return 'Moderado'
  return 'Bajo'
}
