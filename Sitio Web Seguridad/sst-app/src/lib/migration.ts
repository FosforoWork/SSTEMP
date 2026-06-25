import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'
import type { ModuleKey } from '@/types'

export async function migrateLocalStorageToIndexedDB() {
  const keys: ModuleKey[] = ['empresa', 'cambios', 'iper', 'accidentes', 'capacitaciones', 'epp', 'inspecciones']
  let migratedAny = false

  for (const key of keys) {
    const localStorageKey = 'sst_' + key
    const stored = localStorage.getItem(localStorageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (key === 'empresa') {
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            await setDoc(doc(db, 'empresa', 'info'), parsed)
            migratedAny = true
          }
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          for (const item of parsed) {
            if (item && item.id) {
              await setDoc(doc(db, key, item.id), item)
            }
          }
          migratedAny = true
        }
      } catch (err) {
        console.error(`Error migrando módulo '${key}' a Firestore:`, err)
      }
    }
  }

  if (migratedAny) {
    for (const key of keys) {
      localStorage.removeItem('sst_' + key)
    }
    console.log('Migración automática de localStorage a Firestore completada con éxito.')
  }
}
