import User from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from '../models/role'
import Dependencia from '../models/dependencia'
import TipoFis from '../models/tipoEspFis'
import EspFis from '../models/espaciofisico'


//controlador para manejar todo lo referente a token y usuarios

//método para registrar un nuevo usuario
export const signUp=async(req,res)=>{
    //se desestructura el body para obtener cada uno de los parámetros del modelo user

    const {name,ced,roles,dependencia,email,password,telefono}=req.body;
    //se crea un nuevo usuario
    const newUser=new User({
        name,
        ced,
        email,
          //para brindar seguridad y que nadie conozca la contraseña se la encripta
        password:await User.encryptPassword(password),
        telefono
    })
//se valida si el rol enviado efectivamente existe en la base de datos, esto es útil
    //para el registro de nuevos usuarios que tendrán permisos especiales como administradores o Super administradores
    if (roles){
       const foundRoles= await Role.find({name:{$in: roles}})
       //si el rol existe guarda el object_id del rol, esto optimiza la consulta a la base de datos
       newUser.roles=foundRoles.map(role=>role._id)
    }
    //si no se envía un rol, por defecto se asume que es usuario, esto sirve para la ventana pública de registro de usuarios.
    else{
        const role = await Role.findOne({name:"USER"})
        newUser.roles=[role._id]
    }
    //se valida si la dependencia enviada existe en la base de datos
   
    if(dependencia){
        const foundDep=await Dependencia.find({});
        
        let dep = foundDep.filter((item) => item.toJSON().id_unidad == dependencia);
         //si la encuentra agrega el object_id
        newUser.dependencia=dep[0];
    }
    
    //una vez todos los datos son enviados, se envia el objeto a guardar en la base de datos
    const savedUser=await newUser.save();
    //creación del token
    const token=jwt.sign({id:savedUser._id},config.SECRET,{
        expiresIn:1800//30 minutos, después de este tiempo se cerrará sesión automáticamente
    })
     //se envía el token para redirigir al usuario a signin
    res.status(200).json({roles:savedUser.roles[0].toJSON().name,token})

};
//método para ingresar una vez se tiene cuenta
export const signIn=async(req,res)=>{
    //con esto se obtiene los datos completos del rol y la dependencia usando sus objectId
    const userFound=await User.findOne({email:req.body.email}).populate(['roles','dependencia'])
    //si el usuario no existe se envía un mensaje de error
    if(!userFound){
        return res.status(400).json({message:"El usuario no existe"})
    }
     //si el usuario existe se valida que la contraseña ingresada coincida con la registrada en la base de datos

    const matchPassword=await User.comparePassword(req.body.password,userFound.password)
    //si la contraseña no coincide se envía un mensaje de contraseña inválida
    if(!matchPassword)
    {
        return res.status(401).json({token:'null',message:'Contraseña Inválida'})

    }
     //si el usuario existe y la contraseña coincide se retorna el token
   
    const token=jwt.sign({id:userFound._id},config.SECRET,{expiresIn:1800})
    //se envía el rol, el id del usuario y el token para luego ser gestionados desde el frontend
    res.json({roles:userFound.roles[0].toJSON().name,
                id:userFound._id,
                token})
}
//método para crear un nuevo espacio, esto solo lo puede hacer un Super Administrador
export const crearEspacio = async (req, res) => {
    //se desestructuran los datos enviados por el usuario, para obtener los parámetros necesarios
    
    const {name,tipoesp}=req.body;
     //se crea un nuevo espacio
    const newEspFis=new EspFis({
        name
    })
   //se busca el tipo de espacio en la base de datos
    if (tipoesp){
        const foundTipo=await TipoFis.find({name:{$in: tipoesp}});
           //se obtiene el objectId del tipo de espacio
        let tipo = foundTipo[0].toJSON()._id
        //se asigna la nueva variable al objeto
        newEspFis.tipo_espacio = tipo;
        const l=(await EspFis.find({tipo_espacio:foundTipo[0]._id})).length
        //se agrega un código identificador que se usa para las reservas
        newEspFis.code=foundTipo[0].code + l + 1
        console.log(newEspFis.code);
    }
    //si todos los datos son correctos, se envía el objeto a la base de datos y se solicita guardarlo
    const savedEsp=await newEspFis.save();
    //se retorna el estado 200 si el registro fue exitoso
    res.status(200).json({savedEsp})
}
//método para obtener la lista de dependencias almacenadas en la base de datos

