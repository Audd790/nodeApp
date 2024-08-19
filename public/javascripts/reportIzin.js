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

    $("#filterAlasan").click(function(){
        var table1 = $('div[name=table1]')
        var alasan = $('#alasan')[0].value
        var tahun = $('#year1')[0].value
        table1.find('.container2 > div > table').show()
        table1.find('.container2 > div > table').removeClass('show')
        table1.find('.container2').hide()
        var showTable
        var hideTable
        if(alasan == '0' && tahun == '0'){
            table1.find('.container2').show()
        } else if(tahun == '0'){
            showTable = table1.find('table[id*=-'+alasan+'-]')
            showTable.addClass('show')
            hideTable = table1.find('.container2 > div > table:not(.show)')
            if(showTable.length>0){
                console.log(showTable.closest('.container2'))
                showTable.closest('.container2').show()
                console.log(hideTable)
                hideTable.hide()
                showTable.show()
            }
        }else if(alasan == '0'){
            showTable = table1.find("div#"+tahun)
            console.log(showTable)
            if(showTable.length>0){
                showTable.show()
            }
        }

        showTable = table1.find('div#'+tahun)
        hideTable = showTable.find('div > table:not(table#-'+alasan+'-)')
        if(showTable.find('div > table#-'+alasan+'-').length > 0){
            console.log(hideTable)
            showTable.show()
            hideTable.hide()
            showTable.find('div > table#-'+alasan+'-').show()
        }
    })
    $('#year1').change(function(){
        
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