angular.module('VolpayApp').controller('PSEAssistedTransactionQueryCtrl', function ($scope, $rootScope, $document, $timeout, $http, $filter) {

    var authenticationObject = $rootScope.dynamicAuthObj;
    $scope.field = {
        "type": "MonthAndYearOnly"
    }
    $scope.fieldDate = {
        "type": "DateOnly"
    }

    //Active picker
    $scope.activatePicker = function () {
        var prev = null;
        var FromEndDate = new Date();
        $('.datepicker1').datepicker({
            endDate: FromEndDate,
            format: "yyyy",
            viewMode: "years",
            minViewMode: "years",
            autoclose: true,
            changeYear: true
        });
    }
    $scope.activatePicker();

    //Date
    $scope.customDateRangePicker = function (sDate, eDate) {
        var startDate = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);
        $(sanitize('#' + sDate)).datepicker({
            language: "es",
            weekStart: 1,
            startDate: '1900-01-01',
            minDate: 1,
            endDate: FromEndDate,
            autoclose: true,
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            setDate: new Date(),
            daysOfWeekDisabled: [0, 6]
        }).on('changeDate', function (selected) {
            if (selected.date) {
                startDate = new Date(selected.date.valueOf());
                startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
            }
        });

        $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
        $(sanitize('#' + eDate)).datepicker({
            language: "es",
            weekStart: 1,
            startDate: startDate,
            endDate: FromEndDate,
            maxDate: new Date(),
            autoclose: true,
            todayHighlight: true,
            format: 'yyyy/mm/dd',
            setDate: new Date(),
            daysOfWeekDisabled: [0, 6]
        }).on('changeDate', function (selected) {

            if (selected.date) {
                //   FromEndDate = new Date(selected.date.valueOf());
                //   FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
                //   $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
            }

        });
        $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
        /*$('#'+eDate).on('keyup',function(){
        if(!$(this).val()){
        $(sanitize('#' + sDate)).datepicker('setEndDate', new Date());
        }
        })*/
    }
    $scope.customDateRangePicker('ClearingDate', 'ClearingEndDate');

    //dateYearMonthPicker
    $("#dateYearMonthPicker").datepicker( {
        language: "es",
        format: "mm/yyyy",
        startView: "months", 
        minViewMode: "months"
    });

    //Operator 
    angular.element(function () {
        $scope.remoteDataConfig = function () {
            $(".select2Dropdown").each(function () {
                $(this).select2({
                    ajax: {
                        url: function (params) {
                            if (
                                $(this).attr("name") == "InformationOperator" ||
                                $(this).attr("name") == "EntityoftheTransaction"
                            ) {
                                $scope.links = BASEURL + "";
                                $scope.debtorList = false;
                                $scope.entityList = true;
                            }

                            if ($scope.links) {
                                return $scope.links;
                            }
                        },
                        type: add_method,
                        headers: $scope.authenticationObject,
                        dataType: "json",
                        delay: 250,
                        xhrFields: {
                            withCredentials: true,
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader(
                                "Cookie",
                                sanitizeCookie(document.cookie)
                            ),
                                (xhr.withCredentials = true),
                                xhr.setRequestHeader(
                                    "languageselected",
                                    sessionStorage.sessionlang
                                );
                        },
                        crossDomain: true,
                        data: function (params) {
                            var query = {
                                // start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                // count: pageLimitCount
                            };

                            if ($scope.entityList) {
                                if (params.term) {
                                    query = {
                                        search: params.term,
                                        // start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                        // count: pageLimitCount,
                                        userID: sessionStorage.UserID,
                                        debtorlist: $scope.debtorList,
                                    };
                                } else {
                                    query = {
                                        // start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                        // count: pageLimitCount,
                                        userID: sessionStorage.UserID,
                                        debtorlist: $scope.debtorList,
                                    };
                                }
                            } else {
                                if (params.term) {
                                    query = {
                                        search: params.term,
                                        // start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                        // count: pageLimitCount
                                    };
                                } else {
                                    query = {
                                        // start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                        // count: pageLimitCount
                                    };
                                }
                            }

                            if (
                                $scope.links.indexOf("start") != -1 &&
                                $scope.links.indexOf("count") != -1
                            ) {
                                query = JSON.stringify({});
                            }

                            return query;
                        },
                        processResults: function (data, params) {
                            params.page = params.page ? params.page : 0;
                            var myarr = [];
                            for (j in data) {
                                if ($scope.showmode == 1) {
                                    myarr.push({
                                        id: data[j].code,
                                        text: data[j].displayValue,
                                    });
                                } else {
                                    myarr.push({
                                        id: data[j].code,
                                        text: data[j].displayvalue + "-" + data[j].code,
                                    });
                                }
                            }
                            return {
                                results: myarr,
                                pagination: {
                                    more: data.length >= pageLimitCount,
                                },
                            };
                        },
                        cache: true,
                    },
                    placeholder: ValidationPleaseHolder($(this).attr("name")),
                    minimumInputLength: 0,
                    allowClear: true,

                })
            });
        }

        $timeout(function () {
            $scope.ioLimits = 20;
            let ioValue = $scope.PSEAssistedTransactionQueryData.InformationOperator;
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
                        if(params.term){
                            for (j in data) {
                                if(data[j].PartyName.toUpperCase().includes(params.term.toUpperCase())){
                                    myarr.push({
                                        'id': data[j].PartyCode,
                                        'text': data[j].PartyName
                                    })
                                    // $scope.myIA2Data.push(data[j]);                                    
                                }                                
                            }
                        }
                        else{
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

        $timeout(function () {
            $scope.limits = 20;
            let val = $scope.PSEAssistedTransactionQueryData.EntityoftheTransaction;
            let elemSelector = angular.element(angular.element($document).find('.select2DropdownEntityoftheTransaction')[angular.element($document).find('.select2DropdownEntityoftheTransaction').length - 1]);
            elemSelector.select2({
                ajax: {
                    url: function (params) {
                        return BASEURL + '/rest/v2/ach/report/pseassistedtransactionquery/getQueryBANCO';
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
                            // start: params.page * $scope.limits ? params.page * $scope.limits : 0,
                            // count: $scope.limits
                        }
    
                        if (params.term) {
                            query = {
                                search: params.term,
                                // start: params.page * $scope.limits ? params.page * $scope.limits : 0,
                                // count: $scope.limits
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
                        if(params.term){
                            for (j in data) {
                                if(data[j].PartyName.toUpperCase().includes(params.term.toUpperCase())){
                                    myarr.push({
                                        'id': data[j].PartyExternalIdentifier,
                                        'text': data[j].PartyName
                                    })
                                    $scope.myIA2Data.push(data[j]);                                 
                                }                                
                            }
                        }
                        else{
                            for (j in data) {
                                myarr.push({
                                    'id': data[j].PartyExternalIdentifier,
                                    'text': data[j].PartyName
                                })
                                $scope.myIA2Data.push(data[j]);
                            }

                        }
                        return {
                            results: myarr,
                            // pagination: {
                            //     more: data.length >= $scope.limits
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
            if (elemSelector.find("option[value='" + val + "']").length) {
                elemSelector.val(val).trigger('change'); // Change the value or make some change to the internal state and Notify only Select2 of changes
            } else {
                // Create a DOM Option and pre-select by default
                var newOption = new Option(val, val, true, true);
                // Append it to the select
                elemSelector.append(newOption).trigger('change');
            }

            if (val == undefined || val == '') {
                elemSelector.val('').trigger('change');
            }
        }, 500);
    });

    //Format 
    $scope.initFormat = function () {
        $scope.formats = [
            {
                actualValue: "CSV",
                displayValue: "CSV",
            },
            {
                actualValue: "TXT",
                displayValue: "TXT",
            },
            {
                actualValue: "PDF",
                displayValue: "PDF",
            },
            {
                actualValue: "EXCEL",
                displayValue: "EXCEL",
            },
        ];

        //$scope.PSEAssistedTransactionQueryData.PeriodSettled = new Date(inst.selectedYear, inst.selectedMonth, 1);
        
        $scope.PSEAssistedTransactionQueryData = {};
        $scope.PSEAssistedTransactionQueryData.FormatToExporttheFile = $scope.formats[0].actualValue;
        //$scope.authenticationObject = $rootScope.dynamicAuthObj;
        // // $('select[name=SourceEntityoftheTransaction]').empty().val(null).trigger("change");
        // // $('select[name=DestinationEntityoftheTransaction]').empty().val(null).trigger("change");
    };
    $scope.initFormat();
    
    



    $timeout(function () {
        $scope.limits = 20;
        let val = $scope.PSEAssistedTransactionQueryData.EntityoftheTransaction;
        let elemSelector = angular.element(angular.element($document).find('.select2DropdownEntityoftheTransaction')[angular.element($document).find('.select2DropdownEntityoftheTransaction').length - 1]);
        elemSelector.select2({
            ajax: {
                url: function (params) {
                    return BASEURL + '/rest/v2/ach/report/custom/getbanks';
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
                        start: params.page * $scope.limits ? params.page * $scope.limits : 0,
                        count: $scope.limits
                    }

                    if (params.term) {
                        query = {
                            search: params.term,
                            start: params.page * $scope.limits ? params.page * $scope.limits : 0,
                            count: $scope.limits
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
                    for (j in data) {
                        myarr.push({
                            'id': data[j].actualvalue,
                            'text': data[j].displayvalue
                        })
                        $scope.myIA2Data.push(data[j]);
                    }
                    return {
                        results: myarr,
                        pagination: {
                            more: data.length >= $scope.limits
                        }
                    };
                },
                cache: true
            },
            placeholder: '--Select--',
            minimumInputLength: 0,
            allowClear: true,
            minimumResultsForSearch: Infinity
        })

        // Set the value, creating a new option if necessary
        if (elemSelector.find("option[value='" + val + "']").length) {
            elemSelector.val(val).trigger('change'); // Change the value or make some change to the internal state and Notify only Select2 of changes
        } else {
            // Create a DOM Option and pre-select by default
            var newOption = new Option(val, val, true, true);
            // Append it to the select
            elemSelector.append(newOption).trigger('change');
        }
        if (val == undefined || val == '') {
            elemSelector.val('').trigger('change');
        }
    }, 500);

    // Clear form inputs
    $scope.cleantheinputdata = function (argu) {
            for (var k in argu) {
            if ($.isPlainObject(argu[k])) {
                var isEmptyObj = $scope.cleantheinputdata(argu[k]);
                if ($.isEmptyObject(isEmptyObj)) {
                delete argu[k];
                } else {
                for (var l in argu[k]) {
                    if ($.isPlainObject(argu[k][l])) {
                    }
                }
                }
            } else if (Array.isArray(argu[k])) {
                for (var n in argu[k]) {
                var isEmptyObj1 = $scope.cleantheinputdata(argu[k][n]);
                if ($.isEmptyObject(isEmptyObj1)) {
                    argu[k].splice(n, 1);
                } else if (isEmptyObj1.$$hashKey) {
                    delete isEmptyObj1.$$hashKey;
                }
                }
                if (argu[k].length) {
                var _val_ = true;
                for (var j in argu[k]) {
                    if ($.isPlainObject(argu[k][j])) {
                    _val_ = false;
                    }
                }
                if (_val_) {
                    argu[k] = argu[k].toString();
                } else {
                }
                } else {
                delete argu[k];
                }
            } else if (
                argu[k] === "" ||
                argu[k] === undefined ||
                argu[k] === null
            ) {
                delete argu[k];
            } else {
                argu[k] = argu[k];
            }
            }
            return argu;
    };


    
    // Received Transaction RequestTo PSEATQ

    $scope.PSEAssistedTransactionQuery = function(payload){
        if(!angular.equals({}, payload)){
            $scope.backupNewData = $scope.cleantheinputdata(payload);
        }
        if($scope.backupNewData.FormatToExporttheFile.toUpperCase() == "TXT" ||
            $scope.backupNewData.FormatToExporttheFile.toUpperCase() == "CSV"){
                $http.post(
                    BASEURL + "/rest/v2/ach/report/pseassistedtransactionquery/txt",
                    $scope.backupNewData
                ).then(function onSuccess(response){
                    var data = response.data;
                $scope.dat = data.Data;

                var data = response.data;

                if ($scope.backupNewData.FormatToExporttheFile.toUpperCase() == "CSV") {
                    var res = atob(data.Data);
                    var universalBOM = "\uFEFF";
                    $scope.Details =
                    "data:text/csv; charset=utf-8," +
                    encodeURIComponent(universalBOM + res);
                } else {
                    $scope.Details =
                    "data:application/octet-stream;base64," + $scope.dat;
                }

                var dlnk = document.getElementById("downloadLinkPSE");
                dlnk.href = $scope.Details;
                dlnk.download = data.FileName;

                if ($scope.backupNewData.FormatToExporttheFile.toUpperCase() == "TXT") {
                    dlnk.download = dlnk.download + ".txt";
                }
                if ($scope.backupNewData.FormatToExporttheFile.toUpperCase() == "CSV") {
                    dlnk.download = dlnk.download + ".csv";
                }

                dlnk.click();
                $scope.alerts = [
                    {
                        type: "success",
                        msg: $filter("translate")("Inbox.DownloadedSuccessfully"),
                    },
                ];
                }).catch(function onError(response){
                    var data = response.data;

                $scope.alerts = [
                    {
                    type: "danger",
                    msg: data.error.message,
                    },
                ];

                $timeout(function () {
                    $(".alert-danger").hide();
                }, 5000);
                });
            } else if($scope.backupNewData.FormatToExporttheFile.toUpperCase() == "EXCEL"){
                $http.post(
                    BASEURL + "/rest/v2/ach/report/pseassistedtransactionquery/xls",
                    $scope.backupNewData
                ).then(function onSuccess(response) {
                    var data = response.data;
                $scope.dat = data.Data;

                var data = response.data;

                $scope.Details =
                    "data:application/octet-stream;base64," + $scope.dat;

                var dlnk = document.getElementById("downloadLinkPSE");
                dlnk.href = $scope.Details;
                dlnk.download = data.FileName;
                dlnk.click();
                $scope.alerts = [
                    {
                    type: "success",
                    msg: $filter("translate")("Inbox.DownloadedSuccessfully"),
                    },
                ];
                }).catch(function onError(response){
                    // Handle error
                var data = response.data;

                $scope.alerts = [
                    {
                    type: "danger",
                    msg: data.error.message,
                    },
                ];

                $timeout(function () {
                    $(".alert-danger").hide();
                }, 5000);
                });
            } else if($scope.backupNewData.FormatToExporttheFile.toUpperCase() == "PDF"){
                $http.post(
                    BASEURL + "/rest/v2/ach/report/pseassistedtransactionquery/pdf",
                    $scope.backupNewData
                ).then(function onSuccess(response){
                    var data = response.data;
                    $scope.dat = data.Data;
                    var data = response.data;
                    $scope.Details =
                    "data:application/octet-stream;base64," + $scope.dat;
                    var dlnk = document.getElementById("downloadLinkPSE");
                    dlnk.href = $scope.Details;
                    dlnk.download = data.FileName;

                    dlnk.click();
                    $scope.alerts = [
                    {
                        type: "success",
                        msg: $filter("translate")("Inbox.DownloadedSuccessfully"),
                    },
                ];
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    $scope.alerts = [
                    {
                        type: "danger",
                        msg: data.error.message,
                    },
                    ];
                    $timeout(function () {
                        $(".alert-danger").hide();
                    }, 5000);
                });
            }
    }

});