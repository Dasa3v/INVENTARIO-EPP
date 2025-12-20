def obtener_inventario_con_cantidad():
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""
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
        GROUP BY p.qr
    """)

    rows = cursor.fetchall()
    conn.close()

    keys = [
        "qr", "producto", "subtipo", "genero", "categoria",
        "talla", "color", "marca", "area", "cantidad"
    ]

    return [dict(zip(keys, r)) for r in rows]
def resumen_dashboard():
    conn = connect()
    cursor = conn.cursor()

    # Total productos distintos
    cursor.execute("SELECT COUNT(*) FROM productos")
    total_productos = cursor.fetchone()[0]

    # Total unidades en inventario
    cursor.execute("SELECT SUM(cantidad) FROM productos")
    total_unidades = cursor.fetchone()[0] or 0

    # Totales por producto
    cursor.execute("""
        SELECT producto, SUM(cantidad)
        FROM productos
        GROUP BY producto
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
