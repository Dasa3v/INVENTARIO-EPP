const API_URL = 'http://localhost:8000/api';

document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const alertContainer = document.getElementById('alert-container');
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    
    // Limpiar alertas anteriores
    alertContainer.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar usuario en localStorage
            localStorage.setItem('usuario', data.usuario);
            
            // Mostrar mensaje de éxito
            alertContainer.innerHTML = '<div class="alert alert-success">Inicio de sesión exitoso. Redirigiendo...</div>';
            
            // Redirigir a home después de 1 segundo
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            alertContainer.innerHTML = `<div class="alert alert-error">${data.detail || 'Error al iniciar sesión'}</div>`;
        }
    } catch (error) {
        alertContainer.innerHTML = '<div class="alert alert-error">Error de conexión con el servidor. Asegúrate de que el backend esté ejecutándose.</div>';
        console.error('Error:', error);
    }
});


