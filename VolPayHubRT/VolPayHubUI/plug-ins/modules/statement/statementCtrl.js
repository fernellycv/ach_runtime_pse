angular.module('VolpayApp').controller('statementCtrl', function($scope, $http, $filter, $timeout, $state, $location, $window, PersonService1, AllPaymentsGlobalData, GlobalService, LogoutService, DashboardService, bankData) {

    $scope.alerts = [];
    $scope.data = {};
    $http.get(BASEURL + "/rest/v2/statement/readaccountno").then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.STMTACCOUNTNO = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.alerts = [{
            type: 'danger',
            msg: error.error.message //Set the message to the popup window
        }];
    });

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    function rawOutInject(Arr123) {
        for (i = 0; i < Arr123.length; i++) {

            Arr123[i].rawOutPDF = convertXml2JSon(Arr123[i].ReturnStack).ResponseReportMessage.ReportInfo.rawOutFile
        }
        return Arr123;
    }


    $scope.generateStatement = function(argu) {


        $http({
            url: BASEURL + "/rest/v2/statement/generatestmtdetails",
            method: "POST",
            async: false,
            cache: false,
            data: argu,
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

            $scope.statements = data;
            $scope.alerts = [{
                type: 'success',
                msg: 'Statement generated successfully'
            }];

            $timeout(function() {
                $('.alert-success').hide();
            }, 4000)
            $timeout(function() {
                $scope.RG = {};
                $scope.RG.OutputFormat = "PDF";
            }, 1000)

            //$scope.fetchReportLogs();

            //$(".alert-danger").alert("close");
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

    function GetIE() {
        var sAgent = window.navigator.userAgent;
        var Idx = sAgent.indexOf("MSIE");

        if (Idx > 0)
            return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
        else if (!!navigator.userAgent.match(/Trident\/7\./))
            return 11;
        else
            return 0; //It is not IE
    }

    //$scope.fetchReportLogs();

    $scope.Download = function(argu, fieldName) {

        var date = $filter('date')(new Date(), 'dd-MM-yyyy | HH-mm-ss');

        bankData.textDownload($filter('hex2a')(argu[fieldName]), fieldName + "_" + date);
    }

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

    /*** On window resize ***/
    $(window).resize(function() {
        $scope.$apply(function() {
            $scope.alertWidth = $('.alertWidthonResize').width();
        });
    });

    var len = 20;
    $scope.loadMore = function() {
        var sortObj = {
            "QueryOrder": [{
                "ColumnName": "GeneratedDate",
                "ColumnOrder": "Desc"
            }],
            "start": len,
            "count": 20
        };
        $scope.loadMorecalled = true;

        sortObj = constructQuery(sortObj);
        $http({
            url: BASEURL + "/rest/v2/reports/log/readall",
            method: "POST",
            async: false,
            cache: false,
            data: sortObj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {

            $scope.lenthofData = response.data;
            if (response.data.length > 0) {
                $scope.items = $scope.items.concat(response.data)
                len = len + 20;
            }

        })
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(function($) {
        $('.listView').bind('scroll', function() {

            $scope.widthOnScroll();
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                if ($scope.lenthofData.length >= 20) {
                    debounceHandler()
                }
            }
        })
    });

    $scope.triggerPicker = function(e) {
        if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $('input[name=' + $(e.currentTarget).prev().attr('name') + ']').data("DateTimePicker").show();
        }
    };

    $scope.activatePicker = function(e) {
        var prev = null;
        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            useCurrent: false,
            showClear: true
        }).on('dp.change', function(ev) {

            var name = $(ev.currentTarget).attr('ng-model').split('.')
            $scope[name[0]][name[1]] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {

        }).on('dp.hide', function(ev) {

        });

    }

});