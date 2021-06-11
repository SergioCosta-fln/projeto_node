const { query } = require('express');
const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const imageMiddleware = require('../middlewares/imageMiddleware');

// Rotas
const router = express.Router();
router.get('/', homeController.userMiddleware, homeController.index);
router.get('/users/login', userController.login);
router.post('/users/login', userController.loginAction);
router.get('/users/logout', userController.logout);

router.get('/users/register', userController.register);
router.post('/users/register', userController.registerAction);


router.get('/post/add', postController.add);
router.post('/post/add',            // recebimento da ação
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.addAction
); 

router.get('/post/:slug/edit', postController.edit); // Editar um registro
router.post('/post/:slug/edit', 
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.editAction
); // Salvar um regitro editado

router.get('/post/:slug', postController.view);

module.exports = router;