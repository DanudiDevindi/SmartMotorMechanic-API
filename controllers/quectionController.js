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

const time_calculate = (firstTime) => {
    var secondTime = Date.now();
    var diff = moment.duration(moment(secondTime).diff(moment(firstTime)));
    var years = moment().diff(firstTime, 'years')
    var days = parseInt(diff.asDays());
    var hours = parseInt(diff.asHours());
    hours = hours - days * 24;
    var minutes = parseInt(diff.asMinutes());
    minutes = minutes - (days * 24 * 60 + hours * 60)
    var testing_time = '';
    if (years > 0) {
        testing_time = years + ' years ago'
    }
    else if (days > 0) {
        testing_time = days + ' days ago'
    } else if (hours > 0) {
        testing_time = hours + ' hours ago'
    } else if (minutes > 0) {
        testing_time = minutes + ' minutes ago'
    } else {
        testing_time = 'Just now'
    }
    return testing_time;

}
const allQuections = async (req, res, next) => {
    console.log(852)
    var postData = [];
    // var sql="SELECT * FROM quection LEFT JOIN answer ON answer.qid=quection.qid ORDER BY quection.createAt DESC"
    var sql = "SELECT q.qid,u.name,u.contact_no,q.category,q.title,q.quection,q.longitude,q.latitude,q.address,q.image,q.image2,q.image3,q.createAt FROM quection as q INNER JOIN user_tbl as u ON q.uid=u.uid ORDER BY q.createAt DESC";
    mysqlConnection.query(sql, function (err1, results) {
        console.log(err1)
        console.log(852)
        console.log(results)

        results.forEach(async (result) => {
             await postData.push({
                 timeDiff:time_calculate(result.createAt),
                 quec:result
             })
        })
        console.log(postData)
        return res.status(200).json(postData);
    });

}

module.exports = {
    createQuection,
    time_calculate,
    allQuections,
}