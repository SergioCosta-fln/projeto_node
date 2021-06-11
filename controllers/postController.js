const mongoose = require('mongoose');
const slug = require('slug');
const Post = mongoose.model('Post');

exports.view = async (req, res) => {

    // 1. Pegar as informações do registro que será editado
    const post = await Post.findOne({ slug:req.params.slug });

    res.render('view', { post });
};

exports.add = (req, res) => {
    res.render('postAdd');
};

exports.addAction = async (req, res) => {
    
    req.body.tags = req.body.tags.split(',').map(tag=>tag.trim());
    const post = new Post(req.body);

    try{
        await post.save();
    } catch(error) {
        req.flash('error', 'Ocorreu um erro! Tente mais tarde');
        return res.redirect('/post/add');
    }
    
    req.flash('success', 'Post salvo com sucesso');

    res.redirect('/');
};

exports.edit = async (req, res) => {

    // 1. Pegar as informações do registro que será editado
    const post = await Post.findOne({ slug:req.params.slug });

    // 2. Carregar o formulário de edição
    res.render('postEdit', { post:post });
  
};

exports.editAction = async (req, res) => {

    req.body.slug = slug(req.body.title, {lower:true});
    req.body.tags = req.body.tags.split(',').map(tag=>tag.trim());

    // Procurar o item enviado -  Pegar os dados e atualizar
    try {
        const post = await Post.findOneAndUpdate(
            { slug:req.params.slug },
            req.body,
            { 
                new:true,   // Retornar NOVO item atualizado
                runValidators:true  // Força a validação dos campos de acordo com o modelo
            }
        );
        } catch(error) {
            req.flash('error', 'Ocorreu um erro! Tente novamente mais tarde');
            return res.redirect('/post/'+req.params.slug+'/edit');
        }
   
    // Mostrar a mensagem de sucesso
    req.flash('success', 'Post atualizado com sucesso!')

    // Redirecionar para a HOME
    res.redirect('/');
};