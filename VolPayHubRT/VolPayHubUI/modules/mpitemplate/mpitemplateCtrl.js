angular.module('VolpayApp').controller('mpitemplateCtrl', function($scope, $http, $state, $stateParams, $location, $rootScope, $timeout, GlobalService, LogoutService, EntityLockService, $filter, bankData, errorservice, datepickerFaIcons) {
   
    EntityLockService.flushEntityLocks();
    $rootScope.$emit('MyEventforEditIdleTimeout', true);

    $scope.status1 = [{
        "actualvalue": "ACTIVE",
        "displayvalue": "ACTIVE"
    }, {
        "actualvalue": "SUSPENDED",
        "displayvalue": "SUSPENDED"
    }, {
        "actualvalue": "CREATED",
        "displayvalue": "CREATED"
    }, {
        "actualvalue": "WAITINGFORAPPROVAL",
        "displayvalue": "WAITINGFORAPPROVAL"
    }, {
        "actualvalue": "APPROVED",
        "displayvalue": "APPROVED"
    }, {
        "actualvalue": "FORREVISION",
        "displayvalue": "FORREVISION"
    }, {
        "actualvalue": "REJECTED",
        "displayvalue": "REJECTED"
    }, {
        "actualvalue": "DELETED",
        "displayvalue": "DELETED"
    }];

    if ($rootScope.MPIResponseMessage != undefined) {
        $scope.alerts = [{

            type: 'success',
            msg: $rootScope.MPIResponseMessage.responseMessage
        }];
        $scope.alertStyle = alertSize().headHeight;
        $scope.alertWidth = alertSize().alertWidth;

        setTimeout(function() {

            $rootScope.MPIResponseMessage = '';
            $('.alert-success').hide();
        }, 4000)

    }

    $scope.Status = GlobalService.storeStatus ? GlobalService.storeStatus : $scope.status1;



    $scope.ResourcePermissionCall = function() {
        $scope.permission = {
            'C': false,
            'D': false,
            'R': false,
            'U': false,
            'ReActivate': false
        }
        $http.post(BASEURL + RESTCALL.ResourcePermission, {
            "RoleId": sessionStorage.ROLE_ID,
            "ResourceName": "MPI Template"
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
    }
    $scope.ResourcePermissionCall();


    $http.get(BASEURL + RESTCALL.MPITemplatePK).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $rootScope.primarykey = data.responseMessage.split(',');
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.alerts = [{
            type: 'danger',
            msg: data.error.message
        }];

        $scope.alertStyle = alertSize().headHeight;
        $scope.alertWidth = alertSize().alertWidth;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });

    if (GlobalService.Fxupdated != '') {
        $scope.alerts = [{
            type: 'success',
            msg: GlobalService.Fxupdated //Set the message to the popup window
        }];

        GlobalService.Fxupdated = '';
        $timeout(callAtTimeout, 4000);

    }

    $stateParams.input ?
        ($stateParams.input.responseMessage ?
            $scope.alerts = [{
                type: 'success',
                msg: $stateParams.input.responseMessage
            }] : '') : ''

    setTimeout(function() {
        $(".alert-success").hide();
    }, 5000)

    //  Removed Column
    //  {
    // 	"label" : "Roles Accessible",
    // 	"FieldName" : "RolesAccessible",
    // 	"visible" : true,
    // 	"Type" : "String"
    // },


    $scope.sortMenu = [{
        "label": "Template Name",
        "FieldName": "TemplateName",
        "visible": true,
        "Type": "String"
    }, {
        "label": "Creator",
        "FieldName": "Creator",
        "visible": true,
        "Type": "DateOnly"
    }, {
        "label": "Status",
        "FieldName": "Status",
        "visible": true,
        "Type": "String"
    }, {
        "label": "Effective From Date",
        "FieldName": "EffectiveFromDate",
        "visible": true,
        "Type": "DateOnly"
    }, {
        "label": "Effective Till Date",
        "FieldName": "EffectiveTillDate",
        "visible": true,
        "Type": "DateOnly"
    }]

    $scope.filterBydate = [{
        'actualvalue': todayDate(),
        'displayvalue': 'Today'
    }, {
        'actualvalue': week(),
        'displayvalue': 'This Week'
    }, {
        'actualvalue': month(),
        'displayvalue': 'This Month'
    }, {
        'actualvalue': year(),
        'displayvalue': 'This Year'
    }, {
        'actualvalue': '',
        'displayvalue': 'Custom'
    }]

    $scope.Status = [{
        "actualvalue": "ACTIVE",
        "displayvalue": "ACTIVE"
    }, {
        "actualvalue": "SUSPENDED",
        "displayvalue": "SUSPENDED"
    }, {
        "actualvalue": "CREATED",
        "displayvalue": "CREATED"
    }, {
        "actualvalue": "WAITINGFORAPPROVAL",
        "displayvalue": "WAITINGFORAPPROVAL"
    }, {
        "actualvalue": "APPROVED",
        "displayvalue": "APPROVED"
    }, {
        "actualvalue": "FORREVISION",
        "displayvalue": "FORREVISION"
    }, {
        "actualvalue": "REJECTED",
        "displayvalue": "REJECTED"
    }, {
        "actualvalue": "DELETED",
        "displayvalue": "DELETED"
    }]

    /*$scope.getDisplayValue = function(cmprWith, cmprThiz){

    if(cmprThiz || cmprThiz==false){
    cmprThiz = cmprThiz.toString()
    for(k in cmprWith.ChoiceOptions){
    if(cmprWith.ChoiceOptions[k].actualvalue == cmprThiz){
    return cmprWith.ChoiceOptions[k].displayvalue
    }
    }
    return cmprThiz
    }
    else{

    return cmprThiz
    }
    }*/

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
                $(sanitize('#' + val)).css({
                    'background-color': '#d8d5d5',
                    'box-shadow': ''
                })
                $scope.selectedStatus.push(val);
            }
        } else {
            $(sanitize('#' + val)).css({
                'background-color': '#d8d5d5',
                'box-shadow': ''
            })
            $scope.selectedStatus.push(val);
        }
        to['Status'] = $scope.selectedStatus;
    }

    $scope.setEffectivedate = function(val, to) {
        to['EffectiveDate'] = val;
        if ($scope.selectedDate == val.displayvalue) {
            $scope.showCustom = false;
            $('.filterBydate').css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
            $scope.selectedDate = '';
        } else {
            $scope.showCustom = true;
            $scope.selectedDate = angular.copy(val.displayvalue);
            $('.filterBydate').css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
            $('#' + $scope.selectedDate.replace(/\s+/g, '')).css({
                'box-shadow': '1.18px 3px 2px 1px rgba(0,0,0,0.40)',
                'background-color': '#d8d5d5'
            })
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
                            $(this).css({
                                'cursor': 'not-allowed'
                            }).attr('disabled', 'disabled')
                        })
                    } else {
                        $(this).val(date[Number(i + 1)])
                        $(this).parent().children().each(function() {
                            $(this).css({
                                'cursor': 'not-allowed'
                            }).attr('disabled', 'disabled')
                        })
                    }
                } else {
                    $(this).val(date[Number(i - 1)])
                    $(this).parent().children().each(function() {
                        $(this).css({
                            'cursor': 'not-allowed'
                        }).attr('disabled', 'disabled')
                    })
                }
            })
        } else if (val.displayvalue == 'Custom') {
            $('#customPicker').find('input').each(function(i) {
                $(this).parent().children().each(function() {
                    $(this).css({
                        'cursor': 'pointer'
                    }).removeAttr('disabled').val('')
                })
            })
        } else {
            $('#customPicker').find('input').each(function(i) {
                $(this).val(val.actualvalue)
                $(this).parent().children().each(function() {
                    $(this).css({
                        'cursor': 'not-allowed'
                    }).attr('disabled', 'disabled')
                })
            })
        }
    }

    $scope.showCustom = false;
    $scope.selectedDate = '';


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

    var restServer = RESTCALL.MPITemplates + 'readall';
    var delData = {};
    $scope.backUp = {};
    $scope.indexx = "";
    $scope.dataFound = false;
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
        $timeout(callAtTimeout, 5000);

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

    /*$scope.toggleWindow = function(val,Id,viewMe){
    $scope.viewMe = viewMe;
    if($scope.prev != null){
    $('#collapse'+$scope.prev).collapse('hide');
    }

    $scope.prev = Id;

    $scope.takeBackup(val,Id);
    $scope.takeDeldata(val,Id);

    $('#displayingWindow_'+Id).collapse('hide');
    $('.displayWindow').collapse('show');
    $('.editWindow').collapse('hide');
    $('#editingWindow_'+Id).collapse('show');
    $('.editHere').removeClass('trHilght');
    $('#editHere_'+Id).addClass('trHilght');
    $('.collapse').removeClass('trHilght');
    $('#collapse'+Id).addClass('trHilght');

    $('#listViewPanelHeading_'+Id).collapse('hide');
    $('#collapse'+Id).collapse('show');

    $('.listViewPanelHeading').css('display','block')
    $('#listViewPanelHeading_'+Id).css('display','none')

    }*/

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

    }

    $scope.initData()
        //I Load More datas on scroll
    var len = 20;
    $scope.loadMore = function() {
        restServer = RESTCALL.MPITemplates + 'readall';
        $scope.loadMorecalled = true;

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
            $scope.CRUD = "";
            restServer = RESTCALL.MPITemplates + 'readall';
            $('.listView').scrollTop(0)
            $scope.initData();
            $scope.ResourcePermissionCall();
        }
        // I process the Create Data Request.
    $scope.createData = function(newData) {
        restServer = RESTCALL.MPITemplates;
        newData = removeEmptyValueKeys(newData)

        bankData.crudRequest("POST", restServer, newData).then(getData, errorFunc);
        $scope.CRUD = "Created successfully";
        $scope.newData = ""; // Reset the form once values have been consumed.
    };

    // I update the given data to the Restserver.
    $scope.updateData = function(editedData) {
        delete editedData.$$hashKey;
        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.MPITemplates;
        bankData.crudRequest("PUT", restServer, editedData).then(getData, errorFunc);
        $scope.CRUD = "Updated successfully";
    };

    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete delData.$$hashKey

        $scope.delObj = {};
        /*$scope.delObj.OfficeCode = delData.OfficeCode;
        $scope.delObj.ApplicableDate = delData.ApplicableDate;
        $scope.delObj.SourceCurrency = delData.SourceCurrency;
        $scope.delObj.TargetCurrency = delData.TargetCurrency;*/
        $scope.delObj.TemplateName = delData.TemplateName
        $scope.delObj.PartyCode = delData.PartyCode


        restServer = RESTCALL.MPITemplates + 'delete';

        bankData.crudRequest("POST", restServer, $scope.delObj).then(getData, errorFunc);
        $('.modal').modal("hide");
        $('body').removeClass('modal-open')
    };

    // I load the rest data from the server.
    function getData(response) {

        if ((restServer.indexOf('delete') != -1) && !response.data) {
            $scope.CRUD = "Borrado exitosamente"
        } else {
            $scope.CRUD = response.data.responseMessage;
        }

        //$scope.CRUD = response.data.responseMessage;
        $scope.loadMorecalled = false;

        //$scope.bankData.IsReadAllRecord = true;
        // $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
        $scope.bankData.QueryOrder = [];
        $scope.bankData.start = 0;
        $scope.bankData.count = len;

        $scope.bankData = constructQuery($scope.bankData);

        restServer = RESTCALL.MPITemplates + 'readall';
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }

    $scope.bData = '';
    // I apply the rest data to the local scope.
    function applyRestData(restDat) {
        $scope.bData = angular.copy(restDat)

        var restData = restDat.data;
        $scope.restVal = restData;

        $scope.totalForCountbar = restDat.headers().totalcount;
        $scope.restVal.splice(0, 0, {});

        $scope.lenthofData = $scope.bData.data;

        if ($scope.restVal.length == 1) {
            $scope.dataFound = true;
        } else {
            $scope.dataFound = false;
        }
        if ($scope.CRUD != "") {
            $scope.alerts = [{
                type: 'success',
                msg: $scope.CRUD //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        }

        var isOnClickedMyProfilePage = ($stateParams.input ? ($stateParams.input.UserProfileDraft ? $stateParams.input.UserProfileDraft : '') : '');

        if (isOnClickedMyProfilePage) {
            $scope.gotoEditDraft($stateParams.input)
        }

        $('.alert-danger').hide()

    }

    // I apply the Error Message to the Popup Window.
    function errorFunc(errorMessag) {
        /* if (errorMessag.status == 401) {
        	
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

    $scope.callStyle = function() {
        return $('#listViewPanelHeading_1').outerHeight();
    }

    $scope.viewData = function(data, flag) {

        GlobalService.fromAddNew = false;
        delete data.$$hashKey;
        GlobalService.specificData = data;
        GlobalService.ViewClicked = flag;

        if(!GlobalService.ViewClicked && !GlobalService.fromAddNew) {
            var dataObj = {};
             dataObj = {
                TableName: 'MPITemplate',
                BusinessPrimaryKey : {},
                IsLocked: true
            };
            dataObj.BusinessPrimaryKey = { 'TemplateName' : data.TemplateName || null }; 
            dataObj.BusinessPrimaryKey  = JSON.stringify(dataObj.BusinessPrimaryKey);
            EntityLockService.checkEntityLock(dataObj).then(function(){
                $scope.permission['lockDataObj'] = dataObj;                   
                $state.go('app.mpidetail', {
                    input: $scope.permission,
                    inputParam: dataObj
                })
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
                // // uncomment below
                // $scope.permission['lockDataObj'] = dataObj;
                // $state.go('app.mpidetail', {
                //     input: $scope.permission,
                //     inputParam: dataObj
                // }) //
             });  
        } else {
            $state.go('app.mpidetail', {
                input: $scope.permission
            })
        }

      
    }

    $scope.addFxRate = function() {
        GlobalService.fromAddNew = true;
        GlobalService.ViewClicked = false;
        $location.path('app/mpidetail')
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    var sortOrder = [];
    $scope.bankData1 = {
        "start": 0,
        "count": 20,
        "sorts": []
    }

    $scope.gotoSorting = function(dat) {


        $scope.bankData1.start = 0;
        $scope.bankData1.count = len;

        var orderFlag = true;

        if ($scope.bankData1.sorts.length) {
            for (k in $scope.bankData1.sorts) {
                if ($scope.bankData1.sorts[k].columnName == dat.FieldName) {
                    if ($scope.bankData1.sorts[k].sortOrder == 'Asc') {
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.bankData1.sorts[k].sortOrder = 'Desc'
                        orderFlag = false;
                        break;
                    } else {
                        $scope.bankData1.sorts.splice(k, 1);
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
                $scope.bankData1.sorts.push({
                    "columnName": dat.FieldName,
                    "sortOrder": 'Asc'
                })

            }
        } else {
            $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')
            $scope.bankData1.sorts.push({
                "columnName": dat.FieldName,
                "sortOrder": 'Asc'
            })

        }

        //$scope.bankData1  = constructQuery($scope.dupBankData);
        bankData.crudRequest("POST", restServer, $scope.bankData1).then(applyRestData, errorFunc);

    }

    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });


        $scope.bankData1.sorts = [];
        bankData.crudRequest("POST", restServer, $scope.bankData1).then(applyRestData, errorFunc);

    }


    $scope.buildFilter = function(argu1) {
        var argu2 = []
        for (k in $scope.fields) {
            if ($scope.fields[k].type === 'string') {
                argu2.push({
                    "columnName": $scope.fields[k].name,
                    "operator": "LIKE",
                    "value": argu1
                })
            } else if ($scope.fields[k].type === 'select' && $scope.fields[k].name != 'Status') {
                argu2.push({
                    "columnName": $scope.fields[k].name,
                    "operator": "=",
                    "value": argu1
                })
            }
        }
        return argu2;
    }

    $scope.searchFilter = function(val) {
        val = removeEmptyValueKeys(val)
        $scope.bankData = {
            "start": 0,
            "count": len
        }
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

        for (var j in Object.keys(val)) {
            if (val[Object.keys(val)[j]]) {
                if (Object.keys(val)[j] == 'Status') {
                    /* for (var i in val[Object.keys(val)[j]]) {
                    	$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                    		"logicalOperator" : "OR",
                    		"clauses" : [{
                    				"columnName" : Object.keys(val)[j],
                    				"operator" : "=",
                    				"value" : val[Object.keys(val)[j]][i]
                    			}
                    		]
                    	})
                    } */
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3 = [{
                        "logicalOperator": (val[Object.keys(val)[j]].length >= 1) ? 'OR' : 'AND',
                        "clauses": []
                    }]

                    for (var i in val[Object.keys(val)[j]]) {
                        $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({
                            "columnName": Object.keys(val)[j],
                            "operator": "=",
                            "value": val[Object.keys(val)[j]][i]
                        })
                    }
                } else if (Object.keys(val)[j] == 'EffectiveDate') {
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                            "columnName": "EffectiveFromDate",
                            "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                            "value": $('#startDate').val()
                        }]
                    })

                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                            "columnName": "EffectiveFromDate",
                            "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                            "value": $('#endDate').val()
                        }]
                    })
                } else if (Object.keys(val)[j] == 'SearchSelect') {
                    val.SearchSelect = JSON.parse(val.SearchSelect)
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": val.SearchSelect.name,
                            "operator": (val.SearchSelect.type == 'select') ? "=" : "LIKE",
                            "value": val.keywordSearch,
                            'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                        }]
                    })
                } else if (Object.keys(val)[j] == 'keywordSearch' && !val['SearchSelect']) {
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": $scope.buildFilter(val[Object.keys(val)[j]])
                    })
                }
            }
        }
        //$scope.bankData = constructQuery($scope.bankData)

        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

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
            $(this).css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
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
            $(this).css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
        })

        $scope.showCustom = false;
        $scope.selectedDate = '';
        // $('.customDropdown').removeClass('open');
        $('.dropdown-menu').removeClass('show'); 
        $scope.bankData = constructQuery($scope.bankData)
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }

    $scope.multiSortObj = []
        /* $scope.Sorting = function(orderByField,evt){
        $scope.CRUD = '';
        $scope.loadMorecalled = false;
        $scope.orderByField = orderByField;

        if($scope.SortReverse == false){
        $scope.SortType = 'Desc';
        $scope.SortReverse = true;
        }
        else{
        $scope.SortType = 'Asc';
        $scope.SortReverse = false;
        }

        var QueryOrder={};
        QueryOrder.ColumnName = orderByField;
        QueryOrder.ColumnOrder = $scope.SortType;

        len = 20;

        var sortObj = {};
        sortObj.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
        sortObj.start=0;
        sortObj.count=20;

        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);


        }*/

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    /*** To control Load more data ***/
    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                $scope.widthOnScroll();
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
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
            $('#DraftListModal').on('shown.bs.modal', function(e) {
                $('body').css('padding-right', 0);
                $(".draftViewCls").scrollTop(0);
            })

        });

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    }

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

    })

    // $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
    // if ($scope.changeViewFlag) {
    // 	$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
    // 	$scope.changeViewFlag = true;
    // }
    // else {
    // 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
    // 	$scope.changeViewFlag = false;
    // }

    // $scope.hello = function (value, eve) {
    // var hitId = eve.currentTarget.id;
    // $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
    // $('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');
    // 	if (value == "list") {
    // 		$scope.changeViewFlag = !$scope.changeViewFlag;
    // 	}
    // 	else if (value == "grid") {
    // 		$scope.changeViewFlag = !$scope.changeViewFlag;
    // 	}
    // 	else {
    // 		$scope.changeViewFlag = !$scope.changeViewFlag;
    // 	}
    // 	GlobalService.viewFlag = $scope.changeViewFlag;
    // }

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

    $scope.ExportMore = function(argu, excelLimit) {
        if (argu >= excelLimit) {
            JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? 'MPI Templates' + '_' + ('' + excelLimit)[0] : 'MPI Templates', true);
            $scope.dat = [];
            excelLimit += 100000;
        }
        crudRequest("POST", RESTCALL.MPITemplates + "readall", {
            "start": argu,
            "count": ($scope.TotalCount > 1000) ? 1000 : $scope.TotalCount
        }).then(function(response) {

            $scope.dat = $scope.dat.concat(response.data.data)

            if (response.data.data.length >= 1000) {
                argu += 1000;
                $scope.ExportMore(argu, excelLimit)
            } else {

                JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? 'MPI Templates' + '_' + ('' + excelLimit)[0] : 'MPI Templates', true);
            }

        })
    }

    function getCountbyStatus(argu) {
        crudRequest("GET", RESTCALL.MPITemplates + argu.actualvalue + '/count', "").then(function(response) {
            argu.TotalCount = response.data.data.TotalCount;
            $scope.TotalCount = $scope.TotalCount + response.data.data.TotalCount;
            return response.data.data.TotalCount
        })
    }

    $scope.exportAsExcel = function(data) {
        $scope.dat = [];
        $scope.dat = angular.copy($scope.restVal);

        // JSONToCSVConvertor(bankData,$scope.dat, 'MPI Templates', true);
        var colName = ["TemplateName", "Template", "Creator", "RolesAccessible", "Status", "EffectiveFromDate", "EffectiveTillDate", "PartyServiceAssociationCode", "BranchCode", "ValueDate", "Currency", "Amount", "ChargeCode", "ProductsSupported", "ServiceCode", "D_Account", "C_Account"];
        JSONToExport(bankData, $scope.dat, 'MPI Templates', true, colName);
        //$scope.dat.shift();
        //bankData.exportToExcel($scope.dat, $scope.Title)
        //JSONToCSVConvertor(bankData,$scope.dat, 'FXRates', true);
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

    $(document).ready(function() {
        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table.maintable');
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
        })
        $(".FixHeadDraft").scroll(function(e) {
            var $tablesToFloatHeaders = $('table.drafttable');
            $tablesToFloatHeaders.floatThead({
                useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);
                $table.closest('.FixHeadDraft').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        })

        $(window).bind("resize", function() {
            setTimeout(function() {
                autoScrollDiv();
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }

        })
        $(window).trigger('resize');
        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            //useCurrent: true,
            showClear: true,
            icons: datepickerFaIcons.icons
            
        }).on('dp.change', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {
            $(this).change();
        })
    })

    $scope.getCurrentDrafts = function() {

        $http.post(BASEURL + '/rest/v2/draft/MPITemplate/readall', {
            'start': 0,
            'count': 20
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.draftdatas = data;
            $scope.dataLen = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'Error',
                msg: data.error.responseMessage //Set the message to the popup window  /v2/draft/read/{tableName}
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $rootScope.isComingFromdraft = '';

    $scope.gotoEditDraft = function(draftblob) {
        var gotostateObj = {
            'Operation': draftblob.Operation,
            'Permission': draftblob.Permission,
            'totData': draftblob.totData,
            'FromDraft': true,
            'typeOfDraft': ""
        }
        GlobalService.fromAddNew = false;
        $rootScope.isComingFromdraft = true;
        var decryptedDraft = $filter('hex2a')(draftblob.Data ? draftblob.Data : draftblob.totData.Data)
        var jsonDraft = $filter('Xml2Json')(decryptedDraft)
        var backupWholeData = angular.copy(jsonDraft)
        for (i in backupWholeData) {
            for (j in backupWholeData[i]) {
                backupWholeData[i][j] = (backupWholeData[i][j] == 'true') ? true : (backupWholeData[i][j] == 'false') ? false : backupWholeData[i][j];
                if (typeof backupWholeData[i][j] == 'object') {
                    var backupObj = backupWholeData[i][j];
                    delete backupWholeData[i][j];
                    backupWholeData[i][j] = [];
                    backupWholeData[i][j].push(backupObj);
                }

            }
            backupWholeData[i] = cleantheinputdata(backupWholeData[i])
            gotostateObj.fieldData = backupWholeData[i];
        }

        GlobalService.specificData = gotostateObj.fieldData;
        GlobalService.ViewClicked = false;

        var specificReadObject = {
            "UserID": gotostateObj.totData.UserID,
            "Entity": gotostateObj.totData.Entity,
            "BPK": gotostateObj.totData.BPK
        }

        $http.post(BASEURL + RESTCALL.DraftSpecificRead, specificReadObject).then(function(response) {

            gotostateObj.typeOfDraft = response.headers().type

        }, function(error) {

            $scope.alerts = [{
                type: 'Error',
                msg: error.responseMessage
            }];
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)

        })
        $state.go('app.mpidetail', {
            input: gotostateObj
        })
    }

    $scope.gotodeleteDraft = function() {

        $scope.deleteObj = {
            'UserID': delData.UserID,
            'Entity': delData.Entity,
            'BPK': delData.BPK
        }
        $http.post(BASEURL + "/rest/v2/draft/delete", $scope.deleteObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: "Borrado exitosamente"
            }];
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

    }

    draftlen = 20;
    argu = {};
    var loadMoreDrafts = function() {
        if (($scope.dataLen.length >= 20)) {
            argu.start = draftlen;
            argu.count = 20;

            $http.post(BASEURL + "/rest/v2/draft/MPITemplate/readall", argu).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.dataLen = response;
                if (response.length != 0) {
                    $scope.draftdatas = $scope.draftdatas.concat($scope.dataLen)
                    draftlen = draftlen + 20;
                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.alerts = [{
                    type: 'Error',
                    msg: error.responseMessage
                }];
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }
    }

    var debounceHandlerDraft = _.debounce(loadMoreDrafts, 700, true);
    setTimeout(function() {

        $(document).ready(function() {

            $('.draftViewCls').on('scroll', function() {

                $scope.widthOnScroll();
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    debounceHandlerDraft();
                }
            });

        })

    }, 200);

    $scope.fields = [{
            'type': "string",
            'label': "Template Name",
            'name': "TemplateName"
        },
        {
            'type': "string",
            'label': "Template",
            'name': "Template"
        },
        {
            'type': "string",
            'label': "Creator",
            'name': "Creator"
        },
        {
            'type': "select",
            'label': "Roles Accessible",
            'value': [{
                    'actualvalue': "Approver",
                    'displayvalue': "Approver"
                },
                {
                    'actualvalue': "Operator",
                    'displayvalue': "Operator"
                }
            ],
            'name': "RolesAccessible"
        },
        {
            'type': "select",
            'label': "Status",
            'value': [{
                    'actualvalue': "ACTIVE",
                    'displayvalue': "ACTIVE"
                },
                {
                    'actualvalue': "SUSPENDED",
                    'displayvalue': "SUSPENDED"
                },
                {
                    'actualvalue': "INACTIVE",
                    'displayvalue': "INACTIVE"
                }
            ],
            'name': "Status"
        },
        {
            'type': "DateOnly",
            'label': "Effective From Date",
            'name': "EffectiveFromDate"
        },
        {
            'type': "DateOnly",
            'label': "Effective Till Date",
            'name': "EffectiveTillDate"
        }
    ];

    $scope.TotalCount = 0;
    $scope.getCountbyStatus = function(argu) {
        $http.get(BASEURL + "/rest/v2/manualpaymentinitiationtemplate/" + argu.actualvalue + "/count").then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            argu.TotalCount = data.TotalCount;
            $scope.TotalCount = $scope.TotalCount + data.TotalCount;
            return data.TotalCount
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {
        $scope.getPartyPK = JSON.parse((hexToString(_data.Template))).Party ? JSON.parse((hexToString(_data.Template))).Party : '';
        var GetPrimaryKeys = angular.copy($rootScope.primarykey);

        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }

        if ($scope.getPartyPK != '') {
            reactivateObj['PartyCode'] = $scope.getPartyPK;
        }

        crudRequest("POST", "/rest/v2/manualpaymentinitiationtemplate/reactivate", reactivateObj).then(function(response) {
            $scope.CRUD = response.data.data.responseMessage
            $scope.bankData = {
                start: 0,
                count: len
            }

            $scope.bankData = constructQuery($scope.bankData);

            restServer = RESTCALL.MPITemplates + 'readall';
            bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
        })
    }
});

angular.module('VolpayApp').filter("jsonparse", function() {
    return function(input) {
        if (input) {
            input = JSON.parse(input)
        }
        return input;
    }
})
