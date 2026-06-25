@echo off
title Iniciar Aplicacion SST
cd /d "C:\Users\hp.DESKTOP-5DULNNJ\OneDrive\Documentos\PROYECTOS\Sitio Web Seguridad\sst-app"
echo ==========================================================
echo   Iniciando Servidor Local de Seguridad y Salud en el Trabajo (SST)
echo ==========================================================
echo.
echo Se abrira una ventana del navegador de forma automatica.
echo Si no se abre, ingresa de forma manual a: http://localhost:5173/
echo.
echo Para apagar el servidor, cierra esta ventana de comandos o presiona Ctrl+C.
echo.
npm run dev -- --open
