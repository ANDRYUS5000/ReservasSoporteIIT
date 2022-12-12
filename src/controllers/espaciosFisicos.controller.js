import EspFis from '../models/espaciofisico'


export const getEspacios=async(req,res)=>{
    const espacios=await EspFis.find();
    return espacios;   
    
}
