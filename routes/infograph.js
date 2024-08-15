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
const upload = multer({storage: storage })
const filePath = "files/izin_karyawan.xlsx";
const fs = require('node:fs')
var XLSX = require("xlsx");
const { check, matchedData, validationResult, body } = require('express-validator');


//membuat instansi database
const mysql = require('mysql2')
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

router.all('/*', function(req, res, next){
    if(!req.session.user) {
        console.log('yes')
        res.redirect('/')
    }
    else {
        next();
    }
})

router.get('/', function(req, res, next){
    res.render('view_data/infographic', {role: req.session.role_id, nama: req.session.user})
});

router.get('/by_karyawan', function(req, res, next){
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
        res.render('view_data/by_date',{absenkaryawan: que_result, tanggal: date})
    })
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

router.get('/chart/getChartData', function (req, res) {
    var sql = 'select monthname(month) as bulan, idDivisi, '+
    'sum(jumlahMenitTerlambat)/count(idDivisi) as menitTelat, sum(jumlahJamTerlambat)/count(idDivisi) as jamTelat, sum(JumlahHariTerlambat)/count(idDivisi) hariTelat '+
    'from kehadirantotal group by idDivisi, month '+
    'order by month, idDivisi;'
    connection.query(sql, (err,rows,fields)=>{
        if (err) {
            throw err;
        }
        else{
        que_result = rows;
        }
        res.send({sql: que_result})
    })
})

router.get('/chartKaryawan', function(req, res, next) {
    const result = validationResult(req)
    if(result.errors.length == 0){
        var sql = 'select nama, jumlahMenitTerlambat as menitTelat '+
        'from kehadiranTotal '+
        'where trim(lower(nama)) = trim(lower("'+ req.session.user +'"))'
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
    }
})

router.get('/formAbsen', (req,res)=>{
    fs.open(path.join(__dirname, '..', 'files','izin_karyawan.xlsx'),'r', (err,fd)=>{
        if(err){
            var sql = 'SELECT * FROM izinKaryawan'
            connection.query(sql,(err,rows)=>{
                const worksheet = XLSX.utils.json_to_sheet(rows);
                const workbook = XLSX.utils.book_new();
                var C = XLSX.utils.decode_col("G"); 
                var fmt = 'dd/mm/yyyy hh:mm:ss'; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format

                /* get worksheet range */
                var range = XLSX.utils.decode_range(worksheet['!ref']);
                for(var i = range.s.r + 1; i <= range.e.r; ++i) {
                    /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
                    var ref = XLSX.utils.encode_cell({r:i, c:C});
                    /* if the particular row did not contain data for the column, the cell will not be generated */
                    if(!worksheet[ref]) continue;
                    /* assign the `.z` number format */
                    worksheet[ref].z = fmt;
                }

                const COL_WIDTH = 50;

                /* Excel column "C" -> SheetJS column index 2 == XLSX.utils.decode_col("C") */
                var COL_INDEX = 2;
                
                /* create !cols array if it does not exist */
                if(!worksheet["!cols"]) worksheet["!cols"] = [];
                
                /* create column metadata object if it does not exist */
                if(!worksheet["!cols"][COL_INDEX]) worksheet["!cols"][COL_INDEX] = {wch: 8};
                
                /* set column width */
                // Cant work for some reason
                worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
                XLSX.utils.book_append_sheet(workbook, worksheet, "Izin Karyawan");
                XLSX.writeFile(workbook, path.join(__dirname, '..', 'files','izin_karyawan.xlsx'), { cellStyles: true});
            })
        } else{
            console.log("Exists")
        }
    })
    res.render('view_data/formAbsen',{role: req.session.role_id})
})

