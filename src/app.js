import express from 'express'
import morgan from 'morgan'//middleware 
import pkg from '../package.json'
import reservasRoutes from './routes/reservas.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import {createRoles} from './libs/initialSetup'

const app=express()
createRoles();

app.set('pkg',pkg)
import cors from 'cors'
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(bodyParser.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.use(morgan('dev'));
app.use(express.json());//esto es para que interprete los archivos json

app.get('/',(req,res)=>{
    res.json({
        name:app.get('pkg').name,
        author:app.get('pkg').author,
        description:app.get('pkg').description,
        version:app.get('pkg').version
    })
})

app.use('/api/users',userRoutes)
app.use('/api/reservas',reservasRoutes)
app.use('/api/auth',authRoutes)
export default app