import Dependencia from "../models/dependencia";

//método para traer todas las dependencias existentes en la base de datos
export const getDependencias=async(req,res)=>{
    const dependencias=await Dependencia.find();
    return dependencias;   
    
}
