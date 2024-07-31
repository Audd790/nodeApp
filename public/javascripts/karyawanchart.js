document.addEventListener('DOMContentLoaded', function(){
const ctx = document.getElementById('myChart').getContext('2d');
var myChart
var count = 0
var tanggal = document.getElementById('tanggal2')
var divisi = document.getElementById('mySelect');
if(tanggal!==null){
    tanggal.addEventListener('change', createBarChart)
}

if(divisi!==null) divisi.addEventListener('change', createBarChart)

function createBarChart(){
    if(myChart !== undefined){
        myChart.destroy();
    }
    var tanggal_absen = tanggal.value
    const xhr = new XMLHttpRequest
    var data = new FormData()
    var karyawan ;
    // console.log(divisi.value)
    data.append("tanggal", tanggal_absen)
    data.append('divisi', divisi.value)
    xhr.open('POST', 'http://localhost:5000/kehadiran/info/chart', true);
    // xhr.setRequestHeader("Content-Type", "multipar/form-data")
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                karyawan = JSON.parse(xhr.response)
                // console.log(karyawan)
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: karyawan.map(labels=>{
                            return labels.nama
                        }),
                        datasets: karyawan.slice(16).map(labels=>{
                                    let entry={
                                        "label": labels.nama,
                                        "data": labels.menitTelat
                                    }
                                    console.log(labels.menitTelat)
                                    return entry
                                })
                        // karyawan.map(entry => {
                        //     let properties = {
                        //       "capacity": car.capacity,
                        //       "size": "large"
                        //     };
                        //     if (car.capacity <= 5){
                        //       properties['size'] = "medium";
                        //     }
                        //     if (car.capacity <= 3){
                        //       properties['size'] = "small";
                        //     }
                        //     return properties;
                        //    })
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
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    xhr.send(data);
    // window.location.href = 'http://localhost:3000';
    // console.log(karyawan)
    
    window.addEventListener('beforeprint', () => {
        myChart.resize(600, 600);
      });
      window.addEventListener('afterprint', () => {
        myChart.resize();
      });        
}


})

// function selectFucntion(params) {
//     if(mySelector.value == 1){
//         myChart.data = {
//             labels: ['Admin Sales & Engineer', 'ERP', 'Estimator', 'Finance & Accounting', 'GTI', 'Logistik', 'MEP', 'Operation', 'PCS', 'PPJM','Purchasing','RPE','Sales','Teknisi Servis','Teknisi TC','Tim Bali'],
//             datasets: [{
//                 label: 'Januari',
//                 data: [2,
//                     1,
//                     5.75,
//                     2.5,
//                     2.5,
//                     5,
//                     2.545454545,
//                     2.409090909,
//                     0,
//                     3,
//                     2,
//                     7.428571429,
//                     5.5,
//                     2.75,
//                     7.8,
//                     0.5
//                     ],
//                 borderWidth: 1
//             },
//             {
//                 label: 'Februari',
//                 data: [
//                     2.111111111,
//                     3.333333333,
//                     6.5,
//                     0.833333333,
//                     1.25,
//                     3.571428571,
//                     3.227272727,
//                     1.954545455,
//                     0,
//                     2.583333333,
//                     3,
//                     7.285714286,
//                     5.875,
//                     2.5,
//                     8.6,
//                     0
    
//                 ],
//                 borderWidth: 1
//             },
//             {
//                 label: 'Maret',
//                 data: [                
//                     2.666666667,
//                     6,
//                     8.5,
//                     2.916666667,
//                     2.25,
//                     6,
//                     2.909090909,
//                     2.863636364,
//                     0,
//                     4.083333333,
//                     5.666666667,
//                     7.714285714,
//                     6.625,
//                     3.5,
//                     5.4,
//                     0
    
//                 ],
    
//                 borderWidth: 1
//             },
//             {
//                 label: 'April',
//                 data: [                            
//                     1.333333333,
//                     3,
//                     3.5,
//                     1,
//                     1.25,
//                     3,
//                     1.681818182,
//                     1.045454545,
//                     0,
//                     2.916666667,
//                     2.5,
//                     7.571428571,
//                     6,
//                     2.75,
//                     3.8,
//                     0
    
//                 ],
    
//                 borderWidth: 1
//             },
//             {
//                 label: 'Mei',
//                 data: [                            
//                     2.555555556,
//                     2.333333333,
//                     5.5,
//                     1.307692308,
//                     1.75,
//                     1.285714286,
//                     1.692307692,
//                     0.863636364,
//                     0,
//                     2.333333333,
//                     1.5,
//                     7.142857143,
//                     5.555555556,
//                     1.4,
//                     0.6,
//                     0
                    
    
//                 ],
                
                
//                 borderWidth: 1
//             },
//             {
//                 label: 'Juni',
//                 data: [                            
//                     1.7,
//                     3.666666667,
//                     7.25,
//                     2,
//                     3.5,
//                     3.571428571,
//                     2,
//                     1.590909091,
//                     0,
//                     2.75,
//                     3.833333333,
//                     7.875,
//                     4.1,
//                     2.4,
//                     2.6,
//                     0
    
                    
    
//                 ],
                
                
//                 borderWidth: 1
//             }]
//         }
//     }
//     else{
//         myChart.data = {
//             labels:['Januari','Februari','Maret','April','Mei','Juni'],
//             datasets:[{
//                 label:'RPE',
    
//                 data: mySelector.value.split(',')
//             }],
//         }
//         console.log(myChart.data)
//     }
//     myChart.update(

//     )
// }