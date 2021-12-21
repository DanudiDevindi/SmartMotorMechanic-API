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

const addQuectionView=(req,res,next)=>{
    var users;
    var categories;
    var sql_user = "SELECT * FROM user_tbl";
    mysqlConnection.query(sql_user, function (err1, result) { 
        users=result
    });
    var sql_cat = "SELECT * FROM category";
    mysqlConnection.query(sql_cat, function (err1, result) {
        categories=result
    });

    setTimeout(function () {
        res.render('addQuection',{
            title:'addQuection',
            msg:'',
            err:false,
            users:users,
            categories:categories
        })
    }, 100);    
}
module.exports={
    allquectionView,
    addQuectionView,
}
