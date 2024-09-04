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
        console.log('yes')
        res.redirect('/login')
    }
    else {
        next();
    }
})

router.get('/', function(req, res, next){
    console.log()
    var header_text
    if(req.session.role_id == 2) {
        header_text = 'Report Izin Karyawan ' + req.session.user
    } else{
        header_text = 'Report Izin Semua Karyawan'
    }
    res.render('home_izin', {role: req.session.role_id, nama: req.session.user, header_text: header_text})
});

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
    res.render('view_data/izin/formAbsen',{role: req.session.role_id, header_text: 'Form input izin karyawan'})
})

router.post('/submitformAbsen', upload.single("surat"),
check('nama').trim().notEmpty().escape(),
check('toggle').trim().notEmpty().escape(),
check('tgl_izin').trim().notEmpty().escape(),
check('startMenit').trim().notEmpty().isInt().escape(),
check('startJam').trim().notEmpty().isInt().escape(),
check('endMenit').trim().notEmpty().isInt().escape(),
check('endJam').trim().notEmpty().isInt().escape(),
check('hari').trim().notEmpty().isInt().escape(),
check('ket').trim().notEmpty().escape(), (req,res,next)=>{
    const result = validationResult(req);
    const match = matchedData(req)
    var values = Object.values(match)
    var sql = 'insert into izinKaryawan(nama, alasan, tgl_izin, startMenit, startJam, endMenit, endJam, hari, ket_izin) values(?,?,?,?,?,?,?,?,?)'
    const emptyInputs = result.errors.length > 0
    if(req.file !== undefined){
        sql = 'insert into izinKaryawan(nama, alasan, tgl_izin,  startMenit, startJam, endMenit, endJam, hari, ket_izin, surat) values(?,?,?,?,?,?,?,?,?,?)'
        values.push(req.file.path)
    }
    console.log(result.errors)
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
    var sql = "select nama from user"
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
            res.render('view_data/izin/reportIzinKaryawan', {sql: que_result, role: req.session.role_id, nama: req.session.user})
        }
    })
})

router.get('/reportIzinKaryawanAll',(req, res,next)=>{
    var sql = 'select id, hari as jumlah_hari, alasan, nama, startMenit, startJam, endMenit, endJam, day(tgl_izin) as hari, month(tgl_izin) as bulan, monthname(tgl_izin) as bulanNama, year(tgl_izin) as tahun, surat, status, ket_status from izinkaryawan order by status, nama, tgl_izin'
    connection.query(sql, (err, rows, fields)=>{
        if(err){
            next(err)
        } else {
            que_result = rows
            var alasanTable = new Array
            var tmp = new Array
            for(k=0;k<que_result.length;k++){
                tmp.push(que_result[k].tahun)   
            }
            var years = uniq_fast(tmp)
            console.log(years)
            var alasanWithoutHoles = new Array
            for(h=0;h<years.length;h++){
                alasanTable[h] = []
                for(i = 0 ; i < 3 ; i++) {
                    var status = i+1;
                    alasanTable[h][i] = []
                    for(k=0;k<que_result.length;k++){
                        if(que_result[k].status == status && que_result[k].tahun == years[h]){
                            alasanTable[h][i].push(que_result[k])
                        }
                        
                    }
                }
            }
            for(i=0;i<years.length;i++){
                alasanWithoutHoles[i] = alasanTable[i].filter(item => { return item.length > 0 })
            }
            var tablesWithHoles = new Array
            for(k=0;k<que_result.length;k++){
                tmp.push(que_result[k].tahun)   
            }
            var years = uniq_fast(tmp)
            var tablesWithoutHoles = new Array
            for(h=0;h<years.length;h++){
                tablesWithHoles[h] = []
                for(i = 0 ; i < 6 ; i++) {
                    var alasan = i+1;
                    tablesWithHoles[h][i] = []
                    for(k=0;k<que_result.length;k++){
                        if(que_result[k].alasan == alasan && que_result[k].tahun == years[h]){
                            tablesWithHoles[h][i].push(que_result[k])
                        }
                        
                    }
                }
            }
            for(i=0;i<years.length;i++){
                tablesWithoutHoles[i] = tablesWithHoles[i].filter(item => { return item.length > 0 })
            }
            var tablesMonthsWithHoles = new Array
            for(h=0;h<years.length;h++){
                tablesMonthsWithHoles[h] = []
                for(i=0;i<month.length;i++){
                    var bulan = i +1;
                    tablesMonthsWithHoles[h][i] = []
                    for(k=0;k<que_result.length;k++){
                        if(que_result[k].bulan == bulan && que_result[k].tahun == years[h]){
                            tablesMonthsWithHoles[h][i].push(que_result[k])
                        }
                    }
                }
            }
            var tablesMonthsWithoutHoles = new Array
            for(i=0;i<years.length;i++){
                tablesMonthsWithoutHoles[i] = tablesMonthsWithHoles[i].filter(item => { return item.length > 0 })
            }
            res.render('view_data/izin/reportIzinKaryawan', {chache: true, thn: years, sqlStatus: alasanWithoutHoles, sqlIzin: tablesWithoutHoles, sqlMonths: tablesMonthsWithoutHoles, role: req.session.role_id, nama: req.session.user})
        }
    })
})

