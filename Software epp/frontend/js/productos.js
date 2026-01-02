const API_URL = 'http://localhost:8000/api';

let productos = [];

// Cargar productos
async function loadProductos(filters = {}) {
    try {
        const params = new URLSearchParams();
        if (filters.producto) params.append('producto', filters.producto);
        if (filters.talla) params.append('talla', filters.talla);
        if (filters.color) params.append('color', filters.color);
        if (filters.area) params.append('area', filters.area);
        
        const response = await fetch(`${API_URL}/productos?${params.toString()}`);
        const data = await response.json();
        
        productos = data.productos || [];
        renderProductos();
        
        // Verificar si hay un nuevo QR para registrar
        const nuevoQR = localStorage.getItem('nuevoQR');
        if (nuevoQR) {
            localStorage.removeItem('nuevoQR');
            // Buscar si el producto ya existe
            const existe = productos.find(p => p.qr === nuevoQR);
            if (!existe) {
                showAlert(`QR ${nuevoQR} generado. Completa los datos del producto a continuación.`, 'info');
                // Abrir modal para crear producto
                crearProductoDesdeQR(nuevoQR);
            }
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showAlert('Error al cargar productos', 'error');
    }
}

// Renderizar productos
function renderProductos() {
    const tbody = document.getElementById('productos-body');
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay productos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td>${producto.qr}</td>
            <td>${producto.producto || 'N/A'}</td>
            <td>${producto.subtipo || 'N/A'}</td>
            <td>${producto.genero || 'N/A'}</td>
            <td>${producto.talla || 'N/A'}</td>
            <td>${producto.color || 'N/A'}</td>
            <td>${producto.marca || 'N/A'}</td>
            <td>${producto.area || 'N/A'}</td>
            <td>
                <button class="btn btn-primary" onclick="editarProducto('${producto.qr}')" style="padding: 0.5rem; font-size: 0.9rem;">Editar</button>
                <button class="btn btn-danger" onclick="eliminarProducto('${producto.qr}')" style="padding: 0.5rem; font-size: 0.9rem;">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Aplicar filtros
document.getElementById('aplicar-filtros').addEventListener('click', function() {
    const filters = {
        producto: document.getElementById('filtro-producto').value,
        talla: document.getElementById('filtro-talla').value,
        color: document.getElementById('filtro-color').value,
        area: document.getElementById('filtro-area').value
    };
    
    loadProductos(filters);
});

// Limpiar filtros
document.getElementById('limpiar-filtros').addEventListener('click', function() {
    document.getElementById('filtro-producto').value = '';
    document.getElementById('filtro-talla').value = '';
    document.getElementById('filtro-color').value = '';
    document.getElementById('filtro-area').value = '';
    loadProductos();
});

// Crear producto desde QR generado
function crearProductoDesdeQR(qr) {
    document.getElementById('edit-qr').value = qr;
    document.getElementById('edit-producto').value = qr.split('_')[0]; // Extraer tipo de producto del QR
    document.getElementById('modal-title').textContent = 'Registrar Nuevo Producto';
    const modal = document.getElementById('modal-editar');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.getElementById('form-editar').setAttribute('data-mode', 'create');
}

// Editar producto
window.editarProducto = async function(qr) {
    const producto = productos.find(p => p.qr === qr);
    if (!producto) return;
    
    document.getElementById('edit-qr').value = producto.qr;
    document.getElementById('edit-producto').value = producto.producto || '';
    document.getElementById('edit-subtipo').value = producto.subtipo || '';
    document.getElementById('edit-genero').value = producto.genero || '';
    document.getElementById('edit-talla').value = producto.talla || '';
    document.getElementById('edit-color').value = producto.color || '';
    document.getElementById('edit-marca').value = producto.marca || '';
    document.getElementById('edit-area').value = producto.area || '';
    document.getElementById('edit-descripcion').value = producto.descripcion || '';
    
    document.getElementById('modal-title').textContent = 'Editar Producto';
    const modal = document.getElementById('modal-editar');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.getElementById('form-editar').setAttribute('data-mode', 'edit');
};

// Eliminar producto
window.eliminarProducto = async function(qr) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_URL}/productos/${qr}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Producto eliminado correctamente', 'success');
            loadProductos();
        } else {
            showAlert(data.detail || 'Error al eliminar producto', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    }
};

// Guardar producto (crear o actualizar)
document.getElementById('form-editar').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const mode = this.getAttribute('data-mode');
    const qr = document.getElementById('edit-qr').value;
    
    const productoData = {
        producto: document.getElementById('edit-producto').value,
        subtipo: document.getElementById('edit-subtipo').value || null,
        genero: document.getElementById('edit-genero').value || null,
        talla: document.getElementById('edit-talla').value || null,
        color: document.getElementById('edit-color').value || null,
        marca: document.getElementById('edit-marca').value || null,
        area: document.getElementById('edit-area').value || null,
        descripcion: document.getElementById('edit-descripcion').value || null
    };
    
    try {
        let response;
        if (mode === 'create') {
            // Crear nuevo producto
            response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    qr: qr,
                    ...productoData
                })
            });
        } else {
            // Actualizar producto existente
            response = await fetch(`${API_URL}/productos/${qr}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoData)
            });
        }
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert(mode === 'create' ? 'Producto creado correctamente' : 'Producto actualizado correctamente', 'success');
            const modal = document.getElementById('modal-editar');
            modal.classList.add('hidden');
            modal.style.display = 'none';
            loadProductos();
        } else {
            showAlert(data.detail || 'Error al guardar producto', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    }
});

// Cancelar edición
document.getElementById('cancelar-editar').addEventListener('click', function() {
    const modal = document.getElementById('modal-editar');
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.getElementById('form-editar').reset();
});

// Cerrar modal al hacer click fuera
document.getElementById('modal-editar').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
        this.style.display = 'none';
        document.getElementById('form-editar').reset();
    }
});

// Mostrar alerta
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Cargar productos al iniciar
loadProductos();

