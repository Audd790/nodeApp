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
            labels:[],
            datasets: [{
                label: 'Berapa lama telat dalam menit'
            }]
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
    if(tanggal!==null) 
    {    
        tanggal.addEventListener('change', (e)=>{
        tanggal_absen = e.target.value
        list = document.getElementsByClassName('show')
        
        while(list.length !== 0){
            list[0].style.display = 'none';
            list[0].classList = 'hide';
        }
        const xhr = new XMLHttpRequest();
        var data = new FormData()
        data.append("date", tanggal_absen)
        xhr.open('POST', 'chart/getChartData', true);
        // xhr.setRequestHeader("Content-Type", "multipar/form-data")
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.response)
                    console.log(divisiChart.data.labels.length)
                    // for(i=0 ; i < divisiChart.data.labels.length ; i++){
                    //     // var tmp = {
                    //     //     label: '',
                    //     //     data: 0,
                    //     //     borderWidth: 1
                    //     // }
                    //     // tmp.label = divisiChart.data.labels[i]
                    //     // console.log(res.sql[i].telat)
                    //     // tmp.data = 
                        
                    // }
                    console.log(res.sql)
                    divisiChart.data.datasets[0].data = res.sql.map(labels=>{
                        return labels.telat
                    })
                    // console.log(divisiChart.data)
                    divisiChart.update()
                } else{
                    console.error('Error:', xhr.status)
                }
            }
        };
        xhr.send(data);

        setTimeout(() => {
            xhr.open('POST', '/kehadiran/namaKaryawan', true);
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
                        divisiChart.data.labels = tmp
                        // console.log('tmp: '+ tmp) 
                        divisiChart.update()
                        // autocomplete(inputKaryawan, tmp);
                    } else{
                        console.error('Error:', xhr.status)
                    }
                }
            };
            // window.location.href = 'http://localhost:3000';
            xhr.send(data);
        }, 500);
        
        setTimeout(() => {
            
        }, 500);

        });
    }

