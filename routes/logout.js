const route = require('express').Router()


route.get('/',(req,res)=>{
    req.session.user = null
    userid = null
    res.redirect("back")
    
})

module.exports = {
    route
}
