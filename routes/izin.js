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

var que_result;

//Set bahasa nama bulan menjadi bahasa indonesia
router.all('/*', function(req, res, next){
    connection.query('set lc_time_names="id_ID"',(err,rows)=>{
        if(err) next(err)
    })
    if(!req.session.user) {
        console.log('yes')
        res.redirect('/')
    }
    else {
        next();
    }
})

router.get('/', function(req, res, next){
    var header_text
    if(req.session.role_id == 2) {
        header_text = 'Report Izin Karyawan ' + req.session.user
    } else{
        header_text = 'Report Izin Semua Karyawan'
    }
    res.render('home_izin', {role: req.session.role_id, nama: req.session.user, header_text: header_text})
});

router.get('/getIzin',(req,res,next)=>{
    connection.query('select * from izinkaryawan',(err, rows)=>{
        if(err){
            next(err)
        }else{
            res.send({sql: rows})
        }
    })
})

//ambil c
router.get('/syncCuti',(req, res, next)=>{
    var sql = 'select * from cuti where nama = ?'
    var values = req.session.user;
    connection.query(sql, values, (err,rows)=>{
        if(err) {
            next(err)
        } else {
            cuti = rows[0]
            res.send({sql: rows})
        }
    })
})

//ambil cuti untuk semua karyawan, buat cuti bersama
router.post('/ambilCuti',(req, res, next)=>{
    var jumlah_cuti = req.body.jumlahCuti
    var n_0 = jumlah_cuti
    var diff1 = (cuti.n_2-jumlah_cuti)
    if(diff1<0){
        cuti.n_2 = 0
        cuti.n_1 = cuti.n_1 + diff1
        n_0 = 0
    } else if(diff1>=0){
        cuti.n_2 = cuti.n_2 - jumlah_cuti
        n_0 = 0
    }

    if(cuti.n_1 < 0){
        n_0 = 0 - cuti.n_1
        cuti.n_1 = 0
    }
    if((cuti.sisa_cuti+cuti.n_1+cuti.n_2+1) >= n_0 ){
        var sql = 'update cuti set jumlah_cuti = jumlah_cuti + ?, sisa_cuti = sisa_cuti-?, n_2 = ?, n_1 = ?, total_cuti = n_1+n_2+sisa_cuti+1 where nama = ?'
        var values = [jumlah_cuti,n_0, cuti.n_2, cuti.n_1, req.session.user];
        connection.query(sql, values, (err,rows)=>{
            if(err) {
                next(err)
            } else {
                res.send({sql: rows, err: ''})
            }
        })
        
    }else{
        res.send({sql:[], err: 'Gak bisa ambil cuti'})
    }
})
//get jumlah cuti yang bisa dibawa ke tahun depan
router.get('/getMaxCarry',(req,res,next)=>{
    var sql = 'select * from maxCuti'
    connection.query(sql, (err, rows)=>{
        if(err){
            next(err)
        } else{
            res.send({sql: rows[0]})
        }
    })
})
//set jumlah cuti yang bisa dibawa ke tahun depan
router.post('/setMaxCarry', 
    check('maxCuti').trim().notEmpty().escape()
    ,(req,res,next)=>{
        var sql = 'update maxCuti set max_cuti = ?'
        var result = validationResult(req)
        // console.log(result.errors)
        if(result.errors.length > 0){
            res.send({sql: ''})
        } else{
            var max = req.body.maxCuti
            if(max > 12) max = 12
            var values = [max]
            connection.query(sql, values, (err, rows)=>{
                if(err){
                    next(err)
                } else{
                    res.send({sql: rows[0]}) 
                }
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

//untuk popup list nama karyawan.
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
//ambil file yang diupload ketika mengajukan izin
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
            console.log(que_result)
            res.render('view_data/izin/reportIzinKaryawan', {sql: que_result, role: req.session.role_id, nama: req.session.user})
        }
    })
})

router.get('/reportIzinKaryawanAll',(req, res,next)=>{
    var sql = 'select id, hari as jumlah_hari, alasan, a.nama, startMenit, startJam, endMenit, endJam, day(tgl_izin) as hari, month(tgl_izin) as bulan, monthname(tgl_izin) as bulanNama, year(tgl_izin) as tahun, surat, status, ket_status, jumlah_cuti from izinkaryawan a join cuti b on a.nama=b.nama order by status, a.nama, tgl_izin'
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

router.post('cuti_bersama', upload.none(),
check('nama').trim().notEmpty().escape(), 
check('alasan').trim().notEmpty().escape(),
check('tgl_izin').trim().notEmpty().escape(),
check('hari').trim().notEmpty().escape(),
check('ket_izin').trim().notEmpty().escape(),
check('status').trim().notEmpty().escape(),(req, res)=>{
    var sql = 'insert into izinkaryawan(nama, alasan, tgl_izin, hari, ket_izin, status) values(?,?,?,?,?,?) '
    var result = validationResult(req.body)
    var values = matchedData(req.body)
    connection.query(sql, values, (err, rows)=>{
        if(err){
            next(err)
        } else{
            res.send({sql:rows})
        }
    })
})

router.get('/plafon_cuti',(req,res)=>{
    var sql = 'select * from cuti where nama = ?';
    var values = [req.session.user]
    connection.query(sql, values, (err,rows)=>{
        if(err){
            next(err)
        } else {
            console.log(rows);
            if(req.session.role_id == 2) res.render('view_data/izin/plafon_cuti',{sql:rows[0], header_text:'Plafon Cuti', role: req.session.role_id})
            if(req.session.role_id == 1) res.render('view_data/izin/plafon_cuti_hrd',{sql:rows[0], header_text:'Plafon Cuti HRD', role: req.session.role_id})
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
    var sql = 'select id, hari as jumlah_hari, alasan, a.nama, startMenit, startJam, endMenit, endJam, day(tgl_izin) as hari, month(tgl_izin) as bulan, monthname(tgl_izin) as bulanNama, year(tgl_izin) as tahun, surat, status, ket_izin, jumlah_cuti from izinkaryawan a join user b on a.nama = b.nama join cuti c on a.nama = c.nama where status not in (2,3) and b.divisi = ? order by tahun, bulan;'
    connection.query(sql, [req.session.divisi],(err,rows)=>{
        if(err){
            next(err)
        } else{
            var tmp = new Array
            que_result = rows
            for(k=0;k<que_result.length;k++){
                tmp.push(que_result[k].tahun)   
            }
            console.log(que_result)
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

//buat HRD
router.get('/psikotes',(req,res)=>{
    res.render('psikotes/lihat_user_psikotes', {role: req.session.id})
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