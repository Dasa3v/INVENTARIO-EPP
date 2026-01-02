@echo off
title Verificar Backend
color 0B
echo ========================================
echo   VERIFICACION DEL BACKEND
echo ========================================
echo.

echo [1] Verificando si el backend esta corriendo...
netstat -an | findstr ":8000" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend esta corriendo en el puerto 8000
    echo.
    echo [2] Probando conexion...
    curl -s http://localhost:8000/docs >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Backend responde correctamente
        echo.
        echo ========================================
        echo   ✅ TODO FUNCIONA CORRECTAMENTE
        echo ========================================
        echo.
        echo Puedes abrir en tu navegador:
        echo   - Frontend: http://localhost:8080
        echo   - Backend API: http://localhost:8000/docs
        echo.
    ) else (
        echo ⚠️ Backend esta corriendo pero no responde
        echo   Puede estar iniciando, espera unos segundos
    )
) else (
    echo ❌ Backend NO esta corriendo
    echo.
    echo Solucion:
    echo   1. Ejecuta iniciar-backend.bat
    echo   2. O ejecuta manualmente:
    echo      cd backend
    echo      python -m uvicorn main:app --reload
    echo.
)

echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul
start http://localhost:8000/docs
echo.
echo Si ves la documentacion de FastAPI, el backend funciona correctamente.
echo.
pause

