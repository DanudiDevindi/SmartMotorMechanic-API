const mysqlConnection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check_auth');
var bcrypt = require('bcrypt');

// Admin APIs
const categoryView = (req, res, next) => {
   
    var sql = "SELECT * FROM category"
    mysqlConnection.query(sql, function (err1, result) {
      
        // req.flash('notify', 'This is a test notification.')
        res.render('categories', {
            title: "All Categories",
            categories: result,
            message:req.flash('notify', 'This is a test notification.')
        })
    });

}
const addCatView = (req, res, next) => {
   
    res.render('addCategory', {
        title: 'Add Category',
        msg: '',
        err: false
    })
}

const addCategory = (req, res, next) => {
    
    var sqlAll = `SELECT * FROM category WHERE name='${req.body.name}'`;
    mysqlConnection.query(sqlAll, function (err1, result) {
       
        if (result.length >= 1) {
            
            res.render('addCategory', {
                title: "Add Category",
                err: true,
                msg: req.body.name + " alredy exist. Please try new category"
            })
        } else {
            
            var sql = `INSERT INTO category(name,image,status,createAt) VALUES
    ('${req.body.name}','${req.files[0].originalname}','${false}',NOW())`;

            mysqlConnection.query(sql, function (err, result) {
               
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
