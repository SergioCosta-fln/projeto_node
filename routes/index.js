const { query } = require('express');
const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
const router = express.Router();
router.get('/', homeController.userMiddleware, homeController.index);
router.get('/users/login', userController.login);
router.post('/users/login', userController.loginAction);
router.get('/users/logout', userController.logout);

router.get('/users/register', userController.register);
router.post('/users/register', userController.registerAction);

router.get('/users/forget', userController.forget);
router.post('/users/forget', userController.forgetAction);

router.get('/users/reset/:token', userController.forgetToken);
router.post('/users/reset/:token', userController.forgetTokenAction);

router.get('/profile', authMiddleware.isLogged, userController.profile);
router.post('/profile', authMiddleware.isLogged, userController.profileAction);

router.post('/profile/password', authMiddleware.isLogged, authMiddleware.changePassword);

router.get('/post/add', 
    authMiddleware.isLogged, 
    postController.add
);
router.post('/post/add',            // recebimento da ação
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.addAction
); 

router.get('/post/:slug/edit', 
    authMiddleware.isLogged,
    postController.edit
); // Editar um registro
router.post('/post/:slug/edit', 
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.editAction
); // Salvar um regitro editado

router.get('/post/:slug', postController.view);

module.exports = router;