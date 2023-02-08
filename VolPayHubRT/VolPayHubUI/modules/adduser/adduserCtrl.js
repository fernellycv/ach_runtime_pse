angular.module('VolpayApp').controller('adduserCtrl', ['$scope', '$http', '$location', '$state', '$rootScope', 'LogoutService', 'GlobalService', '$timeout', '$stateParams', '$filter', 'editservice', 'errorservice', function($scope, $http, $location, $state, $rootScope, LogoutService, GlobalService, $timeout, $stateParams, $filter, editservice, errorservice) {
    var authenticationObject = $rootScope.dynamicAuthObj;
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })

    $scope.madeChanges = true;
    $scope.selectOptions = [];



    $http.get(BASEURL + '/rest/v2/administration/user/roleType').then(function onSuccess(response) {
        // Handle success
      
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.partyOptions = data;
        $scope.PartyCode_ = $scope.partyOptions.PartyCode
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });





    $scope.setInitVal = function(_query) {
        return $http({
            method: "GET",
            url: BASEURL + RESTCALL.CreateRole,
            params: _query
        }).then(function(response) {
            // $scope.selectOptions = response.data;
            // return $scope.selectOptions;
        })
    }

    $scope.setInitMultipleVal = function(_multiplequery) {
   
        _multiplequery['partycode']=$scope.createData.PartyCode
		_multiplequery['filter']=false   
       
        $scope.selectMultOptions = [];
        $scope.pushAllRoleValues = [];
        $scope.selectOptions = [];
        return $http({
            method: "GET",
            url: BASEURL + '/rest/v2/administration/partyroles',
            params: _multiplequery
        }).then(function(response) {
            for (i in response.data) {
                var flag = false;
                for (var j in $scope.selectMultOptions) {
                    if ($scope.selectMultOptions[j]['RoleID'] == response.data[i]['RoleID']) {
                        flag = true
                        return;
                    } else {
                        flag = false;
                    }
                }
                if (!flag) {
                    $scope.selectMultOptions.push(response.data[i])
                    $scope.pushAllRoleValues.push(response.data[i])
                }
            }

            $scope.selectOptions = removeDuplicates($scope.pushAllRoleValues, 'RoleID');
            //  $scope.selectOptions =  $scope.pushAllRoleValues;


            setTimeout(function() {

                //  $("[name=RoleID]").select2('destroy');
                // $("[name=RoleID]").val($scope.ArrVal);
                // $("[name=RoleID]").select2();
                $scope.remoteDataConfig()

            }, 100)
            return $scope.selectMultOptions;
        })
    }

    $scope.selectOptions = [];
    $scope.timezoneOptions = [];
    $scope.countryOptions = [];
    $scope.TimezoneVals = '';

    function triggerUnselect() {
        $(document).ready(function() {

            $('.clearRoleModelValue').on("select2:unselecting", function(e) {
                $scope.createData.UserRoleAssociation[$(e.currentTarget).attr('name').charAt($(e.currentTarget).attr('name').length - 1)][$(e.currentTarget).attr('customattr')] = '';
            })
        })
    }
    triggerUnselect();
    var optionValues = [];
    if ((sessionStorage.showMoreFieldOnCreateUser == true) || (sessionStorage.showMoreFieldOnCreateUser == 'true')) {
        $scope.showMoreFieldOnCreateUser = true;
    } else {
        $scope.showMoreFieldOnCreateUser = false;
    }

    if (configData.Authorization == 'External') {
        $scope.showMoreFieldOnCreateUser = true;
    }


    $scope.userCreated = GlobalService.userCreated;

    if ($scope.userCreated) {
        $scope.alerts = [{
            type: 'success',
            msg: $rootScope.userCreateMsg
        }];
        GlobalService.userCreated = false;
    }

    $timeout(callAtTimeout, 4000);

    function callAtTimeout() {
        $('.alert').hide();
    }

    if ($scope.showMoreFieldOnCreateUser) {

    }

    $scope.current1 = true;
    $scope.hello = 50;

    $scope.createData = {
        UserRoleAssociation: []
    };

    if (!$scope.showMoreFieldOnCreateUser) {
        $scope.createData.UserRoleAssociation = [{
            'RoleID': 'Super Admin',
            'Status': 'ACTIVE'
        }]
    }

    $scope.ArrVal = [];

    function setMultiSelectRole() {
        for (let i in $scope.createData.UserRoleAssociation) {
            $scope.ArrVal.push($scope.createData.UserRoleAssociation[i].RoleID)
        }
        $scope.createData.RoleID1 = $scope.ArrVal;
    }

    $scope.Operation = '';

    if ($stateParams.input) {
        if ($stateParams.input.FromDraft) {

            $scope.Operation = 'Edit';
            $scope.createData = $stateParams.input.decrData;
            setTimeout(function() {
                $scope.HttpMethod = $stateParams.input.typeOfDraft;
                $(sanitize('input[value="' + $scope.createData.RoleID + '"]')).prop('checked', true)
            }, 100)



            if ($scope.createData.UserRoleAssociation == undefined) {
                $scope.createData['UserRoleAssociation'] = []
            } else if (Array.isArray($scope.createData.UserRoleAssociation)) {
                for (i in $scope.createData.UserRoleAssociation) {
                    if (Array.isArray($scope.createData.UserRoleAssociation[i])) {
                        $scope.createData.UserRoleAssociation = $scope.createData.UserRoleAssociation[i]
                    }
                }
                setMultiSelectRole();
                $scope.roleIdsaved = $scope.createData.RoleID;
            }

            _query = {
                search: $scope.createData.RoleID,
                start: 0,
                count: 100
            }
            $scope.setInitVal(_query);

            for (k in $scope.createData.UserRoleAssociation) {

                _queryvals = {
                    search: $scope.createData.UserRoleAssociation[k].RoleID,
                    start: 0,
                    count: 100
                }

                $scope.setInitMultipleVal(_queryvals);
            }

            if ($scope.createData.TimeZone) {
                $scope.timezoneOptions.push($scope.createData.TimeZone)
            }
            if ($scope.createData.Country) {
                $scope.countryOptions.push($scope.createData.Country)
            }

            if ($scope.createData.Password) {
                $('#createDataPassword').css('font-family', 'password')
            } else if ($scope.ConfirmPW) {
                $('#ConfirmPW').css('font-family', 'password')
            } else {
                $('.key').css('font-family', 'inherit')
            }


        }
    } else {
        $scope.Operation = 'Add';
    }

    $scope.madeChanges = false;
    $scope.listen = function() {


        setTimeout(function() {
            editservice.listen($scope, $scope.createData, $scope.Operation, 'UserManagement');
        }, 100)
    }
    $scope.listen();

    $scope.emailValidate = function(email_entered) {

        if ($("#AddUserMail").val() != "") {
            $scope.eFlag = emailValidation(email_entered, "#AddUserMail")
            if (!$scope.eFlag) {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: $filter('translate')('AddUsers.PleaseEnterValidEmailAddress')
                        }];
                    })
                }, 200)
                return false;
            } else {
                $('.alert-danger').hide()
            }

        }

    }

    $scope.continue1 = function(createData) {
        createData.UserRoleAssociation = cleantheinputdata(createData.UserRoleAssociation)
        $scope.userDataRoleID = $(".radiobtns:checked").val();
        if ($scope.showMoreFieldOnCreateUser) {
            for (i = 0; i < $scope.selectOptions.length; i++) {

                if ($scope.selectOptions[i].value == createData.RoleID) {
                    $scope.RoleID = $scope.selectOptions[i].label;
                }
            }
        }

        if (createData.Password == $scope.ConfirmPW) {
            $(".alert-danger").alert("close");

            $scope.userData = createData;
            $scope.page = 2;
            $scope.current1 = false;
            $scope.current2 = true;
            $scope.hello = 100;
            $('.tab-pane').removeClass("active");
            $('#tab2').addClass("active");
            $('.tab_li').removeClass("active");
            $('#li_1').addClass("done");
            $('#li_2').addClass("active");
        } else {
            $scope.alerts = [{
                type: 'danger',
                msg: "Password and confirm password does not match."
            }];
            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;

        }
    }

    $scope.ConfirmCreateUser = function() {

        /*var createUserObj = {};
        createUserObj.UserId = sessionStorage.createUserLoginName;
        createUserObj.Data = btoa(JSON.stringify($scope.userData))*/
        delete $scope.userData.RoleID1;
        $scope.userData.RoleID = $(".radiobtns:checked").val()
        $scope.userData.RoleID = "Super Admin";
        //$scope.userData.CRT_USER_ID = sessionStorage.createUserLoginName;
        //$scope.userData.CRT_TS = new Date().toISOString();
        $scope.userData.IsForceReset = true;
        $scope.userData.Status = 'ACTIVE';
        $http.post(BASEURL + RESTCALL.CreateNewUser, $scope.userData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.dataModified = false;
            $rootScope.alerts = [{
                "type": "success",
                "msg": data.responseMessage
            }]

            LogoutService.Logout(true);

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
        $timeout(callAtTimeout, 4000);
    }

    $scope.backupRoleId1 = '';
    $scope.ConfirmCreateUserbySuperAdmin = function(userData) {

        $scope.backupRoleId1 = angular.copy(userData.RoleID1);
        delete $scope.userData.RoleID1;
        $scope.userData.RoleID = $(".radiobtns:checked").val()
        userData = cleantheinputdata(userData)
        $scope.userData.IsForceReset = Boolean($scope.userData.IsForceReset);
        $scope.userData.Status = $scope.userData.Status;
        if ($scope.HttpMethod) {
            if ($scope.HttpMethod == "Created") {
                $scope.updateEntity = false;
                $scope.method = 'POST';
                $scope.addUserandForseSaveUser($scope.method, $scope.userData)
            } else {
                $scope.updateEntity = true;
                $scope.method = 'PUT';
                $("#draftOverWriteModal").modal("show");
            }
        } else {
            $scope.method = 'POST';
            $scope.addUserandForseSaveUser($scope.method, $scope.userData)
        }

    }

    $scope.backupdataDraft = function(getUser) {
        $scope.takeuserbckup = getUser;
        $scope.takeuserbckup.IsForceReset = typeof($scope.takeuserbckup.IsForceReset) === 'boolean' ? String($scope.takeuserbckup.IsForceReset) : $scope.takeuserbckup.IsForceReset
    }

    $scope.addUserandForseSaveUser = function(method, userdata) {
        userdata["EmailAddress"] = userdata["EmailAddress"].toLowerCase();

        var createUserObj = {
            url: BASEURL + '/rest/v2/administration/usercreate',
            method: method,
            data: userdata,
        }

        $http(createUserObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.dataModified = false;
            $rootScope.userCreateMsg = data.responseMessage


            $scope.input = {
                'responseMessage': data.responseMessage
            };
            $state.go('app.users', {
                input: $scope.input
            })

            $("#draftOverWriteModal").modal("hide");
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.createData.RoleID1 = $scope.backupRoleId1;

            $("#draftOverWriteModal").modal("hide");
            errorservice.ErrorMsgFunction(config, $scope, $http, status)

            var _cstmMsg = data.error.message;
            if (_cstmMsg.match(':') && _cstmMsg.split(':')[0] === 'The validation of uniqueness for field(s)') {

                if (_cstmMsg.split(':')[1].match('has failed')) {
                    var _cstmMsg1 = $filter('removeSpace')(_cstmMsg.split(':')[1].split('has failed')[0])
                    _cstmMsg = []
                    var noPrimarykey = true;

                    for (var _kee in $scope.userData) {

                        if (_cstmMsg1.match(_kee)) {
                            _cstmMsg.push((_kee) + ' : ' + $scope.userData[_cstmMsg1])
                            noPrimarykey = false;
                        }

                    }
                    if (noPrimarykey) {
                        for (var _kee in $scope.userData) {

                            if (_cstmMsg1.match(_kee) && _kee != 'Status') {
                                _cstmMsg.push((_kee) + ' : ' + $scope.userData[_cstmMsg1])
                                noPrimarykey = true
                            }
                        }
                    }
                    if (_cstmMsg.length > 1) {
                        _cstmMsg = _cstmMsg.toString() + ' already exists. Combination needs to be unique.'
                    } else if (_cstmMsg.length == 1) {
                        _cstmMsg = _cstmMsg.toString() + ' already exists. Value needs to be unique.'
                    } else {
                        _cstmMsg = data.error.message
                    }
                } else {
                    _cstmMsg = data.error.message
                }

            } else {
                _cstmMsg = data.error.message
            }

            $scope.alerts = [{
                type: 'danger',
                msg: _cstmMsg
            }];
        });
    }

    $scope.resetAllDrafts = function() {
        $("#draftOverWriteModal").modal("hide");
        setTimeout(function() {
            $scope.updateEntity = false;
        }, 100)
    }

    $scope.back2to1 = function() {

        $('.alert-danger').alert('close');

        $scope.hello = 50;
        $scope.current1 = true;
        $scope.current2 = false;
        $('.tab-pane').removeClass("active");
        $('#tab1').addClass("active");

        $('.tab_li').removeClass("done active");
        $('#li_1').addClass("active");
        $scope.page = 1;

        $('#tab1').addClass('slideInLeft')

        $scope.createData = $scope.userData;

    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.validatePassWord = function(val, e) {

        if (val) {


            $http.post(BASEURL + RESTCALL.ValidatePW, {
                'UserId': sessionStorage.UserID,
                'Password': val
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $('.alert-danger').alert('close');
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
                    msg: data.error.message
                }];

                $(e.currentTarget).val('');
                $(e.currentTarget).css('font-family', 'inherit')
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;

            });
        } else {
            $('.alert-danger').alert('close');
        }

    }
    $scope.activatePicker = function(sDate, eDate) {
        $(document).ready(function() {

            var start = new Date();
            var endDate = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));

            $(sanitize('#' + sDate)).datepicker({
                language: "es",
                startDate: start,
                endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd'
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
                todayHighlight: true

            }).on('changeDate', function(selected) {
                endDate = new Date(selected.date.valueOf());

                endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);

            });

            $(sanitize('#' + sDate)).keyup(function(ev) {
                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {


                    $(sanitize('#' + eDate)).datepicker('setStartDate', new Date());
                }
            })
            $(sanitize('#' + eDate)).keyup(function(ev) {
                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                    $(sanitize('#' + sDate)).datepicker('setEndDate', null);
                }
            })

        })
    }

    $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')
    $scope.triggerPicker = function(e) {
        if ($(e.currentTarget).prev().is('.DatePicker')) {
            $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate');

            $(e.currentTarget).prev().datepicker("show");
        }
    };

    $scope.datePlaceholderValue = "";

    function regexCheck() {
        $(document).ready(function() {
            $(".dateTypeKey").keypress(function(event) {
                var regex = /^[0-9]$/;
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (!(keycode == '8')) {
                    if (regex.test(String.fromCharCode(keycode))) {
                        if ($(this).val().length == 4) {
                            $(this).val($(this).val() + "-");
                        } else if ($(this).val().length == 7) {
                            $(this).val($(this).val() + "-");
                        } else if ($(this).val().length >= 10) {
                            event.preventDefault();
                        }
                    } else {
                        event.preventDefault();
                    }
                }

            });
        });
    }

    function FocusBlur() {
        $(document).ready(function() {

            $(".dateTypeKey").focus(function() {

                $scope.datePlaceholderValue = $(this).attr('placeholder');

                $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
            }).blur(function() {

                $(this).attr('placeholder', $scope.datePlaceholderValue);
            })
        })
    }

    regexCheck();
    FocusBlur();

    setTimeout(function() {

        $('#RoleId').on('select2:select', function(e) {
            var data = e.params.data;
            $scope.submitted = false;
            $(e.currentTarget).find("option:selected:last").remove();
            $timeout(function() {
                $scope.remoteDataConfig();
                //triggerSelectDrops();
                $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')

            }, 100)
            $scope.createData.UserRoleAssociation.push({
                'RoleID': data.id
            })
            for (i in $scope.createData.UserRoleAssociation) {
                if($scope.createData.UserRoleAssociation.length>1){
                    $scope.createData.UserRoleAssociation.splice(0,1)
                }
                _set_queryvals = {
                    search: $scope.createData.UserRoleAssociation[i].RoleID,
                    start: 0,
                    count: 100
                }

                $scope.setInitMultipleVal(_set_queryvals);

            }
        });

    }, 100)

    setTimeout(function() {
        $('#RoleId').on('select2:unselect', function(e) {
            var data = e.params.data;
            for (i in $scope.createData.UserRoleAssociation) {
                if ($scope.createData.UserRoleAssociation[i].RoleID == data.id) {

                    $scope.createData.UserRoleAssociation.splice(i, 1);
                }
            }
            for (j in $scope.selectMultOptions) {
                if ($scope.selectMultOptions[j].RoleID == data.id) {

                    $scope.selectMultOptions.splice(j, 1);
                }
            }
            for (m in $scope.selectOptions) {
                if ($scope.selectOptions[m].RoleID == data.id) {

                    $scope.selectOptions.splice(m, 1);
                }
            }
            for (l in $scope.pushAllRoleValues) {
                if ($scope.pushAllRoleValues[l].RoleID == data.id) {

                    $scope.pushAllRoleValues.splice(l, 1);
                }
            }

            for (k in $scope.createData.UserRoleAssociation) {
                _set_queryvals = {
                    search: $scope.createData.UserRoleAssociation[k].RoleID,
                    start: 0,
                    count: 100
                }

                $scope.setInitMultipleVal(_set_queryvals);
            }
            $timeout(function() {
                $scope.remoteDataConfig();

                $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')

            }, 100)

        });

    }, 50)

    $scope.createDynamicSubsection = function(RoleArr) {
        var roleFlag = false;
        for (s in RoleArr) {
            if (RoleArr[s] == $scope.createData.RoleID) {
                roleFlag = true;
            }
        }
        setTimeout(function() {
            if (!roleFlag) {
                $($('.radiobtns')[0]).prop('checked', true);

            } else {
                $(sanitize('input[value="' + $scope.createData.RoleID + '"]')).prop('checked', true)
            }
        }, 100)

    }

    $scope.createDynamicSubsectionpartycode = function(RoleArr) {

        if (RoleArr && _.findWhere($scope.PartyCode_, { 'Name': RoleArr })) {

            $scope.createData['PartyCode'] = _.findWhere($scope.PartyCode_, { 'Name': RoleArr }).Value
        }

    }

    $scope.addNewRoleSection = function(index, e) {
        $scope.submitted = false;
        var Objkey = [];

        if ($scope.createData.UserRoleAssociation[index] && $scope.createData.UserRoleAssociation[index].$$hashKey) {
            delete $scope.createData.UserRoleAssociation[index].$$hashKey;

        }

        Object.keys($scope.createData.UserRoleAssociation[index]).forEach(function(key, value) {
            if ($scope.createData.UserRoleAssociation[index][key] != '' && $scope.createData.UserRoleAssociation[index][key] != undefined) {

                Objkey.push(key)
            }
        })
        if (Objkey.length >= 3) {


            $('.setDynamicWidth').animate({
                scrollTop: ($("#" + index).outerHeight() * (index + 1)) + 'px'
            });

            $scope.createData.UserRoleAssociation.push({});

            $timeout(function() {
                $scope.remoteDataConfig();

                $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')
                triggerUnselect()
            }, 500)
        }

    }

    $scope.removeCurrentRoleSection = function(index, e) {

        $scope.createData.UserRoleAssociation.splice(index, 1);
        $('#RoleId' + index).select2('destroy')
        $('#RoleId' + index).find('option').remove('option')


        if ($scope.createData.UserRoleAssociation[index]) {

            if ($scope.createData.UserRoleAssociation[index].RoleID) {
                for (i in $scope.createData.UserRoleAssociation) {
                    _set_queryvals = {
                        search: $scope.createData.UserRoleAssociation[i].RoleID,
                        start: 0,
                        count: 100
                    }

                    $scope.setInitMultipleVal(_set_queryvals);
                    $('#RoleId' + index).val($scope.createData.UserRoleAssociation[index].RoleID)
                }

            } else {
                setTimeout(function() {

                    if ($('#RoleId' + index).find('option').val().indexOf('undefined') != -1) {
                        $('#RoleId' + index).find('option').remove('option')
                    }
                }, 100)
            }
        }
        $('#RoleId' + index).select2({
            ajax: {
                url: BASEURL + RESTCALL.CreateRole,
                headers: authenticationObject,
                dataType: 'json',
                delay: 250,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                        xhr.withCredentials = true
                },
                crossDomain: true,
                data: function(params) {
                    var query = {
                        start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                        count: $scope.limit
                    }

                    if (params.term) {
                        query = {
                            search: params.term,
                            start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                            count: $scope.limit
                        };
                    }
                    return query;
                },
                processResults: function(data, params) {
                    params.page = params.page ? params.page : 0;
                    var myarr = []

                    for (j in data) {
                        myarr.push({
                            'id': data[j].RoleID,
                            'text': data[j].RoleName + '(' + data[j].RoleID + ')'
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
            placeholder: $filter('translate')('Placeholder.Select'),
            minimumInputLength: 0,
            allowClear: true

        })

        $timeout(function() {
            $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')
        }, 500)

    }

    $(document).ready(function() {
        $scope.activatePickerSubsec = function(sDate, eDate, index) {

            var start = new Date();
            var endDate = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));
            $(sanitize('#' + sDate + index)).datepicker({
                startDate: start,
                endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                useCurrent: false,
                showClear: true


            }).on('changeDate', function(selected) {
                start = new Date(selected.date.valueOf());

                start.setDate(start.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + eDate)).datepicker('setStartDate', start);

            });

            $(sanitize('#' + eDate + index)).datepicker({
                startDate: start,
                endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                useCurrent: false,
                showClear: true

            }).on('changeDate', function(selected) {
                endDate = new Date(selected.date.valueOf());

                endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);

            });

            $(sanitize('#' + sDate + index)).keyup(function(ev) {

                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {


                    $(sanitize('#' + eDate + index)).datepicker('setStartDate', new Date());
                }
            })
            $(sanitize('#' + eDate + index)).keyup(function(ev) {

                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                    $(sanitize('#' + sDate + index)).datepicker('setEndDate', null);
                }
            })

            setTimeout(function() {
                regexCheck();


            }, 100)
        }
    });

    $scope.activatePick = function(e, index) {
        $scope.activatePickerSubsec('Subsec_EffectiveFromDate', 'Subsec_EffectiveTillDate', index);
        if ($(e.currentTarget).attr('id') == 'Subsec_EffectiveFromDate' + index) {
            $('#Subsec_EffectiveFromDate' + index).datepicker('show');
        } else {
            $('#Subsec_EffectiveTillDate' + index).datepicker('show');
        }
    }

    $scope.triggerPickerSubSec = function(e, index) {
        $scope.activatePickerSubsec('Subsec_EffectiveFromDate', 'Subsec_EffectiveTillDate', index);

        $(e.currentTarget).prev().datepicker("show");
    };

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

    function triggerSelectDrops() {
        $scope.select2Arr = ["IsForceReset", "Status", "TimeZone", "Subsec_Status", "Department", "Country"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $("select[name=" + $scope.select2Arr[i] + "]").select2({
                    placeholder: $filter('translate')('Placeholder.Select'),
                    minimumInputLength: 0,
                    allowClear: true

                })

                if ($scope.select2Arr[i] == 'TimeZone') {

                    $scope.timezoneOptions = timeZoneDropValues.TimeZone


                }
                if ($scope.select2Arr[i] == 'Country') {
                    $scope.countryOption = countryDropValues


                }
            }
        })

    }
    setTimeout(function() {
        triggerSelectDrops();
    }, 1000);

    $(window).resize(function() {

        $scope.$apply(function() {
            $scope.alertWidth = $('.tab-content').width();

        });

    });

    $scope.limit = 100;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {
            $(".appendRoleId").select2({
				ajax: {
					url: BASEURL + '/rest/v2/administration/partyroles',
					headers: authenticationObject,
					dataType: 'json',
					delay: 250,
					xhrFields: {
						withCredentials: true
					},
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
							xhr.withCredentials = true
					},
					crossDomain: true,
					data: function (params) {
						var query = {
							start: params.page * $scope.limit ? params.page * $scope.limit : 0,
							count: $scope.limit,
							partycode:$scope.createData.PartyCode,
							filter : false

						}

						if (params.term) {
							query = {
								search: params.term,
								start: params.page * $scope.limit ? params.page * $scope.limit : 0,
								count: $scope.limit,
								partycode:$scope.createData.PartyCode,
								filter : false
							};
						}
						return query;
					},
					processResults: function (data, params) {
						params.page = params.page ? params.page : 0;
						var myarr = []

						for (j in data) {

                            myarr.push({
                                'id': data[j].RoleID,
                                // 'text': data[j].RoleName + '(' + data[j].RoleID + ')'
                                'text': data[j].RoleName
                            })

                        }

						return {
							results: myarr,
							pagination: {
								more: data.length >= $scope.limit
							}
						};

					},
					error: function (data) {

						if (data.status == 403) {

							setTimeout(function () {
								$scope.$apply(function () {
									$scope.alerts = [{
										type: 'danger',
										msg: data.responseJSON.error.message

									}]
								})
							}, 100)
						}

					},
					cache: true
				},

				placeholder: sessionStorage.sessionlang == 'en_US' ? 'Select' : 'Seleccionar',
				minimumInputLength: 0,
				allowClear: true

			})
            $(".appendRoleId1").select2({
                ajax: {
                    url: BASEURL + '/rest/v2/administration/user/roleType',
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCredentials = true
                    },
                    crossDomain: true,
                    data: function(params) {
                        var query = {
                            start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                            count: $scope.limit
                        }

                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                                count: $scope.limit
                            };
                        }
                        return query;
                    },
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = []
                        $scope.PartyCode_ = data.PartyCode

                        for (j in data.PartyCode) {

                            myarr.push({
                                'id': data.PartyCode[j].Value,
                                'text': data.PartyCode[j].Value
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
                placeholder: $filter('translate')('Placeholder.Select'),
                minimumInputLength: 0,
                allowClear: true

            })
        }

        $scope.remoteDataConfig()
    });




    $scope.checkMandatory = function(index, field) {

        if (index != 0) {
            for (var keyName in $scope.createData.UserRoleAssociation[index]) {
                if (keyName != field) {
                    if ($scope.createData.UserRoleAssociation[index][keyName] != '') {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return true;
        }
    }

    $scope.gotoCancelFn = function() {
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $scope.GoBackFromUser();
        }

    }

    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick) {
            $scope.GoBackFromUser();
            $rootScope.dataModified = false;
        } else {
            $rootScope.$emit("MyEvent2", true);

        }
    }

    $scope.GoBackFromUser = function() {
        $state.go('app.users')

    }

    $scope.BackupDraft = ''
    $scope.takeBackupData = function(data) {
        $scope.BackupDraft = data;
    }

    $scope.primarykey = '';
    $scope.primaryKeyALert = false;
    var draftdata = '';
    $http.get(BASEURL + RESTCALL.UserManagementPK).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.primarykey = data.responseMessage.split(',');

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
            msg: data.error.message
        }];

        $scope.alertStyle = alertSize().headHeight;
        $scope.alertWidth = alertSize().alertWidth;
    });

    function checkPrimaryKeyValues(getDta) {
        if ($.isEmptyObject(getDta)) {
            $scope.primaryKeyALert = true;
        } else {
            $.each(getDta, function(key, val) {
                for (i = 0; i < $scope.primarykey.length; i++) {
                    if (!getDta[$scope.primarykey[i]]) {
                        $scope.primaryKeyALert = true;
                    }
                }
            })

        }
    }

    $scope.SaveAsDraft = function(formDatas1) {

        $scope.primaryKeyALert = false;
        checkPrimaryKeyValues(formDatas1);
        if ($scope.primaryKeyALert) {
            $scope.madeChanges = false;
            $("#changesLostModal").modal('show');
        } else {
            $scope.callingDraftSave(formDatas1)
        }

    }

    $scope.SaveAsModalDraft = function() {
        $scope.callingDraftSave($scope.BackupDraft)
    }

    $scope.callingDraftSave = function(formDatas) {
        $rootScope.dataModified = false;
        var backupdata = angular.copy(formDatas);
        draftdata = cleanalltheinputdataObj(backupdata);
        delete draftdata.RoleID1;
        draftdata.RoleID = $(".radiobtns:checked").val();
        $http({
            method: 'POST',
            url: BASEURL + RESTCALL.CreateNewUser,
            data: draftdata,
            headers: {
                draft: true
            }

        }).then(function(response) {
            $rootScope.dataModified = false;
            if (response.data.Status === "Saved as Draft") {
                $scope.input = {
                    'responseMessage': response.data.responseMessage
                }
                $state.go("app.users", {
                    input: $scope.input
                })
            }
        }, function(resperr) {

            if (resperr.data.error.message == 'Draft Already Exists') {
                $("#draftOverWriteModal").modal("show");
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: resperr.data.error.message
                }]
                errorservice.ErrorMsgFunction(resperr, $scope, $http, resperr.status)

            }
        })

    }

    $scope.forceSaveDraft = function() {
        $http({
            method: 'POST',
            url: BASEURL + RESTCALL.CreateNewUser,
            data: draftdata,
            headers: {
                draft: true,
                'Force-Save': true
            }

        }).then(function(response) {

            if (response.data.Status === "Draft Updated") {
                $("#draftOverWriteModal").modal("hide");
                $scope.input = {
                    'responseMessage': response.data.responseMessage
                }
                $state.go("app.users", {
                    input: $scope.input
                })
            }
        }, function(resperr) {
            $("#draftOverWriteModal").modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: resperr.data.error.message
            }]
            errorservice.ErrorMsgFunction(resperr, $scope, $http, resperr.status)

        })
    }

    $('#changesLostModal').on('shown.bs.modal', function(e) {
        $('body').css('padding-right', 0)
    })

    $('#changesLostModal').on('hidden.bs.modal', function(e) {
        $scope.fromCancelClick = false;
    })

    $('#draftOverWriteModal').on('shown.bs.modal', function(e) {
        $('body').css('padding-right', 0)
    })
    $('#draftOverWriteModal').on('hidden.bs.modal', function(e) {

        setTimeout(function() {
            $scope.updateEntity = false;
        }, 100)

    })
    $scope.allowOnlyNumbersAlone = function(event) {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            var keyArr = [8, 9, 35, 36, 37, 39, 46]

            function chkKey(key) {
                if (keyArr.indexOf(key) != -1) {
                    return false;
                } else {
                    return true;
                }
            }

            $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));
            if ((chkKey(event.keyCode)) && (event.which != 46 || $(event.currentTarget).val().indexOf('.') == -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        } else {
            if ((event.keyCode == 46) || (event.charCode == 46)) {
                $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));

            }

            if ((event.which != 46 || $(event.currentTarget).val().indexOf('.') == -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        }

    }
    $scope.changetoPasswordFormat = function(event, modelvalue) {
        if (!modelvalue) {
            $(event.currentTarget).css('font-family', 'inherit')
        } else {
            $(event.currentTarget).css('font-family', 'password')
        }
    }

}]);
