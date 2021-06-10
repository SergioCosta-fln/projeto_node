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
        post: []
    }

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