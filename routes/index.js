var express = require('express');
var router = express.Router();
const multer  = require('multer')

const upload = multer({ dest: 'uploads/' })

//Buat parse dan format tanggal lahir dari user
const date = new Date();

//membuat instansi database
// const mysql = require('mysql2')
// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'auddly',
//   password: 'auddii98', 
//   database: 'absenrajawali'
// })

//terima data yang di-submit dari form
router.post('/submit', upload.none(), function(req,res,next)  {

  //menaruh req.body kedalam satu variabel untuk memudahkan pembacaan
  var karyawan = req.body;
  console.log(karyawan)
  //Memastikan setiap field sudah diisi
  const isObjectEmpty = (objectName) => {
    for (let prop in objectName) {
      if (objectName[prop] === '') {
        return true;
      }
    }
    return false;
  };

  var validationResult = isObjectEmpty(karyawan);

  //queri SQL yang akan digunakan
  var sql = 'SELECT * FROM karyawan WHERE nik = ? AND pass = ?;'
  // var sql = 'SELECT 1+1 AS Solution'

  //value yang akan dimasukkan
  var values = [karyawan.email, karyawan.password];

  var que_result;
  
  
  //Melakukan queri di atas
  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      que_result = err
    }
    else{
      que_result = rows[0];
    }

    console.log(que_result)

    var data = {Empty: validationResult, sql: que_result}

    if(que_result !== undefined) {
      req.session.user = que_result.nik
      // console.log(req.session.user)
    }
    res.send(data)
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.user) res.render('index');
  else res.redirect('http://localhost:3000/kehadiran')
});

router.get('/message', function(req, res, next) {
  res.send('Hello from Express!');
});

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
