const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.userMiddleware = (req, res, next) => {

    let info = {name:'Sergio', id:123};
    req.userInfo = info;
    next();
};

exports.index = async (req, res) => {
    let obj = {
        pageTitle:'HOME'
    }
    res.render('home', obj);
};

/*
exports.indexOld = (req, res) => {

    let obj = {
        pageTitle:'HOME',
        userInfo: req.userInfo
    }; 
    res.render('home', obj);
};
*/