const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');
var paypal = require('paypal-rest-sdk');

paypal.configure({
    // for paypal 
});
const getPaymnetDuration = (req, res, next) => {
    var duration = req.params.duration;    
    var sql_payment = "SELECT * FROM payment where no_of_months=" + duration
    mysqlConnection.query(sql_payment, function (err, result_payment) {
        console.log(2509)
        console.log(result_payment)
        if (err) {
            console.log(30000)
            console.log(err)
            res.send({
                err: true,
                message: "Server Error"
            });
        } else {
            if(result_payment.length>=1){
                res.send({
                    err: false,
                    message: "",
                    amount:result_payment[0].amount,
                    payment_id:result_payment[0].payment_id               
                });
            }else{
                res.send({
                    err: true,
                    message: "Not Available this month duration. Select another one",              
                }); 
            }
            
        }

    })
}

const createUserPayment=(req,res,next)=>{
    const obj=JSON.parse(req.body.data);
    console.log(obj)
    var createAt=obj.createAt;
    var paidAmount=250
    var sql=`INSERT INTO user_payment(uid,payment_id,payment_method,paid_amount,paidFrom,paidTo,isPaid,isExpired,createAt) VALUES
    ('${req.user_data.uid}','${obj.payment_id}','${obj.payment_method}','${paidAmount}',now(),now(),'no','no',now())`;

    mysqlConnection.query(sql, function (err, result) {
        console.log(err)
        if(err){
            res.send({
                err:true,
                msg:"server Error"
            })
        }else{
            res.send({
                err:false,
                msg:"Please settle payment"
            })
        }
    })
}

const getPayPal=(req,res,next)=>{
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: "1.00",
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: "1.00"
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
    
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });

}
const testing=(req,res,next)=>{
    res.render("testing");
}
module.exports = {
    getPaymnetDuration,
    createUserPayment,
    testing,
    getPayPal,

}