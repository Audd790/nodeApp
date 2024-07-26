var express = require('express');
var router = express.Router();
var dateObj = new Date();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
//membuat instansi database
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

var date = "";
var que_result;
var arr = [];

router.get('/', function(req, res, next){
    res.render('view_data/infographic')
});

router.get('/by_karyawan', function(req, res, next){
    var sql = "select nik,"+
    "sum(case when telat > 0 then 1 else 0 end) as jumlah_telat,"+
    "sum(telat) as menit_telat, "+
    "sum(case when lembur > 0 then 1 else 0 end) as jumlah_lembur,"+
    "sum(lembur) as menit_lembur, "+
    "sum(jam_kerja) as jam_kerja "+
    "from kehadiran "+
    "where telat > 0 "+
    "or lembur > 0 "+
    "group by nik;"
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
            que_result = rows;
        }
            res.render('view_data/by_karyawan', {data: que_result})
    })
});

router.get('/by_Date', function(req, res, next){
    var sql = "select * from kehadiran "
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
        que_result = rows;
        }
        date = dateObj.getFullYear() + '-'
        + ('0' + (dateObj.getMonth()+1)).slice(-2) + '-'
        +  ('0' + dateObj.getDate()).slice(-2);
        // console.log(que_result)  
        res.render('view_data/by_date',{absenkaryawan: que_result, tanggal: date})
    })
    
    // if(!req.session.user) res.redirect('http://localhost:3000')
    // else{
    //     res.render('absenKaryawan', {absenkaryawan: [], tanggal: date})
    // }
});

router.post('/by_Date', function(req, res, next){
    res.redirect('/kehadiran/info/by_date')
});



router.post('/by_Date/dates', upload.none(), function(req, res, next){
    var sql = "select tgl_absen, nik from kehadiran where tgl_absen = ? order by tgl_absen;"
    connection.query(sql, req.body.tanggal, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
        que_result = rows;
        }
        console.log(que_result)
       res.status(200).send(que_result)
    })
});
// 
// select avg(sum(case when telat > 0 then 1 else 0 end)) as AVG from kehadiran where telat> 1;
router.post('/perDay', function(req, res, next){
    var sql = "select nik,"+
    "sum(case when telat > 0 then 1 else 0 end) as jumlah_telat,"+
    "sum(case when lembur > 0 then 1 else 0 end) as jumlah_lembur,"+
    "sum(jam_kerja) as jam_kerja, "+
    "sum(telat) as menit_telat, "+
    "sum(lembur) as menit_lembur "+
    "from kehadiran "+
    "where telat > 0 "+
    "or lembur > 0 "+
    "group by nik;"
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
        que_result = rows;
        }
        res.render('infographic', {info: que_result})
    })
    // if(!req.session.user) res.redirect('http://localhost:3000')
    // else{
    //     res.render('absenKaryawan', {absenkaryawan: [], tanggal: date})
    // }
});

    // select nik,
    // sum(case when telat > 0 then 1 else 0 end) as jumlah_telat,
    // sum(case when lembur > 0 then 1 else 0 end) as jumlah_lembur,
    // sum(jam_kerja) as jam_kerja, 
    // sum(telat) as menit_telat, 
    // sum(lembur) as menit_lembur, 
    // tgl_absen 
    // from kehadiran 
    // where telat > 0 
    // or lembur > 0 
    // group by nik;
module.exports = router;