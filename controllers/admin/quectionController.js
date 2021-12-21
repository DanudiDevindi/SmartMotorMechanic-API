const mysqlConnection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const checkAuth=require('../../middleware/check_auth');
var bcrypt=require('bcrypt');
const multer=require('multer');

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    } ,
    filename: function (req,file,cb) {
        cb(null, file.originalname)
    }
});
const upload=multer({
    storage: storage,
    limit:{
        filesize: 1024*1024*5
    }
});
const allquectionView =(req,res,next)=>{
    var sql = "SELECT * FROM quection"
    mysqlConnection.query(sql, function (err1, result) { 
        res.render('quections',{
            title:"All Quections",
            quections:result
        })
    });
}
module.exports={
    allquectionView,
}
