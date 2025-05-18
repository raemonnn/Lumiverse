document.addEventListener("DOMContentLoaded", function () {
    // Chart.js to display Total Users Graph
    const ctx = document.getElementById('userChart').getContext('2d');
    const userChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['User 1', 'User 2', 'User 3', 'User 4', 'User 5'],
            datasets: [{
                label: 'Number of Users',
                data: [12, 19, 3, 5, 2],
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        
    });


    // ScrollReveal Animation for Dashboard Content
    ScrollReveal().reveal('.container', {
        delay: 500,
        duration: 1500,
        easing: 'ease-in-out',
        reset: true
    });
});


