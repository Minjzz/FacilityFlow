const pieCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Library', 'Computer Lab', 'Study Room'],
        datasets: [{
            label: 'Reservations',
            data: [10, 15, 9],
            backgroundColor: [
                'rgba(39, 174, 96, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(130, 201, 132, 0.7)'
            ],
            borderColor: ['#27ae60', '#2980b9', '#81c784'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
    }
});

const verticalBarCtx = document.getElementById('weeklyBarChart').getContext('2d');
new Chart(verticalBarCtx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Reservations',
            data: [5, 8, 7, 10, 6, 9, 4],
            backgroundColor: 'rgba(39, 174, 96, 0.8)',
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 2 } }
        }
    }
});

const lineCtx = document.getElementById('lineChart').getContext('2d');
new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23'],
        datasets: [{
            label: 'Reservations',
            data: [3, 4, 5, 2, 6, 7, 4, 5, 3, 6, 7, 4, 5, 3, 6, 4, 5, 7, 3, 4, 5, 6, 4],
            borderColor: 'rgba(39, 174, 96, 1)',
            backgroundColor: 'rgba(39, 174, 96, 0.2)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#27ae60'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
            x: { display: true, title: { display: true, text: 'Date' } },
            y: { display: true, title: { display: true, text: 'Number of Reservations' }, beginAtZero: true, ticks: { stepSize: 1 } }
        }
    }
});
