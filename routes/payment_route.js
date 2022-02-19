const express =require('express');
const multer=require('multer');
const {paymnetDurationView,addPaymnetDurationView,addPaymnetDuration,deletePaymnetDuration,viewPaymentDuration,editPaymentDuration}=require("../controllers/admin/paymnetController");
const {getPaymnetDuration,createUserPayment,getPayPal,testing}=require("../controllers/paymentController");
const router = express.Router();
const checkAuth=require('../middleware/check_auth');


const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    } ,
    filename: function (req,file,cb) {
        cb(null, file.originalname)
    }
});
const upload=multer({
    storage: storage,
    limit:{
        filesize: 1024*1024*5
    }
});

router.get('/admin/paymnetDuration', paymnetDurationView);

router.get('/admin/addPaymnetDurationView',addPaymnetDurationView);

router.post('/admin/addPaymnetDuration',addPaymnetDuration);

router.get('/admin/paymnetDurationView/:id',viewPaymentDuration);

router.post('/admin/editPaymentDuration/:id',editPaymentDuration)

router.get('/admin/paymnetDuration/delete/:id',deletePaymnetDuration);

router.get('/getAmountAsDuration/:duration',checkAuth,getPaymnetDuration);

router.post('/createUserPayment',upload.any(),checkAuth,createUserPayment);

router.get('/paypal',getPayPal);

router.get('/test',checkAuth,testing);

module.exports={
    routes:router
}