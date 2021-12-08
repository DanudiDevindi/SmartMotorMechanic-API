const mysqlConnection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check_auth');
var bcrypt = require('bcrypt');

// Admin APIs
const categoryView = (req, res, next) => {
    console.log("categoryView1")
    var sql = "SELECT * FROM category"
    mysqlConnection.query(sql, function (err1, result) {
        console.log("categoryView2")
        console.log(err1)
        console.log(result)
        // req.flash('notify', 'This is a test notification.')
        res.render('categories', {
            title: "All Categories",
            categories: result,
            message:req.flash('notify', 'This is a test notification.')
        })
    });

}