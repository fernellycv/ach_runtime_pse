angular.module('VolpayApp').controller('operation', function($scope, $rootScope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService, editservice, errorservice,$interval, EntityLockService) {

    /** Dynamic web-form implementation */
    // var crud_request = function({ method, url, headers, query, data, params }) {

    //     return $http({ method, url, headers, query, data, params })
    // }
   
    var error_msg = function(error) {
        console.error(error);
    }

    /** Specific read call to get the updated entry*/
    var getData = function() {
            // return crud_request({
            //     'method': "POST",
            //     'url': BASEURL + "/rest/v2/" + $stateParams['input']['urlLink']['Link'] + "/read",
            //     'data': $stateParams['input']['data']
            // })
            return $http.post(BASEURL + "/rest/v2/" + $stateParams['input']['urlLink']['Link'] + "/read",$stateParams['input']['data']).then(function onSuccess(response) { })

        }
        /** Specific read call to get the updated entry*/
    $scope.showaudit = function(argu) {
        $scope.costructAudit(argu)
        $('#auditModel').modal('toggle');
    }

    $scope.profileName = $stateParams['input']['urlLink']['Link']

    /** Initial Function */
    $scope.inputParams = $stateParams['input'];

    $scope.metaInfo = $stateParams['input']['metaInfo'];
    $scope.data = [];

    $scope.data = $stateParams['input']['data']

    if (Object.values($stateParams['input']['data']).length) {
        // getData().then(function(response) {

        //     $scope.data = response['data'];

        // }).catch(error_msg);
    } else {
        $scope.data = $stateParams['input']['data'];
    }

    function crudRequest(_method, _url, _data, _query) {

        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _query
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }
            return $scope.restResponse
        }, function(error, status, headers, config) {

            if (status != 404) {
                errorservice.ErrorMsgFunction(config, $scope, $http, status)

                $scope.restResponse = {
                    'Status': 'Error',
                    'data': error.data.error.message
                }
            }
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            return $scope.restResponse
        })
    }
    
    $scope.editedLog = [];
    $scope.dataLen = [];
    $scope.auditVal = {}

    if ($scope.inputParams['Operation'] != 'Add') {

        for (var j in $scope.inputParams.primaryKey) {

            $scope.auditVal[$scope.inputParams.primaryKey[j]] = $scope.inputParams.data[$scope.inputParams.primaryKey[j]]
        }
        crudRequest("POST", $scope.profileName + '/audit/readall', $scope.auditVal, {
            'start': 0,
            'count': 20
        }).then(function(response) {
            $scope.convertXmltoJson(response)
        })
    }

    //I Load More datas on scroll  
    var len = 20;

    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {

            crudRequest("POST", BASEURL + '/rest/v2/' + $scope.profileName + '/audit/readall', $scope.auditVal, {
                'start': len,
                'count': 20
            }).then(function(response) {
                $scope.dataLen = response.data.data

                // if (response.data.data.length != 0) {
                // 	$scope.convertXmltoJson(response)
                // 	$scope.editedLog = $scope.editedLog.concat($scope.dataLen)
                // 	len = len + 20;
                // }
            })
        }
    }

    var debounceHandler = _.debounce(loadMore, 700, true);
    $('.editBody').on('scroll', function() {
        if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
            //debounceHandler(); //Don't uncomment this line 

        }
    });

    $scope.convertXmltoJson = function(argu) {
        if ((argu.Status == 'Error') && (!argu.data.data)) {
            $scope.auditError404 = false;
        } else {
            for (var j in argu.data.data) {
                for (var keyj in argu.data.data[j]) {
                    if (keyj == 'oldData' || keyj == 'newData') {
                        argu.data.data[j][keyj] = $filter('hex2a')(argu.data.data[j][keyj])
                        if (argu.data.data[j][keyj].match(/</g) && argu.data.data[j][keyj].match(/>/g)) {
                            var xmlDoc;
                            if (argu.data.data[j].tableName == "PartyServiceAssociation") {
                                if ($(sanitize(argu.data.data[j][keyj])) && $(sanitize(argu.data.data[j][keyj])).find('FDCParameters').html() && $(sanitize(argu.data.data[j][keyj])).find('FDCParameters').html().indexOf('<!--?') != -1) {
                                    var _fdcStringfy = argu.data.data[j][keyj].substring(argu.data.data[j][keyj].indexOf('<FDCParameters>') + '<FDCParameters>'.length, argu.data.data[j][keyj].indexOf('</FDCParameters>'))
                                    argu.data.data[j][keyj] = argu.data.data[j][keyj].replace(_fdcStringfy, JSON.stringify(convertXml2JSon(_fdcStringfy)))
                                }
                                if ($(sanitize(argu.data.data[j][keyj])) && $(sanitize(argu.data.data[j][keyj])).find('PDCParameters').html() && $(sanitize(argu.data.data[j][keyj])).find('PDCParameters').html().indexOf('<!--?') != -1) {
                                    var _fdcStringfy = argu.data.data[j][keyj].substring(argu.data.data[j][keyj].indexOf('<PDCParameters>') + '<PDCParameters>'.length, argu.data.data[j][keyj].indexOf('</PDCParameters>'))
                                    argu.data.data[j][keyj] = argu.data.data[j][keyj].replace(_fdcStringfy, JSON.stringify(convertXml2JSon(_fdcStringfy)))
                                }
                            }
                            var demoval = convertXml2JSon(argu.data.data[j][keyj])
                            if (!demoval) {
                                xmlDoc = argu.data.data[j][keyj] ? argu.data.data[j][keyj] : '';
                                if (xmlDoc) {
                                    var newTxt = xmlDoc.split('<');
                                    var genkeys = []
                                    for (var i = 1; i < newTxt.length; i++) {
                                        if (newTxt[i].split('>')[0] && newTxt[i].split('>')[0].indexOf('/') == -1) {
                                            genkeys.push(newTxt[i].split('>')[0])
                                        }
                                    }
                                    var constuctfromXml = {};
                                    var constuctfromXmlObj = {};
                                    var constuctfromXmlarr = [];
                                    $(sanitize(xmlDoc)).children().each(function(e) {
                                        $(this).each(function(e) {
                                            for (var keys in genkeys) {
                                                if (genkeys[keys].toUpperCase() == $(this).prop("tagName")) {
                                                    var parentName = genkeys[keys];
                                                }
                                            }
                                            if ($(this).children().length) {
                                                constuctfromXml[parentName] = constuctfromXmlarr
                                                $(this).children().each(function(e) {
                                                    for (var keys in genkeys) {
                                                        if (genkeys[keys].toUpperCase() == $(this).prop("tagName")) {
                                                            constuctfromXmlObj[genkeys[keys]] = $(this).text()
                                                        }
                                                    }
                                                })
                                                constuctfromXmlarr.push(constuctfromXmlObj)
                                                constuctfromXmlObj = {}
                                            } else {
                                                constuctfromXml[parentName] = $(this).text()
                                            }
                                        })
                                    });
                                    argu.data.data[j][keyj] = constuctfromXml;
                                }
                            } else {
                                for (var expout in demoval) {
                                    argu.data.data[j][keyj] = demoval[expout]
                                }
                            }
                        } else {
                            argu.data.data[j][keyj] = (argu.data.data[j][keyj].indexOf('{') != -1) ? JSON.parse(argu.data.data[j][keyj]) : false
                        }
                    }
                }
            }
            $scope.editedLog = $scope.editedLog.concat(argu.data.data)
            $scope.dataLen = $scope.dataLen.concat(argu.data.data)
        }
    }

    $scope.auditLogDetails = "";
    $scope.commentVal = "";
    $scope.costructAudit = function(argu) {

        $scope.auditLogDetails = argu
        $('#auditModel').find('tbody').html('')

        if (argu.oldData && argu.newData) {
            $('#auditModel').find('tbody').append('<tr><th>Field</th><th>Old Data</th><th>New Data</th></tr>')
        } else {
            $('#auditModel').find('tbody').append('<tr><th>Field</th><th>Data</th></tr>')
        }
        var _keys = ''

        if ($.isPlainObject(argu.oldData) && $.isPlainObject(argu.newData)) {
            _keys = (Object.keys(argu.oldData).length >= Object.keys(argu.newData).length) ? Object.keys(argu.oldData) : Object.keys(argu.newData)
        } else if ($.isPlainObject(argu.oldData)) {
            _keys = Object.keys(argu.oldData)
        } else if ($.isPlainObject(argu.newData)) {
            _keys = Object.keys(argu.newData)
        }

        for (var j in _keys) {
            if (!_keys[j].match(/_PK/g)) {
                var _tr = ""
                if (j % 2) {
                    _tr = "<tr style='background-color: rgb(245, 245, 245)'>"
                } else {
                    _tr = "<tr style='background-color: #fff'>"
                }
                _tr = _tr + "<td>" + $filter('camelCaseFormatter')(_keys[j]) + "</td>";
                if (argu.oldData && argu.newData) {
                    if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (typeof(argu.oldData[_keys[j]]) == 'object') {
                            _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                        } else if (argu.tableName != "BusinessRules" && argu.oldData[_keys[j]] && typeof(argu.oldData[_keys[j]]) !== 'number' && argu.oldData[_keys[j]].match('{')) {
                            var _parsedJson = JSON.parse(argu.oldData[_keys[j]])
                            _tr = _tr + "<pre>" + $filter('beautify')(argu.oldData[_keys[j]]) + "</pre>"
                        } else if (argu.tableName == "BusinessRules" && _keys[j] == "RuleStructure") {
                            _tr = _tr + "<pre>" + $filter('beautify')(hexToString(argu.oldData[_keys[j]])) + "</pre>"
                        } else {
                            if (argu.oldData[_keys[j]]) {
                                _tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                    if (argu.newData) {
                        if (argu.oldData && argu.newData[_keys[j]] != argu.oldData[_keys[j]]) {
                            if (typeof(argu.newData[_keys[j]]) == 'object' && typeof(argu.oldData[_keys[j]]) == 'object') {
                                if (JSON.stringify(argu.newData[_keys[j]]) === JSON.stringify(argu.oldData[_keys[j]])) {
                                    _tr = _tr + "<td>"
                                } else {
                                    _tr = _tr + "<td class=\"modifiedClass\">"
                                }
                            } else {
                                _tr = _tr + "<td class=\"modifiedClass\">"
                            }
                        } else {
                            _tr = _tr + "<td>"
                        }
                        if (typeof(argu.newData[_keys[j]]) == 'object') {
                            _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                        } else if (argu.tableName != "BusinessRules" && argu.newData[_keys[j]] && typeof(argu.oldData[_keys[j]]) !== 'number' && argu.newData[_keys[j]].match('{')) {
                            var _parsedJson1 = JSON.parse(argu.newData[_keys[j]])
                            _tr = _tr + "<pre>" + $filter('beautify')(argu.newData[_keys[j]]) + "</pre>"
                        } else if (argu.tableName == "BusinessRules" && _keys[j] == "RuleStructure") {
                            _tr = _tr + "<pre>" + $filter('beautify')(hexToString(argu.newData[_keys[j]])) + "</pre>"
                        } else {
                            if (argu.newData[_keys[j]]) {
                                _tr = _tr + argu.newData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                } else {
                    if (argu.newData) {
                        _tr = _tr + "<td>"
                        if (argu.newData[_keys[j]]) {
                            if (typeof(argu.newData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.newData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    } else if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (argu.oldData[_keys[j]]) {
                            if (typeof(argu.oldData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                }
                $('#auditModel').find('tbody').append(_tr)
            }
        }

        if ((argu.action).match(/:/g)) {
            $scope.commentVal = (argu.action).split(/:(.+)/)
        } else {
            $scope.commentVal = ""
        }
    }

    $scope.showaudit = function(argu) {
        $scope.costructAudit(argu)
        $('#auditModel').modal('toggle');
    }

    /** Initial Function */

    function cleantheinputdata(argu) {
        for (var k in argu) {
            if ($.isPlainObject(argu[k])) {
                var isEmptyObj = cleantheinputdata(argu[k])
                if ($.isEmptyObject(isEmptyObj)) {
                    delete argu[k]
                }
            } else if (Array.isArray(argu[k])) {
                for (var n in argu[k]) {
                    var isEmptyObj1 = cleantheinputdata(argu[k][n])
                    if ($.isEmptyObject(isEmptyObj1)) {
                        argu[k].splice(n, 1);
                    } else if (isEmptyObj1.$$hashKey) {
                        delete isEmptyObj1.$$hashKey
                    }
                }
                if (argu[k].length) {
                    var _val_ = true;
                    for (var j in argu[k]) {
                        if ($.isPlainObject(argu[k][j])) {
                            _val_ = false
                        }
                    }
                    if (_val_) {
                        argu[k] = argu[k].toString()
                    }
                } else {
                    delete argu[k]
                }
            } else if (argu[k] === "" || argu[k] === undefined || argu[k] === null) {
                delete argu[k]
            } else {
                argu[k] = argu[k]
            }
        }
        return argu
    }

    $scope.gotoState = function(inputData) {

        var details = {
            metaInfo: $scope.meta_info,
            primaryKey: $scope.primary_key,
            urlLink: $stateParams.input.gotoPage,
            data: inputData['fieldData'] ? getUniquefield(inputData['fieldData']) : {}
        }
        // details = Object.assign(details, inputData);
        details = $.extend(details, inputData);
        delete details['fieldData'];

        $state.go('app.dynamicFormsOperation', {
            input: details
        });
    }

    $scope.gotoEdit = function() {
        $scope.parentInput['Operation'] = 'Edit';
    }
    $scope.gotoClone = function() {
        $scope.parentInput['Operation'] = 'Clone';

        for (var k = 0; k < $scope.parentInput['primaryKey'].length; k++) {
            if ($scope.parentInput['data']) {
                $scope.data[$scope.parentInput['primaryKey'][k]] = ''
            }
        }
    }

    if ($scope.inputParams['Operation'] == 'Clone') {

        for (var k = 0; k < $scope.inputParams['primaryKey'].length; k++) {
            if ($scope.inputParams['data']) {
                $scope.data[$scope.inputParams['primaryKey'][k]] = ''
            }
        }
    }

    $scope.unlockEntityToEdit = function() {       

        var data = {}; // have to form the request payload
        data['TableName'] = 'interfacebulkprofiles';      
        data['IsLocked'] = false;
        data['BusinessPrimaryKey'] = JSON.stringify({'InterfaceBulkProfileCode' : $scope.data.InterfaceBulkProfileCode});        

        EntityLockService.checkEntityLock(data).then(function(data){                 
            $scope.gotoParent();           
         })
         .catch(function(response){          
            var status = response.status;
            var config = response.config;
            if (response.status === 400) {
                var errMsg = response.data.error.message ? response.data.error.message : 'Unknown issue';
                $scope.alerts = [{
                    type: 'danger',
                    msg: errMsg
                }];
            }
         }); 
    }

    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    }
        
    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete $scope.data.$$hashKey
        $scope.delval = {}

        for (i = 0; i <= $scope.parentInput['primaryKey'].length; i++) {
            if ($scope.parentInput['primaryKey'][i] != undefined) {
                $scope.delval[$scope.parentInput['primaryKey'][i]] = $scope.data[$scope.parentInput['primaryKey'][i]]
            }
        }
        crudRequest("POST", $scope.parentInput['urlLink']['Link'] + '/delete', $scope.delval).then(function(response) {
            $scope.auditError404 = true;
            if (response.Status === 'Success') {
                $scope.gotoParent(response.data.data.responseMessage ? response.data.data.responseMessage : "Borrado exitosamente");
            }
        })
    }
$scope.webformSubmit = false
    $scope.on_submit = function(data) {

        var backup_data = angular.copy(data)
        backup_data = cleantheinputdata(backup_data);       
        // crud_request({
        //     'method': ($scope.parentInput['Operation'].toLowerCase() === 'edit') ? "PUT" : "POST",
        //     'url': BASEURL + "/rest/v2/" + $stateParams['input']['urlLink']['Link'],
        //     'data': backup_data
        // }).then(function(success) { 
        $scope.method = ($scope.parentInput['Operation'].toLowerCase() === 'edit') ? "PUT" : "POST"       
        crudRequest($scope.method,  $stateParams['input']['urlLink']['Link'],backup_data).then(function(success) {

            if($scope.parentInput['Operation'] === 'Edit') {
                $scope.unlockEntityToEdit();
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
                $(window).off( "mousemove keydown click" ); 
            }else{                  
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
                $(window).off( "mousemove keydown click" ); 
                
                params = {};
                params.urlId = $filter('removeSpace')($stateParams.input.urlLink.Name).toLowerCase();
                params.urlOperation = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
                params.input = { gotoPage: $stateParams['input']['urlLink'], responseMessage: success['data']['responseMessage'] };            
                $state.go('app.dynamicForms', params);            
            }            

        }, function(error) {
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
        })
    }

    /** Dynamic web-form implementation */

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })

    $rootScope.$on("MyEventforEditIdleTimeout", function(evt, data) {       
        $(window).off("mousemove keydown click");       
        $interval.cancel(findEvent);       
    })

    //idletime Start
    var findEvent;
    var secondfindEvent;
    $scope.count = 0;
    $scope.seccount = 10;   
    var editTimeoutCounter = sessionStorage.entityEditTimeout * 60; 
    //var editTimeoutCounter = 15;
    if ($stateParams.input.Operation === 'Edit') {
        $scope.findIdleTime = function() {
            findEvent = $interval(function() {               
                $scope.count += 1;
                
                if ($scope.count === editTimeoutCounter) {                    
                    if ($scope.parentInput.Operation === 'Edit') {
                        $scope.unlockEntityToEdit();
                        $scope.stopIdleTimer();
                        $scope.stopsecondIdleTimer();
                        $scope.gotoParent();
                    }                    
                }                                          
            }, 1000);

        };
        $scope.findIdleTime();

        $scope.callIdleTime = function() {
            
            setTimeout(function() {
                $("#idletimeout_model").modal("show");
            }, 100)

            secondfindEvent = $interval(function() {             
                $(window).on("mousemove keydown click", function() { // find the window event
                    $scope.stopsecondIdleTimer();
                    $scope.seccount = 10;
                    // $scope.findIdleTime();
                    setTimeout(function() {
                        $("#idletimeout_model").modal("hide");
                    }, 100)

                });
                $scope.seccount -= 1;
                if ($scope.seccount === 0) {             
                    $scope.stopsecondIdleTimer();
                    $stateParams.input.Operation = "";
                    $scope.gotoParent();
                }
            }, 1000);
        }
    }else{
    //    $scope.stopIdleTimer();
    //    $scope.stopsecondIdleTimer();
    }
    
   
       $scope.stopsecondIdleTimer = function() {
           if (angular.isDefined(secondfindEvent)) { 
               // $(window).off('mousemove keydown click', secondfindEvent); 
               $(window).off( "mousemove keydown click" );           
               // clearInterval(secondfindEvent)              
               $interval.cancel(secondfindEvent);
               secondfindEvent = undefined;
            }
       };
   
       $scope.stopIdleTimer = function() {
           if (angular.isDefined(findEvent)) {
               // $(window).off('mousemove keydown click', findEvent)ca; 
               // $(document).off( "mousemove" );           
               // clearInterval(findEvent)             
               $interval.cancel(findEvent);
               findEvent = undefined;
            }
       };

    $scope.parentInput = angular.copy($stateParams.input);
    $scope.Title = $scope.parentInput.pageTitle;
    $scope.ulName = $scope.parentInput.ulName;
    $scope.IconName = ($scope.parentInput.urlLink.IconName) ? $scope.parentInput.urlLink.IconName : ''
    $scope.showPageTitle = $filter('nospace')($scope.Title);
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle);
    $scope.showsubTitle = $scope.showPageTitle + '.Edit';
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle';

    $scope.gotoParent = function(alertMsg) {
        $scope.input = {
            'gotoPage': $stateParams.input.urlLink,
            'responseMessage': alertMsg
        }
        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.urlLink.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
        params.input = $scope.input;
        params.query = 'dynamicForms';

        $state.go('app.dynamicForms', params);
    }

    $scope.gotoCancelFn = function() {

        // $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $scope.unlockEntityToEdit();
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();  
            $scope.gotoParent();
        }
    }
});
