const route = require('express').Router()

const Product = require("../models/products").Product

route.get("/add/:product",(req,res)=>{
    errors = ""
    if(!req.session.user){
        return res.render('user/login',{
            errors:"Login First"
        })
    }
    var slug = req.params.product
    Product.findOne({slug:slug},(err,p)=>{
        if(err) return console.log(err);
        if(!req.session.cart){
            req.session.cart = []
            req.session.cart.push({
                title: slug,
                qty:1,
                price: parseFloat(p.price),
                image: '/product_images/'+p._id+'/'+p.image
            })
        }
        else{
            var newItem = true
            for(var i=0;i<req.session.cart.length;i++){
                if(req.session.cart[i].title==slug){
                    req.session.cart[i].qty++
                    newItem=false
                    break
                }
            }
            if(newItem){
                req.session.cart.push({
                    title:slug,
                    qty:1,
                    price: parseFloat(p.price),
                    image:'/product_images/'+p._id+'/'+p.image
                })
            }   
        }
        

        console.log(req.session.cart);
        f_cart = req.session.cart
        res.redirect('back')

    })
})


route.get('/checkout',(req,res)=>{
    errors = ""
    if(!req.session.user){
        return res.render('user/login',{
            errors:"Login First"
        })
    }
    console.log(req.session.cart);
    res.render('user/user_checkout',{
        title:"Checkout Page",
        carts:req.session.cart
    })    
})


route.get('/update/:product',(req,res)=>{
    errors = ""
    if(!req.session.user){
        return res.render('user/login',{
            errors:"Login First"
        })
    }
    var slug = req.params.product
    var cart = req.session.cart
    var action = req.query.action

    for(var i=0;i<cart.length;i++){
        if(cart[i].title==slug){
            switch(action){
                case "add":
                    cart[i].qty++
                    break
                case "remove":
                    cart[i].qty--
                    if(cart[i].qty==0)  cart.splice(i,1)
                    break
                case "clear":
                    cart.splice(i,1)
                    break
                default:
                    console.log('update problem');
                    break
            }
            break
        }
    }
    f_cart = req.session.cart
    res.redirect('back')
})


route.get('/clear',(req,res)=>{
    errors = ""
    if(!req.session.user){
        return res.render('user/login',{
            errors:"Login First"
        })
    }
    req.session.cart = null
    f_cart = null
    res.redirect('back')
})




module.exports = {
    route
}