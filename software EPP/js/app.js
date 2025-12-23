const API = "http://127.0.0.1:8000";

// -----------------------------
// REGISTRAR ENTRADA
// -----------------------------
async function registrarEntrada() {
    const qr = document.getElementById("qr-value").value;
    if (!qr) return alert("No hay QR leído");

    const res = await fetch(`${API}/entrada/${qr}`, { method: "POST" });
    const data = await res.json();

    alert("Entrada registrada: " + qr);
    cargarInventario();
}

// -----------------------------
// REGISTRAR SALIDA
// -----------------------------
async function registrarSalida() {
    const qr = document.getElementById("qr-value").value;
    if (!qr) return alert("No hay QR leído");

    const res = await fetch(`${API}/salida/${qr}`, { method: "POST" });
    const data = await res.json();

    alert("Salida registrada: " + qr);
    cargarInventario();
}

// -----------------------------
// CARGAR INVENTARIO
// -----------------------------
async function cargarInventario() {
    const res = await fetch(`${API}/inventario`);
    const data = await res.json();

    const tbody = document.querySelector("#inventory-table tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No hay productos registrados</td></tr>`;
        return;
    }

    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.qr}</td>
                <td>${item.producto}</td>
                <td>${item.categoria}</td>
                <td>${item.talla}</td>
                <td>${item.color}</td>
                <td>${item.marca}</td>
                <td>${item.descripcion}</td>
            </tr>
        `;
    });
}

// Cargar inventario al abrir la página
window.onload = cargarInventario;

function toggleTheme() {
    document.body.classList.toggle("dark");
}
