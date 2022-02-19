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
        
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
    title='${escape(obj.title)}',description='${escape(obj.description)}' WHERE service_id='${obj.service_id}'`; 

    }else if(objL==="" && req.files.length>0){
      
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
    title='${escape(obj.title)}',description='${escape(obj.description)}',image='${req.files[0].originalname}' WHERE service_id='${obj.service_id}'`; 

    }else if(objL!=="" && req.files.length<=0){
       
        sql=`update service set cat_id='${obj.cat_id}', category='${obj.cat_name}',service_type='${obj.service_type}',
        title='${escape(obj.title)}',description='${escape(obj.description)}',longitude='${objL.longitude}',
        latitude='${obj.latitude}',address='${obj.address}' WHERE service_id='${obj.service_id}'`;     

    }else if(objL!=="" && req.files.length>0){
       
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
const deleteUserService=async(req,res,next)=>{
    const service_id=req.params.service_id;
    var sql=`DELETE FROM service WHERE service_id='${service_id}'`;
    mysqlConnection.query(sql, function (err, result) {
        
        if(err){
            res.send({
                err:true,
                msg:err
            });
        }else{
            res.send({
                err:false,
                msg:'Service Delete'
            });
        }        
    })
}
const allServices=(req,res,next)=>{
    var sql = "SELECT * FROM service ORDER BY createAt DESC"
    mysqlConnection.query(sql, function (err1, result) { 
        res.send(
            result
        )
    });   
}

const allServicesWithPagination=async(req,res,next)=>{
    var pageno=req.params.page;
    var vehicle=req.params.vehicle;
    var limit = 20;
    var offset = (pageno - 1) * limit;
    var cities=[];
    var isApproved='yes'
    if(vehicle==="all"){
        var sql=`SELECT u.uid,u.image as userImage,s.service_id,s.user_name,u.contact_no,s.category,s.title,s.description,s.service_type,s.price_set_as,s.price,s.image,s.image2,s.image3,s.longitude,s.latitude,s.address,s.city,s.createAt
        FROM service as s
        INNER JOIN user_tbl as u ON u.uid=s.uid where isApproved='${isApproved}' ORDER BY createAt DESC`
        // var sql=`SELECT * FROM service where isApproved='${isApproved}' ORDER BY createAt DESC LIMIT '${limit}' OFFSET '${offset}'`
    }else{
        var sql=`SELECT s.user_name,u.contact_no,s.category,s.title,s.description,s.service_type,s.price_set_as,s.price,s.image,s.image2,s.image3,s.longitude,s.latitude,s.address,s.createAt
        FROM service as s
        INNER JOIN user_tbl as u ON u.uid=s.uid where category='${vehicle}' and isApproved='${isApproved}' ORDER BY createAt DESC`
        // var sql = "SELECT * FROM service where category="+vehicle+" ORDER BY createAt DESC LIMIT " + limit + " OFFSET " + offset;
    }
    
    mysqlConnection.query(sql, function (err1, result) {
        result.forEach(async (element) => {            
            if (!cities.includes(element.city)) {
                await cities.push(element.city);
            }
       })
            res.send({
                services:result,
                cities:cities,
            }
            )
        // }, 100);                
    });

}
const allServicesWithFilter=(req,res,next)=>{
    var filter=req.body.filter;
    var pageno=req.body.page;   
    var limit = 20;
    var offset = (pageno - 1) * limit;
    var sql;
    var isApproved="yes"
    if(filter.city==="" && filter.service==="" && filter.category===""){
        sql = `SELECT * FROM service where isApproved='${isApproved}'`        
    }else if(filter.city!=="" && filter.service!=="" && filter.category!==""){       
        sql = `SELECT * FROM service WHERE service_type='${filter.service}' AND city='${filter.city}' AND category='${filter.category}' AND isApproved='${isApproved}'`
    }else if(filter.city!=="" && filter.service!==""){
      
        sql = `SELECT * FROM service WHERE service_type='${filter.service}' AND city='${filter.city}'`
    }else if(filter.service!=="" && filter.category!==""){
       
        sql = `SELECT * FROM service WHERE service_type='${filter.service}' AND category='${filter.category}' AND isApproved='${isApproved}'`
    }else if(filter.city!=="" && filter.category!==""){
        
        sql = `SELECT * FROM service WHERE city='${filter.city}' AND category='${filter.category}' AND isApproved='${isApproved}'`
    }else if(filter.city!==""){
       
        sql = `SELECT * FROM service WHERE city='${filter.city}'`
    }else if(filter.service!==""){
        
        sql = `SELECT * FROM service WHERE service_type='${filter.service}' AND isApproved='${isApproved}'`
    }else if(filter.category!==""){
        
        sql = `SELECT * FROM service WHERE category='${filter.category}' AND isApproved='${isApproved}'`
    }
    
    mysqlConnection.query(sql, function (err1, result) { 
        res.send(
            result
        )          
    });
}
const allService_types=(req,res,next)=>{
    var sql = "SELECT * FROM service_type"
    mysqlConnection.query(sql, function (err1, result) { 
        res.send(
           result 
        )
    });
}
const createServiceRate=(req,res,next)=>{
    var sql1=`SELECT * FROM service_feedback where service_id='${req.body.service_id}' and uid='${req.user_data.uid}'`;
    mysqlConnection.query(sql1, function (err, result1) {
        if(result1.length>0){
            res.send({
                err:true,
                msg:"Already send feedback"
            })            
        }else{
            var sql=`INSERT INTO service_feedback(uid,username,rate,comment,service_id,createAt) VALUES
            ('${req.user_data.uid}','${req.user_data.name}','${req.body.rate}','${req.body.comment}','${req.body.service_id}',now())`;
        
            mysqlConnection.query(sql, function (err, result) {
               if(err){
                    res.send({
                        err:true,
                        msg:"server Error"
                    })
                }else{
                    res.send({
                        err:false,
                        msg:"Thank you for Rating"
                    })
                }
            }) 
        }
    })
   
}
const getRateSummery=(req,res,next)=>{
    var sql = `SELECT * FROM service_feedback where service_id='${req.params.service_id}'` ;
    mysqlConnection.query(sql, function (err, result) {
        let rateSum=0,finalRate=0;
        let rateSummery;
        
        let star5=0,star4=0,star3=0,star2=0,star1=0;
        if(result.length>0){
            for(var i=0;i<result.length;i++){
                rateSum+=result[i].rate;
                switch(result[i].rate){
                    case 5:star5++;
                        break;
                    case 4:star4++;
                        break;
                    case 3:star3++;
                        break;
                    case 2:star2++;
                        break;
                    case 1:star1++;
                        break;
                    default:0
                }
            }
            finalRate=rateSum/result.length
         rateSummery={
            finalRate:finalRate,
            star5Perntage:star5*100/result.length+"%",
            star4Perntage:star4*100/result.length+"%",
            star3Perntage:star3*100/result.length+"%",
            star2Perntage:star2*100/result.length+"%",
            star1Perntage:star1*100/result.length+"%",
        }
            
        }else{
            rateSummery={
                finalRate:0+"%",
                star5Perntage:0+"%",
                star4Perntage:0+"%",
                star3Perntage:0+"%",
                star2Perntage:0+"%",
                star1Perntage:0+"%",
            }
        }
        res.send(rateSummery)
    })
}

const getServiceRate=(req,res,next)=>{
    var sql = `SELECT * FROM service_feedback where service_id='${req.params.service_id}'` ;
    mysqlConnection.query(sql, function (err, result) {
        res.send(result)
    })

}



module.exports={
    createService,
    userServices,
    editService,
    deleteUserService,
    allServices,
    allServicesWithPagination,
    allServicesWithFilter,
    allService_types,
    createServiceRate,
    getRateSummery,
    getServiceRate,
    
}