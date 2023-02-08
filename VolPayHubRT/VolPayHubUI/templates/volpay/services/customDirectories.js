angular.module('VolpayApp').directive('preLoaderCircle', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, ele) {
                ele.addClass('hide');

                $rootScope.$on('$stateChangeStart', function () {
                    ele.removeClass('hide');
                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    ele.addClass('hide');
                });
            }
        };
    }
]);

angular.module('VolpayApp').directive("httploader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("showHttploader", function (event, args) {
            return element.show();
        });
        return $scope.$on("hideHttploader", function (event, args) {
            return element.hide();
        });
    };
});

angular.module('VolpayApp').factory('loadmeOnscroll', function ($q, $rootScope, $log) {

    var numofRestCalls = 0;
    return {
        request: function (config) {
            numofRestCalls++;
            onrequestTime = new Date().getTime();
            $rootScope.$broadcast("showHttploader");
            return config || $q.when(config)
        },
        requestError: function (rejection) {
            if (!(--numofRestCalls)) {
                $rootScope.$broadcast("hideHttploader");
            }
            return $q.reject(rejection);
        },
        response: function (response) {
            onresponseTime = new Date().getTime();
            timeTaken = (onresponseTime - onrequestTime) * 50;
            if ((--numofRestCalls) === 0) {
                setTimeout(function () {
                    $rootScope.$broadcast("hideHttploader");
                }, timeTaken)
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (!(--numofRestCalls)) {
                $rootScope.$broadcast("hideHttploader");
            }
            return $q.reject(response);
        }
    };
});