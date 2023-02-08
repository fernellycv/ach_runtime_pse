angular.module('VolpayApp').controller('allstatemententriesCtrl', function($scope, $rootScope, $timeout, StmtRefService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, ConfirmationService, EntityLockService) {
    var authenticationObject = $rootScope.dynamicAuthObj;
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 
    
    $scope.tableView = [{

            "label": "EntryReference ID",
            "fieldName": "EntryReferenceId",
            "visible": true

        }, {
            "label": "Instruction Type",
            "fieldName": "InstructionData.InstructionType",
            "visible": true

        }, {
            "label": "Status",
            "fieldName": "Status",
            "visible": true

        }, {
            "label": "Account Servicing Institution",
            "fieldName": "StatementData.StatementAccountDetails.StmtAccServicingInstitution",
            "visible": true

        }, {
            "label": "Account",
            "fieldName": "StatementData.StatementAccountDetails.StmtAccountNo",
            "visible": true
        }, {
            "label": "Currency",
            "fieldName": "StatementEntryDetails.EntryCurrency",
            "visible": true

        }, {
            "label": "TXNE2EID",
            "fieldName": "StatementEntryDetails.EntryTxnE2EId",
            "visible": true

        }, {
            "label": "D/C Indicator",
            "fieldName": "StatementEntryDetails.EntryDrCrIndicator",
            "visible": true

        }, {
            "label": "Reversal Indicator",
            "fieldName": "FileStatus",
            "visible": true

        },
        {
            "label": "Statement Matching Status",
            "fieldName": "MatchingStatus",
            "visible": true

        }, {
            "label": "Statement Date",
            "fieldName": "StatementEntryDetails.EntryValueDate",
            "visible": true

        }, {
            "label": "Received Date",
            "fieldName": "InstructionData.ReceivedDate",
            "visible": true

        }
    ]

    $scope.IntnFormat = [{
            "actualvalue": "SWIFTACK",
            "displayvalue": "SWIFTACK"
        },
        {
            "actualvalue": "MT900",
            "displayvalue": "MT900"
        }

    ]
    $scope.spliceSearch = false;
    $scope.lskey = ["New Search"];
    $scope.isCollapsed = true;
    $scope.nothingSelected = true;
    //sessionStorage.currentObj = currentObj;
    $scope.retainSavedSearch = function() {
        $scope.lskey = ["New Search"];

        $scope.uDetails = {
            "Queryfield": [{
                "ColumnName": "UserID",
                "ColumnOperation": "=",
                "ColumnValue": sessionStorage.UserID
            }],
            "Operator": "AND"
        }
        $scope.uDetails = constructQuery($scope.uDetails);

        $http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.uDetails).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.userFullObj = data[0];
            $scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))


            if (Object.keys($scope.uData).indexOf('savedSearch') != -1) {

                if ("AllConfirmations" in $scope.uData.savedSearch) {

                    if ($scope.uData.savedSearch.AllConfirmations.length) {
                        for (var i in $scope.uData.savedSearch.AllConfirmations) {
                            $scope.lskey.push($scope.uData.savedSearch.AllConfirmations[i].name)
                        }

                    } else {
                        $scope.uData.savedSearch.AllConfirmations = [];

                        updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                    }
                } else {
                    $scope.uData.savedSearch.AllConfirmations = [];
                    updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                }
            } else {
                userData.savedSearch.AllConfirmations = [];
                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function(response) {})
            }
            
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $translate.use("es_ES");
        });
    }

    $scope.retainSavedSearch();

    $scope.buildSearchClicked = false;
    $rootScope.customDate1 = {};

    $scope.search = ($rootScope.search1) ? $rootScope.search1 : {};
    $scope.dSearch = $scope.search;

    $scope.resetBtnClicked = false;
    $scope.newSearch = false;

    $scope.setSortMenu = function() {

        /*

        "label":"Office Code",
        "fieldName":"OfficeCode",
        "visible":true,
        "searchVisible":true,
        "type":"dropdown" */

        $scope.sortMenu = [{

                "label": "Statement Instruction ID",
                "value": "InstructionID",
                "type": "text",
                "allow": "number",
                "visible": true
            }, {
                "label": "Statement Date",
                "value": "ReceivedDate",
                "type": "dateRange",
                "allow": "date",

                "visible": true
            }, {
                "label": "Value Date",
                "value": "EntryValueDate",
                "type": "dateRange",
                "allow": "date",

                "visible": true
            }, {
                "label": "Transaction End To End Reference",
                "value": "EntryTxnE2EId",
                "type": "text",
                "allow": "string",
                "visible": true
            }, {

                "label": "Original Related Reference",
                "value": "OriginalStatementReference",
                "type": "text",
                "allow": "string",
                "visible": true
            }, {

                "label": "Currency",
                "value": "EntryCurrency",
                "type": "dropdown",
                "allow": "string",
                "visible": true
            }, {

                "label": "Account Servicing Institution",
                "value": "StmtAccServicingInstitution",
                "type": "text",
                "allow": "string",
                "visible": true
            }, {
                "label": "Account Name",
                "value": "StmtAccountName",
                "type": "text",
                "allow": "string",
                "visible": true
            }, {
                "label": "Account Number",
                "value": "StmtAccountNo",
                "type": "text",
                "allow": "number",
                "visible": true
            }, {
                "label": "Status",
                "value": "Status",
                "type": "dropdown",
                "allow": "string",
                "visible": true
            }, {
                "label": "Reversal Indicator",
                "value": "EntryReversalIndicator",
                "type": "dropdown",
                "allow": "string",
                "visible": true
            }, {

                "label": "Statement Matching Status",
                "value": "MatchingStatus",
                "type": "dropdown",
                "allow": "string",
                "visible": true

            }, {
                "label": "Debit/Credit Mark",
                "value": "EntryDrCrIndicator",
                "type": "dropdown",
                "allow": "string",
                "visible": true
            }

        ]
    }
    $scope.setSortMenu()

    function setFlag(val) {
        if (val) {
            return true;
        } else {
            return false;
        }
    }
    $scope.customDate = {
        startDate: '',
        endDate: ''
    }
    $scope.commonObj = ConfirmationService.distInstruction;

    ConfirmationService.distInstruction.currentObj.sortBy = [];

    $scope.dateSet = function() {
        /*
        $('#dropdownBtnTxt').html(GlobalService.selectCriteriaTxt)
        $('.menuClass').removeClass('listSelected').addClass('listNotSelected')
        $('#menulist_' + GlobalService.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected'); */


        $scope.dateFilter = ConfirmationService.distInstruction.dateFilter;

        for (i in $scope.dateFilter) {
            if ($scope.dateFilter[i]) {
                $('#dropdownBtnTxt').text($filter('ucwords')(i))
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
    $scope.dateSet()

    $scope.loadedData = '';
    $scope.uorVal = $scope.uorFound = $scope.commonObj.uorVal;

    $scope.fieldArr = $scope.commonObj.currentObj;
    var len = 20;
    $scope.fieldArr.start = 0;
    $scope.changeViewFlag = GlobalService.viewFlag;

    $scope.retExpResult = function() {
        if (!$scope.dateFilter.custom) {
            $scope.customDate = {
                startDate: '',
                endDate: ''
            }
        }

        if ($scope.dateFilter.all) {
            $scope.dateArr = [];
        } else if ($scope.dateFilter.today) {
            $scope.dateArr = [{
                "ColumnName": "ReceivedDate",
                "ColumnOperation": "=",
                "ColumnValue": todayDate()
            }]
        } else if ($scope.dateFilter.week) {
            $scope.dateArr = [{
                "ColumnName": "ReceivedDate",
                "ColumnOperation": ">=",
                "ColumnValue": week().lastDate
            }, {
                "ColumnName": "ReceivedDate",
                "ColumnOperation": "<=",
                "ColumnValue": week().todayDate
            }]
        } else if ($scope.dateFilter.month) {
            $scope.dateArr = [{
                "ColumnName": "ReceivedDate",
                "ColumnOperation": ">=",
                "ColumnValue": month().lastDate
            }, {
                "ColumnName": "ReceivedDate",
                "ColumnOperation": "<=",
                "ColumnValue": month().todayDate
            }]

        } else if ($scope.dateFilter.custom) {
            $scope.customDate.startDate = ConfirmationService.distInstruction.customDate.startDate;
            $scope.customDate.endDate = ConfirmationService.distInstruction.customDate.endDate;

            $('#customDate').modal('hide')
            $scope.dateArr = [{
                "ColumnName": "ReceivedDate",
                "ColumnOperation": ">=",
                "ColumnValue": $scope.customDate.startDate
            }, {
                "ColumnName": "ReceivedDate",
                "ColumnOperation": "<=",
                "ColumnValue": $scope.customDate.endDate
            }]

        }

        return $scope.dateArr;

    }
    $scope.retExpResult()

    /* Query Constructor */
    $scope.uorQueryConstruct = function(arr, flag) {
        ConfirmationService.distInstruction.currentObj = arr;
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.Queryfield = [{
            "ColumnName": "InstructionType",
            "ColumnOperation": "=",
            "ColumnValue": "STATEMENT"
        }];
        $scope.Qobj.QueryOrder = [];

        /* $scope.Qobj.QueryOrder = [{
        	"ColumnName": "EntryValueDate",
        	"ColumnOrder": "Desc"
        }];  */
        if (flag) {

            $scope.Qobj.QueryOrder = [];
        }

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
        sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
        sessionStorage.allconfirmObj = JSON.stringify(_query)
        $scope.nothingSelected = true;

        $http.post(BASEURL + RESTCALL.AllstatementTxnList, _query).then(function onSuccess(response) {
            // Handle success

            $rootScope.count = response.headers().totalcount
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.items = data;
            $scope.loadedData = data;
            $('.alert-danger').hide()
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.items = [];
            $scope.loadedData = [];
            if (data.error.code == 401) {
                LogoutService.Logout();
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
            }
        });
    }

    $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

    $scope.refresh = function() {

        //$scope.initCall()
        /* $(".listView").scrollTop(0);
        len = 20;

        ConfirmationService.distInstruction = {
        	currentObj: {
        		"sortBy": [],
        		"params": [],
        		"start": 0,
        		"count": 20
        	},
        	uorVal: '',
        	dateFilter: {
        		all: true,
        		today: false,
        		week: false,
        		month: false,
        		custom: false
        	},
        	searchFound: false,
        	customDate: {
        		startDate: '',
        		endDate: ''
        	}

        }

        $scope.customDate = {
        	startDate: '',
        	endDate: ''
        }

        $rootScope.search1 = {
        	"EntryDate": {
        		"Start": "",
        		"End": ""
        	}
        }

        $scope.dateSet()

        $scope.buildSearchClicked = false;
        $rootScope.customDate1 = {};
        $scope.search = ($rootScope.search1) ? $rootScope.search1 : {};
        $scope.dSearch = $scope.search;
        $scope.resetBtnClicked = false;
        $scope.newSearch = false;

        $scope.uorVal = $scope.uorFound = $scope.commonObj.uorVal = '';

        $scope.fieldArr = {
        	"sortBy": [],
        	"params": [],
        	"start": 0,
        	"count": 20
        };
        $timeout(function () {

        	customDateRangePicker("EntryDateStart", "EntryDateEnd")
        	for (var i in $scope.sortMenu) {

        		if ($scope.sortMenu[i].type == 'dropdown') {
        			$(sanitize('select[name=' + $scope.sortMenu[i].value + ']')).select2({
        				data: []
        			})
        		}
        	}
        	$scope.remoteDataConfig()

        	$('.input-group-addon').on('click focus', function (e) {
        		$(this).prev().focus().click()
        	})
        }, 0) */

        $scope.initCall(JSON.parse(sessionStorage.allconfirmObj))

        $('.table-responsive').find('table').find('thead').find('th').find('span').removeAttr('class')
            //$state.reload();

    }

    $scope.FilterByDate = function(params, eve) {
        //customDateRangePicker('CstartDate','CendDate')
        $('.menuClass').removeClass('listSelected')
        if (params != 'custom') {

            $(eve.currentTarget).addClass('listSelected')
        } else {

            $('.menuClass:nth-child(5)').addClass('listSelected')
        }

        $('#dropdownBtnTxt').html($filter('ucwords')(params))

        for (var i in $scope.dateFilter) {
            $scope.dateFilter[i] = false;
        }

        $scope.dateFilter[params] = true;

        if ($scope.dateFilter.custom) {

            $('#customDate').modal('hide')
            ConfirmationService.distInstruction.customDate.startDate = $scope.customDate.startDate;
            ConfirmationService.distInstruction.customDate.endDate = $scope.customDate.endDate;


        }

        $scope.dateArr = $scope.retExpResult()

        for (var i in $scope.fieldArr.params) {
            if (($scope.fieldArr.params[i].ColumnName == 'ReceivedDate') || (!$scope.fieldArr.params[i].advancedSearch)) {
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

        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

    }

    $scope.$watch('fieldArr.params', function(nArr, oArr) {

        if (nArr.length) {
            ConfirmationService.distInstruction.searchFound = true;
        } else {
            ConfirmationService.distInstruction.searchFound = false;
        }

        //$scope.searchFound = ConfirmationService.distInstruction.searchFound;
    })

    $scope.uorSearch = function() {

        $scope.isAdvacedSearchClicked = false;

        if ($scope.uorVal) {

            $scope.search = {
                "InstructionData": {
                    "ReceivedDate": {
                        "Start": "",
                        "End": ""
                    }
                }
            }

            $scope.uorFound = $scope.uorVal;

            ConfirmationService.distInstruction.uorVal = $scope.uorVal;
            len = 20;
            $scope.uorSearchFound = false;

            for (var i in $scope.fieldArr.params) {
                if (!$scope.fieldArr.params[i].advancedSearch) {
                    if ($scope.fieldArr.params[i].ColumnName == 'InstructionID') {
                        $scope.uorSearchFound = true;
                        $scope.fieldArr.params[i].ColumnName = 'InstructionID';
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
                    "ColumnName": "InstructionID",
                    "ColumnOperation": "like",
                    "ColumnValue": $scope.uorVal,
                    'advancedSearch': false
                })
            }

            //$scope.searchFound = true;
            $scope.fieldArr.start = 0;
            $scope.fieldArr.count = len;

            $scope.query = $scope.uorQueryConstruct($scope.fieldArr)
            $scope.initCall($scope.query)

        }

    }

    $scope.showErrorMessage = function(items) {

        $scope.alerts = [{
            type: 'danger',
            msg: items.data.error.message
        }];
        $scope.items = [];
        $scope.alertMsg = true;
    }

    $scope.CustomDatesReset = function() {
        $scope.customDate = {
            startDate: '',
            endDate: ''
        }
    }

    $scope.allowOnlyNumbersAlone = function($event) {
        var txt = String.fromCharCode($event.which);
        if (!txt.match(/[0-9]/)) //+#-.
        {
            $event.preventDefault();
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
                ConfirmationService.distInstruction.uorVal = '';

                for (var j in $scope.fieldArr.params) {
                    if ($scope.fieldArr.params[j].ColumnName == "InstructionID") {
                        $scope.fieldArr.params.splice(j, 1)

                    }
                }

                $scope.fieldArr.start = 0;
                $scope.fieldArr.count = 20;
                $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

            }
        }
    }

    /* Clear Search Results */
    $scope.clearSearch = function() {
        //$scope.searchFound = false;
        $scope.loadedData = '';

        $scope.fieldArr = {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        };

        len = 20;
        $scope.uorVal = '';
        $scope.uorFound = '';
        ConfirmationService.distInstruction.uorVal = '';
        $scope.search = {
            "InstructionData": {
                "ReceivedDate": {
                    "Start": "",
                    "End": ""
                }
            }
        }
        $scope.newSearch = false;
        $scope.dSearch = $scope.search;
        $rootScope.search1 = {
            "InstructionData": {
                "ReceivedDate": {
                    "Start": "",
                    "End": ""
                }
            }
        }

        $scope.customDate = {
            startDate: '',
            endDate: ''
        }

        //$scope.dateArr = [];

        $timeout(function() {
            for (var i in $scope.sortMenu) {

                if ($scope.sortMenu[i].type == 'dropdown') {
                    $(sanitize('select[name=' + $scope.sortMenu[i].value + ']')).select2({
                        data: []
                    })
                }
            }
            $scope.remoteDataConfig()

        }, 100)

        $timeout(function() {
            customDateRangePicker("EntryValueDateStart", "EntryValueDateEnd")
        }, 10)

        //$scope.resetFilter();
        ConfirmationService.distInstruction.dateFilter = {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        }
        $scope.dateSet()
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
            //$state.reload()

    }

    $scope.resetFilter = function() {
        //$scope.showSearchWarning = false;
        $("#showWarning").hide();
        $scope.buildSearchClicked = true;
        $scope.resetBtnClicked = true;
        $scope.AdsearchParams = {

            "InstructionData": {
                "ReceivedDate": {
                    "Start": "",
                    "End": ""
                }
            }
        }

        $scope.search = angular.copy($scope.AdsearchParams);
        $rootScope.search1 = {
            "InstructionData": {
                "ReceivedDate": {
                    "Start": "",
                    "End": ""
                }
            }
        }

        $timeout(function() {
            customDateRangePicker('EntryValueDateStart', 'EntryValueDateEnd')
            customDateRangePicker("ReceivedDateStart", "ReceivedDateEnd")
            for (var i in $scope.sortMenu) {

                if ($scope.sortMenu[i].type == 'dropdown') {
                    $(sanitize('select[name=' + $scope.sortMenu[i].value + ']')).select2({
                        data: []
                    })
                }
            }
            $scope.remoteDataConfig()

            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click()
            })
        }, 0)
        $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');

        $scope.setSortMenu()
        $scope.buildSearch()
    }

    /* Load more */
    $scope.loadMore = function(query) {
        sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;

        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;

        $http.post(BASEURL + RESTCALL.AllstatementTxnList, $scope.uorQueryConstruct($scope.fieldArr)).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.items = $scope.items.concat(data);
            $scope.loadedData = data;
            len = len + 20;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    /* Sorting */

    $scope.gotoSorting = function(dat) {

        $scope.fieldArr.start = 0;
        $scope.fieldArr.count = len;

        var orderFlag = true;

        if ($scope.fieldArr.sortBy.length) {

            for (var i in $scope.fieldArr.sortBy) {
                if ($scope.fieldArr.sortBy[i].ColumnName == dat.fieldName) {
                    if ($scope.fieldArr.sortBy[i].ColumnOrder == 'Asc') {

                        $(sanitize('#' + dat.fieldName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.fieldName + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.fieldArr.sortBy[i].ColumnOrder = 'Desc';
                        orderFlag = false;
                        break;
                    } else {

                        $scope.fieldArr.sortBy.splice(i, 1);
                        orderFlag = false;
                        $(sanitize('#' + dat.fieldName + '_icon')).attr('class', 'fa fa-minus fa-sm')
                        $(sanitize('#' + dat.fieldName + '_Icon')).removeAttr('class')
                        break;
                    }

                }
            }

            if (orderFlag) {

                $(sanitize('#' + dat.fieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
                $(sanitize('#' + dat.fieldName + '_Icon')).attr('class', 'fa fa-caret-up')
                $scope.fieldArr.sortBy.push({
                    "ColumnName": dat.fieldName,
                    "ColumnOrder": 'Asc'
                })

            }
        } else {

            $(sanitize('#' + dat.fieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.fieldName + '_Icon')).attr('class', 'fa fa-caret-up')

            $scope.fieldArr.sortBy.push({
                "ColumnName": dat.fieldName,
                "ColumnOrder": 'Asc'
            })
        }
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, true))
    }


    $scope.showSearchWarning = false;

    $scope.cleantheinputdata = function(newData) {

        $.each(newData, function(key, value) {
            delete newData.$$hashkey;
            if ($.isPlainObject(value)) {
                var isEmptyObj = $scope.cleantheinputdata(value)
                if ($.isEmptyObject(isEmptyObj)) {
                    delete newData[key]
                }
            } else if (Array.isArray(value) && !value.length) {
                delete newData[key]
            } else if (value === "" || value === undefined || value === null) {
                delete newData[key]
            }
        })

        return newData
    }

    $scope.savedSearchSelected = false;

    $scope.buildSearch = function() {        
        $scope.uorFound = $scope.uorVal = "";
        $scope.search = $scope.cleantheinputdata($scope.search)
        $scope.showSearchWarning = $.isEmptyObject($scope.search)
        $rootScope.search1 = angular.copy($scope.search);
        $scope.searchArr = [];

        for (i in $scope.search) {
            if (i == 'InstructionData') {
                for (var j in $scope.search[i]) {
                    if ($scope.search[i][j].Start && $scope.search[i][j].End) {

                        $scope.searchArr.push({
                            "ColumnName": j,
                            "ColumnOperation": ">=",
                            "ColumnValue": $scope.search[i][j].Start,
                            'advancedSearch': true
                        });
                        $scope.searchArr.push({
                            "ColumnName": j,
                            "ColumnOperation": "<=",
                            "ColumnValue": $scope.search[i][j].End,
                            'advancedSearch': true
                        });
                    }
                }

            } else {
                if (Array.isArray($scope.search[i])) {
                    for (var j in $scope.search[i]) {
                        $scope.searchArr.push({
                            "ColumnName": i,
                            "ColumnOperation": "=",
                            "ColumnValue": $scope.search[i][j],
                            'advancedSearch': true
                        })
                    }
                } else {
                    $scope.searchArr.push({
                        "ColumnName": i,
                        "ColumnOperation": "=",
                        "ColumnValue": $scope.search[i],
                        'advancedSearch': true
                    })
                }
            }

        }

        //$scope.search = $scope.cleantheinputdata($scope.search)
        //$("#showWarning").show();
        $scope.dSearch = angular.copy($scope.search);

        $scope.fieldArr.params = $scope.retExpResult()
        $scope.fieldArr.params = $scope.searchArr.concat($scope.fieldArr.params);
        if ((!$scope.showSearchWarning || $scope.spliceSearch || $scope.buildSearchClicked)) {
            if(!$scope.buildSearchClicked){
                $('#distSearch').collapse('hide')
                }
            $scope.distSearch = true;

            if ($scope.resetBtnClicked) {
                $scope.distSearch = false;
                setTimeout(function() {
                    $scope.resetBtnClicked = false
                }, 1000)
            }

            $scope.fieldArr.start = 0;

            sessionStorage.allconfirmObj = JSON.stringify($scope.uorQueryConstruct($scope.fieldArr));
            $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
            $scope.spliceSearch = false;

        }

        /*else{
        $scope.resetBtnClicked = false
        }*/

        $scope.savedSearchSelected = false;

        return {
            'service': ConfirmationService.distInstruction,
            'searchParams': $scope.search
        };

    }

    $scope.rstAdvancedSearchFlag = function() {

        $scope.distSearch = true;
        $scope.buildSearchClicked = false;
        if($scope.distSearch){
            $('#distSearch').collapse('hide')
        }
        $scope.AdsearchParams = {
            "InstructionData": {
                "ReceivedDate": {
                    "Start": "",
                    "End": ""
                }
            }
        }

        $scope.search = angular.copy($scope.AdsearchParams);
        $rootScope.search1 = $scope.search;
        $scope.dSearch = angular.copy($scope.search);

        $timeout(function() {
                for (var i in $scope.sortMenu) {
                    if ($scope.sortMenu[i].type == 'dropdown') {
                        $(sanitize('select[name=' + $scope.sortMenu[i].value + ']')).select2({
                            data: []
                        })
                    }
                }
                $scope.remoteDataConfig()
            }, 100)
            //$scope.resetFilter()
    }

    $scope.keyIndex = '';
    $scope.saveSearch = function() {
        if ($scope.searchname) {
            $scope.isSearchNameFilled = false;
            for (var key in userData.savedSearch.AllConfirmations) {
                if (userData.savedSearch.AllConfirmations[key].name == $scope.searchname) {
                    $scope.searchNameDuplicated = true;
                    $scope.keyIndex = key;
                    break;
                } else {
                    $scope.searchNameDuplicated = false;
                }

            }
        }
        if (!$scope.searchNameDuplicated) {
            var saveSearchObjects = $scope.buildSearch();
            if ($scope.searchname) {
                $scope.searchSet = false;
                for (i in $scope.search) {
                    if (i == 'ReceivedDate') {
                        for (j in $scope.search[i]) {
                            for (var k in $scope.search[i][j]) {
                                if (($scope.search[i][j].Start != '') && ($scope.search[i][j].End != '')) {
                                    $scope.searchSet = true;
                                }
                            }

                        }
                    } else {

                        if ($scope.search[i] != '') {
                            $scope.searchSet = true;
                        }
                    }
                }

                if ($scope.searchSet) {
                    userData.savedSearch.AllConfirmations.push({
                        'name': $scope.searchname,
                        'params': saveSearchObjects
                    })

                    for (var i in userData.defaultChartTypes.paymentDashoard) {
                        if (userData.defaultChartTypes.paymentDashoard[i].data) {
                            delete userData.defaultChartTypes.paymentDashoard[i].data;
                        }
                    }

                    updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {
                        if (response.Status == 'danger') {
                            $scope.alerts = [{
                                type: 'danger',
                                msg: response.data.data.error.message
                            }];
                        } else {
                            $scope.retainSavedSearch();
                            $scope.distSearch = true;
                            //AllPaymentsGlobalData.searchname = $scope.searchname;
                            //$scope.searchName = AllPaymentsGlobalData.searchname;
                            //$scope.testing();
                        }

                    })

                    $('#myModal1').modal('hide');
                } else {
                    $scope.isAnyFieldFilled = true;
                }
            }
        }

    }

    $scope.saveSearch1 = function() {
        $scope.advanceSearchCollaspe();
        var saveSearchObjects = $scope.buildSearch();
        $('#myModal1').modal('hide');

        userData.savedSearch.AllConfirmations[$scope.keyIndex].name = $scope.searchname;
        userData.savedSearch.AllConfirmations[$scope.keyIndex].params = saveSearchObjects;
        for (var i in userData.defaultChartTypes.paymentDashoard) {

            if (userData.defaultChartTypes.paymentDashoard[i].data) {
                delete userData.defaultChartTypes.paymentDashoard[i].data;
            }

        }
        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {

            $scope.retainSavedSearch();
        })
    }

    $scope.selectSearch = function(data, eve, index) {

        if(data == 'New Search'){
            $('#distSearch').collapse('show')
        }
        else{
            $('#distSearch').collapse('hide')
        }

        //$scope.newSearch = false;
        if ($(eve.currentTarget).find('span:first-child').text() != 'New Search') {
            $scope.searchName = $scope.lskey[index];
            $scope.search = $scope.uData.savedSearch.AllConfirmations[index - 1].params.searchParams;
            $scope.savedSearchSelected = true;
            if( $scope.distSearch){
                $('#distSearch').collapse('hide')   
            }
            $scope.buildSearch()
        } else {
            //	$("#showWarning").hide();
            //$scope.showSearchWarning = false;
            $scope.distSearch = false;
            //$scope.resetFilter()
            $scope.newSearch = true;

            $scope.buildSearchClicked = true;

            $scope.resetBtnClicked = true;
            $scope.AdsearchParams = {
                "InstructionData": {
                    "ReceivedDate": {
                        "Start": "",
                        "End": ""
                    }
                }

            }

            $scope.search = angular.copy($scope.AdsearchParams);
            $rootScope.search1 = {
                "InstructionData": {
                    "ReceivedDate": {
                        "Start": "",
                        "End": ""
                    }
                }
            }

            $timeout(function() {
                customDateRangePicker('EntryValueDateStart', 'EntryValueDateEnd')
                for (var i in $scope.sortMenu) {

                    if ($scope.sortMenu[i].type == 'dropdown') {
                        $(sanitize('select[name=' + $scope.sortMenu[i].value + ']')).select2({
                            data: []
                        })
                    }
                }
                $scope.remoteDataConfig()

                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()
                })
            }, 0)
            $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');

            $scope.setSortMenu()
            $scope.buildSearch()
        }
    }

    $scope.spliceSearchArr = function(key) {

        delete $scope.search[key];
        $scope.buildSearchClicked = true;
        $scope.dArr = ["FileStatus", "InputReferenceCode"]
        $timeout(function() {

            for (var i in $scope.dArr) {
                if (key == $scope.dArr[i]) {
                    $("select[name='" + $scope.dArr[i] + "']").select2("destroy");
                    $("select[name='" + $scope.dArr[i] + "']").val("");
                    $("select[name='" + $scope.dArr[i] + "']").select2({
                        placeholder: 'Select an option'
                    });
                }
            }

        }, 100)

        $scope.spliceSearch = true;
        $scope.buildSearch()
    }

    $scope.retainAlert = function(eve) {

        $(eve.currentTarget).parent().removeClass('in')
        $scope.showSearchWarning = false;
    }


    $scope.advanceSearchCollaspe = function(){
        
        if($scope.distSearch){
            $('#distSearch').collapse('show')
        }
        else{
            $('#distSearch').collapse('hide')
        }
        $scope.distSearch = !$scope.distSearch;
        $scope.showSearchWarning = false;
    }


    $scope.ClearAlert = function() {
        $scope.searchname = '';
        $scope.searchNameDuplicated = false;
        $scope.isAnyFieldFilled = false;
    }

    var statusArr = [];
    var newArr = [];

    $scope.statusArrnames = [];

    $scope.selectOptions = [];

    /*** Fetching All Unique File Status ***/
    /* PersonService.totalFileStatus().then(function (items) {

    	for (var i = 0; i < items.length; i++) {
    		statusArr.push(items[i].FileStatus)
    	}

    	$scope.statusArrnames = statusArr;
    	$scope.uniqueNames = items.FileStatus;
    	

    	$scope.uniqueNames.sort();
    }) */

    $scope.uniqueNamesSelect = function() {

        $http({
            method: "POST",
            url: BASEURL + RESTCALL.AllstatementTxnList

        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    $scope.uniqueNamesSelect()

    $scope.limit = 500;
    $scope.setInitval = function() {

        var MOPArray = [];
        var CURArray = [];
        var query = {
            start: 0,
            count: $scope.limit,
            sorts: []
        }
        $scope._uDetails = {
            "filters": {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": [{
                                "columnName": "MsgType",
                                "operator": "=",
                                "value": "RESPONSE"
                            }]
                        }]
                    }]
                }]
            },
            "sorts": [],
            "start": 0,
            "count": 200
        }


        $http.post(BASEURL + "/rest/v2/serviceconfigurations" + '/readall', $scope._uDetails).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.MSGTYPE = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });

        $http({
            method: "POST",
            url: BASEURL + '/rest/v2/methodofpayments/readall',
            data: query

        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (k in data) {
                MOPArray.push(data[k].MOP)
            }
            $scope.psaCodeDrop = uniques(MOPArray);
            $scope.dynamicArr = ["InputReferenceCode"]
            for (var i in $scope.dynamicArr) {
                $("select[name=" + $scope.dynamicArr[i] + "]").select2()
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });

        $http({
            method: "POST",
            url: BASEURL + '/rest/v2/currencies/readall',
            data: query

        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (k in data) {
                CURArray.push(data[k].CurrencyCode)
            }

            $scope.CurrencyCodeDrop = uniques(CURArray);
            $scope.dynamicArr = ["CurrencyCode"]
            for (var i in $scope.dynamicArr) {
                $("select[name=" + $scope.dynamicArr[i] + "]").select2()
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

    $scope.setInitval()

    $(document).ready(function() {

        $scope.limit = 500;

        $scope.remoteDataConfig = function() {
            $(".appendSelect2").select2({
                ajax: {
                    url: BASEURL + RESTCALL.OfficeCode,
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
                                'id': data[j].actualvalue,
                                'text': data[j].displayvalue
                            })
                        }
                        return {
                            results: myarr,
                            pagination: {
                                more: data.length >= $scope.limit
                            }
                        };

                    },
                    cache: true
                },
                placeholder: 'Select an option',
                minimumInputLength: 0,
                allowClear: true

            })

        }
    })

    $scope.clickRefId = function(id, index) {

        GlobalService.fileListIndex = index;
        GlobalService.fileListId = id.InstructionID;
        GlobalService.instructionType = id.InstructionType;
        GlobalService.instructionformat = id.InstructionFormat;
        $scope.Obj = {
            'nav': {
                'UIR': id.InstructionFormat,
                'PID': ''
            },
            'from': 'allconfirmations'

        }
        $scope.Obj = {
            'uor': '',
            'nav': {
                'UIR': id.InstructionID,
                'PID': ''
            },
            'from': 'allconfirmations'
        }

        $state.go('app.statementdetail', {
            input: $scope.Obj
        })
    }

    /* Go To Payment Summary */
    $scope.detail = function(val, eve) {
        //if((!$(eve.target).hasClass('fa-download')) || !$scope.changeViewFlag)
        //{
        //$state.go('app.outputpaymentsummary',{input:{'uor':val.UniqueOutputReference,'nav':{},'from':'output'}})
        //}


    }

    $scope.AuditLog = function(id) {
        $http.get(BASEURL + '/rest/v2/statements/getlogaudit/' + id.EntryReferenceId).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.StmtLog = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    /* Export the data to CSV*/




    $scope.makeCall = function() {

        $scope.details = JSON.parse(sessionStorage.allconfirmObj);
        $scope.details.count = ($rootScope.count) ? $rootScope.count : 100000



        $http.post(BASEURL + RESTCALL.AllstatementTxnList, $scope.details).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            var colName = ["InstructionID", "InstructionType", "InstructionFormat", "ReceivedDate", "InputReferenceCode", "FileStatus"];
            JSONToExport(bankData, data, 'All Statements', true, colName);
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    $scope.exportToExcel = function() {
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.makeCall();
            //var colName = ["InstructionID", "InstructionType", "EntryDate", "InputReferenceCode", "FileStatus"];
            //JSONToExport(bankData, $scope.items, 'All Confirmations', true, colName);
        } else {

            var colName = ["InstructionID", "InstructionType", "ReceivedDate", "InputReferenceCode", "FileStatus"];

            $scope.dat = angular.copy($scope.items);
            JSONToExport(bankData, $scope.dat, 'All Statements', true, colName);
        }
    }

    $scope.exportToTextDoc = function(name, UIR) {
        filename = UIR + '_' + name;
        var content;
        var FLDownloadObj = {};
        FLDownloadObj.InstructionID = UIR;

        $http.post(BASEURL + RESTCALL.Filedownload, FLDownloadObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            content = data[0].Data;
            bankData.textDownload($filter('hex2a')(content), filename);
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
        });
    }

    /* Print*/
    $scope.printFLpage = function() {
        window.print()
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                $scope.widthOnScroll();
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.loadedData.length >= 20) {
                        debounceHandler()
                    }
                }
            })
            setTimeout(function() {}, 1000)
        });

    /* 	 $scope.SelectValue = function (index) {
    $scope.seeVisible = false;
    $scope.FieldsValues[index]['visible'] = !$scope.FieldsValues[index]['visible'];

    $scope.search[$scope.FieldsValues[index]['value']] = '';

    setTimeout(function () {
    $scope.triggerSelect2()
    }, 10);

    for (var i in $scope.FieldsValues) {
    if ($scope.FieldsValues[i].visible) {
    $scope.seeVisible = true;
    }
    }

    /*setTimeout(function () {
    $scope.customDateRangePicker('EntryDateStart', 'EntryDateEnd')
    }, 150)

    if($scope.FieldsValues[index].value == 'EntryDate'){

    setTimeout(function(){
    $scope.customDateRangePicker('EntryDateStart', 'EntryDateEnd')
    $('.input-group-addon').on('click focus', function(e){
    $(this).prev().focus().click()

    })
    },1000)
    }

    if ($scope.seeVisible) {
    $('#saveSearchBtn,#AdSearchBtn').removeAttr('disabled', 'disabled');
    } else {
    $scope.advancedSearch = true;
    GlobalService.advancedSearchEnable = false;
    $scope.advancedSearchEnable = GlobalService.advancedSearchEnable;
    $('#saveSearchBtn,#AdSearchBtn').attr('disabled', 'disabled');

    }
    }
     */
    $scope.SelectValue = function(index) {

        //setTimeout(function () {

        $scope.seeVisible = false;
        $scope.sortMenu[index]['visible'] = !$scope.sortMenu[index]['visible'];

        $scope.search[$scope.sortMenu[index]['value']] = '';

        if ($scope.sortMenu[index].value == 'ReceivedDate') {
            setTimeout(function() {
                customDateRangePicker('EntryValueDateStart', 'EntryValueDateEnd')
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()

                })
            }, 1000)

        }

        for (var i in $scope.sortMenu) {
            if ($scope.sortMenu[i].visible) {
                $scope.seeVisible = true;
            }
        }

        if ($scope.seeVisible) {
            $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');
        } else {
            $scope.distSearch = true;
            $('#saveSearchBtn, #AdSearchBtn').attr('disabled', 'disabled');
        }

        setTimeout(function() {
            for (var i in $scope.sortMenu) {
                if ($scope.sortMenu[i].type == 'dropdown') {
                    $(sanitize('select[name=' + $scope.sortMenu[i].value + ']')).select2({
                        data: [],
                        placeholder: 'Select an option'
                    })
                }
            }
        }, 10)

        //}, 10);

    }

    /* $scope.confirmationAlert = function (index) {

    $scope.showAlertMsg = true;
    $scope.selectedSearchName = index;
    $scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
    }
     */
    $scope.showAlertMsg = false;
    $scope.confirmationAlert = function(index) {
        $scope.showAlertMsg = true;
        $scope.selectedSearchName = index;
        $scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
    }
    $scope.deleteSelectedSearch = function(eve) {
        userData.savedSearch.AllConfirmations.splice($scope.selectedSearchName - 1, 1)
        for (var i in userData.defaultChartTypes.paymentDashoard) {
            if (userData.defaultChartTypes.paymentDashoard[i].data) {
                delete userData.defaultChartTypes.paymentDashoard[i].data;
            }
        }
        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {
            $scope.retainSavedSearch();
            $scope.alerts = [{
                type: response.Status,
                msg: (response.Status == 'success') ? 'Borrado exitosamente' : response.data.data.error.message
            }];


            setTimeout(function() {
                $('.alert-success,.alert-danger').hide();
            }, 4000)
            $('#alertBox').modal('hide');
        })
    };

    $scope.notAllowAnything = function(eve) {

        if ((eve.keyCode == 8) || (eve.keyCode == 9)) {
            return;
        } else {
            eve.preventDefault();
        }
    }

    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        GlobalService.viewFlag = newValue;
        $(".listView").scrollTop(0);
    })

    var textVal = ''

    $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.cData = data;
        $scope.backupData = angular.copy(data)
        $scope.profileName = $scope.cData.TimeZone;
        textVal = $scope.profileName;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

    });

    $scope.resendDist = function(uor) {
        $http.post(BASEURL + RESTCALL.ResendDistInstruction + uor).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }];

            $timeout(function() {
                $('.alert-success').hide()
            }, 5000)
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
            $timeout(function() {
                $('.alert-danger').hide()
            }, 5000);
        });
    }

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    }

    /* used to store select view in the global variable for furture use */
    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {

        $scope.changeViewFlag1 = false;
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
    $scope.findHeader = function() {

            if ($scope.changeViewFlag1) {
                $(".floatThead ").find("thead").hide();
            } else {
                $(".floatThead ").find("thead").show();
            }

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
                }, 300)
                if ($(".dataGroupsScroll").scrollTop() == 0) {
                    $(".dataGroupsScroll").scrollTop(50)
                }

            })
            //$(window).trigger('resize');

    })

    $scope.datePlaceholderValue = "";
    $(document).ready(function() {
        $(".dateTypeKey").keypress(function(event) {
            var regex = /^[0-9]$/;
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (!(keycode == '8')) {
                if (regex.test(String.fromCharCode(keycode))) {
                    if ($(this).val().length == 4) {
                        $(this).val($(this).val() + "-");
                    } else if ($(this).val().length == 7) {
                        $(this).val($(this).val() + "-");
                    } else if ($(this).val().length >= 10) {
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                }
            }

        });

        $(".dateTypeKey").focus(function() {
            $scope.datePlaceholderValue = $(this).attr('placeholder');
            $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
        }).blur(function() {
            $(this).attr('placeholder', $scope.datePlaceholderValue);
        })
    });

    function fetchDotValue(val, argu, flag) {
        for (var _argu in argu) {
            if (val[argu[_argu]] && typeof(val[argu[_argu]]) === 'object') {
                return fetchDotValue(val[argu[_argu]], argu, true);
            } else if (val[argu[_argu]]) {
                return val[argu[_argu]];
            }
        }
    }

    $scope.displayval = function(val, argu) {
        if (argu.indexOf('.') !== -1) {
            return fetchDotValue(val, argu.split('.'))
        } else {
            return val[argu];
        }
    }

    $scope.actionDrop = function(obj) {
        $scope.bulkObj = {
            Payments: [],
            ActionName: []
        };

        $scope.aDropVal = [];

        $http.post(BASEURL + RESTCALL.ActionDropdown, obj).then(function onSuccess(response) {
            // Handle success
            var data1 = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (var i in $scope.uniqPayments) {
                $scope.bulkObj.Payments.push({
                    'PaymentID': $scope.uniqPayments[i]
                })
            }

            for (var j in data1) {
                $scope.bulkObj.ActionName.push({
                    'ActionName': data1[j].ActionName
                })
            }

            if (data1.length) {
                $http.post(BASEURL + RESTCALL.BulkActionDetail, $scope.bulkObj).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    if (data.length) {
                        $scope.aDropVal = [];

                        for (var x in data) {
                            for (var y in data1) {
                                if ((data[x].ActionName == data1[y].ActionName) && data[x].Applicability == 'Enable') {
                                    $scope.aDropVal.push(data1[y]);
                                }
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
            //$scope.aDropVal = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }


    $scope.checkStatus = function(event, allpayments1) {

        $scope.allowedStatus = allpayments1;

        if ($(event.currentTarget).prop("checked")) {

            for (var i in $scope.items) {
                if (allpayments1 == $scope.items[i].Status) {} else {
                    $('#check_' + i).attr('disabled', true)
                }
            }
        } else {
            $('.checkBoxClass').attr('disabled', false)
        }

    }


});
