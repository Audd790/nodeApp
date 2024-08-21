$('[name="getsurat"]').click(function(){
    var id = $(this).closest('div').attr('id')
    window.location.href = '/kehadiran/info/getSurat/'+id
})