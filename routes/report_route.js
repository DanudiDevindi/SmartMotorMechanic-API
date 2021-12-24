const express =require('express');
const checkAuth=require('../middleware/check_auth');
const {usersReport,categoriesReport,serviceReport,quectionReport,reportView}=require("../controllers/admin/reportController");
const router = express.Router();

router.get('/admin/report/user', usersReport);

router.get('/admin/report/category', categoriesReport);

router.get('/admin/report/service', serviceReport);

router.get('/admin/report/quection', quectionReport);

router.get('/admin/reports',reportView);

module.exports={
    routes:router
}