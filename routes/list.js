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
    var sql = "select nik,"+
"sum(case when telat > 0 then 1 else 0 end) as jumlah_telat,"+
"sum(case when lembur > 0 then 1 else 0 end) as jumlah_lembur,"+
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
        date = dateObj.getFullYear() + '-'
        + ('0' + (dateObj.getMonth()+1)).slice(-2) + '-'
        +  ('0' + dateObj.getDate()).slice(-2);
        console.log(que_result)  
        res.render('list', {absenkaryawan: que_result, tanggal: date})
    })
    // if(!req.session.user) res.redirect('http://localhost:3000')
    // else{
    //     res.render('absenKaryawan', {absenkaryawan: [], tanggal: date})
    // }
});

router.post('/dates', upload.none(), function(req, res, next){
    var sql = "select tgl_absensi, nik from kehadiran where tgl_absensi = ? order by tgl_absensi;"
    connection.query(sql, req.body.tanggal, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
        que_result = rows;
        }
        
       res.status(200).send(que_result)
    })
});

// router.post('/dates', upload.none(), function(req, res, next){
//     var sql = "select tgl_absensi, nik from kehadiran where tgl_absensi = ? order by tgl_absensi;"
//     connection.query(sql, req.body.tanggal, (err, rows, fields)=>{
//         if (err) {
//             throw err
//         }
//         else{
//         que_result = rows;
//         }
        
//        res.status(200).send(que_result)
//     })
// });

// select nik,
// sum(case when telat > 0 then 1 else 0 end) as jumlah_telat,
// sum(case when lembur > 0 then 1 else 0 end) as jumlah_lembur,
// sum(jam_kerja)
// from kehadiran 
// where telat > 0
// or lembur > 0
// group by nik;




module.exports = router;