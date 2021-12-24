const mysqlConnection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const checkAuth=require('../../middleware/check_auth');
var bcrypt=require('bcrypt');
var excel=require('exceljs');

const usersReport=(req,res,next)=>{
    let workbook = new excel.Workbook();
    var sql = "SELECT * FROM user_tbl"
    mysqlConnection.query(sql, function (err1, result) {               
	    let userWorkSheet = workbook.addWorksheet('Users'); 
        userWorkSheet.columns = [
            { header: 'Id', key: 'uid', width: 10},
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30},
            { header: 'Contact No', key: 'contact_no', width: 20, outlineLevel: 1},
            { header: 'Position', key: 'position', width: 40, outlineLevel: 1},
            { header: 'Address', key: 'address', width: 50, outlineLevel: 1},
            { header: 'Description', key: 'description', width: 70, outlineLevel: 1}
        ];
        userWorkSheet.addRows(result); 

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'users.xlsx');
        
        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        })
    });     
}

const categoriesReport=(req,res,next)=>{
    let workbook = new excel.Workbook();
    var sql = "SELECT * FROM category"
    mysqlConnection.query(sql, function (err1, result) { 
	    let worksheet = workbook.addWorksheet('Category');
        worksheet.columns = [
            { header: 'Id', key: 'cat_id', width: 10},
            { header: 'Name', key: 'name', width: 20 }
        ];
        worksheet.addRows(result);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'categories.xlsx');
        
        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        }) 
    });
}
const serviceReport=(req,res,next)=>{
    let workbook = new excel.Workbook();
    var sql = "SELECT * FROM service"
    mysqlConnection.query(sql, function (err1, result) { 
        // let workbook = new excel.Workbook();        
	    let workSheet = workbook.addWorksheet('Services'); 

        workSheet.columns = [
            { header: 'Id', key: 'service_id', width: 10},
            { header: 'User Nme', key: 'user_name', width: 20 },
            { header: 'Category', key: 'category', width: 20},
            { header: 'Title', key: 'title', width: 20, outlineLevel: 1},
            { header: 'Description', key: 'description', width: 40, outlineLevel: 1},
            { header: 'Service Type', key: 'service_type', width: 10, outlineLevel: 1},
            { header: 'Price', key: 'price', width: 20, outlineLevel: 1}
        ];
        // Add Array Rows
        workSheet.addRows(result); 
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'services.xlsx');
        
        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        })
    });

}
const quectionReport=(req,res,next)=>{
    let workbook = new excel.Workbook();
    var sql = "SELECT * FROM quection"
    mysqlConnection.query(sql, function (err1, result) { 
        // let workbook = new excel.Workbook();        
	    let workSheet = workbook.addWorksheet('Quections'); 

        workSheet.columns = [
            { header: 'Id', key: 'qid', width: 10},
            { header: 'User Name', key: 'user_name', width: 20 },
            { header: 'Category', key: 'category', width: 30},
            { header: 'Title', key: 'title', width: 20, outlineLevel: 1},
            { header: 'Quection', key: 'quection', width: 40, outlineLevel: 1}
        ];
        // Add Array Rows
        workSheet.addRows(result); 
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'quections.xlsx');
        
        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        })
    });

}
module.exports={
    usersReport,
    categoriesReport,
    serviceReport,
    quectionReport,
    
}