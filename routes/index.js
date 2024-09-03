var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })

//Buat parse dan format tanggal lahir dari user
const date = new Date();

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
  else res.redirect('/kehadiran/info')
});

router.get('/login/:path',(req,res,next)=>{
  res.render('index')
});


//terima data yang di-submit dari form
router.post('/login/:path', upload.none(), 
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
        req.session.save()
        var data = {empty: result.errors.length>0, sql: sqlEmpty, path: req.params.path}
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
        console.log('logout success')
        res.redirect('/')
      }
    })
  })
})

router.get('/downloadExcel', function(req, res){
  const file = path.join(__dirname, '..', 'files', 'izin_karyawan.xlsx');
  res.download(file); // Set disposition and send it.
  // res.redirect('/kehadiran/info/formAbsen')
});

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
