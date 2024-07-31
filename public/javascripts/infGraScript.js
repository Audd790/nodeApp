document.addEventListener('DOMContentLoaded'
    , function() {
        var list=[];
        var tanggal = document.getElementById('tanggal');
        if(tanggal!==null) 
        {    
            tanggal.addEventListener('change', (e)=>{
            tanggal_absen = e.target.value
            list = document.getElementsByClassName('show')
            
            while(list.length !== 0){
                list[0].style.display = 'none';
                list[0].classList = 'hide';
            }
            const xhr = new XMLHttpRequest();
            var data = new FormData()
            data.append("tanggal", tanggal_absen)
            xhr.open('POST', 'http://localhost:5000/kehadiran/info/by_date/dates', true);
            // xhr.setRequestHeader("Content-Type", "multipar/form-data")
            xhr.onreadystatechange = function () {
                if(xhr.readyState === XMLHttpRequest.DONE){
                    if (xhr.status === 200) {
                        unhide(JSON.parse(xhr.response, list, tanggal_absen))
                    } else{
                        console.error('Error:', xhr.status)
                    }
                }
            };
            // window.location.href = 'http://localhost:3000';
            xhr.send(data);
            });
        }
        document.getElementById('byKaryawan').addEventListener('click', buttonOnclickEvent)


        document.getElementById('byDate').addEventListener('click', buttonOnclickEvent)
        document.getElementById('Chart').addEventListener('click', buttonOnclickEvent)
        function buttonOnclickEvent(e){
            const list = document.querySelectorAll('.button')
            
            const xhr = new XMLHttpRequest();
            const url = 'http://localhost:5000/kehadiran/info'+e.target.value
            xhr.open('GET', url, true);
            // xhr.setRequestHeader("Content-Type", "multipar/form-data")
            xhr.onreadystatechange = function () {
                if(xhr.readyState === XMLHttpRequest.DONE){
                    if (xhr.status === 200) {
                        console.log(url)
                            document.location.href = url
                            // unhide(xhr.response,list)
                    } else{
                        console.error('Error:', xhr.status)
                    }
                }
            };
            // window.location.href = 'http://localhost:3000';
            // var data = new FormData()
            // data.append("disable", true)
            xhr.send();
        }

        function unhide(res, list){
            list = document.getElementsByName(res[0].tgl_absen);
            console.log(list)
            for (let i = 0; i < list.length; i++) {
                list[i].style.display = 'block';
                list[i].classList = 'show container2';
                // list[i].classList = 'container2';
            }
        }

        function getContent(res, list, absen){
            info_content = document.getElementById('info');
            while (info_content.hasChildNodes) {
                info_content.removeChild(info_content.firstChild)
            }

            

            for (let i = 0; i < list.length; i++) {
                list[i].style.display = 'block';
                list[i].classList = 'show container2';
                // list[i].classList = 'container2';
            }
        }
    })