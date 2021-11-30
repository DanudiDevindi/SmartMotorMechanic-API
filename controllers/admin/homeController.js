const indexView =(req,res,next)=>{
res.render('home')
}

const iconView =(req,res,next)=>{
    res.render('icons')
}

const tblView=(req,res,next)=>{
    res.render('tables')

}

const registerView =(req,res,next)=>{
    res.render('register')
}

module.exports={
    indexView,
    iconView,
    tblView,
    registerView
}