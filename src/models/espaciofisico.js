import { Schema, model } from 'mongoose'
//se crea el modelo de espacio físico, tiene los atributos
//name:nombre del espacio
//tipo_espacio: que hace referencia al modelo tipo de espacio físico

const espacioFisSchema = new Schema(
    {
    name: String,
    tipo_espacio: {
        ref: "TipoFis",
        type: Schema.Types.ObjectId
    },
    code:Number
    },
    {
        versionKey: false
    })

//se exporta el modelo para emplearlo en los controladores

export default model('EspFis', espacioFisSchema)