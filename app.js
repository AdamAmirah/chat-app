const express = require("express")
const app = express()
const path = require ("path")


const session = require('express-session')
const SessionStore = require('connect-mongodb-session')(session)
const cookieParser=require('cookie-parser')
const flash = require ('connect-flash')
const socketIO = require("socket.io")
const homeRouter = require('./routes/home.route')
const authRouter = require('./routes/auth.route')
const profileRouter = require('./routes/profile.route')
const friendRouter = require('./routes/friend.route')
const chatRouter = require('./routes/chat.route')
const groupRouter = require('./routes/group.route')
const userModel = require("./models/user.model")

const server = require('http').createServer(app)
const io = socketIO(server)


io.onlineUsers = {}
require('./sockets/friend.socket')(io)
require('./sockets/init.socket')(io)
require('./sockets/home.socket')(io)
require('./sockets/chat.socket')(io)
require('./sockets/group.socket')(io)


app.use (express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(cookieParser('keyboard cat'));
app.use(session());
app.use(flash())

const STORE = new SessionStore ({
     uri:'mongodb://localhost:27017/chat-app',
     collection: 'sessions'

})


app.use(session({
    secret: "this Amirah's second website",
    saveUninitialized: false,
    store : STORE
     
}))

app.set("view engine" , "ejs")
app.set('views' , 'views') // defualt


app.use((req, res , next) =>{
    if(req.session.userId){
        userModel.getFriendRequests(req.session.userId)
        .then((requests)=>{
            req.friendRequests = requests
            next()
        }).catch(err => res.redirect('/error'))

    }else{
        next()
    }
})
app.use('/', homeRouter)
app.use('/' , authRouter )
app.use("/profile", profileRouter)
app.use("/friend", friendRouter)
app.use("/chat", chatRouter)
app.use("/group", groupRouter)


app.use("/error/500" , (req, res,next)=>{
    res.status(500)
    res.render('error.ejs', {
        isLogged : req.session.userId,
        error:{errorNo:"500" , error_message:""},
        page: "Error",
        friendRequests : req.friendRequests
        
    })
})

app.use("/error/403" , (req, res,next)=>{
    res.status(403)
    res.render('error.ejs', {
        isLogged : req.session.userId,
        error:{errorNo:"403" , error_message:"You are not an Admin"},
        page: "Error" ,
        friendRequests : req.friendRequests     
    })
})

app.use((req, res,next)=>{
    res.status(404)
    res.render('error.ejs', {
        isLogged : req.session.userId,
        error:{errorNo:404 , error_message:"Page Not Found"},
        page: "Error",
        friendRequests : req.friendRequests
        
    })
})

server.listen(3000, (err)=>{
    console.log("Listening from port 3000");
})