import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { Shield, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Loader2 } from 'lucide-react'

// Esquema de validación para Login
const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Esquema de validación para Registro
const registerSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  // Formulario de Login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  // Formulario de Registro
  const {
    register: registerSignUp,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onLogin = async (data: LoginFormValues) => {
    setLoading(true)
    try {
      await login(data)
      toast.success('¡Sesión iniciada con éxito!')
    } catch (error: any) {
      console.error(error)
      let message = 'Error al iniciar sesión. Inténtalo de nuevo.'
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = 'Correo o contraseña incorrectos.'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Formato de correo inválido.'
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormValues) => {
    setLoading(true)
    try {
      await register({ email: data.email, password: data.password })
      toast.success('¡Cuenta creada con éxito!')
    } catch (error: any) {
      console.error(error)
      let message = 'Error al registrar el usuario. Inténtalo de nuevo.'
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este correo electrónico ya está registrado.'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Formato de correo inválido.'
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña es muy débil.'
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTab = (toLogin: boolean) => {
    setIsLogin(toLogin)
    resetLoginForm()
    resetRegisterForm()
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300">
        
        {/* Encabezado Logo */}
        <div className="flex flex-col items-center bg-gradient-to-b from-primary/10 to-transparent p-6 text-center">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary ring-8 ring-primary/5 mb-4 animate-pulse">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            SST Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de Seguridad y Salud en el Trabajo
          </p>
        </div>

        {/* Pestañas de control */}
        <div className="grid grid-cols-2 border-b border-border bg-muted/40 p-1 mx-6 rounded-lg">
          <button
            onClick={() => toggleTab(true)}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all duration-200 ${
              isLogin
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Iniciar Sesión
          </button>
          <button
            onClick={() => toggleTab(false)}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all duration-200 ${
              !isLogin
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Registrarse
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <div className="p-6">
          {isLogin ? (
            // Formulario de LOGIN
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="nombre@empresa.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    {...registerLogin('email')}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-xs font-medium text-destructive">{loginErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    {...registerLogin('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/80 hover:text-foreground disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-xs font-medium text-destructive">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>
          ) : (
            // Formulario de REGISTRO
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="reg-email">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="nombre@empresa.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    {...registerSignUp('email')}
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-xs font-medium text-destructive">{registerErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="reg-password">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    {...registerSignUp('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/80 hover:text-foreground disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerErrors.password && (
                  <p className="text-xs font-medium text-destructive">{registerErrors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="reg-confirm-password">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    {...registerSignUp('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/80 hover:text-foreground disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <p className="text-xs font-medium text-destructive">{registerErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
