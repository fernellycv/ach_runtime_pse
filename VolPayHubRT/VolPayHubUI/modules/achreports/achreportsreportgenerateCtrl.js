angular.module('VolpayApp').controller('achreportsreportgenerateCtrl', function ($scope, $http, $state, $location, $stateParams, $timeout, GlobalService, LogoutService, $filter, $rootScope, errorservice) {
    $scope.selected1 = false;
    $scope.selected2 = false;
    var authenticationObject = $rootScope.dynamicAuthObj;
    $('.select2-dropdown').css('display', 'none');
    $scope.madeChanges = false;
    $rootScope.$on("MyEvent", function (evt, data) {
        $("#changesLostModal").modal("show");
    })
    $scope.reportDaily = {}
    $scope.reportStacked = {}
    $scope.check = {}
    $scope.reportBatchDescription = {}
    $scope.reportFormat = ''

    $scope.collapseAll = function () {
        $scope.isPaymentDetailsCollapsed = true;
        $scope.isOrderingCustomerCollapsed = true;
        $scope.isBenenficiaryBankDetailsCollapsed = true;
        $scope.isBenenficiaryDetailsCollapsed = true;
        $scope.isPaymentInfoCollapsed = true;
        $scope.isRemittanceDetailsCollapsed = true;
        $scope.isUltimateDebtorCollapsed = true;
        $scope.isUltimateCreditorCollapsed = true;
        $scope.SaveTemplateCollapsed = true;
        $scope.activatePicker();
    }
    
    $scope.expandAll = function () {
        $scope.isPaymentDetailsCollapsed = false;
        $scope.isOrderingCustomerCollapsed = false;
        $scope.isBenenficiaryBankDetailsCollapsed = false;
        $scope.isBenenficiaryDetailsCollapsed = false;
        $scope.isPaymentInfoCollapsed = false;
        $scope.isRemittanceInformationCollapsed = false;
        $scope.isUltimateDebtorCollapsed = false;
        $scope.isUltimateCreditorCollapsed = false;
        $scope.SaveTemplateCollapsed = false;
        $scope.activatePicker();
    }

    $scope.expandAllManually = function () {
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

    $scope.Reload = function () {

        $scope.reportDaily = {}
        $scope.reportStacked = {}
        $scope.reportOutputFiles = {}
        $scope.totalobj = {}
        $scope.reportBatchDescription = {}
        $scope.reportFormat = {}
        $scope.PaymentDetails = {}
        $scope.PmntInitnForm = {}
        $scope.RmtDtls = {}
        $scope.BnfDtls = {}
        $scope.BnfBkDtls = {}
        $scope.DbtrDtls = {}
        $scope.IntrmdtryBk = {}
        $scope.reloadreport($scope.TemplateName);
        $scope.TemplateName = ''

        $rootScope.dataModified = false
        // $state.reload();
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
        $scope.remoteDataConfig()
    }

    $scope.ReloadKeepValues = function () {

        var reportDaily = $scope.reportDaily;
        var totalobj = $scope.totalobj;
        var reportStacked = $scope.reportStacked;
        var reportOutputFiles = $scope.reportOutputFiles;
        var reportBatchDescription = $scope.reportBatchDescription;
        var reportFormat = $scope.reportFormat;

        $scope.reportDaily = {}
        $scope.reportStacked = {}
        $scope.reportOutputFiles = {}
        $scope.reportBatchDescription = {}
        $scope.totalobj = {}
        $scope.reportFormat = {}

        $scope.reportDaily = reportDaily
        $scope.reportStacked = reportStacked
        $scope.reportOutputFiles = reportOutputFiles
        $scope.reportBatchDescription = reportBatchDescription
        $scope.totalobj = totalobj
        $scope.reportFormat = reportFormat
    }

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

        // $('.DatePicker').datepicker({
        //     language: "es",
        //     format: "yyyy-mm-dd",
        //     showClear: false,
        //     autoclose: true,
        //     todayHighlight: true,


        // }).on('dp.change', function(ev) {
        //     $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        // }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});
    }

    $scope.activatePicker();
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
    // $scope.customDateRangePicker('EntryStartDate','EntryEndDate')
    $timeout(function () {
        $scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
        $scope.customDateRangePicker('DebitFxRateStart', 'DebitFxRateEnd')
        $scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
    }, 500)
    $scope.customDateRangePicker('startDate', 'endDate')
    $scope.customDateRangePicker('startDateArchivosDeSalida', 'endDateArchivosDeSalida')
    $scope.customDateRangePicker('reportBatchDescriptionstartDate', 'reportBatchDescriptionendDate')

    $scope.loadTemplate = function (val) {

        $http({
            url: BASEURL + '/rest/v2/standinginstructiontemplates/read',
            method: "POST",
            data: {
                TemplateName: val
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            $scope.PaymentDetails = data
            $scope.PmntInitnForm = $scope.PaymentDetails['PmntInitnForm']
            $scope.RmtDtls = $scope.PaymentDetails['PmntInitnForm']['RmtDtls'];
            $scope.BnfDtls = $scope.PaymentDetails['PmntInitnForm']['BnfDtls'];
            $scope.BnfBkDtls = $scope.PaymentDetails['PmntInitnForm']['BnfBkDtls'];
            $scope.DbtrDtls = $scope.PaymentDetails['PmntInitnForm']['DbtrDtls'];
            $scope.IntrmdtryBk = $scope.PaymentDetails['PmntInitnForm']['IntrmdtryBk'];

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
    }

    $scope.cleantheinputdata = function (argu) {
        for (var k in argu) {
            if ($.isPlainObject(argu[k])) {
                var isEmptyObj = $scope.cleantheinputdata(argu[k])
                if ($.isEmptyObject(isEmptyObj)) {
                    delete argu[k]
                } else {
                    for (var l in argu[k]) {
                        if ($.isPlainObject(argu[k][l])) {
                        }
                    }
                }
            } else if (Array.isArray(argu[k])) {

                for (var n in argu[k]) {
                    var isEmptyObj1 = $scope.cleantheinputdata(argu[k][n])
                    if ($.isEmptyObject(isEmptyObj1)) {
                        argu[k].splice(n, 1);
                    } else if (isEmptyObj1.$$hashKey) {
                        delete isEmptyObj1.$$hashKey
                    }
                }
                if (argu[k].length) {
                    var _val_ = true;
                    for (var j in argu[k]) {
                        if ($.isPlainObject(argu[k][j])) {
                            _val_ = false
                        }
                    }
                    if (_val_) {
                        argu[k] = argu[k].toString()
                    } else {

                    }
                } else {
                    delete argu[k]
                }
            } else if (argu[k] === "" || argu[k] === undefined || argu[k] === null) {
                delete argu[k]
            } else {

                argu[k] = argu[k]
            }
        }
        return argu
    }

    $scope.createData = function (reportDaily, TemplateName) {
        $scope.SaveTemplate = false;
        if (TemplateName == 'Diario') {
            if (!('creditorAgent' in reportDaily.reportDaily) || reportDaily.reportDaily.creditorAgent.length == 0) {
                reportDaily.reportDaily.creditorAgent = "TODOS";
            }
            if (!('debtorAgent' in reportDaily.reportDaily) || reportDaily.reportDaily.debtorAgent.length == 0) {
                if (sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") {
                    reportDaily.reportDaily.debtorAgent = "TODOS"; //$scope.FEntity.code
                } else {
                    reportDaily.reportDaily.debtorAgent = "TODOS";
                }
            }
            delete reportDaily.reportBatchDescription
            delete reportDaily.reportOutputFiles
            delete reportDaily.reportStacked
        } else if (TemplateName == 'Descripciondelote') {
            if (!('creditorAgent' in reportDaily.reportBatchDescription) || reportDaily.reportBatchDescription.creditorAgent.length == 0) {
                reportDaily.reportBatchDescription.creditorAgent = "TODOS";
            }
            if (!('debtorAgent' in reportDaily.reportBatchDescription) || reportDaily.reportBatchDescription.debtorAgent.length == 0) {
                if (sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") {
                    reportDaily.reportBatchDescription.debtorAgent = "TODOS"; //$scope.FEntity.code
                } else {
                    reportDaily.reportBatchDescription.debtorAgent = "TODOS";
                }
            }
            delete reportDaily.reportDaily
            delete reportDaily.reportOutputFiles
            delete reportDaily.reportStacked
        } else if (TemplateName == 'Archivosdesalida') {
            if (!('agent' in reportDaily.reportOutputFiles) || reportDaily.reportOutputFiles.agent.length == 0) {
                if (sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") {
                    reportDaily.reportOutputFiles.agent = "TODOS"; //$scope.FEntity.code
                } else {
                    reportDaily.reportOutputFiles.agent = "TODOS";
                }
            }
            delete reportDaily.reportDaily
            delete reportDaily.reportBatchDescription
            delete reportDaily.reportStacked
        } else if (TemplateName == 'Acumulado') {
            if (!('creditorAgent' in reportDaily.reportStacked) || reportDaily.reportStacked.creditorAgent.length == 0) {
                reportDaily.reportStacked.creditorAgent = "TODOS";
            }
            if (!('debtorAgent' in reportDaily.reportStacked) || reportDaily.reportStacked.debtorAgent.length == 0) {
                if (sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") {
                    reportDaily.reportStacked.debtorAgent = "TODOS"; //$scope.FEntity.code
                } else {
                    reportDaily.reportStacked.debtorAgent = "TODOS";
                }
            }
            delete reportDaily.reportDaily
            delete reportDaily.reportBatchDescription
            delete reportDaily.reportOutputFiles
        }

        $scope.backupNewData = $scope.cleantheinputdata(reportDaily);
        reportDaily = $scope.backupNewData;
        $http.post(BASEURL + '/rest/v2/ach/report/custom/generate', $scope.backupNewData).then(function onSuccess(response) {
            var data = response.data;
            $scope.dat = data.data

            /*--------------------------------------------------------------
            CHOOSING THE FILE FORMAT TO DOWNLOAD - TXT - XLS - PDF
            ---------------------------------------------------------------*/
            if ($scope.backupNewData.reportFormat == "TXT" || $scope.backupNewData.reportFormat == "Excel") {
                $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
                var dlnk = document.getElementById('dwnldLnk');
                dlnk.href = $scope.Details;
                dlnk.download = response.data['filename']

                dlnk.click();
                $scope.alerts = [{
                    type: 'success',
                    msg: data.message
                }];
            }

            if ($scope.backupNewData.reportFormat == "PDF") {
                /*--------------------------------------------------------------
                PDF
                ---------------------------------------------------------------*/
                var reportJSON = JSON.parse(response.data.JSON);
                const jsPDF = window.jspdf.jsPDF;
                var doc = new jsPDF();

                var PDFheaders = [];
                for (const item in reportJSON.Records[0]) {
                    PDFheaders.push(reportJSON.Records[0][item]);
                }
                var PDFdata = [];
                for (var i = 1; i < reportJSON.Records.length; i++) {
                    var PDFdatarow = [];
                    for (const item in reportJSON.Records[i]) {
                        PDFdatarow.push(reportJSON.Records[i][item]);
                    }
                    PDFdata.push(PDFdatarow);
                }

                doc.setFontSize(12)

                var base64Img;
                base64Img = "data:image/gif;base64,R0lGODdh0AITAfcAAABeoABerAxeoRleoRFeogBftCVeoDheoANnrA"
                    + "BivABmtTVtpyhxrkRfoE9foE97rk1wpWhhoGBopHZmo3x+pwBsxAV2yjl1w5FvoYd1pJp1o4RpoF"
                    + "6DsleEtU+Dt2SHtHWTu32ZvxmU3A+F1CmL0iye4Dqn5VKZ0HSn00aw6VW06mS36Xi960Wj2nbJ82"
                    + "zC8JiVj5mVk5qVm5mamqSVlaOZkKyakaWVnKuWlrSXlbyZk7GWmLCXj7ellaykmJyVo5qWrJmbqp"
                    + "mbo5matJibvJmXso2RrrOKpaOVoaaZqryUpqWSrZmgrp6io56mt6enpayqpqysqqOyvr69urW2s7"
                    + "KyrsSeksOik8mkksyplMOtm9KtlMaxndaxltm0l9y3mNy5muG+m8Wdp9Cnrcq6pte3rMy0tuG+oO"
                    + "TBndrCq8DAvsvEutXJt9XLtebEoenHo+zLpu3NqubIqvDPqvPUrejFuPHKvfbYsvnbtffbt+bSu/"
                    + "zivffgvYWewZifwYuixJikxZOpyJmqzJupw5mu0Jqy05u32Z673Jy9zqGzzqe2xK291KO82re3w7"
                    + "fCzLnG2bfF1avD2p/B4ZfI7ITR9pXZ94XJ76LF5KfK6KzO66rL57HT7rPV8LbY8rrb9LLO5p3g+7"
                    + "/g9rXs/L3z/ajm/JzN08bGxMvLy9DPzdLNxNzVycTP1cTP38nI3MvU2dTU1Nvd3NLZ3NDP0+jUyf"
                    + "fbyePb0+TMyN3g3/vmwv7pxf3syvriy+Hg3+ni2fvr1fzu2/bk1//00/7z3P/63PL42c/X5cbb7N"
                    + "ng6tTg78Tl+crq+sbj9dXu+tTy/dv0/dv6/tP6+8b2/uPi5OPo7+vr6+Hj7P/24//85P/96+Tr9O"
                    + "3w9eT9/+v9/+b1/PPz8///9Pb3+vP///////D/9/ns4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                    + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC"
                    + "wAAAAA0AITAQAI/wDFCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJky"
                    + "hTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat"
                    + "3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuL"
                    + "Hjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38"
                    + "CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDi/8fT768+fPo06tfz769+/fw48"
                    + "ufT7++/fv48+vfz7+///8ABijggAQWaOCBCCao4IIMNujggxBGKOGEFFZo4YUYZqjhhhx26OGHII"
                    + "Yo4ogklmjiiSimqOKKLLbo4oswxijjjDTWaOONOOao44489ujjj0AGKeSQRBZp5JFIJqnkkkw26e"
                    + "STUEbp1TSPJNLHIsVIqaVC02iDEQgAhCnmA1luaaY2gYwZiJcSTbOAmHCGuciZOC4CQiCsWHTMm3"
                    + "Eu0GVEfMYJZ5l0yshKnCCAQ1GgfSr60CKCCupnoTEeE+maEqUZqZwQMbopAHlS+qKmgrLZ6acAPP"
                    + "CQpaiKiWlxpCb/IupYYEZ6jEStArBqrmEmWtwHcc45K1i1loprq7vy6utwpI45LFjNwunoqZ9+kG"
                    + "yushIX6QJMmaIGLM8CKmi2EUH6qbAOPcArocGximi3T7wSLkRuwkmuRJ46C5G5qKpK3COXMvVEvP"
                    + "OWi6WpE9WL6J8QAYvqrcQlEukjS1EzsDcFs2RnrxRT5PDExhU7aMUXZ3zUIp4uW1y+ui71yhNTmJ"
                    + "zUMYscnNy28J4ic4XuwqkyUgPLu/OE/NpL8hPUDD1htJwqJU3JSkf48chOQx31g5vmfDWE00Rq7V"
                    + "JUELz1TKzYabOeZmOJWzEBgy322HpihPK409Kr7sK2FS0mukhZ/4w03BTNzTFFTOu776eT0iaymO"
                    + "weBYvVBbPSx5V1SzS1q5m2+vNCbPdb+Wt3x4mw4zDLPHXiln/aOEPrPsRysLRl7bYpT9YMcbqSfs"
                    + "5Qz7k/VLigfTh0aK7cysZ7rwK/vWTot3O+aceHP/zQ5Z86JHHrsQ0f56t9Q55kz8E3pDfmES0uaK"
                    + "gN8RqmQ+Zv2rxr18Ne9d9Mgm/9puE33Cr6rKvPvvrva037AliUl0XhSQ5DnfNAVq5WMYwh7esdQ+"
                    + "LnQNmwbHRGMUXpnlQM6P2vUW3y3KOUJTxe+Ss2OJvdzkT2gQdGz1b0wl5DQncu43ktedIYGpXORj"
                    + "gGvhB/MRRh9v/aNjPvAY5efQjTA7jXQCA28YazKZwHSfeEI8akGDRMFf+Q2Ce+xWaALtugFWGyw0"
                    + "cQUCJl4+FsZKcUNShvjIlJovrmCKcFgEBtJOkgCKhHR/XljyBdkyAgrfS6OS5xiiKJwhvhaJhC9t"
                    + "GEXtwIK/j4yD6ecCCdexcmf1dJRG3xI0Zk5GA42UlIckRwpUzl+8YHKoFMMpXqI1NI/IYxUR4mi7"
                    + "Ck49cugspcdvJ9coRdBH1JxI4Y0JaIIWYnFRgRhSnzlwXBJQCC+cxcbS4jGlQDMg8zzGpuipkl9G"
                    + "Yl7yUQcaZylxuZwiK3CRhnmrNV4FwIKd9ZTFfSs5NMxEjQ2Mn/kTKasSxprJlAB0rQghpUoIGgpM"
                    + "/0B887HfShED2oC+1ZyQ/s8aIYzWhG57g6i4SSn20y3zXbmQhHfhIh1JRUIiaKEgpi66Tl6maqdJ"
                    + "ewjwLuGMF8QCTDuS2WtnOYl0wIJxewU5XIVIlFrcgxFNpKbIqRTgL1KU8X2kx4YlAwnIQpJj/1x5"
                    + "c4EnkgGapG3Eg7qMovhE6cnjXjmNaDBNKHMcmVVjWS1YwoUmhCSuMPGTcRafLVIW+tIGIoSVNxUH"
                    + "KuKjleHc/YEUrmcyI21RG/yKkQaQa1IYGtp0IApqyIepagbVFsUw3C2fPVhJV/zeM3MULLITHqId"
                    + "WrKqpGehDU/96TsmfhY1FZhkiY1PUkvyus8CKbo9c6JLZB5OoI7+k+tpTWaKSFYk0iSFuQZFJ0Fz"
                    + "nFU4GkPdwixLJoVe5UmbvYtWQWrNGEoU2Qi5LmWkSdeM2rGhcYp45CUHqwJa9007Jfim4PJ209CR"
                    + "8Z65B9akQPPYCBghes4EsI5AqbQEgukJAMhkzYEzv5giHCMZE9JKEZwdEbYhMi2mmWD1saWZx3x5"
                    + "KvzRXuqmRkY0rA6FH6XeQXWoiBE6bA4x7zGBniuDBC5gADQnA4IcO4ggwqrBMrSIIicCDCM5g13y"
                    + "dSVVyIg/FEPGVfsbTYIF++CSvRiRIaU+RpNq5IkpnAjIXgAf8IID5IGBSsDCR3gc4QcUMhjlwSXe"
                    + "AgwhPRMJ+5Ewg+fWDECHFneTeS2XiKpZ7nHe104Vpm9Z55u1CGM0OivA2EZCEGMThEQtwAailDBA"
                    + "tPPsmbmSwRVPPHfI+VmybPQmntUc0mA2bJBd+L6Yk4edCeFgSwBZJkRNy5zgbJAw0g4eqHBCMHgD"
                    + "YJpydSbP8EVMtfOitZFLvKSOVExinpr0TuihE/Z6IhzU72n/mwbHUzghg6cDCxc8xgNgtEDgxu8L"
                    + "zzbe+B+ILe+pZzDerdAz90+t4DX3C/1R0KgXiY38YgCIL5fW4GZZHAXGFl5USKE8Ve1iSKrW5DiN"
                    + "sQDzd8IUn/jnZBVo2NLAzBGQQpdjeEHGQbSCEWvMi5KgoO81moUwZU+HHNb67znb/c4TZ3hc6HbQ"
                    + "2XOwIVUGeDD4p8ZKffQuc8PwjLHb70WuQY2WcQAiSuvnRuNKjRwt1KSmea3lmfVtwmYWVSMUvyTW"
                    + "vazTdg9co1fYdQE6QLR+87k6+w4b1zYiDTnnfhY06Dwzd98aM+usT9/o03SN7fjZezqSUM7ZpjuE"
                    + "LPNTFZqLc5SpPN9CaRop7qvhAw6BgKsI997Jfh8LsbBAybt8LmSc1ky4MYFxQ2yLOjjXs+Ax/ZjI"
                    + "/w8VH+a8M/WN7J1zzTFV/5zVcoWnPXCqQtPWnTriTXFdGu/zYx8ul815v21T/47Y2M8MMrWxPUFw"
                    + "cdigDzvbM6C6JGPP0ZLv/Lc17ltVdnw8d/BpFuBzGAYQAIZnchl4NxV8FtBRF664MTu7YS4CYRZF"
                    + "Vu8YZu7Cd8GzhvgOB1jMBnzYYGCkiA1aZ/Czh5IGaCK/h//Ld89ueBKlcLqWAGPrZk1ad3FOJOjp"
                    + "YVEihp4sA0xXMTFwhycAcRBmYRNLcQBhh9iFdq3YB58rYFkKeCAfh3V3hvpmaFdhdnWmh2dGB+Cq"
                    + "d+mHd/ryd7d1d+shdx2BFQXaYxbtcVLjWBBMFxNxFyLHFd5HNpaZZpPHiAnad1P6B3fuZ/y3cNzV"
                    + "cQgpaF8f/HiOy3iJFnhs+HcD7mY244gy03CFPIgv4WdamQYAAYHXX4gyuBfTyxQ5OjUazYiq4IAv"
                    + "lyWZolE0EYayQhd6v3hx1me0gWfNK3cm3miQNYgKnWf+o3jDHnasg4iQWRgl6wZw/he8a4ftO3id"
                    + "UIG4KzALZ4XwH2Eg3YcQmlX3MYab0VE6r3fdyHRr0mEXFQiF8YbJT4i014hljoiNEng3aWf1D4hK"
                    + "0HjdKYjND3i6NxbYCFS0SVOqiSfSnBKKa4Eq8kjt63VRHZfdiFjsYSfusYER42gv0Yjw8GjR3peS"
                    + "iYgMeYeTM4f1MWkn+XeyDJgVwIho9Ig6RxOg4IDn7VkBH/yCvYlhJ8KHIo8ZAQOZHioHEA5m0skU"
                    + "IVETbxZRGut2OgGHVAln6CGJAJsYhWp3NkoINRqAi30IlXmXNZCWh69oJDpmNPqZXV93Rdlw1TiX"
                    + "ROgHNFF3zksJZSJ2yQUSU1ORDm05BB2Icz1FmfFZiC+VBZdCWDeZie9SdHpV8utHYfJxNIyZNJ+B"
                    + "Cs1xBpkHDmB41eKIgnpxAp529cAHHqRnnCEJrnh3hUOWqi+XdkyJHN+GGYZ35HV375BgnXaBgfE4"
                    + "eAtCkrJhAyBRFBGZz3NCms8FUQCWbA03GTORK1mIu11CP2Iz7dWBC5IlUFUWLCmZ2l9DXzFJSlJ5"
                    + "SnB55x/4d6q1KZMBJYXUVi00kQ1Tle2vmey+Qla4c/r1ifr7h94mmO5EkSZjYR4hckxZKX2vA8C/"
                    + "Gb+QWfCFpJXcJU04RoZ1Zr6TgT4KcSR7gvGZkjZbOTBeGYaWdrdKNWciUUi6OhETFUCsla6ViHLW"
                    + "OERmmBgkJm47ZOCLRoBbpaexWZPsE72zgRtpWeIEGUd5icebicIqGHNZY0UFVlCUE9OGkQMuWgND"
                    + "Gi/VRDqSdIApEvO9oSHopeKYGLSmWew7IxqdKbNcqbQqGjHcEyTboRpGcQ+/kSXmpUb7o7YMpPva"
                    + "RFQ5FSJOo7PRVuHyqRFYlrcxoSE+qfFwpSJBZVRfFfjP/mXidBjjl5kYIqqX5KqTG6lIhqFc2yph"
                    + "+kbUhoqRxalJb6qXN4qZmqfdC1EUT6oy2ql0JqE0aaWLNYnrooEQ9Hhqd5qi+xqWlXooP6EXjInv"
                    + "kJE83pkL9KYnUqZ2fJlVCpm0dRB+UIJZ6KEbGoa6/qX7f2dsM6Ev2pjjHjESZ3FSloJkXDqZh1rB"
                    + "4BoaMqE916EhUYOIcKiLpaE4xyoje6opIplEC6Xq1aqXV0EUvIESQ5r+GpRL16YqU6nqD6ot9mpY"
                    + "+6qlySrMxnl4yImZqZmYM2cQqXiTWHsQjHb8H4sfnWgf8mm7/XCnx2mbVZsbm6bwx2L7uQYCN7m/"
                    + "9BkIv/kqqq+qdd2q/iEGawCrEfEYT2mmgS65kfyJqrQHad2AtdVwaUl5awgJXuOHRwWXbE1rQ2t4"
                    + "D4ppZd55ZK17VS2XRMkLRS2wkgSLY55wMnSLVxWXjsxqxgeyBEKKADUa4Hm1w4W2mliq47u60icY"
                    + "5++BHmBon1xxCAJ4Z595pVuIXviI8yyYxu4H8fyWGRW7hZqIgt+ZKYS7PKMQ2FNjgWEY54mjB+JY"
                    + "QMQUNDey156646W05+2xLz6awg0a4WOn4dsXUx2XqmNpbNuIHz6BDh6oIJEa5Vubi/KIlZ+LvGqL"
                    + "x5Yzt6ArQGoWijy1Cqo7rm6p6maxLqOq3sGqHay7MR/6GUH9GOMLmMIbmZ9zi1eaZp6CuQbWm+lQ"
                    + "i/KDmN9ke8uCFiD7qeC/E6j5kQtmU4p5utjfq6HwGBu0nALrquJQG9CFG0+WiG9tuMN5iDqYa8Ij"
                    + "m4brYGPsZz4+q+Mai+9BjBmsu7hIvBpEEzUCoOfBgmsouc1QsRpJS6xtmgnsWrBczA6cSzkeaTK7"
                    + "HDezirgOXAVdmB9siaM6CGMaB8O/B5nlh5CtaGKxizaRh7Rga/YQi5knvBWfyMlIurVOfERxx7tu"
                    + "kZkwWiCUtf+vtdQrQ775TCEVGhI0GEBwHHLrGloqcScVpTVeQRHRy2TRzCIKy5XAeKNACNJkx9Ig"
                    + "yQD/8slSe5tlese5fYY4ULDMvKuZBBQweqwOo5W2+MLNjrS/2bEbwlpwk7ytrKvSURu7kouCaZuy"
                    + "LZyCl5xWXZghQLyLH8uPD4DV3AuNO2yzJpxSq5GcaVPnScaJrTyaiius/kxggLQu0lnu0TyixBuy"
                    + "UhTXuKEBkIrmhZiZroiSQsy4QIYvwoZN+My7/Mj1JpwULGvHgHk5lRxrjjsGyMKlnadpsCo5tcTd"
                    + "Isa3yLouLZl6lbzd67wPKshDJ6EYlXxEjneI+8hZ/JjOPMd1lMjzBojc4nvxJtthHBxZ6Bwvfawv"
                    + "Y80EKVkNQiWDPxwiWxwtk7oI4aVwWtWtcKWbVKfgb/98dIS3Zpa7yaSJehCXZAF7Vx2WkTBrdWq4"
                    + "hju5YctnXtyLW8UJeIi3z1+JVWy9NBANWv4VIBDagxjVn8e7fYaqNRitLMCb6++U10W6Q4LElATH"
                    + "czfRHtS7+9S4afJwaBGLytabkqO7Mi+7JHhmMmC9d5vWDQ42HxKLxBBnAbC8Z6XRuKGn5pLRDSe7"
                    + "02adIFu9ZsyrDGTKVwatkhoaLR2hDHRLCeOyaf3RCfO73NVLrMbBLddJAigUs+6qpZ5tUf4dnTLN"
                    + "KgHa8Eu6svLRPG+QB3hJif9aaRBjyJINyD6VPUTBLvaqiYuts2YbM6YcfvqZvUHZw+2tzP7MwUIc"
                    + "TQ/20W/xucGtqd+vVJj50RsarHSPrde9GXwnk/COpF6d1S/Xyd3s3eADXD98TDXy2cXpTH9I3ACB"
                    + "Ha+N0X8wmRqTsNi/lOo6PS19wR4yPZBJHNBd4XOJWd+Lw7B35bB3FxLsFlAHvQFZ6KA/XgcSe65F"
                    + "XPm4Xi9OTa0VsrslTHd9NC+tTWI54TS7XVd9Elx9DjPv7jQB7kQv7jtH00z3njRfoxhxY4s40fBJ"
                    + "4V5NCJldLYPaTjaHze5ZFNAjt1f910o6gSwPflDyI5d1TkBoGKPKrZ8UzS9wFfB2YDRxzJPDaF7K"
                    + "xqsMmOpS0eeOmrAJw5Ak4QjnTN1/2v9xGwFQF8ZP8K1xpouRbWCIzuEH18HrmpzCtNzFbOJfuzXO"
                    + "1ZH61F02TpwQhtfRESndJ5xvPc29ic6Z1K2fKBZhnhuMyoERw9IaQ+QZd+5X1e6mpepptOH09eEU"
                    + "Rm1bl82ItN7CA7YYsd2CAZ2AHnsmX4iSSImYL9YB7r7M9+HAlkndf55yHtl5+cWrYuQ/NB4Uwp6h"
                    + "U91FXbBjXgtkmH1P8WNjs2BW74lV551DbodWgp1WqrtTUttmg71VhbcWv2tUV9HBnK51yKgbidEI"
                    + "FO6TgqH+Tm6RaWuJvLiPtHeNc4j5V7e1vsj5I7v7rs8Y9+vhP9HcUQCJTDSzRqZai8pChmH969Zm"
                    + "r/KHuOnrwUz4KJ3M0Vr8jUuPMU3XwW/I7o3B9lZOYTztnRe8z20elMCOdezImaC/I4X/L1+MpQqM"
                    + "gY/XtLbPXRKGyRriE4xSd9ANKRiuXj8evyarjsV84vObCLrNBcj8iBLJXhmvMxN8E9ZgMV7Mg4ou"
                    + "Ct6+u6/Y5qT+24Kmpvbc5SX/W23PPzm/i398Syl8RIN8U1byP+ZPTn4eYSz3yOB8lyDnNBf/V+rP"
                    + "gjzPfcLLyGHc46v6zujOSpYejUdviqD8xxb86+3PMzePv7WHiy78q4a86u//o2Duku9+kfLOwUPb"
                    + "y8GPTozNHqLJcfGPq1n9DAH/ym4eoZgQZz3/N1/17n9mjFEa3ETIyFGDz0td+IszwvwOAEDRAnL6"
                    + "CR7A8nKDDynpkBKoARtmAEBiAmDAAQk8KJI1jQ4EGCY0g8Q/jNzIVoDSWKm+UAwEWMJ5RNlPgrww"
                    + "qOEmsZOZBxY0iUr55QQdlSXLAeMhSholmTZreEhQZiy8Jk1S1eQYNye4nFp1ChO4s6cTXtJZKTB+"
                    + "PIhCWUjQ2dT6MWhONnG8UfJ99QRSoNJ88gP5H2uESwV9laa2hoclnX7l28efXu5dvX71/AgQUPbk"
                    + "hLAgAGHBQrBmXXMOLFBgCUIFrXzgATfc1IfrD4ogvHEwK8QGirQYJRdpVgZA3AAkPLmO9ubu0a9v"
                    + "9eNSsDC+MCw/fv352KYirIG3hwt1qO+2ZmUFdMQNz2OPnaME2N4492Tq9uEI2hgXeic10eY1Py8p"
                    + "6eLvdJ2P17+PHlz6df337DDAoq8RWWf3/xCFCzq4zR+KpoIe8MEEEplHY57TXnDoOwLg0ELM6/AQ"
                    + "u07DRRLgzgv72ieOKV+0o08UQUU1RxRRZbdLE0AzIzMEaEKuywrtVAzEuMDw9ycITKWrrsMw8nYz"
                    + "Ck/iqA5qAcVesRRw0LapKvlcx68Uoss9RySy67DImVRcJ0asUxotSrTNAiVNIuG/nCwEKuZKuLwA"
                    + "UEQBCbIwJ4QIAUHGsASOfeTI1COFtq06A8SeH/r0ovG3X0UUgjlRSlQGp74BgVE130yeL+DLLBCS"
                    + "bMy5cAb0vITJRyFG2/MlvgkRLHBiDBmGJqdQUIPo/kiFRRQV3Tw4j2UumJSYs19lhkX3xETL8CqR"
                    + "OABxYBJ69p9qztIlZSFJS/bQ26TEaXftR1wwWZ5NRQ1MokIRVPNZ3zWtv8LDfc01D44957PTVQt2"
                    + "T79fdfgPti5dmLQJiWWoIxWmBMuz6AF6NiTuTVVLwmlgrVkL6dsc+DDm1p4scMeO2abl3K8wR87x"
                    + "X5RpfqIECFWOGljK8pRgz4ZpxzxnmaaxNBGN4HDnZpkYcVlviAmfeiBekjp3QJTb6gVpPiXZn+/2"
                    + "Y1/V6KAFBCWSYoT1jfDfvp0bIx2+xW+2JUZ7bbdtvRSq8Vuq644ZW2roQfjrhEjTeusdBUz8XLab"
                    + "esbvlltySwpPCkPy7VXB0DVxTKyF9V+wlq3tZ8c85VBAFeTO/Ku7UP6uK5aIx85ltWqmO9MyEa2Q"
                    + "T8rtVAQhRjjqS+GGZyGayoVyRLRndQKWe3S5q1O1d+eeYF+/za0O1CHQDTpy/YxP4KXowDFhzLD4"
                    + "EOFDvtdcfB3577mBNTTDLbKW/I8tjU98wCr0Hl2nHgN/hVL2pMUaN5AAZQgHSD19xcMr3qWc9g2C"
                    + "NJaxZ3vCKU5CIMQIEz7uKRa7WvZRQQQEYEQv878kkphBmTIGsqeMEJpClcKayRBgf4QhjGkC+jU5"
                    + "3oilY6lxzDegCooQx9+EMgBlGI7ylGwgKhl7r1zC6jg94QnfhEKEZRiuAA0934x0RoGfBL0wvaFL"
                    + "34RTCG8YnVshTD6uKwou1NjGtkYxvd+DZnXSRaWmwJGUH3RjzmUY97XF4S5Rg9PgZSkIMkpKSqaM"
                    + "VCJlKRi2RkIx35SEhGUpKTpGQlLXlJTGZSk5vkZCc9+UlQhlKUoyRlKU15SlSmUpWrZGUrXflKWM"
                    + "ZSlrOkZS1teUtc5lKXu+RlL335S2AGU5jDJGYxjXlMZCZTmctkZjOd+UxoRlOa06RmNa15TWxvZl"
                    + "Ob2+RmN735TXCGU5zjJGc5zXlOdKZTnetkZzvd+U54xlOe86RnPe15T3zmU5/75Gc//flPgAZUoA"
                    + "MlaEENelCEJlShC2VoQx36UIhGVKITpWhFLXpRjGZUoxvlaEc9+lGQhlSkIyVpSU0axoAAADs="
                var totalPagesExp = 1;
                // current line after title
                let currentLine = 40;
                // Width page less margins
                const widhPage = doc.internal.pageSize.width - (doc.internal.pageSize.width * 0.1);
                // Width of one chaerater inte page
                doc.setFontSize(5);
                const widthChar = (doc.getStringUnitWidth('M') * doc.getFontSize()) / (72 / 25.6);
                // Calculate the maximum numers of characters in each line
                const maxChars = Math.floor(widhPage / widthChar);
                // Regular expression to split the text
                const RegExpreSplit = new RegExp('.{1,' + maxChars + '}', 'g');
                let lastLine = 40;
                let EFO = [];
                let EFR = [];
                if (reportJSON.EFO && reportJSON.EFR) {
                    // Split string EFO for maxChars
                    EFO = reportJSON.EFO.match(RegExpreSplit);
                    // Split string EFR for maxChars
                    EFR = reportJSON.EFR.match(RegExpreSplit);

                    lastLine = ((EFO.length + EFR.length) * 3) + currentLine;
                } else {
                    lastLine = currentLine;
                }

                doc.autoTable({
                    head: [PDFheaders],
                    body: PDFdata,
                    styles: {
                        halign: 'right'
                    },
                    didDrawPage: function () {
                        // Header
                        doc.setFontSize(20);
                        doc.setTextColor(40);
                        doc.setFont('Tahoma');
                        if (base64Img) {
                            doc.addImage(base64Img, 'JPEG', 5, 9, 70, 30);
                        }
                        doc.text("Reporte de estadísticas", 80, 30);
                        doc.setFontSize(10);
                        doc.setFont('Arial');
                        doc.text(reportJSON.Title, 80, 35);
                        if (reportJSON.EFO && reportJSON.EFR) {
                            EFO.forEach(function (line) {
                                doc.setFontSize(5);
                                doc.text(line, 15, currentLine);
                                currentLine += 2.5;
                            });
                            currentLine += 2.5;
                            //print EFR in each line
                            EFR.forEach(function (line) {
                                doc.setFontSize(5);
                                doc.text(line, 15, currentLine);
                                currentLine += 2.5;
                            });
                            // doc.text ('*'.repeat(maxChars), 5, currentLine+5);
                        }

                        // Footer
                        var str = "Página" + doc.internal.getNumberOfPages()
                        if (typeof doc.putTotalPages === 'function') {
                            str = str + " de " + totalPagesExp;
                        }
                        doc.setFontSize(10);
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                        doc.text(str, 15, pageHeight - 10);
                    },
                    margin: {
                        top: lastLine
                    }
                })

                doc.save(response.data['filename'])
                /*--------------------------------------------------------------
                PDF TEST
                ---------------------------------------------------------------*/

            }
            // $scope.Reload();
            // $("[name='Tiporeporte']").empty();

            element_startDate.removeAttribute("required");
            element_endDate.removeAttribute("required");
            element_Agrupacion.removeAttribute("required");
            element_Tipotransaccionacumulado.removeAttribute("required");
            element_Tipotransaccion.removeAttribute("required");
            element_Agrupacionacumulado.removeAttribute("required");
            element_startDateArchivosDeSalida.removeAttribute("required");
            element_endDateArchivosDeSalida.removeAttribute("required");
            element_reportBatchDescriptionstartDate.removeAttribute("required");
            element_reportBatchDescriptionendDate.removeAttribute("required");
            element_reportBatchDescriptionTipotransaccion.removeAttribute("required");
            element_EntidadDestinoacumulado.removeAttribute("required");

            setTimeout(function () {
                $scope.ReloadKeepValues()
                $('.alert-success').hide();
            }, 5000);
        }).catch(function onError(response) {
            // Handle error
            var message = response.data.message;

            $scope.alerts = [{
                type: 'danger',
                msg: message
            }]

            setTimeout(function () {
                $(".alert-danger").hide();
            }, 5000)
        });
    }

    var element_startDate = document.getElementById('startDate');
    var element_endDate = document.getElementById('endDate');
    var element_Agrupacion = document.getElementById('Agrupacion');

    var element_Entidadorigenacumulado = document.getElementById('Entidadorigenacumulado');
    var element_EntidadDestinoacumulado = document.getElementById('EntidadDestinoacumulado');
    var element_Tipotransaccionacumulado = document.getElementById('Tipotransaccionacumulado');
    var element_Tipotransaccion = document.getElementById('Tipotransaccion');
    var element_Agrupacionacumulado = document.getElementById('Agrupacionacumulado');
    var element_year = document.getElementById('yearAno');

    var element_EntidadFinanciera = document.getElementById('EntidadFinanciera');
    var element_startDateArchivosDeSalida = document.getElementById('startDateArchivosDeSalida');
    var element_endDateArchivosDeSalida = document.getElementById('endDateArchivosDeSalida');

    var element_reportBatchDescriptiondebtorAgent = document.getElementById('reportBatchDescriptiondebtorAgent');
    var element_reportBatchDescriptioncreditorAgent = document.getElementById('reportBatchDescriptioncreditorAgent');
    var element_reportBatchDescriptionstartDate = document.getElementById('reportBatchDescriptionstartDate');
    var element_reportBatchDescriptionendDate = document.getElementById('reportBatchDescriptionendDate');
    var element_reportBatchDescriptionTipotransaccion = document.getElementById('reportBatchDescriptionTipotransaccion');

    var element_reportEntidadorigendebtorAgent = document.getElementById('EntidadorigendebtorAgent');

    $scope.checkformandatory = function (val) {
        $scope.activatePicker()

        if (val != 'Ano') {
            $scope.show = true
            // element_year.setAttribute("required", true);    
        } else {
            $scope.show = false
            // element_year.removeAttribute("required"); 
        }
    }

    $scope.reloadreport = function (TemplateName) {
        if (TemplateName == 'Diario') {
            element_startDate.setAttribute("required", true);
            element_endDate.setAttribute("required", true);
            element_Agrupacion.setAttribute("required", true);
            element_Tipotransaccion.setAttribute("required", true);


            element_Agrupacionacumulado.removeAttribute("required");
            //element_year.removeAttribute("required");

            element_startDateArchivosDeSalida.removeAttribute("required");
            element_endDateArchivosDeSalida.removeAttribute("required");
            element_Tipotransaccionacumulado.removeAttribute("required");

            element_reportBatchDescriptionstartDate.removeAttribute("required");
            element_reportBatchDescriptionendDate.removeAttribute("required");
            element_reportBatchDescriptionTipotransaccion.removeAttribute("required");

        } else if (TemplateName == 'Acumulado') {
            element_Agrupacionacumulado.setAttribute("required", true);
            //element_year.setAttribute("required", true);


            element_Tipotransaccion.removeAttribute("required");
            element_startDate.removeAttribute("required");
            element_endDate.removeAttribute("required");
            element_Agrupacion.removeAttribute("required");

            element_startDateArchivosDeSalida.removeAttribute("required");
            element_endDateArchivosDeSalida.removeAttribute("required");

            element_reportBatchDescriptionstartDate.removeAttribute("required");
            element_reportBatchDescriptionendDate.removeAttribute("required");
            element_reportBatchDescriptionTipotransaccion.removeAttribute("required");

        } else if (TemplateName == 'Archivosdesalida') {
            element_startDateArchivosDeSalida.setAttribute("required", true);
            element_endDateArchivosDeSalida.setAttribute("required", true);

            element_Tipotransaccion.removeAttribute("required");
            element_Tipotransaccionacumulado.removeAttribute("required");
            element_startDate.removeAttribute("required");
            element_endDate.removeAttribute("required");
            element_Agrupacion.removeAttribute("required");

            element_EntidadDestinoacumulado.removeAttribute("required");
            element_Agrupacionacumulado.removeAttribute("required");
            //element_year.removeAttribute("required");


            element_reportBatchDescriptionstartDate.removeAttribute("required");
            element_reportBatchDescriptionendDate.removeAttribute("required");
            element_reportBatchDescriptionTipotransaccion.removeAttribute("required");

        } else if (TemplateName == 'Descripciondelote') {
            element_reportBatchDescriptionstartDate.setAttribute("required", true);
            element_reportBatchDescriptionendDate.setAttribute("required", true);

            element_Tipotransaccion.removeAttribute("required");
            element_Tipotransaccionacumulado.removeAttribute("required");
            element_startDate.removeAttribute("required");
            element_endDate.removeAttribute("required");
            element_Agrupacion.removeAttribute("required");

            element_EntidadDestinoacumulado.removeAttribute("required");
            element_Agrupacionacumulado.removeAttribute("required");
            //element_year.removeAttribute("required");

            element_startDateArchivosDeSalida.removeAttribute("required");
            element_endDateArchivosDeSalida.removeAttribute("required");
        }

        setTimeout(function () {
            $scope.totalobj = {}
            $('select[name=EntidadorigendebtorAgent]').empty().val(null).trigger("change");
            $('select[name=EntidadDestinocreditorAgent]').empty().val(null).trigger("change");
            $('select[name=Tipotransaccion]').val(null).empty().trigger("change");
            $('select[name=Agrupacion]').val(null).trigger("change");
            $('select[name=Entidadorigenacumulado]').empty().val(null).trigger("change");
            $('select[name=EntidadDestinoacumulado]').empty().val(null).trigger("change");
            $('select[name=Tipotransaccionacumulado]').empty().val(null).trigger("change");
            $('select[name=Agrupacionacumulado]').val(null).trigger("change");
            $('select[name=EntidadFinanciera]').empty().val(null).trigger("change");
            $('select[name=reportBatchDescriptiondebtorAgent]').empty().val(null).trigger("change");
            $('select[name=reportBatchDescriptioncreditorAgent]').empty().val(null).trigger("change");
            $('select[name=reportBatchDescriptionTipotransaccion]').empty().val(null).trigger("change");
            $('select[name=Formato]').empty().trigger("change");

            const formatoOptions = [
                {
                    id: '',
                    text: $filter('translate')('Placeholder.Select')
                },
                { id: "TXT", text: "TXT" },
                { id: "Excel", text: "Excel" },
                { id: "PDF", text: "PDF" },
            ]
            formatoOptions.forEach(function (item) {
                if ($('select[name=Formato]').find("option[value='" + item.id + "']").length) {
                    $('select[name=Formato]').val(item.id).trigger('change');
                } else {
                    // Create a DOM Option and pre-select by default
                    var newOption = new Option(item.text, item.id, true, true);
                    // Append it to the select
                    $('select[name=Formato]').append(newOption).trigger('change');
                }
            })
            $('select[name=Formato]').val(null).trigger("change");

            $('#Agrupacionacumulado').empty().trigger("change");
            const agrupationOptions = [
                {
                    id: '',
                    text: $filter('translate')('Placeholder.Select')
                },
                { id: "Ano", text: $filter('translate')('StatisticsReports.Year') },
                { id: "Mes", text: $filter('translate')('StatisticsReports.Month') },
                { id: "Semana", text: $filter('translate')('StatisticsReports.Week') },
                { id: "Dia", text: $filter('translate')('StatisticsReports.Day') },
            ]
            agrupationOptions.forEach(function (item) {
                if ($('#Agrupacionacumulado').find("option[value='" + item.id + "']").length) {
                    $('#Agrupacionacumulado').val(item.id).trigger('change');
                } else {
                    // Create a DOM Option and pre-select by default
                    var newOption = new Option(item.text, item.id, true, true);
                    // Append it to the select
                    $('#Agrupacionacumulado').append(newOption).trigger('change');
                }
            })
            $('#Agrupacionacumulado').val(null).trigger("change");

            $('#Agrupacion').empty().trigger("change");
            const agrupationEntityOptions = [
                {
                    id: '',
                    text: $filter('translate')('Placeholder.Select')
                },
                { id: "Entidad origen", text: $filter('translate')("StatisticsReports.EntitySent") }, //StatisticsReports
                { id: "Entidad destino", text: $filter('translate')("StatisticsReports.EntityReceived") }, //StatisticsReports
                { id: "Tipo de transaccion", text: $filter('translate')("StatisticsReports.TransactionType") },
            ]
            agrupationEntityOptions.forEach(function (item) {
                if ($('#Agrupacion').find("option[value='" + item.id + "']").length) {
                    $('#Agrupacion').val(item.id).trigger('change');
                } else {
                    // Create a DOM Option and pre-select by default
                    var newOption = new Option(item.text, item.id, true, true);
                    // Append it to the select
                    $('#Agrupacion').append(newOption).trigger('change');
                }
            })
            $('#Agrupacion').val(null).trigger("change");
        }, 50);
    }

    $(document).ready(function () {
        $scope.remoteDataConfig = function () {
            var pageLimitCount = 500;
            var add_method = 'GET';
            $(".select2Dropdown").each(function () {
                $(this).select2({
                    ajax: {
                        url: function (params) {

                            if (($(this).attr('name') == 'EntidadDestinocreditorAgent') || ($(this).attr('name') == 'EntidadDestinoacumulado') || ($(this).attr('name') == 'reportBatchDescriptioncreditorAgent')) {
                                $scope.links = BASEURL + "/rest/v2/ach/report/custom/getbanks";
                                $scope.showmode = 1;
                                $scope.debtorList = $scope.selected2;
                                $scope.entityList = true;
                            } else if (($(this).attr('name') == 'reportBatchDescriptiondebtorAgent') || ($(this).attr('name') == 'EntidadorigendebtorAgent') || ($(this).attr('name') == 'Entidadorigenacumulado')) {
                                $scope.links = BASEURL + "/rest/v2/ach/report/custom/getbanks";
                                $scope.showmode = 1;
                                $scope.debtorList = $scope.selected1;
                                $scope.entityList = true;
                            } else if (($(this).attr('name') == 'Tipotransaccion') || ($(this).attr('name') == 'Tipotransaccionacumulado')) {
                                $scope.links = BASEURL + "/rest/v2/ach/report/custom/gettxtypes";
                                $scope.showmode = 1;
                            } else if (($(this).attr('name') == 'reportBatchDescriptionTipotransaccion')) {
                                $scope.links = BASEURL + "/rest/v2/ach/report/custom/getbatchtypes";
                                $scope.showmode = 1;
                            } else if (($(this).attr('name') == 'Tiporeporte')) {
                                $scope.links = BASEURL + "/rest/v2/ach/report/custom/getreporttypes";
                                $scope.showmode = 1;
                                $scope.reportType = true;
                            } else if (($(this).attr('name') == 'EntidadFinanciera')) {
                                $scope.links = BASEURL + "/rest/v2/ach/report/custom/getbanks";
                                $scope.showmode = 1;
                                $scope.debtorList = true;
                                $scope.entityList = true;
                            }

                            if ($scope.links) {
                                return $scope.links;
                            }

                        },
                        type: add_method,
                        headers: authenticationObject,
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Cookie', sanitizeCookie(document.cookie)),
                                xhr.withCredentials = true,
                                xhr.setRequestHeader('languageselected', sessionStorage.sessionlang)
                        },
                        crossDomain: true,
                        data: function (params) {
                            var query = {
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            }

                            if ($scope.reportType) {
                                query = {
                                    role: sessionStorage.ROLE_ID
                                };
                                $scope.reportType = "";
                            } else {
                                if ($scope.entityList) {
                                    if (params.term) {
                                        query = {
                                            search: params.term,
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount,
                                            userID: sessionStorage.UserID,
                                            debtorlist: $scope.debtorList
                                        };
                                    } else {
                                        query = {
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount,
                                            userID: sessionStorage.UserID,
                                            debtorlist: $scope.debtorList
                                        };
                                    }
                                }
                                else {
                                    if (params.term) {
                                        query = {
                                            search: params.term,
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount
                                        };
                                    }
                                    else {
                                        query = {
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount
                                        };
                                    }
                                }
                            }

                            if ($scope.links.indexOf('start') != -1 && $scope.links.indexOf('count') != -1) {
                                query = JSON.stringify({})
                            }

                            return query;

                        },
                        processResults: function (data, params) {
                            params.page = params.page ? params.page : 0;
                            var myarr = []
                            for (j in data) {
                                $scope.firstElementSelecy = {
                                    'id': data[j].code,
                                    'text': data[j].displayValue
                                }
                                if ($scope.showmode == 1) {
                                    myarr.push({
                                        'id': data[j].code,
                                        'text': data[j].displayValue
                                    })
                                }
                                else {
                                    myarr.push({
                                        'id': data[j].code,
                                        'text': data[j].displayvalue + "-" + data[j].code
                                    })
                                }
                            }
                            return {
                                results: myarr,
                                pagination: {
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },
                        cache: true
                    },
                    placeholder: ValidationPleaseHolder($(this).attr('name')),
                    minimumInputLength: 0,
                    allowClear: true
                });
            });
        }
        $scope.remoteDataConfig()
        function ValidationPleaseHolder(node) {
            if (node != 'Tiporeporte') {
                if (
                    (node == 'EntidadorigendebtorAgent' && sessionStorage.getItem("ROLE_ID").slice(0, 2) != "FE") ||
                    node == 'EntidadDestinocreditorAgent' ||
                    (node == 'Entidadorigenacumulado' && sessionStorage.getItem("ROLE_ID").slice(0, 2) != "FE") ||
                    node == 'EntidadDestinoacumulado' ||
                    (node == 'reportBatchDescriptiondebtorAgent' && sessionStorage.getItem("ROLE_ID").slice(0, 2) != "FE") ||
                    node == 'reportBatchDescriptioncreditorAgent' ||
                    (node == 'EntidadFinanciera' && sessionStorage.getItem("ROLE_ID").slice(0, 2) != "FE")) {
                    return $filter('translate')('Placeholder.All') || 'Todas';
                }

                if (
                    (node == 'EntidadorigendebtorAgent' && sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") ||
                    (node == 'Entidadorigenacumulado' && sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") ||
                    (node == 'reportBatchDescriptiondebtorAgent' && sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") ||
                    (node == 'EntidadFinanciera' && sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE")
                ) {
                    return $filter('translate')('Placeholder.All') || 'Todas'; // $scope.FEntity?.displayValue ? $scope.FEntity.displayValue :
                }
            }
            return $filter('translate')('Placeholder.Select') || 'Seleccionar';
        }

        if (sessionStorage.getItem("ROLE_ID").slice(0, 2) == "FE") {
            $http({
                url: BASEURL + '/rest/v2/ach/report/custom/getbanks',
                method: 'GET',
                params: {
                    start: 0,
                    count: 500,
                    userID: sessionStorage.UserID,
                    debtorlist: true,
                }
            }).then(function (response) {
                if (response.data.length > 0) {
                    $scope.FEntity = response.data[0];
                }
                $scope.remoteDataConfig()
            });
        } else {
            $scope.remoteDataConfig()
        }
    });

    //$scope.selected1; = Entidad Origen
    //$scope.selected2; = Entidad destino 

    // SI es True deja seteado el valor del login 
    //SI es False permite visualizar las demás entidades

    $scope.UpdateEntityOriginStacked = function (value) {
        if (value == $scope.FEntity.code) {
            $scope.SaveTemplate = false;
            $scope.selected1 = true;
            $scope.selected2 = false;
        } else if (value.length > 0) {
            $scope.SaveTemplate = false;
            $scope.selected1 = false;
            $scope.selected2 = true;
        } else if (value == "" && $scope.totalobj.reportStacked.debtorAgent == "") {
            $scope.selected1 = false;
            $scope.selected2 = false;
            if ($scope.totalobj.reportStacked != undefined) {
                $scope.totalobj.reportStacked.creditorAgent = "";
                $("#EntidadDestinoacumulado").empty();
            }
        }
        if ($scope.totalobj.reportStacked != undefined) {
            if ($scope.totalobj.reportStacked.creditorAgent == $scope.FEntity.code && $scope.totalobj.reportStacked.debtorAgent == $scope.FEntity.code) {
                $scope.totalobj.reportStacked.debtorAgent = "";
                $("#Entidadorigenacumulado").empty();
            }
        }
    }

    $scope.UpdateEntityDestinyStacked = function (value) {
        if (value == $scope.FEntity.code) {
            $scope.selected1 = false;
            $scope.selected2 = true;
        } else if (value.length > 0) {
            $scope.selected1 = true;
            $scope.selected2 = false;
        } else if (value == "" && $scope.totalobj.reportStacked.creditorAgent == "") {
            $scope.selected1 = false;
            $scope.selected2 = false;
            if ($scope.totalobj.reportStacked != undefined) {
                $scope.totalobj.reportStacked.debtorAgent = "";
                $("#Entidadorigenacumulado").empty();
            }
        }
        if ($scope.totalobj.reportStacked != undefined) {
            if ($scope.totalobj.reportStacked.creditorAgent == $scope.FEntity.code && $scope.totalobj.reportStacked.debtorAgent == $scope.FEntity.code) {
                $scope.totalobj.reportStacked.creditorAgent = "";
                $("#EntidadDestinoacumulado").empty();
            }
        }
    }

    $scope.UpdateEntityOriginBatchDesc = function (value) {
        if (value == $scope.FEntity.code) {
            $scope.SaveTemplate = false;
            $scope.selected1 = true;
            $scope.selected2 = false;
        } else if (value.length > 0) {
            $scope.SaveTemplate = false;
            $scope.selected1 = false;
            $scope.selected2 = true;
        } else if (value == "" && $scope.totalobj.reportBatchDescription.debtorAgent == "") {
            $scope.selected1 = false;
            $scope.selected2 = false;
            if ($scope.totalobj.reportBatchDescription != undefined) {
                $scope.totalobj.reportBatchDescription.creditorAgent = "";
                $("#reportBatchDescriptioncreditorAgent").empty();
            }
        }
        if ($scope.totalobj.reportBatchDescription != undefined) {
            if ($scope.totalobj.reportBatchDescription.creditorAgent == $scope.FEntity.code && $scope.totalobj.reportBatchDescription.debtorAgent == $scope.FEntity.code) {
                $scope.totalobj.reportBatchDescription.debtorAgent = "";
                $("#reportBatchDescriptiondebtorAgent").empty();
            }
        }
    }

    $scope.UpdateEntityDestinyBatchDesc = function (value) {
        if (value == $scope.FEntity.code) {
            $scope.selected1 = false;
            $scope.selected2 = true;
        } else if (value.length > 0) {
            $scope.selected1 = true;
            $scope.selected2 = false;
        } else if (value == "" && $scope.totalobj.reportBatchDescription.creditorAgent == "") {
            $scope.selected1 = false;
            $scope.selected2 = false;
            if ($scope.totalobj.reportBatchDescription != undefined) {
                $scope.totalobj.reportBatchDescription.debtorAgent = "";
                $("#reportBatchDescriptiondebtorAgent").empty();
            }
        }
        if ($scope.totalobj.reportBatchDescription != undefined) {
            if ($scope.totalobj.reportBatchDescription.creditorAgent == $scope.FEntity.code && $scope.totalobj.reportBatchDescription.debtorAgent == $scope.FEntity.code) {
                $scope.totalobj.reportBatchDescription.creditorAgent = "";
                $("#reportBatchDescriptioncreditorAgent").empty();
            }
        }
    }

    $scope.UpdateEntityOriginDaily = function (value) {
        if (value == $scope.FEntity.code) {
            $scope.SaveTemplate = false;
            $scope.selected1 = true;
            $scope.selected2 = false;
        } else if (value.length > 0) {
            $scope.SaveTemplate = false;
            $scope.selected1 = false;
            $scope.selected2 = true;
        }
        else if (value == "" && $scope.totalobj.reportDaily.debtorAgent == "") {
            $scope.selected1 = false;
            $scope.selected2 = false;
            if ($scope.totalobj.reportDaily != undefined) {
                $scope.totalobj.reportDaily.creditorAgent = "";
                $("#EntidadDestinocreditorAgent").empty();
            }
        }
        if ($scope.totalobj.reportDaily != undefined) {
            if ($scope.totalobj.reportDaily.creditorAgent == $scope.FEntity.code && $scope.totalobj.reportDaily.debtorAgent == $scope.FEntity.code) {
                $scope.totalobj.reportDaily.debtorAgent = "";
                $("#EntidadorigendebtorAgent").empty();
            }
        }
    }

    $scope.UpdateEntityDestinyDaily = function (value) {
        if (value == $scope.FEntity.code) {
            $scope.selected1 = false;
            $scope.selected2 = true;
        } else if (value.length > 0) {
            $scope.selected1 = true;
            $scope.selected2 = false;
        } else if (value == "" && $scope.totalobj.reportDaily.creditorAgent == "") {
            $scope.selected1 = false;
            $scope.selected2 = false;
            if ($scope.totalobj.reportDaily != undefined) {
                $scope.totalobj.reportDaily.debtorAgent = "";
                $("#EntidadorigendebtorAgent").empty();
            }
        }
        if ($scope.totalobj.reportDaily != undefined) {
            if ($scope.totalobj.reportDaily.creditorAgent == $scope.FEntity.code && $scope.totalobj.reportDaily.debtorAgent == $scope.FEntity.code) {
                $scope.totalobj.reportDaily.creditorAgent = "";
                $("#EntidadDestinocreditorAgent").empty();
            }
        }
    }
});
