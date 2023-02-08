var VolpayApp = angular.module('VolpayApp', [
    'ng',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'isoCurrency',
    'ngSanitize',
    'ngIdle',
    'pascalprecht.translate',
    'ngCookies',
    'ngFileSaver',
    'infinite-scroll'
]);

angular.module("infinite-scroll").value("THROTTLE_MILLISECONDS", 250);

VolpayApp.factory('GetPermissions', ['$http', function (http) {
    return function (resourceName) {
        permission = {
            'Accept': false,
            'DeleteFile': false,
            'DeletePayment': false,
            'ExportTXT': false,
            'ExportCSV': false,
            'Export': false,
            'Download': false,
            'ExportLog': false,
            'ExportDetail': false,
            'ExportRecord': false,
            'Release': false,
            'Request': false,
            'Response': false,
            'StartRequest': false,
            'AskForApproval': false,
            'Authorize': false,
            'Reject': false,
            'Reverse': false,
            'Generate': false,
            'Calculate': false,
            'ReActivate': false,
            'R': false,
            'Approve': false,
            'FileUpload': false,
            'CloseCycle': false,
            'TransactionsACH': false,
            'SentTransactions': false,
            'ExportTrRec': false,
            'ExportTrSoi': false,
            'ExportTrSent': false,
            'ExportTrAch': false,
            'PullFiles': false,
            'ReceivedTransactions': false,
            'SOITransactions': false,
            'C': false,
            'D': false,
            'R': false,
            'U': false,
            'Save': false,
            'DefaultType': false,
            'AlertFiles': false,
            'ForceRejection': false,
            'ApplyCus': false
        }
        var data = {
            "resourceName": resourceName
        }
        http({
            method: "POST",
            url: BASEURL + '/rest/v2/entitlements/getpermissionsbyname',
            data: data
        }).then(function (response) {
            for (k in response.data) {
                for (j in Object.keys(permission)) {
                    if (Object.keys(permission)[j] == response.data[k].ResourcePermission) {
                        permission[Object.keys(permission)[j]] = true;
                    }
                }
            }
        }, function (err) {
        })
        return permission;
    }
}]);

const ORIGIN = location.origin;
const CONFIG_JSON = {
    "chartData": ORIGIN + "/VolPayRest/rest/v2/uiconfig/chartData.json",
    "advanceSearchConfig": ORIGIN + "/VolPayRest/rest/v2/uiconfig/advanceSearchConfig.json",
    "config": ORIGIN + "/VolPayRest/rest/v2/uiconfig/config.json",
    "inout": ORIGIN + "/VolPayRest/rest/v2/uiconfig/inout.json",
    "multilingual": ORIGIN + "/VolPayRest/rest/v2/uiconfig/multilingual.json",
    "service": ORIGIN + "/VolPayRest/rest/v2/uiconfig/service.json",
    "sidebarVal": ORIGIN + "/VolPayRest/rest/v2/uiconfig/sidebarVal.json",
    "sidebarVal_All": ORIGIN + "/VolPayRest/rest/v2/uiconfig/sidebarVal_All.json",
    "sidebarVal_subset_All": ORIGIN + "/VolPayRest/rest/v2/uiconfig/sidebarVal_subset_All.json",
    "userData": ORIGIN + "/VolPayRest/rest/v2/uiconfig/userData.json",
}

var retrieveProfileData = function () {
    return $.ajax({
        // url: 'config/userData.json',
        url: CONFIG_JSON.userData,
        async: false,
        cache: false,
        type: 'GET',
        dataType: 'json'
    }).responseJSON;
}
var uProfileData = retrieveProfileData();

var defaultClearing;

/*** Loading Properties file ***/
var retrieveREST = function () {
    return $.ajax({
        // url: 'config/service.json',
        url: CONFIG_JSON.service,
        async: false,
        cache: false,
        type: 'GET',
        dataType: 'json'
    }).responseJSON;
}
var RESTCALL = retrieveREST();

/*** Loading Configuration setting ***/
var retrieveData = function () {
    return $.ajax({
        // url: 'config/config.json',
        url: CONFIG_JSON.config,
        async: false,
        cache: false,
        type: 'GET',
        dataType: 'json'
    }).responseJSON;
}
var configData = retrieveData();

