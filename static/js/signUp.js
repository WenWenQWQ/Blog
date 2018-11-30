function checkUser(){
    const user=$('#user').val();
    let message='';
    if(!user){
       message='请输入用户名';
        $('.user').text(message);
        return false;
    }else if(user.length<2||user.length>8){
        message='请输入2-8个有效字符';
        $('.user').text(message);
        return false;
    }
    $('.user').text("");
    return true;
}
function checkEmail(){
    const email=$('#email').val();
    const emailReg=new RegExp("^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if(!email){
        $('.email').text('请输入邮箱');
        return false;
    }
    if(!emailReg.test(email)){
        $('.email').text('请输入正确的邮箱');
        return false;
    }
    $('.email').text('');
    return true;
}
function checkPassword(){
    const password=$('#password').val();
    let message='';
    if(!password){
        message='请输入密码';
        $('.password').text(message);
        return false;
    }else if(password.length<2||password.length>8){
        message='请输入2-8个有效字符';
        $('.password').text(message);
        return false;
    }
    $('.password').text('');
    return true;
}
function checkSamePw(){
    const password=$('#password').val();
    const con_password=$('#confirm_password').val();
    let message='';
    if(!con_password){
        message='请输入确认密码';
        $('.confirm_password').text(message);
        return false;
    }else if(con_password!==password){
        message='输入确认密码与密码不同';
        $('.confirm_password').text(message);
        return false;
    }
    $('.confirm_password').text('');
    return true;
}
function check(){
   return checkUser()&&checkEmail()&&checkPassword()&&checkSamePw();
}

