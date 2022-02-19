const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');

const getCoupon = (req, res, next) => {
    var uid = req.user_data.uid;
    var cord = req.params.cord;
    
    
    var sql_coupon = "SELECT * FROM coupon where cord=" + cord
    mysqlConnection.query(sql_coupon, function (err, result_coupon) {
        if (err) {
            res.send({
                err: true,
                message: "Server Error"
            });
        } else {
           
            //coupon cord valid or not
            if (result_coupon.length >= 1) {
               //check coupon cord expired or not
                if (result_coupon[0].isExpired === "no") { 
                    var sql_user_coupon="SELECT * FROM user_coupon where uid="+uid+" and coupon_id="+result_coupon[0].coupon_id                  
                    mysqlConnection.query(sql_user_coupon, function (err1, result_user_coupon) {
                       if (err1) {
                            res.send({
                                err: true,
                                message: "Server Error"
                            });
                        } else {
                             //check user already take coupon or not
                            if (result_user_coupon.length >= 1) {
                                res.send({
                                    err: true,
                                    message: "Sorry You already use this coupon",
                                });
                            } else {
                                res.send({
                                    err: false,
                                    message: "",
                                    coupon: result_coupon[0].cord,
                                    discount: result_coupon[0].discount,
                                    discount_type:result_coupon[0].discount_type
                                });
                            }
                        }
                    })

                } else if (result_coupon[0].isExpired === "yes"){
                    res.send({
                        err: true,
                        message: "Sorry, Coupon Cord is Expired",
                    });
                }
            } else {
               res.send({
                    err: true,
                    message: "Sorry, Coupon Cord invalid",
                });
            }
        }

    })




}


module.exports = {
    getCoupon
}