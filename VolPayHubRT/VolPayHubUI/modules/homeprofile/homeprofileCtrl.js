angular.module('VolpayApp').controller('homeprofileCtrl', function($scope, $http, $location, $translate, $state, $timeout, $filter, GlobalService, AllPaymentsGlobalData, LogoutService, DashboardService, CommonService, $rootScope, ConfirmationService, errorservice, EntityLockService, datepickerFaIcons) {

    $translate.use('es_ES');
    var authenticationObject = $rootScope.dynamicAuthObj;
	$scope.carouselData = [];
    
    $scope.initCall = function(_query) {
        $http.post(BASEURL + '/rest/v2/administration/welcomescreen', _query).then(function onSuccess(response) {
            // Handle success

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers();
            var config = response.config;
         
            sessionStorage.EntityUser = data.Entity
            $scope.totalForCountbar=headers.totalcount?headers.totalcount:20
            $scope.homepage=data
            $scope.lenthofData=data.CycleInfo
			

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
       
            /* if (status == 401) {
            	
            } else { */
            // $scope.alerts = [{
            //     type: 'danger',
            //     msg: data.error.message //Set the message to the popup window
            // }];
            // }
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }
	
    $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.cData = data;
        sessionStorage.UserTimezone = $scope.cData.TimeZone;
        sessionStorage.ROLE_ID = (sessionStorage.ROLE_ID && sessionStorage.ROLE_ID != 'undefined') ? sessionStorage.ROLE_ID : (localStorage.ROLE_ID && sessionStorage.ROLE_ID != 'undefined' ? localStorage.ROLE_ID : data.RoleID);
        sessionStorage.UserID = (sessionStorage.UserID && sessionStorage.UserID != 'undefined') ? sessionStorage.UserID : (localStorage.UserID && sessionStorage.UserID != 'undefined' ? localStorage.UserID : data.UserID);
        localStorage.ROLE_ID = (sessionStorage.ROLE_ID && sessionStorage.ROLE_ID != 'undefined') ? sessionStorage.ROLE_ID : (localStorage.ROLE_ID && sessionStorage.ROLE_ID != 'undefined' ? localStorage.ROLE_ID : data.RoleID);
        localStorage.UserID = (sessionStorage.UserID && sessionStorage.UserID != 'undefined') ? sessionStorage.UserID : (localStorage.UserID && sessionStorage.UserID != 'undefined' ? localStorage.UserID : data.UserID);
       
        $scope.UserID = sessionStorage.UserID;
        $scope.RoleID = sessionStorage.ROLE_ID;
        var len = 20;
        var lObj = {};
        lObj.UserID = sessionStorage.UserID;
        lObj.RoleID = sessionStorage.ROLE_ID;
        lObj.start = 0;
        lObj.count = len;

        $scope.initCall(lObj)
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

    });

    $scope.loadMore = function() {
        $scope.query = {
            'UserID': sessionStorage.UserID,
            'RoleID': sessionStorage.ROLE_ID,
            'start': len,
            'count': 20
        }
     
        $http.post(BASEURL + '/rest/v2/administration/welcomescreen', $scope.query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            sessionStorage.EntityUser = data.Entity
            $scope.homepage['CycleInfo'] =  $scope.homepage['CycleInfo'].concat(data['CycleInfo']);
            $scope.lenthofData= $scope.homepage['CycleInfo'] 
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

	$('.carousel').carousel({
		interval: 2000
	})

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    /*** To control Load more data ***/
    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                // $scope.widthOnScroll();
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
          
                    if ($scope.lenthofData.length >= 20 &&($scope.lenthofData.length !=$scope.totalForCountbar)) {
                        debounceHandler()
                    }
                }
            })
            setTimeout(function() {}, 1000)
        }
    );
});
