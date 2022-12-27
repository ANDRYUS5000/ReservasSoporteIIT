import User from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from '../models/role'
import Dependencia from '../models/dependencia'
import TipoFis from '../models/tipoEspFis'
import EspFis from '../models/espaciofisico'

export const signUp=async(req,res)=>{
    const {name,ced,roles,dependencia,email,password,telefono}=req.body;

    const newUser=new User({
        name,
        ced,
        email,
        password:await User.encryptPassword(password),
        telefono
    })

    if (roles){
       const foundRoles= await Role.find({name:{$in: roles}})
       newUser.roles=foundRoles.map(role=>role._id)
    }
    else{
        const role = await Role.findOne({name:"USER"})
        newUser.roles=[role._id]
    }
    if(dependencia){
        const foundDep=await Dependencia.find({});
        
        let dep = foundDep.filter((item) => item.toJSON().id_unidad == dependencia);
        newUser.dependencia=dep[0];
    }
    
    const savedUser=await newUser.save();
    //creación del token
    const token=jwt.sign({id:savedUser._id},config.SECRET,{
        expiresIn:1800//30 minutos
    })
    res.status(200).json({roles:savedUser.roles[0].toJSON().name,token})

    
    
};
export const signIn=async(req,res)=>{
    //con esto traigo a roles y dependencias el nombre de los objetos usando sus objectId
    const userFound=await User.findOne({email:req.body.email}).populate(['roles','dependencia'])

    if(!userFound){
        return res.status(400).json({message:"El usuario no existe"})
    }
    const matchPassword=await User.comparePassword(req.body.password,userFound.password)
    if(!matchPassword)
    {
        return res.status(401).json({token:'null',message:'Contraseña Inválida'})

    }
    //retornar token si el usuario existe y su password coincide
    const token=jwt.sign({id:userFound._id},config.SECRET,{expiresIn:1800})
    res.json({roles:userFound.roles[0].toJSON().name,
                id:userFound._id,
                token})
}

export const crearEspacio = async (req, res) => {
    const {name,tipoesp}=req.body;

    const newEspFis=new EspFis({
        name,
        tipoesp
    })
   
    if (tipoesp){
        const foundTipo=await TipoFis.find({name:{$in: tipoesp}});
        let tipo = foundTipo[0].toJSON()._id
        newEspFis.tipo_espacio = tipo;
    }
    const savedEsp=await newEspFis.save();
    
    res.status(200).json({savedEsp})
}

export const dependencias = function (req, res) {
    let dependencias = Dependencia.find({});
    dependencias.exec(function (err, dependencias) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener las dependencias',
                error: err
            });
        }
        
        return res.status(200).json(dependencias);
    });
};

export const getUser = async(req, res)=>{
    const user=User.findOne({_id:req.params.id});
    user.exec((err, user) =>{
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener el user',
            });
        }
        return res.status(200).json(user);
    });
}

export const tipoEspFis = function (req, res) {
    let tiposEspFis = TipoFis.find({});
    tiposEspFis.exec(function (err, tiposEspFis) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los tipos de espacios físicos',
                error: err
            });
        }
        
        return res.status(200).json(tiposEspFis);
    });
};

export const roles = function (req, res) {
    let rolel = Role.find({});
    rolel.exec(function (err, rolel ){
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los roles',
                error: err
            });
        }
        
        return res.status(200).json(rolel);
    });
};

export const registrarUsuario=async(req,res)=>{
    const {name,ced,roles,dependencia,email,password,telefono}=req.body;

    const newUser=new User({
        name,
        ced,
        email,
        password:await User.encryptPassword(password),
        telefono
    })

    if (roles){
       const foundRoles= await Role.find({name:{$in: roles}})
       newUser.roles=foundRoles.map(role=>role._id)
    }
    else{
        const role = await Role.findOne({name:"USER"})
        newUser.roles=[role._id]
    }
    if(dependencia){
        const foundDep=await Dependencia.find({});
        
        let dep = foundDep.filter((item) => item.toJSON().id_unidad == dependencia);
        newUser.dependencia=dep[0];
    }
    
    const savedUser=await newUser.save();
    res.status(200).json({roles:savedUser.roles[0].toJSON().name})
   
}


export const espacios = function (req, res) {
    let espacios = EspFis.find({}).populate('tipo_espacio');
    espacios.exec(function (err, espacios) {
        if (err) {
            return res.status(500).json({
                message: 'Error al obtener los espacios',
                error: err
            });
        }
        
        return res.status(200).json(espacios);
    });
};
