angular.module('VolpayApp').controller('mydashboardCtrl', function($scope, $http, $filter, $timeout, $state, $location, $window, PersonService1, AllPaymentsGlobalData, GlobalService, LogoutService, DashboardService, errorservice) {

    var myColors = ["#578ebe", "#e35b5a", "#8775a7", "#6D9B5B", "#ab7019", "#777", "#ff9933", "#ff0066", "#a24e4e", "#607D8B", "#d4638a", "#5d5d96", '#FA58F4', '#0174DF', '#FE642E', '#DF0101', '#64FE2E', '#8A0868', '#585858', '#4C0B5F', '#B18904', '#8A2908', '#F781BE', '#A9F5E1'];

    $scope.Colors = ["#578ebe", "#e35b5a", "#8775a7", "#6D9B5B", "#ab7019", "#777", "#ff9933", "#ff0066", "#a24e4e", "#607D8B", "#d4638a", "#5d5d96", '#FA58F4', '#0174DF', '#FE642E', '#DF0101', '#64FE2E', '#8A0868', '#585858', '#4C0B5F', '#B18904', '#8A2908', '#F781BE', '#A9F5E1'];
    var attachdandbidLoaded = true;
    var AttchdMsgobj = [];
    var BIDmsgObj = [];
    $scope.PayState = true;
    clearInterval(menuInterval)
    $scope.aa = {
        "Queryfield": [{
            "ColumnName": "UserID",
            "ColumnOperation": "=",
            "ColumnValue": sessionStorage.UserID
        }],
        "Operator": "AND"
    }

    $scope.aa = constructQuery($scope.aa);

    $http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        userData = JSON.parse($filter('hex2a')(data[0].ProfileData))
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        userData = uProfileData;
    });

    $scope.checkstatusBarVal = function() {

        $scope.statusBarValPayment = [{
            "Status": "REPAIR",
            "NavStatus": "REPAIR",
            "Icon": "fa fa-wrench",
            "Color": "linear-gradient(to right, rgb(243, 111, 111), rgb(228, 11, 11) 60%, #b71c1c 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "FOR APPROVAL",
            "NavStatus": "WAITFORAPPROVAL",
            "Icon": "fa fa-thumbs-o-up",
            "Color": "linear-gradient(to right, rgb(130, 199, 83), rgb(79, 154, 29) 60%, #558b2f 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "FOR BULKING",
            "NavStatus": "FOR_BULKING",
            "Icon": "fa fa-stack-overflow",
            "Color": "linear-gradient(to right, rgb(108, 135, 142), rgb(55, 79, 89) 60%, rgb(8, 45, 64) 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "WAREHOUSED",
            "NavStatus": "WAREHOUSED",
            "Icon": "fa fa-home",
            "Color": "linear-gradient(to right, rgb(186, 186, 195), rgb(117, 117, 117) 60%,#666666 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "WAITING",
            "NavStatus": "WAITING",
            "Icon": "fa fa-hourglass-half",
            "Color": "linear-gradient(to right, rgb(119, 194, 232), rgb(40, 148, 204) 60%, #0288d1 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "HOLD",
            "NavStatus": "HOLD",
            "Icon": "fa fa-hand-paper-o",
            "Color": "linear-gradient(to right, rgb(239, 171, 119), rgb(249, 113, 8) 60%, #ff6f00 100%)",
            "Visibility": "",
            "Count": 0
        }]

        $scope.statusBarValFile = [{
            "Status": "HOLD",
            "NavStatus": "HOLD",
            "Icon": "fa fa-hand-paper-o",
            "Color": "linear-gradient(to right, rgb(255, 178, 73), rgb(187, 116, 23) 60%, rgb(150, 95, 15) 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "DEBULKED",
            "NavStatus": "DEBULKED",
            "Icon": "fa fa-check-circle-o",
            "Color": "linear-gradient(to right, rgb(148, 216, 118), rgb(103, 150, 79) 60%, rgb(88, 113, 77) 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "DUPLICATE",
            "NavStatus": "DUPLICATE",
            "Icon": "fa fa-copy",
            "Color": "linear-gradient(to right, rgb(196, 173, 228), rgb(169, 119, 236) 60%, #8875a2 100%)",
            "Visibility": "",
            "Count": 0
        }, {
            "Status": "REJECTED",
            "NavStatus": "REJECTED",
            "Icon": "fa fa-times-circle",
            "Color": "linear-gradient(to right, rgb(241, 149, 147), rgb(251, 110, 103) 60%, #e35b5a 100%)",
            "Visibility": "",
            "Count": 0
        }]

        for (var i in userData.customDashboardWidgets.settings.fileDashboard.statusSummary) {
            for (var j in $scope.statusBarValFile) {
                if (userData.customDashboardWidgets.settings.fileDashboard.statusSummary[i].name == $scope.statusBarValFile[j].NavStatus) {
                    $scope.statusBarValFile[j].Visibility = userData.customDashboardWidgets.settings.fileDashboard.statusSummary[i].visibility;
                }
            }
        }

        for (var i in userData.customDashboardWidgets.settings.fileDashboard.statusSummary) {
            if (userData.customDashboardWidgets.settings.fileDashboard.statusSummary[i].visibility) {
                $scope.countFile = userData.customDashboardWidgets.settings.fileDashboard.statusSummary.filter(function(x) {
                    return x.visibility;
                }).length;
            }

        }

        //Payment Dashboard
        for (var i in userData.customDashboardWidgets.settings.paymentDashboard.statusSummary) {
            for (var j in $scope.statusBarValPayment) {
                if (userData.customDashboardWidgets.settings.paymentDashboard.statusSummary[i].name == $scope.statusBarValPayment[j].NavStatus) {
                    $scope.statusBarValPayment[j].Visibility = userData.customDashboardWidgets.settings.paymentDashboard.statusSummary[i].visibility;
                }
            }
        }

        for (var i in userData.customDashboardWidgets.settings.paymentDashboard.statusSummary) {

            if (userData.customDashboardWidgets.settings.paymentDashboard.statusSummary[i].visibility) {
                $scope.count = userData.customDashboardWidgets.settings.paymentDashboard.statusSummary.filter(function(x) {
                    return x.visibility;
                }).length;
            }
        }

        //},100)

    }

    $scope.checkstatusBarVal()

    $scope.uSetting = {
        "paymentDashboard": {},
        "fileDashboard": {}
    };

    for (var i in userData.customDashboardWidgets.settings) {
        for (var j in userData.customDashboardWidgets.settings[i].widget) {
            $scope.uSetting[i][userData.customDashboardWidgets.settings[i].widget[j].name] = userData.customDashboardWidgets.settings[i].widget[j].visibility;
        }
    }

    //Adjusting charts based on user preferences widgets
    enableDisableChart()

    function enableDisableChart() {
        if (!$scope.uSetting.paymentDashboard.CurDisCustom) // If CurDuis hidden
        {
            setTimeout(function() {

                $('#MOPDist').removeAttr('class').addClass('col-md-8 droppable');
                $('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
            }, 100)
        }
        if ((!$scope.uSetting.paymentDashboard.test2Custom) && (!$scope.uSetting.paymentDashboard.CurDisCustom)) // If CurDuis hidden & InbndPayment hidden
        {
            setTimeout(function() {

                $('#MOPDist').removeAttr('class').addClass('col-md-6 droppable');
                $('#paymentStatusDist').removeAttr('class').addClass('col-md-6 droppable');
            }, 100)
        }
        if ((!$scope.uSetting.paymentDashboard.CurDisCustom) && (!$scope.uSetting.paymentDashboard.MopBarCustom)) // If CurDuis hidden & MOP hidden
        {

            setTimeout(function() {

                $('#paymentStatusDist').removeAttr('class').addClass('col-md-8 droppable');
            }, 150)
        }
        if ((!$scope.uSetting.paymentDashboard.CurDisCustom) && (!$scope.uSetting.paymentDashboard.MopBarCustom) && (!$scope.uSetting.paymentDashboard.test2Custom)) // If CurDuis & Inbound & MOP hidden
        {
            setTimeout(function() {

                $('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
            }, 150)

        }
        if ((!$scope.uSetting.paymentDashboard.CurDisCustom) && (!$scope.uSetting.paymentDashboard.sankeyChartCustom) && (!$scope.uSetting.paymentDashboard.InbndPayment)) // If CurDuis & Inbound & status hidden
        {
            setTimeout(function() {

                $('#MOPDist').removeAttr('class').addClass('col-md-12 droppable');
            }, 150)

        }
        if (!$scope.uSetting.paymentDashboard.test2Custom) // If inboundPayment hidden
        {
            setTimeout(function() {

                $('#pymtCurDisChart').removeAttr('class').addClass('col-md-12 droppable');
            }, 100)
        }
        if (!$scope.uSetting.paymentDashboard.MopBarCustom) // If MOP hidden
        {
            setTimeout(function() {

                $('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
            }, 100)
        }

    }

    function outputForSankey(data, name) {
        var curDisTot = 0,
            curDisAmt = 0;
        for (var i in data) {
            curDisTot = curDisTot + data[i].Count;
            curDisAmt = curDisAmt + data[i].Amount;
        }

        if (name == 'curDis') {
            data.push({
                'Name': 'Total',
                'Currency': '',
                'Count': curDisTot,
                'Amount': curDisAmt
            })
            $scope.curDisData = data;
        } else if (name == 'srcChannel') {
            data.push({
                'Name': 'Total',
                'Currency': '',
                'Count': curDisTot,
                'Amount': curDisAmt
            })
            $scope.srcChannelData = data;
        } else if (name == 'mop') {
            data.push({
                'Name': 'Total',
                'Currency': '',
                'Count': curDisTot,
                'Amount': curDisAmt
            })
            $scope.mopData = data;
        } else if (name == 'status') {
            data.push({
                'Name': 'Total',
                'Currency': '',
                'Count': curDisTot,
                'Amount': curDisAmt
            })
            $scope.payStatData = data;
        }
    }

    //Payment Dashboard Initial Call
    $scope.initialCall = function() {
        var restdata = {};
        $scope.PayState = true;
        attachdandbidLoaded = true;
        $('.donutChartSelected').css('display', 'none')
        $('.pieChartSelected').css('display', 'none')
        $('.sankeyChartSelected').css('display', 'none')
        $('.legendHolder').css('display', 'none')

        $scope.dashboardData = function() {
            $http({
                url: BASEURL + RESTCALL.paymentDashboard,
                method: "POST",
                data: {
                    'IsAllInfoRead': true
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                restdata = data;

                var prevIndex = -1;
                var prevObj = -1;
                var preClicked = -1;
                var clickCnt = 0;

                $('.custDropDown').find('button').find('span:first-child').html('Count');
                $('.custDropDown').find('ul').find('li').removeClass('listSelected').removeClass('listNotSelected')
                $('.custDropDown').find('ul').find('li:first-child').addClass('listSelected').removeClass('listNotSelected')

                var inbndCntAmt = 'Count';

                var cahrtFunctnly = {

                    pie: function(arg1) {
                        setChartProp.pie(arg1)
                        arg1.data = restdata[arg1.basedOn];
                        arg1.flag = false;
                        arg1.filter = $filter;
                        arg1.location = $location;
                        arg1.globalData = AllPaymentsGlobalData;
                        arg1.selectVal = inbndCntAmt;

                        chartFunctions.PieChart(arg1)
                    },
                    donut: function(arg1) {
                        setChartProp.donut(arg1)
                        arg1.data = restdata[arg1.basedOn];
                        arg1.flag = false;
                        arg1.filter = $filter;
                        arg1.location = $location;
                        arg1.globalData = AllPaymentsGlobalData;
                        arg1.selectVal = inbndCntAmt;

                        chartFunctions.DonutChart(arg1)
                    },
                    horizontal: function(arg1) {

                        setChartProp.horizontalVertical(arg1)

                        arg1.flag = false;
                        arg1.filter = $filter;
                        arg1.location = $location;
                        arg1.globalData = AllPaymentsGlobalData;
                        arg1.selectVal = inbndCntAmt;

                        var HorizData = commonFunctions.formatingData(restdata[arg1.basedOn])
                        arg1.data = HorizData;
                        chartFunctions.HorizontalMultibarChart(arg1)
                    },
                    vertical: function(arg1) {

                        setChartProp.horizontalVertical(arg1)

                        arg1.flag = false;
                        arg1.filter = $filter;
                        arg1.location = $location;
                        arg1.selectVal = inbndCntAmt;
                        arg1.globalData = AllPaymentsGlobalData;
                        var vertData = commonFunctions.formatingData(restdata[arg1.basedOn]);
                        arg1.data = vertData;
                        vertData.sort(compare);
                        chartFunctions.VerticalMultibarChart(arg1)
                    },
                    sankey: function(arg1) {
                        arg1.selectVal = inbndCntAmt;
                        arg1.flag = false;
                        arg1.filter = $filter;
                        arg1.location = $location;
                        arg1.globalData = AllPaymentsGlobalData;
                        var graph = jsonToSankeyData(restdata, arg1.basedOn, arg1.selectVal, 'totalTrue')
                        arg1.data = graph;

                        setChartProp.sankey({
                            'id': arg1.id,
                            'parentId': arg1.parentId
                        })
                        chartFunctions.SankeyChart(arg1)

                    },
                    verticalsankey: function(arg1) {

                        arg1.selectVal = inbndCntAmt;
                        arg1.flag = false;
                        arg1.filter = $filter;
                        arg1.location = $location;
                        arg1.globalData = AllPaymentsGlobalData;
                        var energy = CurrencySankey(restdata, arg1.basedOn, arg1.selectVal, 'totalFalse');
                        arg1.data = energy;

                        setChartProp.sankey(arg1)
                        chartFunctions.verticalSankeyChart(arg1)

                    }
                }

                function returnModifyData(id) {
                    if (id == 'InboundModal') {
                        dummytestData = $scope.inData;
                        parentId = 'resizeWindow';
                    } else if (id == 'test2Custom') {
                        dummytestData = angular.copy(restdata.SourceChannel)
                        parentId = 'inbndChart';
                    } else if (id == 'CurDisCustom') {
                        dummytestData = angular.copy(restdata.PaymentStatus)
                        parentId = 'pymtCurDisChart';
                    } else if (id == 'MopBarCustom') {
                        dummytestData = angular.copy(restdata.MOP)
                        parentId = 'MOPDist';
                    } else if (id == 'sankeyChartCustom') {
                        dummytestData = angular.copy(restdata.PaymentStatus)
                        parentId = 'paymentStatusDist';
                    } else if (id == 'Custm1') {
                        dummytestData = angular.copy(AttchdMsgobj)
                        parentId = 'AttachedMsgStatus';
                    } else if (id == 'Custm2') {
                        dummytestData = angular.copy(BIDmsgObj)
                        parentId = 'InterfaceStatusMsg';
                    }

                    var retObj = {};
                    retObj.dummytestData = dummytestData;
                    retObj.parentId = parentId

                    return retObj;

                }

                $scope.collapseState = function() {
                
                    $scope.PayState = !$scope.PayState;

                    if (!$scope.PayState) {
                        setTimeout(function() {



                            var pData = srcChannelLegenColorGen(restdata['PaymentStatus'])
                            var neVal = []
                            var tot = 0;
                            for (var i in pData) {
                                tot = 0;
                                for (var j in pData[i].Currency) {
                                    tot = tot + pData[i].Currency[j].Count;
                                }

                                neVal.push({
                                    'Name': pData[i].Name,
                                    'Count': tot,
                                    'Currency': '',
                                    'Amount': 0
                                })
                            }

                            setChartProp.donut({
                                'chartTitle': 'Payment Status',
                                'chartType': "donut",
                                'id': "sankeyChartCustom",
                                'parentId': "paymentStatusDist",
                                'basedOn': "PaymentStatus",
                                'key': 'Count'
                            })

                            chartFunctions.DonutChart({
                                'selectVal': "Count",
                                'id': "sankeyChartCustom",
                                'data': neVal,
                                'filter': $filter,
                                'globalData': AllPaymentsGlobalData,
                                'location': $location
                            })

                            chartFunctions.DonutChart({
                                'selectVal': "Count",
                                'id': "Custm2",
                                'data': BIDmsgObj,
                                'filter': $filter,
                                'globalData': AllPaymentsGlobalData,
                                'location': $location
                            })

                            if (attachdandbidLoaded) {
                                attachMsgandBidSummary()
                            }
                        }, 100)

                    }

                }

                $scope.CustomDataModifyforPie = function(evt, index, CustDumData, id) {

                    var parentId;
                    var dummytestData;

                    var Mdata = returnModifyData(id);
                    dummytestData = Mdata.dummytestData;
                    parentId = Mdata.parentId;

                    var aaText = $(evt.currentTarget).find('.channelName').text()
                    var className = $(evt.currentTarget).attr('class').split(' ')[1]
                    var legDiv = $(evt.currentTarget).find('span div');
                    var legnedDivColors = $('.legDivs');

                    aaText = $filter('addunderscore')(aaText)

                    var showEach = "All";
                    $('#' + parentId).find('.' + className).css({
                        'opacity': 0.4,
                        'font-weight': 'normal'
                    })
                    $('#' + parentId).find('#' + className + '_' + index).css({
                        'opacity': 1,
                        'font-weight': 'bold'
                    })

                    var DataIndex = [];
                    if (prevIndex != index) {
                        for (var i = 0; i < dummytestData.length; i++) {
                            if (aaText == dummytestData[i].Name) {
                                DataIndex.push({
                                    'Name': dummytestData[i].Name,
                                    'Amount': dummytestData[i].Amount,
                                    'Count': dummytestData[i].Count,
                                    'Currency': dummytestData[i].Currency
                                })
                            }
                        }
                        if (prevObj != -1) {
                            var backupLeg = $('#' + parentId).find('#' + className + '_' + prevIndex).find('span div')
                            for (var i = 0; i < prevObj.length; i++) {
                                $(backupLeg[i]).css({
                                    'background-color': prevObj[i].color
                                })
                            }
                        }
                        for (var i = 0; i < DataIndex.length; i++) {
                            $(legDiv[i]).css({
                                'background-color': myColors[i]
                            })
                        }
                        prevIndex = index;
                        prevObj = CustDumData.Currency;
                        preClicked = $(evt.currentTarget)
                        showEach = DataIndex[0].Name;
                    } else {
                        showEach = "All"
                        $('.' + className).css({
                            'opacity': 1,
                            'font-weight': 'normal'
                        })
                        prevObj = -1;
                        prevIndex = -1;
                        preClicked = -1;
                        DataIndex = dummytestData;
                        if (id == 'test2Custom') {
                            $scope.dumObj = srcChannelLegenColorGen(DataIndex);
                        } else if (id == 'CurDisCustom') {

                            $scope.dumObjCurDist = srcChannelLegenColorGen(DataIndex);
                        } else if (id == 'MopBarCustom') {
                            $scope.dumObjMOP = srcChannelLegenColorGen(DataIndex);
                        } else if (id == 'sankeyChartCustom') {
                            $scope.dumObjStatus = srcChannelLegenColorGen(DataIndex);
                        }
                    }

                    if (id != 'InboundModal') {
                        inbndCntAmt = $('#dropVal_' + id).html();
                        var btnVal = $('#' + parentId).find('.custDropDown').find('.btn').find('span:first-child').text()
                    } else {
                        var btnVal = $('#' + parentId).find('.custDropDownInsideModal').find('.btn').find('span:first-child').text()
                    }

                    chartFunctions.PieChart({
                        'data': DataIndex,
                        'flag': false,
                        'filter': $filter,
                        'location': $location,
                        'globalData': AllPaymentsGlobalData,
                        'selectVal': inbndCntAmt,
                        'id': id
                    })

                    d3.select('#' + parentId).select('#' + id).selectAll('text').each(function() {
                        if ($(this).attr('class') == 'middle') {
                            d3.select(this).each(function() {
                                $(this).text('')
                                $(this).html('')
                            })
                        }
                    })

                }

                var prevIndex = -1;
                var prevObj = -1;
                var preClicked = -1;
                $scope.CustomDataModify = function(evt, index, CustDumData, id) {
                    var parentId;
                    var Mdata = returnModifyData(id);
                    dummytestData = Mdata.dummytestData;
                    parentId = Mdata.parentId;

                    var aaText = $(evt.currentTarget).find('.channelName').text()
                    var className = $(evt.currentTarget).attr('class').split(' ')[1]
                    var legDiv = $(evt.currentTarget).find('span div');
                    aaText = $filter('addunderscore')(aaText)

                    var showEach = "All";
                    $('#' + parentId).find('.' + className).css({
                        'opacity': 0.4,
                        'font-weight': 'normal'
                    })
                    $('#' + parentId).find('#' + className + '_' + index).css({
                        'opacity': 1,
                        'font-weight': 'bold'
                    })

                    var DataIndex = [];
                    if (prevIndex != index) {
                        for (var i = 0; i < dummytestData.length; i++) {
                            if (aaText == dummytestData[i].Name) {
                                DataIndex.push({
                                    'Name': dummytestData[i].Name,
                                    'Amount': dummytestData[i].Amount,
                                    'Count': dummytestData[i].Count,
                                    'Currency': dummytestData[i].Currency
                                })
                            }
                        }
                        if (prevObj != -1) {
                            var backupLeg = $('#' + parentId).find('#' + className + '_' + prevIndex).find('span div')
                            for (var i = 0; i < prevObj.length; i++) {
                                $(backupLeg[i]).css({
                                    'background-color': prevObj[i].color
                                })
                            }
                        }
                        for (var i = 0; i < DataIndex.length; i++) {
                            $(legDiv[i]).css({
                                'background-color': myColors[i]
                            })
                        }
                        prevIndex = index;
                        prevObj = CustDumData.Currency;
                        preClicked = $(evt.currentTarget)
                        showEach = DataIndex[0].Name;
                    } else {
                        showEach = "All"
                        $('.' + className).css({
                            'opacity': 1,
                            'font-weight': 'normal'
                        })
                        prevObj = -1;
                        prevIndex = -1;
                        preClicked = -1;
                        DataIndex = dummytestData;
                        if (id == 'test2Custom') {
                            $scope.dumObj = srcChannelLegenColorGen(DataIndex);
                        } else if (id == 'CurDisCustom') {
                            $scope.dumObjCurDist = srcChannelLegenColorGen(DataIndex);
                        } else if (id == 'MopBarCustom') {
                            $scope.dumObjMOP = srcChannelLegenColorGen(DataIndex);
                        } else if (id == 'sankeyChartCustom') {
                            $scope.dumObjStatus = srcChannelLegenColorGen(DataIndex);
                        }
                    }
                    if (id != 'InboundModal') {

                        inbndCntAmt = $('#dropVal_' + id).html();

                        var btnVal = $('#' + parentId).find('.custDropDown').find('.btn').find('span:first-child').text()
                    } else {

                        // inbndCntAmt = $('.dropVal').html();
                        var btnVal = $('#' + parentId).find('.custDropDownInsideModal').find('.btn').find('span:first-child').text()
                    }


                    chartFunctions.DonutChart({
                        'data': DataIndex,
                        'flag': false,
                        'filter': $filter,
                        'location': $location,
                        'globalData': AllPaymentsGlobalData,
                        'selectVal': inbndCntAmt,
                        'id': id
                    })

                }

                $scope.statusFlag = {
                    'CurDisCustom': 'false',
                    'test2Custom': 'false',
                    'MopBarCustom': 'false',
                    'sankeyChartCustom': 'false'
                }

                //this condition works when the data is not present
                if (Object.keys(restdata).length == 0) {

                    //this condition works when the data is empty
                    $scope.schannel = 0;
                    $scope.mop = 0;
                    $scope.paymentstatus = 0;
                    $scope.noCurrenciesFound = true;

                    $scope.checkstatusBarVal()

                    PersonService1.GetChart1().then(function(items) {

                        restdata = items.data;

                        sankeyData = items.data;

                        $scope.dumObj = srcChannelLegenColorGen(restdata.SourceChannel)
                        $scope.dumObjCurDist = srcChannelLegenColorGen(restdata.PaymentStatus)
                        $scope.dumObjMOP = srcChannelLegenColorGen(restdata.MOP.sort(compareWithName))

                        testdata1 = items.data.SourceChannel;
                        $scope.testdata1 = items.data.SourceChannel;
                        testdata = items.data.MOP;
                        $scope.testdata = items.data.MOP;
                        $scope.totInboundAmt = 0;
                        $scope.totCount = 0;

                        $scope.PSData = items.data.PaymentStatus;
                        var noPaymentsankey = angular.copy(items.data)
                        $scope.donutColor = myColors;
                        d3.scale.myColors = function() {
                            return d3.scale.ordinal().range(myColors);
                        };
                        var statusArr = [];
                        var unqStatusArr = [];
                        $scope.overallStatus = [];
                        for (var i = 0; i < items.data.PaymentStatus.length; i++) {
                            statusArr.push(items.data.PaymentStatus[i].Name)
                        }

                        for (var i = 0; i < statusArr.length; i++) {
                            if (unqStatusArr.indexOf(statusArr[i]) == -1) {
                                unqStatusArr.push(statusArr[i]);
                            }
                        }

                        for (var i = 0; i < unqStatusArr.length; i++) {
                            var cnt = 0;
                            var Amt = 0;
                            for (var j = 0; j < items.data.PaymentStatus.length; j++) {
                                if (unqStatusArr[i] == items.data.PaymentStatus[j].Name) {
                                    cnt = cnt + items.data.PaymentStatus[j].Count;
                                    Amt = Amt + items.data.PaymentStatus[j].Amount;
                                }
                            }
                            $scope.overallStatus.push({
                                'Name': unqStatusArr[i],
                                'Count': cnt,
                                "Amount": Amt
                            })
                        }

                        $scope.valObj = {
                            "CurDisCustom": srcChannelLegenColorGen(restdata['PaymentStatus']),
                            "test2Custom": srcChannelLegenColorGen(restdata['SourceChannel']),
                            "MopBarCustom": srcChannelLegenColorGen(restdata['MOP']),
                            "sankeyChartCustom": srcChannelLegenColorGen(restdata['PaymentStatus'])

                        }
                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                            cahrtFunctnly[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType](userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i])
                            $scope.statusFlag[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].flag;

                        }

                        outputForSankey(angular.copy(restdata.PaymentStatus), 'curDis')
                        outputForSankey(angular.copy(restdata.SourceChannel), 'srcChannel')
                        outputForSankey(angular.copy(restdata.MOP), 'mop')
                        outputForSankey(angular.copy(restdata.PaymentStatus), 'status')

                        $scope.click = function(val, id, parentId) {
                            prevIndex = -1;
                            prevObj = -1;
                            preClicked = -1;
                            inbndCntAmt = val;
                            $('#' + parentId).find('.channelLegend').css({
                                'opacity': 1,
                                'font-weight': 'normal'
                            })
                            $('#' + parentId).find('.channelLegendAmt').css({
                                'opacity': 1,
                                'font-weight': 'normal'
                            })

                            for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {

                                if (id == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id) {
                                    cahrtFunctnly[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType](userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i]);

                                    if (val == 'Count') {
                                        $scope.statusFlag[id] = false;
                                    } else if (val == 'Amount') {
                                        $scope.statusFlag[id] = true;
                                    }

                                }

                            }

                            if (val == 'Count') {
                                if (id == 'InboundModal') {
                                    $scope.clickedModal = false;
                                } else { //$scope.clicked = false;
                                    $scope.curDistClicked = false;
                                }
                            } else if (val == 'Amount') {
                                if (id == 'InboundModal') {
                                    $scope.clickedModal = true;
                                } else { //$scope.clicked = true;
                                    $scope.curDistClicked = true;
                                }
                            }
                        }

                    });

                } else {
                    //this condition works when the data is present

                    $scope.schannel = 1;
                    $scope.mop = 1;
                    $scope.paymentstatus = 1;
                    $scope.noCurrenciesFound = false;
                    $scope.donutChartVisible = true;
                    $scope.pieChartSelected = false;
                    $scope.sankeyChartSelected = false;

                    $scope.fCntAmt = [];

                    $scope.uniqueFileStatus = constructObject.getUniqueVal(restdata.PaymentStatus, 'Name')

                    for (var i in $scope.uniqueFileStatus) {
                        $scope.fCnt = 0;
                        for (var j in restdata.PaymentStatus) {

                            if ($scope.uniqueFileStatus[i] == restdata.PaymentStatus[j].Name) {
                                $scope.fCnt = $scope.fCnt + restdata.PaymentStatus[j].Count;
                            }
                        }
                        $scope.fCntAmt.push({
                            'Status': $scope.uniqueFileStatus[i],
                            'Count': $scope.fCnt
                        })
                    }

                    for (var i in $scope.statusBarValPayment) {
                        for (var j in $scope.fCntAmt) {
                            if (($scope.statusBarValPayment[i].NavStatus == $scope.fCntAmt[j].Status) || ($scope.fCntAmt[j].Status.match($scope.statusBarValPayment[i].NavStatus))) {

                                $scope.statusBarValPayment[i].Count = $scope.statusBarValPayment[i].Count + $scope.fCntAmt[j].Count;
                            }
                        }
                    }

                    //If SourceChannel is missing
                    if (Object.keys(data).indexOf("SourceChannel") == -1) {

                        data.SourceChannel = [{
                            "Name": "BOOK",
                            "Amount": 4000,
                            "Count": 20,
                            "Currency": "EUR"
                        }, {
                            "Name": "SEPA",
                            "Amount": 2000,
                            "Count": 8,
                            "Currency": "GBP"
                        }, {
                            "Name": "SWIFT",
                            "Amount": 1000,
                            "Count": 4,
                            "Currency": "USD"
                        }];
                        $scope.schannel = 0;
                        $scope.donutChartVisible = false;
                    }

                    //If MOP is missing
                    if (Object.keys(data).indexOf("MOP") == -1) {
                        data.MOP = [{
                            "Name": "BOOK",
                            "Amount": 1200,
                            "Count": 8,
                            "Currency": "EUR"
                        }, {
                            "Name": "SWIFT",
                            "Amount": 3300,
                            "Count": 12,
                            "Currency": "GBP"
                        }];
                        $scope.mop = 0;
                    }

                    //If Payment Status is missing
                    if (Object.keys(data).indexOf("PaymentStatus") == -1) {
                        data.PaymentStatus = [{
                            "Name": "REPAIR",
                            "Amount": 2500,
                            "Count": 5,
                            "Currency": "EUR"
                        }, {
                            "Name": "COMPLETED",
                            "Amount": 3500,
                            "Count": 20,
                            "Currency": "USD"
                        }, {
                            "Name": "WAREHOUSED",
                            "Amount": 1000,
                            "Count": 7,
                            "Currency": "GBP"
                        }];
                        $scope.noCurrenciesFound = true;
                        $scope.paymentstatus = 0;
                    }

                    $scope.donutSet = false;
                    var sort_by;
                    (function() {
                            var default_cmp = function(a, b) {
                                    if (a == b)
                                        return 0;
                                    return a < b ? -1 : 1;
                                },
                                getCmpFunc = function(primer, reverse) {
                                    var cmp = default_cmp;
                                    if (primer) {
                                        cmp = function(a, b) {
                                            return default_cmp(primer(a), primer(b));
                                        };
                                    }
                                    if (reverse) {
                                        return function(a, b) {
                                            return -1 * cmp(a, b);
                                        };
                                    }
                                    return cmp;
                                };
                            sort_by = function() {
                                var fields = [],
                                    n_fields = arguments.length,
                                    field,
                                    name,
                                    reverse,
                                    cmp;
                                for (var i = 0; i < n_fields; i++) {
                                    field = arguments[i];
                                    if (typeof field === 'string') {
                                        name = field;
                                        cmp = default_cmp;
                                    } else {
                                        name = field.name;
                                        cmp = getCmpFunc(field.primer, field.reverse);
                                    }
                                    fields.push({
                                        name: name,
                                        cmp: cmp
                                    });
                                }

                                return function(A, B) {
                                    var a,
                                        b,
                                        name,
                                        cmp,
                                        result;
                                    for (var i = 0, l = n_fields; i < l; i++) {
                                        result = 0;
                                        field = fields[i];
                                        name = field.name;
                                        cmp = field.cmp;

                                        result = cmp(A[name], B[name]);
                                        if (result !== 0)
                                            break;
                                    }
                                    return result;
                                }
                            }
                        }
                        ());

                    data.SourceChannel.sort(sort_by('Name', {
                        name: 'Currency',
                        reverse: false
                    }));
                    data.MOP.sort(sort_by('Name', {
                        name: 'Currency',
                        reverse: false
                    }));
                    data.PaymentStatus.sort(sort_by('Name', {
                        name: 'Currency',
                        reverse: false
                    }));

                    var statusArr = [];
                    var unqStatusArr = [];
                    $scope.overallStatus = [];

                    for (var i = 0; i < data.PaymentStatus.length; i++) {
                        statusArr.push(data.PaymentStatus[i].Name)
                    }

                    for (var i = 0; i < statusArr.length; i++) {
                        if (unqStatusArr.indexOf(statusArr[i]) == -1) {
                            unqStatusArr.push(statusArr[i]);
                        }
                    }

                    for (var i = 0; i < unqStatusArr.length; i++) {
                        var cnt = 0;
                        var Amt = 0;
                        for (var j = 0; j < data.PaymentStatus.length; j++) {
                            if (unqStatusArr[i] == data.PaymentStatus[j].Name) {
                                cnt = cnt + data.PaymentStatus[j].Count;
                                Amt = Amt + data.PaymentStatus[j].Amount;
                            }
                        }

                        $scope.overallStatus.push({
                            'Name': unqStatusArr[i],
                            'Count': cnt,
                            "Amount": Amt
                        })
                    }

                    $scope.donutColor = myColors;
                    d3.scale.myColors = function() {
                        return d3.scale.ordinal().range(myColors);
                    };
                    $scope.totInboundAmt = 0;
                    $scope.totCount = 0;

                    //Source Channel
                    $scope.dumObj = srcChannelLegenColorGen(data.SourceChannel)

                    $scope.valObj = {
                        "CurDisCustom": srcChannelLegenColorGen(restdata['PaymentStatus']),
                        "test2Custom": srcChannelLegenColorGen(restdata['SourceChannel']),
                        "MopBarCustom": srcChannelLegenColorGen(restdata['MOP']),
                        "sankeyChartCustom": srcChannelLegenColorGen(restdata['PaymentStatus'])
                    }

                    for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {

                        if (userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id != 'sankeyChartCustom') {

                            cahrtFunctnly[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType](userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i])
                            $scope.statusFlag[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].flag;
                        }
                    }

                    outputForSankey(angular.copy(restdata.PaymentStatus), 'curDis')
                    outputForSankey(angular.copy(restdata.SourceChannel), 'srcChannel')
                    outputForSankey(angular.copy(restdata.MOP), 'mop')
                    outputForSankey(angular.copy(restdata.PaymentStatus), 'status')

                    /*** Inbound Channel - Pie chart Count/Amount ***/
                    $scope.click = function(val, id, parentId) {

                        prevIndex = -1;
                        prevObj = -1;
                        preClicked = -1;
                        inbndCntAmt = val;
                        $('#' + parentId).find('.channelLegend').css({
                            'opacity': 1,
                            'font-weight': 'normal'
                        })
                        $('#' + parentId).find('.channelLegendAmt').css({
                            'opacity': 1,
                            'font-weight': 'normal'
                        })

                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {

                            if (id == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id) {

                                cahrtFunctnly[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType](userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i]);

                                if (val == 'Count') {
                                    $scope.statusFlag[id] = false;
                                } else if (val == 'Amount') {
                                    $scope.statusFlag[id] = true;
                                }
                            }
                        }

                        if (val == 'Count') {
                            if (id == 'InboundModal') {
                                $scope.clickedModal = false;
                            }

                        } else if (val == 'Amount') {
                            if (id == 'InboundModal') {
                                $scope.clickedModal = true;
                            }

                        }
                    }

                    //Resizing window
                    $(window).resize(function() {
                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                            if (userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].parentId == "paymentStatusDist") {
                                userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType = 'donut';
                            }

                            cahrtFunctnly[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType](userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i])
                            $scope.statusFlag[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].flag;

                        }
                    })

                    $scope.InboundModal = function(svgId, objKey, eve) {

                        $scope.origObjKey = '';
                        $scope.clickedModal = false;
                        var modalCaption = $(eve.currentTarget).parent().parent().parent().parent().find('.caption').find('span:first-child').html()

                        $('.channelLegendpie').css({
                            'opacity': 1,
                            'font-weight': 'normal'
                        })
                        $('.channelLegendModal').css({
                            'opacity': 1,
                            'font-weight': 'normal'
                        })
                        $('#InboundTotalforModal').css('display', 'none')
                        var winWidth = 0;
                        var winHeight = 0;
                        winWidth = $(window).width();
                        winHeight = $(window).height();
                        var mq = window.matchMedia("(max-width: 991px)");

                        if (mq.matches) {
                            $('#resizeWindow').css({
                                'width': winWidth * 85 / 100 + 'px',
                                'height': '500px'
                            })
                            $('.inbndModalBody').css({
                                'width': winWidth * 80 / 100 + "px",
                                'height': '400px'
                            })
                            $('.modaltestBlock').css({
                                'width': '100%',
                                'height': "900px"
                            })
                            $('#InboundModal').css({
                                'width': "100%",
                                'height': "900px"
                            })
                        } else {
                            $('#resizeWindow').css({
                                'width': winWidth * 59 / 100 + 'px',
                                'height': '890px'
                            })
                            $('.inbndModalBody').css({
                                'width': winWidth * 57.2 / 100 + "px",
                                'height': '800px'
                            })
                            $('.modaltestBlock').css({
                                'width': '100%',
                                'height': "600px"
                            })
                            $('#InboundModal').css({
                                'width': "100%",
                                'height': "600px"
                            })
                        }

                        setTimeout(function() {
                            $('.modaltestBlock').height($('#InboundModal').height())
                        }, 2000)

                        $('#' + svgId).html('')
                        $('#' + svgId).empty('')
                        $scope.objKey = objKey;

                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                            if (userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].basedOn == objKey) {
                                inbndCntAmt = $('#dropVal_' + userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id).html()

                                if (inbndCntAmt == 'Count') {
                                    $scope.clickedModal = false;
                                } else {
                                    $scope.clickedModal = true;
                                }

                                if (userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id == 'CurDisCustom') {
                                    $scope.inbndModalDefChart = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;
                                    break;
                                } else {
                                    $scope.inbndModalDefChart = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;

                                }

                            }
                            // cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i])
                        }

                        $scope.dumObjKey = {
                            "CurDisCustom": "",
                            "test2Custom": "",
                            "MopBarCustom": "",
                            "sankeyChartCustom": ""
                        }

                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                            $scope.dumObjKey[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType
                        }

                        if ($scope.objKey == 'SourceChannel') {
                            $scope.inData = restdata.SourceChannel;
                            //$scope.inbndModalDefChart = sessionStorage.inbndChart;
                            $scope.inbndModalDefChart = $scope.dumObjKey.test2Custom;

                            //$scope.modalData = $scope.dumObj;
                            $scope.modalData = $scope.valObj.test2Custom;
                        } else if ($scope.objKey == 'PaymentStatus') {
                            $scope.inData = restdata.PaymentStatus;
                            //  $scope.inbndModalDefChart = sessionStorage.paymentCurDist;
                            $scope.inbndModalDefChart = $scope.dumObjKey.CurDisCustom;
                            $scope.modalData = $scope.valObj.CurDisCustom;
                            // $scope.modalData = $scope.dumObjCurDist;
                        } else if ($scope.objKey == 'MOP') {
                            //$scope.modalData = $scope.dumObjMOP;
                            //  $scope.inbndModalDefChart = sessionStorage.mopChart;
                            $scope.modalData = $scope.valObj.MopBarCustom;
                            $scope.inbndModalDefChart = $scope.dumObjKey.MopBarCustom;
                            $scope.inData = restdata.MOP;
                        } else if ($scope.objKey == 'PaymentStatus1') {
                            $scope.origObjKey = 'PaymentStatus1';
                            $scope.objKey = 'PaymentStatus';
                            $scope.inData = restdata.PaymentStatus;
                            //$scope.inbndModalDefChart = sessionStorage.statusChart;
                            $scope.inbndModalDefChart = $scope.dumObjKey.sankeyChartCustom;
                            $scope.modalData = $scope.valObj.sankeyChartCustom;
                            // $scope.modalData = $scope.dumObjStatus;
                        }

                        // $('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-toggle').find('.dropVal').html('Count')


                        // $('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-menu').find('li').addClass('listNotSelected').removeClass('listSelected')

                        // $('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-menu').find('li:first-child').removeClass('listNotSelected').addClass('listSelected')

                        $('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-toggle').find('.dropVal').html(inbndCntAmt)
                        setTimeout(function() {
                            $('.listClassModal').removeClass('listSelected listNotSelected')
                            $('#Mdlli_' + inbndCntAmt).removeClass('listNotSelected').addClass('listSelected')
                        }, 200)

                        $('#resizeWindow').find('.modal-body').find('.portlet-title').find('.personalizeClass').find('li').addClass('listNotSelected').removeClass('listSelected')

                        $('#resizeWindow').find('.chartModalLegends').css('display', 'none')
                        setTimeout(function() {
                            $('#resizeWindow').find('.modal-body').find('.row').find('.portlet').find('.portlet-title').find('.caption').find('span').html(modalCaption)
                            $('#' + svgId).css('margin-left', '0px')
                            $('.modaltestBlock').css({
                                'width': '100%'
                            })

                            if ($scope.inbndModalDefChart == 'pie') {

                                $('#InboundTotalforModal').css('display', 'block')
                                $('.modalHt').css('display', 'block')
                                $('#resizeWindow').find('.pieChartSelected').css('display', 'block');

                                chartFunctions.PieChart({
                                    'selectVal': inbndCntAmt,
                                    'id': svgId,
                                    'data': $scope.inData,
                                    'filter': $filter,
                                    'globalData': AllPaymentsGlobalData,
                                    'location': $location
                                })
                            } else if ($scope.inbndModalDefChart == 'donut') {

                                $('#InboundTotalforModal').css('display', 'block')
                                $('.modalHt').css('display', 'block')
                                $('#resizeWindow').find('.donutChartSelected').css('display', 'block');
                                chartFunctions.DonutChart({
                                    'selectVal': inbndCntAmt,
                                    'id': svgId,
                                    'data': $scope.inData,
                                    'filter': $filter,
                                    'globalData': AllPaymentsGlobalData,
                                    'location': $location
                                })
                            } else if ($scope.inbndModalDefChart == 'sankey') {
                                $('.modalHt').css('display', 'block')
                                $('#resizeWindow').find('.sankeyChartSelected').css('display', 'block');
                                var graph = jsonToSankeyData(restdata, $scope.objKey, 'Count', 'totalTrue');
                                chartFunctions.SankeyChart({
                                        'selectVal': inbndCntAmt,
                                        'id': svgId,
                                        'data': graph,
                                        'filter': $filter,
                                        'globalData': AllPaymentsGlobalData,
                                        'location': $location
                                    })
                                    //  $('#' + svgId).css('margin-left', '20px')
                            } else if ($scope.inbndModalDefChart == 'verticalsankey') {

                                $('.modalHt').css('display', 'block')
                                $('#resizeWindow').find('.sankeyChartSelected').css('display', 'block');
                                setTimeout(function() {
                                    var graph = CurrencySankey(restdata, $scope.objKey, 'Count', 'totalFalse');
                                    if ($scope.origObjKey == 'PaymentStatus1') {
                                        var graph = CurrencySankey(restdata, $scope.objKey, 'Count', 'totalFalse');
                                    }

                                    chartFunctions.verticalSankeyChart({
                                        'selectVal': inbndCntAmt,
                                        'id': svgId,
                                        'data': graph,
                                        'filter': $filter,
                                        'globalData': AllPaymentsGlobalData,
                                        'location': $location
                                    })
                                }, 200)

                                //  $('#' + svgId).css('margin-left', '20px')
                            } else if ($scope.inbndModalDefChart == 'horizontal') {
                                $('.modalHt').css('display', 'none')
                                $('#InboundModal').css('height', $('.inbndModalBody').height() + 'px')
                                var HorizData = commonFunctions.formatingData($scope.inData)
                                chartFunctions.HorizontalMultibarChart({
                                    'selectVal': inbndCntAmt,
                                    'id': svgId,
                                    'data': HorizData,
                                    'filter': $filter,
                                    'globalData': AllPaymentsGlobalData,
                                    'location': $location
                                })
                            } else if ($scope.inbndModalDefChart == 'vertical') {

                                $('.modalHt').css('display', 'none')
                                $('#InboundModal').css('height', $('.inbndModalBody').height() + 'px')
                                var vertData = commonFunctions.formatingData($scope.inData)
                                vertData.sort(compare);
                                chartFunctions.VerticalMultibarChart({
                                    'selectVal': inbndCntAmt,
                                    'id': svgId,
                                    'data': vertData,
                                    'filter': $filter,
                                    'globalData': AllPaymentsGlobalData,
                                    'location': $location
                                })
                            }
                        }, 300)
                    }

                    $scope.selectFrmModal = function(val, id) {
                        $('.modaltestBlock').css('height', $('#' + id).height() + 'px')
                        inbndCntAmt = val;

                        if (val == 'Count') {
                            $scope.clickedModal = false;
                        } else {
                            $scope.clickedModal = true;
                        }
                        var inputData;

                        cahrtFunctnly[$scope.inbndModalDefChart]({
                            'chartTitle': '',
                            'chartType': $scope.inbndModalDefChart,
                            'id': id,
                            'parentId': 'resizeWindow',
                            'basedOn': $scope.objKey
                        })

                    }

                    $scope.insideModalPersonalize = function(chartId, chartType, evt) {

                        $('#' + chartId).parent().parent().parent().parent().parent().parent().find('.portlet-title').find('.actions').find('.dropdown').first().find('ul').find('li').addClass('listNotSelected').removeClass('listSelected')
                        $(evt.currentTarget).addClass('listSelected').removeClass('listNotSelected')
                        $('.custDropDownInsideModal').find('button').find('span:first-child').html('Count')
                        $('.custDropDownInsideModal').find('ul').find('li').removeClass('listSelected').addClass('listNotSelected')
                        $('.custDropDownInsideModal').find('ul').find('li:first-child').removeClass('listNotSelected').addClass('listSelected')

                        $('#resizeWindow').find('.chartModalLegends').css('display', 'none')
                        $scope.clickedModal = false;
                        $('#' + chartId).html('');
                        $('#' + chartId).empty();
                        $scope.inbndModalDefChart = chartType;
                        $('#' + chartId).parent().addClass('animated fadeInUp')
                        setTimeout(function() {
                            $('#' + chartId).parent().removeClass('animated fadeInUp')
                        }, 1000)

                        $('#InboundTotalforModal').css('display', 'none')

                        cahrtFunctnly[chartType]({
                            'chartTitle': '',
                            'chartType': chartType,
                            'id': chartId,
                            'parentId': 'resizeWindow',
                            'basedOn': $scope.objKey
                        })
                        $('.modaltestBlock').css('height', $('#' + chartId).height() + 'px')
                    }

                    $scope.makeitMove = function() {
                        $('.dragHandle').css('cursor', 'move')
                        $('.droppable').mouseenter(function() {
                            $(this).css('border', '2px dotted #000')
                        })
                        $('.droppable').mouseleave(function() {
                            $(this).css('border', '2px dotted transparent')
                        })

                        $(function() {
                            $(".sTrack").sortable({
                                start: function(event, ui) {
                                    $('.droppable').find('.caption').css('pointer-events', 'none')
                                },
                                stop: function(event, ui) {
                                    $('.droppable').find('.caption').css('pointer-events', 'auto')
                                }
                            });
                        });
                    }

                    $scope.deleteChart = function(id) {
                        $('#' + id).fadeOut(500)

                        if (id == 'pymtCurDisChart') {
                            $scope.uSetting.paymentDashboard.CurDisCustom = false;
                        }
                        if (id == 'inbndChart') {
                            $scope.uSetting.paymentDashboard.InbndPaymentCustom = false;
                        }
                        if (id == 'MOPDist') {
                            $scope.uSetting.paymentDashboard.MopBarCustom = false;
                        }
                        if (id == 'paymentStatusDist') {
                            $scope.uSetting.paymentDashboard.sankeyChartCustom = false;
                        }
                        enableDisableChart()
                    }

                    $scope.datas = {
                        "title": "",
                        "chartType": ""
                    };

                    $scope.getChartName = function(name, svgid, key) {

                        $scope.datas = {
                            "chartType": "",
                            "title": ""
                        };

                        $scope.chartName = name;
                        $scope.svgId = svgid;
                        $scope.objKey = key;

                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                            if (svgid == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id) {
                                $scope.datas.chartType = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;
                            }
                        }
                    }

                    // Personalization Config
                    $scope.personalizeChart = function(data) {

                        for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                            delete userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].data;
                        }

                        if ((data.title != '') || (data.chartType != '')) {

                            $scope.curDistClicked = false;
                            $scope.clicked = false;
                            $scope.paymentClicked = false;
                            $('.channelLegend').css({
                                'opacity': 1,
                                'font-weight': 'normal'
                            })
                            $('.modal').modal('hide')

                            if (data.title) {
                                $('#' + $scope.chartName).find('.caption').find('span:first-child').html(data.title)
                            }
                            $('#dropVal_' + $scope.svgId).html('Count')
                            $('#dropVal_' + $scope.svgId).parent().next().find('li').addClass('listNotSelected').removeClass('listSelected')
                            $('#dropVal_' + $scope.svgId).parent().next().find('li:first-child').removeClass('listNotSelected').addClass('listSelected')

                            var inputData;
                            var parentId;

                            if (data.chartType) {
                                $scope.donutChartSelected = false;
                                $scope.sankeyChartSelected = false;
                                $scope.pieChartSelected = false;

                                $('#' + parentId).find('.legendHolder').find('.chartLegends').css('display', 'none')
                                $scope.InbndModalDef = data.chartType;
                                $('#' + $scope.svgId).css('margin-left', '0px')
                                $('#InboundTotalforModal').hide()
                                $('#' + $scope.svgId).html('')
                                $('#' + $scope.svgId).empty()
                                $('#' + $scope.svgId).parent().addClass('animated fadeInUp')
                                setTimeout(function() {
                                    $('#' + $scope.svgId).parent().removeClass('animated fadeInUp')
                                }, 1000)

                                for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                                    if ($scope.svgId == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id) {
                                        cahrtFunctnly[data.chartType]({
                                            'chartTitle': userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartTitle,
                                            'chartType': data.chartType,
                                            'id': $scope.svgId,
                                            'parentId': userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].parentId,
                                            'basedOn': userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].basedOn
                                        })
                                        userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType = data.chartType;
                                    }
                                }

                                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function(response) {

                                    $scope.alerts = [{
                                        type: response.Status,
                                        msg: (response.Status == 'success') ? response.data.data.responseMessage : response.data.data.error.message
                                    }];
                                    $scope.alertWidth = alertSize().alertWidth;
                                    $timeout(function() {
                                        callOnTimeOut()
                                    }, 4000)

                                })

                            }
                        }
                    }

                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (status == 401) {
                    errorservice.ErrorMsgFunction(config, $scope, $http)

                } else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];

                }
            });
        }
        $scope.dashboardData()
    }

    $scope.fileStatusColor = [{
        "Status": "DEBULKED",
        "Color": "#6D9B5B"
    }, {
        "Status": "DUPLICATE",
        "Color": "#8775a7"
    }, {
        "Status": "HOLD",
        "Color": "#ab7019"
    }, {
        "Status": "IN_PROGRESS",
        "Color": "#6D9B5B"
    }, {
        "Status": "PENDING",
        "Color": "#578ebe"
    }, {
        "Status": "RECEIVED",
        "Color": "#777"
    }, {
        "Status": "REJECTED",
        "Color": "#e35b5a"
    }, {
        "Status": "REPAIR",
        "Color": "#ff9933"
    }];

    $scope.selectStatuscolor = function(status) {
        for (i in $scope.fileStatusColor) {
            if (status == $scope.fileStatusColor[i].Status) {
                return $scope.fileStatusColor[i].Color
            }
        }
    }

    var fileContObj = {
        getCurrencySymbol: function(dCntAmt, keyName) {
            dCntAmt = String(dCntAmt);
            var xx = $filter('isoCurrency')(dCntAmt, keyName)

            if (xx.indexOf(',') != -1) {
                var yy = xx.split(',');
                xx = '';
                for (var i in yy) {
                    xx = xx + yy[i]
                }
            }
            xx = xx.replace(dCntAmt, '');
            xx = xx.split('.')[0];

            if (xx.indexOf('0') != -1) {
                xx = xx.replace('0', '')
                xx = xx + " " + keyName
            } else {
                xx = xx.split('.')[0] + " " + keyName;
            }
            return xx;
        }
    }

    $scope.fileDashboard = function() {

        var restdataFile = {};
        //    $scope.PayState = true;
        $scope.dashboardData = function(obj) {
            $http({
                url: BASEURL + RESTCALL.fileDashboard,
                method: "POST",
                data: obj,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                restdataFile = data;
                d3.scale.myColors = function() {
                    return d3.scale.ordinal().range(myColors);
                };

                $scope.fileNotfound = false;

                $('.custDropDown').find('button').find('span:first-child').html('Count');
                $('.custDropDown').find('ul').find('li').removeClass('listSelected').removeClass('listNotSelected')
                $('.custDropDown').find('ul').find('li:first-child').addClass('listSelected').removeClass('listNotSelected')

                var fileCntAmt = 'Count';

                $scope.fileDetailChart = function(val) {
                    var inData = angular.copy($scope.restdataFileStatus);

                    fileCntAmt = val;
                    FileDonut = val;
                    var LinechartData = "";
                    var BarChart,
                        BarChartDatum,
                        LineChart,
                        LineChartDatum,
                        BarchartconstructedObj,
                        BarchartconstructedObj1,
                        statusChart;
                    $scope.individual = '';
                    nv.addGraph(function() {
                        var constructedObj = constructObject.constructObj(constructObject.getUniqueVal(inData, "PSACode"), inData, "PSACode");
                        var getTotalVal = constructObject.calcTotal(constructedObj, FileDonut).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $scope.fileDonutHeader = 'All (' + constructObject.calcTotal(constructedObj, FileDonut) + ')'

                        var Donutchart = nv.models.pieChart()
                            .x(function(d) {
                                d.key = $filter('underscoreRemove')(d.key)
                                return d.key
                            })
                            .y(function(d) {
                                return d[FileDonut]
                            })
                            .color(d3.scale.myColors().range())
                            .showLabels(true)
                            .title(getTotalVal)
                            .labelThreshold(.05) //Configure the minimum slice size for labels to show up
                            .valueFormat(function(d) {
                                return d3.format(',')(d);
                            })
                            .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                            .donut(true) //Turn on Donut mode. Makes pie chart look tasty!
                            .donutRatio(0.35) //Configure how big you want the donut hole size to be.
                            .showLegend(true)
                            .margin({
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            });
                        Donutchart.legend.updateState(false);

                        d3.select("#FileDetailsDonutChart svg").datum(constructedObj).call(Donutchart);

                        /*Custom Title begins here*/
                        d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select("#cstmtitle").remove();
                        d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select('.nv-pie-title').each(function(d) {
                                d3.select(this.parentNode).append("svg:text").attr("id", "cstmtitle").attr("dy", "0em").attr("transform", "translate(0, 0)").attr("style", "text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class', 'nv-pie-title').text('Total ' + val);
                                d3.select(this.parentNode).append("svg:text").attr("id", "cstmtitle").attr("dy", "1.25em").attr("transform", "translate(0, 0)").attr("style", "text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class', 'nv-pie-title').text(getTotalVal);
                                d3.select(this).remove()
                            })
                            /*Custom Title Ends here*/

                        /*Custom Lable begins here*/
                        /* d3.select(".nv-pieLabels").selectAll(".nv-label").selectAll("#cstmtxt").remove();
                        d3.select(".nv-pieLabels").selectAll(".nv-label").append("svg:text").attr("id","cstmtxt").attr("dy","15").attr("style","text-anchor: middle; fill: rgb(0, 0, 0);");
                        d3.select(".nv-pieLabels").selectAll(".nv-label").selectAll("text").each(function(d){
                        if((d3.select(this).attr('id')=="cstmtxt")){
                        d3.select(this).text(Math.round((d.value * 100/getTotalVal).toFixed(1)) + '%')
                        d3.select(this.parentNode).selectAll("text").each(function(){
                        if((d3.select(this).attr('id')==null)&&(d3.select(this).text()==''))
                        d3.select(this.parentNode).select('#cstmtxt').text('')
                        })
                        }
                        }) */
                        /*Custom Title Ends here*/

                        /*Get the arc value for restoration starts here*/
                        Donutchart.dispatch.on("renderEnd", function() {
                            arcDetails = [];
                            d3.select("#FileDetailsDonutChart svg").select(".nv-pie").selectAll(".nv-slice").selectAll("path").each(function() {
                                arcDetails.push(d3.select(this).attr("d"))
                            })
                        })

                        d3.select("FileDetailsDonutChart svg").select('.nv-pie').selectAll(".nv-slice").attr('sliceClicked', null).classed('hover', false);

                        prevI = -1;

                        $scope.fileChannelSelected = '';
                        Donutchart.pie.dispatch.on("elementClick", function(e) {

                            var Filestatus,
                                compareStatus,
                                obtainedStatus;
                            var obtainedCurrency = [],
                                compareCurrency = [];

                            if (prevI != e.index) {
                                $scope.fileChannelSelected = e.data.key;

                                $scope.backup = angular.copy(e.data.values)

                                //var getKey = (e.data.values.length)?e.data.values[0].PSACode:'';
                                var getKey = e.data.values[0].PSACode;

                                e.data.values = [];

                                var nCnt = 0;
                                for (var l in inData) {
                                    if (getKey == inData[l].PSACode) {
                                        e.data.values.push({
                                            "PSACode": inData[l].PSACode,
                                            "Count": inData[l].Count,
                                            "Status": inData[l].Status,
                                            "Currency": inData[l].Currency
                                        })
                                    }
                                }

                                if (e.data.values.length == 0) {
                                    e.data.values = $scope.backup;
                                }

                                for (Cr in e.data.values) {

                                    if (e.data.values[Cr]['Status'] == "DEBULKED" || e.data.values[Cr]['Status'] == "Matched" || e.data.values[Cr]['Status'] == "MATCHED") {

                                        if (e.data.values[Cr].Currency) {
                                            obtainedCurrency.push(e.data.values[Cr])
                                        }
                                    }
                                }
                                /******************************/

                                /* var dum = constructObject.getUniqueVal($scope.RData, "Currency");
                                for(Cr in dum){
                                if(dum[Cr]){
                                compareCurrency.push(dum[Cr])
                                }
                                }*/

                                /*if(obtainedCurrency.length < compareCurrency.length){
                                var missingStatus = arr_diff(compareCurrency, constructObject.getUniqueVal(obtainedCurrency, "Currency"));
                                for (var k in missingStatus) {
                                obtainedCurrency.push({
                                'Currency': missingStatus[k],
                                'Count':0,
                                'Amount':0
                                });
                                }
                                }*/

                                //obtainedCurrency = $filter('orderBy')(obtainedCurrency,'Currency')

                                d3.select(e.Iam.parentNode).selectAll(".nv-slice").classed('hover', true);
                                d3.select(e.Iam).classed('hover', false).attr('sliceClicked', 'true');
                                d3.select(d3.select(e.Iam.parentNode).selectAll(".nv-slice")[0][prevI]).attr('sliceClicked', null).select("path").attr("d", arcDetails[prevI]);


                                prevI = e.index;
                                getTotalVal = constructObject.calcTotal(obtainedCurrency, FileDonut);
                                Filestatus = e.data.key + " (" + getTotalVal + ")";
                                $scope.individualName = e.data.key
                                $scope.fileDonutHeader = e.data.key + ' (' + e.data[FileDonut] + ')'

                                var obtainedStatus = constructObject.constructObj1(constructObject.getUniqueVal(e.data.values, "Status"), e.data.values, "Status");

                                compareStatus = constructObject.getUniqueVal(inData, "Status");
                                if (obtainedStatus.length < compareStatus.length) {
                                    var missingStatus = arr_diff(compareStatus, constructObject.getUniqueVal(obtainedStatus, "Name"));
                                    for (var k in missingStatus) {
                                        obtainedStatus.push({
                                            'Name': missingStatus[k],
                                            'Count': 0,
                                            'Amount': 0
                                        });
                                    }

                                }
                                obtainedStatus = $filter('orderBy')(obtainedStatus, 'Name')
                                statusChart.barColor([myColors[e.index]])

                                d3.select('#lineChart svg').datum([{
                                    values: obtainedStatus
                                }]).call(statusChart);

                            } else {

                                $scope.fileChannelSelected = "";
                                d3.select(e.Iam.parentNode).selectAll(".nv-slice").attr('sliceClicked', null).classed('hover', false);
                                BarchartconstructedObj = $filter('orderBy')(BarchartconstructedObj, 'Name')

                                BarChart.x(function(d) {
                                        //return constructObject.getCurrencySymbol(d, 'Name')
                                        return fileContObj.getCurrencySymbol(d[fileCntAmt], d.Name)
                                    }).color(d3.scale.myColors().range())
                                    //d3.select('#barChart svg').datum([{values : BarchartconstructedObj}]).transition().duration(500).call(BarChart);
                                d3.select('#barChart svg').datum([{
                                    values: BarchartconstructedObj
                                }]).call(BarChart);
                                prevI = -1;
                                getTotalVal = constructObject.calcTotal(BarchartconstructedObj, FileDonut);
                                Filestatus = "ALL" + " (" + getTotalVal + ")";
                                $scope.individualName = 'ALL'

                                statusChart.barColor(function(d, i) {
                                        return myColors[i]
                                    })
                                    //d3.select('#lineChart svg').datum([{values : BarchartconstructedObj1}]).transition().duration(750).call(statusChart);
                                d3.select('#lineChart svg').datum([{
                                    values: BarchartconstructedObj1
                                }]).call(statusChart);
                                $scope.fileDonutHeader = 'All (' + constructObject.calcTotal(constructedObj, FileDonut) + ')'
                            }
                            $scope.$apply(function() {
                                $scope.barChartTitle = "File Channel - " + Filestatus;
                                //$scope.individual = Filestatus;

                            });
                            nv.utils.windowResize(BarChart.update);
                        });

                        nv.utils.windowResize(function(d) {
                            Donutchart.update();
                            d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select("#cstmtitle").remove();
                            d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select('.nv-pie-title').each(function(d) {
                                d3.select(this.parentNode).append("svg:text").attr("id", "cstmtitle").attr("dy", "0em").attr("transform", "translate(0, 0)").attr("style", "text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class', 'nv-pie-title').text('Total ' + val);
                                d3.select(this.parentNode).append("svg:text").attr("id", "cstmtitle").attr("dy", "1.25em").attr("transform", "translate(0, 0)").attr("style", "text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class', 'nv-pie-title').text(getTotalVal);
                                d3.select(this).remove()
                            })
                        });
                        return Donutchart;
                    });

                    //Line Chart
                    nv.addGraph(function() {
                        BarchartconstructedObj1 = constructObject.constructObj1(constructObject.getUniqueVal(inData, "Status"), inData, "Status");

                        BarchartconstructedObj1 = $filter('orderBy')(BarchartconstructedObj1, 'Name')

                        statusChart = nv.models.multiBarHorizontalChart()
                            .x(function(d) {
                                return d.Name
                            })
                            .y(function(d) {
                                return d[FileDonut]
                            })
                            .barColor(function(d, i) {
                                //return myColors[i]
                                return $scope.selectStatuscolor([d.Name])
                            })
                            .showValues(true)
                            .valueFormat(function(d) {
                                return d3.format(',')(d);
                            })
                            .showControls(false)
                            .showLegend(false)
                            .margin({
                                left: 90,
                                bottom: 0,
                                top: 0
                            })
                            .showYAxis(false);
                        d3.select('#lineChart svg').datum([{
                            values: BarchartconstructedObj1
                        }]).call(statusChart);

                        function wrap() {
                            d3.select('#lineChart svg').selectAll(".nv-x.nv-axis .tick text").each(function(i, e) {
                                var text = d3.select(this),
                                    words = text.text().split(/\s+/).reverse(),

                                    word,
                                    line = [],
                                    lineNumber = 0,
                                    lineHeight = 1.0, // ems
                                    y = text.attr("y"),
                                    dy = parseFloat(text.attr("dy")),
                                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                                var txt = [];
                                for (var i in words) {
                                    if (words[i].indexOf('_') != -1) {
                                        var tArr = words[i].split('_');

                                        for (var i in tArr) {
                                            txt.push(tArr[i])
                                        }

                                    } else {
                                        txt = words;
                                    }
                                }
                                words = txt;

                                words.reverse()
                                while (word = words.pop()) {

                                    line.push(word);
                                    tspan.text(line.join(" "));
                                    // TDOD : Make 80 a dynamic value based on the bar width/height
                                    if (tspan.node().getComputedTextLength() > 80) {
                                        line.pop();
                                        tspan.text(line.join(" "));
                                        line = [word];
                                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                                    }
                                }
                            })
                        }
                        wrap();
                        nv.utils.windowResize(function() {
                            statusChart.update();
                            wrap();
                        })

                        statusChart.multibar.dispatch.on("elementClick", function(e) {

                            if ($scope.fileChannelSelected) {
                                $scope.fileChannelSelected = $filter('addunderscore')($scope.fileChannelSelected)
                            }

                            dBoardtoFileList(GlobalService, e.data.Name, $scope.fileChannelSelected)

                            $state.go("app.instructions")
                            $('.nvtooltip').css({
                                'display': 'none'
                            });
                            $('.toggleTop').click()
                        });

                        return statusChart;
                    });

                    /**Instruction Currency Dist**/
                    var instCurDis = {
                        horizontal: function(val) {
                            var arg1 = {};
                            arg1.chartTitle = '';
                            arg1.chartType = 'vertical';
                            arg1.id = 'verticalChart',
                                arg1.parentId = 'barChart1',
                                arg1.basedOn = 'FileStatus'

                            arg1.flag = false;
                            arg1.filter = $filter;
                            arg1.location = $location;
                            arg1.selectVal = val;
                            arg1.globalData = GlobalService;
                            arg1.from = "instructions"

                            var vertData = commonFunctions.forMatforInstn($scope.initData.FileStatus);
                            arg1.data = vertData;
                            vertData.sort(compare);
                            chartFunctions.VerticalMultibarChart(arg1)

                            /*setChartProp.horizontalVertical(arg1)
                            arg1.flag = false;
                            arg1.filter = $filter;
                            arg1.location = $location;
                            arg1.globalData = AllPaymentsGlobalData;
                            arg1.selectVal = inbndCntAmt;

                            var HorizData = commonFunctions.formatingData(restdata[arg1.basedOn])
                            arg1.data = HorizData;
                            chartFunctions.HorizontalMultibarChart(arg1)*/
                        }
                    }

                    instCurDis.horizontal("Count")

                    $scope.curDisChart = function(val) {
                        instCurDis.horizontal(val)

                    }
                }

                //this condition works when the data is not present
                if ((Object.keys(restdataFile).length == 0) || (Object.keys(restdataFile).indexOf('PSAStatus') == -1)) {

                    //this condition works when the data is empty
                    $scope.fileNotfound = true;

                    $scope.checkstatusBarVal()

                    PersonService1.GetChart1().then(function(items) {
                        $scope.restdataFileStatus = items.data.FileStatus;
                        $scope.RData = items.data.FileStatus;
                        var FileDonut,
                            prevI,
                            arcDetails;
                        $scope.barChartTitle = '';
                        $scope.initData = angular.copy(items.data);

                        $scope.fileDetailChart(fileCntAmt);

                    });
                } else {
                    //this condition works when the data is present

                    $scope.fileNotfound = false;

                    $scope.fCntAmt = [];

                    $scope.uniqueFileStatus = constructObject.getUniqueVal(restdataFile.FileStatus, 'Status')
                    for (var i in $scope.uniqueFileStatus) {
                        $scope.fCnt = 0;
                        for (var j in restdataFile.FileStatus) {
                            if ($scope.uniqueFileStatus[i] == restdataFile.FileStatus[j].Status) {
                                $scope.fCnt = $scope.fCnt + restdataFile.FileStatus[j].Count;
                            }
                        }

                        $scope.fCntAmt.push({
                            'Status': $scope.uniqueFileStatus[i],
                            'Count': $scope.fCnt
                        })
                    }

                    for (var i in $scope.statusBarValFile) {
                        for (var j in $scope.fCntAmt) {
                            if ($scope.statusBarValFile[i].NavStatus == $scope.fCntAmt[j].Status) {
                                $scope.statusBarValFile[i].Count = $scope.fCntAmt[j].Count;
                            }
                        }
                    }

                    /*** File Details Chart Control Starts Here ***/

                    $scope.restdataFileStatus = restdataFile.FileStatus;
                    var FileDonut,
                        prevI,
                        arcDetails;
                    $scope.barChartTitle = '';
                    $scope.initData = angular.copy(restdataFile);

                    $scope.fileDetailChart(fileCntAmt);
                    /*** File Details Chart Control Ends Here ***/
                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (status == 401) {
                    errorservice.ErrorMsgFunction(config, $scope, $http)
                } else {

                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                }
            });

            var find1 = $('.custDropDown').find('.mylist li:first-child');
            //var _id = find1.attr('id').split('_')[1];

            $(find1).addClass('listSelected');

            var childTxt = "Count";
            var txt = "All";

            $scope.chartDrop = function(eve) {
                var parent = $(eve.currentTarget).parent().parent().find('button').find('a')

                var parentTxt = parent.text();

                var child = $(eve.currentTarget);
                var id = child.attr('id').split('_')[1];
                //childTxt = child.text()
                childTxt = child.find('a').html()

                $(parent).parent().find('span').html($(child).attr('tooltip'))
                if (id == 'Count' || id == 'Amount') {
                    $('.listClassModal ').addClass('listNotSelected').removeClass('listSelected')
                }

                if (id == 1 || id == 2) {
                    $('.listClass1').addClass('listNotSelected').removeClass('listSelected')
                }
                if (id == 3 || id == 4) {
                    $('.listClass2').addClass('listNotSelected').removeClass('listSelected')

                }
                if (id == 5 || id == 6) {
                    $('.listClass3').addClass('listNotSelected').removeClass('listSelected')

                }
                if (id == 7 || id == 8) {
                    $('.listClass4').addClass('listNotSelected').removeClass('listSelected')

                }
                if (id == 9 || id == 10) {
                    $('.listClass5').addClass('listNotSelected').removeClass('listSelected')
                }
                if (id == 11 || id == 12) {
                    $('.listClass6').addClass('listNotSelected').removeClass('listSelected')
                }
                if (id == 13 || id == 14) {
                    $('.listClass7').addClass('listNotSelected').removeClass('listSelected')
                }
                // if (id == 11 || id == 12) {
                // 	$('.listClass6').addClass('listNotSelected').removeClass('listSelected')
                // }
                $(child).addClass('listSelected').removeClass('listNotSelected');

                $(parent).html(childTxt)
            }

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

        }

        //$scope.allData = DashboardService.allData;
        $scope.allData = true;

        var objData = {};

        if ($scope.allData) {
            objData = {};
            objData.IsAllInfoRead = true;
            $scope.dashboardData(objData);
        }

        $scope.dashboardPrint = function() {
            $('[data-toggle="tooltip"]').tooltip('hide');
            window.print()
        }

        /* 	$scope.dashboardToAllPayment = function (status) {

        AllPaymentsGlobalData.fromDashboard = true;
        AllPaymentsGlobalData.paymentStatusDropVal = status;
        AllPaymentsGlobalData.AdPaymentId = "";
        AllPaymentsGlobalData.CreditorAccount = "";
        AllPaymentsGlobalData.CreditorCustomerId = "";
        AllPaymentsGlobalData.CreditorName = "";
        AllPaymentsGlobalData.DataLoadedCount = 20;
        AllPaymentsGlobalData.DebtorAccount = "";
        AllPaymentsGlobalData.DebtorCustomerId = "";
        AllPaymentsGlobalData.DebtorName = "";
        AllPaymentsGlobalData.FLuir = "";
        AllPaymentsGlobalData.MOPoptionDropVal = "--Select--";
        AllPaymentsGlobalData.Paymentstatus = true;
        AllPaymentsGlobalData.SelectSearchVisible = false;
        AllPaymentsGlobalData.ShowEndDate = "";
        AllPaymentsGlobalData.ShowStartDate = "";
        AllPaymentsGlobalData.adAmount = false;
        AllPaymentsGlobalData.adCreditorAccount = false;
        AllPaymentsGlobalData.adCreditorCustomId = false;
        AllPaymentsGlobalData.adCreditorName = false;
        AllPaymentsGlobalData.adDebtorAccount = false;
        AllPaymentsGlobalData.adDebtorCustomId = false;
        AllPaymentsGlobalData.adDebtorName = false;
        AllPaymentsGlobalData.adEntrydate = false;
        AllPaymentsGlobalData.adMop = false;
        AllPaymentsGlobalData.adMsgrefid = false;
        AllPaymentsGlobalData.adPaymentcurrency = false;
        AllPaymentsGlobalData.adPaymentid = false;
        AllPaymentsGlobalData.adSrcchannel = false;
        AllPaymentsGlobalData.adValuedate = false;
        AllPaymentsGlobalData.advancedSearchEnable = true;
        AllPaymentsGlobalData.advancedUIR = false;
        AllPaymentsGlobalData.all = true;
        AllPaymentsGlobalData.amountEnd = "";
        AllPaymentsGlobalData.amountStart = "";
        AllPaymentsGlobalData.custom = false;
        AllPaymentsGlobalData.ddCreditorAccountNumber = false;
        AllPaymentsGlobalData.ddCreditorCustomId = false;
        AllPaymentsGlobalData.ddCreditorName = false;
        AllPaymentsGlobalData.ddDebtorAccountNumber = false;
        AllPaymentsGlobalData.ddDebtorCustomId = false;
        AllPaymentsGlobalData.ddDebtorName = false;
        AllPaymentsGlobalData.endDate = "";
        AllPaymentsGlobalData.entryenddate = "";
        AllPaymentsGlobalData.entrystartdate = "";
        AllPaymentsGlobalData.isEntered = false;
        AllPaymentsGlobalData.isSortingClicked = false;
        AllPaymentsGlobalData.month = false;
        AllPaymentsGlobalData.monthEnd = "";
        AllPaymentsGlobalData.monthStart = "";
        AllPaymentsGlobalData.msgRefId = "";
        AllPaymentsGlobalData.myProfileFLindex = "";
        AllPaymentsGlobalData.orderByField = "ReceivedDate";
        AllPaymentsGlobalData.paymentCurrencyDropVal = "--Select--";
        AllPaymentsGlobalData.prev = "all";
        AllPaymentsGlobalData.prevId = 1;
        AllPaymentsGlobalData.prevSelectedTxt = "all";
        AllPaymentsGlobalData.searchClicked = false;
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.searchname = "";
        AllPaymentsGlobalData.selectCriteriaID = 1;
        AllPaymentsGlobalData.selectCriteriaTxt = "All";
        AllPaymentsGlobalData.sortReverse = false;
        AllPaymentsGlobalData.sortType = "Desc";
        AllPaymentsGlobalData.srcChannelDropVal = "--Select--";
        AllPaymentsGlobalData.startDate = "";
        AllPaymentsGlobalData.today = false;
        AllPaymentsGlobalData.todayDate = "";
        AllPaymentsGlobalData.uirTxtValue = "";
        AllPaymentsGlobalData.valueenddate = "";
        AllPaymentsGlobalData.valuestartdate = "";
        AllPaymentsGlobalData.week = false;
        AllPaymentsGlobalData.weekEnd = "";
        AllPaymentsGlobalData.weekStart = "";

        AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status];

        $location.path('app/allpayments');

        }
         */
        /*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

        $scope.widthOnScroll = function() {
            var mq = window.matchMedia("(max-width: 991px)");
            var headHeight
            if (mq.matches) {
                headHeight = 0;
                $scope.alertWidth = $('.pageTitle').width();
            } else {
                $scope.alertWidth = $('.pageTitle').width();
                headHeight = $('.main-header').outerHeight(true) + 10;
            }
            $scope.alertStyle = headHeight;
        }

        $scope.widthOnScroll();

        $timeout(function() {
            mediaMatches();
        }, 10)

        /*** On window resize ***/
        $(window).resize(function() {
            mediaMatches()
            $scope.$apply(function() {
                $scope.alertWidth = $('.alertWidthonResize').width();
            });
        });
        /*** On window resize ***/

        $('.channelLegendInbnd,.channelLegendCurDis,.channelLegendMOP,.channelLegendStatus').css({
            'opacity': 1,
            'font-weight': 'normal'
        })

    };

    setTimeout(function() {
        $scope.initialCall();
        $scope.fileDashboard()
    }, 100)

    $scope.dashboardPrint = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()
    }

    $scope.dashboardToFileList = function(status) {
        dBoardtoFileList(GlobalService, status)
            //$location.path('app/filelist')
        $state.go("app.instructions")
    }

    $scope.dashboardToAllPayment = function(status) {

        AllPaymentsGlobalData.fromDashboard = true;
        AllPaymentsGlobalData.DataLoadedCount = 20;
        AllPaymentsGlobalData.FLuir = "";
        AllPaymentsGlobalData.SelectSearchVisible = false;
        AllPaymentsGlobalData.advancedSearchEnable = true;
        AllPaymentsGlobalData.all = true;
        AllPaymentsGlobalData.custom = false;
        AllPaymentsGlobalData.endDate = "";
        AllPaymentsGlobalData.isEntered = false;
        AllPaymentsGlobalData.isSortingClicked = false;
        AllPaymentsGlobalData.month = false;
        AllPaymentsGlobalData.monthEnd = "";
        AllPaymentsGlobalData.monthStart = "";
        AllPaymentsGlobalData.myProfileFLindex = "";
        AllPaymentsGlobalData.prev = "all";
        AllPaymentsGlobalData.prevId = 1;
        AllPaymentsGlobalData.prevSelectedTxt = "all";
        AllPaymentsGlobalData.searchClicked = false;
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.searchname = "";
        AllPaymentsGlobalData.selectCriteriaID = 1;
        AllPaymentsGlobalData.selectCriteriaTxt = "All";
        AllPaymentsGlobalData.sortReverse = false;
        AllPaymentsGlobalData.sortType = "Desc";
        AllPaymentsGlobalData.startDate = "";
        AllPaymentsGlobalData.today = false;
        AllPaymentsGlobalData.todayDate = "";
        AllPaymentsGlobalData.uirTxtValue = "";
        AllPaymentsGlobalData.week = false;
        AllPaymentsGlobalData.weekEnd = "";
        AllPaymentsGlobalData.weekStart = "";
        AllPaymentsGlobalData.orderByField = "ReceivedDate";

        AllPaymentsGlobalData.searchParams = {
            "InstructionData": {
                "ReceivedDate": {
                    "Start": "",
                    "End": ""
                },
                "ValueDate": {
                    "Start": "",
                    "End": ""
                },
                "Amount": {
                    "Start": "",
                    "End": ""
                }
            }
        };

        AllPaymentsGlobalData.searchParams.Status = status;
        AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status];

        //$state.go('app.payment');
        $location.path('app/allpayments');
    }

    $scope.findCnt = function(cnt) {

        var tot = 0;
        for (var i in cnt) {
            tot = tot + cnt[i].Count
        }
        return tot;
    }

    $scope.getColor = function(status) {
        return commonFunctions.selectStatuscolor(status)
    }

    function attachMsgandBidSummary() {
        
        attachdandbidLoaded = false;
        $('#Custm1').html('')
        $('#Custm2').html('')

        AttchdMsgobj = [];
        BIDmsgObj = [];

        $http.get(BASEURL + RESTCALL.PaymentAttachedMessage).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.Attachmsg) {
                $scope.noAttchedMessge = false;
                var attchdData = data.Attachmsg;
                for (i in attchdData) {
                    AttchdMsgobj.push({
                        'Name': attchdData[i].AttachMsgStatus,
                        'Count': attchdData[i].StatusCount,
                        'Currency': '',
                        'Amount': ''
                    })
                }

            } else {
                $scope.noAttchedMessge = true;
                AttchdMsgobj = [{
                    "Name": "WAIT_IN_RROF",
                    "Amount": '',
                    "Currency": "",
                    "Count": 3
                }, {
                    "Name": "PENDING_APPROVAL",
                    "Amount": '',
                    "Currency": "",
                    "Count": 2
                }]

            }
            $scope.attachObj = {
                'Custm1': srcChannelLegenColorGen(AttchdMsgobj)
            }
            chartFunctions.PieChart({
                'selectVal': "Count",
                'id': "Custm1",
                'data': AttchdMsgobj,
                'filter': $filter,
                'globalData': AllPaymentsGlobalData,
                'location': $location
            })
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });

        $http.get(BASEURL + RESTCALL.PaymentBIDSummary).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.BIDmsg) {
                $scope.noBIDMessage = false;
                var BIDsummry = data.BIDmsg
                for (j in BIDsummry) {
                    BIDmsgObj.push({
                        'Name': BIDsummry[j].BIDStatus,
                        'Count': BIDsummry[j].StatusCount,
                        'Currency': '',
                        'Amount': ''
                    })
                }

            } else {
                $scope.noBIDMessage = true;
                BIDmsgObj = [{
                    "Name": "PENDING",
                    "Amount": '',
                    "Currency": "",
                    "Count": 3
                }, {
                    "Name": "TIMEOUT",
                    "Amount": '',
                    "Currency": "",
                    "Count": 2
                }]

            }
            //	myfn("Custm2",BIDmsgObj)


            chartFunctions.DonutChart({
                'selectVal': "Count",
                'id': "Custm2",
                'data': BIDmsgObj,
                'filter': $filter,
                'globalData': AllPaymentsGlobalData,
                'location': $location
            })

            $scope.bidObj = {
                'Custm2': srcChannelLegenColorGen(BIDmsgObj)
            }

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

});