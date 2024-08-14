document.addEventListener('DOMContentLoaded'
    , function() {
        var list=[];
        var tanggal = document.getElementById('tanggal');
        var logout = document.getElementById('logout');
        logout.addEventListener('click', (e)=>{
            window.location.href= '/logout';
        })
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
            xhr.open('POST', 'by_date/dates', true);
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
            xhr.send(data);
            });
        }
        document.getElementById('byKaryawan').addEventListener('click', buttonOnclickEvent)


        // document.getElementById('byDate').addEventListener('click', buttonOnclickEvent)
        document.getElementById('Chart').addEventListener('click', buttonOnclickEvent)
        document.getElementById('formAbsen').addEventListener('click', buttonOnclickEvent)
        document.getElementById('reportIzinKaryawan').addEventListener('click', buttonOnclickEvent)
        function buttonOnclickEvent(e){
            const list = document.querySelectorAll('.button')
            
            const xhr = new XMLHttpRequest();
            const url = '/kehadiran/info/'+e.target.value
            console.log(url)
            xhr.open('GET', url, true);
            // xhr.setRequestHeader("Content-Type", "multipar/form-data")
            xhr.onreadystatechange = function () {
                if(xhr.readyState === XMLHttpRequest.DONE){
                    if (xhr.status === 200) {
                            document.location.href = url
                            // unhide(xhr.response,list)
                    } else{
                        console.error('Error:', xhr.status)
                    }
                }
            };
            xhr.send();
        }

        function unhide(res, list){
            list = document.getElementsByName(res[0].tgl_absen);
            console.log(list)
            for (let i = 0; i < list.length; i++) {
                list[i].style.display = 'block';
                list[i].classList = 'show container2';
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
            }
        }
    })