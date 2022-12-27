const {Schema,model} = require( 'mongoose')

const reservaSchema=Schema({
    fini:{
        type: String,
        require:[true,"se necesita fecha de inicio"],
    },
    fend:{
        type: String,
        require:[true,"se necesita fecha de finalizacion"]
    },
    namevent:{
        type:String,
        require:[true,"nombre la actividad que se realizara en el sitio"]
    },
    user:{
        ref:"User",
        type: Schema.Types.ObjectId
    },
    sitio:{
        type:String,
        enum: ["Sala de VideoConferencias 1","Sala de VideoConferencias 2","Auditorio"],
        require:[true]
    },
    state:{
        type: String,
        enum: ["solicitado","aprobado","cancelado","rechazado"],
        require:[true,"el estado es requerido"]
    },
    anexo:{
        type: String,
        require:[false]
    }
},{
    timestamps:true,
    versionKey:false
})

module.exports=model('Reserva', reservaSchema)