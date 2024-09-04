console.log()
var url = 'http://solutioncloud.co.id/download.asp'
window.location = url;
$.ajax({
    url : 'download',
    type: "GET",
    success: (data, textStatus, jqXHR)=>{
        console.log(data);
    },
    error:(data, textStatus, jqXHR)=>{
        console.error('Error:', textStatus)
    } })

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
                console.log(window.location.href)
                $.ajax({
                    url : window.location.href,
                    type: "POST",
                    data : formData,
                    processData: false,
                    contentType: false,
                    success: (data, textStatus, jqXHR)=>{
                        console.log(data);
                        displayConfirmation(data.sql, data.empty, data.path);
                    },
                    error:(data, textStatus, jqXHR)=>{
                        console.error('Error:', textStatus)
                    } })
        });
        function displayConfirmation(sql, empty, path) {
            if(!empty && !sql){
                alert('Success');
                window.location.replace('/'+path)
            }else{
                alert('Submit Form Correctly!');
            }
        }
    });