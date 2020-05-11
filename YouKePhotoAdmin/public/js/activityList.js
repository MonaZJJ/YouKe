$(function () {
    AttestationList.init();
})

var AttestationList = {
    init: function () {
        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });

        //导出用户信息
        $("#productTable").on("click", ".export_user_msg", function () {
            var PId = $(this).attr("data-id");
            AttestationList.ExportAdminActivityUserInfo(PId);
        });

        //单个删除
        $("#productTable").on("click", ".status_delete", function () {
            var PId = [$(this).attr("data-id")];
            Common.confirmDialog("确认进行删除吗？", function () {
                AttestationList.deleteProduct(PId);
            });
        });

        //多个删除
        $("#delete").on("click", function () {
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                AttestationList.deleteProduct(AttestationList.getSelectedData());
            });
        });

        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            AttestationList.projectQuery();
        });


        //排序更改
        $('body').on('change', '.order-disp', function () {
            var BId = $(this).attr('data-id');
            var DisplayOrder = $(this).val();
            AttestationList.adminChangeNbDisplayOrder(BId, DisplayOrder)
        });


        AttestationList.initBootstrapTable();
    },

    //导出后台比赛用户信息
    ExportAdminActivityUserInfo: function (ActivityId) {
        //请求方法
        var methodName = "/AdminActivity/ExportAdminActivityUserInfo";
        var data = {
            ActivityId: ActivityId,
        };
        //请求接口
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                window.location.href = data.Data;
            } else {
                Common.showErrorMsg(data.Message, function () {
                    AttestationList.projectQuery()
                });
            }
        });
    },
    //更改产品排序
    adminChangeNbDisplayOrder: function (BId, DisplayOrder) {
        //请求方法
        var methodName = "/AdminActivity/AdminEditActivitySort";
        var data = {
            "ActivityId": BId,
            "Sort": DisplayOrder
        };
        //请求接口
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg('排序成功', function () {
                    //删除成功之后刷新表格
                    AttestationList.projectQuery();
                })
            } else {
                Common.showErrorMsg(data.Message, function () {
                    AttestationList.projectQuery()
                });
            }
        });
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
    // 删除
    deleteProduct: function (PId) {
        var methodName = "/AdminActivity/AdminDeleteActivity";
        var data = {
            ActivityId: PId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                AttestationList.projectQuery();
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
            url: SignRequest.urlPrefix + '/AdminActivity/GetAdminActivityList',
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
            queryParams: AttestationList.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: AttestationList.responseHandler,
            columns: [{
                    field: 'Title',
                    title: '主题',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'NickName',
                    title: '封面图',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span><img src=' + row.CoverPath + ' class="chairImg" alt="暂无图片" style ="width: 144px;height: 73px;"></span>';
                        return e;
                    }
                },

                {
                    field: 'CreateTimeStr',
                    title: '创建时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: '',
                    title: '投稿时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var value1 = row.StartTimeStr.substring(0, 16).replace("T", " ");
                        var value2 = row.EndTimeStr.substring(0, 16).replace("T", " ");
                        var e = '<span>' + value1 + '</span> ~ ' + '<span>' + value2 + '</span>';
                        return e;
                    }
                },
                {
                    field: 'ShopPrice',
                    title: '顺序',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = `<input type="number" style="text-align: center" class="order-disp" data-id="${row.ActivityId}" value="${row.Sort}">`
                        return html;
                    }
                },
                {
                    field: 'ActivityId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        html += "<a href='/activity/addactivity?id=" + value + "' style='cursor: pointer;color: #039cf8;margin-right:15px;' data-id='" + value + "'>编辑</a>";
                        html += "<a href='/activity/activityDetail?id=" + value + "' style='cursor: pointer;color: #039cf8;margin-right:15px;' data-id='" + value + "'>详情</a><br>";
                        html += "<span class='export_user_msg' data-id='" + value + "' style='cursor: pointer;color: #039cf8;margin-right:15px;'>导出用户信息</span><br>";
                        html += "<a href='/activity/attestatiodetail?id=" + value + "' style='cursor: pointer;color: #039cf8;margin-right:15px;' data-id='" + value + "'>作品审核</a>";
                        html += "<span class='status_delete' data-id='" + value + "' >删除</span>";
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
        var methodName = "/AdminActivity/GetAdminActivityList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            IsEnd: $("#State").find(".active").find("a").attr("data-type"),
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
                "rows": res.Data.AdminActivityList,
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
        var methodName = "/AdminActivity/GetAdminActivityList";
        if (parame == "" || parame == undefined) {
            var obj = {
                IsEnd: $("#State").find(".active").find("a").attr("data-type")
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
        var methodName = "/AdminActivity/GetAdminActivityList";

        if (parame == "" || parame == undefined) {
            var obj = {
                IsEnd: $("#State").find(".active").find("a").attr("data-type"),
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

        AttestationList.initBootstrapTable();

    }
}