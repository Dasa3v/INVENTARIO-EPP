from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend import database

database.create_tables()
database.crear_usuario_admin()

app = FastAPI(title="Inventario EPP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# MODELOS
# ------------------------
class Login(BaseModel):
    usuario: str
    password: str

class Producto(BaseModel):
    qr: str
    producto: str
    subtipo: str = ""
    genero: str = ""
    categoria: str = ""
    talla: str = ""
    color: str = ""
    marca: str = ""
    area: str = ""

class Movimiento(BaseModel):
    cantidad: int

# ------------------------
# AUTH
# ------------------------
@app.post("/login")
def login(data: Login):
    # Simples para pruebas
    return {"ok": True, "usuario": "admin", "rol": "ADMIN"}

# ------------------------
# PRODUCTOS
# (usado por generar.html)
# ------------------------
@app.post("/registrar")
def registrar(data: Producto):
    existe = database.obtener_producto(data.qr)
    if existe:
        raise HTTPException(409, "Este QR ya existe")

    database.registrar_producto(
        data.qr,
        data.producto,
        data.subtipo,
        data.genero,
        data.categoria,
        data.talla,
        data.color,
        data.marca,
        data.area
    )
    return {"ok": True, "msg": "Producto registrado"}

@app.get("/producto/{qr}")
def producto(qr: str):
    d = database.obtener_producto(qr)
    if not d:
        raise HTTPException(404, "Producto no encontrado")
    return d

# ------------------------
# INVENTARIO AGREGADO
# (para inventario.html)
# ------------------------
@app.get("/inventario")
def inventario():
    # Devuelve productos con cantidad calculada
    return database.obtener_inventario_con_cantidad()

# ------------------------
# MOVIMIENTOS CON CANTIDAD
# (entrada / salida)
# ------------------------
@app.post("/movimiento/{qr}/{tipo}")
def movimiento(qr: str, tipo: str, data: Movimiento):
    if tipo not in ["ENTRADA", "SALIDA"]:
        raise HTTPException(400, "Tipo inválido")

    prod = database.obtener_producto(qr)
    if not prod:
        raise HTTPException(404, "QR no registrado")

    if data.cantidad < 1:
        raise HTTPException(400, "Cantidad inválida")

    for _ in range(data.cantidad):
        database.registrar_movimiento(qr, tipo)

    return {
        "ok": True,
        "qr": qr,
        "tipo": tipo,
        "cantidad": data.cantidad
    }
@app.get("/dashboard/resumen")
def dashboard_resumen():
    return database.resumen_dashboard()
