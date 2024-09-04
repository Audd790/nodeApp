var data = new FormData()
data.append("tanggal", 7)
const month = ['Januari', 
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember']
    const xhr = new XMLHttpRequest

    const divisiCtx = document.getElementById('divisiChart').getContext('2d');
    const divisiChart = new Chart(divisiCtx, {
        type: 'bar',
        data: {
            datasets: []
        },
        options: {
            maintainAspectRatio: false,
            // layout: {
            //     padding: 30
            // },
            plugins: {
                title: {
                    // display: true,
                    // text: 'Custom Chart Title'
                },
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
    window.addEventListener('beforeprint', () => {
        divisiChart.resize(600, 600);
    });
    window.addEventListener('afterprint', () => {
        divisiChart.resize();
    });
    xhr.open('GET', '/kehadiran/namaKaryawan', true);
    var tmp 
// xhr.setRequestHeader("Content-Type", "multipar/form-data")
xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200) {
            // var res = JSON.parse(xhr.response)
            listNama = JSON.parse(xhr.response)
            tmp = listNama.sql.map(labels=>{
                return labels.nama
            })
            divisiChart
            // console.log(tmp) 
            // autocomplete(inputKaryawan, tmp);
        } else{
            console.error('Error:', xhr.status)
        }
    }
};
// window.location.href = 'http://localhost:3000';
xhr.send(data);


xhr.open('GET', 'chart/getChartData', true);
// xhr.setRequestHeader("Content-Type", "multipar/form-data")
xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.response)
            console.log(res.sql)
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
                divisiChart.data.datasets.push(tmp)
            }
            // console.log(divisiChart.data)
            divisiChart.update()
        } else{
            console.error('Error:', xhr.status)
        }
    }
};
xhr.send(data);