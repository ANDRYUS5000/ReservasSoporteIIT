import { Schema, model } from 'mongoose'

const espacioFisSchema = new Schema({
    name: String,
    tipo_espacio: {
        ref: "TipoFis",
        type: Schema.Types.ObjectId
    },
}, {
    versionKey: false
})


export default model('EspFis', espacioFisSchema)