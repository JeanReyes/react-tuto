const mongoose = require('mongoose');
const Schema = mongoose.Schema; //creo el esquema que tendra mi modelo o tarea
const encript = require('bcryptjs');

const UserSchema = new Schema ({
    nombre: String,
    email: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean, //para definir que estado sera en falso por defecto
        default: false
    }
});

UserSchema.methods.encriptPass = async(pass)=>{ //metodo para encriptar
   const salt = await encript.genSalt(10); //genero el hash para encriptar
   const hash = encript.hash(pass, salt);
   return hash;
};

UserSchema.methods.compararPass = async function(pass){ //comparo la contraseña ingresada con la de mongoDB
    return await encript.compare(pass, this.password);
};

module.exports = mongoose.model('user', UserSchema); //especie de mapeo para que se almacene en mongo DB