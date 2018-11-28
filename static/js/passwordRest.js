function checkOw(){
    const oldPw=$("#old-word").val();
    const p=$(".old-word");
    if(!oldPw){
        p.text("请输入原始密码");
        return false;
    }
    p.text('');
    return true;
}
function checkNw(){
    const newPw=$("#new-word").val();
    const p=$(".new-word");
    if(!newPw){
        p.text("请输入新密码");
        return false;
    }
    p.text('');
    return true;
}
function checkConw(){
    const conPw=$("#confirm-word").val();
    const newPw=$("#new-word").val();
    const p=$(".confirm-word");
    if(!conPw){
        p.text("请输入确认密码");
        return false;
    }else if(newPw!==conPw){
        p.text("确认密码与新密码不一致");
        return false;
    }
    p.text('');
    return true;
}
function check(){
    return checkOw()&&checkNw()&&checkConw();
}