angular.module('VolpayApp').controller('ADFQueryConsolidatedByProcessingDateCrtl', function($scope, $timeout, $http, $filter,$state, $window, $location){

    //Init Form 
    $scope.initFormat = function() {
        $scope.date = '';
        $scope.informationOperator = '';
    }
    $scope.initFormat();

    //DateInit
    var date = $('#DateADF').datepicker({ 
        dateFormat: 'dd-mm-yy',
        autoclose: true,
        todayHighlight: true,
        daysOfWeekDisabled: [0, 6]
    }).val();
    
    //CTByProcessingDate
    $scope.SetCTByProcessingDate = function(){
        $scope.ProcessingDate = [
            {
                "label": "ADFQueryConsolidatedByProcessingDate.DateOfProcessing",
                "fieldName": "DateOfProcessing",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.InformationOperator",
                "fieldName": "InformationOperator",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.Cycle",
                "fieldName": "Cycle",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.DateOfReceipt",
                "fieldName": "DateOfReceipt",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.NumberOfTransactions",
                "fieldName": "NumberOfTransactions",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.TotalValue",
                "fieldName": "TotalValue",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }
        ]
    }
    $scope.SetCTByProcessingDate();

    // consolidatedTableByState
    $scope.SetCTByState = function(){
        $scope.ConsolidatedByState = [
            {
                "label": "ADFQueryConsolidatedByProcessingDate.State",
                "fieldName": "State",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.Quantity",
                "fieldName": "Quantity",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByProcessingDate.Value",
                "fieldName": "Value",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }
        ]
    }
    $scope.SetCTByState();

    // Array de consulta por estado
    $scope.SetConsolidatedByStateTableDetail = function(){
        $scope.ConsolidatedByStateTableDETAIL = [
                {
                    "estado": "Estado 1",
                    "cantidad": 60,
                    "valor": 600,
                    "visible": true,
                },
                {
                    "estado": "Estado 2",
                    "cantidad": 40,
                    "valor": 400,
                    "visible": true,
                },
                {
                    "estado": "Estado 3",
                    "cantidad": 20,
                    "valor": 200,
                    "visible": true,
                }
        ]
    }
    $scope.SetConsolidatedByStateTableDetail();

    $scope.seeDetail = function(register) {
        $state.go('app.ADFQueryConsolidatedByState');
    };
    // $scope.seeDetail();

    $scope.getTotalValue = function() {
        var total = 0;
        if ($scope.ConsolidatedByStateTableDETAIL) {
            for(var i = 0; i < $scope.ConsolidatedByStateTableDETAIL.length; i++){
                var item = $scope.ConsolidatedByStateTableDETAIL[i];
                total += item.valor;
            }
        }
        return total;
    };
    
    $scope.getTotalTransactions = function() {
        var total = 0;
        if ($scope.ConsolidatedByStateTableDETAIL) {
            for(var i = 0; i < $scope.ConsolidatedByStateTableDETAIL.length; i++){
                var item = $scope.ConsolidatedByStateTableDETAIL[i];
                total += item.cantidad;
            }
        }
        return total;
    };

    $scope.getTotalAmountByState = function(){
        var total = 0;
        if ($scope.ConsolidatedByStateTableDETAIL) {
            for(var i = 0; i < $scope.ConsolidatedByStateTableDETAIL.length; i++){
                var item = $scope.ConsolidatedByStateTableDETAIL[i];
                total += item.amountByState;
            }
        }
        return total;
    }

    //Call to API rest
    // var vm = this;
    // vm.records = [];

    // $scope.initCall = function() {
    //     // aquí puedes hacer la petición a la API para obtener los registros
    //     $http({
    //     method: 'GET',
    //     url: 'url de la API',
    //     params: {
    //         date: $scope.fecha,
    //         informationOperator: $scope.operadorDeInformacion
    //     }
    //     }).then(function successCallback(response) {
    //       // aquí manejas la respuesta de la API y asignas los registros a una variable para usarlos en la vista
    //         $scope.registros = response.data;
    //     }, function errorCallback(response) {
    //       // aquí manejas los errores de la petición a la API
    //     });
    // };

    
    // $scope.initCall = function(){
    // }
    // $scope.initCall();
});