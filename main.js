const express=require("express");
const config=require('./config');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const Admin=require('./userModel');
const Post=require('./postModel');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const app=express();
app.set('view engine','ejs');
app.use('/static',express.static('static'));
/*app.get('/',function (req,res) {
    res.render('index');
});
app.get('/admin',function (req,res) {
    res.render('admin');
});
app.get('/categories',function (req,res) {
    res.render('categories');
});
app.get('/comments',function (req,res) {
    res.render('comments');
});
app.get('/customers',function (req,res) {
    res.render('customers');
});
app.get('/passwordRest',function (req,res) {
    res.render('passwordRest');
});
app.get('/posts',function (req,res) {
    res.render('posts');
});
app.get('/profile',function (req,res) {
    res.render('profile');
});
app.get('/',function (req,res) {
    fs.readFile(path.join(__dirname,'view','signIn.html'),function (err,data) {
        if(err){
            throw err;
        }else{
            res.end(data);
        }
    })
});
app.get('/signIn',function (req,res) {
    fs.readFile(path.join(__dirname,'view','signIn.html'),function (err,data) {
        if(err){
            throw err;
        }else{
            res.end(data);
        }
    })
});
app.get('/signUp',function (req,res) {
    fs.readFile(path.join(__dirname,'view','signUp.html'),function (err,data) {
        if(err){
            throw err;
        }else{
            res.end(data);
        }
    })
});*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    name:'Blog',
    secret:'Blog',
    cookie:{maxAge:6000000},
    store:new MongoStore({url:'mongodb://localhost/Blog'}),
    resave:false,
    saveUninitialized:true
}));
app.get('/',function (req,res) {
    res.render('signIn');
});
app.get('/:index',function (req,res) {
    var id=req.params.index;
    if(id==='favicon.ico'){
    }else if(id==='logout'){
        req.session.user=null;
        res.redirect('/signIn');
    }else if(id==='signIn'||id==='signUp'){
        res.render(id);
    }else{
        res.render(id,{
            id:id,
            nickname:req.session.user.username,
            name:req.session.user.name,
            email:req.session.user.email,
            profile:req.session.user.profile
        });
    }
});
app.post('/passwordRest',function(req,res){
    Admin.update({'_id':req.session.user._id,'password':req.body.oldword},{
        password:req.body.newword
    },function(err,data){
        if(err){
            console.log("更新失败");
        }else if(data.n===0){
            console.log("初始密码错误");
        }else {
            //console.log(req.body.oldword);
            console.log("更新成功");
            req.session.user.password=req.body.newword;
            return res.redirect('/passwordRest');
        }
    })
});
app.post('/profile',function (req,res) {
    Admin.findByIdAndUpdate(req.session.user._id,{
        username:req.body.nickname,
        email:req.body.email,
        name:req.body.name,
        profile:req.body.bio
    },function (err,data) {
        if(err){
            console.log('更新失败');
        }else{
            console.log('更新成功');
            //console.log(data);
            req.session.user.username=req.body.nickname;
            req.session.user.email=req.body.email;
            req.session.user.name=req.body.name;
            req.session.user.profile=req.body.bio;
            return res.redirect('/profile');
        }
    });
});
app.post('/signUp',function (req,res) {
   var admin=new Admin({
       username:req.body.user,
       password:req.body.password,
       email:req.body.email
   });
   Admin.findOne({'username':admin.username},function (err,data) {
       if(err){
           console.log("有错");
           return res.redirect('/signUp');
       }
       if(data!==null){
           console.log('该用户已经存在');
           return res.redirect('/signUp');
       }else{
           admin.save(function (err) {
               if(err){
                   console.log(err);
                   return res.redirect('/signIn');
               }
               console.log('注册成功');
           })
       }
   })
});
app.post('/signIn',function (req,res) {
    Admin.findOne({'username':req.body.username},function (err,data) {
        if(err){
            console.log('查询有误');
            res.redirect('/signIn');
        }
        if(data===null){
            console.log("用户不存在");
            res.redirect('/signIn');
        }
        if(data.password!==req.body.password){
            console.log("密码错误");
            res.redirect('/signIn');
        }
        req.session.user=data;
        res.redirect('/index');
    })
});
app.listen(config.port,function () {
    console.log("http://localhost:8080")
});
