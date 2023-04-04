angular.module('VolpayApp').controller('ConsolidatedADFqueryByStateCtrl', function ($scope, $timeout, $document, $rootScope, $http, $filter, $state, $translate, GetPermissions) {

    //get Permissions from Roleresourcepermission
    $scope.newPermission = GetPermissions("Detail of the ADF query Consolidated by State");

    //Session ROL

    $scope.visibleRoleButtons = function () {
        if (sessionStorage.getItem('ROLE_ID') == 'ACH_AdminApprover' || sessionStorage.getItem('ROLE_ID') == 'ACH_AdminOperator') {
            $scope.sessionStorageACH = true;
            $scope.sessionStorageOI = false;
        } else if (sessionStorage.getItem('ROLE_ID') == 'DefaultIO_InformationApprover' || sessionStorage.getItem('ROLE_ID') == 'DefaultIO_InformationOperator') {
            $scope.sessionStorageACH = false;
            $scope.sessionStorageOI = true;
        } else if(sessionStorage.getItem('ROLE_ID') == 'Super Admin'){
            $scope.sessionStorageACH = true;
            $scope.sessionStorageOI = true;
        };
    }
    $scope.visibleRoleButtons();

    //Init Format 
    $scope.init = function () {
        $scope.CurrentPage = 1;
        $scope.CurrentLimit = 20;
        $scope.TotalCount = 0;
        $scope.totalReportCount = 0;
        $scope.consADFByStates = [];
        $scope.notAllowedState = ['COMPLETED', 'NOTAPPROVED', 'ACCEPTED'];

        $scope.consolidationStatements = [
            {
                actualValue: "",
                displayValue: "Seleccionar Estado"
            },
            {
                actualValue: "TOBEPROCESSED",
                displayValue: "TO BE PROCESSED"
            },
            {
                actualValue: "ACCEPTED",
                displayValue: "ACCEPTED"
            },
            {
                actualValue: "REJECTED",
                displayValue: "REJECTED"
            },
            {
                actualValue: "COMPLETED",
                displayValue: "COMPLETED"
            },
            {
                actualValue: "NOTAPPROVED",
                displayValue: "NOT APPROVED"
            }
        ]
        $scope.ConsolidatedByStateDetailData = {};
        $scope.ConsolidatedByStateDetailData.informationOperator = "";
        $scope.ConsolidatedByStateDetailData.status = $scope.consolidationStatements[0].actualValue;
        $scope.ConsolidatedByStateDetailData.date = new Date().toLocaleDateString('en-ZA');
        $scope.checkboxModel = {
            selectAll: false
        };
    }
    $scope.init();

    //DatePicker
    $scope.customDateRangePicker = function (sDate, eDate) {
        var startDate = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);
        $(sanitize("#" + sDate))
            .datepicker({
                language: "es",
                weekStart: 1,
                startDate: "1900-01-01",
                minDate: 1,
                endDate: FromEndDate,
                autoclose: true,
                format: "yyyy/mm/dd",
                todayHighlight: true,
                setDate: new Date(),
                maxDate: new Date(),
                daysOfWeekDisabled: [0, 6],
                showClear: true
            }).on("changeDate", function (selected) {
                if (selected.date) {
                    startDate = new Date(selected.date.valueOf());
                    startDate.setDate(
                        startDate.getDate(new Date(selected.date.valueOf()))
                    );
                    $(sanitize("#" + eDate)).datepicker("setStartDate", startDate);
                }
            });

        $(sanitize("#" + sDate)).datepicker("setEndDate", FromEndDate);
        $(sanitize("#" + eDate))
            .datepicker({
                language: "es",
                weekStart: 1,
                startDate: startDate,
                endDate: FromEndDate,
                maxDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                format: "yyyy/mm/dd",
                setDate: new Date(),
                daysOfWeekDisabled: [0, 6],
                showClear: true
            }).on("changeDate", function (selected) {
                if (selected.date) {
                }
            });
        $(sanitize("#" + eDate)).datepicker("setStartDate", startDate);
    };
    $scope.customDateRangePicker("DateADFStateDetail", "ClearingEndDate");


    //consolidatedTableByStateDETAIL
    $scope.SetCTByStateDETAIL = function () {
        $scope.ConsolidatedByStateDETAIL = [
            {
                "label": "ADFQueryConsolidatedByState.SelectAll",
                "fieldName": "SelectAll",
                "visible": true,
                "searchVisible": true,
                "type": "checkbox"
            },
            {
                "label": "ADFQueryConsolidatedByState.State",
                "fieldName": "State",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.ID",
                "fieldName": "Id",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.NumberOfSchedule",
                "fieldName": "NumberOfSchedule",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.CUS",
                "fieldName": "CUS",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.AuthorizingEntity",
                "fieldName": "AuthorizingEntity",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.TransactionValue",
                "fieldName": "TransactionValue",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.CycleGenerated",
                "fieldName": "CycleGenerated",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.TransactionDate",
                "fieldName": "TransactionDate",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.DateApplied",
                "fieldName": "DateApplied",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.OperatorCodeInformation",
                "fieldName": "OperatorCodeInformation",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.DateGenerated",
                "fieldName": "DateGenerated",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.OperatorNameInformation",
                "fieldName": "OperatorNameInformation",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.NitOperadorInformation",
                "fieldName": "NITOperatorInformation",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.CauseRejection",
                "fieldName": "CauseRejection",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.ReturnedA",
                "fieldName": "ReturnedA",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.CauseReturn",
                "fieldName": "CauseReturn",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "ADFQueryConsolidatedByState.UserReturn",
                "fieldName": "UserReturn",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }
        ]
    }
    $scope.SetCTByStateDETAIL();

    // Declaración de variables globales
    var selectedData = [];

    // Selection of records
    $scope.selectAll = function (array, booleanSelectAllVal) {
        angular.forEach(array, function (dataVal) {
            dataVal.select = booleanSelectAllVal && $scope.notAllowedState.indexOf(dataVal.State) == -1 ? true : false;
        });
    };

    $scope.checkboxRowSelect = function (array, selectOne) {
        $scope.checkboxModel.selectAll = array.every(
            function (arrVal) {
                return arrVal.select;
            }
        );
    };

    $scope.checkValidation = function (array) {
        var validation = array.some(function (arrVal) {
            return arrVal.select;
        });

        if (validation) {
            // Al menos un registro está seleccionado, remover la clase 'disabled-button' de los botones
            document.getElementById('ReturnEntityOIButton').classList.remove('disabled-button');
            document.getElementById('ReturnSebraOIAccountButton').classList.remove('disabled-button');
            document.getElementById('ReturnToTheContributorButton').classList.remove('disabled-button');
            document.getElementById('DoNotReturnToTheContributorButton').classList.remove('disabled-button');
        } else {
            // Ningún registro está seleccionado, agregar la clase 'disabled-button' a los botones
            document.getElementById('ReturnEntityOIButton').classList.add('disabled-button');
            document.getElementById('ReturnSebraOIAccountButton').classList.add('disabled-button');
            document.getElementById('ReturnToTheContributorButton').classList.add('disabled-button');
            document.getElementById('DoNotReturnToTheContributorButton').classList.add('disabled-button');
        }

        return !validation;
    };
    // Popups
    //<--ReturnEntity-->
    $scope.showPopupReturnEntity = function () {
        $scope.popupReturnEntity = true;
    }
    
    $scope.saveDataReturnEntity = function (data) {
        let selectedData1 = [];
        angular.forEach(data, function (dataVal) {
            dataVal.select
            if (dataVal.select) {
                selectedData1.push(dataVal);
            }
        });
        // Lógica para guardar los datos en la base de datos

        var dataReturnEntity = {
            "Date": $scope.ConsolidatedByStateDetailData.date,
            "InformationOperator": $scope.ConsolidatedByStateDetailData.informationOperator,
            "All": selectedData1,
            "ReturnButtonAction": "ReturnEntityOIButton",
            "ADFstatus": $scope.ConsolidatedByStateDetailData.status,
            "ReasonForReturn": $scope.causalReturnEntity,
            "SebraAccount": null,
            "PortFolio": null,
            "CUS": $scope.ConsolidatedByStateDetailData.cusId
        };

        $http.post(BASEURL + '/rest/v2/ach/returnCUS', dataReturnEntity).then(function onSuccess(response) {
            $scope.popupReturnEntity = false;

            //Alerts success
            $scope.alerts = [{
                type: 'success',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentSuccessfully')
            }];
            setTimeout(function () {
                $('.alert-success').hide();
            }, 3000)
        }).catch(function onError(response) {

            //Alerts danger
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentFailed')
            }];
            
            setTimeout(function () {
                $('.alert-danger').hide()
            }, 2000);
            $scope.popupReturnEntity = false;
        });
    };

    $scope.cancelReturnEntity = function () {
        $scope.popupReturnEntity = false;
    };
    //<--ReturnEntity End-->

    //<--ReturnSebraOIAccount-->
    $scope.showReturnSebraOIAccount = function () {
        $scope.popupReturnSebraOIAccount = true;
    }

    $scope.saveDataReturnSebraOIAccount = function (data) {
        let selectedData1 = [];
        angular.forEach(data, function (dataVal) {
            dataVal.select
            if (dataVal.select) {
                selectedData1.push(dataVal);
            }
        });

        // Lógica para guardar los datos en la base de datos    
        var dataReturnSebraOIAccount = {
            "Date": $scope.ConsolidatedByStateDetailData.date, // Date of the search engine 
            "InformationOperator": $scope.ConsolidatedByStateDetailData.informationOperator, // 
            "All": selectedData1,
            "ReturnButtonAction": "ReturnSebraOIAccountButton",
            "ADFstatus": $scope.ConsolidatedByStateDetailData.status,
            "ReasonForReturn": $scope.causalReturnSebraOIAccount,
            "SebraAccount": "",
            "PortFolio": null,
            "CUS": $scope.ConsolidatedByStateDetailData.cusId,
        }

        $http.post(BASEURL + '/rest/v2/ach/returnCUS', dataReturnSebraOIAccount).then(function onSuccess(response) {
            
            $scope.popupReturnSebraOIAccount = false;
            //Alerts success
            $scope.alerts = [{
                type: 'success',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentSuccessfully')
            }];
            setTimeout(function () {
                $('.alert-success').hide();
            }, 3000)
        }).catch(function onError(response) {
            //Alerts danger
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentFailed')
            }];
            setTimeout(function () {
                $('.alert-danger').hide()
            }, 2000)
            $scope.popupReturnSebraOIAccount = false;
        });
    }

    $scope.cancelReturnSebraOIAccount = function () {
        $scope.popupReturnSebraOIAccount = false;
    }
    //<--ReturnSebraOIAccount End-->
    //<--Return to the contributor-->
    $scope.showPopupReturnToTheContributor = function () {
        $scope.popupReturnToTheContributor = true;
        $scope.causalReturnToTheContributor = "Devolución Pago Seguridad Social; Estos valores Presentaron inconsistencias, razón por la cual solicitamos devolver el dinero al Aportante.";
    }

    $scope.saveDataReturnToTheContributor = function (data) {
        let selectedData1 = [];
        angular.forEach(data, function (dataVal) {
            dataVal.select
            if (dataVal.select) {
                selectedData1.push(dataVal);
            }
        });

        // Lógica para guardar los datos en la base de datos
        var dataReturnToTheContributor = {
            "Date": $scope.ConsolidatedByStateDetailData.date, // Date of the search engine 
            "InformationOperator": $scope.ConsolidatedByStateDetailData.informationOperator, // 
            "All": selectedData1,
            "ReturnButtonAction": "ReturnToTheContributorButton",
            "ADFstatus": $scope.ConsolidatedByStateDetailData.status,
            "ReasonForReturn": $scope.causalReturnToTheContributor,
            "SebraAccount": "Cuenta Sebra OI",
            "PortFolio": null,
            "CUS": $scope.ConsolidatedByStateDetailData.cusId
        }

        $http.post(BASEURL + '/rest/v2/ach/returnCUS', dataReturnToTheContributor).then(function onSuccess(response) {

            //Alerts success
            $scope.alerts = [{
                type: 'success',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentSuccessfully')
            }];

            setTimeout(function () {
                $('.alert-success').hide();
            }, 3000);

            $scope.popupReturnToTheContributor = false;
        }).catch(function onError(response) {
            //Alerts danger
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentFailed')
            }];

            setTimeout(function () {
                $('.alert-danger').hide()
            }, 2000);

            $scope.popupReturnToTheContributor = false;
        });
    }

    $scope.cancelReturnToTheContributor = function () {
        $scope.popupReturnToTheContributor = false;
    }
    //<--Return to the contributor End-->

    //<!-- Do not return to the contributor -->
    $scope.showPopupDoNotReturnToTheContributor = function () {
        $scope.popupDoNotReturnToTheContributor = true;
        $scope.causalDoNotReturnToTheContributor = "Devolución Pago Especial estos valores se dispersaron a través de otras planillas, razón por la cual solicitamos NO devolver al Aportante.";
    }

    $scope.saveDataDoNotReturnToTheContributor = function (data) {
        let selectedData1 = [];
        angular.forEach(data, function (dataVal) {
            dataVal.select
            if (dataVal.select) {
                selectedData1.push(dataVal);
            }
        });

        // Lógica para guardar los datos en la base de datos
        var dataDoNotReturnToTheContributor = {
            "Date": $scope.ConsolidatedByStateDetailData.date, // Date of the search engine 
            "InformationOperator": $scope.ConsolidatedByStateDetailData.informationOperator, // 
            "All": selectedData1,
            "ReturnButtonAction": "DoNotReturnToTheContributorButton",
            "ADFstatus": $scope.ConsolidatedByStateDetailData.status,
            "ReasonForReturn": $scope.causalDoNotReturnToTheContributor,
            "SebraAccount": "Cuenta Sebra OI",
            "PortFolio": null,
            "CUS": $scope.ConsolidatedByStateDetailData.cusId
        }

        $http.post(BASEURL + '/rest/v2/ach/returnCUS', dataDoNotReturnToTheContributor).then(function onSuccess(response) {

            //Alerts success
            $scope.alerts = [{
                type: 'success',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentSuccessfully')
            }];

            setTimeout(function () {
                $('.alert-success').hide();
            }, 3000);
            $scope.popupDoNotReturnToTheContributor = false;
        }).catch(function onError(response) {
            //Alerts danger
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('ADFQueryConsolidatedByState.PopupMessageSentFailed')
            }];

            setTimeout(function () {
                $('.alert-danger').hide()
            }, 2000);
            $scope.popupDoNotReturnToTheContributor = false;
        });
    }

    $scope.cancelDoNotReturnToTheContributor = function () {
        $scope.popupDoNotReturnToTheContributor = false;
    }
    //<!-- Do not return to the contributor End-->

    // Popups Ends

    //API's
    //Operator Information
    var authenticationObject = $rootScope.dynamicAuthObj;
    $timeout(function () {
        $scope.ioLimits = 20;
        let ioValue = $scope.ConsolidatedByStateDetailData.InformationOperator;
        let elemSelector = angular.element(angular.element($document).find('.select2DropdownInformationOperator')[angular.element($document).find('.select2DropdownInformationOperator').length - 1]);
        elemSelector.select2({
            ajax: {
                url: function (params) {
                    return BASEURL + '/rest/v2/ach/report/pseassistedtransactionquery/getQueryOPINFO';
                },
                method: "GET",
                headers: authenticationObject,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                delay: 250,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Cookie', sanitizeCookie(document.cookie)),
                    xhr.withCrendentials = true
                },
                crossDomain: true,
                data: function (params) {
                    var query = {
                        // start: params.page * $scope.ioLimits ? params.page * $scope.ioLimits : 0,
                        // count: $scope.ioLimits
                    }

                    if (params.term) {
                        query = {
                            search: params.term,
                            // start: params.page * $scope.ioLimits ? params.page * $scope.ioLimits : 0,
                            // count: $scope.ioLimits
                        };
                    }

                    return query;
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    var myarr = [];
                    if (params.page == 1) {
                        $scope.myIA2Data = [];
                    }
                    if (params.term) {
                        for (j in data) {
                            if (data[j].PartyName.toUpperCase().includes(params.term.toUpperCase())) {
                                myarr.push({
                                    'id': data[j].PartyCode,
                                    'text': data[j].PartyName
                                })
                                // $scope.myIA2Data.push(data[j]);                                    
                            }
                        }
                    } else {
                        for (j in data) {
                            myarr.push({
                                'id': data[j].PartyCode,
                                'text': data[j].PartyName
                            })
                            // $scope.myIA2Data.push(data[j]);                                    
                        }
                    }

                    return {
                        results: myarr,
                        // pagination: {
                        //     more: data.length >= $scope.ioLimits
                        // }
                    };
                },
                cache: true
            },
            placeholder: 'Todas',
            minimumInputLength: 0,
            allowClear: true,
            // minimumResultsForSearch: Infinity
        })

        // Set the value, creating a new option if necessary
        if (elemSelector.find("option[value='" + ioValue + "']").length) {
            elemSelector.val(ioValue).trigger('change'); // Change the value or make some change to the internal state and Notify only Select2 of changes
        } else {
            // Create a DOM Option and pre-select by default
            var newOption = new Option(ioValue, ioValue, true, true);
            // Append it to the select
            elemSelector.append(newOption).trigger('change');
        }

        if (ioValue == undefined || ioValue == '') {
            elemSelector.val('').trigger('change');
        }
    }, 500);

    function GetConsADFByStateData(page, limit, data) {
        $scope.isLoading = true;

        let obj = {
            'start': (page - 1) * limit,
            'count': limit,
            // sorts: []
        };
        obj = { ...data, ...obj };

        // if ($scope.searchValue) {
        //     obj.Queryfield = [{
        //         "ColumnName": "reportId",
        //         "ColumnOperation": "=",
        //         "ColumnValue": $scope.searchValue
        //     }]
        // }

        /** Sorting data */
        // obj.QueryOrder = [{
        //     "ColumnName": "generatedDate",
        //     "ColumnOrder": "Desc"
        // }];

        // obj = constructQuery(obj)
        obj = cleantheinputdata(obj);
        if ($scope.ConsolidatedByStateDetailData.date != null) {
            $http.post(BASEURL + "/rest/v2/ach/psequeryconsolidated", obj).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers();
                var config = response.config;

                $scope.consADFByStates = $scope.consADFByStates.concat(data);
                $scope.totalReportCount = headers.totalcount;
                $scope.TotalCount = $scope.consADFByStates.length;
                $scope.isLoading = false;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                // $scope.alerts = [{
                //     type: 'danger',
                //     msg: data.error.message
                // }]

                $scope.isLoading = false;
                $scope.alerts = [{
                    type: 'danger',
                    msg: $filter('translate')('ADFQueryConsolidatedByState.MessageWhenQueryRecordsNotFound')
                }];
                setTimeout(function () {
                    $('.alert-danger').hide()
                }, 2000)
            });
        }
    }

    //
    $scope.loadMore = function (data) {
        if ($scope.CurrentPage * $scope.CurrentLimit <= $scope.TotalCount) {
            $scope.CurrentPage += 1;
            GetConsADFByStateData($scope.CurrentPage, $scope.CurrentLimit, data);
        } else if ($scope.CurrentPage == 1 && $scope.TotalCount == 0) {
            GetConsADFByStateData($scope.CurrentPage, $scope.CurrentLimit, data);
        }
    }

    //Query Function
    $scope.searchConsolidatedByState = function (filterVal) {
        $scope.CurrentPage = 1;
        $scope.CurrentLimit = 20;
        $scope.TotalCount = 0;
        $scope.totalReportCount = 0;
        $scope.consADFByStates = [];
        $scope.quickSearch = undefined;
        $scope.checkboxModel = {
            selectAll: false
        };
        $scope.loadMore(filterVal);
    }

    $scope.refresh = function (filterVal) {
        $scope.CurrentPage = 1;
        $scope.CurrentLimit = 20;
        $scope.TotalCount = 0;
        $scope.totalReportCount = 0;
        $scope.consADFByStates = []; // import
        $scope.quickSearch = undefined;
        $scope.checkboxModel = {
            selectAll: false
        };
        $scope.loadMore(filterVal);
    }

    $scope.checkStatus = function (data) {
        return $scope.notAllowedState.indexOf(data.State) != -1 ? true : false;
    }

    $scope.exportToExcelFlist = function (eve) {

        if ($("input[name=excelVal][value='txt']").prop("checked") || $("input[name=excelVal][value='csv']").prop("checked") || $("input[name=excelVal][value='pdf']").prop("checked") || $("input[name=excelVal][value='xls']").prop("checked")) {

            if ($("input[name=excelVal][value='txt']").prop("checked")) {
                var url = "/rest/v2/ach/psequeryconsolidated/TXT"
            } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                var url = "/rest/v2/ach/psequeryconsolidated/CSV"
            } else if ($("input[name=excelVal][value='pdf']").prop("checked")) {
                var url = "/rest/v2/ach/psequeryconsolidated/PDF"
            } else if ($("input[name=excelVal][value='xls']").prop("checked")) {
                var url = "/rest/v2/ach/psequeryconsolidated/XLS"
            }

            let objDownload = {
                'start': Number(0),
                'count': Number($scope.totalReportCount),
                // sorts: []
            };
            objDownload = { ...$scope.ConsolidatedByStateDetailData, ...objDownload };
            objDownload = cleantheinputdata(objDownload);
            $http.post(BASEURL + url, objDownload).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (response.data['FileName']) {
                    response.data['filename'] = response.data['FileName']
                }
                $scope.Details = 'data:application/octet-stream;base64,' + data['Data'];
                var dlnk = document.getElementById('dwnldLnkADFByState');
                dlnk.href = $scope.Details;

                if ($("input[name=excelVal][value='txt']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'ConsolidatedAdfQueryByState_report.txt';
                    }
                } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'ConsolidatedAdfQueryByState_report.csv';
                    }
                } else if ($("input[name=excelVal][value='pdf']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'ConsolidatedAdfQueryByState_report.pdf';
                    }
                } else if ($("input[name=excelVal][value='xls']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'ConsolidatedAdfQueryByState_report.xls';
                    }
                } else {
                    dlnk.download = data['filename'];
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
        }
    }

    //Change the size of the text in the button DoNotReturnToTheContributorButton
    const DoNotReturnToTheContributorButton = document.querySelector('#DoNotReturnToTheContributorButton');

    $scope.$on('langChangeEvent', function () {
        if (multilingualSearchData && multilingualSearchData.multilingualenable) {
            $rootScope.languageselected_ = sessionStorage.sessionlang;
            if (sessionStorage.sessionlang == 'en_US') {
                DoNotReturnToTheContributorButton.classList.add('DoNotReturnToTheContributorButton');
            } else if (sessionStorage.sessionlang == 'es_ES') {
                DoNotReturnToTheContributorButton.classList.remove('DoNotReturnToTheContributorButton');
            }
        }
    });
    //Change the size of the text in the button DoNotReturnToTheContributorButton END

});