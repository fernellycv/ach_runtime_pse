angular.module('VolpayApp').controller('dashboardController', function ($scope, $http, $filter, $timeout, $state, $translate, $location, $window, PersonService1, AllPaymentsGlobalData, GlobalService, LogoutService, DashboardService, $rootScope, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("All Payments Dashboard");
    $scope.Colors = ["#578ebe", "#e35b5a", "#8775a7", "#6D9B5B", "#ab7019", "#777", "#ff9933", "#ff0066", "#a24e4e", "#607D8B", "#d4638a", "#5d5d96", '#FA58F4', '#0174DF', '#FE642E', '#DF0101', '#64FE2E', '#8A0868', '#585858', '#4C0B5F', '#B18904', '#8A2908', '#F781BE', '#A9F5E1'];

    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks();

    if (configData.Authorization == "Internal") {
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
            userData = JSON.parse($filter('hex2a')(data[0].ProfileData))
            console.log(userData);

            sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            userData = uProfileData;
            errorservice.ErrorMsgFunction(config, $scope, $http, status)

        });

    }
    clearInterval(menuInterval)

    sessionStorage.menuSelection = JSON.stringify({
        'val': 'PaymentModule',
        'subVal': 'PaymentsDashboard'
    })
    checkMenuOpen()

    var checkstatusBarVal = function () {
        $scope.instructionBarVal = [{
            "Status": "ACQUIRED",
            "NavStatus": "ACQUIRED",
            "Icon": "fa fa-handshake-o",
            "Color": "#ffff",
            "Visibility": "",
            "searchArr": ["ACQUIRE"],
            "Count": 0,
            "ColorText": "#065489",
        }, {
            "Status": "WAITING FILE APPROVAL",
            "NavStatus": "WAITFORAPPROVAL",
            "Icon": "fa fa-clock-o",
            "Color": "#13A6e8",
            "Visibility": "",
            "searchArr": ["WAITFORAPPROVAL"],
            "Count": 0,
            "ColorText": "#ffff",
        }, {
            "Status": "DEBULKED",
            "NavStatus": "DEBULKED",
            "Icon": "fa fa-thumbs-o-up",
            "Color": "#1081c1",
            "Visibility": "",
            "searchArr": ["DEBULKED"],
            "Count": 0,
            "ColorText": "#ffff",
        }, {
            "Status": "COMPLETED",
            "NavStatus": "COMPLETED",
            "Icon": "fa fa-check-circle-o",
            "Color": "#065489",
            "Visibility": "",
            "searchArr": ["COMPLETED"],
            "Count": 0,
            "ColorText": "#ffff",
        }]

        $scope.paymentBarVal = [{
            "Status": "DEBULKED",
            "NavStatus": "DEBULKED",
            "Icon": "fa fa-handshake-o",
            "Color": "#ffff",
            "Visibility": "",
            "searchArr": ["DEBULKED"],
            "Count": 0,
            "ColorText": "#065489"
        }, {
            "Status": "WAITING DISTRIBUTION",
            "NavStatus": "WAITING_DISTRIBUTION",
            "Icon": "fa fa-clock-o",
            "Color": "#13A6e8",
            "Visibility": "",
            "searchArr": ["WAITING_DISTRIBUTION"],
            "Count": 0,
            "ColorText": "#ffff"
        }, {
            "Status": "ACCEPTED",
            "NavStatus": "ACCEPTED",
            "Icon": "fa fa-thumbs-o-up",
            "Color": "#1081c1",
            "Visibility": "",
            "searchArr": ["ACCEPTED"],
            "Count": 0,
            "ColorText": "#ffff"
        }, {
            "Status": "SETTLED",
            "NavStatus": "SETTLED",
            "Icon": "fa fa-check-circle-o",
            "Color": "#065489",
            "Visibility": "",
            "searchArr": ["SETTLED"],
            "Count": 0,
            "ColorText": "#ffff"
        }]
        // TODO: Need to adapt
        // for (var i in userData.DboardPreferences.paymentDashboard.instructionSummary) {
        //     for (var j in $scope.instructionBarVal) {
        //         if (userData.DboardPreferences.paymentDashboard.instructionSummary[i].name == $scope.instructionBarVal[j].NavStatus) {
        //             $scope.instructionBarVal[j].Visibility = userData.DboardPreferences.paymentDashboard.instructionSummary[i].visibility;
        //         }
        //     }
        // }
        // for (var i in userData.DboardPreferences.paymentDashboard.paymentsSummary) {
        //     for (var j in $scope.paymentBarVal) {
        //         if (userData.DboardPreferences.paymentDashboard.paymentsSummary[i].name == $scope.paymentBarVal[j].NavStatus) {
        //             $scope.paymentBarVal[j].Visibility = userData.DboardPreferences.paymentDashboard.paymentsSummary[i].visibility;
        //         }
        //     }
        // }

        // for (var i in userData.DboardPreferences.paymentDashboard.instructionSummary) {
        //     if (userData.DboardPreferences.paymentDashboard.instructionSummary[i].visibility) {
        //         $scope.count = userData.DboardPreferences.paymentDashboard.instructionSummary.filter(function(x) {
        //             return x.visibility;
        //         }).length;
        //     }
        // }

        for (var j in $scope.instructionBarVal) {
            $scope.instructionBarVal[j].Visibility = true;
        }
        for (var j in $scope.paymentBarVal) {
            $scope.paymentBarVal[j].Visibility = true;
        }
        for (var i in $scope.instructionBarVal) {
            if ($scope.instructionBarVal[i].Visibility) {
                $scope.count = $scope.instructionBarVal.filter(function (x) {
                    return x.Visibility;
                }).length;
            }
        }

    }

    checkstatusBarVal()

    // function enableDisableChart() {

    //     if (!$scope.uSetting.CurDis) // If CurDuis hidden
    //     {
    //         setTimeout(function() {

    //             $('#MOPDist').removeAttr('class').addClass('col-md-8 droppable');
    //             $('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
    //         }, 100)
    //     }
    //     if ((!$scope.uSetting.InbndPayment) && (!$scope.uSetting.CurDis)) // If CurDuis hidden & InbndPayment hidden
    //     {
    //         setTimeout(function() {

    //             $('#MOPDist').removeAttr('class').addClass('col-md-6 droppable');
    //             $('#paymentStatusDist').removeAttr('class').addClass('col-md-6 droppable');
    //         }, 100)
    //     }
    //     if ((!$scope.uSetting.CurDis) && (!$scope.uSetting.Mop)) // If CurDuis hidden & MOP hidden
    //     {

    //         setTimeout(function() {

    //             $('#paymentStatusDist').removeAttr('class').addClass('col-md-8 droppable');
    //         }, 150)
    //     }
    //     if ((!$scope.uSetting.CurDis) && (!$scope.uSetting.Mop) && (!$scope.uSetting.InbndPayment)) // If CurDuis & Inbound & MOP hidden
    //     {
    //         setTimeout(function() {

    //             $('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
    //         }, 150)

    //     }
    //     if ((!$scope.uSetting.CurDis) && (!$scope.uSetting.Status) && (!$scope.uSetting.InbndPayment)) // If CurDuis & Inbound & status hidden
    //     {
    //         setTimeout(function() {

    //             $('#MOPDist').removeAttr('class').addClass('col-md-12 droppable');
    //         }, 150)

    //     }
    //     if (!$scope.uSetting.InbndPayment) // If inboundPayment hidden
    //     {
    //         setTimeout(function() {

    //             $('#pymtCurDisChart').removeAttr('class').addClass('col-md-12 droppable');
    //         }, 100)
    //     }
    //     if (!$scope.uSetting.Mop) // If MOP hidden
    //     {
    //         setTimeout(function() {

    //             $('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
    //         }, 100)
    //     }
    // }

    // function outputForSankey(data, name) {
    //     var curDisTot = 0,
    //         curDisAmt = 0;
    //     for (var i in data) {
    //         curDisTot = curDisTot + data[i].Count;
    //         curDisAmt = curDisAmt + data[i].Amount;
    //     }

    //     if (name == 'curDis') {
    //         data.push({
    //             'Name': 'Total',
    //             'Currency': '',
    //             'Count': curDisTot,
    //             'Amount': curDisAmt
    //         })
    //         $scope.curDisData = data;
    //     } else if (name == 'srcChannel') {
    //         data.push({
    //             'Name': 'Total',
    //             'Currency': '',
    //             'Count': curDisTot,
    //             'Amount': curDisAmt
    //         })
    //         $scope.srcChannelData = data;
    //     } else if (name == 'mop') {
    //         data.push({
    //             'Name': 'Total',
    //             'Currency': '',
    //             'Count': curDisTot,
    //             'Amount': curDisAmt
    //         })
    //         $scope.mopData = data;
    //     } else if (name == 'status') {
    //         data.push({
    //             'Name': 'Total',
    //             'Currency': '',
    //             'Count': curDisTot,
    //             'Amount': curDisAmt
    //         })
    //         $scope.payStatData = data;
    //     }
    // }

    $scope.accessToken = true;

    $scope.initialCall = function () {

        checkstatusBarVal()

        function getBanks() {
            $http.get(BASEURL + RESTCALL.DashboardBanks).then((res) => {
                var data = res.data;
                $scope.parties = data;
            }).catch((err) => {
                var data = err.data;
                var status = err.status;
                var statusText = err.statusText;
                var headers = err.headers;
                var config = err.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
            })
        }

        function getCycles() {
            $http.get(BASEURL + RESTCALL.DashboardCycles).then((res) => {
                var data = res.data
                var status = res.status
                var config = res.config
                //TODO : if not cycle throw error
                if (data.length == 0) {
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    $scope.alerts = [{
                        type: 'danger',
                        msg: $filter('translate')("PaymentsDashboard.ERRCYCLENOTFOUND")
                    }]
                }
                $scope.testt = data
                $("select[name='CycleId']").select2({
                    data: $scope.testt.map((x) => { return { "id": x.CycleReference, "text": x.CycleReference } })
                })
                $timeout(() => {
                    $("select[name='CycleId']").trigger('change');
                    $("select[name='CycleId']").val($scope.testt[0]['CycleReference']).trigger('change');
                    // $scope.search =data[0]['CycleReference'];
                    $scope.getValues();
                }, 0)
                // $scope.cycles = data.map(x => x.CycleReference);
            });
        }

        if ($scope.banksVisible) {
            getBanks();
        }
        getCycles();
    };

    setTimeout(function () {
        $scope.initialCall();
    }, 200)

    // $scope.reloadPment = function() {
    //     $scope.PayState = true;
    //     attachdandbidLoaded = true;
    //     $scope.initialCall();
    //     $('#rBtn').addClass('pointerNone')
    //     setTimeout(function() {
    //         $('#rBtn').removeClass('pointerNone')
    //     }, 200)
    // }

    $scope.dashboardToAllPayment = function (status) { //TODO: this will not work

        AllPaymentsGlobalData.fromDashboard = true;
        AllPaymentsGlobalData.DataLoadedCount = 20;
        AllPaymentsGlobalData.FLuir = "";
        AllPaymentsGlobalData.SelectSearchVisible = false;
        AllPaymentsGlobalData.advancedSearchEnable = true;
        AllPaymentsGlobalData.all = true;
        AllPaymentsGlobalData.custom = false;
        AllPaymentsGlobalData.endDate = "";
        AllPaymentsGlobalData.isEntered = false;
        AllPaymentsGlobalData.isSortingClicked = false;
        AllPaymentsGlobalData.month = false;
        AllPaymentsGlobalData.monthEnd = "";
        AllPaymentsGlobalData.monthStart = "";
        AllPaymentsGlobalData.myProfileFLindex = "";
        AllPaymentsGlobalData.prev = "all";
        AllPaymentsGlobalData.prevId = 1;
        AllPaymentsGlobalData.prevSelectedTxt = "all";
        AllPaymentsGlobalData.searchClicked = false;
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.searchname = "";
        AllPaymentsGlobalData.selectCriteriaID = 1;
        AllPaymentsGlobalData.selectCriteriaTxt = "All";
        AllPaymentsGlobalData.sortReverse = false;
        AllPaymentsGlobalData.sortType = "Desc";
        AllPaymentsGlobalData.startDate = "";
        AllPaymentsGlobalData.today = false;
        AllPaymentsGlobalData.todayDate = "";
        AllPaymentsGlobalData.uirTxtValue = "";
        AllPaymentsGlobalData.week = false;
        AllPaymentsGlobalData.weekEnd = "";
        AllPaymentsGlobalData.weekStart = "";
        AllPaymentsGlobalData.orderByField = "ReceivedDate";

        AllPaymentsGlobalData.searchParams = {
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
                }
            }
        };

        AllPaymentsGlobalData.searchParams.Status = status;
        AllPaymentsGlobalData.FromDashboardFieldArr = [];

        for (var i in status) {
            AllPaymentsGlobalData.FromDashboardFieldArr.push('Status=' + status[i])
        }
        $location.path('app/allpayments');
    }

    /*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

    $scope.widthOnScroll = function () {
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

    // $timeout(function() {
    //     mediaMatches()
    // }, 200)

    /*** On window resize ***/
    $(window).resize(function () {
        mediaMatches()
        $scope.$apply(function () {
            $scope.alertWidth = $('.alertWidthonResize').width();
        });
    });

    // $('.channelLegendInbnd,.channelLegendCurDis,.channelLegendMOP,.channelLegendStatus').css({
    //     'opacity': 1,
    //     'font-weight': 'normal'
    // })

    $scope.$on('$viewContentLoaded', function () {
        $scope.isvalidMeREST = false;

        if ((document.cookie) && (configData.Authorization == "External") && !sessionStorage.ROLE_ID) {

            $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.isvalidMeREST = true;
                var ExternalUser = data;
                localStorage.ROLE_ID = ExternalUser.RoleID;
                sessionStorage.ROLE_ID = ExternalUser.RoleID;
                sessionStorage.UserID = ExternalUser.UserID;
                localStorage.UserID = data.UserID;

                if (ExternalUser.RoleID == 'Super Admin') {
                    sessionStorage.showMoreFieldOnCreateUser = true;
                } else {
                    sessionStorage.showMoreFieldOnCreateUser = false;
                }

            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                if (status == 403) {
                    $scope.isvalidMeREST = false;
                    $scope.landingMod = [];
                    $scope.lArr = [];
                    sessionStorage.menuList = [];
                    $state.go('app.myprofile');
                } else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                }
            });

            var sessionData = function () {
                return $.ajax({
                    url: BASEURL + '/rest/v2/ui/configuration',
                    cache: false,
                    async: false,
                    type: 'GET',
                    dataType: 'json'
                }).responseJSON;
            }

            var sData = sessionData();
            for (i in sData) {
                if (sData[i].Name.toUpperCase() == 'FILESIZERESTRICTION') {
                    sessionStorage.fileUploadLimit = sData[i].Value;
                } else if (sData[i].Name.toUpperCase() == 'SESSIONTIMEOUT') {
                    sessionStorage.sessionTimeLimit = sData[i].Value;
                }
            }

            $timeout(function () {

                $scope.aa = {
                    "Queryfield": [{
                        "ColumnName": "UserID",
                        "ColumnOperation": "=",
                        "ColumnValue": sessionStorage.UserID
                    }],
                    "Operator": "AND"
                }
                $scope.aa = constructQuery($scope.aa);

                function callUserProfile() {
                    $http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).then(function onSuccess(response) {
                        // Handle success
                        var data1 = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        if (!data1.length) {
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

                        } else {

                            $scope.uData = JSON.parse($filter('hex2a')(data1[0].ProfileData))
                            userData = $scope.uData;
                            sessionStorage.UserProfileDataPK = data1[0].UserProfileData_PK;

                            if ($scope.uData.genSetting.languageSelected) {
                                $translate.use($scope.uData.genSetting.languageSelected);
                            } else {
                                $translate.use("es_ES");
                            }

                            checkLoginforSiteminder($scope.uData)
                        }
                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        userData = uProfileData;

                        checkLoginforSiteminder(userData)
                        $translate.use("es_ES");
                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    });
                }

                if ($scope.isvalidMeREST) {
                    callUserProfile()
                }
            }, 1500)
        }
    });

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

    function checkLoginforSiteminder(inData) {

        $('#themeColor').attr("href", "themes/styles/" + inData.genSetting.themeSelected + ".css");

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

                $rootScope.$emit("CallParentMethod", $scope.sidebarVal);

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
                                clearInterval(interval);
                            }
                        }, 100);

                    } else {

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
                            });
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
                checkLoginforSiteminder(userData)
                $translate.use("es_ES");
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

    // $scope.findCnt = function(cnt) {

    //     var tot = 0;
    //     for (var i in cnt) {
    //         tot = tot + cnt[i].Count
    //     }
    //     return tot;
    // }

    $scope.getColor = function (status) {
        return commonFunctions.selectStatuscolor(status)
    }

    $scope.forplaceholder = function () {
        var name = 'party'
        $timeout(function () {
            $("select[name='" + name + "']").select2({
                placeholder: "Select an option",
                allowClear: true
            });
        }, 100);
    }

    $(document).ready(function () {
        $scope.forplaceholder();
    })

    $scope.reloadPment = function () {
        $scope.getValues();
    }

    $scope.getValues = function () {
        removeEmptyValueKeys($scope.search)
        var payload = Object.assign({}, { 'PartyId': 'Todos' }, $scope.search)
        $http.get(BASEURL + RESTCALL.Dashboard, { 'params': payload }).then((res) => {
            var data = res.data;
            $scope.restVal = []

            $scope.instructionBarVal[0].Count = data.InstructionsAcquired || 0;
            $scope.instructionBarVal[1].Count = data.InstructionsFileApproval || 0;
            $scope.instructionBarVal[2].Count = data.InstructionsDebulked || 0;
            $scope.instructionBarVal[3].Count = data.InstructionsCompleted || 0;

            $scope.paymentBarVal[0].Count = data.PaymentsDebulked || 0
            $scope.paymentBarVal[1].Count = data.PaymentsWDistribution || 0
            $scope.paymentBarVal[2].Count = data.PaymentsAccepted || 0
            $scope.paymentBarVal[3].Count = data.PaymentsSettled || 0
            
            var colors = {
                "OPEN": "linear-gradient(to right, rgb(130, 199, 83), rgb(79, 154, 29) 60%, #558b2f 100%)",
                "CLOSED": "linear-gradient(to right, rgb(243, 111, 111), rgb(228, 11, 11) 60%, #b71c1c 100%)",
                "CLOSING": "linear-gradient(to right, rgb(108, 135, 142), rgb(55, 79, 89) 60%, rgb(8, 45, 64) 100%)"
            }

            $scope.cycleStatus.text = data.CycleStatus;
            $scope.cycleStatus.background = colors[$scope.cycleStatus.text]

            $scope.restVal.push({
                'label': '',
                'recAmount': 'PaymentsDashboard.Amount',
                'recCount': 'PaymentsDashboard.Total',
                'compAmount': 'PaymentsDashboard.Amount',
                'distAmount': 'PaymentsDashboard.Amount',
                'distCount': 'PaymentsDashboard.Total',
            })

            // keys = ['CreditCount', 'CreditAmount', 'DebitCount', 'DebitAmount', 'ErrCount', 'ErrAmount'];
            function format(s) {
                var format = Intl.NumberFormat();
                return '$ ' + format.format(s)
            }
            calculateDiff();

            $scope.restVal.push({
                'label': 'PaymentsDashboard.Credit',
                'recAmount': format(data.PaymentsSummary.Received['CreditAmount']),
                'recCount': data.PaymentsSummary.Received['CreditCount'],
                'compAmount': format(data.PaymentsSummary.Settled['CreditAmount']),
                'distAmount': format(data.PaymentsSummary.Distributed['CreditAmount']),
                'distCount': data.PaymentsSummary.Distributed['CreditCount']
            })

            $scope.restVal.push({
                'label': 'PaymentsDashboard.Debit',
                'recAmount': format(data.PaymentsSummary.Received['DebitAmount']),
                'recCount': data.PaymentsSummary.Received['DebitCount'],
                'compAmount': format(data.PaymentsSummary.Settled['DebitAmount']),
                'distAmount': format(data.PaymentsSummary.Distributed['DebitAmount']),
                'distCount': data.PaymentsSummary.Distributed['DebitCount']
            });
            
            $scope.restVal.push({
                'label': 'PaymentsDashboard.Unknown',
                'recAmount': format(data.PaymentsSummary.Received['ErrAmount']),
                'recCount': data.PaymentsSummary.Received['ErrCount'],
                'compAmount': format(data.PaymentsSummary.Settled['ErrAmount']),
                'distAmount': format(data.PaymentsSummary.Distributed['ErrAmount']),
                'distCount': data.PaymentsSummary.Distributed['ErrCount']
            });

            $scope.restVal.push({
                'label': 'PaymentsDashboard.TrxCreditPSe',
                'recAmount': format(data.PaymentsSummary.Received['CreditsPSEAmount']),
                'recCount': data.PaymentsSummary.Received['CreditsPSECount'],
            })

            function calculateDiff() {
                function structDiff(type, amount, label, quantity) {
                    return {
                        'Label': 'PaymentsDashboard.' + label + type,
                        'DiffQuantity': quantity != undefined ? quantity : "-",
                        'DiffAmount': format(amount)
                    };
                }

                var diffKeys = [
                    {
                        amount: 'CreditAmount',
                        quantity: 'CreditCount',
                        fields: ['DiffRecComp', 'DiffRecDist', 'DiffCompDist']
                    },
                    {
                        amount: 'DebitAmount',
                        quantity: 'DebitCount',
                        fields: ['DiffRecComp', 'DiffRecDist', 'DiffCompDist']
                    },
                    {
                        amount: 'ErrAmount',
                        quantity: 'ErrCount',
                        fields: ['DiffRecComp', 'DiffRecDist', 'DiffCompDist']
                    },
                ]

                // var diffKeys = {
                //     'CreditAmount': ['DiffRecComp', 'DiffRecDist', 'DiffCompDist'],
                //     'DebitAmount': ['DiffRecComp', 'DiffRecDist', 'DiffCompDist'],
                //     'ErrAmount': ['DiffRecComp', 'DiffRecDist', 'DiffCompDist']
                // };

                $scope.differences = [];

                for (i of diffKeys) {
                    for (f of i.fields) {
                        switch (f) {
                            case 'DiffRecComp':
                                $scope.differences.push(structDiff(
                                    i.amount,
                                    data.PaymentsSummary.Settled[i.amount] - data.PaymentsSummary.Received[i.amount],
                                    f
                                ));
                                break;
                            case 'DiffRecDist':
                                $scope.differences.push(structDiff(
                                    i.amount,
                                    data.PaymentsSummary.Distributed[i.amount] - data.PaymentsSummary.Received[i.amount],
                                    f,
                                    data.PaymentsSummary.Distributed[i.quantity] - data.PaymentsSummary.Received[i.quantity],
                                ));
                                break;
                            case 'DiffCompDist':
                                $scope.differences.push(structDiff(
                                    i.amount,
                                    data.PaymentsSummary.Distributed[i.amount] - data.PaymentsSummary.Settled[i.amount],
                                    f
                                ));
                                break;
                            default:
                                break;
                        }
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

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
        });
    }

    // $scope.cycleStatus = {'text': "Open", "background": "linear-gradient(to right, rgb(130, 199, 83), rgb(79, 154, 29) 60%, #558b2f 100%)"}
    $scope.cycleStatus = {}
    $scope.FieldsValues = [
        { 'visible': true, 'label': 'PaymentsDashboard.Type', 'value': 'label' },
        { 'visible': true, 'label': 'PaymentsDashboard.Recibed', 'value': 'rec' },
        { 'visible': true, 'label': 'PaymentsDashboard.Compensated', 'value': 'comp' },
        { 'visible': true, 'label': 'PaymentsDashboard.Distributed', 'value': 'dist' }
    ]

    $scope.header = {
        'label': '',
        'recAmount': 'PaymentsDashboard.Amount',
        'recCount': 'PaymentsDashboard.Total',
        'compAmount': 'PaymentsDashboard.Amount',
        'distAmount': 'PaymentsDashboard.Amount',
        'distCount': 'PaymentsDashboard.Total',
    }

    $scope.banksVisible = false;
    $scope.dashboardPrint = function () {
        window.print()
    }

    $scope.GetReport = function () {
        var CycleObj = {
            'CycleID': $scope.search.CycleId
        }
        $http.get(BASEURL + '/rest/v2/ach/cycleDashboard/report', { 'params': CycleObj }).then((res) => {
            $scope.Details = 'data:application/octet-stream;base64,' + res.data.Data;
            var dlnk = document.getElementById('dwnldLnk');
            dlnk.href = $scope.Details;
            dlnk.download = res.data.FileName;
            dlnk.click();
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
        });
    }
});
