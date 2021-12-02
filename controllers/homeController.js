const mysqlConnection = require('../config/dbConfig');

const indexView =(req,res,next)=>{
    res.render('login')
}

const iconView =(req,res,next)=>{
    res.render('icons');
}

const tblView=(req,res,next)=>{
    res.render('tables')
}

const registerView =(req,res,next)=>{
    res.render('register')
}

const viewHome=(req,res,next)=>{
    var sql_user=`SELECT * FROM user_tbl`;
    var service_sql=`SELECT * FROM service`;
    var cat_sql=`SELECT * FROM category`;
    var quec_sql=`SELECT * FROM quection`;
    mysqlConnection.query(sql_user, (error, users, fields) => {
        mysqlConnection.query(service_sql, (error, services, fields) => {
            mysqlConnection.query(cat_sql, (error, categories, fields) => {
                mysqlConnection.query(quec_sql, (error, quections, fields) => {
                    res.render('home',{
                        data:{
                           user_count:users.length,
                           service_count:services.length,
                           cat_count:categories.length,
                           quec_count:quections.length 
                        }
                    })
                })
            })
        })
    })
    
}

const adminLoginView=(req,res,next)=>{
    res.render('login',{
        title:"Login",
        messages:''
    })
}

const adminLogin=(req,res,next)=>{
    const user_name = req.body.username;
    const password = req.body.password;
    var sql=`SELECT * FROM admin_tbl WHERE email='${user_name}'`;
    mysqlConnection.query(sql, (error, data, fields) => {
       if(error){
            res.render('login', {
                title: 'Login',
                messages: {
                    errors: {    
                        password: 'Invalid Username or Password'
                    }
                },
                data: req.body
            });
        }else{
            if(data.length>=1){
                res.redirect('home');
                
              
            }else{
                res.render('login', {
                    title: 'Login',
                    messages: {
                        errors: {
                            password: 'Invalid Username or Password'
                        }
                    },
                    data: req.body,
                });
            }
        }
    });    
}

module.exports={
    indexView,
    iconView,
    tblView,
    registerView,
    viewHome,
    adminLoginView,
    adminLogin

}