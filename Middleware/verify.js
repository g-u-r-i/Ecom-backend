const Jwt = require('jsonwebtoken')
const jwtKey = "guri"

const verify=(req,resp,next)=>{
    let token=req.headers['Authorization'];
    if(token){
        token=token.split(' ')[1];
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                resp.status(401).send({result:"Please provide a token"})
            }
            else{
                next()
            }
        })
    }
    else{
        resp.status(403).send({result: "Please provide a token"})
    }
}
module.exports=verify