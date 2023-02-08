angular.module('VolpayApp').controller('alltransactionCtrl', function($scope, $http, $location, $translate, $rootScope, RefServicetransaction, GlobalService, AllPaymentsGlobalData, PersonService, $state, $filter, $stateParams, bankData, LogoutService, $timeout, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = "";
    $scope.exportAllTransactions = false;
    $scope.newPermission = GetPermissions("All Transactions");
    var authenticationObject = $rootScope.dynamicAuthObj;
  
    var globRepeat = [];
    $scope.crossTableflag = true;
    $scope.aDropVal = [];
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks();

    $scope.$on('langChangeEvent', function () {  
        $scope.sectionloadiing($scope.Section);
        $scope.Export();
    });

    //sidebarMenuControl('PaymentModule', 'AllPayments');

    /*$scope.crossTable = {
        fields:[{
            "val1":{
                'label':'Column Name',
                'field':'columnName',
                'type':'text',
                'value':''
            },
            "val2":{
                'label':'Column Value',
                'field':'columnValue',
                'type':'text',
                'value':''
            }
        }]
    };*/

    $scope.statusREST = {
        "Queryfield": [{
            "ColumnName": "WorkFlowCode",
            "ColumnOperation": "=",
            "ColumnValue": 'PAYMENT'
        }],
        start: 0,
        count: 100
    }

    $scope.statusREST = constructQuery($scope.statusREST)
    $scope.dColor = [];
    // $http.post(BASEURL + RESTCALL.StatusDefnColors,$scope.statusREST).then(function onSuccess(response) {
    // Handle success
    // var data = response.data;
    // var status = response.status;
    // var statusText = response.statusText;
    // var headers = response.headers;
    // var config = response.config;

    // $scope.dColor = data;
    // }).catch(function onError(response) {
    // 	// Handle error
    // 	var data = response.data;
    // 	var status = response.status;
    // 	var statusText = response.statusText;
    // 	var headers = response.headers;
    // 	var config = response.config;

    // });

    $scope.getClr = function(val) {

        $scope.clrObj = {};
        for (var i in $scope.dColor) {

            if (val == $scope.dColor[i].ProcessStatus) {
                if ($scope.dColor[i].ColourB) {
                    $scope.clrObj.ColourB = $scope.dColor[i].ColourB;
                    $scope.clrObj.Grandient = true;
                } else {
                    $scope.clrObj.Grandient = false;
                }
                $scope.clrObj.ColourA = $scope.dColor[i].ColourA;
                $scope.clrObj.Opacity = $scope.dColor[i].Opacity / 100;
                return $scope.clrObj;
            }

        }
    }
  
    $scope.CRUD = ($stateParams.input.responseMessage) ? ($stateParams.input.responseMessage) : ""; /* Response Message stored here */

    if ($rootScope.bulkOverride) {
        $scope.alerts = [{
            type: 'success',
            msg: $rootScope.bulkOverride
        }]

        setTimeout(function() {
            $rootScope.bulkOverride = '';
            $('.alert-success').hide();
        }, 4000)
    }

    $scope.crossTable = {
        fields: [{}]
    };
    $scope.addCrossTable = false;

    $scope.sectionloadiing=function(data) {
        $scope.Export();
        $rootScope.payamentseleceddata=data
        var dataobject={'Screen':data}
        var urlAdvancesearch=BASEURL + '/rest/v2/ach/payments/advancedsearch'
        var urlheaders=BASEURL + '/rest/v2/ach/payments/headers'
        
        $http.post(urlAdvancesearch,dataobject).then(function onSuccess(response) {
            // Handle success
            
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            
            // $scope.FieldsValues=data
            $scope.initializeSetting = function() {
                
                $scope.FieldsValues=data
                $scope.filterConfigurable = $scope.FieldsValues.some((el) => !el.mandatory)
                $scope.forplaceholder2()
                if($scope.search['InstructionData']['DebitFxRate']){
                    if($scope.search['InstructionData']['DebitFxRate']['Start']==""&&$scope.search['InstructionData']['DebitFxRate']['End']==""){
                        $scope.search['InstructionData']['DebitFxRate']['Start']= moment(new Date()).format('YYYY-MM-DD');
                        $scope.search['InstructionData']['DebitFxRate']['End']= moment(new Date()).format('YYYY-MM-DD');
                    }
                    
                }
                $scope.originatingpartys(dataobject.Screen)
                $scope.receivingpartys(dataobject.Screen)
                
            }
            $scope.initializeSetting()
            
            
            // $scope.initialCall($scope.advancedSearchEnable)

        }).catch(function onError(response) {
            // Handle error

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
    
        });

        $http.post(urlheaders,dataobject).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            
            $scope.sortMenu =data
            $scope.dColor = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
        $scope.rstAdvancedSearchFlag()
        $scope.PaymentAdvancedSearch=true;

        if(data!='' &&  GlobalService.fromPage=='transactions'){          
            if($scope.advancedSearchEnable){
                $scope.PaymentAdvancedSearch=false;
            }
            GlobalService.fromPage="other";
        } else {

            if(GlobalService.fromPage=="other"){

                $('select[name=selectBusqueda]').empty().val(null).trigger("change");
                $scope.Section=undefined;

                $('#PaymentAdvancedSearch').collapse('hide');

                sessionStorage.AllPaymentsCurrentObject=JSON.stringify({
                    "start": 0,
                    "count": 20,
                    "QueryOrder": [
                        {
                            "ColumnName": "ReceivedDate",
                            "ColumnOrder": "Desc"
                        },
                        {
                            "ColumnName": "PaymentID",
                            "ColumnOrder": "Desc"
                        }
                    ],
                    "Queryfield": []
                });
                $scope.clearSearch();
                GlobalService.fromPage="reset";
                $scope.resetFilter();
            }
            
        }
        $scope.advanceSearchCollaspe();
        // $scope.search["ReceivingEntity"]=["TODOS"]
        $scope.Required = false
        $scope.Requireddropdown=false
        $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
        $scope.clearSearch()
    }

    // $scope.sortMenu = [{
    //         "label": "AllPayments.Payment ID",
    //         "FieldName": "PaymentID",
    //         "Icon": "fa fa-building",
    //         "listViewflag": false,
    //         "visible": true
    //     }, {
    //         "label": "ReceivedInstructions.OriginalPaymentReference",
    //         "FieldName": "OriginalPaymentReference",
    //         "Icon": "fa fa-envelope",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Instruction ID",
    //         "FieldName": "InstructionID",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": false,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Original Payment Function",
    //         "FieldName": "OriginalPaymentFunction",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "ReceivedInstructions.File",
    //         "FieldName": "LegalEntityIdentifier",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": true,
    //         "visible": true
    //     },{
    //         "label": "AllPayments.Tx destination identification",
    //         "FieldName": "ClearingSchemeID",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": true,
    //         "visible": true
    //     },{
    //         "label": "AllPayments.Tx Destination Account",
    //         "FieldName": "EmailID",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": true,
    //         "visible": true
    //     },{
    //         "label": "ReceivedInstructions.Entity",
    //         "FieldName": "SchemeCode",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.TX code",
    //         "FieldName": "PaymentType",
    //         "Icon": "fa fa-slack",
    //         "listViewflag": true,
    //         "visible": true
    //     },{
    //         "label": "AllPayments.PSA Code",
    //         "FieldName": "PartyServiceAssociationCode",
    //         "Icon": "fa fa-code-fork",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.MOP",
    //         "FieldName": "MethodOfPayment",
    //         "Icon": "fa fa-cogs",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Payment Currency",
    //         "FieldName": "Currency",
    //         "Icon": "fa fa-building",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Amount",
    //         "FieldName": "Amount",
    //         "Icon": "fa fa-money",
    //         "listViewflag": false,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Received Date",
    //         "FieldName": "ReceivedDate",
    //         "Icon": "fa fa-calendar",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Value Date",
    //         "FieldName": "ValueDate",
    //         "Icon": "fa fa-calendar-o",
    //         "listViewflag": true,
    //         "visible": true
    //     }, {
    //         "label": "AllPayments.Payment Status",
    //         "FieldName": "Status",
    //         "Icon": "fa fa-check-circle",
    //         "listViewflag": false,
    //         "visible": false
    //     },
    //     {
    //         "label": "AllPayments.Original Message SubFunction",
    //         "FieldName": "OrigMsgSubFunction",
    //         "Icon": "fa fa-check-circle",
    //         "listViewflag": true,
    //         "visible": true
    //     }
    // ]

    clearInterval(menuInterval)

    $('li.dropdown.mega-dropdown a').on('click', function(event) {
        $(this).parent().toggleClass("open");

    });

    $('body').on('click', function(e) {

        if (!$('li.dropdown.mega-dropdown').is(e.target) && $('li.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {

            $('li.dropdown.mega-dropdown').removeClass('open');
        }
    });

    $scope.limit = 500;
    $scope.psaCodeDrop = [];
    $scope.setInitval = function() {

        var query = {
            "sorts": [],
            "start": 0,
            "count": $scope.limit
        }

        $http({
            method: "POST",
            url: BASEURL + RESTCALL.PartyServiceAssociationDropdown,
            data: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (var i in data) {
                $scope.psaCodeDrop.push(data[i].PartyServiceAssociationCode);
            }
            $scope.dynamicArr = ["PartyServiceAssociationCode"]
            for (var i in $scope.dynamicArr) {
                $("select[name=" + $scope.dynamicArr[i] + "]").select2({
                    placeholder: "Select an option"
                })
            }
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

    // $scope.changeViewFlag = GlobalService.viewFlag;
    $scope.changeViewFlag = false;
    $scope.dataLength = 10;

    /*var interval = "";
    clearInterval(interval)
    interval = setInterval(function(){
    if(!$('#PaymentModule').hasClass('open')){sidebarMenuControl('PaymentModule','AllPayments')
    }
    else{
    if(!$('#AllPayments').hasClass('sideMenuSelected')){
    sidebarMenuControl('PaymentModule','AllPayments')

    }
    else{

    clearInterval(interval)
    }
    }
    },100)*/

    sessionStorage.menuSelection = JSON.stringify({
        'val': 'PaymentModule',
        'subVal': 'AllPayments'
    })
    checkMenuOpen()

    $scope.fromDashboard = AllPaymentsGlobalData.fromDashboard;

    if ($state.params.input && 'responseMessage' in $state.params.input && $state.params.input.responseMessage) {
        $scope.alerts = $state.params.input.responseMessage;

        $timeout(function() {
            $('.alert-success').hide()
        }, 4000)
    }
    
    if ($scope.CRUD != "") {
        $scope.alerts = [{
            type: 'success',
            msg: $scope.CRUD //Set the message to the popup window
        }];
        $scope.CRUD = ""
        $timeout(callAtTimeout, 4000);
    }

    function callAtTimeout() {
        $('#statusBox').hide();
    }

    $scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked;
    $scope.prevLen = -1;
    $scope.loadCnt = 0;
    delete sessionStorage.AllPaymentsCurrentRESTCALL;

    $scope.search = {
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
    $scope.AdsearchParams = angular.copy($scope.search)

    if (GlobalService.ApproveInitiated) {

        if (GlobalService.PaymentApproved) {

            $scope.alerts = [{
                type: 'success',
                msg: "Payment Id " + GlobalService.repairURI + ", Approved successfully."
            }];
        } else {

            $scope.alerts = [{
                type: 'danger',
                msg: "Payment Id " + GlobalService.repairURI + ", not Approved. It will remains in repair status"
            }];
        }

        GlobalService.ApproveInitiated = false;
    }

    $scope.lskey = ["New Search"];
    $scope.uData = '';
    $scope.testing = function() {
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
                for (var i in $scope.uData.savedSearch.AllPayments) {
                    $scope.lskey.push($scope.uData.savedSearch.AllPayments[i].name)
                }
            } else {
                userData.savedSearch.AllPayments = [];
                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function(response) {})
            }
            // if ($scope.uData.genSetting.languageSelected) {
            //     $translate.use($scope.uData.genSetting.languageSelected);
            // } else {
            //     $translate.use("en_US");
            // }
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

        /* var kk=1;
        for (var key in localStorage){

        if(key.indexOf('AS_'+sessionStorage.UserID+"_") >= 0){
        $scope.lskey[kk]=key.substr(3+sessionStorage.UserID.length+1);
        kk++;
        }
        }
        return $scope.lskey; */
    }
    $scope.testing();

    $scope.all = AllPaymentsGlobalData.all;
    $scope.today = AllPaymentsGlobalData.today;
    $scope.week = AllPaymentsGlobalData.week;
    $scope.month = AllPaymentsGlobalData.month;
    $scope.custom = AllPaymentsGlobalData.custom;    
    $scope.UIR = false;
    $scope.customDateFilled = false;
    $scope.alertMsg = false;
    $scope.nothingSelected = true;
    $scope.dropdownSelected = false;

    $scope.noPaymentSelected = true;
    $scope.sourceChannelArr = [];
    $scope.mopArr = [];
    $scope.PaymentStatusArr = [];
    $scope.CurrencyArr = [];

    $scope.items = [];
    $scope.isAdvacedSearchClicked = false;

    $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
    $scope.isEntered = AllPaymentsGlobalData.isEntered;

    $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;

    //$scope.finalREST = AllPaymentsGlobalData.finalREST;
    $scope.paylistsearch = AllPaymentsGlobalData.FLuir;
    $scope.startDate = AllPaymentsGlobalData.startDate;
    $scope.endDate = AllPaymentsGlobalData.endDate;

    /* if(localStorage.languageSelected == 'es_ES'){
    if(AllPaymentsGlobalData.selectCriteriaTxt == 'All'){AllPaymentsGlobalData.selectCriteriaTxt = 'Todas';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Today'){AllPaymentsGlobalData.selectCriteriaTxt = 'Hoy';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Week'){AllPaymentsGlobalData.selectCriteriaTxt = 'Semana';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Month'){AllPaymentsGlobalData.selectCriteriaTxt = 'Mes';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Custom'){AllPaymentsGlobalData.selectCriteriaTxt = 'Personalizado';}
    }
    else if(localStorage.languageSelected == 'en_US'){
    if(AllPaymentsGlobalData.selectCriteriaTxt == 'Todas'){AllPaymentsGlobalData.selectCriteriaTxt = 'All';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Hoy'){AllPaymentsGlobalData.selectCriteriaTxt = 'Today';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Semana'){AllPaymentsGlobalData.selectCriteriaTxt = 'Week';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Mes'){AllPaymentsGlobalData.selectCriteriaTxt = 'Month';}
    else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Personalizado'){AllPaymentsGlobalData.selectCriteriaTxt = 'Custom';}
    } */

    $scope.$watch("searchname", function(val) {
        $scope.searchNameDuplicated = false;
    })

    $('#dropdownBtnTxt').html(AllPaymentsGlobalData.selectCriteriaTxt)
    $('.menuClass').removeClass('listSelected')
    $('#menulist_' + AllPaymentsGlobalData.selectCriteriaID).addClass('listSelected');

    $scope.orderByField = AllPaymentsGlobalData.orderByField; // set the default sort type
    $scope.sortReverse = AllPaymentsGlobalData.sortReverse;
    $scope.sortType = AllPaymentsGlobalData.sortType;

    $scope.alertToggle = function() {
        if ($scope.items.length == 0) {
            $scope.alertMsg = true;
        } else {
            $scope.alertMsg = false;
        }
    }

    $scope.loadmoreEnableDisable = function(len) {
        if (len >= 20) {
            $scope.function123 = "loadMore()";
        } else {
            $scope.function123 = "";
        }
    }

    $scope.showErrorMessage = function(items) {

        $scope.alerts = [{
            type: 'danger',
            msg: items.data.error.message
        }];
        $scope.items = [];
        $scope.alertMsg = true;

        errorservice.ErrorMsgFunction(items, $scope, $http, items.data.error.code)
    }
    $scope.checArr = [];

    $scope.defaultCallValues = function(items) {      

        $scope.items = items;
        $scope.loadedData = items;
        AllPaymentsGlobalData.allPaymentDetails = items;
        $scope.alertMsg = false;
        $('.alert-danger').hide()

        $timeout(function() {
            for (var i in $scope.checArr) {
                $('[uir = ' + $scope.checArr[i] + ']').prop('checked', true)
            }
        }, 50)
    }

    $scope.forplaceholder = function() {
        $scope.dArr = ["Currency", "MethodOfPayment", "Status"]
        $timeout(function() {
            for (var i in $scope.dArr) {
                $("select[name='" + $scope.dArr[i] + "']").select2({
                    placeholder: "Select an option"
                });
            }
            $scope.remoteDataConfig1()
                // $scope.getAllCurrency()
        }, 0)

        if($scope.search['InstructionData']['DebitFxRate']){
            if($scope.search['InstructionData']['DebitFxRate']['Start']==""&&$scope.search['InstructionData']['DebitFxRate']['End']==""){
             $scope.search['InstructionData']['DebitFxRate']['Start']= moment(new Date()).format('YYYY-MM-DD');
             $scope.search['InstructionData']['DebitFxRate']['End']= moment(new Date()).format('YYYY-MM-DD');
            }
           
        }
    }

    $scope.forplaceholder2 = function() {
        
        $scope.dArr = ["Currency", "MethodOfPayment", "Status","SettlementReference","PaymentCategory","C_AccountType","TypeService","TXCode"]
        $timeout(function() {
            for (var i in $scope.dArr) {
                $("select[name='" + $scope.dArr[i] + "']").select2({
                    placeholder: $filter('translate')('Placeholder.Select')
                });
            }
            $("select[name='Cycle']").select2({
                placeholder: $filter('translate')('Placeholder.AllCycles')
            });
        }, 0)
    }

    $scope.txtValfn = function() {
        var txtVal = ''
        if ($scope.paylistsearch) {
            txtVal = $scope.paylistsearch
            $scope.UIR = true;
        } else {
            txtVal = ''
            $scope.UIR = false;
        }
        return txtVal;
    }

    $scope.aa = AllPaymentsGlobalData.DataLoadedCount;

    $scope.settingSelectValues = function() {

        for (i in AllPaymentsGlobalData.searchParams) {
            if (AllPaymentsGlobalData.searchParams[i] == 'InstructionData') {
                for (j in AllPaymentsGlobalData.searchParams[i]) {
                    $scope.AdsearchParams[i][j] = AllPaymentsGlobalData.searchParams[i][j];
                    $scope.search[i][j] = AllPaymentsGlobalData.searchParams[i][j];
                }
            } else {

                $scope.AdsearchParams[i] = AllPaymentsGlobalData.searchParams[i];
                $scope.search[i] = AllPaymentsGlobalData.searchParams[i];

                if (Array.isArray($scope.search[i])) {
                    //$("[name="+i+"]").select2().select2('val',$scope.search[i])

                    $("select[name='" + i + "']").select2({
                        data: $scope.search[i]
                    });
                }

            }

        }
    }

    // $scope.triggerSelect2 = function() {
    //     for (var i in $scope.FieldsValues) {
    //         if ($scope.FieldsValues[i].type == 'dropdown') {
    //             try{

    //                 $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
    //                 $scope.remoteDataConfig1()
    //             } catch(err) {
    //                 console.log($scope.FieldsValues[i].value + "  -  " + err)
    //             }
    //         }
    //     }
    //     $scope.settingSelectValues()
    // }

    $scope.dateFilter = {
        all: false,
        today: false,
        week: false,
        month: false,
        custom: false
    }
    //function initialCall(adSearch)

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
                "ColumnName": "SentDate",
                "ColumnOperation": "=",
                "ColumnValue": todayDate()
            }]
        } else if ($scope.dateFilter.week) {
            $scope.dateArr = [{
                "ColumnName": "SentDate",
                "ColumnOperation": ">=",
                "ColumnValue": week().lastDate
            }, {
                "ColumnName": "SentDate",
                "ColumnOperation": "<=",
                "ColumnValue": week().todayDate
            }]
        } else if ($scope.dateFilter.month) {
            $scope.dateArr = [{
                "ColumnName": "SentDate",
                "ColumnOperation": ">=",
                "ColumnValue": month().lastDate
            }, {
                "ColumnName": "SentDate",
                "ColumnOperation": "<=",
                "ColumnValue": month().todayDate
            }]

        } else if ($scope.dateFilter.custom) {
            $scope.customDate.startDate = CommonService.distInstruction.customDate.startDate;
            $scope.customDate.endDate = CommonService.distInstruction.customDate.endDate;

            $('#customDate').modal('hide')
            $scope.dateArr = [{
                "ColumnName": "SentDate",
                "ColumnOperation": ">=",
                "ColumnValue": $scope.customDate.startDate
            }, {
                "ColumnName": "SentDate",
                "ColumnOperation": "<=",
                "ColumnValue": $scope.customDate.endDate
            }]

        }

        return $scope.dateArr;

    }

    $scope.Qobj = {
        Queryfield: [],
        QueryOrder: [],
        start: 0,
        count: 20
    };

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

    $scope.initialCall = function(adSearch) {
        $scope.Export();
      
        if (!adSearch) {
            if ($scope.all) {
                $rootScope.payamentseleceddata =  "";
                $scope.nothingSelected = true;
                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "all",$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == 'Error') {
                        $scope.showErrorMessage(items)
                            /* if (items.data.error.code == 401) {
                                errorservice.ErrorMsgFunction(items, $scope, $http)
                            } else {
                                $scope.alerts = [{
                                    type: 'danger',
                                    msg: items.data.error.message
                                }];
                                $scope.alertMsg = true;

                            } */

                    } else {                        
                        $scope.items = items.data;
                        $scope.loadedData = items.data;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.alertMsg = false;
                        AllPaymentsGlobalData.allPaymentDetails = items.data;

                        $scope.wildcard = false;

                        getForceAction($scope.items[0])

                    }

                });

            } else if ($scope.today) {

                $scope.nothingSelected = false;
                AllPaymentsGlobalData.todayDate = todayDate();
                $scope.todayDate = AllPaymentsGlobalData.todayDate;

                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Today',$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {

                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        getForceAction(items.data[0])

                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;

                    }
                });

            } else if ($scope.week) {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.weekStart = week().lastDate;
                AllPaymentsGlobalData.weekEnd = week().todayDate;
                $scope.weekStart = AllPaymentsGlobalData.weekStart;
                $scope.weekEnd = AllPaymentsGlobalData.weekEnd;

                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Week',$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                        getForceAction(items.data[0])
                    }

                });

            } else if ($scope.month) {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.monthStart = month().lastDate;
                AllPaymentsGlobalData.monthEnd = month().todayDate;

                $scope.monthStart = AllPaymentsGlobalData.monthStart;
                $scope.monthEnd = AllPaymentsGlobalData.monthEnd;

                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Month',$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                        getForceAction(items.data[0])
                    }

                });

            } else if ($scope.custom) {
                $scope.startDate = AllPaymentsGlobalData.startDate;
                $scope.endDate = AllPaymentsGlobalData.endDate;

                $scope.ShowStartDate = AllPaymentsGlobalData.startDate;
                $scope.ShowEndDate = AllPaymentsGlobalData.endDate;

                $scope.nothingSelected = false;
                RefServicetransaction.getFeedNewAllCustomSorting($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa,$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                        getForceAction(items.data[0])
                    }

                });
            }

        } else {

            if (typeof sessionStorage.SelectedCombo != 'undefined'){
                // if(sessionStorage.SelectedCombo===""){
                    $scope.Section=sessionStorage.SelectedCombo;
                    $scope.sectionloadiing($scope.Section);
                }

            $scope.search = {
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

            $scope.AdsearchParams = angular.copy($scope.search)

            AllPaymentsGlobalData.searchParams = cleantheinputdata(AllPaymentsGlobalData.searchParams);
            for (i in AllPaymentsGlobalData.searchParams) {
                if (AllPaymentsGlobalData.searchParams[i] == 'InstructionData') {
                    for (j in AllPaymentsGlobalData.searchParams[i]) {
                        $scope.AdsearchParams[i][j] = AllPaymentsGlobalData.searchParams[i][j];
                        $scope.search[i][j] = AllPaymentsGlobalData.searchParams[i][j];
                    }
                } else {
                    $scope.AdsearchParams[i] = AllPaymentsGlobalData.searchParams[i];
                    $scope.search[i] = AllPaymentsGlobalData.searchParams[i];
                }

            }

            if (AllPaymentsGlobalData.fromMyProfilePage) {
                var FieldArr = AllPaymentsGlobalData.FieldArr;
            } else if (AllPaymentsGlobalData.fromDashboard) {
                var FieldArr = AllPaymentsGlobalData.FromDashboardFieldArr;
            } else {
                AllPaymentsGlobalData.fromMyProfilePage = false;
                var FieldArr = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
            }

            $scope.AdsearchParams = removeEmptyValueKeys($scope.AdsearchParams)

            //$scope.triggerSelect2()
            $scope.setInitval()

            //	$scope.settingSelectValues()
            if ($scope.all) {

                $scope.nothingSelected = true;

                RefServicetransaction.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "All",$rootScope.payamentseleceddata).then(function(items) {

                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        getForceAction(items.data[0])
                    }
                });
            } else if ($scope.today) {
                AllPaymentsGlobalData.todayDate = todayDate();
                $scope.todayDate = AllPaymentsGlobalData.todayDate;
                $scope.nothingSelected = false;

                RefServicetransaction.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "Today").then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        getForceAction(items.data[0])
                    }
                });

            } else if ($scope.week) {
                AllPaymentsGlobalData.weekStart = week().lastDate;
                AllPaymentsGlobalData.weekEnd = week().todayDate;
                $scope.weekStart = AllPaymentsGlobalData.weekStart;
                $scope.weekEnd = AllPaymentsGlobalData.weekEnd;
                $scope.nothingSelected = false;

                RefServicetransaction.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "Week",$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        getForceAction(items.data[0])
                    }
                });

            } else if ($scope.month) {
                AllPaymentsGlobalData.monthStart = month().lastDate;
                AllPaymentsGlobalData.monthEnd = month().todayDate;
                $scope.monthStart = AllPaymentsGlobalData.monthStart;
                $scope.monthEnd = AllPaymentsGlobalData.monthEnd;
                $scope.nothingSelected = false;

                RefServicetransaction.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "Month",$rootScope.payamentseleceddata).then(function(items) {
                    $scope.totalData = items.tCnt;
                    $scope.items = items;
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        getForceAction(items.data[0])
                    }
                });
            } else if ($scope.custom) {
                $scope.nothingSelected = false;
                $scope.startDate = AllPaymentsGlobalData.startDate;
                $scope.endDate = AllPaymentsGlobalData.endDate;

                $scope.ShowStartDate = AllPaymentsGlobalData.startDate;
                $scope.ShowEndDate = AllPaymentsGlobalData.endDate;

                RefServicetransaction.retainCustomSearchResults($scope.startDate, $scope.endDate, FieldArr, $scope.orderByField, $scope.sortType, $scope.aa,$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        getForceAction(items.data[0])
                    }
                })
            }
        }
        //$scope.Qobj = constructQuery($scope.Qobj)
        //$scope.readallFn($scope.Qobj)

    }
    var len = 50;
    $scope.initstartCnt = 0;
    if (AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked) {
        $scope.fromDashboard = true;
        $scope.advancedSearchEnable = true;
        $scope.dynamicDashStatus = '';
        if (AllPaymentsGlobalData.AtchdandBIdTableName == 'BANKINTERACTIONDATA') {
            $scope.dynamicDashStatus = 'Interface'
        } else if (AllPaymentsGlobalData.AtchdandBIdTableName == 'ATTACHEDMESSAGE') {
            $scope.dynamicDashStatus = 'Attached Message'
        }
        $scope.AdsearchParams = {
            'Status': AllPaymentsGlobalData.AtchdandBIdStatus
        }
        var NewDashboardObj = {
            'status': AllPaymentsGlobalData.AtchdandBIdStatus,
            'start': $scope.initstartCnt,
            'count': len
        };

        $scope.atFn = function() {
            $http.post(BASEURL + '/rest/v2/payments/paymentsummary/' + AllPaymentsGlobalData.AtchdandBIdTableName, NewDashboardObj).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.items = data;
                $scope.loadedData = data;
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
                }]
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }

        $http.post(BASEURL + RESTCALL.StatusDefnColors, $scope.statusREST).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.dColor = data;
            $scope.atFn()
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.atFn()
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
        // AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked = false;
    } else {
        $http.post(BASEURL + RESTCALL.StatusDefnColors, $scope.statusREST).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.dColor = data;
      
   
            $scope.initialCall($scope.advancedSearchEnable)
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.initialCall($scope.advancedSearchEnable)
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    if ($scope.paylistsearch != '') {
        $scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
        $scope.nothingSelected = false;
    } else {
        //$scope.nothingSelected = true;
        $scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
    }

    /** Sorting function **/
    var hh = 20;
    $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;

    $scope.Sorting = function(orderByField) {
        $scope.checArr = [];

        for (var i = 0; i < $('.checkBoxClass').length; i++) {
            if ($($('.checkBoxClass')[i]).prop('checked')) {
                $scope.checArr.push($($('.checkBoxClass')[i]).attr("uir"))
            }
        }

        $scope.aa = $scope.DataLoadedCount;
        $scope.prevLen = -1;
        AllPaymentsGlobalData.isSortingClicked = true;
        $scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked;

        AllPaymentsGlobalData.orderByField = orderByField;
        $scope.orderByField = AllPaymentsGlobalData.orderByField;
        AllPaymentsGlobalData.sortReverse = !AllPaymentsGlobalData.sortReverse;
        $scope.sortReverse = AllPaymentsGlobalData.sortReverse;

        if ($scope.sortReverse == false) {
            AllPaymentsGlobalData.sortType = 'Desc';
            $scope.sortType = AllPaymentsGlobalData.sortType;
        } else {
            AllPaymentsGlobalData.sortType = 'Asc';
            $scope.sortType = AllPaymentsGlobalData.sortType;
        }
        window.WildcardSearchData  = [{'module':'transactions', 'wildCardSearchFields':['OriginDescription']}]
        if (!$scope.advancedSearchEnable) {
            if ($scope.all) {
                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'all',$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                });

            } else if ($scope.today) {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.todayDate = todayDate();
                $scope.todayDate = AllPaymentsGlobalData.todayDate;
                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Today').then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }

                });
            } else if ($scope.week) {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.weekStart = week().lastDate;
                AllPaymentsGlobalData.weekEnd = week().todayDate;
                $scope.weekStart = AllPaymentsGlobalData.weekStart;
                $scope.weekEnd = AllPaymentsGlobalData.weekEnd;
                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Week',$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }
                });

            } else if ($scope.month) {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.monthStart = month().lastDate;
                AllPaymentsGlobalData.monthEnd = month().todayDate;

                $scope.monthStart = AllPaymentsGlobalData.monthStart;
                $scope.monthEnd = AllPaymentsGlobalData.monthEnd;
                RefServicetransaction.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Month',$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }
                });
            } else if ($scope.custom) {
                $scope.startDate = AllPaymentsGlobalData.startDate;
                $scope.endDate = AllPaymentsGlobalData.endDate;
                $scope.nothingSelected = false;

                RefServicetransaction.getFeedNewAllCustomSorting($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa,$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }

                });
            }
        } else {
            var FieldArr = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);

            if ($scope.all) {
                $scope.nothingSelected = true;
                RefServicetransaction.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr,$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            } else if ($scope.today) {
                AllPaymentsGlobalData.todayDate = todayDate();
                $scope.todayDate = AllPaymentsGlobalData.todayDate;
                $scope.nothingSelected = false;
                RefServicetransaction.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            } else if ($scope.week) {
                AllPaymentsGlobalData.weekStart = week().lastDate;
                AllPaymentsGlobalData.weekEnd = week().todayDate;
                $scope.weekStart = AllPaymentsGlobalData.weekStart;
                $scope.weekEnd = AllPaymentsGlobalData.weekEnd;
                $scope.nothingSelected = false;
                RefServicetransaction.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                    }
                })
            } else if ($scope.month) {
                AllPaymentsGlobalData.monthStart = month().lastDate;
                AllPaymentsGlobalData.monthEnd = month().todayDate;
                $scope.monthStart = AllPaymentsGlobalData.monthStart;
                $scope.monthEnd = AllPaymentsGlobalData.monthEnd;
                $scope.nothingSelected = false;
                RefServicetransaction.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            } else if ($scope.custom) {
                $scope.nothingSelected = false;
                $scope.startDate = AllPaymentsGlobalData.startDate;
                $scope.endDate = AllPaymentsGlobalData.endDate;
                RefServicetransaction.advancedSearchCustomSorting($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr,$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            }

        }
        window.WildcardSearchData  = undefined;
        /*for(var i in $scope.checArr){
        $('#check_'+$scope.checArr[i]).prop('checked',true)
        }*/

    }

    // $scope.loadMore = function() {

    //     if (!$scope.advancedSearchEnable) {

    //         if (!$scope.isSortingClicked) {

    //             if ($scope.all) {
    //                 RefServicetransaction.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "All",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.totalData = items.tCnt;
    //                         $scope.loadedData = items.data;                           
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.today) {

    //                 RefServicetransaction.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Today",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.loadedData = items.data;
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.week) {

    //                 RefServicetransaction.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Week",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.totalData = items.tCnt;
    //                         $scope.loadedData = items.data;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.month) {

    //                 RefServicetransaction.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Month",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.totalData = items.tCnt;
    //                         $scope.loadedData = items.data;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.custom) {
    //                 RefServicetransaction.customSearchLoadmore($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.totalData = items.tCnt;
    //                         $scope.loadedData = items.data;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             }
    //         } else {
    //             if ($scope.aa == 20) {
    //                 $scope.aa = $scope.aa + 20;
    //             }

    //             if ($scope.all) {
    //                 RefServicetransaction.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "All",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = items.data;
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });

    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.today) {
    //                 RefServicetransaction.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Today",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = items.data;
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }

    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.week) {
    //                 RefServicetransaction.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Week",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = items.data;
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.month) {
    //                 RefServicetransaction.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Month",$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = items.data;
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.custom) {
    //                 RefServicetransaction.sortingCustomSearchLoadmore($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = items.data;
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             }

    //         }
    //     } else {
    //         /**Advanced Search  Loadmore **/
    //         /** If sorting not clicked **/
    //         var FieldArr = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr)

    //         if (!$scope.isSortingClicked) {
    //             if ($scope.all) {
    //                 RefServicetransaction.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;                         
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.today) {
    //                 RefServicetransaction.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;

    //             } else if ($scope.week) {
    //                 RefServicetransaction.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.month) {
    //                 RefServicetransaction.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.custom) {
    //                 RefServicetransaction.advancedSearchCustomLoadmore($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         $scope.items = $scope.items.concat(items.data);
    //                         AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
    //                     }
    //                 });
    //                 $scope.aa = $scope.aa + 20;
    //             }
    //         } else {
    //             /** If Sorting Clicked **/
    //             if ($scope.aa == 20) {
    //                 $scope.aa = $scope.aa + 20;
    //             }

    //             if ($scope.all) {
    //                 RefServicetransaction.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.items = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });

    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.today) {
    //                 RefServicetransaction.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.items = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;

    //             } else if ($scope.week) {
    //                 RefServicetransaction.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.items = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.month) {
    //                 RefServicetransaction.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr.$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;                             
    //                         $scope.items = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             } else if ($scope.custom) {

    //                 RefServicetransaction.advancedCustomSortingLoadmore($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr,$rootScope.payamentseleceddata).then(function(items) {
    //                     if (items.response == 'Success') {
    //                         $scope.loadedData = items.data;
    //                         $scope.items = items.data;
    //                         $scope.totalData = items.tCnt;
    //                         $scope.transactionvalue=items.transactionvalue
    //                         $scope.transactionvolume=items.transactionvolume
    //                         AllPaymentsGlobalData.allPaymentDetails = items.data;
    //                         $scope.prevLen = items.data.length;
    //                     }
    //                 });
    //                 AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
    //                 $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
    //                 $scope.aa = $scope.aa + 20;
    //             }
    //         }

    //     }
    // }

    $scope.loadMoreDashboardData = function() {
        if (AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked) {
            $scope.initstartCnt = $scope.initstartCnt + 50;
            var NewDashboardObj = {
                'status': AllPaymentsGlobalData.AtchdandBIdStatus,
                'start': $scope.initstartCnt,
                'count': len
            };

            $http.post(BASEURL + '/rest/v2/payments/paymentsummary/' + AllPaymentsGlobalData.AtchdandBIdTableName, NewDashboardObj).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.items = $scope.items.concat(data);
                $scope.loadedData = $scope.items;
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
                }]
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                $timeout(function() {
                    //$('.alert').hide()
                }, 4000)
            });
        }
    }

    /**To control Load more data **/
    /*	if(!AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked)
{
	var debounceHandler = _.debounce($scope.loadMore, 700, true);
	}
	else
{

	var debounceHandler = _.debounce($scope.loadMoreDashboardData, 700, true);
	///$scope.aa = $scope.aa +20;
	}*/
    $scope.loadFlag = true;
    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {

                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    $scope.fileCnt = (AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked) ? 50 : 20;
                    if ($scope.loadFlag) {
                        if ($scope.loadedData.length >= $scope.fileCnt) {

                            $scope.loadFlag = false;

                            if (!AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked) {
                                var debounceHandler = _.debounce($scope.loadMore, 700, true);
                                debounceHandler()
                            } else {
                                var debounceHandler = _.debounce($scope.loadMoreDashboardData, 700, true);
                                debounceHandler()
                            }

                            $scope.loadCnt = 0;
                        }

                        setTimeout(function() {
                            $scope.loadFlag = true;
                        }, 500)
                    }
                }
            })
            setTimeout(function() {}, 1000)
        });



    $scope.loadData1 = function() {

        $(".listView").scrollTop(0);
        $scope.aa = 20;
        $scope.loadCnt = 0;
        AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked = false;

        //$scope.clearSearch();

        if (sessionStorage.AllPaymentsCurrentRESTCALL) {


            RefServicetransaction.refreshAll($scope.Section).then(function(items) {
                if (items.response == "Error") {
                    $scope.showErrorMessage(items)
                } else {
                 
                    $scope.loadedData = items.data;
                    $scope.totalData = items.tCnt;
                    $scope.defaultCallValues(items.data)
                }

            });

            $scope.orderByField = 'ReceivedDate';
            $scope.sortReverse = false;
        }

        if ($scope.paylistsearch != '') {
            $scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
            $scope.nothingSelected = false;
        } else {
            $scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
        }

        //$('.aPhead').find('span').removeAttr('class')


    };

    $scope.clickReferenceID = function(val,section) {

        if($scope.Section=="TransactionsACH" || $scope.Section=="AllTransactionsReceived"|| $scope.Section=="SOITransactions"|| $scope.Section=="SOITransactionsReceived"){
        
            GlobalService.fileListId = val.data.InstructionID;
            GlobalService.UniqueRefID = val.data.PaymentID;
            GlobalService.individualobject = val.data;
        
            //GlobalService.fromPage = "transactions";
            GlobalService.fromPage = val.fromPage;


            //$rootScope.fromBulk = false;

            /*$state.go('app.paymentdetail', {
            input: val
            })*/

            $scope.Obj = {
                'uor': val.data.OutputInstructionID,
                'nav': {
                    'UIR': val.data.InstructionID,
                    'PID': val.data.PaymentID
                },
                'from': 'transactions',
                'section':section
            }

            $state.go('app.paymentdetail', {
                input: $scope.Obj
                //input: $scope.Obj

            })
        
        }

    }

    $scope.advancedDefaultval = function(items) {
        
        $scope.items = items;
        if ($scope.items.length) {

            //$scope.InstructionType = $scope.items[0].InstructionType;
        }
        $scope.loadedCnt = $scope.items.length;
        $scope.loadedData = items;
        $scope.alertMsg = false;
        $scope.alertToggle();
        $('.alert-danger').hide()
    }

    $scope.advancedDefaultval = function(items) {       
        $scope.items = items;
        if ($scope.items.length) {

            //$scope.InstructionType = $scope.items[0].InstructionType;
        }
        $scope.loadedCnt = $scope.items.length;
        $scope.loadedData = items;
        $scope.alertMsg = false;
        $scope.alertToggle();
        $('.alert-danger').hide()
    }



    $scope.PaymentListSearch = function() {
        $scope.aa = 20;
        var a = $('#searchBox').val();
        if (a.length != 0) {
            AllPaymentsGlobalData.FLuir = a;

            $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
            AllPaymentsGlobalData.searchClicked = true;
            $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
            $scope.paylistsearchValue = $scope.paylistsearch;

            $scope.nothingSelected = false;

            $scope.Qobj = {};
            $scope.Qobj.start = 0;
            $scope.Qobj.count = 20;
            $scope.Qobj.Queryfield = [];
            $scope.Qobj.QueryOrder = [];


            $scope.timeObj = {
                all: $scope.all,
                today: $scope.today,
                week: $scope.week,
                month: $scope.month,
                custom: $scope.custom
            }
            $scope.dateArr = $scope.retExpResult($scope.timeObj)
            $scope.esearch = $scope.txtValfn();
            $scope.Qobj.Queryfield.push({
                "ColumnName": "InstructionID",
                "ColumnOperation": "like",
                "ColumnValue": $scope.esearch,
                'advancedSearch': false
            },{
                "ColumnName": "PaymentID",
                "ColumnOperation": "like",
                "ColumnValue": $scope.esearch,
                'advancedSearch': false
            });
            
            for (var i in $scope.dateArr) {
                $scope.Qobj.Queryfield.push({
                    "ColumnName": $scope.dateArr[i].ColumnName,
                    "ColumnOperation": $scope.dateArr[i].ColumnOperation,
                    "ColumnValue": $scope.dateArr[i].ColumnValue,
                    'advancedSearch': false
                });
            }

            $scope.Qobj.QueryOrder.push({
                "ColumnName": $scope.orderByField,
                "ColumnOrder": $scope.sortType
            });
           

            RefServicetransaction.paymentListSearch($scope.Qobj, 'OR').then(function(items) {
                if (items.response == 'Error') {
                    $scope.showErrorMessage(items)
                } else {
                    $scope.totalData = items.tCnt;
                    $scope.advancedDefaultval(items.data)
                }
            })


            $scope.search = {
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
            $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable = false;
            $scope.anythingSelected = false;
            $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
            $scope.isAdvacedSearchClicked = false;
        } else {
            $scope.nothingSelected = true;
        }

    }

    $scope.checkinfo = function(eve) {

        var a = $('#searchBox').val();

        if ((a.length == 0) && (!$scope.advancedSearchEnable)) {

            AllPaymentsGlobalData.fromMyProfilePage = false;
            $scope.UIR = false;
            delete sessionStorage.AllPaymentsCurrentRESTCALL;

            AllPaymentsGlobalData.startDate = '';
            AllPaymentsGlobalData.endDate = '';

            AllPaymentsGlobalData.ShowStartDate = '';
            AllPaymentsGlobalData.ShowEndDate = '';

            AllPaymentsGlobalData.FLuir = '';
            AllPaymentsGlobalData.searchClicked = false;
            AllPaymentsGlobalData.isEntered = false;
            AllPaymentsGlobalData.advancedSearchEnable = false;

            AllPaymentsGlobalData.searchNameDuplicated = false;
            AllPaymentsGlobalData.SelectSearchVisible = false;
            AllPaymentsGlobalData.searchname = '';

            AllPaymentsGlobalData.searchParams = {
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
            $scope.search = AllPaymentsGlobalData.searchParams;

            if ($scope.searchClicked || $scope.isEntered) {
                if ($scope.all) {
                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All",$rootScope.payamentseleceddata).then(function(items) {
                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                            $scope.nothingSelected = false;
                        } else {                    
                            $scope.totalData = items.tCnt;
                            $scope.items = items.data;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume
                            AllPaymentsGlobalData.allPaymentDetails = items.data;
                            $scope.loadedData = $scope.items;

                            if ($scope.items.length == 0) {
                                $scope.alertMsg = true;
                                $scope.nothingSelected = false;
                            } else {

                                $scope.alertMsg = false;
                                $scope.nothingSelected = true;
                                AllPaymentsGlobalData.searchClicked = false;
                                $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
                                AllPaymentsGlobalData.isEntered = false;
                                $scope.isEntered = AllPaymentsGlobalData.isEntered;

                                $scope.alerts = [{
                                    type: '',
                                    msg: ''
                                }];

                                $scope.UIR = false;
                            }
                        }
                    });

                } else if ($scope.today) {
                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today",$rootScope.payamentseleceddata).then(function(items) {

                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                        } else {         
                            $scope.totalData = items.tCnt;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume                   
                            $scope.items = items.data;
                            AllPaymentsGlobalData.allPaymentDetails = items.data;
                            $scope.loadedData = $scope.items;
                            if ($scope.items.length == 0) {
                                $scope.alertMsg = true;

                            } else {

                                AllPaymentsGlobalData.searchClicked = false;
                                $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
                                AllPaymentsGlobalData.isEntered = false;
                                $scope.isEntered = AllPaymentsGlobalData.isEntered;
                                $scope.alertMsg = false;
                                $scope.dropdownSelected = true;
                                $scope.alerts = [{
                                    type: '',
                                    msg: ''
                                }];
                            }
                        }

                    });
                } else if ($scope.week) {
                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week",$rootScope.payamentseleceddata).then(function(items) {

                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                        } else {                           
                            $scope.totalData = items.tCnt;
                            $scope.items = items.data;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume
                            AllPaymentsGlobalData.allPaymentDetails = items.data;
                            $scope.loadedData = $scope.items;
                            if ($scope.items.length == 0) {
                                $scope.alertMsg = true;

                            } else {

                                AllPaymentsGlobalData.searchClicked = false;
                                $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
                                AllPaymentsGlobalData.isEntered = false;
                                $scope.isEntered = AllPaymentsGlobalData.isEntered;
                                $scope.alertMsg = false;
                                $scope.dropdownSelected = true;
                                $scope.alerts = [{
                                    type: '',
                                    msg: ''
                                }];
                            }
                        }
                    });
                } else if ($scope.month) {

                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month",$rootScope.payamentseleceddata).then(function(items) {
                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                        } else {                            
                            $scope.items = items.data;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume
                            AllPaymentsGlobalData.allPaymentDetails = items.data;
                            $scope.loadedData = $scope.items;
                            if ($scope.items.length == 0) {
                                $scope.alertMsg = true;

                            } else {
                                AllPaymentsGlobalData.searchClicked = false;
                                $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
                                AllPaymentsGlobalData.isEntered = false;
                                $scope.isEntered = AllPaymentsGlobalData.isEntered;
                                $scope.alertMsg = false;
                                $scope.dropdownSelected = true;
                                $scope.alerts = [{
                                    type: '',
                                    msg: ''
                                }];
                            }
                        }
                    });
                } else if ($scope.custom) {
                    RefServicetransaction.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType,$rootScope.payamentseleceddata).then(function(items) {
                        $scope.totalData = items.tCnt;
                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                        } else {                            
                            $scope.items = items.data;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume
                            AllPaymentsGlobalData.allPaymentDetails = items.data;
                            $scope.loadedData = $scope.items;
                            if ($scope.items.length == 0) {
                                $scope.alertMsg = true;

                            } else {
                                AllPaymentsGlobalData.searchClicked = false;
                                $scope.searchClicked = AllPaymentsGlobalData.searchClicked;
                                AllPaymentsGlobalData.isEntered = false;
                                $scope.isEntered = AllPaymentsGlobalData.isEntered;
                                $scope.alertMsg = false;
                                $scope.dropdownSelected = true;
                                $scope.alerts = [{
                                    type: '',
                                    msg: ''
                                }];
                            }
                        }

                    });
                }

            }
        }

        if (eve.keyCode == 13) {

            $scope.aa = 20;
            $scope.paylistsearchValue = $('#searchBox').val()

            var a = $('#searchBox').val()

            if (a.length != '') {

                AllPaymentsGlobalData.fromMyProfilePage = false;

                AllPaymentsGlobalData.FLuir = a;
                $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
                AllPaymentsGlobalData.isEntered = true;
                $scope.isEntered = AllPaymentsGlobalData.isEntered;


                $scope.Qobj = {};
                $scope.Qobj.start = 0;
                $scope.Qobj.count = 20;
                $scope.Qobj.Queryfield = [];
                $scope.Qobj.QueryOrder = [];

                $scope.timeObj = {
                    all: $scope.all,
                    today: $scope.today,
                    week: $scope.week,
                    month: $scope.month,
                    custom: $scope.custom
                }

                $scope.dateArr = $scope.retExpResult($scope.timeObj);
                $scope.esearch = $scope.txtValfn();

                $scope.Qobj.Queryfield.push({
                    "ColumnName": "InstructionID",
                    "ColumnOperation": "like",
                    "ColumnValue": $scope.esearch,
                    'advancedSearch': false
                }, {
                    "ColumnName": "PaymentID",
                    "ColumnOperation": "like",
                    "ColumnValue": $scope.esearch,
                    'advancedSearch': false
                })
                for (var i in $scope.dateArr) {
                    $scope.Qobj.Queryfield.push({
                        "ColumnName": $scope.dateArr[i].ColumnName,
                        "ColumnOperation": $scope.dateArr[i].ColumnOperation,
                        "ColumnValue": $scope.dateArr[i].ColumnValue,
                        'advancedSearch': false
                    });
                }

                $scope.Qobj.QueryOrder.push({
                    "ColumnName": $scope.orderByField,
                    "ColumnOrder": $scope.sortType
                });

                RefServicetransaction.paymentListSearch($scope.Qobj, 'OR').then(function(items) {
                    if (items.response == 'Error') {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume

                        $scope.advancedDefaultval(items.data)
                    }
                });


                /*if ($scope.all) {
                	RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {
                		if (items.response == "Error") {
                			$scope.showErrorMessage(items)
                		} else {
                			$scope.items = items.data;
                			$scope.loadedData = $scope.items;
                			AllPaymentsGlobalData.allPaymentDetails = items.data;

                			if ($scope.items.length == 0) {

                				$scope.alertMsg = true;
                				$scope.dropdownSelected = false;
                			} else {

                				$scope.alertMsg = false;
                				$scope.nothingSelected = false;
                				$scope.UIR = true;
                				$scope.dropdownSelected = true;
                				$scope.alerts = [{
                						type: '',
                						msg: ''
                					}
                				];
                			}

                		}
                	});
                } else if ($scope.today) {

                	RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {
                		if (items.response == "Error") {
                			$scope.showErrorMessage(items)
                		} else {
                			$scope.items = items.data;
                			AllPaymentsGlobalData.allPaymentDetails = items.data;
                			$scope.loadedData = $scope.items;

                			if ($scope.items.length == 0) {
                				$scope.alertMsg = true;
                				$scope.dropdownSelected = false;
                			} else {
                				$scope.alertMsg = false;
                				$scope.dropdownSelected = true;
                				$scope.alerts = [{
                						type: '',
                						msg: ''
                					}
                				];
                			}
                		}
                	});
                } else if ($scope.week) {

                	RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {
                		if (items.response == "Error") {
                			$scope.showErrorMessage(items)
                			$scope.dropdownSelected = false;
                		} else {
                			$scope.defaultCallValues(items.data)
                			$scope.dropdownSelected = true;
                			$scope.alerts = [{
                					type: '',
                					msg: ''
                				}
                			];
                		}
                	});

                } else if ($scope.month) {

                	RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {
                		if (items.response == "Error") {
                			$scope.showErrorMessage(items)
                			$scope.dropdownSelected = false;
                		} else {
                			$scope.defaultCallValues(items.data)
                			$scope.dropdownSelected = true;
                			$scope.alerts = [{
                					type: '',
                					msg: ''
                				}
                			];
                		}
                	});
                } else if ($scope.custom) {
                	RefServicetransaction.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
                		if (items.response == "Error") {
                			$scope.showErrorMessage(items)
                			$scope.dropdownSelected = false;
                		} else {
                			$scope.defaultCallValues(items.data)
                			$scope.dropdownSelected = true;
                			$scope.alerts = [{
                					type: '',
                					msg: ''
                				}
                			];
                		}

                	});
                } */

                $scope.nothingSelected = false;

            } else {
                $scope.nothingSelected = true;
            }

            $scope.PaymentAdvancedSearch = true;
            //$scope.UIRtxtVal = '';
            $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable = false;
            $scope.anythingSelected = false;
            $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
            $scope.isAdvacedSearchClicked = false;
            $scope.search = {
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
        }
    }

    $scope.prev = 'all';
    $scope.prevSelectedTxt = 'all'
    $scope.prevId = 1;
    $scope.prev = AllPaymentsGlobalData.prev;
    $scope.prevSelectedTxt = AllPaymentsGlobalData.prevSelectedTxt;
    $scope.prevId = AllPaymentsGlobalData.prevId;

    $('.customDropdown').find('ul').find('li:first-child').addClass('listSelected')
   $scope.setHeight=function(){
    $($('.radiobtns')[0]).prop('checked', true);
   }
    $scope.clearSearch = function() {
  
       // $(".headershide").find("thead").hide();

        $scope.addCrossTable = false;
        $scope.crossTableFilter = {};
        $scope.crossTable = {
            fields: [{}]
        };

        $(".listView").scrollTop(0);
        $('.alert-danger').hide();
        $scope.aa = 20;
        $scope.initstartCnt = 0;
        $scope.paylistsearchValue = '';
        $scope.paylistsearch = '';
        AllPaymentsGlobalData.FLuir = '';
        $scope.UIR = false;
        $scope.nothingSelected = true;
        $scope.alertMsg = false;
        AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked = false;

        for (i in AllPaymentsGlobalData.searchParams) {

            if (i == 'InstructionData') {
                for (j in AllPaymentsGlobalData.searchParams[i]) {
                    AllPaymentsGlobalData.searchParams[i][j].Start = "";
                    AllPaymentsGlobalData.searchParams[i][j].End = "";
                }
            } else {
                AllPaymentsGlobalData.searchParams[i] = '';
            }

        }

        $scope.AdsearchParams = AllPaymentsGlobalData.searchParams;
        $scope.search = {
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

        $scope.fromDashboard = AllPaymentsGlobalData.fromDashboard = false;
        $scope.myProfileFLindex = AllPaymentsGlobalData.myProfileFLindex = '';
        $scope.todayDate = AllPaymentsGlobalData.todayDate = '';
        $scope.weekStart = AllPaymentsGlobalData.weekStart = '';
        $scope.weekEnd = AllPaymentsGlobalData.weekEnd = '';
        $scope.monthStart = AllPaymentsGlobalData.monthStart = '';
        $scope.monthEnd = AllPaymentsGlobalData.monthEnd = '';

        $scope.orderByField = AllPaymentsGlobalData.orderByField = 'ReceivedDate';
        $scope.sortReverse = AllPaymentsGlobalData.sortReverse = false;
        $scope.sortType = AllPaymentsGlobalData.sortType = 'Desc';
        $scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked = false;
        $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount = 20;
        $scope.all = AllPaymentsGlobalData.all = true;
        $scope.today = AllPaymentsGlobalData.today = false;
        $scope.week = AllPaymentsGlobalData.week = false;
        $scope.month = AllPaymentsGlobalData.month = false;
        $scope.custom = AllPaymentsGlobalData.custom = false;
        $scope.FLuir = AllPaymentsGlobalData.FLuir = '';
        $scope.startDate = AllPaymentsGlobalData.startDate = '';
        $scope.endDate = AllPaymentsGlobalData.endDate = '';
        $scope.ShowStartDate = AllPaymentsGlobalData.ShowStartDate = '';
        $scope.ShowEndDate = AllPaymentsGlobalData.ShowEndDate = '';
        $scope.selectCriteriaTxt = AllPaymentsGlobalData.selectCriteriaTxt = 'All';
        $scope.selectCriteriaTxts = AllPaymentsGlobalData.selectCriteriaTxt = 'Todas';
        $scope.selectCriteriaID = AllPaymentsGlobalData.selectCriteriaID = 1;
        $scope.prev = AllPaymentsGlobalData.prev = 'all';
        $scope.prevSelectedTxt = AllPaymentsGlobalData.prevSelectedTxt = 'all';
        $scope.prevId = AllPaymentsGlobalData.prevId = 1;
        $scope.searchClicked = AllPaymentsGlobalData.searchClicked = false;
        $scope.isEntered = AllPaymentsGlobalData.isEntered = false;
        $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable = false;
        $scope.searchNameDuplicated = AllPaymentsGlobalData.searchNameDuplicated = false;
        $scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible = false;
        $scope.searchname = AllPaymentsGlobalData.searchname = '';
        $scope.crossTableflag = true;
        $timeout(function() {
            $('#colDiv').removeClass('collapsing').addClass('collapse')
        }, 1000)

        $('#dropdownBtnTxt').html(AllPaymentsGlobalData.selectCriteriaTxts)
        $('.menuClass').removeClass('listSelected')
        $('#menulist_' + AllPaymentsGlobalData.selectCriteriaID).addClass('listSelected');

        /*$timeout(function () {
        $scope.triggerSelect2();
        }, 10)*/

        $timeout(function() {
            for (var i in $scope.FieldsValues) {
                if ($scope.FieldsValues[i].type == 'dropdown') {
                    $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
                    $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2('val', '');
                }
            }

            $scope.remoteDataConfig1()

        }, 10)

        setTimeout(function() {
            $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
            $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
            $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')

        }, 200)
        
        $scope.items = []
        $scope.loadedData = []

        //$scope.initialCall($scope.advancedSearchEnable)
            // $state.reload();

    }

    $scope.FilterByDate = function(text, eve) {

        $scope.paylistsearchValue = $scope.paylistsearch;

        $scope.aa = 20;
        var _id;
        $scope.globalEsearch = PersonService.txtBoxVal = $scope.esearch;
        _id = $(eve.currentTarget).attr('id').split('_')[1]
        if ($scope.prevId != _id) {
            $scope.prevSelected = $scope.prevId;
            AllPaymentsGlobalData.prevId = $scope.prevId;
        }

        $scope.parent = $(eve.currentTarget).parent().parent().find('span:first-child');
        $scope.parentTxt = $scope.parent.text();
        $scope.child = $(eve.currentTarget).text()

        $('.menuClass').removeClass('listSelected');
        $('#menulist_' + _id).addClass('listSelected');

        $($scope.parent).html($scope.child)
        $scope.prev = $scope.child;

        if (($scope.prev == 'All') || ($scope.prev == 'Today') || ($scope.prev == 'Week') || ($scope.prev == 'Month')) {
            AllPaymentsGlobalData.selectCriteriaTxt = $scope.prev;
            AllPaymentsGlobalData.selectCriteriaID = _id;
        }
        AllPaymentsGlobalData.prev = $scope.prev;
        $scope.prevTxt = $(eve.currentTarget).text();
        $scope.prevId = _id;

        AllPaymentsGlobalData.all = $scope.all = (text == 'all') ? true : false;
        AllPaymentsGlobalData.today = $scope.today = (text == 'today') ? true : false;
        AllPaymentsGlobalData.week = $scope.week = (text == 'week') ? true : false;
        AllPaymentsGlobalData.month = $scope.month = (text == 'month') ? true : false;
        AllPaymentsGlobalData.custom = $scope.custom = false;

        $scope.dateFilter = {
            all: $scope.all,
            today: $scope.today,
            week: $scope.week,
            month: $scope.month,
            custom: $scope.custom
        }

        if (!$scope.advancedSearchEnable) {

            if (text == 'all') {

                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';

                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.all = true;
                AllPaymentsGlobalData.today = false;
                AllPaymentsGlobalData.week = false;
                AllPaymentsGlobalData.month = false;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                var xx = $('#searchBox').val()

                if (xx.length != 0) {

                    $scope.nothingSelected = false;
                    $scope.UIR = true;
                    AllPaymentsGlobalData.searchClicked = true;
                    $scope.searchClicked = AllPaymentsGlobalData.searchClicked;

                    AllPaymentsGlobalData.isEntered = true;
                    $scope.isEntered = AllPaymentsGlobalData.isEntered;
                } else {
                    $scope.nothingSelected = true;
                    AllPaymentsGlobalData.searchClicked = false;
                    $scope.searchClicked = AllPaymentsGlobalData.searchClicked;

                    AllPaymentsGlobalData.isEntered = false;
                    $scope.isEntered = AllPaymentsGlobalData.isEntered;
                }

                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.totalData = items.tCnt;
                    }
                });
            }

            if (text == 'today') {

                $scope.nothingSelected = false;

                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';

                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.todayDate = todayDate();
                $scope.todayDate = AllPaymentsGlobalData.todayDate;

                AllPaymentsGlobalData.all = false;
                AllPaymentsGlobalData.today = true;
                AllPaymentsGlobalData.week = false;
                AllPaymentsGlobalData.month = false;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.dropdownSelected = true;
                        $scope.totalData = items.tCnt;
                    }
                });
            }

            if (text == 'week') {

                $scope.nothingSelected = false;
                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';

                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.weekStart = week().lastDate;
                AllPaymentsGlobalData.weekEnd = week().todayDate;
                $scope.weekStart = AllPaymentsGlobalData.weekStart;
                $scope.weekEnd = AllPaymentsGlobalData.weekEnd;

                AllPaymentsGlobalData.all = false;
                AllPaymentsGlobalData.today = false;
                AllPaymentsGlobalData.week = true;
                AllPaymentsGlobalData.month = false;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week",$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.dropdownSelected = true;
                        $scope.totalData = items.tCnt;
                    }
                });

            }

            if (text == 'month') {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';
                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.monthStart = month().lastDate;
                AllPaymentsGlobalData.monthEnd = month().todayDate;
                $scope.monthStart = AllPaymentsGlobalData.monthStart;
                $scope.monthEnd = AllPaymentsGlobalData.monthEnd;

                AllPaymentsGlobalData.all = false;
                AllPaymentsGlobalData.today = false;
                AllPaymentsGlobalData.week = false;
                AllPaymentsGlobalData.month = true;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.dropdownSelected = true;
                        $scope.totalData = items.tCnt;

                    }
                });

            }

        } else {

            var FieldREST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);

            if (text == 'all') {
                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';
                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.all = true;
                AllPaymentsGlobalData.today = false;
                AllPaymentsGlobalData.week = false;
                AllPaymentsGlobalData.month = false;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                var xx = $('#searchBox').val()

                if (xx.length != 0) {
                    $scope.nothingSelected = false;
                    $scope.UIR = true;

                    AllPaymentsGlobalData.searchClicked = true;
                    $scope.searchClicked = AllPaymentsGlobalData.searchClicked;

                    AllPaymentsGlobalData.isEntered = true;
                    $scope.isEntered = AllPaymentsGlobalData.isEntered;
                } else {
                    $scope.nothingSelected = true;
                    AllPaymentsGlobalData.searchClicked = false;
                    $scope.searchClicked = AllPaymentsGlobalData.searchClicked;

                    AllPaymentsGlobalData.isEntered = false;
                    $scope.isEntered = AllPaymentsGlobalData.isEntered;

                }

                RefServicetransaction.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "All",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                    }
                })
            } else if (text == 'today') {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';
                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.todayDate = todayDate();
                $scope.todayDate = AllPaymentsGlobalData.todayDate;

                AllPaymentsGlobalData.all = false;
                AllPaymentsGlobalData.today = true;
                AllPaymentsGlobalData.week = false;
                AllPaymentsGlobalData.month = false;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                RefServicetransaction.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "Today",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                    }
                })
            } else if (text == 'week') {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';
                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.weekStart = week().lastDate;
                AllPaymentsGlobalData.weekEnd = week().todayDate;
                $scope.weekStart = AllPaymentsGlobalData.weekStart;
                $scope.weekEnd = AllPaymentsGlobalData.weekEnd;

                AllPaymentsGlobalData.all = false;
                AllPaymentsGlobalData.today = false;
                AllPaymentsGlobalData.week = true;
                AllPaymentsGlobalData.month = false;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                RefServicetransaction.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "Week",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                    }
                })
            } else if (text == 'month') {
                $scope.nothingSelected = false;
                AllPaymentsGlobalData.startDate = '';
                AllPaymentsGlobalData.endDate = '';
                $scope.startDate = AllPaymentsGlobalData.startDate
                $scope.endDate = AllPaymentsGlobalData.endDate;

                AllPaymentsGlobalData.monthStart = month().lastDate;
                AllPaymentsGlobalData.monthEnd = month().todayDate;
                $scope.monthStart = AllPaymentsGlobalData.monthStart;
                $scope.monthEnd = AllPaymentsGlobalData.monthEnd;

                AllPaymentsGlobalData.all = false;
                AllPaymentsGlobalData.today = false;
                AllPaymentsGlobalData.week = false;
                AllPaymentsGlobalData.month = true;
                AllPaymentsGlobalData.custom = false;

                $scope.all = AllPaymentsGlobalData.all;
                $scope.today = AllPaymentsGlobalData.today;
                $scope.week = AllPaymentsGlobalData.week;
                $scope.month = AllPaymentsGlobalData.month;
                $scope.custom = AllPaymentsGlobalData.custom;

                RefServicetransaction.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "Month",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                    }
                })
            }
        }

        if (($scope.startDate != '') && ($scope.endDate != '')) {
            $scope.customDateFilled = true;
        } else {
            $scope.customDateFilled = false;
        }

        if (($scope.startDate != '') || ($scope.endDate != '')) {
            $('#okBtn').removeAttr('disabled', 'disabled')
        } else {
            $('#okBtn').attr('disabled', 'disabled')
        }

        if ($('#searchBox').val() != '') {
            $scope.UIR = true;
        } else {
            $scope.UIR = false;
        }

        //$scope.customDateRangePicker()

    }
    $scope.FilterByDate1 = function() {

        $('#myModal').modal('hide')

        if (!$scope.advancedSearchEnable) {
            AllPaymentsGlobalData.all = false;
            AllPaymentsGlobalData.today = false;
            AllPaymentsGlobalData.week = false;
            AllPaymentsGlobalData.month = false;
            AllPaymentsGlobalData.custom = true;

            $scope.all = AllPaymentsGlobalData.all;
            $scope.today = AllPaymentsGlobalData.today;
            $scope.week = AllPaymentsGlobalData.week;
            $scope.month = AllPaymentsGlobalData.month;
            $scope.custom = AllPaymentsGlobalData.custom;

            AllPaymentsGlobalData.startDate = $scope.startDate;
            AllPaymentsGlobalData.endDate = $scope.endDate;

            AllPaymentsGlobalData.ShowStartDate = AllPaymentsGlobalData.startDate;
            AllPaymentsGlobalData.ShowEndDate = AllPaymentsGlobalData.endDate;
            $scope.ShowStartDate = AllPaymentsGlobalData.ShowStartDate;
            $scope.ShowEndDate = AllPaymentsGlobalData.ShowEndDate;

            AllPaymentsGlobalData.selectCriteriaID = 5;
            AllPaymentsGlobalData.prev = "Custom"
            AllPaymentsGlobalData.selectCriteriaTxt = "Custom"
            $scope.prev = AllPaymentsGlobalData.prev;

            RefServicetransaction.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType,$rootScope.payamentseleceddata).then(function(items) {

                if (items.response == "Error") {
                    $scope.showErrorMessage(items)
                    $scope.dropdownSelected = false;
                } else {
                    $scope.totalData = items.tCnt;
                    $scope.defaultCallValues(items.data)
                    $scope.dropdownSelected = true;
                }
            });
        } else {
            var FieldREST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);

            AllPaymentsGlobalData.all = false;
            AllPaymentsGlobalData.today = false;
            AllPaymentsGlobalData.week = false;
            AllPaymentsGlobalData.month = false;
            AllPaymentsGlobalData.custom = true;

            $scope.all = AllPaymentsGlobalData.all;
            $scope.today = AllPaymentsGlobalData.today;
            $scope.week = AllPaymentsGlobalData.week;
            $scope.month = AllPaymentsGlobalData.month;
            $scope.custom = AllPaymentsGlobalData.custom;

            AllPaymentsGlobalData.startDate = $scope.startDate;
            AllPaymentsGlobalData.endDate = $scope.endDate;

            AllPaymentsGlobalData.ShowStartDate = AllPaymentsGlobalData.startDate;
            AllPaymentsGlobalData.ShowEndDate = AllPaymentsGlobalData.endDate;

            $scope.ShowStartDate = $scope.startDate;
            $scope.ShowEndDate = $scope.endDate;

            AllPaymentsGlobalData.prev = "Custom";
            AllPaymentsGlobalData.selectCriteriaTxt = "Custom";
            $scope.prev = AllPaymentsGlobalData.prev;

            AllPaymentsGlobalData.selectCriteriaID = 5;

            RefServicetransaction.advancedCustomSearch(FieldREST, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType,$rootScope.payamentseleceddata).then(function(items) {

                if (items.response == "Error") {
                    $scope.showErrorMessage(items)
                    
                } else {
                    $scope.totalData = items.tCnt;
                    $scope.defaultCallValues(items.data)
                }
            })
        }

        if (($scope.startDate != '') && ($scope.endDate != '')) {
            $('#okBtn').removeAttr('disabled', 'disabled');
            $scope.customDateFilled = true;
            $scope.nothingSelected = false;
            $scope.custom = true;
        } else {
            $('#okBtn').attr('disabled', 'disabled');
            $scope.customDateFilled = false;
            $scope.nothingSelected = true;

        }
    }

    $scope.filterCancel = function() {

        $scope.startDate = AllPaymentsGlobalData.startDate;
        $scope.endDate = AllPaymentsGlobalData.endDate;

        if ($scope.startDate && $scope.endDate) {
            $($scope.parent).html("Custom")
            $('.menuClass').removeClass('listSelected')
            $('#menulist_5').addClass('listSelected')
        } else {
            $('.menuClass').removeClass('listSelected').addClass('listNotSelected')
            $('#menulist_' + AllPaymentsGlobalData.prevId).addClass('listSelected').removeClass('listNotSelected')

            $($scope.parent).html($('#menulist_' + AllPaymentsGlobalData.prevId).text())
        }

    }

    $scope.DateReset = function() {}
    $scope.removeFn = function() {

        if (($('#startDate').val() != '') || ($('#endDate').val() != '')) {
            $('#okBtn').removeAttr('disabled', 'disabled')
        } else {
            $('#okBtn').attr('disabled', 'disabled')
        }
    }

    $scope.dummy = function(eve) {
        if (eve.keyCode == 27) {
            $scope.filterCancel()
        }
    }

    $scope.modelhide = function(e) {
        if (e.currentTarget == e.target) {

            $scope.filterCancel()
        }

    }

    /***************Advanced Search functionlities***************/
    function setFlag(val) {
        if (val) {
            return true;
        } else {
            return false;
        }
    }
   

    $(document).ready(function() {
        for (var i in $scope.FieldsValues) {
            if ($scope.FieldsValues[i].type == 'dropdown') {
                $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
            }
        }

        $scope.remoteDataConfig1 = function() {

            $("select[name='PartyServiceAssociationCode']").select2({
                ajax: {
                    url: BASEURL + RESTCALL.PartyCodeDropdown,
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
                    method: "GET",
                    crossDomain: true,
                    data : function(params) {
                        query = {'start' : 0,'count': 500 };
                        if(params.term ) {
                            query.search = params.term;
                        } 
                        return query;
                    },
                    /* data: function(params) {

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
                    } ,*/
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
                placeholder: $filter('translate')('Placeholder.Select'),
                minimumInputLength: 0,
                allowClear: true

            })
            // $scope.forplaceholder2();
        }

        setTimeout(function() {
            $scope.remoteDataConfig1()
        }, 100)
    })

    /*$http.get(BASEURL + RESTCALL.PartyCodeDropdown).then(function onSuccess(response) {
    	// Handle success
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;

    	$scope.psaCodeDrop = data;
    }).catch(function onError(response) {
    	// Handle error
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;

    }); */

    RefServicetransaction.GetUniquePaymentDropdown().then(function(items) {

        //$scope.uniqueMOP = uniques(items.MOP)
        $scope.uniquePaymentStatusArr = uniques(items.PaymentStatus);
        $scope.uniquePaymentStatusArr.push("WAITING_APPROVAL")
        //$scope.uniqueCurrency = uniques(items.Currency);
       
        //$scope.uniqueMOP.sort();
        $scope.uniquePaymentStatusArr.sort();
        //$scope.uniqueCurrency.sort();

    })
    $scope.uniqueCurrency = [];
    $scope.getAllCurrency = function() {
        var query = {
            "sorts": [],
            "start": 0,
            "count": $scope.limit
        }

        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/currencies/code",
            params: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //$scope.uniqueCurrency=val
            for (var i in data) {
                $scope.uniqueCurrency.push(data[i]);
            }
            $scope.uniqueCurrency = uniques($scope.uniqueCurrency);
            /* $scope.dynamicArr = ["Currency"]
            for (var i in $scope.dynamicArr) {
            	$("select[name=" + $scope.dynamicArr[i] + "]").select2()
            } */
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

    $scope.getAllCurrency()


    $scope.uniqueMOP = [];
    $scope.getAllMOP = function() {
        var query = {
            "sorts": [],
            "start": 0,
            "count": $scope.limit
        }

        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/methodofpayments/code",
            params: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //$scope.uniqueCurrency=val
            for (var i in data) {
                $scope.uniqueMOP.push(data[i]);
            }
            $scope.uniqueMOP = uniques($scope.uniqueMOP);
            $('select[name="MethodOfPayment"]').select2()
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

    $scope.getAllMOP()
    $scope.Cycles = [
        {
            "actualvalue":"1",
            "displayvalue":"1"
        },{
            "actualvalue":"2",
            "displayvalue":"2"
        },{
            "actualvalue":"3",
            "displayvalue":"3"
        },{
            "actualvalue":"4",
            "displayvalue":"4"
        },{
            "actualvalue":"5",
            "displayvalue":"5"
        }]

        $scope.TypeService = [
            {
            "actualvalue":"COR",
            "displayvalue":"COR"
            },
            {
            "actualvalue":"CCD",
            "displayvalue":"CCD"
            },
            {
            "actualvalue":"PPD",
            "displayvalue":"PPD"
            }
            ]

    $scope.originatingparty = [];
    $scope.receivingparty = [];
    $scope.receivingparty_ = [];
    $scope.TXCode = [];
    $scope.originatingpartys = function(val) {
		//	$scope.originatingparty=[]
        var query = {
            "sorts": [],
            "start": 0,
            "count": $scope.limit
        }
        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/ach/payments/originatingparty",
            params: query,headers : {"TransactionACH":val}
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
			
            //$scope.uniqueCurrency=val
            data = uniques(data)
            $("select[name='OriginatingEntity']").select2({
                placeholder: $filter('translate')('Placeholder.All'),
                disabled: data.length == 1,
                data: data.map((el) => {return {"id": el.actualvalue, "text": el.displayvalue}}),
            })
            $scope.originatingparty = data
            $timeout(
                () => {
                    if($scope.originatingparty.length == 1){
                        $("select[name='OriginatingEntity']").val([$scope.originatingparty[0].actualvalue]).trigger('change');
                        //$scope.AdsearchParams['originatingparty'] = [$scope.originatingparty[0].actualvalue];
                    }else {
                        $("select[name='OriginatingEntity']").val("").trigger('change');
                    }
                    $scope.defaultvalue= (data.length == 1)?data[0].actualvalue : []
                },0
            )
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    $scope.defaultvalues=[]

    $scope.receivingpartys = function(val) {
        var query = {
            "sorts": [],
            "start": 0,
            "count": $scope.limit
        }
        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/ach/payments/receivingparty",
            params: query,headers : {"TransactionACH":val}
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            
            data = uniques(data);
            
            $("select[name='ReceivingEntity']").select2({
                placeholder: $filter('translate')('Placeholder.All'),
                disabled: data.length == 1,
                data: data.map((el) => {return {"id": el.actualvalue, "text": el.displayvalue}}),
            });
            $scope.receivingparty = data;
            $timeout(
                () => {
                    if($scope.receivingparty.length == 1){
                        $("select[name='ReceivingEntity']").val([$scope.receivingparty[0].actualvalue]).trigger('change');
                        //$scope.AdsearchParams['receivingparty'] = [$scope.receivingparty[0].actualvalue]
                    }else {
                        $("select[name='ReceivingEntity']").val("").trigger('change');
                    }
                    $scope.defaultvalues = ($scope.receivingparty.length==1)? $scope.receivingparty[0].actualvalue:[]
                }, 0
            )
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

   
    $scope.TXCodes = function() {
        var query = {
            "sorts": [],
            "start": 0,
            "count": $scope.limit
        }

        $http({
            method: "GET",
            url: BASEURL + "/rest/v2/ach/payments/txcodes",
            params: query
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //$scope.uniqueCurrency=val
            for (var i in data) {
                $scope.TXCode.push(data[i]);
            }
            $scope.TXCode = uniques($scope.TXCode);
           
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    $scope.TXCodes()

    $scope.anythingSelected = false;

    $scope.additionalWhereClauses = '';
    $scope.additionalWhereClauseArr = [];
    $scope.advancedUIR = AllPaymentsGlobalData.advancedUIR;

    $scope.SelectValue = function(index) {

        $scope.seeVisible = false;
        $scope.FieldsValues[index]['visible'] = !$scope.FieldsValues[index]['visible'];

        $scope.search[$scope.FieldsValues[index]['value']] = '';

        // setTimeout(function() {
        //     $scope.triggerSelect2()
        // }, 10);
        for (var i in $scope.FieldsValues) {
            if ($scope.FieldsValues[i].visible) {
                $scope.seeVisible = true;
            }
        }

        if ($scope.seeVisible) {

            $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');
        } else {

            $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
            $scope.PaymentAdvancedSearch = true;
            $('#saveSearchBtn, #AdSearchBtn').attr('disabled', 'disabled');
            if ($scope.crossTableflag) {

                $scope.PaymentAdvancedSearch = false;
                $('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');
            }
        }

        /*setTimeout(function () {
        $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
        $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
        }, 200)*/

        if ($scope.FieldsValues[index].value == 'ReceivedDate') {
            setTimeout(function() {
                $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()

                })
            }, 1000)
        } else if ($scope.FieldsValues[index].value == 'ValueDate') {

            setTimeout(function() {
                $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()

                })
            }, 1000)
        }else if ($scope.FieldsValues[index].value == 'DebitFxRate') {

            setTimeout(function() {
                $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateStart')
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()

                })
            }, 1000)
        }
    }




    $scope.searchNameDuplicated = AllPaymentsGlobalData.searchNameDuplicated;
    $scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;
    $scope.searchName = AllPaymentsGlobalData.searchname;
    $scope.isAnyFieldFilled = false;

    $scope.keyIndex = '';
    $scope.saveSearch = function() {

        if ($scope.searchname) {
            $scope.isSearchNameFilled = false;
            for (var key in userData.savedSearch.AllPayments) {
                if (userData.savedSearch.AllPayments[key].name == $scope.searchname) {

                    $scope.searchNameDuplicated = true;
                    $scope.keyIndex = key;
                    break;
                } else {
                    $scope.searchNameDuplicated = false;
                }

            }
            if (!$scope.searchNameDuplicated) {
                var saveSearchObjects = $scope.buildSearch();
                if ($scope.searchname) {
                    $scope.searchSet = false;
                    for (i in $scope.search) {
                        if (i == 'InstructionData') {
                            for (j in $scope.search[i]) {
                                if ((j == 'ReceivedDate') || (j == 'ValueDate') || (j == 'Amount')) {
                                    for (k in $scope.search[i][j]) {
                                        if (($scope.search[i][j].Start != '') && ($scope.search[i][j].End != '')) {
                                            $scope.searchSet = true;
                                        }

                                    }
                                } else {
                                    if ($scope.search[i][j] != "") {
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

                        AllPaymentsGlobalData.SelectSearchVisible = true;
                        $scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;

                        userData.savedSearch.AllPayments.push({
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
                                AllPaymentsGlobalData.searchname = $scope.searchname;
                                $scope.searchName = AllPaymentsGlobalData.searchname;
                                $scope.testing();
                            }

                        })

                        $('#myModal1').modal('hide');
                    } else {
                        $scope.isAnyFieldFilled = true;
                    }
                }
            }

            $scope.saveSearch1 = function() {

                saveSearchObjects = $scope.buildSearch();
                $scope.advanceSearchCollaspe();
                //localStorage.setItem("AS_"+sessionStorage.UserID+"_"+$scope.searchname,JSON.stringify(saveSearchObjects));


                $('#myModal1').modal('hide');
                AllPaymentsGlobalData.SelectSearchVisible = true;
                $scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;

                AllPaymentsGlobalData.searchname = $scope.searchname;
                $scope.searchName = AllPaymentsGlobalData.searchname;

                $scope.searchname = '';

                userData.savedSearch.AllPayments[$scope.keyIndex].name = $scope.searchName

                userData.savedSearch.AllPayments[$scope.keyIndex].params = JSON.stringify(saveSearchObjects)

                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {

                    $scope.testing();
                })

            }
        } else {
            $scope.isSearchNameFilled = true;
        }

    }

    $scope.ClearAlert = function() {
        $scope.searchNameDuplicated = false;
        $scope.searchname = '';
        $scope.isAnyFieldFilled = false;
        $scope.isSearchNameFilled = false;
    }

    $scope.selectSearch = function(eve, index) {

        AllPaymentsGlobalData.searchname = $scope.lskey[index];
        $scope.searchName = AllPaymentsGlobalData.searchname;
        if($scope.searchName == 'New Search'){
            $('#PaymentAdvancedSearch').collapse('show')
        }
      
        else{
            $('#PaymentAdvancedSearch').collapse('hide')
        }

        $timeout(function() {

            $scope.triggerSelect2()
        }, 0)

        //$scope.searchName = AllPaymentsGlobalData.searchname;


        if ($scope.searchName != 'New Search') {

            var ff = $scope.uData.savedSearch.AllPayments[index - 1].params;
            ff = (typeof(ff) == 'string') ? JSON.parse(ff) : ff;

            AllPaymentsGlobalData.searchParams = cleantheinputdata(ff.searchParams);

            $scope.search = ff.searchParams;

            $scope.all = ff.all;
            $scope.today = ff.today;
            $scope.week = ff.week;
            $scope.month = ff.month;
            $scope.custom = ff.custom;
            $scope.FLuir = ff.FLuir;

            $scope.startDate = ff.startDate;
            $scope.endDate = ff.endDate;

            $scope.todayDate = ff.todayDate;
            $scope.weekStart = ff.weekStart;
            $scope.weekEnd = ff.weekEnd;
            $scope.monthStart = ff.monthStart;
            $scope.monthEnd = ff.monthEnd;

            $scope.selectCriteriaTxt = ff.selectCriteriaTxt;
            $scope.selectCriteriaID = ff.selectCriteriaID;
            AllPaymentsGlobalData.selectCriteriaID = $scope.selectCriteriaID;
            $scope.prev = ff.prev;
            $scope.prevSelectedTxt = ff.prevSelectedTxt;
            $scope.prevId = ff.prevId;

            $scope.searchClicked = ff.searchClicked;
            $scope.isEntered = ff.isEntered;
            $scope.dynamicArr = ["PartyServiceAssociationCode"]

            if( $scope.PaymentAdvancedSearch){
                $('#PaymentAdvancedSearch').collapse('hide')   
            }

            for (var i in $scope.dynamicArr) {
                $("select[name='" + $scope.dynamicArr[i] + "']").select2({
                    data: $scope.search[$scope.dynamicArr[i]]
                });
            }

            //},100)

            //setTimeout(function(){


            //$("select[name='PartyServiceAssociationCode']")('val', ff.searchParams.PartyServiceAssociationCode);

            //},100)

            //$('[name=' + $scope.FieldsValues[i].value + ']').select2('val', '');


            $scope.advancedSearchEnable = ff.advancedSearchEnable;
            AllPaymentsGlobalData.advancedSearchEnable = ff.advancedSearchEnable;
            $('.menuClass').removeClass('listSelected').addClass('listNotSelected')
            $('#menulist_' + AllPaymentsGlobalData.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected');

            $('#dropdownBtnTxt').html(ff.selectCriteriaTxt)
            AllPaymentsGlobalData.fromMyProfilePage = true;

            AllPaymentsGlobalData.FieldArr = ff.FieldArr;
            $scope.initialCall(true)
            $scope.initializeSetting()

        } else {

            setTimeout(function() {
                    $scope.crossTableflag = true;
                    $scope.crossTableFilter = {};
                    $scope.crossTable = {
                        fields: [{}]
                    };
                }, 0)
                //$scope.paylistsearch ="";
                //$scope.UIR  = "";
                //$scope.nothingSelected = true;


            setTimeout(function() {
                $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
                $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
                $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
            }, 200)

            $scope.search = {
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


            AllPaymentsGlobalData.searchParams = $scope.search;

            /*	AllPaymentsGlobalData.all = true;
            AllPaymentsGlobalData.today = false;
            AllPaymentsGlobalData.week = false;
            AllPaymentsGlobalData.month = false;
            AllPaymentsGlobalData.custom = false;

            $scope.all = AllPaymentsGlobalData.all;
            $scope.today = AllPaymentsGlobalData.today;
            $scope.week = AllPaymentsGlobalData.week;
            $scope.month = AllPaymentsGlobalData.month;
            $scope.custom = AllPaymentsGlobalData.custom;*/

            $scope.resetFilter()
                //$('#dropdownBtnTxt').html('All');
                //$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
                //$('#menulist_1').addClass('listSelected').removeClass('listNotSelected');

            $scope.PaymentAdvancedSearch = false;

            $scope.triggerSelect2()

        }
    }

    $scope.spliceSearchArr = function(key) {
        if(key != "InstructionData"){
            delete $scope.search[key]; 
        }
        AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked = false;
        $scope.dArr = ["PartyServiceAssociationCode", "Currency", "MethodOfPayment", "Status","OriginatingEntity","ReceivingEntity","TypeService","Cycle"]
        $timeout(function() {

            for (var i in $scope.dArr) {
                if (key == $scope.dArr[i]) {
                    $("select[name='" + $scope.dArr[i] + "']").select2({
                        data: []
                    });
                }
            }

        }, 500)

        $scope.buildSearch()
    }

    $scope.submitform =  function(FieldsValues) {

        if($scope.search.InstructionData['DebitFxRate'].Start){
            $scope.search.InstructionData['DebitFxRate'].End = $scope.search.InstructionData['DebitFxRate'].Start;
        }
        sessionStorage.SelectedCombo=$scope.Section;

        if($scope.search['OriginatingEntity'] == undefined || $scope.search['OriginatingEntity'].length == 0){
            $scope.search['OriginatingEntity'] = "Todos";
        }
        if($scope.search['ReceivingEntity'] == undefined || $scope.search['ReceivingEntity'].length == 0){
            $scope.search['ReceivingEntity'] = "Todos";
        }
        if($scope.search['Cycle'] == undefined || $scope.search['Cycle'].length == 0){
            $scope.search['Cycle'] = "Todo";
        }

        if ((Object.keys($scope.search).indexOf('OriginatingEntity') !== -1)||(Object.keys($scope.search).indexOf('ReceivingEntity') !== -1)||(Object.keys($scope.search).indexOf('Cycle') !== -1)) {
          if(!$scope.search['Cycle'].length){
            $scope.Requireddropdown=true
           }else if(Object.keys($scope.search).indexOf('InstructionData') == -1 || Object.keys($scope.search.InstructionData).indexOf('DebitFxRate') == -1 || $scope.search['InstructionData'].DebitFxRate.Start == "")
           {
               $scope.Required=true
           }
           else{
            $scope.Required=false
            $scope.Requireddropdown=false
            $scope.buildSearch()
           }
        }else{
            $scope.Requireddropdown=true
        }
        if((Object.keys($scope.search['InstructionData']).indexOf('DebitFxRate') !== -1)){
            if(!($scope.search['InstructionData']['DebitFxRate']['Start'])){
                $scope.Required=true
            }
        }

      }

    $scope.buildSearch = function(data) {
        sessionStorage.SelectedCombo=$scope.Section;
        $scope.search['OriginatingEntity'] = $scope.validateEntity($scope.originatingparty, $scope.search['OriginatingEntity']);
        $scope.search['ReceivingEntity'] = $scope.validateEntity($scope.receivingparty, $scope.search['ReceivingEntity']);
        if($scope.search['Cycle'] == undefined || $scope.search['Cycle'].length == 0){
            $scope.search['Cycle'] = "Todo";
        }
        $scope.search = cleantheinputdata($scope.search)
        $scope.AdsearchParams = angular.copy($scope.search)
        // statusBasedActions()
        $scope.additionalWhereClauses = '';
        $scope.additionalWhereClauseArr = [];
        $scope.amountAlert = false;

        $scope.AdsearchParams = removeEmptyValueKeys($scope.AdsearchParams)

        for (var i in $scope.AdsearchParams) {

            if (Array.isArray($scope.AdsearchParams[i])) {
                if (!$scope.AdsearchParams[i].length) {
                    delete $scope.AdsearchParams[i]
                }
            }
        }

        for (i in $scope.AdsearchParams) {
            if (i == 'InstructionData') {
                for (j in $scope.AdsearchParams[i]) {
                    if ((j == 'ReceivedDate') || (j == 'ValueDate') || (j == 'Amount') || (j == 'DebitFxRate')) {
                        for (k in $scope.AdsearchParams[i][j]) {
                            if ((k == 'Start') && ($scope.AdsearchParams[i][j][k] != "")) {
                                // AllPaymentsGlobalData.searchParams[i][j].Start = $scope.AdsearchParams[i][j][k];
                                Object.assign(AllPaymentsGlobalData.searchParams[i][j], { Start: $scope.AdsearchParams[i][j][k] })
                                // AllPaymentsGlobalData.searchParams[i][j] = { Start: $scope.AdsearchParams[i][j][k] };
                                if (j == 'ReceivedDate') {
                                    $scope.additionalWhereClauses = "EntryDateBetween=" + $scope.AdsearchParams[i][j][k];
                                } else if (j == 'ValueDate') {
                                    $scope.additionalWhereClauses = "ValueStartDate=" + $scope.AdsearchParams[i][j][k];
                                } else if (j == 'Amount') {
                                    $scope.additionalWhereClauses = "AmountStart=" + $scope.AdsearchParams[i][j][k];
                                } else if (j == 'DebitFxRate') {
                                    $scope.additionalWhereClauses = "DebitFxRateBetween=" + $scope.AdsearchParams[i][j][k];
                                }
                             
                                $scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
                            } else if ((k == 'End') && ($scope.AdsearchParams[i][j][k] != "")) {
                                // AllPaymentsGlobalData.searchParams[i][j].End = $scope.AdsearchParams[i][j][k];
                                Object.assign(AllPaymentsGlobalData.searchParams[i][j], { End: $scope.AdsearchParams[i][j][k] })
                                // AllPaymentsGlobalData.searchParams[i][j] = { End: $scope.AdsearchParams[i][j][k] };
                                if (j == 'ReceivedDate') {
                                    $scope.additionalWhereClauses = "EndDateBetween=" + $scope.AdsearchParams[i][j][k];
                                } else if (j == 'ValueDate') {
                                    $scope.additionalWhereClauses = "ValueEndDate=" + $scope.AdsearchParams[i][j][k];
                                } else if (j == 'Amount') {
                                    $scope.additionalWhereClauses = "AmountEnd=" + $scope.AdsearchParams[i][j][k];
                                } else if (j == 'DebitFxRate') {
                                    $scope.additionalWhereClauses = "DebitFxRateEndBetween=" + $scope.AdsearchParams[i][j][k];
                                }
                            
                                $scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
                            }
                        }

                    } else {

                        AllPaymentsGlobalData.searchParams[i][j] = $scope.AdsearchParams[i][j];
                        $scope.additionalWhereClauses = j + '=' + $scope.AdsearchParams[i][j];
                        $scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
                    }
                }
            } else {

                AllPaymentsGlobalData.searchParams[i] = $scope.AdsearchParams[i];
                if (Array.isArray($scope.AdsearchParams[i])) {
                    for (var k in $scope.AdsearchParams[i]) {
                        $scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i][k];
                        $scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
                    }
                } else {

                    $scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i];
                    $scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
                }
            }
        }

        $scope.searchSet = false;
        for (i in $scope.AdsearchParams) {
            if (i == 'InstructionData') {
                for (j in $scope.AdsearchParams[i]) {
                    if ((j == 'ReceivedDate') || (j == 'ValueDate') || (j == 'Amount') || (j == 'DebitFxRate')) {

                        for (k in $scope.AdsearchParams[i][j]) {
                            if (($scope.AdsearchParams[i][j].Start && $scope.AdsearchParams[i][j].End)) {
                                $scope.searchSet = true;
                            }
                        }
                    }
                }
            } else {
                if ($scope.AdsearchParams[i] != '') {
                    $scope.searchSet = true;
                }
            }
        }

        $scope.crossTable = cleantheinputdata($scope.crossTable)
        $scope.dCrossTable = angular.copy($scope.crossTable)
        $scope.crossTableFilter = {}

        for (var i in $scope.dCrossTable.fields) {

            $scope.dCrossTable.fields[i] = cleantheinputdata($scope.dCrossTable.fields[i])
            delete $scope.dCrossTable.fields[i].$$hashKey;
            if ($.isEmptyObject($scope.dCrossTable.fields[i])) {
                $scope.dCrossTable.fields.splice(i, 1)
            } else if (Object.keys($scope.dCrossTable.fields[i]).length == 1) {

                //$scope.dCrossTable.fields.splice(i,1)
                //$scope.crossTable.fields.splice(i,1)
            }
        }
        $scope.addCrossTable = false;

        for (var i in $scope.dCrossTable.fields) {
            $scope.dCrossTable.fields[i] = cleantheinputdata($scope.dCrossTable.fields[i])
            if ($.isEmptyObject($scope.dCrossTable.fields[i])) {
                $scope.dCrossTable.fields.splice(i, 1);
                $scope.dCrossTable.fields = cleantheinputdata($scope.dCrossTable.fields);

                if (!$scope.dCrossTable.fields.length) {
                    delete $scope.dCrossTable.fields;
                }
            }
        }

        if (Object.keys($scope.dCrossTable).length == 4) {

            $scope.addCrossTable = true;

            var filters = {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": []
                        }]
                    }]
                }]
            }

            $scope.crossTableFilter.columnName = $scope.dCrossTable.columnName;
            $scope.crossTableFilter.crossTableName = $scope.dCrossTable.CrossTableName;
            $scope.crossTableFilter.crossTableColumnName = $scope.dCrossTable.CrossTableColumnName;
            $scope.crossTableFilter.logicalOperator = "AND";

            $scope.crossTableFilter.filters = joinQueryRepeatElem($scope.dCrossTable.fields, filters)

            /*for(var i in $scope.dCrossTable.fields){
            filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({'columnName':$scope.dCrossTable.fields[i].columnName,'operator':'=','value':$scope.dCrossTable.fields[i].columnValue,'isCaseSensitive':false

            })
            }
            $scope.crossTableFilter.filters = filters;*/

        }

        if ($scope.searchSet || $scope.addCrossTable) {

            $scope.anythingSelected = true;
            $scope.isAdvacedSearchClicked = true;
            $scope.showSearchWarning = false;
            $('#showWarning').removeClass('in');
        } else {
            $scope.anythingSelected = false;
            $scope.isAdvacedSearchClicked = false;
            $scope.showSearchWarning = true;
            $('#showWarning').addClass('in');
        }
        window.WildcardSearchData  = [{'module':'transactions', 'wildCardSearchFields':['OriginDescription']}]
        if ($scope.anythingSelected) {
            
            $('#PaymentAdvancedSearch').collapse('hide')
         
            AllPaymentsGlobalData.fromMyProfilePage = false;
            AllPaymentsGlobalData.FieldArr = $scope.additionalWhereClauseArr;
            AllPaymentsGlobalData.fromDashboard = false;
            $scope.fromDashboard = AllPaymentsGlobalData.fromDashboard;

            AllPaymentsGlobalData.DataLoadedCount = 20;
            $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
            AllPaymentsGlobalData.FLuir = $scope.paylistsearch = ''
            $scope.checkDropdownSelected('search');
            $scope.PaymentAdvancedSearch = true;

            ($scope.searchSet || $scope.addCrossTable)

            if ($scope.searchSet) {
                AllPaymentsGlobalData.advancedSearchEnable = true;
                $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
            } else if ($scope.searchSet && $scope.addCrossTable) {
                AllPaymentsGlobalData.advancedSearchEnable = true;
                $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
            } else if ($scope.addCrossTable) {
                AllPaymentsGlobalData.advancedSearchEnable = false;
                $scope.advancedSearchEnable = true;
            }

            $scope.UIR = false;
            $scope.aa = 20;

            $scope.tObj = {
                'flag': $scope.addCrossTable,
                'crossFilter': $scope.crossTableFilter
            }

            if ($scope.all) {
                $scope.nothingSelected = true;
                RefServicetransaction.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "All", $scope.tObj, $rootScope.payamentseleceddata).then(function(items) {
          
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        getForceAction(items.data[0])
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }

                })
            } else if ($scope.today) {
                $scope.nothingSelected = false;
                RefServicetransaction.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "Today", $scope.tObj,$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            } else if ($scope.week) {
                $scope.nothingSelected = false;
                RefServicetransaction.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "Week", $scope.tObj,$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            } else if ($scope.month) {
                $scope.nothingSelected = false;
                RefServicetransaction.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "Month", $scope.tObj,$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.totalData = items.tCnt;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            } else if ($scope.custom) {
                $scope.nothingSelected = false;
                RefServicetransaction.advancedCustomSearch($scope.additionalWhereClauseArr, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.tObj,$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.totalData = items.tCnt;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                    }
                })
            }
        } else {

            if ($scope.advancedSearchEnable) {
                AllPaymentsGlobalData.advancedSearchEnable = false;
                $scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
                //AllPaymentsGlobalData.finalREST = BASEURL + '/rest/v1/payment?';
                //$scope.finalREST = AllPaymentsGlobalData.finalREST;
                if ($scope.all) {

                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All",$rootScope.payamentseleceddata).then(function(items) {

                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                        } else {
                            $scope.totalData = items.tCnt;
                            $scope.defaultCallValues(items.data)
                            $scope.wildcard = false;
                        }
                    });

                } else if ($scope.today) {
                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today",$rootScope.payamentseleceddata).then(function(items) {
                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                            $scope.dropdownSelected = false;
                        } else {
                            $scope.defaultCallValues(items.data)
                            $scope.totalData = items.tCnt;
                            $scope.dropdownSelected = true;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume
                        }

                    });
                } else if ($scope.week) {
                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week",$rootScope.payamentseleceddata).then(function(items) {

                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                            $scope.dropdownSelected = false;
                        } else {
                            $scope.defaultCallValues(items.data)
                            $scope.dropdownSelected = true;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume

                        }
                    });
                } else if ($scope.month) {
                    RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month",$rootScope.payamentseleceddata).then(function(items) {

                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                            $scope.dropdownSelected = false;
                        } else {
                            $scope.defaultCallValues(items.data)
                            $scope.totalData = items.tCnt;
                            $scope.dropdownSelected = true;
                            $scope.transactionvalue=items.transactionvalue
                            $scope.transactionvolume=items.transactionvolume

                        }
                    });
                } else if ($scope.custom) {
                    RefServicetransaction.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType,$rootScope.payamentseleceddata).then(function(items) {

                        if (items.response == "Error") {
                            $scope.showErrorMessage(items)
                            $scope.dropdownSelected = false;
                        } else {
                            $scope.defaultCallValues(items.data)
                            $scope.dropdownSelected = true;
                        }

                    });
                }
            }
        }
        window.WildcardSearchData = undefined;
        $scope.AllPaymentsGlobalData = AllPaymentsGlobalData;


        delete $scope.AllPaymentsGlobalData.allPaymentDetails;

        return $scope.AllPaymentsGlobalData;

    }

    $scope.retainAlert = function(eve) {

        $(eve.currentTarget).parent().removeClass('in')
        $scope.showSearchWarning = false;
    }

    $scope.rstAdvancedSearchFlag = function() {
        if (!$scope.advancedSearchEnable) {
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
        //$scope.advanceSearchCollaspe();
        GlobalService.PaymentAdvancedSearch = true;
        $scope.PaymentAdvancedSearch = true;
        $scope.amountAlert = false;

        // $timeout(function() {

        //     for (var i in $scope.FieldsValues) {
        //         if ($scope.FieldsValues[i].type == 'dropdown') {
        //             try {
        //                 $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
        //                 $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2('val', '');
        //             } catch (error) {
        //                 console.log($scope.FieldsValues[i].value + ":  - " + error)
        //             }
        //         }
        //     }
        // }, 10)
    }

    $scope.resetFilter = function() {

        $scope.showSearchWarning = false;

        setTimeout(function() {
            $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
            $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
            $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
        }, 200)

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
        $scope.initializeSetting()
        $scope.search = angular.copy($scope.AdsearchParams);
        AllPaymentsGlobalData.searchParams = angular.copy($scope.AdsearchParams);

        $scope.isAdvacedSearchClicked = false;

        $('#saveSearchBtn,#AdSearchBtn').removeAttr('disabled', 'disabled');
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.SelectSearchVisible = false;

        //$scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
        //$scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')

        // $timeout(function() {
        //     $scope.triggerSelect2();
        // }, 10)

        // $timeout(function() {

        //     for (var i in $scope.FieldsValues) {
        //         if ($scope.FieldsValues[i].type == 'dropdown') {
        //             $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
        //             $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2('val', '');
        //         }
        //     }
        // }, 0)

        if ($scope.advancedSearchEnable) {
            $scope.UIR = false;
            $scope.paylistsearchValue = '';
            AllPaymentsGlobalData.advancedSearchEnable = false;
            $scope.advancedSearchEnable = false;

            AllPaymentsGlobalData.orderByField = 'ReceivedDate';
            $scope.orderByField = AllPaymentsGlobalData.orderByField;
            AllPaymentsGlobalData.sortReverse = false;
            $scope.sortReverse = AllPaymentsGlobalData.sortReverse;
            AllPaymentsGlobalData.sortType = 'Desc';
            $scope.sortType = AllPaymentsGlobalData.sortType;

            AllPaymentsGlobalData.isSortingClicked = false;
            $scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked;

            AllPaymentsGlobalData.DataLoadedCount = 20;
            $scope.aa = AllPaymentsGlobalData.DataLoadedCount;
            $scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;

            if ($scope.all) {
                $scope.nothingSelected = true;
                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All",$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.totalData = items.tCnt;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.wildcard = false;
                    }
                });

            } else if ($scope.today) {
                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today",$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.totalData = items.tCnt;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }

                });
            } else if ($scope.week) {

                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week",$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.defaultCallValues(items.data)
                        $scope.totalData = items.tCnt;
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }
                });

            } else if ($scope.month) {
                RefServicetransaction.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month",$rootScope.payamentseleceddata).then(function(items) {

                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }

                });
            } else if ($scope.custom) {
                RefServicetransaction.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType,$rootScope.payamentseleceddata).then(function(items) {
                    if (items.response == "Error") {
                        $scope.showErrorMessage(items)
                        $scope.dropdownSelected = false;
                    } else {
                        $scope.totalData = items.tCnt;
                        $scope.defaultCallValues(items.data)
                        $scope.transactionvalue=items.transactionvalue
                        $scope.transactionvolume=items.transactionvolume
                        $scope.dropdownSelected = true;
                    }

                });
            }
        }
    }

    $scope.checkDropdownSelected = function(data) {
        if (data == 'search') {
            AllPaymentsGlobalData.SelectSearchVisible = false;
            $scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;
        } else {
            AllPaymentsGlobalData.SelectSearchVisible = true;
            $scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;
        }
    }

    $scope.showAlertMsg = false;
    $scope.confirmationAlert = function(index) {
        $scope.showAlertMsg = true;
        $scope.selectedSearchName = index;
        $scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
    }

    $scope.deleteSelectedSearch = function(eve) {
        userData.savedSearch.AllPayments.splice($scope.selectedSearchName - 1, 1)
        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function(response) {
            $scope.testing();
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

    	$scope.focusInfn = function (data) {

    $('#' + data).focus()
        $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
    }

    $scope.toggleFocus = function(event, index, active) {
        var val = event.currentTarget
        var id = $(val).attr('id')

        if (event.keyCode == 13) {

            $scope.active = !$scope.active;

            $scope.SelectValue(index);

            if ($(sanitize('#' + id)).hasClass('checked')) {
                $(sanitize('#' + id)).removeClass('checked')
            } else {
                $(sanitize('#' + id)).addClass('checked');
                $scope.triggerSelect2()
            }
        }
    }
    
    $(document).ready(function() {
        $scope.customDateRangePicker = function(sDate, eDate) {
            var start = new Date();
            var endDate = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));
    
            $(sanitize('#' + sDate)).datepicker({
                language: "es",
                startDate: '1900-01-01',
                endDate: endDate,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                daysOfWeekDisabled: [0,6]
            }).on('changeDate', function(selected) {
    
                start = new Date(selected.date.valueOf());
    
                start.setDate(start.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + eDate)).datepicker('setStartDate', start);
            });
            $(sanitize('#' + eDate)).datepicker({
                language: "es",
                startDate: start,
                endDate: endDate,
                autoclose: true,
                format: 'yyyy-mm-dd',
                todayHighlight: true,
                daysOfWeekDisabled: [0,6]
            }).on('changeDate', function(selected) {
                endDate = new Date(selected.date.valueOf());
    
                endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);
    
            });
    
            $(sanitize('#' + sDate)).keyup(function(ev) {
                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {
    
    
                    $(sanitize('#' + eDate)).datepicker('setStartDate', new Date());
                }
            })
            $(sanitize('#' + eDate)).keyup(function(ev) {
                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {
    
                    $(sanitize('#' + sDate)).datepicker('setEndDate', null);
                }
            })
        }
        // $scope.customDateRangePicker('EntryStartDate','EntryEndDate')
    $timeout(function() {
        $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
        $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
        $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
    }, 500)
    $scope.customDateRangePicker('startDate', 'endDate')
    $scope.customDateRangePicker('CstartDate', 'CendDate')
});
    $scope.customPicker = function(sDate, eDate) {
        var startDate = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);

        $(sanitize('#' + sDate)).datetimepicker({
            weekStart: 1,
            startDate: '1900-01-01',
            minDate: 1,
            //endDate: FromEndDate,
            autoclose: true,
            format: 'YYYY-MM-DD'
        }).on('click.togglePicker', function(selected) {

        });

        $(sanitize('#' + sDate)).datetimepicker('setEndDate', FromEndDate);
        $(sanitize('#' + eDate)).datetimepicker({
            weekStart: 1,
            startDate: startDate,
            endDate: ToEndDate,
            autoclose: true,
            format: 'YYYY-MM-DD'
        }).on('click.togglePicker', function(selected) {

            FromEndDate = new Date(selected.date.valueOf());
            FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + sDate)).datetimepicker('setEndDate', FromEndDate);
        });
        $(sanitize('#' + eDate)).datetimepicker('setStartDate', startDate);
    }

    $timeout(function() {

        // $scope.customPicker('ReceivedDateStart','ReceivedDateEnd')
    }, 500)

    

    $scope.CustomDatesReset = function() {
        $scope.startDate = '';
        $scope.endDate = '';
        $('#okBtn').attr('disabled', 'disabled')
        $scope.customDateRangePicker('startDate', 'endDate')
    }
    $scope.listTooltip = "List View";
    $scope.gridTooltip = "Grid View";

    // $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
    // if ($scope.changeViewFlag) {

    // 	$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');

    // 	$scope.changeViewFlag = true;

    // } else {

    // 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
    // 	$scope.changeViewFlag = false;
    // }

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    }

    /* used to store select view in the global variable for furture use */
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

    /*$scope.hello = function (value, eve) {
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

    /*** Export to Excel ***/
    $scope.exportToExcel = function(format) {

            //bankData.exportToExcelHtml($('#dummyExportContent').html(), 'All Payments');
            //var table_html = $('#exportContent').html();
            //bankData.exportToExcel(table_html, 'All Payments');


            if ($("input[name=excelVal][value='All']").prop("checked")) {
                $scope.makeCall(format);
            } 

        }
        /*** Print Function ***/
    $scope.printFn = function() {

        $('#dummyExportContent').find('th').removeAttr('nowrap')
        window.print()
        $('#dummyExportContent').find('th').attr('nowrap', true)

     

    }

    $scope.makeCall = function(format) {

        $scope.details = JSON.parse(sessionStorage.AllPaymentsCurrentObject);

        $scope.details.count = ($scope.totalData) ? $scope.totalData : 1000;
        $scope.details = constructQuery($scope.details);
        if(format=='csv'){
            var rest=BASEURL +'/rest/v2/ach/payments/export/csv/alltxs'
            }else if(format=='pdf'){
                var rest=BASEURL +'/rest/v2/ach/payments/export/pdf/alltxs'
            }else if(format=='xls'){
                var rest=BASEURL +'/rest/v2/ach/payments/export/xlsx/alltxs'
            }
                else{
                var rest=BASEURL +'/rest/v2/ach/payments/export/txt/alltxs'
            }


            headers = {"TransactionACH": $rootScope.payamentseleceddata}

        $http.post(rest, $scope.details,{headers: headers}).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.dat = response.data.Data
            $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
            var dlnk = document.getElementById('dwnldLnk');
            dlnk.href = $scope.Details;
            dlnk.download =   response.data['filename']
              
            dlnk.click();

 
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
    $scope.widthOnScroll = function() {
        var mq = window.matchMedia("(max-width: 991px)");
        var headHeight
        if (mq.matches) {
            headHeight = 0;
            $scope.alertWidth = $('.pageTitle').width();
        } else {
            $scope.alertWidth = $('.pageTitle').width();
            headHeight = $('.page-header').outerHeight(true) + 10;
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

    $scope.allowOnlyNumbersAlone = function(event) {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            var keyArr = [8, 9, 35, 36, 37, 39, 46]

            function chkKey(key) {
                if (keyArr.indexOf(key) != -1) {
                    return false;
                } else {
                    return true;
                }
            }

            $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));
            if ((chkKey(event.keyCode)) && (event.which != 46 || $(event.currentTarget).val().indexOf('.') == -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        } else {
            if ((event.keyCode == 46) || (event.charCode == 46)) {
                $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));

            }

            if ((event.which != 46 || $(event.currentTarget).val().indexOf('.') == -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        }

    }

    $scope.allowNumberWithDecimal = function(event) {

        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            var keyArr = [8, 35, 36, 37, 39, 46]

            function chkKey(key) {
                if (keyArr.indexOf(key) != -1) {
                    return false;
                } else {
                    return true;
                }
            }

            $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));
            if ((chkKey(event.keyCode)) && (event.which != 46 || $(event.currentTarget).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        } else {
            if ((event.keyCode == 46) || (event.charCode == 46)) {
                $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));

            }

            if ((event.which != 46 || $(event.currentTarget).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        }

    }

    $scope.notAllowAnything = function(eve) {
        if ((eve.keyCode == 8) || (eve.keyCode == 9)) {
            return;
        } else {
            eve.preventDefault();
        }
    }

    $scope.checkAll = function(evt) {
        $scope.selectedAll = $(evt.currentTarget).prop('checked');
        angular.forEach($scope.items, function(item) {
            item.Selected = $scope.selectedAll;
        });

    };

    $scope.enableBulkActions = '';

    function getForceAction(firstObj) {
        if (firstObj && firstObj['InstructionData'] && firstObj['InstructionData']['PartyServiceAssociationCode']) {

            $http.post(BASEURL + '/rest/v2/partyserviceassociations/read', {
                'PartyServiceAssociationCode': firstObj ? firstObj.InstructionData.PartyServiceAssociationCode : ''
            }).then(function(response) {
                $scope.ProcessCode = response.data.ProcessCode;

                $http.post(BASEURL + '/rest/v2/actions', {
                    "ProcessStatus": firstObj.Status,
                    "WorkFlowCode": "PAYMENT",
                    "ProcessName": $scope.ProcessCode
                }).then(function(response) {
                    if (response.data.length > 0) {
                        $scope.enableBulkActions = response.data;
                    } else {}
                }, function(err) {
                    errorservice.ErrorMsgFunction(err, $scope, $http, err.data.error.code)
                })

            }, function(err) {
                errorservice.ErrorMsgFunction(err, $scope, $http, err.data.error.code)
            })
        }
    }

    /* $http.get(BASEURL+RESTCALL.ClearingHouse).then(function onSuccess(response) {
    	// Handle success
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;
    	
    	$scope.clearingHouseVal = data;
    }).catch(function onError(response) {
    	// Handle error
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;
    	
    }); */

    $scope.dependsCycle = function(data) {
        if (data) {
            $http({
                url: BASEURL + RESTCALL.dependsCycle,
                method: "GET",
                params: {
                    clearingCode: data
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.cycleCode = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.cycleCode = "";
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        } else {
            $scope.cycleCode = "";
        }

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

    $('.cHouseBtn').addClass('disabledBtnColor')

    $scope.CHouse1 = {
        "clearingHouse": "",
        "cycles": ""
    };

    $scope.actionDrop = function(obj) {
        $scope.bulkObj = {
            Payments: [],
            ActionName: []
        };

        $scope.aDropVal = [];

        $http.post(BASEURL + RESTCALL.ActionDropdown, obj).then(function onSuccess(response) {
            // Handle success
            var val = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (var i in $scope.uniqPayments) {
                $scope.bulkObj.Payments.push({
                    'PaymentID': $scope.uniqPayments[i]
                })
            }

            for (var j in val) {
                $scope.bulkObj.ActionName.push({
                    'ActionName': val[j].ActionName
                })
            }

            if (val.length) {
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
                            for (var y in val) {
                                if ((data[x].ActionName == val[y].ActionName) && data[x].Applicability == 'Enable') {
                                    $scope.aDropVal.push(val[y]);
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

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

    }

    $scope.alertTxt = true;
    $scope.uniqPayments = [];
    $scope.checkStatusForBulk = function(event, allpayments1, index) {
        $scope.anythingChecked = false;

        $scope.allowedStatus = allpayments1;

        $scope.cMOPArr = [];
        $scope.uniqPayments = [];
        $scope.psaChain = [];

        for (var i in $scope.items) {
            if ($('#check_' + i).prop("checked")) {
                $scope.anythingChecked = true;
                $scope.cMOPArr.push($scope.items[i].Status)
                $scope.uniqPayments.push($scope.items[i].PaymentID)
                $scope.psaChain.push($scope.items[i].InstructionData.PartyServiceAssociationCode)

            }

        }

        if ($scope.anythingChecked) {
            $('.cHouseBtn').removeClass('disabledBtnColor')
        } else {
            $('.cHouseBtn').addClass('disabledBtnColor')
        }

        $scope.uniqMopArr = uniques($scope.cMOPArr)

        if ($scope.uniqMopArr.length > 1) {

            $scope.alertTxt = true;

            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('Pleaseselectpaymentswithcommonstatusforbulkactions')
            }]

        } else if ($scope.uniqMopArr.length == 1) {
            $scope.alertTxt = false;
            $('.alert-danger').hide()

            $scope.aObj = {
                "ProcessStatus": $scope.uniqMopArr[0],
                "WorkFlowCode": "PAYMENT",
                "PartyServiceAssociationCode": $scope.psaChain.join(",")
            }
            $scope.aDropVal = [];
            setTimeout(function() {
                $scope.actionDrop($scope.aObj)
            }, 200)

        } else {
            $scope.alertTxt = true;
        }
    }

    $scope.resetObj = function(flag) {
        $scope.CHouse = {
            "clearingHouse": ""
        };
        $scope.CHouse2 = {
            "clearingHouse": "",
            "cycles": ""
        };

        $scope.CHouse1.cycles = "";

        $scope.cycleCode = [];

        if (flag) {
            if (!$scope.alertTxt) {
                $('.alert-danger').hide()

                $http({
                    url: BASEURL + RESTCALL.dependsCycle,
                    method: "GET",
                    params: {
                        clearingCode: $scope.CHouse1.clearingHouse
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.cycleCode = data;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.cycleCode = [];
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: $filter('translate')('PleaseselectuniqueMOP')
                }]
            }
        }
    }

    $scope.changeClearing = function(data) {
        $scope.temArr = [];
        $scope.inputObj = {}
        $scope.inputObj.cycle = data.cycles;
        $scope.inputObj.clearing = data.clearingHouse;
        $scope.inputObj.user = sessionStorage.UserID;

        for (var i in $scope.items) {
            if ($('#check_' + i).prop("checked")) {
                $scope.temArr.push($scope.items[i].PaymentID)
            }
        }

        $scope.inputObj.paymentIds = $scope.temArr.join(',');

        $http.post(BASEURL + RESTCALL.submitCHouse, $scope.inputObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            /*$state.go('app.newmodules', {url:'bulkpayments',tempUrl:"plug-ins/modules/bulkpayments",contrl:'paymentforbulkingCtrl'});*/
            // $state.reload()
            $scope.initialCall($scope.advancedSearchEnable)
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
            }]
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
        $('.modal').modal('hide')
        $scope.alerts = [{
            type: 'success',
            msg: "Success"
        }];
        //submitCHouse
    }

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    // function statusBasedActions() {

    //     $scope.enableActionbuttons = '';
    //     if (sessionStorage.ColpData != undefined) {
    //         $scope.ColpData = JSON.parse(atob(sessionStorage.ColpData));
    //         if ($scope.ColpData.length > 0) {
    //             var thisPageNewActions = objectFindByKey($scope.ColpData, 'Page', $location.path());

    //             if (thisPageNewActions.Page == $location.path()) {

    //                 for (i = 0; i < thisPageNewActions.Actions.length; i++) {


    //                     if (Object.keys(AllPaymentsGlobalData.searchParams).indexOf("Status") != -1) {
    //                         if (AllPaymentsGlobalData.searchParams.Status) {

    //                             if ((thisPageNewActions.Actions[i].CurrentStatus == AllPaymentsGlobalData.searchParams.Status[0])) {

    //                                 $scope.enableActionbuttons = thisPageNewActions.Actions[i].DropDownList.length;
    //                                 $scope.BRActions = thisPageNewActions.Actions[i].DropDownList;
    //                                 $scope.toActionObject = thisPageNewActions;
    //                             }
    //                         }
    //                     }

    //                 }

    //             }
    //         }
    //     }
    // }
    // statusBasedActions()

    function toGetBulkorReverseObj(items1, actions) {

        var obj1 = {};
        var PID = '';
        for (i = 0; i < items1.length; i++) {
            if (items1[i].Selected == true) {

                PID += items1[i].PaymentID + ',';

            }
        }
        PID = PID.substring(0, PID.length - 1);
        obj1.urid = PID;
        //obj1.datetime="";
        obj1.status = actions;
        obj1.actionuser = {
            "username": sessionStorage.UserID
        };
        return obj1;
    }

    $scope.forceAction = function(items, actions) {

        actions = JSON.parse(actions)

        //DisplayPopUpWithWebFormInput
        if (actions.FunctionName == 'DisplayPopUpWithWebFormInput' || actions.FunctionName == 'DisplayPopUpWithWebFormInputForOverride') {
            $state.go('app.bulkoverride', {
                input: {
                    'payments': $scope.uniqPayments,
                    'status': $scope.uniqMopArr[0],
                    'url': actions.RestURL
                }
            })
        } else {

            // $scope.paymentsArr = '';
            $scope.paymentsArr = {
                payments: []
            };

            /*for(var i in $scope.uniqPayments){
            $scope.paymentsArr = $scope.paymentsArr + ((i != 0)?",":'') +$scope.uniqPayments[i];
            }*/

            for (var i in $scope.uniqPayments) {
                $scope.paymentsArr.payments.push({
                    'PaymentID': $scope.uniqPayments[i]
                })
            }

            $http.post(BASEURL + '/rest' + actions.RestURL, $scope.paymentsArr).then(function onSuccess(response) {
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
        }
    }

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

    $scope.callthis = function() {
        return 10
    }

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

    $scope.override = "Override";

    $scope.overrideEnable = true;

    $scope.chekShowHide = function(status) {
        $scope.showOverride = false;
        $scope.statusCheck = status.split('_');

        var sArr = ["WAITING_OFACRESPONSE", "WAITING_FUNDSCONTROLRESPONSE", "WAITING_LIQUIDITYCONTROLRESPONSE"]

        if (sArr.indexOf(status) != -1) {
            $scope.showOverride = true;
        }

        /*if(status == 'WAITING_OFACRESPONSE'){

        }*/

        // if($scope.statusCheck[0].toUpperCase() == 'WAITING')
        // {
        // 	for(var i=0;i<=$scope.statusCheck.length;i++)
        // 	{
        // 		if($scope.statusCheck[$scope.statusCheck.length-1].indexOf('RESPONSE') != -1)
        // 		{
        // 			$scope.showOverride = true;
        // 		}
        // 	}
        // }

        return $scope.showOverride;
    }

    $scope.addsubSection = function(index) {
        delete $scope.crossTable.fields[index].$$hashKey;
        $scope.crossTable = cleantheinputdata($scope.crossTable)
        $scope.crossTable.fields[index] = cleantheinputdata($scope.crossTable.fields[index])


        if ($scope.crossTable.fields[index].columnName && $scope.crossTable.fields[index].columnValue) {
            $scope.crossTable.fields.push({});
        }

        $('.sectionCrossTabl').each(function(ind) {
            $scope.crossTable.fields[ind].CrossTableColumnName = JSON.parse(globRepeat)
            $(this).attr('details', JSON.stringify(globRepeat))
        })

        $scope.remoteDataConfig()
    }

    $scope.removesubSection = function(index) {
        $scope.crossTable.fields.splice(index, 1)
    }

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
                    /*else if($scope.lastDateKeyPressed == '8'){
                    if ($(this).val().length == 5){
                    $(this).val($scope.lastDateKeyValue+"-"+String.fromCharCode(keycode));
                    }else if ($(this).val().length == 8){
                    $(this).val($scope.lastDateKeyValue+"-"+String.fromCharCode(keycode));
                    }
                    }*/

                    //$scope.lastDateKeyValue=$(this).val();
                } else {
                    //$(this).val($scope.lastDateKeyValue);
                    event.preventDefault();
                }
                //$scope.lastDateKeyPressed=keycode;
            }

        });

        $(".dateTypeKey").focus(function() {
            $scope.datePlaceholderValue = $(this).attr('placeholder');
            $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
        }).blur(function() {
            $(this).attr('placeholder', $scope.datePlaceholderValue);
        })

    });

    function crossTable() {
        var generateQuery = {
            start: 0,
            count: 500
        }
        $http.get(BASEURL + "/rest/v2/crosstable/PaymentControlData", generateQuery).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //$scope.items = data;
            $scope.ColumnName = data;
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
            }]

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

        $http.get(BASEURL + "/rest/v2/crosstablenames").then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.CrossTableName = data;
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
            }]
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

        $http.get(BASEURL + "/rest/v2/crosstable/crosstable column names", generateQuery).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.CrossTableColumnName = data;
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
            }]
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    //crossTable();

    $scope.limit = 500;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {

            var myclm = [];
            setTimeout(function() {

                $(".crossTable").select2({
                    ajax: {
                        url: function() {

                            if ($(this).attr('id') == 'pcdClm') {
                                return BASEURL + "/rest/v2/crosstable/PaymentControlData"
                            } else if ($(this).attr('id') == 'crossTbleNme') {
                                return BASEURL + "/rest/v2/crosstablenames"
                            } else if ($(this).attr('id') == 'crossTbleClmNme') {
                                return BASEURL + "/rest/v2/crosstable/" + $scope.cTbleClmNme
                            } else {

                                if ($(this).attr('name') == 'repeatClmNme') {
                                    myclm = $(this);
                                    return BASEURL + "/rest/v2/crosstable/" + $scope.cTbleClmNme
                                }
                            }
                        },

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
                            var myarr = [];


                            for (j in data) {
                                myarr.push({
                                    'id': data[j].actualvalue,
                                    'text': data[j].displayvalue
                                })
                            }

                            if (myclm) {
                                globRepeat = JSON.stringify(data)

                                $(myclm).attr('details', JSON.stringify(data))

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
            }, 1000)
        }

        $scope.setSelect2 = function() {
            $scope.remoteDataConfig()
        }

        $scope.callDependedDrop = function(val) {
            $scope.cTbleClmNme = val;
            $('#crossTbleClmNme').select2('destroy');
            $('#crossTbleClmNme').val('')
            $('#crossTbleClmNme').select2()
            $('select[name=repeatClmNme]').select2('destroy');
            $('select[name=repeatClmNme]').val('')
            $('select[name=repeatClmNme]').select2()

            //$('#crossTbleClmNme').select2()
            $scope.remoteDataConfig()
        }

    });
   
    $scope.Export = function(){
        if($scope.Section == 'TransactionsACH' && $scope.newPermission.ExportTrAch){
            $scope.exportAllTransactions = true;
        }else if($scope.Section == 'AllTransactionsReceived' && $scope.newPermission.ExportTrAch){
            $scope.exportAllTransactions = true;
        }else if($scope.Section == 'SentTransactionsACH' && $scope.newPermission.ExportTrSent){
            $scope.exportAllTransactions = true;
        }else if($scope.Section == 'ReceivedTransactionsACH' && $scope.newPermission.ExportTrRec){
            $scope.exportAllTransactions = true;
        }else if($scope.Section == 'SOITransactions' && $scope.newPermission.ExportTrSoi){
            $scope.exportAllTransactions = true;
        }else if($scope.Section == 'SOITransactionsReceived' && $scope.newPermission.ExportTrSoi){
            $scope.exportAllTransactions = true;
        }else { 
            $scope.exportAllTransactions = false;
        }
    }
    $scope.validateEntity = function(entity, keyEntity){
        if(keyEntity == undefined || keyEntity.length == 0){
            if(entity.length == 1){
                keyEntity = entity[0].actualvalue;
            }else if(entity.length > 1){
                keyEntity= "Todos";
            }
        }
        return keyEntity;
    }

});
