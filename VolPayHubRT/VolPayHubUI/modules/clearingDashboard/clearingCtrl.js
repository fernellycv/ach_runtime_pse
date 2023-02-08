angular.module('VolpayApp').controller('clearingCtrl', function($scope, $window, $http, $filter, errorservice) {

    var clearingDetails = this;

    $http.get(BASEURL + RESTCALL.ClearingGetMopFamily).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        clearingDetails.mopFamily = data;

    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });



    $http.get(BASEURL + RESTCALL.ClearingGetLtermId).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        clearingDetails.ltermId = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });




    $http.get(BASEURL + RESTCALL.ClearingGetCurrentBusinessDate).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        clearingDetails.currentBusinessDate = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });



    angular.element($window).on('resize', function() {
        $scope.countVSMsgTypes = chartConfig('chart1', clearingDetails.countVSMsgTypes, 400, $('.my-charts').width(), ['#0099ff', '#00cc00'], 'Count vs Message Types', 'Message Types', 'Message Count');
        $scope.valueVSMsgTypes = chartConfig('chart2', clearingDetails.valueVSMsgTypes, 400, $('.my-charts').width(), ['#0099ff', '#00cc00'], 'Value M$ vs Message Types', 'Message Types', 'Value M$');
        $scope.msgTypeVSDirection = chartConfig('chart3', clearingDetails.msgTypeVSDirection, 400, $('.my-charts').width(), ['#00cc00', '#ffbf00', '#ff0000', '#0099ff', '#9e9e9e', '#f57c00'], 'Message Type / Sub type vs Direction', 'Message Type / Subtype', 'Message Count');
        $scope.$apply();
    });
    // wait for window resizes


    function chartService(data) {
        tempData = '/' + data.mopFamilyValue + '/' + data.ltermIdValue + '/' + data.currentBusinessDateValue;
        $http.get(BASEURL + RESTCALL.ClearingGetCountvsmsgTypes + tempData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            function construct(val) {
                var emptyObj = {}
                var getUniqueMType = [];
                var getUniqueDirection = [];
                var getUniqueSubtype = [];
                for (i = 0; i < val.length; i++) {
                    getUniqueMType.push(val[i]['messagetype'])
                    getUniqueDirection.push(val[i]['direction'])
                    getUniqueSubtype.push(val[i]['subtype'])
                }

                var UniqueMType = [...new Set(getUniqueMType)];
                var UniqueDirection = [...new Set(getUniqueDirection)];
                var UniqueSubtype = [...new Set(getUniqueSubtype)];

                // Data formatted and spliced for CountVSMsgType based on clubing SVC messageType
                var a = construct1(val, UniqueDirection, UniqueMType, 'count').filter(obj => obj.categorie.substring(0, 3) === "SVC");
                var svcObj = {},
                    svbArray = [],
                    svcCount = 0;
                svbArray.categorie = "SVC";
                svbArray.values = [];
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[i].values.length; j++) {
                        if (svbArray.values.length > 0 && a[i].values[j].rate in svbArray.values[0]) {
                            svbArray.values[0][a[i].values[j].rate] = svbArray.values[0][a[i].values[j].rate] + a[i].values[j].value;
                        } else {
                            svcObj[a[i].values[j].rate] = svcCount + a[i].values[j].value;
                        }
                    }
                    if (svbArray.values.length == 0) {
                        svbArray.values.push(svcObj);
                    }
                }

                var svcData = {
                    "categorie": svbArray.categorie,
                    values: [{
                        "value": svbArray.values[0]["IN"],
                        "rate": "IN"
                    }, {
                        "value": svbArray.values[0]["OUT"],
                        "rate": "OUT"
                    }]
                }
                const toSetCountVSMsgTypes = new Set(["MT10", "MT15", "MT16", "SVC"]);
                const tempCountVSMsgTypes = construct1(val, UniqueDirection, UniqueMType, 'count').concat([svcData]).filter(obj => toSetCountVSMsgTypes.has(obj.categorie));
                clearingDetails.countVSMsgTypes = tempCountVSMsgTypes;

                // Data spliced SCV message type in directions
                const toSetValueVSMsgTypes = new Set(["MT10", "MT15", "MT16"]);
                const tempValueVSMsgTypes = construct1(val, UniqueDirection, UniqueMType, 'value').filter(obj => toSetValueVSMsgTypes.has(obj.categorie));
                clearingDetails.valueVSMsgTypes = tempValueVSMsgTypes;

                // Data Formatted and spliced for msgTypeVSDirection based on clubing SVC messageType
                var svcmsgTypeVSDirection = construct2(val, UniqueSubtype, UniqueMType, 'count').filter(obj => obj.messageType.substring(0, 3) === "SVC");
                var svcMsgObj = {},
                    svbMsgArray = [];
                svcMsgObj.messageType = "SVC";
                for (var l = 0; l < svcmsgTypeVSDirection.length; l++) {
                    for (var s = 0; s < UniqueSubtype.length; s++) {
                        if (svbMsgArray.length > 0 && UniqueSubtype[s] in svbMsgArray[0]) {
                            svbMsgArray[0][UniqueSubtype[s]] = svbMsgArray[0][UniqueSubtype[s]] + svcmsgTypeVSDirection[l][UniqueSubtype[s]];
                        } else {
                            svcMsgObj[UniqueSubtype[s]] = svcmsgTypeVSDirection[l][UniqueSubtype[s]];
                        }
                    }
                    if (svbMsgArray.length == 0) {
                        svbMsgArray.push(svcMsgObj);
                    }
                }
                const toSetMsgTypeVSDirection = new Set(["MT10", "MT15", "MT16", "SVC"]);
                const tempMsgTypeVSDirection = construct2(val, UniqueSubtype, UniqueMType, 'count').concat(svbMsgArray).filter(obj => toSetMsgTypeVSDirection.has(obj.messageType));
                clearingDetails.msgTypeVSDirection = tempMsgTypeVSDirection;
            }

            function construct1(Arr, val1, val2, val3) {
                var finalArray = [];

                for (var k = 0; k < val2.length; k++) {
                    var emptyObj = {}
                    emptyObj.categorie = val2[k];
                    emptyObj.values = [];

                    for (var p = 0; p < val1.length; p++) {
                        var count = 0;
                        for (var s = 0; s < Arr.length; s++) {
                            if ((Arr[s]['messagetype'] == val2[k]) && (Arr[s]['direction']) == val1[p]) {
                                count = count + Arr[s][val3];
                            }
                        }
                        emptyObj.values.push({ "value": count, "rate": val1[p] });
                    }
                    finalArray.push(emptyObj);
                }
                return finalArray;
            }

            function construct2(Arr, val1, val2, val3) {
                //{ messagetype: "M10", "00": "10", "02": "15", "08": "9" },
                var finalArray = [];

                for (var k = 0; k < val2.length; k++) {
                    var emptyObj = {}
                    emptyObj.messageType = val2[k];
                    for (var p = 0; p < val1.length; p++) {
                        var count = 0;
                        for (var s = 0; s < Arr.length; s++) {
                            if ((Arr[s]['messagetype'] == val2[k]) && (Arr[s]['subtype']) == val1[p]) {
                                count = count + Arr[s][val3]
                            }
                        }
                        emptyObj[val1[p]] = count;
                    }
                    finalArray.push(emptyObj)
                }
                return finalArray;
            }
            if (data.length > 0) {
                construct(data);
                $scope.countVSMsgTypes = chartConfig('chart1', clearingDetails.countVSMsgTypes, 400, 500, ['#0099ff', '#00cc00'], 'Count vs Message Types', 'Message Types', 'Message Count');
                $scope.valueVSMsgTypes = chartConfig('chart2', clearingDetails.valueVSMsgTypes, 400, 500, ['#0099ff', '#00cc00'], 'Value M$ vs Message Types', 'Message Types', 'Value M$');
                $scope.msgTypeVSDirection = chartConfig('chart3', clearingDetails.msgTypeVSDirection, 400, 500, ['#00cc00', '#ffbf00', '#ff0000', '#0099ff', '#9e9e9e', '#f57c00'], 'Message Type / Sub type vs Direction', 'Message Type / Subtype', 'Message Count');
            } else {
                $scope.countVSMsgTypes = [];
                $scope.valueVSMsgTypes = [];
                $scope.msgTypeVSDirection = [];
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

        $http.get(BASEURL + RESTCALL.ClearingGetLtermFinalReport + tempData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            clearingDetails.ltermFinalReport = data;
            $scope.ltermFinalReport = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
    };

    clearingDetails.onSubmit = function(value) {
        clearingDetails.resetDate = moment().format('DD-MM-YYYY HH:mm:ss');
        chartService(value);
    };

    clearingDetails.onReset = function(value) {
        clearingDetails.resetDate = moment().format('DD-MM-YYYY HH:mm:ss');
        chartService(value);
    };

    function chartConfig(id, data, height, width, color, titles, xAxis, yAxis) {
        return {
            'id': id,
            'chartData': data,
            'height': height,
            'width': width,
            'color': color,
            'titles': titles,
            'xAxis': xAxis,
            'yAxis': yAxis
        }
    };

});