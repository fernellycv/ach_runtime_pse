angular.module('VolpayApp').controller('systeminteractionCtrl', ['$scope', '$rootScope', '$timeout', 'PersonService', '$location', '$state', '$http', '$translate', 'GlobalService', 'bankData', '$filter', 'LogoutService', 'SystemInteractionService', 'EntityLockService', function($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, SystemInteractionService, EntityLockService) {

    $scope.spliceSearch = false;
    $scope.lskey = ["New Search"];
    $scope.isCollapsed = true;
    $scope.nothingSelected = true;
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 

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

                if ("Allsysteminteraction" in $scope.uData.savedSearch) {

                    if ($scope.uData.savedSearch.Allsysteminteraction.length) {
                        for (var i in $scope.uData.savedSearch.Allsysteminteraction) {
                            $scope.lskey.push($scope.uData.savedSearch.Allsysteminteraction[i].name)
                        }

                    } else {
                        $scope.uData.savedSearch.Allsysteminteraction = [];

                        updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                    }
                } else {
                    $scope.uData.savedSearch.Allsysteminteraction = [];

                    updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                }
            } else {
                userData.savedSearch.Allsysteminteraction = [];
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

        $scope.sortMenu = [{

            "label": "GroupReference ID",
            "value": "GrpReferenceId",
            "type": "text",
            "allow": "number",
            "visible": true

        }, {
            "label": "Correlation Id",
            "value": "CorrelationId",
            "type": "text",
            "allow": "number",
            "visible": true

        }, {
            "label": "Relationship",
            "value": "Relationship",
            "type": "text",
            "allow": "text",
            "visible": true

        }, {
            "label": "Invocation Point",
            "value": "InvocationPoint",
            "type": "text",
            "allow": "text",
            "visible": true

        }, {
            "label": "Status",
            "value": "Status",
            "type": "text",
            "allow": "text",
            "visible": true

        }, {
            "label": "Original Status",
            "value": "OriginalStatus",
            "type": "text",
            "allow": "text",
            "visible": true

        }]
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
    $scope.commonObj = SystemInteractionService.distInstruction;

    SystemInteractionService.distInstruction.currentObj.sortBy = [];

    $scope.dateSet = function() {
        /*
        $('#dropdownBtnTxt').html(GlobalService.selectCriteriaTxt)
        $('.menuClass').removeClass('listSelected').addClass('listNotSelected')
        $('#menulist_' + GlobalService.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected'); */


        $scope.dateFilter = SystemInteractionService.distInstruction.dateFilter;

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
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": "=",
                "ColumnValue": todayDate()
            }]
        } else if ($scope.dateFilter.week) {
            $scope.dateArr = [{
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": ">=",
                "ColumnValue": week().lastDate
            }, {
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": "<=",
                "ColumnValue": week().todayDate
            }]
        } else if ($scope.dateFilter.month) {
            $scope.dateArr = [{
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": ">=",
                "ColumnValue": month().lastDate
            }, {
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": "<=",
                "ColumnValue": month().todayDate
            }]

        } else if ($scope.dateFilter.custom) {
            $scope.customDate.startDate = SystemInteractionService.distInstruction.customDate.startDate;
            $scope.customDate.endDate = SystemInteractionService.distInstruction.customDate.endDate;

            $('#customDate').modal('hide')
            $scope.dateArr = [{
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": ">=",
                "ColumnValue": $scope.customDate.startDate
            }, {
                "ColumnName": "BIDTimeStamp",
                "ColumnOperation": "<=",
                "ColumnValue": $scope.customDate.endDate
            }]

        }

        return $scope.dateArr;

    }
    $scope.retExpResult()

    /* Query Constructor */
    $scope.uorQueryConstruct = function(arr, flag) {
        SystemInteractionService.distInstruction.currentObj = arr;
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;

        $scope.Qobj.Queryfield = [];

        $scope.Qobj.QueryOrder = [];

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
        sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.Systeminteraction;
        sessionStorage.allconfirmObj = JSON.stringify(_query)
        $scope.nothingSelected = true;
        _query.sorts = [{
            "columnName": 'BIDTimeStamp',
            "sortOrder": 'Desc'
        }]

        $http.post(BASEURL + RESTCALL.Systeminteraction, _query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.items = data;
            //$scope.uniqueNames =data;
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

        SystemInteractionService.distInstruction = {
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
            SystemInteractionService.distInstruction.customDate.startDate = $scope.customDate.startDate;
            SystemInteractionService.distInstruction.customDate.endDate = $scope.customDate.endDate;
        }

        $scope.dateArr = $scope.retExpResult()


        for (var i in $scope.fieldArr.params) {
            if (($scope.fieldArr.params[i].ColumnName == 'BIDTimeStamp') || (!$scope.fieldArr.params[i].advancedSearch)) {
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
            SystemInteractionService.distInstruction.searchFound = true;
        } else {
            SystemInteractionService.distInstruction.searchFound = false;
        }
    })

    $scope.uorSearch = function() {

        $scope.isAdvacedSearchClicked = false;

        if ($scope.uorVal) {

            $scope.search = {
                "GrpReferenceId": {
                    "BIDTimeStamp": {
                        "Start": "",
                        "End": ""
                    }
                }
            }

            $scope.uorFound = $scope.uorVal;

            SystemInteractionService.distInstruction.uorVal = $scope.uorVal;
            len = 20;
            $scope.uorSearchFound = false;

            for (var i in $scope.fieldArr.params) {
                if (!$scope.fieldArr.params[i].advancedSearch) {
                    if ($scope.fieldArr.params[i].ColumnName == 'GrpReferenceId') {
                        $scope.uorSearchFound = true;
                        $scope.fieldArr.params[i].ColumnName = 'GrpReferenceId';
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
                    "ColumnName": "GrpReferenceId",
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
        if (!txt.match(/[0-9]/)) {
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
                systeminteraction.distInstruction.uorVal = '';

                for (var j in $scope.fieldArr.params) {
                    if ($scope.fieldArr.params[j].ColumnName == "GrpReferenceId") {
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
        $scope.grpRefVal = '';
        $scope.grpRefFound = '';
        SystemInteractionService.distInstruction.grpRefVal = '';
        $scope.search = {
            "TimeOfEntry": {
                "Start": "",
                "End": ""
            }
        }
        $scope.newSearch = false;
        $scope.dSearch = $scope.search;

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

        }, 100);

        $timeout(function() {
            customDateRangePicker("TimeOfEntryStart", "TimeOfEntryEnd")
        }, 10);

        //$scope.resetFilter();
        SystemInteractionService.distInstruction.dateFilter = {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        }
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr));
    }

    $scope.resetFilter = function() {
        //$scope.showSearchWarning = false;
        $("#showWarning").hide();
        $scope.buildSearchClicked = true;
        $scope.resetBtnClicked = true;
        $scope.AdsearchParams = {

            "TimeOfEntry": {
                "Start": "",
                "End": ""
            }
        }

        $scope.search = angular.copy($scope.AdsearchParams);
        $rootScope.search1 = {
            "TimeOfEntry": {
                "Start": "",
                "End": ""
            }
        }

        $timeout(function() {
            customDateRangePicker('TimeOfEntryStart', 'TimeOfEntryEnd')
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
        sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.Systeminteraction;

        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;

        var finalobj = $scope.uorQueryConstruct($scope.fieldArr);

        finalobj.sorts = [{
            "columnName": 'BIDTimeStamp',
            "sortOrder": 'Desc'
        }]


        $http.post(BASEURL + RESTCALL.Systeminteraction, finalobj).then(function onSuccess(response) {
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
        $scope.dSearch = angular.copy($scope.search);
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

        $scope.savedSearchSelected = false;
        return {
            'service': SystemInteractionService.distInstruction,
            'searchParams': $scope.search
        };
    }

    $scope.rstAdvancedSearchFlag = function() {

        // $scope.distSearch = true;
        $scope.buildSearchClicked = false;
        $scope.advanceSearchCollaspe();
        $scope.AdsearchParams = {
            "TimeOfEntry": {
                "Start": "",
                "End": ""
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
            for (var key in userData.savedSearch.Allsysteminteraction) {
                if (userData.savedSearch.Allsysteminteraction[key].name == $scope.searchname) {
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
                    if (i == 'TimeOfEntry') {
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
                    //Allsysteminteraction
                    if ('Allsysteminteraction' in userData.savedSearch) {
                        userData.savedSearch['Allsysteminteraction'].push({
                            'name': $scope.searchname,
                            'params': saveSearchObjects
                        })
                    } else {
                        userData.savedSearch['Allsysteminteraction'] = [];
                        userData.savedSearch['Allsysteminteraction'].push({
                            'name': $scope.searchname,
                            'params': saveSearchObjects
                        })
                    }

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

        userData.savedSearch.Allsysteminteraction[$scope.keyIndex].name = $scope.searchname;
        userData.savedSearch.Allsysteminteraction[$scope.keyIndex].params = saveSearchObjects;
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
        }else{
            $('#distSearch').collapse('hide')
        }
        //$scope.newSearch = false;
        if ($(eve.currentTarget).find('span:first-child').text() != 'New Search') {
            $scope.searchName = $scope.lskey[index];
            $scope.search = $scope.uData.savedSearch.Allsysteminteraction[index - 1].params.searchParams;
            $scope.savedSearchSelected = true;
            if( $scope.distSearch){
                $('#distSearch').collapse('hide')   
            }
            $scope.buildSearch()
        } else {
            $scope.distSearch = false;
            //$scope.resetFilter()
            $scope.newSearch = true;
            $scope.buildSearchClicked = true;
            $scope.resetBtnClicked = true;
            $scope.AdsearchParams = {
                "TimeOfEntry": {
                    "Start": "",
                    "End": ""
                }

            }
            $scope.search = angular.copy($scope.AdsearchParams);
            $rootScope.search1 = {
                "TimeOfEntry": {
                    "Start": "",
                    "End": ""
                }
            }

            $timeout(function() {
                customDateRangePicker("TimeOfEntryStart", "TimeOfEntryEnd")
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
        $scope.dArr = ["AttchMsgFunc", "ParentMsgFunc", "PSACode"]
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
                method: "GET",
                url: BASEURL + RESTCALL.AllconfirmationStatus

            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.uniqueNames = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

            });
        }
        // $scope.uniqueNamesSelect()

    $scope.limit = 500;
    $scope.setInitval = function() {

        var query = {
            start: 0,
            count: $scope.limit
        };

        $http({
            method: "GET",
            url: BASEURL + RESTCALL.InputReferenceCode
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;


            $scope.psaCodeDrop = data;

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
    };

    $scope.setInitval()

    /* $scope.setInitval = function () {
    $scope.limit = 500;
    var query = {
    start : 0,
    count : $scope.limit
    }

    $http({
    	method : "GET",
    	url : BASEURL + RESTCALL.OfficeCode,
    	params : query
    }).then(function onSuccess(response) {
    	// Handle success
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;

    	$scope.OfficeCode = data;
    }).catch(function onError(response) {
    	// Handle error
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;

    });

    $scope.setInitval() */

    $(document).ready(function() {

        $scope.limit = 500;

        $scope.remoteDataConfig = function() {

            $("select[name='PSACode']").select2({
                ajax: {
                    url: BASEURL + RESTCALL.PartyServiceAssociationDropdown,
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
                    method: "POST",
                    crossDomain: true,
                    data: function(params) {
                        var query = {
                            start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                            count: $scope.limit,
                            sorts: []
                        }

                        if (params.term) {

                            query = {
                                start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                                count: $scope.limit,
                                filters: {
                                    "logicalOperator": "AND",
                                    "groupLvl1": [{
                                        "logicalOperator": "AND",
                                        "groupLvl2": [{
                                            "logicalOperator": "AND",
                                            "groupLvl3": [{
                                                "logicalOperator": "OR",
                                                "clauses": [{
                                                    "columnName": "PartyServiceAssociationCode",
                                                    "operator": "LIKE",
                                                    "value": params.term
                                                }]
                                            }]
                                        }]
                                    }]
                                }
                            };

                        }
                        return JSON.stringify(query);
                    },
                    processResults: function(data, params) {

                        params.page = params.page ? params.page : 0;
                        var myarr = []

                        for (j in data) {

                            myarr.push({
                                'id': data[j].PartyServiceAssociationCode,
                                'text': data[j].PartyServiceAssociationCode
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
                placeholder: 'Select',
                minimumInputLength: 0,
                allowClear: true

            })
        }
        $scope.remoteDataConfig()

        setTimeout(function() {
            customDateRangePicker("TimeOfEntryStart", "TimeOfEntryEnd");
        }, 500)
    })

    $scope.clickReferenceID = function(val) {
        $scope.Obj = {
            'nav': {
                'UIR': val.data.PaymentID,
                'PID': (val.data.PaymentID) ? val.data.PaymentID : "",
                'AttachMsg': val.data.AttchMsgFunc,
                'PaymentID': val.data.RootPaymentID
            },
            'from': 'attachedmessages',
            'PaymentID': 'RootPaymentID'

        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })

    }

    /* Export the data to CSV*/

    /* $scope.details = JSON.parse(sessionStorage.currentObj);

    	$scope.details.count = ($scope.totalData) ? $scope.totalData : 1000;
    	$scope.details = constructQuery($scope.details); */


    $scope.makeCall = function() {

        $scope.makeObj = {};
        $scope.makeObj.start = 0;
        $scope.makeObj.count = ($scope.items.length) ? $scope.items.length : 1000;
        $scope.makeObj.Queryfield = [];
        $scope.makeObj.QueryOrder = [{
            "ColumnName": "BIDTimeStamp",
            "ColumnOrder": "Desc"
        }];
        $scope.makeObj = constructQuery($scope.makeObj)

        $http.post(BASEURL + RESTCALL.Systeminteraction, $scope.makeObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            var colName = ["PaymentID", "GrpReferenceId", "CorrelationId", "ParentID", "Relationship", "InvocationPoint", "IsSynchronous", "BIDTimeStamp", "Status"];
            JSONToExport(bankData, $scope.items, 'Allsysteminteraction', true, colName);
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

        } else {

            var colName = ["PaymentID", "GrpReferenceId", "CorrelationId", "ParentID", "Relationship", "InvocationPoint", "IsSynchronous", "BIDTimeStamp", "Status"];
            $scope.dat = angular.copy($scope.items);
            JSONToExport(bankData, $scope.dat, 'Allsysteminteraction', true, colName);
        }
    }

    $scope.exportToTextDoc = function(bankInteractionData, data) {

        filename = bankInteractionData + '.txt';
        var content;
        //var FLDownloadObj = {};
        //FLDownloadObj.InstructionID = UIR;

        //$http.post(BASEURL + RESTCALL.Filedownload, FLDownloadObj).then(function onSuccess(response) {
        // Handle success
        // var data = response.data;
        // var status = response.status;
        // var statusText = response.statusText;
        // var headers = response.headers;
        // var config = response.config;

        content = data;
        bankData.textDownload($filter('hex2a')(content), filename);

        // }).catch(function onError(response) {
        // Handle error
        // var data = response.data;
        // var status = response.status;
        // var statusText = response.statusText;
        // var headers = response.headers;
        // var config = response.config;

        // $scope.alerts = [{
        // 	type: 'danger',
        // 	msg: data.error.message
        // }
        // ];
        //});
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

        if ($scope.sortMenu[index].value == 'TimeOfEntry') {
            setTimeout(function() {
                customDateRangePicker('TimeOfEntryStart', 'TimeOfEntryEnd')
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

        userData.savedSearch.Allsysteminteraction.splice($scope.selectedSearchName - 1, 1)
        for (var i in userData.defaultChartTypes.paymentDashoard) {
            if (userData.defaultChartTypes.paymentDashoard[i].data) {
                delete userData.defaultChartTypes.paymentDashoard[i].data;
            }
        }
        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {
            $scope.retainSavedSearch();
        })
        $('#alertBox').modal('hide');
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
            }, 5000)
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

}]);
