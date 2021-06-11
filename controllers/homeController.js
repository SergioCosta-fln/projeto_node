const { response, query } = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.userMiddleware = (req, res, next) => {

    let info = {name:'Sergio', id:123};
    req.userInfo = info;
    next();
};


exports.index = async (req, res) => {
    let responseJson = {
        pageTitle:'HOME',
        post: [],
        tags: [],
        tag: ''
    }

    // Busca as tags de acordo com a que foi selecionada
    responseJson.tag = req.query.t;

    // Post - nosso Model
    const tags = await Post.getTagsList();

    for(let i in tags) {
        if(tags[i]._id == responseJson.tag) {
            tags[i].class = "selected";
        }
    }
    
    responseJson.tags = tags;

    

    const posts = await Post.find();
    responseJson.posts = posts;

    res.render('home', responseJson);
}

/*
exports.index = (req, res) => {

    let obj = {
        pageTitle:'HOME',
        userInfo: req.userInfo
    }; 
    res.render('home', obj);
}
*/