angular.module('VolpayApp').controller('distributedinstructionsctrl', function($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("Distributed Instructions");
    var authenticationObject = $rootScope.dynamicAuthObj;
    $scope.spliceSearch = false;
    $scope.lskey = ["New Search"];
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 
    $scope.downloadOptions = "Current"
    
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

                if ("ReceivedInsn" in $scope.uData.savedSearch) {
                    if ($scope.uData.savedSearch.ReceivedInsn.length) {
                        for (var i in $scope.uData.savedSearch.ReceivedInsn) {
                            $scope.lskey.push($scope.uData.savedSearch.ReceivedInsn[i].name)
                        }

                    } else {
                        $scope.uData.savedSearch.ReceivedInsn = [];
                        updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                    }
                } else {
                    $scope.uData.savedSearch.ReceivedInsn = [];
                    updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                }
            } else {
                userData.savedSearch.ReceivedInsn = [];
                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function(response) {

                })
            }
            
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $translate.use("es_ES");
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.retainSavedSearch();

    $scope.buildSearchClicked = false;
    $rootScope.customDate = {};
    $scope.search = ($rootScope.search) ? $rootScope.search : {};
    $scope.dSearch = $scope.search;
    $scope.resetBtnClicked = false;
    $scope.newSearch = false;

    $scope.setSortMenu = function() {
        $scope.sortMenu = [
		 {
                "label": "UserManagement.Party Code",
                "fieldName": "PartyCode",
                "visible": true,
                "searchVisible": true,
                "type": "dropdown"
            },
            {
                "label": "DistributedInstructions.FileName",
                "fieldName": "DistributionFileName",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "UserManagement.PartyName",
                "fieldName": "PartyName",
                "visible": true,
                "searchVisible": true,
                "type": "dropdown"
            },
            {
                "label": "DistributedInstructions.Cycle",
                "fieldName": "CycleID",
                "visible": true,
                "searchVisible": true,
                "type": "dropdown"
            },
            {
                "label": "DistributedInstructions.GeneratedDate",
                "fieldName": "GeneratedDate",
                "visible": true,
                "searchVisible": true,

                "type": "dateRange"
            },
            {
                "label": "DistributedInstructions.OutputMessage",
                "fieldName": "OutputMessage",
                "visible": true,
                "searchVisible": false,
                "type": "text"
            },
            {
                "label": "DistributedInstructions.FileSize",
                "fieldName": "Relationship",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "DistributedInstructions.Status",
                "fieldName": "Status",
                "visible": true,
                "searchVisible": true,
                "type": "dropdown"
            },
            {
                "label": "DistributedInstructions.AdditionalDescription",
                "fieldName": "AdditionalDescription",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "DistributedInstructions.NumCredits",
                "fieldName": "NumCredits",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "DistributedInstructions.NumDebits",
                "fieldName": "NumDebits",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "Action",
                "fieldName": "Action",
                "visible": false,
                "searchVisible": false,
                "type": "text"
            },
            {
                "label": "DistributedInstructions.SelectAll",
                "fieldName": "Select",
                "visible": true,
                "searchVisible": false,
                "type": "text"
            }
        ]
    }
    $scope.setSortMenu()


    $scope.commonObj = CommonService.distInstruction;
    CommonService.distInstruction.currentObj.sortBy = [];



    $scope.dateSet = function() {
        $scope.dateFilter = CommonService.distInstruction.dateFilter;

        for (i in $scope.dateFilter) {
            if ($scope.dateFilter[i]) {
                $('#dropTxt').text(($filter('translate')('SelectDates.'+$filter('ucwords')(i))))
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
    $scope.fieldArr.start = 0;
    var len = 20;


    // $scope.changeViewFlag = GlobalService.viewFlag;
    $scope.changeViewFlag = false;

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
                "ColumnName": "GeneratedDate",
                "ColumnOperation": "=",
                "ColumnValue": todayDate()
            }]
        } else if ($scope.dateFilter.week) {
            $scope.dateArr = [{
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": ">=",
                    "ColumnValue": week().lastDate
                },
                {
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": "<=",
                    "ColumnValue": week().todayDate
                }
            ]
        } else if ($scope.dateFilter.month) {
            $scope.dateArr = [{
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": ">=",
                    "ColumnValue": month().lastDate
                },
                {
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": "<=",
                    "ColumnValue": month().todayDate
                }
            ]

        } else if ($scope.dateFilter.custom) {
            $scope.customDate.startDate = CommonService.distInstruction.customDate.startDate;
            $scope.customDate.endDate = CommonService.distInstruction.customDate.endDate;


            $('#customDate').modal('hide')
            $scope.dateArr = [{
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": ">=",
                    "ColumnValue": $scope.customDate.startDate
                },
                {
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": "<=",
                    "ColumnValue": $scope.customDate.endDate
                }
            ]

        }

        return $scope.dateArr;

    }
    $scope.retExpResult()


    /* Query Constructor */
    $scope.uorQueryConstruct = function (arr, val) {
        CommonService.distInstruction.currentObj = arr;
        $scope.fieldArr = arr;


        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.Queryfield = [];
        $scope.Qobj.QueryOrder = [];
        if (val == 'true') {
            $scope.Qobj.Queryfield.push({
                "ColumnName": "GeneratedDate",
                "ColumnOperation": "=",
                "ColumnValue": todayDate(),
            });
        } else {
            $scope.Qobj.Queryfield = [];
        }
        /*  */

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

    $scope.initCall = function(_query) {
        sessionStorage.DistributedRESTCALL = BASEURL + RESTCALL.PaymentOutputData;
        sessionStorage.distributedObj = JSON.stringify(_query)
        $http.post(BASEURL + RESTCALL.PaymentOutputData, _query).then(function onSuccess(response) {
            // Handle success

      
            $rootScope.count = response.headers().totalcount
            $scope.totalData= $rootScope.count 
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.datas = data;
	    $scope.datas = removeDuplicatesFromArr($scope.datas, 'UniqueOutputReference' );
            $scope.loadedData = data;
            $('.alert-danger').hide()
            $scope.rleasedisbale=headers().releaseflag
  
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.datas = [];
            $scope.loadedData = [];

            /* if (data.error.code == 401) {
            	LogoutService.Logout();
            } else { */
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            // }
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'true'))

    $scope.refresh = function() {
        OutputReferenceId = []; // clear the selected value form list
        $scope.filterobject=[]
        $scope.createData = {}
        $scope.uniqPayments = [];
        $('.selectall_').prop('disabled', false);
        $('.selectall').prop('checked', false);
        $('.selectall_').prop('checked', false);
        $scope.initCall(JSON.parse(sessionStorage.distributedObj))
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

        if(eve){
            $scope.parent = $(eve.currentTarget).parent().parent().find('span:first-child');
            $scope.child = $(eve.currentTarget).text()
            $('#dropTxt').html($scope.child)

        }
        for (var i in $scope.dateFilter) {
            $scope.dateFilter[i] = false;
        }

        $scope.dateFilter[params] = true;



        if ($scope.dateFilter.custom) {
            $('#customDate').modal('hide')
            CommonService.distInstruction.customDate.startDate = $scope.customDate.startDate;
            CommonService.distInstruction.customDate.endDate = $scope.customDate.endDate;
        }


        $scope.dateArr = $scope.retExpResult()



        for (var i in $scope.fieldArr.params) {
            if (($scope.fieldArr.params[i].ColumnName == 'GeneratedDate') || (!$scope.fieldArr.params[i].advancedSearch)) {
                $scope.fieldArr.params.splice(i)
            }
        }

        for (var i in $scope.dateArr) {
            $scope.fieldArr.params.push({ "ColumnName": $scope.dateArr[i].ColumnName, "ColumnOperation": $scope.dateArr[i].ColumnOperation, "ColumnValue": $scope.dateArr[i].ColumnValue, 'advancedSearch': false });

        }
        $scope.fieldArr.start = 0;
        len= 0;
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'false'))


    }


    $scope.$watch('fieldArr.params', function(nArr, oArr) {

        if (nArr.length) {
            CommonService.distInstruction.searchFound = true;
        } else {
            CommonService.distInstruction.searchFound = false;
        }

        //$scope.searchFound = CommonService.distInstruction.searchFound;
    })

    $scope.uorSearch = function() {
        if ($scope.uorVal) {

            $scope.search = {
                "GeneratedDate": {
                    "Start": "",
                    "End": ""
                }
            }

            $scope.uorFound = $scope.uorVal;

            CommonService.distInstruction.uorVal = $scope.uorVal;
            len = 20;
            $scope.uorSearchFound = false;


            for (var i in $scope.fieldArr.params) {
                if (!$scope.fieldArr.params[i].advancedSearch) {
                    if ($scope.fieldArr.params[i].ColumnName == 'UniqueOutputReference') {
                        $scope.uorSearchFound = true;
                        $scope.fieldArr.params[i].ColumnName = 'UniqueOutputReference';
                        $scope.fieldArr.params[i].ColumnOperation = 'like';
                        $scope.fieldArr.params[i].ColumnValue = $scope.uorVal;
                        $scope.fieldArr.params[i].advancedSearch = false;
                    }
                } else {
                    $scope.fieldArr.params.splice(i, 1);
                }
            }


            if (!$scope.uorSearchFound) {
                $scope.fieldArr.params.push({ "ColumnName": "UniqueOutputReference", "ColumnOperation": "like", "ColumnValue": $scope.uorVal, 'advancedSearch': false })
            }



            //$scope.searchFound = true;
            $scope.fieldArr.start = 0;
            $scope.fieldArr.count = len;

            $scope.query = $scope.uorQueryConstruct($scope.fieldArr, 'false')
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
                CommonService.distInstruction.uorVal = '';

                for (var j in $scope.fieldArr.params) {
                    if ($scope.fieldArr.params[j].ColumnName == "UniqueOutputReference") {
                        $scope.fieldArr.params.splice(j, 1)


                    }
                }



                $scope.fieldArr.start = 0;
                $scope.fieldArr.count = 20;
                $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'false'))

            }
        }
    }

    /* Clear Search Results */
    $scope.clearSearch = function() {
        //$scope.searchFound = false;
        $scope.loadedData = '';

        $scope.fieldArr = { "sortBy": [], "params": [], "start": 0, "count": 20 };
        len = 20;
        $scope.uorVal = '';
        $scope.uorFound = '';
        CommonService.distInstruction.uorVal = '';
        $scope.filterobject={}
       
        for (i in GlobalService.searchParams) {

            if (i == 'InstructionData') {
                for (j in GlobalService.searchParams[i]) {
                    GlobalService.searchParams[i][j].Start = "";
                    GlobalService.searchParams[i][j].End = "";
                }
            } else {
                GlobalService.searchParams[i] = '';
            }

        }
        $scope.search = {
            "GeneratedDate": {
                "Start": "",
                "End": ""
            }
        }
        $scope.dSearch = angular.copy($scope.search)
        $scope.newSearch = false;
        // $scope.dSearch = $scope.search;
        $rootScope.search = {
            "GeneratedDate": {
                "Start": "",
                "End": ""
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
                    $(sanitize('select[name=' + $scope.sortMenu[i].fieldName + ']')).select2({ data: [] })
                }
            }
            $scope.remoteDataConfig()


        }, 100)

        $timeout(function() {
            customDateRangePicker("GeneratedDateStart", "GeneratedDateEnd")
        }, 10)

        //$scope.resetFilter();
        CommonService.distInstruction.dateFilter = {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        }
        $scope.dateSet()
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'false'))
        //$state.reload()
    }

    $scope.resetFilter = function() {
        $scope.buildSearchClicked = true;
        $scope.resetBtnClicked = true;
        $scope.AdsearchParams = {
            "GeneratedDate": {
                "Start": "",
                "End": ""
            }

        }

        $scope.search = angular.copy($scope.AdsearchParams);
        $rootScope.search = {
            "GeneratedDate": {
                "Start": "",
                "End": ""
            }
        }

        $timeout(function() {
            customDateRangePicker("GeneratedDateStart", "GeneratedDateEnd")
            for (var i in $scope.sortMenu) {

                if ($scope.sortMenu[i].type == 'dropdown') {
                    $(sanitize('select[name=' + $scope.sortMenu[i].fieldName + ']')).select2({ data: [] })
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
        $scope.fieldArr.start = $scope.datas.length;
        $scope.fieldArr.count = 20;
        // $scope.fieldArr.params.push({
		// 	"ColumnName": "GeneratedDate",
		// 	"ColumnOperation": "=",
		// 	"ColumnValue": todayDate(),
		// }); 
       
        $http.post(BASEURL + RESTCALL.PaymentOutputData, $scope.uorQueryConstruct($scope.fieldArr, 'false')).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.datas = $scope.datas.concat(data);
	    $scope.datas = removeDuplicatesFromArr($scope.datas, 'UniqueOutputReference' );
        $scope.rleasedisbale=headers().releaseflag
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
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'false'))
    }

    $scope.setDateRange = function() {
        $scope.showSearchWarning = false;
        setTimeout(function() {
            //customDateRangePicker("SentDateStart","SentDateEnd")
            $scope.remoteDataConfig()

            if (Object.keys($scope.search).indexOf("OfficeCode") != -1 && $scope.search.OfficeCode.length) {
                $('select[name=OfficeCode]').val($scope.search.OfficeCode);
                $('select[name=OfficeCode]').select2();
            }

        }, 100)

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
        $rootScope.search = angular.copy($scope.search);
        $scope.searchArr = [];
        for (i in $scope.search) {
            if (i == 'GeneratedDate') {
                if ($scope.search[i].Start && $scope.search[i].End) {
                    $scope.searchArr.push({ "ColumnName": i, "ColumnOperation": ">=", "ColumnValue": $scope.search[i].Start, 'advancedSearch': true });
                    $scope.searchArr.push({ "ColumnName": i, "ColumnOperation": "<=", "ColumnValue": $scope.search[i].End, 'advancedSearch': true });
                }

            } else {
                if (Array.isArray($scope.search[i])) {
                    for (var j in $scope.search[i]) {
                        $scope.searchArr.push({ "ColumnName": i, "ColumnOperation": "=", "ColumnValue": $scope.search[i][j], 'advancedSearch': true })
                    }
                } else {
                    $scope.searchArr.push({ "ColumnName": i, "ColumnOperation": "=", "ColumnValue": $scope.search[i], 'advancedSearch': true })
                }
            }

        }

        //$scope.search = $scope.cleantheinputdata($scope.search) 

        $scope.dSearch = angular.copy($scope.search);

        $scope.fieldArr.params = $scope.retExpResult()
        $scope.fieldArr.params = $scope.searchArr.concat($scope.fieldArr.params);

        $scope.fieldArr.start = 0;
        len = 0;

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
            sessionStorage.distributedObj = $scope.uorQueryConstruct($scope.fieldArr);
            $scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'false'))
            $scope.spliceSearch = false;
        }

        /*else{
        	$scope.resetBtnClicked = false	
        }*/


        $scope.savedSearchSelected = false;

        GlobalService.searchParams = $scope.search;
        return $scope.GlobalService;
        // return {
        //     'service': CommonService.distInstruction,
        //     'searchParams': $scope.search
        // };
    }

    $scope.rstAdvancedSearchFlag = function() {

        // $scope.distSearch = true;
        $scope.buildSearchClicked = false;
        $scope.advanceSearchCollaspe();
        $scope.AdsearchParams = {
            "GeneratedDate": {
                "Start": "",
                "End": ""
            }
        }

        $scope.search = angular.copy($scope.AdsearchParams);
        $rootScope.search = $scope.search;
        $scope.dSearch = angular.copy($scope.search);

        $timeout(function() {
            for (var i in $scope.sortMenu) {
                if ($scope.sortMenu[i].type == 'dropdown') {
                    $(sanitize('select[name=' + $scope.sortMenu[i].fieldName + ']')).select2({ data: [] })
                }
            }
            $scope.remoteDataConfig()
        }, 100)
        //$scope.resetFilter()
    }

    $scope.keyIndex = '';
    $scope.saveSearch = function() {
        $scope.advanceSearchCollaspe();
        if ($scope.searchname) {
            $scope.isSearchNameFilled = false;
            for (var key in userData.savedSearch.ReceivedInsn) {
                if (userData.savedSearch.ReceivedInsn[key].name == $scope.searchname) {

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
                    if (i == 'GeneratedDate') {
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

                    userData.savedSearch.ReceivedInsn.push({
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
        var saveSearchObjects = $scope.buildSearch();
        $scope.advanceSearchCollaspe();
        $('#myModal1').modal('hide');

        userData.savedSearch.ReceivedInsn[$scope.keyIndex].name = $scope.searchname;
        userData.savedSearch.ReceivedInsn[$scope.keyIndex].params = saveSearchObjects;
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
        if (data != 'New Search') {

            $scope.searchName = $scope.lskey[index];
            $scope.search = $scope.uData.savedSearch.ReceivedInsn[index - 1].params.searchParams;

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
            //$scope.showSearchWarning = false;

            $scope.resetBtnClicked = true;
            $scope.AdsearchParams = {
                "GeneratedDate": {
                    "Start": "",
                    "End": ""
                }

            }

            $scope.search = angular.copy($scope.AdsearchParams);
            $rootScope.search = {
                "GeneratedDate": {
                    "Start": "",
                    "End": ""
                }
            }

            $timeout(function() {
                customDateRangePicker("GeneratedDateStart", "GeneratedDateEnd")
                for (var i in $scope.sortMenu) {

                    if ($scope.sortMenu[i].type == 'dropdown') {
                        $(sanitize('select[name=' + $scope.sortMenu[i].fieldName + ']')).select2({ data: [] })
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
        $scope.dArr = ["OfficeCode","CycleID","Status"]
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

    $scope.setInitval = function() {
        $scope.limit = 500;
        var query = {
            start: 0,
            count: $scope.limit
        }

        $http({
            method: "GET",
            url: BASEURL + '/rest/v2/ach/outputdata/getPartyAll',
            params: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.OfficeCode = data['Records'];
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

    $scope.limit = 500;

    $scope.getAllCycle = function() {
        var query = {
        
            "start": 0,
            "count": $scope.limit
        }

        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/ach/outputdata/cycles",
            data: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
             $scope.uniquecycles =data;

            // $('select[name="BRANCHCODE"]').select2()
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

    $scope.getAllCycle()

    $scope.getAllStatus = function() {
        var query = {
        
            "start": 0,
            "count": $scope.limit
        }

        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/ach/outputdata/cycle/status",
            data: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
             $scope.uniquestatus =data;

            // $('select[name="BRANCHCODE"]').select2()
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

    $scope.getAllStatus()


    $scope.forplaceholder = function() {

        $scope.dArr = ["Status", "CycleID","OfficeCode","PartyCode","PartyName"]
        $timeout(function() {

            for (var i in $scope.dArr) {

                $("select[name='" + $scope.dArr[i] + "']").select2({
                    placeholder: "Select an option"
                });

            }

        }, 100)

    }



    /* Go To Payment Summary */
    $scope.detail = function(val, index) {
        $scope.query = {
            "Queryfield": [{
                'ColumnName': 'UniqueOutputReference',
                'ColumnOperation': '=',
                'ColumnValue': val.UniqueOutputReference
            }],
            // 'start': len,
            // 'count': 20
        }
        $scope.query = constructQuery($scope.query);

        $http.post(BASEURL + RESTCALL.InputOutputCorrelation, $scope.query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.payId = [];
            $scope.datas = data;
            for (var i in $scope.datas) {
                $scope.payId.push($scope.datas[i].PaymentID);
                GlobalService.attachmsgFunction = $scope.datas[i].AttchMsgFunc;
            }

            GlobalService.fileListIndex = index;
            GlobalService.fileListId = data[0].PaymentID;
            GlobalService.fileListIdd = data[0].UniqueOutputReference;


            GlobalService.instructionType = val.InstructionType;
             // $location.path('app/distributeddetail');
             $state.go('app.distributeddetail', {
                input: val
            })
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

        //if((!$(eve.target).hasClass('fa-download')) || !$scope.changeViewFlag)
        //{
        // $state.go('app.outputpaymentsummary', { input: { 'uor': val.UniqueOutputReference, 'nav': {}, 'from': 'output' } })
        //}
    }

    /* Export the data to CSV*/

    $scope.makeCall = function(format) {

        $scope.details = JSON.parse(sessionStorage.distributedObj);

        $scope.details.count = ($rootScope.count) ? $rootScope.count : 100000
       
            if(format=='csv'){
            var rest=BASEURL + RESTCALL.PaymentOutputData
            }else{
                var rest=BASEURL +'/rest/v2/ach/outputdata/'+format
            }



        $http.post(rest, $scope.details).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            var fileName = 'DistributedInstructions';
            if(format=='csv'){
                var colNames = ["PartyCode", "DistributionFileName", "PartyName","CycleID", "DestinationChannel", "GeneratedDate"];
                var colLabels = ["PartyCode", "DistributionFileName", "PartyName","CycleID", "DestinationChannel", "GeneratedDate"];
                if(sessionStorage.sessionlang=="es_ES"){                    
                    colLabels= ["Código de Entidad", "Archivo", "Entidad","Ciclo", "Destino", "Fecha de Generación"];
                    fileName = "InstruccionesDistribuidas";
                }                
                //JSONToExport(bankData, data, fileName, true, colName);
                JSONToExport(bankData, data, fileName, true, colNames,'distributedinstructions',colLabels);
            }else{
                $scope.dat = response.data.Data
                    $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
                    var dlnk = document.getElementById('dwnldLnk');
                    dlnk.href = $scope.Details;

                    if(data["FileName"]){
                        data['filename'] = data["FileName"];
                    }
                    dlnk.download =   response.data['filename'] ? response.data['filename']:`InstruccionesDistribuidas.${format}`
                    dlnk.click();
            }
  

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

    $scope.exportToExcel = function(format) {
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.makeCall(format);
        } else {

            var colName = ["PartyCode", "DistributionFileName", "PartyName","CycleID", "DestinationChannel", "GeneratedDate", "Status"];

            $scope.dat = angular.copy($scope.datas);

            JSONToExport(bankData, $scope.dat, 'DistributedInstructions', true, colName);
        }

        /*
        $scope.dat = angular.copy($scope.datas)
        for(var i in $scope.dat){
        $scope.dat[i].OutputMessage = $filter('hex2a')($scope.dat[i].OutputMessage)

        }
        JSONToCSVConvertor(bankData,$scope.dat, 'DistributedInstructions', true); */
    }

    /* Export Output Message */
    $scope.textDocDownload = function(val, e) {
       
        if(val['Status']=='RELEASED' || val['Status']=='DOWNLOADED'){
            
            function download (content, filename, contentType) {
                if(!contentType) contentType = 'application/octet-stream';
                    var a = document.createElement('a');
                    var blob = new Blob([content], {'type':contentType});
                    a.href = window.URL.createObjectURL(blob);
                    a.download = filename;
                    a.click();
            }
            
            $http.post(BASEURL + RESTCALL.DownloadBlob, JSON.parse('{"uniqueID":"'+val.UniqueOutputReference+'"}')).then((res) => {
                // Do the encoding
                var encoded = new TextEncoder("windows-1252",{ NONSTANDARD_allowLegacyEncoding: true }).encode($filter('hex2a')(res.data.OutputMessage));

                // Download file
                download(encoded,res.data.DistributionFileName,'text/plain;charset=windows-1252');
            })

            //bankData.textDownload($filter('hex2a')(val.OutputMessage), val.DistributionFileName);
            $http.post(BASEURL + RESTCALL.DownloadPODOnReleased, JSON.parse('{"uniqueID":"'+val.UniqueOutputReference+'"}')).then(function onSuccess(response) {
                let updateRegIndex = $scope.datas.findIndex( d => d.UniqueOutputReference === val.UniqueOutputReference);
                $scope.datas[updateRegIndex].Status = "DOWNLOADED";
            }).catch(function onError(response) {

                let updateRegIndex = $scope.datas.findIndex( d => d.UniqueOutputReference === val.UniqueOutputReference);
                $scope.datas[updateRegIndex].Status = "DOWNLOADED";

                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });

            e.stopPropagation();
            //$scope.initCall($scope.uorQueryConstruct($scope.fieldArr, 'false'))

        }
    }

    /* Print*/
    $scope.printFLpage = function() {
        window.print()
    }


    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.loadedData.length >= 20) {
                        debounceHandler()
                    }
                }
            })
            setTimeout(function() {}, 1000)
        }
    );

    $scope.createData = {}
    $scope.checkStatusForBulk = function(event, TotalItem, allpayments1, index) {

        $scope.uniqPayments = [];
        for (var i in TotalItem) {
            if ($('#check_' + i).prop("checked")) {
                $scope.uniqPayments.push(TotalItem[i].DistributionFileName)
            }
        }
        $scope.createData['DistributionFileName'] = $scope.uniqPayments

    }
    $scope.checkStatusForBulk1 = function(TotalItem) {
        if ($('.selectall').is(':checked')) {
            $('.selectall_').prop('disabled', true);
            $('.selectall_').prop('checked', false);
            $scope.createData['DistributionFileName'] = ["selectall"]
            $scope.uniqPayments = ["selectall"]

        } else {
            $('.selectall_').prop('disabled', false);
            $scope.createData['DistributionFileName'] = ["selectall"]
            $scope.uniqPayments = []


        }

    }
    
    $scope.filterobject={}
    $scope.Release=function(data){
        $scope.detailsobj = JSON.parse(sessionStorage.distributedObj);
        if (Object.keys($scope.detailsobj).indexOf('filters') != -1) {
        
            $scope.filterobject=angular.merge($scope.detailsobj,$scope.createData)
         
           
        }

    $http.post(BASEURL + '/rest/v2/ach/outputdata/cycles/releaseAll', Object.keys($scope.filterobject).length?$scope.filterobject:$scope.createData).then(function onSuccess(response) {
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
     
     
        $scope.refresh();



    }).catch(function onError(response) {
    // Handle error
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;
    $scope.alerts = [{
                    type: 'danger',
                    msg:data.error.message
                }]
 

     });
    }


    $scope.SelectValue = function(index) {

        //setTimeout(function () {

        $scope.seeVisible = false;
        $scope.sortMenu[index]['searchVisible'] = !$scope.sortMenu[index]['searchVisible'];

        $scope.search[$scope.sortMenu[index]['fieldName']] = '';


        if ($scope.sortMenu[index].fieldName == 'GeneratedDate') {
            setTimeout(function() {
                customDateRangePicker("GeneratedDateStart", "GeneratedDateEnd")
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()

                })
            }, 1000)
        }

        for (var i in $scope.sortMenu) {
            if ($scope.sortMenu[i].searchVisible) {
                $scope.seeVisible = true;
            }
        }

        setTimeout(function() {}, 100)


        if ($scope.seeVisible) {
            $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');
        } else {
            $scope.distSearch = true;
            $('#saveSearchBtn, #AdSearchBtn').attr('disabled', 'disabled');
        }

        setTimeout(function() {
                for (var i in $scope.sortMenu) {
                    if ($scope.sortMenu[i].type == 'dropdown') {
                        $(sanitize('select[name=' + $scope.sortMenu[i].fieldName + ']')).select2({
                            data: [],
                            placeholder: 'Select an option'
                        })
                    }
                }
            }, 10)
            //}, 10);
    }

    $scope.confirmationAlert = function(index) {
        $scope.showAlertMsg = true;
        $scope.selectedSearchName = index;
        $scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
    }
    $scope.deleteSelectedSearch = function(eve) {


        userData.savedSearch.ReceivedInsn.splice($scope.selectedSearchName - 1, 1)
        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {
            $scope.retainSavedSearch();

            $scope.alerts = [{
                type: response.Status,
                msg: (response.Status == 'success') ? 'Borrado exitosamente' : response.data.data.error.message
            }];


            setTimeout(function() {
                $('.alert-success,.alert-danger').hide();
            }, 4000)
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
        // GlobalService.viewFlag = newValue;
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

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });

    $scope.resendDist = function(uor) {
        $http.get(BASEURL + RESTCALL.ResendDistInstruction + uor).then(function onSuccess(response) {
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

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            $timeout(function() {
                $('.alert-danger').hide()
            }, 5000)
        });

    }
    
    // List is define for Bulk Action DropDown
    $scope.ActionVal = ["RESEND"];
    var OutputReferenceId = [];

    // inhabilitado por LUISK
/*
    $scope.checkStatusForBulk = function(event, UOutputReference, IsSelected, index) {
        // Function call on every select And remove select of checkBox
        var indx = 0;
        if (IsSelected) {
            OutputReferenceId.push({ "UniqueOutputReference": UOutputReference });
        } else {
            // find the index of remove Check value in over list
            Array.prototype.getIndexByValue = function(name, value) {
                for (var i = 0, len = this.length; i < len; i++) {
                    if (this[i][name]) {
                        if (this[i][name] === value) {
                            return i
                        }
                    }
                }
                return -1;
            };
            indx = OutputReferenceId.getIndexByValue('UniqueOutputReference', UOutputReference);
            OutputReferenceId.splice(indx, 1);
        }

    }
    */

    $scope.resendDistBulk = function() {
        // Function call after selecting Action
        if (OutputReferenceId.length > 0) {
            $scope.bulkOutputReferenceId = { "OutputReferenceIds": OutputReferenceId }
            $http.post(BASEURL + "/rest/v2/transports/resend", $scope.bulkOutputReferenceId).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.refresh();
                $scope.alerts = [{
                    type: 'success',
                    //msg : data.responseMessage
                    msg: 'Resend the Distributed Instructions Completed'
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

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                $timeout(function() {
                    $('.alert-danger').hide()
                }, 5000)

            });

        } else {
            // When No data is selected and Apply the Action 
            $scope.alerts = [{
                type: 'danger',
                msg: "Please Select the Distributed Instructions"
            }];
        }
    }

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    }
    /*
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

    }
    )*/

    $scope.regenerateFile = function(data) {
        var request = {
            "uniqueID":data.UniqueOutputReference
        }
        $http.post(BASEURL + "/rest/v2/ach/outputdata/regeneratefile", request).then(function onSuccess(response) {
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
            $scope.refresh();
            
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $translate.use("es_ES");
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
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

    $scope.enableDownloadBtns = function(format){
        if($scope.downloadOptions == 'All'){
            return configData.exportAsExcel.allFilter.indexOf(format) != -1 ? true : false
        } else{
            return configData.exportAsExcel.currentFilter.indexOf(format) != -1 ? true : false
        }
    }

    $scope.focusInfn = function (data) {

        $('#' + data).focus()
        $scope.customDateRangePicker("GeneratedDateStart", "GeneratedDateEnd");
    }

});
