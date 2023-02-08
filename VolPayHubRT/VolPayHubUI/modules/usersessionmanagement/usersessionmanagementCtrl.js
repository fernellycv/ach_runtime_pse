angular.module('VolpayApp').controller('userSessionMgmtController', function($scope, $rootScope, $http, $filter, $state, userMgmtService, CommonService, $timeout, bankData, GlobalService, $location, LogoutService, $stateParams, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions('User Session Management');
    var authenticationObject = $rootScope.dynamicAuthObj;
    
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks();  

    if ($rootScope.alertData) {
        $scope.alerts = [{
            type: 'success',
            msg: $rootScope.alertData
        }];

        $rootScope.alertData = '';

        $timeout(function() {
            $('.alert-success').hide()
        }, 4000)
    }

    if ($rootScope.erroralertData) {
        $scope.alerts = [{
            type: 'danger',
            msg: $rootScope.erroralertData
        }];

        $rootScope.erroralertData = '';

        $timeout(function() {
            $('.alert-danger').hide()
        }, 4000)
    }

    $stateParams.input ?
        $stateParams.input.responseMessage ?
        $scope.alerts = [{
            type: 'success',
            msg: $stateParams.input.responseMessage
        }] : ''

    :
    ''

    $timeout(function() {
        $('.alert-success').hide()
    }, 4000)  


    $scope.cUser = sessionStorage.UserID;
    $scope.isSuperAdmin = sessionStorage.ROLE_ID;
    $scope.viewMe = true;


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
            "ResourceName": "User Session Management"
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
    var len = 20;   

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
            	if (configData.Authorization == 'External') {
            		window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
            	} else {
            		LogoutService.Logout();
            	}
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

    $scope.search = {
        "EffectiveFromDate": {
            "Start": "",
            "End": ""
        }
    };

    var restServer = RESTCALL.UserSessionData + '/readall';
    var delData = {};
    $scope.backUp = {};
    $scope.indexx = "";
    $scope.dataFound = false;
    $scope.loadMorecalled = false;
    $scope.CRUD = "";
    $scope.restVal = [];

    $scope.changeViewFlag = GlobalService.viewFlag;

    function autoScrollDiv() {
        $(".listView").scrollTop(0);
    }

    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
            $(".maintable > thead").hide();
            autoScrollDiv();
        } else {
            $(".maintable > thead").show();
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $table = $("table.stickyheader")
                $table.floatThead('destroy');

            }
            autoScrollDiv();
        }

    })


    $scope.takeBackup = function(val, Id, flag) {
        $scope.backUp = angular.copy(val);
        $scope.indexx = angular.copy(Id);
        $scope.viewMe = flag;
    }

    var delData = '';
    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    }


    /*** Sorting ***/
    $scope.orderByField = 'UserID';
    $scope.SortReverse = false;
    $scope.SortType = 'Asc';
    $scope.prev = null;

    $scope.userDataFn = function(val, Id, flag) {
        val.UserStatus = val.UserStatus ? String(val.UserStatus) : ''; 
        $scope.userData1 = angular.copy(val);
        if ($scope.prev != null) {
            $('#collapse' + $scope.prev).collapse('hide');
        }

        $scope.prev = Id;

        $scope.takeBackup(val, Id, flag);
        $scope.takeDeldata(val, Id);
        $(".alert").hide();
        $("div").find("#ViewUserMail").removeAttr("style");

    }

    $scope.gotoView = function(data, flag, drObj) {
        data.View = flag;
        $scope.input = {
            'Data': data,
            'DraftTotObj': drObj ? drObj : '',
            'Operation' :  'View'            
        };       
        
        $state.go('app.usersessiondetail', {
            input: $scope.input,
            permission: $scope.permission            
        })
    }

    $scope.gotoEdit = function(data, flag, drObj) {

        data.View = flag;
        $scope.input = {
            'Data': data,
            'DraftTotObj': drObj ? drObj : '',
            'Operation' : 'Edit'
        };       
       
        $state.go('app.usersessiondetail', {
            input: $scope.input,
            permission: $scope.permission           
        })
    }


    $scope.goToEditOperation = function(viewParam) { 
        var dataObj = {}; // have to form the request payload
        dataObj['TableName'] = 'UserProfileLog';
        // dataObj['ActionName'] = actions.ActionName;
        dataObj['IsLocked'] = true;
        dataObj['BusinessPrimaryKey'] = JSON.stringify({'UserId' : viewParam.UserId});      
       
        EntityLockService.checkEntityLock(dataObj).then(function(data){                   
            $scope.gotoEdit(viewParam);
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

    
    
    $scope.userData = {};
    $scope.userData1 = {};
    //I Load the initial set of datas onload
    $scope.refreshCall = function() {
        $scope.UserData = {};
        $scope.CRUD = "";

        $scope.UserData.QueryOrder = [{
            "ColumnName": $scope.orderByField,
            "ColumnOrder": $scope.SortType
        }]
        $scope.UserData.start = 0;
        $scope.UserData.count = 20;
        $scope.UserData.Operator = "AND";
        $scope.UserData = constructQuery($scope.UserData);

        restServer = RESTCALL.UserSessionData + '/readall';
        $scope.initialObj = {};
        $scope.initialObj.UserId = sessionStorage.UserID;
        bankData.crudRequest("POST", restServer, $scope.UserData).then(applyRestData, errorFunc);
    }

    /*$scope.commonObj = CommonService.userMgmt;
    $scope.commonObj.currentObj.start = 0;
    CommonService.userMgmt.currentObj.sortBy=[];
    $scope.fieldArr = $scope.commonObj.currentObj;*/
    $scope.fieldArr = {
        "sortBy": [],
        "params": [],
        "start": 0,
        "count": 20
    }

    $scope.uorQueryConstruct = function(arr) {
        //CommonService.userMgmt.currentObj = arr;
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.Queryfield = [];
        $scope.Qobj.QueryOrder = [];
        
        $scope.Qobj.Queryfield.push({
            "ColumnName": "UserStatus",
            "ColumnOperation": "=",
            "ColumnValue": "Locked"            
        },{
            "ColumnName": "UserStatus",
            "ColumnOperation": "=",
            "ColumnValue": "Locked-WAITFORAPPROVAL"            
        });

        for (var i in arr) {
            if (i == 'params') {
                for (var j in arr[i]) {
                    $scope.Qobj.Queryfield.push(arr[i][j])
                }
            } else if (i == 'sortBy') {
                for (var j in arr[i]) {
                    $scope.Qobj.QueryOrder.push(arr[i][j])
                }
            }
        }

        $scope.Qobj = constructQuery($scope.Qobj);
        return $scope.Qobj;
    }

    $scope.initCall = function(_query) {
        bankData.crudRequest("POST", restServer, _query).then(applyRestData, errorFunc);
    }

    $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

    $scope.initSetting = function() {
        $scope.FieldsValues = [{
            "label": "UserManagement.User ID",
            "value": "UserId",
            "type": "text",
            "allow": "text",
            "visible": true
        }, {
            "label": "UserManagement.LastLoggedIn",
            "value": "LastLoggedIn",
            "type": "text",
            "allow": "string",
            "visible": true
        },
        {
            "label": "UserManagement.Status",
            "value": "UserStatus",
            "type": "text",
            "allow": "string",
            "visible": true
        },
        {
            "label": "UserManagement.Attempts",
            "value": "NoOfAttempts",
            "type": "text",
            "allow": "string",
            "visible": true
        }]    
    }
   
    $scope.dateSet = function() {
            $scope.dateFilter = CommonService.userMgmt.dateFilter;

            for (i in $scope.dateFilter) {
                if ($scope.dateFilter[i]) {
                    $('#dropTxt').text($filter('ucwords')(i))
                    for (var j = 0; j < $('.menuClass').length; j++) {
                        if ($($('.menuClass')[j]).text().toLowerCase().indexOf(i) != -1) {
                            $($('.menuClass')[j]).addClass('listSelected')
                        } else {
                            $($('.menuClass')[j]).removeClass('listSelected')
                        }
                    }

                }
            }
        }
        //$scope.dateSet()

    $scope.initSetting()

    $timeout(function() {
        customDateRangePicker("EffectiveFromDateStart", "EffectiveFromDateEnd")
    }, 10)  

    $scope.FilterByDate = function(params, eve) {

        $(".listView").scrollTop(0);
        $('.menuClass').removeClass('listSelected')
        if (params != 'custom') {
            $(eve.currentTarget).addClass('listSelected')
        } else {
            $('.menuClass:nth-child(5)').addClass('listSelected')
        }

        $('#dropTxt').html($filter('ucwords')(params))

        for (var i in $scope.dateFilter) {
            $scope.dateFilter[i] = false;
        }

        $scope.dateFilter[params] = true;



        if ($scope.dateFilter.custom) {
            $('#customDate').modal('hide')
            CommonService.userMgmt.customDate.startDate = $scope.customDate.startDate;
            CommonService.userMgmt.customDate.endDate = $scope.customDate.endDate;
        }


        $scope.dateArr = $scope.retExpResult()
        for (var i in $scope.fieldArr.params) {
            if (($scope.fieldArr.params[i].ColumnName == 'EffectiveFromDate') || (!$scope.fieldArr.params[i].advancedSearch)) {
                $scope.fieldArr.params.splice(i)
            }
        }

        for (var i in $scope.dateArr) {
            $scope.fieldArr.params.push({
                "ColumnName": $scope.dateArr[i].ColumnName,
                "ColumnOperation": $scope.dateArr[i].ColumnOperation,
                "ColumnValue": $scope.dateArr[i].ColumnValue,
                'advancedSearch': false
            });

        }

        $scope.fieldArr.start = 0;


        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

    }

    $scope.uorSearch = function() {
        if ($scope.uorVal) {

            $scope.search = {
                "EffectiveFromDate": {
                    "Start": "",
                    "End": ""
                }
            }

            $scope.uorFound = $scope.uorVal;

            //	CommonService.userMgmt.uorVal = $scope.uorVal;
            len = 20;
            $scope.uorSearchFound = false;


            for (var i in $scope.fieldArr.params) {
                if (!$scope.fieldArr.params[i].advancedSearch) {
                    if ($scope.fieldArr.params[i].ColumnName == 'UserID') {
                        $scope.uorSearchFound = true;
                        $scope.fieldArr.params[i].ColumnName = 'UserID';
                        $scope.fieldArr.params[i].ColumnOperation = 'like';
                        $scope.fieldArr.params[i].ColumnValue = $scope.uorVal;
                        $scope.fieldArr.params[i].advancedSearch = false;
                    }
                } else {
                    $scope.fieldArr.params.splice(i, 1);
                }
            }


            if (!$scope.uorSearchFound) {
                $scope.fieldArr.params.push({
                    "ColumnName": "UserID",
                    "ColumnOperation": "like",
                    "ColumnValue": $scope.uorVal,
                    'advancedSearch': false
                })
            }

            $scope.fieldArr.start = 0;
            $scope.fieldArr.count = len;

            $scope.query = $scope.uorQueryConstruct($scope.fieldArr)
            $scope.initCall($scope.query)

        }

    }

    $scope.CustomDatesReset = function() {
        $scope.customDate = {
            startDate: '',
            endDate: ''
        }

    }

    $scope.getExistVal = function(eve) {
        if ($scope.uorVal) {
            if (eve.keyCode == 13) {
                $scope.uorSearch()
            }

        } else {

            if ($scope.dateFilter.all) {
                $scope.uorFound = '';
                CommonService.userMgmt.uorVal = '';

                for (var j in $scope.fieldArr.params) {
                    if ($scope.fieldArr.params[j].ColumnName == "UserID") {
                        $scope.fieldArr.params.splice(j, 1)


                    }
                }
                $scope.fieldArr.start = 0;
                $scope.fieldArr.count = 20;
                $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

            }
        }
    }
   
    $scope.loadData = function() {

            $(".listView").scrollTop(0);
            len = 20;

            $scope.fieldArr = {
                "sortBy": [],
                "params": [],
                "start": 0,
                "count": 20
            }
            restServer = RESTCALL.UserSessionData + '/readall';
            $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

            $('.table-responsive').find('table').find('thead').find('th').find('span').removeAttr('class')
            $scope.ResourcePermissionCall();
        }
        //I Load More datas on scroll

    $scope.loadMore = function() {      

        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;

        $http.post(BASEURL + RESTCALL.UserSessionData + '/readall', $scope.uorQueryConstruct($scope.fieldArr)).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.restData = data;
            $scope.restVal = $scope.restVal.concat(data);
            $scope.loadedData = data;
            len = len + 20;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.gotoSorting = function(dat) {

        $scope.fieldArr.start = 0;
        $scope.fieldArr.count = len;

        var orderFlag = true;
        if ($scope.fieldArr.sortBy.length) {
            for (var i in $scope.fieldArr.sortBy) {
                if ($scope.fieldArr.sortBy[i].ColumnName == dat.value) {
                    if ($scope.fieldArr.sortBy[i].ColumnOrder == 'Asc') {
                        $(sanitize('#' + dat.value + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.value + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.fieldArr.sortBy[i].ColumnOrder = 'Desc';
                        orderFlag = false;
                        break;
                    } else {
                        $scope.fieldArr.sortBy.splice(i, 1);
                        orderFlag = false;
                        $(sanitize('#' + dat.value + '_icon')).attr('class', 'fa fa-minus fa-sm')
                        $(sanitize('#' + dat.value + '_Icon')).removeAttr('class')
                        break;
                    }

                }
            }

            if (orderFlag) {
                $(sanitize('#' + dat.value + '_icon')).attr('class', 'fa fa-long-arrow-up')
                $(sanitize('#' + dat.value + '_Icon')).attr('class', 'fa fa-caret-up')
                $scope.fieldArr.sortBy.push({
                    "ColumnName": dat.value,
                    "ColumnOrder": 'Asc'
                })

            }
        } else {

            $(sanitize('#' + dat.value + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.value + '_Icon')).attr('class', 'fa fa-caret-up')

            $scope.fieldArr.sortBy.push({
                "ColumnName": dat.value,
                "ColumnOrder": 'Asc'
            })
        }
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
    }   

    // I load the rest data from the server.
    function getData(response) {

        $scope.CRUD = (response.data.responseMessage) ? response.data.responseMessage : 'Borrado exitosamente';
        $scope.loadMorecalled = false;

        $scope.UserData.sorts = [{
            "columnName": $scope.orderByField,
            "sortOrder": $scope.SortType
        }]
        $scope.UserData.start = 0;
        $scope.UserData.count = 20;

        len = 20;
        restServer = RESTCALL.UserSessionData + '/readall';
        bankData.crudRequest("POST", restServer, $scope.UserData).then(applyRestData, errorFunc);
    }

    // I apply the rest data to the local scope.

    function applyRestData(restDat) {
        $scope.totalForCountBar = restDat.headers().totalcount;
        var restData = restDat.data
        $scope.restData = restData;
        // $scope.restData.splice(0, 0, {});

        if ($scope.loadMorecalled) {
            $scope.restVal = $scope.restVal.concat(restData);
        } else {
            if (restData.length == 0) {
                $scope.dataFound = true;
            } else {
                $scope.dataFound = false;
            }
            $scope.restVal = restData;

            if ($scope.CRUD != "") {
                $scope.alerts = [{
                    type: 'success',
                    msg: $scope.CRUD //Set the message to the popup window
                }];
                $timeout(callAtTimeout, 4000);
            }
        }

        $scope.CRUD = '';
        var isOnClickedMyProfilePage = ($stateParams.input ? ($stateParams.input.UserProfileDraft ? $stateParams.input.UserProfileDraft : '') : '');

        if (isOnClickedMyProfilePage) {
            $scope.gotoEditDraft("View", '', $stateParams.input.totData)
        }
    }

    // I apply the Error Message to the Popup Window.
    function errorFunc(errorMessag) {
        var errorMessage = errorMessag.data;
        /* if (errorMessag.status == 401) {
        	if (configData.Authorization == 'External') {
        		window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
        	} else {
        		LogoutService.Logout();
        	}
        } else { */
        $scope.alerts = [{
            type: 'danger',
            msg: errorMessag.error.message
        }];
        // }
        errorservice.ErrorMsgFunction(errorMessag, $scope, $http, errorMessag.status)
        $timeout(callAtTimeout, 4000);

    }

    function callAtTimeout() {
        $('.alert').hide();
    }
    $scope.callStyle = function() {
        return $('#listViewPanelHeading_1').outerHeight();
    }

    $scope.goToCreateUser = function() {
        $location.path('app/adduser');

    }

    var createObj = {};
    createObj.UserId = sessionStorage.UserID;

    $scope.selectOptions = [];

    $scope.setInitVal = function() {
        if (Object.keys($scope.search).indexOf('RoleID') != -1) {
            var _query = {
                search: $scope.search.RoleID,
                start: 0,
                count: 500
            }
            return $http({
                method: "GET",
                url: BASEURL + RESTCALL.CreateRole,
                params: _query
            }).then(function(response) {
                $scope.selectOptions = response.data;
                return $scope.selectOptions;
            })
        }

    }
    $scope.setInitVal()


    $scope.Sorting = function(orderByField) {
        $scope.loadMorecalled = false;
        $scope.orderByField = orderByField;
        $scope.CRUD = '';

        if ($scope.SortReverse == false) {
            $scope.SortType = 'Desc';
            $scope.SortReverse = true;
        } else {
            $scope.SortType = 'Asc';
            $scope.SortReverse = false;
        }

        var QueryOrder = {};
        QueryOrder.ColumnName = orderByField;
        QueryOrder.ColumnOrder = $scope.SortType;

        var sortObj = {};
        sortObj.sorts = [{
            "columnName": $scope.orderByField,
            "sortOrder": $scope.SortType
        }];
        sortObj.start = 0;
        sortObj.count = len;

        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData, errorFunc);
    }

    $scope.showEditLog = false;

    $scope.gridViewLog = function() {
        $scope.showEditLog = true;
        $scope.auditTableshow = false;
    }

    $scope.listviewLog = function() {
        $scope.showEditLog = false;
        $scope.auditTableshow = false;
    }

    $scope.auditTableshow = false;   

    /*** To control Load more data ***/
    var debounceHandler = _.debounce($scope.loadMore, 700, true);
    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                $scope.widthOnScroll();
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.restData.length >= 20) {
                        //$scope.loadMore();

                        debounceHandler()
                            // $scope.loadCnt = 0;
                    }
                }
            })
            setTimeout(function() {}, 1000)
        }
    );



    /*****Search starts *******/

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
            "actualvalue": "DELETED",
            "displayvalue": "DELETED"
        },
        {
            "actualvalue": "INACTIVE",
            "displayvalue": "INACTIVE"
        },
        {
            "actualvalue": "SUSPENDED",
            "displayvalue": "SUSPENDED"
        }
    ]

    $timeout(function() {
        $scope.fields = [{
            'type': "string",
            'label': "UserManagement.User ID",
            'name': "UserId"
        },        
        {
            'type': "string",
            'label': "UserManagement.Attempts",
            'name': "NoOfAttempts"
        }
       
    ]
        
    }, 1000)
    $scope.filterParams = {};
    $scope.selectedStatus = [];   

    $scope.showCustom = false;
    $scope.selectedDate = '';

    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });
        $scope.fieldArr.sortBy = [];
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
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

        $scope.fieldArr.start = 0
        $scope.fieldArr.count = len;
        $scope.fieldArr.params = [];

        $scope.adFilter = {
            "filters": {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": [{
                                        "columnName":"UserStatus",
                                        "operator": "=",
                                        "value": "Locked" 
                                    },{
                                        "columnName":"UserStatus",
                                        "operator": "=",
                                        "value": "Locked-WAITFORAPPROVAL" 
                            }]
                        }]
                    }]
                }]
            },
            "sorts": [],
            "start": $scope.fieldArr.start,
            "count": $scope.fieldArr.count
        }


        for (var i in $scope.fieldArr) {
            if (i == 'sortBy') {
                for (var j in $scope.fieldArr[i]) {
                    $scope.adFilter.sorts.push({
                        "columnName": $scope.fieldArr[i][j].ColumnName,
                        "sortOrder": $scope.fieldArr[i][j].ColumnOrder
                    })
                }
            }
        }


        for (var j in Object.keys(val)) {
            if (val[Object.keys(val)[j]]) {
                if (Object.keys(val)[j] == 'Status') {

                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3 = [{
                        "logicalOperator": (val[Object.keys(val)[j]].length >= 1) ? 'OR' : 'AND',
                        "clauses": []
                    }]


                    for (var i in val[Object.keys(val)[j]]) {


                        $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({
                            "columnName": Object.keys(val)[j],
                            "operator": "=",
                            "value": val[Object.keys(val)[j]][i]
                        })

                    }
                } else if (Object.keys(val)[j] == 'EffectiveDate') {

                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                            "columnName": "EffectiveFromDate",
                            "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                            "value": $('#startDate').val()
                        }]
                    })

                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                            "columnName": "EffectiveFromDate",
                            "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                            "value": $('#endDate').val()
                        }]
                    })



                } else if (Object.keys(val)[j] == 'SearchSelect') {

                    val.SearchSelect = JSON.parse(val.SearchSelect)


                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": val.SearchSelect.name,
                            "operator": (val.SearchSelect.type == 'select') ? "=" : "LIKE",
                            "value": val.keywordSearch,
                            'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                        }]
                    })



                } else if (Object.keys(val)[j] == 'keywordSearch' && !val['SearchSelect']) {


                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": $scope.buildFilter(val[Object.keys(val)[j]])
                    })

                }
            }
        }
        $scope.initCall($scope.adFilter)
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
            $scope.fieldArr = {
                "start": 0,
                "count": 20,
                "sortBy": []
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
            $('.dropdown-menu').removeClass('show');
            // $('.customDropdown').removeClass('open');

            $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
        }
        /*****Search ends *******/

    $scope.triggerSelect = function(arg) {
        if (arg.name == 'RoleID') {
            $scope.remoteDataConfig()
        } else if (arg.name == 'TimeZone') {
            setTimeout(function() {
                var parentElement = $(".parent");
                $("select[name='keywordSearch']").select2({
                    dropdownParent: parentElement
                })
            }, 100)

        } else if (arg.name == 'Country') {
            setTimeout(function() {
                var parentElement = $(".parent");
                $("select[name='keywordSearch']").select2({
                    dropdownParent: parentElement
                })
            }, 100)

        }


    }

    $scope.limit = 500;
    $(document).ready(function() {
        $('#Filter button:first-child').click(function() {
            setTimeout(function() {
                var parentElement = $(".parent");
                $('select[name=SearchSelect]').select2({
                    allowClear: true,
                    placeholder: $filter('translate')('Placeholder.Select'),
                    dropdownParent: parentElement
                })
            }, 500)

        })
        
        $scope.remoteDataConfig = function() {
            setTimeout(function() {

                var parentElement = $(".parent");

                $("select[name='keywordSearch']").select2({
                    ajax: {
                        url: BASEURL + RESTCALL.CreateRole,
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
                                start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                                count: $scope.limit
                            }

                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                                    count: $scope.limit
                                };
                            }
                            return query;
                        },
                        processResults: function(data, params) {
                            params.page = params.page ? params.page : 0;
                            var myarr = []

                            for (j in data) {
                                myarr.push({
                                    'id': data[j].RoleID,
                                    'text': data[j].RoleName
                                })
                            }
                            myarr.push({
                                'id': "Super Admin",
                                'text': "Super Admin"
                            })

                            return {
                                results: myarr,
                                pagination: {
                                    more: data.length >= $scope.limit
                                }
                            };

                        },
                        cache: true
                    },
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true,
                    dropdownParent: parentElement

                })
            }, 1000)
        }
        $scope.remoteDataConfig()


    });



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

    $('.DatePicker').datetimepicker({
        format: "YYYY-MM-DD",
        showClear: true
    }).on('dp.change', function(ev) {
        $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
    }).on('dp.show', function(ev) {
        $(this).change();
    })

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
        $('#DraftListModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0);
            $(".draftViewCls").scrollTop(0);
        })
    })
    $scope.TotalCount = 0; 

    draftlen = 20;
    argu = {};
    var loadMoreDrafts = function() {
        if (($scope.dataLen.length >= 20)) {
            argu.start = draftlen;
            argu.count = 20;

            $http.post(BASEURL + "/rest/v2/draft/UserProfile/readall", argu).then(function onSuccess(response) {
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
                    msg: data.responseMessage
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

    }, 200)

    // $rootScope.clickedOnDraftIcon = false;
    $scope.gotoEditDraft = function(opr, index, draftblob) {

        var gostateObj = {
            'decrData': "",
            'draftdata': draftblob,
            'FromDraft': true,
            'typeOfDraft': ''
        }
        var decryptedDraft = $filter('hex2a')(draftblob.Data ? draftblob.Data : draftblob.totData.Data)
        var jsonDraft = $filter('Xml2Json')(decryptedDraft)
        var backupWholeData = angular.copy(jsonDraft)
        for (i in backupWholeData) {
            for (j in backupWholeData[i]) {
                if (typeof backupWholeData[i][j] == 'object') {
                    var backupObj = backupWholeData[i][j];
                    delete backupWholeData[i][j];
                    backupWholeData[i][j] = [];
                    backupWholeData[i][j].push(backupObj);
                }
            }
            backupWholeData[i] = cleantheinputdata(backupWholeData[i])
            gostateObj.decrData = backupWholeData[i];
        }

        var specificReadObject = {
            "UserID": gostateObj.draftdata.UserID,
            "Entity": gostateObj.draftdata.Entity,
            "BPK": gostateObj.draftdata.BPK
        }
        $http.post(BASEURL + RESTCALL.DraftSpecificRead, specificReadObject).then(function(response) {

            gostateObj.typeOfDraft = response.headers().type

        }, function(error, status, headers, config) {

            $scope.alerts = [{
                type: 'Error',
                msg: error.responseMessage
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        })

        $state.go('app.adduser', {
            input: gostateObj
        })
    }

    $http.get(BASEURL + RESTCALL.UserManagementPK).then(function onSuccess(response) {
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
        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });
    
});
