const express =require('express');
const checkAuth=require('../middleware/check_auth');
const {usersReport,categoriesReport,serviceReport,quectionReport,reportView}=require("../controllers/admin/reportController");
const router = express.Router();

router.get('/admin/report/user', usersReport);

module.exports={
    routes:router
}