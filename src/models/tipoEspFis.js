import {Schema,model} from 'mongoose'
export const ESPACIOS=["AUDITORIO","SALA","AULA"]

const tipoEspacioSchema=new Schema({
    name:String
},{
    versionKey:false
})

export default model('TipoFis',tipoEspacioSchema)