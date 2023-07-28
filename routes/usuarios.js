
const { Router } = require('express');
const { usuariosGet, usuariosPOST, usuariosPUT, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', usuariosPUT)

router.post('/', usuariosPOST)

router.delete('/', usuariosDelete)

router.patch('/', usuariosPatch)

module.exports = router;