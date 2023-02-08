angular.module('VolpayApp').controller('manualMatchingCtrl', function($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, http, EntityLockService) {
    $scope.Types = [];
    $scope.Matches = [];
    $scope.dataWith = [];

    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 

    $scope.getType = function() {
        $http.get('modules/manualmatching/type.json').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.Types = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }
    $scope.getType();

    $scope.selectType = function(arg) {
        var api = '';
        if (arg === 'paymentstatement') {
            api = 'match1.json'
        }
        if (arg === 'paymentconfirmation') {
            api = 'match2.json'
        }
        if (api) {
            $http.get('modules/manualmatching/' + api).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.Matches = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
        } else {
            $scope.Matches = [];
        }
    }


    $scope.selectmatch = function(arg, arg1) {
        var api = '';
        $scope.sectionThreeDatas = [];
        $scope.sectionTwoDatas = [];
        if ((arg1 === 'paymentstatement') && ((arg === 'customercredittransfer') || (arg === 'financialinstitutiontransfer'))) {
            api = 'with.json'
        }
        if ((arg1 === 'paymentstatement') && (arg === 'bankstatement')) {
            api = 'with2.json'
        }
        if ((arg1 === 'paymentconfirmation') && ((arg === 'customercredittransfer') || (arg === 'financialinstitutiontransfer'))) {
            api = 'with3.json'
        }
        if ((arg1 === 'paymentconfirmation') && (arg === 'MT900')) {
            api = 'with4.json'
        }


        if (api) {
            $http.get('modules/manualmatching/' + api).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.dataWith = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
        } else {
            $scope.dataWith = [];
        }
    }



    /* Reset Button Implementation */
    $scope.reset_form = function() {
        $scope.Matches = [];
        $scope.dataWith = [];
        $scope.matching = {};
        $scope.sectionThreeDatas = [];
        $scope.sectionTwoDatas = [];
    }
    var loadSectionOneapi, loadSectionOnequery, backuploadSectionOnequery;
    $scope.loadSectionOne = function(argu) {

        $scope.sectionThreeDatas = [];
        $scope.collectedData = {};
        $scope.OriginalPaymentFunction;
        len = 10;
        $('.FixHead, .FixHead1').scrollTop(0);
        if ((argu['Types'] === 'paymentstatement') && (argu['Match'] === 'customercredittransfer' || argu['Match'] === 'financialinstitutiontransfer')) {
            if (argu['Match'] === 'customercredittransfer') {
                $scope.OriginalPaymentFunction = "Customer Credit Transfer";
            } else {
                $scope.OriginalPaymentFunction = "Financial Institution Credit Transfer";
            }


            /*loadSectionOnequery = {"filters":{"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND","groupLvl3":[{"logicalOperator":"AND","clauses":[{"columnName":"StatementMatchingStatus","operator":"=","value":"WAIT_FOR_MATCH"}]}]}]}]},start: 0, count: 10, sorts: []};*/
            loadSectionOnequery = { params: [{ "ColumnName": "StatementMatchingStatus", "ColumnOperation": "=", "ColumnValue": "WAIT_FOR_MATCH" }, { "ColumnName": "Status", "ColumnOperation": "=", "ColumnValue": "ACCEPTED" }, { "ColumnName": "OriginalPaymentFunction", "ColumnOperation": "=", "ColumnValue": $scope.OriginalPaymentFunction }], start: 0, count: 10, sorts: [] }

            loadSectionOneapi = '/rest/v2/stmtdetails/AccountPostingPCD';
        } else if ((argu['Match'] === 'bankstatement') && (argu['Types'] === 'paymentstatement')) {
            /*loadSectionOnequery = {"filters":{"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND","groupLvl3":[
             {"logicalOperator":"AND","clauses":[{"columnName":"MATCHINGSTATUS","operator":"=","value":"UNMATCHED"}]}]}]}]},start: 0, count: 10, sorts: []};*/
            loadSectionOnequery = { params: [{ "ColumnName": "MATCHINGSTATUS", "ColumnOperation": "=", "ColumnValue": "UNMATCHED" }], start: 0, count: 10, sorts: [] }
            loadSectionOneapi = '/rest/v2/stmtdetails/read';

        } else if ((argu['Types'] === 'paymentconfirmation') && (argu['Match'] === 'customercredittransfer' || argu['Match'] === 'financialinstitutiontransfer') && (argu['With'] === 'MT900')) {
            if (argu['Match'] === 'customercredittransfer') {
                $scope.OriginalPaymentFunction = "Customer Credit Transfer";
            } else {
                $scope.OriginalPaymentFunction = "Financial Institution Credit Transfer";
            }


            /*loadSectionOnequery = {"filters":{"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND","groupLvl3":[{"logicalOperator":"AND","clauses":[{"columnName":"StatementMatchingStatus","operator":"=","value":"WAIT_FOR_MATCH"}]}]}]}]},start: 0, count: 10, sorts: []};*/
            loadSectionOnequery = { params: [{ "ColumnName": "Status", "ColumnOperation": "=", "ColumnValue": "DELIVERED" }, { "ColumnName": "OriginalPaymentFunction", "ColumnOperation": "=", "ColumnValue": $scope.OriginalPaymentFunction }], start: 0, count: 10, sorts: [] }


            loadSectionOneapi = '/rest/v2/payments/readall';
        } else if ((argu['Types'] === 'paymentconfirmation') && (argu['Match'] === 'MT900')) {
            loadSectionOnequery = { params: [{ "ColumnName": "CONFPROCESSINGStatus", "ColumnOperation": "=", "ColumnValue": "COMPLETED" }], start: 0, count: 10, sorts: [] }
            loadSectionOneapi = '/rest/v2/confirmations/readall';
        }

        backuploadSectionOnequery = angular.copy(loadSectionOnequery);
        if (loadSectionOneapi) {
            $http.post(BASEURL + loadSectionOneapi, $scope.uorQueryConstruct(loadSectionOnequery)).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionTwoDatas = data;
                $scope.sectionTwoloadDatas = data;

                $('.alert-danger').hide();
                setTimeout(function() {
                    customDateRangePicker('CuststartDate', 'CustendDate')
                    customDateRangePicker("EntryValueDate_Stmt")
                    customDateRangePicker("ValueDate_Payment")
                    customDateRangePicker("EntryDateStart", "EntryDateEnd")
                    $('.input-group-text').on('click focus', function(e) {
                        $(this).prev().focus().click()

                    })

                    $(".selectCheckbox1").change(function(e) {
                        var checked = $(this).prop('checked')
                        $(".selectCheckbox1").prop('checked', false);
                        if (checked) {
                            $(this).prop('checked', true);
                        } else {
                            if ($(this).attr('ng-click').indexOf('payment') !== -1) {
                                delete $scope.collectedData['payment'];
                            } else if ($(this).attr('ng-click').indexOf('statement') !== -1) {
                                delete $scope.collectedData['statement'];
                            }
                            $scope.$apply(function() {
                                $scope.collectedData = $scope.collectedData;
                            })
                        }
                    });

                    $(".selectCheckbox").change(function(e) {
                        var checked = $(this).prop('checked')
                        $(".selectCheckbox").prop('checked', false);
                        if (checked) {
                            $(this).prop('checked', true);
                        } else {
                            if ($(this).attr('ng-click').indexOf('payment') !== -1) {
                                delete $scope.collectedData['payment'];
                            } else if ($(this).attr('ng-click').indexOf('statement') !== -1) {
                                delete $scope.collectedData['statement'];
                            }
                            $scope.$apply(function() {
                                $scope.collectedData = $scope.collectedData;
                            })
                        }
                    });

                    $('.selectField').select2();
                    $(".FixHead").scroll(function(e) {
                        var $tablesToFloatHeaders = $('table.maintable');

                        $tablesToFloatHeaders.floatThead({

                            scrollContainer: true
                        })
                        $tablesToFloatHeaders.each(function() {
                            var $table = $(this);

                            $table.closest('.FixHead').scroll(function(e) {
                                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                                    if ($scope.sectionTwoloadDatas.length >= 10) {

                                        debounceHandler()
                                            // _.debounce($scope.SectionTwoloadData, 700, true);
                                    }
                                }
                                $table.floatThead('reflow');
                            });
                        });
                    })
                    $(".FixHead1").scroll(function(e) {
                        var $tablesToFloatHeaders = $('table.maintable');

                        $tablesToFloatHeaders.floatThead({

                            scrollContainer: true
                        })
                        $tablesToFloatHeaders.each(function() {
                            var $table = $(this);

                            $table.closest('.FixHead1').scroll(function(e) {
                                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                                    if ($scope.sectionThreeloadDatas.length >= 10) {

                                        debounceHandlerTwo()

                                    }
                                }
                                $table.floatThead('reflow');
                            });
                        });
                    });
                }, 100);
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionTwoDatas = [];
                if (data.error.code == 401) {
                    LogoutService.Logout();
                } else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                }
            });
        } else {
            $scope.sectionTwoDatas = []
        }

    }


    //FUCNTION for PASSING THE PAYMENT DATA to MATCH Button //
    $scope.collectedData = {}
    $scope.collectdata = function(data) {
        $scope.collectedData = Object.assign($scope.collectedData, data)
    }

    var webformKeys = [];
    $scope.resetWebform = function(collectedData) {
        if (collectedData['AdjustmentAccountEntriesConfirmation'] && Object.keys(collectedData['AdjustmentAccountEntriesConfirmation']).length) {
            webformKeys = Object.keys(collectedData['AdjustmentAccountEntriesConfirmation']);
        }
        webformKeys.forEach(function(val) {
            setTimeout(function(name) {
                $('[name=' + name + ']').val('NO').trigger('change');
                $('[name=' + name + ']').val('').trigger('change.select2');
                delete collectedData['AdjustmentAccountEntriesConfirmation'][name];
            }, 100, val)
        })
    }

    //FUCNTION for CALLING THE NEW REST CALL //

    $scope.NEWFUNCTION = function(collectedData, flag) {
        if (!flag) {
            $scope.resetWebform(collectedData);
        }
        var api, query, callAPI = '';
        if ((collectedData['payment']['Amount'] !== collectedData['statement']['StatementEntryDetails']['EntryAmount']) || flag) {
            $('#matchconfirmation').modal('toggle');
            $scope.saveChangesMetaInfo();
            if (!collectedData['AdjustmentAccountEntriesConfirmation']) {
                collectedData['AdjustmentAccountEntriesConfirmation'] = {};
            }
            //$scope.Loadaccno();
            callAPI = flag;
            // query = { PaymentIDs : collectedData.payment.PaymentID , StatementID : collectedData.statement.EntryReferenceId , GenerateAutoAccntingEntries : collectedData.yesno , AdjustmentAccnt:collectedData.Load };
            query = { PaymentIDs: collectedData.payment.PaymentID, StatementID: collectedData.statement.EntryReferenceId, AdjustmentAccountEntriesConfirmation: collectedData['AdjustmentAccountEntriesConfirmation'], AccountPostingPCDDetails: collectedData.payment };
        } else {
            callAPI = true;
            //query = {PaymentIDs : collectedData.payment.PaymentID , StatementID : collectedData.statement.EntryReferenceId , GenerateAutoAccntingEntries : false }
            query = { PaymentIDs: collectedData.payment.PaymentID, StatementID: collectedData.statement.EntryReferenceId, AdjustmentAccountEntriesConfirmation: collectedData['AdjustmentAccountEntriesConfirmation'], AccountPostingPCDDetails: collectedData.payment };
        }

        api = '/rest/v2/invoke/reconposting';
        if (callAPI) {
            if (api) {

                $http.post(BASEURL + api, query).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.section = data;
                    $scope.alerts = [{
                        type: 'success',
                        msg: data.responseMessage
                    }];
                    $scope.resetWebform(collectedData);
                    $scope.reset_form();
                    //$scope.loadSectionOne($scope.matching);
                    //$('.alert-danger').hide();
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.section = [];
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.responseMessage
                    }];
                    
                    /* $scope.section = [];
                    if (data.error.code == 401) {	
                    	LogoutService.Logout();
                    } else {
                    	$scope.alerts = [{
                    	type : 'danger',
                    	msg : data.error.message
                    	}];
                    } */
                });
            } else {
                $scope.sectionThreeDatas = [];
            }
        }
    }

    $scope.metaInfoSaveChanges = '';
    $scope.dataSaveChanges = {};
    $scope.popupWebformSubmit = false;
    $scope.saveChangesMetaInfo = function() {
        if ($.isEmptyObject($scope.metaInfoSaveChanges)) {
            http.crudRequest({ method: 'GET', url: '/rest/v2/forcematch/metainfo' }).then(function(response) {
                $scope.metaInfoSaveChanges = beautifyObj(response.data);
            })
        }
    }


    /*$scope.Loadaccno = function() {
        	var len = 0;
		$http.get(BASEURL + '/rest/v2/accounts/number?start=0&count=500').then(function onSuccess(response) {
			// Handle success
			var data = response.data;
			var status = response.status;
			var statusText = response.statusText;
			var headers = response.headers;
			var config = response.config;

			$scope.Load = data;
		}).catch(function onError(response) {
			// Handle error
			var data = response.data;
			var status = response.status;
			var statusText = response.statusText;
			var headers = response.headers;
			var config = response.config;
		});
	}*/


    var loadTwoapi, loadTwoquery, backuploadTwoquery = '';
    $scope.OriginalPaymentFunc;
    $scope.loadSectionTwo = function(argu, matching, eve) {
        len = 10;
        $('.FixHead, .FixHead1').scrollTop(0);
        if (matching['With'] === 'bankstatement' && matching['Types'] === 'paymentstatement') {
            loadTwoquery = { params: [{ "ColumnName": "MATCHINGSTATUS", "ColumnOperation": "=", "ColumnValue": "UNMATCHED" }, { "ColumnName": "STMTACCOUNTNO", "ColumnOperation": "=", "ColumnValue": argu.AccountID }, { "ColumnName": "ENTRYCURRENCY", "ColumnOperation": "=", "ColumnValue": argu.AccountCCY }], start: 0, count: 10, sorts: [] };
            loadTwoapi = '/rest/v2/stmtdetails/read';

        } else if ((matching['With'] === 'customercredittransfer' || matching['With'] === 'financialinstitutiontransfer') && matching['Types'] === 'paymentstatement') {
            if (matching['With'] === 'customercredittransfer' && matching['Types'] === 'paymentstatement') {
                $scope.OriginalPaymentFunc = "Customer Credit Transfer";
            } else {
                $scope.OriginalPaymentFunc = "Financial Institution Credit Transfer";
            }

            loadTwoquery = {
                params: [{ "ColumnName": "StatementMatchingStatus", "ColumnOperation": "=", "ColumnValue": "WAIT_FOR_MATCH" }, { "ColumnName": "Status", "ColumnOperation": "=", "ColumnValue": "ACCEPTED" }, { "ColumnName": "OriginalPaymentFunction", "ColumnOperation": "=", "ColumnValue": $scope.OriginalPaymentFunc }, { "ColumnName": "ACCOUNTID", "ColumnOperation": "=", "ColumnValue": argu.StatementData.StatementAccountDetails.StmtAccountNo },
                    { "ColumnName": "ACCOUNTCCY", "ColumnOperation": "=", "ColumnValue": argu.StatementEntryDetails.EntryCurrency }
                ],
                start: 0,
                count: 10,
                sorts: []
            };

            loadTwoapi = '/rest/v2/stmtdetails/AccountPostingPCD';

        } else if (matching['With'] === 'MT900' && matching['Types'] === 'paymentconfirmation')

        {

            loadTwoquery = { params: [{ "ColumnName": "CONFPROCESSINGStatus", "ColumnOperation": "=", "ColumnValue": "COMPLETED" }], start: 0, count: 10, sorts: [] }


            loadTwoapi = '/rest/v2/confirmations/readall';

        }

        backuploadTwoquery = angular.copy(loadTwoquery);
        if (loadTwoapi) {
            $http.post(BASEURL + loadTwoapi, $scope.uorQueryConstruct(loadTwoquery)).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionThreeDatas = data;
                $scope.sectionThreeloadDatas = data;

                $(eve.currentTarget).parent().parent().find('tr').removeClass("highlight");
                $(eve.currentTarget).parent().addClass("highlight");
                $('.alert-danger').hide();
                setTimeout(function() {
                    customDateRangePicker('CuststartDate', 'CustendDate')
                    customDateRangePicker("EntryValueDate_Stmt")
                    customDateRangePicker("ValueDate_Payment")
                    customDateRangePicker("EntryDateStart", "EntryDateEnd")
                    $('.input-group-text').on('click focus', function(e) {
                        $(this).prev().focus().click()

                    })

                    $(".selectCheckbox1").change(function(e) {
                        var checked = $(this).prop('checked')
                        $(".selectCheckbox1").prop('checked', false);
                        if (checked) {
                            $(this).prop('checked', true);
                        } else {
                            if ($(this).attr('ng-click').indexOf('payment') !== -1) {
                                delete $scope.collectedData['payment'];
                            } else if ($(this).attr('ng-click').indexOf('statement') !== -1) {
                                delete $scope.collectedData['statement'];
                            }
                            $scope.$apply(function() {
                                $scope.collectedData = $scope.collectedData;
                            })
                        }
                    });

                    $(".selectCheckbox").change(function(e) {
                        var checked = $(this).prop('checked')
                        $(".selectCheckbox").prop('checked', false);
                        if (checked) {
                            $(this).prop('checked', true);
                        } else {
                            if ($(this).attr('ng-click').indexOf('payment') !== -1) {
                                delete $scope.collectedData['payment'];
                            } else if ($(this).attr('ng-click').indexOf('statement') !== -1) {
                                delete $scope.collectedData['statement'];
                            }
                            $scope.$apply(function() {
                                $scope.collectedData = $scope.collectedData;
                            })
                        }
                    });
                    $('.selectField').select2();
                    $(".FixHead").scroll(function(e) {
                        var $tablesToFloatHeaders = $('table.maintable');

                        $tablesToFloatHeaders.floatThead({

                            scrollContainer: true
                        })
                        $tablesToFloatHeaders.each(function() {
                            var $table = $(this);

                            $table.closest('.FixHead').scroll(function(e) {
                                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                                    if ($scope.sectionTwoloadDatas.length >= 10) {

                                        debounceHandler()

                                    }
                                }
                                $table.floatThead('reflow');
                            });
                        });
                    })
                    $(".FixHead1").scroll(function(e) {
                        var $tablesToFloatHeaders = $('table.maintable');

                        $tablesToFloatHeaders.floatThead({

                            scrollContainer: true
                        })
                        $tablesToFloatHeaders.each(function() {
                            var $table = $(this);

                            $table.closest('.FixHead1').scroll(function(e) {
                                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                                    if ($scope.sectionThreeloadDatas.length >= 10) {

                                        debounceHandlerTwo()

                                    }
                                }
                                $table.floatThead('reflow');
                            });
                        });
                    });
                }, 100);
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionThreeDatas = [];

                if (data.error.code == 401) {
                    LogoutService.Logout();
                } else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                }
            });
        } else {
            $scope.sectionThreeDatas = []
        }

    }

    $scope.distSearch1=true;
    $scope.distSearch2=true;
    $scope.distSearch3=true;
    $scope.distSearch4=true;
    $scope.advanceSearchCollaspe = function(arg){
        
        if(arg=='distSearch1'){
            if($scope.distSearch1){
                $('#distSearch1').collapse('show')
            }
            else{
                $('#distSearch1').collapse('hide')
            }
            $scope. distSearch1=!$scope.distSearch1;
        }
        if(arg=='distSearch2'){
            if($scope.distSearch2){
                $('#distSearch2').collapse('show')
            }
            else{
                $('#distSearch2').collapse('hide')
            }
            $scope. distSearch2=!$scope.distSearch2;
        }
        if(arg=='distSearch3'){
            if($scope.distSearch3){
                $('#distSearch3').collapse('show')
            }
            else{
                $('#distSearch3').collapse('hide')
            }
            $scope.distSearch3=!$scope.distSearch3;
        }
        if(arg=='distSearch4'){
            if($scope.distSearch4){
                $('#distSearch4').collapse('show')
            }
            else{
                $('#distSearch4').collapse('hide')
            }
            $scope. distSearch4=!$scope.distSearch4;
        }
        
    }

    $scope.refresh = function() {
        $scope.initCall(JSON.parse(sessionStorage.distributedObj))
        $('.table-responsive').find('table').find('thead').find('th').find('span').removeAttr('class');
    }

    $scope.FieldsValues = [{
        "label": "Instruction ID",
        "fieldName": "InstructionID",
        "type": "text",
        "allow": "number",
        "visible": true
    }, {
        "label": "Instruction Status",
        "fieldName": "FileStatus",
        "type": "dropdown",
        "visible": true
    }, {
        "label": "Entry Date",
        "fieldName": "EntryDate",
        "type": "dateRange",
        "allow": "date",

        "visible": true
    }, {
        "label": "PSA Code",
        "fieldName": "InputReferenceCode",
        "type": "dropdown",
        "allow": "string",
        "visible": true
    }, {
        "label": "Instruction Name",
        "fieldName": "TransportName",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Original Instruction ID",
        "fieldName": "OrigInstrID",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Instruction Type",
        "fieldName": "InstructionType",
        "type": "dropdown",
        "allow": "string",
        "visible": true
    }];

    /* ValueDate and EntryDate*/

    $scope.activatePicker = function(e) {

        var prev = null;
        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            useCurrent: true,
            showClear: true
        }).on('dp.change', function(ev) {



            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('ng-model').split('.')[1]] = $(ev.currentTarget).val();

        }).on('dp.show', function(ev) {

        }).on('dp.hide', function(ev) {
            $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                "overflow-y": "auto"
            });
            $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                $(this).css({
                    "display": ""
                });
            })
        });



        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: true
        }).on('dp.change', function(ev) {


            if ($(ev.currentTarget).attr('ng-model').split('.')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$('#' + pId).children().length - 2][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            }


        }).on('dp.show', function(ev) {
            $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                "overflow-y": ""
            });
            if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                    if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) {} else {
                        $(this).css({
                            "display": "none"
                        });
                    }
                })
            }
        }).on('dp.hide', function(ev) {
            $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                "overflow-y": "auto"
            });
            $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                $(this).css({
                    "display": ""
                });
            })
        });

        $('.input-group-text').on('click focus', function(e) {
            $(this).prev().focus().click()
        });
    }




    /* Load more */
    var len = 10;
    $scope.SectionTwoloadData = function(query) {

        loadSectionOnequery.start = len;

        $http.post(BASEURL + loadSectionOneapi, $scope.uorQueryConstruct(loadSectionOnequery)).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.sectionTwoDatas = $scope.sectionTwoDatas.concat(data);
            $scope.sectionTwoloadDatas = data;
            len = len + 10;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

    var debounceHandler = _.debounce($scope.SectionTwoloadData, 700, true);

    $scope.SectionThreeloadData = function(query) {

        loadTwoquery.start = len;
        $http.post(BASEURL + loadTwoapi, $scope.uorQueryConstruct(loadTwoquery)).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.sectionThreeDatas = $scope.sectionThreeDatas.concat(data);
            $scope.sectionThreeloadDatas = data;
            len = len + 10;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

    var debounceHandlerTwo = _.debounce($scope.SectionThreeloadData, 700, true);

    jQuery(
        function($) {
            $('#sectionTwoTableOne').bind('scroll', function() {

                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.sectionTwoloadDatas.length >= 10) {

                        debounceHandlerTwo()

                    }
                }
            })
            setTimeout(function() {}, 1000)
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
    $(document).ready(function() {
        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table.maintable');

            $tablesToFloatHeaders.floatThead({

                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);

                $table.closest('.FixHead').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        })
        $(".FixHead1").scroll(function(e) {
            var $tablesToFloatHeaders = $('table.maintable');

            $tablesToFloatHeaders.floatThead({

                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);

                $table.closest('.FixHead1').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        })
    })

    /** Advance Search Functionlities*/
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

    $scope.uorQueryConstruct = function(arr, flag) {
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
        /** Advance Search for Payment*/
    $scope.paymentstatementField = [{
        "label": "Instruction ID",
        "value": "InstructionID",
        "type": "text",
        "allow": "number",
        "visible": true
    }, {
        "label": "Payment ID",
        "value": "PaymentID",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Payment Reference",
        "value": "OriginalPaymentReference",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Value Date",
        "value": "ValueDate",
        "type": "dateRange",
        "allow": "date",
        "visible": true
    }]

    /** Advance Search for Statement*/
    $scope.statementpaymentField = [{

            "label": "Statement Instruction ID",
            "value": "InstructionID",
            "type": "text",
            "allow": "number",
            "visible": true
        }, {
            "label": "Transaction End To End Reference",
            "value": "EntryTxnE2EId",
            "type": "text",
            "allow": "string",
            "visible": true
        }, {

            "label": "Entry Reference ID",
            "value": "EntryReferenceId",
            "type": "text",
            "allow": "string",
            "visible": true
        },
        {
            "label": "Value Date",
            "value": "EntryValueDate",
            "type": "dateRange",
            "allow": "date",
            "visible": true
        }

    ]

    $scope.paymentconfirmationField = [{

        "label": "Output Instruction ID",
        "value": "OutputInstructionID",
        "type": "text",
        "allow": "number",
        "visible": true
    }, {
        "label": "Payment ID",
        "value": "PaymentID",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Payment Reference",
        "value": "OriginalPaymentReference",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Value Date",
        "value": "ValueDate",
        "type": "dateRange",
        "allow": "date",
        "visible": true
    }, {
        "label": "Method Of Payment",
        "value": "MethodOfPayment",
        "type": "text",
        "allow": "string",
        "visible": true
    }, {
        "label": "Payment CCY",
        "value": "Currency",
        "type": "text",
        "allow": "string",
        "visible": true
    }]

    $scope.confirmationpaymentField = [{
            "label": "Payment ID",
            "value": "PaymentID",
            "type": "text",
            "allow": "string",
            "visible": true
        }, {
            "label": "Confirmation ID",
            "value": "CCDID",
            "type": "text",
            "allow": "string",
            "visible": true
        }, {
            "label": "ConfProcessingStatus",
            "value": "ConfProcessingStatus",
            "type": "text",
            "allow": "string",
            "visible": true
        }, {
            "label": "ConfStatusCode",
            "value": "ConfStatusCode",
            "type": "text",
            "allow": "string",
            "visible": true
        }

    ]

    $scope.limit = 500

    $scope.search = {};
    $scope.ResetForm = function(argu) {
        argu = {};
        return argu;
    }
    $scope.buildSearch = function(eve,arg) {
 
        $scope.search = $scope.cleantheinputdata($scope.search)

            if(arg=='distSearch1'){
            $scope.distSearch1=!$scope.distSearch1;
            }
            if(arg=='distSearch2'){
            $scope.distSearch2=!$scope.distSearch2;
            }
            if(arg=='distSearch3'){
            $scope.distSearch3=!$scope.distSearch3;
            }
            if(arg=='distSearch4'){
            $scope.distSearch4=!$scope.distSearch4;
            }

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
        len = 0;
        if (($(eve.currentTarget).closest('div[id="Match"]').length) /* && ($scope.matching['Match'] === 'customercredittransfer' || $scope.matching['Match'] === 'financialinstitutiontransfer' || $scope.matching['Match'] === 'bankstatement') */ ) {
            loadSectionOnequery = angular.copy(backuploadSectionOnequery);
            loadSectionOnequery.params = loadSectionOnequery.params.concat($scope.searchArr);
            $http.post(BASEURL + loadSectionOneapi, $scope.uorQueryConstruct(loadSectionOnequery)).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionTwoDatas = data;
                $scope.sectionTwoloadDatas = data;
                $scope.search = $scope.ResetForm($scope.search);
                $('.alert-danger').hide()
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionTwoDatas = [];
                if (data.error.code == 401) {
                    LogoutService.Logout();
                } else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                }
            });
        } else if (($(eve.currentTarget).closest('div[id="With"]').length) /*  && ($scope.matching['With'] === 'bankstatement' || $scope.matching['With'] === 'customercredittransfer') */ ) {
            loadTwoquery = angular.copy(backuploadTwoquery);
            loadTwoquery.params = loadTwoquery.params.concat($scope.searchArr);
            $http.post(BASEURL + loadTwoapi, $scope.uorQueryConstruct(loadTwoquery)).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionThreeDatas = data;
                $scope.sectionThreeloadDatas = data;
                $(eve.currentTarget).parent().parent().find('tr').removeClass("highlight");
                $(eve.currentTarget).parent().addClass("highlight");
                $('.alert-danger').hide();
                $scope.search = $scope.ResetForm($scope.search);
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.sectionThreeDatas = [];
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
    }
    $scope.uorVal = {};
    $scope.uorSearch = function(eve) {
        if (Object.values($scope.uorVal).length) {
            len = 0;
            var _searchArr = [{ "ColumnName": Object.keys($scope.uorVal)[0], "ColumnOperation": "=", "ColumnValue": Object.values($scope.uorVal)[0].trim() }]
            if (($(eve.currentTarget).closest('div[id="Match"]').length) /* && ($scope.matching['Match'] === 'customercredittransfer' || $scope.matching['Match'] === 'financialinstitutiontransfer' || $scope.matching['Match'] === 'bankstatement') */ ) {
                loadSectionOnequery = angular.copy(backuploadSectionOnequery);
                loadSectionOnequery.params = loadSectionOnequery.params.concat(_searchArr);
                $http.post(BASEURL + loadSectionOneapi, $scope.uorQueryConstruct(loadSectionOnequery)).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.sectionTwoDatas = data;
                    $scope.sectionTwoloadDatas = data;
                    $scope.uorVal = $scope.ResetForm($scope.uorVal)
                    $('#searchBox').val('');
                    $('.alert-danger').hide()
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.sectionTwoDatas = [];
                    if (data.error.code == 401) {
                        LogoutService.Logout();
                    } else {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: data.error.message
                        }];
                    }
                });
            } else if (($(eve.currentTarget).closest('div[id="With"]').length) /*  && ($scope.matching['With'] === 'bankstatement' || $scope.matching['With'] === 'customercredittransfer') */ ) {
                loadTwoquery = angular.copy(backuploadTwoquery);
                loadTwoquery.params = loadTwoquery.params.concat(_searchArr);
                $http.post(BASEURL + loadTwoapi, $scope.uorQueryConstruct(loadTwoquery)).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.sectionThreeDatas = data;
                    $scope.sectionThreeloadDatas = data;
                    $(eve.currentTarget).parent().parent().find('tr').removeClass("highlight");
                    $(eve.currentTarget).parent().addClass("highlight");
                    $('.alert-danger').hide()
                    $scope.uorVal = $scope.ResetForm($scope.uorVal);
                    $('#searchBox').val('');
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.sectionThreeDatas = [];
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
        }
    }
});
