const express =require('express');
const checkAuth=require('../middleware/check_auth');
const {user_register,getUserProfile,editUserProfile,login,techDetails, updateAccountActive,reset_password,ResetForgetPassword,send_email,editPassword,allUsersWithUserDetails}=require("../controllers/userController");
const {usersView,deleteUser,blockUser,viewUser,adminSignout,userCouponList,userPaymentList}=require("../controllers/admin/userController");
const multer=require('multer');
const router = express.Router();


const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    } ,
    filename: function (req,file,cb) {
        cb(null, file.originalname)
    }
});
console.log(storage)
const upload=multer({
    storage: storage,
    limit:{
        filesize: 1024*1024*5
    }
});

router.get('/admin/users',usersView);

router.get('/admin/user/delete/:uid',deleteUser);

router.get('/admin/viewuser/:uid',viewUser);

router.get('/admin/user/block/:uid/:active',blockUser);

router.get('/admin/user/paymentList/:uid/:name',userPaymentList);

router.get('/admin/user/couponList/:uid/:name',userCouponList);

router.post('/user-register',user_register);

router.get('/admin/adminSignout',adminSignout)

router.get('/reset/:email/:type',reset_password);

router.post('/resetForgetPassword',ResetForgetPassword);

router.get('/user_details',checkAuth, getUserProfile);

router.post('/edit_user',upload.any(),checkAuth,editUserProfile);

router.post('/edit_password',checkAuth,editPassword);

router.post('/user_login',login);

router.get('/techDetails/:id',checkAuth,techDetails);

router.put('/updateActive/:email',updateAccountActive);

router.post  ('/send_email',checkAuth, send_email);

router.get('/allUsersWithUserDetails',checkAuth,allUsersWithUserDetails)


module.exports={
    routes:router
}