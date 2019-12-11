const passport = require('passport');
const passLocal = require('passport-local').Strategy; //creo una estrategia de autenticación.


const User = require('../models/users');
//instancio la nueva estrategia
passport.use(new passLocal({
    usernameField: 'email' // a través de que se va autenticar
}, async(email, pass, done)=>{  //funcion para validar
   const user = await User.findOne({email: email}); //busco en la BD si existe el usuario con el correo

   if(!user){        // devuelvo error(null), usuario,  y mensaje
        return done(null, false, {message: 'Usuario no encontrado'}); //si no encuentra un usuario retorno un callaback con el mensaje
   }else{
        const resultadoAutenticacion = await user.compararPass(pass); //envio la contraseña para el metodo que cree en el modelo
        if(resultadoAutenticacion){
            return done(null, user)
        }else{
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    }
})); 

//session para guardar el usuario

passport.serializeUser((user, done)=>{ //tomo un usuario y callback, cuando un usuario se autentique 
    done(null, user.id); //paso el error y el id de usuario
});

//proceso inverso
passport.deserializeUser((id, done) =>{ 
    User.findById(id, (err ,user ) =>{ //si esciste un usuario en la session, lo devuelvo
        done(err, user);
    })
});