/*** Loading WildcardSearch setting ***/
if (configData.enableWildCardSearchFlag) {
    var retrieveWildCardData = function () {
        return $.ajax({
            // url: 'config/advanceSearchConfig.json',
            url: CONFIG_JSON.advanceSearchConfig,
            async: false,
            cache: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }
    var WildcardSearchData = retrieveWildCardData();
}

/*** Loading multilingual support setting ***/
var retrievemultilingualData = function () {
    return $.ajax({
        // url: 'config/multilingual.json',
        url: CONFIG_JSON.multilingual,
        async: false,
        cache: false,
        type: 'GET',
        dataType: 'json'
    }).responseJSON;
}
var multilingualSearchData = retrievemultilingualData();

if ((configData['Model']) && (configData.Model == "HYBRID") && (!sessionStorage.modeAuth) && ((window.location, window.location.hash.indexOf('#/createpassword?resetLink') == -1))) {
} else {
    if ((configData['customLogin']) && (configData.Authorization == "External") && (!sessionStorage.SSOLogin)) {
        location.href = configData['customLoginURL'];
    }

    if ((configData['AzureSAMLAuth']) && (configData.Authorization == "External") && (!sessionStorage.SSOLogin) && (!sessionStorage.modeAuth) && ((window.location, window.location.hash.indexOf('#/createpassword?resetLink') == -1))) {
        var ASC = configData['AzureSSOSAMLConfig'][0];
        location.href = ASC['BaseURL'] + '/' + ASC['ApplicationName'] + '/' + ASC['ApplicationID'] + (ASC['TenantID'] ? ('?tenantId=' + ASC['TenantID']) : '');
    }
}

var RESTPATH = "/rest/v2/";
var diffRestServer = {}
if (configData.IsRESTServerInSameMachine == "Yes") {
    var protocol_host_port = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    var BASEURL = protocol_host_port + '/' + configData.RESTWebApp;
} else {
    var diffRestServer = objectFindByKey2(configData.RESTServer, 'UIDomainName', location.hostname);
    var BASEURL = diffRestServer.Protocol + '://' + diffRestServer.RESTDomainName + ':' + diffRestServer.Port + '/' + configData.RESTWebApp;
}
// sessionStorage.currentThemeName = configData ? configData.ThemeName : '';

if (configData.Authorization == "External") {
    sessionStorage.lastRefreshTime = new Date().getTime();
}

if (configData.UserCaseSensitive == false) {
    RESTCALL.LoginREST = RESTCALL.BNYMLoginREST;
    RESTCALL.UserProfile = RESTCALL.UserProfileBNYM;
}

function objectFindByKey2(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if ($.isArray(array[i][key])) {
            if (array[i][key].indexOf(value) != -1) {
                return array[i];
            }
        } else {
            if (array[i][key] === value) {
                return array[i];
            }
        }
    }
    return null;
}

angular.module('VolpayApp').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common['source-indicator'] = configData.SourceIndicator; //"volpay-ui";
    $httpProvider.interceptors.push('loadmeOnscroll');
    $httpProvider.interceptors.push('timestampMarker');
}]);

if (configData.IdleTimeOut == true) {
    angular.module('VolpayApp').config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
        IdleProvider.idle(sessionStorage.sessionTimeLimit * 60);
        IdleProvider.timeout(30);
        KeepaliveProvider.interval(30);
    }]);
}

angular.module('VolpayApp').run(['Idle', function (Idle) {
    //Idle.watch();
}]);

angular.module('VolpayApp').config(['$anchorScrollProvider', function ($anchorScrollProvider) {
    $anchorScrollProvider.disableAutoScrolling();
}]);

if (configData.Authorization == 'Internal') {
    function authInterceptor(API, auth, $q, $rootScope, $log) {
        var numLoadings = 0;
        return {
            request: function (config) {
                var token = auth.getToken();
                if (config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = 'SessionToken:' + token;
                    config.headers['languageSelected'] = sessionStorage.sessionlang ? sessionStorage.sessionlang : 'es_ES';
                }

                numLoadings++;
                // Show loader
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config)
                //return config;
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }
                return $q.reject(response);
            }
        }
    }

    function authService($window) {
        var self = this;
        self.getToken = function () {
            return sessionStorage.SessionToken;
        }
    }

    angular.module('VolpayApp').factory('authInterceptor', authInterceptor)
        .service('auth', authService)
        .constant('API', BASEURL)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });
}

