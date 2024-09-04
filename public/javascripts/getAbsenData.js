const xhr = new XMLHttpRequest
xhr.open('GET','http://solutioncloud.co.id/download.asp',true)
// xhr.setRequestHeader('ASPSESSIONIDCARCSSQA','DOECKKFDKHDAGLAGLKBPEOHM')
// xhr.setRequestHeader('Origin','solutioncloud.co.id')
xhr.onreadystatechange = function(){
    if(xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200) {
            console.log('done')
        } else{
            console.error('Error:', xhr.status)
        }
    }
}
xhr.send()
// DOECKKFDKHDAGLAGLKBPEOHM
// DOECKKFDKHDAGLAGLKBPEOHM
// DOECKKFDKHDAGLAGLKBPEOHM
// DOECKKFDKHDAGLAGLKBPEOHM
// ASPSESSIONIDCARCSSQA=DOECKKFDKHDAGLAGLKBPEOHM