const mongoose=require('mongoose');
var AdminSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    nickname:String,
    name:String,
    profile:String
});
var Admin=mongoose.model('Admin',AdminSchema);
module.exports=Admin;
