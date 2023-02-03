import Role from '../models/role'
import tipoEspFis from '../models/tipoEspFis';
//creación de roles básicos
export const createRoles=async()=>{
   try{
    const count=await Role.estimatedDocumentCount()
    if(count>0) return;

    const values= await Promise.all([
    new Role({name:"USER"}).save(),
    new Role({name:"ADMIN"}).save(),
    new Role({name:"SUPERA"}).save()])
   }
   catch(error){
    console.error(error)
   }
};
//creación de tipos de espacios físicos básicos
export const createEspacios=async()=>{
   try{
    const count=await tipoEspFis.estimatedDocumentCount()
    if(count>0) return;

    const values= await Promise.all([
    new tipoEspFis({name:"AUDITORIO"}).save(),
    new tipoEspFis({name:"SALA"}).save(),
    new tipoEspFis({name:"AULA"}).save()])
   }
   catch(error){
    console.error(error)
   }
};