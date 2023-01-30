import TipoFis from "../models/tipoEspFis";

//método para obtener todos los tipos de espacios físicos almacenados en la base de datos

export const getTipoEspFis=async(req,res)=>{
    const tipos=await TipoFis.find();
    return tipos;   
    
}
