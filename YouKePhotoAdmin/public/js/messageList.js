$(function () {
    MessageList.init();
})

var MessageList = {
    init: function () {
        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });


        //单个删除
        $("#productTable").on("click", ".status_delete", function () {
            var PId = [$(this).attr("data-id")];
            Common.confirmDialog("确认进行删除吗？", function () {
                MessageList.deleteProduct(PId);
            });
        });


        //多个删除
        $("#delete").on("click", function () {
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                MessageList.deleteProduct(MessageList.getSelectedData());
            });
        });

        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            MessageList.projectQuery();
        });


        // 点击返回列表页
        $(".info-title").click(function () {
            window.location.href = "/tutorial/tutorialList";
        });


        //置顶 
        $("body").on("click", ".onStick", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认置顶此用户吗？", function () {
                MessageList.AdminTutorialCommentsPutTop(UId);
            });
        });
        // 取消置顶
        $("body").on("click", ".offStick", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认取消置顶此用户吗？", function () {
                MessageList.AdminTutorialCommentsCancelPutTop(UId);
            });
        });


        //精选 
        $("body").on("click", ".onChoiceness", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认精选此用户吗？", function () {
                MessageList.AdminTutorialCommentIsChoice(UId);
            });
        });
        // 取消精选
        $("body").on("click", ".offChoiceness", function () {
            var UId = $(this).attr("data-id");
            Common.confirmDialog("确认取消精选此用户吗？", function () {
                MessageList.AdminTutorialCommentCancelIsChoice(UId);
            });
        });

        // 回复留言
        $("body").on("click", "#creatTabNameBtn", function () {
            var RecordId = MessageList.RecordId;
            var Content = $("#Content").val();

            //机型名称验证
            if (!Validate.emptyValidateAndFocus("#Content", "请输入回复内容", "")) {
                return false;
            }
            MessageList.AdminReplyTutorialComments(RecordId, Content);

        });
        $("body").on("click", ".tocomments", function () {
            MessageList.RecordId = $(this).attr("data-id");
            $("#Contentdetail").val($(this).attr("data-content"));
        });


        MessageList.initBootstrapTable();
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
        return PId;
    },
    // 置顶
    AdminTutorialCommentsPutTop: function (UId) {
        var methodName = "/AdminTutorial/AdminTutorialCommentsPutTop";
        var data = {
            RecordId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("置顶成功", function () {
                    MessageList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 解除置顶
    AdminTutorialCommentsCancelPutTop: function (UId) {
        var methodName = "/AdminTutorial/AdminTutorialCommentsCancelPutTop";
        var data = {
            RecordId: UId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("解除置顶成功", function () {
                    MessageList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 精选
    AdminTutorialCommentIsChoice: function (UId) {
        var methodName = "/AdminTutorial/AdminTutorialCommentIsChoice";
        var data = {
            TutorialCommentsRecordIdList: [UId]
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("精选成功", function () {
                    MessageList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 解除精选
    AdminTutorialCommentCancelIsChoice: function (UId) {
        var methodName = "/AdminTutorial/AdminTutorialCommentCancelIsChoice";
        var data = {
            TutorialCommentsRecordIdList: [UId]
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("解除精选成功", function () {
                    MessageList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台回复教程评论
    AdminReplyTutorialComments: function (RecordId, Content) {
        var methodName = "/AdminTutorial/AdminReplyTutorialComments";
        var data = {
            RecordId: RecordId,
            Content: Content
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    MessageList.projectQuery();
                    $("#Content").val("");
                    $("#addGrouping").modal("hide");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 删除
    deleteProduct: function (PId) {
        var methodName = "/AdminTutorial/AdminDeleteTutorialComments";
        var data = {
            TutorialCommentsIdList: PId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                MessageList.projectQuery();
                Common.showSuccessMsg("删除成功");
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#productTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/AdminTutorial/AdminGetTutorialCommentsList',
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
            queryParams: MessageList.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: MessageList.responseHandler,
            columns: [{
                    field: 'RecordId',
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
                    title: '昵称',
                    align: 'left',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span style="padding-left:40px;margin-right:-40px;"><img src=' + row.Avatar + ' class="chairImg" alt="暂无图片" style ="width: 56px;height: 56px;border-radius:50%;margin-right:20px;">' + row.NickName + '</span>';
                        return e;
                    }
                },
                {
                    field: 'Content',
                    title: '内容',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'CreateTimeStr',
                    title: '提交时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'RecordId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        if (row.UId == "0") {
                            html += "<span class='status_delete' data-id='" + value + "' style='cursor: pointer;color: #039cf8;'>删除</span>";
                        } else {
                            if (row.IsTopJudge == 0) {
                                html += "<span class='onStick' data-id='" + value + "' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>置顶</span>";
                            } else {
                                html += "<span class='offStick' data-id='" + value + "' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>取消置顶</span>";
                            }
                            if (row.IsChoiceJudge == 0) {
                                html += "<span class='onChoiceness' data-id='" + value + "' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>精选</span>";
                            } else {
                                html += "<span class='offChoiceness' data-id='" + value + "' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>取消精选</span>";
                            }

                            if (row.Replys == "") {
                                html += "<span class='tocomments' data-id='" + value + "' data-content='" + row.Replys + "' data-toggle='modal' data-target='#addGrouping' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>回复</span>";
                            } else {
                                html += "<span class='tocomments' data-id='" + value + "' data-content='" + row.Replys + "' data-toggle='modal' data-target='#eidtGrouping' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>已回复</span>";
                            }

                            html += "<span class='status_delete' data-id='" + value + "' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>删除</span>";
                        }

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
        var methodName = "/AdminTutorial/AdminGetTutorialCommentsList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            TId: Common.getUrlParam("id"),
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
                "rows": res.Data.AdminTutorialCommentsList,
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
        var methodName = "/AdminTutorial/AdminGetTutorialCommentsList";

        if (parame == "" || parame == undefined) {
            var obj = {
                TId: Common.getUrlParam("id"),
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
        var methodName = "/AdminTutorial/AdminGetTutorialCommentsList";

        if (parame == "" || parame == undefined) {
            var obj = {
                TId: Common.getUrlParam("id"),
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

        MessageList.initBootstrapTable();

    }
}