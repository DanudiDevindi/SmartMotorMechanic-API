const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const checkAuth=require('../middleware/check_auth');
var bcrypt=require('bcrypt');
const multer=require('multer');
var escape = require('sql-escape');

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

const createService=(req,res,next)=>{ 
    console.log(123)
    const objL=JSON.parse(req.body.location);
    const obj = JSON.parse(req.body.data);
    var createAt=obj.createAt
    var uid=req.user_data.uid;
    var user_name=req.user_data.name;
    var cat_id =obj.cat_id;
    var category=obj.cat_name;
    var title=escape(obj.title);
    var description =escape(obj.description);
    var service_type_id=obj.service_type_id;
    var service_type=obj.service_type;
    var price_set_as=obj.price_set_as;
    var price=obj.price; 
    var status="create";
    var latitude =objL.region.latitude;
    var longitude=objL.region.longitude;
    var address=escape(objL.region.address);
    var cityArray=address.split(',');
    var city=cityArray[cityArray.length-2];
    var isPaid="no";
    var isApproved="no";
    var image1=""; 
    var image2=""; 
    var image3=""; 
    if(req.files.length===1){
        var image1=escape(req.files[0].originalname); 
    }else if(req.files.length===2){
        image1=escape(req.files[0].originalname); 
        image2=escape(req.files[1].originalname); 
    }else if(req.files.length===3){
        image1=escape(req.files[0].originalname); 
        image2=escape(req.files[1].originalname); 
        image3=escape(req.files[2].originalname); 
    }
    
    var sql=`INSERT INTO service(uid,user_name,cat_id,category,title,description,service_type_id,service_type,price_set_as,price,image,image2,image3,longitude,
        latitude,address,city,createAt,status,isApproved) VALUES ('${uid}','${user_name}','${cat_id}','${category}',
        '${title}','${description}','${service_type_id}','${service_type}','${price_set_as}','${price}','${image1}','${image2}','${image3}','${longitude}','${latitude}','${address}','${city}',
        now(),'${status}','${isApproved}')`;

    mysqlConnection.query(sql, function (err, result) {
        console.log(err)
        if(err){
            res.send({
                err:true,
                message:"Server Error"
            })
        }else{
            var isExpired="no";
            var isPaid="yes";
            var sql_pay=`SELECT * FROM user_payment where uid='${uid}' and isExpired='${isExpired}' and isPaid='${isPaid}'`;
            mysqlConnection.query(sql_pay, function (err, result_pay) {
                if(err){
                    console.log(err)
                    res.send({
                        err:true,
                        message:"Server Error"
                    });
                }else{
                    if(result_pay.length>=1){
                        res.send({
                            err: false,
                            message: "Service Added. wait for Admin approval",
                            status:'payment_done'
                        });
                    }else{
                        res.send({
                            err: false,
                            message: "Service Added. Please makes payment",
                            status:'payment_not_done'
                        });
                    }
                }                
            })
            
        }
    });        

}
const userServices=(req,res,next)=>{
    var uid=req.user_data.uid;
    var sql = "SELECT * FROM service where uid="+uid+" ORDER BY createAt DESC"
    mysqlConnection.query(sql, function (err1, result) { 
        res.send(
            result
        )
    });   
}
const editService=(req,res,next)=>{
    const obj = JSON.parse(req.body.data);
    const objL=JSON.parse(req.body.location);
    var latitude;
    var longitude;
    var address;
    var city;

    if(objL!==""){        
        latitude=latitude =objL.latitude;
        longitude=longitude=objL.longitude;
        address=address=escape(objL.address);
        var cityArray=address.split(',');
        city=cityArray[cityArray.length-2]; 
    }
    var sql;
    if(objL==="" && req.files.length<=0){
        console.log("No Image or location")
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
    title='${escape(obj.title)}',description='${escape(obj.description)}' WHERE service_id='${obj.service_id}'`; 

    }else if(objL==="" && req.files.length>0){
        console.log("only image")
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
    title='${escape(obj.title)}',description='${escape(obj.description)}',image='${req.files[0].originalname}' WHERE service_id='${obj.service_id}'`; 

    }else if(objL!=="" && req.files.length<=0){
        console.log("only location")
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
        title='${escape(obj.title)}',description='${escape(obj.description)}',longitude='${objL.longitude}',
        latitude='${obj.latitude}',address='${obj.address}' WHERE service_id='${obj.service_id}'`;     

    }else if(objL!=="" && req.files.length>0){
        console.log("both image and location")
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
        title='${escape(obj.title)}',description='${escape(obj.description)}',longitude='${objL.longitude}',
       latitude='${obj.latitude}',address='${obj.address}',image='${req.files[0].originalname}' WHERE service_id='${obj.service_id}'`; 

    }
    mysqlConnection.query(sql, function (err, result) {
        if(err){
            res.send({
                err:true,
                message:"Server Error"
            }) 
        }else{
            res.send({
                err:false,
                message:"Updated"
            })
        }
    })
}


module.exports={
    createService,
    userServices,
    editService,
    
}