var express = require('express');
var router = express.Router();
var dateObj = new Date();
var path = require('path');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
      },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
const month = ['Januari', 'Febuari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const upload = multer({storage: storage })
const filePath = "files/izin_karyawan.xlsx";
const fs = require('node:fs')
var XLSX = require("xlsx");
const { check, matchedData, validationResult, body } = require('express-validator');


//membuat instansi database
const mysql = require('mysql2')
var path = require('path');
const { match } = require('assert');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

var date = "";
var que_result;
var arr = [];

router.all('/*', function(req, res, next){
    connection.query('set lc_time_names="id_ID"',(err,rows)=>{
        if(err) next(err)
    })
    if(!req.session.user) {
        // console.log('yes')
        res.redirect('/')
        // next();
    }
    else {
        next();
    }
})

router.get('/', function(req, res, next){
    console.log(req.session.role_id)
    res.render('home_kehadiran', {role: req.session.role_id, header_text: 'Welcome '+req.session.user+ '!' })
});

router.get('/palingTelat',(req,res,next)=>{
    var sql = 'select nama, sum(telat/60) as telat from kehadiran group by nama order by telat desc limit 1;'
    connection.query(sql,(err,rows)=>{
        if(err){
            next(err)
        } else{
            res.send({sql: rows})
        }
    })
})

router.get('/telatKaryawan', function(req, res, next){
    if(!req.session.role_id == 2){
        var sql = "select * from kehadiran where nama = ?"
        connection.query(sql, req.session.user, (err, rows, fields)=>{
            if (err) {
                next(err)
            }
            else{
                que_result = rows;
                var tablesMonthsWithHoles = new Array
                for(i=0;i<month.length;i++){
                    var bulan = i;
                    tablesMonthsWithHoles[i] = []
                    for(k=0;k<que_result.length;k++){
                        if(que_result[k].tgl_absen.getMonth() == bulan){
                            tablesMonthsWithHoles[i].push(que_result[k])
                        }
                    }
                }
                
                var tablesMonthsWithoutHoles = new Array
                tablesMonthsWithoutHoles = tablesMonthsWithHoles.filter(item => { return item.length > 0 })
                console.log(tablesMonthsWithHoles)  
                console.log(tablesMonthsWithoutHoles)
                date = dateObj.getFullYear() + '-'
                + ('0' + (dateObj.getMonth()+1)).slice(-2) + '-'
                +  ('0' + dateObj.getDate()).slice(-2);
                res.render('view_data/telat/karyawanchart',{absenkaryawan: tablesMonthsWithoutHoles, tanggal: date, role: req.session.role_id})
            }
        })
    } else {
        var sql = "select * from kehadiran where telat > 0"
        connection.query(sql, (err, rows, fields)=>{
            if (err) {
                next(err)
            }
            else{
                que_result = rows;
                var tablesMonthsWithHoles = new Array
                for(i=0;i<month.length;i++){
                    var bulan = i;
                    tablesMonthsWithHoles[i] = []
                    for(k=0;k<que_result.length;k++){
                        if(que_result[k].tgl_absen.getMonth() == bulan){
                            tablesMonthsWithHoles[i].push(que_result[k])
                        }
                    }
                }
                
                var tablesMonthsWithoutHoles = new Array
                tablesMonthsWithoutHoles = tablesMonthsWithHoles.filter(item => { return item.length > 0 })
                console.log(tablesMonthsWithHoles)  
                console.log(tablesMonthsWithoutHoles)
                date = dateObj.getFullYear() + '-'
                + ('0' + (dateObj.getMonth()+1)).slice(-2) + '-'
                +  ('0' + dateObj.getDate()).slice(-2);
                res.render('view_data/telat/karyawanchart',{absenkaryawan: tablesMonthsWithoutHoles, tanggal: date, role: req.session.role_id})
            }
        })
    }
});

router.get('/syncData',(req, res, next)=>{
    res.send
})

router.post('/chartKaryawan', upload.none(), check('nama').trim().notEmpty().escape(), function(req, res, next) {
    const result = validationResult(req)
    var nama
    var data
    if(result.errors.length == 0){
        data = matchedData(req)
        nama = data.nama
    } else {
        nama = req.session.user
    }
    var sql = 'select distinct nama, month, jumlahMenitTerlambat as menitTelat '+
        'from kehadiranTotal '+
        'where trim(lower(nama)) = trim(lower("'+ nama +'")) '+
        'order by month'
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
    // res.send({sql: 'yes'})
})


router.get('/telatKaryawanAll', function(req, res, next){
    res.render('view_data/telat/karyawanchartAll')
});

router.post('/namaKaryawan', upload.none(), function(req, res, next){
    var sql = "select distinct nama from kehadiran where tgl_absen = ? and telat > 0"
    var values = [req.body.date]
    connection.query(sql, values, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
            que_result = rows;
        }
            console.log(que_result)
            res.send({sql: que_result, empty: que_result.length == 0})
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
        res.render('view_data/by_date',{absenkaryawan: que_result, tanggal: date})
    })
});

