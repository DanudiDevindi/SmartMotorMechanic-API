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
const serviceTypesView = (req, res, next) => {
    var sql = "SELECT * FROM service_type"
    mysqlConnection.query(sql, function (err1, result) {
        res.render('service_types', {
            title: "All Service Types",
            service_types: result,
            message:''
            // message:req.flash('message')
        })
    });
}
const addService = (req, res, next) => {
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
    var user = req.body.user;
    var cat = req.body.category;

    var uid = parseInt(user.split("-")[0]);
    var user_name = user.split("-")[1];
    var cat_id = parseInt(cat.split("-")[0]);
    var category = cat.split("-")[1];
    var title = req.body.title;
    var description = req.body.description;
    var service_type = req.body.service_type;
    var price = req.body.price;
    var status = "create";
    var latitude = 10;
    var longitude = 12;
    var createAt = new Date();
    var isPaid = false;
    var isApproved = false;
    var image = req.files[0].originalname;
    console.log(image)

    var sql = `INSERT INTO service(uid,user_name,cat_id,category,title,description,service_type,price,image,longitude,latitude,createAt,status,isPaid,isApproved) VALUES
    ('${uid}','${user_name}','${cat_id}','${category}','${title}','${description}','${service_type}','${price}','${image}','${longitude}','${latitude}','${createAt}','${status}','${isPaid}','${isApproved}')`;

    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            setTimeout(function () {
                res.render('addService', {
                    title: 'Add Service',
                    msg: 'Please try again',
                    err: true,
                    users: users,
                    categories: categories
                })
            }, 100);
        } else {
            setTimeout(function () {
                res.render('addService', {
                    title: 'Add Service',
                    msg: 'Added service sucess',
                    err: false,
                    users: users,
                    categories: categories
                })
            }, 100);
        }
    });
}

module.exports = {
    addServiceView,
    addServiceTypeView,
    allserviceView,
    serviceTypesView,
    addService,

}
