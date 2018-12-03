const express=require("express");
const config=require('./config');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const Admin=require('./userModel');
const Post=require('./postModel');
const Category=require('./categoryModel');
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
app.get('/posts',function (req,res) {
    var count=0;
    var page=1;
    if(req.params.page){
        page=req.params.page;
    }
    var rows=20;
    var query=Post.find({});
    query.skip((page-1)*rows);
    query.limit(rows);
    query.exec(function (err,data) {
        if(err){
            res.send(err);
        }else{
            //console.log(data);
            var items=data;
            res.render('posts',{
                items:items,
                id:'posts',
                nickname:req.session.user.username,
                name:req.session.user.name,
                email:req.session.user.email,
                profile:req.session.user.profile,
                userImg:req.session.user.userImg
            });
        }
    });
   /* for(var i=0;i<100;i++){
        var ptitle='小小'+i;
        var pauthor='悠悠';
        var particle='加油加油'+i+'好的';
        var pcategory='科技';
        var ppublishTime='2018/12/1';
        var pstatus='published';
        var pvisits=i;
        var post=new Post({
            title:ptitle,
            author:pauthor,
            article:particle,
            category:pcategory,
            publishTime:ppublishTime,
            status:pstatus,
            visits:pvisits
        });
        post.save(function (err) {
            if(err){
                //console.log("插入失败");

            }
            else{
                //console.log("插入成功");
            }
        });
    }
    return res.send(true);*/
});
app.get('/categories',function (req,res) {
    Category.find(function (err,data) {
        if(err){
            console.log('查询失败');
            return res.redirect('/categories');
        }else{
            var id='categories';
            res.render(id,{
                id:id,
                nickname:req.session.user.username,
                name:req.session.user.name,
                email:req.session.user.email,
                profile:req.session.user.profile,
                userImg:req.session.user.userImg,
                categories:data
            });
        }
    });
});
app.get('/categoryDelete',function(req,res){
    //console.log(req.query.id);
   Category.remove({_id:req.query.id},function (err) {
       if(err){
           console.log('删除成功');
           return res.redirect('/categories');
       }else{
           console.log('删除成功');
           return res.redirect('/categories');
       }
   })
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
var storage = multer.diskStorage({
    //确定图片存储的位置E
    destination: function (req, file, cb){
        cb(null, path.join(__dirname,'static','img'));
    },
filename: function (req, file, cb){
    cb(null, Date.now()+'-'+file.originalname)
}
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
var upload = multer({storage: storage});
//接收上传图片请求的接口 upload.single("file")中file必须与传入参数对象中的Key值相同
app.post('/upload', upload.single('file'), function (req, res, next) {
    //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
    //线上的也就是服务器中的图片的绝对地址
    var url =req.file.filename;
    //console.log(url);
    Admin.update({'_id':req.session.user._id},{
        userImg:path.join('static','img',url)
    },function(err){
        if(err){
            console.log('图片上传失败');
            return false;
        }else{
            console.log("图片上传成功");
            //修改req中的session必须马上返回否则不会保存到数据库中
            req.session.user.userImg=path.join('static','img',url);
            return res.json({
                code : 200,
                data : req.session.user.userImg
            });
        }
    });
});
app.post('/category',function (req,res) {
    var category=new Category({
        catename:req.body.catename
    });
    Category.findOne({catename:category.catename},function(err,data){
        if(err){
            console.log("查询失败");
            return res.redirect('/categories');
        }else if(data){
            console.log("类名重复");
            return res.redirect('/categories');
        }else{
            category.save(function (err) {
                if(err){
                    console.log("保存失败");
                    return res.redirect('/categories');
                }else{
                    console.log("添加成功");
                    return res.redirect('/categories');
                }
            })
        }
    });
});
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
