const route = require('express').Router()

const Page = require("../models/pages").Page


route.get('/',(req,res)=>{
    Page.find({},(err,pages)=>{
        if(err) return console.log(err);
        f_pages = pages
        res.render("user/user_mainPage")    
    })
    
})


route.get('/:slug',(req,res)=>{
    var slug = req.params.slug
    // console.log(f_pages,slug);
    Page.findOne({slug:slug},(err,page)=>{
        if(err) return console.log(err);
        if(!page){
            res.redirect("/")
        }
        else{
            res.render("user/user_utilityPage",{
                title:page.title,
                content: page.content
            })
        }
    })
})



module.exports = {
    route
}
