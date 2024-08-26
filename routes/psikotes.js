var express = require('express');
var router = express.Router();
const multer  = require('multer')
var path = require('path');
const { check, matchedData, validationResult } = require('express-validator');
const upload = multer({ dest: 'uploads/' })

router.get('/',(req,res)=>{
    res.render('psikotes',{title:'welcome to psikotes'})
})

module.exports = router