import mongoose from 'mongoose'

//conexión a la base de datos
const MONGO_CNN='mongodb+srv://Admin:123@cluster0.gyykknb.mongodb.net/reservas'

//conexión a la base de datos
mongoose.connect(MONGO_CNN,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(db=>console.log('Conexión exitosa'))//si la conexión fue exitosa se envía este mensaje
.catch(err=>console.log(err));//si hubo error se muestra el error por consola
