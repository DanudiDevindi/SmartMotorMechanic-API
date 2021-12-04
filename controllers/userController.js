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

const editUserProfile = async (req, res, next) => {
    console.log("with Image")
    const obj = JSON.parse(req.body.date);
    const objL = JSON.parse(req.body.location);
    console.log(objL)
    var userId = req.user_data.uid;
    var latitude;
    var longitude;
    var address;
    var city;

    if (objL !== "") {
        latitude = latitude = objL.region.latitude;
        longitude = longitude = objL.region.longitude;
        address = address = escape(objL.region.address);
        var cityArray = address.split(',');
        city = cityArray[cityArray.length - 2];
    }

    var sql;
    if (objL !== "" && req.files.length > 0) {
        console.log(1111)
        sql = `update user_tbl set name='${obj.username}', contact_no='${obj.contact_no}',position='${obj.position}',
        address='${address}',city='${city}',longitude='${longitude}',latitude='${latitude}',description='${obj.description}',
        image='${req.files[0].originalname}' WHERE uid='${userId}'`;
    } else if (objL === "" && req.files.length > 0) {
        console.log(2222)
        sql = `update user_tbl set name='${obj.username}', contact_no='${obj.contact_no}',position='${obj.position}',
        description='${obj.description}',image='${req.files[0].originalname}' WHERE uid='${userId}'`;
    } else if (objL !== "" && req.files.length <= 0) {
        console.log(33333)
        sql = `update user_tbl set name='${obj.username}', contact_no='${obj.contact_no}',position='${obj.position}',
        address='${address}',city='${city}',longitude='${longitude}',latitude='${latitude}',description='${obj.description}'
        WHERE uid='${userId}'`;
    } else if (objL === "" && req.files.length <= 0) {
        console.log(44444)
        sql = `update user_tbl set name='${obj.username}', contact_no='${obj.contact_no}',position='${obj.position}',
        description='${obj.description}' WHERE uid='${userId}'`;
    }

    mysqlConnection.query(sql, function (err, result) {
        console.log(err)
        if (err) {
            res.send({
                err: true,
                message: "Server Error"
            })
        } else {
            res.send({
                err: false,
                message: "Updated"
            })
        }
    })
}

const editPassword=async(req,res,next)=>{
    console.log(req.body)
    var password = bcrypt.hashSync(req.body.new_password, salt);
    var sql1 = `SELECT * FROM user_tbl WHERE uid='${req.user_data.uid}'`;
    mysqlConnection.query(sql1, (err, rows, fields) => {
        bcrypt.compare(req.body.currentPassword, rows[0].password, function (err, result) {
            if(result){
                var sql = `update user_tbl set password='${password}' WHERE uid='${req.user_data.uid}'`;
                mysqlConnection.query(sql, (err, rows, fields) => {
                    if (err) {
                        res.send({
                            err: true,
                            msg: "Server Error"
                        })
                    } else {
                        res.send({
                            err: false,
                            msg: "Updated Password"
                        })
                    }
                })               
            }else{
                res.send({
                    err: true,
                    msg: "Wrong Current Password"
                }); 
            }
        })     
    })   
}

const login = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username: ' + username)
    console.log("password : " + password)
    var sql = `SELECT * FROM user_tbl WHERE email='${username}'`;
    mysqlConnection.query(sql, (error, rows, fields) => {
        console.log(rows)
        if (rows.length < 1) {
            res.send({
                err: true,
                message: "Auth failed 123"
            })
        } else {
            bcrypt.compare(password, rows[0].password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        err: true,
                        email: rows[0].email,
                        name: rows[0].name,
                        uid: rows[0].uid,
                        active:rows[0].active
                    }, 'secret', { expiresIn: 60 * 60 * 60 });

                    res.cookie('auth', token);
                    res.send({
                        err: false,
                        id: rows[0].id,
                        token: token,
                        message: "Auth successful"
                    });
                } else {
                    res.send({
                        err: true,
                        message: "Wrong Password"
                    });
                }
            });
        }
    });
}

const techDetails = (req, res, next) => {
    var techID = req.params.id;
    var sql = 'SELECT * FROM user_tbl where uid=' + techID;
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows[0]);
        else
            console.log(JSON.stringify(err, undefined, 2))
    });

}

const updateAccountActive = async (req, res, next) => {
    console.log("updateAccountActive")
    console.log(req.params.email)
    var sql = `update user_tbl set active='yes' WHERE email='${req.params.email}'`;
    mysqlConnection.query(sql, function (err, result) {
        console.log(err)
        if (err) {
            res.send({
                err: true,
                message: "Server Error"
            })
        } else {
            res.send({
                err: false,
            })
        }
    })
}

