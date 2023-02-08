if ((configData.AllowDirectURLAccess == false) || (configData.AllowDirectURLAccess == undefined)) {
    angular.module('VolpayApp').run(function($http, $location, $rootScope, GlobalService, LogoutService) {
        $rootScope.$on('$locationChangeSuccess', function(e) {
            $rootScope.actualLocation = $location.path();
        });

        $rootScope.$watch(function() {
            return $location.path();
        }, function(newLocation, oldLocation) {

            if (sessionStorage.SessionToken) {
                if ($rootScope.actualLocation === newLocation) {
                    if (oldLocation != '/login') {
                        GlobalService.Error401 = true;
                        LogoutService.Logout();
                    }
                }
                if ($rootScope.actualLocation == undefined) {
                    GlobalService.RefreshHappen = true;
                    LogoutService.Logout();
                }
            } else {
                if ($location.path() == '/login') {
                    $location.path('/login');
                } else if ($location.path() == '/login/signup') {
                    $location.path('/login/signup');
                } else if ($location.path() == '/forgotpassword') {
                    $location.path('/forgotpassword');
                }  else if ($location.path() == '/hybridlogin') {
                    $location.path('/hybridlogin');
                }else {
                    //LogoutService.Logout();
                    $location.path('/login');
                }
            }
        });
    });
}

angular.module('VolpayApp').controller('volpayAppController', function($scope, $timeout) {
    // if ($location.path().indexOf('login') != -1) {
    // 	sessionStorage.LoginFooterVisible = true;
    // 	$scope.FooterVisible = sessionStorage.LoginFooterVisible;
    // }

    // // $rootScope.$emit("FooterEvent", sessionStorage.LoginFooterVisible);
    // $scope.$broadcast('eventName', {
    // 	message: 'Shruthi'
    // });
    sessionStorage.Login_Footer = 'visible';
    $scope.Log_Footer = sessionStorage.Login_Footer;

    $scope.$on('footervisible', function(event, arg) {

        sessionStorage.Login_Footer = arg;
        $scope.Log_Footer = sessionStorage.Login_Footer;
    });

    $timeout(function() {
        $scope.configData = configData;
        $scope.footerPath = 'templates/footer/' + $scope.configData.ThemeName + '/VPfooter.html';
        $('#footerCss').attr('href', 'themes/' + $scope.configData.ThemeName + '/styles.css')
    }, 0)
});
