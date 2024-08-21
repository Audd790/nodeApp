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
                console.log(formData)
                $.ajax({
                    url : "/submit",
                    type: "POST",
                    data : formData,
                    processData: false,
                    contentType: false,
                    success: (data, textStatus, jqXHR)=>{
                        console.log(data);
                        displayConfirmation(data.sql, data.empty);
                    },
                    error:(data, textStatus, jqXHR)=>{
                        console.error('Error:', textStatus)
                    } })
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