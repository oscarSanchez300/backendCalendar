
/*
Rutas de usuarios / AUTH
host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.post(
    '/new',
    [  // middlewares
        check('name', 'Nombre el obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de minimo 6 caracteres').isLength({ min:6 }),
        fieldsValidator
    ],
    createUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de minimo 6 caracteres').isLength({ min:6 }),
        fieldsValidator
    ], 
    loginUser
);


router.get('/renew', validarJWT, renewToken);


module.exports = router;