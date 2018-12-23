$(function () {
    var pagingas=$('.pagination a');
    var deleteas=$('tr a');
    var page=$('.pagination .active').text()
    var category=$('#classification option:selected').val();
    var status=$('#status option:selected').val();
    deleteas.on('click',function () {
        $(this).attr('href',$(this).attr('href')+'&page='+page+'&category='+category+'&status='+status);
    });
    pagingas.on('click',function () {
        $(this).attr('href',$(this).attr('href')+'&category='+category+'&status='+status);
    });
});