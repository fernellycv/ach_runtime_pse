angular.module('VolpayApp').controller('hybridloginCtrl', ['$rootScope', '$scope', '$http', '$location', '$state', '$filter', '$translate', 'GlobalService', 'AllPaymentsGlobalData', 'userProfileSave', 'CommonService', 'errorservice', function ($rootScope, $scope, $http, $location, $state, $filter, $translate, GlobalService, AllPaymentsGlobalData, CommonService, errorservice, userProfileSave) {

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
    });

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

    $scope.selectMode = function (mode) {
        if ($scope.alerts) {
            $rootScope.alerts = [];
        }

        if (mode == 'ACH') {
            configData['Authorization'] = 'External'
            configData['AzureSAMLAuth'] = true
            sessionStorage.modeAuth = 'External'
            sessionStorage.sessionlang = 'es_ES';
            if ((configData['customLogin']) && (configData.Authorization == "External") && (!sessionStorage.SSOLogin)) {
                location.href = configData['customLoginURL'];
            }

            if ((configData['AzureSAMLAuth']) && (configData.Authorization == "External") && (!sessionStorage.SSOLogin)) {
                var ASC = configData['AzureSSOSAMLConfig'][0];
                location.href = ASC['BaseURL'] + '/' + ASC['ApplicationName'] + '/' + ASC['ApplicationID'] + (ASC['TenantID'] ? ('?tenantId=' + ASC['TenantID']) : '');
            }
        }

        if (mode == 'EF') {
            configData['Authorization'] = 'Internal';
            sessionStorage.modeAuth = 'Internal'
            sessionStorage.selecteduser = mode;
            location.href = '#/login';
        }
    }
}]);