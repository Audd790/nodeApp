$.ajax({
    url : "/psikotes/getPsikotesResults",
    type: "GET",
    success: (data, textStatus, jqXHR)=>{
        console.log(data);
        for(i=0;i<data.length;i++){
            var bulan = data[i].bulan + 1
            console.log(data[i].bulan)
            var date = new Date( bulan+'-'+data[i].hari+'-'+data[i].year)
            $('#table_psikotes').append('<tr id="'+ data[i].id +'"></tr>')
            $('#'+data[i].id).append('<td>'+data[i].nama+'</td>'+
                '<td>'+data[i].jenis_kelamin+'</td>'+
                '<td>'+data[i].umur+'</td>'+
                '<td>'+date.getDate()+' '+ date.toLocaleString('default', { month: 'long' })+ ', '+ date.getFullYear() +'</td>'+
                '<td>'+data[i].pend_terakhir+'</td>')
            if(data[i].ist_result == '') {
                $('#'+data[i].id).append('<td>Tidak ada file</td>')
            } else {
                $('#'+data[i].id).append('<td><button id="'+ data[i].nama +'" name="getFileIst" type="button">Download</button></td>')
            }

            if(data[i].disc_result == '') {
                $('#'+data[i].id).append('<td>Tidak ada file</td>')
            } else {
                $('#'+data[i].id).append('<td><button id="'+ data[i].nama +'" name="getFileDisc" type="button">Download</button></td>')
            }
            $('#'+data[i].id).append('<td><button id="'+ data[i].nama +'" name="deletePsikotes" type="button">Delete</button></td>')
        }
        $('button[name="deletePsikotes"]').click(function(){
            console.log('click')
            var id = $(this).attr('id')
            $.ajax({
                url : "/psikotes/deletePsikotes/"+id,
                type: "GET",
                success: (data, textStatus, jqXHR)=>{
                    alert(data.message)
                    $(this).closest('tr').remove()
                },
                error:(data, textStatus, jqXHR)=>{
                    console.error('Error:', textStatus)
                } })
        })

        $('button[name="getFileDisc"]').click(function(){
            console.log('click')
            var id = $(this).attr('id')
            window.location.href = '/psikotes/getDiscResults/'+id
        })
        $('button[name="getFileIst"]').click(function(){
            console.log('click')
            var id = $(this).attr('id')
            window.location.href = '/psikotes/getIstResults/'+id
        })
    },
    error:(data, textStatus, jqXHR)=>{
        console.error('Error:', textStatus)
    } })

function getDiscResult(){
    $('')
}
