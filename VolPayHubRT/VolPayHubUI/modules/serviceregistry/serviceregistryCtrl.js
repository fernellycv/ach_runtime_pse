angular.module('VolpayApp').controller('serviceregistryCtrl', function($scope, $state, bankData, GlobalService, $timeout, $filter, $location, $http, LogoutService,$translate,errorservice,datepickerFaIcons) {

    $scope.permission = {
        'C': false,
        'D': false,
        'R': false,
        'U': false
    }
    sessionStorage.ROLE_ID = (sessionStorage.ROLE_ID) ? sessionStorage.ROLE_ID : localStorage.ROLE_ID;
    $http.post(BASEURL + RESTCALL.ResourcePermission, {
        "RoleId": sessionStorage.ROLE_ID,
        "ResourceName": "Service Registry"
    }).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        for (k in data) {
            for (j in Object.keys($scope.permission)) {
                if (Object.keys($scope.permission)[j] == data[k].ResourcePermission) {
                    $scope.permission[Object.keys($scope.permission)[j]] = true;
                }
            }
        }
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

    });

    $scope.getCountbyStatus = function(argu) {

        $http({
            method: "POST",
            url: BASEURL + "/rest/v2/serviceregistries/readall",
            data: { "start": 0, "count": 20, "filters": { "logicalOperator": "AND", "groupLvl1": [{ "logicalOperator": "AND", "groupLvl2": [{ "logicalOperator": "AND", "groupLvl3": [{ "logicalOperator": "OR", "clauses": [{ "columnName": "Status", "operator": "LIKE", "value": argu.actualvalue }] }] }] }] } },
            params: ''
        }).then(function(response) {
            argu.TotalCount = response.headers().totalcount;
        }, function(error) {
            /* if (error.data.error.code == 401) {
            	errorservice.ErrorMsgFunction(error, $scope, $http)
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        })
    };

    $scope.sortMenu = [{
        "label": "ServiceRegistryDet.TableName",
        "FieldName": "Name",
        "visible": true,
        "Type": "String"
    }, {
        "label": "ServiceRegistryDet.TableType",
        "FieldName": "Type",
        "visible": true,
        "Type": "String"
    }, {
        "label": "ServiceRegistryDet.TableHost",
        "FieldName": "Host",
        "visible": true,
        "Type": "String"
    }, {
        "label": "ServiceRegistryDet.TableEndPoint",
        "FieldName": "EndPoint",
        "visible": true,
        "Type": "String"
    }, {
        "label": "ServiceRegistryDet.TableStatus",
        "FieldName": "Status",
        "visible": true,
        "Type": "String"
    }, {
        "label": "ServiceRegistryDet.TableExpiryTime",
        "FieldName": "ExpiryTime",
        "visible": true,
        "Type": "DateOnly"
    }]
    $scope.fields = {
        "Name": {
            'type': "string",
            'label': "ServiceRegistryDet.TableName"
        },
        "Type": {
            'type': "string",
            'label': "ServiceRegistryDet.TableType"
        },
        "Host": {
            'type': "string",
            'label': "ServiceRegistryDet.TableHost"
        },
        "EndPoint": {
            'type': "string",
            'label': "ServiceRegistryDet.TableEndPoint"
        },
        "ExpiryTime": {
            'type': "date",
            'label': "ServiceRegistryDet.TableExpiryTime"
        },
        "Status": {
            'type': "select",
            'label': "ServiceRegistryDet.TableStatus",
            'value': [{
                    'actualvalue': "ACTIVE",
                    'displayvalue': "ACTIVE"
                },
                {
                    'actualvalue': "DOWN",
                    'displayvalue': "DOWN"
                }
            ]
        }
    }

    $scope.filterBydate = [{
            'actualvalue': todayDate(),
            'displayvalue': 'Today'
        },
        {
            'actualvalue': week(),
            'displayvalue': 'This Week'
        },
        {
            'actualvalue': month(),
            'displayvalue': 'This Month'
        },
        {
            'actualvalue': year(),
            'displayvalue': 'This Year'
        },
        {
            'actualvalue': '',
            'displayvalue': 'Custom'
        }
    ]

    $scope.getDisplayValue = function(cmprWith, cmprThiz) {

        if (cmprThiz || cmprThiz == false) {
            cmprThiz = cmprThiz.toString()
            for (k in cmprWith.ChoiceOptions) {
                if (cmprWith.ChoiceOptions[k].actualvalue == cmprThiz) {
                    return cmprWith.ChoiceOptions[k].displayvalue
                }
            }
            return cmprThiz
        } else {

            return cmprThiz
        }
    }

    $scope.focusInfn = function(data) {
        $(sanitize('#' + data)).focus()
    }

    $scope.filterParams = {};
    $scope.selectedStatus = [];

    $scope.setStatusvalue = function(val, to) {
        var addme = true;
        if ($scope.selectedStatus.length) {
            for (k in $scope.selectedStatus) {
                if ($scope.selectedStatus[k] == val) {
                    $(sanitize('#' + val)).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
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

    $scope.showCustom = false;
    $scope.selectedDate = '';

    $scope.setEffectivedate = function(val, to) {
        to['ExpiryTime'] = val;
        if ($scope.selectedDate == val.displayvalue) {
            $scope.showCustom = false;
            $('.filterBydate').css({ 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
            $scope.selectedDate = '';
        } else {
            $scope.showCustom = true;
            $scope.selectedDate = angular.copy(val.displayvalue);
            $('.filterBydate').css({ 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
            $('#' + $scope.selectedDate.replace(/\s+/g, '')).css({ 'box-shadow': '' })
        }

        if (typeof(val.actualvalue) == "object") {
            var date = []
            for (k in val.actualvalue) {
                date.push(val.actualvalue[k])
            }
            $('#customPicker').find('input').each(function(i) {
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
            $('#customPicker').find('input').each(function(i) {
                $(this).parent().children().each(function() {
                    $(this).css({ 'cursor': 'pointer' }).removeAttr('disabled').val('')
                })
            })
        } else {
            $('#customPicker').find('input').each(function(i) {
                $(this).val(val.actualvalue)
                $(this).parent().children().each(function() {
                    $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                })
            })
        }
    }

    $scope.restResponse = {};

    function crudRequest(_method, _url, _data) {
        return $http({
            method: _method,
            url: BASEURL + _url,
            data: _data
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }

            return $scope.restResponse
        }, function(error) {

            /* if (error.data.error.code == 401) {
            	errorservice.ErrorMsgFunction(error, $scope, $http)
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
            //$timeout(callAtTimeout, 4000);
            return $scope.restResponse
        })
    }



    var restServer = RESTCALL.ServiceRegistryRead;
    var delData = {};
    $scope.backUp = {};
    $scope.indexx = "";
    //$scope.dataFound = false;
    $scope.loadMorecalled = false;
    $scope.CRUD = "";
    $scope.restVal = []

    /*** Sorting ***/
    /* $scope.orderByField = 'OfficeCode';
     $scope.SortReverse  = false;
     $scope.SortType = 'Asc';*/



    if (GlobalService.Fxupdated != '') {
        $scope.alerts = [{
            type: 'success',
            msg: GlobalService.Fxupdated //Set the message to the popup window
        }];

        GlobalService.Fxupdated = '';
        $timeout(callAtTimeout, 4000);

    }

    $scope.takeBackup = function(val, Id) {
        $scope.backUp = angular.copy(val);
        $scope.indexx = angular.copy(Id);
    }

    $scope.cancelpressed = function(Id) {
        $scope.restVal[$scope.indexx] = $scope.backUp;
        $('#editingWindow_' + Id).collapse('hide');
        $('#displayingWindow_' + Id).collapse('show');
    }

    $scope.prev = null;

    $scope.toggleWindow = function(val, Id, viewMe) {
        $scope.viewMe = viewMe;
        if ($scope.prev != null) {
            $('#collapse' + $scope.prev).collapse('hide');
        }

        $scope.prev = Id;

        $scope.takeBackup(val, Id);
        $scope.takeDeldata(val, Id);

        $('#displayingWindow_' + Id).collapse('hide');
        $('.displayWindow').collapse('show');
        $('.editWindow').collapse('hide');
        $('#editingWindow_' + Id).collapse('show');
        $('.editHere').removeClass('trHilght');
        $('#editHere_' + Id).addClass('trHilght');
        $('.collapse').removeClass('trHilght');
        $('#collapse' + Id).addClass('trHilght');

        $('#listViewPanelHeading_' + Id).collapse('hide');
        $('#collapse' + Id).collapse('show');

        $('.listViewPanelHeading').css('display', 'block')
        $('#listViewPanelHeading_' + Id).css('display', 'none')

    }

    $scope.setViewMe = function(viewMe) {
        $scope.viewMe = viewMe;
    }

    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    }

    //I Load the initial set of datas onload
    $scope.initData = function() {

        $scope.bankData = {};

        /*$scope.bankData ={};
        $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
        $scope.bankData.start=0;
        $scope.bankData.count=20;*/

        // $scope.bankData ={
        //                   "start": 0,
        //                   "count": 20,
        //                   "Queryfield":[],
        //                   "QueryOrder": []
        //                 }

        $scope.bankData.QueryOrder = [];
        $scope.bankData.start = 0;
        $scope.bankData.count = 20;
        $scope.bankData.Operator = "AND";

        $scope.dupBankData = angular.copy($scope.bankData)

        $scope.bankData = constructQuery($scope.bankData);

        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
        for (var val in $scope.fields['Status']['value']) {
            $scope.getCountbyStatus($scope.fields['Status']['value'][val])
        }
    }

    $scope.initData()
        //I Load More datas on scroll
    var len = 20;
    $scope.loadMore = function() {

        $scope.loadMorecalled = true;
        //$scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];

        $scope.bankData.start = len;
        $scope.bankData.count = 20;

        //$scope.bankData = constructQuery($scope.bankData);
        //$scope.bankData.sorts=[];
        crudRequest("POST", restServer, $scope.bankData).then(function(response) {
            $scope.lenthofData = response.data.data;
            if (response.data.data.length != 0) {
                $scope.restVal = $scope.restVal.concat(response.data.data)
                len = len + 20;
            }
        })
    }
    $scope.loadData = function() {

            $scope.bankData.start = 0
            $scope.bankData.count = 20
            len = 20;
            $('.listView').scrollTop(0)
            $scope.initData();
        }
        // I process the Create Data Request.
    $scope.createData = function(newData) {
        restServer = RESTCALL.ServiceRegistryRead;
        newData = removeEmptyValueKeys(newData)

        bankData.crudRequest("POST", restServer, newData).then(getData, errorFunc);
        $scope.CRUD = "Created Successfully";
        $scope.newData = ""; // Reset the form once values have been consumed.
    };

    // I update the given data to the Restserver.
    $scope.updateData = function(editedData) {
        delete editedData.$$hashKey;
        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.ServiceRegistryRead;
        bankData.crudRequest("PUT", restServer, editedData).then(getData, errorFunc);
        $scope.CRUD = "Updated Successfully";
    };

    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete delData.$$hashKey

        $scope.delObj = {};
        $scope.delObj.OfficeCode = delData.OfficeCode;
        $scope.delObj.ApplicableDate = delData.ApplicableDate;
        $scope.delObj.SourceCurrency = delData.SourceCurrency;
        $scope.delObj.TargetCurrency = delData.TargetCurrency;

        restServer = RESTCALL.ServiceRegistryRead + 'delete';

        bankData.crudRequest("POST", restServer, $scope.delObj).then(getData, errorFunc);
        $('.modal').modal("hide");
        $('body').removeClass('modal-open')
    };

    // I load the rest data from the server.
    function getData(response) {

        $scope.CRUD = response.data.responseMessage;
        $scope.loadMorecalled = false;

        //$scope.bankData.IsReadAllRecord = true;
        // $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
        $scope.bankData.QueryOrder = [];
        $scope.bankData.start = 0;
        $scope.bankData.count = len;

        $scope.bankData = constructQuery($scope.bankData);

        restServer = RESTCALL.ServiceRegistryRead;
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }

    $scope.bData = '';
    // I apply the rest data to the local scope.
    function applyRestData(restDat) {

        $scope.bData = angular.copy(restDat);
        $scope.totalForCountBar = restDat.headers().totalcount;

        var restData = restDat.data;
        $scope.restVal = restData;

        if ($scope.restVal.length == 0 && !$scope.loadMorecalled) {
            $('.stickyheader').css('visibility', 'hidden');
        } else {
            $('.stickyheader').css('visibility', 'visible');
        }

        $scope.lenthofData = $scope.bData.data;

        /* if($scope.restVal.length){
        	$scope.dataFound = true;
        }
        else
        {
        	$scope.dataFound = false;
        } */
        if ($scope.CRUD != "") {
            $scope.alerts = [{
                type: 'success',
                msg: $scope.CRUD //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        }


        $('.alert-danger').hide()

    }

    // I apply the Error Message to the Popup Window.
    function errorFunc(errorMessag) {
        /* if (errorMessag.status == 401) {
        	errorservice.ErrorMsgFunction(errorMessag, $scope, $http)
        } else { */
        errorservice.ErrorMsgFunction(errorMessag, $scope, $http, errorMessag.status)
        $scope.alerts = [{
            type: 'danger',
            msg: errorMessag.data.error.message //Set the message to the popup window
        }];

        // }
    }

    function callAtTimeout() {
        $('.alert').hide();
    }


    $scope.viewData = function(data, flag) {

        GlobalService.fromAddNew = false;
        delete data.$$hashKey;
        GlobalService.specificData = data;
        GlobalService.ViewClicked = flag;

        $state.go('app.fxratedetail', { input: $scope.permission })
    }

    $scope.addFxRate = function() {
        GlobalService.fromAddNew = true;
        $location.path('app/fxratedetail')
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    var sortOrder = [];
    $scope.bankData = {
        "start": 0,
        "count": 20,
        "sorts": []
    }

    $scope.gotoSorting = function(dat) {

        $scope.bankData.start = 0;
        $scope.bankData.count = len;

        var orderFlag = true;
        if ($scope.bankData.sorts.length) {
            for (k in $scope.bankData.sorts) {
                if ($scope.bankData.sorts[k].columnName == dat.FieldName) {
                    if ($scope.bankData.sorts[k].sortOrder == 'Asc') {
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.bankData.sorts[k].sortOrder = 'Desc'
                        orderFlag = false;
                        break;
                    } else {
                        $scope.bankData.sorts.splice(k, 1);
                        orderFlag = false;
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-minus fa-sm')
                        $(sanitize('#' + dat.FieldName + '_Icon')).removeAttr('class')
                        break;
                    }
                }
            }
            if (orderFlag) {
                $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
                $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')
                $scope.bankData.sorts.push({
                    "columnName": dat.FieldName,
                    "sortOrder": 'Asc'
                })

            }
        } else {
            $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')
            $scope.bankData.sorts.push({
                "columnName": dat.FieldName,
                "sortOrder": 'Asc'
            })

        }

        //$scope.bankData = constructQuery($scope.dupBankData);
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

    }

    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });

        //$scope.restInputData.QueryOrder = [];
        //$scope.applyRestData();

        // $scope.bankData = {
        // 	"start":0,
        // 	"count":20
        // };
        $scope.bankData.sorts = [];

        //$scope.bankData = constructQuery($scope.bankData);

        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }

    $scope.buildFilter = function(argu1, argu2) {

        var argu2 = []
        for (k in $scope.sortMenu) {
            if ($scope.sortMenu[k].Type == 'String') {
                argu2.push({
                    "columnName": $scope.sortMenu[k].FieldName,
                    "operator": "LIKE",
                    "value": argu1
                })
            }
        }
        return argu2;
    }

    $scope.searchFilter = function(_val) {

        _val = removeEmptyValueKeys(_val)
        $scope.bankData.filters = removeEmptyValueKeys($scope.bankData.filters)
        $scope.bankData.filters = {
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

                        if ($scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.length && i > 0) {

                            $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({
                                "columnName": Object.keys(_val)[j],
                                "operator": "=",
                                "value": _val[Object.keys(_val)[j]][i]
                            })
                        } else {

                            $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": Object.keys(_val)[j],
                                    "operator": "=",
                                    "value": _val[Object.keys(_val)[j]][i]
                                }]
                            })
                        }
                    }
                } else if (Object.keys(_val)[j] == 'ExpiryTime') {

                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                                "columnName": Object.keys(_val)[j],
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                                "value": $('#startDate').val()
                            },
                            {
                                "columnName": Object.keys(_val)[j],
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                                "value": $('#endDate').val()
                            }
                        ]
                    })
                } else if (Object.keys(_val)[j] == 'SearchSelect') {
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": _val.SearchSelect,
                            "operator": "LIKE",
                            "value": _val.keywordSearch,
                            'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                        }]
                    })
                } else if (Object.keys(_val)[j] == 'keywordSearch' && !_val['SearchSelect']) {

                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": $scope.buildFilter(_val[Object.keys(_val)[j]])
                    })
                }
            }
        }
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

        setTimeout(function() {
            $('select[name=SearchSelect]').val(null).trigger("change");
        }, 100)
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.showCustom = false;
        $scope.selectedDate = '';
        $('.dropdown-menu').removeClass('show');  
    }

    $scope.clearFilter = function() {
        $scope.bankData = {
            "start": 0,
            "count": 20,
            "sorts": []
        }
        $scope.showCustom = false;
        $scope.selectedDate = '';
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({ 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })
        // $('.customDropdown').removeClass('open');
        $('.dropdown-menu').removeClass('show');
        
        $scope.bankData = constructQuery($scope.bankData)
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
        activatePicker();
    }


    $scope.multiSortObj = []

    var debounceHandler = _.debounce($scope.loadMore, 200, true);

    /*** To control Load more data ***/
    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                $scope.widthOnScroll();
                if (Math.ceil($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {

                    if ($scope.lenthofData.length >= 20) {
                        debounceHandler()
                            //$scope.loadMore();
                    }
                }
            })
            setTimeout(function() {}, 1000)

            // $(window).bind('scroll', function()
            // {
            // 	if($scope.changeViewFlag){
            // 		$scope.widthOnScroll();

            // 		if(($(window).scrollTop() + $(window).height()) >= ($(document).height()-2))
            // 		{
            // 			if($scope.lenthofData.length >= 20){
            // 				$scope.loadMore();
            // 			}
            // 		}
            // 	}
            // })
            // setTimeout(function(){},1000)

            $('.dropdown-menu #Filter').click(function(e) {
                e.stopPropagation();
            });

        }
    );

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    };

    /** List and Grid view Starts**/
    $scope.listTooltip = "List View";
    $scope.gridTooltip = "Grid View";
    $scope.changeViewFlag = GlobalService.viewFlag;

    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
            $(".floatThead ").find("thead").hide();
            autoScrollDiv();
        } else {
            $(".floatThead ").find("thead").show();
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $table = $("table.stickyheader")
                $table.floatThead('destroy');

            }
            autoScrollDiv();
        }

    });

    /** List and Grid view Ends**/

    /*** Print function ***/
    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()
    }

    $scope.TotalCount = 0;
    // for(j in $scope.Status){
    // 	getCountbyStatus($scope.Status[j])
    // }

    function getCountbyStatus(argu) {
        crudRequest("GET", RESTCALL.BankFXRateChartREST + argu.actualvalue + '/count', "").then(function(response) {
            argu.TotalCount = response.data.data.TotalCount;
            $scope.TotalCount = $scope.TotalCount + response.data.data.TotalCount;
            return response.data.data.TotalCount
        })
    }


    $scope.ExportMore = function(argu, excelLimit) {
        if (argu > excelLimit) {

            JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? 'Service Registry_' + ('' + excelLimit)[0] : 'Service Registry', true);
            $scope.dat = [];
            excelLimit += 100000
        }

        crudRequest("POST", restServer, { "start": argu, "count": ($scope.totalForCountBar > 1000) ? 1000 : $scope.totalForCountBar }, '', true).then(function(response) {
            $scope.dat = $scope.dat.concat(response.data.data)
            if (response.data.data.length >= 1000) {

                argu += 1000;
                $scope.ExportMore(argu, excelLimit)
            } else {
         
                JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? 'Service Registry_' + ('' + excelLimit)[0] : 'Service Registry', true);
            }
        })
    };

    $scope.exportAsExcel = function() {
        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.ExportMore(0, 100000);
        } else {
            $scope.dat = angular.copy($scope.restVal);
            // $scope.dat.shift();
            JSONToCSVConvertor($scope.dat, 'Service Registry', true);
        }
    };

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {

            var row = ""; //This loop will extract the label from 1st index of on array
            var colName = [];
            for (i in $scope.sortMenu) {
                //colName.push($scope.fieldDetails.Section[i].FieldName)
                colName.push($scope.sortMenu[i].FieldName)
                row += $scope.sortMenu[i].label + ',';
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
    };

    $scope.widthOnScroll();

    /*** On window resize ***/
    $(window).resize(function() {
        $scope.$apply(function() {

            $scope.alertWidth = $('.alertWidthonResize').width();
        });

    });

    function activatePicker() {

        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss",
            useCurrent: true,
            showClear: true,
            icons: datepickerFaIcons.icons
        }).on('dp.change', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {
            $(this).change();
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        }).on('dp.hide', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        })
    };

    $(document).ready(function() {

        activatePicker()
        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table');

            $tablesToFloatHeaders.floatThead({
                useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);

                $table.closest('.FixHead').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        });

        $(window).bind("resize", function() {
            setTimeout(function() {
                autoScrollDiv();
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }
        })
        $(window).trigger('resize');
        var parentElement = $(".parent");
        $('#SearchSelect').select2({
            placeholder: 'Select',
            allowClear: true,
            dropdownParent: parentElement
        })
    });


});