const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');
var moment = require('moment-timezone');
var escape = require('sql-escape');


const createQuection = (req, res, next) => {
    console.log("createQuection1")
    console.log(req.files)
    const obj = JSON.parse(req.body.data);
    const objL = JSON.parse(req.body.location);
    var uid = req.user_data.uid;
    console.log("uid")
    console.log(uid)
    var user_name = escape(req.user_data.name);
    var cat_id = obj.cat_id;
    var category = obj.cat_name;
    var title = escape(obj.title);
    var quection = escape(obj.quection);
    var status = "create";
    var latitude = objL.region.latitude;
    var longitude = objL.region.longitude;
    var address = escape(objL.region.address);
    // var image = escape(req.files[0].originalname);

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
    var sql = `INSERT INTO quection(uid,user_name,cat_id,category,title,quection,longitude,latitude,address,image,image2,image3,status,createAt) VALUES
    ('${uid}','${user_name}','${cat_id}','${category}','${title}','${quection}','${longitude}','${latitude}','${address}','${image1}','${image2}','${image3}','${status}',NOW())`;

    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            res.send({
                err: true,
                msg: err
            })
        } else {
            res.send({
                err: false,
                message: "Quection Added",
                uid:uid,
                user_name:user_name
            });
        }
    });
}

module.exports = {
    createQuection,
}