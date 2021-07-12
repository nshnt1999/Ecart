// const { userValidationRules,validate } = require('./admin_validator')

const route = require('express').Router()
const Page = require('../models/pages.js').Page


route.get('/',(req,res)=>{
    Page.find({},(err,result)=>{
        if(err) return res.send(err)
        else{
            res.render('admin/pages',{
                result: result
            })
        }
    })
})

route.get('/add-page',(req,res)=>{
    errors = ""
    var title = ""
    var slug = ""
    var content = ""
    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content
    })
})


route.post('/add-page',(req,res)=>{
    
    errors = ""

    var title = req.body.title
    var slug = req.body.slug.replace(/\s/g,'-').toLowerCase()
    if(slug=="")    slug = title.replace(/\s/g,'-').toLowerCase()
    var content = req.body.content
    
    if(title==""||content==""){
        errors = "Enter all the fields correctly"
        res.render('admin/add_page',{
            errors: errors,
            title: title,
            slug: slug,
            content: content
        })
    }
   
    else{

        Page.findOne({slug:slug},(err,page)=>{
            if(page){
                console.log("Page with same slug found")
                res.render('admin/add_page',{
                    errors: "Slug name already used! Try another",
                    title: title,
                    slug: slug,
                    content: content
                })
            }
            else{
                var page = new Page({
                    title:title,
                    slug:slug,
                    content:content,
                    sorting: 0
                })
                page.save((err)=>{
                    if(err) return console.log(err)
                    
                    Page.find({},(err,pages)=>{
                        if(err) return console.log(err);
                        req.app.locals.f_pages = pages
                        console.log(req.app.locals.f_pages);
                      })
                })

                res.redirect('/admin/pages/add-page')
            }
        })



        
    }


})



route.get("/edit-page/:slug",(req,res)=>{
    errors = ""
    Page.findOne({slug:req.params.slug},(err,result)=>{
        if(err) return res.send(err)

        res.render('admin/edit_page',{
          title: result.title,
          slug: result.slug,
          content: result.content,
          id: result.id  
        })


    })
})


route.post('/edit-page/:slug',(req,res)=>{
    errors = ""

    var title = req.body.title
    var slug = req.body.slug.replace(/\s/g,'-').toLowerCase()
    if(slug=="")    slug = title.replace(/\s/g,'-').toLowerCase()
    var content = req.body.content
    var id = req.body.id
    
    if(title==""||content==""){
        errors = "Enter all the fields correctly"
        res.render('admin/add_page',{
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id:id
        })
    }
    else{
        Page.findOne({slug:slug,_id:{'$ne':id}},(err,page)=>{
            if(page){
                console.log("Page with same slug found")
                res.render('admin/edit_page',{
                    errors: "Slug name already used! Try another",
                    title: title,
                    slug: slug,
                    content: content,
                    id:id
                })
            }
            else{
                Page.findById(id,(err,page)=>{
                    if(err) return console.log(err);

                    page.title = title
                    page.content = content
                    page.slug = slug

                    page.save((err)=>{
                        if(err) return console.log(err)

                        Page.find({},(err,pages)=>{
                            if(err) return console.log(err);
                            req.app.locals.f_pages = pages
                          })
                          
                          
                        
                        res.redirect('/admin/pages/')
                    })



                })
            }
        })
    }   
})




route.get("/delete-page/:id",(req,res)=>{
    console.log(req.params.id);
    Page.findByIdAndDelete({_id:req.params.id},(err)=>{
        if(err) return console.log(err);
        Page.find({},(err,pages)=>{
            if(err) return console.log(err);
            f_pages = pages
          })          
        res.redirect("/admin/pages/")    
    })
})



module.exports = {
    route
}

