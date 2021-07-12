const route = require('express').Router()
const fs = require('fs-extra')
const resizeImg = require('resize-img')
const mkdirp = require('mkdirp')

const Product = require("../models/products").Product
const Category = require("../models/categories").Category
const { Router } = require('express')

route.get('/',(req,res)=>{
    var count
    Product.count((err,c)=>{
        count = c
    })
    Product.find({},(err,result)=>{
        if(err) return console.log(err);
        console.log(typeof result);
        res.render("admin/products",{
            result:result,
            count:count
        })
    })
})


route.get("/add-product",(req,res)=>{
    errors = ""
    Category.find({},(err,category)=>{
        if(err) console.log(err);
        var title = ""
        var price = ""
        var desc = ""

        res.render("admin/add_products",{
            title: title,
            price: price,
            desc: desc,
            category:category
        })


    })

})


route.post("/add-product",(req,res)=>{
    errors = ""
    var title = req.body.title
    var price = req.body.price
    var category = req.body.category
    var desc = req.body.desc
    var slug = title.replace(/\s/g,'-').toLowerCase()
    

    if(req.files==null||title==""||price==""||category==""){
        console.log(slug,req.files,title,price,category);
        Category.find({},(err,categories)=>{
            res.render("admin/add_products",{
                errors: "Please fill the columns",
                title:title,
                price:price,
                desc:desc,
                category:categories
            })
        })
    }
    else{
        var imageFile = req.files.image.name
        Product.findOne({slug:slug},(err,product)=>{
            if(err) return console.log(err);
            if(product){
                console.log(product,"hello");
                Category.find({},(err,categories)=>{
                    res.render("admin/add_products",{
                        errors: "The title name is already there",
                        title:title,
                        price:price,
                        desc:desc,
                        category:categories
                    })
                })
            }
            else{
                var price2 = parseFloat(price)
                var product = new Product({
                    title:title,
                    slug:slug,
                    desc:desc,
                    price:price,
                    category:category,
                    image: imageFile
                })

                product.save((err)=>{
                    if(err) console.log(err);
                    
                   

                   var dir = 'public/product_images/'+product._id
 
                   fs.mkdirSync(dir,{
                       recursive: true
                   })
                   
 

                   
                    var productImage = req.files.image;
                    
                    var path = 'public/product_images/' + product._id + '/' + imageFile;
                    
                    productImage.mv(path, function (err) {
                        return console.log(err);
                    });

                    res.redirect('/admin/products')



                })
            }
        })
    }



})


route.get("/edit-product/:id",(req,res)=>{

    
    Category.find({},(err,categories)=>{
        
        Product.findById(req.params.id,(err,product)=>{
            if(err) return console.log(err);
            else{
                res.render("admin/edit_product",{
                    title: product.title,
                    price: product.price,
                    desc: product.desc,
                    categories: categories,
                    category: product.category,
                    image: product.image,
                    id: product._id
                })
            }
        })

        


    })

})



route.post("/edit-product",(req,res)=>{
    errors = ""
    var title = req.body.title
    var price = req.body.price
    var category = req.body.category
    var desc = req.body.desc
    var slug = title.replace(/\s/g,'-').toLowerCase()
    var id = req.body.id

    if(req.files==null||title==""||price==""||category==""){
        console.log(slug,req.files,title,price,category);
        Category.find({},(err,categories)=>{
            res.render("admin/edit_product",{
                errors: "Please fill the columns",
                title: title,
                price: price,
                desc: desc,
                categories: categories,
                category: category,
                id: id
            })
        })
    }
    else{
        var imageFile = req.files.image.name
        Category.find({},(err,categories)=>{
            Product.findOne({slug:slug,_id:{'$ne':id}},(err,product)=>{
                if(err) return console.log(err);
                if(product){
                    res.render("admin/edit_product",{
                        errors: "Title already in use",
                        title: title,
                        price: price,
                        desc: desc,
                        categories: categories,
                        category: category,
                        id: product._id
                    })
                }
                else{
                    Product.findById(id,(err,product)=>{
                        if(err) return console.log(err);
                        product.title=title
                        product.price=price,
                        product.desc=desc,
                        product.category=category,
                        product.image = imageFile
                        product.save((err)=>{
                            if(err) return console.log(err);


                            var dir = 'public/product_images/'+product._id
 
                            fs.mkdirSync(dir,{
                                recursive: true
                            })
                            
          
         
                            
                             var productImage = req.files.image;
                             
                             var path = 'public/product_images/' + product._id + '/' + imageFile;
                             
                             productImage.mv(path, function (err) {
                                 return console.log(err);
                             });
         
                             res.redirect('/admin/products')



                        })
                                            

                    })



                }
            })
        })
    }
    
})



route.get("/delete-product/:id",(req,res)=>{
    var id = req.params.id
    var dir = 'public/product_images/'+id

    fs.remove(dir,(err)=>{
        if(err) console.log(err);
        else{
            Product.findByIdAndDelete(id,(err)=>{
                if(err) return console.log(err);
                res.redirect("/admin/products")
            })
        }
    })


})



module.exports = {
    route
}