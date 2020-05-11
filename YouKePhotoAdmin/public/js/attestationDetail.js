var AttestationDetail = {
    init: function () {
        // 点击返回列表页
        $(".info-title").click(function () {
            window.location.href = "/attestation/attestationList";
        });
        //图片模态框
        $("body").on("click", ".chairImg", function () {
            $(".preview_img").attr("src", $(this).attr("src"));
            $(".preview_span").text($(this).attr("title") + ".jpg");
            $("#DownloadImg").attr("data-href", $(this).attr("src"));
            
        });

        $("#DownloadImg").click(function () {
            AttestationDetail.DownloadImg();
        })
        AttestationDetail.AdminAuditingUser()
    },
    DownloadImg: function () {
        let src = $(".preview_img").attr("src");
        var canvas = document.createElement('canvas');
        var img = document.createElement('img');
        img.onload = function (e) {
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob((blob) => {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = $(".preview_span").text();
                link.click();
            }, "image/jpeg");
        }
        img.setAttribute("crossOrigin", 'Anonymous');
        img.src = src;
    },
    // 后台获取认证审核详情
    AdminAuditingUser: function () {
        var methodName = "/AdminUser/AdminGetAuditDetail";
        var data = {
            RecordId: Common.getUrlParam("id"),
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                $("#RealName").text(data.Data.RealName);
                $("#IdCardNumber").text(data.Data.IdCardNumber);
                $("#Mobile").text(data.Data.Mobile);
                $("#IdCardFrontal").attr("src",data.Data.IdCardFrontal);
                $("#IdCardRear").attr("src",data.Data.IdCardRear);
                $("#Evidence").attr("src",data.Data.Evidence);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
}

$(function () {
    AttestationDetail.init();
})