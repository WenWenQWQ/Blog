const express=require("express");
const config=require('./config');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const Admin=require('./userModel');
const Post=require('./postModel');
const fs=require('fs');
const path=require('path');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const formidable=require('formidable');
const multer=require('multer');
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
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
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
            profile:req.session.user.profile,
            userImg:req.session.user.userImg
        });
    }
});
/*var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'/static/img');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.fieldname);
    }
});
const upload=multer({storage:storage});
app.post('/upload',upload.single('file'),function(req,res){
    var url='/static/img'+req.file.filename;
    console.log(url);
   res.json({
       code:200,
       data:url
   })
});*/
var storage = multer.diskStorage({
    //确定图片存储的位置
    destination: function (req, file, cb){
        cb(null, path.join(__dirname,'static','img'));
    },
filename: function (req, file, cb){
    cb(null, Date.now()+'-'+file.originalname)
}
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
var upload = multer({storage: storage});
//接收上传图片请求的接口
app.post('/upload', upload.single('file'), function (req, res, next) {
    //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
    //线上的也就是服务器中的图片的绝对地址
    var url =req.file.filename;
    console.log(url);
    Admin.update({'_id':req.session.user._id},{
        userImg:path.join('static','img',url)
    },function(err){
        if(err){
            console.log('图片上传失败');
        }else{
            console.log("图片上传成功");
            req.session.user.userImg=path.join('static','img',url);
        }
    });
    res.json({
        code : 200,
        data : path.join('static','img',url)
    })
});
/*app.post('/upload',function (req,res) {
   var imgPath=path.join(__dirname,'static','img');
   if(!fs.exists(imgPath)){
       fs.mkdir(imgPath,function (err) {
           if(err){
               console.log('目录创建失败');
               return false;
           }
           console.log("目录创建成功");
       });
   }
   var form=new formidable.IncomingForm();//创建上传表单
    form.encoding='utf-8';//设置编码格式
    form.upload=imgPath;//设置文件上传目录
    form.keepExtensions=true;//保留后缀
    form.maxFieldsSize=2*1024*1024;//文件大小
    form.type=true;
    console.log(req.body);
    form.parse(req,function (err,fields,files) {
        if(err){
            console.log(err);
            req.flash('error','图片上传失败');
        }
        var file=files.userImg;
        if(file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif' && file.type !== 'image/jpg'){
            console.log('上传文件格式错误，只支持png,jpeg,gif');
            req.flash('error','上传文件格式错误，只支持png,jpeg,gif');
            return res.redirect('/upload');
        }
        let newName=Date.now()+'.'+file.type;
        let newPath=path.join(imgPath,newName);
        console.log(files.userImg.path);
        console.log(imgPath);
        fs.rename(files.userImg.path,newPath,function(err,fil){
            if(err){
                console.log('重命名失败');
            }else{
                console.log('重命名成功');
            }
        });
        console.log(newPath);
        Admin.update({'_id':req.session.user._id},{
            userImg:path.join('static','img',newName)
        },function (err,data) {
            if(err){
                console.log('更新失败');
                return res.send(false);
            }else{
                console.log('更新成功');
                req.session.user.userImg=path.join('static','img',newName);
                return res.send(true);
            }
        });
    })
});*/
app.post('/avatar',function (req,res) {
    Admin.findOne({'username':req.body.username},function (err,data) {
        if(err){
            console.log(req.get('username'));
        }else{
            res.send(data.userImg);
        }
    });
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
       email:req.body.email,
       userImg:path.join('static','img','default.png')
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
