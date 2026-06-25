# Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)

Este repositorio contiene la solución digital integral para el **Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)** de la organización. El proyecto está diseñado bajo estándares modernos de desarrollo de software para facilitar el cumplimiento normativo, la prevención de riesgos laborales y la mejora continua de las condiciones de trabajo.

---

## 📂 Estructura del Repositorio

El espacio de trabajo se organiza de la siguiente manera:

```text
PROYECTOS/
├── .gitignore                      # Exclusiones de control de versiones (incluye archivos privados)
├── README.md                       # Documentación principal del repositorio (este archivo)
└── Sitio Web Seguridad/            # Directorio principal del sitio web de seguridad
    ├── docs/                       # [Privado] Documentación técnica e informes
    │   ├── EstructuraFinal.md      # Resumen y planos de la estructura técnica
    │   └── InformeSeguridad.tex    # Reporte de auditoría y análisis de seguridad en LaTeX
    └── sst-app/                    # Aplicación Web Frontend (Vite + React + TS)
        ├── src/                    # Código fuente del sistema
        │   ├── components/         # Componentes visuales (Layouts, UI, Shared)
        │   ├── pages/              # Páginas correspondientes a los módulos de SST
        │   ├── hooks/              # Custom hooks de React (e.g., useLocalStorage)
        │   ├── lib/                # Integraciones externas (Firebase, almacenamiento local, CSV)
        │   ├── types/              # Definiciones de tipos TypeScript
        │   ├── App.tsx             # Componente raíz y enrutamiento
        │   └── main.tsx            # Punto de entrada de la aplicación
        ├── public/                 # Recursos públicos y estáticos (SVG, iconos)
        ├── tailwind.config.js      # Configuración de diseño y temas visuales
        ├── vite.config.ts          # Configuración del empaquetador Vite
        ├── tsconfig.json           # Configuración del compilador TypeScript
        └── package.json            # Dependencias y scripts del proyecto
```

---

## 🛠️ Stack Tecnológico

La aplicación web está desarrollada utilizando tecnologías web de última generación para garantizar velocidad, accesibilidad y escalabilidad:

*   **Framework Principal:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (tipado estático para código robusto).
*   **Herramienta de Construcción:** [Vite](https://vite.dev/) (para un desarrollo ultra rápido y HMR eficiente).
*   **Estilos y UI:** [Tailwind CSS](https://tailwindcss.com/) + variables CSS nativas para soporte nativo de **Modo Oscuro / Claro**.
*   **Biblioteca de Componentes:** [Radix UI](https://www.radix-ui.com/) (primitivos accesibles y componentes optimizados de la estructura *shadcn/ui*).
*   **Manejo de Formularios y Validación:** [React Hook Form](https://react-hook-form.com/) junto con validación de esquemas mediante [Zod](https://zod.dev/).
*   **Backend & Autenticación:** Integración configurada para [Firebase](https://firebase.google.com/) (Base de datos y autenticación de usuarios).
*   **Alertas y Notificaciones:** [Sonner](https://sonner.emilkowal.ski/) para retroalimentación interactiva.

---

## 🚀 Módulos del Sistema (SST)

La aplicación implementa los módulos críticos para la gestión de la seguridad en el trabajo:

1.  **📊 Panel de Control (Dashboard):** Visualización de indicadores clave de rendimiento (KPIs), alertas críticas de vencimiento de capacitaciones o inspecciones, e incidentes recientes.
2.  **🏢 Gestión de la Empresa:** Configuración de la información general de la compañía, estructura organizativa y políticas de SST.
3.  **⚠️ Matriz IPER (Identificación de Peligros y Evaluación de Riesgos):** Herramienta interactiva para catalogar peligros, evaluar la severidad y probabilidad de ocurrencia de riesgos, y proponer medidas de control según la jerarquía de controles.
4.  **🔍 Inspecciones de Seguridad:** Planificación y ejecución de listas de verificación e inspecciones en áreas críticas de trabajo, con asignación de hallazgos y acciones correctivas.
5.  **🚨 Registro de Accidentes e Incidentes:** Sistema de reporte detallado para documentar accidentes laborales e incidentes, incluyendo investigación de causa raíz (Método de los 5 Porqués / Espina de Pescado) y planes de acción correctiva.
6.  **🔄 Gestión del Cambio (MOC):** Seguimiento estructurado ante modificaciones en procesos, equipos o la organización para identificar y mitigar nuevos riesgos antes de su implementación.
7.  **📅 Plan de Capacitación:** Programación de capacitaciones en SST, control de asistencia de empleados y seguimiento de cumplimiento de metas de entrenamiento.
8.  **🛡️ Equipos de Protección Personal (EPP):** Registro de inventario, control de entrega de EPPs por colaborador, y recordatorios automáticos para renovación y reposición de equipos.

---

## ⚙️ Instrucciones de Instalación y Ejecución

Sigue estos pasos para levantar la aplicación en tu entorno local:

### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendado) y `npm`.

### Paso 1: Clonar e instalar dependencias

Navega a la carpeta de la aplicación web:

```bash
cd "Sitio Web Seguridad/sst-app"
```

Instala todas las dependencias del proyecto:

```bash
npm install
```

### Paso 2: Ejecutar en entorno de desarrollo

Para iniciar el servidor de desarrollo local con recarga rápida en tiempo real (HMR):

```bash
npm run dev
```

Una vez ejecutado, abre [http://localhost:5173](http://localhost:5173) en tu navegador preferido.

### Paso 3: Construcción para Producción

Para compilar y optimizar la aplicación de cara a su distribución o despliegue en producción:

```bash
npm run build
```

Los archivos resultantes optimizados se generarán en la carpeta `Sitio Web Seguridad/sst-app/dist`.

---

## 🔒 Privacidad y Control de Versiones

Para proteger la información confidencial de la organización y el análisis de auditoría interna, los siguientes archivos técnicos de documentación han sido añadidos al archivo `.gitignore` a nivel raíz del proyecto:

*   **`Sitio Web Seguridad/docs/EstructuraFinal.md`** - Resumen privado del mapa técnico.
*   **`Sitio Web Seguridad/docs/InformeSeguridad.tex`** - Reporte completo de auditoría y análisis de seguridad física/digital.

*Nota: Estos archivos se mantendrán localmente pero nunca serán subidos al repositorio público de Git.*

---

## ✒️ Autor y Licencia

Este proyecto ha sido desarrollado en su totalidad por:
*   **Autor:** Samuel Aguilera
*   **Licencia:** Este proyecto se distribuye bajo la [Licencia MIT](LICENSE) (de código abierto). Para más detalles, consulta el archivo [LICENSE](LICENSE) en la raíz del repositorio.

