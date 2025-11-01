import jwt from "jsonwebtoken"


const  isAuth = (req,res,next) => {
    try {
     const token = req.cookies.token;
     if(!token){
        return res.status(401).json({message:"Unauthorized"})
     }   

     const decodeToken =  jwt.verify(token,process.env.JWT_SECRET);
     if(!decodeToken){
        return res.status(401).json({message:"Unautharized"})
        
     }
     console.log(decodeToken);
     req.userId = decodeToken.userId;
     next();
    } catch (error) {
        return res.status(401).json({message:"Unautharized"})
    }
}

export default isAuth;