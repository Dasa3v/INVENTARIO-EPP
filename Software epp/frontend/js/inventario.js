const API_URL = 'http://localhost:8000/api';

let html5QrCode = null;
let scannerActive = false;
let currentQR = null;
let currentProducto = null;

// Inicializar escáner
document.getElementById('start-scanner').addEventListener('click', function() {
    if (scannerActive) return;
    
    const qrReader = document.getElementById('qr-reader');
    html5QrCode = new Html5Qrcode("qr-reader");
    
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanError
    ).then(() => {
        scannerActive = true;
        document.getElementById('start-scanner').classList.add('hidden');
        document.getElementById('stop-scanner').classList.remove('hidden');
    }).catch(err => {
        console.error('Error al iniciar escáner:', err);
        showAlert('Error al iniciar la cámara. Asegúrate de dar permisos de cámara.', 'error');
    });
});

// Detener escáner
document.getElementById('stop-scanner').addEventListener('click', function() {
    if (html5QrCode && scannerActive) {
        html5QrCode.stop().then(() => {
            scannerActive = false;
            document.getElementById('start-scanner').classList.remove('hidden');
            document.getElementById('stop-scanner').classList.add('hidden');
            document.getElementById('qr-reader').innerHTML = '';
        }).catch(err => {
            console.error('Error al detener escáner:', err);
        });
    }
});

// Callback de escaneo exitoso
function onScanSuccess(decodedText, decodedResult) {
    if (decodedText && decodedText !== currentQR) {
        currentQR = decodedText;
        loadProducto(decodedText);
        
        // Detener escáner después de escanear
        if (html5QrCode && scannerActive) {
            html5QrCode.stop().then(() => {
                scannerActive = false;
                document.getElementById('start-scanner').classList.remove('hidden');
                document.getElementById('stop-scanner').classList.add('hidden');
            });
        }
    }
}

// Callback de error de escaneo
function onScanError(errorMessage) {
    // Ignorar errores de escaneo continuo
}

// Cargar información del producto
async function loadProducto(qr) {
    try {
        const response = await fetch(`${API_URL}/productos/${qr}`);
        const producto = await response.json();
        
        if (response.ok) {
            currentProducto = producto;
            displayProductoInfo(producto);
        } else {
            showAlert('Producto no encontrado. Debes registrarlo primero en la sección de Productos.', 'error');
        }
    } catch (error) {
        showAlert('Error al cargar el producto', 'error');
        console.error('Error:', error);
    }
}

// Mostrar información del producto
function displayProductoInfo(producto) {
    const productoInfo = document.getElementById('producto-info');
    const productoDetails = document.getElementById('producto-details');
    
    productoDetails.innerHTML = `
        <p><strong>QR:</strong> ${producto.qr}</p>
        <p><strong>Producto:</strong> ${producto.producto || 'N/A'}</p>
        <p><strong>Talla:</strong> ${producto.talla || 'N/A'}</p>
        <p><strong>Color:</strong> ${producto.color || 'N/A'}</p>
        <p><strong>Área:</strong> ${producto.area || 'N/A'}</p>
    `;
    
    productoInfo.classList.remove('hidden');
}

// Registrar movimiento
document.getElementById('movimiento-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentQR) {
        showAlert('Primero debes escanear un código QR', 'error');
        return;
    }
    
    const tipo = document.getElementById('tipo-movimiento').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    try {
        const response = await fetch(`${API_URL}/movimientos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                qr: currentQR,
                tipo: tipo,
                cantidad: cantidad
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert(`Movimiento registrado correctamente: ${tipo} de ${cantidad} unidad(es)`, 'success');
            
            // Limpiar formulario
            document.getElementById('movimiento-form').reset();
            document.getElementById('producto-info').classList.add('hidden');
            currentQR = null;
            currentProducto = null;
            
            // Recargar inventario
            loadInventario();
        } else {
            showAlert(data.detail || 'Error al registrar movimiento', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    }
});

// Cargar inventario
async function loadInventario() {
    try {
        const response = await fetch(`${API_URL}/inventario`);
        const data = await response.json();
        
        const tbody = document.getElementById('inventario-body');
        
        if (data.inventario && data.inventario.length > 0) {
            tbody.innerHTML = data.inventario.map(item => `
                <tr>
                    <td>${item.qr}</td>
                    <td>${item.producto || 'N/A'}</td>
                    <td>${item.talla || 'N/A'}</td>
                    <td>${item.color || 'N/A'}</td>
                    <td>${item.area || 'N/A'}</td>
                    <td><strong>${item.stock || 0}</strong></td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos en el inventario</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar inventario:', error);
        document.getElementById('inventario-body').innerHTML = '<tr><td colspan="6" class="text-center">Error al cargar inventario</td></tr>';
    }
}

// Filtro de inventario
document.getElementById('filtro-inventario').addEventListener('input', function(e) {
    const filter = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#inventario-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
});

// Mostrar alerta
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Cargar inventario al iniciar
loadInventario();


