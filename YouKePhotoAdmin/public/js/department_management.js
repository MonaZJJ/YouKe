$(function () {
    //初始化
    DepartmentManage.init();
});
var DepartmentManage = {
    init: function () {
        //添加部门编辑框出现清除输入的内容
        $('#addDepartmentModal').on('show.bs.modal', function (e) {
            $('#departmentName').val("");
            $('#description').val("");
        });
        //编辑部门编辑框出现清除输入的内容,并获取相应的值
        $('#editDepartmentModal').on('show.bs.modal', function (e) {
            $('#editDepartmentName').val("");
            $('#editDescription').val("");

            //获取是哪个元素点击
            var invoker_dom = $(e.relatedTarget);
            //获取触发的该元素父元素所属的data-id
            var dataId = invoker_dom.attr('data-id');

            //此时给该弹窗赋予data-id，与触发元素的父元素data-id相对应
            $("#editDepartmentModal").attr('data-id', dataId);
            var editDepartmentName = invoker_dom.parents('tr').find('.company-name').text();
            $('#editDepartmentName').val(editDepartmentName);
            var editDescription = invoker_dom.parents('tr').find('.position-name').text();
            $('#editDescription').val(editDescription);
        });
        //新增接口
        $('#addDepartmentConfirm').click(function () {
            DepartmentManage.addDepartment();
        });
        //编辑接口
        $('#editDepartmentConfirm').click(function () {
            var dataId = $("#editDepartmentModal").attr('data-id');
            DepartmentManage.editDepartment(dataId);
        });
        //点击删除接口
        $('.table_content_department').on('click', '.edit_dele_one', function () {
            var dataId = $(this).attr('data-id');
            Common.confirmDialog("确认进行删除吗？", function () {
                DepartmentManage.deleteDepartment(dataId);
            });

        });
        //初始化表格
        DepartmentManage.listInit();
    },
    //部门管理表格初始化
    listInit: function () {
        $('#departmentManage').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/Department/AdminDepartmentList',
            dataType: "json",
            striped: true, //使表格带有条纹
            pagination: true, //在表格底部显示分页工具栏
            pageSize: 5,
            pageNumber: 1,
            pageList: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
            idField: "AdminGId", //标识哪个字段为id主键
            showToggle: false, //名片格式
            cardView: false, //设置为True时显示名片（card）布局
            // showColumns: true, //显示隐藏列
            // showRefresh: true, //显示刷新按钮
            singleSelect: false, //复选框只能选择一条记录
            search: false, //是否显示右上角的搜索框
            clickToSelect: true, //点击行即可选中单选/复选框
            sidePagination: "server", //表格分页的位置
            queryParams: DepartmentManage.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: DepartmentManage.responseHandler,
            columns: [
                {
                    field: 'Title',
                    title: '部门名称',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span class="company-name">' + value + '</span>';
                        return e;
                    }
                },
                {
                    field: 'Description',
                    title: '职能说明',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span class="position-name">' + value + '</span>';
                        return e;
                    }
                },
                {
                    field: 'AdminGId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        if(row.AdminGId<5){
                            var e = '<a href="/platform/department_power?departmentId=' + value + '" data-id=' + value + ' class="power_a">部门权限</a>' ;

                        }else {
                            var e = '<a href="/platform/department_power?departmentId=' + value + '" data-id=' + value + ' class="power_a">部门权限</a>' +
                                '<span class="edit_classify_one" data-id=' + value + ' data-toggle="modal" href="#editDepartmentModal">编辑</span>' +
                                '<span class="edit_dele_one" data-id=' + value + '>删除</span>';
                        }

                        return e;
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
                //$('.caret').remove()

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
    queryParams: function (params) {//请求参数
        //配置参数
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNumber: (params.offset / params.limit) + 1, //页码
            Page: {
                PageSize: params.limit,
                PageIndex: (params.offset / params.limit) + 1,
            },
        };
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        console.log('分割线')
        console.log(res)
        if (res.Data != null) {
            console.log(res);
            return {
                "rows": res.Data.DepartmentList,
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
            var obj = {};
        } else {
            var obj = parame;
        }
        $('#departmentManage').bootstrapTable(
            "refresh", {
                url: SignRequest.urlPrefix + '/Department/AdminDepartmentList',
                query: obj
            }
        );
    },
    //新增部门接口
    addDepartment: function () {
        //部门名称
        if (!Validate.emptyValidateAndFocus("#departmentName", "请输入部门名称")) {
            return false;
        }
        //职能说明
        if (!Validate.emptyValidateAndFocus("#description", "请输入职能说明")) {
            return false;
        }

        //请求方法
        var methodName = "/Department/AdminAddDepartment";
        var data = {
            "DepartmentName": $('#departmentName').val(),
            "Description": $('#description').val()
        };
        //请求接口
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("添加成功", function () {
                    DepartmentManage.projectQuery();//新增刷新表格
                    $('#addDepartmentModal').modal('hide');
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //编辑部门接口
    editDepartment: function (departmentId) {
        //部门名称
        if (!Validate.emptyValidateAndFocus("#editDepartmentName", "请输入部门名称")) {
            return false;
        }
        //职能说明
        if (!Validate.emptyValidateAndFocus("#editDescription", "请输入职能说明")) {
            return false;
        }

        //请求方法
        var methodName = "/Department/AdminUpdateDepartment";
        var data = {
            "AdminGId": departmentId,
            "DepartmentName": $('#editDepartmentName').val(),
            "Description": $('#editDescription').val()
        };
        var data_request = data;
        //请求接口
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("编辑成功", function () {
                    DepartmentManage.projectQuery();//编辑刷新表格
                    $('#editDepartmentModal').modal('hide');
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //删除部门
    deleteDepartment: function (departmentId) {
        //请求方法
        var methodName = "/Department/AdminDeleteDepartment";
        var data = {
            "AdminGId": departmentId
        };
        //请求接口
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("删除成功", function () {
                    DepartmentManage.projectQuery();//新增刷新表格
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },


}//对象结束