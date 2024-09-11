$('#ambilCuti').on('click', function(){
    const xhr = new XMLHttpRequest
    xhr.open('POST', 'ambilCuti', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
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
    var jumlah_cuti = $('#jmlhCuti').val()
    // window.location.href = 'http://localhost:3000';
    xhr.send('jumlahCuti='+jumlah_cuti);
})
$('#syncCuti').on('click', syncCuti)
syncCuti()
function syncCuti(){
    const xhr = new XMLHttpRequest
    xhr.open('GET', 'syncCuti', true);
    // xhr.setRequestHeader("Content-Type", "multipar/form-data")
    var date = new Date
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                // var res = JSON.parse(xhr.response)
                var res = JSON.parse(xhr.response)
                // $('#isi').text( 'sisa 1 tahun sebelumnya: '+ res.sql[0].n_1+ ', sisa 2 tahun sebelumnya: '+ res.sql[0].n_2 + ', total cuti: ' +res.sql[0].total_cuti +', sisa cuti: '+(res.sql[0].sisa_cuti+1))
                $('p').remove()
                $('#isiCuti').append('<p>Cuti yang sudah diambil Tahun ini: '+((res.sql[0].jumlah_cuti))+'</p>')
                $('#isiCuti').append('<p>Jumlah cuti tahun ini: '+(res.sql[0].sisa_cuti+1)+'</p>')
                $('#isiCuti').append('<p>Sisa cuti 1 tahun sebelumnya: '+(res.sql[0].n_1)+'</p>')
                $('#isiCuti').append('<p>Sisa cuti 2 tahun sebelumnya: '+(res.sql[0].n_2)+'</p>')
                $('#isiCuti').append('<p>Plafon periode ini: '+res.sql[0].total_cuti+'</p>')
                console.log(res) 
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    // window.location.href = 'http://localhost:3000';
    xhr.send('8');
}