VolpayApp.directive("loader", function ($rootScope, $timeout, $location) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });

        return $scope.$on("loader_hide", function () {
            return setTimeout(function () { element.hide(); },
                ($location.$$url == "/app/partyserviceassociation/") ? 3500 : 0);
            // return element.hide();          
        });
    };
})

if (configData.Authorization == 'External') {
    /* angular.module('VolpayApp').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = sessionStorage.CSRF;
    }]); */
    function authInterceptor(API, auth, $q, $rootScope, $log) {
        var numLoadings = 0;
        return {
            request: function (config) {
                var token = auth.getToken();
                if (config.url.indexOf(API) === 0 && token) {
                    config.headers['X-CSRF-Token'] = token;
                    config.headers['userid'] = sessionStorage.UserID;
                    config.headers['roleid'] = sessionStorage.ROLE_ID;
                    config.headers.Authorization = 'SessionToken:' + sessionStorage.SessionToken;
                    config.headers['languageSelected'] = sessionStorage.sessionlang ? sessionStorage.sessionlang : 'es_ES';
                } else if (sessionStorage.SessionToken) {
                    config.headers['userid'] = sessionStorage.UserID;
                    config.headers['roleid'] = sessionStorage.ROLE_ID;
                    config.headers.Authorization = 'SessionToken:' + sessionStorage.SessionToken;
                    config.headers['languageSelected'] = sessionStorage.sessionlang ? sessionStorage.sessionlang : 'es_ES';
                }
                numLoadings++;

                // Show loader
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config)
                //return config;
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }
                return $q.reject(response);
            }
        }
    }

    function authService($window) {
        var self = this;
        self.getToken = function () {
            return sessionStorage.CSRF;
        }
    }

    angular.module('VolpayApp').factory('authInterceptor', authInterceptor)
        .service('auth', authService)
        .constant('API', BASEURL)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });

}

angular.module('VolpayApp').factory('timestampMarker', [function () {
    var timestampMarker = {
        request: function (config) {
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function (response) {
            response.config.responseTimestamp = new Date().getTime();
            sessionStorage.lastActivityTime = response.config.responseTimestamp;
            return response;
        }
    };
    return timestampMarker;
}]);

angular.module('VolpayApp').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'config/language/',
        suffix: '.json'
    });
    // .preferredLanguage('en_US')
    // .useLocalStorage()
    // .useSanitizeValueStrategy('escape');
    // .useSanitizeValueStrategy('sanitize');
    // .usePostCompiling(true)
    // .useMissingTranslationHandlerLog();
}]);