export const dependencias = function (req, res) {
    //variable que guarda todas las dependencias
    let dependencias = Dependencia.find({});
     //en caso de haber error en la consulta se lanza error
    dependencias.exec(function (err, dependencias) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener las dependencias',
                error: err
            });
        }
         //se retorna estatus 200 si no existe error y se envía la lista de dependencias
        return res.status(200).json(dependencias);
    });
};
//método para obtener el usuario
export const getUser = async(req, res)=>{
    //se busca el usuario en la base de datos por medio de la cédula
    const user=User.findOne({_id:req.params.id});
    //en caso de error en la consulta se envía un estatus 500
    user.exec((err, user) =>{
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener el user',
            });
        }
        //si no hay error se envía el usuario y estatus 200

        return res.status(200).json(user);
    });
}
//Método para obtener los tipos de espacios físicos
export const tipoEspFis = function (req, res) {
    //variable que almacena la lista de todo los tipos de espacios
    let tiposEspFis = TipoFis.find({});
     //en caso de existir error al traer los espacios se envía un status de error
    tiposEspFis.exec(function (err, tiposEspFis) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los tipos de espacios físicos',
                error: err
            });
        }
        //si no existe error al traer los tipos de espacios se envía un estatus 200 y los nombres de los espacios físicos
        return res.status(200).json(tiposEspFis.map(r=>{
            return r.name
        }));
    });
};
//Método para obtener el código y nombre de todos los tipos de espacios físicos
export const tipoEspFisCode = function (req, res) {
    //Variable para almacenar todos los tipos de la base de datos
    let tiposEspFis = TipoFis.find({});
    //si hay error en la ejecución se envía un mensaje de error
    tiposEspFis.exec(function (err, tiposEspFis) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los tipos de espacios físicos',
                error: err
            });
        }
        return res.status(200).json(tiposEspFis.map(r=>{
            return {name:r.name,code:r.code}
        }));
    });
};
//Método para obtener los roles
export const roles = function (req, res) {
    //variable que almacena todos los roles
    let rolel = Role.find({});
    //si la variable está vacía se envía un error
    rolel.exec(function (err, rolel ){
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los roles',
                error: err
            });
        }
        //si no hubo error en obtener los roles se envía la lista
        
        return res.status(200).json(rolel);
    });
};
//Método para registrar un usuario, es diferente del método signup porque no se envía token ya que un super Administrador lo ejecuta

export const registrarUsuario=async(req,res)=>{
     //se desestructuran los datos para obtener los parámetros necesarios
    
    const {name,ced,roles,dependencia,email,password,telefono}=req.body;
  //se crea un nuevo usuario
    const newUser=new User({
        name,
        ced,
        email,
        password:await User.encryptPassword(password),
        telefono
    })
    //se valida si el rol diferente a USER existe
    if (roles){
        //se busca el rol enviado entre los roles existentes
       const foundRoles= await Role.find({name:{$in: roles}})
        //en caso de existir se guarda el ObjectId del rol
       newUser.roles=foundRoles.map(role=>role._id)
    }
     //de lo contrario se envía el parámetro USER
    else{
        const role = await Role.findOne({name:"USER"})
        newUser.roles=[role._id]
    }
    //se valida si la dependencia existe
    if(dependencia){
         //se obtiene todas las dependencias
        const foundDep=await Dependencia.find({});
        //se busca si la dependencia enviada coincide 
        let dep = foundDep.filter((item) => item.toJSON().id_unidad == dependencia);
        // y si coincide se almacena el ObjectId
        newUser.dependencia=dep[0];
    }
     //se envía el usuario a la base de datos
    const savedUser=await newUser.save();
    //se envía el nombre del rol y el estatus 200
    res.status(200).json({roles:savedUser.roles[0].toJSON().name})
   
}
//método para obtener los espacios registrados
export const espacios = function (req, res) {
     //variable que almacena los espacios
    //populate trae toda la información del tipo de espacio a través del ObjectId
    let espacios = EspFis.find({}).populate('tipo_espacio');
     //en caso de que la variable sea vacía o no haya match con el tipo de espacio se retorna errorr
    espacios.exec(function (err, espacios) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los espacios',
                error: err
            });
        }
        //si la variable no es vacía y no hubo error se envía la lista de espacios
        return res.status(200).json(espacios);
    });
};