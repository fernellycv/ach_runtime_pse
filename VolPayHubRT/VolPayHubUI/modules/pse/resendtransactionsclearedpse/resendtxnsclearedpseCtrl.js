angular.module('VolpayApp').controller('resendTxnsClearedPSECtrl', function ($scope, $timeout, $http, $filter) {

    $scope.init = function () {
        $scope.resendTxnsClearedPSEData = {};
        $scope.Cycle = [1, 2, 3, 4, 5];
    }
    $scope.init();

    $scope.reset = function () {
        $timeout(() => {
            $('select[name=Cycle]').val(null).trigger("change");
            delete $scope.resendTxnsClearedPSEData["Cycle"];
            $scope.init();
        }, 10);
    }

    $scope.resendTxnsClearedPSE = function (payload) {
        if (!angular.equals({}, payload)) {
            $http.post(BASEURL + '/rest/v2/senttransaction/send', payload).then(function onSuccess(response) {
                var data = response.data;

                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }];

                $timeout(function () {
                    $(".alert-success").hide();
                }, 5000);
            }).catch(function onError(error) {
                // Handle error
                var data = error.data;

                $scope.alerts = [{
                    type: 'danger',
                    msg: $filter('translate')('ResendTransactionsClearedPSE.Error')
                }];

                $timeout(function () {
                    $(".alert-danger").hide();
                }, 5000);
            });
            $scope.reset();
        }
    }

    $scope.activatePicker = function () {
        var prev = null;
        var FromEndDate = new Date();
        $('.datepicker1').datepicker({
            endDate: FromEndDate,
            format: "yyyy",
            viewMode: "years",
            minViewMode: "years",
            autoclose: true,
            changeYear: true
        });
    }

    $scope.activatePicker();

    $scope.customDateRangePicker = function (sDate, eDate) {
        var startDate = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);
        $(sanitize('#' + sDate)).datepicker({
            language: "es",
            weekStart: 1,
            startDate: '1900-01-01',
            minDate: 1,
            endDate: FromEndDate,
            autoclose: true,
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            setDate: new Date(),
            daysOfWeekDisabled: [0, 6]
        }).on('changeDate', function (selected) {
            if (selected.date) {
                startDate = new Date(selected.date.valueOf());
                startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
            }
        });

        $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
        $(sanitize('#' + eDate)).datepicker({
            language: "es",
            weekStart: 1,
            startDate: startDate,
            endDate: FromEndDate,
            maxDate: new Date(),
            autoclose: true,
            todayHighlight: true,
            format: 'yyyy/mm/dd',
            setDate: new Date(),
            daysOfWeekDisabled: [0, 6]
        }).on('changeDate', function (selected) {

            if (selected.date) {
                //   FromEndDate = new Date(selected.date.valueOf());
                //   FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
                //   $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
            }

        });
        $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
        /*$('#'+eDate).on('keyup',function(){
        if(!$(this).val()){
        $(sanitize('#' + sDate)).datepicker('setEndDate', new Date());
        }
        })*/
    }

    $scope.customDateRangePicker('ClearingDate', 'ClearingEndDate');
});