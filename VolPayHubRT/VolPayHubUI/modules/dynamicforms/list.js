angular.module('VolpayApp').controller('listCtrl', function($scope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService, $rootScope, errorservice, EntityLockService, datepickerFaIcons) {

    EntityLockService.flushEntityLocks();
    /** Dynamic web-form implementation */
    $scope.field_data = [];
    $scope.primary_key = [];
    $scope.meta_info = {};
    $scope.config_data = {
        default_sort: {
            businessprocesses: [{
                    "columnName": "ProcessCode",
                    "sortOrder": "Asc"
                },
                {
                    "columnName": "WorkFlowCode",
                    "sortOrder": "Asc"
                },
                {
                    "columnName": "ActivityIndex",
                    "sortOrder": "Asc"
                }
            ]
        },
        default_filter: {
            approvalcondition: {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": [{
                                "columnName": "RoleID",
                                "operator": "=",
                                "value": "ALL",
                                "isCaseSensitive": false
                            }]
                        }]
                    }]
                }]
            }
        }
    };

    /** Dynamic web-form implementation */
    // var crud_request = function({ method, url, headers, query, data, params }) {

    //     return $http({ method, url, headers, query, data, params })
    // }    

    $scope.ResourcePermissionCall = function() {
        $scope.permission = {
            'C': false,
            'D': false,
            'R': false,
            'U': false,
            'ReActivate': false
        }
        crudRequest("POST", "roles/resourcepermission", {
            "RoleId": sessionStorage.ROLE_ID,
            "ResourceName": $stateParams.input.gotoPage.Name
        }).then(function(response) {
            if (response.Status == "Success") {

                for (k in response.data.data) {
                    for (j in Object.keys($scope.permission)) {
                        if (Object.keys($scope.permission)[j] == response.data.data[k].ResourcePermission) {
                            $scope.permission[Object.keys($scope.permission)[j]] = true;
                        }
                    }
                }
            }
        })

    }
    $scope.ResourcePermissionCall();

    // var process_resource_permission = function(response){
    //     var resource_permission = { 'C': false, 'D': false, 'R': false, 'U': false }
    // 	var result = {};
    //     response['data'].map(function(value){
    //         if(Object.keys(resource_permission).indexOf(Object.values(value)[0]) !== -1){
    //             result[Object.values(value)[0]] = true;
    //         } else{
    //             result[Object.values(value)[0]] = false;
    //         }
    //         return result
    //     });
    // 	$scope.permission = result;
    //     return $scope.permission;
    // }

    var fetch_metainfo = function() {
        // crud_request({
        //     'method': "GET",
        //     'url': BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + "/metainfo",
        // }).then(process_metainfo);
        $http.get(BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + "/metainfo").then( process_metainfo);
    }

    var process_metainfo = function(response) {
        $scope.meta_info = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? checkWebformFormat(beautifyObj(response.data)) : beautifyObj(response.data);
    }

    var fetch_primarykey = function() {
        // crud_request({
        //     'method': "GET",
        //     'url': BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + "/primarykey",
        // }).then(function(response) {
        $http.get(BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + "/primarykey").then(function onSuccess(response) {
            $scope.primary_key = [];
            if (response['data'] && response['data']['responseMessage']) {
                if (response['data']['responseMessage'].indexOf(',') !== -1) {
                    $scope.primary_key = response['data']['responseMessage'].split(',');
                } else {
                    $scope.primary_key.push(response['data']['responseMessage']);
                }
            }
        })
    }

    // var $query = { start: 0, count: 20 }
    $scope.restInputData = {
        "start": 0,
        "count": 20,
        "sorts": []
    }

    var fetch_data = function(argu) {



        if ($stateParams.input.gotoPage.Link in $scope.config_data['default_filter']) {
            $query['filters'] = $scope.config_data['default_filter'][$stateParams.input.gotoPage.Link];
        } else if ($stateParams.input.gotoPage.Link in $scope.config_data['default_sort']) {
            $query['sorts'] = $scope.config_data['default_sort'][$stateParams.input.gotoPage.Link];
        }
        // crud_request({
        //     'method': "POST",
        //     'url': BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + "/readall",
        //     'data': $scope.restInputData
        // }).then(function(response) {

            $http.post( BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + "/readall", $scope.restInputData).then(function onSuccess(response) {
            $scope.field_data = response['data'];

            $scope.field_data.splice(0, 0, {});
            $rootScope.TotalCount = response.headers().totalcount
            $scope.totalForCountBar = response.headers().totalcount;
            $scope.dataLen = response['data']
            if ($scope.CRUD != "") {
                $scope.alerts = [{
                    type: 'success',
                    msg: $scope.CRUD //Set the message to the popup window
                }];
                $scope.CRUD = ""
                $timeout(callAtTimeout, 4000);
            }
        })
    }

    var error_msg = function(error) {
        console.error(error);
    }

    var getUniquefield = function(data) {
        var requiredFields = {};
        for (var name in data) {
            if ($scope.primary_key.indexOf(name) !== -1) {
                requiredFields[name] = data[name];
            }
        }
        return requiredFields;
    }

    /** Initial Function */
    // crud_request({
    //         'method': "POST",
    //         'url': BASEURL + "/rest/v2/roles/resourcepermission",
    //         'data': { "RoleId": sessionStorage.ROLE_ID, "ResourceName": $stateParams.input.gotoPage.Name }
    //     })

        $http.post( BASEURL + "/rest/v2/roles/resourcepermission",{ "RoleId": sessionStorage.ROLE_ID, "ResourceName": $stateParams.input.gotoPage.Name })

        // .then(process_resource_permission) /** Set Resource Permission */ 
        .then(fetch_metainfo) /** Get Metainfo */
        .then(fetch_primarykey) /** Get PrimaryKey */
        .then(fetch_data) /** Get read all */
        .catch(error_msg)
        /** Initial Function */

    /** Dynamic web-form implementation */






    $scope.PageName = $stateParams.input.gotoPage.Name;
    $scope._stateParams = $stateParams


    /** TO Enable Effective From Date field in Search Box 
     *  Needs to be changed when the field is available in the metainfo then only that filter should be enabled in the search box 
     */
    $scope.isLogCong = false;
    if ($stateParams.input.gotoPage.TableName == "LogConfig") {
        $scope.isLogCong = true;
    }
    /** TO Enable Effective From Date field in Search Box  */


    /* Variable declaration Begins*/
    $scope.fieldDetails = {
        'Section': [],
        /* Field values */
        'Subsection': [],
        /* SubField values */
        'secondLevelsection': [],
        /* SubField values */
        'cstmAttr': {} /* Custom Attribute values */
    };
    $scope.CRUD = ($stateParams.input.responseMessage) ? ($stateParams.input.responseMessage) : ""; /* Response Message stored here */
    $scope.colSpanVal = "" /* used in slider insertion */
    $scope.ulName = ($stateParams.input.gotoPage.ParentName) ? $stateParams.input.gotoPage.ParentName : ''; /* used to display the parent name */
    $scope.dataLen = '' /* used to store the data length in loadmore */
    $scope.readData = [] /* used to store the data */
    $scope.Title = ($stateParams.input.gotoPage.Name) ? $stateParams.input.gotoPage.Name : '' /* used to display the title in add new */
    $scope.IconName = ($stateParams.input.gotoPage.IconName) ? $stateParams.input.gotoPage.IconName : '' /* used to display the title in add new */
    $scope.showPageTitle = $filter('removeSpace')(($stateParams.input.gotoPage.Name) ? $stateParams.input.gotoPage.Name : '');
    $scope.showsubTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.SubTitle'; /* used to display the discription */
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle'; /* used to display the parent name */
    $scope.changeViewFlag = GlobalService.viewFlag; /* used to store select view */
    $scope.restResponse = {}; /* used to store the rest response */
    /* Variable declaration Ends */

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

    /* used to store select view in the global variable for furture use */
    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
            //  $(".floatThead ").find("thead").hide();
            // 	$('thead.OrigHeader').hide();
            // 	$('thead.FakeHeader').hide();
            if ($(".maintable > thead")) {
                $(".maintable > thead").hide();
            }
            autoScrollDiv();
        } else {
            $(".floatThead ").find("thead").show();
            $('thead.OrigHeader').show();
            $timeout(function() {
                $(".FixHead").scrollTop($(".FixHead").scrollTop() + 2)
            }, 10)
            if ($(".FixHead").scrollTop() == 0) {
                $table = $("table.stickyheader")
                $table.floatThead('destroy');

            }
            autoScrollDiv();
        }
    })

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

    $scope.getTextAreaRows = function(val1) {
        return Math.ceil(val1);
    }

    $scope.primarykey = '';
    $scope.primarykey1 = '';
    $scope.Status = '';
    //Get Field Values



    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
        $('.my-tooltip').tooltip('hide');
    }

    //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if ($scope.dataLen.length >= 20) {
            $scope.restInputData.start = len;
            $scope.restInputData.count = 20;
            crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", $scope.restInputData, '', true).then(function(response) {
                $scope.dataLen = response.data.data
                if (response.data.data.length != 0) {
                    $scope.field_data = $scope.field_data.concat($scope.dataLen)
                    len = len + 20;
                }
            })
        }

    }

    var debounceHandler = _.debounce(loadMore, 700, true);
    $('.listView').on('scroll', function() {
        $scope.widthOnScroll();
        if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
            debounceHandler();
        }
    });

    //I Load More datas on scroll
    /*var len = 20;
    $scope.prevRestdata = [];
    $scope.loadMore = function(){
    	$scope.restInputData.start = len;
      
    	crudRequest("POST",$stateParams.input.gotoPage.Link+"/readall",$scope.restInputData).then(function(response){	
    			$scope.dataLen = response.data.data		
          				
    			if((response.data.data.length != 0)&&(JSON.stringify($scope.prevRestdata) != JSON.stringify($scope.dataLen))){
    				$scope.prevRestdata = angular.copy(response.data.data)
    				$scope.readData = $scope.readData.concat(response.data.data)
    				len = len + 20;
    			}
    			else{
    				$scope.prevRestdata = [];
    			}
    		})
    	
    }

     /*** To control Load more data ***/
    /*jQuery(
    	function($)
    		{
    			$('.listView').bind('scroll', function()
    			{
    				$scope.widthOnScroll();
    				if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
    				{	
            		
    					if(($scope.dataLen.length >= 20)&&(JSON.stringify($scope.prevRestdata) != JSON.stringify($scope.dataLen))){
    						$scope.loadMore();
    					}	
    				}
    			})
    			
    			$('.dropdown-menu #Filter').click(function (e) {
    				e.stopPropagation();
    			});
    			
    		}		
    );*/

    /*** Print function ***/

    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print();
    }

    window.addEventListener("afterprint", myFunction);

    function myFunction() {
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome) {
            setTimeout(function() {
                $('.FakeHeader').each(function(i) {
                    if ($(this).hasClass("FakeHeader")) {

                        $(this).siblings('thead').not(".OrigHeader").css('display', 'none');
                    }
                })
            }, 100)
        }
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.ExportMore = function(argu, excelLimit) {
        if (argu > excelLimit) {

            JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? $scope.Title + '_' + ('' + excelLimit)[0] : $scope.Title, true);
            $scope.dat = [];
            excelLimit += 1000000
        }

        if (!$scope.TotalCount) {
            $scope.TotalCount = $scope.restResponse.totalCount
            if ($scope.TotalCount == '') {
                $scope.TotalCount = 1001
            }
        }
        crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", {
            "start": argu,
            "count": ($scope.TotalCount) ? $scope.TotalCount : 10000
        }).then(function(response) {
            $scope.dat = $scope.dat.concat(response.data.data)
            if (response.data.data.length >= 1000) {

                argu += 1000;
                $scope.ExportMore(argu, excelLimit)
            } else {
                JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? $scope.Title + '_' + ('' + excelLimit)[0] : $scope.Title, true);
            }
        })
    }

    $scope.exportAsExcel = function() {
        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.ExportMore(0, 1000000);

        } else {
            $scope.dat = angular.copy($scope.field_data);
            $scope.dat.shift();

            JSONToCSVConvertor($scope.dat, $scope.Title, true);
        }


    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = ""; //This loop will extract the label from 1st index of on array
            var colName = [];
            if ($stateParams.input.gotoPage.Link == 'methodofpayments') {
                for (i in $scope.MOPdata) {
                    colName.push($scope.MOPdata[i].name)
                    row += $scope.MOPdata[i].label + ',';
                }
            } else {
                for (i in $scope.meta_info['field']) {


                    colName.push($scope.meta_info['field'][i].name)
                    row += $scope.meta_info['field'][i].name + ',';

                    // if ($scope.meta_info['field'][i].type == 'Section') {
                    //     row += $scope.meta_info['field'][i].name + ',';
                    // }

                }




            }
            row = row.slice(0, -1);
            CSV += row + '\n';

        }

        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (jk in colName) {
                if (JSON.stringify(arrData[i][colName[jk]]) != undefined) {

                    //row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';

                    if ($.isArray(arrData[i][colName[jk]])) {

                        var cont = "";
                        for (var x in arrData[i][colName[jk]]) {

                            var dStr = JSON.stringify(arrData[i][colName[jk]][x]);
                            dStr = dStr.replace(/"/g, '')
                            cont += JSON.stringify(dStr);
                        }

                        row += cont;
                        row = row.replace(/""/g, "\n")
                    } else if (typeof(arrData[i][colName[jk]]) === 'object') {

                        var cont = "";
                        var dStr = JSON.stringify(arrData[i][colName[jk]]);
                        dStr = dStr.replace(/"/g, '')
                        row += JSON.stringify(dStr);

                        row = row.replace(/""/g, "\n")
                    } else {
                        if (arrData[i][colName[jk]].toString().indexOf('{') != -1) {
                            var cont = "";
                            var dStr = JSON.stringify(arrData[i][colName[jk]]);
                            dStr = dStr.replace(/"/g, '')
                            row += JSON.stringify(dStr);
                            row = row.replace(/""/g, "\n") + ',';
                        } else {
                            row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';
                        }

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
        //$scope.setClass();
    });



    $scope.deleteData = function() {
        delete delData.$$hashKey
        $scope.delval = {}
        for (var j in $scope.primarykey) {
            $scope.delval[$scope.primarykey[j]] = delData[$scope.primarykey[j]]
        }

        crudRequest("POST", $stateParams.input.gotoPage.Link + '/delete', $scope.delval).then(function(response) {
            if (response.Status === 'Success') {
                $('.modal').modal("hide");

                $scope.CRUD = response.data.data.responseMessage ? response.data.data.responseMessage : "Borrado exitosamente";


                $scope.restInputData = {
                    "start": 0,
                    "count": 20,
                    "sorts": []
                }


                fetch_data()
            }
        })
    };





    crudRequest("GET", $stateParams.input.gotoPage.Link + "/primarykey", '').then(function(res) {
        if (res.data.data.responseMessage) {
            $scope.primarykey = res.data.data.responseMessage.split(',');
            $rootScope.primarykeyValues = $scope.primarykey;
            $scope.primarykey1 = $scope.primarykey[0].match(/_PK/g) ? '' : $scope.primarykey[0];
        }
    })
    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {

        var GetPrimaryKeys = angular.copy($scope.primarykey);


        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }



        crudRequest("POST", $stateParams.input.gotoPage.Link + "/reactivate", reactivateObj).then(function(response) {


            $scope.alerts = [{
                type: 'success',
                msg: response.data.data.responseMessage //Set the message to the popup window
            }];

            // $scope.restInputData.start = 0;
            // $scope.restInputData.count = len;
            $scope.restInputData = {
                start: 0,
                count: len
            };


            fetch_data()

        }, function(error) {

            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
        })

        setTimeout(function() {
            $(".alert").hide();
        }, 4000)

        $('.my-tooltip').tooltip('hide');


    }



    $scope.applyRestData = function(argu) {
        if (argu) {
            $scope.restInputData = {
                "start": 0,
                "count": 20,
                "sorts": []
            }
        }

        crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", $scope.restInputData, '', true).then(function(response) {

            $scope.readData = response.data.data;
            $scope.totalForCountBar = $scope.restResponse.totalCount;

            if ($scope.readData.length == 0) {
                $('.stickyheader').css('visibility', 'hidden');
            } else {
                $('.stickyheader').css('visibility', 'visible');
            }


            $scope.readData.splice(0, 0, {});

            $scope.dataLen = response.data.data
            if ($scope.readData.length === 1) {
                $scope.dataFound = true;
            } else {
                $scope.dataFound = false;
            }
            if ($scope.CRUD != "") {
                $scope.alerts = [{
                    type: 'success',
                    msg: $scope.CRUD //Set the message to the popup window
                }];
                $scope.CRUD = ""
                $timeout(callAtTimeout, 4000);
            }


            if (response.Status != "Error" && $stateParams.input.UserProfileDraft) {
                $scope.gotoEditDraft($stateParams.input)
            }

        })
        $scope.TotalCount = 0;
        for (j in $scope.Status) {
            //getCountbyStatus($scope.Status[j])
        }
    }
    $scope.loadData = function() {
        $scope.restInputData = {
            "start": 0,
            "count": 20
        }
        len = 20;
        $('.listView').scrollTop(0)
        $scope.clearSort('#sort');
        // $scope.clearFilter();
        $scope.ResourcePermissionCall();
        // fetch_data()
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


    $scope.showCustom = false;
    $scope.selectedDate = '';

    $scope.clearFilter = function() {

        if ('filters' in $scope.restInputData) {

            $scope.restInputData["start"] = 0;
            $scope.restInputData["count"] = len;
            if ($stateParams.input.gotoPage.Link == 'businessprocesses') {
                delete $scope.restInputData.filters;
                $scope.restInputData.sorts = [{
                        "columnName": "ProcessCode",
                        "sortOrder": "Asc"
                    },
                    {
                        "columnName": "WorkFlowCode",
                        "sortOrder": "Asc"
                    },
                    {
                        "columnName": "ActivityIndex",
                        "sortOrder": "Asc"
                    }
                ]
            } else if ($stateParams.input.gotoPage.Link == 'approvalcondition') {
                $scope.restInputData.sorts = [];
                $scope.restInputData.filters = {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "RoleID",
                                    "operator": "=",
                                    "value": "ALL",
                                    "isCaseSensitive": false
                                }]
                            }]
                        }]
                    }]
                }
            } else {
                delete $scope.restInputData.filters;
                $scope.restInputData.sorts = [];
            }

            $scope.showCustom = false;
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
            // $('.customDropdown').removeClass('open');
            $('.dropdown-menu').removeClass('show');
            fetch_data()
        } else {
            $scope.showCustom = false;
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
            // $('.customDropdown').removeClass('open');
            $('.dropdown-menu').removeClass('show');
        }

    }



    $scope.showAlert = false


    $(document).ready(function() {
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


    $scope.triggerpicker = function() {

        $scope.filterParams = {};
        $scope.showCustom = false;
        setTimeout(function() {
            var start = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));

            $('.DatePicker').datetimepicker({
                format: "YYYY-MM-DD",
                startDate: start,
                endDate: end,
                useCurrent: true,
                showClear: true,
                icons: datepickerFaIcons.icons
            }).on('dp.change', function(ev) {

                $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
            }).on('dp.show', function(ev) {

                $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()

            }).on('dp.hide', function(ev) {

                $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()

            })
        }, 500)
    }

    $scope.buildFilter = function(argu1) {
        var argu2 = []

        for (k in $scope.meta_info['field']) {

            if ($scope.meta_info['field'][k].type == 'String' && $scope.meta_info['field'][k].name != 'Status') {

                argu2.push({
                    "columnName": $scope.meta_info['field'][k].name,
                    "operator": "LIKE",
                    "value": argu1
                })
            }
        }



        return argu2;
    }

    $scope.searchFilter = function(_val, isDraftSearch) {
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
            /* if(!('filters' in $scope.restInputData)){
            	$scope.restInputData.filters = {  
            										"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND",
            										"groupLvl3":[]
            										}]}]
            									}			
            }
            $scope.restInputData.filters = removeEmptyValueKeys($scope.restInputData.filters) */

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
                } else if (Object.keys(_val)[j] == 'EffectiveDate') {


                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                                "columnName": "EffectiveFromDate",
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                                "value": $('#startDate').val()
                            },
                            {
                                "columnName": "EffectiveFromDate",
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


        fetch_data()



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

    $scope.gotoState = function(inputData) {
        var details = {
            metaInfo: $scope.meta_info,
            primaryKey: $scope.primary_key,
            urlLink: $stateParams.input.gotoPage,
            // data: inputData['fieldData'] ? getUniquefield(inputData['fieldData']) : {}
            data: inputData['fieldData'] ? inputData['fieldData'] : {}
        }
        // details = Object.assign(details, inputData);
        details =  $.extend(details, inputData);
        delete details['fieldData'];
        $('.my-tooltip').tooltip('hide');

        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
        params.input = details
        $state.go('app.dynamicFormsOperation', params);
    }

    $scope.goToEditOperation = function(viewParam) { 
        data ={
            TableName: $stateParams.input.gotoPage.Link || '',
            IsLocked: true,
            BusinessPrimaryKey : {}
            
        };
        if($scope.primarykey && $scope.primarykey.length > 0) {
            for (let i = 0; i < $scope.primarykey.length; i++) {                
                data.BusinessPrimaryKey[$scope.primarykey[i]] = viewParam.fieldData ? viewParam.fieldData[$scope.primarykey[i]] : '';
            }            
        }
        data.BusinessPrimaryKey  = JSON.stringify(data.BusinessPrimaryKey);       
       
        EntityLockService.checkEntityLock(data).then(function(data){                   
            $scope.gotoState(viewParam);
         }).catch(function(response){            
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


    $scope.gotoView = function(inputData) {
        var details = {
            metaInfo: $scope.meta_info,
            primaryKey: $scope.primary_key,
            urlLink: $stateParams.input.gotoPage,
            data: inputData['fieldData'] ? getUniquefield(inputData['fieldData']) : {}
        }
        // details = Object.assign(details, inputData);
        details = $.extend(details, inputData);
        delete details['fieldData'];
        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
        params.input = details

        $state.go('app.dynamicFormsView', params);
    }

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

    $scope.gotoSorting = function(dat) {

        //$(elem.currentTarget).find('i').removeAttr('class')

        $scope.restInputData.start = 0;
        $scope.restInputData.count = len;

        var orderFlag = true;
        if ('sorts' in $scope.restInputData && $scope.restInputData.sorts.length) {
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
                        $(sanitize$('#' + dat + '_icon')).attr('class', 'fa fa-minus fa-sm')
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
        fetch_data()
    }

    $(document).ready(function() {
        $(".FakeHeader").hide();
        $(".FixHead").scroll(function(e) {
            $(".FakeHeader").show();
            var $tablesToFloatHeaders = $('table.maintable');

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
                $(".listView").scrollLeft(10)
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(5)
            }

        })
        $(window).trigger('resize');
        var parentElement = $(".parent");
        $('.appendSelect2').each(function() {
            $(this).select2({
                width: '100%',
                placeholder: 'Select',
                allowClear: true,
                dropdownParent: parentElement
            })
            $(this).next().find('.select2-selection').each(function() {
                $(this).css({
                    'height': '34px',
                    'padding': '2px',
                    'border': '1px solid #e5e5e5',
                    'border-right': 'none'
                })
            })
        })

        $('select[name=SearchSelect]').on('change', function() {
            if ($(this).val()) {

            } else {
                $scope.filterParams.keywordSearch = ''
                $('input[name=keywordSearch]').val('')
            }
        })

    })

    $scope.gotoFilter = function(argu) {


    }
    $scope.gotoSort = function(argu) {

    }

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


                fetch_data()
            } else {
                $scope.restInputData.Queryfield = [];

            }
        } else {


            fetch_data()
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
                //$('#searchBox').get(0).setCustomValidity($scope.regex[type].errorMsg);

            }
        }

    }


    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
                $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
                $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
            })
            /* if('sorts' in $scope.restInputData && $scope.restInputData.sorts.length){
            } */
        $scope.restInputData['sorts'] = [];

        fetch_data()
    }

    $scope.clearfromSearch = function(index, to, flag) {

        if (flag) {
            $scope.clearSort('#sort');
            $scope.clearFilter();
            $scope.keywordSearchdata.searchBox = '';
        } else {
            $scope.restInputData[to].splice(index, 1)

            fetch_data()
        }
    }

    if ('triggerIs' in $stateParams.input) {

        setTimeout(function() {
            if ($stateParams.input.triggerIs.val.Operation == 'View') {
                $scope.gotoView({
                    'Permission': $scope.permission,
                    'Operation': $stateParams.input.triggerIs.val.Operation,
                    'fieldData': $stateParams.input.triggerIs.val.fieldData,
                    'primarykey': $stateParams.input.triggerIs.val.primarykey
                })
            } else {
                $scope.gotoState({
                    'Permission': $scope.permission,
                    'Operation': $stateParams.input.triggerIs.val.Operation,
                    'fieldData': $stateParams.input.triggerIs.val.fieldData,
                    'primarykey': $stateParams.input.triggerIs.val.primarykey
                })
            }
        }, 1000)
    }

    /* Get count */
    $scope.getCountbyStatus = function(argu) {
            crudRequest("GET", $stateParams.input.gotoPage.Link + '/' + argu.actualvalue + '/count', "").then(function(response) {
                argu.TotalCount = response.data.data.TotalCount;
                $scope.TotalCount = $scope.TotalCount + response.data.data.TotalCount;
                return response.data.data.TotalCount
            })
        }
        /* Get count */

    $scope.callforPermission = function(_permission, _status) {
        if ((_status.match(/WAITFORAPPROVAL/g) || _status.match(/DELETED/g)))
            return '{C: false, D: false, R: false, U: false}'
        else
            return _permission
    }

    $scope.clearEntityCache = function() {
        /* crudRequest("POST", $stateParams.urlId+'/reload',"").then(function(response){
        	
        }) */
        $http.get(BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + '/reload').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage //Set the message to the popup window
            }];
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'Error',
                msg: data.responseMessage //Set the message to the popup window
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }


    //var draftlen = 0;
    $scope.getCurrentDrafts = function() {

        $http.post(BASEURL + "/rest/v2/draft/" + $stateParams.input.gotoPage.TableName + '/readall', {
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
                msg: data.responseMessage //Set the message to the popup window  /v2/draft/read/{tableName}
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }



    $scope.gotoEditDraft = function(draftblob) {

        var gotostateObj = {
            'Operation': draftblob.Operation,
            'Permission': draftblob.Permission,
            'totData': draftblob.totData,
            'fieldData': "",
            'FromDraft': true,
            'typeOfDraft': "",
            'frommodule': 'entitydraft'
        }


        var specificReadObject = {
            "UserID": gotostateObj.totData.UserID,
            "Entity": gotostateObj.totData.Entity,
            "BPK": gotostateObj.totData.BPK
        }
        $http.post(BASEURL + RESTCALL.DraftSpecificRead, specificReadObject).then(function(response) {


            gotostateObj.typeOfDraft = response.headers().type;
            var decryptedDraft = $filter('hex2a')(response.data.Data)
            var jsonDraft = $filter('Xml2Json')(decryptedDraft);
            jsonDraft = jsonDraft[Object.keys(jsonDraft)[0]]


            for (var j in jsonDraft) {
                if (typeof(jsonDraft[j]) === 'object' && !Array.isArray(jsonDraft[j])) {
                    for (var sec in $scope.fieldDetails['Subsection']) {
                        if (($scope.fieldDetails['Subsection'][sec]['FieldName'] === j) && ($scope.fieldDetails['Subsection'][sec].MaxOccarance > 1 || $scope.fieldDetails['Subsection'][sec].MaxOccarance == -1)) {
                            jsonDraft[j] = [jsonDraft[j]]
                        }
                    }
                } else {
                    jsonDraft[j] = (jsonDraft[j] === 'true' || jsonDraft[j] === 'false') ? Boolean(jsonDraft[j]) : jsonDraft[j];
                }
            }

            gotostateObj.fieldData = jsonDraft;
            $scope.gotoState(gotostateObj);

        }, function(error) {

            $scope.alerts = [{
                type: 'Error',
                msg: error.responseMessage
            }];

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

            //if(response.Status === 'Success'){
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: "Borrado exitosamente"
            }];
            //}
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                /*$scope.alerts = [{
                    type : 'Error',
                    msg : data.responseMessage	
                }];*/

        });
    }

    draftlen = 20;
    argu = {};
    var loadMoreDrafts = function() {

        if (($scope.dataLen.length >= 20)) {
            argu.start = draftlen;
            argu.count = 20;

            $http.post(BASEURL + "/rest/v2/draft/" + $stateParams.input.gotoPage.TableName + '/readall', argu).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.dataLen = data;
                if (data.length != 0) {
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
            $('#DraftListModal').on('shown.bs.modal', function(e) {

                $('body').css('padding-right', 0);
                $(".draftViewCls").scrollTop(0);
            })

        })

    }, 200)


    $scope.gotobankdataupload = function(inputData) {
        inputData['pageTitle'] = $scope.Title;
        inputData['ulName'] = $scope.ulName;
        inputData['parentLink'] = $stateParams.input.gotoPage.Link;
        inputData['pageInfo'] = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? $scope.MOPdata : $scope.fieldDetails
        inputData['primarykey'] = $scope.primarykey;
        inputData['gotoPage'] = $stateParams.input.gotoPage;
        $state.go('app.bankdataupload', {
            input: inputData
        })
        $('.my-tooltip').tooltip('hide');
    }

    $scope.showAsXML = function(data) {
        var xmlData = hexToString(data)
        if (xmlData) {
            return $filter('beautify')(xmlData)
        } else {
            return data
        }
    }
});
