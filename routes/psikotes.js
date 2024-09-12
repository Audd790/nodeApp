var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })
const fs = require('node:fs')
var XLSX = require("xlsx");
const XlsxPopulate = require('xlsx-populate');
var GroupDocs = require('groupdocs-conversion-cloud');

const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

router.get('/',(req,res,next)=>{
    if(!req.session.user){
        // connection.query('insert into psikotes(nama)values("temp")',(err,rows)=>{
        //     if(err) {
        //         next(err)
        //     } else {
        //         req.session.user = 'temp'
                req.session.role = 0
                res.render('home_psikotes',{header_text:'Pilih test', role: req.session.role})
        //     }
    
        // })
    } else{
        req.session.role = 0
        res.render('home_psikotes',{header_text:'Pilih test', role: req.session.role})
    }
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
        sql = 'update psikotes set nama = ?, jenis_kelamin = ?, pend_terakhir = ?, hari = ?, bulan = ?, year = ? where nama = ?'
        date = new Date(req.body.tgl_lahir)
        var nama = req.session.user
        values = [masuk_psikotesIST.nama, 
        masuk_psikotesIST.kelamin, 
        masuk_psikotesIST.pen_terakhir,
        date.getDate(),
        date.getMonth(),
        date.getFullYear(),
        nama]
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
        sql = 'update psikotes set nama = ?, jenis_kelamin = ?, umur = ? where nama = ?'
        values = Object.values(req.body)
        values.push(req.session.user)
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
    } else{
        res.render('psikotes/disc_test',{title:'welcome to disctest'})
    }
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
    check('most24').notEmpty().escape(),check('least24').notEmpty().escape(),async (req, res, next)=>{
        console.log(req.session.user)
        if(!req.session.user){
            res.redirect('/masuk_test/disc')
        }
        const date = new Date
        const result = validationResult(req);
        if(result.errors.length > 0){
            res.send({result:'tolong isi sampai selesai', err: result.errors})
        } else{
            
            // initialize api
        
            // console.log(req.body)
            // const worksheet = XLSX.utils.json_to_sheet(Object.values(req.body));
            // const workbook = XLSX.utils.book_new();
            // var C = XLSX.utils.decode_col("G"); 
            // var fmt = 'dd/mm/yyyy hh:mm:ss'; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format

            // /* get worksheet range */
            // var range = XLSX.utils.decode_range(worksheet['!ref']);
            // for(var i = range.s.r + 1; i <= range.e.r; ++i) {
            //     /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
            //     var ref = XLSX.utils.encode_cell({r:i, c:C});
            //     /* if the particular row did not contain data for the column, the cell will not be generated */
            //     if(!worksheet[ref]) continue;
            //     /* assign the `.z` number format */
            //     worksheet[ref].z = fmt;
            // }

            // const COL_WIDTH = 50;

            // /* Excel column "C" -> SheetJS column index 2 == XLSX.utils.decode_col("C") */
            // var COL_INDEX = 2;
            
            // /* create !cols array if it does not exist */
            // if(!worksheet["!cols"]) worksheet["!cols"] = [];
            
            // /* create column metadata object if it does not exist */
            // if(!worksheet["!cols"][COL_INDEX]) worksheet["!cols"][COL_INDEX] = {wch: 8};
            
            // /* set column width */
            // // Cant work for some reason
            var filename = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds() +'-' +'disc_test_'+req.session.user
            
            XlsxPopulate.fromFileAsync(path.join(__dirname, '..', "Software DISC.xlsx"))
            .then(workbook=>{
                const match = matchedData(req)
                var values = Object.values(match)
                for(i=0;i<values.length;i++){
                    workbook.sheet('DISC Test').cell(values[i]).value('x')
                    
                }

                // for(i=12;i<=54;i = i+6){
                //     console.log(i)
                //     workbook.sheet('DISC Test').row(i).hidden(true)
                // }
                // workbook.sheet('DISC Test').column('C').hidden(true)
                // workbook.sheet('DISC Test').column('E').hidden(true)
                // workbook.sheet('DISC Test').column('J').hidden(true)
                // workbook.sheet('DISC Test').column('L').hidden(true)
                // workbook.sheet('DISC Test').column('Q').hidden(true)
                // workbook.sheet('DISC Test').column('S').hidden(true)
                // // workbook.sheet('DISC Test').range('D2:G6').merged(true)
                // var pindah = 29
                // pindahBarisCell('B', 42, pindah, workbook.sheet('Result'))
                // pindahBarisCell('B', 43, pindah, workbook.sheet('Result'))
                // pindahBarisCell('L', 43, pindah, workbook.sheet('Result'))

                // workbook.sheet('Result').range('B42:J42').merged(false)
                // workbook.sheet('Result').range('B43:J43').merged(false)
                // workbook.sheet('Result').range('L42:T42').merged(false)
                // workbook.sheet('Result').range('B59:L59').merged(false)
                // workbook.sheet('Result').range('B77:T83').merged(false)
                // workbook.sheet('Result').range('B86:T89').merged(false)
                // for(i=44;i<=56;i++){ 
                //     workbook.sheet('Result').range('B'+ i +':J'+ i +'').merged(false)
                //     pindahBarisFormula('B', i, pindah, workbook.sheet('Result'))
                //     workbook.sheet('Result').range('B'+ (i-pindah) +':J'+ (i-pindah) +'').merged(true)

                //     workbook.sheet('Result').range('L'+ i +':T'+ i +'').merged(false)
                //     pindahBarisFormula('L', i, pindah, workbook.sheet('Result'))
                //     workbook.sheet('Result').range('L'+ (i-pindah) +':T'+ (i-pindah) +'').merged(true)
                // }

                // pindahBarisCell('B', 59, pindah, workbook.sheet('Result'))

                // for(i=60;i<=72;i++){
                //     workbook.sheet('Result').range('B'+ i +':J'+ i +'').merged(false)
                //     pindahBarisFormula('B', i, pindah, workbook.sheet('Result'))
                //     workbook.sheet('Result').range('B'+ (i-pindah) +':J'+ (i-pindah) +'').merged(true)
                // }
                // pindahBarisCell('C', 76, pindah, workbook.sheet('Result'))
                // pindahKolomCell('C', 76-pindah, 1, workbook.sheet('Result'))
                // pindahBarisFormula('B', 77, pindah, workbook.sheet('Result'))
                // pindahBarisCell('C', 85, pindah, workbook.sheet('Result'))
                // pindahKolomCell('C', 85-pindah, 1, workbook.sheet('Result'))
                // pindahBarisFormula('B', 86, pindah, workbook.sheet('Result'))
                return workbook.toFileAsync(path.join(__dirname, '..', 'files', filename+".xlsx"))
            }).then(response=>{
                var values = [filename, req.session.user]
                var sql = 'update psikotes set disc_result = ? where nama = ?'
                // connection.query(sql, values, (err,rows)=>{
                //     if(err){
                //         next(err)
                //     } else{
                //         console.log(rows)
                //     }
                // })
                res.send({result: 'success', err: ''})
            })
        }
})

