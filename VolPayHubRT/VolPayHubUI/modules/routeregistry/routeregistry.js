angular.module('VolpayApp').controller('routeregistryCtrl', function($scope, $http, $rootScope, $timeout, $filter, GlobalService, bankData, errorservice) {

    var authenticationObject = $rootScope.dynamicAuthObj;
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })

    $scope.fields = {
        "Processor": {
            'type': "string",
            'label': "RouteRegistry.TableProcessor"
        },
        "InstanceID": {
            'type': "string",
            'label': "RouteRegistry.TableInstanceId"
        },
        "RouteID": {
            'type': "string",
            'label': "RouteRegistry.TableRouteID"
        },
        "RouteInfo": {
            'type': "hex",
            'label': "RouteRegistry.TableRouteInfo"
        },
        "DateAdded": {
            'type': "date",
            'label': "RouteRegistry.TableDateAdded"
        },
        "Status": {
            'type': "select",
            'label': "RouteRegistry.TableStatus",
            'value': [{
                    'actualvalue': "ACTIVE",
                    'displayvalue': "ACTIVE"
                },
                {
                    'actualvalue': "DOWN",
                    'displayvalue': "DOWN"
                },
                {
                    'actualvalue': "ERROR",
                    'displayvalue': "ERROR"
                }
            ]
        },
        "LastUpdated": {
            'type': "date",
            'label': "RouteRegistry.TableLastUpdated"
        },
        "Reloadable": {
            'type': "boolean",
            'label': "RouteRegistry.TableReload"
        }
    }
    $scope.fieldData = []
    $scope.registryData = {}
    $scope.routeRegistryVal = {
        "field": [{
                "name": "TransportCategory",
                "type": "String",
                "label": "RouteRegistry.ApplicationName",
                "visible": true,
                "enabled": true,
                "notnull": false,
                "renderer": {
                    "type": "Choice",
                    "Choice": {
                        "type": "Choice",
                        "type1": "Choice",
                        "choicerenderer": "ComboChoiceRenderer",
                        "choiceOptions": [{
                            "displayvalue": "REST",
                            "actualvalue": "REST"
                        }],
                        "customattributes": {
                            "property": [{
                                    "name": "REST",
                                    "value": "transports/readapplicationname",
                                    "Value_1": "\n\t\t\t\t\t\t"
                                },
                                {
                                    "name": "WebFormExcerptView",
                                    "value": "true",
                                    "Value_1": "\n\t\t\t\t\t\t"
                                }
                            ]
                        }
                    }
                }
            },
            {
                "name": "HostInetAddress",
                "type": "String",
                "label": "RouteRegistry.HostAddress",
                "visible": true,
                "enabled": true,
                "notnull": false,
                "renderer": {
                    "type": "Choice",
                    "Choice": {
                        "type": "Choice",
                        "type1": "Choice",
                        "choicerenderer": "ComboChoiceRenderer",
                        "choiceOptions": [{
                            "displayvalue": "REST",
                            "actualvalue": "REST"
                        }],
                        "customattributes": {
                            "property": [{
                                    "name": "REST",
                                    "value": "transports/readhostaddress",
                                    "Value_1": "\n\t\t\t\t\t\t"
                                },
                                {
                                    "name": "WebFormExcerptView",
                                    "value": "true",
                                    "Value_1": "\n\t\t\t\t\t\t"
                                }
                            ]
                        }
                    }
                }
            },
            {
                "name": "RouteId",
                "type": "String",
                "label": "RouteRegistry.RouteID",
                "visible": true,
                "enabled": true,
                "notnull": false,
                "renderer": {
                    "type": "Choice",
                    "Choice": {
                        "type": "Choice",
                        "type1": "Choice",
                        "choicerenderer": "ComboChoiceRenderer",
                        "choiceOptions": [{
                                "displayvalue": "REST",
                                "actualvalue": "REST"
                            },
                            {
                                "displayvalue": "MULTISELECT",
                                "actualvalue": "true"
                            }
                        ],
                        "customattributes": {
                            "property": [{
                                    "name": "REST",
                                    "value": "transports/{TransportCategory}/routes",
                                    "Value_1": "\n\t\t\t\t\t\t"
                                },
                                {
                                    "name": "WebFormExcerptView",
                                    "value": "true",
                                    "Value_1": "\n\t\t\t\t\t\t"
                                }
                            ]
                        }
                    }
                }
            }
        ]
    }

    $scope.getUrl = function(argu, subargu) {
        for (var _field in $scope.routeRegistryVal.field) {
            if ($scope.routeRegistryVal.field[_field].name === argu && subargu == 'REST') {
                for (var _property in $scope.routeRegistryVal.field[_field].renderer.Choice.customattributes.property) {
                    if ($scope.routeRegistryVal.field[_field].renderer.Choice.customattributes.property[_property].name === subargu) {
                        return $scope.routeRegistryVal.field[_field].renderer.Choice.customattributes.property[_property].value
                    }
                }
            } else {
                for (var _choiceOptions in $scope.routeRegistryVal.field[_field].renderer.Choice.choiceOptions) {
                    if ($scope.routeRegistryVal.field[_field].name === argu && $scope.routeRegistryVal.field[_field].renderer.Choice.choiceOptions[_choiceOptions].displayvalue === subargu) {

                        return $scope.routeRegistryVal.field[_field].renderer.Choice.choiceOptions[_choiceOptions].actualvalue
                    }
                }
            }

        }
    }
    $scope.RouteIdreq = false
    $scope.initiateReload = function(argu) {
        var _argu = angular.copy(argu)
        _argu["ReloadType"] = "SPECIFIC";
        _argu["TransportDetails"] = []
        delete _argu["RouteId"]
        for (var _RouteId in argu.RouteId) {
            if (argu.RouteId[_RouteId] == 'ALL' || argu.RouteId[_RouteId] == 'ALL-ERROR') {
                _argu["ReloadType"] = "APPLICATION";
            }
            _argu["TransportDetails"].push({
                'RouteId': argu.RouteId[_RouteId]
            })
        }
        /* crudRequest("POST","transports/reload",_argu).then(function(response){
        	if(response.Status === 'Success'){
        		$scope.alerts = [{  
        						type : 'success',
        						msg : response.data.data.responseMessage		//Set the message to the popup window
        					}];
        		$scope.registryData = {}
        	}
        	$scope.clearReload();
        }) */


        if ('RouteId' in $scope.registryData && $scope.registryData.RouteId.length) {

            $http({
                method: "POST",
                url: BASEURL + "/rest/v2/transports/routeregistry/reload",
                data: _argu,
                params: ''
            }).then(function(response) {

                $scope.alerts = [{
                    type: 'success',
                    msg: response.data.responseMessage //Set the message to the popup window
                }];


                //$scope.registryData = {}
                //$timeout(callAtTimeout, 4000);
                $scope.clearReload();
                $scope.madeChanges = false;
                $rootScope.dataModified = false;
            }, function(error) {

                $('.modal').modal("hide");
                $scope.alerts = [{
                    type: 'danger',
                    msg: error.data.error.message //Set the message to the popup window
                }];
                $timeout(callAtTimeout, 4000);
                errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
            })
        } else {
            $('select[name=RouteId]').parent().next().each(function() {
                $scope.RouteIdreq = true;
            })
            $('select[name=RouteId]').on('change', function() {
                $scope.$apply(function() {
                    $scope.RouteIdreq = false;
                });
            })
        }


    }

    $scope.clearReload = function() {
        $scope.registryData = {}
        $scope.RouteIdreq = false;
        $('.appendSelect2').each(function() {
            if (!$(this).attr('multiple')) {
                $(this).val('')
            }
        })
        setTimeout(function() {
            $scope.initAppend();
        }, 100)
    }

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
        /*setTimeout(function () {
        	if ($(".dataGroupsScroll").scrollTop() != 0) {
        		$(".dataGroupsScroll").scrollTop(0);
        	} else {
        		$(".dataGroupsScroll").scrollTop(0);
        	}
        }, 300)*/
    }

    //$scope.restResponse= {}
    /* used for all the crud request */
    function crudRequest(_method, _url, _data, _params, getCount) {
        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _params
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }

            if (getCount) {
                $scope.restResponse.totalCount = $scope.restResponse.totalCount ? $scope.restResponse.totalCount : response.headers().totalcount ? response.headers().totalcount : response.data.TotalCount ? response.data.TotalCount : ''
            }
            return $scope.restResponse
        }, function(error) {
            /* if (error.data.error.code == 401) {
            	
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
            $scope.restResponse = {
                'Status': 'Error',
                'data': error.data.error.message
            }

            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
            return $scope.restResponse
        })
    }


    //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {
            $scope.restInputData.start = len;
            $scope.restInputData.count = 20;
            crudRequest("POST", "transports/routeregistry/readall", $scope.restInputData, '', true).then(function(response) {
                $scope.dataLen = response.data.data
                if (response.data.data.length != 0) {
                    $scope.readData = $scope.readData.concat($scope.dataLen)
                    len = len + 20;
                }
            })
        }

    }

    var debounceHandler = _.debounce(loadMore, 200, true);
    $('.listView').on('scroll', function() {
        $scope.widthOnScroll();
        if (Math.ceil($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
            debounceHandler();
        }
    });


    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.ExportMore = function(argu, excelLimit) {
        if (argu > excelLimit) {

            JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? 'Route Registry_' + ('' + excelLimit)[0] : 'Route Registry', true);
            $scope.dat = [];
            excelLimit += 100000
        }
        crudRequest("POST", "transports/routeregistry/readall", { "start": argu, "count": ($scope.restResponse.totalCount > 1000) ? 1000 : $scope.restResponse.totalCount }, '', true).then(function(response) {
            $scope.dat = $scope.dat.concat(response.data.data)
            if (response.data.data.length >= 1000) {
                argu += 1000;
                $scope.ExportMore(argu, excelLimit)
            } else {
                JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? 'Route Registry_' + ('' + excelLimit)[0] : 'Route Registry', true);
            }
        })
    }

    $scope.exportAsExcel = function() {
        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.ExportMore(0, 100000);
            //JSONToCSVConvertor($scope.dat, $scope.Title, true);			
        } else {
            $scope.dat = angular.copy($scope.readData);
            //$scope.dat.shift();

            JSONToCSVConvertor($scope.dat, 'Route Registry', true);
        }
        //bankData.exportToExcel($scope.dat, $scope.Title)

    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = ""; //This loop will extract the label from 1st index of on array
            var colName = [];
            for (i in $scope.fields) {
                //colName.push($scope.fieldDetails.Section[i].FieldName)
                colName.push(i)
                row += $scope.fields[i].label + ',';
            }
            row = row.slice(0, -1);
            CSV += row + '\n';

        }
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (jk in colName) {
                if (JSON.stringify(arrData[i][colName[jk]]) != undefined) {

                    //row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';
                    if (typeof(arrData[i][colName[jk]]) === 'object') {

                        var cont = "";
                        for (var x in arrData[i][colName[jk]]) {
                            var dStr = JSON.stringify(arrData[i][colName[jk]][x]);
                            dStr = dStr.replace(/"/g, '')
                            cont += JSON.stringify(dStr);
                        }

                        row += cont;
                        row = row.replace(/""/g, "\n")
                    } else {
                        row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';

                    }
                } else {
                    row += '' + ',';
                }
            }
            row.slice(0, row.length - 1);
            CSV += row + '\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        bankData.exportToExcel(CSV, ReportTitle)
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

        setTimeout(function() {
                if ($(window).height() >= 760) {

                    $('.listView').css({
                        'max-height': (($(window).height() * 65) / 100) - 100 + 'px'
                    })
                } else {

                    $('.listView').css({
                        'max-height': (($(window).height() * 52) / 100) - 70 + 'px'
                    })
                }
            }, 100)
            //$scope.setClass();
    });

    $scope.applyRestData = function(argu) {
        if (argu) {
            $scope.restInputData = {
                "start": 0,
                "count": 20,
                "sorts": []
            }
            $scope.TotalCount = 0;
            for (j in $scope.fields.Status.value) {
                getCountbyStatus($scope.fields.Status.value[j])
            }
        }
        crudRequest("POST", "transports/routeregistry/readall", $scope.restInputData, '', true).then(function(response) {
            $scope.readData = response.data.data;
            $scope.dataLen = response.data.data
        })
    }

    $scope.applyRestData(true);

    $scope.loadData = function() {
        $scope.restInputData = {
            "start": 0,
            "count": 20
        }
        len = 20;
        $('.listView').scrollTop(0)
        $scope.clearSort('#sort');
        $scope.clearFilter();
        $('.finddiv table span').removeClass('fa fa-caret-up fa fa-caret-down');
    }

    function callAtTimeout() {
        $('#statusBox').hide();
    }

    $scope.allowOnlyNumbersAlone = function(e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    $scope.multipleEmptySpace = function(e) {

        var classname = e.currentTarget.id;

        if (($filter('removeSpace')($('#' + classname).val()).length) > 0) {
            $('#' + classname).val($filter('removeSpace')($('#' + classname).val()));
        } else {

            $('#' + classname).val('');
            //$('#'+classname).focus();
        }
    }

    $scope.callStyle = function() {
        return $('#listViewPanelHeading_1').outerHeight();
    }

    $scope.filterBydate = [{
            'actualvalue': custmtodayDate(),
            'displayvalue': 'filterBydate.Today',
            'Date': 'DateAdded'
        },
        {
            'actualvalue': week(),
            'displayvalue': 'filterBydate.This Week',
            'Date': 'DateAdded'
        },
        {
            'actualvalue': month(),
            'displayvalue': 'filterBydate.This Month',
            'Date': 'DateAdded'
        },
        {
            'actualvalue': year(),
            'displayvalue': 'filterBydate.This Year',
            'Date': 'DateAdded'
        },
        {
            'actualvalue': '',
            'displayvalue': 'filterBydate.Custom',
            'Date': 'DateAdded'
        }
    ]

    $scope.showCustom = false;
    $scope.selectedDate = '';
    $('.dropdown-menu').removeClass('show'); 

    $scope.clearFilter = function() {
        /*if($scope.showCustom || $scope.filterParams.keywordSearch || 'Status' in $scope.filterParams && $scope.filterParams.Status.length){
        	$scope.applyRestData();
        }*/
        $scope.selectedDate = ''
        $scope.restInputData = {
            "start": 0,
            "count": 20,
            "sorts": []
        }
        $scope.showCustom = false;
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })
        // $('.customDropdown').removeClass('open');
        $('.dropdown-menu').removeClass('show'); 
        $scope.applyRestData();
        activatePicker();
    }

    $scope.showAlert = false

    $scope.buildFilter = function(argu1, argu2) {
        var argu2 = []
        for (k in $scope.fields) {

            if ($scope.fields[k].type === 'string') {
                argu2.push({
                    "columnName": k,
                    "operator": "LIKE",
                    "value": argu1
                })
            }
        }
        return argu2;
    }
    
    $scope.searchFilter = function(_val) {
        //var _val = angular.copy(val)
        $scope.restInputData["start"] = 0;
        $scope.restInputData["count"] = len;

        $scope.restInputData.filters = {
            "logicalOperator": "AND",
            "groupLvl1": [{
                "logicalOperator": "AND",
                "groupLvl2": [{
                    "logicalOperator": "AND",
                    "groupLvl3": []
                }]
            }]
        }

        for (var j in Object.keys(_val)) {
            if (_val[Object.keys(_val)[j]]) {
                if (Object.keys(_val)[j] == 'Status') {
                    for (var i in _val[Object.keys(_val)[j]]) {

                        if ($scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.length && i > 0) {

                            $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({
                                "columnName": Object.keys(_val)[j],
                                "operator": "=",
                                "value": _val[Object.keys(_val)[j]][i]
                            })
                        } else {

                            $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": Object.keys(_val)[j],
                                    "operator": "=",
                                    "value": _val[Object.keys(_val)[j]][i]
                                }]
                            })
                        }
                    }
                } else if (Object.keys(_val)[j] == 'DateAdded') {

                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                                "columnName": _val[Object.keys(_val)[j]]['Date'],
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                                "value": $('#startDate').val()
                            },
                            {
                                "columnName": _val[Object.keys(_val)[j]]['Date'],
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                                "value": $('#endDate').val()
                            }
                        ]
                    })
                } else if (Object.keys(_val)[j] == 'SearchSelect') {

                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": _val.SearchSelect,
                            "operator": "LIKE",
                            "value": _val.keywordSearch,  
                            'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                        }]
                    })
                } else if (Object.keys(_val)[j] == 'keywordSearch' && !_val['SearchSelect']) {

                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": $scope.buildFilter(_val[Object.keys(_val)[j]])
                    })
                }
            }
        }
        $scope.applyRestData();

        setTimeout(function() {
            $('select[name=SearchSelect]').val(null).trigger("change");
        }, 100)
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.showCustom = false;
        $scope.selectedDate = '';
        $('.dropdown-menu').removeClass('show'); 
    }

    $scope.filterParams = {};
    $scope.selectedStatus = [];
    $scope.setStatusvalue = function(val, to) {

        var addme = true;
        if ($scope.selectedStatus.length) {
            for (k in $scope.selectedStatus) {
                if ($scope.selectedStatus[k] == val) {

                    $(sanitize('#' + val)).css({
                        'background-color': '#fff',
                        'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
                    })
                    $scope.selectedStatus.splice(k, 1);

                    addme = false
                    break
                }
            }
            if (addme) {
                $(sanitize('#' + val)).css({ 'background-color': '#d8d5d5', 'box-shadow': '' })
                $scope.selectedStatus.push(val);
            }
        } else {
            $(sanitize('#' + val)).css({ 'background-color': '#d8d5d5', 'box-shadow': '' })
            $scope.selectedStatus.push(val);
        }
        to['Status'] = $scope.selectedStatus;

    }

    $scope.setEffectivedate = function(val, to) {

        to['DateAdded'] = val;
        if ($scope.selectedDate == val.displayvalue) {
            $scope.showCustom = false;
            $('.filterBydate').css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
            $scope.selectedDate = '';
        } else {
            $scope.showCustom = true;
            $scope.selectedDate = angular.copy(val.displayvalue);
            $('.filterBydate').css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
            $('#' + $scope.selectedDate.replace(/\s+/g, '')).css({ 'box-shadow': '1.18px 3px 2px 1px rgba(0,0,0,0.40)', 'background-color': '#d8d5d5' })
        }

        if (typeof(val.actualvalue) == "object") {
            var date = []
            for (k in val.actualvalue) {
                date.push(val.actualvalue[k])
            }
            $('#customPicker').find('input[type=text]').each(function(i) {
                if (i == 0) {
                    if (date[i] < date[Number(i + 1)]) {
                        $(this).val(date[i])
                        $(this).parent().children().each(function() {
                            $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                        })
                    } else {
                        $(this).val(date[Number(i + 1)])
                        $(this).parent().children().each(function() {
                            $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                        })
                    }
                } else {
                    $(this).val(date[Number(i - 1)])
                    $(this).parent().children().each(function() {
                        $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                    })
                }
            })
        } else if (val.displayvalue == 'Custom') {
            $('#customPicker').find('input[type=text]').each(function(i) {
                $(this).parent().children().each(function() {
                    $(this).css({ 'cursor': 'pointer' }).removeAttr('disabled').val('')
                })
            })
        } else {
            $('#customPicker').find('input[type=text]').each(function(i) {
                $(this).val(val.actualvalue)
                $(this).parent().children().each(function() {
                    $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                })
            })
        }
    }


    $scope.$watch('restInputData', function(newValue, oldValue, scope) {

        $scope.savedQueryOrder = [];
        $scope.savedQueryfield = [];

        if (newValue) {
            for (order in newValue.QueryOrder) {
                $scope.savedQueryOrder.push({
                    'fieldName': newValue.QueryOrder[order].ColumnName,
                    'fieldValue': newValue.QueryOrder[order].ColumnOrder
                })
            }
            for (field in newValue.Queryfield) {
                $scope.savedQueryfield.push({
                    'fieldName': newValue.Queryfield[field].ColumnName,
                    'fieldValue': newValue.Queryfield[field].ColumnValue
                })
            }

        }
    }, true);

    $scope.gotoSorting = function(dat) {


        $scope.restInputData.start = 0;
        $scope.restInputData.count = len;

        var orderFlag = true;
        if ($scope.restInputData.sorts.length) {
            for (k in $scope.restInputData.sorts) {
                if ($scope.restInputData.sorts[k].columnName == dat) {
                    if ($scope.restInputData.sorts[k].sortOrder == 'Asc') {
                        $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.restInputData.sorts[k].sortOrder = 'Desc'
                        orderFlag = false;

                        break;
                    } else {
                        $scope.restInputData.sorts.splice(k, 1);
                        orderFlag = false;
                        $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-minus fa-sm')
                        $(sanitize('#' + dat + '_Icon')).removeAttr('class')

                        $timeout(function() {
                            $(".alert-danger").hide();
                        }, 1000)
                        break;
                    }
                }
            }
            if (orderFlag) {
                $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-long-arrow-up')
                $(sanitize('#' + dat + '_Icon')).attr('class', 'fa fa-caret-up')
                $scope.restInputData.sorts.push({
                    "columnName": dat,
                    "sortOrder": 'Asc'
                })

            }
        } else {
            $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat + '_Icon')).attr('class', 'fa fa-caret-up')
            $scope.restInputData.sorts.push({
                "columnName": dat,
                "sortOrder": 'Asc'
            })

        }
        $scope.applyRestData(false);
    }

    $scope.initAppend = function() {
        $('.appendSelect2').each(function() {
            var pageLimitCount = 500;
            var _multiple = $scope.getUrl($(this).attr('name'), 'MULTISELECT')

            if (_multiple) {
                var _thz = this
                $(_thz).attr('multiple', _multiple).find('option').remove()
                $(_thz).val('')
            }
            $(this).select2({
                ajax: {
                    // name = $(this).attr('name'),
                    url: function(params) {
                        var _Url = $scope.getUrl($(this).attr('name'), 'REST')
                        if (_Url.match('{') && _Url.match('}')) {

                            //_Url = _Url.replace('{'+_Url.slice(_Url.indexOf('{')+1,_Url.indexOf('}'))+'}',$('#'+_Url.slice(_Url.indexOf('{')+1,_Url.indexOf('}'))).val())
                            _Url = _Url.replace('{' + _Url.slice(_Url.indexOf('{') + 1, _Url.indexOf('}')) + '}', $('#TransportCategory').val())
                        }

                        return BASEURL + "/rest/v2/" + _Url
                    },
                    type: 'GET',
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
                        var myarr = []
                        for (j in data) {
                            myarr.push({
                                'id': data[j].actualvalue,
                                'text': data[j].displayvalue
                            })
                        }
                        return {
                            results: myarr,
                            pagination: {
                                more: data.length >= pageLimitCount
                            }
                        };
                    },
                    cache: true
                },
                placeholder: 'Select',
                minimumInputLength: 0,
                allowClear: true
            });
        })
    }

    function activatePicker() {

        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            useCurrent: true,
            showClear: true
        }).on('dp.change', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        }).on('dp.hide', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        })
    }

    $(document).ready(function() {
        activatePicker();

        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table');

            $tablesToFloatHeaders.floatThead({
                //useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);

                $table.closest('.FixHead').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        })

        $(window).bind("resize", function() {
            setTimeout(function() {
                autoScrollDiv();
                $(".listView").scrollLeft(10)
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(5)
            }

        })
        $(window).trigger('resize');
        $scope.initAppend();
        var parentElement = $(".parent");
        $('#SearchSelect').select2({
            placeholder: 'Select',
            allowClear: true,
            dropdownParent: parentElement
        })
    })

    $scope.keywordSearchdata = {}
    $scope.inputType = ''

    $scope.keywordSearch = function(val) {
        $scope.restInputData.Queryfield = [{
            "ColumnName": val.selectBox,
            "ColumnOperation": "=",
            "ColumnValue": val.searchBox
        }]

        if ($scope.regex[$scope.inputType].regex) {
            if ($scope.regex[$scope.inputType].regex.test($('#searchBox').val())) {

                $scope.applyRestData();
            } else {
                $scope.restInputData.Queryfield = [];

            }
        } else {

            $scope.applyRestData();
        }
    }
    $scope.regex = {
        'Integer': {
            'regex': /^[0-9]$/,
            'className': '',
            'placeholder': 'Type Number Only',
            'errorMsg': 'Please fill out this field.'
        },
        'BigDecimal': {
            'regex': /^[0-9.]$/,
            'className': '',
            'placeholder': 'Type Number Only',
            'errorMsg': 'Please fill out this field.'
        },
        'String': {
            'regex': /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i,
            'className': '',
            'placeholder': 'Type here to Search...',
            'errorMsg': 'Please fill out this field.'
        },
        'Boolean': {
            'regex': /^true$|^false$/i,
            'className': '',
            'placeholder': 'Type true or false Only',
            'errorMsg': 'Boolean'
        },
        'DateOnly': {
            'regex': '',
            'className': 'date date-picker',
            'placeholder': 'YYYY-MM-DD',
            'errorMsg': 'DateOnly'
        },
        'DateTime': {
            'regex': '',
            'className': 'date form_cstm_datetime',
            'placeholder': 'YYYY-MM-DD T HH:MM',
            'errorMsg': 'DateTime'
        },
        'TimeOnly': {
            'regex': '',
            'className': 'timepicker timepicker-24',
            'placeholder': 'HH:MM:SS',
            'errorMsg': 'TimeOnly'
        }
    }

    $scope.setInputtype = function(id, x) {

        $('#searchBox').datepicker('remove');
        $('#searchBox').get(0).setCustomValidity('');
        $scope.keywordSearchdata = {
            'selectBox': x,
            'searchBox': ''
        }

        for (k in $scope.fieldDetails.Section) {
            if ($scope.fieldDetails.Section[k].FieldName === x) {
                $scope.inputType = $scope.fieldDetails.Section[k].Type
                $scope.cstmPlaceholder = $scope.regex[$scope.inputType].placeholder;
                $scope.className = $scope.regex[$scope.inputType].className;

            }
        }

    }


    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        })
        $scope.restInputData.sorts = [];
        $scope.applyRestData();
    }

    $scope.clearfromSearch = function(index, to, flag) {

        if (flag) {
            $scope.clearSort('#sort');
            $scope.clearFilter();
            $scope.keywordSearchdata.searchBox = '';
        } else {
            $scope.restInputData[to].splice(index, 1)
            $scope.applyRestData();
        }
    }

    /*Save Search begins Here*/
    $scope.triggerSave = false;
    $scope.dummy = [];
    $scope.calltriggerSave = function() {
        $scope.triggerSave = !$scope.triggerSave;
    }
    $scope.savedSearch = [];
    $scope.savedQueryOrder = [];
    $scope.searchedParams = {
        'fieldName': '',
        'fieldValue': '',
    };


    for (k in $scope.Status) {

    }


    /* Get count */
    function getCountbyStatus(argu) {

        $http({
            method: "POST",
            url: BASEURL + "/rest/v2/transports/routeregistry/readall",
            data: { "start": 0, "count": 20, "filters": { "logicalOperator": "AND", "groupLvl1": [{ "logicalOperator": "AND", "groupLvl2": [{ "logicalOperator": "AND", "groupLvl3": [{ "logicalOperator": "OR", "clauses": [{ "columnName": "Status", "operator": "LIKE", "value": argu.actualvalue }] }] }] }] } },
            params: ''
        }).then(function(response) {
            argu.TotalCount = response.headers().totalcount;
        }, function(error) {
            /* if (error.data.error.code == 401) {
            	
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        })
    }

    /* Get count */

    $scope.gotoReload = function(argu) {

        var input = {
            "TransportCategory": argu.Processor,
            "ReloadType": "SPECIFIC",
            "HostInetAddress": argu.InstanceID,
            "TransportDetails": [{
                "RouteId": argu.RouteID
            }]
        }

        $http({
            method: "POST",
            url: BASEURL + "/rest/v2/transports/routeregistry/reload",
            data: input,
            params: ''
        }).then(function(response) {
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: response.data.responseMessage //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        }, function(error) {
            /* if (error.data.error.code == 401) {
            	
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        })
    }

    setTimeout(function() {

        $('#routeRegistryForm').find('select').on('change', function() {

            if (this.value) {
                $scope.madeChanges = true;
                $rootScope.dataModified = true;
            }
        })

    }, 100)

    $scope.gotoClickedPage = function() {
        $rootScope.$emit("MyEvent2", true);
    }
});