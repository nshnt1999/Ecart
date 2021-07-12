const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
var expressSession = require('express-session')
const { body, validationResult } = require('express-validator')
var fileupload = require('express-fileupload')




mongoose.connect('mongodb://localhost/cmscart', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection successful");
});



const app = express()





app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

// Session Middleware
app.use(expressSession({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))


app.use('/public',express.static(path.join(__dirname,'public')))


app.use(express.urlencoded({extended:true}))
app.use(express.json())

// FileUpload MiddleWare
app.use(fileupload())


global.f_cart = null




// Setting up the routes
app.use('/cart',require("./routes/cart").route)
app.use('/products',require('./routes/products').route)
app.use('/login',require('./routes/login').route)
app.use('/logout',require('./routes/logout').route)
app.use('/',require('./routes/pages.js').route)
app.use('/admin/pages',require('./routes/admin_pages').route)
app.use('/admin/categories',require('./routes/admin_category').route)
app.use('/admin/products',require("./routes/admin_product").route)

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});





global.errors = ""
global.userid = null


// For Page Models
const Page = require("./models/pages").Page

Page.find({},(err,pages)=>{
  if(err) return console.log(err);
  global.f_pages = pages
})


// For Categories Model

const Category = require('./models/categories').Category
const { route } = require('./routes/products')

Category.find({},(err,categories)=>{
  if(err) return console.log(err);
  global.f_categories = categories
})




app.listen(3355,()=>{
    console.log("Server has started running");
})