const mongoose = require('mongoose');
//conectar a db
mongoose.connect('mongodb://localhost/tarea', ({
    useCreateIndex: true, //estas son solo configuraciones para las nuevas actulaizaciones de mongoDB
    useNewUrlParser: true,
    useFindAndModify: false
})) 
.then(db => console.log('Db connected')) //promesas
.catch(err => console.log(err));
