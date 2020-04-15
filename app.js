const express = require('express')
const session = require('express-session')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const dienbien = require('./Route/dienbien')
const md5 = require('md5')
global.path = require('path').resolve()
const user = require(`${path}/Model/Users.js`)
app.set('view engine', 'ejs')
require('dotenv').config()
require(`${path}/Route/web.js`)(router)
const gapi = require(`${path}/auth.js`)

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
app.get('/test',(req,res)=> {
    res.render('slides/test')
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
app.use('/dien-bien',dienbien)

app.get('/template/ho-so-co-dong',gapi.HoSoCoDong)
app.get('/template/ho-so-co-dong/:ID',gapi.exportHoSoCoDong)
app.get('/template/ajax/danh-sach-co-dong',gapi.DanhSachCoDong)
app.get('/template/ho-so-dai-bieu',gapi.HoSoDaiBieu)
app.get('/template/ajax/danh-sach-dai-bieu',gapi.DanhSachDaiBieu)
app.get('/template/danh-sach-dai-bieu/:id',gapi.exportHoSoDaiBieu)
app.get('/template/ajax/bien-ban-bieu-quyet/:id',gapi.exportBieuQuyet)
app.get('/template/phieu-thong-tin-dai-bieu/:id',gapi.exportThongTinDaiBieu)
app.get('/template/phieu-bieu-quyet/:id/:vande',gapi.exportPhieuBieuQuyet)
app.get('/template/ajax/ket-qua-bau-cu',gapi.exportKetQuaBauCu)
app.get('/ajax/bat-dau-dai-hoi',gapi.BauDauDaiHoi)

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
    console.log(socket.id)
    socket.on('page',function(msg){
        console.log(msg)
        io.emit('page',msg)
    })
    socket.on('thong-ke',function(msg){
        // const {sodaibieu,tongphieu} = msg
        io.emit('thong-ke',msg)
    })

    socket.on('show-bieu-quyet',function(msg){
        io.emit('show-bieu-quyet',msg)
    })
    socket.on('show-bau-cu',function(msg){
        io.emit('show-bau-cu',msg)
    })
})