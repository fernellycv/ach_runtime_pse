angular.module('VolpayApp').controller('securityviewresourcepermissionCtrl', function($scope, $rootScope, $stateParams, $http, $state, $location, $filter, userMgmtService, $timeout, GlobalService, LogoutService, errorservice, EntityLockService) {

    $scope.sKey = '';

    $scope.permission = {
        'C': false,
        'D': false,
        'R': false,
        'U': false,
        'ReActivate': false
    }
    
    $scope.detailExpanded = false;
    $scope.Obj = {};
    //$scope.rG="AddOns";
    $http.post(BASEURL + RESTCALL.ResourcePermission, {
        "RoleId": sessionStorage.ROLE_ID,
        // "ResourceName": "Roles & Permissions"
        "ResourceName": "RoleDetails"
    }).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        for (k in data) {
            for (j in Object.keys($scope.permission)) {
                if (Object.keys($scope.permission)[j] == data[k].ResourcePermission) {
                    $scope.permission[Object.keys($scope.permission)[j]] = true;
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

    });

    if ($stateParams.input) {
        $http.post(BASEURL + '/rest/v2/administration/party/serviceval', {
            "PartyCode": $stateParams.input.PartyCode,
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.responseMessage == 'FE') {

                $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                   
                    $scope.roles = data;
                    $scope.initialCall($scope.roles, "");
                       
                    // return $scope.roles;
                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;

                });
            
                return $scope.roles;
            } else if ((data.responseMessage == 'PSE')||(data.responseMessage == 'IO')) {
                // "config/inout.json"
                $http.get(CONFIG_JSON.inout).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                   
                    $scope.roles = data;
                    $scope.initialCall($scope.roles, "");
                
                    // return $scope.roles;
                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;

                });
            } else {

                $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.roles = data;
                    $scope.initialCall($scope.roles, "");

                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;
                    // errorservice.ErrorMsgFunction(config, $scope, $http, status);
                });

                return $scope.roles;
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.errors[0].message
            }];
        });
    }

    // setTimeout(function () {
    $scope.initialCall = function(data, index, key) {
        for (var i in data) {
            for (var j in data[i]) {
                if (j == key) {
                    $scope.arrayValue = data[i][j];
                    for (var k in data[i][j]) {
                        $scope.titleHead = data[i][j][k].title
                    }
                    return $scope.arrayValue;
                } else {
                    for (var k in data[0]) {

                        $scope.arrayValue = data[0][k];
                        $scope.titleHead = k
                    }
                }
            }
        }
    }

    ///  }, 1000)

    $scope.opentab = function(event, index, key) {
        $(".tablinks").removeClass('active')
        $(event.currentTarget).addClass('active')
        var data = $scope.roles;
        $scope.arrayValue = $scope.initialCall(data, index, key)
    }

    $scope.EditViewRole = function() {
        $('.my-tooltip').tooltip('hide');
        // $scope.rolesList['location'] = 'Edit' ;
        sessionStorage.EditPage = true;

        $state.go("app.securityaddroles", {
            'input': $scope.rolesList
        })
    }

    $scope.cancelViewRole = function() {
        $('.my-tooltip').tooltip('hide');
        $state.go('app.securityroles')
    }


    if (!$stateParams.input) {
        $state.go('app.securityroles')
    } else {
        $scope.RoleName = $stateParams.input.RoleName;
        var query = {
            "RoleName": $stateParams.input.RoleName,
            "PartyCode": $stateParams.input.PartyCode
        }

        $http({
            method: "POST",
            url: BASEURL + "/rest/v2/administration/role/read",
            data: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.rolesList = data;
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

        });
    }

});