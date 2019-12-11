// init --yes hace la configuracion inicial del package.json
// express escribe el codigo del servidor de node
// mongoose conecta la app a MongoDB
// ejs motor de plantillas html
// morgan entrega las peticiones que se hacen al servidor
// nodemon -D es para guardar los cambios en tiempo real sin necesidad de reiniciar el serve

// las const de los modulos deben llamarse exactamente como el modulo

const path = require('path'); //modulo que se encarga de unir directorios
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const body_parser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport'); //valida usuario

const app = express(); //inicio el servidor
require('./database');
require('./confing/passport');


//static files 
app.use(express.static(path.join(__dirname + '/public'))); //aqui redirecciono todos los archivos CSS javascrits imagenes

//settings
app.set('port', process.env.PORT || 3000); //define el puerto del servidor,
app.set('views', path.join(__dirname + '/views')); //indico donde estaran las vistas
app.engine('.hbs', exphbs({
    defaultLayout:'index', //plantilla principal de la app
    layoutsDir: path.join(app.get('views'), 'layouts'),  //direccion de la plantilla principal 
    partialsDir:path.join(app.get('views'), 'partials'),
    extname:'.hbs'
}));

app.set('view engine', '.hbs'); 

//app.set('view engine', 'ejs'); 

//middlewares procesan datos antes que lleguen a su destino
//app.use(morgan('dev')); //antes que los datos lleguen, los muestro por consola un log
app.use(express.urlencoded({extended: false})); //sirve para entender los datos que envia un formulario
app.use(methodOverride('_method')); //para que los formularios puedan enviar otros tipos de metodos
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
   //inicio la session de express con el usuario

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //para los mensajes flash de passport
    res.locals.user = req.user || null; //guardo el usuario en una variable global, si no existe queda null
    next();
});

//routes

//import routes
app.use(require('./routes/tareas'));
app.use(require('./routes/users'));
app.use(require('./routes/index'));

//starting the server
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
})