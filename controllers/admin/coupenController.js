const flash = require('express-flash');
const mysqlConnection = require('../../config/dbConfig');

const addCoupon = (req, res, next) => {
    console.log("addCoupon1")   

    //check if coupon cord exist or not
    var sql_c = `SELECT * FROM coupon where cord='${req.body.cord}'`;
    //get category for selector
    var sql_cat = "SELECT * FROM category";
    mysqlConnection.query(sql_cat, function (err1, result_cat) { 
        
        mysqlConnection.query(sql_c, function (err2, result_coupon) {
            if(result_coupon.length>=1){
                res.render('addCoupon', {
                    title: 'Add Coupon',
                    msg: 'Sorry Cord already exist. Enter new one',
                    err: true,
                    categories:result_cat
                })
            }else{
                console.log("addCoupon4"); 
                console.log(req.body.cord)             

                var sql = `INSERT INTO coupon(cord,cat_id,discount_type,discount,fromDate,toDate,isExpired,createAt) VALUES
                ('${req.body.cord}','${req.body.category}','${req.body.discount_type}','${req.body.amount}','${req.body.fromDate}','${req.body.toDate}',"no",NOW())`;
    
                mysqlConnection.query(sql, function (err3, result) {
                    console.log("addCoupon5"); 
                    console.log(err3)
                    if (err3) {
                        res.render('addCoupon', {
                            title: 'Add Coupon',
                            msg: 'Server Error',
                            err: true,
                            categories:result_cat
                        })
                    } else {
                        res.render('addCoupon', {
                            title: 'Add Coupon',
                            msg: 'Add Coupon Successfully',
                            err: false,
                            categories:result_cat
                        })
                    }
    
                })
                
            }
        })
    

    })  

}

const couponsView = (req, res, next) => {
    console.log("couponView1")
    var sql = "SELECT * from coupon"
    mysqlConnection.query(sql, function (err1, result) {
        console.log("couponView2")
        console.log(err1)
        console.log(result)
        // res.render('login', { message : req.flash('msg') });
        res.render('coupons', {
            title: "All Coupons",
            coupons: result,
            message:''
            // message:req.flash('message')
        })
    });
}

const addCouponView = (req, res, next) => {
    console.log("addCouponView1")
    var sql_cat = "SELECT * FROM category";
    mysqlConnection.query(sql_cat, function (err1, result) {
        console.log("addCouponView2")
        console.log(err1)
        res.render('addCoupon', {
            title: 'Add Coupon',
            msg: '',
            err: false,
            categories: result
        })
    });
}

module.exports = {
    addCoupon,
    couponsView,
    addCouponView,
}