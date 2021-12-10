const mysqlConnection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check_auth');
var bcrypt = require('bcrypt');
const multer = require('multer');
const flash = require('express-flash');

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

const addServiceView = (req, res, next) => {
    var users;
    var categories;
    var sql_user = "SELECT * FROM user_tbl";
    mysqlConnection.query(sql_user, function (err1, result) {
        users = result
    });
    var sql_cat = "SELECT * FROM category";
    mysqlConnection.query(sql_cat, function (err1, result) {
        categories = result
    });

    setTimeout(function () {
        res.render('addService', {
            title: 'Add Service',
            msg: '',
            err: false,
            users: users,
            categories: categories
        })
    }, 100);
}
const addServiceTypeView = (req, res, next) => {
    res.render('addServiceType', {
        title: 'Add Service Type',
        msg: '',
        err: false,
    
    })
}

const allserviceView = (req, res, next) => {
    var sql = "SELECT * FROM service"
    mysqlConnection.query(sql, function (err1, result) {
        res.render('services', {
            title: "All Services",
            services: result
        })
    });
}
module.exports = {
    addServiceView,
    addServiceTypeView,
    allserviceView,

}
