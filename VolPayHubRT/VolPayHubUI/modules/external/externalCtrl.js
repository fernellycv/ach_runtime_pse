angular.module('VolpayApp').controller('externalCtrl', function($scope, $stateParams, $rootScope, $http, $location, $state, $timeout, $sce) {
    $scope.url = $sce.trustAsResourceUrl($stateParams.url);
})