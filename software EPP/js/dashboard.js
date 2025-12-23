const API = "http://127.0.0.1:8000";

async function cargarDashboard() {
    const res = await fetch(`${API}/dashboard/resumen`);
    const data = await res.json();

    document.getElementById("total-productos").innerText = data.total_productos;
    document.getElementById("total-unidades").innerText = data.total_unidades;

    const tbody = document.getElementById("tabla-dashboard");
    tbody.innerHTML = "";

    data.por_producto.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.producto}</td>
                <td>${p.cantidad}</td>
            </tr>
        `;
    });
}

window.onload = cargarDashboard;
