const express = require('express');
const router = express.Router();

const User = require('../models/users'); //requiero schema user
const passport = require('passport'); //necestio traer los metodos de autenticacion


router.get('/login', (req, res) =>{
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/todas-tareas',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/registro', (req, res) =>{
    res.render('users/registro');
});

router.post('/users/registrar-users', async(req, res) =>{
    const {nombre, email, password, password2} = req.body;
    const errors = [];
    if(nombre.length < 0){
        errors.push({text:'Ingrese su Nombre'});
    }

    if(password != password2){
        errors.push({text:'Las contraseñas no coinciden'});
    }
    if(password < 4){
        errors.push({text:'La contraseña debe ser mayor a 4 digitos'});
        
    }
    if(errors.length > 0){
        res.render('users/registro', {
            errors,
            nombre,
            email,
            password,
            password2
        })
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'Email ya registrado'); 
            res.redirect('/users/registrar-users');
        }

        const user = new User({nombre, email, password});
        user.password = await user.encriptPass(password);
        await user.save();
        req.flash('success_msg', 'Estas registrado');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/');
});

module.exports = router; // puedo exportar todas las rutas.