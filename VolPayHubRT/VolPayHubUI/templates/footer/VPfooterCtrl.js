angular.module('VolpayApp').controller('footerCtrl', function ($scope, $http, $location, $state) {

    var applicationInfo = function () {
        return $.ajax({
            url: BASEURL + RESTCALL.appInfo,
            cache: false,
            async: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }

    var aData = applicationInfo();
    sessionStorage.VersionInfo = aData.Version;

    $scope.VersionInfo = sessionStorage.VersionInfo;

    // $scope.year = new Date().getFullYear();
    $scope.year = sessionStorage.UserTimezone ? (convertTZ(new Date(), sessionStorage.UserTimezone)) : (new Date().getFullYear())


    if (sessionStorage.UserID || $location.path() == '/forgotpassword') {
        $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.timezonevalue = data.TimeZone;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });

        function update() {
            $('#clock').html(moment(convertTZ(new Date(), sessionStorage.UserTimezone ? sessionStorage.UserTimezone : "IST")).format('DD-MM-YYYY HH:mm:ss')).css({
                // 'color': '#98a6ba'
            });
            if ((!sessionStorage.UserID && $location.path() != '/forgotpassword') || $location.path() == '/login') {
                $('#clock').html("")
                $('#spaceid').html("")
                $(".clockCls").removeAttr('style')
                clearInterval(update)
            }
        }

        setInterval(update, 1000);

        if (sessionStorage.pwRest == true || sessionStorage.pwRest == 'true') {
            setTimeout(function () {
                $(".clockCls").removeAttr('style');
                $(".main-footer").css({
                    'padding': '0'
                })
            }, 100)
        }

    } else {
        setTimeout(function () {
            $(".clockCls").removeAttr('style')
        }, 100)
    }

});
