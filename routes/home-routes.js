const express =require('express');

const {indexView,viewHome,adminLoginView, adminLogin}=require("../controllers/homeController");

const router = express.Router();

router.get('/',indexView);

router.get('/home',viewHome);

router.post('/login',adminLogin);

module.exports={
    routes:router
}