angular
  .module("VolpayApp")
  .controller(
    "receivedTransactionPSECtrl",
    function ($scope, $rootScope, $filter, $translate, $timeout, $http) {
      $scope.init = function () {
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
            actualValue: "Excel",
            displayValue: "EXCEL",
          },
        ];

        $scope.Cycle = [1, 2, 3, 4, 5];

        $scope.receivedTxnsPSEData = {};
        $scope.receivedTxnsPSEData.FormatToExporttheFile =
          $scope.formats[0].actualValue;
        $scope.authenticationObject = $rootScope.dynamicAuthObj;
        // $('select[name=SourceEntityoftheTransaction]').empty().val(null).trigger("change");
        // $('select[name=DestinationEntityoftheTransaction]').empty().val(null).trigger("change");
      };
      $scope.init();

      $scope.reset = function () {
        $timeout(() => {
          $("select[name=SourceEntityoftheTransaction]")
            .val(null)
            .trigger("change");
          $("select[name=DestinationEntityoftheTransaction]")
            .val(null)
            .trigger("change");
          $("select[name=CycleoftheClearing]").val(null).trigger("change");
          delete $scope.receivedTxnsPSEData["CycleoftheClearing"];
          delete $scope.receivedTxnsPSEData["SourceEntityoftheTransaction"];
          delete $scope.receivedTxnsPSEData[
            "DestinationEntityoftheTransaction"
          ];
          $scope.init();
        }, 10);
        // location.reload();
      };

      $(document).ready(function () {
        $scope.remoteDataConfig = function () {
          var pageLimitCount = 1000;
          var add_method = "GET";
          $(".select2Dropdown").each(function () {
            $(this).select2({
              ajax: {
                url: function (params) {
                  if (
                    $(this).attr("name") == "SourceEntityoftheTransaction" ||
                    $(this).attr("name") == "DestinationEntityoftheTransaction"
                  ) {
                    $scope.links =
                      BASEURL + "/rest/v2/ach/report/custom/getbanks";
                    $scope.showmode = 1;
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
            });
          });
        };

        $scope.$on("langChangeEvent", function () {
          $scope.remoteDataConfig();
        });

        $scope.remoteDataConfig();

        function ValidationPleaseHolder(node) {
          if (node != "Tiporeporte") {
            if (
              (node == "SourceEntityoftheTransaction" &&
                sessionStorage.getItem("ROLE_ID").slice(0, 2) != "FE") ||
              (node == "DestinationEntityoftheTransaction" &&
                sessionStorage.getItem("ROLE_ID").slice(0, 2) != "FE")
            ) {
              return $filter("translate")("Placeholder.All").indexOf(
                "Placeholder"
              ) != -1
                ? sessionStorage.sessionlang == "en_US"
                  ? "All"
                  : "Todas"
                : $filter("translate")("Placeholder.All") || "Todas";
            }
          }
          return $filter("translate")("Placeholder.Select") || "Seleccionar";
        }
      });

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

      $scope.createReceivedTxnsPSE = function (payload) {
        if (!angular.equals({}, payload)) {
          $scope.backupNewData = $scope.cleantheinputdata(payload);
          if (
            $scope.backupNewData.FormatToExporttheFile == "TXT" ||
            $scope.backupNewData.FormatToExporttheFile == "CSV"
          ) {
            $http
              .post(
                BASEURL + "/rest/v2/ach/report/psetransactions/txt",
                $scope.backupNewData
              )
              .then(function onSuccess(response) {
                var data = response.data;
                $scope.dat = data.Data;

                var data = response.data;

                if ($scope.backupNewData.FormatToExporttheFile == "CSV") {
                  var res = atob(data.Data);
                  var universalBOM = "\uFEFF";
                  $scope.Details =
                    "data:text/csv; charset=utf-8," +
                    encodeURIComponent(universalBOM + res);
                } else {
                  $scope.Details =
                    "data:application/octet-stream;base64," + $scope.dat;
                }

                var dlnk = document.getElementById("dwnldLnk");
                dlnk.href = $scope.Details;
                dlnk.download = data.FileName;

                if ($scope.backupNewData.FormatToExporttheFile == "TXT") {
                  dlnk.download = dlnk.download + ".txt";
                }
                if ($scope.backupNewData.FormatToExporttheFile == "CSV") {
                  dlnk.download = dlnk.download + ".csv";
                }

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
          } else if ($scope.backupNewData.FormatToExporttheFile == "Excel") {
            $http
              .post(
                BASEURL + "/rest/v2/ach/report/psetransactions/xls",
                $scope.backupNewData
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
          } else if ($scope.backupNewData.FormatToExporttheFile == "PDF") {
            $http
              .post(
                BASEURL + "/rest/v2/ach/report/psetransactions/pdf",
                $scope.backupNewData
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
        }
      };

      $scope.activatePicker = function () {
        var prev = null;
        var FromEndDate = new Date();
        $(".datepicker1").datepicker({
          endDate: FromEndDate,
          format: "yyyy",
          viewMode: "years",
          minViewMode: "years",
          autoclose: true,
          changeYear: true,
        });
      };

      $scope.activatePicker();

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
      };

      $scope.customDateRangePicker("ClearingDate", "ClearingEndDate");
    }
  );
