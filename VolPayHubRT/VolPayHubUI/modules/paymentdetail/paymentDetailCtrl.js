angular.module('VolpayApp').controller('paymentDetailCtrl', function($scope, $http, $location, $state, $timeout, $filter,  $interval, $rootScope, GlobalService, EntityLockService, AllPaymentsGlobalData, RefService, bankData, errorservice, GetPermissions) {
    $scope.newPermission = GetPermissions("All Payments");
    /**
     * Dialog declaration
     */
    var dlgElem = angular.element("#overRide");

    /** Idletimeout Listener */
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })
    $rootScope.$on("MyEventforEditIdleTimeout", function(evt, data) {
        $(window).off("mousemove keydown click");
        $interval.cancel(findEvent);
    })
    /** Idletimeout Listener */
   
    /** Idletimeout clock timer block*/
    var findEvent;
    var secondfindEvent;
    $scope.count = 0;
    $scope.seccount = 10;   
    var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
    // editTimeoutCounter = 15;
    $scope.IdleTimerStart = function () {
        $scope.count = 0;
        $scope.seccount = 10; 

        $scope.findIdleTime(); // call this method in the Modal popup triggers
    };
    $scope.IdleTimeStop = function() {
        $scope.count = 0;
        $scope.seccount = 10;   
        $scope.stopIdleTimer();
        $scope.stopsecondIdleTimer();
        $(window).off( "mousemove keydown click" );
    };
       
    $scope.findIdleTime = function() {
        findEvent = $interval(function() {
            $(window).off().on("mousemove keydown click", function() { // find the window event
                //if( $("#overRide").data('bs.modal').isShown ) {
                    // $scope.findIdleTime();
                    // $scope.stopIdleTimer();
                    $scope.count = 0;
                //} 
            });
            $scope.count += 1;
            if ($scope.count === editTimeoutCounter) {
                    $scope.unlockActionEntity();
                    $scope.stopIdleTimer(); 
                    // $scope.callIdleTime();
                    // hide the modal popup
                    $('#overRide').modal('hide');
            }
        }, 1000);
    };
    
    $scope.callIdleTime = function() {
        setTimeout(function() {
            $("#idletimeout_model").modal("show");
        }, 100)

        secondfindEvent = $interval(function() {
            $(window).on("mousemove keydown click", function() { // find the window event
                $scope.stopsecondIdleTimer();
                $scope.seccount = 10;
                setTimeout(function() {
                    $("#idletimeout_model").modal("hide");
                }, 100)
            });
            $scope.seccount -= 1;
            
            if ($scope.seccount === 0) {
                $scope.stopsecondIdleTimer();
                $scope.unlockActionEntity();
                $("#idletimeout_model").modal("hide");
                $('#overRide').modal('hide');
            }
        }, 1000);
    }
       
        $scope.stopsecondIdleTimer = function() {
           if (angular.isDefined(secondfindEvent)) { 
               $(window).off( "mousemove keydown click" );           
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

    //    $("#overRide").on("hidden.bs.modal", function () {
    //     // put your default event here
    //         $scope.IdleTimeStop();
    //     });
    /** Idletimeout clock timer block */
    
    $scope.objLength = function(obj){
        if(obj != undefined){
            return Object.keys(obj).length;
        }       
    }

    $scope.isObject = angular.isObject
    $scope.masking = true;

    $scope.backupObj = {
        value: '',
        ind: -1
    };

    $scope.rfclicked = false;

    $scope.Pconfirm = {}
    $http.get(BASEURL + '/rest/v2/confirmation/status').then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.confirmationStatus = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });

    $scope.ManualConfirmationStatusArr = ["COMPLETED", "DELIVERED", "ACCEPTED", "PROCESSING", "PENDING", "PARTIALLYACCEPTED", "PARTIALLYCOMPLETED", "COMPLETED WITH AMENDMENTS"]

    if ($state.params.input == '') {
        $state.go('app.payments')
    }

    $scope.uor = $state.params.input.uor;
    $scope.section = $state.params.input.section?$state.params.input.section:'';

    
    

    $scope.UniqueRefID = $state.params.input.nav.PID;
    $scope.attachMgsFunc = $state.params.input.nav.AttachMsg;
    $scope.PaymentID = $state.params.input.nav.PaymentID;
    $scope.attachparentID = $state.params.input.parentID;
    $scope.attachrootpaymentID = $state.params.input.rootPaymentID;
    $scope.AttachFunc = $state.params.input.Attach;
    $scope.refId = '';

    $scope.fromPage = $state.params.input.from;

    $scope.instructionType = $state.params.input.InstructionType;

    $scope.isCollapsed = false;
    $scope.isPaymentCollapsed = false;
    $scope.isPaymentInfoCollapsed = true;
    $scope.isPaymentInfoDebitPartyCollapsed = true;
    $scope.isUltimateDebtorDetailsCollapsed = true;
    $scope.isUltimateCreditorDetailsCollapsed = true;
    $scope.isPaymentInfo1173editPartyCollapsed = true;
    $scope.isPaymentInfoRoutingCollapsed = false;

    $scope.DebtorAgentCollapsed = true;
    $scope.InstructingReimbursementAgentCollapse = true;
    $scope.senderCollapsed = true;
    $scope.CreditorAgentCollapsed = true;
    $scope.IntermediaryAgent1Collapsed = true;
    $scope.IntermediaryAgent2Collapsed = true;
    $scope.ThirdReimbursementAgentCollapsed = true;
    $scope.ReceiversCorrespondentCollapsed = true;
    $scope.DebitSideDetailsCollapsed = true;
    $scope.CreditSideDetailsCollapsed = true;

    $scope.isFileInfoCollapsed = true;
    $scope.morefileInfoCollapsed = false;

    $scope.debitGroup = false;
    $scope.iscreditorGroup = false;
    $scope.additionalPaymntInfoCollapsed = false;
    $scope.additionalProcessingInfoCollapsed = false;
    $scope.fxDetailsCollapsed = false;

    $scope.loading = false;
    $scope.AuditTableLoaded = false;
    $scope.BIDLoaded = false;
    $scope.RelatedMSGLoaded = false;
    $scope.pagination = false;

    $scope.paymentObj = {};
    $scope.dropdownVal = [];
    var payObj = {};
    $scope.valCheck = 0;
    $scope.count = 0;

    $scope.IsApproveUser = sessionStorage.ROLE_ID;
    $scope.AccountPostingTab = false;
    $scope.ErrorInfoTab = false;

    $scope.paymentRepaired = GlobalService.paymentRepaired;
    
    if(GlobalService.individualobject){
        $scope.OriginalCategoryPurpose = $filter('removeSpace')(GlobalService.individualobject['OriginalCategoryPurpose']);
        $scope.individualobjectrest = GlobalService.individualobject;
    }
   
   

    if ($scope.paymentRepaired) {
        $scope.alerts = [{
            type: 'success',
            msg: "Payment Repair details have been forwarded to bank"
        }];
        GlobalService.paymentRepaired = false;
    }

    function fillData() {

        if ($scope.dropdownVal.length > 1) {
            $scope.pagination = true;
        } else {
            $scope.pagination = false;
        }

        for (var i = 0; i < $scope.dropdownVal.length; i++) {
            if ($scope.dropdownVal[i]["PaymentID"] == $scope.UniqueRefID) {
                $scope.valCheck = angular.copy(i);
                if ($scope.dropdownVal.length > 1) {
                    if (($scope.valCheck == ($scope.dropdownVal.length - 1)) && ($scope.fromPage != "filedetail")) {
                        $scope.count += 20;
                        RefService.dropDownLoadMore($scope.count).then(function(items) {
                            if (items.data.length) {
                                $scope.dropdownVal = $scope.dropdownVal.concat(items.data);
                            }
                        });
                    }
                }
            }
        }

        $scope.paymentObj.PaymentID = $scope.UniqueRefID;
        var aa, attachedRestcalls;

        if ($scope.paymentObj.PaymentID == $scope.PaymentID) {
            attachedRestcalls = BASEURL + '/rest/v2/payments/read/' + $scope.paymentObj.PaymentID;
        } else if ($scope.paymentObj.PaymentID != $scope.PaymentID) {
            if ($scope.attachrootpaymentID) {
                attachedRestcalls = BASEURL + '/rest/v2/payments/read/' + $scope.paymentObj.PaymentID;
            }
        }

        if ($scope.instructionType || $scope.attachMgsFunc || $scope.AttachFunc) {
            aa = ($scope.instructionType == 'RESPONSE') ? (BASEURL + '/rest/v2/payments/readpcdforconf/' + $scope.paymentObj.PaymentID) : (($scope.attachMgsFunc != "Customer Credit Transfer" && $scope.attachMgsFunc != "Request for Payment" && $scope.attachMgsFunc != "Payment Instruction" && $scope.attachMgsFunc != "RESPONSE" && !$scope.AttachFunc) ? (attachedRestcalls) : (($scope.AttachFunc) ? (BASEURL + '/rest/v2/payments/attachmsg/' + $scope.paymentObj.PaymentID) : (BASEURL + RESTCALL.AllPaymentListSpecificREST)));
        } else {

            aa = BASEURL + RESTCALL.AllPaymentListSpecificREST;
        }

        var methods;
        if ($scope.instructionType || $scope.attachMgsFunc || $scope.AttachFunc) {
            methods = ($scope.instructionType == 'RESPONSE') || ($scope.attachMgsFunc != "Customer Credit Transfer" && $scope.attachMgsFunc != "Request for Payment" && $scope.attachMgsFunc != "Payment Instruction" && $scope.attachMgsFunc != "RESPONSE") || ($scope.AttachFunc);
        }

        if($scope.fromPage=='transactions'){
        
            $scope.cData = GlobalService.individualobject;

        }else{
            $http({
                method: methods ? 'GET' : 'POST',
                url: aa,
                data: $scope.paymentObj
            }).then(function(allPayment) {
                $scope.cData = allPayment.data;
                           
                //Debtor subsection Details
                $scope.AdrLineDebtor = '';  
                if($scope.cData.Debtor && $scope.cData.Debtor.PstlAdr && $scope.cData.Debtor.PstlAdr.AdrLine){                             
                    for(var i=0; i < $scope.cData.Debtor.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineDebtor += ((i != 0)? ', ' : '') +  $scope.cData.Debtor.PstlAdr.AdrLine[i];                   
                    }               
                }
                $scope.AdrLineUltmtDebtor = '';            
                if($scope.cData.UltmtDebtor && $scope.cData.UltmtDebtor.PstlAdr && $scope.cData.UltmtDebtor.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.UltmtDebtor.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineUltmtDebtor += ((i != 0)? ', ' : '') + $scope.cData.UltmtDebtor.PstlAdr.AdrLine[i];
                    }                
                }
                $scope.AdrLineDebtorAgent = '';
                if($scope.cData.DebtorAgent && $scope.cData.DebtorAgent.PstlAdr && $scope.cData.DebtorAgent.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.DebtorAgent.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineDebtorAgent += ((i != 0)? ', ' : '') + $scope.cData.DebtorAgent.PstlAdr.AdrLine[i];                       
                    }
                                 
                }
                $scope.AdrLineInstructingReimbursementAgent = '';
                if($scope.cData.InstructingReimbursementAgent && $scope.cData.InstructingReimbursementAgent.PstlAdr && $scope.cData.InstructingReimbursementAgent.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.InstructingReimbursementAgent.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineInstructingReimbursementAgent += ((i != 0)? ', ' : '') + $scope.cData.InstructingReimbursementAgent.PstlAdr.AdrLine[i];
                    }                
                }
                $scope.AdrLineSender = '';
                if($scope.cData.Sender && $scope.cData.Sender.PstlAdr && $scope.cData.Sender.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.Sender.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineSender += ((i != 0)? ', ' : '') + $scope.cData.Sender.PstlAdr.AdrLine[i];
                    }                
                }
                //Creditor subsection Details
                $scope.AdrLineCreditor = '';
                if($scope.cData.Creditor && $scope.cData.Creditor.PstlAdr && $scope.cData.Creditor.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.Creditor.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineCreditor += ((i != 0)? ', ' : '') + $scope.cData.Creditor.PstlAdr.AdrLine[i];
                    }                
                } 
                $scope.AdrLineUltmtCreditor = '';           
                if($scope.cData.UltmtCreditor && $scope.cData.UltmtCreditor.PstlAdr && $scope.cData.UltmtCreditor.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.UltmtCreditor.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineUltmtCreditor += ((i != 0)? ', ' : '') + $scope.cData.UltmtCreditor.PstlAdr.AdrLine[i];
                    }                
                }  
                $scope.AdrLineCreditorAgent = '';          
                if($scope.cData.CreditorAgent && $scope.cData.CreditorAgent.PstlAdr && $scope.cData.CreditorAgent.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.CreditorAgent.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineCreditorAgent += ((i != 0)? ', ' : '') + $scope.cData.CreditorAgent.PstlAdr.AdrLine[i];
                    }                
                }
                $scope.AdrLineIntermediaryAgent1 = '';
                if($scope.cData.IntermediaryAgent1 && $scope.cData.IntermediaryAgent1.PstlAdr && $scope.cData.IntermediaryAgent1.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.IntermediaryAgent1.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineIntermediaryAgent1 += ((i != 0)? ', ' : '') + $scope.cData.IntermediaryAgent1.PstlAdr.AdrLine[i];                    
                    }                
                }
                $scope.AdrLineIntermediaryAgent2 = '';
                if($scope.cData.IntermediaryAgent2 && $scope.cData.IntermediaryAgent2.PstlAdr && $scope.cData.IntermediaryAgent2.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.IntermediaryAgent2.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineIntermediaryAgent2 += ((i != 0)? ', ' : '') + $scope.cData.IntermediaryAgent2.PstlAdr.AdrLine[i];                   
                    }                
                }
                $scope.AdrLineThirdReimbursementAgent = '';
                if($scope.cData.ThirdReimbursementAgent && $scope.cData.ThirdReimbursementAgent.PstlAdr && $scope.cData.ThirdReimbursementAgent.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.ThirdReimbursementAgent.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineThirdReimbursementAgent += ((i != 0)? ', ' : '') + $scope.cData.ThirdReimbursementAgent.PstlAdr.AdrLine[i];
                    }                
                }
                $scope.AdrLineReceiversCorrespondent = '';
                if($scope.cData.ReceiversCorrespondent && $scope.cData.ReceiversCorrespondent.PstlAdr && $scope.cData.ReceiversCorrespondent.PstlAdr.AdrLine){
                    for(var i=0; i < $scope.cData.ReceiversCorrespondent.PstlAdr.AdrLine.length; i++){
                        $scope.AdrLineReceiversCorrespondent += ((i != 0)? ', ' : '') + $scope.cData.ReceiversCorrespondent.PstlAdr.AdrLine[i];
                    }                
                }
                
    
    
                $scope._AttachMsgAccepted = [];
                if ($scope.cData && $scope.cData['Status'] && $scope.cData['Status'].toLowerCase() === 'accepted') {
                    $scope.checkIfAttachMsgAccepted($scope.cData);
                }
                $scope.refId = $scope.cData.InstructionID;
                $scope.UniqueRefID = $scope.cData.PaymentID;
                $scope.MOPForConfirm = $scope.cData.MethodOfPayment;
    
                $scope.showOverride = false;
                $scope.statusCheck = $scope.cData.Status.split('_');
    
                if ($scope.cData && $scope.cData.DetailedStatusInfo && $scope.cData.DetailedStatusInfo.indexOf('Duplicate') != -1) {
                    var str = $scope.cData.DetailedStatusInfo;
                    $scope.dupInstrStatus = str.substring(0, str.indexOf("[") - 1)
    
                    //str = str.substring(str.indexOf("[") + 1);
                    // str1 = str.substring(0, str.indexOf("]") - 1)
    
                    str1 = str.substring(
                        str.lastIndexOf("[") + 1,
                        str.lastIndexOf("]")
                    );
    
                    if (str1.indexOf(',') != -1) {
                        $scope.duplicatePaymentIds = str1.split(', ');
                    } else {
                        $scope.duplicatePaymentIds = [str1];
                    }
                }
    
                if ($scope.cData.CutOffProfile && $scope.cData.CutOffProfile.CutOffProfile) {
                    $scope.cData.CutOffProfile = $scope.cData.CutOffProfile.CutOffProfile;
                }
    
                if ($scope.cData.CalendarProfile && $scope.cData.CalendarProfile.CalendarProfile) {
                    $scope.cData.CalendarProfile = $scope.cData.CalendarProfile.CalendarProfile;
    
                }
                if ($scope.cData.InstrForCdtrAgt && $scope.cData.InstrForCdtrAgt.InstrForCdtrAgt) {
                    $scope.cData.InstrForCdtrAgt = $scope.cData.InstrForCdtrAgt.InstrForCdtrAgt;
                }
    
                if ($scope.cData.InstrForNxtAgt && $scope.cData.InstrForNxtAgt.InstrForNxtAgt) {
                    $scope.cData.InstrForNxtAgt = $scope.cData.InstrForNxtAgt.InstrForNxtAgt;
                }
    
                $scope.statusREST = {
                    "Queryfield": [{
                        "ColumnName": "WorkFlowCode",
                        "ColumnOperation": "=",
                        "ColumnValue": 'PAYMENT'
                    }, {
                        "ColumnName": "ProcessStatus",
                        "ColumnOperation": "=",
                        "ColumnValue": $scope.cData.Status
                    }]
                }
    
                $scope.statusREST = constructQuery($scope.statusREST)
    
                $scope.selectedClr = {};
                $http.post(BASEURL + RESTCALL.StatusDefnColors, $scope.statusREST).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    if (data.length) {
                        if (data[0].ColourB) {
                            $scope.selectedClr.ColourB = data[0].ColourB;
                            $scope.selectedClr.Grandient = true;
                        } else {
                            $scope.selectedClr.Grandient = false;
                        }
                        $scope.selectedClr.ColourA = data[0].ColourA;
                        $scope.selectedClr.Opacity = data[0].Opacity / 100;
    
                        $scope.appliedStyle = (!$scope.selectedClr.Grandient) ? {
                            'color': $scope.selectedClr.ColourA,
                            'opacity': $scope.selectedClr.Opacity
                        } : {
                            'background': '-webkit-linear-gradient(' + $scope.selectedClr.ColourA + ',' + $scope.selectedClr.ColourB + ')'
                        }
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
    
                $scope.taskStatusArr = '';
                $http.get(BASEURL + '/rest/v2/payments/taskstatus/' + $scope.UniqueRefID).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    for (i in data) {
                        $scope.taskStatusArr = $scope.taskStatusArr + ' ' + $filter('hex2a')(data[i].payload);
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
    
                $http.post(BASEURL + RESTCALL.PaymentRelatedMsgREST, {
                    'PaymentID': $scope.UniqueRefID
                }).then(function(paymentRelatedMsg) {
                    $scope.relatedMsgs = paymentRelatedMsg.data;
                    $scope.rowSpan = $scope.relatedMsgs.length;
                    $scope.RelatedMSGLoaded = true;
                    $scope.loading = true;
                }, function(err) {
                    errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
                })
    
                $http.post(BASEURL + RESTCALL.PaymentAuditREST, {
                    'PaymentID': $scope.UniqueRefID
                }).then(function(paymentAudit) {
                    $scope.cDataAudit = paymentAudit.data;
                    $scope.AuditTableLoaded = true;
                }, function(err) {
                    $scope.AuditTableLoaded = true;
                    errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
                })
    
                $http.post(BASEURL + RESTCALL.PaymentBIDREST, {
                    'PaymentID': $scope.UniqueRefID
                }).then(function(paymentBID) {
                    $scope.cDataBID = paymentBID.data;
                    $scope.BIDLoaded = true;
                }, function(err) {
                    errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
                })
    
                $http.post(BASEURL + '/rest/v2/payments/accountposting/readall', {
                    'PaymentID': $scope.UniqueRefID
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    $scope.AccountPostingTab = true;
                    $scope.accountPostingDetails = data;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
    
                $http.post(BASEURL + '/rest/v2/payments/errorinformation/readall', {
                    'PaymentID': $scope.UniqueRefID
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    $scope.ErrorInfoTab = true;
                    $scope.errorInformationData = data;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
    
                $http.post(BASEURL + '/rest/v2/payments/getbatchinformation', {
                    'PaymentID': $scope.UniqueRefID
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.ErrorInfoTab = true;
    
                    $scope.Batchinfo = data;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
    
                $http.post(BASEURL + RESTCALL.linkedPayements, {
                    'PaymentID': $scope.UniqueRefID
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    $scope.linkedPayments = data;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
    
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
                getForceAction()
            }, function(err) {
                $scope.alerts = [{
                    type: 'danger',
                    msg: err.data.error.message
                }];
                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            })
        }
      
    }

    $scope.customDescription = function(strVal) {
        if (strVal.indexOf('RepairID') != -1) {
            var start = strVal.indexOf("[") + 1;
            var end = strVal.indexOf("]");
            var paymentRepairID = strVal.substring(start, end);
            var str = strVal;
            $scope.paymentRepair1stDescription = str.substring(0, str.indexOf("["))
            $scope.paymentRepair2ndDescription = str.substring(end + 1, str.length)
            str = str.substring(str.indexOf("[") + 1);
            str1 = str.substring(0, str.indexOf("]"))
            if (str1.indexOf(',') != -1) {
                $scope.paymentRepairIds = str1.split(', ');
            } else {
                $scope.paymentRepairIds = [str1];
            }
        }
        $http.post(BASEURL + RESTCALL.PaymentRepairData, {
            'PaymentID': $scope.UniqueRefID,
            'RepairID': paymentRepairID
        }).then(function(repairDataResponse) {
            $scope.RepairData = repairDataResponse.data
            $scope.IncomingData = conversionData($scope.RepairData.IncomingData);
            $scope.RepairedData = conversionData($scope.RepairData.RepairedData);

            var Oldarr = [];
            var finalLabels = [];
            var finalLabelsOld = [];
            ODJSON = conversionData($scope.RepairData.IncomingData);
            NDJSON = conversionData($scope.RepairData.RepairedData);
            var finalLabels = getKeysFromJSON(NDJSON);
            var mainKey = getMainKeysFromJSON(NDJSON);
            var mainKey2 = getMainKeysFromJSON(ODJSON);
            if (mainKey != mainKey2) {
                $scope.checkOdataLength = 0;
            } else {
                $scope.checkOdataLength = Object.keys(ODJSON).length;
            }

            var keydiff = jsondiff(ODJSON, NDJSON)
            for (i in keydiff) {
                for (j in keydiff[i]) {
                    if (keydiff[i][j] == undefined) {
                        var index = Object.keys(ODJSON[i]).indexOf(j);
                        //finalLabels[index] = j;
                        finalLabels.splice(index, 0, j);
                    }
                }
            }

            if (ODJSON[mainKey] != undefined) {
                $scope.FinalDataArray = getFinalData(ODJSON[mainKey], NDJSON[mainKey], finalLabels)
            } else {
                viewNewAppData();
            }

        }, function(err) {
            $scope.alerts1 = [{
                type: 'danger',
                msg: err.data.error.message
            }]
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        });

    }

    function getKeysFromJSON(jsonData) {
        var keys = [];
        for (var k in jsonData) {
            for (var i in jsonData[k]) {
                if (i.indexOf("_PK") == -1) {
                    keys.push(i);
                }
            }
        }
        return keys;
    }

    function getMainKeysFromJSON(jsonData) {
        for (var k in jsonData) {
            return k
        }
    }

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };

    function jsondiff(obj1, obj2) {
        var result = {};
        var change;
        for (var key in obj1) {
            if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object') {
                change = jsondiff(obj1[key], obj2[key]);
                if (isEmptyObject(change) === false) {
                    result[key] = change;
                }
            } else if (obj2[key] != obj1[key]) {
                result[key] = obj2[key];
            }
        }
        return result;
    };

    function conversionData(data) {
        return $filter('Xml2Json')($filter('hex2a')(data))
    }

    function viewNewAppData() {
        NDJSON = $scope.RepairedData;
        var mainKey = getMainKeysFromJSON(NDJSON);
        var finalLabels = getKeysFromJSON(NDJSON);
        $scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
    }

    function getFinalData(ODJSON, NDJSON, finalLabels) {
        var approvalDataArray = [];
        if (Object.keys(ODJSON).length > 0) {
            for (i = 0; i < finalLabels.length; i++) {
                var tempObj = {};
                if ((ODJSON[finalLabels[i]]) != undefined) {
                    if (typeof ODJSON[finalLabels[i]] == "object" || typeof NDJSON[finalLabels[i]] == "object") {
                        NDJSON[finalLabels[i]] = JSON.stringify(NDJSON[finalLabels[i]])
                        ODJSON[finalLabels[i]] = JSON.stringify(ODJSON[finalLabels[i]])
                    }

                    if (NDJSON[finalLabels[i]] != ODJSON[finalLabels[i]]) {
                        tempObj.label = finalLabels[i];
                        tempObj.Origlabel = finalLabels[i];
                        tempObj.updatedData = NDJSON[finalLabels[i]];
                        tempObj.currentData = ODJSON[finalLabels[i]];
                        tempObj.diffence = true;
                    } else {
                        tempObj.label = finalLabels[i];
                        tempObj.Origlabel = finalLabels[i];
                        tempObj.updatedData = NDJSON[finalLabels[i]];
                        tempObj.currentData = ODJSON[finalLabels[i]];
                        tempObj.diffence = false;
                    }
                } else {
                    tempObj.label = finalLabels[i];
                    tempObj.Origlabel = finalLabels[i];

                    tempObj.updatedData = NDJSON[finalLabels[i]];
                    tempObj.currentData = "";
                    tempObj.diffence = true;
                }
                approvalDataArray.push(tempObj);
            }
        } else {
            for (j = 0; j < finalLabels.length; j++) {
                var tempObj = {};
                tempObj.label = finalLabels[j];
                tempObj.Origlabel = finalLabels[j];
                tempObj.updatedData = NDJSON[finalLabels[j]];
                tempObj.currentData = ODJSON[finalLabels[j]];
                tempObj.diffence = false;
                approvalDataArray.push(tempObj);
            }
        }
        return approvalDataArray;
    };

    function RestuctureObj(OldDataArray_1, NewDataArray_1) {
        var FinalArray = [];

        OldDataArray = Array.isArray(OldDataArray_1) ? OldDataArray_1 : [OldDataArray_1];
        NewDataArray = Array.isArray(NewDataArray_1) ? NewDataArray_1 : [NewDataArray_1];
        for (i = 0; i < NewDataArray.length; i++) {
            var ObjTemp = {};
            ObjTemp.ResourceName = NewDataArray[i].ResourceName;
            if (objectFindByKey(OldDataArray, 'ResourceName', NewDataArray[i].ResourceName) != null) {
                ObjTemp.OldPermission = Array.isArray(OldDataArray[i].PermissionList) ? OldDataArray[i].PermissionList : [OldDataArray[i].PermissionList];
            }
            ObjTemp.NewPermission = Array.isArray(NewDataArray[i].PermissionList) ? NewDataArray[i].PermissionList : [NewDataArray[i].PermissionList];
            FinalArray.push(ObjTemp)
        }
        return FinalArray;
    }
    $scope.textDocDownload = function(data) {
        bankData.textDownload($filter('hex2a')(data.OutputMessage), data.UniqueOutputReference);
    }

    $scope.fetchDataAgain = function() {
        $scope.UniqueRefID = $scope.paymentObj.PaymentID;
        fillData()
    }

    $scope.takeDeldata = function() {
        
     
        $http.post(BASEURL + RESTCALL.PaymentdeleteREST,{"PaymentID":$scope.cData.PaymentID}).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $('#delPopup').hide();
            setTimeout(function () {
        	    $('.modal-backdrop ').hide();
              }, 50)
            $scope.input = {
                'responseMessage': data.responseMessage
            }
         
            $state.go('app.payments', {
                input: $scope.input
            });


        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $('#delPopup').hide();
            setTimeout(function () {
        	    $('.modal-backdrop ').hide();
              }, 50)
            $scope.alerts = [{
                type: 'danger',
                msg: data.responseMessage
            }];
        });
    }


    if (sessionStorage.InstructionPaymentNotes == undefined) {
        $scope.NotesArr = [];
    } else {
        $scope.NotesArr = JSON.parse(sessionStorage.InstructionPaymentNotes);
    }

    $scope.data = {};
    $scope.addNotes = function(notes, toDetails) {
        $scope.Notes = {
            "InstructionID": toDetails.InstructionID,
            "PaymentID": toDetails.PaymentID,
            "Notes": notes.notes
        }
        $http.post(BASEURL + '/rest/v2/payments/notes', $scope.Notes).then(function(notes) {
            $scope.alerts = [{
                type: 'success',
                msg: notes.data.responseMessage
            }];

            $timeout(function() {
                $('.alert-success').hide;
            }, 5000)

            $scope.data.notes = ''
            $('.modal').modal('hide')

            $http.post(BASEURL + RESTCALL.PaymentAuditREST, $scope.paymentObj).then(function(paymentAudit) {
                $scope.cDataAudit = paymentAudit.data;
                $scope.AuditTableLoaded = true;
            }, function(err) {})
        }, function(err) {
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }

    if ($scope.fromPage == "filedetail" || $scope.fromPage == "AllConfirmaion") {
        $scope.dropdownVal = GlobalService.allFileListDetails;
        fillData()
    } else {
        $scope.dropdownVal = [];
        $scope.dropdownVal = (AllPaymentsGlobalData.allPaymentDetails) ? AllPaymentsGlobalData.allPaymentDetails : [];
        fillData();
    }

    $scope.NrP = function(val) {

        if (val != '') {
            $("#SelectedUniqueReferenceId :selected")[val]().prop("selected", true);
        }
        $scope.UniqueRefID = $("#SelectedUniqueReferenceId :selected").val();
        $scope.paymentID = $scope.UniqueRefID;
        $('.panel').addClass('fade-in-up');
        if ($scope.UniqueRefID != '') {
            fillData();
        }
        $timeout(function() {
            $('.panel').removeClass('fade-in-up');
        }, 500);
    }

    $scope.inputObjRepCheck = ''
    $scope.repairChk = {}
    $scope.repairChk['RepairEnabled'] = true;
    $scope.goToRepair = function(val) {
        $scope.inputObjRepCheck = {}
        $scope.inputObjRepCheck['PaymentID'] = val.data.PaymentID
        $scope.inputObjRepCheck['RepairID'] = val.data.RepairID
        //idleTimeout start here 
        //ACTION BUTTON ENTITY LOCK HERE
        var data = {}; // have to form the request payload
        data['TableName'] = 'PaymentRepairDetails';
        data['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : val.data.PaymentID});
        data['IsLocked'] = true;
        EntityLockService.checkEntityLock(data).then(function(data){ 

        $http.post(BASEURL + '/rest/v2/payments/repair/check', $scope.inputObjRepCheck).then(function(repairChk) {
            $scope.repairChk = repairChk.data

            if ($scope.repairChk['RepairEnabled']) {

                GlobalService.fileListId = val.data.InstructionID;
                GlobalService.UniqueRefID = val.data.PaymentID;
                GlobalService.fromPage = val.fromPage;

                $state.go('app.payment-repair', {
                    input: val
                })
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: 'Repair Action is enabled by other user at this moment.'
                }];
            }
        }, function(err) {
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
        }).catch(function(response){            
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
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

    $scope.goToWaitforApproval = function(URI, RepairID) {
        GlobalService.repairURI = URI;
        GlobalService.repairId = RepairID;
        $location.path('app/waitforpaymentapproval')
    }

    $scope.gotoFiledetail = function(id) {      
        GlobalService.fileListId = id;
        // $state.go('app.filedetail', {
        //     input: $state.params
            
        // })     

        $scope.Obj = {
            'uor': GlobalService.fileListId, 
            'nav': {
                'UIR': $scope.refId,
                'PID': $scope.UniqueRefID
            },         
            'from': $state.params.input.from
        }

        $state.go('app.filedetail', {
            input: $scope.Obj
        })
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }


    function HexToUTF8(hex) {
		return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
	}

    $scope.exportToDoc = function(msg) {
        bankData.textDownload(HexToUTF8(msg.MessageContents), msg.GroupInteractionUniqueID + "_" + msg.MessageInteractionUniqueID);
    }

    $scope.ExportForIE = function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
        {
            var table_html = ($('#pymntDetailTable').html()).concat($('#fileInfoTable').html()).concat($('#pymntInfoTable').html()).concat($('#tableExport').html());
            // var content2 = $('#tableExport').html();
            bankData.exportToExcelHtml(table_html, $scope.cData.InstructionID + "_" + $scope.cData.OriginalPaymentReference);
        }
    }

    var tablesToExcel = (function() {

        var uri = 'data:application/vnd.ms-excel;base64,',
            tmplWorkbookXML = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
            '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>' +
            '<Styles>' +
            '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>' +
            '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>' +
            '</Styles>' +
            '{worksheets}</Workbook>',
            tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
            tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>',
            base64 = function(s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g, function(m, p) {
                    return c[p];
                })
            }
        return function(tables, wsnames, wbname, appname) {

            var ctx = "";
            var workbookXML = "";
            var worksheetsXML = "";
            var rowsXML = "";

            for (var i = 0; i < tables.length; i++) {
                if (!tables[i].nodeType)
                    tables[i] = document.getElementById(tables[i]);
                for (var j = 0; j < tables[i].rows.length; j++) {
                    rowsXML += '<Row>'
                    for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                        var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                        var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                        var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                        dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML.trim();
                        var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                        dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null;
                        ctx = {
                            attributeStyleID: (dataStyle == 'Currency' || dataStyle == 'Date') ? ' ss:StyleID="' + dataStyle + '"' : '',
                            nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String',
                            data: (dataFormula) ? '' : dataValue,
                            attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                        };
                        rowsXML += format(tmplCellXML, ctx);
                    }
                    rowsXML += '</Row>'
                }
                ctx = {
                    rows: rowsXML,
                    nameWS: wsnames[i] || 'Sheet' + i
                };
                worksheetsXML += format(tmplWorksheetXML, ctx);
                rowsXML = "";
            }

            ctx = {
                created: (new Date()).getTime(),
                worksheets: worksheetsXML
            };
            workbookXML = format(tmplWorkbookXML, ctx);

            wbname = $scope.cData.InstructionID + "_" + $scope.cData.OriginalPaymentReference + ".xls"

            var link = document.createElement("A");
            link.href = uri + base64(workbookXML);
            link.download = wbname || 'Workbook.xls';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    })();

    $('#exportBtn').click(function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
        {
            $scope.ExportForIE();
        } else {
            tablesToExcel(['val1', 'flInfo', 'val2', 'tab1dummy', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'], ['Payment Details', 'File Information', 'Payment Information', 'Payment Event Log', 'System Interaction', 'External Communications', 'Account Posting', 'Issue Information', 'Linked Messages'], 'TestBook.xls', 'Excel');

            //tablesToExcel(['val1','flInfo','val2','tab1'], ['Payment Details','File Information','Payment Information','aaa'], 'TestBook.xls', 'Excel');
        }
    })

    $scope.exportToExcelBtnClick = function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
        {
            $scope.ExportForIE();
        } else {
            tablesToExcel(['val1', 'flInfo', 'val2', 'tab1dummy', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'], ['Payment Details', 'File Information', 'Payment Information', 'Payment Event Log', 'System Interaction', 'External Communications', 'Account Posting', 'Issue Information', 'Linked Messages'], 'TestBook.xls', 'Excel');

            //tablesToExcel(['val1','flInfo','val2','tab1'], ['Payment Details','File Information','Payment Information','aaa'], 'TestBook.xls', 'Excel');
        }
    }


    function objectFindByKey(array, key, value) {
        var findArr = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                findArr.push(array[i]);
            }
        }
        if (findArr.length > 0) {
            return findArr;
        } else {
            return null;
        }
    }

    function getForceAction() {

        $scope.nActionBtns = [];
        $http.post(BASEURL + RESTCALL.ActionREST, {
            "ProcessStatus": $scope.cData.Status,
            "WorkFlowCode": ($scope.cData.OriginalPaymentFunction == 'Request for Payment') ? "RFP_TXN" : "PAYMENT",
            "PartyServiceAssociationCode": $scope.cData.InstructionData.PartyServiceAssociationCode,
            "MOP": $scope.cData.MethodOfPayment ? ($scope.cData.MethodOfPayment.length > 0) ? $scope.cData.MethodOfPayment : "" : ""
        }).then(function(response) {
            $scope.aBtns = response.data;
            if (response.data.length > 0) {

                $scope.enableActionbuttons = response.data;
                $scope.enableActionbuttons.reverse() // Buttons arrangements are reversed in HTML view due to pull-right calss

                $scope.rfObj = {};
                $scope.empObj = [];
                for (var i in $scope.aBtns) {
                    $scope.empObj.push({
                        'ActionName': $scope.aBtns[i].ActionName
                    })
                }
                $scope.PayId = $scope.cData.PaymentID;

                $http.post(BASEURL + RESTCALL.PaymentActionDetails, {
                    PaymentID: $scope.PayId,
                    ActionName: $scope.empObj
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.chkObj = {};
                    $scope.nActionBtns = [];
                    for (var i in data) {
                        if (data[i].Applicability != 'Not Applicable') {
                            for (var j in $scope.aBtns) {
                                if ($scope.aBtns[j].ActionName == data[i].ActionName) {
                                    $scope.aBtns[j].show = data[i].Applicability
                                    $scope.nActionBtns.push($scope.aBtns[j])
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

                    $scope.nActionBtns = [];
                });
            } else {

                $scope.enableActionbuttons = response.data;
                $scope.enableActionbuttons.reverse() // Buttons arrangements are reversed in HTML view due to pull-right calss
                $scope.nActionBtns = [];
            }

        }, function(err) {
            $scope.enableActionbuttons = [];
            $scope.nActionBtns = [];
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)

        })
    }

    function getProcessCode(val) {
        $http.post(BASEURL + '/rest/v2/partyserviceassociations/read', {
            'PartyServiceAssociationCode': val
        }).then(function(response) {
            $scope.ProcessCode = response.data.ProcessCode;
            return response.data.ProcessCode;
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }

    $scope.forceAction = function(items, actions) {

        actions.show = 'Disable';
        var items = items;
        var dataObj = {}; // have to form the request payload
        dataObj['TableName'] = 'PaymentControlData';
        dataObj['ActionName'] = actions.ActionName;
        dataObj['IsLocked'] = true;
        dataObj['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : items.PaymentID});

        $scope.lockUnlockActionEntity(dataObj); 

        var obj1 = {};
        obj1.payments = [{
            "PaymentID": items.PaymentID
        }];

        var method = actions.RestMethod;
        var REST_URL = '/rest' + actions.RestURL;

        $http({
            url: BASEURL + REST_URL,
            method: method,
            data: obj1,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            // unlock forceaction entity 
            var dataObj = {}; // have to form the request payload
            dataObj['TableName'] = 'PaymentControlData';
            dataObj['ActionName'] = actions.ActionName;
            dataObj['IsLocked'] = false;
            dataObj['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : items.PaymentID});
            $scope.lockUnlockActionEntity(dataObj);

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.bulkOverride = data.responseMessage;
            if ((actions.SuccessURL != '') && (actions.SuccessURL != undefined)) {
                $location.path(actions.SuccessURL);
            } else {
                $location.path('app/allpayments')
            }
        }).catch(function onError(response) {
            //unlock force actioin entity 
            var dataObj = {}; // have to form the request payload
            dataObj['TableName'] = 'PaymentControlData';
            dataObj['ActionName'] = actions.ActionName;
            dataObj['IsLocked'] = false;
            dataObj['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : items.PaymentID});
            $scope.lockUnlockActionEntity(dataObj);

            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            actions.show = 'Enable';

            if ((actions.failureURL != '') && (actions.failureURL != undefined)) {
                $location.path(actions.failureURL);
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
                errorservice.ErrorMsgFunction(config, $scope, $http, status)

                //$location.path('app/allpayments')
            }
        });
    }

    $scope.resendAction = function(values) {
        var obj1 = {};
        obj1.GrpReferenceId = values.GrpReferenceId;
        obj1.InvocationPoint = values.InvocationPoint;
        obj1.Relationship = values.Relationship;
        obj1.Status = values.Status;

        $http({
            url: BASEURL + '/rest/v2/interface/request/resend',
            method: 'POST',
            data: obj1,
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

            $http.post(BASEURL + RESTCALL.PaymentBIDREST, $scope.paymentObj).then(function(paymentBID) {
                $scope.cDataBID = paymentBID.data;
                $scope.BIDLoaded = true;
            }, function(err) {})
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
                //$location.path(actions.failureURL);
        });
    }

    $scope.resubmitAction = function(value) {
        $scope.fetchDataAgain();
        var obj2 = {};
        obj2.GrpReferenceId = value.GrpReferenceId;
        obj2.InvocationPoint = value.InvocationPoint;
        obj2.Relationship = value.Relationship;
        obj2.Status = value.Status;

        $http({
            url: BASEURL + '/rest/v2/interface/request/resubmit',
            method: 'POST',
            data: obj2,
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

            $http.post(BASEURL + RESTCALL.PaymentBIDREST, $scope.paymentObj).then(function(paymentBID) {
                $scope.cDataBID = paymentBID.data;
                $scope.BIDLoaded = true;
            }, function(err) {})
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
                //$location.path(actions.failureURL);
        });
    }

    $scope.fetchedData = {};
    $scope.fetchData = function(addButtons) {
        var Inputdata = {}
        Inputdata[addButtons.InputObjKey] = $scope.UniqueRefID;

        var method = addButtons.REST_Method;
        var REST_URL = '/rest' + addButtons.REST;

        $http({
            url: BASEURL + REST_URL,
            method: method,
            data: Inputdata,
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

            $scope.fetchedData = data;

            if ((addButtons.SuccessURL != '') && (addButtons.SuccessURL != undefined)) {
                $location.path(addButtons.SuccessURL);
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if ((addButtons.failureURL != '') && (addButtons.failureURL != undefined)) {
                $location.path(addButtons.failureURL);
            }
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    var modalPopButton = '';
    if (sessionStorage.PopUpAddonData != undefined) {
        $scope.PopUpAddonData = JSON.parse(atob(sessionStorage.PopUpAddonData));
        if ($scope.PopUpAddonData.length > 0) {
            var thisPageNewActions = objectFindByKey($scope.PopUpAddonData, 'Page', $location.path());
            if (thisPageNewActions[0].Page == $location.path()) {
                $scope.modalPopButton = thisPageNewActions[0].CurrentState;
            }
        }
    }

    $scope.paymentConfirm = function(confirm1, MOPForConfirm) {
        confirm1.InstructionID = $scope.refId;

        confirm1 = cleantheinputdata(confirm1);
        $http.post(BASEURL + '/rest/v2/confirmation/' + MOPForConfirm, confirm1).then(function onSuccess(response) {
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

            $('.modal').modal('hide')
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

    $scope.clickReferenceBatchID = function(val) {

        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.data.BatchID;
        GlobalService.fromPage = val.fromPage;

        $scope.Obj = {
            'uor': val.data.OutputInstructionID,
            'nav': {
                'BatchID': val.data.BatchID,
                'BID': val.data.BatchID
            },
            'from': 'allpayments'
        }

        $state.go('app.allbatchesdetail', {
            input: $scope.Obj
        })
    }

    $scope.clickReferenceID = function(val) {

        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.LinkedMsgID['LinkedMsgID'];
        GlobalService.fromPage = val.fromPage;

        if (val.LinkedMsgID['LinkedMsgFunc'].toLowerCase().indexOf('statement') != -1) {
            GlobalService.fileListId = val.LinkedMsgID['LinkedMsgID'];
            $scope.Obj = {
                'uor': (val.data.OutputInstructionID) ? val.data.OutputInstructionID : '',
                'nav': {
                    'UIR': val.data.InstructionID,
                    'PID': val.LinkedMsgID['LinkedMsgID']
                },
                'from': val.fromPage
            }
            $state.go('app.statementdetail', {
                input: $scope.Obj
            })
        } else {
            $scope.Obj = {
                'uor': (val.data.OutputInstructionID) ? val.data.OutputInstructionID : '',
                'nav': {
                    'UIR': val.data.InstructionID,
                    'PID': val.LinkedMsgID['LinkedMsgID']
                },
                'from': val.fromPage
            }
            $state.go('app.paymentdetail', {

                input: $scope.Obj
            })
        }
    }

    $scope.goToPaymentSummary = function(val) {
        $scope.Obj = {
            'uor': val,
            'nav': {
                'UIR': $scope.refId,
                'PID': $scope.UniqueRefID
            },
            'from': $state.params.input.from
                //'from': ($scope.fromPage == 'allpayments')?'allpayments':'filedetail'
        }
        $state.go('app.outputpaymentsummary', {
            input: $scope.Obj
        })
    }

    $scope.iteratedObj = {};
    $scope.fieldDetails = {
        section: [],
        subSection: []
    };

    $scope.updatedfieldDetailsSubsection = [{
        fields: []
    }];

    function iterateSubObj(argu, group, flag) {
        $scope.section = {};
        $scope.section = {
            'name': group.name,
            'type': group.type,
            'showsectionheader': group.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': group.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': group.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': group.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': group.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': group.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': [],
            'subArrOccurs': []
        }

        var iArr = [];
        for (var i in argu) {
            if (argu[i].type != 'Section') {
                $scope.section.subArr.push($scope.objectIttration(argu[i]))
            } else {
                $scope.section = subsectionIterate($scope.section, argu[i], argu[i].fieldGroup1.webformsectiongroup.fields.field)
            }
            $scope.iteratedObj = {}
        }
        return $scope.section;
    }

    function subArrOccurs(data, name) {
        var b = {};
        for (z in data) {
            if (data[z].subArr && data[z].name == name) {
                data[z].subArr.forEach(function(ind, i) { b[i] = ind })
                b = angular.copy(b);
                data[z].subArrOccurs.push(b);
            }
        }
    }

    function iterateSubArr(argu, group, flag) {
        $scope.section = {};
        $scope.section = {
            'name': group.name,
            'type': group.type,
            'showsectionheader': group.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': group.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': group.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': group.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': group.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': group.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': [],
            'subArrOccurs': []
        }

        var iArr = [];
        for (var i in argu) {
            if (argu[i].type != 'Section') {
                iArr.push($scope.objectIttration(argu[i]))
            } else {
                $scope.section.subArr.push({
                    'fields': iArr
                });
                subsectionIterateArr($scope.section, argu[i], argu[i].fieldGroup1.webformsectiongroup.fields.field)
            }
            $scope.iteratedObj = {}
        }

        $scope.section.subArr.push({
            'fields': iArr
        });
        iArr = [];
        return $scope.section;
    }

    function subsectionIterate(obj, arg1, arg2) {

        $scope.subArr = {
            'name': arg1.name,
            'type': arg1.type,
            'showsectionheader': arg1.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': arg1.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': arg1.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': arg1.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': arg1.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': arg1.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': [],
            'subArrOccurs': []
        };

        $scope.iteratedObj = {}
        for (var i in arg2) {
            $scope.iteratedObj = {};
            if (arg2[i].type != 'Section') {
                $scope.subArr.subArr.push($scope.objectIttration(arg2[i]))
            } else {
                $scope.ssg = {
                    'name': arg2[i].name,
                    'type': arg2[i].type,
                    'showsectionheader': arg2[i].fieldGroup1.webformsectiongroup.showsectionheader,
                    'sectionheader': arg2[i].fieldGroup1.webformsectiongroup.sectionheader,
                    'indentsubfields': arg2[i].fieldGroup1.webformsectiongroup.indentsubfields,
                    'customsectionlayout': arg2[i].fieldGroup1.webformsectiongroup.customsectionlayout,
                    'minoccurs': arg2[i].fieldGroup1.webformsectiongroup.minoccurs,
                    'maxoccurs': arg2[i].fieldGroup1.webformsectiongroup.maxoccurs,
                    'subArr': [],
                    'subArrOccurs': []
                }

                for (var k in arg2[i].fieldGroup1.webformsectiongroup.fields.field) {
                    if (arg2[i].fieldGroup1.webformsectiongroup.fields.field[k].type != 'Section') {
                        $scope.iteratedObj = {};
                        $scope.ssg.subArr.push($scope.objectIttration(arg2[i].fieldGroup1.webformsectiongroup.fields.field[k]))
                    } else {
                        var nd = arg2[i].fieldGroup1.webformsectiongroup.fields.field[k];
                        $scope.ssg1 = {
                            'name': nd.name,
                            'type': nd.type,
                            'showsectionheader': nd.fieldGroup1.webformsectiongroup.showsectionheader,
                            'sectionheader': nd.fieldGroup1.webformsectiongroup.sectionheader,
                            'indentsubfields': nd.fieldGroup1.webformsectiongroup.indentsubfields,
                            'customsectionlayout': nd.fieldGroup1.webformsectiongroup.customsectionlayout,
                            'minoccurs': nd.fieldGroup1.webformsectiongroup.minoccurs,
                            'maxoccurs': nd.fieldGroup1.webformsectiongroup.maxoccurs,
                            'subArr': [],
                            'subArrOccurs': []
                        }
                        for (var l in arg2[i].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field) {
                            $scope.iteratedObj = {};
                            $scope.ssg1.subArr.push($scope.objectIttration(arg2[i].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field[l]))
                        }
                        $scope.ssg.subArr.push($scope.ssg1)
                    }
                }
                $scope.subArr.subArr.push($scope.ssg)
            }
        }
        obj.subArr.push($scope.subArr)
        return obj;
    }

    function subsectionIterateArr(obj, arg1, arg2) {

        $scope.subArr = {
            'name': arg1.name,
            'type': arg1.type,
            'showsectionheader': arg1.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': arg1.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': arg1.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': arg1.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': arg1.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': arg1.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': [],
            'subArrOccurs': []
        };

        var iArr1 = [];
        for (var i in arg2) {
            if (arg2[i].type != 'Section') {
                iArr1.push($scope.objectIttration(arg2[i]))
            } else {
                var nd = arg2[i].fieldGroup1.webformsectiongroup.fields.field;
                $scope.sn = {
                    'name': arg2[i].name,
                    'type': arg2[i].type,
                    'showsectionheader': arg2[i].fieldGroup1.webformsectiongroup.showsectionheader,
                    'sectionheader': arg2[i].fieldGroup1.webformsectiongroup.sectionheader,
                    'indentsubfields': arg2[i].fieldGroup1.webformsectiongroup.indentsubfields,
                    'customsectionlayout': arg2[i].fieldGroup1.webformsectiongroup.customsectionlayout,
                    'minoccurs': arg2[i].fieldGroup1.webformsectiongroup.minoccurs,
                    'maxoccurs': arg2[i].fieldGroup1.webformsectiongroup.maxoccurs,
                    'subArr': [],
                    'subArrOccurs': []
                }

                for (var x in nd) {
                    $scope.sn.subArr.push($scope.objectIttration(nd[x]))
                    $scope.iteratedObj = {}
                }
                iArr1.push($scope.sn)
            }
            $scope.iteratedObj = {}
        }

        $scope.subArr.subArr = iArr1
        iArr1 = [];
        obj.subArr[0].fields.push($scope.subArr);
        obj.subArr.splice(0, 1)
        return obj;
    }

    $scope.deepBackup = {};

    function webformIttration(argu) {

        $scope.deepBackup = {};
        $scope.iteratedObj = {};
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        var obtainedFields = argu.webformuiformat.fields.field;
        $scope.obtainThisKeys = ['name', 'type', 'columnspan', 'rowspan', 'enabled', 'label', 'labelposition', 'newrow', 'notnull', 'visible', 'width', 'renderer', 'customsectionlayout', 'indentsubfields', 'maxoccurs', 'minoccurs', 'sectionheader', 'showsectionheader', 'dateformat', 'property', 'choiceOptions', 'defaultvalue']
        var k = '';
        var j = '';

        for (j in obtainedFields) {
            if ('webformfieldgroup' in obtainedFields[j].fieldGroup1) {
                $scope.iteratedObj = {};
                $scope.fieldDetails.section.push($scope.objectIttration(obtainedFields[j]))
            } else {
                if (obtainedFields[j].type != 'Section') {
                    $scope.fieldDetails.section.push($scope.objectIttration(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field))
                } else if (obtainedFields[j].type == 'Section') {
                    $scope.iteratedObj['sectionlabel'] = obtainedFields[j].name;
                    $scope.fieldDetails.subSection.push({
                        'name': ('name' in obtainedFields[j] ? obtainedFields[j].name : ''),
                        'type': ('type' in obtainedFields[j] ? obtainedFields[j].type : ''),
                        'showsectionheader': ('showsectionheader' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.showsectionheader : ''),
                        'sectionheader': ('sectionheader' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.sectionheader : ''),
                        'indentsubfields': ('indentsubfields' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.indentsubfields : ''),
                        'customsectionlayout': ('customsectionlayout' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.customsectionlayout : ''),
                        'minoccurs': ('minoccurs' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.minoccurs : ''),
                        'maxoccurs': ('maxoccurs' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.maxoccurs : ''),
                        'subArr': [],
                        'subArrOccurs': []
                    });

                    for (k in obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field) {
                        if (obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].type == "Section") {
                            if (obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.maxoccurs == -1) {
                                $scope.fieldDetails.subSection[j]['subArr'].push(iterateSubArr(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k], false))
                            } else {
                                $scope.fieldDetails.subSection[j]['subArr'].push(iterateSubObj(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k], false))
                            }
                        } else {
                            for (z in $scope.fieldDetails.subSection) {
                                if (obtainedFields[j].name == $scope.fieldDetails.subSection[z].name) {
                                    $scope.iteratedObj = {};
                                    $scope.fieldDetails.subSection[z].subArr.push($scope.objectIttration(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k]));
                                    break;
                                }
                            }
                        }

                        for (l in Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)) {
                            if (($scope.obtainThisKeys).indexOf(Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]) != -1) {
                                $scope.iteratedObj[Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]] = Object.values(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]
                            }
                        }
                        $scope.iteratedObj = {}
                    }
                    subArrOccurs($scope.fieldDetails.subSection, obtainedFields[j].name);
                }

            }
        }

        for (var x in $scope.fieldDetails.section) {
            if ('Choice' in $scope.fieldDetails.section[x].renderer) {
                if ($scope.fieldDetails.section[x].renderer.Choice.choiceOptions[0].actualvalue == 'REST') {
                    var prop = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value
                    for (mydata in $scope.fieldDetails.section[x].renderer.Choice.customattributes.property) {
                        if ($scope.fieldDetails.section[x].renderer.Choice.customattributes.property[mydata].value.indexOf('{') != -1) {
                            $scope.restPath = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[mydata].value.split('{')[0] + $scope[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property[0].value];
                        } else {
                            $scope.restPath = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[mydata].value
                        }
                        if ($scope.fieldDetails.section[x].renderer.Choice.customattributes.property[mydata].name.indexOf('REST') != -1) {
                            getChoiceOption('GET', $scope.restPath, x)
                        }
                    }

                }
            }
        }

        $scope.bDataForFields = angular.copy($scope.fieldDetails);
        $scope.addData = angular.copy($scope.fieldDetails);
        $scope.backupObj.value = $scope.bDataForFields.section;
        $scope.deepBackup = angular.copy($scope.bDataForFields);

        for (var _z in $scope.fieldDetails['subSection']) {
            if ($scope.fieldDetails['subSection'][_z]['type'] == "Section" && $scope.fieldDetails['subSection'][_z]['maxoccurs'] == -1 && Object.keys($scope.fieldData).indexOf($scope.fieldDetails['subSection'][_z]['name']) == -1) {
                $scope.fieldData[$scope.fieldDetails['subSection'][_z]['name']] = [{}];
            }
        }
        return $scope.fieldDetails
    }

    function getChoiceOption(_method, url, x) {
        return $http({
            method: _method,
            url: BASEURL + '/rest/v2/' + url
        }).then(function(response) {
            $scope.fieldDetails.section[x].renderer.Choice.choiceOptions = response.data;
            $scope.bDataForFields = angular.copy($scope.fieldDetails)
            $scope.backupObj.value = $scope.bDataForFields.section;
            return response.data;
        }, function(data) {
            $scope.alerts1 = [{
                type: 'danger',
                msg: data.data.error.message
            }];
        })
    }

    function getTextAreaData(_method, url, x) {

        return $http({
            method: _method,
            url: BASEURL + '/rest/v2/' + url
        }).then(function(response) {
            $scope.fieldData[x.name] = response.data[0].actualvalue;
        }, function(data) {
            $scope.fieldData[x.name] = '';
            $scope.alerts1 = [{
                type: 'danger',
                msg: data.data.error.message
            }];

            $timeout(function() {
                $('.alert-danger').hide();
            }, 5000)
        })

    }

    $scope.objectIttration = function(argu, k, l) {

        for (var key in argu) {
            if (argu.hasOwnProperty(key)) {
                if (typeof(argu[key]) == 'object') {
                    $scope.objectIttration(argu[key], k, l);
                    if (($scope.obtainThisKeys).indexOf(key) != -1 && !(key in $scope.iteratedObj)) {
                        $scope.iteratedObj[key] = argu[key]
                    }
                } else {
                    if (($scope.obtainThisKeys).indexOf(key) != -1 && !(key in $scope.iteratedObj)) {
                        $scope.iteratedObj[key] = argu[key]
                    }
                }
            }
        }
        return $scope.iteratedObj
    }

    $scope.fieldData = {};
    $scope.PayId = $scope.UniqueRefID;
    $scope.paymentID = $scope.UniqueRefID;

    $scope.callInterfaceOverride = function() {

        $scope.iteratedObj = {};
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        $scope.fieldData = {};

        /*$scope.alerts1 = [{
        type : 'danger',
        msg : 'Please fill all the mandatory fields'
        }];*/

        $('.alert-danger').hide();

        $http.post(BASEURL + RESTCALL.PaymentInterface, {
            "PaymentID": $scope.PayId
        }).then(function(val) {
            $scope.allResponse = val;
            $scope.globalObj = angular.copy(val.data);
            $scope.globalObj.CMetaInfo = JSON.parse(atob($scope.globalObj.metaInfo)).Data;
            $scope.globalObj.CData = JSON.parse(atob($scope.globalObj.data));

            $timeout(function() {
                $scope.fieldData = $scope.globalObj.CData;
            }, 100)

            $scope.backupData = angular.copy($scope.globalObj.CData)
            $scope.fieldDetails = [];
            $scope.iteratedObj = {}

            webformIttration($scope.globalObj.CMetaInfo)
        }, function(data) {
            $scope.alerts1 = [{
                type: 'danger',
                msg: data.data.error.message
            }];
            errorservice.ErrorMsgFunction(data, $scope, $http, data.status)
        })
    }

    $scope.iteratedFields = [];

    function constructObj(inFields) {

        for (var i in inFields) {
            if (inFields[i].type != 'Section') {} else if (inFields[i].type == 'Section') {

                $scope.iteratedFields.push({
                    'name': inFields[i].name,
                    'type': inFields[i].type,
                    'showsectionheader': inFields[i].fieldGroup1.webformsectiongroup.showsectionheader,
                    'sectionheader': inFields[i].fieldGroup1.webformsectiongroup.sectionheader,
                    'indentsubfields': inFields[i].fieldGroup1.webformsectiongroup.indentsubfields,
                    'customsectionlayout': inFields[i].fieldGroup1.webformsectiongroup.customsectionlayout,
                    'minoccurs': inFields[i].fieldGroup1.webformsectiongroup.minoccurs,
                    'maxoccurs': inFields[i].fieldGroup1.webformsectiongroup.maxoccurs,
                    'group': []

                })
                $scope.TempVal = [];

                for (var j in inFields[i].fieldGroup1.webformsectiongroup.fields.field) {
                    if (inFields[i].fieldGroup1.webformsectiongroup.fields.field[j].type == 'Section') {
                        constructObj(inFields[i].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field)
                    }
                }
                $scope.iteratedObj = {};
            }
        }
    }

    $scope.cleantheinputdata = function(newData) {
        $.each(newData, function(key, value) {
            delete newData.$$hashkey;
            if ($.isPlainObject(value)) {
                var isEmptyObj = $scope.cleantheinputdata(value)
                if ($.isEmptyObject(isEmptyObj)) {
                    delete newData[key]
                }
            } else if (Array.isArray(value)) {
                if (value.length) {
                    $.each(value, function(k, v) {
                        if (typeof(v) != 'object') {
                            if (Array.isArray(newData[key])) {
                                newData[key] = newData[key].toString()
                            }
                        } else {
                            var isEmptyObj = $scope.cleantheinputdata(v)
                        }
                    })
                } else {
                    delete newData[key]
                }
            } else if (value === "" || value === undefined || value === null) {
                delete newData[key]
            }
        })
        return newData
    }

    $scope.formSubmitted = false;
    $scope.interfaceSubmit = function(val) {

        $scope.formSubmitted = true;
        $scope.rfclicked = true;

        val = $scope.cleantheinputdata(val)
        $scope.responseObj = {
            "paymentID": $scope.PayId,
            "domainInWebFormName": $scope.globalObj.metaInfoName,
            "DomainIn": btoa(JSON.stringify(val))
        }

        $http.post(BASEURL + RESTCALL.PaymentInterfaceOverride, $scope.responseObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $('.modal').modal('hide')

            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }]
            $scope.rfclicked = false;
            var iCnt = 0;
            var iInterval = '';
            clearInterval(iInterval)
            iInterval = setInterval(function() {
                $scope.fetchDataAgain()
                iCnt++;
                if (iCnt == 3) {
                    clearInterval(iInterval)
                }
            }, 1500)
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.rfclicked = false;
            $scope.alerts1 = [{
                type: 'danger',
                msg: data.error.message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    var fArr = [];
    var chkVal = '';
    var newArr = [];
    var splitVal;
    var propObj = {};
    var prev = '';

    $scope.bSectionData = {};
    $scope.sectionFlag = false;
    $scope.sectionDropdownChanged = false;
    var flagDefaultValue = false;
    $scope.diabledFields = function(val, field, allfields, fulldata, obj) {

        prev = field.name;
        newArr = [];
        if (val) {
            if (val == 'PECR') {
                $scope.fieldData['Amount'] = '';
            } else if (val == 'IPAY') {
                $scope.fieldData['Amount'] = $scope.defaultAmountvalue;
            }

            for (var i in field.property) {
                if (field.property[i].name.indexOf('|') != -1 && field.property[i].name.split('|')[0] == 'VALUE') {
                    if (val == field.property[i].name.split('|')[1]) {
                        $scope.parsedVal = JSON.parse(field.property[i].value)
                        if (obj) {
                            for (var _i in $scope.updatedfieldDetailsSubsection[obj.index].fields) {
                                for (var _j in $scope.parsedVal) {
                                    if ($scope.updatedfieldDetailsSubsection[obj.index].fields[_i].name == _j) {
                                        for (var _x in $scope.parsedVal[_j]) {
                                            $scope.sectionDropdownChanged = true;
                                            $scope.updatedfieldDetailsSubsection[obj.index].fields[_i][_x.toLowerCase()] = $scope.parsedVal[_j][_x];
                                        }

                                    }
                                }
                            }
                        } else {
                            for (var i in $scope.parsedVal) {
                                for (var j in fulldata) {
                                    for (var z in fulldata[j]) {
                                        if (fulldata[j][z]['type'] == 'Section') {
                                            $scope.updatedfieldDetailsSubsection = [{
                                                fields: $scope.deepBackup['subSection'][0].subArr
                                            }];

                                            $scope.sectionFlag = false;
                                            for (var l in fulldata[j][z].subArr) {
                                                if (i == fulldata[j][z].subArr[l].name) {
                                                    for (var pp in $scope.bDataForFields['subSection']) {
                                                        fulldata[j][z].subArr = angular.copy($scope.bDataForFields['subSection'][pp].subArr)
                                                    }
                                                    for (x in $scope.parsedVal[i]) {
                                                        fulldata[j][z].subArr[l][x.toLowerCase()] = $scope.parsedVal[i][x];
                                                        $scope.fieldData[i] = '';
                                                    }
                                                    $scope.bSectionData[i] = angular.copy(fulldata[j][z].subArr[l]);
                                                }
                                                if (fulldata[j][z].subArr[l].visible) {
                                                    $scope.sectionFlag = true;
                                                }
                                            }
                                        } else {
                                            if (i == fulldata[j][z].name) {
                                                for (x in $scope.parsedVal[i]) {
                                                    fulldata[j][z][x.toLowerCase()] = $scope.parsedVal[i][x];
                                                }
                                            }
                                        }
                                    }


                                }
                            }
                        }

                        break;
                    } else {
                        for (var i in field.property) {
                            if (field.property[i].name.indexOf('|') != -1 && field.property[i].name.split('|')[0] == 'VALUE') {
                                $scope.pVal = JSON.parse(field.property[i].value)
                                for (var j in $scope.pVal) {
                                    for (var x in $scope.backupObj.value) {
                                        if ($scope.backupObj.value[x].name == j) {
                                            allfields[x] = angular.copy($scope.backupObj.value[x])
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            var restpath1 = '';
            for (x in fulldata.section) {

                if ('defaultvalue' in fulldata.section[x]) {

                    var url = fulldata.section[x].defaultvalue
                    url = url.substring(2, url.length - 1)
                    var backupUrl = angular.copy(url);
                    var urlFlag = false;
                    if (url && url.indexOf('/') !== -1) {
                        var urlArr = url.split('/')
                        for (var _url in urlArr) {
                            if (urlArr[_url].startsWith('{') && urlArr[_url].endsWith('}')) {
                                var _id = urlArr[_url].substring(1, urlArr[_url].length - 1)

                                if ($('[name=' + _id + ']').val()) {
                                    urlFlag = true;
                                    backupUrl = backupUrl.replace(urlArr[_url], $('[name=' + _id + ']').val())
                                } else if ($scope[_id]) {
                                    urlFlag = true
                                    backupUrl = backupUrl.replace(urlArr[_url], $scope[_id])


                                } else {
                                    urlFlag = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (urlFlag) {

                        getTextAreaData('GET', backupUrl, fulldata.section[x])
                        flagDefaultValue = true;
                    } else {

                    }
                }
            }
            // }
            if ((val == 'MPNS') || (val == 'RTGS') || (val == 'RTNS')) {
                if ($scope.fieldData['AcceptOrRejectROFRequest'] == 'IPAY') {
                    for (i = 0; i < allfields.length; i++) {
                        if (allfields[i]['name'] == 'Amount') {
                            allfields[i]['enabled'] = false;
                        }
                    }
                }
            }

        } else {
            for (x in fulldata.section) {
                if (flagDefaultValue && 'defaultvalue' in fulldata.section[x]) {
                    if (val === "" || val === undefined || val === null) {
                        $scope.fieldData[fulldata.section[x].name] = '';
                        $('[name=' + fulldata.section[x].name + ']').val('');
                        flagDefaultValue = false;
                    }
                }
            }
            if (obj != undefined && 'type' in obj && obj['type'] == 'subsection') {
                for (var ll in $scope.bDataForFields) {
                    for (var mm in $scope.bDataForFields[ll]) {
                        for (var nn in $scope.bDataForFields[ll][mm].subArr) {

                            if (field.name != $scope.bDataForFields[ll][mm].subArr[nn].name) {

                                for (var qq in $scope.updatedfieldDetailsSubsection[obj.index].fields) {
                                    if (field.name != $scope.updatedfieldDetailsSubsection[obj.index].fields[qq].name) {
                                        let aVal = ["enabled", "notnull", "visible"];
                                        for (var action in aVal) {
                                            $scope.updatedfieldDetailsSubsection[obj.index].fields[qq][aVal[action]] = $scope.bDataForFields[ll][mm].subArr[nn][aVal[action]];
                                            obj['model'] = "";
                                        }

                                    }
                                }
                            }
                        }
                    }
                }

            } else {
                for (var i in field.property) {
                    if (field.property[i].name.indexOf('|') != -1 && field.property[i].name.split('|')[0] == 'VALUE') {
                        $scope.pVal = JSON.parse(field.property[i].value)

                        for (var x in fulldata) {
                            for (var y in fulldata[x]) {
                                for (var z in $scope.bDataForFields[x]) {

                                    if (fulldata[x][y].type != 'Section') {
                                        if ($scope.bDataForFields[x][z].name == fulldata[x][y].name) {

                                            let aVal = ["enabled", "notnull", "visible"];
                                            for (var prop in aVal) {
                                                fulldata[x][y][aVal[prop]] = $scope.bDataForFields[x][z][aVal[prop]]
                                            }

                                            $scope.fieldData[fulldata[x][y].name] = "";

                                        }
                                    } else {
                                        for (var p in fulldata[x][y].subArr) {
                                            for (var q in $scope.bDataForFields['subSection']) {
                                                for (var r in $scope.bDataForFields['subSection'][q].subArr) {
                                                    if ($scope.bDataForFields['subSection'][q].subArr[r].name == fulldata[x][y].subArr[p].name) {

                                                        $scope.sectionFlag = false;
                                                        let keys = Object.keys($scope.pVal);
                                                        for (var s in keys) {
                                                            if (keys[s] == fulldata[x][y].subArr[p].name) {

                                                                $scope.updatedfieldDetailsSubsection = [{
                                                                    fields: $scope.deepBackup['subSection'][0].subArr
                                                                }];

                                                                fulldata[x][y].subArr = $scope.deepBackup['subSection'][q].subArr;
                                                            }
                                                        }

                                                        if (fulldata[x][y].subArr[p].visible) {
                                                            $scope.sectionFlag = true;
                                                        }

                                                    }
                                                }

                                            }
                                        }

                                    }

                                }
                            }
                        }

                    }
                }
            }
        }
    }

    $scope.disabledSubFields = function(val, field, allfields, fulldata, obj) {
        if (val) {
            for (var i in field.property) {
                if (field.property[i].name.indexOf('|') != -1 && field.property[i].name.split('|')[0] == 'VALUE') {
                    if (val == field.property[i].name.split('|')[1]) {
                        let parsedVal = JSON.parse(field.property[i].value)
                        if (obj) {
                            for (var _i in fulldata.subSection[obj.pIndex].subArrOccurs) {
                                for (var _j in parsedVal) {
                                    for (var _k in fulldata.subSection[obj.pIndex].subArrOccurs[_i]) {
                                        if (fulldata.subSection[obj.pIndex].subArrOccurs[_i][_k].name == _j && _i == obj.sIndex) {
                                            for (var _x in parsedVal[_j]) {
                                                $scope.sectionDropdownChanged = true;
                                                fulldata.subSection[obj.pIndex].subArrOccurs[_i][_k][_x.toLowerCase()] = parsedVal[_j][_x];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    } else {
                        for (var i in field.property) {
                            if (field.property[i].name.indexOf('|') != -1 && field.property[i].name.split('|')[0] == 'VALUE') {
                                if (val != field.property[i].name.split('|')[1]) {
                                    let pVal = JSON.parse(field.property[i].value);
                                    for (var _i in fulldata.subSection[obj.pIndex].subArrOccurs) {
                                        for (var _j in pVal) {
                                            for (var _k in fulldata.subSection[obj.pIndex].subArrOccurs[_i]) {
                                                if (fulldata.subSection[obj.pIndex].subArrOccurs[_i][_k].name == _j && _i == obj.sIndex) {
                                                    for (var _x in pVal[_j]) {
                                                        $scope.sectionDropdownChanged = true;
                                                        fulldata.subSection[obj.pIndex].subArrOccurs[_i][_k][_x.toLowerCase()] = pVal[_j][_x];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    $scope.aBtnVal = 'override';
    $scope.chkBtnvalue = function(val) {
        $scope.aBtnVal = val.toLowerCase();
    }

    $scope.chkProperty = function(arg) {
        if ($.isArray(arg)) {
            $scope.chkProperty(arg[0])
        } else {
            if ('property' in arg) {
                for (var i in arg['property']) {
                    if (arg['property'][i].name == 'SUBMIT') {
                        $scope.finalRestPath = arg['property'][i].value;
                        break;
                    }
                }
            } else {
                $scope.chkProperty(arg.subArr)
            }
        }
    }
    // $scope.actionButtonCancleClick = function () {
    //     // ENTITY ACTION BUTTON UNLOCK HERE 
    //     $scope.IdleTimeStop();
    // }
    $scope.lockUnlockActionEntity = function(data) {
        EntityLockService.checkEntityLock(data).then(function(res){                   
            // opened modal dialog to process the payment
      
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
                $('#overRide').modal('hide');
            }
         });  
    }
    $scope.unlockActionEntity = function () {
        arg = $scope.attachmsgData;
        var data = {}; // have to form the request payload
        data['TableName'] = 'PaymentControlData';
        data['ActionName'] = arg.ActionName;
        data['IsLocked'] = false;
        data['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : $scope.PayId});
        EntityLockService.checkEntityLock(data).then(function(data){                   
            // opened modal dialog to process the payment
      

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
                $scope.closeDialog();
            }
         });  
         
    }
    
    $scope.actionWebformSubmit = function(val, formName) {
        _val = angular.copy(val)

        $scope.rfclicked = true;
        _val = removeEmptyValueKeys(_val)

        _val = $scope.cleantheinputdata(_val);
        $scope.actionObj = {}
        $scope.actionObj = _val;
        if ($scope.attachmsgData.AttchMsgID) {
            $scope.actionObj['AttchMsgID'] = $scope.attachmsgData.AttchMsgID;
        }

        //$scope.actionObj[$scope.rfData.metaInfoName] = val

        $scope.finalRestPath = '';
        if ($scope.fieldDetails.section.length && formName != "Manual RFI User To User" && formName != "Manual RFI Bank To Bank" ) {
            for (var l in $scope.fieldDetails.section[0].property) {
                if ($scope.fieldDetails.section[0].property[l].name == "SUBMIT") {
                    if ($scope.aBtnVal == 'paymentconfirmation') {
                        $scope.finalRestPath = $scope.fieldDetails.section[0].property[l].value.split('{')[0] + $scope.cData.MethodOfPayment
                    } else {
                        $scope.finalRestPath = $scope.fieldDetails.section[0].property[l].value;
                    }
                }
            }
        } else {
            $scope.chkProperty($scope.fieldDetails.subSection[0]);
        }

        if (!$scope.selectedAction.FunctionName || $scope.selectedAction.FunctionName == 'DisplayPopUpWithWebFormInput') {
            $scope.responseObj = $scope.actionObj;
        } else if ($scope.selectedAction.FunctionName == 'DisplayPopUpWithWebFormInputForOverride') {
            /* if($scope.rfData.metaInfoName === "OFACCheckResponseIM"){	
                $scope.actionObj['MsgDtls']['IndMsgDtls'] = Object.assign($scope.actionObj['MsgDtls']['IndMsgDtls'], $scope.actionObj['MsgDtls']['IndMsgDtls'][0])
                delete $scope.actionObj['MsgDtls']['IndMsgDtls'][0];
                $scope.actionObj['MsgDtls']['IndMsgDtls'] = [$scope.actionObj['MsgDtls']['IndMsgDtls']];
            } */
            $scope.responseObj = {
                "paymentID": $scope.PayId,
                "domainInWebFormName": $scope.rfData.metaInfoName,
                "DomainIn": btoa(JSON.stringify($scope.actionObj))
            }
        }

        $http.post(BASEURL + "/rest/v2/" + $scope.finalRestPath, $scope.responseObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.rfclicked = false;
            if ($scope.rfData.metaInfoName == 'ReturnOfFunds') {
                $scope.chkObj['GenerateROF'] = true;
            }

            // $('#overRide').modal('hide')
            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }];

            $timeout(function() {
                $('.alert-success').hide();
            }, 6000)

            $scope.nActionBtns = [];

            var iCnt = 0;
            var iInterval = '';

            $scope.fetchDataAgain()
            iInterval = setInterval(function() {

                $scope.fetchDataAgain()
                clearInterval(iInterval)

            }, 2000)
            // $scope.unlockActionEntity($scope.attachmsgData);
            $scope.closeDialog();
            // ENTITY ACTION BUTTON UNLOCK HERE
        }).catch(function onError(response) {
            // ENTITY ACTION BUTTON UNLOCK HERE
            //$scope.closeDialog();
            // Handle error
            $scope.IdleTimeStop(); 
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.rfclicked = false;
            $scope.alerts1 = [{
                type: 'danger',
                msg: data.error.message
            }]
            errorservice.ErrorMsgFunction(config, $scope, $http, status)           
            $scope.IdleTimerStart();  
        }) 
               
    }

    $scope.sectionCnt = 0;
    $scope.tempVar;
    $scope.addsubSection = function(x, y, z, l, obj) {
        if (obj) {
            let deepbackup1 = angular.copy($scope.deepBackup);
            for (var _x in deepbackup1['subSection']) {
                if (deepbackup1['subSection'][_x].name == l.name) {
                    for (var _y in deepbackup1['subSection'][_x].subArr) {
                        if (deepbackup1['subSection'][_x].subArr[_y].name in $scope.bSectionData) {
                            deepbackup1['subSection'][_x].subArr[_y] = angular.copy($scope.bSectionData[deepbackup1['subSection'][_x].subArr[_y].name]);
                            $scope.tempVar = deepbackup1['subSection'][_x].subArr;
                        }
                    }
                }
            }

            $scope.updatedfieldDetailsSubsection.push({
                'fields': $scope.tempVar
            })

        } else {
            if (l.name in z) {
                if ($.isArray(z[l.name])) {
                    z[l.name].push({});
                } else {
                    let backVal = angular.copy(z[l.name]);
                    z[l.name] = [];
                    for (var t in backVal) {

                    }
                }
            } else {
                z[l.name] = [];
            }
        }
        $scope.sectionCntNew = $scope.sectionCntNew + 1;
    }

    $scope.addSubSectionOccurs = function(x, y, z, l, obj) {
        if (obj) {
            y.forEach(function(ind, index) {
                if (l.name == y[index].name) {
                    var bObj = {}
                    y[index].subArr.forEach(function(indV, i) { bObj[i] = indV })
                    bObj = angular.copy(bObj);
                    var incObj = undefined,
                        indexx = [],
                        inCIAObj = [];
                    if (z.MissingInfo.length && typeof z.MissingInfo == "object" && (l.name == 'MissingInfo' && y[index].name == 'MissingInfo')) {
                        incObj = _.findWhere(z.MissingInfo, { MissingInformationCodes: "MS01" });
                        z.MissingInfo.forEach(function(valB, indexX) {
                            if (valB == incObj) {
                                indexx.push(indexX);
                            }
                        })
                    }
                    if (z.IncorrectInfo.length && typeof z.IncorrectInfo == "object" && (l.name == 'IncorrectInfo' && y[index].name == 'IncorrectInfo')) {
                        var incorrectInfoArr = ['IN01', 'IN04', 'IN06', 'IN15', 'IN19', 'IN38', 'IN39', 'MM20', 'MM21']
                        for (const icikey in incorrectInfoArr) {
                            if (incorrectInfoArr.hasOwnProperty(icikey)) {
                                const element = incorrectInfoArr[icikey];
                                if (_.findIndex(z.IncorrectInfo, { IncorrectInformationCodes: element }) >= 0) {
                                    incObj = _.findWhere(z.IncorrectInfo, { IncorrectInformationCodes: element });
                                    z.IncorrectInfo.forEach(function(valB, IndXx) {
                                        if (valB == incObj) {
                                            indexx.push(IndXx);
                                            inCIAObj.push(incObj);
                                        }
                                    })
                                }
                            }
                        }
                    }

                    if ((incObj || inCIAObj.length > 0) && indexx.length > 0) {
                        bObj[0].choiceOptions.forEach(function(valCC, indexAaa) {
                            if (incObj.MissingInformationCodes && incObj.MissingInformationCodes == valCC.actualvalue) {
                                bObj[0].choiceOptions[indexAaa].disabled = true;
                            }
                            for (const inCIAObKkey in inCIAObj) {
                                if (inCIAObj.hasOwnProperty(inCIAObKkey)) {
                                    if (inCIAObj[inCIAObKkey].IncorrectInformationCodes && inCIAObj[inCIAObKkey].IncorrectInformationCodes == valCC.actualvalue) {
                                        bObj[0].choiceOptions[indexAaa].disabled = true;
                                    }
                                }
                            }
                        })
                    }
                    y[index].subArrOccurs.push(bObj);
                }
            })
        }
    }

    $scope.removeSubSectionOccurs = function(arg) {
        arg['fieldData'][arg.pgroup.name].splice(arg.ind, 1);
        arg['pgroup']['subArrOccurs'].splice(arg.ind, 1);
        if (arg.pgroup.name == 'IncorrectInfo') {
            for (const cOPkey in arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions) {
                if (arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions.hasOwnProperty(cOPkey)) {
                    const element = arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions[cOPkey];
                    if (_.findIndex(arg.fieldData.IncorrectInfo, { IncorrectInformationCodes: element.actualvalue }) == -1 && arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions[cOPkey].disabled) {
                        delete arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions[cOPkey].disabled;
                    }
                }
            }
        }
        if (arg.pgroup.name == 'MissingInfo') {
            for (const cOPkey in arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions) {
                if (arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions.hasOwnProperty(cOPkey)) {
                    const element = arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions[cOPkey];
                    if (_.findIndex(arg.fieldData.MissingInfo, { MissingInformationCodes: element.actualvalue }) == -1 && arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions[cOPkey].disabled) {
                        delete arg.pgroup.subArrOccurs[arg.pgroup.subArrOccurs.length - 1][0].choiceOptions[cOPkey].disabled;
                    }
                }
            }
        }
    }

    $scope.removesubSection = function(arg) {
        $scope.updatedfieldDetailsSubsection.splice(arg.ind, 1);
        arg['fielddata'][arg.pgroup.name].splice(arg.ind, 1);
        $scope.sectionCntNew = $scope.sectionCntNew - 1;

        /*$scope.sectionCnt--;
        if ($scope.sectionCnt < 0) {
        $scope.sectionCnt = 0;

        }
        $('.' + x.name).css('display', 'none')
        $('#' + x.name + '_' + $scope.sectionCnt).css('display', 'block') */

    }

    $scope.attachmsgData = '';
    $scope.actionWebform = function(arg, msg) {
        //idleTimeout start here 
        //ACTION BUTTON ENTITY LOCK HERE
        var data = {}; // have to form the request payload
        data['TableName'] = 'PaymentControlData';
        data['ActionName'] = arg.ActionName;
        data['IsLocked'] = true;
        data['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : $scope.PayId});
        EntityLockService.checkEntityLock(data).then(function(data){               
            // opened modal dialog to process the payment
            if ('btnName' in arg) {
                $scope.aBtnVal = arg['btnName'].toLowerCase();
            }
            $scope.attachmsgData = arg;
            $scope.sectionCntNew = 0;
            $scope.submitted = false;
            $scope.selectedAction = arg;
            $scope.rfclicked = false;
            $scope.bSectionData = {};
            $scope.sectionFlag = false;
            $scope.sectionDropdownChanged = false;
            var _quer = {}
            if (arg.ActionName == 'ResubmitForcePost') {

                _quer.GrpReferenceId = msg.GrpReferenceId;
                _quer.InvocationPoint = msg.InvocationPoint;
                _quer.Relationship = msg.Relationship;
                _quer.Status = msg.Status;
            } else {
                _quer['PaymentID'] = $scope.PayId;
                if (msg && msg['GrpReferenceId']) {
                    _quer['GrpReferenceID'] = msg['GrpReferenceId'];
                } else if (msg && msg['MessageID']) {
                    _quer['MessageID'] = msg['MessageID']
                }
                $scope.fieldDetails = {
                    section: [],
                    subSection: []
                };
                $scope.metaInfoName = '';
        
                $scope.updatedfieldDetailsSubsection = [{
                    fields: []
                }];
                if(arg.show == 'Enable') {
                    dlgElem.modal("show");
                }
                prevObj = {};
                $('.alert-danger').hide();
                $scope.fieldData = {};
                /// uncomment the below HTTP finally
                $http.post(BASEURL + '/rest' + arg.RestURL, _quer).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
        
                    $scope.rfData = data;
                    $scope.metaInfoName = $filter('camelCaseFormatter')($scope.rfData.metaInfoName);
                    $scope.actionWebformData = JSON.parse(atob(data.metaInfo)).Data;
                    $scope.fieldData = JSON.parse(atob(data.data))
                    $scope.fieldData.MissingInfo = [];
                    $scope.fieldData.IncorrectInfo = [];
                    $scope.defaultAmountvalue = angular.copy($scope.fieldData['Amount']);
        
                    $('.actionWebForm').find('[type=submit]').css('display', 'block');
                    
                    setTimeout(function() {
                        $scope.appendSelectBox();
                    }, 300)
                    
                    webformIttration($scope.actionWebformData);
                    $scope.IdleTimerStart();    
                }).catch(function onError(response) {
                    //$scope.closeDialog();
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
        
                    $('.actionWebForm').find('[type=submit]').css('display', 'none');
        
                    $scope.alerts1 = [{
                        type: 'danger',
                        msg: data.error.message
                    }]
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            }
        }).catch(function(response){            
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                if (response.status === 400) {
                    var errMsg = response.data.error.message ? response.data.error.message : 'Unknown issue';
                    $scope.alerts = [{
                        type: 'danger',
                        msg: errMsg
                    }];
                    if(arg.show == 'Enable') {
                        dlgElem.modal("hide");
                    }
                }
            });        
        
        //}
    }

    $scope.multipleEmptySpace = function(e, fname) {
        if ($.trim($(e.currentTarget).val()).length == 0) { 
            $(e.currentTarget).val('');
            // external manadate validation
        }
        if (fname) {
            externalValidation(fname);
        }
        if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $(e.currentTarget).data("DateTimePicker").hide();
        }
    }

    function externalValidationForRROF() {
        if ($scope.fieldData['AcceptOrRejectROFRequest'] === 'PECR') {
            if (($scope.fieldData['Charges'] === undefined || $scope.fieldData['Charges'] === '') && ($scope.fieldData['AgentMemberIdentification'] === undefined || $scope.fieldData['AgentMemberIdentification'] === '')) {
                for (i in $scope.fieldDetails.section) {
                    if ($scope.fieldDetails.section[i].name == 'Charges' || $scope.fieldDetails.section[i].name == 'AgentMemberIdentification') {
                        $scope.fieldDetails.section[i].notnull = true;
                    }
                }
            } else if ($scope.fieldData['Charges'] && $scope.fieldData['Charges'] > 0 && ($scope.fieldData['AgentMemberIdentification'] === undefined || $scope.fieldData['AgentMemberIdentification'] === '')) {
                for (i in $scope.fieldDetails.section) {
                    if ($scope.fieldDetails.section[i].name == 'Charges') {
                        $scope.fieldDetails.section[i].notnull = true;
                    }
                    if ($scope.fieldDetails.section[i].name == 'AgentMemberIdentification') {
                        $scope.fieldDetails.section[i].notnull = false;
                    }
                }
            } else if (($scope.fieldData['Charges'] === undefined || $scope.fieldData['Charges'] === '') && $scope.fieldData['AgentMemberIdentification'] && $scope.fieldData['AgentMemberIdentification'] !== '') {
                for (i in $scope.fieldDetails.section) {
                    if ($scope.fieldDetails.section[i].name == 'Charges') {
                        $scope.fieldDetails.section[i].notnull = false;
                    }
                    if ($scope.fieldDetails.section[i].name == 'AgentMemberIdentification') {
                        $scope.fieldDetails.section[i].notnull = true;
                    }
                }
            } else {
                for (i in $scope.fieldDetails.section) {
                    if ($scope.fieldDetails.section[i].name == 'Charges' || $scope.fieldDetails.section[i].name == 'AgentMemberIdentification') {
                        $scope.fieldDetails.section[i].notnull = true;
                    }
                }
            }
        }
    }

    function externalValidation(fname) {
        $scope.fieldData[fname.name] = $scope.fieldData[fname.name] && typeof $scope.fieldData[fname.name] === 'string' && $scope.fieldData[fname.name].indexOf('{') != -1 ? JSON.parse($scope.fieldData[fname.name]) : $scope.fieldData[fname.name];
        switch (fname.name) {
            case 'AcceptedAmount': {
                if ($scope.fieldData['AcceptedAmount'] !== undefined && $scope.fieldData['AcceptedAmount'].length > 0) {
                    if($scope.fieldData['GuaranteedPayment'] === undefined && $scope.fieldData['EarlyPayment'] === undefined) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else if ( ($scope.fieldData['GuaranteedPayment'] === true || $scope.fieldData['GuaranteedPayment'] === false) && $scope.fieldData['EarlyPayment'] === undefined ) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount' || $scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else if ( ($scope.fieldData['GuaranteedPayment'] === undefined) && ($scope.fieldData['EarlyPayment'] === true || $scope.fieldData['EarlyPayment'] === false) ) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount' || $scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }
                    else {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }
                }
                else {
             
                    if( ($scope.fieldData['EarlyPayment'] === undefined) &&  $scope.fieldData['GuaranteedPayment'] === undefined ) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount' || $scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else if(($scope.fieldData['EarlyPayment'] === undefined) && ($scope.fieldData['GuaranteedPayment'] === true || $scope.fieldData['GuaranteedPayment'] === false)) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else if(($scope.fieldData['GuaranteedPayment'] === undefined) && ($scope.fieldData['EarlyPayment'] === true || $scope.fieldData['EarlyPayment'] === false)) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }

                }
                break;
            }
            case 'GuaranteedPayment': {
                if ($scope.fieldData['GuaranteedPayment'] === true || $scope.fieldData['GuaranteedPayment'] === false ) {
                    if( ($scope.fieldData['EarlyPayment'] === undefined) &&  ($scope.fieldData['AcceptedAmount'] === undefined || $scope.fieldData['AcceptedAmount'].length === 0 )) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount' || $scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                        }
                    }
                    else if( ($scope.fieldData['EarlyPayment'] === true || $scope.fieldData['EarlyPayment'] === false)  &&  ($scope.fieldData['AcceptedAmount'] === undefined || $scope.fieldData['AcceptedAmount'].length === 0 ) ) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else if ($scope.fieldData['EarlyPayment'] === undefined &&  $scope.fieldData['AcceptedAmount'] && $scope.fieldData['AcceptedAmount'].length > 0) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }
                    else {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }
                }
                break;
            }
            case 'EarlyPayment': {
                if ($scope.fieldData['EarlyPayment'] === true || $scope.fieldData['EarlyPayment'] === false ) {
                    if( ($scope.fieldData['GuaranteedPayment'] === undefined) &&  ($scope.fieldData['AcceptedAmount'] === undefined || $scope.fieldData['AcceptedAmount'].length === 0 ) ) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount' || $scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                        }
                    }
                    else if( ($scope.fieldData['GuaranteedPayment'] === true || $scope.fieldData['GuaranteedPayment'] === false)  &&  ($scope.fieldData['AcceptedAmount'] === undefined || $scope.fieldData['AcceptedAmount'].length === 0 )) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'EarlyPayment' ) {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    } else if ($scope.fieldData['GuaranteedPayment'] === undefined &&  $scope.fieldData['AcceptedAmount'] && $scope.fieldData['AcceptedAmount'].length > 0) {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'GuaranteedPayment') {
                                $scope.fieldDetails.section[i].notnull = false;
                            }
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }
                    else {
                        for( i in $scope.fieldDetails.section) {
                            if ($scope.fieldDetails.section[i].name == 'EarlyPayment' || $scope.fieldDetails.section[i].name == 'GuaranteedPayment' || $scope.fieldDetails.section[i].name == 'AcceptedAmount') {
                                $scope.fieldDetails.section[i].notnull = true;
                            }
                        }
                    }
                }
                break;
            }
            case 'Charges': {
                externalValidationForRROF();
                break;
            }
            case 'AgentMemberIdentification': {
                externalValidationForRROF();
                break;
            }
            default:
                break;
        }
    }
    $scope.chkmandatory = function(fname) {
        externalValidation(fname);
    }
    $scope.checkType = function(eve, type) {

        var compareVal = '';
        var regex = {
            'Integer': /^[0-9]$/,
            'BigDecimal': /^[0-9.]$/,
            'Double': /^[0-9.]$/,
            'String': /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i
        }
        for (var keys in regex) {
            if (type === keys) {
                compareVal = regex[type]
            }
        }

        if (compareVal.test(eve.key) || eve.keyCode == 16 || eve.keyCode == 36 || eve.keyCode == 46 || eve.keyCode == 8 || eve.keyCode == 9 || eve.keyCode == 35 || eve.keyCode == 37 || eve.keyCode == 39 || eve.keyCode == 38 || eve.keyCode == 40) {
            return true
        } else {
            eve.preventDefault();
        }
    }

    $scope.resetInterface = function() {
        $scope.fieldData = angular.copy($scope.backupData);
    }

    $scope.gotoPaymentDetail = function() {
        GlobalService.fileListId = $state.params.input.UIR;
        GlobalService.UniqueRefID = $state.params.input.PID;
        GlobalService.fromPage = $state.params.input.from;

        $scope.Obj = {
            'uor': $state.params.input.uor,
            'nav': {
                'UIR': $state.params.input.UIR,
                'PID': $state.params.input.PID
            },
            'from': $state.params.input.from
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })
    }

    $scope.widthOnScroll = function() {
        var mq = window.matchMedia("(max-width: 991px)");
        var headHeight
        if (mq.matches) {
            headHeight = 0;
            $scope.alertWidth = $('.pageTitle').width();
        } else {
            $scope.alertWidth = $('.pageTitle').width();
            headHeight = 10;
        }
        $scope.alertStyle = headHeight;
    }

    $scope.widthOnScroll();

    $(window).bind('scroll', function() {
        $scope.widthOnScroll()
    })

    $scope.activatePicker = function(e) {

        var todayDate = new Date();
        var dateParam = {
            format: "YYYY-MM-DD",
            maxDate: todayDate,
            useCurrent: false,
            showClear: true
        };
        if ($scope.aBtnVal === 'generaterrof') {
            dateParam = {
                format: "YYYY-MM-DD",
                minDate: moment().format('YYYY-MM-DD'),
                maxDate: moment().add(30, 'days').format('YYYY-MM-DD'),
                useCurrent: false,
                showClear: true
            }
        }
        if ($scope.aBtnVal === 'paymentconfirmation') {
            dateParam = {
                format: "YYYY-MM-DD",
                useCurrent: false,
                showClear: true
            }
        }
        var prev = null;
        $('.DatePicker').datetimepicker(dateParam).on('dp.change', function(ev) {

            var split = $(ev.currentTarget).attr('aName').split('_')

            if (split.length == 5) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]][split[4]] = $(ev.currentTarget).val();
            } else if (split.length == 4) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]] = $(ev.currentTarget).val();
            } else if (split.length == 3) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]] = $(ev.currentTarget).val();
            } else if (split.length == 2) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]] = $(ev.currentTarget).val();
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]] = $(ev.currentTarget).val();
            }

        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: false,
        }).on('dp.change', function(ev) {

            var split = $(ev.currentTarget).attr('aName').split('_')

            if (split.length == 5) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]][split[4]] = $(ev.currentTarget).val();
            } else if (split.length == 4) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]] = $(ev.currentTarget).val();
            } else if (split.length == 3) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]] = $(ev.currentTarget).val();
            } else if (split.length == 2) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]] = $(ev.currentTarget).val();
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]] = $(ev.currentTarget).val();
            }
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.DateTimePicker').datetimepicker({
            format: "YYYY-MM-DDTHH:mm:ss",
            useCurrent: false,
            showClear: true
        }).on('dp.change', function(ev) {

            var split = $(ev.currentTarget).attr('aName').split('_')

            if (split.length == 5) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]][split[4]] = $(ev.currentTarget).val();
            } else if (split.length == 4) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]] = $(ev.currentTarget).val();
            } else if (split.length == 3) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]] = $(ev.currentTarget).val();
            } else if (split.length == 2) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]] = $(ev.currentTarget).val();
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]] = $(ev.currentTarget).val();
            }
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.ISODateTime').datetimepicker({
            format: "YYYY-MM-DDTHH:mm:ssZZ",
            useCurrent: false,
            showClear: true
        }).on('dp.change', function(ev) {

            var isoDate = moment(e.date).format().split('+')
            $(ev.currentTarget).val(isoDate[0] + ":" + new Date().getMilliseconds() + '+' + isoDate[1])

            var split = $(ev.currentTarget).attr('aName').split('_')
            if (split.length == 5) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]][split[4]] = $(ev.currentTarget).val();
            } else if (split.length == 4) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]][split[3]] = $(ev.currentTarget).val();
            } else if (split.length == 3) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]][split[2]] = $(ev.currentTarget).val();
            } else if (split.length == 2) {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]][split[1]] = $(ev.currentTarget).val();
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][split[0]] = $(ev.currentTarget).val();
            }
        }).on('dp.show', function(ev) {
            var isoDate = moment(e.date).format().split('+')
            $(ev.currentTarget).val(isoDate[0] + ":" + new Date().getMilliseconds() + '+' + isoDate[1])
        }).on('dp.hide', function(ev) {});

    }

    $scope.setIVal = function(arg, arg1) {
        var split = arg.split('_')
    }

    $scope.getTextAreaRows = function(val1) {
        return Math.ceil(val1);
    }

    $scope.triggerPicker = function(e) {
        if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $scope.activatePicker($(e.currentTarget).prev());
            $('input[name=' + $(e.currentTarget).prev().attr('name') + ']').data("DateTimePicker").show();
        }
    }

    $scope.printFn = function() {
        window.print();
    }

    var backup_value = {};
    let iCnt = 0;

    $scope.diableFields = function(_data, _input) {
        if (_data && _data.length) {
            for (var val in _input.property) {
                iCnt++;
                if (_input.property[val].name.indexOf('|') != -1) {
                    //backup_value = {};
                    if (_data && _data.length) {
                        if (Array.isArray(_data)) {
                            _data.forEach(function(dropVal, dropvalIndex) {
                                if (_input.property[val].name.split('|')[1].indexOf(dropVal) != -1) {
                                    var checkValue = JSON.parse(_input.property[val].value)
                                    $scope.fieldDetails.section.forEach(function(currentValue, index, arr) {
                                        if (checkValue[currentValue.name]) {
                                            backup_value[val] = {
                                                'index': angular.copy(index),
                                                'value': angular.copy(currentValue),
                                                'keys': Object.keys(checkValue[currentValue.name])
                                            }
                                            Object.keys(checkValue[currentValue.name]).forEach(function(Value, index, arr) {
                                                currentValue[Value.toLowerCase()] = checkValue[currentValue.name][Value];
                                                backup_value[val]['keys'].forEach(function(vals, index) {
                                                    $scope.fieldData[$scope.fieldDetails.section[backup_value[val]['index']]['name']] = $("[name=" + backup_value[val]['value']['name'] + "]").val()
                                                })
                                            })
                                        }
                                    })
                                } else {
                                    if (backup_value[val]) {
                                        backup_value[val]['keys'].forEach(function(vals, index) {
                                            $scope.fieldDetails.section[backup_value[val]['index']][vals.toLowerCase()] = backup_value[val]['value'][vals.toLowerCase()];
                                            if (vals.toLowerCase() == 'enabled' && !backup_value[val]['value'][vals.toLowerCase()]) {
                                                $scope.fieldData[$scope.fieldDetails.section[backup_value[val]['index']]['name']] = '';
                                            } else {
                                                backup_value[val].value.enabled = false;
                                                backup_value[val].value.notnull = true;
                                                $scope.fieldData[$scope.fieldDetails.section[backup_value[val]['index']]['name']] = '';
                                                $scope.fieldDetails.section[backup_value[val]['index']][vals.toLowerCase()] = backup_value[val]['value'][vals.toLowerCase()];
                                            }
                                        })
                                    }
                                }
                            })
                            return;
                        }
                    } else {

                        for (var val_ in backup_value) {
                            if (backup_value[val] && (backup_value[val_]['value']['name'] === backup_value[val]['value']['name'])) {
                                backup_value[val_]['keys'].forEach(function(val, index) {
                                    $scope.fieldDetails.section[backup_value[val_]['index']][val.toLowerCase()] = $scope.deepBackup.section[backup_value[val_]['index']][val.toLowerCase()]
                                    if (val.toLowerCase() == 'enabled' && !backup_value[val_]['value'][val.toLowerCase()]) {
                                        $("[name=" + backup_value[val_]['value']['name'] + "]").val("");
                                        $scope.fieldDetails.section[backup_value[val_]['index']]['width'] = backup_value[val_]['value']['width'];
                                        if ($scope.fieldDetails.section[backup_value[val_]['index']]['name'] in $scope.fieldData) {
                                            $scope.fieldData[$scope.fieldDetails.section[backup_value[val_]['index']]['name']] = '';
                                        }
                                    } else {
                                        $("[name=" + backup_value[val_]['value']['name'] + "]").val("");
                                        $scope.fieldDetails.section[backup_value[val_]['index']]['width'] = backup_value[val_]['value']['width'];
                                        if ($scope.fieldDetails.section[backup_value[val_]['index']]['name'] in $scope.fieldData) {
                                            $scope.fieldData[$scope.fieldDetails.section[backup_value[val_]['index']]['name']] = '';
                                        }
                                    }
                                })
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    
    $scope.updatedSubsection = function(arr) {
        $scope.updatedfieldDetailsSubsection.push({
            fields: arr
        });
    }

    $scope.appendSelectBox = function() {

        $('.appendSelect2').each(function() {
            var parsedVal = JSON.parse($(this).attr('detailsoffield'))
            if (parsedVal.choiceOptions[parsedVal.choiceOptions.length - 1].displayvalue == "MULTISELECT") {
                $(this).attr({
                    'multiple': true,
                    'data-placeholder': 'Select'
                })

                if ($scope.fieldData[$(this).attr('name')] && $scope.fieldData[$(this).attr('name')].indexOf(',') != -1) {
                    $(this).val($scope.fieldData[$(this).attr('name')].split(','))
                } else if (($(this).attr('setval') && $(this).attr('setval').indexOf(',') != -1)) {
                    $(this).val($(this).attr('setval').split(','))
                } else {
                    $(this).val($scope.fieldData[$(this).attr('name')])
                }
                if (!$(this).find('option:first-child').attr('value') || !$(this).find('option:first-child').text()) {
                    $(this).find('option:first-child').remove();
                }
                $(this).select2({
                    allowClear: true
                });

                $(this).select2();
            }
        })
    }

    $("#overRide").on('hidden.bs.modal', function() {
        backup_value = {}
    });

    $("#overRide").on('shown.bs.modal', function() {});

    $scope.checkIfAttachMsgAccepted = function(argu) {
        $scope._AttachMsgAccepted = [];
        var query = {
            "filters": {
                "logicalOperator": "OR",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": [{
                                "columnName": "RootPaymentID",
                                "operator": "=",
                                "value": argu.PaymentID
                            }, {
                                "columnName": "AttchMsgFunc",
                                "operator": "=",
                                "value": "Return of Funds"
                            }, {
                                "columnName": "AttchMsgStatus",
                                "operator": "=",
                                "value": "WAITING_FRAUD_ATTCHMSG_TXNRESPONSE"
                            }]
                        }]
                    }]
                }, {
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": [{
                            "logicalOperator": "AND",
                            "clauses": [{
                                "columnName": "RootPaymentID",
                                "operator": "=",
                                "value": argu.PaymentID
                            }, {
                                "columnName": "AttchMsgFunc",
                                "operator": "=",
                                "value": "Return of Funds"
                            }, {
                                "columnName": "AttchMsgStatus",
                                "operator": "=",
                                "value": "TECHNICALFAILURE_FRAUD_ATTCHMSG_TXN"
                            }]
                        }]
                    }]
                }]
            },
            "start": 0,
            "count": 20
        }
        $http.post(BASEURL + '/rest/v2/attachedmessage/readall', query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope._AttachMsgAccepted = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope._AttachMsgAccepted = [];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
        return $scope._AttachMsgAccepted;
    }

    $http.post(BASEURL + '/rest/v2/interface/getInterfaceDetails', { "WorkFlowCode": "PAYMENT" }).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.isResponseRequired = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });
    
    $scope.checkCondition = function(argu, payment) {
        var styleObj = false;
        var Isstatus = false;
        var statusArr = ['SENT', 'PENDING', 'WAIT', 'RETRY'];
        for (var stat in statusArr) {
            if (statusArr[stat] === argu['Status']) {
                Isstatus = true;
                break;
            }
        }

        if (argu['Status'].indexOf('TIMEDOUT') != -1) {
            Isstatus = true;
        }
        var IsSynchronous = !argu['IsSynchronous'];
        var IsrelationShipStatus = (argu['Relationship'] === 'REQUEST') ? true : false;
        /*if(payment['Status'] && (payment['Status'].toLowerCase() === 'accepted')){
        $scope.checkIfAttachMsgAccepted(payment);
        }*/
        if (Isstatus && IsSynchronous && IsrelationShipStatus) {
            if ($scope._AttachMsgAccepted.length && argu['InvocationPoint'] === 'FRAUD_ATTCHMSG_TXN') {
                styleObj = true;
            } else if (payment['Status'].toLowerCase() !== 'fraud_hold' && (payment['Status'].toLowerCase().indexOf(argu['InvocationPoint'].toLowerCase()) != -1 || !_.where($scope.isResponseRequired, { InvocationPointIdentifier: argu['InvocationPoint'] })[0].IsResponseRequired)) {
                styleObj = true;
            }
        }
        return styleObj;
    }
    $scope.checkResendCondition = function(argu, payment) {

        var Isstatus = false;
        var statusArr = ['SENT', 'TIMEDOUT'];
        for (var stat in statusArr) {
            if (statusArr[stat] === argu['Status']) {
                Isstatus = true;
                break;
            }
        }
        return Isstatus;
    }

    $scope.checkResubmitCondition = function(argu, payment) {

        var Isstatus = false;
        var statusArr = ['PENDING', 'TECHNICAL_FAILURE', 'BUSINESS_FAILURE', ];
        for (var stat in statusArr) {
            if (statusArr[stat] === argu['Status']) {
                Isstatus = true;
                break;
            }
        }
        return Isstatus;
    }

    $scope.target_table = function(target, id) {
        var id = $filter('specialCharactersRemove')(target) + '_' + id;

        $('.overflowPaymentSection').removeClass('active')
        $('#tab_' + id).addClass('active')

    }

    $scope.gotoOriginalPaymentRecord = function(paymentid) {
        $scope.Obj = {
            'nav': {
                'PID': paymentid.trim()
            },
            'from': 'paymentdetail'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })
    }

    var _url = '';
    var msgType = [{
        msg: 'Request for Information',
        link: 'rfi'
    }, {
        msg: 'Request for Information BtoB',
        link: 'rfi'
    }, {
        msg: 'Response to Request for Information',
        link: 'rrfi'
    }, {
        msg: 'Response to Request for Information BtoB',
        link: 'rrfi'
    }, {
        msg: 'Return of Funds',
        link: 'rof'
    }, {
        msg: 'Response to Return of Funds',
        link: 'rrof'
    }, {
        msg: 'Response to Request for Payment',
        link: 'rrfp'
    }, {
        msg: 'Proprietary Acknowledgement',
        link: 'camt'
    }, {
        msg: 'Proprietary Acknowledgement BtoB',
        link: 'camt'
    }, {
        msg: 'Remittance Advice',
        link: 'remt'
    }]

    $scope.OnlyOUTDirections = function(argu) {
        for (data in msgType) {
            if (argu['Direction'] == 'OUT') {
                if (msgType[data].msg == argu['MessageType'])
                    return true;
            }
        }
    }

    $scope.selectedAction = {};
    $scope.ExternalComViewOUT = function(message) {
        $scope.selectedAction['ActionName'] = 'ViewWebformData';
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        $scope.metaInfoName = '';

        $scope.updatedfieldDetailsSubsection = [{
            fields: []
        }];
        $('.alert-danger').hide();
        $scope.fieldData = {};

        var input_query = {
            "ID": message['MessageInteractionUniqueID'],
            "MsgFunction": message['MessageType'],
            "Source": message['Destination']
        }

        for (k in msgType) {
            if (msgType[k].msg == message.MessageType) {
                _url = msgType[k].link;
            }
        }

        $http.post(BASEURL + '/rest/v2/attachmsgs/' + _url + '/view', input_query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.rfData = data;

            $scope.metaInfoName = $filter('camelCaseFormatter')($scope.rfData.metaInfoName)
            $scope.actionWebformData = JSON.parse(atob(data.metaInfo)).Data;
            $scope.fieldData = JSON.parse(atob(data.data))
            $('.actionWebForm').find('[type=submit]').css('display', 'block');

            setTimeout(function() {
                $scope.appendSelectBox();
            }, 500)

            webformIttration($scope.actionWebformData)
            if (($scope.fieldData.MissingInfo && $scope.fieldData.MissingInfo.length > 0) || ($scope.fieldData.IncorrectInfo && $scope.fieldData.IncorrectInfo.length > 0)) {
                let misInfoLength = $scope.fieldData.MissingInfo ? $scope.fieldData.MissingInfo.length - 1 : undefined;
                let incInfoLength = $scope.fieldData.IncorrectInfo ? $scope.fieldData.IncorrectInfo.length - 1 : undefined;
                $scope.fieldDetails.subSection.forEach(function(val, index) {
                    if (val.name === 'MissingInfo' && misInfoLength) {
                        for (let mi = 0; mi < misInfoLength; mi++) {
                            $scope.fieldDetails.subSection[index].subArrOccurs.push($scope.fieldDetails.subSection[index].subArr)
                        }
                    }
                    if (val.name === 'IncorrectInfo' && incInfoLength) {
                        for (let mi = 0; mi < incInfoLength; mi++) {
                            $scope.fieldDetails.subSection[index].subArrOccurs.push($scope.fieldDetails.subSection[index].subArr)
                        }
                    }
                })
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $('.actionWebForm').find('[type=submit]').css('display', 'none');

            $scope.alerts1 = [{
                type: 'danger',
                msg: data.error.message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.enableReqError = function() {
        $scope.submitted = true;
    }

    $scope.isdataAvailable = function(mgsContents) {
        var _dataContent = $filter('hex2a')(mgsContents);
        if (_dataContent.indexOf('Not Available') != -1) {
            return true;
        } else {
            return false;
        }
    }


    $scope.ResendOUTPayments = function(argudata) {

        $http.get(BASEURL + '/rest/v2/transports/resend/' + argudata.GroupInteractionUniqueID).then(function onSuccess(response) {
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
                $('.alert-success').hide;
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
            }]

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.ApproveReject = function(urlname, argu_) {
        var _querydata = {
            'AttchMsgInstrID': argu_.GroupInteractionUniqueID
        }
        $http.put(BASEURL + '/rest/v2/approvals/attchmsgapprovals/' + urlname, _querydata).then(function onSuccess(response) {
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
                $('.alert-success').hide;
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
        });
    }

    $scope.Unmask = function() {
        $scope.masking = !$scope.masking;
    }


    $scope.criteriaMatch = function() {
        return function(item) {
            return item;
        };
    };

    $scope.closeDialog = function() {
        dlgElem.modal("hide");
        $scope.unlockActionEntity();
        $scope.IdleTimeStop();
    };


});

angular.module('VolpayApp').filter('resendButton', function() {
    return function(input) {
        var ACK_NAC = ["ACK002", "ACK005", "NAK001", "NAK006", "NAK007", "NAK023", "NAK033", "NAK035", "NAK065", "NAK076", "NAK701", "NAK801", "NAK803", "NAK810", "NAK811", "NAK812", "NAK813", "NAK751", "NAK804", "NAK807", "NAK808", "NAK806"]
        if ((input != undefined) && (input.split('-').length > 1)) {

            if ((ACK_NAC.indexOf(input.split('-')[0].trim()) != -1) && (input.split('-')[1]).trim().toLowerCase() == 'fx repair') {
                return true;
            }
        } else {
            return false;
        }
    }
});
