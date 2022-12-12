import {Schema,model} from 'mongoose'
import { getDependencias } from '../controllers/dependencia.controller'

const dependenciaSchema=new Schema({
    cod_uni:{type:String,unique:true},
    name:String,
    cod_tip_unidad:String,
    tipo_unidad:{type:String}
},{
    versionKey:false
})


export default model('Dependencia',dependenciaSchema)