angular.module('VolpayApp').controller('filedetailCtrl', function($scope, $rootScope, $http, $state, $location, $compile, GlobalService, bankData, $timeout, $interval, $filter, errorservice, EntityLockService, GetPermissions, AllPaymentsGlobalData) {
    $scope.SCD = null;
    $scope.PCD = null;
    $scope.newPermission = GetPermissions("Received Instructions");
    /**
     * Dialog declaration
     */
    var dlgElem = angular.element("#actionForm"); 
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
    $scope.SetVariable = function(value){
        $scope.newButtonsBkp = value;
    }
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
                // $scope.stopIdleTimer();
                $scope.count = 0;
                // $scope.findIdleTime();
            });
            $scope.count += 1;
         
            if ($scope.count === editTimeoutCounter) {
                $scope.unlockActionEntity();
                $scope.stopIdleTimer();
                // scope.callIdleTime();
                // hide the modal popup
                $('#actionForm').modal('hide');
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
                $("#idletimeout_model").modal("hide");
                $('#actionForm').modal('hide');
                $scope.IdleTimeStop();
                $scope.unlockActionEntity();
            }
        }, 1000);
    }

    $scope.stopsecondIdleTimer = function() {
        if (angular.isDefined(secondfindEvent)) {
            $(window).off("mousemove keydown click");
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

    $("#actionForm").on("hidden.bs.modal", function() {
        // put your default event here
        $scope.IdleTimeStop();
    });
    /** Idletimeout clock timer block */

    $scope.isObject = angular.isObject
    $scope.isCollapsed = false;
    $scope.isPaymentCollapsed = false;
    $scope.isPaymentInfoCollapsed = false;
    $scope.confirmationDetails = false;
    $scope.attachDetails = false;
    if (GlobalService.instructionType) {
        $scope.instructionTypeValue = GlobalService.instructionType.toLowerCase();
    }

    $scope.refId = GlobalService.fileListId;
    //	$scope.instType = $state.params.input.instructype;
    $scope.paymentid = GlobalService.fileListPaymentid;
    $scope.fileDetailObj = {};
    $scope.fileDetailObj.InstructionID = $scope.refId;

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    $http.get(BASEURL + '/rest/v2/resendaction/' + $scope.refId).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.resendbtn = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });
    // RESTCALL.TransportResendExternal = '/rest/v2/transports/resendexternal/';

    $scope.tabMenus = [{
            "label": "Batch ID",
            "FieldName": "BatchID",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Legal Sequence Number",
            "FieldName": "StatementData.StatementId.StmtLegalSequenceNo",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Electronic Sequence Number",
            "FieldName": "StatementData.StatementId.StmtElectronicSequenceNo",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Account Number",
            "FieldName": "StatementData.StatementAccountDetails.StmtAccountNo",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Account Name",
            "FieldName": "StatementData.StatementAccountDetails.StmtAccountName",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Original Reference ID",
            "FieldName": "StatementEntryDetails.EntryOrigReferenceId",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "DRCRINDICATOR",
            "FieldName": "StatementEntryDetails.EntryDrCrIndicator",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Amount",
            "FieldName": "StatementEntryDetails.EntryAmount",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Currency",
            "FieldName": "StatementEntryDetails.EntryCurrency",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Reversal Indicator",
            "FieldName": "StatementEntryDetails.EntryReversalIndicator",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Bank Status",
            "FieldName": "StatementEntryDetails.EntryBankStatus",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Booking Date",
            "FieldName": "StatementEntryDetails.EntryBookingDate",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Value Date",
            "FieldName": "StatementEntryDetails.EntryValueDate",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Bank Reference ID",
            "FieldName": "StatementEntryDetails.EntryBankReferenceId",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "TXNE2EID",
            "FieldName": "StatementEntryDetails.EntryTxnE2EId",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Status",
            "FieldName": "Status",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Detailed Status Info",
            "FieldName": "DetailedStatusInfo",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Reference ID",
            "FieldName": "EntryReferenceId",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Distribution ID",
            "FieldName": "DistributionID",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Copy Duplicate IND",
            "FieldName": "StatementData.StmtCopyDuplicateInd",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Account Servicing Institution",
            "FieldName": "StatementData.StatementAccountDetails.StmtAccServicingInstitution",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Linked Message ID",
            "FieldName": "LinkedMsgID",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Linked Message Function",
            "FieldName": "LinkedMsgFunc",
            "listViewflag": false,
            "visible": true
        }]
        // RESTCALL.TransportResendExternal = '/rest/v2/transports/resendexternal/';

    function getValues(obj, key) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == "object") {
                objects = objects.concat(getValues(obj[i], key));
            } else if (i == key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    }
    $scope.backupObj = {
        value: "",
        ind: -1,
    };

    $scope.rfclicked = false;

    if ($scope.refId == -1) {
        $state.go("app.instructions");
    }

    $scope.fromOutputSummary = $state.params.input;

    $scope.gotoOutputPaymentSummary = function() {
        $state.go('app.outputpaymentsummary', { input: { 'uor': $scope.fromOutputSummary.input.uor, 'nav': {}, 'from': 'distributedinstructions' } })
    }

    sessionStorage.menuSelection = JSON.stringify({ 'val': 'PaymentModule', 'subVal': 'ReceivedInstructions' })

    $scope.GoToDupData = function(val) {
        GlobalService.fileListId = val;

        GlobalService.sidebarCurrentVal = {
            "ParentName": "Payment Module",
            "Link": "app",
            "IconName": "icon-settings"
        };
        GlobalService.sidebarSubVal = {
            "IconName": "fa-file-text-o",
            "Id": "002",
            "Link": "filedetail",
            "Name": "File List",
            "ParentName": "Payment Module"
        };

        $state.reload();
    };



    function specificFileDetailRest() {

        $http.post(BASEURL + RESTCALL.FileSpecificREST, $scope.fileDetailObj).then(function(resp) {
            if (resp.data['InstructionFieldList']) {
                resp.data['InstructionFieldList'] = convertXml2JSon(resp.data['InstructionFieldList'])
            }

            $scope.filedetail = resp.data;

            if($scope.filedetail.Description){
                var content = $scope.filedetail.Description.split("\\n");
                var finalObject = "";
                for(var i = 0; i<content.length; i++){
                    finalObject += content[i]+"\n";
                }
                $scope.filedetail.Description= finalObject;
            }
           
            //$scope.filedetail = TempTransactionCountAPI(resp.data);
            getForceAction($scope.filedetail);
            if ($scope.filedetail.FileStatus == "REJECTED") {

                $('.exportDisable').css({
                    "pointer-events": "none",
                    "opacity": 0.7
                });
            }

            $scope.statusREST = {
                "Queryfield": [{
                        "ColumnName": "WorkFlowCode",
                        "ColumnOperation": "=",
                        "ColumnValue": 'INSTRUCTION'
                    },
                    {
                        "ColumnName": "ProcessStatus",
                        "ColumnOperation": "=",
                        "ColumnValue": $scope.filedetail.FileStatus
                    }
                ]
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

                if (data[0].ColourB) {
                    $scope.selectedClr.ColourB = data[0].ColourB;
                    $scope.selectedClr.Grandient = true;
                } else {
                    $scope.selectedClr.Grandient = false;
                }
                $scope.selectedClr.ColourA = data[0].ColourA;
                $scope.selectedClr.Opacity = data[0].Opacity / 100;

                $scope.appliedStyle = (!$scope.selectedClr.Grandient) ? { 'color': $scope.selectedClr.ColourA, 'opacity': $scope.selectedClr.Opacity } : { 'background': '-webkit-linear-gradient(' + $scope.selectedClr.ColourA + ',' + $scope.selectedClr.ColourB + ')' }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });

            if ($scope.filedetail.InstructionType == "RESPONSE") {
                $http.post(BASEURL + RESTCALL.ConfirmationPayment, {
                    "instrID": $scope.refId,
                    "instrType": $scope.filedetail.InstructionType
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.confirmation = data;
                    GlobalService.allFileListDetails = data;
                    $scope.confirmationDetails = true;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });

            } else if ($scope.filedetail.InstructionType != "Customer Credit Transfer" && $scope.filedetail.InstructionType != "Recon Credit Transfer" && $scope.filedetail.InstructionType != "Request for Payment" && $scope.filedetail.InstructionType != "Payment Instruction" && $scope.filedetail.InstructionType != "RESPONSE" && $scope.filedetail.InstructionType != "Instruction Uploaded" && $scope.filedetail.InstructionType != "Financial Institution Credit Transfer") {

                $http.post(BASEURL + RESTCALL.AttachedMessagePayment, {
                    "instrID": $scope.refId,
                    "instrType": $scope.filedetail.InstructionType
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.attachMessage = data;
                    GlobalService.allFileListDetails = data;
                    $scope.attachDetails = true;
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

            if ($scope.filedetail.InstructionType == 'RESPONSE') {
                sidebarMenuControl('PaymentModule', 'AllConfirmations')
            } else {

                sidebarMenuControl('PaymentModule', 'ReceivedInstructions')
            }


        }, function(err) {


            if (err.data.error) {

                $('.exportDisable').css({
                    "pointer-events": "none",
                    "opacity": 0.7
                });
            }
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];

            $timeout(function() {
                callOnTimeOut()
            }, 4000)


        });

        $http.post(BASEURL + '/rest/v2/ach/instructionfile/details', $scope.fileDetailObj).then(function(resp) {
         

            $scope.filedetail_ = resp.data;
         
           


        }, function(err) {

            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];

        

        });
    }

    // specificFileDetailRest()

    $scope.exportToExcelFlist = function(eve) {

        var inputobj=$scope.fileDetailObj
       if ($("input[name=excelVal][value='txt']").prop("checked")||$("input[name=excelVal][value='csv']").prop("checked")) {
            
         
                if($("input[name=excelVal][value='txt']").prop("checked")){
                    var url="/rest/v2/instruction/ach/downloadfiledetail"
                    inputobj['format']='txt'
                }else if($("input[name=excelVal][value='csv']").prop("checked")){
               
                    var url="/rest/v2/instruction/ach/downloadfiledetail"
                    inputobj['format']='csv'
                }
             
        
                $http.post(BASEURL + url,inputobj).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    // $scope.datas = $scope.datas.concat(data);
                       $scope.Details = 'data:application/octet-stream;base64,' + data['Data'];
            var dlnk = document.getElementById('dwnldLnk');
            dlnk.href = $scope.Details;

            
             if($("input[name=excelVal][value='txt']").prop("checked")){
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download ='Reports.txt';
                }
             
            }else if($("input[name=excelVal][value='csv']").prop("checked")){
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download = 'Reports.csv';
                }
             
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
                
              
            // }


        }  


    }





  



    $scope.aa = {
        "Queryfield": [{
            "ColumnName": "InstructionID",
            "ColumnOperation": "=",
            "ColumnValue": $scope.refId
        }]
    }

    $scope.aa = constructQuery($scope.aa);

    $http.post(BASEURL + RESTCALL.InstructionCurrency, $scope.aa).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.currencyWiseSum = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.currencyWiseSum = [];
        errorservice.ErrorMsgFunction(config, $scope, $http, status);
    });

    $scope.filedetailpcd = [];
    $scope.filedetailpcdWaitforapp=[]
    $scope.filedetailpcdrejected=[]

    $scope.paymentDataFn = function(obj) {

        $http.post(BASEURL + RESTCALL.FilePCDREST, $scope.fileDetailObjLimit).then(function(resp1) {
            $scope.loadedData = resp1.data;
            $scope.filedetailpcd = $scope.filedetailpcd.concat(resp1.data);
            GlobalService.allFileListDetails = resp1.data
        }, function(err) {
            $scope.loadedData = [];
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        });
		
		//This is for the Warnings tab
      /**  $http.post(BASEURL + RESTCALL.FilePCDREST, $scope.fileDetailObjLimit).then(function(resp1) {
            $scope.loadedData = resp1.data;
            $scope.filedetailpcdWAITING = $scope.filedetailpcdWAITING.concat(resp1.data);
            GlobalService.allFileListDetails = resp1.data
        }, function(err) {
            $scope.loadedData = [];
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        });
        **/


            $http.post(BASEURL + '/rest/v2/ach/instructions/payment/readall/WAITING_APPROVAL', $scope.fileDetailObjLimit).then(function(resp1) {

                $scope.loadedData = resp1.data;
                $scope.filedetailpcdWaitforapp = $scope.filedetailpcdWaitforapp.concat(resp1.data);
                GlobalService.allFileListDetails = resp1.data
                $rootScope.totalCount = resp1.headers().totalcount
            }, function(err) {
             
                $scope.loadedData = [];
                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            });
            /*
            $http.post(BASEURL + '/rest/v2/ach/instructions/payment/readall/rejected', $scope.fileDetailObjLimit).then(function(resp1) {
                $scope.loadedData = resp1.data;
                $scope.filedetailpcdrejected = $scope.filedetailpcdrejected.concat(resp1.data);
                GlobalService.allFileListDetails = resp1.data
            }, function(err) {
             
                $scope.loadedData = [];
                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            });*/
    }

	  var obj = { 
        "RoleId": sessionStorage.ROLE_ID,
        "ResourceName": "Received Instructions"
    }

    $http.post(BASEURL + '/rest/v2/roles/resourcepermission', obj).then(function(resp1) {
        $scope.forbutton = resp1.data;

    }, function(err) {

    });

    $scope.createData = {}
	
    $scope.checkStatusForBulk = function(event, TotalItem, allpayments1, index) {
	  $scope.createData['instructionId']=$scope.filedetail.InstructionID;
        $scope.uniqPayments = [];
        for (var i in TotalItem) {
            if ($('#check_' + i).prop("checked")) {
                $scope.uniqPayments.push(TotalItem[i].PaymentID)
            }
        }
        $scope.createData['PaymentID'] = $scope.uniqPayments

    }

    $scope.forceActionpopup = function(status) {
        if (status == 'waitforapproval') {
            $scope.createData['status'] = 'waitforapproval'
			$scope.createData['instructionId']=$scope.filedetail.InstructionID;
            $('#ViewFXDetails').modal('show');
        } else if (status == 'rejected') {
            $scope.createData['status'] = 'rejected'
			$scope.createData['instructionId']=$scope.filedetail.InstructionID;
            $scope.Userdetails($scope.createData)
        }
    }
    $scope.checkStatusForBulk1 = function(TotalItem) {
        if ($('.selectall').is(':checked')) {
            $('.selectall_').prop('disabled', true);
            $('.selectall_').prop('checked', false);
            $scope.createData['PaymentID'] = ["selectall"]
            $scope.createData['instructionId']=$scope.filedetail.InstructionID
            $scope.uniqPayments = ["selectall"]

        } else {
            $('.selectall_').prop('disabled', false);
            $scope.createData['PaymentID'] = ["selectall"]
            $scope.uniqPayments = []
        }
    }

    $scope.Userdetails = function(Userdetails) {

        $http.post(BASEURL + '/rest/v2/ach/instructions/fileapproval', Userdetails).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data['Status'] == 'ERROR') {
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.responseMessage
                }];
                $('.selectall_').prop('disabled', false);
                $('.selectall').prop('checked', false);

            } else {
                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }];
                $scope.createData = {}
                $('.selectall_').prop('disabled', false);
                $('.selectall').prop('checked', false);
                $scope.uniqPayments = [];
                $scope.selfCalling()

            }

            $scope.Reset()

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data['Status'] == 'ERROR') {
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.responseMessage
                }];
                $('.selectall_').prop('disabled', false);
                $('.selectall').prop('checked', false);
                $scope.shownotification = false
            } else {
                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }];
                $scope.createData = {}
                $('.selectall_').prop('disabled', false);
                $('.selectall').prop('checked', false);
                $scope.shownotification = false
                $scope.uniqPayments = [];
                $scope.selfCalling()

            }

            $scope.Reset()

        });

        $('#ViewFXDetails').modal('hide');
    }
    
    $scope.Reset= function() {
        $scope.createData['userName']=''
        $scope.createData['password']=''
    }

    if (sessionStorage.InstructionNotes == undefined) {
        $scope.NotesArr = [];
    } else {
        $scope.NotesArr = JSON.parse(sessionStorage.InstructionNotes);
    }

    $scope.data = {};
    $scope.addNotes = function(notes, toDetails) {
        $scope.Notes = {
            "InstructionID": toDetails,
            "Notes": notes.notes
        }
        $http.post(BASEURL + '/rest/v2/instructions/notes', $scope.Notes).then(function(notes) {

            $scope.alerts = [{
                type: 'success',
                msg: notes.data.responseMessage
            }];
            $timeout(function() {
                $('.alert-success').hide()
            }, 5000)

            $scope.data.notes = "";
            $('.modal').modal('hide')
            $http.post(BASEURL + RESTCALL.FileAuditREST, $scope.fileDetailObj).then(function(resp2) {
                $scope.filedetailaudit = resp2.data;
            }, function(err) {

            })
        }, function(err) {
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];

            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }

    $('#activeId').click(function() {
        $scope.len = 0;
        $scope.filedetailpcd = [];
        $scope.filedetailpcdWaitforapp = []
        $scope.filedetailpcdrejected = []
        $scope.fileDetailObjLimit = {};
        $scope.fileDetailObjLimit.InstructionID = $scope.refId;
        $scope.fileDetailObjLimit.start = $scope.len;
        $scope.fileDetailObjLimit.count = 20;
        $scope.paymentDataFn($scope.fileDetailObjLimit);
    })

    $scope.selfCalling = function() {
        $('#restoreFileData').css('pointer-events', 'none')
        $timeout(function() {
            $('#restoreFileData').css('pointer-events', 'auto')
        }, 400)
        $scope.createData = {}
        $scope.uniqPayments = [];
        $('.selectall_').prop('disabled', false);
        $('.selectall').prop('checked', false);
        $('.selectall_').prop('checked', false);
        $scope.filedetailpcd = [];
        $scope.filedetailpcdWaitforapp = []
        $scope.filedetailpcdrejected = []
        $scope.len = 0;
        $scope.fileDetailObjLimit = {};
        $scope.fileDetailObjLimit.InstructionID = $scope.refId;
        $scope.fileDetailObjLimit.start = $scope.len;
        $scope.fileDetailObjLimit.count = 20;

        $scope.paymentDataFn($scope.fileDetailObjLimit);

        $http.post(BASEURL + RESTCALL.FileAuditREST, $scope.fileDetailObj).then(function(resp2) {
            $scope.filedetailaudit = resp2.data;

            for (var i = 0; i < resp2.data.length; i++) {
                if (resp2.data[i].Event == 'RECEIVE_PAYMENT') {
                    var str = resp2.data[i].Description;
                    var initData = str.split('[')
                    var String = str.substring(str.lastIndexOf("[") + 1, str.lastIndexOf("]"));


                    setTimeout(function() {

                        if (String.indexOf(',') > -1) {
                            var trimedData = [];
                            $.each(String.split(','), function() {
                                trimedData.push($filter('removeSpace')(this));
                            });

                            var htmlData = '';
                            for (var i in trimedData) {
                                htmlData = htmlData + '<span class="cursorPointer bold dupClick" ng-click="GoToDupData(' + trimedData[i] + ')">' + trimedData[i] + '</span>' + ', '
                            }

                            var btnhtml = htmlData
                        } else {
                            var btnhtml = '<span class="cursorPointer bold dupClick" ng-click="GoToDupData(' + String + ')">' + String + '</span>';
                        }

                        var temp = $compile(btnhtml)($scope);
                        if (initData) {
                            $(sanitize('.dupDatas')).append(initData[0] + '[')
                        }
                        $(sanitize('.dupDatas')).append(temp)
                        $(sanitize('.dupDatas')).append(']')

                    }, 100)
                }
            }

            $scope.getTotal = function() {
                $scope.total = 0;
                for (var i = 0; i < $scope.filedetailaudit.length; i++) {

                    if ($scope.filedetailaudit[i].Event == "RECEIVE_INSTRUCTION") {
                        $scope.total++;
                    }
                }
                return $scope.total;
            };
            $scope.getTotal(); //function CALL

            $scope.getTotal2 = function() {
                $scope.total2 = 0;
                for (var i = 0; i < $scope.filedetailaudit.length; i++) {
                    if ($scope.filedetailaudit[i].Event == "RECEIVE_PAYMENT") {
                        $scope.total2++;
                    }
                }
                return $scope.total2;
            }
            $scope.getTotal2(); //function CALL

        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        });

        /*$http.post(BASEURL + RESTCALL.FLTransactionalDetails,$scope.fileDetailObj).then(function (response) {
      			$scope.transactionData = response.data;
      		}, function (err) {/v2/instructions/interaction/readall
				
			  }); */

        $http.post(BASEURL + RESTCALL.FileSystemInteraction, $scope.fileDetailObj).then(function(response) {
            $scope.newdata = response.data;

        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

        $http.post(BASEURL + RESTCALL.FileExtCommunication, $scope.fileDetailObj).then(function(response) {
            $scope.externaldata = response.data;
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

        $http.post(BASEURL + RESTCALL.InstnErrorInfo, $scope.fileDetailObj).then(function(response) {
            $scope.ErrorInfodata = response.data;

        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

        $http.post(BASEURL + RESTCALL.InsAccountPostingsInfo, $scope.fileDetailObj).then(function(response) {

            $scope.accountInfdata = response.data;

        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

        $http.post(BASEURL + RESTCALL.InsBatchesInfo, $scope.fileDetailObj).then(function(response) {

            $scope.batchInfodata = response.data;

        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

        $http.post(BASEURL + RESTCALL.InsProcessBatchesInfo, $scope.fileDetailObj).then(function(response) {

            $scope.processbatchInfodata = response.data;
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

        specificFileDetailRest()
    }

    $scope.selfCalling()

    $scope.navToPaymentFrmOutput = function() {
        GlobalService.fileListId = $scope.fromOutputSummary.input.nav.UIR;
        GlobalService.UniqueRefID = $scope.fromOutputSummary.input.nav.PID;
        GlobalService.fromPage = 'filedetail'

        $scope.Obj = {
            'uor': $scope.fromOutputSummary.input.uor,
            'nav': {
                'UIR': $scope.fromOutputSummary.input.nav.UIR,
                'PID': $scope.fromOutputSummary.input.nav.PID
            },
            'from': 'filedetail'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })
    }

    $scope.clickReferenceID = function(val) {

        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.data.PaymentID;
        GlobalService.fromPage = val.fromPage;

        $scope.Obj = {
            'uor': val.data.OutputInstructionID,
            'nav': {
                'UIR': val.data.InstructionID,
                'PID': val.data.PaymentID
            },
            'from': 'filedetail'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })
    }

    $scope.clickReferenceBatchID = function(val) {
        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.data.BatchID;
        GlobalService.fromPage = val.fromPage;

        $scope.Obj = {
            'uor': val.data.OutputInstructionID,
            'nav': {
                'BatchID': val.data.BatchID,
                'PID': val.data.BatchID
            },
            'from': 'filedetail'
        }

        $state.go('app.allbatchesdetail', {
            input: $scope.Obj
        })
    }

    $scope.clickReferenceBatchIDdd = function(val) {

        if (val.data) {
            for (i in $scope.batchInfodata) {

                if ($scope.batchInfodata[i].BatchID == val.data) {


                    GlobalService.fileListId = $scope.batchInfodata[i].InstructionID;
                    GlobalService.UniqueRefID = $scope.batchInfodata[i].BatchID;
                    GlobalService.fromPage = val.fromPage;

                    $scope.Obj = {
                        'uor': val.data.OutputInstructionID,
                        'nav': {
                            'BatchID': $scope.batchInfodata[i].BatchID,
                            'BID': $scope.batchInfodata[i].BatchID
                        },
                        'from': 'filedetail'
                    }

                    $state.go('app.allbatchesdetail', {
                        input: $scope.Obj
                    })
                }
            }

        }
    }




    $scope.clickStatementtoPayment = function(val) {

        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.data.LinkedMsgID;
        GlobalService.fromPage = val.fromPage;

        $scope.Obj = {
            nav: {
                'UIR': val.data.InstructionID,
                'PID': val.data.LinkedMsgID,
            },
            'from': 'filedetail'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })
    }

    $scope.gotoOutputSummary = function(value) {
        $scope.Obj = {
            'uor': value.data.DistributionID,
            'nav': {
                'UIR': $scope.refId,
                'PID': value.data.LinkedMsgID
            },
            'from': value.from
            //'from': ($scope.fromPage == 'allpayments')?'allpayments':'filedetail'
        }

        $state.go('app.outputpaymentsummary', { input: $scope.Obj })
    }

    $scope.clickID = function(val) {
        $scope.Obj = {
            'nav': {
                'UIR': val.data.RespInstrID,
                'PID': val.data.PaymentID,
            },
            'from': 'AllConfirmaion',
            'InstructionType': 'RESPONSE'

        }

        $state.go("app.paymentdetail", {
            input: $scope.Obj,
        });
    };

    $scope.clickMessageID = function(val) {

        $scope.Obj = {
            'nav': {
                'UIR': val.data.AttchMsgInstrID,
                'PID': (val.data.RootPaymentID) ? val.data.RootPaymentID : "",
                'AttachMsg': val.data.AttchMsgFunc,
                'PaymentID': val.data.ParentID
            },
            'from': 'filedetail',
            'rootPaymentID': 'RootPaymentID'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })

    }

    $scope.clickAttachD = function(val) {

        $scope.val = val.data.ParentID;
        if (val.data.ParentID != val.data.RootPaymentID) {

            $http.get(BASEURL + '/rest/v2/payments/instruction/' + val.data.ParentID).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                GlobalService.fileListId = data[0].InstructionID;
                $scope.refId = GlobalService.fileListId;

                $scope.fileDetailObj = {};
                $scope.fileDetailObj.InstructionID = data[0].InstructionID;
                $scope.selfCalling()
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        } else {

            $scope.Obj = {

                'nav': {
                    'UIR': val.data.AttchMsgInstrID,
                    'PID': (val.data.RootPaymentID) ? val.data.RootPaymentID : "",
                    'AttachMsg': val.data.AttchMsgFunc,
                    'PaymentID': val.data.ParentID
                },
                'from': 'filedetail',
                'parentID': 'ParentID'

            }

            $state.go('app.paymentdetail', {
                input: $scope.Obj
            })
        }
    }

    //$scope.parentId = {};
    //$scope.parentId =$scope.refId;

    $scope.underScoreReplace = function(obj) {
        return obj.replace(/_/g, ' ');
    };

    $scope.fileStatus = function(status) {

        $http.put(BASEURL + RESTCALL.FileStatusREST, { 'InstructionID': $scope.refId, 'status': status }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.fileDetailStatus.Status = status;
            GlobalService.fileDetailStatus.Msg = data.responseMessage;
            $timeout(function() {
                // $location.path('app/filelist')
                $state.go("app.instructions")
            }, 200);
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: err.error.message
            }];

            $timeout(function() {
                callOnTimeOut()
            }, 4000)

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.resendExternal = function(ackDistrInstrId) {
        $http.get(BASEURL + RESTCALL.TransportResendExternal + ackDistrInstrId).then(function onSuccess(response) {
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
            }, 4000);
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
            }, 4000);
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    /*           $scope.fileDetailObjLimit = {};
				 $scope.fileDetailObjLimit.UIR = $scope.refId;
				 $scope.fileDetailObjLimit.start = $scope.len;
				 $scope.fileDetailObjLimit.count = 3;
 
	 */
    
    /*** To control Load more data ***/
    jQuery(
        function($) {
            $('.fileDetailOverflow').bind('scroll', function() {

                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    //if(($scope.loadedData.length >= 20) && $('#activeId').hasClass('active'))
                    if ($scope.loadedData.length >= 20) {
                        $scope.len = $scope.len + 20;
                        $scope.fileDetailObjLimit = {};
                        $scope.fileDetailObjLimit.InstructionID = $scope.refId;
                        $scope.fileDetailObjLimit.start = $scope.len;
                        $scope.fileDetailObjLimit.count = 20;
                        $scope.paymentDataFn($scope.fileDetailObjLimit);
                    }

                }
            })
            setTimeout(function() {}, 1000)
        }
    );

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }


    $scope.exportToDoc = function(msg) {
        bankData.textDownload($filter('hex2a')(msg.MessageContents), msg.GroupInteractionUniqueID);
    }


    $scope.ExportForIE = function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
        {
            var table_html = $('#tableExport').html();
            bankData.exportToExcelHtml(table_html, $scope.filedetail.InstructionID + "_" + $scope.filedetail.TransportName);
        }
    }

    $scope.tablesToExcel = function() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
        {

        } else {

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
                base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
                format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
            return function(tables, wsnames, wbname, appname) {

                var ctx = "";
                var workbookXML = "";
                var worksheetsXML = "";
                var rowsXML = "";
                wsnames = wsnames.map(wsname => $filter('translate')('ReceivedInstructions.'+$filter('removeSpace')(wsname)));
                for (var i = 0; i < tables.length; i++) {
                    if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
                    for (var j = 0; j < tables[i].rows.length; j++) {
                        rowsXML += '<Row>'
                        for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                            var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                            var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                            var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                            dataValue = (dataValue) ? dataValue : evalNode(tables[i].rows[j].cells[k]);
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
                    ctx = { rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i };
                    worksheetsXML += format(tmplWorksheetXML, ctx);
                    rowsXML = "";
                }

                ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
                workbookXML = format(tmplWorkbookXML, ctx);

                wbname = $scope.filedetail.InstructionID + "_" + $scope.filedetail.TransportName + ".xls"

                var link = document.createElement("A");
                link.href = uri + base64(workbookXML);
                link.download = wbname || 'Workbook.xlsx';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }
        
        function evalNode(node) {
            if(node.childNodes.length > 1){
                const ArrayNodes = Array.from(node.childNodes);
                const subNode = ArrayNodes.find(n => n.nodeName == 'SPAN' ||  n.nodeName == 'P')
                return subNode ? subNode.innerHTML.toString().replaceAll(' ',''):''
            }
            return node.innerHTML.toString().replaceAll(' ','')
        }
    }();

    function getForceAction(value) {

        /*$http.post(BASEURL + '/rest/v2/partyserviceassociations/read', {
              'PartyServiceAssociationCode' : value.InputReferenceCode
          }).then(function (response) {
              $scope.ProcessCode = response.data.ProcessCode;
  
              var actionInput = {}
              actionInput.ProcessStatus = $scope.filedetail.FileStatus;
              actionInput.WorkFlowCode = 'INSTRUCTION';
              actionInput.ProcessName = $scope.ProcessCode;
  
              $http.post(BASEURL + '/rest/v2/actions', actionInput).then(function (response) {
              	
                  if (response.data.length > 0) {
                      $scope.enableActionbuttons = response.data;
                      
                      $scope.empObj = [];
                      for(var i in $scope.enableActionbuttons)
                      {
                      $scope.empObj.push({'ActionName':$scope.enableActionbuttons[i].ActionName})
                      
                      }
                      $http.post(BASEURL+RESTCALL.InstructionsActionDetails,{InstructionID:$scope.refId, ActionName:$scope.empObj}).then(function onSuccess(response) {
                          // Handle success
                          var data = response.data;
                          var status = response.status;
                          var statusText = response.statusText;
                          var headers = response.headers;
                          var config = response.config;
                      	
  
                          $scope.chkObj = {};
  
                          for(var i in data) {
                              if(data[i].Applicability == 'Enable')	
                              {
                                  $scope.chkObj[data[i].ActionName] = false;
                              }
                              else if(data[i].Applicability == 'Not Applicable')
                              {
                                  $scope.chkObj[data[i].ActionName] = "notapplicable";
                              }
                              else{
                                  $scope.chkObj[data[i].ActionName] = true;
                              }
                          }
                      }).
                      catch(function onError(response) {
                          // Handle error
                          var data = response.data;
                          var status = response.status;
                          var statusText = response.statusText;
                          var headers = response.headers;
                          var config = response.config;
  
                      });
                  }
              	
              }, function (err) {
              	
              })
  
          }, function (err) {
          	
          })*/

        var actionInput = {}
        actionInput.ProcessStatus = $scope.filedetail.FileStatus;
        actionInput.WorkFlowCode = 'INSTRUCTION';
        actionInput.PartyServiceAssociationCode = $scope.filedetail.InputReferenceCode;
        actionInput.MOP = "";

        $http.post(BASEURL + RESTCALL.ActionREST, actionInput).then(function(response) {

            $scope.aBtns = response.data;

            if (response.data.length > 0) {
                $scope.enableActionbuttons = response.data;

                $scope.empObj = [];
                for (var i in $scope.enableActionbuttons) {
                    $scope.empObj.push({ 'ActionName': $scope.enableActionbuttons[i].ActionName })

                }
                $http.post(BASEURL + RESTCALL.InstructionsActionDetails, { InstructionID: $scope.refId, ActionName: $scope.empObj }).then(function onSuccess(response) {
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

                    /*for(var i in data){
                    if(data[i].Applicability == 'Enable')	
                    	{
                    		$scope.chkObj[data[i].ActionName] = false;
                    	}
                    	else if(data[i].Applicability == 'Not Applicable')
                    	{
                    		$scope.chkObj[data[i].ActionName] = "notapplicable";
                    	}
                    	else{
                    		$scope.chkObj[data[i].ActionName] = true;
                    	}
                    }*/

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

        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }



    /** Handling webforms */
    function webformIttration(argu) {
        $scope.iteratedObj = {};
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        var obtainedFields = argu.webformuiformat.fields.field;
        $scope.obtainThisKeys = ['name', 'type', 'columnspan', 'rowspan', 'enabled', 'label', 'labelposition', 'newrow', 'notnull', 'visible', 'width', 'renderer', 'customsectionlayout', 'indentsubfields', 'maxoccurs', 'minoccurs', 'sectionheader', 'showsectionheader', 'dateformat', 'property', 'choiceOptions']
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
                        'subArr': []
                    })

                    for (k in obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field) {
                        if (obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].type == "Section") {

                            if (obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.maxoccurs == -1) {
                                $scope.fieldDetails.subSection[j]['subArr'].push(iterateSubArr(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k], false))
                            } else {
                                $scope.fieldDetails.subSection[j]['subArr'].push(iterateSubObj(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k], false))
                            }
                        } else {
                            $scope.fieldDetails.subSection[j].subArr.push($scope.objectIttration(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k]))

                        }

                        for (l in Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)) {
                            if (($scope.obtainThisKeys).indexOf(Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]) != -1) {

                                $scope.iteratedObj[Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]] = Object.values(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]
                            }
                        }
                        $scope.iteratedObj = {}
                    }
                }
            }
        }

        for (var x in $scope.fieldDetails.section) {
            if ('Choice' in $scope.fieldDetails.section[x].renderer) {
                if ($scope.fieldDetails.section[x].renderer.Choice.choiceOptions[0].actualvalue == 'REST') {
                    var prop = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value

                    if ($scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value.indexOf('{') != -1) {
                        $scope.restPath = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value.split('{')[0] + $scope[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property[0].value];
                    } else {
                        $scope.restPath = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value
                    }

                    getChoiceOption('GET', $scope.restPath, x)
                }
            }
        }

        $scope.bDataForFields = angular.copy($scope.fieldDetails)
        $scope.backupObj.value = $scope.bDataForFields.section;

        return $scope.fieldDetails;
    }

    function getChoiceOption(_method, url, x) {
        return $http({
            method: _method,
            url: BASEURL + '/rest/v2/' + url
        }).then(function(response) {

            $scope.fieldDetails.section[x].renderer.Choice.choiceOptions = response.data;
            return response.data;

        }, function(error) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)

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
                $.each(value, function(k, v) {
                    var isEmptyObj = $scope.cleantheinputdata(v)
                })
            } else if (value === "" || value === undefined || value === null) {
                delete newData[key]
            }
        })

        return newData
    }

    var fArr = [];

    var chkVal = '';

    var newArr = [];
    var splitVal;
    var propObj = {};

    var prev = '';
    $scope.diabledFields = function(val, field, allfields, ind) {

        prev = field.name;
        newArr = [];
        if (val) {
            for (var i in field.property) {
                if (field.property[i].name.indexOf('|') != -1 && field.property[i].name.split('|')[0] == 'VALUE') {
                    if (val == field.property[i].name.split('|')[1]) {
                        $scope.parsedVal = JSON.parse(field.property[i].value)

                        for (var i in $scope.parsedVal) {
                            for (var j in allfields) {
                                if (i == allfields[j].name) {
                                    for (x in $scope.parsedVal[i]) {
                                        allfields[j][x.toLowerCase()] = $scope.parsedVal[i][x];
                                        $scope.fieldData[i] = '';
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
    };
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

    $scope.actionWebformSubmit = function(val) {
        $scope.rfclicked = true;

        val = $scope.cleantheinputdata(val);
        $scope.actionObj = {
            //PaymentID:$scope.PayId
        }
        $scope.actionObj = val;

        //$scope.actionObj[$scope.rfData.metaInfoName] = val

        $scope.finalRestPath = '';

        if ($scope.fieldDetails.section.length) {
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

        if ($scope.selectedAction.FunctionName == 'DisplayPopUpWithWebFormInput') {
            $scope.responseObj = $scope.actionObj;
        } else if ($scope.selectedAction.FunctionName == 'DisplayPopUpWithWebFormInputForOverride') {
            /*$scope.responseObj = {
            	"paymentID": $scope.PayId,
            	"domainInWebFormName": $scope.rfData.metaInfoName,
            	"DomainIn": btoa(JSON.stringify($scope.actionObj))
            	}*/
        }

        $http.post(BASEURL + "/rest/v2/" + $scope.finalRestPath, $scope.responseObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.rfclicked = false;

            $('#actionForm').modal('hide');
            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }];

            $timeout(function() {
                $('.alert-success').hide();
            }, 6000)
            
            // ENTITY ACTION BUTTON UNLOCK HERE      
            $scope.unlockActionEntity($scope.localUnlockActionObj, false);
            // $scope.nActionBtns = [];

            /*var iCnt = 0;
               var iInterval = '';
               clearInterval(iInterval)
               iInterval = setInterval(function(){

               $scope.fetchDataAgain()
               iCnt++;
               if(iCnt == 2)
               {
               clearInterval(iInterval)
               }
               },1000)*/
        }).catch(function onError(response) {
            // ENTITY ACTION BUTTON UNLOCK HERE           
            // $scope.unlockActionEntity($scope.localUnlockActionObj, false);            
            $scope.IdleTimeStop();
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
            }]
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            $scope.IdleTimerStart();
        });
        setTimeout(function() {
            auditreadall()
        }, 100)
    }

    function auditreadall() {
        $http.post(BASEURL + RESTCALL.FileAuditREST, $scope.fileDetailObj).then(function(response) {
            $scope.filedetailaudit = response.data;
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }

    $scope.lockUnlockActionEntity = function(obj, isLocked) {
        var data = {}; // have to form the request payload
        data['TableName'] = 'InstructionRawData';
        data['ActionName'] = obj.actions.ActionName;
        data['IsLocked'] = isLocked;
        data['BusinessPrimaryKey'] = JSON.stringify({'InstructionID' : obj.pk});
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
                $('#actionForm').modal('hide')
            }
         });  
    }

    $scope.unlockActionEntity = function() {
        var obj = $scope.localUnlockActionObj;
        var data = {}; // have to form the request payload
        data['TableName'] = 'InstructionRawData';
        data['ActionName'] = obj.actions.ActionName;
        data['IsLocked'] = false;
        data['BusinessPrimaryKey'] = JSON.stringify({'InstructionID' : obj.pk});
        EntityLockService.checkEntityLock(data).then(function(data){                   
            // opened modal dialog to process the payment

         }).catch(function(response){            
            var status = response.status;
            var config = response.config;
            if (response.status === 400) {
                var errMsg = response.data.error.message ? response.data.error.message : 'Unknown issue';
                $scope.alerts = [{
                    type: 'danger',
                    msg: errMsg
                }];
                $('#actionForm').modal('hide');
            }
         });  
         $scope.IdleTimeStop();
    }

    $scope.resendAction = function(values) {
        var obj1 = {};
        obj1.GrpReferenceId = values.GrpReferenceId;
        obj1.InvocationPoint = values.InvocationPoint;
        obj1.Relationship = values.Relationship;
        obj1.Status = values.Status;

        $http({
            url: BASEURL + '/rest/v2/interface/request/instruction/resend',
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
            $scope.alerts = [{
                type: 'success',
                msg: "Resend Successfully"
            }];
            $scope.selfCalling()

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

        var obj2 = {};
        obj2.GrpReferenceId = value.GrpReferenceId;
        obj2.InvocationPoint = value.InvocationPoint;
        obj2.Relationship = value.Relationship;
        obj2.Status = value.Status;

        $http({
            url: BASEURL + '/rest/v2/interface/request/instruction/resubmit',
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
            $scope.alerts = [{
                type: 'success',
                msg: "Resubmit Successfully"
            }];
            $scope.selfCalling()

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
            if (payment != undefined) {
                if (argu['InvocationPoint'] === 'FRAUD_ATTCHMSG_TXN') {
                    styleObj = true;
                } else if (payment['FileStatus'].toLowerCase() !== 'fraud_hold' && payment['FileStatus'].toLowerCase().indexOf(argu['InvocationPoint'].toLowerCase()) != -1) {
                    styleObj = true;
                }
            }


        }
        return styleObj;
    }

    $scope.RequestRejetion = function(items, actions) {
            var obj1 = {};
            obj1.InstructionID = items.InstructionID;
            $('.alert-danger').hide();
            var method = "POST";
            var REST_URL = '/rest/v2/ach/instructions/instructionmop/requestrejection';
    
                $http({
                    url: BASEURL + REST_URL,
                    method: method,
                    data: obj1,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    $scope.SCD = data.SCD;
                    $scope.PCD = data.PCD;
                    $scope.alerts = [{
                        type: 'success',
                        msg: $filter('translate')('ReceivedInstructions.Responserejection')
                    }];
                    window.scrollTo(0, 0);
                }).catch(function onError(response) {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: data.error.message
                        }];
    
                });
    }

    $scope.forceAction = function(items, actions) {

        $scope.submitted = false;
        $scope.selectedAction = actions;
        actions.show = 'Disable';

        var obj1 = {};
        obj1.InstructionID = items.InstructionID;
        if(actions.ActionName == 'RjctInstr'){
            obj1.SCD = $scope.SCD;
            obj1.PCD = $scope.PCD;
            $scope.SCD = null;
            $scope.PCD = null;
        }
        $scope.localUnlockActionObj = {
            actions: actions,
            pk: items.InstructionID
        };

        // $scope.lockUnlockActionEntity($scope.localUnlockActionObj, true);    

        var data = {}; // have to form the request payload
        data['TableName'] = 'InstructionRawData';
        data['ActionName'] = actions.ActionName;
        data['IsLocked'] = true;
        data['BusinessPrimaryKey'] = JSON.stringify({ 'InstructionID': items.InstructionID });
        EntityLockService.checkEntityLock(data).then(function(data) {
                // opened modal dialog to process the payment
                $('.alert-danger').hide();
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
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                actions.show = 'Enable';
                if (actions.FunctionName == "DisplayPopUpWithWebFormInput") {
                    //start the timer
                    dlgElem.modal('show');
                    $scope.IdleTimerStart();

                    $scope.metaInfoName = '';
                    $scope.fieldData = {};
                    $scope.rfData = data;
                    $scope.metaInfoName = $filter('camelCaseFormatter')($scope.rfData.metaInfoName)
                    $scope.actionWebformData = JSON.parse(atob(data.metaInfo)).Data;
                    $scope.fieldData = JSON.parse(atob(data.data))
                    webformIttration($scope.actionWebformData)
                        //$('#actionForm').modal('show'); 
                } else {
             
                    $scope.lockUnlockActionEntity($scope.localUnlockActionObj, false);
                    if ((actions.SuccessURL != '') && (actions.SuccessURL != undefined)) {
                        GlobalService.fileDetailStatus.Msg = data.responseMessage;
                        $timeout(function() {
                            $location.path(actions.SuccessURL);
                        }, 200)
                    } else {
                        GlobalService.fileDetailStatus.Msg = data.responseMessage;
                        $timeout(function() {
                            $location.path('app/instructions')
                        }, 200)
                    }
                }
                window.scrollTo(0, 0);
            }).catch(function onError(response) {
                // stop timer
                $scope.IdleTimeStop();
                // Unlock the action
                $scope.lockUnlockActionEntity($scope.localUnlockActionObj, false);
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
                }
                $scope.selfCalling();
            });

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
                $('#actionForm').modal('hide')
            }
         });  

        
    }
    $scope.closeDialog = function() {
        dlgElem.modal("hide");
        $scope.unlockActionEntity();
    };
    $scope.isTabClicked = false;
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("id") // activated tab
        if(target == '#tab__2'){
            $scope.$apply(function () {
                $scope.isTabClicked = true;
            })
        }else{
            $scope.$apply(function () {
                $scope.isTabClicked = false;
            })
        }
      });
    $scope.exportToExcelLog = function (eve) {
        var inputobj = $scope.fileDetailObj;
        if ($("input[name=excelVal][value='txt']").is(":checked") || $("input[name=excelVal][value='csv']").is(":checked")) {
            if ($("input[name=excelVal][value='txt']").is(":checked")) {
                var url = "/rest/v2/ach/instructions/exportreceievedInstr/logs"
                inputobj['format'] = 'txt'
            } else if ($("input[name=excelVal][value='csv']").is(":checked")) {
                var url = "/rest/v2/ach/instructions/exportreceievedInstr/logs"
                inputobj['format'] = 'csv'
            }
            $http.post(BASEURL + url, inputobj).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                // $scope.datas = $scope.datas.concat(data);
                $scope.Details = 'data:application/octet-stream;base64,' + data['Data'];
                var dlnk = document.getElementById('dwnldLnk');
                dlnk.href = $scope.Details;


                if ($("input[name=excelVal][value='txt']").is(":checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'Reports.txt';
                    }

                } else if ($("input[name=excelVal][value='csv']").is(":checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'Reports.csv';
                    }

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

            // }


        }


    }
    $scope.toAllPaymentsCompleted = function(){
        AllPaymentsGlobalData.fromDashboard = true;
        AllPaymentsGlobalData.DataLoadedCount = 20;
        AllPaymentsGlobalData.FLuir = "";
        AllPaymentsGlobalData.SelectSearchVisible = false;
        AllPaymentsGlobalData.advancedSearchEnable = true;
        AllPaymentsGlobalData.all = true;
        AllPaymentsGlobalData.custom = false;
        AllPaymentsGlobalData.endDate = "";
        AllPaymentsGlobalData.isEntered = false;
        AllPaymentsGlobalData.isSortingClicked = false;
        AllPaymentsGlobalData.month = false;
        AllPaymentsGlobalData.monthEnd = "";
        AllPaymentsGlobalData.monthStart = "";
        AllPaymentsGlobalData.myProfileFLindex = "";
        AllPaymentsGlobalData.prev = "all";
        AllPaymentsGlobalData.prevId = 1;
        AllPaymentsGlobalData.prevSelectedTxt = "all";
        AllPaymentsGlobalData.searchClicked = false;
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.searchname = "";
        AllPaymentsGlobalData.selectCriteriaID = 1;
        AllPaymentsGlobalData.selectCriteriaTxt = "All";
        AllPaymentsGlobalData.sortReverse = false;
        AllPaymentsGlobalData.sortType = "Desc";
        AllPaymentsGlobalData.startDate = "";
        AllPaymentsGlobalData.today = false;
        AllPaymentsGlobalData.todayDate = "";
        AllPaymentsGlobalData.uirTxtValue = "";
        AllPaymentsGlobalData.week = false;
        AllPaymentsGlobalData.weekEnd = "";
        AllPaymentsGlobalData.weekStart = "";
        AllPaymentsGlobalData.orderByField = "ReceivedDate";

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
        AllPaymentsGlobalData.searchParams.InstructionID = $scope.filedetail.InstructionID;
        AllPaymentsGlobalData.FromDashboardFieldArr = [];
        AllPaymentsGlobalData.FromDashboardFieldArr.push('InstructionID='+$scope.filedetail.InstructionID);
        $location.path('app/allpayments');
    }
    $scope.toAllPaymentsRejected = function(){
        AllPaymentsGlobalData.fromDashboard = true;
        AllPaymentsGlobalData.DataLoadedCount = 20;
        AllPaymentsGlobalData.FLuir = "";
        AllPaymentsGlobalData.SelectSearchVisible = false;
        AllPaymentsGlobalData.advancedSearchEnable = true;
        AllPaymentsGlobalData.all = true;
        AllPaymentsGlobalData.custom = false;
        AllPaymentsGlobalData.endDate = "";
        AllPaymentsGlobalData.isEntered = false;
        AllPaymentsGlobalData.isSortingClicked = false;
        AllPaymentsGlobalData.month = false;
        AllPaymentsGlobalData.monthEnd = "";
        AllPaymentsGlobalData.monthStart = "";
        AllPaymentsGlobalData.myProfileFLindex = "";
        AllPaymentsGlobalData.prev = "all";
        AllPaymentsGlobalData.prevId = 1;
        AllPaymentsGlobalData.prevSelectedTxt = "all";
        AllPaymentsGlobalData.searchClicked = false;
        AllPaymentsGlobalData.searchNameDuplicated = false;
        AllPaymentsGlobalData.searchname = "";
        AllPaymentsGlobalData.selectCriteriaID = 1;
        AllPaymentsGlobalData.selectCriteriaTxt = "All";
        AllPaymentsGlobalData.sortReverse = false;
        AllPaymentsGlobalData.sortType = "Desc";
        AllPaymentsGlobalData.startDate = "";
        AllPaymentsGlobalData.today = false;
        AllPaymentsGlobalData.todayDate = "";
        AllPaymentsGlobalData.uirTxtValue = "";
        AllPaymentsGlobalData.week = false;
        AllPaymentsGlobalData.weekEnd = "";
        AllPaymentsGlobalData.weekStart = "";
        AllPaymentsGlobalData.orderByField = "ReceivedDate";

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
        AllPaymentsGlobalData.searchParams.InstructionID = $scope.filedetail.InstructionID;
        AllPaymentsGlobalData.searchParams.Status = "REJECTED";
        AllPaymentsGlobalData.FromDashboardFieldArr = [];
        AllPaymentsGlobalData.FromDashboardFieldArr.push('Status=REJECTED');
        AllPaymentsGlobalData.FromDashboardFieldArr.push('InstructionID='+$scope.filedetail.InstructionID);
        $location.path('app/allpayments');
    }

    if(!sessionStorage.EntityUser ){
        var len = 20;
        var _query = {};
        _query.UserID = sessionStorage.UserID;
        _query.RoleID = sessionStorage.ROLE_ID;
        _query.start = 0;
        _query.count = len;
        $http.post(BASEURL + '/rest/v2/administration/welcomescreen', _query).then(function onSuccess(response) {
            // Handle success
    
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers();
            var config = response.config;
         
            sessionStorage.EntityUser = data.Entity
    
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
