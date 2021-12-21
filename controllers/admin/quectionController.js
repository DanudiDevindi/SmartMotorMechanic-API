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
const addQuection=(req,res,next)=>{
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
    var user=req.body.user;
    var cat=req.body.category;

    var uid=parseInt(user.split("-")[0]);
    var user_name=user.split("-")[1];
    var cat_id =parseInt(cat.split("-")[0]);
    var category=cat.split("-")[1];
    var title=req.body.title;
    var quection =req.body.quection;
    var status="create";
    var latitude =10;
    var longitude=11;
    var createAt=new Date();
    var image=req.files[0].originalname;

    var sql=`INSERT INTO quection(uid,user_name,cat_id,category,title,quection,longitude,latitude,image,status,createAt) VALUES
    ('${uid}','${user_name}','${cat_id}','${category}','${title}','${quection}','${longitude}','${latitude}','${image}','${status}','${createAt}')`;

    mysqlConnection.query(sql, function (err, result) {
        if(err){
            setTimeout(function () {
                res.render('addQuection',{
                    title:'Add Quection',
                    msg:'Please try again',
                    err:true,
                    users:users,
                    categories:categories
                })
            }, 100);
        }else{
            setTimeout(function () {
                res.render('addQuection',{
                    title:'Add Quection',
                    msg:'Added Quection sucess',
                    err:false,
                    users:users,
                    categories:categories
                })
            }, 100);
        }
    });      
}

module.exports={
    allquectionView,
    addQuectionView,
    addQuection,
}
