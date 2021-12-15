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

router.get('/admin/services', allserviceView);

router.get('/admin/addServiceView',addServiceView);

router.post('/admin/addService',upload.any(),addService);

router.get('/admin/serviceView/:id',serviceView);

router.get('/admin/serviceTypeView/:id',viewServiceType);

router.post('/admin/editServiceType/:id',editServiceType)

router.get('/admin/service/delete/:service_id',deleteService);

router.get('/admin/service/block/:service_id/:status',blockService);

router.get('/admin/service/approve/:service_id/:approve',approveService);


//service type
router.get('/admin/service_types',serviceTypesView);

router.get('/admin/addServiceTypeView',addServiceTypeView);

router.post('/admin/addService_type',addServiceType);

router.get('/admin/service_type/delete/:service_type_id',deleteServiceType);


// user services 
router.post('/createService',upload.any(),checkAuth,createService);

router.get('/user_service',checkAuth,userServices);

router.post('/edit_service',upload.any(),checkAuth,editService);


module.exports={
    routes:router
}
