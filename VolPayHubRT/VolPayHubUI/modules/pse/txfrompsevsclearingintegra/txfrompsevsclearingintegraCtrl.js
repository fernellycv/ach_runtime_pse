angular
  .module("VolpayApp")
  .controller(
    "txfrompsevsclearingintegraCrtl",
    function ($scope, $timeout, $http, $filter) {
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
            daysOfWeekDisabled: [0, 6],
          })
          .on("changeDate", function (selected) {
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
          })
          .on("changeDate", function (selected) {
            if (selected.date) {
              //   FromEndDate = new Date(selected.date.valueOf());
              //   FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
              //   $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
            }
          });
        $(sanitize("#" + eDate)).datepicker("setStartDate", startDate);
        /*$('#'+eDate).on('keyup',function(){
        if(!$(this).val()){
        $(sanitize('#' + sDate)).datepicker('setEndDate', new Date());
        }
        })*/
      };
      $scope.customDateRangePicker("ClearingDate", "ClearingEndDate");

      //Format
      $scope.initFromat = function () {
        $scope.formats = [
          {
            actualValue: "CSV",
            displayValue: "CSV",
          },
          {
            actualValue: "EXCEL",
            displayValue: "EXCEL",
          },
        ];

        $scope.TxFromPSEvsClearingIntegraData = {};
        $scope.TxFromPSEvsClearingIntegraData.FormatToExporttheFile = $scope.formats[0].actualValue;
        $scope.TxFromPSEvsClearingIntegraData.ClearingDate = new Date().toLocaleDateString('en-ZA');
      };

      $scope.TxFromPSEvsClearingIntegra = function (payload) {
        var date = {
          DATE_M: payload.ClearingDate,
        };
        if (payload.FormatToExporttheFile == "CSV") {
          $http
            .post(BASEURL + "/rest/v2/MsgVsNacha/csv", date)
            .then(function onSuccess(response) {
              var data = response.data;
              $scope.dat = data.Data;

              var data = response.data;
              var res = atob(data.Data);
              var universalBOM = "\uFEFF";
              $scope.Details =
                "data:text/csv; charset=utf-8," +
                encodeURIComponent(universalBOM + res);
              var dlnk = document.getElementById("dwnldLnk");
              dlnk.href = $scope.Details;
              dlnk.download = data.FileName;
              dlnk.download = dlnk.download;
              dlnk.click();
              $scope.alerts = [
                {
                  type: "success",
                  msg: $filter("translate")("Inbox.DownloadedSuccessfully"),
                },
              ];
            })
            .catch(function onError(response) {
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
        } else if (payload.FormatToExporttheFile == "EXCEL") {
          $http
            .post(
              BASEURL + "/rest/v2/MsgVsNacha/xls",
              date
            )
            .then(function onSuccess(response) {
              var data = response.data;
              $scope.dat = data.Data;

              var data = response.data;

              $scope.Details =
                "data:application/octet-stream;base64," + $scope.dat;

              var dlnk = document.getElementById("dwnldLnk");
              dlnk.href = $scope.Details;
              dlnk.download = data.FileName;
              dlnk.click();
              $scope.alerts = [
                {
                  type: "success",
                  msg: $filter("translate")("Inbox.DownloadedSuccessfully"),
                },
              ];
            })
            .catch(function onError(response) {
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
      };
      $scope.initFromat();
    }
  );
