import {Schema,model} from 'mongoose'
import { getDependencias } from '../controllers/dependencia.controller'

//se crea el modelo dependencia que tiene los atributos
//cod_uni: es el código identificador, es único
//name:nombre de la dependencia
//cod_tip_unidad: es el código de cada tipo de dependencia, puede ser 01,02...
//tipo_unidad: es el tipo de dependencia puede ser departamento, convenio, facultad, programa,...
const dependenciaSchema=new Schema({
    cod_uni:{type:String,unique:true},
    name:String,
    cod_tip_unidad:String,
    tipo_unidad:{type:String}
},{
    versionKey:false
})

//se exporta el modelo de dependencia para usarse en los controladores

export default model('Dependencia',dependenciaSchema)