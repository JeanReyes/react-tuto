const mongoose = require('mongoose');
const Schema = mongoose.Schema; //creo el esquema que tendra mi modelo o tarea

const Tarea = new Schema ({
    nombre: String,
    descripcion: String,
    date: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean, //para definir que estado sera en falso por defecto
        default: false
    },
    user: String
});

module.exports = mongoose.model('tarea', Tarea); //especie de mapeo para que se almacene en mongo DB