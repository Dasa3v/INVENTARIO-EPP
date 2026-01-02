from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
from datetime import datetime
from database import get_db_connection, init_db, hash_password, verify_password

app = FastAPI(title="Sistema de Inventario EPP")

# CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar base de datos al iniciar
init_db()

# ========== MODELOS PYDANTIC ==========

class UsuarioLogin(BaseModel):
    usuario: str
    password: str

class UsuarioRegistro(BaseModel):
    usuario: str
    password: str

class ProductoCreate(BaseModel):
    qr: str
    producto: str
    subtipo: Optional[str] = None
    genero: Optional[str] = None
    categoria: Optional[str] = None
    talla: Optional[str] = None
    color: Optional[str] = None
    marca: Optional[str] = None
    area: Optional[str] = None
    descripcion: Optional[str] = None

class ProductoUpdate(BaseModel):
    producto: Optional[str] = None
    subtipo: Optional[str] = None
    genero: Optional[str] = None
    categoria: Optional[str] = None
    talla: Optional[str] = None
    color: Optional[str] = None
    marca: Optional[str] = None
    area: Optional[str] = None
    descripcion: Optional[str] = None

class MovimientoCreate(BaseModel):
    qr: str
    tipo: str  # "ENTRADA" o "SALIDA"
    cantidad: int = 1

# ========== ENDPOINTS DE USUARIOS ==========

@app.post("/api/login")
async def login(usuario_data: UsuarioLogin):
    """Autentica un usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM usuarios WHERE usuario = ?", (usuario_data.usuario,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    if not verify_password(usuario_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    return {"success": True, "usuario": user["usuario"]}

@app.post("/api/registro")
async def registro(usuario_data: UsuarioRegistro):
    """Registra un nuevo usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si el usuario ya existe
    cursor.execute("SELECT * FROM usuarios WHERE usuario = ?", (usuario_data.usuario,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    # Crear nuevo usuario
    hashed_password = hash_password(usuario_data.password)
    cursor.execute(
        "INSERT INTO usuarios (usuario, password) VALUES (?, ?)",
        (usuario_data.usuario, hashed_password)
    )
    conn.commit()
    conn.close()
    
    return {"success": True, "message": "Usuario registrado correctamente"}

@app.post("/api/recuperar")
async def recuperar_password(usuario_data: UsuarioRegistro):
    """Recupera/resetea la contraseña de un usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM usuarios WHERE usuario = ?", (usuario_data.usuario,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Actualizar contraseña
    hashed_password = hash_password(usuario_data.password)
    cursor.execute(
        "UPDATE usuarios SET password = ? WHERE usuario = ?",
        (hashed_password, usuario_data.usuario)
    )
    conn.commit()
    conn.close()
    
    return {"success": True, "message": "Contraseña actualizada correctamente"}

# ========== ENDPOINTS DE PRODUCTOS ==========

@app.get("/api/productos")
async def get_productos(
    producto: Optional[str] = None,
    talla: Optional[str] = None,
    color: Optional[str] = None,
    area: Optional[str] = None
):
    """Obtiene todos los productos con filtros opcionales"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM productos WHERE 1=1"
    params = []
    
    if producto:
        query += " AND producto LIKE ?"
        params.append(f"%{producto}%")
    if talla:
        query += " AND talla = ?"
        params.append(talla)
    if color:
        query += " AND color = ?"
        params.append(color)
    if area:
        query += " AND area = ?"
        params.append(area)
    
    cursor.execute(query, params)
    productos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"productos": productos}

@app.get("/api/productos/{qr}")
async def get_producto(qr: str):
    """Obtiene un producto por su QR"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM productos WHERE qr = ?", (qr,))
    producto = cursor.fetchone()
    conn.close()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return dict(producto)

@app.post("/api/productos")
async def create_producto(producto: ProductoCreate):
    """Crea un nuevo producto"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO productos (qr, producto, subtipo, genero, categoria, talla, color, marca, area, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            producto.qr,
            producto.producto,
            producto.subtipo,
            producto.genero,
            producto.categoria,
            producto.talla,
            producto.color,
            producto.marca,
            producto.area,
            producto.descripcion
        ))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Producto creado correctamente"}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="El QR ya existe")

