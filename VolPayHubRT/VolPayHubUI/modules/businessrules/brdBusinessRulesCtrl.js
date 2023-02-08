angular.module('VolpayApp').controller('brdBusinessRulesCtrl', function($scope, $state, $location, $http, $filter, bankData, GlobalService, $timeout, LogoutService, loadmeOnscroll, errorservice) {

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

    $scope.Status = GlobalService.storeStatus ? GlobalService.storeStatus : $scope.status1;

    $scope.permission = {
        'C': false,
        'D': false,
        'R': false,
        'U': false
    };

    $http.post(BASEURL + RESTCALL.ResourcePermission, {
        "RoleId": sessionStorage.ROLE_ID,
        "ResourceName": "Business Rules"
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

    $scope.sortMenu = [{
            "label": "Office Code",
            "FieldName": "OfficeCode",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Rule Code",
            "FieldName": "RuleCode",
            "visible": true,
            "Type": "String"
        }, {
            "label": "Rule Name",
            "FieldName": "RuleName",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Rule",
            "FieldName": "Rule",
            "visible": true
        },
        {
            "label": "Rule Phase",
            "FieldName": "RulePhase",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Description",
            "FieldName": "Description",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Rule Creation Date",
            "FieldName": "RuleCreationDate",
            "visible": true,
            "Type": "DateOnly"
        },
        {
            "label": "Status",
            "FieldName": "Status",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Effective From Date",
            "FieldName": "EffectiveFromDate",
            "visible": true,
            "Type": "DateOnly"

        },
        {
            "label": "Effective Till Date",
            "FieldName": "EffectiveTillDate",
            "visible": true,
            "Type": "DateOnly"

        },
        {
            "label": "Flow View",
            "FieldName": "11",
            "visible": true
        }
    ];

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
            if (error.data.error.code == 401) {
                errorservice.ErrorMsgFunction(error, $scope, $http)
            }
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
    };

    _url1 = BASEURL + RESTCALL.BankBusinessRuleBuilderREST;
    $http({
        url: _url1,
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        sessionStorage.RuleBaseObjs = btoa(JSON.stringify(data));
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        if (status == 401) {
            errorservice.ErrorMsgFunction(config, $scope, $http)
        } else {
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
        }
    });

    if (GlobalService.Fxupdated != '') {
        $scope.alerts = [{
            type: 'success',
            msg: GlobalService.Fxupdated //Set the message to the popup window
        }];

        GlobalService.Fxupdated = '';
        $timeout(callAtTimeout, 4000);

    };

    $scope.creatingWindow = true;
    $scope.newData = "";
    $scope.newRule123 = false;

    if ((sessionStorage.newRule == 'true') || (sessionStorage.newRule == true)) {
        $scope.creatingWindow = false;
        $scope.newRule123 = true;

        $scope.newData = JSON.parse(sessionStorage.newRuleFormData);
        $scope.newData.Rule = sessionStorage.buildedRule;

    }

    if ((sessionStorage.newEditRule == true) || (sessionStorage.newEditRule == 'true')) {

        setTimeout(function() {

            $scope.BusinessRule = JSON.parse(sessionStorage.newEditRuleFormData);
            $scope.BusinessRule.Rule = sessionStorage.buildedRule;
            $scope.editedRule = sessionStorage.buildedRule;
            $('#RuleCode_' + sessionStorage.editWindowID).focus();
            $('#RuleCode_' + sessionStorage.editWindowID).blur();

            $('#displayingWindow_' + sessionStorage.editWindowID).collapse('hide');
            $('.displayWindow').collapse('show');
            $('.editWindow').collapse('hide');
            $('#editingWindow_' + sessionStorage.editWindowID).collapse('show');
            $('.editHere').removeClass('trHilght');
            $('#editHere_' + sessionStorage.editWindowID).addClass('trHilght');
            $('.collapse').removeClass('trHilght');
            $('#collapse' + sessionStorage.editWindowID).addClass('trHilght');

            $('#listViewPanelHeading_' + sessionStorage.editWindowID).collapse('hide');
            $('#collapse' + sessionStorage.editWindowID).collapse('show');

            $('.listViewPanelHeading').css('display', 'block')
            $('#listViewPanelHeading_' + sessionStorage.editWindowID).css('display', 'none')


        }, 500)

    }
    $scope.flowchart = function(val, $event) {

        $('#flowchart').modal('show')

        var flowdata = val.Rule;
        $scope.ruleName = val.RuleName;
        var part1 = flowdata.split('{', 2);
        $scope.condition = part1[0];
        $scope.substr = flowdata.slice(0, 20);
        $scope.result = part1[1].slice(0, -2).trim();


        $event.stopPropagation();
    }
    $scope.toRuleBuilder = function(ss) {
        $scope.RBwarning = false;
        if (ss != "") {
            if (((ss.OfficeCode == "") || (ss.OfficeCode == undefined)) || ((ss.RuleCode == "") || (ss.RuleCode == undefined))) {
                $scope.RBwarning = true;

            } else {
                $scope.RBwarning = false;
                sessionStorage.newRuleFormData = JSON.stringify(ss);
            }

            sessionStorage.newRuleFormData = JSON.stringify(ss);
            $location.path("app/businessrules2")
        } else {
            $scope.RBwarning = true;
        }
    }

    $scope.toRuleBuilderEdit = function(ss, index) {
        sessionStorage.newEditRuleFormData = JSON.stringify(ss);
        sessionStorage.editWindowID = index;
        GlobalService.editRuleBuilder = ss.RuleStructure;
        $location.path("app/businessrules3")
    }

    var restServer = RESTCALL.BankBusinessRuleREST + 'readall';

    var delData = {};
    $scope.backUp = {};
    $scope.indexx = "";
    $scope.dataFound = false;
    $scope.loadMorecalled = false;
    $scope.CRUD = "";
    $scope.restVal = [];

    $scope.takeBackup = function(val, Id) {
        $scope.backUp = angular.copy(val);
        $scope.indexx = angular.copy(Id);
    }

    $scope.AddNewcancelpressed = function() {

        delete sessionStorage.newRule;
        delete sessionStorage.newRuleFormData;
        delete sessionStorage.ruleJSONBinary;
        delete sessionStorage.buildedRule;
        $scope.newRule123 = false;
    }

    $scope.rulePhaseDropVal = function() {

        $http.get(BASEURL + RESTCALL.BusinessRulePhase).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.rulePhaseValue = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }
    $scope.rulePhaseDropVal()

    $scope.cancelpressed = function(Id) {

        $('#listViewPanelHeading_' + Id).css('display', 'block')
        $('#collapse' + Id).collapse('hide');
        $('#editHere_' + Id).removeClass('trHilght');
        $('#collapse' + Id).removeClass('trHilght');

        $scope.restVal[$scope.indexx] = $scope.backUp;
        $('#editingWindow_' + Id).collapse('hide');
        $('#displayingWindow_' + Id).collapse('show');
        sessionStorage.newEditRule = 'false'

        delete sessionStorage.newRule;
        delete sessionStorage.newRuleFormData;
        delete sessionStorage.ruleJSONBinary;
        delete sessionStorage.buildedRule;
        delete sessionStorage.newEditRule;
        delete sessionStorage.editWindowID;
        delete sessionStorage.newEditRuleFormData;
        delete sessionStorage.editruleJSONBinary;

    }

    $scope.prev = null;

    $scope.toggleWindow = function(val, Id, viewMe) {
        $scope.viewMe = viewMe;
        if ($scope.prev != null) {
            $('#collapse' + $scope.prev).collapse('hide');
        }

        $scope.editedRule = val.Rule;
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


    /*** Sorting ***/
    $scope.orderByField = 'RulePhase';
    $scope.SortReverse = false;
    $scope.SortType = 'Asc';


    //I Load the initial set of datas onload
    $scope.initData = function() {
        $scope.bankData = {};

        //$scope.bankData.IsReadAllRecord = true;
        $scope.bankData.QueryOrder = [];
        $scope.bankData.start = 0;
        $scope.bankData.count = 20;
        $scope.bankData.Operator = "AND";

        $scope.dupBankData = angular.copy($scope.bankData)

        $scope.bankData = constructQuery($scope.bankData);

        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }

    $scope.initData();
    //I Load More datas on scroll
    var len = 20;
    $scope.loadMore = function() {
        $scope.loadMorecalled = true;
        //$scope.bankData.IsReadAllRecord = true;
        // $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
        $scope.bankData.start = len;
        $scope.bankData.count = 20;

        // $scope.bankData = constructQuery($scope.bankData);
        crudRequest("POST", restServer, $scope.bankData).then(function(response) {

                $scope.lenthofData = response.data.data;

                if (response.data.data.length != 0) {
                    $scope.restVal = $scope.restVal.concat(response.data.data)
                    len = len + 20;
                }
            })
            //bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
            //len = len + 20;
    }

    $scope.loadData = function() {
        $scope.CRUD = "";
        $scope.bankData.start = 0
        $scope.bankData.count = 20
        len = 20;
        $('.listView').scrollTop(0)
        $scope.initData();
    }

    // I process the Create Data Request.
    $scope.createData = function(newData) {
        newData.RuleStructure = sessionStorage.ruleJSONBinary;
        //$scope.bankData.Data = btoa(JSON.stringify(newData))
        restServer = RESTCALL.BankBusinessRuleREST;
        newData = removeEmptyValueKeys(newData)

        bankData.crudRequest("POST", restServer, newData).then(getData, errorFunc);
        $scope.CRUD = "Created Successfully";
        $scope.newData = ""; // Reset the form once values have been consumed.
        $scope.newRule123 = false;
        delete sessionStorage.buildedRule;
        delete sessionStorage.newRule;
        delete sessionStorage.newRuleFormData;
    };

    // I update the given data to the Restserver.
    $scope.updateData = function(editedData, updateIndex) {
        delete editedData.$$hashKey;
        editedData.Rule = $('#RuleCode_' + updateIndex).val();
        editedData = removeEmptyValueKeys(editedData);
        if (sessionStorage.editruleJSONBinary != undefined) {
            editedData.RuleStructure = sessionStorage.editruleJSONBinary;
        }

        restServer = RESTCALL.BankBusinessRuleREST;

        bankData.crudRequest("PUT", restServer, editedData).then(getData, errorFunc);
        $scope.CRUD = "Updated Successfully";
        $scope.newData = "";
        delete sessionStorage.newEditRule;
        delete sessionStorage.buildedRule;
        delete sessionStorage.newEditRuleFormData;
    };

    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete delData.$$hashKey
        var deleteObj = {
            "OfficeCode": delData.OfficeCode,
            "RuleCode": delData.RuleCode
        }
        restServer = RESTCALL.BankBusinessRuleREST + 'delete';
        bankData.crudRequest("POST", restServer, deleteObj).then(getData, errorFunc);
        $('.modal').modal("hide");
        //$scope.CRUD = "Borrado exitosamente";
    };

    // I load the rest data from the server.
    function getData(response) {

        $scope.CRUD = response.data.responseMessage;

        $scope.loadMorecalled = false;
        //$scope.bankData.IsReadAllRecord = true;
        $scope.bankData.QueryOrder = [];
        $scope.bankData.start = 0;
        $scope.bankData.count = 20;
        len = 20;

        $scope.bankData = constructQuery($scope.bankData);

        restServer = RESTCALL.BankBusinessRuleREST + 'readall';
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

    }

    $scope.bData = '';
    // I apply the rest data to the local scope.
    function applyRestData(restDat) {

        $scope.bData = angular.copy(restDat)
        var restData = restDat.data;
        $scope.restVal = restData;
        $scope.restVal.splice(0, 0, {});
        $scope.totalForCountbar = restDat.headers().totalcount;
        $scope.lenthofData = $scope.bData.data;

        /* if($scope.loadMorecalled) {
        	$scope.restVal = $scope.restVal.concat(restData);
        	$scope.loadedCnt = $scope.restVal.length;
        } else {*/


        if ($scope.restVal.length == 1) {
            $scope.dataFound = true;
        } else {
            $scope.dataFound = false;
        }
        //$scope.restVal = restData;
        //$scope.loadedCnt = $scope.restVal.length;



        if ($scope.CRUD != "") {
            $scope.alerts = [{
                type: 'success',
                msg: $scope.CRUD //Set the message to the popup window
            }];
            $timeout(callAtTimeout, 4000);
        }
        $('.alert-danger').hide()
            //}
            //$scope.feedMore = bankData.loadMoredata(restData.length)

    }

    // I apply the Error Message to the Popup Window.
    function errorFunc(errorMessag) {
        var errorMessage = errorMessag.data;
        $scope.alerts = [{
            type: 'danger',
            msg: errorMessag.data.error.message //Set the message to the popup window
        }];
    }

    $timeout(function() {
        if ($scope.dupBankData.QueryOrder.length) {
            for (k in $scope.dupBankData.QueryOrder) {
                if ($scope.dupBankData.QueryOrder[k].ColumnOrder == 'Asc') {
                    $('#' + $scope.dupBankData.QueryOrder[k].ColumnName + '_Icon').attr('class', 'fa fa-caret-up')
                } else {
                    $('#' + $scope.dupBankData.QueryOrder[k].ColumnName + '_Icon').attr('class', 'fa fa-caret-down')
                }
            }
        }
    }, 100)

    /*$scope.gotoSorting = function(dat){

		    $scope.dupBankData.start = 0;
			$scope.dupBankData.count = len;

            var orderFlag = true;
    		if($scope.dupBankData.QueryOrder.length){
    			for(k in $scope.dupBankData.QueryOrder){
    				if($scope.dupBankData.QueryOrder[k].ColumnName == dat.FieldName){
    					if($scope.dupBankData.QueryOrder[k].ColumnOrder == 'Asc'){
    						$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-desc')
    						$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
    						$scope.dupBankData.QueryOrder[k].ColumnOrder = 'Desc'
    						orderFlag = false;
                            break;
    					}
    					else{
    						$scope.dupBankData.QueryOrder.splice(k,1);
    						orderFlag = false;
    						$('#'+dat.FieldName+'_icon').attr('class','fa fa-hand-pointer-o')
    						$('#'+dat.FieldName+'_Icon').removeAttr('class')
                            break;
    					}
    				}
    			}
    			if(orderFlag){
    				$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
    				$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
    				$scope.dupBankData.QueryOrder.push({
    								"ColumnName": dat.FieldName,
    								"ColumnOrder": 'Asc'
    				})

    			}
    		}
    		else{
    			$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
    			$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
    			$scope.dupBankData.QueryOrder.push({
    							  "ColumnName": dat.FieldName,
    							  "ColumnOrder": 'Asc'
    							})
    		}

			$scope.bankData = constructQuery($scope.dupBankData);
    		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);
        }
	
	*/
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
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa fa-minus fa-sm')
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
            $(this).removeAttr('class').attr('class', 'fa fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });

        //$scope.restInputData.QueryOrder = [];
        //$scope.applyRestData();

        // $scope.bankData = {
        // 	"start":0,
        // 	"count":20
        // };
        $scope.bankData.sorts = [];
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }


    $scope.buildFilter = function(argu1, argu2) {
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

    $scope.searchFilter = function(val) {
        val = removeEmptyValueKeys(val)
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
        for (j in Object.keys(val)) {
            $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                "logicalOperator": "OR",
                "clauses": []
            })
            if (Object.prototype.toString.call(val[Object.keys(val)[j]]) === '[object Array]') {
                for (i in val[Object.keys(val)[j]]) {
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
                        "columnName": Object.keys(val)[j],
                        "operator": "=",
                        "value": val[Object.keys(val)[j]][i]
                    })
                }
            } else {
                if (typeof(val[Object.keys(val)[j]]) === 'object') {
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].logicalOperator = "AND"
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
                        "columnName": "EffectiveFromDate",
                        "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                        "value": $('#startDate').val()
                    })
                    $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
                        "columnName": "EffectiveFromDate",
                        "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                        "value": $('#endDate').val()
                    })
                } else {
                    $scope.buildFilter(val[Object.keys(val)[j]], $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses)
                }

            }
        }
        //$scope.bankData = constructQuery($scope.bankData)
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
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
    }

    $scope.clearFilter = function() {
        $scope.bankData = {
            "start": 0,
            "count": 20,
            "sorts": []
        }
        $scope.showCustom = false;
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
        })
        $('.customDropdown').removeClass('open');
        $scope.bankData = constructQuery($scope.bankData)
        bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
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

    $scope.showCustom = false;
    $scope.selectedDate = '';

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
                'box-shadow': '',
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

    function callAtTimeout() {
        $('.alert').hide();
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.viewData = function(data, flag) {
        sessionStorage.newRule = false;
        GlobalService.fromAddNew = false;
        sessionStorage.newEditRule = false;
        delete data.$$hashKey;
        GlobalService.specificData = data;
        GlobalService.ViewClicked = flag;

        $state.go('app.businessrulesdetails', {
            input: $scope.permission
        })

        // $location.path('app/businessrulesdetails')
    }

    $scope.addFxRate = function() {

        //$scope.BusinessRuleCreate= {};
        GlobalService.fromAddNew = true;
        $location.path('app/businessrulesdetails')
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(function($) {
        $('.listView').bind('scroll', function() {
            $scope.widthOnScroll();
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                if ($scope.lenthofData.length >= 20) {
                    //$scope.loadMore();
                    debounceHandler()
                }
            }
        })
        setTimeout(function() {}, 1000)


        setTimeout(function() {}, 1000)

        $('.dropdown-menu #Filter').click(function(e) {
            e.stopPropagation();
        });

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
    // } else {
    // 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
    // 	$scope.changeViewFlag = false;
    // }

    /*	$scope.hello = function (value, eve) {
    		var hitId = eve.currentTarget.id;
    		$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
    		$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');
    		if (value == "list") {
    			$scope.changeViewFlag = !$scope.changeViewFlag;
    		} else if (value == "grid") {
    			$scope.changeViewFlag = !$scope.changeViewFlag;
    		} else {
    			$scope.changeViewFlag = !$scope.changeViewFlag;
    		}
    		GlobalService.viewFlag = $scope.changeViewFlag;
    	}*/

    /** List and Grid view Ends**/

    /*** Print function ***/

    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()
    }

    /*** Export to Excel function ***/
    $scope.exportToExcel = function() {
        var tabledata = angular.element(document.querySelector('#dummyExportContent')).clone();
        // $(tabledata).find('thead').find('tr').find('th:first-child').remove()
        // $(tabledata).find('tbody').find('tr').find('td:first-child').remove()

        var table_html = $(tabledata).html();
        bankData.exportToExcelHtml(table_html, 'Business Rules')
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
            var $tablesToFloatHeaders = $('table.smallTable');
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

        $(window).bind("resize", function() {
            setTimeout(function() {
                autoScrollDiv();
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }


        })
        $(window).trigger('resize');

    })
});