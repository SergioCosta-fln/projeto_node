const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage:multer.memoryStorage(),         // Onde salvar a imagem
    fileFilter:(req, res, next) => {        // Tipo de arquivo permitido a ser gravado
        const allowed = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]; 

        // Verificar se o tipode arquivo é permitido
        if(allowed.includes(file.mimetype)) {
            next(null, true);
        } else {
            next({}, false);
        }
    }
};

exports.upload = multer();

exports.resize = () => {};