const helpers = {}; //obejto con multiples opciones.

//es un middleware que se ejecuta segun lo que se pase
helpers.Autenticacion = (req, res, next) =>{
    if(req.isAuthenticated ()){
        return next();
    }
    req.flash('error_msg', 'No esta autorizado');
    res.redirect('/login');
}; 

module.exports = helpers;