router.post('/by_Date', function(req, res, next){
    res.redirect('/kehadiran/info/by_date')
});



router.post('/by_Date/dates', upload.none(), function(req, res, next){
    var sql = "select tgl_absen, nama from kehadiran where tgl_absen = ? order by tgl_absen;"
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

router.get('/chart', function(req, res, next) {
    var sql = 'create or replace view telat_per_divisi as '+
    'select b.divisi, monthname(a.tgl_absen) as bulan, year(a.tgl_absen) as tahun, '+
    'count(a.telat) as telat_per_bulan, round(sum(a.telat)/count(b.divisi),2) total_menit_per_bulan, '+
    'round((sum(a.telat)/count(b.divisi))/60,2) as total_jam_per_bulan '+
    'from kehadiran a '+
    'join karyawan b '+
    'on b.nik = a.nik '+
    'where a.telat>0 and year(a.tgl_absen) = "'+ dateObj.getFullYear() +'" '+
    'group by b.divisi, bulan, tahun '+
    'order by b.divisi; '
    connection.query(sql, (err,rows,fields)=>{
        if (err) {
            throw err;
        }
        else{
            res.render('view_data/Divisichart')
        }
    })
})

router.post('/chart/getChartData', upload.none(),function (req, res) {
    var sql = 'select nama, sum(telat) as telat from kehadiran where tgl_absen = ? and telat>0 group by nama'
    var date = new Date()
    var values = [req.body.date]
    // console.log(req.body.date)
    connection.query(sql, values, (err,rows,fields)=>{
        if (err) {
            throw err;
        }
        else{
        que_result = rows;
        }
        // console.log(que_result)
        res.send({sql: que_result})
    })
})

// router.get('/chart/getChartData', upload.none(),function (req, res) {
//     var sql = 'select monthname(month) as bulan, idDivisi, '+
//     'sum(jumlahMenitTerlambat)/count(idDivisi) as menitTelat, sum(jumlahJamTerlambat)/count(idDivisi) as jamTelat, sum(JumlahHariTerlambat)/count(idDivisi) hariTelat '+
//     'from kehadirantotal group by idDivisi, month '+
//     'order by month, idDivisi;'
//     connection.query(sql, (err,rows,fields)=>{
//         if (err) {
//             throw err;
//         }
//         else{
//         que_result = rows;
//         }
//         res.send({sql: que_result})
//     })
// })

router.get('/psikotes',(req,res)=>{
    res.render('psikotes/lihat_user_psikotes')
})
router.get('/getIST',(req,res,next)=>{
    var sql = 'select * from ist where ist_result not in ("")'
    connection.query(sql,(err,rows)=>{
        if(err){
            next(err)
        } else{
            res.send(rows)
        }
    })
})
router.get('/getDISC',(req,res,next)=>{
    var sql = 'select * from disc where disc_result not in ("")'
    connection.query(sql,(err,rows)=>{
        if(err){
            next(err)
        } else{
            res.send(rows)
        }
    })
})

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
module.exports = router;