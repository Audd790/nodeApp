$('#setMaxCarry').on('click', setMaxCarry);
getMaxCarry()
function setMaxCarry(){
    const xhr = new XMLHttpRequest
    xhr.open('POST', 'setMaxCarry', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    var date = new Date
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                // var res = JSON.parse(xhr.response)
                var res = JSON.parse(xhr.response)
                // $('#isi').text( 'sisa 1 tahun sebelumnya: '+ res.sql[0].n_1+ ', sisa 2 tahun sebelumnya: '+ res.sql[0].n_2 + ', total cuti: ' +res.sql[0].total_cuti +', sisa cuti: '+(res.sql[0].sisa_cuti+1))
                getMaxCarry()
                console.log(res) 
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    var max_cuti = $('#maxCuti').val()
    xhr.send('maxCuti='+max_cuti);
};

function getMaxCarry(){
    const xhr = new XMLHttpRequest
    xhr.open('GET', 'getMaxCarry', true);
    // xhr.setRequestHeader("Content-Type", "multipar/form-data")
    var date = new Date
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                // var res = JSON.parse(xhr.response)
                var res = JSON.parse(xhr.response)
                // $('#isi').text( 'sisa 1 tahun sebelumnya: '+ res.sql[0].n_1+ ', sisa 2 tahun sebelumnya: '+ res.sql[0].n_2 + ', total cuti: ' +res.sql[0].total_cuti +', sisa cuti: '+(res.sql[0].sisa_cuti+1))
                $('#isiMaxCuti').text('Cuti yang bisa dibawa ke tahun depan '+res.sql.max_cuti)
                console.log(res) 
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    xhr.send();
};