# 🚀 Inicio Rápido

## Paso 1: Instalar Dependencias

```bash
cd backend
pip install -r requirements.txt
```

## Paso 2: Iniciar Backend

**Opción A: Usar el script .bat (Windows)**
- Doble click en `iniciar-backend.bat`

**Opción B: Manualmente**
```bash
cd backend
uvicorn main:app --reload
```

El backend estará en: `http://localhost:8000`

## Paso 3: Abrir Frontend

1. Abre la carpeta `frontend` en VS Code
2. Click derecho en `index.html` → "Open with Live Server"
   
   O usa Python:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Luego abre: `http://localhost:8080`

## ✅ Listo!

1. Crea un usuario en "Registrarse"
2. Inicia sesión
3. Comienza a usar el sistema

## 📝 Notas

- El backend debe estar ejecutándose para que el frontend funcione
- La base de datos se crea automáticamente la primera vez que inicias el backend
- Para desarrollo, ambos servidores pueden correr simultáneamente

