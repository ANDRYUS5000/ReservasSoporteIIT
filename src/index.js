import app from './app'
import './database'
import cors from 'cors'
import bodyParser from 'body-parser';
import http from 'http'


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

//puerto para ejecutar el backend
app.set('port', 3000);

//creación del servidor
var server = http.createServer(app);

//servidor escuchando en el puerto 3000
server.listen(app.get('port'))

console.log("aplicación funcionando en el puerto",3000)
