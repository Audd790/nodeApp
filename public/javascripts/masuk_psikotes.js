$('form').on('submit',function(e){
    e.preventDefault()
    const formData = new FormData($(this)[0])
    var tipeTest = $('button').attr('value')
    $.ajax({
        url : tipeTest,
        type: "POST",
        data : formData,
        processData: false,
        contentType: false,
        success: (data, textStatus, jqXHR)=>{
            console.log(data);
            alert(data.result);
            console.log(data.result)
            window.location.replace('/psikotes/'+tipeTest+'_test')
        },
        error:(data, textStatus, jqXHR)=>{
            console.error('Error:', textStatus)
        } })
    console.log()
})