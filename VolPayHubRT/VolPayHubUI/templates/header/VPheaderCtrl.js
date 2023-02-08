angular.module('VolpayApp').controller('headerCtrl', function ($http, $state, $scope, $location, $translate, $timeout, GlobalService, AllPaymentsGlobalData, AdminService, LogoutService, CommonService, $rootScope, $filter, errorservice, userProfileSave) {
    //$scope.showSmallLogo = false;

    if (sessionStorage.modeAuth) {
        configData['Authorization'] = sessionStorage.modeAuth;
    }

    $scope.$on('langChangeEvent2Header', function () {
        if (multilingualSearchData && multilingualSearchData.multilingualenable) {
            $scope.userselected = sessionStorage.sessionlang;
            document.getElementById("multilingual").value = sessionStorage.sessionlang;
            $translate.use($scope.userselected);
        }
    });

    $scope.$watch('userselected', function (newValue, oldValue) {
        let changedLanguage = newValue ? newValue : uProfileData.genSetting.languageSelected;
        $translate.use(changedLanguage);
    });

    $http.get(BASEURL + '/rest/v2/notifications/getbroadcast').then(function onSuccess(response) {
        if (response.data.length == 0) {
            $("#carouselExampleControls").css("display", "none");
        } else {
            $scope.carouselData = response.data;
        }
    }).catch(function onError(response) {
        // console.log("Err in broadcast: ");
    });

    $scope.$on('langChangeEvent', function () {
        if (multilingualSearchData && multilingualSearchData.multilingualenable) {
            $('.lang').attr('checked', false)
            sessionStorage.sessionlang = sessionStorage.sessionlang
            if (sessionStorage.sessionlang == 'en_US') {
                $('#lang_1').prop('checked', true)
            } else if (sessionStorage.sessionlang == 'es_ES') {
                $('#lang_2').prop('checked', true)
            } else {
                $('#lang_1').prop('checked', true)
            }
        }
    });
    $scope.names = ["Emil", "Tobias", "Linus"];
    $scope.RoleList = [];

    var getAddon = function (path) {
        return $.ajax({
            url: path,
            async: false,
            cache: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }

    $(function () {
        $('.slimScrollDiv').css({
            'height': 'auto'
        });
    });

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

    //	var userData = uProfileData;

    $timeout(function () {
        $scope.accessUserName = sessionStorage.UserID;
    }, 2000)

    function checkCustomDashboard(val) {

        if (val.defaultdashboard.defDashboard.trim() == 'dashboardFile') {
            $state.go('app.filesummary', {});
            $timeout(function () {
                sidebarMenuControl('PaymentModule', 'DashboardFile')
            }, 500)
        } else if (val.defaultdashboard.defDashboard.trim() == 'dashboardPayments') {
            $state.go('app.paymentsummary', {})
            $timeout(function () {
                sidebarMenuControl('PaymentModule', 'DashboardPayments')
            }, 500)
        } else if (val.defaultdashboard.defDashboard.trim() == 'myDashboard') {
            var sparams = {};
            sparams.input = {
                url: 'mydashboard',
                tempUrl: 'plug-ins/modules/mydashboard',
                contrl: 'mydashboardCtrl'
            }
            sparams.newUrl = sparams.input.url;
            $state.go('app.newmodules', sparams);

            $timeout(function () {
                sidebarMenuControl('Home', 'MyDashboard')
            }, 500)
        }

    }
    //$rootScope.headerLogo = false;

    $scope.sideBar = function (value) {
        if ($(window).width() <= 767) {
            if ($("body").hasClass('sidebar-open')) {
                //$('.main-sidebar').css({'min-height':'50%'})
                $("body").removeClass('sidebar-open');
                $scope.sidebarToggleTooltip = "Show Menu";
                //$rootScope.headerLogo = false;
            } else {

                //$('.main-sidebar').css({'min-height':'50%'})
                $("body").addClass('sidebar-open');
                $scope.sidebarToggleTooltip = "Hide Menu";
                //$rootScope.headerLogo = false;
            }
        }
    };

    if ($("body").hasClass('sidebar-open')) {
        $scope.sidebarToggleTooltip = "Hide Menu"
    } else {
        $scope.sidebarToggleTooltip = "Show Menu"
    }

    $scope.goTo = function (clickedId, eve, Id) {
        GlobalService.AandN.AlertId = clickedId;
        if ($(eve.currentTarget).parent().hasClass('notVisited')) {
            GlobalService.AandN.NotifData.NotifyContent[Id]['status'] = false
            //$scope.NotifCount = $scope.NotifCount - 1;
            $scope.NotifCount = $scope.NotifCount - 1;
            GlobalService.AandN.NotifCount = $scope.NotifCount;
            $(eve.currentTarget).parent().removeClass('notVisited')
        }
        if ($location.path() != "/app/AlertsandNotification") {
            $location.path("app/AlertsandNotification")
        } else {
            GlobalService.AandN.functions.anchorSmoothScroll(clickedId);
        }
    }

    $scope.alertLoadCnt = CommonService.alertLoadCnt;
    CommonService.alertLoadCnt = 1;

    $scope.highlightUserRole = function () {
        for (var i in $scope.RoleList) {

            if ($scope.RoleList[i].actualvalue == sessionStorage.ROLE_ID) {
                $scope.Role_ID = $filter('specialCharactersRemove')($filter('removeSpace')(sessionStorage.ROLE_ID))
                var int = '';
                int = setInterval(function () {

                    if ($('#' + $scope.Role_ID).hasClass('listSelected')) {
                        clearInterval(int)
                    }

                    $('#' + $scope.Role_ID).addClass('listSelected').css({
                        'pointer-events': 'none'
                    })

                }, 500)
                break;
            } else { }
        }
    }

    $scope.alertFn = function () {

        if ($location.path() != '/forgotpassword') {
            if ($rootScope.NotifLoaded != true && $scope.alertLoadCnt == 0) {

                // $http({
                //     url: BASEURL + RESTCALL.AlertandNotific + 'view',
                //     method: "POST",
                //     data: {
                //         UserId: sessionStorage.UserID
                //     },
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // }).then(function onSuccess(response) {
                //     // Handle success
                //     var data = response.data;
                //     var status = response.status;
                //     var statusText = response.statusText;
                //     var headers = response.headers;
                //     var config = response.config;

                //     CommonService.alertLoadCnt = 1;
                //     $scope.prev = true;
                //     $rootScope.NotifLoaded = true;
                //     GlobalService.AandN.NotifData = data;
                //     for (var k in GlobalService.AandN.NotifData.NotifyContent) {
                //         GlobalService.AandN.NotifData.NotifyContent[k]['status'] = true;
                //     }
                //     $scope.Notifi = GlobalService.AandN.NotifData;
                //     //$scope.NotifCount = GlobalService.AandN.NotifData.notificationCount;
                //     $scope.NotifCount = GlobalService.AandN.NotifData.notificationCount;

                //     $rootScope.totAlertCnt = GlobalService.AandN.NotifData.notificationCount;
                // }).catch(function onError(response) {
                //     // Handle error
                //     var data = response.data;
                //     var status = response.status;
                //     var statusText = response.statusText;
                //     var headers = response.headers;
                //     var config = response.config;
                //     $scope.alerts = [{
                //         type: 'danger',
                //         msg: data.error.message
                //     }];
                //     errorservice.ErrorMsgFunction(config, $scope, $http, status)
                // });

                $http.get(BASEURL + '/rest/v2/userrole/readall').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.RoleList = data;
                    $rootScope.RoleList = data;
                    $scope.highlightUserRole();
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            } else {
                $scope.Notifi = GlobalService.AandN.NotifData;
                $scope.NotifCount = GlobalService.AandN.NotifData.notificationCount;
                $http.get(BASEURL + '/rest/v2/userrole/readall').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.RoleList = data;
                    $scope.highlightUserRole();

                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                });
            }
        }
    }

    $scope.alertFn();

    $rootScope.$on("CallParentMethod", function () {
        $scope.alertFn();
    });

    $scope.MultiLanguage = sessionStorage.MultiLanguage;

    /*if(localStorage.themeSelected){
    $('#themeColor').attr("href", "themes/styles/"+localStorage.themeSelected+".css");
    }
    else{
    $('#themeColor').attr("href", "themes/styles/default.css");
    }*/
    var d1 = new Date(),
        d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes());
    var currentTime123 = d2;

    $scope.accessUserName = sessionStorage.UserID;

    $scope.logout = function () {
        GlobalAllPaymentReset(GlobalService, AllPaymentsGlobalData) // For resetting the FileList/App Payments Data
        LogoutService.Logout()
    }

    $('.scrollUser2').find('li').find('a').each(function () {
        $scope.scroll = $(this).attr('id');
        if (sessionStorage.ROLE_ID == $scope.scroll) {
            $(event.currentTarget).css('pointer-events', 'none');
        } else {
            $(event.currentTarget).css('pointer-events', 'default');
        }
    });

    $scope.switchRole = function (RoleID, index, event) {
        var loginObj = {};
        loginObj.RoleID = RoleID;

        $http.post(BASEURL + '/rest/v2/userrole/switch', loginObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.NotifLoaded = false;
            $scope.alertLoadCnt == 0;

            sessionStorage.createUserLoginName = data.UserInfo.UserID;
            sessionStorage.UserID = data.UserInfo.UserID;
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
                            });
                            //$translate.use('en_US');
                            //checkLogin(userData)
                        } else {

                            $scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))

                            userData = $scope.uData;
                            sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;

                            if ($scope.uData.genSetting.languageSelected) {
                                $translate.use($scope.uData.genSetting.languageSelected);
                            } else {
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
                callUserProfile();
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

                                $rootScope.$emit("CallParentMethod", {});

                                $scope.refArr = ["bankData", "webformPlugin"];
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
                                                    });

                                                    $scope.lArr.push($scope.landData[i].subMenu[j].Link)
                                                }
                                            } else {
                                                $scope.landingMod.push({
                                                    name: $scope.landData[i].subMenu[j].Name,
                                                    state: $scope.landData[i].subMenu[j].Link,
                                                    static: true,
                                                    stateParams: {}
                                                });

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
                                        updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))), $http).then(function (response) {

                                            $scope.sObj = {
                                                'name': $scope.landingMod[0].state,
                                                "stateParams": {}
                                            }

                                            if ($scope.lArr.indexOf(inData.myProfileSetting.nlanding.name) != -1) {
                                                sessionStorage.selectedMenu = inData.myProfileSetting.nlanding.name;
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
                                $state.reload();
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
                                userData = uProfileData;
                                checkLogin(userData)
                                $translate.use("es_ES");
                            });
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
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            //$rootScope.switchUserMsg = data.error.message;
            $rootScope.$emit("switchUserError", {
                'msg': data.error.message
            });

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
        });
    }
    if (multilingualSearchData && multilingualSearchData.multilingualenable) {
        $scope.multilingualData = multilingualSearchData;
        for (i in $scope.multilingualData.supported_languages) {
            if ($scope.multilingualData.supported_languages[i].default === true) {
                $scope.userselected = $scope.multilingualData.supported_languages[i].lang;
                userData.genSetting.languageSelected = $scope.userselected;
                userProfileSave.languageSelected = $scope.userselected;
                $scope.userselected = sessionStorage.sessionlang;
                $translate.use($scope.userselected);
            }
        }
    }

    $scope.onChangeDataSelect = function (data) {
        userData.genSetting.languageSelected = $scope.userselected;
        userProfileSave.languageSelected = $scope.userselected;
        $scope.userselected = sessionStorage.sessionlang = data;
        data ? $translate.use(data) : $translate.use(userData.genSetting.languageSelected);
        document.getElementById("multilingual").value = $scope.userselected;
        $scope.$emit('langChangeEvent');
    }

    $scope.$on('langChangeEventRefresh', function () {
        $scope.userselected = sessionStorage.sessionlang;
        $translate.use(sessionStorage.sessionlang);
    });

});
