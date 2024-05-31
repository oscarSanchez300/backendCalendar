const { response } = require('express');
const Evento = require('../models/Evento');



const getEventos = async(req, res = response) => {

    try {

        const eventos = await Evento.find()
                                    .populate('user', 'name');
    
        res.json({
            ok: true,
            eventos
        });
        
    } catch (error) {
        console.log(error);
        res.status(5000).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }


}

const crearEVento = async(req, res = response) => {

    console.log(req.body);

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok : false,
            msg: 'Hable con le administrador',
        })
    }

  

}

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId); 

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar el evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId); 

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar el evento'
            });
        }

        const eventoBorrado = await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
            evento: eventoBorrado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}



module.exports = {
    getEventos,
    crearEVento,
    actualizarEvento,
    eliminarEvento,
}