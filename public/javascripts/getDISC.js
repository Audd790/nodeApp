$.ajax({
    url : "getDISC",
    type: "GET",
    success: (data, textStatus, jqXHR)=>{
        console.log(data);
        for(i=0;i<data.length;i++){
            $('#table_disc').append('<tr> '+
                '<td>'+data[i].nama+'</td>'+
                '<td>'+data[i].jenis_kelamin+'</td>'+
                '<td>'+data[i].umur+'</td>'+
                '<td><button id="'+ data[i].nama +'" name="getFileDisc" type="button">Download</button></td>'+'</tr>')
        }

        $('button[name="getFileDisc"]').click(function(){
            console.log('click')
            var id = $(this).attr('id')
            window.location.href = '/psikotes/getDiscResults/'+id
        })
    },
    error:(data, textStatus, jqXHR)=>{
        console.error('Error:', textStatus)
    } })

function getDiscResult(){
    $('')
}
