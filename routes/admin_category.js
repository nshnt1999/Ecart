const route = require('express').Router()

const Category = require('../models/categories').Category

console.log(Category);

route.get("/",(req,res)=>{
    Category.find({},(err,result)=>{
        if(err) return console.log(err);
        res.render('admin/category',{
            result:result
        })
    })
})


route.get('/add-category',(req,res)=>{
    errors=""
    title=""
    res.render("admin/add_categories",{
        errors:errors,
        title:title
    })  
})



route.post('/add-category',(req,res)=>{
    errors= ""
    var title = req.body.title
    var slug = title.replace(/\s/g,'-').toLowerCase()
    if(title==""){
         res.render("admin/add_categories",{
             errors: "Please add a title",
             title: title
        })
    }
    else{
        Category.findOne({slug:slug},(err,result)=>{
            if(err) return console.log(err);

            if(result){
                res.render('admin/add_categories',{
                    errors: "Choose another title",
                    title:title
                })
            }
            else{
                category = new Category({
                    title: title,
                    slug: slug
                })
                category.save((err)=>{
                    if(err) return console.log(err);

                    Category.find({},(err,categories)=>{
                        if(err) return console.log(err);
                        req.app.locals.f_categories = categories
                      })
                      
                    res.redirect('/admin/categories')
            })
        }
        })    
    }
        

})



route.get("/edit-category/:id",(req,res)=>{
    errors = ""
    var id = req.params.id
    Category.findById(req.params.id,(err,result)=>{
        if(err) return console.log(err)

        res.render("admin/edit_categories",{
            errors: errors,
            title: result.title,
            id:id
        }) 

    })

})


route.post('/edit-category',(req,res)=>{
    errors = ""
    var title = req.body.title
    var id = req.body.id
    console.log(title,id);
    var slug = title.replace(/\s/g,'-').toLowerCase()
    if(title==""){
         res.render("admin/edit_categories",{
             errors: "Please add a title",
             title: title,
             id:id
        })
    }
    else{
        Category.findOne({title:title,_id:{'$ne':id}},(err,result)=>{
            if(err) return console.log(err);
            if(result){
                res.render("admin/edit-category",{
                    errors: "The title already exsists",
                    title:title,
                    id:id
                })
            }
            else{
                Category.findById(id,(err,result)=>{
                    if(err) return console.log(err);
                    result.title = title
                    result.slug = slug
                    result.save((err)=>{
                        if(err) return console.log(err);
                        Category.find({},(err,categories)=>{
                            if(err) return console.log(err);
                            req.app.locals.f_categories = categories
                          })
                          
                        res.redirect("/admin/categories")
                    })
                })
            }
        })
    }
})



route.get("/delete-category/:id",(req,res)=>{
    console.log(req.params.id);
    Category.findByIdAndDelete({_id:req.params.id},(err)=>{
        if(err) return console.log(err);
        res.redirect("/admin/categories/")    
    })
})



module.exports = {
    route
}