document.addEventListener('DOMContentLoaded'
    , function() 
    {
        const form = document.getElementById('form');
        form.addEventListener('submit', 
            function (event) {
                event.preventDefault();
                const formData = new FormData(form)
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://localhost:3000/submit', true);
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === XMLHttpRequest.DONE){
                        if (xhr.status === 200) {
                            const obj = JSON.parse(xhr.response);
                            // let boolValue = (obj.result.toLowerCase() === "true");
                            displayConfirmation(obj);
                        } else{
                            console.error('Error:', xhr.status)
                        }
                    }
                };
                // window.location.href = 'http://localhost:3000';
                xhr.send(formData);
        });
        function displayConfirmation(res) {
            console.log(res)
            // var boolValue = (res.result === 'true');
            if(!res.empty && res.sql !== undefined){
                window.location.href = 'http://localhost:3000/kehadiran'
            }
            
            // if (boolValue) {
            //     alert('Forms must not be empty!');
            // } else {
            //     alert('Form submitted successfully!');
            //     form.reset();
            // }
        }
    });