router.post('/submitformAbsen', upload.single("suratDktr"),
check('nama').trim().notEmpty().escape(),
check('toggle').trim().notEmpty().escape(),
check('tgl_izin').trim().notEmpty().escape(),
check('menit').trim().notEmpty().isInt({min: 0}).escape(),
check('jam').trim().notEmpty().isInt({min: 0}).escape(),
check('hari').trim().notEmpty().isInt({min: 0}).escape(),
check('ket').trim().notEmpty().escape(), (req,res,next)=>{
    const result = validationResult(req);
    const match = matchedData(req)
    var values = Object.values(match)
    var sql = 'insert into izinKaryawan(nama, alasan, tgl_izin, menit, jam, hari, keterangan) values(?,?,?,?,?,?,?)'
    const emptyInputs = result.errors.length > 0
    if(!emptyInputs){
        connection.query(sql,values,(err,rows)=>{
            if (err) {
                que_result = err;
                // console.log(que_result)
                next(que_result)
            }
            else{
                next()
            }
        })
    } else res.send({result: 'fail'})
}, (req, res)=>{
    var sql = 'SELECT * FROM izinKaryawan'
    // connection.query(sql,(err,rows)=>{
    //     const worksheet = XLSX.utils.json_to_sheet(rows);
    //     const workbook = XLSX.utils.book_new();
    //     var C = XLSX.utils.decode_col("G"); 
    //     var fmt = 'dd/mm/yyyy hh:mm:ss'; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format

    //     /* get worksheet range */
    //     var range = XLSX.utils.decode_range(worksheet['!ref']);
    //     for(var i = range.s.r + 1; i <= range.e.r; ++i) {
    //         /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
    //         var ref = XLSX.utils.encode_cell({r:i, c:C});
    //         /* if the particular row did not contain data for the column, the cell will not be generated */
    //         if(!worksheet[ref]) continue;
    //         /* assign the `.z` number format */
    //         worksheet[ref].z = fmt;
    //     }

    //     const COL_WIDTH = 50;

    //     /* Excel column "C" -> SheetJS column index 2 == XLSX.utils.decode_col("C") */
    //     var COL_INDEX = 2;
        
    //     /* create !cols array if it does not exist */
    //     if(!worksheet["!cols"]) worksheet["!cols"] = [];
        
    //     /* create column metadata object if it does not exist */
    //     if(!worksheet["!cols"][COL_INDEX]) worksheet["!cols"][COL_INDEX] = {wch: 8};
        
    //     /* set column width */
    //     // Cant work for some reason
    //     worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Izin Karyawan");
    //     XLSX.writeFile(workbook, path.join(__dirname, '..', 'files','izin_karyawan.xlsx'), { cellStyles: true});
    // })
    res.send({result: 'success'})
})

router.get('/namaKaryawan', upload.none(), function(req, res, next){
    var sql = "select nama from karyawan"
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
            que_result = rows;
        }
            res.send({sql: que_result, empty: que_result.length == 0})
    })
});

router.post('/namaKaryawanSurat', upload.none(), function(req, res, next){
    var sql = "select id,nama from izinkaryawan order by nama "
    connection.query(sql, (err, rows, fields)=>{
        if (err) {
            throw err
        }
        else{
            que_result = rows;
        }
            res.send({sql: que_result, empty: que_result.length == 0})
    })
});

router.get('/reportIzinKaryawan',(req, res,next)=>{
    var sql = 'select * from izinkaryawan where nama = "'+ req.session.user +'"'
    connection.query(sql, (err, rows, fields)=>{
        if(err){
            next(err)
        } else {
            que_result = rows
            res.render('view_data/reportIzinKaryawan', {sql: que_result, role: req.session.role_id})
        }
    })
})

router.get('/reportIzinKaryawanAll',(req, res,next)=>{
    var sql = 'select * from izinkaryawan order by nama'
    connection.query(sql, (err, rows, fields)=>{
        if(err){
            next(err)
        } else {
            que_result = rows
            res.render('view_data/reportIzinKaryawan', {sql: que_result, role: req.session.role_id})
        }
    })
})
module.exports = router;