const express = require('express');
const router = express.Router();

const Tarea = require('../models/tarea'); //requiero schema tareas
const { Autenticacion } = require('../helpers/auth'); //para poder validar el usuario y solo muestre lo que el tiene que ver

router.get('/tareas',Autenticacion, async(req, res) =>{
    const tareas = await Tarea.find({user: req.user.id}).sort({date: 'desc'});
    res.render('tareas/nueva-tarea',{
        tareas
    });
});

//async await permite ejecutar eventos asincronos como almacenado de datos
router.post('/add',Autenticacion, async(req, res) =>{
    
    const {nombre, descripcion} = req.body;
    const errors = []; //guardo los errores

    if(!nombre){
        errors.push({text:'Por favor agregue un titulo'});
    }
    if(!descripcion){
        errors.push({text:'Por favor agregue una descripción'});
    }
    if (errors.length > 0){
        res.render('tareas/nueva-tarea',{
            errors,
            nombre,
            descripcion
        })
    }else{
        const tarea = new Tarea(req.body);
        //antes de guardar la nota lo relaciono con el usuario autenticado.
        tarea.user = req.user.id; 

        await tarea.save();
        req.flash('success_msg', 'Nota guardada con exito');
        res.redirect('/todas-tareas'); //redirect es para las rutas.
    }
});

router.get('/todas-tareas',Autenticacion, async(req, res) =>{
    const tareas = await Tarea.find({user: req.user.id}).sort({date: 'desc'}); //trae solo las notas con las que el usaurio se autehnticado
    res.render('tareas/notas',{
        tareas
    });
})

router.get('/notas/edit/:id',Autenticacion, async(req, res) =>{
    const { id } = req.params; //obtengo el id
    const tarea = await Tarea.findById(id);
    res.render('tareas/edit-tarea',{
        tarea
    });
});

router.put('/notas/edit-tarea/:id',Autenticacion, async(req, res)=>{
    const {nombre, descripcion} = req.body;
    await Tarea.findByIdAndUpdate(req.params.id, {nombre, descripcion});
    req.flash('success_msg', 'Nota Actulaizada con exito');
    res.redirect('/todas-tareas');
})

router.get('/estado/:id',Autenticacion, async(req, res) =>{
    const { id } = req.params; //obtengo el id
    const tarea = await Tarea.findById(id);
    tarea.estado = !tarea.estado;
    await tarea.save();
    res.redirect('/');
});

router.delete('/notas/delete/:id',Autenticacion, async(req, res) =>{
    await Tarea.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota Eliminada con exito');
    res.redirect('/todas-tareas');
});

// router.get('/delete/:id', async(req, res) =>{
//     const { id } = req.params; //obtengo el id
//     await Tarea.remove({_id: id});
//     res.redirect('/');
// });


module.exports = router; // puedo exportar todas las rutas.