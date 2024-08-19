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
    var table1 = $('div[name=table1]')
    var table2 = $('div[name=table2]')
    var filter1 = $('div[name=filter1]')
    var filter2 = $('div[name=filter2]')
    var table3 = $('div[name=table3]')
    var filter3 = $('div[name=filter3]')
    table2.hide()
    filter2.hide()
    table3.hide()
    filter3.hide()
    $("#filterMonth").click(function(){
        // $('div[name=table1] > .container2 > table > tbody > tr ').hide()        
        // $('div[name=table1] > .container2 > table > tbody > tr.table_header').show()
        var table1 = $('div[name=table1]')
        table1.find('.container2').show()
        table1.find('.container2 > table').removeClass('show')
        table1.find('table > tbody > :not(tr.table_header)').hide()
        var monthValue = $('#month')[0].value
        var showTable
        var hideTable

        var yearValue = $('#year1')[0].value

        if(monthValue == '0' && yearValue == '0'){
            table1.find('.container2 > table > tbody > tr').show()
        } else if(monthValue == 0){
            showTable = table1.find('tr[name*="-'+$('#year1')[0].value+'-"]').show()
            hideTable = table1.find('.container2 > table >  tbody > :not(tr[name*="-'+$('#year1')[0].value+'-"])')
            showTable.closest('table').addClass('show')
            console.log(table1.find('.container2 > :not(.show)').closest('.container2').hide())
        } else if(yearValue == 0){
            showTable = table1.find('tr[name*="-'+$('#month')[0].value+'-"]').show()
            hideTable = table1.find('.container2 > table >  tbody > :not(tr[name*="-'+$('#month')[0].value+'-"])')
            showTable.closest('table').addClass('show')
            console.log(table1.find('.container2 > :not(.show)').closest('.container2').hide())
        } 
            
        var tables = table1.find('tr[name*="-'+$('#year1')[0].value+'-'+$('#month')[0].value+'-"]')
        if(tables.length > 0){
            tables.show()
        } 
    })

    $("#filterIzin").click(function(){
        $(':not(div[name=table2] > .container2 > table > tbody > tr.table_header) ').hide()        
        // $('div[name=table2] > .container2 > table > tbody > tr.table_header').show()
        var tables = $('div[name=table2] > .container2 > table > tbody > tr[name*="-'+$('#alasan')[0].value+'-'+$('#year2')[0].value+'-"]')
        console.log(tables)
        if(tables.length > 0){
            tables.show()
        } 
        var alasanValue = $('#alasan')[0].value
        if(alasanValue == 0){
            $('div[name=table2] > .container2 > table > tbody > tr[name*="-'+$('#year2')[0].value+'-"]').show() 
        } 
        var yearValue = $('#year2')[0].value
        if(yearValue == 0){
            $('div[name=table2] > .container2 > table > tbody > tr[name*="-'+$('#alasan')[0].value+'-"]').show() 
        } 

        if(alasanValue == 0 && yearValue == 0){
            $('div[name=table2] > .container2 > table > tbody > tr').show()
        }
    })

    $(':radio').change(function(){
        if($(this)[0].value == 'Month'){
            table1.hide()
            filter1.hide()
            table2.show()
            filter2.show()
            table3.hide()
            filter3.hide()
        }

        if($(this)[0].value == 'Izin'){
            table1.show()
            filter1.show()
            table2.hide()
            filter2.hide()
            table3.hide()
            filter3.hide()
        }

        if($(this)[0].value == 'Year'){
            table1.hide()
            filter1.hide()
            table2.hide()
            filter2.hide()
            table3.show()
            filter3.show()
        }
    })
});