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
const deleteQuection =(req,res,next)=>{
    const id=req.params.qid;
    var sql=`DELETE FROM quection WHERE qid='${id}'`;
    mysqlConnection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/admin/quections');
    })
}

const blockQuection =(req,res,next)=>{
    const service_id=req.params.service_id;
    const status=req.params.status;
    if(status){
        var sql=`update service set status='${0}' WHERE service_id='${service_id}'`;
        mysqlConnection.query(sql, function (err, result) {
        if(err) throw err;
        res.send("Un Blocked");
    })
    }else{
        var sql=`update service set status='${1}' WHERE service_id='${service_id}'`;
        mysqlConnection.query(sql, function (err, result) {
        if(err) throw err;
        res.send("Blocked");
    })
    }
    
}

const approveQuection =(req,res,next)=>{
    const service_id=req.params.service_id;
    var sql=`update service set isApproved='${true}' WHERE service_id='${service_id}'`;
    mysqlConnection.query(sql, function (err, result) {
        if(err) throw err;
        res.send("Aproved");
    })
}

const quectionView=(req,res,next)=>{
    const id = req.params.id;
    var sql = "SELECT * FROM quection where qid=" + id;
    mysqlConnection.query(sql, function (err1, result) {
      
        res.render('viewQuection', {
            title: "View Quection",
            quection: result[0],
            err: '',
            msg: ''
        })
    });
}

const answeredView=(req,res,next)=>{
    var qid=req.params.qid;
    var sql = "SELECT answer,name FROM answer,user_tbl where qid=" + qid;
    mysqlConnection.query(sql, function (err1, result) {
        
        res.render('answersList', {
            title: "View "+req.params.title+" Answer List",
            answers: result,
            err: '',
            msg: '',
        })
    });
}


module.exports={
    allquectionView,
    addQuectionView,
    addQuection,
    deleteQuection,
    blockQuection,
    approveQuection,
    quectionView,
    answeredView,
}
