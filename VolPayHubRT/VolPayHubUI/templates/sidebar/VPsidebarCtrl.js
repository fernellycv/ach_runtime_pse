angular.module('VolpayApp').controller('sidebarController', ['$scope', '$rootScope', '$http', '$state', '$filter', '$translate', '$stateParams', 'GlobalService', 'errorservice', function ($scope, $rootScope, $http, $state, $filter, $translate, $stateParams, GlobalService, errorservice) {

    sessionStorage.ROLE_ID = (sessionStorage.ROLE_ID) ? sessionStorage.ROLE_ID : localStorage.ROLE_ID;
    sessionStorage.UserID = (sessionStorage.UserID) ? sessionStorage.UserID : localStorage.UserID;

    $scope.translateFn = function (translateVal) {
        $scope.tVal = translateVal;
        $scope.firstFilteredVal = $filter('removeSpace')($scope.tVal);
        $scope.secondFilteredVal = $filter('specialCharactersRemove')($scope.firstFilteredVal);
        $scope.translatedVal = $filter('translate')('Sidebar.' + $scope.secondFilteredVal);
        if ($scope.translatedVal.indexOf('Sidebar.') != -1) {
            $scope.translatedVal = translateVal
        }

        return $scope.translatedVal;
    }

    function removeAdminPanel(sideBarVal) {
        for (i = 0; i < sideBarVal.length; i++) {
            if (sideBarVal[i].ParentName == "Admin Panel") {
                delete sideBarVal[i];
            }
        }
        return orderArray(sideBarVal);
    }

    function orderArray(Arr) {
        for (i = 0; i < Arr.length; i++) {
            if (Arr[i] != undefined) {
                Arr[i] = Arr[i];
            }
        }

        return Arr;
    }

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

    $scope.sidebarVal = (sessionStorage.menuList) ? JSON.parse(sessionStorage.menuList) : [];

    $rootScope.$on("CallParentMethod", function () {
        //$scope.parentmethod();
        $scope.sidebarVal = JSON.parse(sessionStorage.menuList);
    });

    $scope.pName = '';
    $scope.cName = '';
    if ((sessionStorage.pwRest == false) || (sessionStorage.pwRest == 'false')) {

        $scope.sidebarVal = JSON.parse(sessionStorage.menuList);
        $scope.landArr = JSON.parse(sessionStorage.menuList)

        for (var i in $scope.landArr) {
            for (var j in $scope.landArr[i].subMenu) {
                if ($scope.landArr[i].subMenu[j].Link == sessionStorage.selectedMenu) {
                    $scope.landArr[i].subMenu[j].Name

                    $scope.landArr[i].subMenu[j].Name = $filter('removeSpace')($scope.landArr[i].subMenu[j].Name);
                    $scope.landArr[i].subMenu[j].Name = $filter('specialCharactersRemove')($scope.landArr[i].subMenu[j].Name);

                    $scope.landArr[i].ParentName = $filter('removeSpace')($scope.landArr[i].ParentName);
                    $scope.landArr[i].ParentName = $filter('specialCharactersRemove')($scope.landArr[i].ParentName);

                    $scope.pName = $scope.landArr[i].ParentName;
                    $scope.cName = $scope.landArr[i].subMenu[j].Name;
                }
            }
        }

        if ($scope.cName) {
            var newInt = ''
            clearInterval(newInt)
            newInt = setInterval(function () {

                if ($('#' + $scope.cName).length) {
                    sidebarMenuControl($scope.pName, $scope.cName);
                    clearInterval(newInt)
                }
            }, 100);
        }
    }

    if ((configData.Authorization == "External") && (document.cookie)) {
        $rootScope.$on("CallParentMethod1", function (evt, data) {
            $scope.sidebarVal = data;
        });
    }

    setTimeout(function () {
        if (userData.customDashboardWidgets.showDashboard) {
            $('#MyDashboard').css('display', 'block')
        } else {
            $('#MyDashboard').css('display', 'none')
        }
    }, 1000)

    $scope.prev = -1;
    $scope.events = {};

    $scope.gotoPage = function (eve, val, subVal, fl) {

        $scope.events = {
            'eve': eve,
            'val': val,
            'subVal': subVal,
            'fl': fl
        }

        if (sessionStorage.OkAlertClicked) {
            $rootScope.dataModified = false;
            delete sessionStorage.OkAlertClicked;
        }

        if ($rootScope.dataModified) {
            if ($scope.events.subVal.Link != "initiatetransaction" && $scope.events.subVal.Link != "routeregistry" && $scope.events.subVal.Link != "configurations") {
                $rootScope.$emit("MyEvent", true);
            }
            $scope.fromCancelClick = false;
        } else {

            if (!$("body").hasClass('sidebar-collapse')) {
                // subVal.IconName = val.IconName
            }
            if (subVal) {
                sessionStorage.selectedMenu = subVal.Link;
                sessionStorage.menuSelection = JSON.stringify({
                    'val': $filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName)),
                    'subVal': $filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name))
                });

                $('.sidebar-menu').each(function () {
                    $(this).find('.sidebarSubMenu').find('li').removeClass('sideMenuSelected')
                })
                $(eve.currentTarget).parent().addClass('sideMenuSelected')

                subVal.ParentName = val.ParentName;
                subVal.ParentIcon = val.IconName;

                if ((subVal.Link == 'mpitemplate') || (subVal.Link == 'configurations') || (subVal.Link == 'idconfigurations') || (subVal.Link == 'routeregistry') || (subVal.Link == 'serviceregistry') || (subVal.Link == 'systemdiagnosis') || (subVal.Link == 'scheduledroutelogaudit') || (subVal.Link == 'sodhealthcheck')) {
                    $scope.stateApp = subVal.Link;
                } else {
                    $scope.stateApp = val.Link != 'app' ? val.Link : subVal.Link
                    if (subVal.Link.startsWith("webformPlugin/")) {
                        $scope.stateApp = "webformPlugin";
                        //subVal.Link=subVal.Link.replace("webformPlugin/","");
                    }
                }

                $scope.addActive = $filter('removeSpace')(subVal.Name);
                $scope.addActives = $filter('removeSpace')(val.ParentName);

                if (fl) {
                    setTimeout(function () {
                        sidebarMenuControl($filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName)), $filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name)));
                    }, 500)
                } else {
                    sidebarMenuControl($filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName)), $filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name)));
                }

            } else {
                $scope.stateApp = "paymentsummary";
                $scope.callDefault()
            }
            tmpSubVal = Object.assign({}, subVal);
            tmpSubVal.Link = tmpSubVal.Link.replace("webformPlugin/", "")
            $scope.input = {
                'gotoPage': tmpSubVal,
                'responseMessage': ''
            }

            if (!val.allowThirdParty) {
                if ((subVal.PlugPlay) || (val.ExternalMenu)) {
                    $scope.urlVal = $filter('nospace')(subVal.Name);

                    $scope.urlVal = $filter('specialCharactersRemove')($scope.urlVal)
                    $scope.tUrl = $filter('nospace')(subVal.Name);
                    $scope.tUrl = $filter('specialCharactersRemove')($scope.tUrl)
                    $scope.dataObj = {
                        "url": $filter('lowercase')($scope.urlVal),
                        "tempUrl": 'plug-ins/modules/' + $filter('lowercase')($scope.tUrl),
                        "contrl": subVal.controller
                    }

                    var sparams = {};
                    sparams.input = {
                        url: $filter('lowercase')($scope.urlVal),
                        tempUrl: 'plug-ins/modules/' + $filter('lowercase')($scope.tUrl),
                        contrl: subVal.controller
                    }
                    sparams.newUrl = sparams.input.url;
                    $state.go('app.newmodules', sparams);

                } else {

                    if (fl) {
                        $scope.input.triggerIs = fl;
                    }

                    if (subVal && subVal['Link'].toLowerCase() === "interfacebulkprofiles") {
                        params = {};
                        params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        params.urlOperation = $filter('removeSpace')($scope.input.Operation).toLowerCase();
                        params.input = $scope.input
                        $state.go('app.' + 'dynamicForms', params);
                    } else if (subVal && subVal['Link'].toLowerCase() === "batchbulkprofile") {
                        params = {};
                        params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        params.urlOperation = $filter('removeSpace')($scope.input.Operation).toLowerCase();
                        params.input = $scope.input

                        $state.go('app.' + 'dynamicForms', params);
                    } else if (subVal && subVal['Link'].toLowerCase() === "xmlfilegeneration") {
                        params = {};
                        params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        params.urlOperation = $filter('removeSpace')($scope.input.Operation).toLowerCase();
                        params.urlIdForAddons = $filter('removeSpace')($scope.input.gotoPage.Name).toLocaleLowerCase()
                        params.input = $scope.input

                        $state.go('app.' + 'webformPlugins', params);
                    } else if (subVal && subVal['Link'].toLowerCase() === "executeadhoc") {
                        params = {};
                        params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        params.urlOperation = $filter('removeSpace')($scope.input.Operation).toLowerCase();
                        params.input = $scope.input

                        $state.go('app.' + 'executeadhoc', params);
                    } else {
                        params = {};
                        if ($scope.stateApp == "webformPlugin") {
                            params.urlIdForAddon = $filter('removeSpace')($scope.input.gotoPage.Name).toLocaleLowerCase()
                        } else if ($scope.stateApp == "view") {
                            params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        } else if ($scope.stateApp == "addonview") {
                            params.urlIdForAddon = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        } else if ($scope.stateApp == "addonoperation") {
                            params.urlIdForAddon = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                            params.urlOperationForAddon = $filter('removeSpace')($scope.input.Operation).toLowerCase();
                        } else if ($scope.stateApp == "newmodules") {
                            params.newUrl = $filter('removeSpace')($scope.input.url).toLowerCase();
                        } else if ($scope.stateApp == "bankData") {
                            params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                        } else if ($scope.stateApp == "operation") {
                            params.urlId = $filter('removeSpace')($scope.input.gotoPage.Name).toLowerCase();
                            params.urlOperation = $filter('removeSpace')($scope.input.Operation).toLowerCase();
                        } else if ($scope.stateApp == "newmodules") {
                            params.newUrl = $filter('removeSpace')($scope.input.url).toLowerCase();
                        } else if ($scope.stateApp == "webformPlugins") {
                            params.urlIdForAddons = $filter('removeSpace')($scope.input.gotoPage.Name).toLocaleLowerCase()
                        }
                        params.input = $scope.input
                        $state.go('app.' + $scope.stateApp, params);
                    }
                }

            } else {
                $state.go('app.externalLink', {
                    "url": subVal.Link
                })
            }

            $scope.mediaQuery = window.matchMedia("(max-width: 767px)");
            if ($scope.mediaQuery.matches) {
                $("body").removeClass('sidebar-open');
                $scope.sidebarToggleTooltip = "Show Menu"
            }
        }
    }

    $rootScope.$on("MyEvent2", function (evt, data) {
        $rootScope.dataModified = false;
        $scope.gotoPage($scope.events.eve, $scope.events.val, $scope.events.subVal, $scope.events.fl)
        $scope.events = {};
    })

    $scope.parentMenu = function (evt) {

        if ($('#' + $(evt.currentTarget).parent().attr('id')).hasClass('open')) {
            $('#' + $(evt.currentTarget).parent().attr('id')).removeClass('open').find('.sidebarSubMenu').slideUp();
            $('#' + $(evt.currentTarget).parent().attr('id')).find("a span").next().removeAttr('class').attr('class', 'fa fa-plus');
        } else {
            $('#' + $(evt.currentTarget).parent().attr('id')).parent().find('.menuli').removeClass('open').find('.sidebarSubMenu').slideUp();
            $('#' + $(evt.currentTarget).parent().attr('id')).parent().find('.menuli .ParentMenu span').next().removeAttr('class').attr('class', 'fa fa-plus');

            $('#' + $(evt.currentTarget).parent().attr('id')).addClass('open').find('.sidebarSubMenu').slideDown();
            $('#' + $(evt.currentTarget).parent().attr('id')).find("a span").next().removeAttr('class').attr('class', 'fa fa-minus');
        }
    }

    $scope.showSmallLogo = false;

    $('#sidebarMenu').find('.appLogo').css('display', 'block');
    $scope.sidebarToggleTooltip = "Hide Menu"
    $("body").removeClass('sidebar-collapse');
    $('.ParentMenu').find("span").next().removeAttr('class').attr('class', 'fa fa-plus').css({
        'float': 'right'
    })
    $('.sidebarSubMenu li a').css('padding-left', '24px');
    $('.sidebarSubMenu li a span').css('margin-left', '0px');
    $('.newvisiblefooter').css('margin-left', '230px');
    // $('.footertext1').css('left', '-210px');

    $scope.sideBar = function (value) {
        /*$('.sidebar-menu').find('.sidebarSubMenu').removeClass('open').css({
        'display' : 'none'
        })*/
        $scope.prev = -1;

        if (value == 1) {
            if ($("body").hasClass('sidebar-collapse')) {

                $scope.showSmallLogo = false;
                $('#sidebarMenu').find('.appLogo').css('display', 'block');
                $scope.sidebarToggleTooltip = "Hide Menu"
                $("body").removeClass('sidebar-collapse');
                $('.ParentMenu').find("span").next().removeAttr('class').attr('class', 'fa fa-plus').css({
                    'float': 'right'
                })
                $('.sidebarSubMenu li a').css('padding-left', '');
                $('.sidebarSubMenu li a span').css('margin-left', '0px');
                // $('.fixedfooter').css('margin-left', '230px');
                // $('.footertext1').css('left', '-210px');

                $(".clockCls").css("margin-right", "225px")
                if (sessionStorage.currentThemeName == 'bnym') {
                    $('.newvisiblefooter').css('margin-left', '0');
                    $('.bnymCstmCls').css('margin-right', '0');
                } else {
                    $('.newvisiblefooter').css('margin-left', '230px');
                }
                // $('.footertext1').css('left', '-210px');
            } else {

                $scope.showSmallLogo = true;
                $('#sidebarMenu').find('.appLogo').css('display', 'none');

                $("body").addClass('sidebar-collapse');
                $scope.sidebarToggleTooltip = "Show Menu"
                $('.ParentMenu').find("span").next().css({
                    'float': ''
                });

                $('.sidebarSubMenu li a').css('padding-left', '13px');
                $('.sidebarSubMenu li a span').css('margin-left', '18px');
                // $('.fixedfooter').css('margin-left', '50px');
                // $('.footertext1').css('left', '-30px');

                $(".clockCls").css("margin-right", "50px")
                $('.newvisiblefooter').css('margin-left', '0px');

                if (sessionStorage.currentThemeName == 'bnym') {
                    $('.bnymCstmCls').css('margin-right', '20px');
                }
            }
        }
    };
    //$scope.sideBar(1)

    if ($("body").hasClass('sidebar-open')) {
        $scope.sidebarToggleTooltip = "Show Menu"
    } else {
        $scope.sidebarToggleTooltip = "Hide Menu"
    }

    if ($stateParams.details) {
        for (j in GlobalService.sidebarVal) {
            for (k in GlobalService.sidebarVal[j].subMenu) {
                if (GlobalService.sidebarVal[j].subMenu[k].Link == $stateParams.details.toPage) {
                    $scope.gotoPage('', GlobalService.sidebarVal[j], GlobalService.sidebarVal[j].subMenu[k], $stateParams.details)
                }
            }
        }
    }

    if (!$scope.sidebarVal.length) {

        $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.sidebarArr = [];
            var sidebarObj = {};
            sidebarObj.RoleId = data.RoleID;
            sessionStorage.ROLE_ID = data.RoleID;
            sessionStorage.UserID = data.UserID;
            localStorage.ROLE_ID = data.RoleID;
            localStorage.UserID = data.UserID;

            $translate.use("es_ES");
            // 'config/sidebarVal.json'
            $http.get(CONFIG_JSON.sidebarVal).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

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
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
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
}]);