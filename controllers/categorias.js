const { response } = require("express");
const { json } = require("express/lib/response");
const { Categoria } = require("../models");
const usuario = require("../models/usuario");


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
        .skip( Number(desde) )
        .limit( Number(limite) )
    ]);


    res.status(200).json({
        total,
        categorias
    })

}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria);

}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La ${ categoriaDB.nombre } ya existe`
        });
    }

    // Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    
    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const id = req.params.id;
    const { estado, usuario, ...resto} = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const categoriaExiste = await Categoria.findById(id);

    // if (categoriaExiste.nombre.toUpperCase() == resto.nombre.toUpperCase()) {
    //     return res.json({
    //         msj: `Nombre de categoría ya existe en BD.`
    //     });
    // }

    const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.json(categoria);
}

// borrarCategoria - estado:false
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true});
    
    res.json(categoria);
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}