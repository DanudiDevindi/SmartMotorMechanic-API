const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');

const getCoupon = (req, res, next) => {
    var uid = req.user_data.uid;
    var cord = req.params.cord;
    console.log(1)
    console.log(cord)
    
    var sql_coupon = "SELECT * FROM coupon where cord=" + cord
    mysqlConnection.query(sql_coupon, function (err, result_coupon) {
        console.log(2)
        console.log(result_coupon)
        if (err) {
            console.log(3)
            console.log(err)
            res.send({
                err: true,
                message: "Server Error"
            });
        } else {
            console.log(3)
            //coupon cord valid or not
            if (result_coupon.length >= 1) {
                console.log(4)
                //check coupon cord expired or not
                console.log(result_coupon[0].isExpired)
                if (result_coupon[0].isExpired === "no") { 
                    var sql_user_coupon="SELECT * FROM user_coupon where uid="+uid+" and coupon_id="+result_coupon[0].coupon_id                  
                    mysqlConnection.query(sql_user_coupon, function (err1, result_user_coupon) {
                        console.log(5)
                        console.log(result_user_coupon)
                        if (err1) {
                            console.log(6)
                            console.log(err1)
                            res.send({
                                err: true,
                                message: "Server Error"
                            });
                        } else {
                            console.log(7)
                             //check user already take coupon or not
                            if (result_user_coupon.length >= 1) {
                                console.log(8)
                                res.send({
                                    err: true,
                                    message: "Sorry You already use this coupon",
                                });
                            } else {
                                console.log(9)
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
                console.log(10)
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