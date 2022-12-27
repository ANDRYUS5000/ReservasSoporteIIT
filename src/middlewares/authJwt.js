import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/user'
import Role from '../models/role'

//verifica el rol del usuario y si el token es válido
export const verifyToken=async(req,res,next)=>{
    try{
    const token=req.headers["x-access-tokenA"]
    if(!token) return res.status(403).json({message:"No hay token"})
    const decoded=jwt.verify(token,config.SECRET)
    //me retorna en el token el valor del usuario
    req.userId=decoded.id;

    const user=await User.findById(req.userId,{password:0})
    if(!user) return res.status(404).json({message:'usuario no existe'})
    next()
    }
    catch(error)
    {
        return res.status(401).json({message:"No está autorizado"})
    }
};

//funciones para verificar el rol de los usuarios y permitirles o no ejecutar funciones
export const isUser=async(req,res)=>{
    const user=await User.findById(req.userId)
    const roles=await Role.find({_id: {$in:user.roles}})
    for(let rol of roles)
    {
        if(rol.name==="USER"){
            //next();
            //return;
            return res.json({message:"Es usuario"})
        }
        return  res.status(403).json({message:"No es usuario"})
    }
   
        
   

};
export const isAdmin=async(req,res)=>{
    const user=await User.findById(req.userId)
    const roles=await Role.find({_id: {$in:user.roles}})
    for(let rol of roles)
    {
        
        if(rol.name==="ADMIN"){
            
           
            //next();
            //return;
           return res.json({message:"Es admin"});
        }
        
    
    }
    return  res.status(403).json({message:"No es Admin"})    
};
export const isSuperAdmin=async(req,res)=>{
    const user=await User.findById(req.userId)
    const roles=await Role.find({_id: {$in:user.roles}})
    for(let rol of roles)
    {
        
        if(rol.name==="SUPERA"){
            
           
            //next();
            //return;
           return res.json({message:"Es super admin"});
        }
        
    
    }
    return  res.status(403).json({message:"No es Super Admin"})    
};