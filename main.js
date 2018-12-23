const express=require("express");
const config=require('./config');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const Admin=require('./userModel');
const Post=require('./postModel');
const Comment=require('./commentModel');
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
app.get('/posts',checkLogin,function (req,res) {
    if(req.query.id){
        var ids=req.query.id.split(",");
        ids.forEach(function (id) {
            Post.deleteOne({_id:id},function (err) {
                if(err){
                    console.log(id+'删除失败');
                }else{
                    console.log(id+'删除成功');
                }
            });
        });
    }
    var page=1;
    if(req.query.page){
        page=parseInt(req.query.page);
    }
    var active={};
    active['category']='all';
    active['status']='all';
    var queryTerms={};
    if(req.query.category&&req.query.category!=='all'){
        queryTerms['category']=req.query.category;
        active['category']=req.query.category;
    }
    if(req.query.status&&req.query.status!=='all'){
        queryTerms['status']=req.query.status;
        active['status']=req.query.status;
    }
    var catedata=[];
    Category.find(function (err,data) {
        if(err){
            console.log("查询分类错误");
        }else{
            //console.log(data);
            catedata=data;
            var rows=20;
            var query=Post.find(queryTerms);
            query.skip((page-1)*rows);
            query.limit(rows);
            query.exec(function (err,data) {
                if(err){
                    res.send(err);
                }else{
                    //console.log(data);
                    var items=data;
                    Post.find(queryTerms,function (err,data) {
                        var count=data.length;
                        var pageSum=Math.ceil(count/rows);
                        //console.log(pageSum);
                        var begin=1;
                        var end=1;
                        if(pageSum<=5){
                            end=pageSum;
                        }else if(page<3){
                            end=5;
                        }else{
                            if(page-2<1){
                                begin=1;
                            }else{
                                begin=page-2;
                            }
                            if(page+2>pageSum){
                                end=pageSum;
                            }else{
                                end=page+2;
                            }
                        }
                        //console.log(begin,end);
                        var activePage=page;
                        res.render('posts',{
                            activePage:activePage,
                            begin:begin,
                            end:end,
                            active:active,
                            categories:catedata,
                            items:items,
                            id:'posts',
                            nickname:req.session.user.username,
                            name:req.session.user.name,
                            email:req.session.user.email,
                            profile:req.session.user.profile,
                            userImg:req.session.user.userImg
                        });
                    });
                }
            });
        }
    });
    //console.log(catedata);

    /*for(var i=60;i<80;i++){
        var ptitle='小小'+i;
        var pauthor='悠悠';
        var particle='加油加油'+i+'好的';
        var pcategory='爱生活';
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
app.get('/categories',checkLogin,function (req,res) {
    if(req.query.id){
        var ids=req.query.id.split(',');
        //console.log(id);
        ids.forEach(function (id) {
            Category.deleteOne({_id:id},function (err,data) {
                if(err){
                    console.log('删除失败');
                }else{
                    console.log('删除成功');
                }
            });
        });
    }
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
/*app.get('/categoryDelete',function(req,res){
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
app.get('/cbdelete',function (req,res) {
    var ids=req.query.id.split(',');
    //console.log(id);
    ids.forEach(function (id) {
        Category.deleteOne({_id:id},function (err,data) {
            if(err){
                console.log('删除失败');
            }else{
                console.log('删除成功');
            }
        });
    });
    return res.redirect('/categories');
});*/
/*app.get('/postDelete',function (req,res) {
   var ids=req.query.id.split(",");
   ids.forEach(function (id) {
      Post.deleteOne({_id:id},function (err) {
          if(err){
              console.log(id+'删除失败');
          }else{
              console.log(id+'删除成功');
          }
      });
   });
   return res.redirect('/posts');
});*/
app.get('/admin',checkLogin,function (req,res) {
    if(req.query.id){
        var ids=req.query.id.split(',');
        ids.forEach(function (id) {
            Admin.remove({_id:id},function (err) {
                if(err){
                    console.log('删除失败');
                }else{
                    console.log("删除成功");
                }
            })
        })
    }
    var obj={};
    obj['identity']='管理员';
    if(req.query.username){
        obj['username']=req.query.username;
    }
    var page=1;
    var rows=20;
    if(req.query.page){
        page=req.query.page;
    }
    var query=Admin.find(obj);
    query.skip((page-1)*rows);
    query.limit(rows);
    query.exec(function (err,data) {
        if(err){
            console.log('分页错误');
        }else{
            var admins=data;
            Admin.find(obj,function (err,data) {
                var count=data.length;
                var pageSum=Math.ceil(count/rows);
                var activePage=page;
                var begin=1;
                var end=1;
                if(pageSum<=5){
                    end=pageSum;
                }else if(page<3){
                    end=5;
                }else{
                    if(page-2<1){
                        begin=1;
                    }else{
                        begin=page-2;
                    }
                    if(page+2>pageSum){
                        end=pageSum;
                    }else{
                        end=page+2;
                    }
                }
                return res.render('admin',{
                    begin:begin,
                    end:end,
                    activePage:activePage,
                    id:'admin',
                    admins:admins,
                    nickname:req.session.user.username,
                    name:req.session.user.name,
                    email:req.session.user.email,
                    profile:req.session.user.profile,
                    userImg:req.session.user.userImg
                })
            })
        }
    });
   /*Admin.find(obj,function (err,data) {
       if(err){
           console.log('查询错误');
           return false;
       }else{
           var admins=data;
           return res.render('admin',{
               id:'admin',
               admins:admins,
               nickname:req.session.user.username,
               name:req.session.user.name,
               email:req.session.user.email,
               profile:req.session.user.profile,
               userImg:req.session.user.userImg
           })
       }
   })*/
});
app.get('/customers',checkLogin,function (req,res) {
    if(req.query.id){
        var ids=req.query.id.split(',');
        ids.forEach(function (id) {
            Admin.remove({_id:id},function (err) {
                if(err){
                    console.log('删除失败');
                }else{
                    console.log("删除成功");
                }
            })
        })
    }
    var obj={};
    obj['identity']='用户';
    if(req.query.username){
        obj['username']=req.query.username;
    }
    var page=1;
    var rows=20;
    if(req.query.page){
        page=req.query.page;
    }
    var query=Admin.find(obj);
    query.skip((page-1)*rows);
    query.limit(rows);
    query.exec(function (err,data) {
        if(err){
            console.log('分页错误');
        }else{
            var customers=data;
            Admin.find(obj,function (err,data) {
                var count=data.length;
                var pageSum=Math.ceil(count/rows);
                var activePage=page;
                var begin=1;
                var end=1;
                if(pageSum<=5){
                    end=pageSum;
                }else if(page<3){
                    end=5;
                }else{
                    if(page-2<1){
                        begin=1;
                    }else{
                        begin=page-2;
                    }
                    if(page+2>pageSum){
                        end=pageSum;
                    }else{
                        end=page+2;
                    }
                }
                return res.render('customers',{
                    begin:begin,
                    end:end,
                    activePage:activePage,
                    id:'customers',
                    customers:customers,
                    nickname:req.session.user.username,
                    name:req.session.user.name,
                    email:req.session.user.email,
                    profile:req.session.user.profile,
                    userImg:req.session.user.userImg
                })
            })
        }
    });
   /* Admin.find(obj,function (err,data) {
        if(err){
            console.log('查询错误');
            return false;
        }else{
            var admins=data;
            return res.render('admin',{
                id:'admin',
                admins:admins,
                nickname:req.session.user.username,
                name:req.session.user.name,
                email:req.session.user.email,
                profile:req.session.user.profile,
                userImg:req.session.user.userImg
            })
        }
    })*/
});
app.get('/comments',checkLogin,function (req,res) {
    if(req.query.id){
        var ids=req.query.id.split(',');
        ids.forEach(function (id) {
            Comment.remove({_id:id},function (err) {
                if(err){
                    console.log('删除失败');
                }else{
                    console.log("删除成功");
                }
            })
        })
    }
    if(req.query.statusY){
        Comment.update({_id:req.query.statusY},{
            status:'批准'
        },function (err) {
            if(err){
                console.log('批准更新失败');
            }else{
                console.log('批准更新成功');
            }
        })
    }
    if(req.query.statusN){
        Comment.update({_id:req.query.statusN},{
            status:'驳回'
        },function (err) {
            if(err){
                console.log('驳回更新失败');
            }else{
                console.log('驳回更新成功');
            }
        })
    }
    var obj={};
    if(req.query.classification&&req.query.classification!=='all'){
        obj[req.query.classification]=req.query.search;
    }
    var page=1;
    if(req.query.page){
        page=req.query.page;
    }
    var rows=20;
    var query=Comment.find(obj);
    query.skip((page-1)*rows);
    query.limit(rows);
    query.exec(function (err,data) {
        if(err){
            console.log("查询错误");
        }else{
            var comments=data;
            Comment.find(obj,function (err,data) {
                var count=data.length;
                var pageSum=Math.ceil(count/rows);
                //console.log(pageSum);
                var begin=1;
                var end=1;
                if(pageSum<=5){
                    end=pageSum;
                }else if(page<3){
                    end=5;
                }else{
                    if(page-2<1){
                        begin=1;
                    }else{
                        begin=page-2;
                    }
                    if(page+2>pageSum){
                        end=pageSum;
                    }else{
                        end=page+2;
                    }
                }
                //console.log(begin,end);
                var activePage=page;
               // console.log(activePage);
                return res.render('comments',{
                    activePage:activePage,
                    begin:begin,
                    end:end,
                    id:'comments',
                    comments:comments,
                    nickname:req.session.user.username,
                    name:req.session.user.name,
                    email:req.session.user.email,
                    profile:req.session.user.profile,
                    userImg:req.session.user.userImg
                })
            })
        }
    });
   /* Comment.find(obj,function (err,data) {
        if(err){
            console.log('查询错误');
            return false;
        }else{
            var comments=data;
            return res.render('comments',{
                id:'comments',
                comments:comments,
                nickname:req.session.user.username,
                name:req.session.user.name,
                email:req.session.user.email,
                profile:req.session.user.profile,
                userImg:req.session.user.userImg
            })
        }
    })*/
    /*for(var i=10;i<50;i++){
       var ptitle='小小'+i;
       var pfId='';
       var puser='佳佳';
       var pcontent='加油加油'+i+'好的';
       var ptime='2018/12/1';
       var pstatus='未批准';
       var comment=new Comment({
           title:ptitle,
           fpId:pfId,
           user:puser,
           content:pcontent,
           time:ptime,
           status:pstatus
       });
       comment.save(function (err) {
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

app.post('/category',checkLogin,function (req,res) {
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
            if(data===null){
                res.send('/static/img/default.png');
            }else{
                res.send(data.userImg);
            }
        }
    });
});
app.post('/passwordRest',checkLogin,function(req,res){
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
app.post('/profile',checkLogin,function (req,res) {
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
       userImg:path.join('static','img','default.png'),
       identity:'管理员'
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
               }
               console.log('注册成功');
               return res.redirect('/signIn');
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
function checkLogin(req,res,next){
    if(!req.session.user){
        return res.redirect('/signIn');
    }
    next();
}