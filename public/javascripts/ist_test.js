var miliseconds = 1000
var menit = 60
var seconds = 0.5*menit;
var testtimeout = menit*miliseconds
var timeout1 = 6*menit*miliseconds
var timeout2 = 6*menit*miliseconds
var timeout3 = 7*menit*miliseconds
var timeout4 = 8*menit*miliseconds
var timeout5 = 10*menit*miliseconds
var timeout6 = 10*menit*miliseconds
var timeout7 = 8*menit*miliseconds
var timeout8 = 7*menit*miliseconds
var timeout9 = 6*menit*miliseconds
var timeoutTutorial9 = 3*menit*miliseconds

function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
  }
  
  CountDownTimer.prototype.start = function() {
    if (this.running) {
      return;
    }
    this.running = true;
    var start = Date.now(),
        that = this,
        diff, obj;
  
    (function timer() {
      diff = that.duration - (((Date.now() - start) / 1000) | 0);
          
      if (diff > 0) {
        setTimeout(timer, that.granularity);
      } else {
        diff = 0;
        that.running = false;
      }
  
      obj = CountDownTimer.parse(diff);
      that.tickFtns.forEach(function(ftn) {
        ftn.call(this, obj.minutes, obj.seconds);
      }, that);
    }());
  };
  
  CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
      this.tickFtns.push(ftn);
    }
    return this;
  };
  
  CountDownTimer.prototype.expired = function() {
    return !this.running;
  };
  
  CountDownTimer.parse = function(seconds) {
    return {
      'minutes': (seconds / 60) | 0,
      'seconds': (seconds % 60) | 0
    };
  };

var BUNGA = ['SOKA', 'LARAT', 'FLAMBOYAN', 'YASMIN', 'DAHLIA']
var PERKAKAS = ['WAJAN', 'JARUM', 'KIKIR', 'CANGKUL', 'PALU']
var BURUNG = ['ITIK', 'ELANG', 'WALET', 'TEKUKUR', 'NURI']
var KESENIAN = ['QUINTET', 'ARCA', 'OPERA', 'UKIRAN', 'GAMELAN']
var BINATANG = ['RUSA', 'MUSANG', 'BERUANG', 'HARIMAU', 'ZEBRA']

var button1 = $('#button_bagian1')
var button2 = $('#button_bagian2')
var button3 = $('#button_bagian3')
var button4 = $('#button_bagian4')
var button5 = $('#button_bagian5')

window.history.forward(); 
function noBack() { 
    window.history.forward(); 
} 


$('#button_mulai').on('click',function(){
    $(this).toggleClass('hide')
    $('#tutorial1').toggleClass('hide')
    $('#entry').toggleClass('hide')
})

$('#selesaiTutorial1').on('click', function(){
    $('#tutorial1').toggleClass('hide')
    $('#bagian1').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian1').toggleClass('hide')
        $('#tutorial2').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial2').on('click', function(){
    $('#tutorial2').toggleClass('hide')
    $('#bagian2').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian2').toggleClass('hide')
        $('#tutorial3').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial3').on('click', function(){
    $('#tutorial3').toggleClass('hide')
    $('#bagian3').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian3').toggleClass('hide')
        $('#tutorial4').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial4').on('click', function(){
    $('#tutorial4').toggleClass('hide')
    $('#bagian4').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian4').toggleClass('hide')
        $('#tutorial5').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial5').on('click', function(){
    $('#tutorial5').toggleClass('hide')
    $('#bagian5').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian5').toggleClass('hide')
        $('#tutorial6').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial6').on('click', function(){
    $('#tutorial6').toggleClass('hide')
    $('#bagian6').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian6').toggleClass('hide')
        $('#tutorial7').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial7').on('click', function(){
    $('#tutorial7').toggleClass('hide')
    $('#bagian7').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian7').toggleClass('hide')
        $('#tutorial8').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('#selesaiTutorial8').on('click', function(){
    $('#tutorial8').toggleClass('hide')
    $('#bagian8').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian8').toggleClass('hide')
        $('#tutorial9_hafal').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
        var timer = new CountDownTimer(menit);
        timer.onTick(format).start();
        setTimeout(() => {
            $('#tutorial9_hafal').toggleClass('hide')
            $('#tutorial9').toggleClass('hide')
            $(this).toggleClass('hide')
            $('#time').toggleClass('hide')
        }, testtimeout)
    }, testtimeout)
})

$('#selesaiTutorial9').on('click', function(){
    $('#tutorial9').toggleClass('hide')
    $('#bagian9').toggleClass('hide')
    $('#time').toggleClass('hide')
    var timer = new CountDownTimer(menit);
    timer.onTick(format).start();
    setTimeout(() => {
        $('#bagian9').toggleClass('hide')
        $('#submit').toggleClass('hide')
        $(this).toggleClass('hide')
        $('#time').toggleClass('hide')
    }, testtimeout)
})

$('form').on('submit',function(e){
    e.preventDefault()
    const formData = new FormData($(this)[0])
    console.log(formData)
    $.ajax({
        url : "ist_test",
        type: "POST",
        data : formData,
        processData: false,
        contentType: false,
        success: (data, textStatus, jqXHR)=>{
            // alert(data.result);
            console.log(data.result)
            $(this)[0].reset
            window.location.replace('/psikotes/masuk_test/ist_test')
        },
        error:(data, textStatus, jqXHR)=>{
            console.error('Error:', textStatus)
        } })
})

function format(minutes, seconds) {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    $('#time')[0].textContent = '00' + ':' + minutes + ':' + seconds;
    console.log($('#time'))
}