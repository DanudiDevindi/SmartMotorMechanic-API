const express =require('express');
const {couponsView,deleteCoupon,addCouponView,addCoupon,viewCoupon,editCoupon}=require("../controllers/admin/coupenController");
const {getCoupon}=require("../controllers/couponController");
const router = express.Router();
const checkAuth=require('../middleware/check_auth');

router.post('/admin/addCoupon',addCoupon);

router.get('/admin/coupons', couponsView);

router.get('/admin/addCouponView',addCouponView);

router.get('/admin/coupon/delete/:id',deleteCoupon);

router.get('/admin/couponView/:id',viewCoupon);

router.post('/admin/editCoupon/:id',editCoupon);

router.get('/getCoupon/:cord',getCoupon);



module.exports={
    routes:router
}