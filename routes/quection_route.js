const express =require('express');
const checkAuth=require('../middleware/check_auth');
const multer=require('multer');
const {allquectionView,deleteQuection,blockQuection,approveQuection,addQuectionView,addQuection,quectionView,answeredView}=require("../controllers/admin/quectionController");
const {createQuection,allQuections,addAnswer,user_posts,edit_post,allAnswers,deleteUserPost}=require("../controllers/quectionController");
const router = express.Router();

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

router.get('/admin/quections', allquectionView);

router.get('/admin/addQuectionView',addQuectionView);

router.post('/admin/addQuection',upload.any(),addQuection);

module.exports={
    routes:router
}