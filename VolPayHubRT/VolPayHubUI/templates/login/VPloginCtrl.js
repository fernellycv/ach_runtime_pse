angular.module('VolpayApp').controller('loginCtrl', ['$rootScope', '$scope', '$http', '$location', '$state', '$filter', '$translate', 'GlobalService', 'AllPaymentsGlobalData', 'userProfileSave', 'CommonService', 'errorservice', function ($rootScope, $scope, $http, $location, $state, $filter, $translate, GlobalService, AllPaymentsGlobalData, CommonService, errorservice, userProfileSave) {

    delete sessionStorage.menuSelection;
    $rootScope.dataModified = false;

    var getAddon = function (path) {
        return $.ajax({
            url: path,
            async: false,
            cache: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }

    function appendAddon(data1) {
        var addon1 = [];
        var addon = getAddon('plug-ins/addon.json');
        if (addon.length > 0) {
            var addon1 = data1.concat(addon);
        } else {
            addon1 = data1;
        }
        return addon1;
    }

    function appendNewModule(data1) {

        $scope.dupIndex = '';
        var addon1 = [];
        var addon = getAddon('plug-ins/modules.json');

        if (addon.length > 0) {
            for (k in data1) {
                for (i in addon) {
                    if ((addon[i].ParentName == data1[k].ParentName) && (!addon[i].ExternalMenu)) {
                        $scope.dupIndex = i;

                        for (j in addon[i].subMenu) {
                            data1[k].subMenu.push(addon[i].subMenu[j])
                        }

                        if ($scope.dupIndex != '') {
                            addon.splice($scope.dupIndex, 1)
                        }
                    }
                    addon1 = data1.concat(addon);
                }
            }
        } else {
            addon1 = data1;
        }

        return addon1;
    }

    function externalLink(sVal) {
        var extLink = getAddon('plug-ins/externallinks.json');
        sVal.push(extLink)
        return sVal;
    }

    $('.nvtooltip').css('opacity', 0);
    $('.select2-container').removeClass('select2-container--open')

    $('body').css('background-color', 'transparent')
    $('html').css({
        "background": "url(themes/" + configData.ThemeName + "/bg.jpg) no-repeat center center fixed",
        "background-size": "cover"
    })

    $('.nvtooltip').css({
        'display': 'none'
    });

    setTimeout(function () {
        $('.fixedfooter,.main-footer').css({
            'background-color': '#364150',
            'margin-left': '0'
        })
        // $('.footertext1').css('left', '20px');
    }, 200)

    $(".toggle-password").click(function () {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    var userData = uProfileData;
    userData.genSetting.languageSelected = 'es_ES'
    if (multilingualSearchData && multilingualSearchData.multilingualenable) {
        $scope.multilingualData = multilingualSearchData;
        for (i in $scope.multilingualData.supported_languages) {
            if ($scope.multilingualData.supported_languages[i].default === true) {
                $scope.userselected = $scope.multilingualData.supported_languages[i].lang;
                userData.genSetting.languageSelected = $scope.userselected;
                userProfileSave.languageSelected = $scope.userselected;
                $scope.selectedLang = $scope.userselected;
                $translate.use($scope.userselected);
            }
        }
    } else {
        if (userData.genSetting.languageSelected == 'es_ES') {
            userData.genSetting.languageSelected = 'es_ES'
            userProfileSave.languageSelected = 'es_ES';
            $scope.selectedLang = 'es_ES';
            $translate.use('es_ES');
        }
    }

    $scope.onChangeDataSelect = function (data) {
        $scope.selectedLang = $scope.userselected = data;
        userData.genSetting.languageSelected = $scope.userselected;
        userProfileSave.languageSelected = $scope.userselected;
        data ? $translate.use(data) : $translate.use(userData.genSetting.languageSelected);
    }

    $scope.pwCancel = function () {
        $scope.alerts = [];
        $scope.fgpassword['OTP'] = ''
        $scope.loginscreen = true
        $scope.otpscreen = false
        $('.top-menu').css('display', 'block')
        GlobalService.logoutMessage = false;
        $rootScope.logOutMsg = '';
        $location.path("login");
    }

    $scope.Otplogin = function (otppassword) {
        sessionStorage.ACHIND = btoa(btoa(otppassword.OTP));

        $http.post(BASEURL + '/rest/v2/ach-ef/users/otp/verify', otppassword).then(function onSuccess(response) {

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }];
            $scope.loginSuccess($rootScope.logincredential)

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

    $scope.loginSuccess = function (loginData) {

        headers = {
            "languageSelected": $scope.selectedLang,
            "userLogin": sessionStorage.selecteduser,
            "ACHIND": sessionStorage.ACHIND
        }

        var loginObj = {};
        loginObj = (JSON.stringify(loginData));

        $http.post(BASEURL + RESTCALL.LoginREST, loginObj, { headers: headers }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            sessionStorage.createUserLoginName = loginData.UserId;
            sessionStorage.UserID = loginData.UserId;
            sessionStorage.SessionToken = data.SessionToken;
            sessionStorage.IsProfileSetup = data.IsProfileSetup;
            uiConfiguration();
            sessionStorage.forSLSK = "SECRET" + rand(11111, 55555);
            sessionStorage.forSL = JSON.stringify(encrypt(JSON.stringify(loginObj), sessionStorage.forSLSK));

            $scope.aa = {
                "Queryfield": [{
                    "ColumnName": "UserID",
                    "ColumnOperation": "=",
                    "ColumnValue": sessionStorage.UserID
                }],
                "Operator": "AND"
            }

            $scope.aa = constructQuery($scope.aa);

            if ('ForceResetFlag' in data.UserInfo && ((data.UserInfo.ForceResetFlag != true) || (data.UserInfo.ForceResetFlag != 'true'))) {
                function callUserProfile() {
                    $http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        if (!data.length) {
                            userData = uProfileData;
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

                                callUserProfile()
                            }).catch(function onError(response) {
                                // Handle error
                                var data = response.data;
                                var status = response.status;
                                var statusText = response.statusText;
                                var headers = response.headers;
                                var config = response.config;

                                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                            });
                            //$translate.use('en_US');
                            //checkLogin(userData)

                        } else {
                            $scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))
                            userData = $scope.uData;
                            //multilaingual
                            if (multilingualSearchData && multilingualSearchData.multilingualenable) {
                                userData.genSetting.languageSelected = userProfileSave.languageSelected;
                                $scope.selectedLang = userData.genSetting.languageSelected;
                            } else {
                                userData.genSetting.languageSelected = userData.genSetting.languageSelected ? userData.genSetting.languageSelected : userProfileSave.languageSelected;
                                $scope.selectedLang = userData.genSetting.languageSelected;
                            }
                            //multilaingual

                            sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;

                            if ($scope.uData.genSetting.languageSelected) {
                                $scope.uData.genSetting.languageSelected = $scope.selectedLang;
                                sessionStorage.sessionlang = $scope.selectedLang;
                                $translate.use($scope.selectedLang);
                            } else {
                                $scope.uData.genSetting.languageSelected = $scope.selectedLang;
                                sessionStorage.sessionlang = $scope.selectedLang;
                                $translate.use("es_ES");
                            }
                            checkLogin($scope.uData)
                        }
                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        userData = uProfileData;
                        checkLogin(userData)
                        $translate.use("es_ES");
                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    });
                }
                callUserProfile()
            } else {
                userData = uProfileData;
                checkLogin(userData)
                $translate.use("es_ES");
            }

            function checkLogin(inData) {
                $('#themeColor').attr("href", "themes/styles/" + inData.genSetting.themeSelected + ".css");

                if ((sessionStorage.IsProfileSetup == true) || (sessionStorage.IsProfileSetup == 'true')) {
                    sessionStorage.showMoreFieldOnCreateUser = false;
                    GlobalService.pwRest = true;
                    sessionStorage.pwRest = GlobalService.pwRest;

                    sessionStorage.Name = "Default";
                    $location.path('app/adduser');
                } else {
                    sessionStorage.UserID = data.UserInfo.UserID;
                    GlobalService.pwRest = data.UserInfo.ForceResetFlag;
                    sessionStorage.pwRest = GlobalService.pwRest;

                    if (GlobalService.pwRest) {
                        sessionStorage.showMoreFieldOnCreateUser = false;
                        $location.path('app/myprofile');
                    } else {
                        $rootScope.NotifLoaded = false;
                        CommonService.alertLoadCnt = 0;

                        sessionStorage.ROLE_ID = data.UserInfo.RoleID;
                        sessionStorage.showMoreFieldOnCreateUser = true;

                        /** Menulist REST Call **/

                        $scope.sidebarArr = [];
                        // 'config/sidebarVal.json'
                        $http.get(CONFIG_JSON.sidebarVal).then(function onSuccess(response) {
                            // Handle success
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            var sidebarObj = {};
                            sidebarObj.RoleId = sessionStorage.ROLE_ID;
                            sidebarObj.menu = appendAddon(data);

                            $http.post(BASEURL + RESTCALL.sideBarValues, sidebarObj).then(function onSuccess(response) {
                                // Handle success
                                var data = response.data;
                                var status = response.status;
                                var statusText = response.statusText;
                                var headers = response.headers;
                                var config = response.config;

                                $scope.landData = angular.copy(data)
                                $scope.sidebarVal = appendNewModule(data)
                                sessionStorage.menuList = JSON.stringify(data);
                                $scope.sidebarVal = externalLink($scope.sidebarVal)
                                GlobalService.sidebarVal = $scope.sidebarVal;

                                $scope.refArr = ["webformPlugin"];
                                $scope.landingMod = [];
                                $scope.lArr = [];

                                for (var i in $scope.landData) {
                                    if ($scope.refArr.indexOf($scope.landData[i].Link) == -1) {
                                        for (var j in $scope.landData[i].subMenu) {
                                            if ($scope.landData[i].Link == 'bankData') {
                                                if (($scope.landData[i].subMenu[j].Link == 'configurations' || $scope.landData[i].subMenu[j].Link == 'idconfigurations')) {

                                                    $scope.landingMod.push({
                                                        name: $scope.landData[i].subMenu[j].Name,
                                                        state: $scope.landData[i].subMenu[j].Link,
                                                        static: true,
                                                        stateParams: {}
                                                    })

                                                    $scope.lArr.push($scope.landData[i].subMenu[j].Link)
                                                }
                                            } else {
                                                $scope.landingMod.push({
                                                    name: $scope.landData[i].subMenu[j].Name,
                                                    state: $scope.landData[i].subMenu[j].Link,
                                                    static: true,
                                                    stateParams: {}
                                                })

                                                $scope.lArr.push($scope.landData[i].subMenu[j].Link)
                                            }
                                        }
                                    }
                                }

                                /** If MyProfileSetting keys is not present in the bank's user profile data **/
                                if ((inData.myProfileSetting != undefined)) {
                                    userData.myProfileSetting.landingPagesArr = [];
                                    userData.myProfileSetting.landingPagesArr = $scope.landingMod;

                                    if ((Object.keys(inData.myProfileSetting).indexOf('nlanding') == -1)) {
                                        userData.myProfileSetting.nlanding = {};
                                        userData.myProfileSetting.nlanding.name = '';
                                        userData.myProfileSetting.nlanding.stateParams = {};

                                        var interval = "";
                                        clearInterval(interval)
                                        interval = setInterval(function () {
                                            if (sessionStorage.UserProfileDataPK != undefined) {
                                                updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))), $http).then(function (response) {
                                                    sessionStorage.selectedMenu = $scope.landingMod[0].state;
                                                    $state.go('app.' + sessionStorage.selectedMenu, {});
                                                })
                                                clearInterval(interval)
                                            }
                                        }, 100)
                                    } else {
                                        //var interval = "";
                                        updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))), $http).then(function (response) {

                                            $scope.sObj = {
                                                'name': $scope.landingMod[0].state,
                                                "stateParams": {}
                                            }

                                            if ($scope.lArr.indexOf(inData.myProfileSetting.nlanding.name) != -1) {

                                                sessionStorage.selectedMenu = inData.myProfileSetting.nlanding.name;
                                                updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))), $http).then(function (response) {

                                                });
                                                findLandingModule(inData.myProfileSetting.nlanding, $state)
                                            } else {

                                                userData.myProfileSetting.nlanding = {};
                                                userData.myProfileSetting.nlanding.name = $scope.sObj.name
                                                userData.myProfileSetting.nlanding.stateParams = $scope.sObj.stateParams;

                                                sessionStorage.selectedMenu = $scope.sObj.name;

                                                updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))), $http).then(function (response) {
                                                    findLandingModule($scope.sObj, $state)
                                                });
                                            }
                                        })
                                    }
                                } else {
                                    userData.myProfileSetting = {};
                                    userData.myProfileSetting.nlanding = {}
                                    userData.myProfileSetting.nlanding.name = $scope.landingMod[2].state ? $scope.landingMod[2].state : $scope.landingMod[0].state;
                                    userData.myProfileSetting.nlanding.stateParams = {};

                                    userData.myProfileSetting.landingPagesArr = [];
                                    userData.myProfileSetting.landingPagesArr = $scope.landingMod;

                                    var interval = "";
                                    clearInterval(interval)
                                    interval = setInterval(function () {
                                        if (sessionStorage.UserProfileDataPK != undefined) {
                                            updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))), $http).then(function (response) {
                                                $state.go('app.' + $scope.landingMod[2].state ? $scope.landingMod[2].state : $scope.landingMod[0].state, {});
                                            })
                                            clearInterval(interval)
                                        }

                                    }, 100)
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
                                }]

                                userData = uProfileData;
                                checkLogin(userData)
                                $translate.use("es_ES");
                                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                            });
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
                }
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

        setTimeout(function () {
            $('.logindata').attr('autocomplete', 'off');
        }, 0)
    }

    $scope.fgpassword = {}
    $scope.loginscreen = true
    $scope.otpscreen = false
    $scope.login = function (loginData, lang) {
        headers = {
            "languageSelected": $scope.selectedLang,
            "userLogin": sessionStorage.selecteduser
        }

        var loginObj = {};
        loginObj = (JSON.stringify(loginData));

        $rootScope.logincredential = loginData
        $http.post(BASEURL + '/rest/v2/ach-ef/users/login', loginObj, { headers: headers }).then(function onSuccess(response) {

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            if ((data['SessionToken'] == '') || ((Object.keys(data).indexOf('SessionToken') != -1) == false)) {
                $scope.fgpassword['UserID'] = loginData['UserId']

                $scope.loginscreen = false
                $scope.otpscreen = true
                $scope.alerts = ''

            } else {
                $scope.loginSuccess(loginData)
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

    /*if($rootScope.profileUpdated)
    {
        $scope.alerts = [{
            type : 'success',
            msg : $rootScope.profileUpdated
        }]
    }

    if (GlobalService.passwordChanged) {
    	
        $scope.alerts = [{
                type : 'success',
                msg : GlobalService.responseMessage
            }
        ];
        GlobalService.passwordChanged = false;

    } else {
        GlobalService.responseMessage = "";

    }*/

    /*if (GlobalService.userCreated) {
        $scope.alerts = [{
                type : 'success',
                msg : 'User created successfully.'
            }
        ];
        GlobalService.userCreated = false;
    }*/

    if ($rootScope.logOutMsg) {
        GlobalAllPaymentReset(GlobalService, AllPaymentsGlobalData)
    }

    /*if (GlobalService.logoutMessage) {

        $scope.alerts = [{
                type : 'success',
                msg : (localStorage.logOutMsg)?localStorage.logOutMsg:'User session terminated successfully.'
            }
        ];

        GlobalService.logoutMessage = false;
    }*/

    $scope.multipleEmptySpace = function (e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('')
        }
    }

    if ($rootScope.alerts && $rootScope.alerts.length) {
        $scope.alerts = angular.copy($rootScope.alerts);

        //$timeout(function(){
        $rootScope.alerts = [];
        //},4000)
    }

    $rootScope.alerts = [];
    setTimeout(function () {
        $scope.PassClick = function (ev) {
            $("#password").attr("type", "text");
            if ($("#password").attr("type") == "text") {
                var passType = $("#password").attr("type", "password");
            }
        }
    }, 0);

    $(".passField").focus(function () {
        $("#password").attr("type", "text");
        if ($("#password").attr("type") == "text") {
            var passType = $("#password").attr("type", "password");
        }
    });

}]);