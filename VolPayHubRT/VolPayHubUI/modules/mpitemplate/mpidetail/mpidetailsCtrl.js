angular.module('VolpayApp').controller('mpidetailsCtrl', function($scope, $http, $state, $location, $stateParams, $timeout, $interval, GlobalService, EntityLockService, LogoutService, $filter, getMethodService, $rootScope, errorservice, datepickerFaIcons) {
    var authenticationObject = $rootScope.dynamicAuthObj;
    $('.select2-dropdown').css('display', 'none');
    $scope.madeChanges = false;
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })

    $rootScope.$on("MyEventforEditIdleTimeout", function(evt, data) {
        $(window).off("mousemove keydown click");
        $interval.cancel(findEvent);
    });

    if ($stateParams.input) {
        $scope.permission = {
            'C': $stateParams.input["C"],
            'D': $stateParams.input["D"],
            'R': $stateParams.input["R"],
            'U': $stateParams.input["U"],
            'ReActivate': $stateParams.input["ReActivate"]
        }
    }
    $scope.strData = [];
    $scope.FXRate = GlobalService.specificData;
    $scope.fromAddNew = GlobalService.fromAddNew;
    $scope.ViewClicked = GlobalService.ViewClicked;
    $scope.TemplateDetails1234 = $scope.FXRate;
    $.each($scope.FXRate, function(k, v) {
        $scope.strData.push({
            'label': k,
            'value': v
        })
    });


    //idletime Start
    var findEvent;
    var secondfindEvent;
    $scope.count = 0;
    $scope.seccount = 10;   
    var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
    editTimeoutCounter = 10;
    if(!$scope.ViewClicked && !$scope.fromAddNew) {
        // Start Idle Timeout 
        $scope.findIdleTime = function() {
            findEvent = $interval(function() {
                $(window).on("mousemove keydown click", function() { // find the window event
                    //$scope.stopIdleTimer();
                    $scope.count = 0;
                    //$scope.findIdleTime();
                });
                $scope.count += 1;
                // console.log($scope.count);
                if ($scope.count === editTimeoutCounter) {
                    // $scope.stopIdleTimer();
                    // $stateParams.input.Operation = "";
                    // $scope.callIdleTime();
                    if (!$scope.ViewClicked && !$scope.fromAddNew) {
                        $scope.stopIdleTimer();
                       // $scope.stopsecondIdleTimer();
                        $scope.unlockEntityToEdit();
                        //$scope.gotoParent();
                    }
                }
            }, 1000);

        };
        $scope.findIdleTime();

        $scope.callIdleTime = function() {
            
            setTimeout(function() {
                $("#idletimeout_model").modal("show");
            }, 100)

            secondfindEvent = $interval(function() {
               
                $(window).on("mousemove keydown click", function() { // find the window event
                    $scope.stopsecondIdleTimer();
                    $scope.seccount = 10;
                    // $scope.findIdleTime();
                    setTimeout(function() {
                        $("#idletimeout_model").modal("hide");
                    }, 100)

                });
                $scope.seccount -= 1;
             
                if ($scope.seccount === 0) {
                    $scope.stopsecondIdleTimer();
                    $scope.gotoParent();
                }
            }, 1000);
        }
    }else{
    //    $scope.stopIdleTimer();
    //    $scope.stopsecondIdleTimer();
    }
    
   
       $scope.stopsecondIdleTimer = function() {
           if (angular.isDefined(secondfindEvent)) { 
               // $(window).off('mousemove keydown click', secondfindEvent); 
               $(window).off( "mousemove keydown click" );           
               // clearInterval(secondfindEvent)              
               $interval.cancel(secondfindEvent);
               secondfindEvent = undefined;
            }
       };
   
       $scope.stopIdleTimer = function() {
           if (angular.isDefined(findEvent)) {     
               $interval.cancel(findEvent);
               findEvent = undefined;
            }
       };

    $scope.unlockEntityToEdit = function() {
        var stateLockedObj = {};

        var data = {};
            data = {
                TableName: 'MPITemplate',
                BusinessPrimaryKey : {},
                IsLocked: false
            };

        if($stateParams.input && $stateParams.input.lockDataObj) {
            stateLockedObj = $stateParams.input.lockDataObj;
            data.BusinessPrimaryKey  = stateLockedObj.BusinessPrimaryKey;
        }

        EntityLockService.checkEntityLock(data).then(function(data){
            $rootScope.dataModified = $scope.madeChanges;
            $scope.fromCancelClick = true;
            if (!$scope.madeChanges) {
                $location.path('app/mpitemplate');
            } // goto Previous page
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
             // uncomment 
        //  $rootScope.dataModified = $scope.madeChanges;
        //  $scope.fromCancelClick = true;
        //  if (!$scope.madeChanges) {
        //      $location.path('app/mpitemplate');
        //  } // goto Previous page
      //
         }); 
        
    }

   
    $scope.selectOptions = [];
    $scope.PaymentDetails = {};
    $scope.OrderingCustomer = {};
    $scope.BeneficiaryBank = {};
    $scope.Beneficiary = {};
    $scope.PaymentInformation = {};
    $scope.RemittanceInformation = {};
    $scope.DiscountAppliedAmount = {};
    $scope.ReferedDocInforation = {};
    $scope.UltimateDebtor = {};
    $scope.UltimateCreditor = {};
    $scope.IntermediaryBankDetails123 = [];
    $scope.isOrderingCustomerCollapsed = true;
    $scope.isBenenficiaryBankDetailsCollapsed = true;
    $scope.isBenenficiaryDetailsCollapsed = true;
    $scope.isPaymentInfoCollapsed = true;
    $scope.isRemittanceInformationCollapsed = true;
    $scope.isUltimateDebtorCollapsed = true;
    $scope.isUltimateCreditorCollapsed = true;
    $scope.SaveTemplateCollapsed = true;
    $scope.serviceIsNotSingle = true;
    $scope.CurrencyDecimalDigits = 3;
    $scope.service11 = '';
    $scope.forUSRTP = {};
    $scope.Templateloading = false;
    $scope.SaveTemplate = false;
    $scope.saveAsDraft = false;
    $scope.TemplateDetails = {}
    $scope.ProductsSupported123 = '';
    $scope.RemitInfoMaxLength = 140;
    $scope.DescriptionMaxLength = 3000;
    $scope.ServiceCodeForConditions = '';
    $scope.PartySelectedFlag = false;
    $scope.OrderingCustomerAccountNumber = '';
    $scope.collapseAll = function() {
        $scope.isPaymentDetailsCollapsed = true;
        $scope.isOrderingCustomerCollapsed = true;
        $scope.isBenenficiaryBankDetailsCollapsed = true;
        $scope.isBenenficiaryDetailsCollapsed = true;
        $scope.isPaymentInfoCollapsed = true;
        $scope.isRemittanceInformationCollapsed = true;
        $scope.isRefferdDocInfoCollapsed = true;
        $scope.isDiscountAppliedAmountCollapsed = true;
        $scope.isUltimateDebtorCollapsed = true;
        $scope.isUltimateCreditorCollapsed = true;
        $scope.SaveTemplateCollapsed = true;
        $scope.activatePicker();
    }
    $scope.expandAll = function() {
        $scope.isPaymentDetailsCollapsed = false;
        $scope.isOrderingCustomerCollapsed = false;
        $scope.isBenenficiaryBankDetailsCollapsed = false;
        $scope.isBenenficiaryDetailsCollapsed = false;
        $scope.isPaymentInfoCollapsed = false;
        $scope.isRemittanceInformationCollapsed = false;
        $scope.isRefferdDocInfoCollapsed = false;
        $scope.isDiscountAppliedAmountCollapsed = false;
        $scope.isUltimateDebtorCollapsed = false;
        $scope.isUltimateCreditorCollapsed = false;
        $scope.SaveTemplateCollapsed = false;
        $scope.activatePicker();
    }

    $scope.expandAllManually = function() {
        $scope.expandAll();
        $(".addCollapse").addClass('in').css({
            'height': 'auto'
        });
        if (!$('.customClass').hasClass('in')) {
            $(".customClass").addClass('in').css({
                'height': 'auto'
            });
        }
    }

    $scope.Reload = function() {
        $rootScope.$emit('MyEventforEditIdleTimeout', true);
        $rootScope.dataModified = false;
        $state.reload();
        $scope.isPaymentDetailsCollapsed = true;
        $scope.isOrderingCustomerCollapsed = true;
        $scope.isBenenficiaryBankDetailsCollapsed = true;
        $scope.isBenenficiaryDetailsCollapsed = true;
        $scope.isPaymentInfoCollapsed = true;
        $scope.isRemittanceInformationCollapsed = true;
        $scope.isUltimateDebtorCollapsed = true;
        $scope.isUltimateCreditorCollapsed = true;
        $scope.SaveTemplateCollapsed = true;
        $scope.activatePicker();
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

    /**
     * 
     * */
    $scope.refferdDocInfoData = { originalCreditTransfer: { name: 'OCT', isMandate: false, value: '' }, date: { name: 'relDate', isMandate: false, value: '' } };

    $scope.daaCodes = [{ actualvalue: 'FULL', displayvalue: 'Full', isDisabled: false }, { actualvalue: 'DSCT', displayvalue: 'Discount', isDisabled: false }, { actualvalue: 'ORIG', displayvalue: 'Original', isDisabled: false }];
    $scope.discountAppliedAmountGrp = [{ daaCodes: $scope.daaCodes, code: '-1', value: '', isDisabaled: false, isValueMandate: false, isCodeMandate: false }];
    $scope.removeFormGrp = function(index) {
        $scope.discountAppliedAmountGrp.splice(index, 1)
    };
    $scope.addFormGrp = function() {
        if ($scope.discountAppliedAmountGrp.length < 2) {
            $scope.discountAppliedAmountGrp.push({});
        }
    };
    $scope.addOptionalItem = function(group) {
        // group.isAdded = true;
        var bkpdaaCodes = angular.copy($scope.daaCodes);
        $scope.discountAppliedAmountGrp.pop();
        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: group.code || '-1', value: group.value || '', isDisabled: true, isValueMandate: true, isCodeMandate: false });
        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isAdded: true, isValueMandate: true, isCodeMandate: false });
    };
    $scope.removeOptionalItem = function(group) {
        var bkpdaaCodes = angular.copy($scope.daaCodes);
        $scope.discountAppliedAmountGrp.pop();
        if ($scope.discountAppliedAmountGrp.length > 1) {
            var lastElem = $scope.discountAppliedAmountGrp[$scope.discountAppliedAmountGrp.length - 1];
            if (lastElem.code === 'FULL') {
                $scope.discountAppliedAmountGrp.pop();
                $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: group.code || '-1', value: group.value || '', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false });
            } else {
                $scope.discountAppliedAmountGrp.pop();
                $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: lastElem.code || '', value: lastElem.value || '', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false });
            }
        }
    };
    $scope.onChangeDAASelect = function(group) {
       if(group.code !== '-1'){
            if(group.code === 'DSCT') {
                group.isValueMandate = true;

                var bkpdaaCodes = angular.copy($scope.daaCodes);
                for (var i in bkpdaaCodes) {
                    if(bkpdaaCodes[i].actualvalue !== 'FULL') {
                        bkpdaaCodes[i].isDisabled = true;
                    }

                }
                if($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                    if($scope.discountAppliedAmountGrp.length <= 2){
                        if($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isValueMandate: true, isCodeMandate: false});
                    }
                } else if($scope.PaymentDetails.MessageType === 'Request for Payment') {
                    if($scope.discountAppliedAmountGrp.length <= 3){
                        if($scope.discountAppliedAmountGrp.length === 3) {
                            $scope.discountAppliedAmountGrp.splice(-2,2);
                        }
                        if($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isAdded: false, isValueMandate: true, isCodeMandate: false});
                    }
                }
                // if($scope.discountAppliedAmountGrp.length <= 2){
                //     if($scope.discountAppliedAmountGrp.length === 2) {
                //         $scope.discountAppliedAmountGrp.pop();
                //     }
                //     if($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isValueMandate: true, isCodeMandate: false});
                //     } else if($scope.PaymentDetails.MessageType === 'Request for Payment') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isAdded: false, isValueMandate: true, isCodeMandate: false});
                //     }
                // }
            } else if (group.code === 'FULL') {
                group.isValueMandate = true;

                var bkpdaaCodes = angular.copy($scope.daaCodes);
                for (var i in bkpdaaCodes) {
                    if (bkpdaaCodes[i].actualvalue !== 'DSCT') {
                        bkpdaaCodes[i].isDisabled = true;
                    }
                }
                if ($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                    if ($scope.discountAppliedAmountGrp.length <= 2) {
                        if ($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'DSCT', isDisabled: true, isValueMandate: true, isCodeMandate: false });
                    }
                } else if ($scope.PaymentDetails.MessageType === 'Request for Payment') {
                    if ($scope.discountAppliedAmountGrp.length <= 3) {
                        if ($scope.discountAppliedAmountGrp.length === 3) {
                            $scope.discountAppliedAmountGrp.splice(-2, 2);
                        }
                        if ($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'DSCT', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false });
                    }
                }
                // if($scope.discountAppliedAmountGrp.length <= 2){
                //     if($scope.discountAppliedAmountGrp.length === 2) {
                //         $scope.discountAppliedAmountGrp.pop();
                //     }
                //     if($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'DSCT', isDisabled: true, isValueMandate: true, isCodeMandate: false});
                //     } else if($scope.PaymentDetails.MessageType === 'Request for Payment') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'DSCT', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false});
                //     }
                // }
            } else {
                if ($scope.discountAppliedAmountGrp.length > 1) {
                    $scope.discountAppliedAmountGrp.pop();
                }
            }
        } else {
            group.isCodeMandate = false;
            group.isValueMandate = false;
            group.isDisabaled = false;
            group.value = '';
            if ($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                if ($scope.discountAppliedAmountGrp.length > 1) {
                    $scope.discountAppliedAmountGrp.pop();
                }
            } else if ($scope.PaymentDetails.MessageType === 'Request for Payment') {
                if ($scope.discountAppliedAmountGrp.length > 2) {
                    $scope.discountAppliedAmountGrp.splice(-2, 2);
                } else {
                    $scope.discountAppliedAmountGrp.pop();
                }
            }

        }
    };

    $scope.makeMandate = function(group, index) {
        if (group.value && group.value.length > 0) {
            group.isCodeMandate = true;
        } else {
            group.isCodeMandate = false;
        }
    }

    $scope.makeManadateRDI = function() {
            if ($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length !== 0 && $.trim($scope.refferdDocInfoData.date.value).length !== 0) {
                $scope.refferdDocInfoData.date.isMandate = false;
                $scope.refferdDocInfoData.originalCreditTransfer.isMandate = false;
            } else {
                if (($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length === 0) && ($.trim($scope.refferdDocInfoData.date.value).length === 0)) {
                    $scope.refferdDocInfoData.date.isMandate = false;
                    $scope.refferdDocInfoData.originalCreditTransfer.isMandate = false;
                } else if (($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length > 0) && ($.trim($scope.refferdDocInfoData.date.value).length === 0)) {
                    $scope.refferdDocInfoData.date.isMandate = true;
                    $scope.refferdDocInfoData.originalCreditTransfer.isMandate = false;

                } else if (($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length === 0) && ($.trim($scope.refferdDocInfoData.date.value).length > 0)) {
                    $scope.refferdDocInfoData.date.isMandate = false;
                    $scope.refferdDocInfoData.originalCreditTransfer.isMandate = true;
                }
            }

        }
        /** */
    $scope.restResponse = {};

    function crudRequest(_method, _url, _data, _query) {
        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _query
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }
            return $scope.restResponse
        }, function(error) {

            //if (error.status == 401) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
                //}
            $scope.restResponse = {
                'Status': 'Error',
                'data': error.data.error.message
            }
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            return $scope.restResponse
        })
    }

    $scope.CXCFlag = false;

    if (!$stateParams.input && $scope.fromAddNew == false) {
        $location.path('app/mpitemplate')
    }
    $scope.activatePicker = function() {
        var prev = null;
        $('.DatePicker').datepicker({
            format: "yyyy-mm-dd",
            showClear: true,
            startDate: new Date(),
            icons: datepickerFaIcons.icons

        }).on('dp.change', function(ev) {
            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: true,
            icons: datepickerFaIcons.icons
            
        }).on('dp.change', function(ev) {
            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});
    }
    $scope.activatePicker();
    var today = new Date();
    var month = '';
    if ((today.getMonth() + 1) <= 9) {
        month = '0' + (today.getMonth() + 1);
    } else {
        month = today.getMonth() + 1;
    }
    var date = todayDate();
    $scope.date = todayDate();



    $scope.customDateRangePicker = function(sDate, eDate) {
        var startDate1 = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);

        $(sanitize('#' + sDate)).datepicker({
            weekStart: 1,
            startDate: startDate1,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true
        }).on('changeDate', function(selected) {
            startDate1 = new Date(selected.date.valueOf());
            startDate1.setDate(startDate1.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + eDate)).datepicker('setStartDate', startDate1);
        });

        // $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
        $(sanitize('#' + eDate)).datepicker({
                weekStart: 1,
                startDate: startDate1,
                autoclose: true,
                format: 'yyyy-mm-dd',
                todayHighlight: true
            })
            .on('changeDate', function(selected) {
                FromEndDate = new Date(selected.date.valueOf());
                FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
            });
        //  $(sanitize('#' + eDate)).datepicker('setStartDate', startDate1);
        $(sanitize('#' + eDate)).on('keyup', function() {
            if (!$(this).val()) {
                //$(sanitize('#' + sDate)).datepicker('setEndDate', new Date());
            }
        })

        $(sanitize('#' + sDate)).on('keyup', function(ev) {
            if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {
                //$dates.datepicker('setDate', null);
                $(sanitize('#' + eDate)).datepicker('setStartDate', new Date());
            }
        })

        $(sanitize('#' + eDate)).on('keyup', function(ev) {
            if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {
                //$dates.datepicker('setDate', null);
                $(sanitize('#' + sDate)).datepicker('setEndDate', null);
            }
        })

    }

    setTimeout(function() {
        $scope.customDateRangePicker('EffectiveFromDate', 'EffectiveTillDate')
    }, 1000)

    $scope.tiggerTemplate = function() {
        $rootScope.dataModified = false;
        $scope.SaveTemplate = !$scope.SaveTemplate;
        $scope.SaveTemplateCollapsed = false;
    }
    $(document).ready(function() {

        $('.select2-dropdown').css('display', 'none');

        $scope.select2Arr = [{
            "name": "party",
            "key": "PartyName",
            "url": "/rest/v2/parties/readall",
            "method": "POST"
        }]
        $scope.currentSelect2 = {};
        $scope.limit = 500;
        var ddddd = {
            "start": 0,
            "count": 300
        };
        var newObj = JSON.stringify(ddddd);
        $scope.querySearchContructor = function(key, value123, start, count) {
            $scope.query = {
                "Queryfield": [{
                    "ColumnName": key,
                    "ColumnOperation": "like",
                    "ColumnValue": value123
                }, {
                    "ColumnName": "Status",
                    "ColumnOperation": "=",
                    "ColumnValue": "ACTIVE"
                }, {
                    "ColumnName": "Status",
                    "ColumnOperation": "=",
                    "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                }],
                "start": start * count ? start * count : 0,
                "count": count
            }
            if (value123 != '') {
                $scope.query = constructQuery($scope.query);
            } else {
                $scope.query = {
                    "start": 0,
                    "count": count,
                    "Queryfield": [, {
                        "ColumnName": "Status",
                        "ColumnOperation": "=",
                        "ColumnValue": "ACTIVE"
                    }, {
                        "ColumnName": "Status",
                        "ColumnOperation": "=",
                        "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                    }]
                };
                $scope.query = constructQuery($scope.query);
            }
            return $scope.query;
        }
        var _flag = 0;
        var remoteDataConfig = function(ID, key, RESTCALL, METHOD) {
            $('.appendselect2').select2({
                ajax: {
                    url: function() {
                        for (var i in $scope.select2Arr) {
                            if ($scope.select2Arr[i].name == $(this).attr('name')) {
                                $scope.currentSelect2 = $scope.select2Arr[i];
                                return BASEURL + $scope.select2Arr[i].url
                            }
                        }
                    },
                    method: "POST",
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
                    },
                    crossDomain: true,
                    data: function(params) {
                        var query = $scope.querySearchContructor('', '', params.page, $scope.limit);
                        if (params.term) {
                            query = $scope.querySearchContructor($scope.currentSelect2.key, params.term, params.page, $scope.limit);
                        }
                        return JSON.stringify(query);
                    },
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = [];
                        _flag++;
                        for (j in data) {
                            if (data[j][$scope.currentSelect2.key] == undefined) {
                                myarr.push({
                                    'id': JSON.stringify(data[j]),
                                    'text': data[j].PartyCode
                                })
                            } else {
                                if ($scope.currentSelect2.key == 'PartyName') {
                                    myarr.push({
                                        'id': JSON.stringify(data[j]),
                                        'text': data[j][$scope.currentSelect2.key]
                                    })
                                } else {
                                    myarr.push({
                                        'id': JSON.stringify(data[j]),
                                        'text': data[j][$scope.currentSelect2.key]
                                    })
                                }
                            }
                            if (_flag == 1) {
                                $scope.Party_New_Rest = myarr;
                            }

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
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            }).on('select2:select', function() {})
        }
        remoteDataConfig()

        if ((!$scope.ViewClicked) && (!$scope.fromAddNew)) {

            if ($stateParams.input.FromDraft) {
                setTimeout(function() {
                    $scope.HttpMethod = $stateParams.input.typeOfDraft
                }, 100)
                $scope.loadTemplateDataNew(JSON.stringify($stateParams.input.fieldData))
            } else {
                setTimeout(function() {
                    $scope.loadTemplateData(JSON.stringify($scope.FXRate))

                }, 100)
            }
        }
        var pageLimitCount = 100;
        $scope.limit = 500;
        var remoteDataConfig2 = function() {
            $('.appendselect212').select2({
                ajax: {
                    url: function(params) {
                        // var query = "?start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                        // if (params.term) {
                        // 	query = "?search=" + params.term + "&start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                        // }
                        return BASEURL + '/rest/v2/manualpaymentinitiationtemplate/parties/rolesaccessible/readall';
                    },
                    method: "GET",
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
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
                        var myarr = []
                        for (j in data) {
                            myarr.push({
                                'id': JSON.stringify(data[j]),
                                'text': data[j].TemplateName + '(' + data[j].PartyCode + ')'
                            })
                        }
                        return {
                            results: myarr,
                        };
                    },
                    cache: true
                },
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            }).on('select2:select', function() {
                if ($(this).attr('name') == 'templates') {}
            })
        }
        remoteDataConfig2()
        $scope.ROLESOptions123 = [];
        $scope.remoteDataConfig21 = function() {
            $('.appendselect21211').select2({
                ajax: {
                    url: BASEURL + '/rest/v2/roles/readall',
                    method: "POST",
                    headers: authenticationObject,
                    dataType: 'json',
                    data: function(params) {
                        var query = $scope.querySearchContructor('', '', params.page, $scope.limit);
                        if (params.term) {
                            query = $scope.querySearchContructor("RoleName", params.term, params.page, $scope.limit);
                        }
                        return JSON.stringify(query);
                    },
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
                    },
                    crossDomain: true,
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = []
                        for (j in data) {
                            myarr.push({
                                'id': data[j].RoleID,
                                'text': data[j].RoleName
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
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            }).on('select2:select', function() {})
        }
        $scope.remoteDataConfig21()
    })
    var remoteDataConfig1 = function() {
            $scope.select2Arr1 = [{
                "name": "AccountNumber",
                "key": "AccountNo",
                "url": "/rest/v2/accounts/readall",
                "method": "POST"
            }]
            $('.appendselect21').select2({
                ajax: {
                    url: function() {
                        for (var i in $scope.select2Arr1) {
                            if ($scope.select2Arr1[i].name == $(this).attr('name')) {
                                $scope.currentSelect2 = $scope.select2Arr1[i];
                                return BASEURL + $scope.select2Arr1[i].url
                            }
                        }
                    },
                    method: "POST",
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
                    },
                    crossDomain: true,
                    data: function(params) {
                        var query = $scope.querySearchContructor('', '', params.page, $scope.limit);
                        if (params.term) {
                            query = $scope.querySearchContructor($scope.currentSelect2.key, params.term, params.page, $scope.limit);
                        }
                        return JSON.stringify(query);
                    },
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = []
                        for (j in data) {
                            if (data[j][$scope.currentSelect2.key] == undefined) {
                                myarr.push({
                                    'id': JSON.stringify(data[j]),
                                    'text': data[j].PartyCode
                                })
                            } else {
                                myarr.push({
                                    'id': JSON.stringify(data[j]),
                                    'text': data[j][$scope.currentSelect2.key]
                                })
                            }
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
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            }).on('select2:select', function() {
                if ($(this).attr('name') == 'templates') {
                    $scope.tempVal = JSON.parse($(this).val());
                    $scope.tempVal.Template = $filter('hex2a')($scope.tempVal.Template)
                    $scope.tempVal.Template = JSON.parse($scope.tempVal.Template)
                    $scope.tempQuery = $scope.querySearchContructor("PartyCode", $scope.tempVal.Template.Party, 0, 500);
                    $http.post(BASEURL + '/rest/v2/parties/readall', $scope.tempQuery).then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        $scope.partyOptions = data;
                        setTimeout(function() {
                            delete data[0].$$hashKey;
                            $scope.party = JSON.stringify(data[0]);
                            $('select[name=party]').val($scope.party)
                        }, 100)

                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                    });
                }
            })
        }
        // var count=0;
    $scope.getServiceList = function(party, flag) {
        if (party) {
            // count++;
            if ($scope.fromAddNew) {
                $rootScope.dataModified = true;
                $scope.madeChanges = $rootScope.dataModified
            }
            $scope.dropdownPartyValue = party;
            $scope.getPartySubtype = JSON.parse(party).PartySubType;
            $scope.isOrderingCustomerCollapsed = false;
            $scope.isBenenficiaryBankDetailsCollapsed = false;
            $scope.isBenenficiaryDetailsCollapsed = false;
            $scope.isPaymentInfoCollapsed = false;
            $scope.isRemittanceInformationCollapsed = false;
            $scope.isUltimateDebtorCollapsed = false;
            $scope.isUltimateCreditorCollapsed = false;
            $scope.SaveTemplateCollapsed = false;

            if (!$scope.Templateloading) {
                $scope.PaymentDetails.ValueDate = date;
                $scope.PaymentDetails.RequestedExecutionDate = date;
                $scope.TemplateDetails.EffectiveFromDate = date;
            } else {
                $http({
                    url: BASEURL + '/rest/v2/services/read',
                    method: "POST",
                    data: {
                        "ServiceCode": $scope.TemplateData.Service
                    },
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

                    if ($scope.Templateloading == true) {
                        $scope.getMSGTypebyPartyService(party, JSON.stringify(data))
                    }
                    $scope.service11 = JSON.stringify(data);
                    $scope.serviceCodeFromTemplate = true;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                });
            }

            if ($scope.PartySelectedFlag == false) {
                $scope.query = {
                    "Queryfield": [{
                        "ColumnName": "PartyCode",
                        "ColumnOperation": "=",
                        "ColumnValue": JSON.parse(party).PartyCode
                    }, {
                        "ColumnName": "Status",
                        "ColumnOperation": "=",
                        "ColumnValue": "ACTIVE"
                    }, {
                        "ColumnName": "Status",
                        "ColumnOperation": "=",
                        "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                    }],
                    "start": 0,
                    "count": 1000
                }
                $scope.query = constructQuery($scope.query);
                $http({
                    url: BASEURL + '/rest/v2/partyserviceassociations/readall',
                    method: "POST",
                    data: $scope.query,
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

                    if (data.length >= 1) {
                        $scope.query_Service = {
                            "Queryfield": [],
                            "start": 0,
                            "count": 1000
                        }
                        if (data.length > 1) {
                            for (i = 0; i < data.length; i++) {
                                $scope.query_Service.Queryfield.push({
                                    "ColumnName": "ServiceCode",
                                    "ColumnOperation": "=",
                                    "ColumnValue": data[i].ServiceCode
                                })
                            }
                            $scope.query_Service.Queryfield.push({
                                "ColumnName": "Status",
                                "ColumnOperation": "=",
                                "ColumnValue": "ACTIVE"
                            }, {
                                "ColumnName": "Status",
                                "ColumnOperation": "=",
                                "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                            })
                        } else {
                            $scope.query_Service.Queryfield.push({
                                "ColumnName": "ServiceCode",
                                "ColumnOperation": "=",
                                "ColumnValue": data[0].ServiceCode
                            })
                            $scope.query_Service.Queryfield.push({
                                "ColumnName": "Status",
                                "ColumnOperation": "=",
                                "ColumnValue": "ACTIVE"
                            }, {
                                "ColumnName": "Status",
                                "ColumnOperation": "=",
                                "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                            })
                        }
                        $scope.query_for_serive = constructQuery($scope.query_Service);
                        $http({
                            url: BASEURL + '/rest/v2/services/readall',
                            method: "POST",
                            data: $scope.query_for_serive,
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

                            if (data.length > 1) {
                                $scope.serviceIsNotSingle = false;
                            } else if (data.length == 1) {
                                $scope.service11 = JSON.stringify(data[0]);
                                $scope.ServiceCodeForConditions = data[0].ServiceCode;
                                $scope.serviceIsNotSingle = false;
                                $scope.serviceCodeFromTemplate = false;
                                $scope.getMSGTypebyPartyService(party, JSON.stringify(data[0]))
                            }
                            $scope.serviceOptions = data;
                            $timeout(function() {
                                $('select[name=service11]').select2({
                                    allowClear: true
                                })
                            }, 500)
                        }).catch(function onError(response) {
                            // Handle error
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                        });
                    } else {}
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                });

                $scope.PartySelectedFlag = true;
            } else {
                var txt;
                var r = confirm("Please note: currently selected values may be lost.");
                if (r == true) {
                    sessionStorage.OkAlertClicked = true;
                    $rootScope.dataModified = false;
                    GlobalService.fromAddNew = true;
                    //$state.go('app.mpitemplate')
                    // sessionStorage.dataModified = false;
                    $state.reload();

                    //$location.path("app/mpidetail")
                } else {}

            }
        }
    }

    $scope.alreadyExists = false;
    $scope.NewPartyRestCall = function(templateValues) {

        if ($scope.dropdownPartyValue) {
            $http({
                url: BASEURL + '/rest/v2/manualpaymentinitiationtemplate/party/' + templateValues + '/' + JSON.parse($scope.dropdownPartyValue).PartyCode,
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

                $scope.alreadyExists = false;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.alreadyExists = true;
                $scope.alertMessage = data.error.message;
            });
        }
    }

    // $(document).ready(function(){

    function isAnyFieldChanged() {
        setTimeout(function() {
            $("input[type='text']").on("keydown", function(e) {
                if ($(e.currentTarget).val()) {
                    $rootScope.dataModified = true;
                    $scope.madeChanges = $rootScope.dataModified;
                }
            });

            $("select").change(function() {
                if ($(this).val()) {
                    $rootScope.dataModified = true;
                    $scope.madeChanges = $rootScope.dataModified;
                }
            })

            $(".DatePicker").on("change", function() {
                var selected = $(this).val();
                if (selected) {
                    $rootScope.dataModified = true;
                    $scope.madeChanges = $rootScope.dataModified;
                }
            });
        }, 200)

    }

    // })

    isAnyFieldChanged()

    $scope.gotoShowAlert = function() {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $("#changesLostModal").modal("show");
        } else {
            $location.path('app/mpitemplate')
        }
    }

    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            $location.path('app/mpitemplate')
            $rootScope.dataModified = false;
        } else {
            $rootScope.$emit("MyEvent2", true);
        }
    }

    $scope.getMSGTypebyPartyService = function(party, service) {
        $scope.CXCFlag = false;
        service = (typeof(service) == 'string') ? JSON.parse(service) : service
        $timeout(function() {
            remoteDataConfig1()
        }, 500)
        $scope.ServiceCodeForConditions = service.ServiceCode;
        var Service = service.ServiceCode;
        if (Service == 'RPX') {
            $scope.RemitInfoMaxLength = 35 * 4;
            $scope.forUSRTP.MessageType = [{
                "actualValue": "Customer Credit Transfer",
                "displayValue": "Customer Credit Transfer"
            }, {
                "actualValue": "Request for Payment",
                "displayValue": "Request for Payment"
            }];
            $scope.getPSAList($scope.PaymentDetails.MessageType, JSON.stringify(service), party)
        } else if ((Service == 'GVP') || (Service == 'GLV')) {
            $scope.forUSRTP.MessageType = [{
                "actualValue": "Customer Credit Transfer",
                "displayValue": "Customer Credit Transfer"
            }];
            $scope.PaymentDetails.MessageType = "Customer Credit Transfer";
            $scope.RemitInfoMaxLength = 35 * 10;
            $scope.getPSAList($scope.PaymentDetails.MessageType, JSON.stringify(service), party)
        } else if ((Service == 'CXC')) {
            //$('#MessageTypeID').select2('destroy');
            $scope.forUSRTP.MessageType = [{
                "actualValue": "Customer Credit Transfer-Standard",
                "displayValue": "Customer Credit Transfer Standard"
            }, {
                "actualValue": "Customer Credit Transfer-Expedited",
                "displayValue": "Customer Credit Transfer Expedited"
            }];
            $scope.RemitInfoMaxLength = 200;
            $scope.CXCFlag = true;
            //$scope.getPSAList($scope.PaymentDetails.MessageType, JSON.stringify(service), party)
            if (($scope.PaymentDetails.MessageType != '') && ($scope.PaymentDetails.MessageType != undefined)) {
                $scope.getPSAList($scope.PaymentDetails.MessageType, JSON.stringify(service), party)
            }
            $timeout(function() {
                $('#MessageTypeID').select2();
            }, 100)
        } else {
            $http.get(BASEURL + '/rest/v2/messagetypes/readall?start=0&count=1000').then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.forUSRTP.MessageType = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });

            $http.get(BASEURL + '/rest/v2/debtorcustomer/code?start=0&count=1000').then(function onSuccess(response) {
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
            $scope.getPSAList($scope.PaymentDetails.MessageType, JSON.stringify(service), party)
        }
        $scope.callPicker();
    }
    $scope.getPSAList = function(mtype, Service, party) {

        if (party) {
            if (Service == undefined) {
                $scope.PaymentDetails.PaymentCurrency = '';
                $scope.forUSRTP.PaymentCurrency = '';
            }
            var ServiceTemp = JSON.parse(Service).ServiceCode;
            $scope.PaymentDetails.LocalInstrument = '';
            $scope.LocalInstrument = [];
            $http({
                url: BASEURL + '/rest/v2/partyserviceassociations/initiatetransaction/querypsa',
                method: "POST",
                data: {
                    "PartyCode": JSON.parse(party).PartyCode,
                    "ServiceCode": JSON.parse(Service).ServiceCode,
                    "MessageInput": mtype
                },
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
                $scope.selectOptions = data;
                if (data.length == 1) {
                    $scope.psaCode11 = JSON.stringify(data[0]);
                    $scope.getBranchList(data[0])
                } else {
                    if ($scope.Templateloading == true) {
                        data111 = getObjects(data, 'PartyServiceAssociationCode', $scope.TemplateData.PartyServiceAssociationCode);
                        $scope.psaCode11 = JSON.stringify(data111[0]);
                        $scope.getBranchList(data111[0])
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


            if (JSON.parse(Service).InstructionCurrencies == 'ALL') {
                $scope.CurrencyAll = false;
                $http.get(BASEURL + '/rest/v2/currencies/code?start=0&count=1000').then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    if (JSON.parse($scope.getUniqueCurrency(data)).length == 1) {
                        $scope.PaymentDetails.PaymentCurrency = JSON.parse($scope.getUniqueCurrency(data))[0];
                    }
                    $scope.forUSRTP.PaymentCurrency = $scope.getUniqueCurrency(data);
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                });

            } else {
                if (getSupportedProducts(JSON.parse(Service).InstructionCurrencies).length == 1) {
                    $scope.PaymentDetails.PaymentCurrency = getSupportedProducts(JSON.parse(Service).InstructionCurrencies)[0];
                }
                $scope.forUSRTP.PaymentCurrency = getSupportedProducts(JSON.parse(Service).InstructionCurrencies);
            }

            if (ServiceTemp == 'CXC') {
                $scope.forUSRTP.DebtorCustomerProprietaryCode = [{
                    "actualValue": "b2c",
                    "displayValue": "B2C"
                }];
            } else {
                $scope.forUSRTP.DebtorCustomerProprietaryCode = [{
                    "actualValue": "CONSUMER",
                    "displayValue": "CONSUMER"
                }, {
                    "actualValue": "BUSINESS",
                    "displayValue": "BUSINESS"
                }];
            }

            if (mtype == 'Request for Payment') {
                $scope.PaymentDetails.TransactionID = '';
                $scope.LocalInstrument = [{
                    "actualValue": "INTERMEDIARY",
                    "displayValue": "INTERMEDIARY"
                }, {
                    "actualValue": "STANDARD",
                    "displayValue": "STANDARD"
                }, {
                    "actualValue": "ZELLE",
                    "displayValue": "ZELLE"
                }];
            } else {
                $scope.LocalInstrument = [{
                    "actualValue": "FOREIGN AFFILIATE",
                    "displayValue": "FOREIGN AFFILIATE"
                }, {
                    "actualValue": "INTERMEDIARY",
                    "displayValue": "INTERMEDIARY"
                }, {
                    "actualValue": "STANDARD",
                    "displayValue": "STANDARD"
                }, {
                    "actualValue": "ZELLE",
                    "displayValue": "ZELLE"
                }];
                delete $scope.PaymentDetails['RequestedExecutionTime'];
                delete $scope.PaymentDetails['AmountModificationAllowed'];
                delete $scope.PaymentDetails['EarlyPaymentAllowed'];
                delete $scope.PaymentDetails['GuaranteedPaymentRequested'];
                delete $scope.PaymentDetails['RFPExpiryDate'];
                delete $scope.PaymentDetails['RFPExpiryTime'];
            }

            $scope.AmountModificationAllowed = [{
                "actualValue": true,
                "displayValue": "YES"
            }, {
                "actualValue": false,
                "displayValue": "NO"
            }];
            $scope.EarlyPaymentAllowed = [{
                "actualValue": true,
                "displayValue": "YES"
            }, {
                "actualValue": false,
                "displayValue": "NO"
            }];
            $scope.GuaranteedPaymentRequested = [{
                "actualValue": true,
                "displayValue": "YES"
            }, {
                "actualValue": false,
                "displayValue": "NO"
            }];
            $('select[name=LocalInstrument]').select2()
        }
        $scope.callPicker();
    }

    $scope.checkPaymentMandatory = function(PaymentDetails) {
        var isBoolean = [true, false, "true", "false"];
        $scope.condition = {
            AmountModificationAllowed: isBoolean.indexOf(PaymentDetails.EarlyPaymentAllowed) != -1 || isBoolean.indexOf(PaymentDetails.GuaranteedPaymentRequested) != -1,
            EarlyPaymentAllowed: isBoolean.indexOf(PaymentDetails.AmountModificationAllowed) != -1 || isBoolean.indexOf(PaymentDetails.GuaranteedPaymentRequested) != -1,
            GuaranteedPaymentRequested: isBoolean.indexOf(PaymentDetails.AmountModificationAllowed) != -1 || isBoolean.indexOf(PaymentDetails.EarlyPaymentAllowed) != -1
        }
    }

    function getSupportedProducts(val) {
        var gSPArray = [];
        val1 = val.split(',');
        for (i = 0; i < val1.length; i++) {
            if (val1[i].trim().length > 0) {
                gSPArray.push(val1[i]);
            }
        }
        return gSPArray;
    }
    $scope.ignoreEmptyValue = function(Arr) {
        var CCValue = [];
        for (i = 0; i < Arr.length; i++) {
            if (Arr[i].SupportedChargeCodes != undefined) {
                CCValue.push(Arr[i])
            }
        }
        if (CCValue.length >= 1) {
            return CCValue;
        } else {
            CCValue = '';
            return CCValue;
        }
    }
    $scope.getPaymentType = function(MessageType) {
        $http.get(BASEURL + '/rest/v2/paymenttype/' + encodeURI(MessageType) + '?start=0&count=1000').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.PaymentTypePushPull = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });

        /**1577*/
        if (MessageType == 'Request for Payment') {
            // $scope.refferdDocInfoData = {originalCreditTransfer: {name:'OCT', isMandate: false, value: ''}, date: {name: 'relDate', isMandate: false, value: ''}};
            $scope.daaCodes = [{ actualvalue: 'FULL', displayvalue: 'Full', isDisabled: false }, { actualvalue: 'DSCT', displayvalue: 'Discount', isDisabled: false }];
            $scope.discountAppliedAmountGrp = [{ daaCodes: $scope.daaCodes, code: '-1', value: '', isDisabaled: false, isValueMandate: false, isCodeMandate: false }];
        }
        if (MessageType == 'Customer Credit Transfer') {
            $scope.refferdDocInfoData = { originalCreditTransfer: { name: 'OCT', isMandate: false, value: '' }, date: { name: 'relDate', isMandate: false, value: '' } };
            $scope.daaCodes = [{ actualvalue: 'FULL', displayvalue: 'Full', isDisabled: false }, { actualvalue: 'DSCT', displayvalue: 'Discount', isDisabled: false }, { actualvalue: 'ORIG', displayvalue: 'Original', isDisabled: false }];
            $scope.discountAppliedAmountGrp = [{ daaCodes: $scope.daaCodes, code: '-1', value: '', isDisabaled: false, isValueMandate: false, isCodeMandate: false }];
        }
    }

    $scope.getBranchList = function(party) {
        //$scope.PaymentBranch = '';
        $scope.branchList = '';
        if (party != undefined) {
            //	$scope.PaymentBranch = '';
            party = (typeof(party) == 'string') ? JSON.parse(party) : party
            $scope.PSAvalue = party;
            $scope.ProductsSupported = getSupportedProducts(party.ProductsSupported);
            var inputObj = '';
            $scope.branchList = '';
            if (party.DeriveBranchCode == false) {
                inputObj = {
                    "filters": {
                        "logicalOperator": "AND",
                        "groupLvl1": [{
                            "logicalOperator": "AND",
                            "groupLvl2": [{
                                "logicalOperator": "AND",
                                "groupLvl3": [{
                                    "logicalOperator": "AND",
                                    "clauses": [{
                                        "columnName": "BranchCode",
                                        "operator": "=",
                                        "value": party.BranchCode
                                    }]
                                }, {
                                    "logicalOperator": "OR",
                                    "clauses": [{
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE"
                                    }, {
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE-WAITFORAPPROVAL"
                                    }]
                                }]
                            }]
                        }]
                    },
                    "start": 0,
                    "count": 1000
                }
                $http({
                    url: BASEURL + '/rest/v2/branches/readall',
                    method: "POST",
                    data: inputObj,
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

                    if (data.length == 1) {
                        $scope.PaymentBranch = data[0].BranchCode;
                    }
                    if (data.length > 0) {
                        $scope.branchList = data;
                    } else {}
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    //	if (status == 401) {
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                        //	} else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    //	}

                });
            } else {
                inputObj = {
                    "ServiceCode": party.ServiceCode
                }
                $http({
                    url: BASEURL + '/rest/v2/services/read',
                    method: "POST",
                    data: inputObj,
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

                    $scope.multipleOfferedEntity = getSupportedProducts(data.OfferedByEntity)
                    $scope.query_Service_forBranch = {
                        "Queryfield": [],
                        "start": 0,
                        "count": 1000
                    }
                    if ($scope.multipleOfferedEntity.length > 1) {
                        for (i = 0; i < $scope.multipleOfferedEntity.length; i++) {
                            $scope.query_Service_forBranch.Queryfield.push({
                                "ColumnName": "BranchCode",
                                "ColumnOperation": "=",
                                "ColumnValue": $scope.multipleOfferedEntity[i]
                            })
                        }
                        $scope.query_Service_forBranch.Queryfield.push({
                            "ColumnName": "Status",
                            "ColumnOperation": "=",
                            "ColumnValue": "ACTIVE"
                        }, {
                            "ColumnName": "Status",
                            "ColumnOperation": "=",
                            "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                        })
                    } else {
                        $scope.query_Service_forBranch.Queryfield.push({
                            "ColumnName": "BranchCode",
                            "ColumnOperation": "=",
                            "ColumnValue": $scope.multipleOfferedEntity[0]
                        })
                        $scope.query_Service_forBranch.Queryfield.push({
                            "ColumnName": "Status",
                            "ColumnOperation": "=",
                            "ColumnValue": "ACTIVE"
                        }, {
                            "ColumnName": "Status",
                            "ColumnOperation": "=",
                            "ColumnValue": "ACTIVE-WAITFORAPPROVAL"
                        })
                    }
                    $scope.query_Service_forBranch = constructQuery($scope.query_Service_forBranch);
                    $http({
                        url: BASEURL + '/rest/v2/branches/readall',
                        method: "POST",
                        data: $scope.query_Service_forBranch,
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

                        if (data.length == 1) {
                            $scope.PaymentBranch = data[0].BranchCode;
                        }
                        if (data.length > 0) {
                            $scope.branchList = data;
                        } else {}
                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        //	if (status == 401) {
                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                            //	} else {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: data.error.message
                        }];
                        //		}
                    });
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    //	if (status == 401) {
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                        //	} else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    //	}
                });
            }
        }
        if ($scope.PaymentBranch == '') {
            //GetBranchCodeTemp()
        }
    }

    function GetBranchCodeTemp() {
        //$scope.PaymentBranch = JSON.parse((hexToString($scope.FXRate.Template))).BranchCode;
    }
    $scope.getPaymentTypeDetails = function(ProductsSupported, Party, Service) {

        if (Party) {

            $scope.ProductsSupported123 = ProductsSupported;
            $http.get(BASEURL + '/rest/v2/debtorcustomer/code?start=0&count=1000').then(function onSuccess(response) {
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

            $scope.loadBenenficiaryBankDetails(ProductsSupported)
            inputObj21 = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "ProductCode",
                                    "operator": "=",
                                    "value": ProductsSupported
                                }]
                            }, {
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE"
                                }, {
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE-WAITFORAPPROVAL"
                                }]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }

            $scope.forUSRTP.ChargeCode = '';

            $http({
                url: BASEURL + '/rest/v2/methodofpayments/readall',
                method: "POST",
                data: inputObj21,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (data.length == 1) {
                    $scope.ChargeCodelength = 1;
                    $scope.PaymentDetails.ChargeCode = $scope.ignoreEmptyValue(data[0]);
                }
                if (data.length > 1) {
                    $scope.ChargeCodelength = data.length;
                    $scope.forUSRTP.ChargeCode = $scope.ignoreEmptyValue(data);
                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });

            $timeout(function() {
                $('select[name=MessageType]').select2({
                    allowClear: true
                })
                $('select[name=DebtorCustomerProprietaryCode]').select2({
                    allowClear: true
                })
                $('select[name=LocalInstrument]').select2({ allowClear: true })
            }, 500)
            var ClientID1234 = '';
            $http.get(BASEURL + '/rest/v2/party/code/' + JSON.parse(Party).PartyCode).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (data.length == 1) {
                    $scope.OrderingCustomer.ClientID = data[0].actualvalue;
                }
                if (data.length > 1) {
                    $scope.ClientID123 = data;
                } else {
                    $scope.ClientID123 = data;
                }
                $scope.ClientID123 = data;
                ClientID1234 = data;
                fetchClientData($scope.ClientID123)
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });

            $scope.party123 = JSON.parse(Party);

            function fetchClientData(ClientData) {
                if ($scope.party123.PartyName != undefined) {
                    if ($scope.getPartySubtype == 'TPS') {
                        $scope.OrderingCustomer.ClientName = '';
                    } else {
                        $scope.OrderingCustomer.ClientName = $scope.party123.PartyName;
                    }

                }
                if ($scope.party123.AddressLine1 != undefined) {
                    $scope.OrderingCustomer.ClientAddressLine1 = $scope.party123.AddressLine1;
                }
                if ($scope.party123.AddressLine2 != undefined) {
                    $scope.OrderingCustomer.ClientAddressLine2 = $scope.party123.AddressLine2;
                }
                if ($scope.party123.City != undefined) {
                    $scope.OrderingCustomer.City = $scope.party123.City;
                }
                if ($scope.party123.State != undefined) {
                    $scope.OrderingCustomer.State = $scope.party123.State;
                }
                if ($scope.party123.PostCode != undefined) {
                    $scope.OrderingCustomer.PostCode = $scope.party123.PostCode;
                }
                if ($scope.party123.CountryCode != undefined) {
                    $scope.OrderingCustomer.Country = $scope.party123.CountryCode;
                }
                $scope.OrderingCustomerAccountNumber = '';
                $scope.OrderingCustomer.AccountCurrency = '';
                $scope.OrderingCustomer.AccountName = '';
                inputObj3 = {
                    "filters": {
                        "logicalOperator": "AND",
                        "groupLvl1": [{
                            "logicalOperator": "AND",
                            "groupLvl2": [{
                                "logicalOperator": "AND",
                                "groupLvl3": [{
                                    "logicalOperator": "AND",
                                    "clauses": [{
                                        "columnName": "PartyCode",
                                        "operator": "=",
                                        "value": ClientData[0].actualvalue
                                    }]
                                }, {
                                    "logicalOperator": "OR",
                                    "clauses": [{
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE"
                                    }, {
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE-WAITFORAPPROVAL"
                                    }]
                                }]
                            }]
                        }]
                    },
                    "start": 0,
                    "count": 1000
                }

                function getObjects(obj, key, val) {
                    var objects = [];
                    for (var i in obj) {
                        if (!obj.hasOwnProperty(i))
                            continue;
                        if (typeof obj[i] == 'object') {
                            objects = objects.concat(getObjects(obj[i], key, val));
                        } else
                        if (i == key && obj[i] == val || i == key && val == '') {
                            objects.push(obj);
                        } else if (obj[i] == val && key == '') {
                            if (objects.lastIndexOf(obj) == -1) {
                                objects.push(obj);
                            }
                        }
                    }
                    return objects;
                }
                $http({
                    url: BASEURL + '/rest/v2/accounts/readall',
                    method: "POST",
                    data: inputObj3,
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

                    if (data.length == 1) {
                        $scope.OrderingCustomerAccountNumber = JSON.stringify(data[0]);
                        $scope.OrderingCustomer.AccountCurrency = data[0].DefaultCurrency;
                        $scope.OrderingCustomer_AccountCurrency = getSupportedProducts(data[0].AccountCurrency);
                        $scope.OrderingCustomer.AccountName = data[0].AccountName;
                        $scope.getAccountNumberCurrency(JSON.stringify(data[0]));
                    } else {
                        if ($scope.Templateloading == true) {
                            data11 = getObjects(data, 'AccountNo', $scope.TemplateData.OrderingCustomer.AccountNumber);
                            $scope.OrderingCustomerAccountNumber = JSON.stringify(data11[0]);
                            $scope.OrderingCustomer.AccountCurrency = data11[0] ? data11[0].DefaultCurrency : '';
                            $scope.OrderingCustomer_AccountCurrency = data11[0] ? getSupportedProducts(data11[0].AccountCurrency) : '';
                            $scope.OrderingCustomer.AccountName = $scope.TemplateData.OrderingCustomer.AccountName;
                            $scope.getAccountNumberCurrency(JSON.stringify(data11[0]));
                        }
                    }
                    //$scope.AccountNumber11 = data;
                    $scope.AccountNumber11 =_.sortBy( data, function( item ) {return +item.AccountNo;})
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    //	if (status == 401) {
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                        //	} else {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    //	}
                });
            }

            $timeout(function() {
                $('select[name=psaCode]').select2({
                    allowClear: true
                })
                $('select[name=Branch]').select2({
                    allowClear: true
                })
                $('select[name=PaymentType]').select2({
                    allowClear: true
                })
                $('select[name=ClientID]').select2({
                    allowClear: true
                })
                $('select[name=PaymentCurrency]').select2({
                    allowClear: true
                })
                $('select[name=OrderingCustomer_AccountNumber]').select2({
                    allowClear: true
                })
                $('select[name=AccountDomiciledCountry]').select2({
                    allowClear: true
                })
                $('select[name=AccountCurrency]').select2({
                    allowClear: true
                })
            }, 500)
        }

    }
    $scope.loadBenenficiaryBankDetails = function(ProductsSupported) {
        $scope.isBenenficiaryBankDetailsCollapsed = false;
        inputObj_BIC = {
            "filters": {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": [{
                                "columnName": "ProductCode",
                                "operator": "=",
                                "value": ProductsSupported
                            }]
                        }, {
                            "logicalOperator": "OR",
                            "clauses": [{
                                "columnName": "Status",
                                "operator": "=",
                                "value": "ACTIVE"
                            }, {
                                "columnName": "Status",
                                "operator": "=",
                                "value": "ACTIVE"
                            }]
                        }]
                    }]
                }]
            },
            "start": 0,
            "count": 1000
        }
        $http.post(BASEURL + '/rest/v2/methodofpayments/readall', inputObj_BIC).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            if (data.length == 1) {
                $scope.BeneficiaryBank.BankIdentifierType = data[0].ClearingSchemeCode;
                $scope.getBankIdentifierCode($scope.BeneficiaryBank.BankIdentifierType)
            }
            $scope.forUSRTP.BICCode = data;
            $timeout(function() {
                $('select[name=BankIdentifierType1]').select2({
                    allowClear: true
                })
                $('select[name=BIC1]').select2({
                    allowClear: true
                })
                $('select[name=BankIdentifierType]').select2({
                    allowClear: true
                })
                $('select[name=BIC]').select2({
                    allowClear: true
                })
            }, 500)
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }
    $scope.searchParam123 = {
        "filters": {
            "logicalOperator": "AND",
            "groupLvl1": [{
                "logicalOperator": "AND",
                "groupLvl2": [{
                    "logicalOperator": "AND",
                    "groupLvl3": [{
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": "Status",
                            "operator": "=",
                            "value": "ACTIVE"
                        }, {
                            "columnName": "Status",
                            "operator": "=",
                            "value": "ACTIVE"
                        }]
                    }]
                }]
            }]
        },
        "start": 0,
        "count": 1000
    }
    $scope.getAccountNumberCurrency = function(AccNum) {
        $scope.AccNum1 = AccNum ? JSON.parse(AccNum) : '';
        $scope.OrderingCustomer.AccountNumber = $scope.AccNum1.AccountNo;
        $scope.OrderingCustomer_AccountCurrency = $scope.AccNum1 ? getSupportedProducts($scope.AccNum1.AccountCurrency) : '';
        $scope.OrderingCustomer.AccountCurrency = $scope.AccNum1.DefaultCurrency;
        $scope.OrderingCustomer.AccountName = $scope.AccNum1.AccountName;
        if ($scope.AccNum1.BranchCode == undefined) {
            $http({
                url: BASEURL + '/rest/v2/countries/readall',
                method: "POST",
                data: $scope.searchParam123,
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

                if (data.length > 0) {
                    $scope.AccountDomiciledCountry = data;
                } else {}

            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                //	if (status == 401) {
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    //	} else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
                //}
            });
        } else {
            inputObj = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "BranchCode",
                                    "operator": "=",
                                    "value": $scope.AccNum1.BranchCode
                                }]
                            }, {
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE"
                                }, {
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE-WAITFORAPPROVAL"
                                }]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }
            $http({
                url: BASEURL + '/rest/v2/branches/readall',
                method: "POST",
                data: inputObj,
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

                $scope.AccountDomiciledCountry123 = data;
                if (data.length > 0) {
                    $http({
                        url: BASEURL + '/rest/v2/countries/readall',
                        method: "POST",
                        data: {
                            "start": 0,
                            "count": 1000
                        },
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

                        if (data.length > 0) {
                            $scope.AccountDomiciledCountry = data;
                        } else {
                            $scope.AccountDomiciledCountry = data;
                        }

                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        //	if (status == 401) {
                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                            //	} else {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: data.error.message
                        }];
                        //	}

                    });
                } else {
                    $http({
                        url: BASEURL + '/rest/v2/countries/readall',
                        method: "POST",
                        data: $scope.searchParam123,
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

                        if (data.length > 0) {
                            $scope.AccountDomiciledCountry = data;
                        } else {
                            $scope.AccountDomiciledCountry = data;
                        }
                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;
                        //	if (status == 401) {
                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                            //	} else {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: data.error.message
                        }];
                        //	}
                    });
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

        $timeout(function() {
            $('select[name=ClientID]').select2({
                allowClear: true
            })
            $('select[name=AccountNumber]').select2({
                allowClear: true
            })
            $scope.OrderingCustomer.AccountCurrency = $scope.AccNum1.DefaultCurrency;
        }, 500)
    }
    $scope.getBankIdentifierCode = function(BankIdentifierType) {
        $scope.BankIdentifierCode123 = '';
        if ((BankIdentifierType != '') && (BankIdentifierType != undefined)) {
            inputObj = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "SchemeCode",
                                    "operator": "=",
                                    "value": BankIdentifierType
                                }]
                            }, {
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE"
                                }, {
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE-WAITFORAPPROVAL"
                                }]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }
            $http({
                url: BASEURL + '/rest/v2/initiatetransaction/memebership/' + $scope.ProductsSupported123,
                method: "POST",
                data: inputObj,
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
                if ($scope.Templateloading != true) {
                    $scope.Beneficiary = {}

                }
                //$scope.BankIdentifierCode123 = data;
                $scope.BankIdentifierCode123 = _.sortBy(data, 'SchemeParticipantIdentifer'); //sort by SchemeParticipantIdentifer 
                if (data.length > 0) {} else {}
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
        } else {
            $http({
                url: BASEURL + '/rest/v2/accounts/readall',
                method: "POST",
                data: $scope.searchParam123,
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
                $scope.AccountNumberDrop = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
        }
    }
    $scope.getBankIdentifierCode1 = function(BankIdentifierType) {
        $scope.BankIdentifierCode1234 = {};
        if ((BankIdentifierType != '') && (BankIdentifierType != undefined)) {
            inputObj = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "SchemeCode",
                                    "operator": "=",
                                    "value": BankIdentifierType
                                }]
                            }, {
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE"
                                }, {
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE-WAITFORAPPROVAL"
                                }]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }
            $http({
                url: BASEURL + '/rest/v2/memberships/readall',
                method: "POST",
                data: inputObj,
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
                //$scope.BankIdentifierCode1234 = data;
                $scope.BankIdentifierCode1234 = _.sortBy(data, 'SchemeParticipantIdentifer'); //sort by SchemeParticipantIdentifer
                if (data.length > 0) {} else {}
                $timeout(function() {
                    $('select[name=BankIdentifierType]').select2({
                        allowClear: true
                    })
                    $('select[name=BIC]').select2({
                        allowClear: true
                    })
                }, 1500)
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
        } else {}
    }
    $scope.getAccountDetails = function(AccObj) {
        if (AccObj) {
            $http({
                url: BASEURL + '/rest/v2/parties/read',
                method: "POST",
                data: {
                    "PartyCode": JSON.parse(AccObj).PartyCode
                },
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

                $scope.Beneficiary.Name = data.PartyName;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

            });
        }
    }

    function d2h(d) {
        return d.toString(16);
    }

    function h2d(h) {
        return parseInt(h, 16);
    }

    function stringToHex(tmp) {
        var str = '',
            i = 0,
            tmp_len = tmp.length,
            c;
        for (; i < tmp_len; i += 1) {
            c = tmp.charCodeAt(i);
            str += d2h(c);
        }
        return str;
    }

    function addNewlines(str) {
        var result = '';
        while (str.length > 0) {
            result += str.substring(0, 35) + '\\n';
            str = str.substring(35);
        }
        return JSON.stringify(result);
    }
    $scope.templateOverride = false;
    $scope.checkTemplateName = function(checkTemplateName) {
        if ($scope.templateName === checkTemplateName) {
            $scope.templateOverride = true;
        }
        if (checkTemplateName) {
            $scope.NewPartyRestCall(checkTemplateName)
        }

    }
    $scope.addIntermediaryBankDetails = function() {
        var ggg = {}
        ggg.BankIdentifierType = "";
        ggg.BankIdentifierCode = "";
        ggg.BankAddressLine1 = "";
        ggg.BankAddressLine2 = "";
        ggg.City = "";
        ggg.State = "";
        ggg.PostCode = "";
        ggg.Country = "";
        if ($scope.IntermediaryBankDetails123.length <= 2) {
            $scope.IntermediaryBankDetails123.push(ggg)
        } else {
            $scope.IntermediaryBankDetailsMaxError = "Max occurs 3"
        }
        setTimeout(function() {
            for (i = 0; i < $scope.IntermediaryBankDetails123.length; i++) {
                delete $scope.IntermediaryBankDetails123[i].$$hashKey;
            }
        }, 100)
    }
    $scope.removeIntermediaryBankDetails = function(remove) {
        delete $scope.IntermediaryBankDetails123.splice(remove, 1);
    }
    if (($scope.loadTemplateData != true) && ($scope.ServiceCodeForConditions != 'RPX')) {
        $scope.addIntermediaryBankDetails();
    }
    $http.get(BASEURL + '/rest/v2/roles').then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.roles = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
    });

    function cleantheinputdata(newData) {
        $.each(newData, function(key, value) {
            delete newData.$$hashkey;
            if ($.isPlainObject(value)) {
                var isEmptyObj = cleantheinputdata(value)
                if ($.isEmptyObject(isEmptyObj)) {
                    newData[key]
                }
            } else if (Array.isArray(value) && !value.length) {
                delete newData[key]
            } else if (value === "" || value === undefined || value === null) {
                delete newData[key]
            }
        })
        return newData
    }

    function objectFilter(val) {
        var filttered = val.filter(function(a) {
            var temp = Object.keys(a).map(function(k) {
                    return a[k];
                }),
                k = temp.join('|');
            if (!this[k] && temp.join('')) {
                this[k] = true;
                return true;
            }
        }, Object.create(null));
        return filttered;
    }
    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }
    $scope.loadTemplateData = function(templatedata) {
        if (templatedata) {
            if (JSON.parse(templatedata).TemplateName == undefined) {
                var templateName = JSON.parse(templatedata).actualvalue;
                $scope.templateName = JSON.parse(templatedata).actualvalue;
            } else {
                var templateName = JSON.parse(templatedata).TemplateName;
                $scope.templateName = JSON.parse(templatedata).TemplateName;
            }

            var TemplateName_PartyCode_Value = JSON.parse(templatedata).PartyCode;
            $http({
                url: BASEURL + '/rest/v2/manualpaymentinitiationtemplate/read',
                method: "POST",
                data: {
                    TemplateName: templateName,
                    PartyCode: TemplateName_PartyCode_Value
                },
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
                $scope.loadTemplateDataNew(JSON.stringify(data))
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
    }
    $scope.loadTemplateDataNew = function(templatedata) {
        if (templatedata) {
            $scope.MPITemplate_PK = JSON.parse(templatedata).MPITemplate_PK;
            if (!$scope.fromAddNew) {
                $scope.TemplateDetails = JSON.parse(templatedata)
            }
            $scope.Templateloading = true;
            $scope.isPaymentDetailsCollapsed = false;
            $scope.isOrderingCustomerCollapsed = false;
            $scope.isBenenficiaryBankDetailsCollapsed = false;
            $scope.isBenenficiaryDetailsCollapsed = false;
            $scope.isPaymentInfoCollapsed = false;
            $scope.isRemittanceInformationCollapsed = false;
            $scope.isUltimateDebtorCollapsed = false;
            $scope.isUltimateCreditorCollapsed = false;
            $scope.TemplateData = JSON.parse(templatedata).Template ? JSON.parse($filter('hex2a')(JSON.parse(templatedata).Template)) : '';

            $scope.OrderingCustomer = $scope.TemplateData.OrderingCustomer;
            $scope.party = $scope.TemplateData.Party;

            if (!$rootScope.isComingFromdraft) {
                delete $scope.TemplateData.PaymentDetails.Amount;
                delete $scope.TemplateData.PaymentDetails.ValueDate;
                delete $scope.TemplateData.PaymentDetails.RequestedExecutionDate;
            }
            $scope.PaymentDetails = $scope.TemplateData.PaymentDetails;

            $scope.Beneficiary = $scope.TemplateData.Beneficiary;
            $scope.Beneficiary.AccountNumber = $scope.TemplateData.Beneficiary.AccountNumber;
            $scope.Beneficiary.Name = $scope.TemplateData.Beneficiary.Name;
            $scope.Beneficiary.BankAddressLine1 = $scope.TemplateData.Beneficiary.BankAddressLine1;
            $scope.Beneficiary.BankAddressLine2 = $scope.TemplateData.Beneficiary.BankAddressLine2;
            $scope.Beneficiary.City = $scope.TemplateData.Beneficiary.City;
            $scope.Beneficiary.State = $scope.TemplateData.Beneficiary.State;
            $scope.Beneficiary.Country = $scope.TemplateData.Beneficiary.Country;
            $scope.Beneficiary.PostCode = $scope.TemplateData.Beneficiary.PostCode;
            $scope.BeneficiaryBank = $scope.TemplateData.BeneficiaryBank;
            $scope.PaymentInformation = $scope.TemplateData.PaymentInformation;
            $scope.EndToEndId = $scope.TemplateData.EndToEndId;

            $scope.UltimateDebtor = $scope.TemplateData.UltimateDebtor;
            $scope.UltimateCreditor = $scope.TemplateData.UltimateCreditor;


            if ($scope.TemplateData.RemittanceInformation != undefined) {
                $scope.RemittanceInformation.RemittanceInformation = $scope.TemplateData.RemittanceInformation.RemittanceInformation;
                $scope.RemittanceInformation.RemittanceID = $scope.TemplateData.RemittanceInformation.RemittanceID;
            }
            $http({
                url: BASEURL + '/rest/v2/parties/read',
                method: "POST",
                data: {
                    "PartyCode": $scope.party
                },
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

                $scope.partyOptions = [];
                $scope.psaCode11 = JSON.stringify(data);
                $scope.partyOptions.push(data);
                setTimeout(function() {
                    delete data.$$hashKey;
                    $scope.party = JSON.stringify(data);
                }, 300)
                $scope.getServiceList(JSON.stringify(data), $scope.PartySelectedFlag);
                $scope.getPaymentTypeDetails($scope.TemplateData.ProductsSupported, JSON.stringify(data), $scope.TemplateData.Service)
                $scope.ProductsSupported123 = $scope.TemplateData.ProductsSupported
                $scope.PaymentDetails.MessageType = $scope.TemplateData.PaymentDetails.MessageType;
                if ($scope.TemplateData.BeneficiaryBank) {
                    if ($scope.TemplateData.BeneficiaryBank.BankIdentifierType != undefined) {
                        $scope.BeneficiaryBank.BankIdentifierType = $scope.TemplateData.BeneficiaryBank.BankIdentifierType
                        $scope.getBankIdentifierCode($scope.TemplateData.BeneficiaryBank.BankIdentifierType);
                        $scope.BeneficiaryBank.BankIdentifierCode = $scope.TemplateData.BeneficiaryBank.BankIdentifierCode;
                    }

                }
                if ($scope.TemplateData.IntermediaryBankDetails != undefined) {
                    $scope.IntermediaryBankDetails123 = $scope.TemplateData.IntermediaryBankDetails;
                    if ($scope.TemplateData.IntermediaryBankDetails.length > 1) {
                        for (i = 0; i < $scope.TemplateData.IntermediaryBankDetails.length; i++) {
                            $scope.getBankIdentifierCode1($scope.TemplateData.IntermediaryBankDetails[i].BankIdentifierType);
                        }
                    } else {
                        $scope.getBankIdentifierCode1($scope.TemplateData.IntermediaryBankDetails[0].BankIdentifierType);
                    }
                }
                $scope.PaymentDetails.DebtorCustomerProprietaryCode = $scope.TemplateData.PaymentDetails.DebtorCustomerProprietaryCode;
                $scope.PaymentBranch = $scope.TemplateData.BranchCode;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

            });

            function arrayTrim(val) {
                var ff = [];
                for (i = 0; i < val.length; i++) {
                    ff.push(val[i].trim());
                }
                return ff;
            }
            if ($scope.TemplateDetails.RolesAccessible != undefined) {
                var RolesAccessible = $scope.TemplateDetails.RolesAccessible.split(',');
                var Queryfield = [];
                for (i = 0; i < RolesAccessible.length; i++) {
                    Queryfield.push({
                        "ColumnName": "RoleID",
                        "ColumnOperation": "=",
                        "ColumnValue": RolesAccessible[i].trim()
                    })
                }
                var dd = {
                    "start": 0,
                    "count": 100,
                    "Queryfield": Queryfield,
                    "Operator": "AND"
                }
                setTimeout(function() {
                    $scope.remoteDataConfig21()
                }, 100)
                $http({
                    url: BASEURL + '/rest/v2/roles/readall',
                    method: "POST",
                    data: constructQuery(dd),
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

                    $scope.ROLESOptions123 = data;
                    $scope.TemplateDetails.RolesAccessible = arrayTrim($scope.TemplateDetails.RolesAccessible.split(','));
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
            } else {
                setTimeout(function() {
                    $scope.remoteDataConfig21()
                }, 100)
            }
        }
    }
    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }
    if ($scope.SaveTemplate) {
        $scope.loadTemplateData(JSON.stringify($scope.FXRate))
    }

    $scope.BackupDraft = '';
    $scope.primarykey = '';
    $scope.primaryKeyALert = false;
    var PaymentDetails1
    var OrderingCustomer1
    var BeneficiaryBank1
    var Beneficiary1
    var RemittanceInformation1
    var refferdDocInfoData1
    var discountAppliedAmountGrp1
    var UltimateDebtor1
    var UltimateCreditor1
    var psaCo1
    var PaymentBranch1
    var party1
    var service111
    var IntermediaryBankDetails1234
    var OrderingCustomerAccountNumber1
    var ProductsSupported123_1
    var SaveTemplate_1
    var TemplateDetails_1
    var psaCode11_1
    var End_1

    $scope.takeBackupData = function(PaymentDetails, OrderingCustomer, BeneficiaryBank, Beneficiary, RemittanceInformation, refferdDocInfoData, discountAppliedAmountGrp, UltimateDebtor, UltimateCreditor, psaCo, PaymentBranch, party, service11, IntermediaryBankDetails123, OrderingCustomerAccountNumber, ProductsSupported123, SaveTemplate, TemplateDetails, psaCode11, End) {
        PaymentDetails1 = PaymentDetails;
        OrderingCustomer1 = OrderingCustomer;
        BeneficiaryBank1 = BeneficiaryBank;
        Beneficiary1 = Beneficiary;
        RemittanceInformation1 = RemittanceInformation;
        refferdDocInfoData1 = refferdDocInfoData;
        discountAppliedAmountGrp1 = discountAppliedAmountGrp;
        UltimateDebtor1 = UltimateDebtor;
        UltimateCreditor1 = UltimateCreditor;
        psaCo1 = psaCo;
        PaymentBranch1 = PaymentBranch;
        party1 = party;
        service111 = service11;
        IntermediaryBankDetails1234 = IntermediaryBankDetails123;
        OrderingCustomerAccountNumber1 = OrderingCustomerAccountNumber;
        ProductsSupported123_1 = ProductsSupported123;
        SaveTemplate_1 = SaveTemplate;
        TemplateDetails_1 = TemplateDetails;
        psaCode11_1 = psaCode11;
        End_1 = End;

    }

    $scope.primarykey = $rootScope.primarykey;

    function checkPrimaryKeyValues(getDta) {
        if ($.isEmptyObject(getDta)) {
            $scope.primaryKeyALert = true;
        } else {
            $.each(getDta, function(key, val) {
                for (i = 0; i < $scope.primarykey.length; i++) {
                    if (!getDta[$scope.primarykey[i]]) {
                        $scope.primaryKeyALert = true;
                    }
                }
            })
        }
    }

    $scope.CXCFieldsClear = function(PaymentObj) {
        if ((PaymentObj.PaymentDetails != '') && (PaymentObj.PaymentDetails != undefined)) {
            //delete PaymentObj.PaymentDetails.DebtorCustomerProprietaryCode;
            delete PaymentObj.PaymentDetails.LocalInstrument;
            delete PaymentObj.PaymentDetails.ChargeCode;
        }
        if ((PaymentObj.OrderingCustomer != '') && (PaymentObj.OrderingCustomer != undefined)) {
            delete PaymentObj.OrderingCustomer.AccountNumber;
            delete PaymentObj.OrderingCustomer.AccountCurrency;
            delete PaymentObj.OrderingCustomer.AccountName;
            delete PaymentObj.OrderingCustomer.AccountDomiciledCountry;
        }
        if ((PaymentObj.BeneficiaryBank != '') && (PaymentObj.BeneficiaryBank != undefined)) {
            delete PaymentObj.BeneficiaryBank;
        }
        if ((PaymentObj.RemittanceInformation != '') && (PaymentObj.RemittanceInformation != undefined)) {
            delete PaymentObj.RemittanceInformation.RemittanceID;
        }
        if ((PaymentObj.IntermediaryBankDetails != '') && (PaymentObj.IntermediaryBankDetails != undefined)) {
            delete PaymentObj.IntermediaryBankDetails;
        }

        if ((PaymentObj.Beneficiary != '') && (PaymentObj.Beneficiary != undefined)) {
            delete PaymentObj.Beneficiary.AccountNumber
            delete PaymentObj.Beneficiary.Name
        }
        return PaymentObj;
    }

    $scope.NonCXCFieldsClear = function(PaymentObj) {
        if ((PaymentObj.PaymentDetails != '') && (PaymentObj.PaymentDetails != undefined)) {
            delete PaymentObj.NumberOfHoldDays;
        }
        if ((PaymentObj.Beneficiary != '') && (PaymentObj.Beneficiary != undefined)) {
            delete PaymentObj.Beneficiary.PayeeFirstName
            delete PaymentObj.Beneficiary.PayeeLastName
            delete PaymentObj.Beneficiary.PayeeIdType
            delete PaymentObj.Beneficiary.Token
        }
        return PaymentObj;
    }

    $scope.createData = function(PaymentDetails, OrderingCustomer, BeneficiaryBank, Beneficiary, RemittanceInformation, refferdDocInfoData, discountAppliedAmountGrp, UltimateDebtor, UltimateCreditor, psaCode, option1, party, service, IntermediaryBankDetails123, OrderingCustomerAccountNumber, ProductsSupported123, SaveTemplate, TemplateDetails, psaCode11, EndToEndId, saveAsDraft, getCreateCallMethod, isForcesaveTrue) {

        $rootScope.dataModified = false;
        $scope.activatePicker()
        if (typeof($scope.PSAvalue) == 'string') {
            $scope.PSAvalue = JSON.parse($scope.PSAvalue)
        } else {
            $scope.PSAvalue = $scope.PSAvalue;
        }
        if ($.isEmptyObject(BeneficiaryBank)) {
            if (Beneficiary.AccountNumber != undefined) {
                Beneficiary.AccountNumber = JSON.parse(Beneficiary.AccountNumber).AccountNo;
            }
        }
        var finalObj = {};
        if (party != undefined) {
            finalObj.Party = JSON.parse(party).PartyCode;
        }
        if ((service != undefined) && (service != '')) {
            if ($scope.serviceCodeFromTemplate == true) {
                finalObj.Service = JSON.parse(service).ServiceCode;
            } else {
                finalObj.Service = JSON.parse(service).ServiceCode;
            }
        }
        if (($scope.PSAvalue != undefined) && ($scope.PSAvalue != '')) {
            finalObj.PartyServiceAssociationCode = $scope.PSAvalue.PartyServiceAssociationCode;
        }
        finalObj.BranchCode = option1;
        finalObj.ProductsSupported = ProductsSupported123;
        finalObj.PaymentDetails = PaymentDetails;
        if (PaymentDetails.MessageType != 'Request for Payment' && finalObj.PaymentDetails.RequestedExecutionDate) {
            delete finalObj.PaymentDetails.RequestedExecutionDate
        }
        finalObj.OrderingCustomer = OrderingCustomer;
        finalObj.EndToEndId = EndToEndId;
        if ((OrderingCustomerAccountNumber != undefined) && (OrderingCustomerAccountNumber != '')) {
            finalObj.OrderingCustomer.AccountNumber = JSON.parse(OrderingCustomerAccountNumber).AccountNo;
        }
        if (BeneficiaryBank) {
            if (Object.keys(BeneficiaryBank).length != 0) {
                finalObj.BeneficiaryBank = BeneficiaryBank;
            }
        }
        finalObj.Beneficiary = Beneficiary;
        finalObj.RemittanceInformation = RemittanceInformation;
        if (UltimateDebtor && Object.values(UltimateDebtor).length) {
            finalObj.UltimateDebtor = cleantheinputdata(UltimateDebtor);
        }
        if (UltimateCreditor && Object.values(UltimateCreditor).length) {
            finalObj.UltimateCreditor = cleantheinputdata(UltimateCreditor);
        }
        if (finalObj.Service != 'RPX') {
            var IntermediaryBankDetails12345 = [];
            if (IntermediaryBankDetails123.length > 0) {
                for (i = 0; i < IntermediaryBankDetails123.length; i++) {
                    $scope.InterTempObj = cleantheinputdata(IntermediaryBankDetails123[i]);
                    delete $scope.InterTempObj.$$hashKey;
                    IntermediaryBankDetails12345.push($scope.InterTempObj)
                }
                finalObj.IntermediaryBankDetails = objectFilter(IntermediaryBankDetails12345);
            }
        }
        if (($scope.PSAvalue != undefined) && ($scope.PSAvalue != '')) {
            PSA = $scope.PSAvalue.PartyServiceAssociationCode;
        }
        if (refferdDocInfoData) {
            var refferedDocInfoFinalData = {};
            if (refferdDocInfoData.date && refferdDocInfoData.date.value) {
                refferedDocInfoFinalData['RelatedDate'] = refferdDocInfoData.date.value;
                finalObj['ReferredDocumentInformation'] = refferedDocInfoFinalData;
            }
            if (refferdDocInfoData.originalCreditTransfer && refferdDocInfoData.originalCreditTransfer.value) {
                refferedDocInfoFinalData['OriginalCreditTransfer'] = refferdDocInfoData.originalCreditTransfer.value;
                finalObj['ReferredDocumentInformation'] = refferedDocInfoFinalData;
            }
        }
        if (discountAppliedAmountGrp) {
            var discountAppliedAmountData = [];
            for (var i in discountAppliedAmountGrp) {
                if (discountAppliedAmountGrp[i].code !== '-1' && discountAppliedAmountGrp[i].value !== '')
                    discountAppliedAmountData.push({ Code: discountAppliedAmountGrp[i].code, Value: discountAppliedAmountGrp[i].value })
            }
            if (discountAppliedAmountData.length > 0) {
                finalObj['DiscountAppliedAmount'] = discountAppliedAmountData;
            }
        }

        /*  if(refferdDocInfoData) {
             var refferedDocInfoFinalData = {};
             if(refferdDocInfoData.date && refferdDocInfoData.date.value) {
                 refferedDocInfoFinalData['RelatedDate'] = refferdDocInfoData.date.value;
             }
             if(refferdDocInfoData.originalCreditTransfer && refferdDocInfoData.originalCreditTransfer.value) {
                 refferedDocInfoFinalData['OriginalCreditTransfer'] = refferdDocInfoData.originalCreditTransfer.value;
             }
             finalObj['ReferredDocumentInformation'] = refferedDocInfoFinalData;
         }
         if(discountAppliedAmountGrp) {
             var discountAppliedAmountData = [];
             for(var i in discountAppliedAmountGrp) {
                 discountAppliedAmountData.push({code: discountAppliedAmountGrp[i].code, value: discountAppliedAmountGrp[i].value})
             }
             finalObj['DiscountAppliedAmount'] = discountAppliedAmountData;
         } */

        finalObj = cleantheinputdata(finalObj);

        if (finalObj.Service == 'CXC') {
            finalObj = $scope.CXCFieldsClear(finalObj);
        } else {
            finalObj = $scope.NonCXCFieldsClear(finalObj);
        }

        TemplateDetails.Template = stringToHex(JSON.stringify(finalObj))

        if ((TemplateDetails.RolesAccessible == "") || (TemplateDetails.RolesAccessible == undefined)) {
            delete TemplateDetails.RolesAccessible;
        }
        if (TemplateDetails.RolesAccessible != undefined) {
            $scope.roles12345 = [];
            if (TemplateDetails.RolesAccessible.indexOf('{') != -1) {
                for (i = 0; i < TemplateDetails.RolesAccessible.length; i++) {
                    $scope.roles12345.push(JSON.parse(TemplateDetails.RolesAccessible[i]).RoleID);
                }
            } else {
                $scope.roles12345.push(TemplateDetails.RolesAccessible);
            }
            $scope.TemplateDetails.RolesAccessible = $scope.roles12345.toString();
        }

        if (TemplateDetails.TemplateName == undefined) {
            $scope.method = "POST";
        }
        if (TemplateDetails.EffectiveFromDate == '') {
            delete TemplateDetails.EffectiveFromDate;
        }

        TemplateDetails = cleantheinputdata(TemplateDetails)

        if (getCreateCallMethod) {
            $scope.method = getCreateCallMethod;
            $scope.addandForseSaveMpidetails(TemplateDetails, $scope.method, saveAsDraft, isForcesaveTrue)
        } else if ($scope.templateName === TemplateDetails.TemplateName) {
            $scope.method = "PUT";
            $scope.addandForseSaveMpidetails(TemplateDetails, $scope.method, saveAsDraft, isForcesaveTrue)
        } else {
            delete TemplateDetails.MPITemplate_PK;

            if ($scope.HttpMethod) {
                if ($scope.HttpMethod == "Created") {
                    $scope.method = 'POST'
                    $scope.updateEntity = false
                    TemplateDetails.Creator = sessionStorage.UserID;
                    $scope.addandForseSaveMpidetails(TemplateDetails, $scope.method, saveAsDraft, isForcesaveTrue)
                } else {
                    $scope.method = 'PUT';
                    $scope.updateEntity = true;
                    $scope.takeuserbckup = TemplateDetails;
                    $("#draftOverWriteModal").modal("show");
                }
            } else {
                $scope.method = 'POST'
                TemplateDetails.Creator = sessionStorage.UserID;
                $scope.addandForseSaveMpidetails(TemplateDetails, $scope.method, saveAsDraft, isForcesaveTrue)
            }
        }
    }

    $scope.addandForseSaveMpidetails = function(tempdetails, method, saveAsDraft, isForcesaveTrue) {

        if (tempdetails.Service == 'CXC') {
            tempdetails = $scope.CXCFieldsClear(tempdetails);
        } else {
            tempdetails = $scope.NonCXCFieldsClear(tempdetails);
        }

        var mainObj = {
            url: BASEURL + '/rest/v2/manualpaymentinitiationtemplate',
            method: method,
            data: tempdetails,
            headers: {
                'Content-Type': 'application/json',
            }
        }
        if (saveAsDraft) {
            mainObj.headers.draft = true;
        }
        if (isForcesaveTrue) {
            mainObj.headers.draft = true;
            mainObj.headers['Force-Save'] = true;
        }
        $http(mainObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.dataModified = false;
            $scope.input = {
                'responseMessage': data.responseMessage
            }
            if (saveAsDraft) {
                if (data.Status === "Draft Updated") {
                    $("#draftOverWriteModal").modal("hide");

                }
            }
            $state.go('app.mpitemplate', {
                input: $scope.input
            });
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.error.message == "Draft Already Exists") {
                $("#draftOverWriteModal").modal("show");
            } else {
                $("#draftOverWriteModal").modal("hide");
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];

            }
        });
    }

    $scope.resetAllDrafts = function() {
        $("#draftOverWriteModal").modal("hide");
        setTimeout(function() {
            $scope.updateEntity = false;
        }, 100)
    }

    $scope.createDraftData = function(PaymentDetails, OrderingCustomer, BeneficiaryBank, Beneficiary, RemittanceInformation, refferdDocInfoData, discountAppliedAmountGrp, UltimateDebtor, UltimateCreditor, psaCode1, PaymentBranch, party, service11, IntermediaryBankDetails123, OrderingCustomerAccountNumber, ProductsSupported123, SaveTemplate, TemplateDetails, psaCode2, EndToEndId) {
        $scope.primaryKeyALert = false;
        checkPrimaryKeyValues(TemplateDetails);
        if ($scope.primaryKeyALert) {
            $scope.madeChanges = false;
            $("#changesLostModal").modal('show');
        } else {
            $scope.MakeCreateCall = 'POST'
            $scope.createData(PaymentDetails, OrderingCustomer, BeneficiaryBank, Beneficiary, RemittanceInformation, refferdDocInfoData, discountAppliedAmountGrp, UltimateDebtor, UltimateCreditor, psaCode1, PaymentBranch, party, service11, IntermediaryBankDetails123, OrderingCustomerAccountNumber, ProductsSupported123, SaveTemplate, TemplateDetails, psaCode2, EndToEndId, true, $scope.MakeCreateCall)
        }

    }

    $scope.SaveAsModalDraft = function() {
        $scope.MakeCreateCall = 'POST'

        $scope.createData(PaymentDetails1, OrderingCustomer1, BeneficiaryBank1, Beneficiary1, RemittanceInformation1, refferdDocInfoData1, discountAppliedAmountGrp1, UltimateDebtor1, UltimateCreditor1, psaCo1, PaymentBranch1, party1, service111, IntermediaryBankDetails1234, OrderingCustomerAccountNumber1, ProductsSupported123_1, SaveTemplate_1, TemplateDetails_1, psaCode11_1, End_1, true, $scope.MakeCreateCall)
    }

    $scope.forceSaveDraft = function() {

        $scope.MakeCreateCall = 'POST';
        var forceSaveFlag = true;
        $scope.createData(PaymentDetails1, OrderingCustomer1, BeneficiaryBank1, Beneficiary1, RemittanceInformation1, refferdDocInfoData1, discountAppliedAmountGrp1, UltimateDebtor1, UltimateCreditor1, psaCo1, PaymentBranch1, party1, service111, IntermediaryBankDetails1234, OrderingCustomerAccountNumber1, ProductsSupported123_1, SaveTemplate_1, TemplateDetails_1, psaCode11_1, End_1, true, $scope.MakeCreateCall, forceSaveFlag)
    }

    $scope.gotoEdit = function() {
        $scope.ViewClicked = false;
        GlobalService.ViewClicked = false;
        $scope.loadTemplateData(JSON.stringify($scope.FXRate))
        setTimeout(function() {
            $('.DatePicker').datepicker({
                format: "yyyy-mm-dd",
                showClear: true,
                autoclose: true,
                startDate: new Date()
            })
            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click()
            });
        }, 1500)
        isAnyFieldChanged()
    }
    $scope.deleteData = function() {
        $scope.delObj = {};
        $scope.delObj.TemplateName = $scope.FXRate.TemplateName;
        $scope.delObj.PartyCode = $scope.FXRate.PartyCode;


        $http.post(BASEURL + RESTCALL.MPITemplates + 'delete', $scope.delObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            if (!data) {
                GlobalService.Fxupdated = "Borrado exitosamente"
            } else {
                GlobalService.Fxupdated = data.responseMessage;
            }

            $('body').removeClass('modal-open')
            $location.path('app/mpitemplate')
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

    $scope.cancel = function() {
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $location.path('app/mpitemplate')
        }

    }
    $scope.datePlaceholderValue = "";
    $(document).ready(function() {

        $('#changesLostModal').on('shown.bs.modal', function(e) {
            $('.alert').hide();
            $('body').css('padding-right', 0)
        })
        $('#changesLostModal').on('hidden.bs.modal', function(e) {
            $scope.fromCancelClick = false;
            $scope.breadCrumbClicked = false;
        })
        $('#draftOverWriteModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0)
            $('.alert').hide();
        })
        $('#draftOverWriteModal').on('hidden.bs.modal', function(e) {

            setTimeout(function() {
                $scope.updateEntity = false;
            }, 100)

        })

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

    $scope.callPicker = function() {

        setTimeout(function() {
            $('.DatePicker').datepicker({
                format: "yyyy-mm-dd",
                showClear: true,
                autoclose: true,
                startDate: new Date(),
                icons: datepickerFaIcons.icons
            })
            $('.TimePicker').datetimepicker({
                format: 'HH:mm:ss',
                useCurrent: true,
                icons: datepickerFaIcons.icons
            })
            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click()
            });
        }, 1000)
    }

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


    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {
        $scope.getPartyPK = JSON.parse((hexToString(_data.Template))).Party ? JSON.parse((hexToString(_data.Template))).Party : '';

        var GetPrimaryKeys = angular.copy($rootScope.primarykey);

        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }

        if ($scope.getPartyPK != '') {
            reactivateObj['PartyCode'] = $scope.getPartyPK;
        }


        crudRequest("POST", "manualpaymentinitiationtemplate/reactivate", reactivateObj).then(function(response) {

            $scope.input = {
                'responseMessage': response.data.data.responseMessage
            }

            $state.go('app.mpitemplate', {
                input: $scope.input
            });

        })
    }

    $scope.changeClientNameValue = function(clId) {
        $scope._PartyDatas = $scope.Party_New_Rest;
        for (kdata in $scope._PartyDatas) {
            if (JSON.parse($scope._PartyDatas[kdata].id).PartyCode == clId) {
                $scope.getPartySubtype = JSON.parse($scope._PartyDatas[kdata].id).PartySubType;
                if ($scope.getPartySubtype == 'TPS') {
                    $scope.OrderingCustomer.ClientName = '';
                } else {
                    $scope.OrderingCustomer.ClientName = $scope.party123.PartyName;
                }
            }
        }
    }


});
angular.module('VolpayApp').factory('getMethodService', function($http) {
    var getMethodService = {
        fetchData: function(url) {
            var promise = $http.get(url).then(function(response) {
                return response.data;
            });
            return promise;
        }
    };
    return getMethodService;
});
angular.module('VolpayApp').directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }
                }
                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

angular.module('VolpayApp').directive('myDirective', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./1 - 9] * $ /;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('myDirective3', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^~`]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('myDirective2', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^&|'"<>!*~]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('myDirective21', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^&|"<>!*~]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});



angular.module('VolpayApp').directive('checkEmailOnBlur', function() {
    var EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ctrl) {

            if (attr.type === 'radio' || attr.type === 'checkbox') return;
            //elm.unbind('input').unbind('keydown').unbind('change');

            elm.bind('blur', function() {
                scope.$apply(function() {
                    if (EMAIL_REGX.test(elm.val())) {
                        ctrl.$setValidity('emails', true);
                    } else {
                        ctrl.$setValidity('emails', false);
                    }
                });
            });
        }
    };

});
