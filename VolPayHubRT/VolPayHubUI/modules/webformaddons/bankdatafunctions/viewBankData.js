angular.module('VolpayApp').controller('webviewBankData', function($scope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions($stateParams.input.gotoPage.Name);
    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }
    $scope.auditError404 = true
    $scope.parentInput = $stateParams.input;
    $scope.fieldData = ($stateParams.input.fieldData) ? $stateParams.input.fieldData : {};
    $scope.IconName = ($scope.parentInput.gotoPage.IconName) ? $scope.parentInput.gotoPage.IconName : ''

    $scope.ParentIconName = ($stateParams.input.gotoPage.ParentIcon) ? $stateParams.input.gotoPage.ParentIcon : ''
        //if(('FDCParameters' in $scope.fieldData) && ($scope.fieldData['FDCParameters'].match(/</g)) && ($scope.fieldData['FDCParameters'].match(/>/g))){

    function getEventDetail(param) {
        $http({method: 'POST', url: BASEURL + '/rest/v2/ach/auditable/read/specific', data: { 'AUDIT_PK': param}}).then(function(response) {
            $scope.fieldData['EVENTDETAIL'] = response.data['EVENTDETAIL'];
        }, function(error) {
            //   $scope.data = error.data || 'Request failed';
        });
    }

    if($scope.parentInput.parentLink.toLowerCase() == 'ach/auditable') {
        getEventDetail($scope.fieldData.AUDIT_PK);
    }

    $scope.goToEditOperation = function(viewParam) {
        data ={
            TableName: $scope.parentInput.parentLink || '',
            BusinessPrimaryKey : {},
            IsLocked: true
        };
        if($scope.parentInput.primarykey && $scope.parentInput.primarykey.length > 0) {
            for (let i = 0; i < $scope.parentInput.primarykey.length; i++) {               
                data.BusinessPrimaryKey[$scope.parentInput.primarykey[i]] = viewParam.fieldData ? viewParam.fieldData[$scope.parentInput.primarykey[i]] : '';
            }            
        }
        data.BusinessPrimaryKey  = JSON.stringify(data.BusinessPrimaryKey);
        EntityLockService.checkEntityLock(data).then(function(data){          
            $scope.gotoState(viewParam);
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
            $('.my-tooltip').tooltip('hide');
    }

    $scope.gotoState = function(inputData) {
        $scope.parentInput['Operation'] = inputData['Operation']
        params = {};
        params.urlIdForAddon = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.urlOperationForAddon = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
        params.input = $scope.parentInput;
        params.query = $scope.parentInput.ulName.replace(/\s+/g, '');
        $state.go('app.addonoperation', params);
        $('.my-tooltip').tooltip('hide');
    }

    $scope.gotoParent = function(alertMsg) {
        $scope.input = {
            'gotoPage': $stateParams.input.gotoPage,
            'responseMessage': alertMsg
        }
        params = {};
        params.urlIdForAddon = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.query = $scope.parentInput.ulName.replace(/\s+/g, '');
        params.input = $scope.input;
        $state.go('app.webformPlugin', params);
    }


    /** List and Grid view Ends**/
    $scope.restResponse = {};

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
        }, function(error) {

            /* if (error.status == 401) {
            	if (configData.Authorization == 'External') {
            		window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
            	} else {
            		LogoutService.Logout();
            	}
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
            $scope.restResponse = {
                'Status': 'Error',
                'data': error.data.error.message
            }
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];

            return $scope.restResponse
        })
    }


    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete $scope.fieldData.$$hashKey
        $scope.delval = {}
        for (var j in $scope.parentInput.primarykey) {
            $scope.delval[$scope.parentInput.primarykey[j]] = $scope.fieldData[$scope.parentInput.primarykey[j]]
        }

        crudRequest("POST", $scope.parentInput.parentLink + '/delete', $scope.delval).then(function(response) {
            $scope.auditError404 = true;
            if (response.Status === 'Success') {
                $scope.gotoParent(response.data.data.responseMessage ? response.data.data.responseMessage : "Borrado exitosamente");
            }
        })
    }
    $scope.editedLog = [];
    $scope.dataLen = [];
    $scope.auditVal = {}
    for (var j in $scope.parentInput.primarykey) {
        $scope.auditVal[$scope.parentInput.primarykey[j]] = $scope.fieldData[$scope.parentInput.primarykey[j]]
    }

    if ($scope.parentInput.parentLink != 'logconfig') {
        crudRequest("POST", $scope.parentInput.parentLink + '/audit/readall', $scope.auditVal, {
            'start': 0,
            'count': 20
        }).then(function(response) {

            $scope.convertXmltoJson(response)
        })
    }


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
                            if (argu.data.data[j].tableName != "ApprovalCondition" && argu.data.data[j].tableName != "PartyServiceAssociation") {
                                xmlDoc = $.parseXML(argu.data.data[j][keyj]); //is valid XML
                                var constuctfromXml1 = convertXml2JSon(argu.data.data[j][keyj])
                                var constuctfromXml2 = constuctfromXml1[argu.data.data[j].tableName]

                            } else {
                                xmlDoc = argu.data.data[j][keyj]

                                var constuctfromXml = {};
                                var constuctfromXmlObj = {};
                                var constuctfromXmlarr = [];
                                $(xmlDoc).children().each(function(e) {
                                    $(this).each(function(e) {
                                        var parentName = $(this).prop("tagName")

                                        if ($(this).children().length) {
                                            constuctfromXml[parentName] = constuctfromXmlarr
                                            $(this).children().each(function(e) {
                                                constuctfromXmlObj[$(this).prop("tagName")] = $(this).text()
                                                constuctfromXmlarr.push(constuctfromXmlObj)
                                                constuctfromXmlObj = {}
                                            })
                                        } else {
                                            constuctfromXml[parentName] = $(this).text()
                                        }
                                    })
                                });
                            }


                            argu.data.data[j][keyj] = constuctfromXml2
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
            $('#auditModel').find('tbody').append('<tr><th>'+$filter('translate')('ApprovalDts.Field')+'</th><th>'+$filter('translate')('ApprovalDts.OldData')+'</th><th>'+$filter('translate')('ApprovalDts.NewData')+'</th></tr>')
        } else {
            $('#auditModel').find('tbody').append('<tr><th>'+$filter('translate')('ApprovalDts.Field')+'</th><th>'+$filter('translate')('ApprovalDts.Data')+'</th></tr>')
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
                _tr = _tr + "<td>" +$filter('translate')($scope.dataLen[0].tableName+'.'+_keys[j]) + "</td>";
                if (argu.oldData && argu.newData) {

                    if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (typeof(argu.oldData[_keys[j]]) == 'object') {
                            _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                        } else if (argu.oldData[_keys[j]] && typeof(argu.oldData[_keys[j]]) !== 'number' && argu.oldData[_keys[j]].match('{')) {
                            var _parsedJson = JSON.parse(argu.oldData[_keys[j]])

                            _tr = _tr + "<pre>" + $filter('beautify')(argu.oldData[_keys[j]]) + "</pre>"

                        } else {
                            if (argu.oldData[_keys[j]]) {
                                _tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                    if (argu.newData) {
                        if (argu.oldData && argu.newData[_keys[j]] != argu.oldData[_keys[j]]) {
                            _tr = _tr + "<td class=\"modifiedClass\">"
                        } else {
                            _tr = _tr + "<td>"
                        }
                        if (typeof(argu.newData[_keys[j]]) == 'object') {
                            _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                        } else if (argu.newData[_keys[j]] && typeof(argu.oldData[_keys[j]]) !== 'number' && argu.newData[_keys[j]].match('{')) {
                            var _parsedJson1 = JSON.parse(argu.newData[_keys[j]])

                            _tr = _tr + "<pre>" + $filter('beautify')(argu.newData[_keys[j]]) + "</pre>"

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

    $scope.getDisplayValue = function(cmprWith, cmprThiz) {

        if (cmprThiz || cmprThiz == false) {
            cmprThiz = cmprThiz.toString()
            for (k in cmprWith) {
                if (cmprWith[k].actualvalue == cmprThiz) {
                    return cmprWith[k].displayvalue
                }
            }
            return cmprThiz
        } else {

            return cmprThiz
        }
    }
    $scope.AssociatedVal = [];
    $scope.ReqAssociated = [{
            'AssociatedKey': [{
                    'FieldName': "ServiceCode",
                    'Label': "Service Code"
                },
                {
                    'FieldName': "ServiceName",
                    'Label': "Service Name"
                },
                {
                    'FieldName': "EffectiveFromDate",
                    'Label': "Effective From Date"
                },
                {
                    'FieldName': "EffectiveTillDate",
                    'Label': "Effective Till Date"
                },
                {
                    'FieldName': "Status",
                    'Label': "Status"
                },
            ],
            'gotoLink': 'services',
            'parentInfo': {
                'Link': 'servicegroups',
                'Label': 'Service Group',
                'fieldName': 'ServiceGroupCode'
            },
            'Key': [],
            'Data': []
        },
        {
            'AssociatedKey': [{
                    'FieldName': "BranchCode",
                    'Label': "Branch Code"
                },
                {
                    'FieldName': "BranchName",
                    'Label': "Branch Name"
                },
                {
                    'FieldName': "EffectiveFromDate",
                    'Label': "Effective From Date"
                },
                {
                    'FieldName': "EffectiveTillDate",
                    'Label': "Effective Till Date"
                },
                {
                    'FieldName': "Status",
                    'Label': "Status"
                },
            ],
            'gotoLink': 'branches',
            'parentInfo': {
                'Link': 'offices',
                'Label': 'Office',
                'fieldName': 'OfficeCode'
            },
            'Key': [],
            'Data': []
        }
    ]

    for (linking in $scope.ReqAssociated) {
        if ($scope.ReqAssociated[linking].parentInfo.Link == $scope.parentInput.parentLink) {
            $scope.AssociatedVal = $scope.ReqAssociated[linking];
            $scope.AssociatesInputData = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": $scope.AssociatedVal.parentInfo.fieldName,
                                    "operator": "=",
                                    "value": $scope.parentInput.fieldData[$scope.AssociatedVal.parentInfo.fieldName]
                                }]
                            }]
                        }]
                    }]
                },
                "sorts": [],
                "start": 0,
                "count": 20
            }
            gotoLoadmore($scope.AssociatedVal.gotoLink, $scope.AssociatesInputData)
        }
    }
    $scope.dtLen = 0

    function gotoLoadmore(argu1, argu2) {
        crudRequest("POST", argu1 + '/readall', argu2).then(function(response) {
            if (response.data.data.length != 0) {
                $scope.dtLen = response.data.data;
                $scope.AssociatedVal.Data = $scope.AssociatedVal.Data.concat(response.data.data);
                crudRequest("GET", argu1 + '/primarykey', '').then(function(response) {
                    $scope.setprimarykey = response.data.data.responseMessage
                })
            }
        })
    }

    $(document).ready(function() {
        $('.listView').on('scroll', function() {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                debounceHandler();
            }
        });

        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table');

            $tablesToFloatHeaders.floatThead({
                //useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);
            });
        })

        $(window).bind("resize", function() {
            setTimeout(function() {
                $(".listView").scrollLeft(30)
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }

        })
        $(window).trigger('resize');
    })

    $scope.isArray = function (what) {
        return Object.prototype.toString.call(what) === '[object Array]';
        
    }

    //I Load More datas on scroll
    var loadMore = function() {
        if ($scope.dtLen.length >= 20) {
            $scope.AssociatesInputData.start += 20;
            gotoLoadmore($scope.AssociatedVal.gotoLink, $scope.AssociatesInputData)
        }
    }

    var debounceHandler = _.debounce(loadMore, 700, true);

    $scope.gotoService = function(argu) {
        if (!argu.fieldData) {
            argu.fieldData = {}
            argu.fieldData[$scope.AssociatedVal.parentInfo.fieldName] = $scope.parentInput.fieldData[$scope.AssociatedVal.parentInfo.fieldName];
        }
        $scope.serviceInput = {
            'toPage': $scope.AssociatedVal.gotoLink,
            'val': argu
        }

        $state.go('app', {
            details: $scope.serviceInput
        }, {
            'reload': true
        });
    }

    $scope.callforPermission = function(_permission, _status) {
        if ((_status.match(/WAITFORAPPROVAL/g) || _status.match(/DELETED/g)))
            return '{C: false, D: false, R: false, U: false}'
        else
            return _permission
    }

    //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {
            crudRequest("POST", $scope.parentInput.parentLink + '/audit/readall', $scope.auditVal, {
                'start': len,
                'count': 20
            }).then(function(response) {
                $scope.dataLen = response.data.data
                if (response.data.data.length != 0) {
                    $scope.convertXmltoJson(response)
                        //$scope.editedLog = $scope.editedLog.concat($scope.dataLen)
                    len = len + 20;
                }
            })

        }
    }

    //	var debounceHandler = _.debounce(loadMore, 700, true);
    $('.editBody').on('scroll', function() {
        if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {

        }
    });
    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {

        var GetPrimaryKeys = angular.copy($scope.parentInput.primarykey);

        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }
        crudRequest("POST", $stateParams.input.gotoPage.Link + "/reactivate", reactivateObj).then(function(response) {
            $scope.gotoParent(response.data.data.responseMessage)
        })
        $('.my-tooltip').tooltip('hide');
    }

    $scope.clearAuditLog = function(s) {
        return $filter('translate')(s).replace('AuditLogs.', '');
    }
});
