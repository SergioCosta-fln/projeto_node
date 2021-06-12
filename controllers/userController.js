const User = require('../models/User');

exports.login = (req, res) => {
    res.render('login');
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) => {
        if(!result) {
            req.flash('error', 'Seu e-mail e/ou senha estão errados!');
            res.redirect('/users/login');
            return;     // Para finalizar
        }

        req.login(result, ()=>{});

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

exports.profile = (req, res) => {
    res.render('profile', {});
};

exports.profileAction = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id:req.user._id },
            { name:req.body.name, email:req.body.email },
            { new:true, runValidators:true }
        );
    } catch(e) {
        req.flash('error', 'Não foi possível atualizar seus dados, tente mais tarde! ' + e.message);
        res.redirect('/profile');
        return;
    }

    req.flash('success', 'Dados atualizados com sucesso!')
    res.redirect('/profile');
};