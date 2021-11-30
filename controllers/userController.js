const mysqlConnection = require('../config/dbConfig');
var jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync();
const multer = require('multer');
var escape = require('sql-escape');
var crypto = require('crypto')
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage,
    limit: {
        filesize: 1024 * 1024 * 5
    }
});