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

module.exports={
    createService,
    

}