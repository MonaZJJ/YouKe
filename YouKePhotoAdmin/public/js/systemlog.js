$(function () {
    OperateLog.init();
})

var OperateLog = {
    cateTpl: `
        {{each AdminList as value i}}
            <option value="{{AdminList[i].UId}}">{{AdminList[i].UserName}}</option>
        {{/each}}
    `,
    init: function () {

        // 分页条数设置
        $("#pagesize_dropdown").on("change", function () {
            OperateLog.projectQuery();
        });

        // 点击查询按钮
        $("#search").on("click", function () {
            var data = {
                "StartTime": $("#start").val(),
                "EndTime": $("#end").val(),
                "UId": parseInt($("#operateList").val())
            }
            OperateLog.projectQuery(data);
        });

        // 全选
        $("#stuCheckBox").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });
        // 单个删除
        $("#recoveryTable").on("click", ".status_delete", function () {
            var logIds = [];
            logIds.push($(this).attr("data-id"));
            if (logIds.length <= 0) {
                Common.showErrorMsg("请选择操作日志!");
                return false;
            };
            Common.confirmDialog("确认进行删除吗？", function () {
                OperateLog.deleteOperateLog(logIds);
            });
        });

        //多个删除
        $("#delete").on("click", function () {
            var logIds = OperateLog.getSelectedData();
            if (logIds.length <= 0) {
                Common.showErrorMsg("请选择操作日志!");
                return false;
            };
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                OperateLog.deleteOperateLog(logIds);
            });
        });

        //清空日志
        $("#empty").on("click", function () {
            Common.confirmDialog("确认要清空操作日志吗？", function () {
                OperateLog.emptyOperateLog();
            });
        });

        Common.initLaydateWithTime();
        OperateLog.getAdminList();
        OperateLog.initBootstrapTable();
    },
    // 获取操作人
    getAdminList: function () {
        var methodName = "/adminOperateLog/AdminList";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                var render = template.compile(OperateLog.cateTpl);
                var html = render(data.Data);
                $("#operateList").append(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 获取选中的数据
    getSelectedData: function () {
        var list = $("#recoveryTable .checkbox");
        var logIds = [];
        for (var i = 0; i < list.length; i++) {
            if (list.eq(i).is(':checked')) {
                logIds.push(list.eq(i).attr("data-logId"));
            }
        }
        return logIds;
    },

    // 删除
    deleteOperateLog: function (logIds) {
        var methodName = "/adminOperateLog/DeleteAdminOperateLog";
        var data = {
            "LogIdList": logIds,
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                    Common.showSuccessMsg('删除成功', function () {
                        //删除成功之后刷新表格
                        OperateLog.projectQuery()
                    });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //清空操作日志
    emptyOperateLog: function () {
        var methodName = "/adminOperateLog/ClearAdminOperateLog";
        SignRequest.set(methodName, {}, function (data) {
            if (data.Code == "100") {
                    Common.showSuccessMsg('删除成功', function () {
                        //删除成功之后刷新表格
                        OperateLog.projectQuery()
                    });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#recoveryTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/adminOperateLog/AdminOperateLogList',
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
            queryParams: OperateLog.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: OperateLog.responseHandler,
            columns: [{
                    field: 'LogId',
                    title: '',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = '<input type="checkbox" class="checkbox" data-logId="' + value + '">'
                        return html;
                    }
                },
                {
                    field: 'NickName',
                    title: '用户名',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'Ip',
                    title: 'IP地址',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'OperateTime',
                    title: '操作时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'Operation',
                    title: '操作内容',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },

                {
                    field: 'LogId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "<span class='status_delete' data-id='" + value + "'>删除</span>";
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
                $('#recoveryTable').bootstrapTable('removeAll');
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
        var methodName = "/adminOperateLog/AdminOperateLogList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            Name: $("#Name").val(),
            PSn: $("#PSn").val(),
            StartTime: $("#start").val(),
            EndTime: $("#end").val(),
            CateId: $("#CateId").val(),
            BrandId: $("#BrandId").val(),
            Page: {
                PageSize: params.limit, //页面大小,
                PageIndex: (params.offset / params.limit) + 1, //页码
            },
            StartTime: "",
            EndTime: "",
            UId: $("#operateList").val() == "" ? 0 : $("#operateList").val()
        };
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        if (res.Data != null) {
            console.log(res);
            return {
                "rows": res.Data.AdminOperateLogList,
                "total": res.Data.Total
            };
        } else {
            return {
                "rows": [],
                "total": 0
            };
        }
    },
    //表格刷新
    projectQuery: function (parame) {
        if (parame == "" || parame == undefined) {
            var obj = {
                Name: $("#Name").val(),
                PSn: $("#PSn").val(),
                CateId: $("#CateId").val(),
                BrandId: $("#BrandId").val(),
                StartTime: $("#start").val(),
                EndTime: $("#end").val(),
                Page: {
                    PageSize: $("#pagesize_dropdown").val(), //页面大小,
                    PageIndex: Number($(".pagination").find(".active").text()), //页码
                }
            };
        } else {
            var obj = parame;
        }

        $('#recoveryTable').bootstrapTable(
            "destroy", {
                url: SignRequest.urlPrefix + '/adminOperateLog/AdminOperateLogList',
                query: obj
            }
        );

        OperateLog.initBootstrapTable();
    }
}