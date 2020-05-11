$(function () {
    Index.init();
});
var Index = {
    datatitle: "新增用户数",
    datatype: 1,
    canvasmethodName: "/AdminHome/GetAdminNewUserInfo",
    init: function () {
        //获取首页数据
        Index.AdminGetIndexDataInfo();
        Index.dataInit();


        $('#myTab a').click(function (e) {
            e.preventDefault()
            console.log($(this).attr("data-type"));
            if (Index.datatype == $(this).attr("data-type")) {
                return false;
            }
            Index.datatype = $(this).attr("data-type");
            if (Index.datatype == 1) {
                Index.datatitle = "新增用户数";
                $(".trend_analyse_title").text(Index.datatitle);
                Index.canvasmethodName = "/AdminHome/GetAdminNewUserInfo";
            } else if (Index.datatype == 2) {
                Index.datatitle = "当天作品数";
                $(".trend_analyse_title").text(Index.datatitle);
                Index.canvasmethodName = "/AdminHome/GetAdminNewWorkInfo";
            } else if (Index.datatype == 3) {
                Index.datatitle = "注册用户数";
                $(".trend_analyse_title").text(Index.datatitle);
                Index.canvasmethodName = "/AdminHome/GetAdminTotalUserInfo";
            }
            Index.dataInit();
        })
    },
    //获取首页数据
    AdminGetIndexDataInfo: function () {
        //请求方法
        var methodName = "/AdminHome/GetAdminHomeInfo";
        var data = {};
        console.log(data)
        //请求接口
        SignRequest.set(methodName, data, function (data) {
            console.log(data)
            if (data.Code == "100") {
                $("#TotalWorks").text(data.Data.TotalWorks);
                $("#NewWorks").text(data.Data.NewWorks);
                $("#TotalUsers").text(data.Data.TotalUsers);
                $("#NewUsers").text(data.Data.NewUsers);
                //获取首页订单金额趋势数据
                // Index.AdminGetIndexOrderAmountTrend();
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //获取新增会员统计
    GetAdminNewUserInfo: function (startTime, endTime) {
        //方法名
        var methodName = Index.canvasmethodName;
        //获取数据
        var data = {
            StartDate: startTime,
            EndDate: endTime
        };
        //请求数据
        SignRequest.set(methodName, data, function (data) {
            console.log(data);
            if (data.Data != null) {
                //发送数据数
                var dataList_send = [];
                //日期
                var dateList = [];
                data.Data.List[0].DataList.forEach(function (item, index) {
                    //发送数据数
                    dataList_send.push(item.Value);
                    //日期
                    dateList.push(item.Date);
                });

                var Data_list = {
                    dataList_send: dataList_send,
                    dateList: dateList,
                };
                Index.UpdateMessage_one(Data_list, data.Data);
            }
        }, function () {});
    },
    dataInit: function () {
        //默认日期
        var start_time = moment().subtract('days', 29).format('YYYY-MM-D');
        var end_time1 = moment().subtract(1, "days").format('YYYY-MM-D');
        Index.GetAdminNewUserInfo(start_time, end_time1);
        //第一个日历
        var option = {
            locale: {
                fromLabel: '开始日期',
                toLabel: '结束日期'
            },
            maxDate: new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() + 1)), //双日历允许最大的结束日期
            opens: 'left', //日历与输入框的对其方式,当前为右对齐
            //maxDate:moment(),//设置成moment(),有一个bug,那就是不能选择今天(比如2016-7-21)
            showDropdowns: true, //这个属性可以实现下拉选择年
            // minDate: "2014-12-01",
            dateLimit: {
                days: 30
            }
        };

        $('#reportrange2 span').html(moment().subtract('days', 29).format('YYYY-MM-D') + ' - ' + moment().subtract(1, "days").format('YYYY-MM-D'));

        $('#reportrange2').daterangepicker(option, function (start, end1, label) {
            $('#reportrange2 span').html(moment(start).format('YYYY-MM-D') + ' - ' + moment(end1).format('YYYY-MM-D'));
            var startTime = moment(start).format('YYYY-MM-D');
            var endTime = moment(end1).format('YYYY-MM-D');
            //获取新增会员统计
            Index.GetAdminNewUserInfo(startTime, endTime)
        });
    },
    //更新图表一视图
    UpdateMessage_one: function (Data, ExData) {
        Index.messageOneData = ExData;
        option = {
            title: {
                //text: '消息趋势分析'
            },
            color: ['#96C490'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    //type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                position: function (point, params, dom, rect, size) {
                    // 固定在顶部

                }
            },
            legend: {
                data: [Index.datatitle],
                bottom: 0,


            },
            toolbox: {
                feature: {
                    // saveAsImage: {},
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: true,
                        optionToContent: function (opt) {
                            //console.info(opt);
                            var axisData = opt.xAxis[0].data;
                            var series = opt.series;
                            var tdHeaders = '<td>时间</td>'; //表头
                            series.forEach(function (item) {
                                tdHeaders += '<td>' + item.name + '</td>'; //组装表头
                            });
                            var table = '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" style="text-align:center"><tbody><tr>' + tdHeaders + '</tr>';
                            var tdBodys = ''; //数据
                            for (let i = 0, l = axisData.length; i < l; i++) {
                                for (let j = 0; j < series.length; j++) {
                                    tdBodys += '<td>' + series[j].data[i] + '</td>'; //组装表数据
                                }
                                table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                                tdBodys = '';
                            }

                            table += '</tbody></table></div>';
                            return table;
                        }
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'funnel', 'bar']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    },
                    myTool_export: {
                        show: true,
                        title: '导出',
                        icon: 'path://M838.208 393.664l1.088-6.112-222.912-229.504-78.816 0c-132.16 0-270.912 0-270.912 0-39.904 0-72.256 30.912-72.256 69.056l0 656.096c0 38.144 32.352 69.056 72.256 69.056l505.696 0c39.904 0 72.256-30.912 72.256-69.056L844.608 399.776 838.208 393.664zM627.872 221.28l158.112 161.248L664 382.528c-19.936 0-36.128-15.456-36.128-34.528L627.872 221.28zM808.48 883.232c0 19.072-16.16 34.528-36.128 34.528L266.656 917.76c-19.968 0-36.128-15.456-36.128-34.528L230.528 227.136c0-19.072 16.16-34.528 36.128-34.528l325.088 0 0 155.392c0 38.144 32.352 69.056 72.256 69.056l144.48 0L808.48 883.232zM588.768 481.792l-69.536 114.112-1.024 0c-4.64-8.96-8.608-16.288-11.904-21.92l-53.504-92.192-58.944 0 92.8 140.256-97.216 135.296 58.176 0 55.584-87.712c8.448-13.28 12.768-20.416 12.928-21.408l1.024 0c5.344 9.632 9.472 16.768 12.416 21.408l54.56 87.712 58.944 0-94.368-136.768 95.648-138.784L588.768 481.792z',
                        onclick: function () {
                            console.log(Index.messageOneData)
                            Index.ExportQueryData(Index.messageOneData);
                        }
                    },
                },
                width: 50,
                padding: 15, // 工具箱内边距，单位px，默认各方向内边距为5，
                orient: 'vertical',
                right: 25,
            },
            grid: {
                left: '3%',
                right: '9%',
                bottom: '8%',
                containLabel: true,
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: Data.dateList,
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: Index.datatitle,
                type: 'line',
                data: Data.dataList_send,
            }]
        };
        myChart.setOption(option);
    },
    //导出Excel数据接口
    ExportQueryData: function (Data) {
        console.log(Data)
        //方法名
        var methodName = "/AdminHome/ExportQueryData";
        //获取数据
        var data = {
            "Data": Data
        };
        //请求数据
        SignRequest.set(methodName, data, function (data) {
            location.href = data.Data;
        }, function () {});
    }
}



var myChartObj = document.getElementById('trend_analyse_box');
if (myChartObj != null) {
    //图表一
    var myChart = echarts.init(myChartObj);
}