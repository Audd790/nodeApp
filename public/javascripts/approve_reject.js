// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 
span.onclick = function() {
    modal.style.display = "none";
}
$('[name="approve"]').click(function(){
    modal.style.display = "block";
    var id = $(this).closest('div').attr('value')
    var value = $(this).attr('value')
    console.log('approve')
    $('#form').children('button')[0].value = value
    $('#form').children('button').attr('id',id)
})

$('#form').on('submit',function(e){
    e.preventDefault()
    var id = $(this).children('button').attr('id')
    var value = $(this).children('button')[0].value
    // var data = new FormData($(this)[0])
    // data.append('id',id)
    // const xhr = new XMLHttpRequest
    // if(value == 'approve'){
    //     xhr.open('POST','approve',true)
    // }

    // if(value == 'reject'){
    //     xhr.open('POST','reject',true)
    // }

    // if(value !== 'reject' && value !== 'approve'){
    //     xhr.open('POST','what',true)
    // }
    // xhr.onreadystatechange = function () {
    //     if(xhr.readyState === XMLHttpRequest.DONE){
    //         if (xhr.status === 200) {
    //             res = JSON.parse(xhr.response)
    //             console.log(res)
                var tr = $('div#'+id).closest('tr')
                var table = tr.closest('table')
                var length = table.find('tr:not(:first-child)').length - 1;
                var yearContainer = table.closest('.container2')
                console.log($('div'))
    //             tr.remove()
    //             if(length == 0){
    //                 table.remove()
    //             }
    //             if(yearContainer.find('.body').children().length == 0){
    //                 yearContainer.remove()   
    //             }
    //             $(this)[0].reset
    //             modal.style.display = "none";
    //         } else{
    //             console.error('Error:', xhr.status)
    //         }
    //     }
    // };
    // xhr.send(data)
})