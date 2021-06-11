const User = require('../models/User');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) => {
        if(!result) {
            req.flash('error', 'Seu e-mail e/ou senha estão errados!');
            res.redirect('/users/login');
            return;     // Para finalizar
        }

        req.flash('success', 'Você foi logado com sucesso!');
        res.redirect('/');
    });
};

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {
    //res.json(req.body);
    const newUser = req.body;
    User.register(newUser, req.body.password, (error) => {
        if(error) {
            req.flash('error', 'Ocorreu um erro, tente mais tarde.');
            res.redirect('/users/register');
            return;
        }

        req.flash('success', 'Registro efetuado com sucesso. Faça o login.')
        res.redirect('/users/login');
    });
};