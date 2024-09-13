var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })

// membuat instansi database
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auddii',
  password: 'auddii98', 
  database: 'absenrajawali'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.user) next();
  else res.redirect('/kehadiran')
}, async (req, res, next)=>{
  // XlsxPopulate.fromFileAsync(path.join(__dirname, '..', 'IST_Norma_Pendidikan.xlsx'),{ password: "gitpsy0001" })
  //   .then(workbook=>{
  //       workbook.sheet("Input").cell("C18").value('e');
  //           // Log the value.
  //       return workbook.toFileAsync(path.join(__dirname, '..', "out.xlsx"));
  //   })
  //   .catch(reason=>{
  //       console.log( reason)
  //   })
  res.render('index')
});

//terima data yang di-submit dari form
router.post('/', upload.none(), 
check('email').trim().notEmpty().escape(), 
check('password').trim().notEmpty().escape(), 
function(req,res,next)  {
  
  //menaruh req.body kedalam satu variabel untuk memudahkan pembacaan
  var karyawan = req.body;

  //queri SQL yang akan digunakan
  var sql = 'SELECT nama, role_id, divisi FROM user WHERE ucase(replace(replace(nama," ",""),".","")) = ucase(replace(?," ","")) AND pass = ?;'
  // var sql = 'SELECT 1+1 AS Solution'
  const match = matchedData(req)
  const result = validationResult(req)
  //value yang akan dimasukkan
  var values = [karyawan.email, karyawan.password];
  //Melakukan queri di atas
  connection.query(sql, values, (err, rows, fields) => {
    var que_result
    var path
    if (err) {
      que_result = err
    }
    else{
      que_result = rows[0];
    }
    const sqlEmpty = rows > 0 || que_result == undefined;
    if(!sqlEmpty) {
      req.session.regenerate((err) => {
        if (err) next(err)
        req.session.user = que_result.nama
        req.session.role_id = que_result.role_id
        req.session.divisi = que_result.divisi
        if(req.session.role_id == 4){
          path = 'kehadiran'
        } else{
          path = 'izin'
        }
        req.session.save()
        var data = {empty: result.errors.length>0, sql: sqlEmpty, path: path}
        res.send(data)
            // console.log(que_result)
      })
    }
    else{
        console.log(req.params.path)
        var data = {empty: result.errors.length>0, sql: sqlEmpty}
        res.send(data)
    }
  })
})

router.get('/back', (req,res)=>{
  res.redirect('back')
})

router.get('/logout', (req,res,next)=>{
  req.session.user = null
  req.session.regenerate((err)=>{
    req.session.destroy((err)=>{
      if(err){
        console.log(err)
      }else{
        connection.query('delete from psikotes where nama = \'temp\'', (err, rows)=>{
          if(err){
            next(err)
          }else{
            console.log(rows)
          }
        })
        console.log('logout success')
        res.redirect('/')
      }
    })
  })
})

router.get('/downloadSuratDokter/:id', check('id').trim().notEmpty().escape(),function(req, res){
  var que_result;
  var sql = 'select surat_dokter from sakit where id = ?'
  connection.query(sql, req.params.id, (err,rows)=>{
    if(err){
      que_result = err
    }else{
      que_result = rows[0]
    }
    if(que_result !== undefined){
      const file = path.join(__dirname, '..', que_result.surat_dokter.replace(`"\"`,'/'));
      res.download(file); // Set disposition and send it.
    } else{
      res.render('file_not_found')
    }
    // res.send(file)
    
  })

  // // res.redirect('/kehadiran/info/formAbsen')
});

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
