angular.module('VolpayApp').controller('systemdiagnosisDetailCtrl', function($scope, $http, $location, $stateParams, $timeout, GlobalService, $rootScope, editservice) {

    if ($stateParams.input) {
        $scope.getDta = hexToString($stateParams.input)
    }

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

    $(window).scroll(function() {
        $scope.widthOnScroll();
    })
})