const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require ('../handlers/mailHandler');

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

exports.forget = (req, res) => {
    res.render('forget');
};

exports.forgetAction = async (req, res) => {

    const html = `Testando e-mail com link:<br/><a href="${resetLink}">Resetar sua Senha</a>`;
    const text = `Testando e-mail com link: ${resetLink}`;

    // 1. Verificar se o usuario realmente existe.
    const user = await User.findOne({email:req.body.email}).exec();
    if (!user) {
        req.flash('error', 'Um e-mail foi enviado para você!');
        res.redirect('/users/forget');
        return;
    }

    // 2. Gerar um token (com data de expiração) e salvar no banco
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;   // 1 hora
    await user.save();

    // 3. Gerar link (com token) para trocar a senha
    const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

    const to = `${user.name} <${user.email}`

    // 4. Enviar o link via e-mail para o usuário
    mailHandler.send({
        to,
        subject:'Resetar sua senha',
        html,
        text
    });

    // 5. Usuário vai acessar o link e trocar a senha

    req.flash('success', 'Te enviamos um e-mail com instruções. ' + resetLink);
    res.redirect('/users/login');

};

exports.forgetToken = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() } 
    }).exec();

    if(!user) {
        req.flash('error', 'Token expirado!');
        res.redirect('/users/forget');
        return;
    }

    res.render('forgetPassword');
};

exports.forgetTokenAction = async (req, res) => {
    
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() } 
    }).exec();

    if(!user) {
        req.flash('error', 'Token expirado!');
        res.redirect('/users/forget');
        return;
    }

    if (req.body.password != req.body['password-confirm']) {
        req.flash('error', 'Senha não conferem!');
        res.redirect('back');
        return;
    }
    
    user.setPassword(req.body.password, async () => {
        await user.save();
    
        req.flash('success', 'Senha alterada com sucesso!');
        res.redirect('/');
    });
    
};