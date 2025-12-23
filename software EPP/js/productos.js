const API = "http://127.0.0.1:8000";

let productoSeleccionado = null;

async function cargarProductos() {
    const res = await fetch(`${API}/inventario`);
    const data = await res.json();

    const tbody = document.querySelector("#productos-table tbody");
    tbody.innerHTML = "";

    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.qr}</td>
                <td>${p.producto}</td>
                <td>${p.categoria || ""}</td>
                <td>${p.talla || ""}</td>
                <td>${p.color || ""}</td>
                <td>${p.marca || ""}</td>
                <td>${p.descripcion || ""}</td>
                <td>
                    <button class="btn small primary" onclick="editarProducto('${p.qr}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

// ABRIR EDITOR
async function editarProducto(qr) {
    productoSeleccionado = qr;

    const res = await fetch(`${API}/get_producto/${qr}`);
    const p = await res.json();

    document.getElementById("edit-producto").value = p.producto;
    document.getElementById("edit-categoria").value = p.categoria;
    document.getElementById("edit-talla").value = p.talla;
    document.getElementById("edit-color").value = p.color;
    document.getElementById("edit-marca").value = p.marca;
    document.getElementById("edit-descripcion").value = p.descripcion;

    document.getElementById("modal").classList.remove("hidden");
}

// GUARDAR CAMBIOS
async function guardarCambios() {
    const data = {
        producto: document.getElementById("edit-producto").value,
        categoria: document.getElementById("edit-categoria").value,
        talla: document.getElementById("edit-talla").value,
        color: document.getElementById("edit-color").value,
        marca: document.getElementById("edit-marca").value,
        descripcion: document.getElementById("edit-descripcion").value,
    };

    await fetch(`${API}/actualizar_producto/${productoSeleccionado}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    cerrarModal();
    cargarProductos();
}

// CERRAR MODAL
function cerrarModal() {
    document.getElementById("modal").classList.add("hidden");
}

// CARGAR AUTOMÁTICO
window.onload = cargarProductos;
