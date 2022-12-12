import mongoose from 'mongoose'

const MONGO_CNN='mongodb+srv://admin:123@cluster0.un5td0x.mongodb.net/reservas'

mongoose.connect(MONGO_CNN,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(db=>console.log('Conexión exitosa'))
.catch(err=>console.log(err));