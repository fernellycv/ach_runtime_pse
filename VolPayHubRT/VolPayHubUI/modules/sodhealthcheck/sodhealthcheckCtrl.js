angular.module('VolpayApp').controller('sodhealthcheckCtrl', function($scope, $http, $location, $timeout, $filter, GlobalService, errorservice, datepickerFaIcons) {

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


    function uniqueKeyVals(arr, prop) {
        return arr.map(function(e) {
            return e[prop];
        }).filter(function(e, i, a) {
            return i === a.indexOf(e);
        });
    }

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    $scope.generateSodHealthChecks = function(dateobject) {

        var startvalue = $("#datetimepicker1").val();
        var endvalue = $("#datetimepicker2").val();
        $http({
            url: BASEURL + "/rest/v2/sodhealthcheck/" + startvalue + "/" + endvalue,
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

            $scope.GetDatas = data;
            var Uniq_Event_Names = uniqueKeyVals($scope.GetDatas, 'InstanceID');
            $scope.data_basedon_Instances = [];
            for (i in Uniq_Event_Names) {
                var InsIdArray = [];
                for (k in $scope.GetDatas) {
                    if ($scope.GetDatas[k]['InstanceID'] == Uniq_Event_Names[i]) {
                        InsIdArray.push($scope.GetDatas[k]);
                    }
                }
                $scope.data_basedon_Instances.push(InsIdArray);
            }

            $("#datetimepicker1").val("");
            $("#datetimepicker2").val("");
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            /* if (status == 401) {
            	errorservice.ErrorMsgFunction(config, $scope, $http)
            } else { */
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            // }
        });

    };

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

        }, function(error) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
        })
    };

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

    $(document).ready(function() {

        $('#datetimepicker1').datetimepicker({
            useCurrent: false,
            showClear: true,
            icons: datepickerFaIcons.icons
            
        });
        $('#datetimepicker2').datetimepicker({
            useCurrent: false,
            showClear: true,
            icons: datepickerFaIcons.icons
        });

        $("#datetimepicker1").on("dp.change", function(e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });

        $("#datetimepicker2").on("dp.change", function(e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });
    })


});