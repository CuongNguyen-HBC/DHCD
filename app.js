const express = require('express')
const app = express()
const router = express.Router()

const bodyParser = require('body-parser');
global.path = require('path').resolve()
app.set('view engine', 'ejs')
require('dotenv').config()
require(`${path}/Route/web.js`)(router)
app.use(express.static('Public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/login',(req,res)=> {
    res.render('login')
})
app.use('/admin',router)

const io = require('socket.io')(app.listen(process.env.APP_PORT || 80 ,function(){
    console.log('server was reloaded...')
    console.log(`Server is listening port ${process.env.APP_PORT}`)
}))
io.on('connection',function(socket){
    console.log('ok')
    socket.on('page',function(msg){
        io.emit('page','okok')
        console.log(msg)
    })
})