const express = require("express")
const app = express();
var session = require('express-session')
var flash = require('express-flash-messages')
app.set('trust proxy', 1)// trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}))
app.use(flash())
const server = require("http").createServer(app);
const socket_io=require("socket.io");
const io=socket_io();
const bodyParser = require('body-parser');
const expressLayouts=require('express-ejs-layouts');
const path = require("path");

//page routings
const homeRoutes = require('./routes/home-routes');
const userRoutes =require('./routes/user_routes');
const categoryRoutes=require('./routes/category_route');
const serviceRoutes=require('./routes/service_route');
const paymnetRouter=require('./routes/payment_route');
const quectionRoute=require('./routes/quection_route');
const couponRouter=require('./routes/coupon_route');

//
const PORT = 3000;

io.listen(server.listen(PORT, () => console.log("server running on port testing" + PORT)));
app.io=io.on("connection",function (socket) {
    console.log("socket connected"+socket.id);
    socket.on("chat msg",msg=>{
        console.log(msg)
        io.emit("chat msg",msg)
    })
});

var cookieParser = require("cookie-parser");
const checkAuth=require('./middleware/check_auth');

app.use(cookieParser());
console.log('API Server started on:' +PORT);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/uploads',express.static('uploads'));
app.set('port',3000);
app.set('views',__dirname + '/views');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);

//set page routings
app.use(homeRoutes.routes);
app.use(userRoutes.routes);
app.use(categoryRoutes.routes);
app.use(serviceRoutes.routes);
app.use(paymnetRouter.routes);
app.use(quectionRoute.routes);
app.use(couponRouter.routes);


//
//

app.use(express.static(path.join(__dirname, 'public')));
module.express = app;







