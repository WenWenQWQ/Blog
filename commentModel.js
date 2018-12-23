const mongoose=require('mongoose');
const config=require('./config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
var CommentSchema=new mongoose.Schema({
    title:String,
    fpId:String,
    user:String,
    content:String,
    time:String,
    status:String
});
const Comment=mongoose.model('Comment',CommentSchema);
module.exports=Comment;
