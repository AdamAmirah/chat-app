const userModel = require('../models/user.model')
const validationResult = require("express-validator").validationResult


exports.getSignUp= (req , res, next)=>{
    res.render('signup' , {
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isLogged : req.session.userId,
        isAdmin: false,
        page: "signUp",
        friendRequests : req.friendRequests


    })
}


exports.postSignUp= (req , res, next)=>{
    if(validationResult(req).isEmpty()){
        userModel.createUser(req.body.username , req.body.email , req.body.password)
        .then( () => res.redirect('/login'))
        .catch( err => {
                req.flash('authError' , err)
                res.redirect('/signup')
            }) 
    }
    else{
        req.flash('validationErrors' , validationResult(req).array())
        res.redirect('/signup')
    }

}

exports.getLogin= (req , res, next)=>{
    res.render('login' , {
        authErro: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isLogged : req.session.userId,
        isAdmin: false,
        page: "login",
        friendRequests : req.friendRequests
    })
}


exports.postLogin= (req , res, next)=>{
    if(validationResult(req).isEmpty()){
        userModel.login(req.body.email , req.body.password)
        .then( (result) => {
            req.session.userId = String(result.id);
            req.session.name= result.username
            req.session.image= result.image

            req.session.isAdmin = result.isAdmin
            res.redirect('/')
        }).catch( err => {
                req.flash('authError' , err)
                res.redirect('/login')
            }) 
    }
    else{
        req.flash('validationErrors' , validationResult(req).array())
        res.redirect('/login')
    }
    
}


exports.logout = (req, res,next)=>{
     req.session.destroy(()=>{
         res.redirect('/')
     })
}