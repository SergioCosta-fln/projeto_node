const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.add = (req, res) => {
    res.render('postAdd');
};

exports.addAction = async (req, res) => {
    // res.json(req.body); recebe os dados em tela
    const post = new Post(req.body);

    try {
        await post.save();
    } catch(error) {
        req.flash('error', 'Ocorreu um erro! Tenta novamente mais tarde.');
        return res.redirect('/post/add');
    } 

    req.flash('success', 'Post salvo com sucesso');

    res.redirect('/');
};