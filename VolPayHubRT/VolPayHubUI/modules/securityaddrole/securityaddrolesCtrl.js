angular.module('VolpayApp').controller('securityaddrolesCtrl', function($scope, $stateParams, $rootScope, $filter, $http, $location, $state, $timeout, GlobalService, editservice, errorservice, $interval, EntityLockService) {

    $scope.roleDetails = {};
    // $scope.madeChanges = true;
    var authenticationObject = $rootScope.dynamicAuthObj;
    $rootScope.FromAddRolePage = '';
    if (sessionStorage.EditPage == 'true' || sessionStorage.EditPage == true) {
        $scope.edit = true;
    } else {
        $scope.edit = false;
    }
    $scope.UserRoleType = "";




    $http.get(BASEURL + '/rest/v2/administration/user/roleType').then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;


        $scope.partyOptions = data;

    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });





    if ($scope.edit) {

        $scope.roleEditDetails = $stateParams.input;

        function rolesLists(roles) {
            for (var i in roles) {
                for (var j in roles[i]) {
                    for (var k in roles[i][j]) {
                        if (roles[i][j][k].subfields == 'Delegate') {
                            roles[i][j].splice(k, 1);
                        }
                    }
                }
            }
            return roles;
        }

        $scope.selectcheck = function(allroles) {

            for (var i in $scope.roleEditDetails) {

                if ($scope.roleDetails[i] === undefined) {
                    $scope.roleDetails[i] = $scope.roleEditDetails[i];
                }
                if (typeof($scope.roleEditDetails[i]) == 'object') {
                    $scope.roles = rolesLists(allroles)
                    angular.forEach($scope.roles, function(value, key) {
                        for (var j in value) {
                            if (i == j) {
                                $scope.permissions = Object.keys($scope.roleEditDetails[i]);
                                if (value[j].length == $scope.permissions.length) {
                                    $scope.roleDetails[i]['valSelect'] = true;
                                }
                            }
                        }
                    })

                }
            }
        }




        if ($scope.roleEditDetails != null) {
            obj1 = ({ "PartyCode": $scope.roleEditDetails.PartyCode })
        
            var REST_URL = '/rest/v2/administration/party/serviceval';
            $http({
                url: BASEURL + REST_URL,
                method: 'POST',
                data: obj1,
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

                if (data.responseMessage == 'FE') {

                    $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;
                        $scope.roles = data;
                        $scope.selectcheck($scope.roles)
                    }).catch(function onError(response) {
                        // Handle error
                        // var data = response.data;
                        // var status = response.status;
                        // var statusText = response.statusText;
                        // var headers = response.headers;
                        // var config = response.config;

                    });
                    
                    return $scope.roles;

                } else  if ((data.responseMessage == 'PSE')||(data.responseMessage == 'IO')){
                    // "config/inout.json"
                    $http.get(CONFIG_JSON.inout).then(function onSuccess(response) {
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        $scope.roles = data;
                        $scope.selectcheck($scope.roles)
                    }).catch(function onError(response) {
                        // Handle error
                        // var data = response.data;
                        // var status = response.status;
                        // var statusText = response.statusText;
                        // var headers = response.headers;
                        // var config = response.config;
    
                    });
                    return $scope.roles;
                } else {

                    $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;
                        $scope.roles = data;
                        $scope.selectcheck($scope.roles)

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
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
                errorservice.ErrorMsgFunction(config, $scope, $http, status)

            });
        }
    } else {
        $scope.roles = [];


        $http.get(BASEURL + '/rest/v2/administration/user/type').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.UserRoleType = data.responseMessage;
            if ($scope.UserRoleType == 'FE') {

                $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.roles = data;
                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;

                });

            } else if (($scope.UserRoleType == 'PSE')||($scope.UserRoleType == 'IO')) {
                // "config/inout.json"
                $http.get(CONFIG_JSON.inout).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.roles = data;
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

                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;
                    // errorservice.ErrorMsgFunction(config, $scope, $http, status);
                });
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.errors[0].message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });



    }



    $scope.selectRole = function(role) {
        obj1 = ({ "PartyCode": role })
        var REST_URL = '/rest/v2/administration/party/serviceval';


        $http({
            method: 'POST',
            url: BASEURL + REST_URL,
            data: obj1,
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
        
            if (data.responseMessage == 'FE') {

                $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.roles = data;

                    $('input[type="checkbox"]').each(function() {
                        this.checked = false;
                    });

                    for (var i in $scope.roleDetails) {
                        if (typeof($scope.roleDetails[i]) == "object") {
                            delete $scope.roleDetails[i];
                        }
                    }

                    return $scope.roles;
                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;

                });
            }  else  if ((data.responseMessage == 'PSE')||(data.responseMessage == 'IO')){
                // "config/inout.json"
                $http.get(CONFIG_JSON.inout).then(function onSuccess(response) {
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.roles = data;
                }).catch(function onError(response) {
                    // Handle error
                    // var data = response.data;
                    // var status = response.status;
                    // var statusText = response.statusText;
                    // var headers = response.headers;
                    // var config = response.config;

                });
                return $scope.roles;
            }else {

                $http.get(BASEURL + '/rest/v2/administration/getPermissions').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.roles = data;

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
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];


            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });




    }

    $(document).ready(function() {
        $scope.limit = 20;
        $scope.triggerOrganization = function() {
            setTimeout(function() {
                $(".partiesOrganization").select2({
                    ajax: {
                        url: BASEURL + '/rest/v2/administration/user/roleType',
                        headers: authenticationObject,
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Cookie', sanitizeCookie(document.cookie)),
                                xhr.withCredentials = true
                        },
                        method: "GET",
                        crossDomain: true,
                        processResults: function(data, params) {
                            $scope.partyOptions = data;
                            params.page = params.page ? params.page : 0;
                            var myarr = []

                            for (j in data.PartyCode) {

                                myarr.push({
                                    'id': data.PartyCode[j],
                                    'text': data.PartyCode[j]
                                })
                            }
                            return {
                                results: myarr,
                                pagination: {
                                    more: data.length >= $scope.limit
                                }
                            };

                        },
                        cache: true
                    },
                    placeholder: 'Select an option',
                    minimumInputLength: 0,
                    allowClear: true,


                })
            }, 1000)
        }
    })

    setTimeout(function() {
        $scope.triggerOrganization()
        $('#PartyCode').select2().trigger('change');
    }, 100)




    $scope.activatePicker = function(sDate, eDate) {

        var start = new Date();
        var endDate = new Date();
        var end = new Date(new Date().setYear(start.getFullYear() + 1));

        if ($scope.toEdit_FromRoles == true) {
            var forceParseValue = false;
        }

        $(sanitize('#' + sDate)).datepicker({
            language: "es",
            startDate: start,
            endDate: end,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            forceParse: forceParseValue
        }).on('changeDate', function(selected) {



            start = new Date(selected.date.valueOf());

            start.setDate(start.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + eDate)).datepicker('setStartDate', start);

        });

        $(sanitize('#' + eDate)).datepicker({
            language: "es",
            startDate: start,
            endDate: end,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            forceParse: forceParseValue
        }).on('changeDate', function(selected) {

            endDate = new Date(selected.date.valueOf());

            endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);

        });
        $(sanitize('#' + sDate)).on('keyup', function(ev) {
            if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                //$dates.datepicker('setDate', null);
                $(sanitize('#' + eDate)).datepicker('setStartDate', new Date());
            }
        })

        $(sanitize('#' + eDate)).on('keyup', function(ev) {
            if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                //$dates.datepicker('setDate', null);
                $(sanitize('#' + sDate)).datepicker('setEndDate', null);
            }
        })

        //$('#dtControl').datepicker('setDate', nextMonth);
    }

    $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')





    $scope.triggerPicker = function(e) {
        if ($(e.currentTarget).prev().is('.DatePicker')) {
            $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate');
            //$(e.currentTarget).prev().data("DateTimePicker").show();
            $(e.currentTarget).prev().datepicker("show");
        }
    };






    $scope.addRolesdata = function(data) {

        for (var i in data) {

            delete data[i]['Delegate'];
            delete data[i]['valSelect']
            for (var j in data[i]) {


                if (typeof(data[i]) == "object") {

                    if (data[i][j] == false) {
                        delete data[i][j];

                    }
                }

            }

            if ($.isEmptyObject(data[i])) {
                delete data[i]
            }
        }

        var roledDetails = data;

        var URL, Method;
        if (sessionStorage.EditPage == 'true' || sessionStorage.EditPage == true) {

            URL = BASEURL + '/rest/v2/administration/role/update';
            Method = 'put'
        } else {
            URL = BASEURL + '/rest/v2/administration/role';
            Method = 'post'


        }


        $http({
            url: URL,
            method: Method,
            data: roledDetails,
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
            $scope.createdRole = data;

            if (data.responseMessage) {
                $scope.roleDetails = {};
            }
            $scope.input = {
                'responseMessage': data.responseMessage,
                'roledDetails':{
                    'v1':"Add On",
                    'v2':`${roledDetails.PartyCode}_${roledDetails.RoleName}`,
                    'EffectiveDate':`${roledDetails.EffectiveFromDate}`,
                    'index':0,
                    'zero': 0
                }
            }
            $state.go("app.viewresourcepermission", {
                input: $scope.input
            })

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.responseMessage) {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;

                $scope.alerts = [{
                    type: 'danger',
                    msg: data.responseMessage
                }];
                setTimeout(function() {

                    $('.alert-danger').hide();
                }, 5000)
            } else {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
                if (data.error['message']) {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                } else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error
                    }];
                }

                setTimeout(function() {

                    $('.alert-danger').hide();
                }, 5000)
            }

            if (status == 403) {

                if (data.error) {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                }

            }
        });









    }



    $scope.cancelRole = function() {
        $("#changesLostModal").modal('show');

    }

    $scope.gotoClickedPage = function() {
        $state.go('app.viewresourcepermission')
    }



    $scope.selectallCheck = function(getVal, index, key, val, roleDetails) {
      
            for (var i in val) {
        
                if(!_.has($scope.roleDetails, getVal)){
                    if ($('#Title_' + key).is(':checked')) {
                     $('.allChecks_' + key).prop('checked', true);
                     $scope.roleDetails[getVal]={[val[i].FieldName]:true}
                }}else{

               if ($('#Title_' + key).is(':checked')) {

               $scope.roleDetails[getVal][val[i].FieldName] = false;
                if ($scope.roleDetails[getVal]) {

                $scope.roleDetails[getVal][val[i].FieldName] = true;

                }
           
               } else if (!$('#Title_' + key).is(':checked')) {
               $('.allChecks_' + key).prop('checked', false);
                $scope.roleDetails[getVal][val[i].FieldName] = false;
               }
    
                 }
            }

    }


    $scope.selectSubFields = function(val, key, value, value1) {

        for (var i in value1) {

            if (value1[i]['subfields'] == 'Delegate') {

                value1.splice(i, 1);

            }
        }

        if ($('.allChecks_' + val + ':checked').length == value1.length) {

            $('#Title_' + val).prop('checked', true);


        } else {

            $('#Title_' + val).prop('checked', false);

        }

    }








})
