$(function () {
    UserList.init();
})

var UserList = {
    UIds: [],
    init: function () {
        //日期范围限制
        UserList.initLaydateWithTime();

        // 查詢
        $("#search").on("click", function () {
            UserList.projectQuery();
        });


        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });


        //多个删除
        $("#delete").on("click", function () {
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                UserList.deleteProduct(UserList.getSelectedData());
            });
        });


        //禁言 
        $("body").on("click", ".banned", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认禁言此用户吗？", function () {
                UserList.AdminIllicitUser(UId);
            });
        });
        // 解除禁言
        $("body").on("click", ".remove_banned", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认解除禁言此用户吗？", function () {
                UserList.AdminExcitIllicitUser(UId);
            });
        });


        //认证 
        $("body").on("click", ".onAuthentication", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认认证此用户吗？", function () {
                UserList.AdminAuthenSetup(UId);
            });
        });
        // 取消认证
        $("body").on("click", ".offAuthentication", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认取消认证此用户吗？", function () {
                UserList.AdminCancelAuthenSetup(UId);
            });
        });

        //开启审核 
        $("body").on("click", ".on_audit", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认开启审核吗？", function () {
                UserList.AdminOpenUserNeedAudited(UId, 0);
            });
        });
        // 关闭审核 
        $("body").on("click", ".off_auditn", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认关闭审核吗？", function () {
                UserList.AdminOpenUserNeedAudited(UId, 1);
            });
        });



        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            UserList.projectQuery();
        });

        //排列方式
        $("#sortingway_dropdown").on("change", function () {
            UserList.projectQuery();
        });


        // 私信发送
        $("#send_if_confirm").click(function () {
            //消息标题验证
            if (!Validate.emptyValidateAndFocus("#MessageTitle", "请输入消息标题", "")) {
                return false;
            }
            //内容验证
            if (!Validate.emptyValidateAndFocus("#MessageContent", "请输入内容", "")) {
                return false;
            }
            if (UserList.UIds.length < 1) {
                UserList.getSelectedData()
            }
            if (UserList.UIds.length < 1) {
                Common.showErrorMsg("请选择私信的用户");
                return false;
            }
            UserList.AdminAddUserMessage();
        });

        // 私信记录id
        $("body").on("click", ".direct_msg", function () {
            UserList.UIds = [];
            var UId = $(this).attr("data-id");
            UserList.UIds = [Number(UId)];
        });
        // 清楚id
        $("body").on("click", ".clear_msg", function () {
            UserList.UIds = [];
        });

        

        UserList.initBootstrapTable();
    },
    // 获取选中的数据
    getSelectedData: function () {
        var list = $("#productTable .checkbox");
        var PId = [];
        for (var i = 0; i < list.length; i++) {
            if (list.eq(i).is(':checked')) {
                PId.push(list.eq(i).attr("data-pid"));
            }
        }
        UserList.UIds = PId;
        return PId;
    },
    // 后台私信用户
    AdminAddUserMessage: function () {
        var methodName = "/AdminUser/AdminAddUserMessage";
        var data = {
            UIds: UserList.UIds,
            Title: $("#MessageTitle").val(),
            Content: $("#MessageContent").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    UserList.projectQuery();
                    UserList.UIds = [];
                    $("#MessageTitle").val("");
                    $("#MessageContent").val("");
                    $("#addGrouping").modal("hide");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 禁言
    AdminIllicitUser: function (UId) {
        var methodName = "/AdminUser/AdminIllicitUser";
        var data = {
            UId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("禁言成功", function () {
                    UserList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 解除禁言
    AdminExcitIllicitUser: function (UId) {
        var methodName = "/AdminUser/AdminExcitIllicitUser";
        var data = {
            UId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("解除禁言成功", function () {
                    UserList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 设置认证
    AdminAuthenSetup: function (UId) {
        var methodName = "/AdminUser/AdminAuthenSetup";
        var data = {
            UId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("认证成功", function () {
                    UserList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台取消设置认证
    AdminCancelAuthenSetup: function (UId) {
        var methodName = "/AdminUser/AdminCancelAuthenSetup";
        var data = {
            UId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("取消认证成功", function () {
                    UserList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 审核开关
    AdminOpenUserNeedAudited: function (UId, state) {
        let methodName;
        if (state == 0) {
            methodName = "/AdminUser/AdminOpenUserNeedAudited";
        } else {
            methodName = "/AdminUser/AdminCloseUserNeedAudited";
        }
        var data = {
            UId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    UserList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 删除
    deleteProduct: function (PId) {
        var methodName = "/product/AdminDelProduct";
        var data = {
            PId: PId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("删除成功", function () {
                    UserList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#productTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/AdminUser/AdminGetUsersList',
            dataType: "json",
            striped: true, //使表格带有条纹
            pagination: true, //在表格底部显示分页工具栏
            pageSize: $("#pagesize_dropdown").val(),
            pageNumber: 1,
            pageList: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
            idField: "Id", //标识哪个字段为id主键
            showToggle: false, //名片格式
            cardView: false, //设置为True时显示名片（card）布局
            // showColumns: true, //显示隐藏列
            // showRefresh: true, //显示刷新按钮
            singleSelect: false, //复选框只能选择一条记录
            search: false, //是否显示右上角的搜索框
            clickToSelect: true, //点击行即可选中单选/复选框
            sidePagination: "server", //表格分页的位置
            queryParams: UserList.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: UserList.responseHandler,
            columns: [{
                    field: 'UId',
                    title: '',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = '<input type="checkbox" class="checkbox" data-pid="' + value + '">'
                        return html;
                    }
                },
                {
                    field: 'NickName',
                    title: '用户昵称',
                    align: 'left',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span style="padding-left:70px;margin-right:-70px;"><img src=' + row.Avatar + ' class="chairImg" alt="暂无图片" style ="width: 56px;height: 56px;border-radius:50%;margin-right:20px;">' + row.NickName + '</span>';
                        return e;
                    }
                },
                {
                    field: 'CreateTimeStr',
                    title: '创建时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        value = value.substring(0, 16).replace("T", " ");
                        return value;
                    }
                },
                {
                    field: 'WorksCount',
                    title: '作品量',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'WorksRecommendedCount',
                    title: '被推荐数',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'FollowsCount',
                    title: '关注量',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'UserFollowsCount',
                    title: '粉丝量',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'UId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        html += "<a href='/user/matchList?id=" + value + "' style='margin-right: 15px;cursor: pointer;color: #039cf8;'>比赛</a>";
                        html += "<a href='/production/productionUserList?id=" + value + "'style='cursor: pointer;color: #039cf8;margin-right: 15px' data-id='" + value + "'>作品</a>";
                        if (row.Illicit == 0) {
                            html += "<span class='banned' data-id='" + value + "' style='cursor: pointer;color: #039cf8;margin-right: 15px'>禁言</span><br>";
                        } else {
                            html += "<span class='remove_banned' data-id='" + value + "' style='cursor: pointer;color: #039cf8;margin-right: 15px'>解除禁言</span><br>";
                        }
                        if (row.Authentication == 0) {
                            html += "<span class='onAuthentication' data-id='" + value + "' style='cursor: pointer;color: #039cf8;'>认证</span>";
                        } else {
                            html += "<span class='offAuthentication' data-id='" + value + "' style='cursor: pointer;color: #039cf8;'>取消认证</span>";
                        }
                        // if (row.NeedAudited == 0) {
                        //     html += "<span class='on_audit' data-id='" + value + "' style='cursor: pointer;color: #039cf8;'>开启审核</span>";
                        // } else {
                        //     html += "<span class='off_auditn' data-id='" + value + "' style='cursor: pointer;color: #039cf8;'>关闭审核</span>";
                        // }
                        html += "<span class='direct_msg' data-toggle='modal' data-target='#addGrouping' data-id='" + value + "' style='margin-left: 15px;cursor: pointer;color: #039cf8;'>私信</span>";

                        return html;
                    }
                }
            ], //列
            silent: true, //刷新事件必须设置
            formatLoadingMessage: function () {
                return "请稍等，正在加载中...";
            },
            formatNoMatches: function () { //没有匹配的结果
                return '无符合条件的记录';
            },
            onLoadSuccess: function (data) {
                console.log(data);

                $('.caret').remove()

            },
            onLoadError: function (data) {
                $('#productTable').bootstrapTable('removeAll');
            },
            // 1.点击每行进行函数的触发
            onClickRow: function (row, tr, flied) {
                // 书写自己的方法

            },
            //2. 点击前面的复选框进行对应的操作
            //点击全选框时触发的操作
            //点击全选框时触发的操作
            onCheckAll: function (rows) {

                // for (var i = 0; i < rows.length; i++) {
                //     dishes_list.UserIdsList.push(rows[i].User.Id);
                //     dishes_list.UserOpenIds.push(rows[i].User.OpenId);
                // }

            },
            onUncheckAll: function (rows) {

            },
            //点击每一个单选框时触发的操作
            onCheck: function (row) {


            },
            //取消每一个单选框时对应的操作；
            onUncheck: function (row) {
                Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };

            }
        });
    },
    //bootstrap table post 参数 queryParams
    queryParams: function (params) {
        //配置参数
        //方法名
        var methodName = "/AdminUser/AdminGetUsersList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            NickName: $("#NickName").val(),
            StartTime: $("#start").val(),
            EndTime: $("#end").val(),
            OrderModel: $("#sortingway_dropdown").val(),
            Authentication: 0,
            Illicit: 0,
            Page: {
                PageSize: params.limit, //页面大小,
                PageIndex: (params.offset / params.limit) + 1, //页码
            }
        };
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        if (res.Data != null) {
            console.log(res);
            return {
                "rows": res.Data.AdminGetUsersList,
                "total": res.Data.Total
            };
        } else {
            return {
                "rows": [],
                "total": 0
            };
        }
    },
    //表格刷新(直接刷新)
    refreshQuery: function (parame) {
        //方法名
        var methodName = "/AdminUser/AdminGetUsersList";

        if (parame == "" || parame == undefined) {
            var obj = {
                NickName: $("#NickName").val(),
                StartTime: $("#start").val(),
                EndTime: $("#end").val(),
                OrderModel: $("#sortingway_dropdown").val(),
                Authentication: 0,
                Illicit: 0
            };
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "refresh", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );
    },
    //表格刷新(先销毁后初始化)
    projectQuery: function (parame) {
        //方法名
        var methodName = "/AdminUser/AdminGetUsersList";

        if (parame == "" || parame == undefined) {
            var obj = {
                NickName: $("#NickName").val(),
                StartTime: $("#start").val(),
                EndTime: $("#end").val(),
                OrderModel: $("#sortingway_dropdown").val(),
                Authentication: 0,
                Illicit: 0,
                Page: {
                    PageSize: $("#pagesize_dropdown").val(), //页面大小,
                    PageIndex: Number($(".pagination").find(".active").text()), //页码
                }
            };
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "destroy", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );

        UserList.initBootstrapTable();

    },
    //初始化日期控件：日期时间
    initLaydateWithTime: function () {
        //日期范围限制
        var start = laydate.render({
            elem: '#start',
            type: 'datetime',
            max: 1, //最大日期
            istoday: false,
            done: function (value, date) {
                if (value != "") {
                    date.month = date.month - 1;
                    end.config.min = date; //开始日选好后，重置结束日的最小日期
                }
            }
        })

        var end = laydate.render({
            elem: '#end',
            type: 'datetime',
            istoday: false,
            done: function (value, date) {
                if (value != "") {
                    date.month = date.month - 1;
                    start.config.max = date; //结束日选好后，重置开始日的最大日期
                }
            }
        })
    },
}