$(function () {
    var pagingas=$('.pagination a');
    var statusas=$('tr a');
    var page=$('.pagination .active').text();
    var classification=$("#classification option:selected").val();
    var search=$(".form-inline input").val();
    console.log(search);
    statusas.on('click',function () {
        $(this).attr('href',$(this).attr('href')+'&page='+page+'&'+classification+'='+search);
    });
    pagingas.on('click',function () {
        $(this).attr('href',$(this).attr('href')+'&'+classification+'='+search);
    });
});