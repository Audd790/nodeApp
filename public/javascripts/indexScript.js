document.addEventListener('DOMContentLoaded'
    , function() 
    {
        const form = document.getElementById('form');
        form.addEventListener('submit', 
            function (event) {
                event.preventDefault();
                const formData = new FormData(form)
                const xhr = new XMLHttpRequest();
                const input = form.elements;
                // const data = [input['email'].value, input['password'].value]
                xhr.open('POST', '/submit', true);
                // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === XMLHttpRequest.DONE){
                        if (xhr.status === 200) {
                            const obj = JSON.parse(xhr.response);
                            displayConfirmation(obj.sql, obj.empty);
                        } else{
                            console.error('Error:', xhr.status)
                        }
                    }
                };
                
                xhr.send(formData);
        });
        function displayConfirmation(sql, empty) {
            if(!empty && !sql){
                alert('Success');
                window.location.replace('/kehadiran/info')
            }else{
                alert('Submit Form Correctly!');
            }
        }
    });