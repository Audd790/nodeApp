document.addEventListener('DOMContentLoaded'
    , function() 
    {
        const form = document.getElementById('form');
        form.addEventListener('submit', 
            function (event) {
                event.preventDefault();
                const formData = new FormData(form)
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://localhost:5000/submit', true);
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === XMLHttpRequest.DONE){
                        if (xhr.status === 200) {
                            const obj = JSON.parse(xhr.response);
                            // let boolValue = (obj.empty.toLowerCase() === "true");
                            console.log(obj);
                            displayConfirmation(obj.sql, obj.empty, obj.resultMessage);
                        } else{
                            console.error('Error:', xhr.status)
                        }
                    }
                };
                // window.location.href = 'http://localhost:3000';
                xhr.send(formData);
        });
        function displayConfirmation(sql, empty, message) {
            // var boolValue = (res.result === 'true');
            alert(message);
            if(!empty && sql !== undefined){
                window.location.replace('/kehadiran/info/')
            }
        }
    });