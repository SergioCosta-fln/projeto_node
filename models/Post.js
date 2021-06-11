const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    photo:String,
    title:{
        type:String,
        trim:true,
        require:'O post precisa de um título'
    },
    slug:String,
    body:{
        type:String,
        trim:true
    },
    tags:[String]
});

postSchema.pre('save', async function(next) {
    if(this.isModified('title')) {
        this.slug = slug( this.title, {lower:true} );

        // Renomeia o slug criando uma expressão regular
        const slugRegex = new RegExp(`(${this.slug})((-[0-9]{1,}$)?)$`, 'i');      // Segundo param - case sensitive

        // Consultar no Banco
        const postsWithSlug = await this.constructor.find({slug:slugRegex});

        if(postsWithSlug.length > 0) {
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;

        }
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);