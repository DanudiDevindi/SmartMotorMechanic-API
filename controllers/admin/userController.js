const mysqlConnection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check_auth');
var bcrypt = require('bcrypt');
const multer = require('multer');

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

const usersView = (req, res, next) => {
    var sql = "SELECT * FROM user_tbl"
    mysqlConnection.query(sql, function (err1, result) {
        res.render('users', {
            title: "All Users",
            users: result,
            msg: ''
        })
    });
}

const blockUser = (req, res, next) => {
    const uid = req.params.uid;
    const active = req.params.active;
    var activeUser;
    var message;
    if (active === "yes") {
        activeUser = "no"
        message = "UnBlocked User"
    } else {
        activeUser = "yes"
        message = "Blocked User"
    }
    var sql = "SELECT * FROM user_tbl where uid="+uid
    mysqlConnection.query(sql, function (err1, result) {
        var sql = `update user_tbl set active='${activeUser}' WHERE uid='${uid}'`;
        mysqlConnection.query(sql, function (err, result1) {
            if (err) {
                res.render('viewUser', {
                    title: "View User",
                    user: result[0],
                    err: true,
                    msg: 'SerVer Error'
                })
            } else {
                res.render('viewUser', {
                    title: "View User",
                    user: result[0],
                    err: false,
                    msg: message
                })
            }
        })
    })
}

const deleteUser = (req, res, next) => {
    const uid = req.params.uid;
    var sql = `DELETE FROM user_tbl WHERE uid='${uid}'`;
    mysqlConnection.query(sql, function (err, result1) {
        if (err) throw err;
        res.redirect('/admin/users');
    });
}

const viewUser = (req, res, next) => {
    const uid = req.params.uid;
    var sql = "SELECT * FROM user_tbl where uid=" + uid;
    mysqlConnection.query(sql, function (err1, result) {
       
        res.render('viewUser', {
            title: "View User",
            user: result[0],
            err: '',
            msg: ''
        })
    });
}

const adminSignout=(req,res,next)=>{
    res.redirect('/');
}

const userPaymentList=(req,res,next)=>{
    var uid=req.params.uid;
    var sql = "SELECT * FROM user_payment where uid=" + uid;
    mysqlConnection.query(sql, function (err1, result) {
       
        res.render('user_payment_list', {
            title: "View All "+req.params.name+" Payment List",
            userPayments: result,
            err: '',
            msg: '',
        })
    });
}

const userCouponList=(req,res,next)=>{
    var uid=req.params.uid;
    var sql = "SELECT * FROM user_coupon where uid=" + uid;
    mysqlConnection.query(sql, function (err1, result) {
        
        res.render('user_coupon_list', {
            title: "View All "+req.params.name+" Coupon List",
            userCoupons: result,
            err: '',
            msg: '',
        })
    });
}

module.exports = {
    usersView,
    blockUser,
    deleteUser,
    viewUser,
    adminSignout,
    userCouponList,
    userPaymentList
}