angular.module('VolpayApp').controller('activeController', ['$scope', '$rootScope', '$http', '$location', '$state', 'GlobalService', 'Idle', 'Keepalive', '$modal', 'AllPaymentsGlobalData', '$window', 'LogoutService', '$timeout', '$translate', 'EntityLockService', function ($scope, $rootScope, $http, $location, $state, GlobalService, Idle, Keepalive, $modal, AllPaymentsGlobalData, $window, LogoutService, $timeout, $translate, EntityLockService) {

    if (sessionStorage.UserID) {
        $rootScope.$broadcast('footervisible', 'not_visible');
    }

    $rootScope.alerts = [];

    if (!userData.genSetting.languageSelected) {
        $translate.use('es_ES');
    }

    setTimeout(function () {
        if (sessionStorage.sessionlang == 'en_US') {
            $('#lang_1').prop('checked', true)
        } else if (sessionStorage.sessionlang == 'es_ES') {
            $('#lang_2').prop('checked', true)
        } else {
            $('#lang_1').prop('checked', true)
        }
        $scope.$broadcast('langChangeEventRefresh');
    }, 1600)

    $rootScope.profileUpdated = '';
    $scope.searchParam = $location.search().view;

    if ($scope.searchParam == 'inside') {
        // sessionStorage.iframeFlag = true;
        $('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
        //$('.breadCrumb').css({'display':'none'})
    }

    if ($scope.searchParam == 'All') {
        // sessionStorage.iframeFlag = false;
    }

    //if ((document.cookie) && (configData.Authorization == "External") && (JSON.parse(sessionStorage.iframeFlag) != false)) {
    if ((document.cookie) && (configData.Authorization == "External")) {
        /*$('.breadCrumb').css({
            'display': 'none'
        })
    } else {
        $('.breadCrumb').css({
            'display': 'block'
        }) */
        $('.breadCrumb').css({
            'display': 'block'
        })
    }

    $scope.showBreadcrumb = true;

    $('body').css('background-color', '#f2f2f2')

    // $('.fixedfooter').css('margin-left', '230px');
    // $('.footertext1').css('left', '-210px');

    setTimeout(function () {
        if ($(window).height() >= 760) {
            $('.listView').css({
                'max-height': ($(window).height() * 65) / 100 + 'px'
            })
        } else {
            $('.listView').css({
                'max-height': ($(window).height() * 52) / 100 + 'px'
            })
        }
    }, 100)

    $('.nvtooltip').css({
        'display': 'none'
    });

    $('html').css({
        "background": "",
        "background-size": "cover"
    })

    window.scrollTo(0, 0);

    $scope.goToHome = function () {
        sidebarMenuControl('PaymentModule', 'DashboardPayments')
        $state.go('app.paymentsummary', {})
    }

    $scope.checkPageContent = function () {
        $scope.mediaQuery = window.matchMedia("(max-width: 767px)");
        if ($scope.mediaQuery.matches) {
            $('.content-wrapper').css({
                'margin-left': '0px'
            });
        } else {
            $('.content-wrapper').css({
                'margin-left': '230px'
            });
        }
    }

    var pwRest = sessionStorage.pwRest;
    if ((pwRest == true) || (pwRest == 'true')) {
        $scope.showBreadcrumb = false;

        $('.content-wrapper').css({
            'margin-left': '0px'
        });
        $timeout(function () {
            $('.main-sidebar,.headerSideToggle').css({
                'display': 'none'
            });
        }, 200);
    } else if ((pwRest == false) || (pwRest == 'false')) {
        $scope.showBreadcrumb = true;
        $timeout(function () {
            $('.main-sidebar').css({
                'display': 'block'
            });
            $('#homeBreadCrumb').css({
                'pointer-events': 'auto'
            });
        }, 200);

        $scope.checkPageContent()
    }

    if (configData.Authorization == "External") {
        $scope.showBreadcrumb = true;
    }

    $('.ng-isolate-scope').css('display', 'none')
    $('.modal-backdrop').css('display', 'none')
    $('.modal').modal('hide')
    $('body').removeClass('modal-open')

    $scope.$on('$locationChangeStart', function (e, next, previous) {
        $scope.oldUrl = previous;
        $scope.oldHash = $window.location.hash;
        if ($scope.oldHash == "#/app/AlertsandNotification") {
            GlobalService.AandN.AlertId = '';
        }
    });

    var findRESTStatus = function () {

        $http.get(BASEURL + RESTCALL.HomePageDataREST).then(function onSuccess(response) {
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

            $scope.alerts = [{
                type: 'danger',
                msg: fetchErrorMessage(data)

            }];
        });
    }

    $scope.started = false;

    function closeModals() {
        if ($scope.warning) {
            $scope.warning.close();
            $scope.warning = null;
        }

        if ($scope.timedout) {
            $scope.timedout.close();
            $scope.timedout = null;
        }
    }

    if ((configData.Authorization == 'Internal') || (configData.IdleTimeOut == true)) {

        $scope.$on('IdleStart', function () {
            closeModals();

            $scope.warning = $modal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-warning'
            });
        });

        $scope.$on('IdleEnd', function () {
            closeModals();
        });

        $scope.$on('IdleTimeout', function () {

            LogoutService.Logout();

            $('.modal').modal('hide')
            $('.modal-backdrop').hide()

            $('body').css({
                'background-color': '#f2f2f2'
            });
            $('body').removeClass('modal-open')

            GlobalAllPaymentReset(GlobalService, AllPaymentsGlobalData)
            closeModals();
            $scope.timedout = $modal.open({
                templateUrl: 'timedout-dialog.html',
                windowClass: 'modal-danger'
            });

            delete $http.defaults.headers.common['Authorization'];
            sessionStorage.clear();
            $location.path("login")
        });

        $scope.start = function () {
            closeModals();
            Idle.watch();
            $scope.started = true;
        };

        $scope.stop = function () {
            closeModals();
            Idle.unwatch();
            $scope.started = false;
        };

        Idle.watch();
    }

    $(window).resize(function () {

        //$('.listView').css({'max-height':($(window).height()*65)/100+'px'})

        var mediaQuery = window.matchMedia("(max-width: 991px)");
        if (mediaQuery.matches) {
            $(function () {
                $('.sidebar-menu').slimScroll({
                    color: '#ddd',
                    size: '7px',
                    height: '350px',
                    alwaysVisible: true
                });
            });
        } else {
            $(function () {
                $('.sidebar-menu').slimScroll({
                    color: '#ddd',
                    size: '7px',
                    //height: $(window).outerHeight()-200+'px',
                    height: (configData.ThemeName == 'volante') ? ($(window).outerHeight() - $('.fixedfooter').height() - 50 + 'px') : ($(window).outerHeight() - 150 + 'px'),
                    alwaysVisible: true
                });
            });
        }

        if ((pwRest == false) || (pwRest == 'false')) {
            $scope.checkPageContent()
        }

        //setTimeout(function()
        //{
        if ($(window).height() >= 760) {
            $('.listView').css({
                'max-height': ($(window).height() * 65) / 100 + 'px'
            })
        } else {
            $('.listView').css({
                'max-height': ($(window).height() * 52) / 100 + 'px'
            })
        }
        //	},100)


    })

    //$('.slimScrollDiv').css({'height':$(window).outerHeight()+'px','overflow':'auto'})

    /*$('.sidebar-menu').slimScroll({
        color: '#ddd',
        size: '7px',
        height: $(window).outerHeight()+'px',
        alwaysVisible: true
    });*/

    $('.page-breadcrumb').find('li:last-child').click(function () {
        checkMenuOpen()
    })
}]);

