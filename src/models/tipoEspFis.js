import {Schema,model} from 'mongoose'

//se crea el modelo del tipo de espacio que solo tendrá nombre y object id

const tipoEspacioSchema=new Schema(
    {
        name:String,
        code:Number
    },
    {
    versionKey:false
    }
)
//se exporta el modelo para usarlo en los controladores

export default model('TipoFis',tipoEspacioSchema)