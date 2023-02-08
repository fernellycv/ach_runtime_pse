angular.module('VolpayApp').controller('executeadhocCtrl', function($scope, $http, $rootScope) {
    $scope.alerts = [];

    $scope.reset_data = function() {
        $scope.workorderData = { WorkOrderInputParameters: [{}] };
        $('select').each(function() {
            $(this).val('').trigger('change.select2');
        })
        setTimeout(function() {
            $('[name=WorkOrderExt]').val('').trigger('change.select2');
        }, 0)
    }
    var get_default_field_details = function(name, metainfo) {
        for (var field in metainfo['field']) {
            if (metainfo['field'][field]['name'] === name) {
                return metainfo['field'][field];
            } else if (metainfo['field'][field]['type'] === 'Section') {
                return get_default_field_details(name, metainfo['field'][field])
            }
        }
    }

    var clean_input_data = function(argu) {
        for (var k in argu) {
            if ($.isPlainObject(argu[k])) {
                var isEmptyObj = clean_input_data(argu[k]);
                if ($.isEmptyObject(isEmptyObj)) {
                    delete argu[k]
                }
            } else if (Array.isArray(argu[k])) {
                var isEmptyObj = clean_input_data(argu[k]);
                if (isEmptyObj.length) {
                    var type = get_default_field_details(k, $scope.metaInfo);
                    if (type['type'] !== 'Section') {
                        argu[k] = argu[k].toString()
                    }
                } else {
                    delete argu[k];
                }
            } else if (argu[k] === "" || argu[k] === undefined || argu[k] === null) {
                delete argu[k]
            } else {
                argu[k] = argu[k]
            }
        }
        return argu
    }

    var delete_unwanted_fields = function(metainfo) {
        return metainfo['field'].filter(function(field) {
            if (field['name'] === 'WorkOrderInputParameters') {
                field['field'].forEach(function(fields) {
                    if (fields['name'] === 'key') {
                        fields['renderer'][fields['renderer']['type']]['customattributes']['property'].forEach(function(property) {
                            if (property['name'].toLowerCase().indexOf('rest') !== -1) {
                                property['value'] = "workorder/paramkey/wotype/{workOrder[WorkOrderType]}"
                            }
                        })
                    } else if (fields['name'] === 'value') {
                        fields['renderer'][fields['renderer']['type']]['customattributes']['property'].forEach(function(property) {
                            if (property['name'].toLowerCase().indexOf('rest') !== -1) {
                                property['value'] = "workorder/paramval/{key}/{workOrder[WorkOrderType]}"
                            }
                        })
                    }
                })
                return field;
            }
        })
    }

    $scope.onSubmit = function(argu) {
        var backup_argu = clean_input_data(angular.copy(argu));
        //var portal = protocol_host_port ? protocol_host_port : diffRestServer.Protocol + '://' + diffRestServer.RESTDomainName + ':' + diffRestServer.Port;
        $http({
            method: 'POST',
            url: BASEURL + '/rest/v2/executeadhoc/execute',
            data: backup_argu,
            query: {},
            async: false,
            cache: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            $scope.alerts = [];
            $scope.alerts = [{
                type: 'success',
                msg: response['data']['responseMessage']
            }]
            $scope.reset_data();
            setTimeout(function() {
                // $('[name=WorkOrderExt]').val('').trigger('change.select2');
            }, 0)
        }, function(error) {
            $scope.alerts = [];
            $scope.alerts = [{
                type: 'danger',
                msg: error['data']['error']['message']
            }]
        })
    }

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
    }

    $scope.widthOnScroll();

    /*** On window resize ***/
    $(window).resize(function() {
        $scope.$apply(function() {
            $scope.alertWidth = $('.alertWidthonResize').width();
        });
    });


    $scope.metaInfo = {};
    $scope.workorderData = {};
    $scope.webformSubmit = false;
    $(document).ready(function() {
        if ($.isEmptyObject($scope.metaInfo)) {
            $http({
                method: 'GET',
                url: BASEURL + '/rest/v2/workorder/metainfo',
                data: {},
                params: {},
                async: false,
                cache: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(data) {

                $scope.metaInfo = beautifyObj(data.data.Data);
                $scope.workorderData = { WorkOrderInputParameters: [{}] };
                $scope.metaInfo = { name: "Default", type: "WebFormDesigner", field: delete_unwanted_fields($scope.metaInfo) };
                $scope.alerts = [];
                var pageLimitCount = 20;
                var select_config = {
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true,
                    tags: false,
                    ajax: {
                        url: BASEURL + "/rest/v2/workorder/readall",
                        type: 'POST',
                        headers: {
                            "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                            "source-indicator": configData.SourceIndicator,
                            "Content-Type": "application/json"
                        },
                        dataType: 'json',
                        delay: 500,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                xhr.withCredentials = true
                        },
                        crossDomain: true,
                        data: function(params) {
                            var query = {
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            }
                            if (params.term) {
                                query = constructQuery({
                                    Queryfield: [{
                                        "ColumnName": "WorkOrderName",
                                        "ColumnOperation": "like",
                                        "ColumnValue": params.term
                                    }],
                                    start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                    count: pageLimitCount
                                });
                            }
                            return JSON.stringify(query);
                        },
                        processResults: function(data, params) {
                            params.page = params.page ? params.page : 0;
                            return {
                                results: $.map(data, function(item) {
                                    return {
                                        text: item['WorkOrderId'],
                                        id: item['WorkOrderId'],
                                        data: item
                                    }
                                }),
                                pagination: {
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },
                        cache: true
                    }
                };
                $('[name=workOrder]').select2(select_config).trigger('change.select2');
                $scope.WorkOrderType = '';
                $('[name=workOrder]').on('change', function() {
                    $scope.WorkOrderType = '';
                    $scope.alerts = [];
                    var val = angular.copy($(this).select2('data'));

                    $scope.WorkOrderType = val[0]['data']['WorkOrderType'];
                    //	dummy($rootScope.WorkOrderType)
                    if (val && val[0]['data']) {
                        if (val[0]['data']['WorkOrderExt']) {
                            $http({ method: 'GET', url: BASEURL + '/rest/v2/workorderextensionprofile/workorderext/code/' + $scope.WorkOrderType, data: {}, params: { start: 0, count: 20, search: val[0]['data']['WorkOrderExt'] } }).then(function(response) {

                                $('[name=WorkOrderExt]').find('option').remove();
                                response.data.forEach(function(item) {
                                    var option = new Option(item['displayvalue'], item['actualvalue']);
                                    $('[name=WorkOrderExt]').append(option).trigger('change.select2');
                                })
                                $('[name=WorkOrderExt]').val(val[0]['data']['WorkOrderExt']).trigger('change.select2');
                            })
                        } else {
                            setTimeout(function() {
                                $('[name=WorkOrderExt]').val('').trigger('change.select2');
                            }, 0)
                        }
                        $scope.$apply(function() {
                            $scope.workorderData = Object.assign($scope.workorderData, { WorkOrderInputParameters: val[0]['data']['WorkOrderInputParameters'], workOrderExtension: val[0]['data']['WorkOrderExt'] });
                        })
                        $scope.metaInfo['field'].forEach(function(field) {
                            field['field'].forEach(function(fields) {
                                if (fields['name'] === 'value') {
                                    fields['renderer'][fields['renderer']['type']]['customattributes']['property'].forEach(function(property) {
                                        if (property['name'].toLowerCase().indexOf('rest') !== -1) {
                                            if (val[0]['data']['WorkOrderType']) {
                                                property['value'] = "workorder/paramval/{key}/{workOrder[WorkOrderType]}"
                                            } else {
                                                property['value'] = "workorder/paramval/{key}/WorkOrderType"
                                            }
                                        }
                                    })
                                }
                            })
                        })
                    } else {
                        $scope.reset_data();
                        setTimeout(function() {
                            $('[name=WorkOrderExt]').val('').trigger('change.select2');
                        }, 0)
                    }
                })
                var select_config_workOrderExt = {
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true,
                    tags: false,
                    ajax: {
                        url: function(arg) {
                            return BASEURL + "/rest/v2/workorderextensionprofile/workorderext/code/" + $scope.WorkOrderType
                        },
                        type: 'GET',
                        headers: {
                            "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                            "source-indicator": configData.SourceIndicator,
                            "Content-Type": "application/json"
                        },
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
                            var query = {
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            }
                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                    count: pageLimitCount
                                };
                            }
                            return query;
                        },
                        processResults: function(data, params) {
                            params.page = params.page ? params.page : 0;
                            return {
                                results: $.map(data, function(item) {
                                    return {
                                        text: item['displayvalue'],
                                        id: item['actualvalue'],
                                        data: item
                                    }
                                }),
                                pagination: {
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },
                        cache: true
                    }
                };
                $('[name=WorkOrderExt]').select2(select_config_workOrderExt).trigger('change.select2');
            })
        }
    });
});