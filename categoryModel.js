const mongoose=require('mongoose');
const config=require('./config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
var CategorySchema=new mongoose.Schema({
    catename:String
});
var Category=mongoose.model('Category',CategorySchema);
module.exports=Category;