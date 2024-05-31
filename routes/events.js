/*
    Rutas de eventos / AUTH
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { fieldsValidator } = require('../middlewares/fields-validator'); 
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEVento, actualizarEvento, eliminarEvento } = require('../controllers/events');
 
const router = Router();

// Validar por JWT
router.use(validarJWT);

//Obtener todos los eventos
router.get('/', getEventos);

//Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'Titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalización es obligatorio').custom(isDate),
        fieldsValidator,
    ],
    crearEVento
);  

//Actualizar evento
router.put('/:id',
[
    check('title', 'Titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom(isDate),
    check('end', 'Fecha de finalización es obligatorio').custom(isDate),
    fieldsValidator,
],
actualizarEvento);

//Borrar evento
router.delete('/:id', eliminarEvento);


module.exports = router;

