angular.module('VolpayApp').controller('reportGenerateCtrl', function($scope, $rootScope, $http, $location, $timeout, $filter, GlobalService, EntityLockService, errorservice) {
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 
    $http.get(BASEURL + RESTCALL.ReportIDDropVal).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.reportIdVal = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });

    //   $scope.lenthofData = 20;

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    function rawOutInject(Arr123) {
        for (i = 0; i < Arr123.length; i++) {

            Arr123[i].rawOutPDF = convertXml2JSon(Arr123[i].ReturnStack).ResponseReportMessage.ReportInfo.rawOutFile
        }
        return Arr123;
    }

    $scope.fetchReportLogs = function() {

        var sortObj = {
            "QueryOrder": [{
                "ColumnName": "GeneratedDate",
                "ColumnOrder": "Desc"
            }],
            "start": 0,
            "count": 20
        };

        var sortObj = constructQuery(sortObj);
        // var sortObj = {}
        $http({
            url: BASEURL + "/rest/v2/reports/log/readall",
            method: "POST",
            async: false,
            cache: false,
            data: sortObj,
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

            // $scope.items = rawOutInject(data);
            $scope.items = data;
            $scope.lenthofData = data;
            $scope.totalCount = headers().totalcount;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            /* if (status == 401) {
            	
            } else { */
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            // }
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $(document).ready(function() {
        customDateRangePicker('startDate1', 'endDate1');
        $scope.focusInfn = function(data) {
            $(sanitize('#' + data)).focus()
        }
    })
    var outputformat = "";
    $scope.RG = {};
    // $scope.localreportData = [];
    //$scope.RG.OutputFormat = "PDF";

    $scope.generateReport = function(RG) {
        var startDate = new Date(RG.startDate);
        startDate.setMinutes(startDate.getMinutes() + 330 + startDate.getUTCDate());
        var endDate = new Date(RG.endDate);
        endDate.setMinutes(endDate.getMinutes() + 330 + endDate.getUTCDate());

        // $scope.localreportData.push(RG)

        outputformat = $scope.RG.OutputFormat;
        var RG11 = {}
        if ((new Date(startDate) !== "Invalid Date" && !isNaN(new Date(startDate))) && (new Date(endDate) !== "Invalid Date" && !isNaN(new Date(endDate)))) {

            RG11['ReportInfo'] = {
                //"UserToken": "",
                //"CustomId": RG.CustomId,
                "ReportClass": RG.ReportClass,
                "User": sessionStorage.UserID,
                "OutputFormat": RG.OutputFormat,
                "OutputMethod": [{
                    "Type": "BOTH",
                    "OutputPath": ""
                }]
            };
            RG11['GenerationFilters'] = {
                "Filter": [{
                        "Name": "startDate",
                        "Type": "string",
                        "Value": startDate
                    },
                    {
                        "Name": "endDate",
                        "Type": "string",
                        "Value": endDate
                    }
                ]

            };
            // RG11['ColumnFilters'] = [{
            //     "Colum": [{
            //         "Name": "",
            //         "Enabled": true,
            //         "Value": ""
            //     }]
            // }];

        } else {

            RG11['ReportInfo'] = {
                //"UserToken": "",
                //"CustomId": RG.CustomId,
                "ReportClass": RG.ReportClass,
                "User": sessionStorage.UserID,
                "OutputFormat": RG.OutputFormat,
                "OutputMethod": [{
                    "Type": "BOTH",
                    "OutputPath": ""
                }]
            }
        }

        if (RG11) {

            $http({
                url: BASEURL + RESTCALL.ReportsGenerate,
                method: "POST",
                async: false,
                cache: false,
                data: RG11,
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

                $scope.items = data;
                $scope.alerts = [{
                    type: 'success',
                    msg: 'Report generated successfully'
                }];

                $timeout(function() {
                    $('.alert-success').hide();
                }, 4000)
                $timeout(function() {
                    $scope.RG = {};
                    //$scope.RG.OutputFormat = "PDF";
                }, 1000)

                $scope.fetchReportLogs();
                //$(".alert-danger").alert("close");
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
    }

    function GetIE() {
        var sAgent = window.navigator.userAgent;
        var Idx = sAgent.indexOf("MSIE");

        if (Idx > 0)
            return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
        else if (!!navigator.userAgent.match(/Trident\/7\./))
            return 11;
        else
            return 0; //It is not IE
    }

    $scope.fetchReportLogs();

    $scope.Download = function(reports) {
            if (reports.OutputFormat) {
                outputformat = reports.OutputFormat
            } else {
                outputformat = 'PDF'
            }

            if (outputformat == "XLS") {
                outputformat = "XLSX";
            }
            var format = ""
            $scope.pdfName = $filter('dateFormat')(reports.GeneratedDate) + '_' + reports.ReportID + '_' + reports.UserName + '.' + outputformat.toLowerCase(); //'.pdf'

            $http({
                url: BASEURL + "/rest/v2/reports/download",
                method: "POST",
                async: false,
                cache: false,
                data: {
                    "FolioID": reports.FolioID
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

                if (GetIE() > 0) {
                    $scope.alerts = [{
                        type: 'danger',
                        msg: "This feature is not supported by Internet Explorer"
                    }];
                    $timeout(function() {
                        $(".alert").hide();
                    }, 4000)

                } else {
                    if (outputformat == "PDF") {

                        format = 'data:application/octet-stream;base64,' + data.ReportInfo[0].rawOutFile;
                    } else {

                        if (data.ReportInfo[0].rawOutFile) {
                            var byteCharacters = atob(data.ReportInfo[0].rawOutFile);
                            var byteNumbers = new Array(byteCharacters.length);
                            for (var i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            var byteArray = new Uint8Array(byteNumbers);
                            var a = window.document.createElement('a');
                            a.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'text/plain' }));
                            a.download = $scope.pdfName;
                            // Append anchor to body.
                            document.body.appendChild(a);
                            a.click();
                            // Remove anchor from body
                            document.body.removeChild(a);
                        }


                    }
                    var dlnk = document.getElementById('dwnldLnk');
                    dlnk.href = format;
                    dlnk.download = $scope.pdfName;
                    dlnk.click();
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
        }
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

    var len = 20;
    $scope.loadMore = function() {

        var sortObj = {
            "QueryOrder": [{
                "ColumnName": "GeneratedDate",
                "ColumnOrder": "Desc"
            }],
            "start": len,
            "count": 20
        };
        $scope.loadMorecalled = true;

        sortObj = constructQuery(sortObj);

        $http({
            url: BASEURL + "/rest/v2/reports/log/readall",
            method: "POST",
            async: false,
            cache: false,
            data: sortObj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            $scope.lenthofData = response.data;
            if (response.data.length > 0) {
                $scope.items = $scope.items.concat(response.data)
                len = len + 20;
            }
        })
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);
    //$(document).ready(function(){
    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                    $scope.widthOnScroll();
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                        if ($scope.lenthofData.length >= 20) {
                            debounceHandler()
                                //$scope.loadMore();
                        }
                    }
                })
                //setTimeout(function(){},1000)

        }
    );
    //})
});
