angular.module('VolpayApp').controller('userMgmtController', function($scope, $rootScope, $http, $filter, $state, userMgmtService, CommonService, $timeout, bankData, GlobalService, $location, LogoutService, $stateParams, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions('UserDetails');
    var authenticationObject = $rootScope.dynamicAuthObj;

    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks();
    $scope.downloadOptions = "Current"
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
            // "ResourceName": "User Management"
            "ResourceName": "UserDetails"
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



    var restServer = '/rest/v2/administration/userreadall';
    var delData = {};
    $scope.backUp = {};
    $scope.indexx = "";
    $scope.dataFound = false;
    $scope.loadMorecalled = false;
    $scope.CRUD = "";
    $scope.restVal = [];

    // $scope.changeViewFlag = GlobalService.viewFlag;
    $scope.changeViewFlag = false

    function autoScrollDiv() {
        $(".listView").scrollTop(0);
    }

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


    /*** Export to Excel function ***/
    /*$scope.exportToExcel = function(eve){
    	var tabledata = angular.element( document.querySelector('#exportTable') ).clone();
    	$(tabledata).find('thead').find('tr').find('th:first-child').remove()
    	$(tabledata).find('tbody').find('tr').find('td:first-child').remove()

    	var table_html = $(tabledata).html();
    	bankData.exportToExcel(table_html, 'Users')
    }*/
    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()
    }

    var colName = ["Tipo Identificación","Número Identificación","ID Usuario", "Nombre", "Apellidos","Teléfono","Extensión","Celular","Código Entidad","Entidad", "Rol",
        "Estado", "Correo Electrónico","Cargo","Fecha Creación", "Último Inicio de Sesión","Activo Desde"];
	  var colNames = ["IDType","IDNumber","UserID", "FirstName", "LastName","PhoneNumber","PhoneExtensionNumber","Mobile","PartyCode","PartyName", "RoleID",
        "Status", "EmailAddress","Position","CreatedDate", "LastLoggedIn","EffectiveFromDate"];
		
    $scope.ExportMore = function(argu, excelLimit) {
        if (argu > excelLimit) {
            JSONToExport(bankData, $scope.dat, (argu > excelLimit) ? "Users" + '_' + ('' + excelLimit)[0] : "Users", true, colName);
            $scope.dat = [];
            excelLimit += 1000000
        }
       
        $http.post(BASEURL +'/rest/v2/administration/users/readall/Export', {
            "sorts": [{ columnName: "UserID", sortOrder: "Desc" }],
            "start": argu,
            "count": ($scope.totalForCountBar) ? $scope.totalForCountBar : 10000
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.dat = $scope.dat.concat(data)
            if (data.length >= 1000) {
                argu += 1000;
                $scope.ExportMore(argu, excelLimit)
            } else {
                JSONToExport(bankData, $scope.dat, (argu > excelLimit) ? "Users" + '_' + ('' + excelLimit)[0] : "Users", true, colName);
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

    $scope.utf8_decode =  function  (strData) {
        const tmpArr = []
        let i = 0
        let c1 = 0
        let seqlen = 0
        strData += ''
        while (i < strData.length) {
          c1 = strData.charCodeAt(i) & 0xFF
          seqlen = 0
          // https://en.wikipedia.org/wiki/UTF-8#Codepage_layout
          if (c1 <= 0xBF) {
            c1 = (c1 & 0x7F)
            seqlen = 1
          } else if (c1 <= 0xDF) {
            c1 = (c1 & 0x1F)
            seqlen = 2
          } else if (c1 <= 0xEF) {
            c1 = (c1 & 0x0F)
            seqlen = 3
          } else {
            c1 = (c1 & 0x07)
            seqlen = 4
          }
          for (let ai = 1; ai < seqlen; ++ai) {
            c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
          }
          if (seqlen === 4) {
            c1 -= 0x10000
            tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
            tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
          } else {
            tmpArr.push(String.fromCharCode(c1))
          }
          i += seqlen
        }
        return tmpArr.join('')
      }

    $scope.exportAsExcel = function(format) {
        $scope.dat = [];
        const filename = $filter('translate')('UserManagement.Users');
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            //$scope.ExportMore(0, 1000000);
            if(format=='csv'){
                var rest=BASEURL +'/rest/v2/administration/users/readall/Export'
            }else{
                var rest=BASEURL +'/rest/v2/administration/users/'+format
            }
            let filter = $scope.adFilter === undefined || $scope.adFilter === null ||  $scope.adFilter.filters === undefined || $scope.adFilter.filters === null ? null : $scope.adFilter.filters;
            $http.post(rest, {
                "filters": filter,
                "sorts": [{ columnName: "UserID", sortOrder: "Desc" }],
                "start": 0,
                "count": ($scope.totalForCountBar) ? $scope.totalForCountBar : 10000
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                // $scope.datas = $scope.datas.concat(data);
                if(data["FileName"]){
                    data["filename"] = data["FileName"]
                }

                if(format=='csv'){
                    var res = atob(data["Data"]);
                    res = $scope.utf8_decode(res);
                    var universalBOM = "\uFEFF";
                    $scope.Details = "data:text/csv; charset=utf-8," +  encodeURIComponent(universalBOM+res);
                    var dlnk = document.getElementById("dwnldLnk");
                    dlnk.href = $scope.Details;
                    if (data["filename"]) {
                        dlnk.download = filename+'.csv';
                    } else {
                        dlnk.download = filename+".csv";
                    }
                } else {
                    $scope.dat =data["Data"]
                    $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
                    var dlnk = document.getElementById('dwnldLnk');
                    dlnk.href = $scope.Details;
                    dlnk.download =  filename+'.'+format;
                }

                dlnk.click();
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                // errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        } else {
            $scope.dat = angular.copy($scope.restVal);
      
            JSONToExport(bankData, $scope.dat, filename, true, colNames,'usermanagament',colName);
        }
    }

    $scope.userDataFn = function(val, Id, flag) {
        val.Status = val.Status ? String(val.Status) : '';
        val.IsForceReset = String(val.IsForceReset);

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
            'Operation': 'View'
        };
        data.UserRoleAssociation = data.UserRoleAssociation ? data.UserRoleAssociation : [{}]
        $state.go('app.userdetail', {
            input: $scope.input,
            permission: $scope.permission
        })
    }

    $scope.gotoEdit = function(data, flag, drObj) {

        data.View = flag;
        $scope.input = {
            'Data': data,
            'DraftTotObj': drObj ? drObj : '',
            'Operation': 'Edit'
        };


        data.UserRoleAssociation = data.UserRoleAssociation ? data.UserRoleAssociation : [{}]
        $state.go('app.userdetail', {
            input: $scope.input,
            permission: $scope.permission
        })
    }


    $scope.goToEditOperation = function(viewParam) {

        var dataObj = {}; // have to form the request payload
        dataObj['TableName'] = 'UserProfile';
        // dataObj['ActionName'] = actions.ActionName;
        dataObj['IsLocked'] = true;
        dataObj['BusinessPrimaryKey'] = JSON.stringify({ 'UserID': viewParam.UserID });

        EntityLockService.checkEntityLock(dataObj).then(function(data) {
                $scope.gotoEdit(viewParam);
            })
            .catch(function(response) {
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



    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
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

        restServer = '/rest/v2/administration/userreadall';
        $scope.initialObj = {};
        $scope.initialObj.UserId = sessionStorage.UserID;
        bankData.crudRequest("POST", restServer, $scope.UserData).then(applyRestData, errorFunc);
    }


    $scope.fieldArr = {
        "sorts": [{ columnName: "UserID", sortOrder: "Desc" }],
        "start": 0,
        "count": 20
    }

    $scope.uorQueryConstruct = function(arr) {

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
            } else if (i == 'sorts') {
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

    $scope.initCall($scope.fieldArr)



    $scope.initSetting = function() {
        $scope.FieldsValues = [{
            "label": "UserManagement.ID Type",
            "value": "IDType",
            "type": "text",
            "allow": "text",
            "visible": true
        },{
            "label": "UserManagement.ID Number",
            "value": "IDNumber",
            "type": "text",
            "allow": "text",
            "visible": true
        },{
            "label": "UserManagement.User ID",
            "value": "UserID",
            "type": "text",
            "allow": "text",
            "visible": true
        }, {
            "label": "UserManagement.First Name",
            "value": "FirstName",
            "type": "text",
            "allow": "string",
            "visible": true
        },
        {
            "label": "UserManagement.Last Name",
            "value": "LastName",
            "type": "text",
            "allow": "string",
            "visible": true
        },{
            "label": "UserManagement.PartyCode",
            "value": "PartyCode",
            "type": "text",
            "allow": "text",
            "visible": true
        },{
            "label": "UserManagement.PartyName",
            "value": "PartyName",
            "type": "text",
            "allow": "text",
            "visible": true
        }, {
                "label": "UserManagement.Role ID",
                "value": "RoleID",
                "type": "dropdown",
                "visible": true
            },
            {
                "label": "UserManagement.Status",
                "value": "Status",
                "type": "dropdown",
                'multiple': false,
                "visible": true
            },
            {
                "label": "UserManagement.E-Mail",
                "value": "EmailAddress",
                "type": "text",
                'multiple': false,
                "visible": true
            },
            {
                "label": "UserManagement.LastLoggedIn",
                "value": "LastLoggedIn",
                "type": "dateRange",
                "allow": "number",
                "visible": true
            },
           
        ]
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

    $scope.loadedData = '';
    //$scope.uorVal = $scope.uorFound  = $scope.commonObj.uorVal;

    //$scope.fieldArr = $scope.commonObj.currentObj;

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
                    "ColumnName": "EffectiveFromDate",
                    "ColumnOperation": "=",
                    "ColumnValue": todayDate()
                }]
            } else if ($scope.dateFilter.week) {
                $scope.dateArr = [{
                        "ColumnName": "EffectiveFromDate",
                        "ColumnOperation": ">=",
                        "ColumnValue": week().lastDate
                    },
                    {
                        "ColumnName": "EffectiveFromDate",
                        "ColumnOperation": "<=",
                        "ColumnValue": week().todayDate
                    }
                ]
            } else if ($scope.dateFilter.month) {
                $scope.dateArr = [{
                        "ColumnName": "EffectiveFromDate",
                        "ColumnOperation": ">=",
                        "ColumnValue": month().lastDate
                    },
                    {
                        "ColumnName": "EffectiveFromDate",
                        "ColumnOperation": "<=",
                        "ColumnValue": month().todayDate
                    }
                ]

            } else if ($scope.dateFilter.custom) {
                customDateRangePicker('CstartDate', 'CendDate')

                $scope.customDate.startDate = CommonService.userMgmt.customDate.startDate;
                $scope.customDate.endDate = CommonService.userMgmt.customDate.endDate;
                $('#customDate').modal('hide')
                $scope.dateArr = [{
                        "ColumnName": "EffectiveFromDate",
                        "ColumnOperation": ">=",
                        "ColumnValue": $scope.customDate.startDate
                    },
                    {
                        "ColumnName": "EffectiveFromDate",
                        "ColumnOperation": "<=",
                        "ColumnValue": $scope.customDate.endDate
                    }
                ]

            }

            return $scope.dateArr;

        }
        //$scope.retExpResult()

    $scope.buildSearch = function() {


        $(".listView").scrollTop(0);
        $scope.uorFound = $scope.uorVal = "";
        $scope.search = cleantheinputdata($scope.search)
        $scope.showSearchWarning = $.isEmptyObject($scope.search);
        $rootScope.usersearch = angular.copy($scope.search);
        $scope.searchArr = [];
        for (i in $scope.search) {
            if (i == 'EffectiveFromDate') {
                if ($scope.search[i].Start && $scope.search[i].End) {

                    $scope.searchArr.push({
                        "ColumnName": i,
                        "ColumnOperation": ">=",
                        "ColumnValue": $scope.search[i].Start,
                        'advancedSearch': true
                    });
                    $scope.searchArr.push({
                        "ColumnName": i,
                        "ColumnOperation": "<=",
                        "ColumnValue": $scope.search[i].End,
                        'advancedSearch': true
                    });
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
        $scope.fieldArr.params = $scope.retExpResult()
        $scope.fieldArr.params = $scope.searchArr.concat($scope.fieldArr.params);
        $scope.fieldArr.start = 0;
        if ((!$scope.showSearchWarning || $scope.spliceSearch || $scope.buildSearchClicked)) {
            $scope.distSearch = true;
            if ($scope.resetBtnClicked) {
                $scope.distSearch = false;
                setTimeout(function() {
                    $scope.resetBtnClicked = false
                }, 1000)
            }
            $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
            $scope.spliceSearch = false;
        }
        $scope.savedSearchSelected = false;

        return {
            'service': CommonService.userMgmt,
            'searchParams': $scope.search
        };


    }

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

    $scope.clearSearch = function() {

        //$scope.searchFound = false;
        $scope.loadedData = '';
        $(".listView").scrollTop(0);

        $scope.fieldArr = {
            "sorts": [],
            "start": 0,
            "count": 20
        };
        len = 20;
        $scope.uorVal = '';
        $scope.uorFound = '';
        CommonService.userMgmt.uorVal = '';
        $scope.search = {
            "EffectiveFromDate": {
                "Start": "",
                "End": ""
            }
        }
        $scope.newSearch = false;
        $scope.dSearch = $scope.search;
        $rootScope.usersearch = {
            "EffectiveFromDate": {
                "Start": "",
                "End": ""
            }
        }

        $scope.customDate = {
            startDate: '',
            endDate: ''
        }


        //$scope.dateArr = [];

        $scope.dArr = ["RoleID", "Status", "TimeZone", "Country"]
        $timeout(function() {

            for (var i in $scope.dArr) {

                $("select[name='" + $scope.dArr[i] + "']").select2("destroy");
                $("select[name='" + $scope.dArr[i] + "']").val("");
                $("select[name='" + $scope.dArr[i] + "']").select2({
                    placeholder: 'Select an option',
                    allowClear: true
                });
            }
            $scope.remoteDataConfig()

        }, 100)



        $timeout(function() {
            customDateRangePicker("EffectiveFromDateStart", "EffectiveFromDateEnd")
        }, 10)

        CommonService.userMgmt.dateFilter = {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        }
        $scope.dateSet()
        $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
    }

    $scope.resetFilter = function() {
        $scope.buildSearchClicked = true;
        $scope.resetBtnClicked = true;
        $scope.AdsearchParams = {
            "EffectiveFromDate": {
                "Start": "",
                "End": ""
            }

        }

        $scope.search = angular.copy($scope.AdsearchParams);
        $scope.search = {
            "EffectiveFromDate": {
                "Start": "",
                "End": ""
            }
        };
        $rootScope.usersearch = {
            "EffectiveFromDate": {
                "Start": "",
                "End": ""
            }
        }

        $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');

        //$scope.setSortMenu()
        $scope.buildSearch()

    }

    $scope.SelectValue = function(index) {

        $scope.seeVisible = false;
        $scope.FieldsValues[index]['visible'] = !$scope.FieldsValues[index]['visible'];

        if ($scope.FieldsValues[index].value == 'EffectiveFromDate') {
            setTimeout(function() {
                customDateRangePicker("EffectiveFromDateStart", "EffectiveFromDateEnd")
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()

                })
            }, 1000)
        }



        for (var i in $scope.FieldsValues) {
            if ($scope.FieldsValues[i].visible) {
                $scope.seeVisible = true;
            }
        }

        if ($scope.seeVisible) {
            $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');
        } else {
            $scope.distSearch = true;
            $('#saveSearchBtn, #AdSearchBtn').attr('disabled', 'disabled');
        }

    }

    $scope.loadData = function() {
            $(".listView").scrollTop(0);
            len = 20;
            $scope.clearFilter();
            $scope.fieldArr = {
                "sorts": [{ columnName: "UserID", sortOrder: "Desc" }],
                "start": 0,
                "count": 20
            }
            restServer = '/rest/v2/administration/userreadall';
            // $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
            $scope.initCall($scope.fieldArr)

            $('.table-responsive').find('table').find('thead').find('th').find('span').removeAttr('class')
            $scope.ResourcePermissionCall();
        }
        //I Load More datas on scroll

    $scope.loadMore = function() {


        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;
        $scope.fieldArr.sorts = [{ columnName: "UserID", sortOrder: "Desc" }];
      

        $http.post(BASEURL + '/rest/v2/administration/userreadall', $scope.fieldArr).then(function onSuccess(response) {
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
        if ($scope.fieldArr.sorts.length) {
            for (var i in $scope.fieldArr.sorts) {
                if ($scope.fieldArr.sorts[i].ColumnName == dat.value) {
                    if ($scope.fieldArr.sorts[i].ColumnOrder == 'Asc') {
                        $(sanitize('#' + dat.value + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.value + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.fieldArr.sorts[i].ColumnOrder = 'Desc';
                        orderFlag = false;
                        break;
                    } else {
                        $scope.fieldArr.sorts.splice(i, 1);
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
                $scope.fieldArr.sorts.push({
                    "ColumnName": dat.value,
                    "ColumnOrder": 'Asc'
                })
            }
        } else {

            $(sanitize('#' + dat.value + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.value + '_Icon')).attr('class', 'fa fa-caret-up')

            $scope.fieldArr.sorts.push({
                "ColumnName": dat.value,
                "ColumnOrder": 'Asc'
            })
        }
        $scope.initCall($scope.fieldArr)
    }

    $scope.deleteData = function() {
        /*delete delData.$$hashKey

        $scope.delObj = {};
        $scope.delObj.UserId = delData.UserID;
		

        restServer = RESTCALL.CreateNewUser+'/delete';

        bankData.crudRequest("POST", restServer,$scope.delObj).then(getData,errorFunc);
        	$('.modal').modal("hide");
        	$('body').removeClass('modal-open')*/

        //delete $scope.data.$$hashKey;
        delete delData.$$hashKey
        $scope.delObj = {};
        $scope.delObj.UserId = delData.UserID;

        var restServer = RESTCALL.CreateNewUser + '/delete';

        $http.post(BASEURL + restServer, $scope.delObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'success',
                msg: (data.responseMessage) ? data.responseMessage : 'Borrado exitosamente'
            }];

            $scope.loadData()
            for (var i in $scope.Status) {
                $scope.getCountbyStatus($scope.Status[i])
            }

            setTimeout(function() {
                $('.alert-success').hide()
            }, 4000)
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
        });
        $('.modal').modal("hide");
        $('body').removeClass('modal-open')
    };

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
        restServer = RESTCALL.CreateNewUser + '/readall';
        bankData.crudRequest("POST", restServer, $scope.UserData).then(applyRestData, errorFunc);
    }

    // I apply the rest data to the local scope.

    function applyRestData(restDat) {
        $scope.totalForCountBar = restDat.headers().totalcount;
        var restData = restDat.data
        $scope.restData = restData;
        //$scope.restData.splice(0, 0, {});

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
        $('.my-tooltip').tooltip('hide');
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




    $scope.printFn = function() {
        window.print()
    }





    $scope.auditLogDetails = "";
    $scope.commentVal = "";
    $scope.costructAudit = function(argu, index) {

        $scope.auditLogDetails = argu
            //$('#auditModel_'+index).find('tbody').html('')
        $('.auditTable').find('tbody').html('')


        if (argu.oldData && argu.newData) {
            $('.auditTable').find('tbody').append('<tr><th>Field</th><th style="width:200px;">Old Data</th><th style="width:200px;">New Data</th></tr>')
        } else {
            $('.auditTable').find('tbody').append('<tr><th>Field</th><th>Data</th></tr>')
        }
        var _keys = ''

        if ($.isPlainObject(argu.oldData) && $.isPlainObject(argu.newData)) {
            _keys = (Object.keys(argu.oldData).length >= Object.keys(argu.newData).length) ? Object.keys(argu.oldData) : Object.keys(argu.newData)
        } else if ($.isPlainObject(argu.oldData)) {
            _keys = Object.keys(argu.oldData)
        } else if ($.isPlainObject(argu.newData)) {
            _keys = Object.keys(argu.newData)
        }

        for (var j in _keys) {
            if (!_keys[j].match(/_PK/g)) {
                var _tr = ""
                if (j % 2) {
                    _tr = "<tr style='background-color: rgb(245, 245, 245)'>"
                } else {
                    _tr = "<tr style='background-color: #fff'>"
                }
                _tr = _tr + "<td>" + $filter('camelCaseFormatter')(_keys[j]) + "</td>";
                if (argu.oldData && argu.newData) {
                    if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (argu.oldData[_keys[j]]) {
                            if (typeof(argu.oldData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                    if (argu.newData) {
                        if (argu.newData[_keys[j]]) {
                            if (argu.oldData && argu.newData[_keys[j]] != argu.oldData[_keys[j]]) {
                                _tr = _tr + "<td class=\"modifiedClass\">"
                            } else {
                                _tr = _tr + "<td>"
                            }
                            if (typeof(argu.newData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.newData[_keys[j]];
                            }
                            _tr = _tr + "</td>"
                        }
                    }


                } else {
                    if (argu.newData) {
                        _tr = _tr + "<td>"
                        if (argu.newData[_keys[j]]) {
                            if (typeof(argu.newData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.newData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    } else if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (argu.oldData[_keys[j]]) {
                            if (typeof(argu.oldData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                }

                $('.auditTable').find('tbody').append(_tr)
            }
        }

        if ((argu.action).match(/:/g)) {
            $scope.commentVal = (argu.action).split(/:(.+)/)
        } else {
            $scope.commentVal = ""
        }
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
    $scope.showaudit = function(argu, index) {
        $scope.tempData = argu;
        $scope.costructAudit(argu, index)
        $scope.auditTableshow = true;

        $('#innerModel').modal('toggle');
    }


    $scope.spliceSearchArr = function(key) {

        delete $scope.search[key];
        $scope.buildSearchClicked = true;
        $scope.dArr = ["RoleID", "Status", "TimeZone", "Country"]
        $timeout(function() {

            for (var i in $scope.dArr) {
                if (key == $scope.dArr[i]) {
                    $("select[name='" + $scope.dArr[i] + "']").select2("destroy");
                    $("select[name='" + $scope.dArr[i] + "']").val("");
                    $("select[name='" + $scope.dArr[i] + "']").select2({
                        placeholder: 'Select an option',
                        allowClear: true
                    });

                    $scope.remoteDataConfig()
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


    /*setTimeout(function(){
     $scope.timeZone()
     },100)*/

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
         },{
            'label': "UserManagement.Party Code",
             "value": "PartyCode",
             "type": "text",
             "allow": "string",
             "visible": true
         },{
              'label': "UserManagement.User ID",
             "value": "UserID",
             "type": "text",
             "allow": "string",
             "visible": true
         },{
         'label': "UserManagement.First Name",
             "value": "FirstName",
             "type": "text",
             "allow": "string",
             "visible": true
         },{
             'label': "UserManagement.Last Name",
             "value": "LastName",
             "type": "text",
             "allow": "string",
             "visible": true
         },{
              'label': "UserManagement.IDType",
             "value": "IDType",
             "type": "text",
             "allow": "string",
             "visible": true
         },{
        'label': "UserManagement.IDNumber",
             "value": "IDNumber",
             "type": "text",
             "allow": "string",
             "visible": true
         },{
              'label': "UserManagement.EmailAddress",
             "value": "EmailAddress",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
               'label': "UserManagement.Phone Number",
             "value": "PhoneNumber",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
           'label': "UserManagement.PhoneExtensionNumber",
             "value": "PhoneExtensionNumber",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
              'label': "UserManagement.Mobile",
             "value": "Mobile",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
                  'label': "UserManagement.Role ID",
             "value": "RoleID",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
            'label': "UserManagement.Status",
             "value": "Status",
             "type": "text",
             "allow": "string",
             "visible": true
         }, {
              'label': "UserManagement.TimeZone",
             "value": "TimeZone",
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
                     placeholder: $filter('translate')('Placeholder.Select')
                });
            }
      
        }, 100)
    }

    /*****Search starts *******/

    $scope.filterBydate = [{
        'actualvalue': todayDate(),
        'displayvalue': 'filterBydate.Today'
    }, {
        'actualvalue': week(),
        'displayvalue': 'filterBydate.This Week'
    }, {
        'actualvalue': month(),
        'displayvalue': 'filterBydate.This Month'
    }, {
        'actualvalue': year(),
        'displayvalue': 'filterBydate.This Year'
    }, {
        'actualvalue': '',
        'displayvalue': 'filterBydate.Custom'
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
            'label': "UserManagement.Party Code",
            'name': "PartyCode"
             },{
            'type': "string",
            'label': "UserManagement.Party Name",
            'name': "PartyName"
         },{
            'type': "string",
            'label': "UserManagement.Party Type",
            'name': "PartyType"
         },{
                'type': "string",
                'label': "UserManagement.User ID",
                'name': "UserID"
            },
            {
                'type': "string",
                'label': "UserManagement.First Name",
                'name': "FirstName"
            },
            {
                'type': "string",
                'label': "UserManagement.Last Name",
                'name': "LastName"
            },
            {
                'type': "string",
                'label': "UserManagement.IDType",
                'name': "IDType"
            },
            {
                'type': "string",
                'label': "UserManagement.IDNumber",
                'name': "IDNumber"
            },
			   {
                'type': "string",
                'label': "UserManagement.EmailAddress",
                'name': "EmailAddress"
            },
            {
                'type': "string",
                'label': "UserManagement.Phone Number",
                'name': "PhoneNumber"
            },
            {
                'type': "string",
                'label': "UserManagement.PhoneExtensionNumber",
                'name': "PhoneExtensionNumber"
            },
            {
                'type': "string",
                'label': "UserManagement.Mobile",
                'name': "Mobile"
            },
            {
                'type': "select",
                'label': "UserManagement.Role ID",
                'value': [],
                'smartSearch': true,
                'name': "RoleID"
            },
            {
                'type': "string",
                'label': "UserManagement.Status",
                'name': "Status"
            },
            {
                'type': "string",
                'label': "UserManagement.TimeZone",
                'name': "TimeZone"
            },
            // {
            //     'type': "select",
            //     'label': "Country",
            //     'value': [],
            //     'smartSearch': true,
            //     'name': "Country"
            // },
            // {
            //     'type': "select",
            //     'label': "UserManagement.Department",
            //     'value': [],
            //     'smartSearch': true,
            //     'name': "Department"
            // },
            {
                'type': "DateOnly",
                'label': "UserManagement.Effective From Date",
                'name': "EffectiveFromDate"
            },
            {
                'type': "DateOnly",
                'label': "UserManagement.Effective Till Date",
                'name': "EffectiveTillDate"
            }
        ]


        for (var i in $scope.fields) {
            if ($scope.fields[i].name == "TimeZone") {

                $scope.tZoneOptions = timeZoneDropValues.TimeZone;
                $scope.fields[i].value = $scope.tZoneOptions;

            }
            if ($scope.fields[i].name == "Country") {

                $scope.countryOptions = countryDropValues.Country;
                $scope.fields[i].value = $scope.countryOptions;

            }
        }
    }, 1000)
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
        } else if (val.displayvalue == 'filterBydate.Custom') {
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
        $scope.fieldArr.sorts = [];
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
    
    
    $scope.buildSearchs = function() {

        $scope.search = cleantheinputdata($scope.search)


        if(!$.isEmptyObject($scope.search )){
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
            "sorts": [{ columnName: "UserID", sortOrder: "Desc" }],
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
                if (i == 'sorts') {
                    for (var j in $scope.fieldArr[i]) {
                        if($scope.fieldArr[i][j].ColumnName&&$scope.fieldArr[i][j].ColumnOrder){
                            $scope.adFilter.sorts.push({
                                "columnName": $scope.fieldArr[i][j].ColumnName,
                                "sortOrder": $scope.fieldArr[i][j].ColumnOrder
                            })
                          }
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
                            },
                            {
                                "columnName": "EffectiveFromDate",
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                                "value": $('#endDate').val()
                            }]
                        })
    
                        // $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        //     "logicalOperator": "AND",
                        //     "clauses": [{
                        //         "columnName": "EffectiveFromDate",
                        //         "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                        //         "value": $('#endDate').val()
                        //     }]
                        // })
    
    
    
                    }  else if (Object.keys(val)[j] == 'SearchSelect') {
    
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
                                "value": val.keywordSearch,
                                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                            }]
                        })
    
                    } else if (Object.keys(val)[j] == 'keywordSearch' && !val['SearchSelect']) {
    
                        $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                            "logicalOperator": "OR",
                            "clauses": $scope.buildFilter(val[Object.keys(val)[j]])
                        });
                    }
                }
            }
        }
     
        $scope.initCall($scope.adFilter)

        setTimeout(function() {
          
            $('select[name=SearchSelect]').val(null).trigger("change");
     
        }, 100)
        // $scope.filterParams = {};
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

            for (var i in $scope.FieldsValues) {
                if ($scope.FieldsValues[i].type == 'dropdown') {
                    $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
                    $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2('val', '');
                }
            }
        }, 10)
    }

    function triggerSelectDrops() {
        $scope.select2Arr = ["PartyName","PartyType"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $("select[name=" + $scope.select2Arr[i] + "]").select2({
                    placeholder: $filter('translate')('Placeholder.Select'),
                    minimumInputLength: 0,
                    allowClear: true
                })
            }
        })

    }
    setTimeout(function() {
        triggerSelectDrops();
    }, 1000);

    $scope.reset = function() {
   
        delete $scope.filterParams['PartyName']
        delete $scope.filterParams['PartyType']

        setTimeout(function() {
            triggerSelectDrops();
        }, 100)
    }

    $scope.advanceSearchCollaspe = function(){ 
        
        if($scope.PaymentAdvancedSearch){
            $('#PaymentAdvancedSearch').collapse('show')
        } else {
            $('#PaymentAdvancedSearch').collapse('hide')
        }
        $scope.PaymentAdvancedSearch = !$scope.PaymentAdvancedSearch;
        $scope.showSearchWarning = false;
    }

    $scope.clearFilter = function() {
        $scope.adFilter = null;
        $scope.fieldArr = {
            "start": 0,
            "count": 20,
           "sorts" : [{ columnName: "UserID", sortOrder: "Desc" }]
        }

        setTimeout(function() {
            $('select[name=SearchSelect]').val(null).trigger("change");
              $('select[name=PartyName]').val(null).trigger("change");
            $('select[name=PartyType]').val(null).trigger("change");
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
            });
        });

        $scope.showCustom = false;
        $scope.selectedDate = '';
        $('.customDropdown').removeClass('open');

        $scope.initCall($scope.fieldArr)
        $('.dropdown-menu').removeClass('show');
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
            }, 100);
        }
    }

    $scope.limit = 500;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {
            setTimeout(function() {

                var parentElement = $(".parent");

                let query = {"start":0,"count":$scope.limit,"sorts":[{"columnName":"RoleID","sortOrder":"Desc"}]}

                $http.post(BASEURL + "/rest/v2/administration/role/readall",query).then(function onSuccess(response) {
                    // Handle success
                    var {Details} = response.data;
                    $scope.RolSelectFilter = Details.map(item => {
                        return {"id": item.RoleID,"text": item.RoleID}
                    });

                    $("select[name='keywordSearch']").select2({
                        data: $scope.RolSelectFilter,
                        placeholder: 'Seleccione',
                    });
                }).catch(function onError(response) {

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
                    placeholder: 'Seleccione',
                    minimumInputLength: 0,
                    allowClear: true,
                    dropdownParent: parentElement

                })
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
        showClear: true,
        icons: {
            previous: 'fa fa-chevron-left',
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            next: 'fa fa-chevron-right',
            today: 'fa fa-crosshairs',
            clear: 'fa fa-trash',
            close: 'fa fa-times'
        }
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
        });
        
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
        });

        $(window).bind("resize", function() {
            setTimeout(function() {
                autoScrollDiv();
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }
        });
        
        $(window).trigger('resize');
        $('#DraftListModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0);
            $(".draftViewCls").scrollTop(0);
        })
    })
    $scope.TotalCount = 0;
    $scope.getCountbyStatus = function(argu) {
        $http.get(BASEURL + "/rest/v2/users/" + argu.actualvalue + "/count").then(function onSuccess(response) {
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

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
    }

    $scope.getCurrentDrafts = function() {

        $http.post(BASEURL + "/rest/v2/draft/UserProfile/readall", {
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

            /*$scope.alerts = [{
            	type : 'Error',
            	msg : data.responseMessage	
            }];*/
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

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

    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {

        var GetPrimaryKeys = angular.copy($rootScope.primarykey);

        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }

        crudRequest("POST", "/rest/v2/users/reactivate", reactivateObj).then(function(response) {
            $scope.alerts = [{
                type: 'success',
                msg: response.data.data.responseMessage //Set the message to the popup window
            }];
            $scope.UserData = {
                start: 0,
                count: len
            };

            restServer = RESTCALL.CreateNewUser + '/readall';
            bankData.crudRequest("POST", restServer, $scope.UserData).then(applyRestData, errorFunc);
        });
    }

    $scope.MaskMailId = function(data_email) {
        return emailMasking(data_email);
    }

    $scope.changeDownloadOption = function (val) {
        $scope.downloadOptions = val;
    }
	
    $scope.enableDownloadBtns = function(format){
        if($scope.downloadOptions == 'All'){
            return configData.exportAsExcel.allFilter.indexOf(format) != -1 ? true : false;
        } else{
            return configData.exportAsExcel.currentFilter.indexOf(format) != -1 ? true : false;
        }
    }
});
