angular.module('VolpayApp').controller('myprofileCtrl', function($scope, $http, $location, $translate, $state, $timeout, $filter, GlobalService, AllPaymentsGlobalData, LogoutService, DashboardService, CommonService, $rootScope, ConfirmationService, errorservice, EntityLockService, datepickerFaIcons, GetPermissions) {
    $scope.newPermission = GetPermissions("My Profile");
    $scope.$on('langChangeEvent', function () {  
        $scope.initialCall();
        if(multilingualSearchData && multilingualSearchData.multilingualenable){     
            $('.lang').attr('checked', false)   ;   
            $rootScope.languageselected_ = sessionStorage.sessionlang;
     
            if (sessionStorage.sessionlang == 'en_US') {
                $('#lang_1').prop('checked', true);
            } else if (sessionStorage.sessionlang == 'es_ES'){
                $('#lang_2').prop('checked', true);
            } else {
                $('#lang_1').prop('checked', true);
            }
        }
    });

    var authenticationObject = $rootScope.dynamicAuthObj;
    $scope.makeCall = false;
    $scope.isEditClicked = false;
    $scope.viewProfileRole = true;
    $scope.newFlagOpen = false;

    sessionStorage.ROLE_ID = (sessionStorage.ROLE_ID) ? sessionStorage.ROLE_ID : localStorage.ROLE_ID;
    sessionStorage.UserID = (sessionStorage.UserID) ? sessionStorage.UserID : localStorage.UserID;

    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 
    
    $scope.paymentModule = {
        present: false,
        allpayments: false,
        allfiles: false
    }

    $scope.paymentData = (sessionStorage.menuList) ? JSON.parse(sessionStorage.menuList) : [];

    for (var i in $scope.paymentData) {
        if (('ParentName' in $scope.paymentData[i]) && ($scope.paymentData[i].ParentName == "Payment Module")) {
            $scope.paymentModule.present = true;

            for (var j in $scope.paymentData[i].subMenu) {
                if ($scope.paymentData[i].subMenu[j].Name == "All Payments") {
                    $scope.paymentModule.allpayments = true;
                } else if ($scope.paymentData[i].subMenu[j].Name == "Received Instructions") {
                    $scope.paymentModule.allfiles = true;
                }
            }
        }
    }

    sidebarMenuControl('Home', 'MyProfile');
    $scope.callOnTimeOut = function() {
        $('.alert').hide();
    }
    if(sessionStorage.pwRest == undefined){
        sessionStorage.pwRest = false;
    }
    $scope.userId = sessionStorage.UserID;

    if ((sessionStorage.pwRest == false) || (sessionStorage.pwRest == 'false')) {
        $scope.profileSetup = false;
    } else {
        $rootScope.languageselected_ = sessionStorage.sessionlang;
        $scope.profileSetup = true;
    }

    setTimeout(function() {
        if ($scope.profileSetup == true) {
            $('.fixedfooter').css('margin-left', '0');
            $('.footertext1').css('left', '0');
        }
    }, 50)

    $scope.setting = {
        'selectedrefreshField': [],
        'refreshTime': 120
    };

    $scope.refreshFields = [];
    $scope.sidebarVal = GlobalService.sidebarVal;

    for (k in $scope.sidebarVal) {
        for (i in $scope.sidebarVal[k].subMenu) {
            $scope.refreshFields.push({
                'actualvalue': $scope.sidebarVal[k].subMenu[i].Link,
                'displayvalue': $scope.sidebarVal[k].subMenu[i].Name
            })
        }
    }

    $scope.viewProfile = true;

    $scope.dbSettingFlag = false;
    $scope.settingsChanged = false;

    $scope.accessToken = true;

    $scope.cData = {};
    $scope.selectMultOptions = [];

    $scope.initialCall = function() {

        $http.get(BASEURL + RESTCALL.PasswordRules+ "/" + ($translate.proposedLanguage() ? $translate.proposedLanguage() : sessionStorage.sessionlang)).then(function onSuccess(response) {
            var data = response.data;
            $scope.passwordRules = data.responseMessage;
        });

        $scope.Restloaded = false;
        if ((($scope.flag == $state.current.name.split('.')[1]) || ($scope.accessToken))) {

            $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.cData = data;
     
                sessionStorage.UserTimezone =  $scope.cData.TimeZone;
                $scope.cData.IsForceReset = String($scope.cData.IsForceReset)
                $scope.maskedEmail = emailMasking($scope.cData.EmailAddress);

                $scope.setInitVal = function(_query) {
                    return $http({
                        method: "GET",
                        url: BASEURL + '/rest/v2/userrole/readall',
                        params: _query
                    }).then(function(response) {
                        $scope.selectOptions = response.data;
                        return $scope.selectOptions;
                    })
                }

                $scope.setInitMultipleVal = function(_multiplequery) {
                    return $http({
                        method: "GET",
                        url: BASEURL + '/rest/v2/userrole/readall',
                        params: _multiplequery
                    }).then(function(response) {
                        for (i in response.data) {
                            $scope.selectMultOptions.push(response.data[i])
                        }
                        return $scope.selectMultOptions;
                    })
                }

                if (Object.keys($scope.cData).indexOf('RoleID') != -1) {
                    var _query = {
                        search: $scope.cData.RoleID,
                        start: 0,
                        count: 100
                    }
                    $scope.setInitVal(_query)
                }

                for (j in $scope.cData.UserRoleAssociation) {

                    var _queryvals = {
                        search: $scope.cData.UserRoleAssociation[j].RoleID,
                        start: 0,
                        count: 100
                    }
                    $scope.setInitMultipleVal(_queryvals)
                }


                $scope.backupData = angular.copy(data)
                $scope.profileName = $scope.cData.FirstName;
                $timeout(function() {
                    $scope.Restloaded = true;
                }, 300)

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

                $timeout(function() {
                    $scope.Restloaded = true;
                }, 300)
            });
        } else {

            clearInterval($scope.interval);
        }
    }

    $scope.initialCall()

    $scope.changedEmailInput = function(ev, updatedinput) {
        $scope.cData.EmailAddress = updatedinput;
    }

    $scope.autoRefresh = false;

    $scope.refreshFn = function() {
            if ($scope.viewProfile) {
                clearInterval($scope.interval);

                var cal = sessionStorage.refreshData ? JSON.parse(sessionStorage.refreshData) : '';
                if (cal) {

                    $timeout(function() {
                        $('#autorefreshFields').select2('val', cal.selectedrefreshField)
                    }, 200)

                    if (cal.autoRefresh) {
                        $('#toggle-event').bootstrapToggle('on')
                        $scope.autoRefresh = true;
                    } else {
                        $('#toggle-event').bootstrapToggle('off')
                        $scope.autoRefresh = false;
                        $scope.setting = {
                            'selectedrefreshField': [],
                            'refreshTime': 120
                        };
                    }
                    $scope.setting.refreshTime = cal.refreshTime;
                    for (i in cal.selectedrefreshField) {
                        if ($state.current.name.split('.')[1] == cal.selectedrefreshField[i]) {
                            $scope.accessToken = false;
                            $scope.interval = setInterval($scope.initialCall, Number(cal.refreshTime) * 1000);
                            $scope.flag = cal.selectedrefreshField[i];
                        }

                    }
                }
            } else {
                clearInterval($scope.interval);
                $('#toggle-event').bootstrapToggle('off')
                $timeout(function() {
                    $('#autorefreshFields').select2('val', '')
                }, 200)

                $scope.autoRefresh = false;
                $scope.setting = {
                    'selectedrefreshField': [],
                    'refreshTime': 120
                };
            }
        }
        // $scope.refreshFn()

    $scope.resetProfileData = function() {
        // $scope.cData = angular.copy($scope.backupData);
        $("#EmailAddress").removeAttr("style")
        $scope.initialCall()
        //$scope.timeZone()
    }

    // $scope.timezoneOptions = [];
    // $scope.countryOptions = [];

    function callAtTimeout() {
        $('.alert-success,.alert-danger').hide();
    }

    $scope.ProfileUpdate = function(data) {

        data = cleantheinputdata(data);
        $("#associationDetails").modal('hide');
        $scope.isEditClicked = false;
        $scope.viewProfileRole = true;
        // $scope.eFlag = emailValidation("#EmailAddress");

        var copyData = angular.copy(data)

        var ProfUbdateObj = {};
        ProfUbdateObj.UserId = sessionStorage.UserID;
        ProfUbdateObj.Data = btoa(JSON.stringify(copyData))

        $http.put(BASEURL + RESTCALL.CreateNewUser, copyData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }]

            $scope.viewProfile = true;
            $scope.maskedEmail = emailMasking($scope.cData.EmailAddress);

            setTimeout(function() {
                $scope.initialCall()
                callAtTimeout()
            }, 3000)
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
            }]
        });

        setTimeout(function() {
            callAtTimeout()
        }, 3000)

    }

    $scope.value = 'es_ES';
    $scope.flagTrue = true;

    $scope.themeSelect = function(color) {
        $('#themeColor').attr("href", 'themes/styles/' + color + ".css");
        $scope.selectedColor = color;
        $scope.ssColor = color;
    }

    $scope.retainSavedResults = function() {

        $scope.FListSavedSearchNotExist = true;
        $scope.AllPaymentsSavedSearchNotExist = true;
        $scope.distSavedSearchNotExist = true;
        $scope.confirSavedSearchNotExist = true;
        $scope.allAttachedMessages = true;

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

            sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;

            $scope.userFullObj = data;
            $scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))

            if ('myProfileSetting' in $scope.uData) {

                $scope.uData.myProfileSetting.landingPagesArr = userData.myProfileSetting.landingPagesArr;
            }

            for (var i in $scope.uData.defaultChartTypes.paymentDashoard) {
                if ($scope.uData.defaultChartTypes.paymentDashoard[i].id == "sankeyChart") {
                    $scope.uData.defaultChartTypes.paymentDashoard[i].chartType = 'donut';
                }
            }

            userData = $scope.uData;
            $scope.active = userData.customDashboardWidgets.showDashboard;


            $scope.customDashboardWidgets = userData.customDashboardWidgets.settings;
            $scope.DboardPreferences = userData.DboardPreferences;


            $scope.setting.nlanding = $scope.uData.myProfileSetting.nlanding.name;

            $scope.myDboardSelectedVal = {};
            $scope.dBoardSelectedVal = {
                "paymentDashboard": {},
                "fileDashboard": {}
            };

            //Setting Default chart types to my dashboard

            for (var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                $scope.myDboardSelectedVal[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;
            }


            for (var i in userData.defaultChartTypes.paymentDashoard) {
                $scope.dBoardSelectedVal.paymentDashboard[userData.defaultChartTypes.paymentDashoard[i].id] = userData.defaultChartTypes.paymentDashoard[i].chartType;
            }

            $scope.showingSelectedDboard = $scope.uData.defaultdashboard;

            if (!$scope.paymentModule.allpayments) {
                for (var i in $scope.showingSelectedDboard.selectChart) {
                    if ($scope.showingSelectedDboard.selectChart[i].actual == "dashboardPayments") {
                        $scope.showingSelectedDboard.selectChart.splice(i, 1);
                    }
                }
            }

            if (!$scope.paymentModule.allfiles) {
                for (var i in $scope.showingSelectedDboard.selectChart) {
                    if ($scope.showingSelectedDboard.selectChart[i].actual == "dashboardFile") {
                        $scope.showingSelectedDboard.selectChart.splice(i, 1);
                    }
                }
            }

            if (!$scope.paymentModule.allpayments && !$scope.paymentModule.allfiles) {
                for (var i in $scope.showingSelectedDboard.selectChart) {
                    if ($scope.showingSelectedDboard.selectChart[i].actual == "myDashboard") {
                        $scope.showingSelectedDboard.selectChart.splice(i, 1);
                    }
                }
            }

            $scope.selectDefDashboard = userData.defaultdashboard.defDashboard;

            /***Language Setting ***/  
             $scope.langSelected=$scope.uData.genSetting.languageSelected;

            //     $('.lang').attr('checked', false)

            //     if ($scope.uData.genSetting.languageSelected == 'en_US') {
            //         $('#lang_1').prop('checked', true)
            //     } else if ($scope.uData.genSetting.languageSelected == 'es_ES'){
            //         $('#lang_2').prop('checked', true)
            //     } else {
            //         $('#lang_1').prop('checked', true)
            //     }
           


            /*** Theme Setting ***/
            $scope.ssColor = $scope.uData.genSetting.themeSelected;

            $rootScope.languageselected_=$scope.langSelected
            $scope.language = {
                // Handles language dropdown
                listIsOpen: false,
                // list of available languages
                available: {
                    'en_US': 'English',
                    'es_ES': 'Spanish',
                    'fr_FR': 'French',
                    'ru_RU': 'Russian'
                },
                // display always the current ui language
                init: function() {

                    var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                    var preferredLanguage = $translate.preferredLanguage();

                    $scope.proposedLanguage = proposedLanguage;
                    $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
                    $scope.langSelected = proposedLanguage;
                },
                set: function(localeId, ev) {

                    $rootScope.languageselected_=localeId
                    $translate.use(localeId);
                    $scope.language.selected = $scope.language.available[localeId];
                    $scope.language.selected1 = localeId;
                    $scope.language.listIsOpen = !$scope.language.listIsOpen;

                    $('.lang').attr('checked', false)
                    if (localeId == 'en_US') {
                        $('#lang_1').attr('checked', true)
                    } else if (localeId == 'es_ES') {
                        $('#lang_2').attr('checked', true)
                    }

                    sessionStorage.sessionlang = $scope.langSelected  = localeId;

                    $scope.$broadcast('langChangeEvent2Header');
                }
            };

            $scope.checkSavedSearches = function() {

                $scope.savedSearches = {
                    "FileList": [],
                    "AllPayments": [],
                    "ReceivedInsn": [],
                    "AllConfirmations": [],
                    "AllAttachedMessages": []
                };

                for (var i in $scope.uData.savedSearch) {
                    for (var j in $scope.uData.savedSearch[i]) {
                        $scope.savedSearches[i].push($scope.uData.savedSearch[i][j])
                    }

                }

                if ($scope.savedSearches.FileList.length > 0) {
                    $scope.FListSavedSearchNotExist = false;
                }
                if ($scope.savedSearches.ReceivedInsn.length > 0) {
                    $scope.distSavedSearchNotExist = false;
                }
                if ($scope.savedSearches.AllPayments.length > 0) {
                    $scope.AllPaymentsSavedSearchNotExist = false;
                }
                if ($scope.savedSearches.AllConfirmations.length > 0) {
                    $scope.confirSavedSearchNotExist = false;

                }
                if ($scope.savedSearches.AllAttachedMessages.length > 0) {
                    $scope.AllAttachedMessagesSavedSearchNotExist = false;
                } else {
                    $scope.allAttachedMessages = false;
                }
            }
            $scope.checkSavedSearches()

            $scope.checkBoxsetting = function() {
                //setTimeout(function(){
                for (var i in $scope.DboardPreferences) {
                    for (var j in $scope.DboardPreferences[i]) {

                        if ($('.' + i + '_' + j + ':checked').length < $('.' + i + '_' + j).length) {
                            $('#' + i + '_' + j).prop('checked', false)
                        } else if ($('.' + i + '_' + j + ':checked').length == $('.' + i + '_' + j).length) {
                            $('#' + i + '_' + j).prop('checked', true)
                        }
                    }
                }
                // },100)

                $scope.divCheckAll = {
                    "paymentDashboard": false,
                    "fileDashboard": false
                }

                //  setTimeout(function(){

                for (var i in $scope.customDashboardWidgets) {
                    for (var j in $scope.customDashboardWidgets[i]) {

                        if ($('.' + i + '_' + j + '_custom:checked').length < $('.' + i + '_' + j + '_custom').length) {

                            $('#' + i + '_' + j + '_custom').prop('checked', false)
                        } else if ($('.' + i + '_' + j + '_custom:checked').length == $('.' + i + '_' + j + '_custom').length) {

                            $('#' + i + '_' + j + '_custom').prop('checked', true)
                        }
                    }
                }

                for (var i in $scope.customDashboardWidgets) {
                    //$scope.dummy = false;

                    for (var j in $scope.customDashboardWidgets[i]) {

                        if ($('.checkAll_' + i + ':checked').length == 2) {
                            $('#checkAll_' + i + '_custom').prop('checked', true)
                            $scope.divCheckAll[i] = true;
                        } else {
                            $('#checkAll_' + i + '_custom').prop('checked', false)
                            $scope.divCheckAll[i] = false;
                        }
                    }
                }
                //},100)
            }

            setTimeout(function() {
                $scope.checkBoxsetting();
            }, 100)

            $scope.resetFn = function() {
                $scope.password = {};
                $('.key').css('font-family', 'inherit')
            }

            $scope.setDefaultValues = function() {
                uProfileData = retrieveProfileData();
                $scope.customDashboardWidgets = uProfileData.customDashboardWidgets.settings;
                $scope.DboardPreferences = uProfileData.DboardPreferences;

                for (var i in $scope.DboardPreferences) {
                    for (var j in $scope.DboardPreferences[i]) {
                        for (var k in $scope.DboardPreferences[i][j]) {
                            $('#' + i + '_' + j + '_' + $scope.DboardPreferences[i][j][k].name).prop('checked', $scope.DboardPreferences[i][j][k].visibility)
                            $('#' + i + '_' + j).prop('checked', $scope.DboardPreferences[i][j][k].visibility)
                        }
                    }

                }

                for (var i in $scope.customDashboardWidgets) {
                    for (var j in $scope.customDashboardWidgets[i]) {
                        $('#' + i + '_' + j + '_custom').prop('checked', $scope.customDashboardWidgets[i][j][k].visibility)
                    }
                }

                userData.DboardPreferences = $scope.DboardPreferences;
                userData.customDashboardWidgets.settings = $scope.customDashboardWidgets;

                for (var i in uProfileData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                    $scope.myDboardSelectedVal[uProfileData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = uProfileData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;
                }

                for (var i in uProfileData.defaultChartTypes.paymentDashoard) {
                    $scope.dBoardSelectedVal.paymentDashboard[uProfileData.defaultChartTypes.paymentDashoard[i].id] = uProfileData.defaultChartTypes.paymentDashoard[i].chartType;
                }

                //Set chart type to my dashboard
                for (var i in $scope.myDboardSelectedVal) {
                    for (var j in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                        if (i == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].id) {
                            userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].chartType = $scope.myDboardSelectedVal[i];
                        }
                    }
                }

                /** Setting Default chart type to payment/file dashboards */
                for (var key in $scope.dBoardSelectedVal) {
                    for (var i in $scope.dBoardSelectedVal[key]) {
                        for (var j in userData.defaultChartTypes.paymentDashoard) {
                            if (i == userData.defaultChartTypes.paymentDashoard[j].id) {
                                userData.defaultChartTypes.paymentDashoard[j].chartType = $scope.dBoardSelectedVal[key][i];
                            }
                        }

                    }
                }

                $scope.active = false;
                userData.customDashboardWidgets.showDashboard = false;

                $scope.checkSavedSearches()
                for (var i in userData.defaultChartTypes.paymentDashoard) {
                    if (userData.defaultChartTypes.paymentDashoard[i].data) {
                        delete userData.defaultChartTypes.paymentDashoard[i].data;
                    }
                }

                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj[0]).then(function(response) {
                    $scope.alerts = [{
                        type: response.Status,
                        msg: (response.Status == 'success') ? response.data.data.responseMessage : response.data.data.error.message
                    }];
                    $scope.alertWidth = alertSize().alertWidth;
                    $timeout(function() {
                        $scope.callOnTimeOut()
                    }, 4000)
                });

            }

            $scope.$watch(function() {

                if ($scope.active) {
                    $('#MyDashboard').css('display', 'block')
                } else {
                    $('#MyDashboard').css('display', 'none')

                    /*for(var i in $scope.uData.myProfileSetting.landingPagesArr) {
                        
                        if($scope.uData.myProfileSetting.landingPagesArr[i].name == "My Dashboard")
                        {
                            $scope.uData.myProfileSetting.landingPagesArr.splice(i,1)
                            $scope.setting.landingModule = 'paymentsummary';
                
                        }
                    }*/
                }
            })
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $translate.use("es_ES");

            // if (status == 401) {
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                // } else {
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            // }
        });
    }

    if (sessionStorage.pwRest == false || sessionStorage.pwRest == 'false') {
        setTimeout(function() {
            $scope.retainSavedResults();
        }, 100)
    }

    if ((document.cookie) && (configData.Authorization == "External")) {
        $scope.profileSetup = false;
        $scope.retainSavedResults();
    }

    $scope.settingForDashboard = function(data) {
        $scope.showingSelectedDboard.defDashboard = data;
    }

    //Called when user save their settings like Thems, Language
    $scope.saveUserSetting = function(data) {

        $scope.settingsChanged = true;
        data.autoRefresh = $('#toggle-event').prop('checked');

        if (data.autoRefresh) {
            if (data.selectedrefreshField.length == 0) {
                $scope.setting = {
                    'selectedrefreshField': [],
                    'refreshTime': 120
                };
                delete sessionStorage.refreshData;
                clearInterval($scope.interval);
            } else {
                sessionStorage.refreshData = JSON.stringify(data);
                //  $scope.refreshFn()
            }
        } else {
            delete sessionStorage.refreshData;
            $timeout(function() {
                $('#autorefreshFields').select2('val', '')
            }, 200)

            // $scope.refreshFn()
        }

        userData.genSetting = {
            "languageSelected": $scope.langSelected,
            "themeSelected": $scope.ssColor
        };

        for (var i in userData.myProfileSetting.landingPagesArr) {
            if (data.nlanding == userData.myProfileSetting.landingPagesArr[i].state) {

                userData.myProfileSetting.nlanding.name = data.nlanding;
                userData.myProfileSetting.nlanding.stateParams = userData.myProfileSetting.landingPagesArr[i].stateParams

                // userData.myProfileSetting.landingModule.name = data.landingModule;
                // userData.myProfileSetting.landingModule.stateParams = userData.myProfileSetting.landingPagesArr[i].stateParams
            }
        }

        for (var i in userData.defaultChartTypes.paymentDashoard) {
            if (userData.defaultChartTypes.paymentDashoard[i].data) {
                delete userData.defaultChartTypes.paymentDashoard[i].data;
            }
        }

        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj[0]).then(function(response) {
            $scope.alerts = [{
                type: response.Status,
                msg: (response.Status == 'success') ? response.data.data.responseMessage : response.data.data.error.message
            }];
            $scope.alertWidth = alertSize().alertWidth;
            $timeout(function() {
                $scope.callOnTimeOut()
            }, 4000);
        });
    }

    $scope.selVal = function(val) {
        $scope.selectDefDashboard = val;

        if (val == 'myDashboard') {
            $scope.active = true;
        }
        userData.defaultdashboard.defDashboard = $scope.selectDefDashboard;
    }

    $scope.showCustomDboard = function() {
        $scope.active = !$scope.active;
        if ($scope.active) {
            $('#MyDashboard').css('display', 'block');
        } else {
            $('#MyDashboard').css('display', 'none');
        }
    }

    $scope.saveWidgetSetting = function() {

        for (var i in $scope.customDashboardWidgets) {
            for (var j in $scope.customDashboardWidgets[i]) {
                for (var k in $scope.customDashboardWidgets[i][j]) {
                    $scope.customDashboardWidgets[i][j][k].visibility = $('#' + i + "_" + j + "_" + $scope.customDashboardWidgets[i][j][k].name + "_custom").prop("checked")
                }
            }
        }

        for (var i in $scope.myDboardSelectedVal) {
            for (var j in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                if (i == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].id) {
                    userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].chartType = $scope.myDboardSelectedVal[i];
                }
            }
        }

        userData.customDashboardWidgets.settings = $scope.customDashboardWidgets;

        $('#cDashboardWidgets').modal('hide')
    }

    $scope.checkAllDivFn = function(val, flag) {
        for (var i in $scope.customDashboardWidgets[val]) {
            if (flag) {
                $('.' + val + '_' + i + '_custom').prop('checked', true)
                $('#' + val + '_' + i + '_custom').prop('checked', true)
            } else {
                $('.' + val + '_' + i + '_custom').prop('checked', false)
                $('#' + val + '_' + i + '_custom').prop('checked', false)
            }
        }
    }


    $scope.dbNewSetting = function() {

        // Setting preferences for Payment and file dashboard 
        for (var i in $scope.DboardPreferences) {
            for (var j in $scope.DboardPreferences[i]) {
                for (var k in $scope.DboardPreferences[i][j]) {
                    $scope.DboardPreferences[i][j][k].visibility = $('#' + i + "_" + j + "_" + $scope.DboardPreferences[i][j][k].name).prop("checked")
                }
            }
        }

        userData.DboardPreferences = $scope.DboardPreferences;

        //set visibile widget and status summary for my dashboard
        for (var i in $scope.customDashboardWidgets) {
            for (var j in $scope.customDashboardWidgets[i]) {
                for (var k in $scope.customDashboardWidgets[i][j]) {
                    $scope.customDashboardWidgets[i][j][k].visibility = $('#' + i + "_" + j + "_" + $scope.customDashboardWidgets[i][j][k].name + "_custom").prop("checked")
                }
            }
        }

        //Set chart type to my dashboard
        for (var i in $scope.myDboardSelectedVal) {
            for (var j in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard) {
                if (i == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].id) {
                    userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].chartType = $scope.myDboardSelectedVal[i];
                }
            }
        }

        /** Setting Default chart type to payment/file dashboards */
        for (var key in $scope.dBoardSelectedVal) {
            for (var i in $scope.dBoardSelectedVal[key]) {
                for (var j in userData.defaultChartTypes.paymentDashoard) {
                    if (i == userData.defaultChartTypes.paymentDashoard[j].id) {
                        userData.defaultChartTypes.paymentDashoard[j].chartType = $scope.dBoardSelectedVal[key][i];
                    }
                }
            }
        }

        userData.customDashboardWidgets.settings = $scope.customDashboardWidgets;
        userData.customDashboardWidgets.showDashboard = $scope.active;

        userData = cleantheinputdata(userData);

        for (var i in userData.defaultChartTypes.paymentDashoard) {
            if (userData.defaultChartTypes.paymentDashoard[i].data) {
                delete userData.defaultChartTypes.paymentDashoard[i].data;
            }
        }

        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj[0]).then(function(response) {
            $scope.alerts = [{
                type: response.Status,
                msg: (response.Status == 'success') ? response.data.data.responseMessage : response.data.data.error.message
            }];
            $scope.alertWidth = alertSize().alertWidth;
            $timeout(function() {
                $scope.callOnTimeOut()
            }, 4000)
        });
    }

    $scope.checkAllFn = function(x, y) {
        $('.' + x + '_' + y).each(function(a, b) {
            if ($('#' + x + "_" + y).prop("checked")) {
                $(this).prop('checked', true)
            } else {
                $(this).prop('checked', false)
            }
        })

        if (y != 'statusSummary') {
            if ($('#' + x + "_" + y).is(':checked')) {
                $('.myClassDis').prop('disabled', false);
            } else {
                $('.myClassDis').prop('disabled', true);
            }
        }

        $('.' + x + '_' + y + '_custom').each(function(a, b) {
            if ($('#' + x + "_" + y + '_custom').prop("checked")) {
                $(this).prop('checked', true)
            } else {
                $(this).prop('checked', false)
            }
        });
    }


    $scope.checkInidivisualCheckbox = function(x, y, z) {

        //setTimeout(function(){

        if (z != 'Status') {
            if ($('#' + x + '_' + y + '_' + z).is(':checked')) {
                $('#drop_' + z).prop('disabled', false)
            } else {
                $('#drop_' + z).prop('disabled', true)
            }
        }

        if ($('.' + x + '_' + y + ':checked').length < $('.' + x + '_' + y).length) {
            $('#' + x + '_' + y).prop('checked', false);
        } else if ($('.' + x + '_' + y + ':checked').length == $('.' + x + '_' + y).length) {
            $('#' + x + '_' + y).prop('checked', true)
        }


        if ($('.' + x + '_' + y + '_custom:checked').length < $('.' + x + '_' + y + '_custom').length) {
            $('#' + x + '_' + y + '_custom').prop('checked', false)
        } else if ($('.' + x + '_' + y + '_custom:checked').length == $('.' + x + '_' + y + '_custom').length) {
            $('#' + x + '_' + y + '_custom').prop('checked', true)
        }
    }


    $scope.gotoFileListSearch = function(searchNameIndex, searchName, $event) {

        if(searchName == 'Flist') {

            GlobalService.myProfileFLindex = searchNameIndex;
            var ff = $scope.uData.savedSearch.FileList[searchNameIndex].params;
            ff = (typeof(ff) == 'string') ? JSON.parse(ff) : ff;
            GlobalService.all = ff.all, GlobalService.today = ff.today, GlobalService.week = ff.week, GlobalService.month = ff.month, GlobalService.custom = GlobalService.custom = ff.custom, GlobalService.todayDate = GlobalService.todayDate = ff.todayDate, GlobalService.weekStart = ff.weekStart, GlobalService.weekEnd = ff.weekEnd, GlobalService.monthStart = ff.monthStart, GlobalService.monthEnd = GlobalService.monthEnd = ff.monthEnd, GlobalService.selectCriteriaTxt = ff.selectCriteriaTxt, GlobalService.selectCriteriaID = ff.selectCriteriaID, GlobalService.prev = ff.prev, GlobalService.prevSelectedTxt = ff.prevSelectedTxt, GlobalService.prevId = GlobalService.prevId = ff.prevId, GlobalService.startDate = GlobalService.startDate = ff.startDate, GlobalService.endDate = ff.endDate, GlobalService.ShowStartDate = ff.ShowStartDate, GlobalService.ShowEndDate = ff.ShowEndDate, GlobalService.searchClicked = GlobalService.searchClicked = ff.searchClicked, GlobalService.isEntered = ff.isEntered, GlobalService.advancedSearch = ff.advancedSearch, GlobalService.advancedSearchEnable = ff.advancedSearchEnable, GlobalService.uirTxtValue = ff.uirTxtValue, GlobalService.fileNameVal = ff.fileNameVal, GlobalService.entrystartdate = ff.entrystartdate, GlobalService.entryenddate = ff.entryenddate;
            GlobalService.searchParams = ff.searchParams;
            GlobalService.FieldArr = ff.FieldArr;
            GlobalService.SelectSearchVisible = true;
            GlobalService.fromMyProfilePage = true;
            GlobalService.searchname = $($event.currentTarget).text().trim();

            $state.go("app.instructions")

        } else if (searchName == 'AllPayments') {
            AllPaymentsGlobalData.myProfileFLindex = searchNameIndex
            var ff = $scope.uData.savedSearch.AllPayments[searchNameIndex].params;
            ff = (typeof(ff) == 'string') ? JSON.parse(ff) : ff;
            AllPaymentsGlobalData.FieldArr = ff.FieldArr;

            AllPaymentsGlobalData.searchParams = ff.searchParams;
            AllPaymentsGlobalData.orderByField = ff.orderByField, AllPaymentsGlobalData.sortReverse = ff.sortReverse, AllPaymentsGlobalData.sortType = ff.sortType, AllPaymentsGlobalData.isSortingClicked = ff.isSortingClicked, AllPaymentsGlobalData.DataLoadedCount = ff.DataLoadedCount, AllPaymentsGlobalData.myProfileFLindex = ff.myProfileFLindex, AllPaymentsGlobalData.all = ff.all, AllPaymentsGlobalData.today = ff.today, AllPaymentsGlobalData.week = ff.week, AllPaymentsGlobalData.month = ff.month, AllPaymentsGlobalData.custom = ff.custom, AllPaymentsGlobalData.FLuir = ff.FLuir, AllPaymentsGlobalData.startDate = ff.startDate, AllPaymentsGlobalData.endDate = ff.endDate, AllPaymentsGlobalData.ShowStartDate = ff.ShowStartDate, AllPaymentsGlobalData.ShowEndDate = ff.ShowEndDate, AllPaymentsGlobalData.todayDate = ff.todayDate, AllPaymentsGlobalData.weekStart = ff.weekStart, AllPaymentsGlobalData.weekEnd = ff.weekEnd, AllPaymentsGlobalData.monthStart = ff.monthStart, AllPaymentsGlobalData.monthEnd = ff.monthEnd, AllPaymentsGlobalData.selectCriteriaTxt = ff.selectCriteriaTxt, AllPaymentsGlobalData.selectCriteriaID = ff.selectCriteriaID, AllPaymentsGlobalData.prev = ff.prev, AllPaymentsGlobalData.prevSelectedTxt = ff.prevSelectedTxt, AllPaymentsGlobalData.prevId = ff.prevId, AllPaymentsGlobalData.searchClicked = ff.searchClicked, AllPaymentsGlobalData.isEntered = ff.isEntered, AllPaymentsGlobalData.advancedSearchEnable = ff.advancedSearchEnable, AllPaymentsGlobalData.uirTxtValue = ff.uirTxtValue,
            AllPaymentsGlobalData.searchNameDuplicated = ff.searchNameDuplicated;
            AllPaymentsGlobalData.SelectSearchVisible = true;
            AllPaymentsGlobalData.fromMyProfilePage = true;
            AllPaymentsGlobalData.searchParams = ff.searchParams;

            AllPaymentsGlobalData.searchname = $($event.currentTarget).text().trim();
            $location.path('app/allpayments')
        }
    }

    $scope.gotoDist = function(val, index) {
        val = (typeof(val) == 'string') ? JSON.parse(val) : val;

        CommonService.distInstruction = val.params.service;
        $rootScope.search = val.params.searchParams;
        $state.go('app.distributedinstructions')
    }

    $scope.gotoConf = function(val, index) {
        val = (typeof(val) == 'string') ? JSON.parse(val) : val;
        ConfirmationService.distInstruction = val.params.service;
        $rootScope.search1 = val.params.searchParams;
        $state.go('app.confirmation')
    }

    $scope.gotoAttach = function(val, index) {
        val = (typeof(val) == 'string') ? JSON.parse(val) : val;
        AttachMsgService.distInstruction = val.params.service;
        $rootScope.search1 = val.params.searchParams;
        $state.go('app.attachmessages')
    }

    $scope.dbSetting = function() {
        $timeout(function() {
            $('.dbDataWidget').find('.checkbox').each(function(key, val) {
                if ($(sanitize(val)).find('span').hasClass('checked')) {
                    DashboardService[$(sanitize(val)).find('span').attr('name')] = true;
                    $scope.dbData[key].flag = DashboardService[$(sanitize(val)).find('span').attr('name')];
                } else {
                    DashboardService[$(sanitize(val)).find('span').attr('name')] = false;
                    $scope.dbData[key].flag = DashboardService[$(sanitize(val)).find('span').attr('name')];
                }
            });

            $http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (data.length > 0) {
                    userData.dashboardSetting = {
                        "curDis": DashboardService.curDis,
                        "InbndPayment": DashboardService.inbndPayment,
                        "Mop": DashboardService.mop,
                        "Status": DashboardService.status,
                    };

                    for (var i in userData.defaultChartTypes.paymentDashoard) {
                        if (userData.defaultChartTypes.paymentDashoard[i].data) {
                            delete userData.defaultChartTypes.paymentDashoard[i].data;
                        }
                    }

                    updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, data[0]).then(function(response) {
                        $scope.alerts = [{
                            type: response.Status,
                            msg: (response.Status == 'success') ? response.data.data.responseMessage : response.data.data.error.message
                        }];
                        $scope.alertWidth = alertSize().alertWidth;
                        $timeout(function() {
                            $scope.callOnTimeOut()
                        }, 4000)
                    });
                } else {

                    userData = uProfileData
                    var lObj = {};
                    lObj.UserID = sessionStorage.UserID;
                    lObj.ProfileData = $filter('stringToHex')(JSON.stringify(userData));

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

                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    });
                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }, 200)

        $scope.dbSettingFlag = true;

        $timeout(function() {
            $scope.dbSettingFlag = false;
        }, 3000)
    }

    $('#toggle-event').change(function() {
        $timeout(function() {
            if($('#toggle-event').prop('checked')) {
                $scope.autoRefresh = true;
            } else {
                $scope.autoRefresh = false;
            }
        }, 200)
    })

    $scope.confirmationAlert = function(index, select) {
        $scope.selectedSearchName = index;
        $scope.showAlertMsg = true;
        $scope.selectedSearchName = index;

        $scope.name = select;
    }

    $scope.deleteSelectedSearch = function(eve) {

        if ($scope.name == 'FList') {
            userData.savedSearch.FileList.splice($scope.selectedSearchName, 1)
        } else if ($scope.name == 'allPayments') {
            userData.savedSearch.AllPayments.splice($scope.selectedSearchName, 1)
        } else if ($scope.name == 'dist') {
            userData.savedSearch.ReceivedInsn.splice($scope.selectedSearchName, 1)
        } else if ($scope.name == 'confir') {
            userData.savedSearch.AllConfirmations.splice($scope.selectedSearchName, 1)
        }

        for (var i in userData.defaultChartTypes.paymentDashoard) {
            if (userData.defaultChartTypes.paymentDashoard[i].data) {
                delete userData.defaultChartTypes.paymentDashoard[i].data;
            }
        }

        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function(response) {
            $scope.alerts = [{
                type: response.Status,
                msg: (response.Status == 'success') ? 'Borrado exitosamente' : response.data.data.error.message
            }];

            $timeout(function() {
                callAtTimeout()
            }, 4000)
            $scope.alertWidth = alertSize().alertWidth;

            $('.modal').modal('hide');
            if (response.Status == 'success') {
                $scope.retainSavedResults()
            }
        });
    };

    if ((sessionStorage.showMoreFieldOnCreateUser == true) || (sessionStorage.showMoreFieldOnCreateUser == 'true')) {
        $scope.showMoreFieldOnPasswordReset = true;
    } else {
        $scope.showMoreFieldOnPasswordReset = false;
    }

    $scope.passwordReset = function(password) {

        if(password.newPW != password.confirmPW) {
            $scope.pwMatchFailed = true;
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('loginPage.PasswordCriteria9')
                // msg: 'New password and confirm password does not match'
            }];

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;
        } else {
            $scope.alertWidth = alertSize().alertWidth;
            $scope.pwMatchFailed = false;
            GlobalService.passwordChanged = true;

            var loginObj = {};
            loginObj.UserId = sessionStorage.UserID;

            if ($scope.showMoreFieldOnPasswordReset) {
                var loginData = {};
                loginData.UserId = sessionStorage.UserID;
                loginData.OldPassword = $('#oldPW1').val() ? $('#oldPW1').val() : $('#oldPW2').val() ? $('#oldPW2').val() : $('#oldPW1').val();
                loginData.NewPassword = password.confirmPW;
                loginData.languageSelected = $rootScope.languageselected_;

                $http.put(BASEURL + RESTCALL.ProfilePasswordReset, loginData).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
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
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    GlobalService.responseMessage = "";
                    GlobalService.passwordChanged = false;
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                });
            } else {
                var loginData = {};
                loginData.UserId = sessionStorage.UserID;
                loginData.OldPassword = $('#oldPW1').val() ? $('#oldPW1').val() : $('#oldPW2').val() ? $('#oldPW2').val() : $('#oldPW1').val();
                loginData.NewPassword = password.confirmPW;
                loginData.languageSelected = $rootScope.languageselected_;

                $http.put(BASEURL + RESTCALL.ProfilePasswordReset, loginData).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $rootScope.alerts = [{
                        "type": "success",
                        "msg": data.responseMessage
                    }];

                    LogoutService.Logout(true);
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
                });
            }
        }
    }

    $scope.pwCancel = function() {
        LogoutService.Logout();
    }

    $scope.pwResetCancel = function() {
        $location.path('/app/dashboard')
    }

    $scope.validatePassWord = function(val, e) {
        if (val) {
            headers = { 'ACHIND': 'myprofile'}
            $http.post(BASEURL + '/rest/v2/ach/passwardcreation/user/creation', {
                'UserId': sessionStorage.UserID,
                'Password': val,
                'languageSelected':$rootScope.languageselected_
            }, { headers: headers }).then(function onSuccess(response) {
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
        }
    }

    $(window).scroll(function() {
        $scope.widthOnScroll();
    });

    $scope.widthOnScroll = function() {
        var mq = window.matchMedia("(max-width: 991px)");
        var headHeight
        if (mq.matches) {
            headHeight = 0;
            $scope.alertWidth = $('.pageTitle').width();
        } else {
            $scope.alertWidth = $('.pageTitle').width();
            headHeight = $('.page-header').outerHeight(true) + 10;
        }
        $scope.alertStyle = headHeight;
    }

    $scope.widthOnScroll();

    $(window).resize(function() {
        $scope.$apply(function() {
            $scope.alertWidth = $('.tab-content').width();
        });
    });
    $scope.limit = 100;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {
            $(".select2drop").select2({
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
                    cache: true
                },
                placeholder: 'Select',
                minimumInputLength: 0,
                allowClear: true

            })
        }
        $scope.remoteDataConfig();
    });


    function triggerSelectDrops() {
        $scope.select2Arr = ["Subsec_RoleID", "Subsec_Status"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $("select[name=" + $scope.select2Arr[i] + "]").select2({
                    placeholder: 'Select an option',
                    minimumInputLength: 0,
                    allowClear: true
                })
            }
        })
    }

    triggerSelectDrops();

    $scope.addNewRoleSection = function(index) {

        var Objkey = [];

        if ($scope.cData.UserRoleAssociation[index] && $scope.cData.UserRoleAssociation[index].$$hashKey) {
            delete $scope.cData.UserRoleAssociation[index].$$hashKey;
        }

        Object.keys($scope.cData.UserRoleAssociation[index]).forEach(function(key, value) {

            if ($scope.cData.UserRoleAssociation[index][key] != '') {
                Objkey.push(key)
            }
        })
        if (Objkey.length >= 3) {

            $('.setDynamicWidth').animate({
                scrollTop: ($("#" + index).outerHeight() * (index + 1)) + 'px'
            });

            $scope.cData.UserRoleAssociation.push({});

            $timeout(function() {
                $scope.remoteDataConfig();
                triggerSelectDrops();
            }, 500)
        }

    }

    $scope.removeCurrentRoleSection = function(index) {
        $scope.cData.UserRoleAssociation.splice(index, 1);
    }

    $scope.activatePickerSubsec = function(e, index) {

        var prev = null;
        $(function() {
            $('.DatePicker').datetimepicker({
                format: "YYYY-MM-DD",
                useCurrent: false,
                showClear: true,
                icons: datepickerFaIcons.icons
            }).on('dp.change', function(ev) {
                if ($(ev.currentTarget).attr('roleattr') && $(ev.currentTarget).val()) {
                    $scope.cData.UserRoleAssociation[index][$(ev.currentTarget).attr('roleattr')] = $(ev.currentTarget).val()
                }
            }).on('dp.show', function(ev) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().parent().css({
                    "overflow": ""
                });
                if ($(ev.currentTarget).parent().parent().parent().parent().parent().parent().children().length > 1 && $(ev.currentTarget).attr('roleattr')) {
                    $(ev.currentTarget).parent().parent().parent().parent().parent().parent().children().each(function() {
                        if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id'))) {} else {
                            $(this).css({
                                "display": "none"
                            });
                        }
                    })
                }
            }).on('dp.hide', function(ev) {
                $(ev.currentTarget).closest('.setDynamicWidth').css({
                    "overflow": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().parent().children().each(function() {
                    $(this).css({
                        "display": ""
                    });
                })

                if ($(ev.currentTarget).attr('roleattr') && $(ev.currentTarget).val()) {
                    $scope.cData.UserRoleAssociation[index][$(ev.currentTarget).attr('roleattr')] = $(ev.currentTarget).val();
                }
            });
        });
    }


    $scope.triggerPickerSubSec = function(e, index) {

        if ($(e.currentTarget).prev().is('.DatePicker')) {
            $scope.activatePickerSubsec($(e.currentTarget).prev(), index);
            if ($(e.currentTarget).attr('roleattr')) {
                $($(e.currentTarget).prev()).data("DateTimePicker").show();
            }
        }
    };

    $scope.activatePicker = function(e) {

        var prev = null;
        $(function() {
            $('.DatePicker').datetimepicker({
                format: "YYYY-MM-DD",
                useCurrent: false,
                showClear: true,
                icons: datepickerFaIcons.icons
            }).on('dp.change', function(ev) {
                if ($(ev.currentTarget).attr('roledateattr') && $(ev.currentTarget).val()) {
                    $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('roledateattr')] = $(ev.currentTarget).val()
                }
            }).on('dp.show', function(ev) {
                $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('roledateattr')] = $(ev.currentTarget).val()
            }).on('dp.hide', function(ev) {
                if ($(ev.currentTarget).attr('roledateattr') && $(ev.currentTarget).val()) {
                    $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('roledateattr')] = $(ev.currentTarget).val()
                }
            });
        });
    }

    $scope.triggerPicker = function(e) {

        $('.input-group-addon').on('click focus', function(e) {
            $(this).prev().focus().click()
        });
        if ($(e.currentTarget).prev().is('.DatePicker')) {
            $scope.activatePicker($(e.currentTarget).prev());
            if ($(e.currentTarget).attr('roledateattr')) {
                $('input[roledateattr=' + $(e.currentTarget).prev().attr('roledateattr') + ']').data("DateTimePicker").show();

            }
        }
    };
    var df = true

    function triggerSelectDrops() {

        $scope.select2Arr = ["IsForceReset", "Status", "TimeZone", "Subsec_Status", "Department", "Country"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $(sanitize("select[name=" + $scope.select2Arr[i] + "]")).select2({
                    placeholder: $filter('translate')('selectOption.Selectanoption'),
                    minimumInputLength: 0,
                    allowClear: true

                })

                if ($scope.select2Arr[i] == 'TimeZone') {

                    $scope.timezoneOptions = timeZoneDropValues? timeZoneDropValues.TimeZone : '';
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
    $scope.toggleView = function(flag) {

        $scope.isEditClicked = true;
        $scope.viewProfileRole = false;

        $scope.viewProfile = flag;
        if (!flag && df) {

        } else {
            df = false
        }

        if (flag) {
            $scope.initialCall()
        }
    }

    $scope.toggleViewModal = function(flag1) {
        $scope.viewProfileRole = flag1;
        $scope.isEditClicked = true;
        $scope.newFlagOpen = true;
    }

    $scope.gotoSaveRole = function(cdata) {
        $scope.ProfileUpdate(cdata);
        $scope.viewProfileRole = true;
        $scope.isEditClicked = false;
        $scope.newFlagOpen = false;
    }
    $scope.modalboxFn = function() {
        if ($scope.newFlagOpen) {
            $scope.viewProfileRole = true;
            $scope.isEditClicked = false;
        }
        $('.alert-success,.alert-danger').hide();
    }

    $scope.limit = 100;
    $scope.allUserDrafts = '';

    $http.post(BASEURL + RESTCALL.UserDraftsReadall, {
        'start': 0,
        'count': 20
    }).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.allUserDrafts = data;
        $scope.dataLen = data;

    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
        $scope.alerts = [{
            'type': "danger",
            'msg': data.error.message
        }]
    });

    $scope.gotoViewDrafts = function(inputObj) {
        var gotostateObj = {
            'Operation': "Clone",
            'totData': inputObj,
            'FromDraft': true,
            'UserProfileDraft': true
        }

        var allMenuList = JSON.parse(sessionStorage.menuList);

        for (i in allMenuList) {
            for (k in allMenuList[i].subMenu) {
                if (allMenuList[i].subMenu[k].TableName == inputObj.Entity) {
                    gotostateObj["gotoPage"] = allMenuList[i].subMenu[k];
                    gotostateObj["gotoPage"]["ParentName"] = allMenuList[i].ParentName;
                    gotostateObj["ulName"] = allMenuList[i].ParentName;
                    gotostateObj["ParentLink"] = allMenuList[i].Link;
                }
            }
        }

        if (gotostateObj.ParentLink.indexOf('app') == -1) {
            if (gotostateObj.gotoPage.Link != "mpitemplate") {
                params = {};
                params.urlId = $filter('removeSpace')(gotostateObj.gotoPage.Name).toLowerCase();
                params.input = gotostateObj;
                $state.go('app.bankData', params);
            } else {
                params = {};
                params.urlId = $filter('removeSpace')(gotostateObj.gotoPage.Name).toLowerCase();
                params.urlOperation = $filter('removeSpace')(gotostateObj.Operation).toLowerCase();
                params.input = gotostateObj;
                $state.go('app.' + gotostateObj.gotoPage.Link, params);
            }
        } else {
            params = {};
            params.urlId = $filter('removeSpace')(gotostateObj.gotoPage.Name).toLowerCase();
            params.urlOperation = $filter('removeSpace')(gotostateObj.Operation).toLowerCase();
            params.input = gotostateObj;
            $state.go('app.' + gotostateObj.gotoPage.Link, params)
        }

        $timeout(function() {
            sidebarMenuControl($filter('specialCharactersRemove')($filter('removeSpace')(gotostateObj.gotoPage.ParentName)), $filter('specialCharactersRemove')($filter('removeSpace')(gotostateObj.gotoPage.Name)));
        }, 400)
    }

    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    }

    $scope.gotodeleteDraft = function() {

        $scope.deleteObj = {
            'UserID': delData.UserID,
            'Entity': delData.Entity,
            'BPK': delData.BPK
        }

        $http.post(BASEURL + "/rest/v2/draft/delete", $scope.deleteObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: "Borrado exitosamente"
            }];
            $scope.allUserDrafts.splice($scope.delIndex, 1);
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                /*$scope.alerts = [{
                    type : 'Error',
                    msg : data.error.responseMessage	
                }];*/

        });
    }

    draftlen = 20;
    argu = {};
    var loadMoreDrafts = function() {

        if (($scope.dataLen.length >= 20)) {
            argu.start = draftlen;
            argu.count = 20;

            $http.post(BASEURL + RESTCALL.UserDraftsReadall, argu).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.dataLen = response;
                if (response.length != 0) {
                    $scope.allUserDrafts = $scope.allUserDrafts.concat($scope.dataLen)
                    draftlen = draftlen + 20;
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
                    type: 'Error',
                    msg: data.error.responseMessage
                }];
            });
        }

    }

    var debounceHandlerDraft = _.debounce(loadMoreDrafts, 700, true);
    //setTimeout(function(){

    $(document).ready(function() {

        $('.UserdraftViewCls').on('scroll', function() {

            $scope.widthOnScroll();
            if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                debounceHandlerDraft();
            }
        });

    })

    $scope.changetoPasswordFormat = function(event, modelvalue) {
        if (!modelvalue) {
            $(event.currentTarget).css('font-family', 'inherit')
        } else {
            $(event.currentTarget).css('font-family', 'password')
        }
    }

    $scope.emailValidate = function(email_entered) {

        if ($("#EmailAddress").val() != "") {
            $scope.eFlag = emailValidation(email_entered, "#EmailAddress")
            if (!$scope.eFlag) {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.alerts = [{
                            type: 'danger',
                            msg:  $filter('translate')('loginPage.PasswordCriteria10')
                        }];
                    })
                }, 200)
                return false;
            } else {
                $('.alert-danger').hide()
            }

        }

    }

    $scope.password_show_hide=function() {
        var x = document.getElementById("password");
        var show_eye = document.getElementById("show_eye");
        var hide_eye = document.getElementById("hide_eye");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
          x.type = "text";
          show_eye.style.display = "none";
          hide_eye.style.display = "block";
        } else {
          x.type = "password";
          show_eye.style.display = "block";
          hide_eye.style.display = "none";
        }
      
      }
      $scope.password_show_hides=function() {
        var x = document.getElementById("ConfirmPassword");
        var show_eye = document.getElementById("show_eyes");
        var hide_eye = document.getElementById("hide_eyes");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
          x.type = "text";
          show_eye.style.display = "none";
          hide_eye.style.display = "block";
        } else {
          x.type = "password";
          show_eye.style.display = "block";
          hide_eye.style.display = "none";
        }
      
      }

      $scope.oldpassword_show_hide=function() {
        var x = document.getElementById("oldPW2");
        var show_eye = document.getElementById("oldshow_eye");
        var hide_eye = document.getElementById("oldhide_eye");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
          x.type = "text";
          show_eye.style.display = "none";
          hide_eye.style.display = "block";
        } else {
          x.type = "password";
          show_eye.style.display = "block";
          hide_eye.style.display = "none";
        }
      
      }
    $scope.reset_oldpassword_show_hide=function() {
      var x = document.getElementById("oldPW1");
      var show_eye = document.getElementById("resetoldshow_eye");
      var hide_eye = document.getElementById("resetoldhide_eye");
      hide_eye.classList.remove("d-none");
      if (x.type === "password") {
        x.type = "text";
        show_eye.style.display = "none";
        hide_eye.style.display = "block";
      } else {
        x.type = "password";
        show_eye.style.display = "block";
        hide_eye.style.display = "none";
      }
    
    }
    $scope.reset_password_show_hide = function () {
        var x = document.getElementById("newPW");
        var show_eye = document.getElementById("show_eye2");
        var hide_eye = document.getElementById("hide_eye2");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
            x.type = "text";
            show_eye.style.display = "none";
            hide_eye.style.display = "block";
        } else {
            x.type = "password";
            show_eye.style.display = "block";
            hide_eye.style.display = "none";
        }

    }
    
    $scope.reset_password_show_hides = function () {
        var x = document.getElementById("confirmPW");
        var show_eye = document.getElementById("show_eyes1");
        var hide_eye = document.getElementById("hide_eyes1");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
            x.type = "text";
            show_eye.style.display = "none";
            hide_eye.style.display = "block";
        } else {
            x.type = "password";
            show_eye.style.display = "block";
            hide_eye.style.display = "none";
        }

    }

    $scope.hidePassword = function() {
        $("#password").attr("type", "text")
        if ($("#password").attr("type") == "text") {

            setTimeout(function() {
                $("#password").attr("type", "password")
            }, 100)
        }
    }

    $scope.PasswordFocus = function() {

        $("#password").attr("type", "text")
        if ($("#password").attr("type") == "text") {

            setTimeout(function() {

                $("#password").attr("type", "password")
            }, 100)
        }
    }
   
  
    

    $http.get(  BASEURL + '/rest/v2/users/profile/hideChangePassword').then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
  
        if(data){
          $scope.showhidechangepassword=data['HideChangePassword']
        }

    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

    });


});
