const route = require('express').Router()
const User = require('../models/users').User


route.get('/',(req,res)=>{
    errors = ""
    res.render('user/login')
})


route.post('/',(req,res)=>{
    errors = ""
    var uid = req.body.uid
    var pwd = req.body.pwd
    // console.log(uid,pwd);
    User.findOne({username:uid},(err,user)=>{
        if(err) return console.log(err);
        if(!user){
            return  res.render('user/login',{
                errors:"Not Valid Credentials"
            })
        }
        
        if(pwd!=user.password){
            return res.render('user/login',{
                errors:"Not Valid Credentials"
            })
        }
        
        req.session.user = uid
        userid = uid

        res.redirect('/')



    })
})


route.get('/adduser',(req,res)=>{
    req.session.user = null
    userid = null
    res.render('user/adduser')
})


route.post('/adduser',(req,res)=>{
    var uid = req.body.uid
    var mid = req.body.mid
    var pwd = req.body.pwd
    new_user= new User({
        username: uid,
        email: mid,
        password: pwd
    })
    new_user.save((err)=>{
        if(err) return console.log(err);
        req.session.user = uid
        userid = uid
        res.redirect("/")
    })
})



module.exports = {
    route
}