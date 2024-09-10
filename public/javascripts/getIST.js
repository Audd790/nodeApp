$.ajax({
    url : "getIST",
    type: "GET",
    success: (data, textStatus, jqXHR)=>{
        console.log(data);
        for(i=0;i<data.length;i++){
            var bulan = data[i].bulan + 1
            console.log(data[i].bulan)
            var date = new Date( bulan+'-'+data[i].hari+'-'+data[i].year)
            $('#table_ist').append('<tr> '+
                '<td>'+data[i].nama+'</td>'+
                '<td>'+data[i].jenis_kelamin+'</td>'+
                '<td>'+date.getDate()+' '+ date.toLocaleString('default', { month: 'long' })+ ', '+ date.getFullYear() +'</td>'+
                '<td>'+data[i].pend_terakhir+'</td>'+
                '<td><button id="'+ data[i].nama +'" name="getFileIst" type="button">Download</button></td>'+'</tr>')
        }
        $('button[name="getFileIst"]').click(function(){
            console.log('click')
            var id = $(this).attr('id')
            window.location.href = '/psikotes/getIstResults/'+id
        })
    },
    error:(data, textStatus, jqXHR)=>{
        console.error('Error:', textStatus)
    } })