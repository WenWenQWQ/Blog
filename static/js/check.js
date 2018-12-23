$(function () {
    var btnDelete=$(".delete-btn");
    var thCheckbox=$("th > input[type=checkbox]");
    var tdCheckbox=$("td >input[type=checkbox]");
    var checked=[];
    //console.log(tdCheckbox);
    tdCheckbox.on('change',function () {
        var id=$(this).parent().parent().data("id");
        if(!id){
            return false;
        }
        if($(this).prop('checked')){
            checked.push(id);
        }else{
            checked.splice(checked.indexOf(id),1);
        }
        //console.log(checked.length);
        //console.log(checked.length,tdCheckbox.length);
        if(checked.length===tdCheckbox.length){
            thCheckbox.prop('checked',true);
        }else{
            thCheckbox.prop('checked',false);
        }
        checked.length ? btnDelete.fadeIn() : btnDelete.fadeOut();
        btnDelete.prop("search",'?id='+checked.join(','));
    });
    thCheckbox.on('change',function () {
        var checked=$(this).prop('checked');
        tdCheckbox.prop('checked',checked).trigger('change');
    })
});