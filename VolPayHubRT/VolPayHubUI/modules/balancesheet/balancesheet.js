angular.module('VolpayApp').controller('balancesheetCtrl', function ($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("Consolidated Balance Screen");
    $scope.constructObj = {}
    $scope.Balanceinfo = [];
    $scope.getBalaceSheetInfo = function () {
        $scope.input = {
            "date": $scope.getSettlement.date,
            "cycle": $scope.getSettlement.cycle
        }

        $http.post(BASEURL + '/rest/v2/balances/multilateral/bycycle', $scope.input).then(function onSuccess(response) {

            $('.alert-danger').hide();
            $scope.Balanceinfo = response.data.Balance;
            $rootScope.Balanceinfo = response.data;
            $rootScope.Balanceinfo["date"] = $scope.getSettlement.date;
            $rootScope.Balanceinfo["cycle"] = $scope.getSettlement.cycle;
            //Calculate totals
            var totalclearingincome = 0;
            var totalclearingoutcome = 0;
            for (var i = 0; i < $scope.Balanceinfo.length; i++) {
                totalclearingincome += $scope.Balanceinfo[i].ClearingIncome;
                totalclearingoutcome += $scope.Balanceinfo[i].ClearingOutcome;
            }
            $scope.totalclearingincome = totalclearingincome;
            $scope.totalclearingoutcome = totalclearingoutcome;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.Balanceinfo = [];
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

        $scope.today = new Date();
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
            $scope.initialInfo = data;
            $scope.getBalaceSheetInfo()

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
            endDate:"Today",
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
                var url = "/rest/v2/settlement/getSettlementConsolidatedBalTXT"
            } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                var url = "/rest/v2/settlement/getSettlementConsolidatedBalCSV"
            }else if($("input[name=excelVal][value='PDF']").prop("checked")){
                var url="/rest/settlement/getSettlementConsolidatedBalPDF"
               
            }else if($("input[name=excelVal][value='XLS']").prop("checked")){
                var url="/rest/settlement/getSettlementConsolidatedBalXLS"
            }

            $http.post(BASEURL + url, $rootScope.Balanceinfo).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                if(response.data['FileName']){
                    response.data['filename'] = response.data['FileName']
                }
                $scope.Details = 'data:application/octet-stream;base64,' + data['Data'];
                var dlnk = document.getElementById('dwnldLnk');
                dlnk.href = $scope.Details;

                if ($("input[name=excelVal][value='txt']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'CONSOLIDATE_BALANCE_report.txt';
                    }
                } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'CONSOLIDATE_BALANCE_report.csv';
                    }
                }else if ($("input[name=excelVal][value='PDF']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'report.PDF';
                    }
                }else if ($("input[name=excelVal][value='XLS']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'report.XLS';
                    }
                }else{
                    dlnk.download = data['filename'];
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

    $scope.getinitfeed = function () {
        $scope.getSettlement.date = $scope.constructObj.date;
        $scope.getSettlement.cycle = $scope.constructObj.cycle;
        $scope.getBalaceSheetInfo()
        if ($scope.getSettlement.cycle != $scope.initialInfo.DefaultCycle) {
            $scope.startinterval = true;
        }
        else {
            $scope.startinterval = false;
            clearInterval(interval);
            $scope.repeatInterval()
        }
    }

    $scope.refresh = function () {
        $scope.getBalaceSheetInfo()
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
    //         }
    //         else {
    //             var menuselected = JSON.parse(sessionStorage.menuSelection)
    //             if (menuselected.subVal != 'BalanceSheet' || $scope.startinterval) {
    //                 clearInterval(interval)
    //             } else {
    //                 $scope.getBalaceSheetInfo()
    //             }
    //         }

    //     }, 10000)
    // }

    // $scope.repeatInterval()

});
