angular.module('VolpayApp').controller('paymentrecoveryCtrl', ['$scope', '$rootScope', '$http', 'errorservice', 'EntityLockService', function($scope, $rootScope, $http, errorservice, EntityLockService) {

    // $scope.paymentid = '';
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 

    var authenticationObject = $rootScope.dynamicAuthObj;
    $scope.limit = 500;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {
            setTimeout(function() {

                $(".js-select2-multiple").select2({
                    ajax: {
                        url: function() {
                            return BASEURL + "/rest/v2/payments/paymentsrecovery"
                        },

                        headers: authenticationObject,
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                xhr.withCredentials = true
                        },
                        crossDomain: true,
                        data: function(params) {

                            if (params.term) {
                                query = {
                                    search: params.term,
                                };
                                return query;
                            }
                        },
                        processResults: function(data, params) {
                            params.page = params.page ? params.page : 0;
                            var myarr = [];


                            for (j in data) {
                                myarr.push({
                                    'id': data[j].actualvalue,
                                    'text': data[j].displayvalue
                                })
                            }

                            return {
                                results: myarr,
                                pagination: {
                                    more: data.length >= $scope.limit
                                }
                            };

                        },
                        cache: true
                    },
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true

                })
            }, 1000)
        }
        $scope.remoteDataConfig()
    });

    $scope.triggerRecovery = function(pid) {

        var inputObj = {}
        inputObj.PaymentID = pid

        $http.post(BASEURL + '/rest/v2/payments/paymentrecovery', inputObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }]

            $scope.paymentid = '';


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
        });
    }
}]);

angular.module('VolpayApp').directive('validAlphaNum', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/^(\s\s?)*$/, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            /* 
            			element.bind('keypress', function (event) {
            				if (event.keyCode === 32) {
            					event.preventDefault();
            				}
            			}); */
        }
    };
});
