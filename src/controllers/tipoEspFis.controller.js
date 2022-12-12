import TipoFis from "../models/tipoEspFis";


export const getTipoEspFis=async(req,res)=>{
    const tipos=await TipoFis.find();
    return tipos;   
    
}
