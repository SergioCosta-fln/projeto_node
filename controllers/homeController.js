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
    };

    //console.log(req.user);
    // Busca as tags de acordo com a que foi selecionada
    responseJson.tag = req.query.t;
    const postFilter = (typeof responseJson.tag != 'undefined') ? {tags:responseJson.tag}: {};

    // Post - nosso Model
    /*
    const tags = await Post.getTagsList();
    const posts = await Post.find(postFilter);
    */

    const tagsPromise = Post.getTagsList();
    const postsPromise = Post.find(postFilter);

    // Cria um grupo de Promises
    /*
    const result = await Promise.all([
        tagsPromise,
        postsPromise
    ]);

    const tags = result[0];
    const posts = result[1];
    */

    const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);
    
    for(let i in tags) {
        if(tags[i]._id == responseJson.tag) {
            tags[i].class = "selected";
        }
    }
    
    responseJson.tags = tags;

    

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