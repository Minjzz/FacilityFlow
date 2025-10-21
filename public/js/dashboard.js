const ctx1 = document.getElementById('resourceGraph').getContext('2d');
const resourceGraph = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{
            label: 'Library',
            data: [80, 85, 75, 90, 88, 70, 95],
            borderColor: '#2e8b57',
            backgroundColor: '#a3e4a3',
            tension: 0.3,
            fill: true
        },{
            label: 'Labs',
            data: [60, 70, 65, 75, 72, 68, 80],
            borderColor: '#c4b800',
            backgroundColor: '#f7f48b',
            tension: 0.3,
            fill: true
        }]
    },
    options: { responsive: true }
});

const ctx2 = document.getElementById('userGraph').getContext('2d');
const userGraph = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{
            label: 'Logins',
            data: [200, 250, 220, 300, 280, 150, 320],
            backgroundColor: '#2e8b57'
        }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
});

const ctx3 = document.getElementById('efficiencyChart').getContext('2d');
const efficiencyChart = new Chart(ctx3, {
    type: 'doughnut',
    data: {
        labels: ['Achieved', 'Remaining'],
        datasets: [{
            data: [94.8, 5.2],
            backgroundColor: ['#2e8b57', '#c2f0c2'],
            borderWidth: 1
        }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});
