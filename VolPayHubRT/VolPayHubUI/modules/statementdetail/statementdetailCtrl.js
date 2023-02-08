angular.module('VolpayApp').controller('statementdetailCtrl', function($scope, $http, $state, $location, $compile, GlobalService, bankData, $timeout, $filter, $rootScope) {
    $scope.isCollapsed = false;
    $scope.isPaymentCollapsed = false;
    $scope.confirmationDetails = false;
    $scope.attachDetails = false;
    $scope.instructionTypeValue = GlobalService.instructionType;
    $scope.refId = GlobalService.fileListId;
    //	$scope.instType = $state.params.input.instructype;
    $scope.paymentid = GlobalService.fileListPaymentid;
    $scope.fileDetailObj = {};
    $scope.fileDetailObj.InstructionID = $scope.refId;

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

    });

    $scope.ReversalIndicator = [{
        "actualvalue": "1",
        "displayvalue": "True"
    }, {
        "actualvalue": "0",
        "displayvalue": "False"
    }];

    $scope.tabMenus = [{
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
        },
        {
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
            "label": "Reference For Account Owner",
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
            "label": "Recon Payment Message ID",
            "FieldName": "ReconPaymentMsgID",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Linked Message Function",
            "FieldName": "LinkedMsgFunc",
            "listViewflag": false,
            "visible": true
        }, {
            "label": "Original Payment Message ID",
            "FieldName": "OriginalPaymentMsgID",
            "listViewflag": false,
            "visible": true
        },
        {
            "label": "Statement Matching Status",
            "FieldName": "MatchingStatus",
            "listViewflag": false,
            "visible": true
        },
        {
            "label": "Action",
            "FieldName": "Action",
            "listViewflag": false,
            "visible": true
        }
    ]

    /* AuditLog Function */

    $scope.AuditLog = function(id) {
        $http.get(BASEURL + '/rest/v2/statements/getlogaudit/' + id.EntryReferenceId).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.StmtLog = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }

    // RESTCALL.TransportResendExternal = '/rest/v2/transports/resendexternal/';

    function getValues(obj, key) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i))
                continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getValues(obj[i], key));
            } else if (i == key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    }
    $scope.backupObj = {
        value: '',
        ind: -1
    };

    $scope.rfclicked = false;

    if ($scope.refId == -1) {
        $state.go('app.statements')
    }

    $scope.fromOutputSummary = $state.params.input;

    $scope.gotoOutputPaymentSummary = function() {
        $state.go('app.outputpaymentsummary', { input: { 'uor': $scope.fromOutputSummary.input.uor, 'nav': {}, 'from': 'distributedinstructions' } })
    }

    sessionStorage.menuSelection = JSON.stringify({ 'val': 'StatementModule', 'subVal': 'ReceivedStatements' })


    $scope.GoToDupData = function(val) {
        GlobalService.fileListId = val;

        GlobalService.sidebarCurrentVal = {
            "ParentName": "Statement Module",
            "Link": "app",
            "IconName": "icon-settings"
        }
        GlobalService.sidebarSubVal = {
            "IconName": "fa-file-text-o",
            "Id": "002",
            "Link": "statementdetail",
            "Name": "File List",
            "ParentName": "Statement Module"
        }

        $state.reload()
    }

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }


    function specificFileDetailRest() {


        $http.post(BASEURL + RESTCALL.StatementFileSpecificREST, $scope.fileDetailObj).then(function(resp) {
            $scope.filedetail = resp.data;
            // JIRA-2539
            $scope.InstrFieldListJsonValue = convertXml2JSon($scope.filedetail.InstructionFieldList);

            getForceAction($scope.filedetail)


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

                if (data.length && data[0].ColourB) {
                    $scope.selectedClr.ColourB = data[0].ColourB;
                    $scope.selectedClr.Grandient = true;
                } else {
                    $scope.selectedClr.Grandient = false;
                }
                if (data.length) {
                    $scope.selectedClr.ColourA = data[0].ColourA;
                    $scope.selectedClr.Opacity = data[0].Opacity / 100;
                }
                $scope.appliedStyle = (!$scope.selectedClr.Grandient) ? { 'color': $scope.selectedClr.ColourA, 'opacity': $scope.selectedClr.Opacity } : { 'background': '-webkit-linear-gradient(' + $scope.selectedClr.ColourA + ',' + $scope.selectedClr.ColourB + ')' }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
            sidebarMenuControl('StatementModule', 'ReceivedStatements')
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
    }

    // specificFileDetailRest()

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
    });

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

    $scope.filedetailpcd = [];

    $scope.paymentDataFn = function(obj, flag) {
        obj = $scope.uorQueryConstruct(obj);
        // $http.post(BASEURL + RESTCALL.FilePCDREST, obj).then(function (resp1) {
        $http.post(BASEURL + '/rest/v2/instructions/statementcontroldata/readall', obj).then(function(resp1) {
            $scope.loadedData = resp1.data;
            $scope.len += 20
            if (flag) {
                $scope.filedetailpcd = resp1.data;
            } else {
                $scope.filedetailpcd = $scope.filedetailpcd.concat(resp1.data);
            }
            GlobalService.allFileListDetails = resp1.data
        }, function(err) {
            $scope.loadedData = [];
        });
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


            $scope.data.notes = ''
            $('.modal').modal('hide')
            $http.post(BASEURL + RESTCALL.FileAuditREST, $scope.fileDetailObj).then(function(resp2) {
                $scope.filedetailaudit = resp2.data;
            }, function(err) {
                errorservice.ErrorMsgFunction(err, $scope, $http, err.data.error.code)
            })
        }, function(err) {
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];
        })
    }

    /*$('#activeId').click(function(){
    	 $scope.len = 0;
    	 $scope.filedetailpcd=[];
    	 $scope.fileDetailObjLimit = {
    		 start: 0,
    		 count: 20,
    		 params: [{
    					 "ColumnName": 'InstructionID',
    					 "ColumnOperation": "=",
    					 "ColumnValue": $scope.refId,
    					 'advancedSearch': true
    				 }]
    	 	
    	 }
    	 $scope.paymentDataFn($scope.fileDetailObjLimit);
    })*/


    $scope.selfCalling = function() {
        $('#restoreFileData').css('pointer-events', 'none');
        $scope.filedetailpcd = [];
        $scope.len = 0;
        $scope.fileDetailObjLimit = {
            start: $scope.len,
            count: 20,
            params: [{
                "ColumnName": 'InstructionID',
                "ColumnOperation": "=",
                "ColumnValue": $scope.refId,
                'advancedSearch': true
            }]

        };

        $scope.paymentDataFn($scope.fileDetailObjLimit);

        $http.post(BASEURL + RESTCALL.FileAuditREST, $scope.fileDetailObj).then(function(resp2) {
            $('#restoreFileData').css('pointer-events', 'auto');
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
                        $(sanitize('.dupDatas')).append(initData[0] + '[')
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
            }
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
            $('#restoreFileData').css('pointer-events', 'auto');
        });

        /*$http.post(BASEURL + RESTCALL.FLTransactionalDetails,$scope.fileDetailObj).then(function (response) {
      			$scope.transactionData = response.data;
      		}, function (err) {/v2/instructions/interaction/readall
				
      	}); */

        $http.post(BASEURL + RESTCALL.FileSystemInteraction, $scope.fileDetailObj).then(function(response) {
            $scope.newdata = response.data;
            $('#restoreFileData').css('pointer-events', 'auto');
        }, function(err) {
            $('#restoreFileData').css('pointer-events', 'auto');
        })

        $http.post(BASEURL + RESTCALL.FileExtCommunication, $scope.fileDetailObj).then(function(response) {
            $scope.externaldata = response.data;
            $('#restoreFileData').css('pointer-events', 'auto');
        }, function(err) {
            $('#restoreFileData').css('pointer-events', 'auto');
        })

        $http.post(BASEURL + RESTCALL.InstnErrorInfo, $scope.fileDetailObj).then(function(response) {
            $scope.ErrorInfodata = response.data;
            $('#restoreFileData').css('pointer-events', 'auto');
        }, function(err) {
            $('#restoreFileData').css('pointer-events', 'auto');
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

    $scope.clickStatementtoPayment = function(val) {

        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.data[val['fieldname']];
        GlobalService.fromPage = val.fromPage;

        $scope.Obj = {
            'nav': {
                'UIR': val.data.InstructionID,
                'PID': val.data[val['fieldname']]
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
                'PID': value.data.ReconPaymentMsgID
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
                'PID': val.data.PaymentID
            },
            'from': 'AllConfirmaion',
            'InstructionType': 'RESPONSE'
        }

        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })

    }

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
            }, 200)
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
                callOnTimeOut()
            }, 4000)

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
        });
    }

    /*           $scope.fileDetailObjLimit = {};
				 $scope.fileDetailObjLimit.UIR = $scope.refId;
				 $scope.fileDetailObjLimit.start = $scope.len;
				 $scope.fileDetailObjLimit.count = 3;
 
	 */

    /*** To control Load more data ***/
    jQuery(function($) {
        $('.fileDetailOverflow').bind('scroll', function() {
            if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                if ($scope.loadedData.length >= 20) {
                    /* $scope.fileDetailObjLimit = {
                    	start: $scope.len,
                    	count: 20,
                    	params: [{
                    				"ColumnName": 'InstructionID',
                    				"ColumnOperation": "=",
                    				"ColumnValue": $scope.refId,
                    				'advancedSearch': true
                    			}]
                    	
                    }; */
                    $scope.fileDetailObjLimit['start'] = $scope.len;
                    debounceHandler($scope.fileDetailObjLimit);
                }
            }
        })
    });

    var debounceHandler = _.debounce($scope.paymentDataFn, 700, true);

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
                tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
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

                for (var i = 0; i < tables.length; i++) {
                    if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
                    for (var j = 0; j < tables[i].rows.length; j++) {
                        rowsXML += '<Row>'
                        for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                            var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                            var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                            var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                            dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML;
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

						for(var i in data){
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

                    /*for(var i in data) {
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
                });
            }

        }, function(err) {

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
            if (inFields[i].type != 'Section') {

            } else if (inFields[i].type == 'Section') {

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
                                        allfields[j][x] = $scope.parsedVal[i][x];
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


            $('#actionForm').modal('hide')
            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage
            }];

            $timeout(function() {
                $('.alert-success').hide();
            }, 6000)

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
        });
        setTimeout(function() {
            auditreadall()
        }, 100)

    }


    function auditreadall() {
        $http.post(BASEURL + RESTCALL.FileAuditREST, $scope.fileDetailObj).then(function(response) {
            $scope.filedetailaudit = response.data;
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.data.error.code)
        })
    }

    $scope.forceAction = function(items, actions) {

        $scope.submitted = false;
        $scope.selectedAction = actions;

        actions.show = 'Disable';

        var obj1 = {};
        obj1.InstructionID = items.InstructionID;

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
                $scope.metaInfoName = '';
                $scope.fieldData = {};

                $scope.rfData = data;
                $scope.metaInfoName = $filter('camelCaseFormatter')($scope.rfData.metaInfoName)
                $scope.actionWebformData = JSON.parse(atob(data.metaInfo)).Data;
                $scope.fieldData = JSON.parse(atob(data.data))
                webformIttration($scope.actionWebformData)
                    //$('#actionForm').modal('show'); 
            } else {
                if ((actions.SuccessURL != '') && (actions.SuccessURL != undefined)) {

                    GlobalService.fileDetailStatus.Msg = data.responseMessage;
                    $timeout(function() {
                        $location.path(actions.SuccessURL);
                    }, 200)
                } else {
                    GlobalService.fileDetailStatus.Msg = data.responseMessage;
                    $timeout(function() {
                        $location.path('app/statements')
                    }, 200)
                }
            }
        }).catch(function onError(response) {
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
            }
        });
    }

    $scope.setstatement = function(val, key) {

        $scope.keyarr = key.split('.');

        for (var i in $scope.keyarr) {
            if ($scope.keyarr.length > 1) {
                $scope.arr = "";
                for (k in $scope.keyarr) {
                    var abc = '"' + $scope.keyarr[k] + '"';
                    $scope.arr = $scope.arr + '[' + abc + ']'
                }
            } else {
                return val[$scope.keyarr[0]]
            }
        }
    }

    $scope.search = {};
    $scope.FieldsValues = [
        /*	{
        		"label": "Page Number",
        		"value": "StmtLegalSequenceNo",
        		"type": "amountRange",
        		"allow": "number",
        		"visible": true
        	},*/
        {
            "label": "Value Date",
            "value": "EntryValueDate",
            "type": "dateRange",
            "allow": "date",
            "visible": true
        }, {
            "label": "Reference For Account Owner",
            "value": "EntryTxnE2EId",
            "type": "text",
            "allow": "string",
            "visible": true
        }, {
            "label": "Debit/Credit Mark",
            "value": "EntryDrCrIndicator",
            "type": "dropdown",
            "visible": true
        }, {
            "label": "Reversal Indicator",
            "value": "EntryReversalIndicator",
            "type": "dropdown",
            "visible": true
        }, {
            "label": "Amount",
            "value": "EntryAmount",
            "type": "amountRange",
            "allow": "number",
            "visible": true
        },
        /*{
				"label": "Currency",
				"value": "EntryCurrency",
				"type": "dropdown",
				"visible": true
			}*/
        , {
            "label": "Matching Status",
            "value": "MatchingStatus",
            "type": "dropdown",
            "visible": true
        }
    ]

    $(document).ready(function() {
        for (var i in $scope.FieldsValues) {
            if ($scope.FieldsValues[i].type == 'dropdown') {
                $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
            }
        }

        $scope.loadCurrencyDropDown = function() {
            var authenticationObject = $rootScope.dynamicAuthObj;
            $scope.limit = 500;
            $("select[name='EntryCurrency']").select2({
                ajax: {
                    url: BASEURL + '/rest/v2/currencies/readall',
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
                    method: "POST",
                    crossDomain: true,
                    data: function(params) {
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
                                                    "columnName": "CurrencyCode",
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
                    },
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = [];
                        data = uniques(data);
                        for (j in data) {
                            myarr.push({
                                'id': data[j].CurrencyCode,
                                'text': data[j].CurrencyCode
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
                placeholder: 'Select',
                minimumInputLength: 0
            })
        }

        setTimeout(function() {
            $scope.loadCurrencyDropDown();
            customDateRangePicker("EntryValueDateStart", "EntryValueDateEnd");
            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click();
            })
        }, 100)
    })

    $scope.cleanInputData = function(newData) {
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

    $scope.removeSearchWarning = function() {
        $scope.showSearchWarning = false;
    }
    $scope.buildSearch = function() {
        $scope.search = $scope.cleanInputData($scope.search);
        $scope.showSearchWarning = $.isEmptyObject($scope.search)
        $scope.searchArr = [];
        for (var i in $scope.search) {
            if (i === 'EntryAmount' || i === 'StmtLegalSequenceNo' || i === 'EntryValueDate') {
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
                } else {
                    $scope.searchArr.push({
                        "ColumnName": i,
                        "ColumnOperation": "=",
                        "ColumnValue": $scope.search[i].Start || $scope.search[i].End,
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
        if (!$scope.showSearchWarning) {
            $scope.len = 0;
            $scope.fileDetailObjLimit = {
                start: $scope.len,
                count: 20,
                params: [{
                    "ColumnName": 'InstructionID',
                    "ColumnOperation": "=",
                    "ColumnValue": $scope.refId,
                    'advancedSearch': true
                }]

            }
            $scope.fileDetailObjLimit.params = $scope.fileDetailObjLimit.params.concat($scope.searchArr);
            $scope.paymentDataFn($scope.fileDetailObjLimit, true);
        }
    }

    $scope.resetSearch = function() {
        if (!$.isEmptyObject($scope.search) || $scope.showSearchWarning) {
            $scope.len = 0;
            $scope.fileDetailObjLimit = {
                start: $scope.len,
                count: 20,
                params: [{
                    "ColumnName": 'InstructionID',
                    "ColumnOperation": "=",
                    "ColumnValue": $scope.refId,
                    'advancedSearch': true
                }]

            }
            $scope.paymentDataFn($scope.fileDetailObjLimit, true);
        }
        $scope.search = {};
        setTimeout(function() {
            for (var i in $scope.FieldsValues) {
                if ($scope.FieldsValues[i].type == 'dropdown') {
                    $(sanitize('[name=' + $scope.FieldsValues[i].value + ']')).select2();
                }
            }
            $scope.loadCurrencyDropDown();
        }, 100)
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

});
