@echo off
echo ========================================
echo   DIAGNOSTICO DEL SISTEMA
echo ========================================
echo.

echo [1] Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python no esta instalado o no esta en PATH
    pause
    exit /b 1
)
echo OK
echo.

echo [2] Verificando dependencias...
python -c "import fastapi; print('FastAPI: OK')" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: FastAPI no esta instalado
    echo Ejecuta: pip install fastapi uvicorn pydantic
    pause
    exit /b 1
)
python -c "import uvicorn; print('Uvicorn: OK')" 2>nul
python -c "import pydantic; print('Pydantic: OK')" 2>nul
echo.

echo [3] Verificando estructura de carpetas...
if not exist "backend\main.py" (
    echo ERROR: No se encuentra backend\main.py
    pause
    exit /b 1
)
if not exist "frontend\index.html" (
    echo ERROR: No se encuentra frontend\index.html
    pause
    exit /b 1
)
echo OK
echo.

echo [4] Verificando puerto 8000...
netstat -an | findstr ":8000" >nul
if %errorlevel% equ 0 (
    echo ADVERTENCIA: El puerto 8000 esta en uso
    echo Cierra otras instancias del backend antes de continuar
) else (
    echo OK: Puerto 8000 disponible
)
echo.

echo [5] Iniciando prueba del backend...
echo.
echo Presiona Ctrl+C para detener el servidor de prueba
echo.
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause


