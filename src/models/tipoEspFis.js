import {Schema,model} from 'mongoose'

const tipoEspacioSchema=new Schema(
    {
        name:String,
        code:Number
    },
    {
    versionKey:false
    }
)

export default model('TipoFis',tipoEspacioSchema)