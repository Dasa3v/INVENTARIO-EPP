# 🔧 SOLUCIÓN DE PROBLEMAS DE CONEXIÓN

## ❌ Error: "No se puede conectar al servidor" o "Failed to fetch"

### ✅ SOLUCIÓN 1: Verificar que el Backend esté corriendo

**Paso 1:** Abre PowerShell y ejecuta:
```powershell
netstat -an | findstr ":8000"
```

**Si NO aparece nada:** El backend NO está corriendo
**Si aparece algo:** El backend está corriendo (pero puede haber otro problema)

**Paso 2:** Inicia el backend:
- Doble click en `iniciar-backend.bat`
- O ejecuta manualmente:
  ```powershell
  cd "C:\Users\DASAEV\Desktop\Software epp\backend"
  python -m uvicorn main:app --reload
  ```

**Paso 3:** Verifica que veas este mensaje:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

### ✅ SOLUCIÓN 2: Verificar la URL del Backend

**Abre tu navegador y ve a:**
```
http://localhost:8000/docs
```

**Si ves la documentación de FastAPI:** ✅ El backend funciona
**Si NO ves nada o da error:** ❌ El backend no está corriendo o hay un problema

---

### ✅ SOLUCIÓN 3: Verificar CORS y Permisos

**Problema común:** Si abres el HTML directamente (file://), el navegador bloquea las peticiones.

**Solución:** Usa un servidor HTTP:
- **VS Code Live Server** (recomendado)
- **Python HTTP Server:**
  ```powershell
  cd frontend
  python -m http.server 8080
  ```
- Luego abre: `http://localhost:8080` (NO `file://`)

---

### ✅ SOLUCIÓN 4: Verificar la Consola del Navegador

1. Abre el frontend en el navegador
2. Presiona **F12** (abre las herramientas de desarrollador)
3. Ve a la pestaña **Console**
4. Intenta hacer login o cualquier acción
5. Revisa los errores que aparecen

**Errores comunes:**
- `Failed to fetch` → Backend no está corriendo o CORS bloqueado
- `CORS policy` → Problema de CORS (usa servidor HTTP, no file://)
- `Network Error` → Backend no está corriendo

---

### ✅ SOLUCIÓN 5: Usar el Script de Diagnóstico

Ejecuta `diagnostico.bat` para verificar automáticamente:
- Si Python está instalado
- Si las dependencias están instaladas
- Si el puerto está disponible
- Si el backend puede iniciarse

---

### ✅ SOLUCIÓN 6: Verificar Firewall/Antivirus

A veces el firewall bloquea el puerto 8000.

**Solución temporal:**
1. Desactiva temporalmente el firewall
2. Prueba si funciona
3. Si funciona, agrega una excepción para Python

---

### ✅ SOLUCIÓN 7: Cambiar el Puerto

Si el puerto 8000 está ocupado:

**1. Cambia el puerto del backend:**
Edita `iniciar-backend.bat` y cambia:
```bat
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**2. Cambia la URL en los archivos JS:**
Edita todos los archivos en `frontend/js/` y cambia:
```javascript
const API_URL = 'http://localhost:8001/api';
```

---

## 🔍 VERIFICACIÓN PASO A PASO

### Checklist:

- [ ] Backend está corriendo (ventana de terminal abierta)
- [ ] Veo `Uvicorn running on http://127.0.0.1:8000` en la terminal
- [ ] Puedo abrir `http://localhost:8000/docs` en el navegador
- [ ] Frontend está abierto con un servidor HTTP (NO file://)
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El puerto 8000 no está ocupado por otro programa

---

## 🚀 INICIO CORRECTO (Paso a Paso)

### Terminal 1 - Backend:
```powershell
cd "C:\Users\DASAEV\Desktop\Software epp\backend"
python -m uvicorn main:app --reload
```
**DEBE mostrar:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Terminal 2 - Frontend:
```powershell
cd "C:\Users\DASAEV\Desktop\Software epp\frontend"
python -m http.server 8080
```

### Navegador:
Abre: `http://localhost:8080`

---

## 📞 Si Nada Funciona

1. Ejecuta `diagnostico.bat` y comparte el resultado
2. Abre la consola del navegador (F12) y comparte los errores
3. Verifica que ambas terminales estén corriendo
4. Prueba abrir `http://localhost:8000/docs` directamente

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| `Failed to fetch` | Backend no corriendo | Inicia el backend |
| `CORS policy` | Abriendo HTML con file:// | Usa servidor HTTP |
| `Connection refused` | Puerto ocupado | Cambia el puerto o cierra otros programas |
| `Module not found` | Dependencias no instaladas | `pip install -r requirements.txt` |
| `Address already in use` | Puerto en uso | Cierra otras instancias o cambia puerto |

