document.addEventListener('DOMContentLoaded', function(){
    const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: month.slice(0, currDate.getMonth()),
        datasets: [{
            label: 'Total Menit telat setiap bulan'
        }]
    },
    options: {
        layout: {
            padding: 30
        },
        plugins: {
            colors: {
                forceOverride: true
            },
            legend:{
                labels:{
                    font:{
                        size:14
                        
                    }
                }
            }
            // customValue: {
            //   name: 'ROI',
            // }
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true
            }
        }
    }

    });
})