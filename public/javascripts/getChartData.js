const xhr = new XMLHttpRequest
xhr.open('POST', '/kehadiran/chartKaryawan', true);
// xhr.setRequestHeader("Content-Type", "multipar/form-data")
xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200) {
            karyawan = JSON.parse(xhr.response)
            console.log(karyawan)
            myChart.data.datasets[0].data = karyawan.map(labels=>{
                return labels.menitTelat
            })
            myChart.update()
        } else{
            console.error('Error:', xhr.status)
        }
    }
};
// window.location.href = 'http://localhost:3000';
xhr.send();