const ResetForgetPassword = (req, res, next) => {
    const passwordWITHhash = bcrypt.hashSync(req.body.password, 10);
    var sql = `update user_tbl set password='${passwordWITHhash}' WHERE email='${req.body.email}'`;
    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            res.send({
                err: true,
                message: "Server error"
            })
        } else {
            res.send({
                err: false,
                message: "reset Sucess"
            })
        }
    })
}

const reset_password = async (req, res, next) => {
    var email = req.params.email;
    var type = req.params, type;
    crypto.randomBytes(4, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const cord = buffer.toString("hex");
        var sql1 = `SELECT * FROM user_tbl WHERE email='${email}'`;
        mysqlConnection.query(sql1, (err, rows, fields) => {
            if (rows.length >= 1) {
                var expireToken = Date.now() + 60 * 60 * 1000;
                var sql = `update user_tbl set resetToken='${cord}', expireToken='${expireToken}' WHERE email='${email}'`;
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        res.send({
                            err: true,
                            message: "Server Error"
                        })
                    } else {
                        var transporter = nodemailer.createTransport({
                            host: 'mail.findcrew.lk',
                            port: 587,
                            auth: {
                                user: 'noreply@findcrew.lk',
                                pass: 'Dilanka@sanjaya1997'
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });
                        var mailOptions;
                        mailOptions = {
                            from: 'noreply@findcrew.lk',
                            to: email, // list of receivers
                            subject: cord + ' is your Findcrew account recovery Code', // Subject line                            
                            html: '<body><p> Hi ' + email + '</p><p>We received a request to reset your Findcrew password.<br>Enter the following password reset code<p><h1>' + cord + '</h1></body>'
                        };
                        // if(type==="forgot"){
                        //     mailOptions = {
                        //         from: 'degili@omicolombo.lk',
                        //         to: email, // list of receivers
                        //         subject: cord +' is your Dagili account recovery Code', // Subject line                            
                        //         html:'<body><p> Hi '+email+'</p><p>We received a request to reset your Dagili password.<br>Enter the following password reset code<p><h1>'+cord+'</h1></body>'
                        //     };
                        // }else{
                        //     mailOptions = {
                        //         from: 'degili@omicolombo.lk', // sender address
                        //         to: email, // list of receivers
                        //         subject: cord +' is your Dagili App confirmation code', // Subject line                            
                        //         html:'<body><p> Hi '+email+'</p><p>You recently registered for Dagili App. To complete your Dagili app registration, please confirm your account with below code.<p><h1>'+cord+'</h1></body>'
                        //     };
                        // }


                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                res.json({
                                    err: true,
                                    message: "Email not valid",
                                    cord: cord
                                })
                            } else {
                                // res.json({yo: info.response});
                                res.json({
                                    err: false,
                                    message: "Please check email",
                                    cord: cord
                                })
                            };
                        });
                    }
                })

            } else {
                return res.json({
                    err: true,
                    message: "User do not exists with this email"
                });
            }
        })
    })
}

const send_email = (req, res, next) => {
    console.log("send")
    var data=req.body;
    console.log(data)
    var transporter = nodemailer.createTransport({
        host: 'mail.findcrew.lk',
        port: 25,
        auth: {
            user: 'noreply@findcrew.lk',
            pass: 'Dilanka@sanjaya1997'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'noreply@findcrew.lk', // sender address
        to: data.email, // list of receivers
        subject: data.cord + ' is your Findcrew App confirmation code', // Subject line                            
        html: '<body><p> Hi ' + data.name + '</p><p>You recently registered for Findcrew App. To complete your Findcrew app registration, please confirm your account with below code.<p><h1>' + req.body.cord + '</h1></body>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        console.log("user_register5")
        console.log(error)
        console.log(info)
        if (error) {
            // res.json({yo: 'error'});
            res.json({
                err: true,
                message: "Email not valid",
            })
        } else {
            // res.json({yo: info.response});
            res.json({
                err: false,
                message: "Great! Account Created. Please check email to get verification code",
                cord: req.body.cord
            })
        };
    });
}

const allUsersWithUserDetails=(req,res,next)=>{
    var userId = req.user_data.uid;
    var sql = 'SELECT * FROM user_tbl';
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err)
            res.send({
                err:false,
                users:rows,
                uid:req.user_data.uid
            });
        else
            console.log(JSON.stringify(err, undefined, 2))
    });
}

module.exports = {
    user_register,
    getUserProfile,
    login,
    techDetails,
    updateAccountActive,
    ResetForgetPassword,
    reset_password,
    editUserProfile,
    send_email,
    editPassword,
    allUsersWithUserDetails
}