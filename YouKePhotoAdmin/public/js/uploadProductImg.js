$(function () {
    // 选择图片
    $(".productImg").on("change",".img-input",function () {
        uploadImg.uploadImageAfterSelect(this);
    });

    //删除图片
    $(".productImg").on("click",".close-img",function () {
        $(this).siblings(".img-input").val("");
        $(this).siblings(".select-img").attr("src","/public/images/addImg.png");
        $(this).siblings(".select-img").attr("data-src","");
        $(this).css("width",0);
        $(this).css("height",0);
    });
})

var uploadImg = {
    //预览图片
    updateImg: function(thisInput,imgPath){
        var file = ($(thisInput)[0].files[0]);
        var reader = new FileReader();
        var imgFile;
        reader.readAsDataURL(file);
        reader.onload = function(e){
            imgFile = e.target.result;
            $(thisInput).siblings(".select-img").attr("src",imgFile);
            $(thisInput).siblings(".select-img").attr("data-src",imgPath);
            $(thisInput).siblings(".close-img").css("width","100%");
            $(thisInput).siblings(".close-img").css("height","100%");
            var list = $(".productImg .img-container");
            var mark = true;
            for(var i=0;i<list.length;i++){
                if(list.eq(i).find(".select-img").attr("src") == "/public/images/addImg.png"){
                    mark = false;
                }
            }
            if(mark && list.length < 8){
                var html = '<div class="img-container">' +
                    '<img class="select-img" src="/public/images/addImg.png">' +
                    '<input class="img-input" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">' +
                    '<img class="close-img" src="/public/images/close.png">' +
                    '</div>';
                $(".productImg").append(html);
            }
        }
    },
    // 上传图片
    uploadImageAfterSelect:function(thisInput){
        var formData = new FormData();
        formData.append("file",$(thisInput)[0].files[0]);

        $.ajax({
            url: SignRequest.urlPrefix + "/product/AdminUploadProductImg",
            type: "post",
            dataType: "json",
            data: formData,
            cache: false,
            processData: false,
            contentType: false
        }).done(function (data) {
            if (data.Code == "100") {
                uploadImg.updateImg(thisInput,data.Data);
            }
            else {
                $(thisInput).val("");
                Common.showErrorMsg(data.Message);
            }
        }).fail(function () {
            $(thisInput).val("");
            Common.showErrorMsg("上传图片失败");
        })
    }
}


