angular.module('VolpayApp').controller('QueryRejectedMessagesCtrl', function ($scope, $timeout, $http, $filter, $state, $window, $location) {

  //Init Form 
  $scope.initFormat = function () {
    $scope.date = moment(new Date()).format('YYYY-MM-DD');
    $scope.CurrentPage = 1;
    $scope.CurrentLimit = 20;
    $scope.TotalCount = 0;
    $scope.totalQueryCount = 0;
    $scope.QueryRejectedMsgData = [];
    $scope.QueryRejectedMsg = [
      {
        "label": "QueryRejectedMessages.CUS",
        "fieldName": "State",
        "visible": true,
        "searchVisible": true,
        "type": "text"
      },
      {
        "label": "QueryRejectedMessages.RejectionReason",
        "fieldName": "State",
        "visible": true,
        "searchVisible": true,
        "type": "text"
      },
      {
        "label": "QueryRejectedMessages.DateAndTime",
        "fieldName": "State",
        "visible": true,
        "searchVisible": true,
        "type": "text"
      }
    ];
  }
  $scope.initFormat();

  $scope.expandSelected = function (person) {
    $scope.QueryRejectedMsgData.forEach(function (val) {
      val.expanded = false;
    });
    if (person) {
      person.expanded = true;
    }
  }

  $scope.getParseValue = function (data) {
    return JSON.parse(data);
  }

  // You can still access the clipboard.js event
  $scope.onSuccess = function (e, id) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  };

  $scope.onError = function (e, id) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  }

  $scope.downloadRejectecMsg = function (input, name) {
    const text = document.getElementById(input).innerHTML;
    const filename = (JSON.parse(name)).header.messageUid;

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //IE11 and the legacy version Edge support
      console.log("IE & Edge");
      let blob = new Blob([text], { type: "text/html" });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // other browsers
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      // element.attr('target','_self');
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  function GetQeuryRejectedMsgData(page, limit, data) {
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
    if ($scope.date != null) {
      $http.post(BASEURL + '/rest/v2/ach/psetrxrejected/readall', obj).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers();
        var config = response.config;

        $scope.QueryRejectedMsgData = $scope.QueryRejectedMsgData.concat(data);
        $scope.totalQueryCount = headers.totalcount;
        $scope.TotalCount = $scope.QueryRejectedMsgData.length;
        $scope.isLoading = false;
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
        }]

        $scope.isLoading = false;
        // $scope.alerts = [{
        //   type: 'danger',
        //   msg: $filter('translate')('ADFQueryConsolidatedByState.MessageWhenQueryRecordsNotFound')
        // }];
        setTimeout(function () {
          $('.alert-danger').hide()
        }, 2000)
      });
    }
  }

  $scope.loadMore = function () {
    let data = { "date": $scope.date };
    if ($scope.CurrentPage * $scope.CurrentLimit <= $scope.TotalCount) {
      $scope.CurrentPage += 1;
      GetQeuryRejectedMsgData($scope.CurrentPage, $scope.CurrentLimit, data);
    } else if ($scope.CurrentPage == 1 && $scope.TotalCount == 0) {
      GetQeuryRejectedMsgData($scope.CurrentPage, $scope.CurrentLimit, data);
    }
  }

   //Query Function
   $scope.searchByDate = function () {
    $scope.CurrentPage = 1;
    $scope.CurrentLimit = 20;
    $scope.TotalCount = 0;
    $scope.totalQueryCount = 0;
    $scope.QueryRejectedMsgData = [];
    $scope.loadMore();
  }

  $scope.refresh = function () {
    $scope.initFormat();
    $scope.loadMore();
  }

});
