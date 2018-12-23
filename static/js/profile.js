$("#avatar").on('change',function () {
    let formData = new FormData();
    formData.append('file', $(this)[0].files[0]);
    //console.log(formData.get('file'));
     /*$.post('/upload',formData,function (res) {
        // $('img').attr('src',res)
         if(res){
             console.log('成功');
         }
     });*/
    $.ajax({
        url: '/upload',
        type: 'post',
        data: formData,
        processData: false,  // 不处理数据
        contentType: false,   // 不设置内容类型
        success: function (data) {
            if(data.code===200){
                console.log(data.data);
                $('img').attr('src',data.data);
            }
            //alert('success');
            //location.reload();
        },
    });
});
