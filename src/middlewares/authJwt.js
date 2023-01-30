import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/user'
import Role from '../models/role'
//Este middleware se encarga de la verificación de token para acceder a los módulos según el tipo de usuario.


//verifica el rol del usuario y si el token es válido, en caso de no existir token simplemente atrapa el error y envía un mensaje 
//de que el usuario no tiene los privilegios para acceder

export const verifyToken=async(req,res,next)=>{
    try{
    const token=req.headers["x-access-tokenA"]
    if(!token) return res.status(403).json({message:"No hay token"})
    const decoded=jwt.verify(token,config.SECRET)
    //me retorna en el token el valor del usuario
    req.userId=decoded.id;
  //se busca al usuario por id
    const user=await User.findById(req.userId,{password:0})
    //si no se encuentra al usuario en la base de datos se envía el mensaje de que no existe
    
    if(!user) return res.status(404).json({message:'usuario no existe'})
    //en caso de encontrarlo permite ejecutar las funciones de acuerdo al perfil
    next()
    }
    catch(error)
    {
        return res.status(401).json({message:"No está autorizado"})
    }
};

//funciones para verificar el rol de los usuarios y permitirles o no ejecutar funciones

//valida si quien accede solamente es usuario, el cual puede solicitar reservas y ver el estado en el que se encuentran
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
//valida si el usuario es administrador, si es así podrá manipular las reservas

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
//valida si el usuario es Super Administrador, el cual podrá crear cuentas de usuario, manipular reservas y visualizar estadísticas
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