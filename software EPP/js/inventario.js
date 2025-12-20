const API = "http://127.0.0.1:8000";

/* =========================
   MOVIMIENTOS
========================= */
async function registrarMovimiento(tipo) {
    const qr = document.getElementById("qr-value").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!qr) return alert("No hay QR escaneado");
    if (cantidad <= 0) return alert("Cantidad inválida");

    const res = await fetch(`${API}/movimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr, tipo, cantidad })
    });

    const data = await res.json();
    if (!data.ok) return alert(data.error || "Error");

    cargarInventario();
}

/* =========================
   INVENTARIO
========================= */
async function cargarInventario() {
    const producto = document.getElementById("filtro-producto").value;
    const talla = document.getElementById("filtro-talla").value;
    const color = document.getElementById("filtro-color").value;

    const params = new URLSearchParams({ producto, talla, color });

    const res = await fetch(`${API}/inventario?${params.toString()}`);
    const data = await res.json();

    const tbody = document.getElementById("tabla-inventario");
    tbody.innerHTML = "";

    data.forEach(item => {
        tbody.innerHTML += `
        <tr>
            <td>${item.qr}</td>
            <td>${item.producto}</td>
            <td>${item.subtipo || "-"}</td>
            <td>${item.genero || "-"}</td>
            <td>${item.talla || "-"}</td>
            <td>${item.color || "-"}</td>
            <td>${item.area || "-"}</td>
            <td><strong>${item.cantidad}</strong></td>
        </tr>`;
    });
}

/* =========================
   LIMPIAR FILTROS
========================= */
function limpiarFiltros() {
    document.getElementById("filtro-producto").value = "";
    document.getElementById("filtro-talla").value = "";
    document.getElementById("filtro-color").value = "";
    cargarInventario();
}

window.onload = cargarInventario;
