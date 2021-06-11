module.exports.isLogged = (req, res, next) => {

    if(!req.isAuthenticated()) {
        req.flash('error', 'Ops! Você não tem permissão para acessar essa página.');
        res.redirect('/users/login');
        return;
    }

    next();
};