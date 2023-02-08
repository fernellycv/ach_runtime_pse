angular
  .module("VolpayApp")
  .controller(
    "commissionsCtrl",
    function (
      $scope,
      $rootScope,
      $timeout,
      PersonService,
      $location,
      $state,
      $http,
      $translate,
      GlobalService,
      bankData,
      $filter,
      LogoutService,
      CommonService,
      RefService,
      errorservice,
      EntityLockService,
      GetPermissions
    ) {
      $scope.newPermission = GetPermissions("Commissions");
      $scope.constructObj = {
        InitialDate: todayDate(),
        FinalDate: todayDate(),
      };
      $scope.cycleDate = todayDate();
      $scope.todayDate = todayDate();

      $scope.constructdate = todayDate();

      $scope.isEditable = false;
      $scope.sumbitCommisions = false;
      $scope.removeindex = true;
      $scope.methodPut = true;
      $scope.choices = [];
      $scope.disabled = {};
      $scope.showtable = false;
      $scope.UserId = sessionStorage.ROLE_ID;

      $scope.getcommisionsInfo = function () {
        $scope.enableView = false;
        $scope.initCall();
      };

      $scope.initCall = function () {
        $http
          .post(
            BASEURL + "/rest/v2/commissions/search/readall",
            $scope.constructObj
          )
          .then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            if (data.length == 0) {
              $scope.showtable = false;
            } else {
              $scope.showtable = true;
            }
            $scope.getCommisionsData = data;
            for (let i = 0; i < $scope.getCommisionsData.length; i++) {
              //$scope.selectedCycle = $scope.getCommisionsData[i].Cycle;
              $scope.ProcessDate = $scope.cycleDate;
              $scope.status = $scope.getCommisionsData[i].Status;
            }
          })
          .catch(function onError(response) {
            $scope.ProcessDate = $scope.cycleDate;
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.showtable = false;
            $scope.alerts = [
              {
                type: "danger",
                msg: response.data.error.message,
              },
            ];
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });

        $http
          .get(BASEURL + "/rest/v2/commissions/party/readall")
          .then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.parties = data;
          })
          .catch(function onError(response) {
            // Handle error

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [
              {
                type: "danger",
                msg: data.responseMessage,
              },
            ];
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.initCall();

      $scope.refresh = function () {
        $scope.showtable = false;
        $scope.enableView = false;
        $scope.constructObj = {
          InitialDate: todayDate(),
          FinalDate: todayDate(),
        };
        setTimeout(function () {
          $(".alert-success").hide();
          $(".alert-danger").hide();
        }, 2000);

        $scope.initCall();
      };

      $scope.checkStatus = function (chkobj) {
        //    $scope.showtable = false;
        $scope.enableView = false;

        $("input:checkbox").on("click", function () {
          var $box = $(this);
          if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
          } else {
            $scope.checkedobj = {};
            $box.prop("checked", false);
          }
        });
        $scope.checkedobj = chkobj;
      };

      $scope.viewCommisions = function () {
        if (Object.keys($scope.checkedobj).length != 0) {
          $scope.getCommisionscycle =
            $scope.checkedobj.Comisiones.EntityDetails;
          $scope.selectedCycle = $scope.checkedobj.Cycle.substring(9, 10);
          $scope.cycleDate = $scope.checkedobj.ProcessDate;
          $scope.showtable = true;
          $scope.enableView = true;
          $scope.choices = [];
          $scope.entity = [];
          $scope.Infavor = [];
          $scope.Against = [];
          $scope.methodPut = true;
          for (var i = 0; i < $scope.getCommisionscycle.length; i++) {
            $scope.choices.push({ id: i });
            $scope.entity.push($scope.getCommisionscycle[i].FinancialEntity);
            $scope.Infavor.push($scope.getCommisionscycle[i].ValueInFavor);
            $scope.Against.push($scope.getCommisionscycle[i].ValueAgainst);
          }
        }
        $scope.oldCycle = $scope.checkedobj.Cycle;
      };

      $scope.requestApproval = function () {
        $scope.isEditable = false;
        $("#requestApprovals").modal("show");
      };

      $scope.AcceptApproval = function () {
        var Acceptrequest = {
          ProcessDate: $scope.checkedobj["ProcessDate"],
          Status: $scope.checkedobj["Status"],
          Cycle: $scope.checkedobj["Cycle"],
          Comisiones: {
            Total: $scope.sumInFavor,
            Diferencia: "0",
            EntityDetails: $scope.getCommisionscycle,
          },
        };
        $http
          .put(BASEURL + "/rest/v2/commissions/approvalrequest", Acceptrequest)
          .then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            // $scope.EnableBtns = true;
            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];

            $scope.showtable = false;
            $scope.initCall();
            setTimeout(function () {
              $scope.refresh();
              $scope.checkedobj = {};
            }, 100);
          })
          .catch(function onError(response) {
            // Handle error
            var data = response.data;

            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [
              {
                type: "danger",
                msg: data.responseMessage,
              },
            ];
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });

        $("#requestApprovals").modal("hide");
      };

      $scope.enableEdit = function () {
        $scope.isEditable = true;
        //$scope.choices= [];
        $scope.methodPut = true;
        $scope.enableAction = true;
      };

      $scope.withdrawRequest = function () {
        var withquery = {
          ProcessDate: $scope.checkedobj["ProcessDate"],
          Status: $scope.checkedobj["Status"],
          Cycle: $scope.checkedobj["Cycle"],
          Comisiones: {
            Total: $scope.sumInFavor,
            Diferencia: "0",
            EntityDetails: $scope.getCommisionscycle,
          },
        };
        $http
          .put(BASEURL + "/rest/v2/commissions/withdrawrequest", withquery)
          .then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.showtable = false;
            $scope.initCall();
            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];
            setTimeout(function () {
              $scope.refresh();
              $scope.checkedobj = {};
            }, 100);
          })
          .catch(function onError(response) {
            // Handle error

            var data = response.data;

            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [
              {
                type: "danger",
                msg: data.responseMessage,
              },
            ];
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.checkinfo = function (eve, index, Infavor) {
        var eleman = document.getElementById("ValueAgainst_" + [index]);
        if (Infavor[index].length) {
          $scope.Against[index] = "0";
          eleman.setAttribute("disabled", true);
        } else {
          eleman.removeAttribute("disabled");
          $scope.Against[index] = "";
        }
      };

      $scope.checkinfos = function (eve, index, Infavor) {
        var eleman = document.getElementById("ValueInfavor_" + [index]);
        if (Infavor[index].length) {
          $scope.Infavor[index] = "0";
          eleman.setAttribute("disabled", true);
        } else {
          $scope.Infavor[index] = "";
          eleman.removeAttribute("disabled");
        }
      };

      $scope.approver = function () {
        var approvequery = {
          ProcessDate: $scope.checkedobj["ProcessDate"],
          Status: "ACCEPTED",
          Cycle: $scope.checkedobj["Cycle"],
        };
        $http
          .put(BASEURL + "/rest/v2/commissions/approvecommission", approvequery)
          .then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $("#AcceptApprovals").modal("hide");
            $scope.showtable = false;
            $scope.initCall();
            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];
            setTimeout(function () {
              $(".alert-success").hide();
            }, 2000);
            $scope.refresh();
            $scope.checkedobj = {};
          })
          .catch(function onError(response) {
            // Handle error

            var data = response.data;

            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $("#AcceptApprovals").modal("hide");
            $scope.alerts = [
              {
                type: "danger",
                msg: data.responseMessage,
              },
            ];
            setTimeout(function () {
              $(".alert-danger").hide();
            }, 2000);
          });
      };

      $scope.reject = function () {
        var Rejectquery = {
          ProcessDate: $scope.checkedobj["ProcessDate"],
          Status: "REJECTED",
          Cycle: $scope.checkedobj["Cycle"],
        };
        $http
          .put(BASEURL + "/rest/v2/commissions/approvecommission", Rejectquery)
          .then(function onSuccess(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $("#RejectApprovals").modal("hide");
            $scope.showtable = false;
            $scope.initCall();
            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];
            $scope.refresh();
            $scope.checkedobj = {};
            setTimeout(function () {
              $(".alert-success").hide();
            }, 2000);
          })
          .catch(function onError(response) {
            // Handle error

            var data = response.data;

            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $("#RejectApprovals").modal("hide");
            $scope.alerts = [
              {
                type: "danger",
                msg: data.responseMessage,
              },
            ];

            setTimeout(function () {
              $(".alert-danger").hide();
            }, 2000);
          });
      };

      $scope.sumOfValueinfavor = function () {
        if ($scope.getCommisionscycle) {
          $scope.sumInFavor = 0;
          for (let i = 0; i < $scope.getCommisionscycle.length; i++) {
            if ($scope.getCommisionscycle[i].ValueInFavor) {
              $scope.sumInFavor += JSON.parse(
                $scope.getCommisionscycle[i].ValueInFavor
              );
            }
          }
          return $scope.sumInFavor;
        }
      };
      $scope.sumOfValueagainst = function () {
        if ($scope.getCommisionscycle) {
          $scope.sumAgainst = 0;
          for (let i = 0; i < $scope.getCommisionscycle.length; i++) {
            if ($scope.getCommisionscycle[i].ValueAgainst) {
              $scope.sumAgainst += JSON.parse(
                $scope.getCommisionscycle[i].ValueAgainst
              );
            }
          }
          return $scope.sumAgainst;
        }
      };

      $scope.savechanges = function () {
        $scope.enableAction = false;
        $scope.getCommisionscycle = [];
        for (var i = 0; i < $scope.choices.length; i++) {
          var tmpObj = {
            FinancialEntity: $scope.entity[i],
            ValueInFavor: $scope.Infavor[i],
            ValueAgainst: $scope.Against[i],
          };
          $scope.getCommisionscycle.push(tmpObj);
        }
        /*if (
          !$scope.methodPut &&
          $scope.choices.length == $scope.entity.length &&
          $scope.limitField
        ) {
          if (
            $scope.entity[$scope.entity.length - 1] &&
            $scope.Infavor[$scope.Infavor.length - 1] &&
            $scope.Against[$scope.Against.length - 1]
          ) {
            var arrObj = {
              FinancialEntity: $scope.entity[$scope.entity.length - 1],
              ValueInFavor: $scope.Infavor[$scope.Infavor.length - 1],
              ValueAgainst: $scope.Against[$scope.Against.length - 1],
            };
            $scope.getCommisionscycle.push(arrObj);
          }
        }*/
        if (
          $scope.sumOfValueinfavor() - $scope.sumOfValueagainst() == 0 &&
          $scope.Infavor.length > 0 &&
          $scope.Against.length > 0
        ) {
          if ($scope.methodPut) {
            var methods = "PUT";
          } else {
            methods = "POST";
          }

          if ($scope.selectedCycle != "" && $scope.cycleDate != "") {
            var savequery = {
              ProcessDate: $scope.cycleDate,
              Status: $scope.statuscreated
                ? $scope.statuscreated
                : $scope.checkedobj["Status"],
              Cycle: $scope.selectedCycle,
              Comisiones: {
                Total: $scope.sumInFavor,
                Diferencia: "0",
                EntityDetails: $scope.getCommisionscycle,
              },
            };
            var cicloold = {
              oldCommission: $scope.oldCycle,
            };
            $http({
              method: methods,
              url: BASEURL + "/rest/v2/commissions/data",
              data: savequery,
              params: methods == "POST" ? "" : cicloold,
            }).then(
              function (response) {
                $scope.isEditable = false;
                $scope.enableView = false;
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                if (methods == "POST") {
                  $scope.showtable = false;
                  //$scope.initCall();
                }

                $scope.alerts = [
                  {
                    type: "success",
                    msg: data.responseMessage,
                  },
                ];

                setTimeout(function () {
                  $scope.refresh();
                  $scope.checkedobj = {};
                }, 100);
              },
              function (response) {
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.enableAction = true;
                $scope.alerts = [
                  {
                    type: "danger",
                    msg: data.responseMessage,
                  },
                ];
                // errorservice.ErrorMsgFunction(config, $scope, $http, status)
              }
            );
          } else {
            $scope.enableAction = true;
            $scope.alerts = [
              {
                type: "danger",
                msg: $filter("translate")("commissions.EmptyValues"),
              },
            ];
          }
        } else {
          $scope.enableAction = true;
          $scope.alerts = [
            {
              type: "danger",
              msg: $filter("translate")("commissions.alertmsg"),
            },
          ];
        }
        $scope.EnableBtns = false;
      };

      $scope.Createrecord = function () {
        $scope.checkedobj = {};
        $scope.enableAction = true;
        $scope.getCommisionscycle = [];
        $scope.choices = [];
        $scope.entity = [];
        $scope.isEditable = true;
        $scope.Infavor = [];
        $scope.Against = [];
        $scope.addChoices();
        $scope.selectedCycle = "";
        $scope.methodPut = false;
        if ($scope.enableView) {
          document.getElementById("checkbox").checked = false;
        }
        $scope.showtable = true;
        $scope.ProcessDate = $scope.cycleDate;
        //$scope.status = "CREATED"
        $scope.statuscreated = "CREATED";
        $scope.enableView = true;
        $scope.hideView = true;
      };

      $scope.activatePicker = function () {
        $(".DatePicker")
          .datepicker({
            language: "es",
            format: "yyyy-mm-dd",
            showClear: true,
            autoclose: true,
            todayHighlight: true,
          })
          .on("dp.change", function (ev) {
            $scope[$(ev.currentTarget).attr("ng-model").split(".")[0]][
              $(ev.currentTarget).attr("name")
            ] = $(ev.currentTarget).val();
          })
          .on("dp.show", function (ev) {})
          .on("dp.hide", function (ev) {});
      };
      $scope.activatePicker();

      $scope.activatePicker2 = function () {
        var date = new Date();
        $(".DatePicker2")
          .datepicker({
            language: "es",
            format: "yyyy-mm-dd",
            showClear: true,
            autoclose: true,
            todayHighlight: true,
            startDate: date,
          })
          .on("dp.change", function (ev) {
            $scope[$(ev.currentTarget).attr("ng-model").split(".")[0]][
              $(ev.currentTarget).attr("name")
            ] = $(ev.currentTarget).val();
          })
          .on("dp.show", function (ev) {})
          .on("dp.hide", function (ev) {});
      };
      $scope.activatePicker2();
      $scope.exportToExcelFlist = function (eve) {
        var exportquery = {
          ProcessDate: $scope.checkedobj["ProcessDate"],
          Status: $scope.checkedobj["Status"],
          Cycle: $scope.checkedobj["Cycle"],
          Comisiones: {
            Total: $scope.sumInFavor,
            Diferencia: "0",
            EntityDetails: $scope.getCommisionscycle,
          },
        };
        if (
          $("input[name=excelVal][value='txt']").prop("checked") ||
          $("input[name=excelVal][value='csv']").prop("checked") ||
          $("input[name=excelVal][value='pdf']").prop("checked") ||
          $("input[name=excelVal][value='xls']").prop("checked")
        ) {
          if ($("input[name=excelVal][value='txt']").prop("checked")) {
            var url = "/rest/v2/commissions/exporttxt/data";
          } else if ($("input[name=excelVal][value='csv']").prop("checked")) {
            var url = "/rest/v2/commissions/exportcsv/data";
          } else if ($("input[name=excelVal][value='pdf']").prop("checked")) {
            var url = "/rest/v2/commissions/exportpdf/data";
          } else if ($("input[name=excelVal][value='xls']").prop("checked")) {
            var url = "/rest/v2/commissions/exportxls/data";
          }

          $http
            .post(BASEURL + url, exportquery)
            .then(function onSuccess(response) {
              // Handle success
              var data = response.data;
              var status = response.status;
              var statusText = response.statusText;
              var headers = response.headers;
              var config = response.config;

              $scope.Details =
                "data:application/octet-stream;base64," + data["Data"];
              var dlnk = document.getElementById("dwnldLnk");
              dlnk.href = $scope.Details;

              if ($("input[name=excelVal][value='txt']").prop("checked")) {
                if (data["FileName"]) {
                  dlnk.download = data["FileName"];
                } else {
                  dlnk.download = "commision_report.txt";
                }
              } else if (
                $("input[name=excelVal][value='csv']").prop("checked")
              ) {
                if (data["FileName"]) {
                  dlnk.download = data["FileName"];
                } else {
                  dlnk.download = "commision_report.csv";
                }
              } else {
                if (data["FileName"]) {
                  dlnk.download = data["FileName"];
                } else {
                  dlnk.download = "commision_report.pdf";
                }
              }

              dlnk.click();
            })
            .catch(function onError(response) {
              // Handle error
              var data = response.data;
              var status = response.status;
              var statusText = response.statusText;
              var headers = response.headers;
              var config = response.config;
              // errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }
      };

      $scope.otherparty = [];

      $scope.selectedparty = function () {
        for (let i = 0; i < $scope.parties.PartyColl.length; i++) {
          if (
            $scope.entity.indexOf($scope.parties.PartyColl[i].PartyName) == -1
          ) {
            return true;
          } else {
            return false;
          }
        }
      };

      $scope.addChoices = function () {
        $scope.choices = [];
        $scope.choices.push({ id: "1" });
      };

      $scope.showChoice = function (choice) {
        return choice.id === $scope.choices[$scope.choices.length - 1].id;
      };

      $scope.addSection = function (i) {
        /*for (let j = 0; j < $scope.parties.PartyColl.length; j++) {
          if ($scope.parties.PartyColl[j].PartyName == $scope.entity[i]) {
            // $scope.parties.PartyColl[j].isdisabled = true
          }
        }*/
        var arrObj = {
          FinancialEntity: $scope.entity[i],
          ValueInFavor: $scope.Infavor[i],
          ValueAgainst: $scope.Against[i],
        };
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ id: newItemNo });
        if ($scope.removeindex) {
          $scope.getCommisionscycle.push(arrObj);
        }
        $scope.removeindex = true;
      };
      $scope.limitField = true;
      $scope.removeSection = function (i) {
        $scope.limitField = false;

        /*for (let j = 0; j < $scope.parties.PartyColl.length; j++) {
          if ($scope.parties.PartyColl[j].PartyName == $scope.entity[i]) {
            // $scope.parties.PartyColl[j].isdisabled = false
          }
        }*/
        $scope.removeindex = false;
        for (let j = 0; j < $scope.getCommisionscycle.length; j++) {
          if (
            $scope.getCommisionscycle[j]["FinancialEntity"] == $scope.entity[i]
          ) {
            $scope.getCommisionscycle.splice(i, 1);
            $scope.removeindex = true;
            $scope.limitField = true;
          }
        }
        $scope.entity.splice(i, 1);
        $scope.Infavor.splice(i, 1);
        $scope.Against.splice(i, 1);

        var newItemNo = $scope.choices.length - 1;
        if (newItemNo !== 0) {
          $scope.choices.pop();
        }
      };

      $http
        .get(BASEURL + "/rest/v2/commissions/getmaximumamount")
        .then(function onSuccess(response) {
          var data = response.data;
          $scope.maximumamount = data;
        })
        .catch(function onError(response) {
          // Handle error
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;
          $scope.alerts = [
            {
              type: "danger",
              msg: data.responseMessage,
            },
          ];
          errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

      $scope.ResourcePermissionCall = function () {
        $scope.permission = {
          C: false,
          D: false,
          R: false,
          U: false,
          ReActivate: false,
        };
        $http
          .post(BASEURL + "/rest/v2/roles/resourcepermission", {
            RoleId: sessionStorage.ROLE_ID,
            ResourceName: "Commissions",
          })
          .then(function (response) {
            for (k in response.data) {
              for (j in Object.keys($scope.permission)) {
                if (
                  Object.keys($scope.permission)[j] ==
                  response.data[k].ResourcePermission
                ) {
                  $scope.permission[Object.keys($scope.permission)[j]] = true;
                }
              }
            }
          });
      };
      $scope.ResourcePermissionCall();
    }
  );
