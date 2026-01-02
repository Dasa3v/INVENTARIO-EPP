// Sistema de tema unificado usando data-theme
(function() {
    // Obtener tema guardado o usar 'light' por defecto
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Actualizar botón de tema
    function updateThemeButton() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // Cambiar tema
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton();
    }
    
    // Inicializar botón de tema cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        updateThemeButton();
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    });
})();


