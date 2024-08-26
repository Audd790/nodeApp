var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })
const fs = require('node:fs')
var XLSX = require("xlsx");

router.get('/',(req,res)=>{
    res.render('psikotes',{title:'welcome to psikotes'})
})

router.post('/', upload.none(), (req, res, next)=>{
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
    worksheet["!cols"][COL_INDEX].wpx = COL_WIDTH;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jawaban");
    XLSX.writeFile(workbook, path.join(__dirname, '..', 'files',Date.now()+'.xlsx'), { cellStyles: true});
    res.send('success');
})

module.exports = router