angular.module('VolpayApp').controller('volpayidConfigDetailCtrl', function($scope, $http, $location, $stateParams, $filter, $timeout, GlobalService, $rootScope, editservice, errorservice) {

    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })

    $scope.madeChanges = true;

    if ($stateParams.input) {
        $scope.permission = {
            'C': $stateParams.input["C"],
            'D': $stateParams.input["D"],
            'R': $stateParams.input["R"],
            'U': $stateParams.input["U"]
        }
    }

    $scope.strData = [];
    var formArrayWithVal;
    $scope.madeChanges = false;
    $scope.TaskDetails = GlobalService.specificData;

    $scope.fromAddNew = GlobalService.fromAddNew;
    $scope.ViewClicked = GlobalService.ViewClicked;

    if (!$stateParams.input && $scope.fromAddNew == false) {
        $location.path('app/volpayidconfig')
    }

    $scope.viewTaskDetail = angular.copy($scope.TaskDetails);
    delete $scope.viewTaskDetail.IsParallel;

    $.each($scope.TaskDetails, function(k, v) {
        //display the key and value pair
        $scope.strData.push({
            'label': k,
            'value': v
        })

    });

    $scope.TaskDetailsCreate = {};
    $scope.gotoEdit = function() {
        $scope.ViewClicked = false;
    }

    /*** Validating Form changes ***/
    $timeout(function() {
        $rootScope.formArrayWithVal = $('.volpayIdFormValid').serializeArray();
    }, 100)

    $scope.madeChanges = false;
    $scope.listen = function() {
        var Operation = ($scope.fromAddNew) ? 'Add' : 'Edit';
        var fieldObject = (Operation == 'Add') ? $scope.TaskDetailsCreate : $scope.TaskDetails;
        setTimeout(function() {
            editservice.listen($scope, fieldObject, Operation, 'VolPayIdConfig');
        }, 100)
    }
    $scope.listen();

    $scope.gotoCancelFn = function() {
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $scope.gotoParent();
        }

    }

    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            $scope.gotoParent();
            $rootScope.dataModified = false;
        } else {
            $rootScope.$emit("MyEvent2", true);
        }
    }

    $scope.gotoParent = function() {
        $location.path('app/volpayidconfig')
    }

    $scope.gotoShowAlert = function() {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $("#changesLostModal").modal("show");
        } else {
            $scope.gotoParent();
        }
    }

    $scope.createData = function(newData) {

        //newData.IsParallel = false;
        newData = removeEmptyValueKeys(newData)

        $http.post(BASEURL + RESTCALL.volPayIdConfig, newData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.dataModified = false;
            GlobalService.Fxupdated = data.responseMessage;
            $location.path('app/volpayidconfig')
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            var _cstmMsg = data.error.message;
            if (_cstmMsg.match(':') && _cstmMsg.split(':')[0] === 'The validation of uniqueness for field(s)') {
                if (_cstmMsg.split(':')[1].match('has failed')) {
                    var _cstmMsg1 = $filter('removeSpace')(_cstmMsg.split(':')[1].split('has failed')[0])
                    if (_cstmMsg1.match('IDCode')) {
                        _cstmMsg = 'IDCode : ' + newData['IDCode'] + ' already exists. Value needs to be unique.'
                    } else {
                        _cstmMsg = data.error.message
                    }
                } else {
                    _cstmMsg = data.error.message
                }

            } else {
                _cstmMsg = data.error.message
            }
            $scope.alerts = [{
                type: 'danger',
                msg: _cstmMsg //Set the message to the popup window
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    };

    $scope.updateData = function(editedData) {

        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.volPayIdConfig;

        $http.put(BASEURL + RESTCALL.volPayIdConfig, editedData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.dataModified = false;
            GlobalService.Fxupdated = data.responseMessage;
            $location.path('app/volpayidconfig')
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: err.error.message //Set the message to the popup window
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
        //bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
    };

    $scope.deleteData = function(da) {
        $scope.delObj = {};
        $scope.delObj.IDCode = $scope.TaskDetails['IDCode'];

        $http.post(BASEURL + RESTCALL.volPayIdConfig + 'delete', $scope.delObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.Fxupdated = "Borrado exitosamente";
            $location.path('app/volpayidconfig')
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
                msg: data.error.message //Set the message to the popup window
            }];
            $timeout(function() { $('.alert-danger').hide() }, 4000);
        });
        $('.modal').modal("hide");
    };

    $('#changesLostModal').on('shown.bs.modal', function(e) {
        $('body').css('padding-right', 0)
    });
    $('#changesLostModal').on('hidden.bs.modal', function(e) {
        $scope.fromCancelClick = false;
        $scope.breadCrumbClicked = false;
    });

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
    };

    $scope.widthOnScroll();

    $(window).scroll(function() {
        $scope.widthOnScroll();
    });

})