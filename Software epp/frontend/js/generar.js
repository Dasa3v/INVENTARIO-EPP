const API_URL = 'http://localhost:8000/api';

let currentQR = null;
let currentQRCanvas = null;

// Verificar que la librería QRCode esté cargada (local, sin internet)
function verificarLibreria() {
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded');
        return false;
    }
    return true;
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar librería
    if (!verificarLibreria()) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.innerHTML = '<div class="alert alert-error">Error: La librería de QR no se cargó correctamente. Recarga la página.</div>';
        }
        return;
    }
    
    // Configurar event listeners
    const generarForm = document.getElementById('generar-form');
    const downloadQr = document.getElementById('download-qr');
    const downloadSvg = document.getElementById('download-svg');
    const registrarProducto = document.getElementById('registrar-producto');
    
    if (generarForm) {
        generarForm.addEventListener('submit', generarQR);
    }
    
    if (downloadQr) {
        downloadQr.addEventListener('click', descargarPNG);
    }
    
    if (downloadSvg) {
        downloadSvg.addEventListener('click', descargarSVG);
    }
    
    if (registrarProducto) {
        registrarProducto.addEventListener('click', irARegistrar);
    }
});

// Función para generar QR
async function generarQR(e) {
    e.preventDefault();
    
    const alertContainer = document.getElementById('alert-container');
    const producto = document.getElementById('producto');
    
    if (!alertContainer || !producto) {
        console.error('Elementos del DOM no encontrados');
        return;
    }
    
    const productoValue = producto.value;
    
    // Limpiar alertas anteriores
    alertContainer.innerHTML = '';
    
    if (!productoValue) {
        alertContainer.innerHTML = '<div class="alert alert-error">Por favor selecciona un tipo de producto</div>';
        return;
    }
    
    // Verificar que la librería esté cargada (local, no requiere internet)
    if (!verificarLibreria()) {
        alertContainer.innerHTML = `
            <div class="alert alert-error">
                <strong>❌ Error: Librería de QR no disponible</strong><br>
                La librería QRCode local no se cargó correctamente.<br><br>
                <strong>Soluciones:</strong><br>
                1. Verifica que el archivo js/lib/qrcode-local.js exista<br>
                2. Recarga la página (F5 o Ctrl+F5)<br>
                3. Verifica la consola del navegador (F12) para más detalles
            </div>
        `;
        return;
    }
    
    // Generar QR único: PRODUCTO_TIMESTAMP
    const timestamp = Date.now();
    const qrCode = `${productoValue}_${timestamp}`;
    currentQR = qrCode;
    
    // Generar imagen QR
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) {
        alertContainer.innerHTML = '<div class="alert alert-error">Error: No se encontró el contenedor de QR</div>';
        return;
    }
    
    qrContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Generando QR...</p>';
    
    // Crear un canvas nuevo
    const canvas = document.createElement('canvas');
    qrContainer.innerHTML = '';
    qrContainer.appendChild(canvas);
    
    try {
        await QRCode.toCanvas(canvas, qrCode, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        });
        
        currentQRCanvas = canvas;
        
        // Mostrar resultado
        const qrResult = document.getElementById('qr-result');
        if (qrResult) {
            qrResult.classList.remove('hidden');
            qrResult.style.display = 'block';
        }
        
        const qrText = document.getElementById('qr-text');
        if (qrText) {
            qrText.textContent = `Código QR: ${qrCode}`;
        }
        
        alertContainer.innerHTML = '<div class="alert alert-success">✅ QR generado correctamente</div>';
    } catch (error) {
        alertContainer.innerHTML = '<div class="alert alert-error">❌ Error al generar el código QR: ' + error.message + '</div>';
        console.error('Error generando QR:', error);
        qrContainer.innerHTML = '<p style="text-align: center; color: var(--danger);">Error al generar QR</p>';
    }
}

// Descargar QR como PNG
function descargarPNG() {
    if (!currentQR || !currentQRCanvas) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.innerHTML = '<div class="alert alert-error">Primero debes generar un código QR</div>';
        } else {
            alert('Primero debes generar un código QR');
        }
        return;
    }
    
    try {
        const canvas = currentQRCanvas;
        const link = document.createElement('a');
        link.download = `QR_${currentQR}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Mostrar mensaje de éxito
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.innerHTML = '<div class="alert alert-success">✅ QR descargado correctamente como PNG</div>';
        }
    } catch (error) {
        console.error('Error descargando QR:', error);
        alert('Error al descargar el QR: ' + error.message);
    }
}

// Descargar QR como SVG
function descargarSVG() {
    if (!currentQR) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.innerHTML = '<div class="alert alert-error">Primero debes generar un código QR</div>';
        } else {
            alert('Primero debes generar un código QR');
        }
        return;
    }
    
    if (!verificarLibreria()) {
        alert('Error: La librería de QR no está disponible');
        return;
    }
    
    try {
        QRCode.toString(currentQR, { 
            type: 'svg',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(err, string) {
            if (err) {
                console.error('Error generando SVG:', err);
                const alertContainer = document.getElementById('alert-container');
                if (alertContainer) {
                    alertContainer.innerHTML = '<div class="alert alert-error">Error al generar SVG: ' + err.message + '</div>';
                } else {
                    alert('Error al generar SVG: ' + err.message);
                }
                return;
            }
            
            const blob = new Blob([string], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `QR_${currentQR}.svg`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            const alertContainer = document.getElementById('alert-container');
            if (alertContainer) {
                alertContainer.innerHTML = '<div class="alert alert-success">✅ QR descargado correctamente como SVG</div>';
            }
        });
    } catch (error) {
        console.error('Error descargando SVG:', error);
        alert('Error al descargar el SVG: ' + error.message);
    }
}

// Ir a registrar producto
function irARegistrar() {
    if (!currentQR) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.innerHTML = '<div class="alert alert-error">Primero debes generar un código QR</div>';
        } else {
            alert('Primero debes generar un código QR');
        }
        return;
    }
    
    // Guardar QR en localStorage para que productos.html lo use
    localStorage.setItem('nuevoQR', currentQR);
    window.location.href = 'productos.html';
}


