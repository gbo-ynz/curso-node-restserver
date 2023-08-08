const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { json } = require('express/lib/response');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');


const login = async(req, res = response) => {


    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne( { correo } );
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }


        // SI el usuario está activo en la BD
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false '
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }


        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async( req, res = response) => {

    const { id_token } = req.body;
    console.log(id_token);

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Tengo que crearlo.
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true,
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en DB tiene  el estado como false.
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg: 'El token no se pudo verificar'
        });
    }
    

}

module.exports = {
    login,
    googleSignIn
}