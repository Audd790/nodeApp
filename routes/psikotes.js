var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })
const fs = require('node:fs')
var XLSX = require("xlsx");

const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

router.get('/masuk_test/:test',upload.none(), (req,res)=>{
    if(req.params.test == 'ist'){
        res.render('psikotes/masuk_psikotesIST',{title: 'welcome to psikotes', tipeTest:req.params.test})
    }

    if(req.params.test == 'disc'){
        res.render('psikotes/masuk_psikotesDisc',{title: 'welcome to psikotes', tipeTest:req.params.test})
    }
})

router.post('/masuk_test/:test', upload.none(), (req,res,next)=>{
    var sql
    var date
    var values
    if(req.params.test == 'ist'){
        const masuk_psikotesIST = req.body
        sql = 'insert into psikotes(nama, jenis_kelamin, pend_terakhir, hari, bulan, year)'+
        'values(?,?,?,?,?,?)'
        date = new Date(req.body.tgl_lahir)
        values = [masuk_psikotesIST.nama, 
        masuk_psikotesIST.kelamin, 
        masuk_psikotesIST.pen_terakhir,
        date.getDate(),
        date.getMonth(),
        date.getFullYear()]
        connection.query(sql,values, (err,rows)=>{
            if(err){
                next(err)
            } else{
                console.log(rows)
                req.session.user = masuk_psikotesIST.nama
                res.send({result: 'success'})
            }
        })
    }

    if(req.params.test == 'disc'){
        sql = 'insert into psikotes(nama, jenis_kelamin, umur)'+
        'values(?,?,?)'
        values = Object.values(req.body)
        connection.query(sql, values, (err, rows)=>{
            if(err){
                next(err)
            }else{
                console.log(rows)
                req.session.user = req.body.nama
                res.send({result: 'success'})
            }
        })
    }
})

router.get('/disc_test',  (req,res)=>{
    console.log(req.session.user)
    if(!req.session.user){
        res.redirect('/psikotes/masuk_test/disc')
    }
    res.render('psikotes/disc_test',{title:'welcome to disctest'})
})

router.get('/ist_test', (req,res)=>{
    if(!req.session.user){
        res.redirect('/psikotes/masuk_test/ist')
    }
        res.render('psikotes/ist_test',{title: 'welcome to ist test'})
})

router.post('/disc_test', upload.none(), 
    check('most1').notEmpty().escape(), check('least1').notEmpty().escape(), 
    check('most2').notEmpty().escape(), check('least2').notEmpty().escape(), 
    check('most3').notEmpty().escape(),check('least3').notEmpty().escape(), 
    check('most4').notEmpty().escape(),check('least4').notEmpty().escape(), 
    check('most5').notEmpty().escape(),check('least5').notEmpty().escape(), 
    check('most6').notEmpty().escape(),check('least6').notEmpty().escape(), 
    check('most7').notEmpty().escape(),check('least7').notEmpty().escape(), 
    check('most8').notEmpty().escape(),check('least8').notEmpty().escape(), 
    check('most9').notEmpty().escape(),check('least9').notEmpty().escape(), 
    check('most10').notEmpty().escape(),check('least10').notEmpty().escape(), 
    check('most11').notEmpty().escape(),check('least11').notEmpty().escape(), 
    check('most12').notEmpty().escape(),check('least12').notEmpty().escape(), 
    check('most13').notEmpty().escape(),check('least13').notEmpty().escape(), 
    check('most14').notEmpty().escape(),check('least14').notEmpty().escape(), 
    check('most15').notEmpty().escape(),check('least15').notEmpty().escape(), 
    check('most16').notEmpty().escape(),check('least16').notEmpty().escape(), 
    check('most17').notEmpty().escape(),check('least17').notEmpty().escape(), 
    check('most18').notEmpty().escape(),check('least18').notEmpty().escape(), 
    check('most19').notEmpty().escape(),check('least19').notEmpty().escape(), 
    check('most20').notEmpty().escape(),check('least20').notEmpty().escape(), 
    check('most21').notEmpty().escape(),check('least21').notEmpty().escape(), 
    check('most22').notEmpty().escape(),check('least22').notEmpty().escape(), 
    check('most23').notEmpty().escape(),check('least23').notEmpty().escape(), 
    check('most24').notEmpty().escape(),check('least24').notEmpty().escape(),(req, res, next)=>{
        console.log(req.session.user)
        if(!req.session.user){
            res.redirect('/masuk_test/disc')
        }
        const date = new Date
        const result = validationResult(req);
        const match = matchedData(req)
        var values = Object.values(match)
        if(result.errors.length > 0){
            res.send({result:'tolong isi sampai selesai', err: result.errors})
        } else{
            console.log(req.body)
            const worksheet = XLSX.utils.json_to_sheet(Object.values(req.body));
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
            var filename = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds() +'-' +'disc_test_'+req.session.user+'.xlsx'
            worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
            XLSX.utils.book_append_sheet(workbook, worksheet, "Jawaban");
            XLSX.writeFile(workbook, path.join(__dirname, '..', 'files',filename), { cellStyles: true});
            const file = path.join(__dirname, '..', 'files', filename);
            var sql = 'update psikotes set disc_result = ? where nama = ?'
            var values = [filename, req.session.user]
            connection.query(sql, values, (err,rows)=>{
                if(err){
                    next(err)
                } else{
                    console.log(rows)
                    // req.session.destroy()
                }
            })
            res.send({result: 'success', err: ''})
        }
})

router.post('/ist_test', upload.none(), (req, res, next)=>{
    if(!req.session.user){
        res.redirect('/masuk_test/ist')
    }
    console.log(req.body)
    const date = new Date
    const worksheet = XLSX.utils.json_to_sheet(Object.values(req.body));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });
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
    var filename = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds()+ '-' +'ist_test'+req.session.user+'.xlsx'
    worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jawaban");
    XLSX.writeFile(workbook, path.join(__dirname, '..', 'files',filename), { cellStyles: true});
    const file = path.join(__dirname, '..', 'files', filename);
    var sql = 'update psikotes set ist_result = ? where nama = ?'
    var values = [filename, req.session.user]
    connection.query(sql, values, (err,rows)=>{
        if(err){
            next(err)
        } else{
            console.log(rows)
            req.session.destroy()
        }
    })
    res.send({result: 'success'})
})

module.exports = router