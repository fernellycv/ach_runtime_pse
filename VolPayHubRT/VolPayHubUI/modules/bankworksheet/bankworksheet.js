angular.module('VolpayApp').controller('bankworksheetCtrl', function($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("Bank Worksheet");
    $scope.constructObj={}
    $scope.getSettlementDataInfo = function(){

    if($scope.settlementInfo.Party == 'ACH COLOMBIA'){
        $scope.getData= {
            "UserID": sessionStorage.UserID,
            "CycleID": $scope.getSettlement.cycle,
            "Entity": $scope.getSettlement.entity,
            "FilterDate": $scope.getSettlement.date
            }
     }
      else{
            $scope.getData= {
            "UserID": sessionStorage.UserID,
            "CycleID": $scope.getSettlement.cycle,
            "Entity": $scope.getSettlement.entity,
            "FilterDate": $scope.getSettlement.date
            }
      }        
      $http.post(BASEURL + '/rest/v2/balances/worksheet/getSettlementDatas',$scope.getData).then(function onSuccess(response) {
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.SettlementData=data;
       
        for(i in $scope.SettlementData['Commissions_Payment']){
            if($scope.SettlementData.Commissions_Payment[i]['commPymt_column_type']=='NET_WORTH'){
                $scope.showInFavorInAgainst=$scope.SettlementData.Commissions_Payment[i]['commPymt_type_def']['VALUE_IN_FAVOR']>0
            }

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
     
    $scope.initCall = function() {
      
        var userID={
            "UserID": sessionStorage.UserID
            
            }
        $http.post(BASEURL + '/rest/v2/balances/worksheet/getSettlementInfos',userID).then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.getSettlement={
                'date': todayDate(),
                'cycle': data.DefaultCycle,
                'entity': data.DefualtEntity
                
            }

            $scope.constructObj= {
                'date': todayDate(),
                'cycle': data.DefaultCycle,
                'entity': data.DefualtEntity
            }



            $scope.settlementInfo=data;
            if(!data.DefaultCycle){
                $scope.alertmsg = data.ResponseCode
                clearInterval(interval)
            }
            else{
                $scope.getSettlementDataInfo()
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

    $scope.initCall()
    

    $scope.activatePicker = function() {
        $('.DatePicker').datepicker({
            language: "es",
            format: "yyyy-mm-dd",
            showClear: true,
            autoclose: true,
            todayHighlight: true
        }).on('dp.change', function(ev) {
            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});
        
    }
    $scope.activatePicker();

    $scope.exportToExcelFlist = function(eve) {

   
       if ($("input[name=excelVal][value='txt']").prop("checked")||$("input[name=excelVal][value='csv']").prop("checked")||$("input[name=excelVal][value='PDF']").prop("checked")||$("input[name=excelVal][value='XLS']").prop("checked")||$("input[name=excelVal][value='XML']").prop("checked")) {
         
                if($("input[name=excelVal][value='txt']").prop("checked")){
                    var url="/rest/v2/balances/worksheet/getSettlementBalancesTXT"
                
                }else if($("input[name=excelVal][value='csv']").prop("checked")){
               
                    var url="/rest/v2/balances/worksheet/getSettlementBalancesCSV"
                 
                }else if($("input[name=excelVal][value='PDF']").prop("checked")){
                    var url="/rest/v2/balances/worksheet/getSettlementBalancesPDF"
                   
                }else if($("input[name=excelVal][value='XLS']").prop("checked")){
                    var url="/rest/v2/balances/worksheet/getSettlementBalancesXLS"
                }else if($("input[name=excelVal][value='XML']").prop("checked")){
                    var url="/rest/v2/balances/worksheet/getSettlementBalancesXML"
                }
               
                $http.post(BASEURL + url, $scope.getData).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                   
                    $scope.Details = 'data:application/octet-stream;base64,' + data['Data'];
                                        
                    var dlnk = document.getElementById('dwnldLnk');
                    dlnk.href = $scope.Details;

            
            if(data['FileName']){
                data['filename'] = data['FileName']
            }

             if($("input[name=excelVal][value='txt']").prop("checked")){
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download ='sanction_report.txt';
                }
             
            }else if($("input[name=excelVal][value='csv']").prop("checked")){                

                var res = atob(data["Data"]);                
                var universalBOM = "\uFEFF";
                $scope.Details ="data:text/csv; charset=utf-8," +  encodeURIComponent(universalBOM+res);                
                dlnk.href = $scope.Details;
                
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download = 'report.csv';
                }
             
            }else if($("input[name=excelVal][value='PDF']").prop("checked")){
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download = 'report.pdf';
                }
             
            }else if($("input[name=excelVal][value='XLS']").prop("checked")){
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download = 'report.xls';
                }
             
            }else if($("input[name=excelVal][value='XML']").prop("checked")){
                if(data['filename']){
                    dlnk.download =  data['filename'];
                }else{
                    dlnk.download = 'report.xml';
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
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            // errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
        
      
      }
    }

    $scope.getsettlementInfo = function(){
      $scope.getSettlement.date =  $scope.constructObj.date;
      $scope.getSettlement.cycle =  $scope.constructObj.cycle;
      $scope.getSettlement.entity =  $scope.constructObj.entity.replace("\\n", "").trim();

      if($scope.getSettlement.cycle){
            $scope.alertmsg = ""
            $scope.getSettlementDataInfo()
            if($scope.getSettlement.cycle != $scope.settlementInfo.DefaultCycle || $scope.getSettlement.entity != $scope.settlementInfo.DefualtEntity){
                $scope.startinterval=true;    
            }
            else{
                    $scope.startinterval=false;
                    clearInterval(interval);
                    $scope.repeatInterval()
            }
        }
    
    }


    var interval = "";
    $scope.repeatInterval = function(){
    
    clearInterval(interval);
    interval = setInterval(function() {
        if(sessionStorage.menuSelection == null)
            {
                clearInterval(interval)
            }
        else{
            var menuselected =JSON.parse(sessionStorage.menuSelection)
            
            if(menuselected.subVal != 'BankWorksheet' || $scope.startinterval){
                clearInterval(interval)
            }
            else{
                $scope.getSettlementDataInfo()
            }
        }
    
    }, 10000)
    }

$scope.repeatInterval()
});
