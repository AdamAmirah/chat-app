const router= require('express').Router()
const groupController = require('../controllers/group.controller')
const authGuard = require("../guards/auth.guard")
const bodyParser = require("body-parser")
const BP = bodyParser.urlencoded({extended:true})

const multer = require('multer')
const check  = require('express-validator').check

router.get('/create-group' , authGuard.isAuth, groupController.getCreateGroup)
router.post("/create-group" , authGuard.isAuth ,multer({
    storage: multer.diskStorage({
        destination : (req, file , cb)=>{
            cb(null,'images')
        }, 
        file : (req, file , cb)=>{
            cb(null,Date.now()+'.' + file.originalname)
        }
    })
}).single('image'), 

    check('image').custom((value,{req})=>{
        if(req.file)return true
        else throw 'image is required'
    }),
    check('groupName').not()
    .isEmpty().withMessage('Group name is required')

, groupController.createGroup)


router.get('/' , authGuard.isAuth, groupController.getGroup)
//////////////////////////////////////////////////////////////////

router.get('/chat/:id', authGuard.isAuth , groupController.getChat)

module.exports = router