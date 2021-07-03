const router = require('express').Router();
const bodyParser = require("body-parser").urlencoded({extended: true})

const authGuard = require("../guards/auth.guard")
const chatController = require("../controllers/chat.controller.js")

router.get('/:id', authGuard.isAuth , chatController.getChat)
router.post("/delete" , authGuard.isAuth , bodyParser , chatController.delete)

module.exports = router;