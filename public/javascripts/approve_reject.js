$('[name="approve"]').click(function(){
    var id = $(this).closest('div').attr('id')
    console.log('approve')
    var data = new FormData()
    data.append('id',id)
    const xhr = new XMLHttpRequest
    xhr.open('POST','approve',true)
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                res = JSON.parse(xhr.response)
                console.log(res)
                var tr = $('div#'+id).closest('tr')
                tr.remove()
                console.log(tr)
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    xhr.send(data)
    var table = tr.closest('table').children()
    if(table.length < 2){
        table.remove()
    }
})

$('[name="reject"]').click(function(){
    var id = $(this).closest('div').attr('id')
    console.log(id)
    var data = new FormData()
    data.append('id',id)
    const xhr = new XMLHttpRequest
    xhr.open('POST','reject',true)
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                res = JSON.parse(xhr.response)
                console.log(res)
                var tr = $('div#'+id).closest('tr')
                tr.remove()
                console.log(tr)
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    xhr.send(data)
})