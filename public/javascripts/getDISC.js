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
                '<td>'+data[i].disc_result+'</td>'+'</tr>')
        }
    },
    error:(data, textStatus, jqXHR)=>{
        console.error('Error:', textStatus)
    } })