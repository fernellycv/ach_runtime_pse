angular.module('VolpayApp').controller('bulkloadCtrl',  function($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("Bulk Load");
    $scope.labels = [
    "CycleName",
    "FileType",
    "RealFiles",
    // "ProcessedFiles",
    "TotalFilesInControlFile",
    "DifferenceNumberOfFiles",
    "TotalValueControlFile",
    "Status"];
    $scope.registers=[];

    $scope.TriggerBulkLoad = function (CycleID) {
        $http.post(BASEURL + "/rest/v2/bulkload/pullfiles").then(function (response) {
	        $scope.alerts = [{
	            type: 'success',
	            msg: '¡Cargando archivos! Una vez finalice el cargue, podrá ver el detalle en Instrucciones Recibidas.'
	        }];
	        setTimeout(function () {
	            $(".alert-success").hide();
	          }, 10000);
              $scope.GetAllPSEControlFiles({});
        }).catch(function (error) {
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.responseMessage
            }];
            setTimeout(function () {
                $(".alert-danger").hide();
              }, 10000);
        });
    }

    $scope.TriggerGenerateCtrFile = function () {
        $http.get(BASEURL + "/rest/v2/bulkload/generatectrfile").then(function (response) {
            console.log(response);
	        $scope.alerts = [{
	            type: 'success',
	            msg: response.data.responseMessage
	        }];
	        setTimeout(function () {
	            $(".alert-success").hide();
	          }, 10000);
              $scope.GetAllPSEControlFiles({});
        }).catch(function (error) {
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.responseMessage
            }];
            setTimeout(function () {
                $(".alert-danger").hide();
              }, 10000);
        });
    }

    $scope.GetAllPSEControlFiles = function (query) {
        $http.post(BASEURL + RESTCALL.GetAllPSEControlFiles,query).then(function (response) {
            $scope.registers = response.data;
        }).catch(function (error) {
            $scope.alerts = [{
                type: 'danger',
                msg: 'Error al obtener los archivos de control de PSE.'
            }];
            setTimeout(function () {
                $(".alert-danger").hide();
              }, 3000);
        });
    }

    $scope.setStylesTd = function (label) {
        const styles = {
            textAlign: 'center',
        }
        if (label == 'DifferenceNumberOfFiles') {
            styles.color = 'red';
        }
        if (label == 'TotalValueControlFile') {
            styles.textAlign = 'right';
        }
        return styles;
    }
    
    $scope.disabledBtns = function () {
        if ($scope.registers.length > 0) {
            let pullRegisters = $scope.registers.filter(item => item.Status === "PULL_COMPLETED")
            if (pullRegisters.length >0) {
                return true
            }
        }
        return false
    }

    $scope.GetAllPSEControlFiles({});
});

