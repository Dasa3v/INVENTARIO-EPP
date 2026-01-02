const API_URL = 'http://localhost:8000/api';

document.getElementById('registro-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const alertContainer = document.getElementById('alert-container');
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    // Limpiar alertas anteriores
    alertContainer.innerHTML = '';
    
    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
        alertContainer.innerHTML = '<div class="alert alert-error">Las contraseñas no coinciden</div>';
        return;
    }
    
    // Validar longitud mínima
    if (password.length < 6) {
        alertContainer.innerHTML = '<div class="alert alert-error">La contraseña debe tener al menos 6 caracteres</div>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alertContainer.innerHTML = '<div class="alert alert-success">Usuario registrado correctamente. Redirigiendo al login...</div>';
            
            // Redirigir a login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            alertContainer.innerHTML = `<div class="alert alert-error">${data.detail || 'Error al registrar usuario'}</div>`;
        }
    } catch (error) {
        alertContainer.innerHTML = '<div class="alert alert-error">Error de conexión con el servidor. Asegúrate de que el backend esté ejecutándose.</div>';
        console.error('Error:', error);
    }
});


