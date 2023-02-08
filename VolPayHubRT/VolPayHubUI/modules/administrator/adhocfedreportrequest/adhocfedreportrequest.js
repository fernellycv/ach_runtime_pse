angular.module('VolpayApp').controller('adhocfedreportrequestctrl', function($scope, $http, $state, $location, $timeout, $filter, $translate, $rootScope) {

    $scope.Reload = function() {
        $state.reload();
    }

    $scope.FedReportRequest = {}
    $scope.mopFamily = [];
    $scope.getAllMOPFamily = function() {

        $http({
            url: BASEURL + '/rest/v2/fedrepreq/getmopfamily',
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.mopFamily = data
                //$scope.AccountDomiciledCountry = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)

        });
    }

    $scope.getAllMOPFamily()

    $scope.getReportTypeList = function(mop) {
        $scope.ShowTable = false;
        $scope.IfNoGap = "";

        $http({
            url: BASEURL + '/rest/v2/fedrepreq/getreporttype/' + mop,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.ReportTypes = data
                //$scope.AccountDomiciledCountry = data;

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }
    $scope.getAllinputParams = function(mop, RT) {
        $scope.ShowTable = false; // to hide the table
        $scope.IfNoGap = "";

        $http({
            url: BASEURL + '/rest/v2/fedrepreq/getinputparam/' + mop + '/' + RT,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.InputParamData = data
            $scope.generateFields($scope.InputParamData);
            //$scope.AccountDomiciledCountry = data;

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.EndPointIDValue = '';

    $scope.getEndPointIDValue = function() {
        $http({
            url: BASEURL + '/rest/v2/fedrepreq/getltermid',
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.EndPointIDValue = data;
            //$scope.AccountDomiciledCountry = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }
    $scope.getInquiryBaValue = function() {
        $http({
            url: BASEURL + '/rest/v2/fedrepreq/getaba',
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.InquiryBaValue = data;
            //$scope.AccountDomiciledCountry = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.getCycleDateValue = function() {
        $http({
            url: BASEURL + '/rest/v2/fedrepreq/getbusinessdates',
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.CycValueValue = data;
            $scope.CycValueValue = data[0].actualvalue.split(',');
            //$scope.AccountDomiciledCountry = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }


    function httpCall(Urlval, field) {
        $http({
            url: Urlval,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            var SEQVALUE = data[0]['actualvalue'].split(',');
            var findSTARTSEQ = objectFindByKey(field, 'Key', 'START-SEQ');
            var findSTOPSEQ = objectFindByKey(field, 'Key', 'STOP-SEQ');
            findSTARTSEQ['Value'] = SEQVALUE[0];
            findSTOPSEQ['Value'] = SEQVALUE[1];
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    $scope.setRef = function(field) {
        field[2].Value = "";
        $scope.ShowTable = false;
        $scope.IfNoGap = "";
        $scope.gap = [];
    }
    $scope.isCycleDateSelected = false;
    $scope.getSEQValue = function(field) {
        $scope.IfNoGap = "";
        if (field[2].Value == 'R') {
            $scope.TRAFFIC_TYPE = field[2].Value;
            $scope.ENDPOINT_ID = field[0].Value;
            if (field[1].Value == "") {
                $scope.CYCLE_DATE = $scope.CycValueValue;
                $scope.isCycleDateSelected = true;
            } else {
                $scope.CYCLE_DATE = field[1].Value;
                $scope.isCycleDateSelected = false;
            }
            //$scope.ShowTable=true;
            $scope.IfNoGap = "";
            // rest call for OMAD GAP fatch  
            $http({
                url: BASEURL + '/rest/v2/fedrepreq/getomaddata/' + $scope.ENDPOINT_ID + '/' + $scope.CYCLE_DATE,
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.gap = data;
                if ($scope.gap.length != 0) {
                    if ($scope.gap.length == 1 && $scope.gap[0].length != 0) {
                        $scope.ShowTable = true;
                    } else if ($scope.gap.length == 3 && ($scope.gap[0].length != 0 || $scope.gap[1].length != 0 || $scope.gap[2].length != 0)) {
                        $scope.ShowTable = true;
                    } else {
                        $scope.IfNoGap = "No Gap found";
                    }
                }
                $scope.loop_count = $scope.gap[0].length / 2;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                //errorservice.ErrorMsgFunction(config, $scope, $http, status)
                $scope.IfNoGap = "No Gap found";
            });
        } else {
            $scope.TRAFFIC_TYPE = "";
        }

        var findLTERMID = objectFindByKey(field, 'Key', 'ENDPOINT-ID');
        var findTrafficType = objectFindByKey(field, 'Key', 'TRAFFIC-TYPE');
        var findCycType = objectFindByKey(field, 'Key', 'CYCLEDATE');


        if ((findLTERMID.Value) && (findTrafficType.Value)) {
            if (findCycType && (findCycType.Value) && $scope.FedReportRequest.ReportType == 'RetrievalRequest(FTI0051)') {
                cstUrl = '/rest/v2/fedrepreq/getimadomadfor51/'
                URL = BASEURL + cstUrl + findLTERMID['Value'] + '/' + findTrafficType['Value'] + '/' + findCycType['Value']
                httpCall(URL, field)
            } else {
                cstUrl = '/rest/v2/fedrepreq/getimadomadfor43/'
                URL = BASEURL + cstUrl + findLTERMID['Value'] + '/' + findTrafficType['Value']
                httpCall(URL, field)

            }

        }

    }﻿
    $scope.generateFields = function(InputParamData) {

        $scope.FedReportRequest.InputParam = [];

        $Params = '';
        $scope.getCycleDateValue()

        if (InputParamData[0]['actualvalue'].indexOf('*') != -1) {
            $Params = InputParamData[0]['actualvalue'].split('*');
            for (i in $Params) {
                var temp = $Params[i].split(':');
                var InputParam1 = {}
                if (temp[0] == 'ENDPOINT-ID') {
                    $scope.getEndPointIDValue();
                }
                if (temp[0] == 'INQUIRY-ABA') {
                    $scope.getInquiryBaValue();
                }
                InputParam1['Key'] = temp[0];
                InputParam1['Type'] = temp[1];
                if (temp[2] == 'dummy') {
                    InputParam1['Value'] = "";
                } else {
                    if (temp[2].indexOf(',') != -1) {
                        InputParam1['Value'] = "";
                        InputParam1['dropdown'] = true
                        InputParam1['Choice'] = temp[2].split(',');
                    } else {
                        InputParam1['Value'] = temp[2];
                    }
                }
                $scope.FedReportRequest.InputParam.push(InputParam1)
            }
        } else {
            $Params = InputParamData[0]['actualvalue'];

            var temp = $Params.split(':');
            var InputParam1 = {}
            if (temp[0] == 'ENDPOINT-ID') {
                $scope.getEndPointIDValue();
            }
            if (temp[0] == 'INQUIRY-ABA') {
                $scope.getInquiryBaValue();
            }

            InputParam1['Key'] = temp[0];
            InputParam1['Type'] = temp[1];
            if (temp[2] == 'dummy') {
                InputParam1['Value'] = "";
            } else {
                if (temp[2].indexOf(',') != -1) {
                    InputParam1['Value'] = "";
                    InputParam1['dropdown'] = true
                    InputParam1['Choice'] = temp[2].split(',');
                } else {
                    InputParam1['Value'] = temp[2];
                }
            }
            $scope.FedReportRequest.InputParam.push(InputParam1)

        }
        return $scope.FedReportRequest.InputParam;


    }

    function OBJtoXML(obj) {

        var xml = '';
        for (var prop in obj) {
            xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
            if (obj[prop] instanceof Array) {
                for (var array in obj[prop]) {
                    xml += "<" + prop + ">";
                    xml += OBJtoXML(new Object(obj[prop][array]));
                    xml += "</" + prop + ">";
                }
            } else if (typeof obj[prop] == "object") {
                xml += OBJtoXML(new Object(obj[prop]));
            } else {
                xml += obj[prop];
            }
            xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
        }
        var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
        return xml
    }

    $scope.ReportTypeTemp = ''
    $scope.createData = function(FedReportRequest) {


        var findSTARTSEQ_1 = objectFindByKey(FedReportRequest.InputParam, 'Key', 'START-SEQ');
        var findSTOPSEQ_1 = objectFindByKey(FedReportRequest.InputParam, 'Key', 'STOP-SEQ');

        if ((findSTARTSEQ_1) && (findSTOPSEQ_1)) {

            if (findSTARTSEQ_1['Value'].padStart(6, '0') <= findSTOPSEQ_1['Value'].padStart(6, '0')) {
                if ((findSTOPSEQ_1['Value'].padStart(6, '0') - findSTARTSEQ_1['Value'].padStart(6, '0') >= 50) && $scope.FedReportRequest.ReportType == 'RetrievalRequest(FTI0051)') {
                    $scope.alerts = [{
                        type: 'success',
                        msg: "Range between STARTSEQ and STOPSEQ is greater than 50"
                    }];
                    var start_seq = parseInt(findSTARTSEQ_1.Value);
                    var stop_seq = parseInt(findSTOPSEQ_1.Value);
                    var temp = start_seq;
                    var limit = 50;
                    var cnt;
                    if (stop_seq % 50 != 0) {
                        cnt = stop_seq / 50 + 1;
                    } else {
                        cnt = stop_seq / 50;
                    }
                    cnt = parseInt(cnt);
                    var start_obj = findSTARTSEQ_1;
                    var stop_obj = findSTOPSEQ_1;
                    for (var i = 0; i < cnt; i++) {
                        start_obj.Value = temp;
                        stop_obj.Value = limit;
                        for (var j = 0; j < FedReportRequest.InputParam.length; j++) {
                            if (FedReportRequest.InputParam[j].Key == 'START-SEQ') {
                                FedReportRequest.InputParam[j].Value = temp;
                            }

                            if (FedReportRequest.InputParam[j].Key == 'STOP-SEQ') {
                                FedReportRequest.InputParam[j].Value = stop_obj.Value;
                            }
                        }
                        $scope.FinalSubmit(FedReportRequest);

                        if ((limit + 50) < stop_seq) {
                            temp += 50;
                            limit += 50;
                        } else {
                            temp = limit + 1;
                            limit = stop_seq;
                        }
                    }
                } else {
                    $scope.FinalSubmit(FedReportRequest)
                }
            } else if (findSTARTSEQ_1['Value'].padStart(6, '0') && findSTOPSEQ_1['Value'] == "") {
                $scope.FinalSubmit(FedReportRequest)
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: 'STOP-SEQ must be greater than START-SEQ'
                }];
                setTimeout(function() {
                    $('.alert-danger').hide();
                }, 4000)
            }

        } else {
            $scope.FinalSubmit(FedReportRequest)
        }

    }


    $scope.FinalSubmit = function(FedReportRequest) {
        $scope.ReportTypeTemp = ''
        var forXML = {}
        if (FedReportRequest['InputParam']) {
            for (i in FedReportRequest['InputParam']) {
                delete FedReportRequest['InputParam'][i]['Type'];
                FedReportRequest['InputParam'][i]['dropdown'] ? delete FedReportRequest['InputParam'][i]['dropdown'] : '';
                FedReportRequest['InputParam'][i]['Choice'] ? delete FedReportRequest['InputParam'][i]['Choice'] : '';
            }
            if ($scope.FedReportRequest.ReportType == 'OMADGapException') {
                FedReportRequest['InputParam'][3].Value = ("00000" + FedReportRequest['InputParam'][3].Value).slice(-6);
                FedReportRequest['InputParam'][4].Value = ("00000" + FedReportRequest['InputParam'][4].Value).slice(-6);
            }
        }
        forXML.FedReportRequest = FedReportRequest
        $scope.ReportTypeTemp = angular.copy(FedReportRequest.ReportType)

        //textToBin

        $scope.finalXML = '<?xml version="1.0" encoding="UTF-8"?>' + OBJtoXML(JSON.parse(angular.toJson(forXML)));


        $scope.binaryXML = textToBin($scope.finalXML);

        var finalinputData = {}
        finalinputData.FedReportRequest = $scope.finalXML;
        //finalinputData.InstructionFileName = 'FedReportRequest.xml';
        //finalinputData.PSACode = 'TBS_INTERBANK_FedReportRequest';
		
		var UrlRT;
		if($scope.FedReportRequest.ReportType == "OMADGapException")
		{
			UrlRT = '/rest/v2/payments/addomadgapexception';
		}
		else{
			UrlRT = '/rest/v2/payments/servicerequest' ;
		}

        $http({
            url: BASEURL + UrlRT,
            method: "POST",
            data: finalinputData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.FedReportRequest = {}
            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }];
            setTimeout(function() {
                $('.alert-success').hide();
            }, 4000)
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.FedReportRequest = {}
            $scope.alerts = [{
                type: 'danger',
                msg: 'Request submission Failed'
            }];
        });
    }


    /* $scope.checkInput = function(data){
    	if(data['Key'] == "STOP-SEQ"){
    		for(k in $scope.FedReportRequest.InputParam){
    			if($scope.FedReportRequest.InputParam[k].Key == 'START-SEQ'){
    				if (($scope.FedReportRequest.InputParam[k].Value && data['Value'])) {
    					if(Number(data['Value']) < Number($scope.FedReportRequest.InputParam[k].Value)){

    						$scope.alerts = [{
    							type: 'danger',
    							msg: 'STOP-SEQ must be greater than START-SEQ'
    						}
    					];
    					}
    					
    				}
    			}
    		}
    	} else if(data['Key'] == "START-SEQ"){
    		for(j in $scope.FedReportRequest.InputParam){
    			if($scope.FedReportRequest.InputParam[j].Key == 'STOP-SEQ'){
    				if (($scope.FedReportRequest.InputParam[j].Value && data['Value']) ) {
    					if(Number(data['Value']) > Number($scope.FedReportRequest.InputParam[j].Value)){
    						$scope.alerts = [{
    							type: 'danger',
    							msg: 'STOP-SEQ must be greater than START-SEQ'
    						}
    					];
    					}
    					
    				}
    			}
    		}
    	}
    	
    	setTimeout(function(){
    		$('.alert-danger').hide()
    	},1000)
    	
    } */



});

angular.module('VolpayApp').directive('myDirective1', function() {
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

                var clean = val.replace(/[^-0-9\.]/g, '');
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

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});