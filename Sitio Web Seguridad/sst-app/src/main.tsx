import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { migrateLocalStorageToIndexedDB } from '@/lib/migration'

// Ejecutar la migración al inicio
migrateLocalStorageToIndexedDB().catch(err => {
  console.error('Error al inicializar la base de datos local:', err)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

