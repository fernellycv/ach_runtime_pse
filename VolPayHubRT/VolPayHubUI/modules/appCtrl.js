var timeZoneDropValue, countryDropValues;

var userData = uProfileData;

angular.module('VolpayApp').controller('appCtrl', ['$scope', '$rootScope', '$http', '$location', '$filter', '$timeout', '$state', '$translate','$transitions','AllPaymentsGlobalData', function($scope, $rootScope, $http, $location, $filter, $timeout, $state, $translate,$transitions,AllPaymentsGlobalData) {
    
    $rootScope.dynamicAuthObj = {
        "Authorization": "SessionToken:" + sessionStorage.SessionToken,
        "source-indicator": configData.SourceIndicator,
        "Content-Type": "application/json"
    }

    if (configData.Authorization == 'External') {
        $rootScope.dynamicAuthObj['X-CSRF-Token'] = sessionStorage.CSRF;
    }

    sessionStorage.isDefaultLoaded = true;
    $scope.alerts2 = [{
        type: 'danger',
        msg: "asdfdf"
    }]
    $scope.currThemeVal = configData.ThemeName;
    sessionStorage.currentThemeName = $scope.currThemeVal;

    if (sessionStorage.pwRest == true || sessionStorage.pwRest == 'true') {
        $scope.userPWReset = 'NotSet';
        $scope.pwSet= true
    }

    $scope.searchParam = $location.search().view;
    sessionStorage.iframeFlag = false;
    if ($scope.searchParam == 'inside') {
        $scope.iframeFlag = true;
        sessionStorage.iframeFlag = true;
        $('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
    }

    if ($scope.searchParam == 'All') {
        sessionStorage.iframeFlag = false;
        $scope.iframeFlag = false;
    }

    if (sessionStorage.iframeFlag != undefined) {
        $scope.iframeFlag = JSON.parse(sessionStorage.iframeFlag);
    }

    //}, 1500)


    if ($location.path() != '/forgotpassword') {
        $timeout(function() {
            if (sessionStorage.pwRest == false || sessionStorage.pwRest == 'false' || !sessionStorage.pwRest) {

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

                    if (!data.length) {
                        uProfileData = retrieveProfileData()
                        userData = uProfileData;

                        var lObj = {};
                        lObj.UserID = sessionStorage.UserID;
                        lObj.ProfileData = $filter('stringToHex')(JSON.stringify(uProfileData));
                        //lObj.aaa = "aaa";

                        $http.post(BASEURL + RESTCALL.userProfileData, lObj).then(function onSuccess(response) {
                            // Handle success
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                        }).catch(function onError(response) {
                            // Handle error
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                        });
                        $translate.use('es_ES');
                    } else {
                        sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;

                        $scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))
                        userData = $scope.uData;

                        setTimeout(function() {
                            if (userData.customDashboardWidgets.showDashboard) {
                                $('#MyDashboard').css('display', 'block')
                            } else {
                                $('#MyDashboard').css('display', 'none')
                            }
                        }, 1000)
                        if ($scope.uData.genSetting.languageSelected) {
                            $translate.use($scope.uData.genSetting.languageSelected);
                        } else {
                            $translate.use("es_ES");
                        }
                        // $translate.use($scope.uData.genSetting.languageSelected);
                    }

                    $('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    userData = uProfileData;
                    $translate.use("es_ES");
                    $('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
                });
            } else {
                userData = uProfileData;
                $translate.use("es_ES");
            }
        }, 1500);

        $http.get(BASEURL + RESTCALL.TimezoneOptions).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            timeZoneDropValues = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });

        $http.get(BASEURL + RESTCALL.Country).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            countryDropValues = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

    $scope.resetFilter = function(){
        const AdsearchParams = {
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
                },
                "DebitFxRate": {
                    "Start": "",
                    "End": ""
                }
            }

        };
        AllPaymentsGlobalData.searchParams = angular.copy(AdsearchParams);
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.SelectSearchVisible = false;
        AllPaymentsGlobalData.advancedSearchEnable  = false
        AllPaymentsGlobalData.allPaymentDetails = []
    }

    $transitions.onBefore({ from:"app.paymentdetail"}, function(transition) {
        if(transition.to().name != $scope.LastPaymentOrTransaction){
            $scope.resetFilter();
        }
    })

    $transitions.onBefore({ from:"app.payments"}, function(transition) {
        if(transition.to().name !== 'app.paymentdetail'){
            $scope.resetFilter();
        }else if(transition.to().name === 'app.paymentdetail'){
            $scope.LastPaymentOrTransaction = transition.from().name;
        }
    })
    $transitions.onBefore({ from:"app.transactions"}, function(transition) {
        if(transition.to().name !== 'app.paymentdetail'){
            $scope.resetFilter();
        }else if(transition.to().name === 'app.paymentdetail'){
            $scope.LastPaymentOrTransaction = transition.from().name;
        }
    })

}]);