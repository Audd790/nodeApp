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
  if(!req.session.user) res.render('index');
  else res.redirect('/kehadiran/info')
});

//terima data yang di-submit dari form
router.post('/submit', upload.none(), 
check('email').trim().notEmpty().escape(), 
check('password').trim().notEmpty().escape(), 
function(req,res,next)  {

  //menaruh req.body kedalam satu variabel untuk memudahkan pembacaan
  var karyawan = req.body;

  //Memastikan setiap field sudah diisi
  const isObjectEmpty = (objectName) => {
    for (let prop in objectName) {
      if (objectName[prop] === '') {
        return true;
      }
    }
    return false;
  };

  //queri SQL yang akan digunakan
  var sql = 'SELECT nik FROM karyawan WHERE nik = ? AND pass = ?;'
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
    if(!sqlEmpty) req.session.user = que_result.nik
    var data = {empty: result.errors.length>0, sql: sqlEmpty}
    res.send(data)
  })
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

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
