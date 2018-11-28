const mongoose=require('mongoose');
const config=require('./config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const PostSchema=new mongoose.Schema({
    title:String,
    author:String,
    article:String,
    publishTime:String,
    visits:Number
});
const Post=mongoose.model('Post',PostSchema);
module.exports=Post;