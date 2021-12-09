const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const checkAuth=require('../middleware/check_auth');
var bcrypt=require('bcrypt');
const multer=require('multer');
var isApproved="yes"

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

//mobile app APIs
const allCate=(req,res,next)=>{
    var sql = "SELECT * FROM category"
    mysqlConnection.query(sql, function (err1, result) { 
        res.send(
           result 
        )
    });
}

const AllCategoryWithCount=(req,res,next)=>{
    var sql="SELECT category,COUNT(cat_id) AS vehiCount FROM service where isApproved='yes' GROUP BY category ORDER BY COUNT(cat_id) DESC LIMIT 3"

    mysqlConnection.query(sql, function (err1, result) { 
        console.log(err1)
        console.log(result)
        res.send(
            result
        )
    });
}

module.exports={
    allCate,
    AllCategoryWithCount
}