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
                            displayConfirmation(obj.sql, obj.empty);
                        } else{
                            console.error('Error:', xhr.status)
                        }
                    }
                };
                // window.location.href = 'http://localhost:3000';
                xhr.send(formData);
        });
        function displayConfirmation(sql, empty) {
            // var boolValue = (res.result === 'true');
            if(!empty && sql !== undefined){
                window.location.href = 'http://localhost:5000/kehadiran/info'
            }
            if(sql !== undefined){
                console.log(sql)
            }
            alert('Form must be submitted correctly');
            
        }
    });