var table1 = $('div[name=table1]')
var table2 = $('div[name=table2]')
var table3 = $('div[name=table3]')
var filter1 = $('div[name=filter1]')
var filter2 = $('div[name=filter2]')
var filter3 = $('div[name=filter3]')
var label1 = $('#toggle1')
var label2 = $('#toggle2')
var label3 = $('#toggle3')

table1.hide()
filter1.hide()
table3.hide()
filter3.hide()
var inputKaryawan = document.getElementById("karyawan")
const xhr = new XMLHttpRequest
xhr.open('GET', '/kehadiran/info/namaKaryawan', true);
// xhr.setRequestHeader("Content-Type", "multipar/form-data")
xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200) {
            // var res = JSON.parse(xhr.response)
            listNama = JSON.parse(xhr.response)
            var tmp = listNama.sql.map(labels=>{
                return labels.nama
            })
            // console.log(tmp) 
            autocomplete(inputKaryawan, tmp);
        } else{
            console.error('Error:', xhr.status)
        }
    }
};
// window.location.href = 'http://localhost:3000';
xhr.send();
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        a.setAttribute("style", "position: absolute");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                console.log($('td[name="nama"]:not([value="'+inp.value+'"])').closest('table').hide())
                $('td[name="nama"][value="'+inp.value+'"]').closest('table').show()
                $('td[name="nama"][value="'+inp.value+'"]').closest('table').addClass('show')
                $('td[name="nama"]:not([value="'+inp.value+'"])').closest('tr').hide()
                $('td[name="nama"][value="'+inp.value+'"]').closest('tr').show()
                $('td[name="nama"]:not([value="'+inp.value+'"])').closest('div.container2').hide()
                $('td[name="nama"][value="'+inp.value+'"]').closest('div.container2').show()
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        console.log(e.keyCode)
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        } else if(e.keyCode == 8){
            console.log('delete')
            $('td[name="nama"]:not([value="'+inp.value+'"])').closest('tr').show()
            $('td[name="nama"]:not([value="'+inp.value+'"])').closest('table').show()
            $('td[name="nama"]:not([value="'+inp.value+'"])').closest('table').removeClass('show')
            $('td[name="nama"]:not([value="'+inp.value+'"])').closest('div.container2').show()
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  })}
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
        } else alert('Empty Table')
    }else if(alasan == '0'){
        showTable = table1.find("div#"+tahun)
        console.log(showTable)
        if(showTable.length>0){
            showTable.show()
        } else alert('Empty Table')
    } else{
        showTable = table1.find('div#'+tahun)
        hideTable = showTable.find('div > table:not(table#-'+alasan+'-)')
        if(showTable.find('div > table#-'+alasan+'-').length > 0){
            console.log(showTable)
            showTable.show()
            hideTable.hide()
            showTable.find('div > table#-'+alasan+'-').show()
        } else alert('Empty Table')
    }
})

$('#year').on('change', function(){
    var tahun = $(this)[0].value
    $('div.container2').show()
    $('div.container2').removeClass('show')
    var showTable = $('div[name="'+tahun+'"]')
    var hideTable = $('div.container2:not([name="'+tahun+'"])')
    hideTable.hide()
    showTable.show()
    showTable.addClass('show')
    if(tahun == 0) {
        $('div.container2').show()
        $('div.container2').addClass('show')
    }
})

$('#month').on('change', function(){
    var bulan = $(this)[0].value
    $('table[name="month"]').show()
    $('table[name="month"]').removeClass('hide')
    $('table[name="month"]').closest('.container2.show').show()
    console.log($('table[name="month"]'))
    var showTable = $('table[name="month"]#'+bulan)
    var hideTable = $('table[name="month"]:not(#'+bulan+')')
    hideTable.hide()
    hideTable.addClass('hide')
    showTable.show()

    showTable = showTable.closest('.container2.show')
    hideTable = hideTable.closest('.container2.show')
    hideTable.hide()
    showTable.show()
    if(bulan == 0) {
        $('table[name="month"]').show()
        $('table[name="month"]').closest('.container2.show').show()
    }
})

$('#alasan').on('change', function(){
    var alasan = $(this)[0].value
    $('table[name="alasan"]').show()
    $('table[name="alasan"]').removeClass('hide')
    $('table[name="alasan"]').closest('.container2.show').show()
    console.log($('table[name="alasan"]'))
    var showTable = $('table[name="alasan"]#'+alasan)
    var hideTable = $('table[name="alasan"]:not(#'+alasan+')')
    hideTable.hide()
    hideTable.addClass('hide')
    showTable.show()

    showTable = showTable.closest('.container2.show')
    hideTable = hideTable.closest('.container2.show')
    hideTable.hide()
    showTable.show()
    if(alasan == 0) {
        $('table[name="alasan"]').show()
        $('table[name="alasan"]').closest('.container2.show').show()
    }
})

$('#status').on('change', function(){
    var status = $(this)[0].value
    $('table[name="status"]').show()
    $('table[name="status"]').removeClass('hide')
    $('table[name="status"]').closest('.container2.show').show()
    console.log($('table[name="status"]'))
    var showTable = $('table[name="status"]#'+status)
    var hideTable = $('table[name="status"]:not(#'+status+')')
    hideTable.hide()
    hideTable.addClass('hide')
    showTable.show()

    showTable = showTable.closest('.container2.show')
    hideTable = hideTable.closest('.container2.show')
    hideTable.hide()
    showTable.show()
    if(status == 0) {
        $('table[name="status"]').show()
        $('table[name="status"]').closest('.container2.show').show()
    }
})

$(':radio').change(function(){
    if($(this)[0].value == 'Month'){
        if(label1.hasClass('checked')){
            label1.toggleClass('checked')
        }
        if(!label2.hasClass('checked')){
            label2.toggleClass('checked')
        }
        
        if(!label3.hasClass('checked')){
            label3.toggleClass('checked')
        }
        table1.hide()
        filter1.hide()
        table2.show()
        filter2.show()
        table3.hide()
        filter3.hide()
    }

    if($(this)[0].value == 'Izin'){
        if(label2.hasClass('checked')){
            label2.toggleClass('checked')
        }
        if(!label1.hasClass('checked')){
            label1.toggleClass('checked')
        }

        if(!label3.hasClass('checked')){
            label3.toggleClass('checked')
        }
        table1.show()
        filter1.show()
        table2.hide()
        filter2.hide()
        table3.hide()
        filter3.hide()
    }

    if($(this)[0].value == 'Status'){
        if(label3.hasClass('checked')){
            label3.toggleClass('checked')
        }
        if(!label1.hasClass('checked')){
            label1.toggleClass('checked')
        }

        if(!label2.hasClass('checked')){
            label2.toggleClass('checked')
        }
        table1.hide()
        filter1.hide()
        table2.hide()
        filter2.hide()
        table3.show()
        filter3.show()
    }
})