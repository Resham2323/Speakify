import jwt from "jsonwebtoken"
import "../models/User.js"
import User from "../models/User.js";

export const protectRoute = async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized -- No token provide"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decoded) {
            return res.status(401).json({message:"invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
              return res.status(401).json({message:"Unauthorized -- User not found"})
        }

        req.user = user;
        next()
    }catch(err){
        console.error("error in protecting middleware",err);
         return res.status(500).json({message:"internal server error"})
    }
}