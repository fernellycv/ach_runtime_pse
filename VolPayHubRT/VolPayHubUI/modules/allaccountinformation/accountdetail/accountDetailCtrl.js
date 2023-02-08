angular.module('VolpayApp').controller('accountDetailCtrl', function($scope, $http, $location, $state, $timeout, $filter, $rootScope, GlobalService, AllPaymentsGlobalData, AllAccountService, bankData, errorservice) {

    $scope.backupObj = {
        value: '',
        ind: -1
    };

    $scope.rfclicked = false;
    $scope.isnavfromAttachmsgdetail = false;
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
        $state.go('app.attachmessages')

    }
    $scope.attachmsgData = $state.params.input.data;
    $scope.UniqueRefID = $state.params.input.nav.PID;
    $scope.paymentid = $state.params.input.nav.PayID;

    $scope.clickReferenceParentID = function(val) {
        $state.go('app.attachmessagesdetail', {
            input: val
        })
    }

    $scope.isCollapsed = false;
    $scope.isPaymentCollapsed = false;
    $scope.isPaymentInfoCollapsed = true;
    $scope.isPaymentInfoDebitPartyCollapsed = true;
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
    $scope.morefileInfoCollapsed = true;
    $scope.accountDetailsCollapsed = true;
    $scope.accountLinkingCollapsed = true;


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

    if ($scope.paymentRepaired) {

        $scope.alerts = [{
            type: 'success',
            msg: $filter('translate')('PaymentRepairdetailshavebeenforwardedtobank')
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
                        AllAccountService.dropDownLoadMore($scope.count).then(function(items) {

                            if (items.data.length) {
                                $scope.dropdownVal = $scope.dropdownVal.concat(items.data);
                            }
                        });

                    }
                }

            }
        }

        $http({
            method: 'POST',
            url: BASEURL + '/rest/v2/accountinformation/read',
            data: {
                "CorrelationID": $scope.UniqueRefID
            }

        }).then(function(allAccountdata) {

            $scope.cData = allAccountdata.data;
            $scope.refId = $scope.cData.InstructionID;

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

            $http.post(BASEURL + '/rest/v2/accountinformation/communication/readall', {
                'CorrelationID': $scope.UniqueRefID
            }).then(function(paymentRelatedMsg) {
                $scope.relatedMsgs = paymentRelatedMsg.data;
                $scope.rowSpan = $scope.relatedMsgs.length;
                $scope.RelatedMSGLoaded = true;
                $scope.loading = true;
                $scope.AuditTableLoaded = true;
            }, function(err) {
                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            })

            $http.post(BASEURL + RESTCALL.PaymentAuditREST, {
                'PaymentID': $scope.paymentid
            }).then(function(paymentAudit) {

                $scope.cDataAudit = paymentAudit.data;
                $scope.AuditTableLoaded = true;
            }, function(err) {

                $scope.AuditTableLoaded = true;
                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            })

            $http.post(BASEURL + '/rest/v2/payments/errorinformation/readall', {
                'PaymentID': $scope.paymentid
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
        }, function(err) {
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

    }

    $scope.gotoFiledetail = function(id) {
        GlobalService.fileListId = id;
        $state.go('app.filedetail', {
            input: $state.params
        })

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

    $scope.textDocDownload = function(data) {
        bankData.textDownload($filter('hex2a')(data.OutputMessage), data.UniqueOutputReference);
    }

    $scope.fetchDataAgain = function() {
        fillData()
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

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.exportToDoc = function(msg) {

        bankData.textDownload($filter('hex2a')(msg.Action), msg.CorrelationID + "_" + msg.InstructionID);
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

            wbname = $scope.cData.CorrelationID + "_" + $scope.cData.InstructionID + ".xls"

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
            tablesToExcel(['val1', 'flInfo', 'tab3'], ['Account Details', 'Get Balance', 'External Communications'], 'TestBook.xls', 'Excel');
            //tablesToExcel(['val1','flInfo','val2','tab1'], ['Payment Details','File Information','Payment Information','aaa'], 'TestBook.xls', 'Excel');
        }
    })

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
            "MOP": ($scope.cData.MethodOfPayment.length > 0) ? $scope.cData.MethodOfPayment : ""
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
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

            $('.modal').modal('hide');
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
    }

    $scope.clickReferenceID = function(val) {

        GlobalService.fileListId = val.data.InstructionID;
        GlobalService.UniqueRefID = val.LinkedMsgID;
        GlobalService.fromPage = val.fromPage;

        $scope.Obj = {
            'uor': (val.data.OutputInstructionID) ? val.data.OutputInstructionID : '',
            'nav': {
                'UIR': val.data.InstructionID,
                'PID': val.LinkedMsgID
            },
            'from': val.fromPage
        }

        $state.go('app.paymentdetail', {

            input: $scope.Obj
        })

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
            'subArr': []

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
            'subArr': []
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
            'subArr': []
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
                    'subArr': []
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
                            'subArr': []
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
            'subArr': []
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
                    'subArr': []
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
                        'subArr': []
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

    $scope.actionWebformSubmit = function(val) {
        _val = angular.copy(val)

        $scope.rfclicked = true;
        _val = removeEmptyValueKeys(_val)

        _val = $scope.cleantheinputdata(_val);
        $scope.actionObj = {}
        $scope.actionObj = _val;
        if ($scope.attachmsgData.AttchMsgInstrID) {
            $scope.actionObj['AttchMsgInstrID'] = $scope.attachmsgData.AttchMsgInstrID;
        }

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

        if (!$scope.selectedAction.FunctionName || $scope.selectedAction.FunctionName == 'DisplayPopUpWithWebFormInput') {
            $scope.responseObj = $scope.actionObj;
        } else if ($scope.selectedAction.FunctionName == 'DisplayPopUpWithWebFormInputForOverride') {
            $scope.responseObj = {
                "paymentID": $scope.PayId,
                "domainInWebFormName": $scope.rfData.metaInfoName,
                "DomainIn": btoa(JSON.stringify($scope.actionObj))
            }
        }

        $scope.rfclicked = false;
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

            $('#overRide').modal('hide')
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
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

    $scope.removesubSection = function(arg) {

        $scope.updatedfieldDetailsSubsection.splice(arg.ind, 1);
        arg['fielddata'][arg.pgroup.name].splice(arg.ind, 1);
        $scope.sectionCntNew = $scope.sectionCntNew - 1;
    }

    $scope.attachmsgData = '';
    $scope.actionWebform = function(arg, msg) {
        $scope.attachmsgData = arg;
        $scope.sectionCntNew = 0;
        $scope.submitted = false;
        $scope.selectedAction = arg;
        $scope.rfclicked = false;
        $scope.bSectionData = {};
        $scope.sectionFlag = false;
        $scope.sectionDropdownChanged = false;
        var _quer = {}
        _quer['PaymentID'] = $scope.PayId;
        if (msg && msg['GrpReferenceId']) {
            _quer['GrpReferenceID'] = msg['GrpReferenceId'];
        }
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        $scope.metaInfoName = '';

        $scope.updatedfieldDetailsSubsection = [{
            fields: []
        }];

        prevObj = {};
        $('.alert-danger').hide();
        $scope.fieldData = {};

        $http.post(BASEURL + '/rest' + arg.RestURL, _quer).then(function onSuccess(response) {
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
            }, 300)
            webformIttration($scope.actionWebformData)
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

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }

        if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $(e.currentTarget).data("DateTimePicker").hide();
        }
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

    $scope.gotoPaymentDetail = function(Parent_Id) {
        GlobalService.fileListId = $state.params.input.UIR;
        GlobalService.UniqueRefID = Parent_Id;
        GlobalService.fromPage = $state.params.input.from;

        $scope.Obj = {
            'uor': $state.params.input.uor,
            'nav': {
                'UIR': $state.params.input.UIR,
                'PID': Parent_Id
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

        var prev = null;
        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            maxDate: todayDate,
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

    $scope.diableFields = function(_data, _input) {

        for (var val in _input.property) {
            if (_input.property[val].name.indexOf('|') != -1) {

                if (_data.length) {

                    _data.forEach(function(dropVal, dropvalIndex) {
                        if (_input.property[val].name.split('|')[1].indexOf(dropVal) != -1) {

                            var checkValue = JSON.parse(_input.property[val].value)

                            $scope.fieldDetails.section.forEach(function(currentValue, index, arr) {
                                if (checkValue[currentValue.name]) {
                                    if (!backup_value[val]) {
                                        backup_value[val] = {
                                            'index': angular.copy(index),
                                            'value': angular.copy(currentValue),
                                            'keys': Object.keys(checkValue[currentValue.name])
                                        }
                                        Object.keys(checkValue[currentValue.name]).forEach(function(Value, index, arr) {
                                            currentValue[Value.toLowerCase()] = checkValue[currentValue.name][Value];
                                        })
                                    }
                                }
                            })
                        } else {

                            if (backup_value[val]) {
                                backup_value[val]['keys'].forEach(function(vals) {

                                    $scope.fieldDetails.section[backup_value[val]['index']][vals.toLowerCase()] = backup_value[val]['value'][vals.toLowerCase()];

                                    if (vals.toLowerCase() == 'enabled' && !backup_value[val]['value'][vals.toLowerCase()]) {
                                        $scope.fieldData[$scope.fieldDetails.section[backup_value[val]['index']]['name']] = '';
                                    }
                                })
                                delete backup_value[val]
                            }
                        }
                    })
                } else {

                    for (var val_ in backup_value) {
                        backup_value[val_]['keys'].forEach(function(val) {

                            $scope.fieldDetails.section[backup_value[val_]['index']][val.toLowerCase()] = backup_value[val_]['value'][val.toLowerCase()];

                            if (val.toLowerCase() == 'enabled' && !backup_value[val_]['value'][val.toLowerCase()]) {
                                $("[name=" + backup_value[val_]['value']['name'] + "]").val("");
                                $scope.fieldDetails.section[backup_value[val_]['index']]['width'] = backup_value[val_]['value']['width'];

                                if ($scope.fieldDetails.section[backup_value[val_]['index']]['name'] in $scope.fieldData) {
                                    $scope.fieldData[$scope.fieldDetails.section[backup_value[val_]['index']]['name']] = '';
                                }

                            }
                        })
                    }
                    backup_value = {};
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


    $scope.ExternalComViewOUT = function(message) {

        /*ChangedURL = BASEURL.substr(0,BASEURL.indexOf('VolPayRest'))
        $http.get(ChangedURL + 'VolPayTxnProcessor/rest/v2/formatresponse/getResponseFormat/' + $scope.UniqueRefID ).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            
            $scope.rawData_attachMsg = data;
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
        	}]

        	errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
		
        */

        $http({
            url: protocol_host_port + '/VolPayTxnProcessor/rest/v2/formatresponse/getResponseFormat/' + $scope.UniqueRefID,
            method: "GET",
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.rawData_attachMsg = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.target_table = function(target, id) {
        var id = $filter('specialCharactersRemove')(target) + '_' + id;

        $('.overflowPaymentSection').removeClass('active')
        $('#tab_' + id).addClass('active')
    }

});