import EspFis from '../models/espaciofisico'

//método para traer todos los espacios físicos registrados en la base de datos
export const getEspacios=async(req,res)=>{
    const espacios=await EspFis.find();
    return espacios;   
    
}
