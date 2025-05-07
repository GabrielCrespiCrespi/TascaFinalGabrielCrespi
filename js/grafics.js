let instanciaGrafic = null;

function actualitzarGrafic() {
    const tasques = JSON.parse(localStorage.getItem('tasques')) || [];
    const tasquesRealitzades = tasques.filter(t => t.realitzada);

    if (tasquesRealitzades.length === 0) {
        const llenç = document.getElementById('grafic-tasques');
        if (llenç) {
            const ctx = llenç.getContext('2d');
            ctx.clearRect(0, 0, llenç.width, llenç.height);
            ctx.font = '16px Arial';
            ctx.fillText('No hi ha tasques realitzades per mostrar.', 20, 50);
        }
        return;
    }

    const mesos = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    const tasquesPerMes = Array(12).fill(0);
    tasquesRealitzades.forEach(tasca => {
        const data = new Date(tasca.data);
        if (!isNaN(data)) {
            const mes = data.getMonth();
            tasquesPerMes[mes]++;
        }
    });

    if (instanciaGrafic) {
        instanciaGrafic.destroy();
    }

    const llenç = document.getElementById('grafic-tasques');
    const ctx = llenç.getContext('2d');

    instanciaGrafic = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mesos,
            datasets: [{
                label: 'Tasques realitzades',
                data: tasquesPerMes,
                borderColor: '#00bcd4',
                backgroundColor: 'rgba(0, 188, 212, 0.2)',
                fill: true,
                tension: 0.1,
                pointBackgroundColor: '#00bcd4',
                pointBorderColor: '#00bcd4',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            }
        }
    });
}