var express = require('express');
var router = express.Router();
var dateObj = new Date();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('node:fs')
// const script_path = path.join(__dirname, '..', 'scripts')
// const filePath = path.join(__dirname, '..', 'files')
//membuat instansi database
const mysql = require('mysql2')
const PythonShell = require('python-shell').PythonShell;
var path = require('path');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

var date = "";
var que_result;
var arr = [];

router.all('/', function(req, res, next){
    if(!req.session.user) res.redirect('/')
    else next();
})

router.get('/', function(req, res, next){
    res.render('view_data/infographic')
});

router.get('/by_karyawan', function(req, res, next){
    // var sql = "select nama from karyawan order by nama"
    // connection.query(sql, (err, rows, fields)=>{
    //     if (err) {
    //         throw err
    //     }
    //     else{
    //         que_result = rows;
    //     }
    //         // console.log(que_result)
    //         res.render('view_data/Karyawanchart')
    // })
    res.render('view_data/Karyawanchart')
});

router.post('/by_karyawan', function(req, res, next){
    var sql = "select nama from karyawan order by nama"
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
            que_result = rows;
        }
            // console.log(que_result)
            res.send({sql: que_result})
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

router.get('/chart', function(req, res, next) {
    // var sql = 'create or replace view jumlahTelat as '+
    // 'select nik, tgl_absen, sum(telat) as total_menit_telat, sum(case when telat > 0 then 1 else 0 end) as jumlah_hari_telat '+
    // 'from kehadiran '+
    // 'where year(tgl_absen) = 2024 '+
    // 'group by nik, tgl_absen; '
    // connection.query(sql, (err,rows,fields)=>{
    //     if (err) {
    //         throw err;
    //     }
    //     else{
    //     que_result = rows;
    //     }
    // })
    res.render('view_data/Divisichart')
})

router.post('/chart',upload.none(), function(req, res, next) {
    // var date = new Date(req.body.tanggal)
    // var sql = 'select nama, sum(jumlahMenitTerlambat) as menitTelat, sum(JumlahHariTerlambat) as jamTelat '+
    // 'from kehadiranTotal '+
    // 'where idDivisi = "'+ req.body.divisi +'" && month(month) = '+ req.body.tanggal + ' '+
    // 'group by nama ';
    var sql = 'select nama, jumlahMenitTerlambat as menitTelat '+
    'from kehadiranTotal '+
    'where trim(lower(nama)) = trim(lower("'+ req.body.nama +'"))'
    var que_result;
    connection.query(sql, (err,rows,fields)=>{
        if (err) {
            throw err;
        }
        else{
        que_result = rows
        }
        res.send(que_result)
    })
})

router.get('/formAbsen', (req,res)=>{
    fs.open(path.join(__dirname, '..', 'files','output.xlsx'),'r', (err,fd)=>{
        if(err){
            let options = {
                mode: 'text',
                scriptPath: path.join(__dirname, '..', 'scripts')
              };
            PythonShell.run('convertToExcel.py', options).then(result=>{
                // Results is an array consisting of messages collected during execution
            });
        } else{
            console.log("Exists")
        }
    })
    res.render('view_data/formAbsen')
})

router.post('/submitformAbsen', upload.none(),(req,res,next)=>{
    var sql = 'insert into izinKaryawan(nik,alasan,tgl_izin,durasi,durasi_dalam_bulan) values(?,?,?,?,round(?,2))'
    const izin = req.body
    var dalamBulan = req.body.durasi/30;
    var values = Object.values(req.body)
    values.push(dalamBulan.toString())
    connection.query(sql,values,(err,rows)=>{
        if (err) {
            throw err;
        }
        else{
            que_result = rows
        }
        // console.log(que_result)
    })
    next()
}, (req,res)=>{
    let options = {
        mode: 'text',
        scriptPath: path.join(__dirname, '..', 'scripts')
      };
    PythonShell.run('convertToExcel.py', options).then(result=>{
        // Results is an array consisting of messages collected during execution
        res.send({result: 'Success'})
    });
})

router.get('/nikKaryawan', function(req, res, next){
    var sql = "select nik from karyawan order by nik"
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
            que_result = rows;
        }
            // console.log(que_result)
            res.send({sql: que_result})
    })
});
module.exports = router;