angular.module('VolpayApp').controller('cylesummaryCtrl', function ($scope, $translate, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("Cycle Summary");
    $scope.subMenu = []
    $scope.constructObj = {}
    $scope.getNumber = function (num) {
        for (var i = 1; i <= num; i++) {
            if (i % 2 == 0) {
                i == 62 || i== 64 ? $scope.subMenu.push('CycleSummary' + "." + 'Against'): $scope.subMenu.push('CycleSummary' + "." + 'Amount');
            } else {
                i == 61 || i== 63 ? $scope.subMenu.push('CycleSummary' + "." + 'In_favor'): $scope.subMenu.push('CycleSummary' + "." + 'NoTx');
            }
        }
        return $scope.subMenu;
    }

    getTrxTypeTotal = function (data, types) {
        var NoTrx = 0;
        var Amount = 0;
        for (var i = 0; i < types.length; i++) {
            NoTrx += data[types[i]].NoTrx;
            Amount += data[types[i]].Amount;
        }
        return [NoTrx, Amount];
    }

    $scope.getNumber(64);

    $scope.getCloseTableInfo = function () {
        $scope.input = {
            "date": $scope.getSettlement.date,
            "cycle": $scope.getSettlement.cycle
        }

        $http.post(BASEURL + '/rest/v2/cycle/summary', $scope.input).then(function onSuccess(response) {
            //var data = response.data;
            //$scope.totalData = response.data;
            //var status = response.status;
            //var statusText = response.statusText;
            //var headers = response.headers;
            //var config = response.config;

            $rootScope.closeSheetDatadownload = response.data
            $scope.closeSheetData = response.data.Balance;
            $scope.totals = response.data.Totals;
            // $scope.repeatInterval()

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

    }

    $scope.initCall = function () {

        var userID = {
            "UserID": sessionStorage.UserID
        }

        $http.post(BASEURL + '/rest/v2/balances/worksheet/getSettlementInfos', userID).then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.DefaultCycle) {
                $scope.getSettlement = {
                    'date': todayDate(),
                    'cycle': data.DefaultCycle,
                }
                $scope.constructObj = {
                    'date': todayDate(),
                    'cycle': data.DefaultCycle,
                }
            } else {
                $scope.getSettlement = {
                    'date': todayDate(),
                    'cycle': "1",
                }
                $scope.constructObj = {
                    'date': todayDate(),
                    'cycle': "1",
                }
            }

            $scope.closesheetInfo = data;
            $scope.getCloseTableInfo()

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.initCall()

    $scope.activatePicker = function () {
        $('.DatePicker').datepicker({
            language: "es",
            format: "yyyy-mm-dd",
            showClear: true,
            autoclose: true,
            todayHighlight: true
        }).on('dp.change', function (ev) {
            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        }).on('dp.show', function (ev) { }).on('dp.hide', function (ev) { });
    }
    $scope.activatePicker();

    $scope.exportToExcelFlist = function (eve) {

        if ($("input[name=excelVal][value='txt']").prop("checked") || $("input[name=excelVal][value='csv']").prop("checked")||$("input[name=excelVal][value='PDF']").prop("checked")||$("input[name=excelVal][value='XLS']").prop("checked")) {

            if ($("input[name=excelVal][value='txt']").prop("checked")) {
                var url = "/rest/settlement/getSettlementConsillationTXT"
            } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                var url = "/rest/settlement/getSettlementConsillationCSV"
            }else if($("input[name=excelVal][value='PDF']").prop("checked")){
                var url="/rest/settlement/getSettlementConsillationPDF"
               
            }else if($("input[name=excelVal][value='XLS']").prop("checked")){
                var url="/rest/settlement/getSettlementConsillationXLS"
            }
           

            $http.post(BASEURL + url, $rootScope.closeSheetDatadownload).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                if(response.data['FileName']){
                    response.data['filename'] = response.data['FileName']
                }
                // $scope.datas = $scope.datas.concat(data);
                $scope.Details = 'data:application/octet-stream;base64,' + data['Data'];
                var dlnk = document.getElementById('dwnldLnk');
                dlnk.href = $scope.Details;
                if ($("input[name=excelVal][value='txt']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = $filter('translate')('Sidebar.CycleSummary').toUpperCase().replaceAll(' ','_')+'_'+$scope.getSettlement.date+'.txt';
                    } else {
                        dlnk.download = 'cyclesummery_report.txt';
                    }
                } else if ($("input[name=excelVal][value='csv']").prop("checked")) {

                    var res = atob(data["Data"]);   
                    var universalBOM = "\uFEFF";
                    $scope.Details ="data:text/csv; charset=utf-8," +  encodeURIComponent(universalBOM+res);
                    dlnk.href = $scope.Details;

                    if (data['filename']) {
                        dlnk.download = $filter('translate')('Sidebar.CycleSummary').toUpperCase().replaceAll(' ','_')+'_'+$scope.getSettlement.date+'.csv';
                    } else {
                        dlnk.download = 'cyclesummery_report.csv';
                    }
                }else{
                    dlnk.download = $filter('translate')('Sidebar.CycleSummary').toUpperCase().replaceAll(' ','_')+'_'+$scope.getSettlement.date+'.'+data['filename'].split('.')[1];
                }

                dlnk.click();

            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                // errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }
    }

    $scope.getInitialDataFeed = function () {
        $scope.getSettlement.date = $scope.constructObj.date;
        $scope.getSettlement.cycle = $scope.constructObj.cycle;
        $scope.getCloseTableInfo()
        if ($scope.getSettlement.cycle != $scope.closesheetInfo.DefaultCycle) {
            $scope.startinterval = true;
        }
        else {
            $scope.startinterval = false;
            clearInterval(interval);
            $scope.repeatInterval()
        }
    }

    $scope.refresh = function () {
        $scope.getCloseTableInfo()
    }

    $(document).ready(function () {
        $(".FixHead").scroll(function (e) {
            var $tablesToFloatHeaders = $('table');
            $tablesToFloatHeaders.floatThead({
                //useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function () {
                var $table = $(this);
                $table.closest('.FixHead').scroll(function (e) {
                    $table.floatThead('reflow');
                });
            });
        })
    })

    // var interval = "";
    // $scope.repeatInterval = function () {

    //     clearInterval(interval);
    //     interval = setInterval(function () {
    //         if (sessionStorage.menuSelection == null) {
    //             clearInterval(interval)
    //         } else {
    //             var menuselected = JSON.parse(sessionStorage.menuSelection)
    //             if (menuselected.subVal != 'CloseAndConcliliation' || $scope.startinterval) {
    //                 clearInterval(interval)
    //             } else {
    //                 $scope.getCloseTableInfo()
    //             }
    //         }

    //     }, 10000)
    // }

    // $scope.repeatInterval()

});
