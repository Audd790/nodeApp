$('form').on('submit',function(e){
    e.preventDefault()
    const formData = new FormData($(this)[0])
    console.log(formData)
    $.ajax({
        url : "disc_test",
        type: "POST",
        data : formData,
        processData: false,
        contentType: false,
        success: (data, textStatus, jqXHR)=>{
            console.log(data);
            for(i=0;i<data.err.length;i++){
                $('[name="'+ data.err[i].path +'"]').closest('td').addClass('highlight')
                $('[name="'+ data.err[i].path +'"]').closest('td').removeClass('un-highlight')
            }
            alert(data.result);
            if(data.err.length==0){
                window.location.replace('/psikotes/masuk_test/disc')
            }
        },
        error:(data, textStatus, jqXHR)=>{
            console.error('Error:', textStatus)
            alert('Ada kendala dengan server, mohon diisi ulang')
            window.location.replace('/psikotes/masuk_test/disc')
        } })
})

$('[type="radio"]').on('change',function(e){
    var name = $(this).attr('name')
    $('[name="'+name+'"]').closest('td').removeClass('highlight')
    $('[name="'+name+'"]').closest('td').addClass('un-highlight')
})