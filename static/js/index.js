$(".next").on('click',function () {
    if($(this).is(".open")){
        $(this).children(".submenu").hide();
        $(this).removeClass("open");
    }else{
        $(this).children(".submenu").show();
        $(this).addClass('open');
    }
});
$(".nav > li").on('click',function () {
    $(".nav li.active").removeClass("active");
    $(this).addClass("active");
});
$(".submenu > li").on('click',function (event) {
    event.stopPropagation();
    $("li.active").removeClass("active");
    $(this).parent().parent().addClass("active");
    $(this).addClass("active");
});