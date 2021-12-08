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
const addCatView = (req, res, next) => {
    console.log("addCatView1")
    res.render('addCategory', {
        title: 'Add Category',
        msg: '',
        err: false
    })
}

const addCategory = (req, res, next) => {
    console.log("addCategory1")
    var sqlAll = `SELECT * FROM category WHERE name='${req.body.name}'`;
    mysqlConnection.query(sqlAll, function (err1, result) {
        console.log("addCategory2")
        console.log(err1)
        console.log(result)
        if (result.length >= 1) {
            console.log("addCategory3")
            res.render('addCategory', {
                title: "Add Category",
                err: true,
                msg: req.body.name + " alredy exist. Please try new category"
            })
        } else {
            console.log("addCategory4")
            var sql = `INSERT INTO category(name,image,status,createAt) VALUES
    ('${req.body.name}','${req.files[0].originalname}','${false}',NOW())`;

            mysqlConnection.query(sql, function (err, result) {
                console.log("addCategory4")
                console.log(result)
                console.log(err)
                if (err) {
                    res.render('addCategory', {
                        title: "Add Category",
                        err: true,
                        msg: "Please try again"
                    })
                } else {
                    res.render('addCategory', {
                        title: "Add Category",
                        err: false,
                        msg: "Added category sucess"
                    })
                }
            })
        }
    })
}

const delete_category = (req, res, next) => {
    console.log("delete_category1")
    const cat_id = req.params.cat_id;
    var sql = `DELETE FROM category WHERE cat_id='${cat_id}'`;
    mysqlConnection.query(sql, function (err, result1) {
        if(err) throw err;
        req.flash('notify', 'Redirect successful!')
        res.redirect('/admin/categories');
    })
}

const viewCategory=(req,res,next)=>{
    const id = req.params.id;
    var sql = "SELECT * FROM category where cat_id=" + id;
    mysqlConnection.query(sql, function (err1, result) {
        console.log(result)
        res.render('viewCategory', {
            title: "View Category",
            category: result[0],
            err: '',
            msg: ''
        })
    });
}

module.exports = {
    categoryView,
    addCatView,
    addCategory,
    delete_category,
    viewCategory
}
