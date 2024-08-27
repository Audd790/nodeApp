var initial_time = 5*1000
var timeout1 = initial_time*1
var timeout2 = initial_time*2

setTimeout(() => {
    $('#bagian1').toggleClass('hide')
    $('#bagian2').toggleClass('hide')
}, timeout1);

setTimeout(() => {
    $('#bagian2').toggleClass('hide')
    $('[name="submit"]').toggleClass('hide')
}, timeout2);