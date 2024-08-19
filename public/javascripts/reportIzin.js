// document.getElementById('getIzin').addEventListener('click', (e)=>{
//     const form = document.getElementById('form')
//     console.log('Clicked')
//     const data = new FormData(form)
//     const xhr = new XMLHttpRequest
//     xhr.open('POST', 'reportIzinKaryawanAll', true)
//     xhr.onreadystatechange = function () {
//         if(xhr.readyState === XMLHttpRequest.DONE){
//             if (xhr.status === 200) {
//                 var izin_karyawan = JSON.parse(xhr.response)
//                 var tables = document.getElementsByTagName('table')
//                 console.log(tables)
//             } else{
//                 console.error('Error:', xhr.status)
//             }
//         }
//     }
//     xhr.send(data)
// })

$(document).ready(function() {
    $("#filterMonth").click(function(){
        $('div[name=table1], table > tbody > tr ').hide()        
        $('div[name=table1], table > tbody > tr.table_header').show()
        var tables = $('div[name=table1], table > tbody > tr[name*="-'+$('#year')[0].value+'-'+$('#month')[0].value+'-"]')
        console.log(tables)
        if(tables.length > 0){
            tables.show()
        } 
        var monthValue = $('#month')[0].value
        if(monthValue == 0){
            $('div[name=table1], table > tbody > tr[name*="-'+$('#year')[0].value+'-"]').show() 
            console.log('div[name=table1], table > tbody > tr[name*="-'+$('#year')[0].value+'-"]')
        } 
        var yearValue = $('#year')[0].value
        if(yearValue == 0){
            $('div[name=table1], table > tbody > tr[name*="-'+$('#month')[0].value+'-"]').show() 
        } 
    })
    var table1 = $('div[name=table1]')
    var table2 = $('div[name=table2]')
    var filter1 = $('div[name=filter1]')
    var filter2 = $('div[name=filter2]')
    $(':radio').change(function(){
        table1.toggleClass('hide')
        table2.toggleClass('hide')
        filter1.toggleClass('hide')
        filter2.toggleClass('hide')
    })
});