angular.module('VolpayApp').controller('sanctioncycleCtrl', function ($scope, $translate,$rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {

    $scope.newPermission = GetPermissions("Sanction Calculator By Cycle");
    $scope.constructObj={}
  
	
    $scope.$on('langChangeEvent', function () {  
        if(multilingualSearchData && multilingualSearchData.multilingualenable){     
            $('.lang').attr('checked', false)      
            $rootScope.languageselected=sessionStorage.sessionlang 
     
            if (sessionStorage.sessionlang == 'en_US') {
                $('#lang_1').prop('checked', true)
            } else if (sessionStorage.sessionlang == 'es_ES'){
                $('#lang_2').prop('checked', true)
            } else {
                $('#lang_1').prop('checked', true)
            }
        }
    });
    $rootScope.languageselected=sessionStorage.sessionlang 

    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "SUNDAY";
    weekday[1] = "MONDAY";
    weekday[2] = "TUESDAY";
    weekday[3] = "WEDNESDAY";
    weekday[4] = "THURSDAY";
    weekday[5] = "FRIDAY";
    weekday[6] = "SATURDAY";
  
    $scope.Currentday = weekday[d.getDay()];
    $scope.Calculatedisabled=false

    $scope.getCloseTableInfo = function () {
      
         var TotalAmount = shedString($scope.constructObj.Amount, ',');
   
        $scope.input = {
            "Amount": TotalAmount,
            "CalculationDay": $scope.Currentday,
            "UserRoleID": sessionStorage.ROLE_ID,
            "Additional":   $rootScope.languageselected
        }
        $http.post(BASEURL + '/rest/v2/calculation/transactioncredit/getCalculatedDatas', $scope.input).then(function onSuccess(response) {
            var data = response.data;
            //$scope.totalData = response.data;
            //var status = response.status;
            //var statusText = response.statusText;
            //var headers = response.headers;
            //var config = response.config;
            $scope.closeSheetData=true
            if(data['ResponseCode']=='200'){
                $scope.closesheetInfo = data;
                $rootScope.closeSheetDatadownload= $scope.closesheetInfo
            }else{
            
                $scope.Calculatedisabled=true
                $scope.closeSheetData=false
                $scope.alerts = [{
                    type: 'danger',
                    Errorinfo: data['ResponseCode'],
                    msg: data['Description']
                }];
            }
			
          


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


    $('#Amount').on('change click keyup input paste',(function (event) {
        $(this).val(function (index, value) {
            return value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
    }));


    var shedString = (string, separator) => {
        //we split the string and make it free of separator
        var separatedArray = string.split(separator);
        //we join the separatedArray with empty string
        var separatedString = separatedArray.join("");
        return separatedString;
     }





    $scope.exportToExcelFlist = function (eve) {


    
        if ($("input[name=excelVal][value='txt']").prop("checked")||$("input[name=excelVal][value='csv']").prop("checked")||$("input[name=excelVal][value='pdf']").prop("checked")||$("input[name=excelVal][value='xls']").prop("checked")) {


            if ($("input[name=excelVal][value='txt']").prop("checked")) {
                var url = "/rest/v2/calculation/transactioncredit/getCalculatedDatasTXT"

            } else if ($("input[name=excelVal][value='csv']").prop("checked")) {

                var url = "/rest/v2/calculation/transactioncredit/getCalculatedDatasCSV"

            }else if ($("input[name=excelVal][value='pdf']").prop("checked")) {

                var url = "/rest/v2/calculation/transactioncredit/getCalculatedDatasPDF"
            }else if ($("input[name=excelVal][value='xls']").prop("checked")) {

                var url = "/rest/v2/calculation/transactioncredit/getCalculatedDatasXLS"

            }
            $http.post(BASEURL + url,$rootScope.closeSheetDatadownload).then(function onSuccess(response) {
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
                        dlnk.download = 'sanctioncycle_report.txt';
                    }

                } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'sanctioncycle_report.csv';
                    }

                }else{
                    if (data['filename']) {
                        dlnk.download = data['filename'];
                    } else {
                        dlnk.download = 'sanctioncycle_report.csv';
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



    $scope.getInitialDataFeed = function () {
      $scope.Calculatedisabled=true
        $scope.getCloseTableInfo()
       
    }

    $scope.resetAmount = function () {
        // $('#alermsgs').hide()
        $('.alert').hide()
        $scope.constructObj={}
        $scope.closesheetInfo={}
        $scope.closeSheetData=false
        $scope.Calculatedisabled=false
    }

    $scope.refresh = function () {
        $scope.Calculatedisabled=false
        $scope.getCloseTableInfo()
    }

  


});
