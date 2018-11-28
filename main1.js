//当前项目的入口文件
// 1 加载http模块
const http=require("http");
const fs=require('fs');
const path=require('path');
const mime=require("mime");
const url=require('url');
http.createServer(function (req,res) {
   req.url=req.url.toLowerCase();
   req.method=req.method.toLowerCase();
   //console.log(req.url);
   const urlObj=url.parse(req.url,true);
   console.log(__dirname);
   if((req.url==='/'||req.url==='/signin.html')&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','signIn.html'),function (err,data) {
           if(err){
               throw err;
           }
           else{
               res.end(data);
           }
       })
   }else if(req.url==='/admin.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','admin.html'),function (err,data) {
          if(err) {
              throw err;
          }
          else{
              res.end(data);
          }
       });
   }else if(req.url==='/categories.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','categories.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/signup.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','signUp.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/profile.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','profile.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/posts.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','posts.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/passwordrest.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','passwordRest.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/comments.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','comments.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/customer.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','customer.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }else if(req.url==='/index.html'&&req.method==='get'){
       fs.readFile(path.join(__dirname,'view','index.html'),function (err,data) {
           if(err) {
               throw err;
           }
           else{
               res.end(data);
           }
       });
   }
   else if(req.url.startsWith('/static')&&req.method==='get'){
       fs.readFile(path.join(__dirname,urlObj.pathname),function (err,data) {
           if(err){
               throw err;
           }else{
               res.setHeader('Content-Type',mime.getType(req.url));
               res.end(data);
           }
       });
   }
}).listen(8080,function () {
    console.log("http://localhost:8080");
});