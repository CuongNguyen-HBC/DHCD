const express = require('express')
const session = require('express-session')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const md5 = require('md5')
global.path = require('path').resolve()
const user = require(`${path}/Model/Users.js`)
app.set('view engine', 'ejs')
require('dotenv').config()
require(`${path}/Route/web.js`)(router)
app.use(express.static('Public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({resave: true, 
    saveUninitialized: true, 
    secret: 'Cu@ng123', 
    cookie: { 
        maxAge: 365 * 24 * 60 * 60 * 1000,
        expires :false
     }}))
app.get('/login',(req,res)=> {
    res.render('login')
})
app.post('/login',async (req,res,next)=> {
    const {username,password} = req.body
    const init = new user
 const login = await init.Login(username,password)
 if(login)
 {  
    req.session.User = username
    res.redirect('/admin')
 }else res.redirect('./login')
})
app.use('/admin',(req,res,next) =>{
    if(req.session.User)
        next()
    else res.redirect('../login')
})
app.use('/admin',router)

const io = require('socket.io')(app.listen(process.env.APP_PORT || 80 ,function(){
    console.log('server was reloaded...')
    console.log(`Server is listening port ${process.env.APP_PORT}`)
}))
io.on('connection',function(socket){
    console.log('ok')
    socket.on('page',function(msg){
        console.log(msg)
        io.emit('page',msg)
    })
    socket.on('thong-ke',function(msg){
        // const {sodaibieu,tongphieu} = msg
        io.emit('thong-ke',msg)
    })
})