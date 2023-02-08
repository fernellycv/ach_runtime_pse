angular.module('VolpayApp').controller('RefundReportCtrl', function ($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("Refund Report");
    $scope.validateCheck = true;

    var authenticationObject = $rootScope.dynamicAuthObj;
    $scope.spliceSearch = false;
    $scope.lskey = ["New Search"];
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks();

    $scope.buildSearchClicked = false;
    $rootScope.customDate = {};
    $scope.search = ($rootScope.search) ? $rootScope.search : {};
    $scope.dSearch = $scope.search;
    $scope.resetBtnClicked = false;
    $scope.newSearch = false;

    $scope.setSortMenu = function () {
        $scope.sortMenu = [
            {
                "label": "RefundReport.Daterange",
                "fieldName": "DateRange",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "SodHealthCheck.Report",
                "fieldName": "Report",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "RefundReport.ReportGenerationDate",
                "fieldName": "ReportGenerationDate",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "RefundReport.State",
                "fieldName": "State",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }
        ]
    }

    $scope.setSortMenu()

    $scope.commonObj = CommonService.distInstruction;
    CommonService.distInstruction.currentObj.sortBy = [];

    $scope.dateSet = function () {
        // $scope.dateFilter = CommonService.distInstruction.dateFilter;

        for (i in $scope.dateFilter) {
            if ($scope.dateFilter[i]) {
                $('#dropTxt').text($filter('ucwords')(i))
                for (var j = 0; j < $('.menuClass').length; j++) {
                    if ($($('.menuClass')[j]).text().toLowerCase().indexOf(i) != -1) {
                        $($('.menuClass')[j]).addClass('listSelected')
                    } else {
                        $($('.menuClass')[j]).removeClass('listSelected')
                    }
                }

            }
        }
    }
    $scope.dateSet()
    // $scope.ProcessDate=moment(new Date()).format('YYYY-MM-DD')
    $scope.loadedData = '';
    $scope.uorVal = $scope.uorFound = $scope.commonObj.uorVal;

    $scope.fieldArr = $scope.commonObj.currentObj;
    $scope.fieldArr.start = 0;
    // $scope.fieldArr.ProcessDate =  $scope.ProcessDate
    var len = 20;

    $scope.changeViewFlag = false;

    /* Query Constructor */
    $scope.uorQueryConstruct = function (arr) {

        delete arr.sortBy
        delete arr.params

        CommonService.distInstruction.currentObj = arr;
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        // $scope.Qobj.ProcessDate = arr.ProcessDate;

        return $scope.Qobj;
    }

    $scope.advanceSearchCollaspe = function () {

        if ($scope.distSearch) {
            $('#distSearch').collapse('show')
        } else {
            $('#distSearch').collapse('hide')
        }
        $scope.distSearch = !$scope.distSearch;
        $scope.showSearchWarning = false;
    }

    $scope.initCall = function (_query) {

        $http.post(BASEURL + '/rest/v2/ach/report/viewrefundreports', _query).then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.datas = data;

            for (i in $scope.datas) {
                $scope.datas[i]['checked'] = false
            }

            $scope.loadedData = data;
            $('.alert-danger').hide()
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.datas = [];
            $scope.loadedData = [];

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

    $scope.FilterByDate = function (ProcessDate) {

        $scope.reqBodyObjs = {}
        $scope.reqBodyObj = $scope.cleantheinputdata(ProcessDate);
        $scope.reqBodyObjs.start = 0;
        $scope.reqBodyObjs.count = 20;

        if (ProcessDate.FromDate != undefined || ProcessDate.ToDate != undefined) {
            $http.post(BASEURL + '/rest/v2/ach/report/getrefundreports', $scope.reqBodyObj).then(function onSuccess(response) {

                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }]
                $scope.refresh();
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
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('RefundReport.ErrorDates')
            }];
        }
        setTimeout(function () {
            $('.alert-success').hide();
            $('.alert-danger').hide()
            $scope.initCall(($scope.reqBodyObjs))
        }, 3500)
    }

    $scope.refresh = function () {
        // $scope.ProcessDate=moment(new Date()).format('YYYY-MM-DD')
        $scope.search = {}
        $scope.reqBodyObj = {};
        $scope.reqBodyObj.start = 0;
        $scope.reqBodyObj.count = 20
        $scope.createData = {}
        $scope.selectedRow = null;
        len = 20;
        $('.listView').scrollTop(0)
        $scope.initCall($scope.reqBodyObj)
        $scope.datasaudit = []
        $('#myModal').hide();
        $('#myModals').hide();

        $('.alert-success').hide();
        $('.alert-danger').hide()

        // $('.table-responsive').find('table').find('thead').find('th').find('span').removeAttr('class')
    }

    $scope.createData = {}
    $scope.updateSelection = function (position, entities, data) {
        $scope.validateCheck = data.checked;
        $scope.createData['DateRange'] = data.DateRange
        $scope.createData['ReportGenerationDate'] = data.ReportGenerationDate
        angular.forEach(entities, function (subscription, index) {
            if (position != index)
                subscription.checked = false;

        });
    }

    $scope.customDateRangePicker = function (sDate, eDate) {
        var startDate = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);

        /*  $(sanitize('#'+sDate)).datetimepicker({
        format: 'YYYY-MM-DD',
        autoclose: true,
        pickTime: false
        })

        $(sanitize('#'+sDate)).on('dp.change', function(e){
        });*/

        $(sanitize('#' + sDate)).datepicker({
            language: "es",
            weekStart: 1,
            startDate: '1900-01-01',
            minDate: 1,
            //endDate: FromEndDate,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true
        }).on('changeDate', function (selected) {
            startDate = new Date(selected.date.valueOf());
            startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
        });

        /*$(sanitize('#'+sDate)).on('keyup',function(){
        if(!$(this).val()){
        $(sanitize('#' + sDate)).datepicker('setStartDate', new Date());
        }
        })*/

        $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
        $(sanitize('#' + eDate)).datepicker({
            language: "es",
            weekStart: 1,
            startDate: startDate,
            endDate: ToEndDate,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true
        }).on('changeDate', function (selected) {
            FromEndDate = new Date(selected.date.valueOf());
            FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
        });
        $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
        $(sanitize('#' + eDate)).on('keyup', function () {
            if (!$(this).val()) {
                $(sanitize('#' + sDate)).datepicker('setEndDate', new Date());
            }
        })
    }

    $scope.customDateRangePicker('FromDate', 'ToDate')
    setTimeout(function () {
        $scope.customDateRangePicker('FromDate', 'ToDate')
    }, 1000)

    $scope.focusInfn = function (data) {
        $(sanitize('#' + data)).focus()
    }

    $("input[name='excelVal'][value='csv']").prop('checked', true);
    $scope.exportToExcelFlist = function (eve) {
        if ($("input[name=excelVal][value='txt']").prop("checked") || $("input[name=excelVal][value='csv']").prop("checked")) {
            if ($("input[name=excelVal][value='txt']").prop("checked")) {
                var url = "/rest/v2/instruction/ach/downloadAllSanctions"
            } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                var url = "/rest/v2/ach/report/downloadrefundreports"
            }

            $http.post(BASEURL + url, $scope.createData).then(function onSuccess(response) {
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


                if ($("input[name=excelVal][value='txt']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'report.txt';
                    }

                } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'report.csv';
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
        }
    }

    $scope.CustomDatesReset = function () {
        $scope.customDate = {
            startDate: '',
            endDate: ''
        }
    }

    /* Load more */

    $scope.loadMore = function (query) {
        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;

        $http.post(BASEURL + '/rest/v2/ach/report/viewrefundreports', $scope.fieldArr).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.datas = $scope.datas.concat(data);

            $scope.loadedData = data;
            len = len + 20;
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

    $scope.setDateRange = function () {
        $scope.showSearchWarning = false;
        setTimeout(function () {
            $scope.remoteDataConfig()

            if (Object.keys($scope.search).indexOf("OfficeCode") != -1 && $scope.search.OfficeCode.length) {
                $('select[name=OfficeCode]').val($scope.search.OfficeCode);
                $('select[name=OfficeCode]').select2();
            }
        }, 100)
    }

    $scope.showSearchWarning = false;
    $scope.cleantheinputdata = function (newData) {
        $.each(newData, function (key, value) {
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
        });
        return newData
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(
        function ($) {
            $('.listView').bind('scroll', function () {
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.loadedData.length >= 20) {
                        debounceHandler()
                    }
                }
            })
            setTimeout(function () { }, 1000)
        }
    );


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

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    }

    /*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

    $scope.widthOnScroll = function () {
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
    $(window).resize(function () {
        $scope.$apply(function () {
            $scope.alertWidth = $('.alertWidthonResize').width();
        });

    });

    $(document).ready(function () {
        $(".FixHead").scroll(function (e) {
            var $tablesToFloatHeaders = $('table');
            $tablesToFloatHeaders.floatThead({
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function () {
                var $table = $(this);
                $table.closest('.FixHead').scroll(function (e) {
                    $table.floatThead('reflow');
                });
            });
        })

        $(window).bind("resize", function () {
            setTimeout(function () {
                autoScrollDiv();
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }
        });
    });

    $scope.datePlaceholderValue = "";
    $(document).ready(function () {
        $(".dateTypeKey").keypress(function (event) {
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

        $(".dateTypeKey").focus(function () {
            $scope.datePlaceholderValue = $(this).attr('placeholder');
            $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
        }).blur(function () {
            $(this).attr('placeholder', $scope.datePlaceholderValue);
        });
    });

});
