angular.module('VolpayApp').controller('outputpaymentsummaryctrl', function($scope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, errorservice) {

    var len = 20;
    $scope.incomeObj = $state.params.input;
    $scope.payId = [];
    $scope.paymentId = {};

    $scope.initCall = function() {

        //$scope.uor = $state.params.input.uor;
        len = 20;
        $scope.query = {
                "Queryfield": [{
                    'ColumnName': 'UniqueOutputReference',
                    'ColumnOperation': '=',
                    'ColumnValue': $state.params.input.uor
                }],
                'start': 0,
                'count': len
            }
            //$scope.query.Queryfield.push({'ColumnName':'UniqueOutputReference','ColumnOperation':'=','ColumnValue':$state.params.input.uor})
        $scope.query = constructQuery($scope.query);

        $http.post(BASEURL + RESTCALL.InputOutputCorrelation, $scope.query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.datas = data;

            for (var i in $scope.datas) {
                $scope.payId.push($scope.datas[i].PaymentID);
                GlobalService.attachmsgFunction = $scope.datas[i].AttchMsgFunc;
            }
            $scope.loadedContent = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.datas = [];
            $scope.loadedContent = [];
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

    }

    $scope.initCall()

    $scope.gotoFiledetail = function(id) {
        GlobalService.fileListId = id;
        $location.path('app/filedetail')
    }

    $scope.clickReferenceID = function(UIR, PID) {

        $scope.Obj = {
            'uor': $scope.incomeObj.uor,
            'nav': {
                'UIR': UIR,
                'PID': PID
            },
            'from': 'distributedinstructions'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        });
    }

    $scope.details = function(val) {

        $scope.Obj = {
            'uor': val.UniqueOutputReference,
            'nav': {
                'PID': val.PaymentID
            },
            'from': 'distributedinstructions',
            'Attach': val.AttchMsgFunc
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })

        /* }).error(function(data){
        	 $scope.alerts = [{
        				type : 'danger',
        				msg : data.error.message
        	  }];

        	  $timeout(function(){
        			$('.alert-danger').hide()
        	  },4000)
        			
        		
        }) */
    };

    $scope.loadMore = function() {
        $scope.query = {
            "Queryfield": [{
                'ColumnName': 'UniqueOutputReference',
                'ColumnOperation': '=',
                'ColumnValue': $state.params.input.uor
            }],
            'start': len,
            'count': 20
        }
        $scope.query = constructQuery($scope.query);

        $http.post(BASEURL + RESTCALL.InputOutputCorrelation, $scope.query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.loadedContent = data;
            $scope.datas = $scope.datas.concat(data);
            len = len + 20;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
    }

    $scope.exportToExcel = function() {
        $scope.dat = angular.copy($scope.datas)
        JSONToCSVConvertor(bankData, $scope.dat, $state.params.input.uor, true);
    }

    $scope.printFLpage = function() {
        window.print()
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(function($) {
        $('.listView').bind('scroll', function() {
            if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                if ($scope.loadedData.length >= 20) {

                    debounceHandler()
                }
            }
        })
        setTimeout(function() {}, 1000)
    });
});