@echo off
title Sistema de Inventario EPP - Backend
color 0A
echo ========================================
echo   Sistema de Inventario EPP - Backend
echo ========================================
echo.
echo Verificando dependencias...
python -c "import fastapi, uvicorn" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Las dependencias no estan instaladas
    echo.
    echo Instalando dependencias...
    python -m pip install fastapi uvicorn[standard] pydantic
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)
echo OK
echo.
echo Verificando puerto 8000...
netstat -an | findstr ":8000" >nul
if %errorlevel% equ 0 (
    echo ADVERTENCIA: El puerto 8000 esta en uso
    echo Cierra otras instancias antes de continuar
    echo.
    pause
)
echo.
echo ========================================
echo   Iniciando servidor FastAPI...
echo ========================================
echo.
echo Backend disponible en: http://localhost:8000
echo Documentacion API en: http://localhost:8000/docs
echo.
echo IMPORTANTE: NO CIERRES ESTA VENTANA
echo Presiona Ctrl+C para detener el servidor
echo.
cd /d "%~dp0backend"
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo iniciar el servidor
    echo Verifica que Python y las dependencias esten instaladas
    echo.
    pause
)

