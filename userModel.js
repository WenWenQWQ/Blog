const mongoose=require('mongoose');
const config=require('./config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
var AdminSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    name:String,
    profile:String
});
var Admin=mongoose.model('Admin',AdminSchema);
module.exports=Admin;
