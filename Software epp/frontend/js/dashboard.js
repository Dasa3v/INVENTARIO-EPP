const API_URL = 'http://localhost:8000/api';

let chart = null;

// Cargar datos del dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        const data = await response.json();
        
        // Actualizar totales
        document.getElementById('total-productos').textContent = data.total_productos || 0;
        document.getElementById('total-unidades').textContent = data.total_unidades || 0;
        
        // Crear gráfica
        if (data.productos_por_tipo && data.productos_por_tipo.length > 0) {
            createChart(data.productos_por_tipo);
        } else {
            document.getElementById('chart-productos').style.display = 'none';
        }
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
    }
}

// Crear gráfica
function createChart(data) {
    const ctx = document.getElementById('chart-productos');
    ctx.style.display = 'block';
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#1a1a1a';
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.producto),
            datasets: [{
                label: 'Cantidad',
                data: data.map(item => item.cantidad),
                backgroundColor: 'rgba(74, 158, 255, 0.6)',
                borderColor: 'rgba(74, 158, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Recargar dashboard cuando cambie el tema
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    
    // Observar cambios de tema
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                if (chart) {
                    loadDashboard();
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});


