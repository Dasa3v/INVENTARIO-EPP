import sqlite3
from datetime import datetime
import os

DB_PATH = "backend/db/inventario.db"


# =========================
# CONEXIÓN
# =========================
def connect():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    return sqlite3.connect(DB_PATH)


# =========================
# CREAR TABLAS
# =========================
def create_tables():
    conn = connect()
    cursor = conn.cursor()

    # Usuarios (local, sin roles)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Productos (1 QR = 1 producto)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            qr TEXT PRIMARY KEY,
            producto TEXT,
            subtipo TEXT,
            genero TEXT,
            categoria TEXT,
            talla TEXT,
            color TEXT,
            marca TEXT,
            area TEXT,
            creado_en TEXT
        )
    """)

    # Movimientos (cada escaneo suma o resta)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS movimientos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr TEXT,
            tipo TEXT,
            fecha TEXT
        )
    """)

    conn.commit()
    conn.close()


# =========================
# USUARIOS
# =========================
def crear_usuario(usuario, password):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO usuarios (usuario, password) VALUES (?, ?)",
        (usuario, password)
    )

    conn.commit()
    conn.close()


def validar_usuario(usuario, password):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, usuario FROM usuarios WHERE usuario=? AND password=?",
        (usuario, password)
    )

    row = cursor.fetchone()
    conn.close()

    if row:
        return {"id": row[0], "usuario": row[1]}
    return None


# =========================
# PRODUCTOS
# =========================
def registrar_producto(qr, producto, subtipo, genero, categoria, talla, color, marca, area):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO productos (
            qr, producto, subtipo, genero, categoria,
            talla, color, marca, area, creado_en
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        qr, producto, subtipo, genero, categoria,
        talla, color, marca, area,
        datetime.now().isoformat(" ")
    ))

    conn.commit()
    conn.close()


def obtener_producto(qr):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM productos WHERE qr=?", (qr,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    keys = [
        "qr", "producto", "subtipo", "genero", "categoria",
        "talla", "color", "marca", "area", "creado_en"
    ]

    return dict(zip(keys, row))


# =========================
# MOVIMIENTOS
# =========================
def registrar_movimiento(qr, tipo):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO movimientos (qr, tipo, fecha)
        VALUES (?, ?, ?)
    """, (qr, tipo, datetime.now().isoformat(" ")))

    conn.commit()
    conn.close()


# =========================
# INVENTARIO (AGREGADO)
# =========================
def obtener_inventario_con_cantidad(filtros=None):
    filtros = filtros or {}

    conn = connect()
    cursor = conn.cursor()

    query = """
        SELECT 
            p.qr, p.producto, p.subtipo, p.genero, p.categoria,
            p.talla, p.color, p.marca, p.area,
            IFNULL(SUM(
                CASE 
                    WHEN m.tipo = 'ENTRADA' THEN 1
                    WHEN m.tipo = 'SALIDA' THEN -1
                    ELSE 0
                END
            ), 0) as cantidad
        FROM productos p
        LEFT JOIN movimientos m ON p.qr = m.qr
        WHERE 1=1
    """

    params = []

    if filtros.get("producto"):
        query += " AND p.producto LIKE ?"
        params.append(f"%{filtros['producto']}%")

    if filtros.get("talla"):
        query += " AND p.talla LIKE ?"
        params.append(f"%{filtros['talla']}%")

    if filtros.get("color"):
        query += " AND p.color LIKE ?"
        params.append(f"%{filtros['color']}%")

    query += " GROUP BY p.qr"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    keys = [
        "qr", "producto", "subtipo", "genero", "categoria",
        "talla", "color", "marca", "area", "cantidad"
    ]

    return [dict(zip(keys, r)) for r in rows]


# =========================
# DASHBOARD
# =========================
def resumen_dashboard():
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM productos")
    total_productos = cursor.fetchone()[0]

    cursor.execute("""
        SELECT 
            IFNULL(SUM(
                CASE 
                    WHEN tipo='ENTRADA' THEN 1
                    WHEN tipo='SALIDA' THEN -1
                END
            ), 0)
        FROM movimientos
    """)
    total_unidades = cursor.fetchone()[0]

    cursor.execute("""
        SELECT p.producto,
               IFNULL(SUM(
                   CASE 
                       WHEN m.tipo='ENTRADA' THEN 1
                       WHEN m.tipo='SALIDA' THEN -1
                   END
               ),0)
        FROM productos p
        LEFT JOIN movimientos m ON p.qr = m.qr
        GROUP BY p.producto
    """)

    por_producto = cursor.fetchall()
    conn.close()

    return {
        "total_productos": total_productos,
        "total_unidades": total_unidades,
        "por_producto": [
            {"producto": p[0], "cantidad": p[1]}
            for p in por_producto
        ]
    }
