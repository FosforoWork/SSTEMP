import type { ModuleKey, Empresa, Cambio, IPER, Accidente, Capacitacion, EPP, Inspeccion } from '@/types'

type ModuleData = {
  empresa: Empresa
  cambios: Cambio[]
  iper: IPER[]
  accidentes: Accidente[]
  capacitaciones: Capacitacion[]
  epp: EPP[]
  inspecciones: Inspeccion[]
}

const DEFAULTS: ModuleData = {
  empresa: {},
  cambios: [],
  iper: [],
  accidentes: [],
  capacitaciones: [],
  epp: [],
  inspecciones: [],
}

export function getModule<K extends ModuleKey>(module: K): ModuleData[K] {
  try {
    const stored = localStorage.getItem('sst_' + module)
    return stored ? JSON.parse(stored) : DEFAULTS[module]
  } catch {
    return DEFAULTS[module]
  }
}

export function setModule<K extends ModuleKey>(module: K, data: ModuleData[K]) {
  localStorage.setItem('sst_' + module, JSON.stringify(data))
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
