const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage:multer.memoryStorage(),         // Onde salvar a imagem
    fileFilter:(req, file, next) => {        // Tipo de arquivo permitido a ser gravado
        const allowed = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]; 

        // Verificar se o tipode arquivo é permitido
        if(allowed.includes(file.mimetype)) {
            next(null, true);
        } else {
            next({message:'Arquivo não suportado!'}, false);
        }
    }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {

    // Se não houver um arquivo no requisição
    if(!req.file) {
        next();
        return;
    }

    // Caso contrário continua e faz o processo de risez do arquivo
    
    // Nome do arquivo - pegar primeiro a extensão do arquivo
    const ext = req.file.mimetype.split('/')[1];

    // Gerar o nome para esse arquivo
    // let filename = `nome.ext`;
    // v4 -> função do uuid para criar o nome do arquivo - has único
    let filename = `${uuid.v4()}.${ext}`;

    // Passar o nome do arquivo para a nossa requisição para passar ao controller
    req.body.photo = filename;

    // Fazer o resize da photo
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);         // Largura 800px - Altura automática (proporcional a altura)

    // Depois de redimensionada, vamos salvar a imagem agora
    // await photo.write('./public/media/' + filename);
    // Ou usando template string
    await photo.write(`./public/media/${filename}`);

    next();

};