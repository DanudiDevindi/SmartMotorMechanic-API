const express =require('express');
const checkAuth=require('../middleware/check_auth');
const {allCate,AllCategoryWithCount}=require("../controllers/categoryController");
const {categoryView,addCatView,addCategory,delete_category,viewCategory}=require("../controllers/admin/categoryController");
const router = express.Router();
const multer=require('multer');

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

router.get('/admin/categories',categoryView);

router.get('/admin/addCatView',addCatView);

router.get('/admin/categoryView/:id',viewCategory)

router.post('/admin/addCategory',upload.any(), addCategory);

router.get('/admin/category/delete/:cat_id',delete_category);

router.get('/AllCategory',checkAuth,allCate);

router.get('/AllCategoryWithCount',checkAuth,AllCategoryWithCount)

module.exports={
    routes:router
}