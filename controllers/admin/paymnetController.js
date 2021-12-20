const mysqlConnection = require('../../config/dbConfig');

const addPaymnetDuration = (req, res, next) => {
    console.log("addPaymentDuration1")
    console.log(req.body.no_of_months)
    var sql_paymnet = "SELECT * FROM payment where no_of_months="+req.body.no_of_months;
    mysqlConnection.query(sql_paymnet, function (err1, result_payment) {
        console.log("addPaymentDuration2")
        console.log(err1)
        if (result_payment.length >= 1) {
            console.log("addPaymentDuration3")
            res.render('addPayment', {
                title: 'Add Payment',
                msg: 'Sorry selected month duration amount already exists',
                err: true,
            })
        }else{
            console.log("addPaymentDuration4")
            var sql = `INSERT INTO payment(no_of_months,amount) VALUES ('${req.body.no_of_months}','${req.body.amount}')`;
            mysqlConnection.query(sql, function (err, result) {
                console.log("addPaymentDuration5")
                console.log(err)
                if (err) {
                    res.render('addPayment', {
                        title: 'Add Payment',
                        msg: 'Server Error',
                        err: true,
                    })
                } else {
                    res.render('addPayment', {
                        title: 'Add Payment',
                        msg: 'Payment Duration added sucess',
                        err: false,
                    })
                }
            })
        }
    })

}
const paymnetDurationView = (req, res, next) => {
    console.log("oaymentDurationView1")
    var sql = "SELECT * FROM payment"
    mysqlConnection.query(sql, function (err1, result) {
        console.log("oaymentDurationView2")
        console.log(err1)
        console.log(result)
        res.render('payments', {
            title: "All Payment Duration",
            paymnets: result,
            message:''
            
        })
    });
}

module.exports = {
    addPaymnetDuration,
    paymnetDurationView,
}