@app.put("/api/productos/{qr}")
async def update_producto(qr: str, producto: ProductoUpdate):
    """Actualiza un producto existente"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Construir query dinámicamente
    updates = []
    params = []
    
    for field, value in producto.dict(exclude_unset=True).items():
        if value is not None:
            updates.append(f"{field} = ?")
            params.append(value)
    
    if not updates:
        conn.close()
        raise HTTPException(status_code=400, detail="No hay campos para actualizar")
    
    params.append(qr)
    query = f"UPDATE productos SET {', '.join(updates)} WHERE qr = ?"
    
    cursor.execute(query, params)
    conn.commit()
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    conn.close()
    return {"success": True, "message": "Producto actualizado correctamente"}

@app.delete("/api/productos/{qr}")
async def delete_producto(qr: str):
    """Elimina un producto"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM productos WHERE qr = ?", (qr,))
    conn.commit()
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    conn.close()
    return {"success": True, "message": "Producto eliminado correctamente"}

# ========== ENDPOINTS DE MOVIMIENTOS ==========

@app.post("/api/movimientos")
async def create_movimiento(movimiento: MovimientoCreate):
    """Crea un nuevo movimiento (entrada o salida)"""
    if movimiento.tipo not in ["ENTRADA", "SALIDA"]:
        raise HTTPException(status_code=400, detail="Tipo debe ser ENTRADA o SALIDA")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar que el producto existe
    cursor.execute("SELECT * FROM productos WHERE qr = ?", (movimiento.qr,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Crear movimiento
    fecha = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO movimientos (qr, tipo, cantidad, fecha)
        VALUES (?, ?, ?, ?)
    """, (movimiento.qr, movimiento.tipo, movimiento.cantidad, fecha))
    
    conn.commit()
    conn.close()
    
    return {"success": True, "message": "Movimiento registrado correctamente"}

@app.get("/api/movimientos")
async def get_movimientos(qr: Optional[str] = None):
    """Obtiene los movimientos, opcionalmente filtrados por QR"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if qr:
        cursor.execute("""
            SELECT m.*, p.producto 
            FROM movimientos m
            JOIN productos p ON m.qr = p.qr
            WHERE m.qr = ?
            ORDER BY m.fecha DESC
        """, (qr,))
    else:
        cursor.execute("""
            SELECT m.*, p.producto 
            FROM movimientos m
            JOIN productos p ON m.qr = p.qr
            ORDER BY m.fecha DESC
        """)
    
    movimientos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"movimientos": movimientos}

@app.get("/api/inventario")
async def get_inventario():
    """Obtiene el inventario calculado (stock actual por producto)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            p.*,
            COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.cantidad ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN m.tipo = 'SALIDA' THEN m.cantidad ELSE 0 END), 0) as stock
        FROM productos p
        LEFT JOIN movimientos m ON p.qr = m.qr
        GROUP BY p.qr
        ORDER BY p.producto
    """)
    
    inventario = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"inventario": inventario}

@app.get("/api/dashboard")
async def get_dashboard():
    """Obtiene estadísticas para el dashboard"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total de productos únicos
    cursor.execute("SELECT COUNT(DISTINCT qr) as total FROM productos")
    total_productos = cursor.fetchone()["total"]
    
    # Total de unidades (suma de entradas - salidas)
    cursor.execute("""
        SELECT 
            COALESCE(SUM(CASE WHEN tipo = 'ENTRADA' THEN cantidad ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN tipo = 'SALIDA' THEN cantidad ELSE 0 END), 0) as total
        FROM movimientos
    """)
    total_unidades = cursor.fetchone()["total"]
    
    # Productos por tipo
    cursor.execute("""
        SELECT producto, COUNT(*) as cantidad
        FROM productos
        GROUP BY producto
        ORDER BY cantidad DESC
    """)
    productos_por_tipo = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_productos": total_productos,
        "total_unidades": total_unidades,
        "productos_por_tipo": productos_por_tipo
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


