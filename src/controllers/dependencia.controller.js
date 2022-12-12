import Dependencia from "../models/dependencia";


export const getDependencias=async(req,res)=>{
    const dependencias=await Dependencia.find();
    return dependencias;   
    
}
