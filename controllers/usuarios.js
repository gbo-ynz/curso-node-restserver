const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {
    
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPOST = (req, res) => {

    const { nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - Controlador',
        nombre,
        edad
    });
}

const usuariosPUT =  (req, res) => {

    const id = req.params.id;

    res.status(400).json({
        msg: 'put API - Controlador',
        id
    });
}


const usuariosPatch = (req, res) => {
    res.json({
        msg: 'delete API - Controlador'
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - Controlador'
    });
}



  module.exports = {
      usuariosGet,
      usuariosPOST,
      usuariosPUT,
      usuariosDelete,
      usuariosPatch
  }