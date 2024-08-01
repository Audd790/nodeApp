var express = require('express');
var router = express.Router();
const multer  = require('multer')
const PythonShell = require('python-shell').PythonShell;

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

    console.log(rows)
    var data = {empty: validationResult, sql: que_result}

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
  else res.redirect('http://localhost:5000/kehadiran/info')
});

router.get('/test_python', (req,res,next)=>{
  let options = {
    mode: 'text',
    scriptPath: 'C:/Users/Operation/Desktop/Auddly/nodeApp/scripts/'
  };
  
  PythonShell.run('convertToExcel.py3', options, function (err, results) {
    if (err) 
      throw err;
    // Results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });

  res.send('yes')
})

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
