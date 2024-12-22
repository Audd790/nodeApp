document.addEventListener('DOMContentLoaded', function() {
        var list=[];
        var tanggal = document.getElementById('tanggal');
  
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