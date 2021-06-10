exports.userMiddleware = (req, res, next) => {

    let info = {name:'Sergio', id:123};
    req.userInfo = info;
    next();
};

exports.index = (req, res) => {

    let obj = {
        pageTitle:'HOME',
        userInfo: req.userInfo
    }; 
    res.render('home', obj);
}