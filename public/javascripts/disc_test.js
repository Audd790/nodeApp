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
            alert(data.result);
            for(i=0;i<data.err.length;i++){
                $('[name="'+ data.err[i].path +'"]').closest('td').addClass('highlight')
            }
            console.log($('[name="most24"]'))
        },
        error:(data, textStatus, jqXHR)=>{
            console.error('Error:', textStatus)
        } })
})

$('[type="radio"]').on('change',function(e){
    var name = $(this).attr('name')
    $('[name="'+name+'"]').closest('td').removeClass('highlight')
})