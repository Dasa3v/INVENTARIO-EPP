@echo off
title Sistema EPP - Backend
color 0A
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     SISTEMA DE INVENTARIO EPP - BACKEND                 ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Iniciando servidor...
echo.

cd /d "%~dp0backend"

echo Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Python no encontrado
    echo.
    pause
    exit /b 1
)
echo.

echo Verificando dependencias...
python -c "import fastapi" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Dependencias no encontradas. Instalando...
    python -m pip install fastapi uvicorn[standard] pydantic
    echo.
)
echo ✅ Dependencias OK
echo.

echo ═══════════════════════════════════════════════════════════
echo   SERVIDOR INICIANDO...
echo ═══════════════════════════════════════════════════════════
echo.
echo 📍 Backend disponible en: http://localhost:8000
echo 📍 Documentacion API en: http://localhost:8000/docs
echo.
echo ⚠️  IMPORTANTE: NO CIERRES ESTA VENTANA
echo    Presiona Ctrl+C para detener el servidor
echo.
echo ═══════════════════════════════════════════════════════════
echo.

python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: No se pudo iniciar el servidor
    echo.
    echo Verifica:
    echo   1. Python esta instalado
    echo   2. Las dependencias estan instaladas
    echo   3. No hay otro programa usando el puerto 8000
    echo.
    pause
)


