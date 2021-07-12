const route = require('express').Router()

const Product = require("../models/products").Product


route.get("/",(req,res)=>{
    var count
    Product.count({},(err,e)=>{
        count = e
    })
    Product.find({},(err,products)=>{
        if(err) console.log(err);
        res.render('user/user_products',{
            title:"All Products currenty available",
            products:products,
            count:count
        })
    })
})


route.get("/:slug",(req,res)=>{
    var slug = req.params.slug
    var count
    Product.count({category:slug},(err,e)=>{
        count = e
    })
    Product.find({category:slug},(err,products)=>{
        console.log(count);
        if(err) return console.log(err);
        res.render('user/user_products',{
            title: "All products in this Category",
            products:products,
            count:count
        })
    })
})


route.get("/:category/:slug",(req,res)=>{
    var category = req.params.category
    var slug = req.params.slug
    Product.findOne({category:category,slug:slug},(err,product)=>{
        if(err) return console.log(err);
        res.render("user/user_viewDetail",{
            product:product
        })
    })
})


module.exports = {
    route
}