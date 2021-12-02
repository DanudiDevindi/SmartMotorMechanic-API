const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync();
const multer = require('multer');
var escape = require('sql-escape');
var crypto = require('crypto')
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage,
    limit: {
        filesize: 1024 * 1024 * 5
    }
});

const user_register = (req, res, next) => {
    console.log("user_register1")
    const now1 = moment().tz("Asia/Colombo").format();
    console.log(now1)

    var password = bcrypt.hashSync(req.body.password, salt);
    var username = escape(req.body.username);
    var email = req.body.email;
    console.log(email)
    var contact_no = req.body.contact_no;
    var status = "create";
    var active = 'no'
    var longitude = 80.77;
    var latitude = 6.97;
    var cord;

    crypto.randomBytes(4,(err,buffer)=>{
        cord=buffer.toString("hex");
    })

    var sql1 = `SELECT * FROM user_tbl WHERE email='${email}'`;
    mysqlConnection.query(sql1, (err, rows, fields) => {
        console.log("user_register2")

        console.log(err)
        console.log(rows)
        if (rows.length >= 1) {
            res.send({
                err: true,
                msg: "Email address already exit"
            })
        } else {
            console.log("user_register3")
            var sql = `INSERT INTO user_tbl(name,email,password,image,contact_no,position,longitude,latitude,address,city,description,resetToken,expireToken,status,active,createAt) VALUES
            ('${username}','${email}','${password}','emptyUser.jpg','${contact_no}','','${longitude}','${latitude}','','','','${cord}','','${status}','${active}',now())`;

            mysqlConnection.query(sql, function (err, result) {
                console.log("user_register4")
                console.log(err)
                if (err) {
                    res.send({
                        err: true,
                        msg: "Connection Error. Please try again"
                    })
                } else {
                    // res.json({yo: info.response});
                    res.json({
                        err: false,
                        message: "Great! Account Created. Please check email to get verification code",
                        cord: cord
                    })
                };
            });
        }
    });

}

const getUserProfile = async (req, res, next) => {
    var userId = req.user_data.uid;
    var sql = 'SELECT * FROM user_tbl where uid=' + userId;
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows[0]);
        else
            console.log(JSON.stringify(err, undefined, 2))
    });
}

