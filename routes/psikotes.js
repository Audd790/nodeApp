var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })
const date = new Date
const fs = require('node:fs')
var XLSX = require("xlsx");

const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

router.get('',upload.none(), (req,res)=>{
    res.render('masuk_psikotes',{title: 'welcome to psikotes'})
})

router.post('', upload.none(), 
check('nama').trim().notEmpty().escape(), 
check('pass').trim().notEmpty().escape(), (req,res,next)=>{
    var sql = 'select * from psikotes where nama = ? and pass = ?'
    connection.query()
    res.send({result: 'success'})
})

router.get('/disc_test',(req,res)=>{
    res.render('disc_test',{title:'welcome to disctest'})
})

router.get('/ist_test', (req,res)=>{
    res.render('ist_test',{title: 'welcome to ist test'})
})

router.post('/disc_test', upload.none(), (req, res, next)=>{
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
    var filename = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds+ '-' +'disc_test'+'.xlsx'
    worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jawaban");
    XLSX.writeFile(workbook, path.join(__dirname, '..', 'files',filename), { cellStyles: true});
    const file = path.join(__dirname, '..', 'files', filename);
    res.send({result:'success'})
})

router.post('/ist_test', upload.none(), (req, res, next)=>{
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
    var filename = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds()+ '-' +'ist_test'+'.xlsx'
    worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jawaban");
    XLSX.writeFile(workbook, path.join(__dirname, '..', 'files',filename), { cellStyles: true});
    const file = path.join(__dirname, '..', 'files', filename);
    res.send({result:'success'})
})

module.exports = router