router.get('/reportIzinKaryawanApprove', (req,res,next)=>{
    var header_text
    if (req.session.role_id == 2){
        header_text= 'Report Izin Karyawan ' + req.session.user
    } else {
        header_text= 'Report Izin Semua Karyawan'
    }
    var month = ['Januari', 'Febuari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    var sql = 'select id, hari as jumlah_hari, alasan, a.nama, startMenit, startJam, endMenit, endJam, day(tgl_izin) as hari, month(tgl_izin) as bulan, monthname(tgl_izin) as bulanNama, year(tgl_izin) as tahun, surat, status, ket_izin from izinkaryawan a join user b on a.nama = b.nama where status not in (2,3) and b.divisi = ? order by tahun, bulan;'
    connection.query(sql, [req.session.divisi],(err,rows)=>{
        if(err){
            next(err)
        } else{
            var tmp = new Array
            que_result = rows
            for(k=0;k<que_result.length;k++){
                tmp.push(que_result[k].tahun)   
            }
            var years = uniq_fast(tmp)
            var tablesMonthsWithHoles = new Array
            for(h=0;h<years.length;h++){
                tablesMonthsWithHoles[h] = []
                for(i=0;i<month.length;i++){
                    var bulan = i +1;
                    tablesMonthsWithHoles[h][i] = []
                    for(k=0;k<que_result.length;k++){
                        if(que_result[k].bulan == bulan && que_result[k].tahun == years[h]){
                            tablesMonthsWithHoles[h][i].push(que_result[k])
                        }
                    }
                }
            }
            var tablesMonthsWithoutHoles = new Array
            for(i=0;i<years.length;i++){
                tablesMonthsWithoutHoles[i] = tablesMonthsWithHoles[i].filter(item => { return item.length > 0 })
            }
            res.render('view_data/izin/approve', {chache: true, thn: years, sqlMonths: tablesMonthsWithoutHoles , header_text:header_text})
        }
    })
})

router.post('/approve', upload.none(), (req,res,next)=>{
    var sql = 'update izinkaryawan set status = 2, ket_status = ? where id = ?'
    var values = [req.body.keterangan, req.body.id,]
    connection.query(sql, values, (err,rows,fields)=>{
        if(err){
            next(err)
        } else{
            que_result = rows
            console.log(que_result)
            res.send({result: 'success'})
        }
    })
})

router.post('/reject', upload.none(), (req,res,next)=>{
    var sql = 'update izinkaryawan set status = 3, ket_status = ? where id = ?'
    var values = [req.body.keterangan, req.body.id,]
    connection.query(sql, values, (err,rows,fields)=>{
        if(err){
            next(err)
        } else{
            que_result = rows
            console.log(que_result)
            res.send({result: 'success'})
        }
    })
})

router.get('/getSurat/:id',(req,res,next)=>{
    connection.query('select surat from izinkaryawan where id = ?', [req.params.id],(err,rows)=>{
        if(err) {next(err)}
        else{
            console.log(req.params.id)
            res.download(path.join(__dirname, '..',rows[0].surat))
        }
    })
})
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