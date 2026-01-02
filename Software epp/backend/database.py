import sqlite3
from datetime import datetime
from typing import Optional
import hashlib

DATABASE_NAME = "inventario.db"

def get_db_connection():
    """Crea y retorna una conexión a la base de datos"""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa las tablas de la base de datos"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla de usuarios
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    
    # Tabla de productos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            qr TEXT PRIMARY KEY,
            producto TEXT NOT NULL,
            subtipo TEXT,
            genero TEXT,
            categoria TEXT,
            talla TEXT,
            color TEXT,
            marca TEXT,
            area TEXT,
            descripcion TEXT
        )
    """)
    
    # Tabla de movimientos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS movimientos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr TEXT NOT NULL,
            tipo TEXT NOT NULL,
            cantidad INTEGER NOT NULL DEFAULT 1,
            fecha TEXT NOT NULL,
            FOREIGN KEY (qr) REFERENCES productos(qr)
        )
    """)
    
    conn.commit()
    conn.close()

def hash_password(password: str) -> str:
    """Hashea una contraseña usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verifica una contraseña contra su hash"""
    return hash_password(password) == hashed


