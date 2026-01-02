# 🎯 GUÍA VISUAL PASO A PASO

## ⚠️ PROBLEMA: "No se conecta"

Sigue estos pasos EXACTAMENTE en orden:

---

## 📍 PASO 1: INICIAR EL BACKEND (OBLIGATORIO)

### Opción A: Usar el Script .bat (MÁS FÁCIL)

1. **Ve a la carpeta del proyecto** en el Explorador de Windows
2. **Busca el archivo:** `iniciar-backend.bat`
3. **Doble click** en `iniciar-backend.bat`
4. **Se abrirá una ventana negra** (terminal)
5. **DEBE aparecer esto:**
   ```
   ========================================
     Sistema de Inventario EPP - Backend
   ========================================
   
   Verificando dependencias...
   OK
   
   ========================================
     Iniciando servidor FastAPI...
   ========================================
   
   Backend disponible en: http://localhost:8000
   Documentacion API en: http://localhost:8000/docs
   
   INFO:     Uvicorn running on http://127.0.0.1:8000
   INFO:     Application startup complete.
   ```

6. **⚠️ IMPORTANTE:** NO CIERRES ESTA VENTANA
   - Debe quedarse abierta mientras uses el sistema
   - Si la cierras, el backend se detiene

### Opción B: Manualmente desde PowerShell

1. Abre PowerShell
2. Ejecuta estos comandos UNO POR UNO:
   ```powershell
   cd "C:\Users\DASAEV\Desktop\Software epp\backend"
   python -m uvicorn main:app --reload
   ```
3. Debe aparecer el mismo mensaje que arriba

---

## 📍 PASO 2: VERIFICAR QUE EL BACKEND FUNCIONA

**Antes de abrir el frontend, verifica que el backend funciona:**

1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a esta dirección: `http://localhost:8000/docs`
3. **DEBE aparecer:** Una página con "FastAPI" y documentación de la API
4. Si NO aparece nada o da error → El backend NO está corriendo

**✅ Si ves la documentación:** El backend funciona correctamente
**❌ Si NO ves nada:** Vuelve al PASO 1

---

## 📍 PASO 3: ABRIR EL FRONTEND (INTERFAZ)

### ⚠️ IMPORTANTE: NO abras el HTML directamente

**NO hagas esto:**
- ❌ Doble click en `index.html`
- ❌ Abrir con `file:///C:/...`

**SÍ haz esto (elige una opción):**

### Opción A: VS Code con Live Server (RECOMENDADO)

1. Instala VS Code: https://code.visualstudio.com/
2. Abre VS Code
3. Instala la extensión "Live Server" (busca en extensiones)
4. En VS Code: File → Open Folder → Selecciona la carpeta `frontend`
5. Click derecho en `index.html`
6. Selecciona **"Open with Live Server"**
7. Se abrirá automáticamente en: `http://127.0.0.1:5500` o similar

### Opción B: Python HTTP Server

1. Abre una **NUEVA** ventana de PowerShell (deja el backend corriendo)
2. Ejecuta:
   ```powershell
   cd "C:\Users\DASAEV\Desktop\Software epp\frontend"
   python -m http.server 8080
   ```
3. Abre tu navegador
4. Ve a: `http://localhost:8080`

---

## 📍 PASO 4: PROBAR LA CONEXIÓN

1. Abre el archivo `test-conexion.html` en el navegador
   - Usa Live Server o Python HTTP Server (NO file://)
2. Haz click en "Probar Conexión"
3. **Si ves ✅ verde:** Todo funciona
4. **Si ves ❌ rojo:** Sigue las instrucciones que aparecen

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### ❌ Error: "Failed to fetch" o "No se puede conectar"

**Causa:** El backend NO está corriendo

**Solución:**
1. Verifica que la ventana del backend esté abierta
2. Verifica que veas "Uvicorn running" en esa ventana
3. Abre `http://localhost:8000/docs` en el navegador
4. Si NO funciona, reinicia el backend

---

### ❌ Error: "CORS policy" o "Cross-Origin"

**Causa:** Estás abriendo el HTML con `file://`

**Solución:**
- Usa Live Server o Python HTTP Server
- NO abras el HTML directamente

---

### ❌ Error: "Module not found" en la terminal del backend

**Causa:** Las dependencias no están instaladas

**Solución:**
```powershell
cd "C:\Users\DASAEV\Desktop\Software epp\backend"
pip install fastapi uvicorn[standard] pydantic
```

---

### ❌ El backend se cierra inmediatamente

**Causa:** Hay un error en el código o dependencias

**Solución:**
1. Abre PowerShell en la carpeta `backend`
2. Ejecuta:
   ```powershell
   python -m uvicorn main:app --reload
   ```
3. Lee los errores que aparecen
4. Comparte los errores para obtener ayuda

---

## ✅ CHECKLIST FINAL

Antes de usar el sistema, verifica:

- [ ] Backend corriendo (ventana negra abierta)
- [ ] Veo "Uvicorn running on http://127.0.0.1:8000"
- [ ] Puedo abrir `http://localhost:8000/docs` en el navegador
- [ ] Frontend abierto con Live Server o Python HTTP Server
- [ ] NO estoy usando `file://` para abrir el HTML
- [ ] `test-conexion.html` muestra ✅ verde

---

## 🎉 SI TODO ESTÁ BIEN

1. Ve a `http://localhost:8080` (o el puerto que uses)
2. Click en "Registrarse"
3. Crea tu cuenta
4. Inicia sesión
5. ¡Listo para usar!

---

## 📞 SI SIGUE SIN FUNCIONAR

1. Ejecuta `diagnostico.bat` y comparte el resultado
2. Abre la consola del navegador (F12) y comparte los errores
3. Verifica que ambas ventanas (backend y frontend) estén corriendo
4. Prueba `test-conexion.html` y comparte el resultado


