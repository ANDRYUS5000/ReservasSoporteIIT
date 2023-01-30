const {Schema,model} = require( 'mongoose')
//se crea el modelo de reserva que contiene los atributos
//fini:hace alución a la fecha de solicitud
//fend:hace aluación a la fecha en la que se llevará a cabo
//namevent: es el nombre del evento
//user: es el usuario que solicita la reserva
//sitio: espacio físico en donde se llevará a cabo la reserva
//state: estado de la reserva, automáticamente será solicitado pero puede cambiar
//anexo: archivo que será adjuntado de forma opcional por el usuario para que se acepte o rechace la reserva
//se activa la opción timestamps porque se requiere ordenar las reservas en orden de fecha para listarse 

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
        type:Object,
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
//se exporta el modelo para usarlo en los controladores
module.exports=model('Reserva', reservaSchema)