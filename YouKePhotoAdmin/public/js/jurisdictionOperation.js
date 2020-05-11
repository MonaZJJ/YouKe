var ProductLabel = {
    init: function () {
        //获取管理员列表
        ProductLabel.initBootstrapTable();
        //点击确认添加管理员模态框
        $('#add_manage_confirm').click(function () {

        });
        //获取它的总的部门数目和类别
        ProductLabel.getDepartmentNum();

        //点击查询按钮
        $('#searchBtn').click(function () {
            var data = {
                "UserName": $('#manage_Name').val(),
                "AdminGId": $('#departmentCate').find("option:selected").val()
            }
            ProductLabel.projectQuery(data);
        });

        //点击添加管理员
        $('#add_manage_confirm').click(function () {
            ProductLabel.addManager();
        });

        //点击删除管理员
        $('#manageListTb').on('click', '.status_delete', function () {
            var dataId = $(this).attr('data-id');

            Common.confirmDialog('是否删除该标签?', function () {
                ProductLabel.delete_manage(dataId);
            })

        });

        //添加的模态框出现
        $('#myModal').on('show.bs.modal', function () {
            //清空内容
            $('#labelName').val("");
        });
        //编辑模态框出现之后
        $('#myModalEdit').on('shown.bs.modal', function (e) {
            $('#labelName_edit').val(localStorage.getItem('LableName'));
        });

    },

    //获取总的部门数
    getDepartmentNum: function () {
        var methodName = "/Department/AdminAllDepartmentList";
        var data = {
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                ProductLabel.getDepartmentCategory();
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //部门下拉类表
    cateTpl: `
        {{each DepartmentList as value i}}
            <option value="{{DepartmentList[i].AdminGId}}">{{DepartmentList[i].Title}}</option>
        {{/each}}
    `,
    // 获取部门拉接口
    getDepartmentCategory: function () {

        var methodName = "/Department/AdminAllDepartmentList";
        var data = {
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                console.log(data.Data)
                var render = template.compile(ProductLabel.cateTpl);
                var html = render(data.Data);
                console.log(data.Data)
                console.log(html)
                $("#departmentCate").append(html);
                $("#which_department").append(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //添加用户
    addManager: function (info) {
        var methodName = "/admin/AdminAddAdmin";
        var username = $('#yonghuName').val();
        var mima = $('#mima').val();
        var querenmima = $('#querenmima').val();
        var admingid = $('#which_department').find("option:selected").val();
        if (username != '' && mima != '' && querenmima != '' && admingid != '') {
            if (mima == querenmima) {
                var data = {
                    "UserName": username,
                    "PassWord": mima,
                    "AdminGId": admingid
                }
                SignRequest.set(methodName, data, function (data) {
                    if (data.Code == "100") {
                        ProductLabel.projectQuery(data);
                        $('#myModal').modal('hide');
                        swal("添加成功", "", "success");
                    } else {
                        Common.showErrorMsg(data.Message);
                    }
                });
            }
            else {
                swal("俩次输入密码不一致", "", "error");
            }
        }
        else {
            swal("请填写完整信息", "", "error");
        }
    },
    //删除管理员
    delete_manage: function (uid) {
        var methodName = "/admin/AdminDelAdmin";
        var data = {
            "UId": uid
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                ProductLabel.projectQuery(data);
                swal("删除成功", "", "success");
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable管理员列表
    initBootstrapTable: function () {
        $('#manageListTb').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/admin/AdminAdminList',
            dataType: "json",
            striped: true, //使表格带有条纹
            pagination: false, //在表格底部显示分页工具栏
            pageSize: 15,
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
            queryParams: ProductLabel.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: ProductLabel.responseHandler,
            columns: [
                {
                    field: 'UserName',
                    title: '用户名',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span class="manage_name">' + value + '</span>';
                        return e;
                    }
                },
                {
                    field: 'RegisterTimeStr',
                    title: '创建时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'Title',
                    title: '所属部门',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = '<span class="belong_department">' + value + '</span>';
                        return html;
                    }
                },
                {
                    field: 'UId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {

                        var html = '<a href="/platform/jurisdictionEdit?id=' + value + '" style="color: #039cf8;cursor: pointer;" class="edit_manage" data-id="' + value + '" >编辑</a>' +
                            '<span style="padding: 0 6px" class="status_delete" data-id="' + value + '">删除</span>';
                        return html;
                    }
                },


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

                // $('.caret').remove()

            },
            onLoadError: function (data) {
                //$('#dishes_list_table').bootstrapTable('removeAll');
            },
            // 1.点击每行进行函数的触发
            onClickRow: function (row, tr, flied) {
                // 书写自己的方法
                // console.log(row);
                // console.log(tr);
                // console.log(flied);
            },
            //2. 点击前面的复选框进行对应的操作
            //点击全选框时触发的操作
            //点击全选框时触发的操作
            onCheckAll: function (rows) {

                // for (var i = 0; i < rows.length; i++) {
                //     DishesList.UserIdsList.push(rows[i].User.Id);
                //     DishesList.UserOpenIds.push(rows[i].User.OpenId);
                // }

            },
            onUncheckAll: function (rows) {

            },
            //点击每一个单选框时触发的操作
            onCheck: function (row) {


            },
            //取消每一个单选框时对应的操作；
            onUncheck: function (row) {


            }
        });
    },
    //bootstrap table post 参数 queryParams
    queryParams: function (params) {
        //配置参数
        //方法名
        var methodName = "/admin/AdminAdminList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNumber: (params.offset / params.limit) + 1, //页码
            Page: {
                PageSize: params.limit,
                PageIndex: (params.offset / params.limit) + 1,
            },
            "UserName": "",
            "AdminGId": 0
        };
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        if (res.Data != null) {
            return {
                "rows": res.Data.AdminList,
                // "total": res.Data.PageModel.TotalCount
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
            var obj = {};
        } else {
            var obj = parame;
        }
        $('#manageListTb').bootstrapTable(
            "refresh", {
                url: SignRequest.urlPrefix + '/admin/AdminAdminList',
                query: obj
            }
        );
    },
}


$(function () {

    ProductLabel.init();
})