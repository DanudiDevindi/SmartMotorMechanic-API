const express =require('express');
const {couponsView,deleteCoupon,addCouponView,addCoupon,viewCoupon,editCoupon}=require("../controllers/admin/coupenController");
const {getCoupon}=require("../controllers/couponController");
const router = express.Router();
const checkAuth=require('../middleware/check_auth');

router.post('/admin/addCoupon',addCoupon);

router.get('/admin/coupons', couponsView);


module.exports={
    routes:router
}