angular.module('VolpayApp').controller('RefreshController', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

    $scope.Timer = null;

    //Timer start function.
    $scope.StartTimer = function () {

        //Initialize the Timer to run every 10000 milliseconds i.e. Ten second.
        $scope.Timer = $interval(function () {
            //Display the current time.
            //var time = $filter('date')(new Date(), 'HH:mm:ss');
            var time = new Date().getTime()

            if ((sessionStorage.lastRefreshTime && JSON.parse(sessionStorage.lastRefreshTime)) && ((time - JSON.parse(sessionStorage.lastRefreshTime)) > (configData.RefreshTimeOut * 60 * 1000)) && (JSON.parse(sessionStorage.lastActivityTime) > JSON.parse(sessionStorage.lastRefreshTime))) {
                $http.get('modules/paymentdashboard/refresh.html?' + time).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $interval.cancel($scope.Timer);
                    sessionStorage.lastRefreshTime = new Date().getTime();
                    $scope.StartTimer();
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                });
            }
        }, 10000);
    };

    if (configData.Authorization == 'External') {
        $scope.StartTimer();
        $scope.showBreadcrumb = true;
    }

}]);

$(window).scroll(function () {

    var scrollPoint = $(this).scrollTop();
    var mediaQuery = window.matchMedia("(max-width: 767px)");
    var dynamicHeight = $('.main-header').outerHeight();

    if (mediaQuery.matches) {
        dynamicHeight = $('body').hasClass('sidebar-open') ? ($('.main-header').outerHeight() + $('.sidebar').outerHeight()) : ($('.main-header').outerHeight());
        if (scrollPoint > dynamicHeight) {
            $('.breadCrumb').css({
                'top': (scrollPoint - dynamicHeight) + 'px',
                'z-index': '1'
            });
        } else if (scrollPoint < dynamicHeight) {
            $('.breadCrumb').css({
                'top': '0px',
                'z-index': '1'
            });
        }
    } else {
        $('.breadCrumb').css({
            'top': scrollPoint + "px",
            'z-index': '3'
        })
    }

    var mq = window.matchMedia("(max-width: 991px)");
    var headHeight
    if (mq.matches) {
        headHeight = 85;
    } else {
        headHeight = 85;
    }

    var scroll = $(window).scrollTop();

    // var ht = $('.breadCrumb').outerHeight() + $('.pageTitle').outerHeight()
    var ht = 10 + $('.pageTitle').outerHeight()
    if (scroll > ht) {
        $('.autoAdjustAlert').css('top', headHeight + "px")
        $('.autoAdjustAlert').css('position', "sticky")
        $('.autoAdjustAlert').css('z-index', "3")
    } else {
        $('.autoAdjustAlert').css("top", "");
        $('.autoAdjustAlert').css('position', "")
        $('.autoAdjustAlert').css('z-index', "")
        $('.CountBar').css('top', "")
        $('.CountBar').css('position', "sticky")
        $('.CountBar').css('z-index', "")
    }

});

$(document).keypress(function (event) {
    if ($(event.target).hasClass('form-control') && event.which == '13') {
        //event.preventDefault();
    }
});
