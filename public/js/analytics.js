const usageCtx = document.getElementById('usageChart');
new Chart(usageCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: 'Usage Hours',
            data: [320, 400, 350, 500, 420, 600, 580, 610, 700, 680],
            backgroundColor: '#27ae60'
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

const topCtx = document.getElementById('topFacilitiesChart');
new Chart(topCtx, {
    type: 'bar',
    data: {
        labels: ['Library', 'Lab 1', 'Gym', 'Study Room', 'Auditorium'],
        datasets: [{
            label: 'Usage Count',
            data: [120, 110, 90, 85, 75],
            backgroundColor: '#4ca771'
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true
    }
});

const sourceCtx = document.getElementById('sourcePieChart');
new Chart(sourceCtx, {
    type: 'pie',
    data: {
        labels: ['Website', 'Mobile App', 'Walk-in'],
        datasets: [{
            data: [60, 30, 10],
            backgroundColor: ['#27ae60', '#3cb395ff', '#a3e4d7']
        }]
    }
});

const hourCtx = document.getElementById('hourlyChart');
new Chart(hourCtx, {
    type: 'line',
    data: {
        labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
        datasets: [{
            label: 'Active Users',
            data: [10, 30, 55, 60, 45, 70, 50, 25],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39,174,96,0.2)',
            fill: true
        }]
    },
    options: { responsive: true }
});