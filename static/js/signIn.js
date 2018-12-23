$("#user").on('blur',function(){
    var username=$(this).val();
    if(username){
        $.post('/avatar',{username:username},function (res) {
            if(!res){
                res='/static/img/default.png';
            }
            $(".avatar").fadeOut(function () {
                $(this).on('load',function () {
                    $(this).fadeIn();
                }).attr('src',res);
            })
        })
    }
});