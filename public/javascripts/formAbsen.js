document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('form')
    form.addEventListener('submit', submitFormAbsen)
    form.addEventListener('keypress',stopEnterSubmit)
    form.addEventListener('keyup',stopEnterSubmit)
    const downloadBtn = document.getElementById('buttonDownload')
    downloadBtn.addEventListener('click',(e)=>{
      window.location.href = '/downloadExcel'
    })

    var karyawansakit = document.getElementById('nik')

    const datePicker = document.getElementById('tgl_izin1')
    if(datePicker !== null){
      datePicker.addEventListener('change',(e)=>{
        if(karyawansakit.disabled){
          karyawansakit.disabled = false
        }
        karyawansakit.value = ""
        getListNik()
      })
    }

    const getSuratDktr = document.getElementById('getSuratDktr')
    const file = document.getElementById('suratDktr')
    if(file !== null){
      file.addEventListener('change',(e)=>{
        const durasi = document.getElementById('durasiDalamJam')
        const alasan = document.getElementById('alasan')
        const cuti = document.getElementById('izin')
        alasan.value = 'sakit'
        durasi.value = 24
        alasan.disabled = true
        durasi.disabled = true
        cuti.disabled = true
      })
    }
})

function stopEnterSubmit(event){
  if(event.key === 'Enter'){
    event.preventDefault()
  }
}

function getListNik(){
  const xhr = new XMLHttpRequest
  const data = new FormData(form);
  xhr.open('POST', 'nikKaryawan',true)
  xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE){
          if (xhr.status === 200) {
              var listNama = JSON.parse(xhr.response)
              var inp = document.getElementById('nik')
              if(listNama.empty){
                alert('File(s) Not Found')
              } else alert('Found Files')
              if(inp !== null){
                autocomplete(inp, listNama.sql.map(labels=>{
                  return {nik: labels.nik,id: labels.id}
                }))}
          } else{
              console.error('Error:', xhr.status)
          }
      }
  };


  xhr.send(data)
}

function submitFormAbsen(event){
    event.preventDefault();
    const xhr = new XMLHttpRequest
    const data = new FormData(form);
    var file = document.getElementById('suratDktr')
    xhr.open('POST', 'submitFormAbsen',true)
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.response)
                onSuccess(response.result)
            } else{
                console.error('Error:', xhr.status)
            }
        }
    };
    
    xhr.send(data)
}

function onSuccess(result){
  alert("Result: "+ result)
  form.reset()
}

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
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].nik.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].nik.substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].nik.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input id='"+ arr[i].id +"' type='hidden' value='" + arr[i].nik + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                  if(getSuratDktr !== null){
                    getSuratDktr.addEventListener('click',(e)=>{
                      var pathSuratDokter = '/downloadSuratDokter/' + this.getElementsByTagName("input")[0].id
                      window.location.href = pathSuratDokter
                    })
                  }
                  // const xhr = new XMLHttpRequest
                  // const data = new FormData(form)
                  // xhr.open('POST', 'idSakit', true)
                  // xhr.onreadystatechange((e)=>{
                  //   if(xhr.readyState === XMLHttpRequest.DONE){
                  //     if (xhr.status === 200) {
                  //         var response = JSON.parse(xhr.response)
                  //         onSuccess(response.result)
                  //     } else{
                  //         console.error('Error:', xhr.status)
                  //     }
                  // }})
                  // xhr.send(data)
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
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
  });
  }