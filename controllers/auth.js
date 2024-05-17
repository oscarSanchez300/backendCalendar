const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const createUser = async( req, res = response ) => {

    const { email, password } = req.body;


    try {

        let usuario = await Usuario.findOne({email});
        console.log(usuario);

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta en uso',
            });
        } 

        usuario = new Usuario( req.body );

        // Eccriptar contraseña
        const salt  = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }

    
}


const loginUser = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({email});
        console.log(usuario);

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            });
        } 

        // Confirmar las contraseñas
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })


        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
    
    
}

const renewToken = async( req, res = response ) => {

    const { uid, name } = req;
    
    // Generar JWT
    const token = await generarJWT( uid, name );


    res.json({
        ok: true,
        token,
    });

}

module.exports = {
   createUser,
   loginUser,
   renewToken,
}