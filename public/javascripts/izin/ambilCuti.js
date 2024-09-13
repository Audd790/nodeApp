$('#ambilCuti').on('click', ambilCuti);
function ambilCuti(){
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
};