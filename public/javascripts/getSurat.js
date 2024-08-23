$('[name="getsurat"]').click(function(){
    var id = $(this).closest('div').attr('value')
    window.location.href = '/kehadiran/info/getSurat/'+id
})