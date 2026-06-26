import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { PublicRoute } from '@/components/layout/PublicRoute'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import EmpresaPage from '@/pages/EmpresaPage'
import CambiosPage from '@/pages/CambiosPage'
import IPERPage from '@/pages/IPERPage'
import AccidentesPage from '@/pages/AccidentesPage'
import CapacitacionesPage from '@/pages/CapacitacionesPage'
import EPPPage from '@/pages/EPPPage'
import InspeccionesPage from '@/pages/InspeccionesPage'

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground/85 font-medium">
            Desarrollado por <span className="font-semibold text-foreground/75">Samuel Aguilera</span> | Licencia MIT | &copy; 2026
          </footer>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/empresa" element={<EmpresaPage />} />
                <Route path="/cambios" element={<CambiosPage />} />
                <Route path="/iper" element={<IPERPage />} />
                <Route path="/accidentes" element={<AccidentesPage />} />
                <Route path="/capacitaciones" element={<CapacitacionesPage />} />
                <Route path="/epp" element={<EPPPage />} />
                <Route path="/inspecciones" element={<InspeccionesPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" richColors closeButton />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

