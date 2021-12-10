const express =require('express');
const checkAuth=require('../middleware/check_auth');
const multer=require('multer');
const {allserviceView,serviceTypesView,deleteService,blockService,approveService,addServiceView,addServiceType,addService,addServiceTypeView,deleteServiceType,serviceView,viewServiceType,editServiceType}=require("../controllers/admin/serviceController");
const {createService,editService,userServices,deleteUserService,allServices,allServicesWithPagination,allServicesWithFilter,allService_types,createServiceRate,getRateSummery,getServiceRate}=require("../controllers/serviceController");
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

// admin services

router.get('/admin/addServiceView',addServiceView);
router.get('/admin/services', allserviceView);
router.post('/admin/addService',upload.any(),addService);


//service type
router.get('/admin/addServiceTypeView',addServiceTypeView);
router.get('/admin/service_types',serviceTypesView);


module.exports={
    routes:router
}
