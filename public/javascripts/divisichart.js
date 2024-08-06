document.addEventListener('DOMContentLoaded', function(){
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Admin Sales & Engineer', 'ERP', 'Estimator', 'Finance & Accounting', 'GTI', 'Logistik', 'MEP', 'Operation', 'PCS', 'PPJM','Purchasing','RPE','Sales','Teknisi Servis','Teknisi TC','Tim Bali'],
        datasets: []
    },
    options: {
        maintainAspectRatio: false,
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
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    crossAlign: 'far',
                    align:'inner',
                    font:{
                        size:10,
                        weight: 'bold'
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    }

});
const month = ['January', 
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December']
window.addEventListener('beforeprint', () => {
    myChart.resize(600, 600);
});
window.addEventListener('afterprint', () => {
    myChart.resize();
});
const xhr = new XMLHttpRequest
xhr.open('GET', window.location.href+'/getChartData', true);
// xhr.setRequestHeader("Content-Type", "multipar/form-data")
xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.response)
            for(i=0 ; i < month.slice(0,6).length ; i++){
                var tmp = {
                    label: '',
                    data: [],
                    borderWidth: 1
                }
                tmp.label = month[i]
                res.sql.map(row=>{
                    if(month[i] == row.bulan){
                        tmp.data.push(row.jamTelat)
                    }
                })
                myChart.data.datasets.push(tmp)
            }
            // console.log(myChart.data)
            myChart.update()
        } else{
            console.error('Error:', xhr.status)
        }
    }
};
// window.location.href = 'http://localhost:3000';
xhr.send();
})