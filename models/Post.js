const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const ObjectId = mongoose.Schema.Types.ObjectId;

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
    tags:[String],
    author:ObjectId
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

// Pegar a quantidade de tags dos posts
postSchema.statics.getTagsList = function() {

    return this.aggregate([
        { $unwind:'$tags' },        // Separar o Post por Tag
        { $group: { 
            _id: '$tags', 
            count:{ $sum:1 } 
            } 
        },                          // Somar as Tags de uma em uma
        { $sort: { count:-1 }}
    ]);
}

postSchema.statics.findPosts = function(filters = {}) {
    
    return this.aggregate([
        { $match:filters } ,
        { $lookup:{
            from:'users',
            let:{ 'author':'$author' },
            pipeline:[
                { $match:{ $expr:{ $eq:[ '$$author','$_id' ] } } },
                { $limit:1 }
            ],
            as:'author'
        } },
        { $addFields:{
            'author':{ $arrayElemAt:[ '$author', 0 ] }
        } }
    ]);
}

module.exports = mongoose.model('Post', postSchema);