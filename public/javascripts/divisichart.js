const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Admin Sales & Engineer', 'ERP', 'Estimator', 'Finance & Accounting', 'GTI', 'Logistik', 'MEP', 'Operation', 'PCS', 'PPJM','Purchasing','RPE','Sales','Teknisi Servis','Teknisi TC','Tim Bali'],
        datasets: []
        //     label: 'Januari',
        //     data: [2,
        //         1,
        //         5.75,
        //         2.5,
        //         2.5,
        //         5,
        //         2.545454545,
        //         2.409090909,
        //         0,
        //         3,
        //         2,
        //         7.428571429,
        //         5.5,
        //         2.75,
        //         7.8,
        //         0.5
        //         ],
        //     borderWidth: 1
        // },
        // {
        //     label: 'Februari',
        //     data: [
        //         2.111111111,
        //         3.333333333,
        //         6.5,
        //         0.833333333,
        //         1.25,
        //         3.571428571,
        //         3.227272727,
        //         1.954545455,
        //         0,
        //         2.583333333,
        //         3,
        //         7.285714286,
        //         5.875,
        //         2.5,
        //         8.6,
        //         0

        //     ],
        //     borderWidth: 1
        // },
        // {
        //     label: 'Maret',
        //     data: [                
        //         2.666666667,
        //         6,
        //         8.5,
        //         2.916666667,
        //         2.25,
        //         6,
        //         2.909090909,
        //         2.863636364,
        //         0,
        //         4.083333333,
        //         5.666666667,
        //         7.714285714,
        //         6.625,
        //         3.5,
        //         5.4,
        //         0

        //     ],

        //     borderWidth: 1
        // },
        // {
        //     label: 'April',
        //     data: [                            
        //         1.333333333,
        //         3,
        //         3.5,
        //         1,
        //         1.25,
        //         3,
        //         1.681818182,
        //         1.045454545,
        //         0,
        //         2.916666667,
        //         2.5,
        //         7.571428571,
        //         6,
        //         2.75,
        //         3.8,
        //         0

        //     ],

        //     borderWidth: 1
        // },
        // {
        //     label: 'Mei',
        //     data: [                            
        //         2.555555556,
        //         2.333333333,
        //         5.5,
        //         1.307692308,
        //         1.75,
        //         1.285714286,
        //         1.692307692,
        //         0.863636364,
        //         0,
        //         2.333333333,
        //         1.5,
        //         7.142857143,
        //         5.555555556,
        //         1.4,
        //         0.6,
        //         0
                

        //     ],
            
            
        //     borderWidth: 1
        // },
        // {
        //     label: 'Juni',
        //     data: [                            
        //         1.7,
        //         3.666666667,
        //         7.25,
        //         2,
        //         3.5,
        //         3.571428571,
        //         2,
        //         1.590909091,
        //         0,
        //         2.75,
        //         3.833333333,
        //         7.875,
        //         4.1,
        //         2.4,
        //         2.6,
        //         0

                

        //     ],
            
            
        //     borderWidth: 1
        // }]
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
document.addEventListener('DOMContentLoaded', function(){
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


window.addEventListener('beforeprint', () => {
    myChart.resize(600, 600);
  });
  window.addEventListener('afterprint', () => {
    myChart.resize();
  });