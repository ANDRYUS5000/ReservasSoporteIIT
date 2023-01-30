import {Schema,model} from 'mongoose'
//exportamos un arreglo con los tipos de usuarios permitidos, igualmente se podrían llamar desde la base de datos
//como el modelo dependencia
export const ROLES=["USER","ADMIN","SUPERA"]

//se crea el modelo de rol que tendrá un nombre y un object_id asignado automáticamente por Mongo

const roleSchema=new Schema({
    name:String
},{
    versionKey:false
})

//Se exporta el modelo para usarlo en los controladores

export default model('Role',roleSchema)