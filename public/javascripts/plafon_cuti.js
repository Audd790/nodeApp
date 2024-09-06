$('#ambilCuti').on('click', function(){
    const xhr = new XMLHttpRequest
    xhr.open('GET', 'ambilCuti', true);
    // xhr.setRequestHeader("Content-Type", "multipar/form-data")
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                // var res = JSON.parse(xhr.response)
                var res = JSON.parse(xhr.response)
                if(res.err !== ''){
                    alert(res.err)
                }
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    // window.location.href = 'http://localhost:3000';
    xhr.send();
})
$('#getCuti').on('click', function(){
    const xhr = new XMLHttpRequest
    xhr.open('GET', 'getCuti', true);
    // xhr.setRequestHeader("Content-Type", "multipar/form-data")
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                // var res = JSON.parse(xhr.response)
                var res = JSON.parse(xhr.response)
                $('#isi').text( 'sisa 1 tahun sebelumnya: '+ res.sql[0].n_1+ ', sisa 2 tahun sebelumnya: '+ res.sql[0].n_2 + ', total cuti: ' +res.sql[0].total_cuti +', sisa cuti: '+(res.sql[0].sisa_cuti+1))
                console.log(res) 
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    // window.location.href = 'http://localhost:3000';
    xhr.send();
})