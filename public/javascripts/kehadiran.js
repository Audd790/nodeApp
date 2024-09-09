document.addEventListener('DOMContentLoaded'
    , function() {
        var list=[];
        var tanggal = document.getElementById('tanggal');
        var logout = document.getElementById('logout');
        logout.addEventListener('click', (e)=>{
            window.location.href= '/logout';
        })
        // if(tanggal!==null) 
        // {    
        //     tanggal.addEventListener('change', (e)=>{
        //     tanggal_absen = e.target.value
        //     list = document.getElementsByClassName('show')
            
        //     while(list.length !== 0){
        //         list[0].style.display = 'none';
        //         list[0].classList = 'hide';
        //     }
        //     const xhr = new XMLHttpRequest();
        //     var data = new FormData()
        //     data.append("tanggal", tanggal_absen)
        //     xhr.open('POST', 'by_date/dates', true);
        //     // xhr.setRequestHeader("Content-Type", "multipar/form-data")
        //     xhr.onreadystatechange = function () {
        //         if(xhr.readyState === XMLHttpRequest.DONE){
        //             if (xhr.status === 200) {
        //                 unhide(JSON.parse(xhr.response, list, tanggal_absen))
        //             } else{
        //                 console.error('Error:', xhr.status)
        //             }
        //         }
        //     };
        //     xhr.send(data);
        //     });
        // }
        const navButtons = document.querySelectorAll('.button')
        navButtons.forEach(button => {
            button.addEventListener('click',buttonOnclickEvent)
        })
        
        function buttonOnclickEvent(e){
            const url = '/kehadiran/'+e.target.value
            window.location.href = url
        }

        function unhide(res, list){
            if(res[0] !== undefined){
                list = document.getElementsByName(res[0].tgl_absen);
                console.log(list)
                for (let i = 0; i < list.length; i++) {
                    list[i].style.display = 'block';
                    list[i].classList = 'show container2';
                }
            } else alert('Data tidak ditemukan')
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