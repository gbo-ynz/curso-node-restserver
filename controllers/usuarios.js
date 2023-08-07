const { response, request } = require('express');
const bcrypjs = require('bcryptjs');

const Usuario  = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    
    // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }

    const [ total, usuarios] = await Promise.all([ 
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip( Number(desde) )
        .limit( Number(limite) )
     ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPOST = async(req, res) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcrypjs.genSaltSync();
    usuario.password = bcrypjs.hashSync( password, salt );
    //Guardar en BD
    await usuario.save();

    res.json({
        msg: 'post API - Controlador',
        usuario
    });
}

const usuariosPUT =  async(req, res) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos
    if (password) {
        const salt = bcrypjs.genSaltSync();
        resto.password = bcrypjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true} );

    res.json( usuario );
}


const usuariosPatch = (req, res) => {
    res.json({
        msg: 'delete API - Controlador'
    });
}

const usuariosDelete = async(req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new:true});
    
    res.json(usuario);
}



  module.exports = {
      usuariosGet,
      usuariosPOST,
      usuariosPUT,
      usuariosDelete,
      usuariosPatch
  }