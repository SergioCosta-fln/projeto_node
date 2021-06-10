const { query } = require('express');
const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

// Rotas
const router = express.Router();
router.get('/', homeController.userMiddleware, homeController.index);
router.get('/users/login', userController.login);
router.get('/users/register', userController.register);
router.get('/post/add', postController.add);
router.post('/post/add', postController.addAction); // recebimento da ação
router.get('/post/:slug/edit', postController.edit); // Editar um registro
router.post('/post/:slug/edit', postController.editAction); // Salvar um regitro editado

module.exports = router;