router.get('/getDiscResults/:nama', async (req,res,next)=>{
    connection.query('select result from disc where nama = ? and result not in ("")', req.params.nama, 
        async (err, rows)=>{
            if(err){
                next(err)
            } else {
                var filename = rows[0].result;
                res.download(path.join(__dirname, '..', 'files',filename+'.xlsx'))
            }
        })
})

router.get('/getDiscResults/:nama', async (req,res,next)=>{
    connection.query('select result from disc where nama = ? and result not in ("")', req.params.nama, 
        async (err, rows)=>{
            if(err){
                next(err)
            } else {
                var filename = rows[0].result;
                res.download(path.join(__dirname, '..', 'files',filename+'.xlsx'))
            }
        })
})

router.get('/getIstResults/:nama', (req,res,next)=>{
    connection.query('select result from ist where nama = ? and result not in ("")', req.params.nama, 
        (err, rows)=>{
            if(err){
                next(err)
            } else {
                res.download(path.join(__dirname, '..', 'files',rows[0].result+'.xlsx'))
            }
        })
})

router.post('/ist_test', upload.none(), (req, res, next)=>{
    const date = new Date
    if(!req.session.user){
        res.redirect('/masuk_test/ist')
    }
    var values = Object.entries(req.body)
    // console.log(values)
    var filename = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds() +'-' +'ist_test_'+req.session.user
    XlsxPopulate.fromFileAsync(path.join(__dirname, '..', 'IST_Norma_Pendidikan.xlsx'),{ password: "gitpsy0001" })
    .then(workbook=>{
        for(i=0;i<76;i++){
            workbook.sheet("Input").cell(values[i][0]).value(values[i][1])
        }
        for(i=76;i<116;i++){
            var cellValue = ''
            for(k=0;k<values[i][1].length;k++){
                cellValue = cellValue + values[i][1][k]
            }
            workbook.sheet("Input").cell(values[i][0]).value(cellValue)
        }

        for(i=116;i<176;i++){
            workbook.sheet("Input").cell(values[i][0]).value(values[i][1])
        }
            // Log the value.
        return workbook.toFileAsync(path.join(__dirname, '..', 'files', filename+".xlsx"));
    }).then(response=>{
        var sql = 'update psikotes set ist_result = ? where nama = ?'
        var values = [filename, req.session.user]
        connection.query(sql, values, (err,rows)=>{
            if(err){
                next(err)
            } else{
                console.log(rows)
            }
        })
        res.send({result: 'success'})
    })
    .catch(reason=>{
        console.log( reason)
    })
    
})
router.get('/getPsikotesResults',(req,res,next)=>{
    var sql = 'select * from psikotes'
    connection.query(sql,(err,rows)=>{
        if(err){
            next(err)
        } else{
            res.send(rows)
        }
    })
})
// router.get('/getDISC',(req,res,next)=>{
//     var sql = 'select * from disc where result not in ("")'
//     connection.query(sql,(err,rows)=>{
//         if(err){
//             next(err)
//         } else{
//             res.send(rows)
//         }
//     })
// })
router.get('/deletePsikotes/:nama', (req,res,next)=>{
    var nama = req.params.nama
    connection.query('delete from psikotes where nama = ?', [nama],(err, rows)=>{
        if(err){
          next(err)
        }else{
          console.log(rows)
          res.send({message: 'success'})
        }
    })
})

function pindahBarisCell(kolom, row, pindah, workbookSheet){
    var temp
    console.log(kolom+row)
    temp = workbookSheet.cell(kolom+row).value()
    workbookSheet.cell(kolom+row).value('')
    console.log(kolom+(row-pindah))
    workbookSheet.cell(kolom+(row-pindah)).value(temp)
}

function pindahBarisFormula(kolom, row, pindah, workbookSheet){
    var temp
    temp = workbookSheet.cell(kolom+row).formula()
    workbookSheet.cell(kolom+row).formula('')
    console.log( 'temp'+ (kolom+(row))+': ' +temp)
    workbookSheet.cell(kolom+(row-pindah)).formula(temp)
}

function pindahKolomCell(kolom, row, pindah, workbookSheet){
    var temp
    var ascii = kolom.charCodeAt(0)
    var letter = (ascii - pindah).toString()
    temp = workbookSheet.cell(kolom+row).value()
    workbookSheet.cell(kolom+row).value('')
    pindah = String.fromCharCode(letter)
    console.log( 'Pindah: ' +letter)
    workbookSheet.cell(pindah+row).value(temp)
}

module.exports = router