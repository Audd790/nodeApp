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
                var table = tr.closest('table')
                var length = table.find('tr:not(:first-child)').length - 1;
                var yearContainer = table.closest('.container2')
                tr.remove()
                if(length == 0){
                    table.remove()
                }
                if(yearContainer.find('.body').children().length == 0){
                    yearContainer.remove()   
                }
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    xhr.send(data)
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
                var table = tr.closest('table')
                var length = table.find('tr:not(:first-child)').length - 1;
                var yearContainer = table.closest('.container2')
                tr.remove()
                if(length == 0){
                    table.remove()
                }
                if(yearContainer.find('.body').children().length == 0){
                    yearContainer.remove()   
                }
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    xhr.send(data)
})