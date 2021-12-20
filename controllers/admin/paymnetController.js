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

const addPaymnetDurationView = (req, res, next) => {
    console.log("addPaymentDurationView1")
    var sql_cat = "SELECT * FROM payment";
    mysqlConnection.query(sql_cat, function (err1, result) {
        console.log("addPaymentDurationView2")
        console.log(err1)
        res.render('addPayment', {
            title: 'Add Payment Duration',
            msg: '',
            err: false,
            paymnets: result
        })
    });
}
const deletePaymnetDuration = (req, res, next) => {
    const id = req.params.id;
    console.log(id)
        var sql = `DELETE FROM payment WHERE payment_id='${id}'`;
    mysqlConnection.query(sql, function (err, result) {
        if(err) throw err;
        res.redirect('/admin/paymnetDuration');
    })
    
}
const viewPaymentDuration=(req,res,next)=>{
    const id = req.params.id;
    var sql = "SELECT * FROM payment where payment_id=" + id;
    mysqlConnection.query(sql, function (err1, result) {
        console.log(result)
        res.render('viewPaymentDuration', {
            title: "View Paymnet Duration",
            payment: result[0],
            msg: '',
            err:true
        })
    });
    
}
const editPaymentDuration=(req,res,next)=>{
    console.log(req.params.id)
    var sql = `SELECT * FROM payment where payment_id='${req.params.id}'`;
    mysqlConnection.query(sql, function (err, result) {
        var sql = `update payment set amount='${req.body.amount}' WHERE payment_id='${req.params.id}'`;
        mysqlConnection.query(sql, function (err1, result1) {
            if(err1){
                res.render('viewPaymentDuration', {
                    title: "View Paymnet Duration",
                    payment: result[0],
                    msg: 'Service Error..Try Again',
                    err: true,
                })
            }else{
                res.render('viewPaymentDuration', {
                    title: "View Paymnet Duration",
                    payment: result[0],
                    msg: 'Update Sucessfully',
                    err: false,
                })
            }
        })
    })    

}

module.exports = {
    addPaymnetDuration,
    paymnetDurationView,
    addPaymnetDurationView,
    deletePaymnetDuration,
    viewPaymentDuration,
    editPaymentDuration
}