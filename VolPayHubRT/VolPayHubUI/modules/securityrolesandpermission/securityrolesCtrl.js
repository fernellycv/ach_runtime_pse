angular.module('VolpayApp').controller('securityrolesCtrl', function($scope, $rootScope, $http, bankData, $state, $stateParams, $location, $filter, userMgmtService, $timeout, GlobalService, LogoutService, errorservice, EntityLockService) {
    EntityLockService.flushEntityLocks();

    $scope.Obj = {};

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
            // "ResourceName": "Roles & Permissions"
            "ResourceName": "RoleDetails"
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

    function autoScrollDiv() {
        $(".listView").scrollTop(0);
    }

    // $scope.changeViewFlag = GlobalService.viewFlag;
    $scope.changeViewFlag = false
    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        // GlobalService.viewFlag = newValue;
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

    $stateParams.input ?
        $stateParams.input.responseMessage ?
        $scope.alerts = [{
            type: 'success',
            msg: $stateParams.input.responseMessage
        }] : ''

    :
    ''

    setTimeout(function() {
        $scope.callAtTimeout();
    }, 4000)



    // $scope.showAlert = true;
    $scope.userRoles = [];


    var len = 20;
    $scope.fieldArr = {
        "start": 0,
        "count": 20,
        "sorts": [{ columnName: "RoleID", sortOrder: "Desc" }]
    }

    $scope.queryForm = function(arr) {
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.Queryfield = [];
        $scope.Qobj.QueryOrder = [];


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

    $scope.initializeSetting = function() {
       
        $scope.FieldsValues_ = [{
            'label': "BankWorksheet.Entity",
             "value": "PartyName",
             "type": "dropdown",
             "allow": "string",
             "visible": true
         }, {
            'label': "UserManagement.Entitytype",
             "value": "PartyType",
             "type": "dropdown",
             "allow": "string",
             "visible": true
         },
        //{
        //     "label": "securityRolesPermissions.Client Id",
        //      "value": "PartyCode",
        //      "type": "text",
        //      "allow": "string",
        //      "visible": true
        //  },
         {
            "label": "securityRolesPermissions.Role Name",
             "value": "RoleName",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
            "label": "securityRolesPermissions.Status",
             "value": "Status",
             "type": "text",
             "allow": "string",
             "visible": true
         }
     ]
    }

    $scope.initializeSetting();

    $scope.forplaceholder = function() {
        $scope.dArr = ["PartyCode", "PartyType"]
        $timeout(function() {
            for (var i in $scope.dArr) {
                $("select[name='" + $scope.dArr[i] + "']").select2({
                    placeholder: "Select an option"
                });
            }
      
        }, 100)
    }


    $scope.sortMenu = [{
        "label": "securityRolesPermissions.Client Id",
        "FieldName": "PartyCode",
        "visible": "true",
        "Type": "String",
    },{
            "label": "securityRolesPermissions.Role Name",
            "FieldName": "RoleName",
            "visible": true,
            "Type": "String"
        }, {
            "label": "securityRolesPermissions.Status",
            "FieldName": "Status",
            "visible": true,
            "Type": "Number"
        }, {
            "label": "securityRolesPermissions.Effective From Date",
            "FieldName": "EffectiveFromDate",
            "visible": true,
            "Type": "DateOnly"
        },
        {
            "label": "securityRolesPermissions.Effective Till Date",
            "FieldName": "EffectiveTillDate",
            "visible": false,
            "Type": "DateOnly"
        }
    ];

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
    }];


    $scope.Status = [{
            "actualvalue": "ACTIVE",
            "displayvalue": "ACTIVE"
        },
        {
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
    ];






    $scope.initCall = function(_query) {

        $http.post(BASEURL + '/rest/v2/administration/role/readall', _query).then(function onSuccess(response) {
            // Handle success

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.totalForCountBar = headers().totalcount
            $scope.loadedData = angular.copy(data.Details);

            $scope.userRoles = data.Details;
            // $scope.userRoles.splice(0, 0, {})
            $stateParams.input ? $stateParams.input.UserProfileDraft ? $scope.gotoEditDraft('', '', $stateParams.input.totData) : '' : '';
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.loadedData = [];
            /* if (status == 401) {
            	
            } else { */
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message //Set the message to the popup window
            }];
            // }
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.initCall($scope.fieldArr)

    $scope.loadData = function() {
        len = 20;

        $scope.fieldArr = {
            "start": 0,
            "count": 20,
            "sorts": [{ columnName: "RoleID", sortOrder: "Desc" }]
        }

        $(".listView").scrollTop(0);

        $scope.initCall($scope.fieldArr)
        $scope.ResourcePermissionCall();
    }
    len=20
    $scope.loadMore = function() {
        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;
        $scope.fieldArr.sorts =  [{ columnName: "RoleID", sortOrder: "Desc" }];
        if (($scope.loadedData.length >= 20)) {
            $http.post(BASEURL + '/rest/v2/administration/role/readall', $scope.fieldArr).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
    
                $scope.restData = data.Details;
                $scope.userRoles = $scope.userRoles.concat(data.Details);
                $scope.loadedData = data.Details;
                len = len + 20;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
    
                $scope.loadedData = [];
                errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        }
      
    }



    $scope.gotoSorting = function(dat) {

        $scope.fieldArr.start = 0;
        $scope.fieldArr.count = len;

        var orderFlag = true;
        if ($scope.fieldArr.sortBy.length) {
            for (var i in $scope.fieldArr.sortBy) {
                if ($scope.fieldArr.sortBy[i].ColumnName == dat.FieldName) {
                    if ($scope.fieldArr.sortBy[i].ColumnOrder == 'Asc') {
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.fieldArr.sortBy[i].ColumnOrder = 'Desc';
                        orderFlag = false;
                        break;
                    } else {
                        $scope.fieldArr.sortBy.splice(i, 1);
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
                $scope.fieldArr.sortBy.push({
                    "ColumnName": dat.FieldName,
                    "ColumnOrder": 'Asc'
                })
            }
        } else {

            $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')

            $scope.fieldArr.sortBy.push({
                "ColumnName": dat.FieldName,
                "ColumnOrder": 'Asc'
            })

        }
        $scope.initCall($scope.queryForm($scope.fieldArr))
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

    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });
        $scope.fieldArr.sortBy = [];
        $scope.initCall($scope.queryForm($scope.fieldArr))
    }

    $scope.fields = [  {
        'type': "string",
        'label': "securityRolesPermissions.Client ID",
        'name': "PartyCode"
    },{
            'type': "string",
            'label': "securityRolesPermissions.Role Name",
            'name': "RoleName"
        },
      
        {
            'type': "string",
            'label': "securityRolesPermissions.Status",
            'name': "Status"
        }/**,
         {
            'type': "string",
            'label': "securityRolesPermissions.Effective From Date",
            'name': "EffectiveFromDate"
        },
        {
            'type': "string",
            'label': "securityRolesPermissions.Effective Till Date",
            'name': "EffectiveTillDate"
        }**/
    ]


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
    $scope.callAtTimeout = function() {
        $('.alert').hide();
    }


    $scope.gotoDeleteFn = function(resource, roleid) {
        $scope.deleteDisRole = roleid;
    }

    $scope.takeDeldata = function(roleid) {

        $scope.delObj = {};
        $scope.delObj.RoleID = roleid;
        $http.post(BASEURL + RESTCALL.CreateRole + '/delete', $scope.delObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data) {
                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }];
            } else {
                $scope.alerts = [{
                    type: 'success',
                    msg: "Borrado exitosamente"
                }];
            }
            setTimeout(function() {
                $scope.callAtTimeout()
            }, 3000)


            $('.collapse').collapse('hide')

            $scope.initCall($scope.queryForm($scope.fieldArr))
            for (var i in $scope.Status) {
                $scope.getCountbyStatus($scope.Status[i])
            }

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;
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

            setTimeout(function() {
                $scope.callAtTimeout()
            }, 3000)
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
        $('.modal').modal("hide");
        $('body').removeClass('modal-open')
    }

    $scope.search = {};
    $scope.showSearchWarning = $.isEmptyObject($scope.search);

    $scope.rstAdvancedSearchFlag = function() {

        if ($scope.advancedSearchEnable == false) {
            $scope.AdsearchParams = {
                "InstructionData": {
                    "ReceivedDate": {
                        "Start": "",
                        "End": ""
                    },
                    "ValueDate": {
                        "Start": "",
                        "End": ""
                    },
                    "Amount": {
                        "Start": "",
                        "End": ""
                    },
                    "DebitFxRate": {
                        "Start": "",
                        "End": ""
                    }
                }

            };
            $scope.search = angular.copy($scope.AdsearchParams);
        }
        $scope.search={}
      
        $scope.advanceSearchCollaspe();
        GlobalService.PaymentAdvancedSearch = true;
        $scope.PaymentAdvancedSearch = true;
        $scope.amountAlert = false;

        $timeout(function() {

            for (var i in $scope.FieldsValues_) {
                if ($scope.FieldsValues_[i].type == 'dropdown') {
                    $(sanitize('[name=' + $scope.FieldsValues_[i].value + ']')).select2();
                    $(sanitize('[name=' + $scope.FieldsValues_[i].value + ']')).select2('val', '');
                }
            }
        }, 10)
    }

    function triggerSelectDrops() {
        $scope.select2Arr = ["PartyName","PartyType"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $("select[name=" + $scope.select2Arr[i] + "]").select2({
                    placeholder: 'Select an option',
                    minimumInputLength: 0,
                    allowClear: true

                })

              
            }
        })

    }
    setTimeout(function() {
        triggerSelectDrops();
    }, 1000);

    $scope.advanceSearchCollaspe = function(){ 
        
        if($scope.PaymentAdvancedSearch){
            $('#PaymentAdvancedSearch').collapse('show')
        }
        else{
            $('#PaymentAdvancedSearch').collapse('hide')
        }
        $scope.PaymentAdvancedSearch = !$scope.PaymentAdvancedSearch;
        $scope.showSearchWarning = false;
    }
 
 
    $scope.buildSearch = function() {
       

        if(!$.isEmptyObject($scope.search)){
            $scope.searchFilter($scope.search,true) 
            $('#PaymentAdvancedSearch').collapse('hide')   
            $scope.advanceSearchCollaspe();
            $scope.PaymentAdvancedSearch = true;
        }else{
          
          $scope.showSearchWarning=true
        }
    
   

    }



    $scope.searchFilter = function(val,flag) {


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
                        "groupLvl3": []
                    }]
                }]
            },
            "sorts": [{ columnName: "RoleID", sortOrder: "Desc" }],
            "start": $scope.fieldArr.start,
            "count": $scope.fieldArr.count
        }

        if(flag){
               
            var keyArr = [];
                        
            for (var inobj in val) {
                keyArr.push({
                    'ColumnName': inobj,
                    'ColumnValue':  val[inobj],
                    'ColumnOperation': 'LIKE'
                })
            }

            $scope.statusREST = {
                "Queryfield": keyArr
            }
            $scope.statusREST = constructQuery($scope.statusREST)

            $scope.adFilter.filters=$scope.statusREST.filters

       
  
        }else{
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

             
                    // val.SearchSelect = JSON.parse(val.SearchSelect)
                    if(typeof(val.SearchSelect)=='string'){
                        val.SearchSelect = JSON.parse(val.SearchSelect)
                    }else{
                        val.SearchSelect = val.SearchSelect
                    }


                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": val.SearchSelect.name,
                            "operator": (val.SearchSelect.type == 'select') ? "=" : "LIKE",
                            "value": val.keywordSearch
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

    
    $http.get(BASEURL + '/rest/v2/administration/user/roleType').then(function onSuccess(response) {
        // Handle success

      
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.partyOptions = data;
        $scope.PartyCode_ = $scope.partyOptions.PartyCode
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });


    function triggerSelectDrops() {
        $scope.select2Arr = ["PartyName","PartyType"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $("select[name=" + $scope.select2Arr[i] + "]").select2({
                    placeholder: 'Select an option',
                    minimumInputLength: 0,
                    allowClear: true

                })

              
            }
        })

    }
    setTimeout(function() {
        triggerSelectDrops();
    }, 1000);

    $scope.retainAlert = function(eve) {

        $(eve.currentTarget).parent().removeClass('in')
        $scope.showSearchWarning = false;
    }
    $scope.reset = function() {
   

    
        delete $scope.filterParams['PartyName']
        delete $scope.filterParams['PartyType']

        setTimeout(function() {
            triggerSelectDrops();
        }, 100)
    }

    $scope.clearFilter = function() {

        $scope.fieldArr = {
            "start": 0,
            "count": 20,
            "sorts": [{ columnName: "RoleID", sortOrder: "Desc" }]
        }

        $scope.search = {};
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
        $('.customDropdown').removeClass('open');

        $scope.initCall($scope.queryForm($scope.fieldArr))
    }

    $scope.multiSortObj = [];
    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()
    }

    var colName = ["Id del Rol","Nombre de Rol","Código de Entidad","Código de Servicio","Estado","Activo Desde"];
    var colNames = ["RoleID","RoleName","PartyCode", "ServiceCode", "Status","EffectiveFromDate"];

    $scope.ExportMore = function(argu, excelLimit) {
        if (argu > excelLimit) {
            JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? $scope.Title + '_' + ('' + excelLimit)[0] : $scope.Title, true);
            $scope.dat = [];
            excelLimit += 1000000
        }

        $http.post(BASEURL + '/rest/v2/administration/role/readall/Export', {
                  "sorts": [{ columnName: "RoleID", sortOrder: "Desc" }],
            "start": argu,
            "count": ($scope.totalForCountBar) ? $scope.totalForCountBar : 10000
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.dat = $scope.dat.concat(data['Details'])
            if (data['Details'].length >= 1000) {

                argu += 1000;
                $scope.ExportMore(argu, excelLimit)
            } else {
                JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? "Roles" + '_' + ('' + excelLimit)[0] : "Roles", true);
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

    $scope.exportAsExcel = function(data) {

        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.ExportMore(0, 1000000);
        } else {
            $scope.dat = angular.copy($scope.userRoles);
            $scope.dat.shift();

            // JSONToCSVConvertor(bankData, $scope.dat, "Roles", true);
            JSONToExport(bankData, $scope.dat, "Roles", true, colNames,'rolemanagament',colName);
        }
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

    $scope.changevalue = false;
    $scope.checkBox = function(val, flag) {

        $scope.active = !$scope.active;

        if (!flag) {

            $scope.changevalue = true;
            $scope.checkBoxChecked = true;

            $('#rolesTable td').css('padding', '6px 12px');

        } else {

            $scope.changevalue = false;
            $scope.checkBoxChecked = false;
            $('#rolesTable td').css('padding', '12px 12px');
        }
    }

    $scope.checkOpt = function(val) {
        var visible = $(val.currentTarget).parent().parent().parent().parent().find('.visible');

        var visibleDropdown = $(val.currentTarget).parent().parent().find('button:first-child').find('span:first-child');

        var selEle = $(val.currentTarget).find("span");
        var selClass = selEle.attr("class");

        $(visibleDropdown).removeAttr('class').addClass('opt checkedDropdown').addClass(selClass)
        $(visible).removeAttr("class").addClass('visible').addClass(selClass);
    }
    $scope.getAccordion = function(value) {


        $scope.Obj = {
            // createRoles: $scope.createdRoleDetails,
            RoleName: value.RoleName,
            PartyCode: value.PartyCode
        }
        $state.go("app.securityviewresourcepermission", {
            input: $scope.Obj
        })


    }


    $scope.AddNewRole = function() {
        $scope.editObj = {};
        $scope.editObj.FromRoles = false;
        sessionStorage.EditPage = false;
        $state.go("app.securityaddroles", {
            input: $scope.editObj
        })
        $('.my-tooltip').tooltip('hide');
    }



    $scope.gotoEdit = function(v1, v2, Opt) {
        $scope.editObj = {};
        $scope.editObj.Resourcename = v1;
        $scope.editObj.RoleId = v2;
        $scope.editObj.ToEditPage = true;
        $scope.editObj.Operation = Opt;
        $scope.editObj.FromRoles = true;
        sessionStorage.EditPage = true;

        $state.go("app.securityaddroles", {
            input: $scope.editObj
        })

    }


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

    $scope.TotalCount = 0;
    $scope.getCountbyStatus = function(argu) {
        $http.get(BASEURL + "/rest/v2/roles/" + argu.actualvalue + "/count").then(function onSuccess(response) {
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



    $scope.getCurrentDrafts = function() {

        $http.post(BASEURL + "/rest/v2/draft/Role/readall", {
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

    $scope.takeDelDraftdata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
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

            $timeout(function() {
                $('.alert-success').hide();
            }, 4000)

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            /*$scope.alerts = [{
            	type : 'Error',
            	msg : data.responseMessage	
            }];*/
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
    }


    draftlen = 20;
    argu = {};
    var loadMoreDrafts = function() {

        if (($scope.dataLen.length >= 20)) {
            argu.start = draftlen;
            argu.count = 20;

            $http.post(BASEURL + "/rest/v2/draft/Role/readall", argu).then(function onSuccess(response) {
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


    $scope.gotoEditDraft = function(opr, index, draftblob) {

        var gostateObj = {
            'typeOfDraft': '',
            'decrData': "",
            'draftdata': draftblob,
            'FromDraft': true
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
        }, function(error) {
            $scope.alerts = [{
                type: 'Error',
                msg: error.responseMessage
            }];
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)

        })

        $state.go("app.securityaddroles", {
            input: gostateObj
        })

    }

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

        crudRequest("POST", "/rest/v2/roles/reactivate", reactivateObj).then(function(response) {

            $scope.alerts = [{
                type: 'success',
                msg: response.data.data.responseMessage //Set the message to the popup window
            }];


            $scope.fieldArr = {
                start: 0,
                count: len
            };

            $scope.initCall($scope.queryForm($scope.fieldArr))
        })

        setTimeout(function() {
            $(".alert").hide();
        }, 4000)

    }

});