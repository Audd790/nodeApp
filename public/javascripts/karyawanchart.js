document.addEventListener('DOMContentLoaded', function(){
const ctx = document.getElementById('myChart').getContext('2d');
var inputKaryawan = document.getElementById("karyawan")
var listNama
const currDate = new Date();
const month = ['Januari', 
    'Febuari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember']
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: month.slice(0, currDate.getMonth()),
        datasets: [{
            label: 'Total Menit telat setiap bulan'
        }]
    },
    options: {
        layout: {
            padding: 30
        },
        plugins: {
            colors: {
                forceOverride: true
            },
            legend:{
                labels:{
                    font:{
                        size:14
                        
                    }
                }
            }
            // customValue: {
            //   name: 'ROI',
            // }
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true
            }
        }
    }

});
const xhr = new XMLHttpRequest
var data = new FormData()
data.append("tanggal", 7)
xhr.open('POST', 'http://localhost:5000/kehadiran/info/by_karyawan', true);
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
xhr.send(data);

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
                const xhr = new XMLHttpRequest
                var data = new FormData()
                var karyawan ;
                // console.log(divisi.value)
                data.append("nama", inp.value)
                console.log(inp.value)
                // data.append('divisi', divisi.value)
                xhr.open('POST', 'http://localhost:5000/kehadiran/info/chart', true);
                // xhr.setRequestHeader("Content-Type", "multipar/form-data")
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === XMLHttpRequest.DONE){
                        if (xhr.status === 200) {
                            karyawan = JSON.parse(xhr.response)
                            console.log(myChart.data.datasets[0])
                            myChart.data.datasets[0].data = karyawan.map(labels=>{
                                return labels.menitTelat
                            })
                            myChart.update()
                        } else{
                            console.error('Error:', xhr.status)
                        }
                    }
                };
                xhr.send(data);
                // window.location.href = 'http://localhost:3000';
                // console.log(karyawan)
                
                window.addEventListener('beforeprint', () => {
                    myChart.resize(600, 600);
                  });
                  window.addEventListener('afterprint', () => {
                    myChart.resize();
                  });  
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
      x[currentFocus].classList.add("autocomplete-active",'clear: both');
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active",'clear: both');
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

})

// function selectFucntion(params) {
//     if(mySelector.value == 1){
//         myChart.data = {
//             labels: ['Admin Sales & Engineer', 'ERP', 'Estimator', 'Finance & Accounting', 'GTI', 'Logistik', 'MEP', 'Operation', 'PCS', 'PPJM','Purchasing','RPE','Sales','Teknisi Servis','Teknisi TC','Tim Bali'],
//             datasets: [{
//                 label: 'Januari',
//                 data: [2,
//                     1,
//                     5.75,
//                     2.5,
//                     2.5,
//                     5,
//                     2.545454545,
//                     2.409090909,
//                     0,
//                     3,
//                     2,
//                     7.428571429,
//                     5.5,
//                     2.75,
//                     7.8,
//                     0.5
//                     ],
//                 borderWidth: 1
//             },
//             {
//                 label: 'Februari',
//                 data: [
//                     2.111111111,
//                     3.333333333,
//                     6.5,
//                     0.833333333,
//                     1.25,
//                     3.571428571,
//                     3.227272727,
//                     1.954545455,
//                     0,
//                     2.583333333,
//                     3,
//                     7.285714286,
//                     5.875,
//                     2.5,
//                     8.6,
//                     0
    
//                 ],
//                 borderWidth: 1
//             },
//             {
//                 label: 'Maret',
//                 data: [                
//                     2.666666667,
//                     6,
//                     8.5,
//                     2.916666667,
//                     2.25,
//                     6,
//                     2.909090909,
//                     2.863636364,
//                     0,
//                     4.083333333,
//                     5.666666667,
//                     7.714285714,
//                     6.625,
//                     3.5,
//                     5.4,
//                     0
    
//                 ],
    
//                 borderWidth: 1
//             },
//             {
//                 label: 'April',
//                 data: [                            
//                     1.333333333,
//                     3,
//                     3.5,
//                     1,
//                     1.25,
//                     3,
//                     1.681818182,
//                     1.045454545,
//                     0,
//                     2.916666667,
//                     2.5,
//                     7.571428571,
//                     6,
//                     2.75,
//                     3.8,
//                     0
    
//                 ],
    
//                 borderWidth: 1
//             },
//             {
//                 label: 'Mei',
//                 data: [                            
//                     2.555555556,
//                     2.333333333,
//                     5.5,
//                     1.307692308,
//                     1.75,
//                     1.285714286,
//                     1.692307692,
//                     0.863636364,
//                     0,
//                     2.333333333,
//                     1.5,
//                     7.142857143,
//                     5.555555556,
//                     1.4,
//                     0.6,
//                     0
                    
    
//                 ],
                
                
//                 borderWidth: 1
//             },
//             {
//                 label: 'Juni',
//                 data: [                            
//                     1.7,
//                     3.666666667,
//                     7.25,
//                     2,
//                     3.5,
//                     3.571428571,
//                     2,
//                     1.590909091,
//                     0,
//                     2.75,
//                     3.833333333,
//                     7.875,
//                     4.1,
//                     2.4,
//                     2.6,
//                     0
    
                    
    
//                 ],
                
                
//                 borderWidth: 1
//             }]
//         }
//     }
//     else{
//         myChart.data = {
//             labels:['Januari','Februari','Maret','April','Mei','Juni'],
//             datasets:[{
//                 label:'RPE',
    
//                 data: mySelector.value.split(',')
//             }],
//         }
//         console.log(myChart.data)
//     }
//     myChart.update(

//     )
// }