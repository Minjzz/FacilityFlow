document.addEventListener("DOMContentLoaded", function() {
    const facilityStats = window.facilityStats || [];
    const dailyStats = window.dailyStats || [];

    const pieLabels = facilityStats.map(f => f.type);
    const pieData = facilityStats.map(f => f.count);

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieData,
                backgroundColor: ['#27ae60','#2980b9','#f39c12','#e74c3c','#8e44ad','#16a085']
            }]
        },
        options: { responsive: true }
    });

    const lineLabels = dailyStats.map(d => new Date(d.day).toISOString().split('T')[0]);
    const lineData = dailyStats.map(d => d.count);

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: lineLabels,
            datasets: [{
                label: 'Reservations',
                data: lineData,
                fill: true,
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41,128,185,0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { beginAtZero: true, title: { display: true, text: 'Reservations' } }
            }
        }
    });

    const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const weeklyCounts = [0,0,0,0,0,0,0];

    dailyStats.forEach(d => {
        const dayIndex = new Date(d.day).getDay();
        weeklyCounts[dayIndex] += d.count;
    });

    const weeklyCtx = document.getElementById('weeklyBarChart').getContext('2d');
    new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: weekDays,
            datasets: [{
                label: 'Reservations',
                data: weeklyCounts,
                backgroundColor: '#27ae60'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
});
