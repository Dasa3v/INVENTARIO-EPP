# 📦 Sistema de Inventario EPP con QR

Sistema web completo para la gestión de inventario de Equipos de Protección Personal (EPP) utilizando códigos QR.

## 🎯 Características

- ✅ Generación de códigos QR únicos por producto
- ✅ Registro de productos en base de datos
- ✅ Escaneo de QR para entradas y salidas
- ✅ Visualización de inventario en tiempo real
- ✅ Gestión de usuarios (login, registro, recuperación)
- ✅ Interfaz moderna, responsive
- ✅ Modo claro/oscuro

## 🏗️ Arquitectura

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLite** - Base de datos ligera
- **API REST** - Endpoints para todas las operaciones

### Frontend
- **HTML5 + CSS3 + JavaScript** - Sin frameworks, código puro
- **html5-qrcode** - Para escaneo de códigos QR
- **qrcode.js** - Para generación de códigos QR
- **Chart.js** - Para gráficas en el dashboard

## 📂 Estructura del Proyecto

```
/
├── backend/
│   ├── main.py           # API FastAPI principal
│   ├── database.py       # Configuración de base de datos
│   ├── requirements.txt  # Dependencias Python
│   └── inventario.db     # Base de datos SQLite (se crea automáticamente)
│
└── frontend/
    ├── index.html        # Página de inicio/landing
    ├── login.html        # Login de usuarios
    ├── registro.html     # Registro de nuevos usuarios
    ├── recuperar.html   # Recuperación de contraseña
    ├── home.html        # Página principal después del login
    ├── inventario.html  # Control de stock (escaneo + movimientos)
    ├── productos.html   # Gestión y filtros de productos
    ├── generar.html     # Generación de códigos QR
    ├── dashboard.html  # Estadísticas y resúmenes
    ├── css/
    │   └── style.css    # Estilos globales + temas
    └── js/
        ├── theme.js      # Sistema de tema (claro/oscuro)
        ├── login.js      # Lógica de login
        ├── registro.js   # Lógica de registro
        ├── recuperar.js  # Lógica de recuperación
        ├── inventario.js # Escaneo QR y control de stock
        ├── productos.js  # Gestión de productos
        ├── generar.js    # Generación de QR
        └── dashboard.js   # Estadísticas
```

## 🚀 Instalación

### Requisitos Previos

- Python 3.8 o superior
- Navegador web moderno (Chrome, Firefox, Edge)
- Editor de código (opcional, para desarrollo)

### Paso 1: Clonar o descargar el proyecto

```bash
# Si tienes git
git clone <url-del-repositorio>

# O simplemente descomprime el proyecto en una carpeta
```

### Paso 2: Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

### Paso 3: Inicializar la base de datos

La base de datos se crea automáticamente al ejecutar el backend por primera vez. No necesitas hacer nada adicional.

## ▶️ Ejecución

### Backend

1. Abre una terminal en la carpeta `backend`
2. Ejecuta:

```bash
uvicorn main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`

### Frontend

1. Abre la carpeta `frontend` en tu editor
2. Usa un servidor local. Opciones:

**Opción A: Live Server (VS Code)**
- Instala la extensión "Live Server"
- Click derecho en `index.html` → "Open with Live Server"

**Opción B: Python HTTP Server**
```bash
cd frontend
python -m http.server 8080
```
Luego abre: `http://localhost:8080`

**Opción C: Node.js http-server**
```bash
npx http-server frontend -p 8080
```

## 📖 Uso del Sistema

### 1. Crear Usuario

1. Abre `index.html` en tu navegador
2. Click en "Registrarse"
3. Completa el formulario y crea tu cuenta

### 2. Iniciar Sesión

1. En la página de inicio, click en "Iniciar Sesión"
2. Ingresa tu usuario y contraseña

### 3. Generar Código QR

1. Ve a "Generar QR"
2. Selecciona el tipo de producto (Casco, Botas, etc.)
3. Click en "Generar QR"
4. Descarga el QR o click en "Registrar Producto" para completar los datos

### 4. Registrar Producto

1. Ve a "Productos"
2. Si generaste un QR, se abrirá automáticamente el formulario
3. Completa los datos del producto (talla, color, marca, área, etc.)
4. Guarda el producto

### 5. Control de Inventario

1. Ve a "Inventario"
2. Click en "Iniciar Escáner"
3. Permite el acceso a la cámara
4. Escanea el código QR del producto
5. Selecciona tipo de movimiento (Entrada/Salida) y cantidad
6. Click en "Registrar Movimiento"

### 6. Ver Dashboard

1. Ve a "Dashboard"
2. Visualiza estadísticas generales del inventario

## 🔧 Configuración

### Cambiar URL del Backend

Si el backend está en una URL diferente, edita la constante `API_URL` en cada archivo JavaScript:

```javascript
const API_URL = 'http://localhost:8000/api';
```

### Modo Oscuro/Claro

El sistema guarda automáticamente tu preferencia de tema. El botón de tema está en el header de todas las páginas.

## 🗄️ Base de Datos

### Tablas

**usuarios**
- `id` - ID único
- `usuario` - Nombre de usuario (único)
- `password` - Contraseña hasheada (SHA256)

**productos**
- `qr` - Código QR único (clave primaria)
- `producto` - Tipo de producto
- `subtipo` - Subtipo del producto
- `genero` - Género
- `categoria` - Categoría
- `talla` - Talla
- `color` - Color
- `marca` - Marca
- `area` - Área de trabajo
- `descripcion` - Descripción adicional

**movimientos**
- `id` - ID único
- `qr` - Código QR del producto (clave foránea)
- `tipo` - "ENTRADA" o "SALIDA"
- `cantidad` - Cantidad de unidades
- `fecha` - Fecha y hora del movimiento

## 🔐 Seguridad

- Las contraseñas se almacenan con hash SHA256
- Validación de formularios en frontend y backend
- CORS configurado para desarrollo (ajustar para producción)

## 🐛 Solución de Problemas

### El backend no inicia

- Verifica que Python esté instalado: `python --version`
- Verifica que las dependencias estén instaladas: `pip list`
- Reinstala dependencias: `pip install -r requirements.txt --force-reinstall`

### El frontend no se conecta al backend

- Verifica que el backend esté ejecutándose en `http://localhost:8000`
- Abre la consola del navegador (F12) para ver errores
- Verifica que no haya bloqueadores de CORS

### La cámara no funciona

- Asegúrate de dar permisos de cámara al navegador
- Usa HTTPS o localhost (algunos navegadores requieren esto)
- Prueba en otro navegador

### Los QR no se generan

- Verifica que tengas conexión a internet (para cargar la librería qrcode.js)
- Abre la consola del navegador para ver errores

## 📝 Notas Importantes

1. **Generar QR**: Solo genera el código QR único. Los detalles del producto se asignan después en la sección de Productos.

2. **Stock**: El stock se calcula automáticamente sumando entradas y restando salidas. No se guarda directamente.

3. **Modo Desarrollo**: Este sistema está configurado para desarrollo. Para producción, considera:
   - Usar HTTPS
   - Configurar CORS apropiadamente
   - Usar una base de datos más robusta (PostgreSQL, MySQL)
   - Implementar autenticación con tokens JWT
   - Agregar validaciones más estrictas

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

## 👨‍💻 Desarrollo

Para contribuir o modificar el proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## 📞 Soporte

Si tienes problemas o preguntas, revisa la sección de Solución de Problemas o crea un issue en el repositorio.

---

**¡Disfruta usando el Sistema de Inventario EPP!** 🎉

