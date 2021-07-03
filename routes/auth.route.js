const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const check  = require('express-validator').check
const bodyParser = require('body-parser')
const authGuards= require('../guards/auth.guard')

router.get('/signup', authGuards.notAuth , authController.getSignUp) 

router.post('/signup', authGuards.notAuth, bodyParser.urlencoded({extended:true}), 
    check('username').not()
    .isEmpty(),
    check('email').not()
    .isEmpty()
    .isEmail().withMessage('Please add a vaild E-mail'),
    check('password')
    .not()
    .isEmpty()
    .isLength({min:6})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/)
    .withMessage( "Password length must be at least 6 contain At least one uppercase and lowercase. "),
    check('confirmPassword').custom((value, {req})=>{
        if(value === req.body.password)return true
        else throw 'Passwords are not the same' 
}),authController.postSignUp)//create the user in the db

router.get('/login', authGuards.notAuth, authController.getLogin)

router.post('/login',authGuards.notAuth,  bodyParser.urlencoded({extended:true}),
    check('email').not()
    .isEmpty().withMessage("Please try to enter a valid E-mail"),
    check('password')
    .not()
    .isEmpty().withMessage("Please try to enter a valid password")

, authController.postLogin)// just reading and checking if it exists in the db

router.all ('/logout', authGuards.isAuth, authController.logout)
module.exports= router
