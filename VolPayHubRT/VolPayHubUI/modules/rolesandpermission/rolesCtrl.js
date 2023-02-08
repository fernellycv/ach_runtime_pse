angular
  .module("VolpayApp")
  .controller(
    "rolesCtrl",
    function (
      $scope,
      $rootScope,
      $http,
      bankData,
      $state,
      $stateParams,
      $location,
      $filter,
      userMgmtService,
      $timeout,
      GlobalService,
      LogoutService,
      errorservice,
      EntityLockService,
      datepickerFaIcons,
      GetPermissions
    ) {
      $scope.newPermission = GetPermissions("Roles & Permissions");
      EntityLockService.flushEntityLocks();
      $scope.downloadOptions = "Current"

      $scope.Obj = {};
      $scope.typeUser = sessionStorage.getItem("ROLE_ID");

      $scope.ResourcePermissionCall = function () {
        $scope.permission = {
          C: false,
          D: false,
          R: false,
          U: false,
          ReActivate: false,
        };

        $http
          .post(BASEURL + RESTCALL.ResourcePermission, {
            RoleId: sessionStorage.ROLE_ID,
            ResourceName: "Roles & Permissions",
          })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (k in data) {
              for (j in Object.keys($scope.permission)) {
                if (
                  Object.keys($scope.permission)[j] ==
                  data[k].ResourcePermission
                ) {
                  $scope.permission[Object.keys($scope.permission)[j]] = true;
                }
              }
            }
          })
          .catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
          });
      };
      $scope.ResourcePermissionCall();

      function autoScrollDiv() {
        $(".listView").scrollTop(0);
      }

      $scope.changeViewFlag = GlobalService.viewFlag;
      $scope.$watch("changeViewFlag", function (newValue, oldValue, scope) {
        GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
          $(".maintable > thead").hide();
          autoScrollDiv();
        } else {
          $(".maintable > thead").show();
          if ($(".dataGroupsScroll").scrollTop() == 0) {
            $table = $("table.stickyheader");
            $table.floatThead("destroy");
          }
          autoScrollDiv();
        }
      });

      $scope.restResponse = {};

      // ---------------------------------------------------
      $scope.PaymentAdvancedSearch = true;
      $scope.advanceSearchCollaspe = function () {
        if ($scope.PaymentAdvancedSearch) {
          $("#PaymentAdvancedSearch").collapse("show");
        } else {
          $("#PaymentAdvancedSearch").collapse("hide");
        }
        $scope.PaymentAdvancedSearch = !$scope.PaymentAdvancedSearch;
        $scope.showSearchWarning = false;
      };
      $scope.search = {};
      $scope.showSearchWarning = $.isEmptyObject($scope.search);
      $scope.initializeSetting = function () {
        $scope.FieldsValues_ = [
          {
            label: "BankWorksheet.Entity",
            value: "PartyName",
            type: "dropdown",
            allow: "string",
            visible: true,
          },
          {
            label: "UserManagement.Entitytype",
            value: "PartyType",
            type: "dropdown",
            allow: "string",
            visible: true,
          },
          {
            label: "securityRolesPermissions.Role Name",
            value: "RoleName",
            type: "text",
            allow: "string",
            visible: true,
          },
          {
            label: "securityRolesPermissions.Status",
            value: "Status",
            type: "dropdown",
            allow: "string",
            visible: true,
          },
        ];
      };

      $scope.initializeSetting();

      $http
        .get(BASEURL + "/rest/v2/administration/user/roleType")
        .then(function onSuccess(response) {
          // Handle success

          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;

          $scope.partyOptions = data;
          $scope.PartyCode_ = $scope.partyOptions.PartyCode;
        }).catch(function onError(response) {
          // Handle error
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;
          errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

      $scope.buildSearch = function () {
        if (!$.isEmptyObject($scope.search)) {
          $scope.searchFilter($scope.search, true);
          $("#PaymentAdvancedSearch").collapse("hide");
          $scope.advanceSearchCollaspe();
          $scope.PaymentAdvancedSearch = true;
        } else {
          $scope.showSearchWarning = true;
        }
      };

      $scope.rstAdvancedSearchFlag = function () {
        if ($scope.advancedSearchEnable == false) {
          $scope.AdsearchParams = {
            InstructionData: {
              ReceivedDate: {
                Start: "",
                End: "",
              },
              ValueDate: {
                Start: "",
                End: "",
              },
              Amount: {
                Start: "",
                End: "",
              },
              DebitFxRate: {
                Start: "",
                End: "",
              },
            },
          };
          $scope.search = angular.copy($scope.AdsearchParams);
        }
        $scope.search = {};

        $scope.advanceSearchCollaspe();
        GlobalService.PaymentAdvancedSearch = true;
        $scope.PaymentAdvancedSearch = true;
        $scope.amountAlert = false;

        $timeout(function () {
          for (var i in $scope.FieldsValues_) {
            if ($scope.FieldsValues_[i].type == "dropdown") {
              $(
                sanitize("[name=" + $scope.FieldsValues_[i].value + "]")
              ).select2();
              $(
                sanitize("[name=" + $scope.FieldsValues_[i].value + "]")
              ).select2("val", "");
            }
          }
        }, 10);
      };

      $scope.clearFilter = function () {
        $scope.fieldArr = {
          start: 0,
          count: 20,
          sorts: [{ columnName: "RoleID", sortOrder: "Desc" }],
        };

        $scope.search = {};
        setTimeout(function () {
          $("select[name=SearchSelect]").val(null).trigger("change");
        }, 100);
        $scope.filterParams = {};
        $(".filterBydate").each(function () {
          $(this).css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
        });

        $scope.selectedStatus = [];
        $(".filterBystatus").each(function () {
          $(this).css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
        });

        $scope.showCustom = false;
        $scope.selectedDate = "";
        $(".customDropdown").removeClass("open");

        $scope.initCall($scope.queryForm($scope.fieldArr));
      };
      // ---------------------------------------------------

      function crudRequest(_method, _url, _data) {
        return $http({
          method: _method,
          url: BASEURL + _url,
          data: _data,
        }).then(
          function (response) {
            $scope.restResponse = {
              Status: "Success",
              data: response,
            };

            return $scope.restResponse;
          },
          function (error) {
            /* if (error.data.error.code == 401) {
            	
            } */
            errorservice.ErrorMsgFunction(
              error,
              $scope,
              $http,
              error.data.error.code
            );
            $scope.restResponse = {
              Status: "Error",
              data: error.data.error.message,
            };
            $(".modal").modal("hide");
            $scope.alerts = [
              {
                type: "danger",
                msg: error.data.error.message, //Set the message to the popup window
              },
            ];
            //$timeout(callAtTimeout, 4000);
            return $scope.restResponse;
          }
        );
      }

      if (GlobalService.roleAdded) {
        $scope.alerts = [
          {
            type: "success",
            msg: $rootScope.roleAddedMesg.responseMessage,
          },
        ];
        $scope.alertStyle = alertSize().headHeight;
        $scope.alertWidth = alertSize().alertWidth;

        setTimeout(function () {
          $scope.callAtTimeout();
        }, 4000);

        GlobalService.roleAdded = false;
      }

      $stateParams.input
        ? $stateParams.input.responseMessage
          ? ($scope.alerts = [
              {
                type: "success",
                msg: $stateParams.input.responseMessage,
              },
            ])
          : ""
        : "";

      setTimeout(function () {
        $scope.callAtTimeout();
      }, 4000);

      // $scope.showAlert = true;
      $scope.userRoles = [];

      var len = 20;
      $scope.fieldArr = {
        start: 0,
        count: 20,
        sorts: [{ columnName: "RoleID", sortOrder: "Desc" }],
      };

      $scope.queryForm = function (arr) {
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.Queryfield = [];
        $scope.Qobj.QueryOrder = [];

        for (var i in arr) {
          if (i == "params") {
            for (var j in arr[i]) {
              $scope.Qobj.Queryfield.push(arr[i][j]);
            }
          } else if (i == "sortBy") {
            for (var j in arr[i]) {
              $scope.Qobj.QueryOrder.push(arr[i][j]);
            }
          }
        }

        $scope.Qobj = constructQuery($scope.Qobj);
        return $scope.Qobj;
      };

      $scope.sortMenu = [
        {
          label: "ClientId",
          FieldName: "PartyCode",
          visible: "true",
          Type: "String",
        },
        {
          label: "RoleName",
          FieldName: "RoleName",
          visible: true,
          Type: "String",
        },
        {
          label: "Status",
          FieldName: "Status",
          visible: true,
          Type: "Number",
        },
        {
          label: "EffectiveFromDate",
          FieldName: "EffectiveFromDate",
          visible: true,
          Type: "DateOnly",
        },
        {
          label: "EffectiveTillDate",
          FieldName: "EffectiveTillDate",
          visible: false,
          Type: "DateOnly",
        },
      ];
      $scope.filterBydate = [
        {
          actualvalue: todayDate(),
          displayvalue: "Today",
        },
        {
          actualvalue: week(),
          displayvalue: "This Week",
        },
        {
          actualvalue: month(),
          displayvalue: "This Month",
        },
        {
          actualvalue: year(),
          displayvalue: "This Year",
        },
        {
          actualvalue: "",
          displayvalue: "Custom",
        },
      ];

      $scope.Status = [
        {
          actualvalue: "ACTIVE",
          displayvalue: "ACTIVE",
        },
        {
          actualvalue: "DELETED",
          displayvalue: "DELETED",
        },
        {
          actualvalue: "INACTIVE",
          displayvalue: "INACTIVE",
        },
        {
          actualvalue: "SUSPENDED",
          displayvalue: "SUSPENDED",
        },
      ];

      $scope.initCall = function (_query) {
        $http
          .post(BASEURL + "/rest/v2/administration/role/readall", _query)
          .then(function onSuccess(response) {
            // Handle success

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.totalForCountBar = headers().totalcount;
            $scope.loadedData = angular.copy(data.Details);

            $scope.userRoles = data.Details || [];
            // $scope.userRoles.splice(0, 0, {})
            $stateParams.input
              ? $stateParams.input.UserProfileDraft
                ? $scope.gotoEditDraft("", "", $stateParams.input.totData)
                : ""
              : "";
          })
          .catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.loadedData = [];
            /* if (status == 401) {
            	
            } else { */
            $scope.alerts = [
              {
                type: "danger",
                msg: data.error.message, //Set the message to the popup window
              },
            ];
            // }
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };
      $scope.initCall($scope.fieldArr);

      $scope.loadData = function () {
        len = 20;

        $scope.fieldArr = {
          start: 0,
          count: 20,
          sorts: [{ columnName: "RoleID", sortOrder: "Desc" }],
        };
        $(".listView").scrollTop(0);
        $scope.initCall($scope.fieldArr);
        $scope.ResourcePermissionCall();
      };

      len = 20;
      $scope.loadMore = function () {
        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;
        $scope.fieldArr.sorts = [{ columnName: "RoleID", sortOrder: "Desc" }];
        if ($scope.loadedData.length >= 20) {
          $http
            .post(
              BASEURL + "/rest/v2/administration/role/readall",
              $scope.fieldArr
            )
            .then(function onSuccess(response) {
              // Handle success
              var data = response.data;
              var status = response.status;
              var statusText = response.statusText;
              var headers = response.headers;
              var config = response.config;

              $scope.restData = data.Details;
              $scope.userRoles = $scope.userRoles.concat(data.Details);
              $scope.loadedData = data.Details;
              len = len + 20;
            })
            .catch(function onError(response) {
              // Handle error
              var data = response.data;
              var status = response.status;
              var statusText = response.statusText;
              var headers = response.headers;
              var config = response.config;

              $scope.loadedData = [];
              errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        }
      };

      $http
        .get(BASEURL + "/rest/v2/roles/resourcegroup")
        .then(function onSuccess(response) {
          // Handle success
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;
          data.sort((a, b) => {
            const order = {
              "Payment Module": 2,
              "Cycle Module": 3,
              "Sanction Module": 4,
              "Commission Module": 5,
              "Clearing Report": 6,
              "Users Roles": 7,
              "Reference Data": 8,
              "Onboarding Data": 9,
              "Distribution Data": 10,
              "System Data": 11,
              "System Monitoring": 12,
              "Security": 13,
              "Reports": 14,
              "Add On": 15,
            };

            const newA =
              order[a.ResourceGroupName] || Object.keys(order).length;

            const newB =
              order[b.ResourceGroupName] || Object.keys(order).length;

            return newA - newB;
          });

          $scope.resourceGroup = data;
        })
        .catch(function onError(response) {
          // Handle error
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;

          errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

      $scope.gotoSorting = function (dat) {
        $scope.fieldArr.start = 0;
        $scope.fieldArr.count = len;

        var orderFlag = true;
        if ($scope.fieldArr.sortBy.length) {
          for (var i in $scope.fieldArr.sortBy) {
            if ($scope.fieldArr.sortBy[i].ColumnName == dat.FieldName) {
              if ($scope.fieldArr.sortBy[i].ColumnOrder == "Asc") {
                $(sanitize("#" + dat.FieldName + "_icon")).attr(
                  "class",
                  "fa fa-long-arrow-down"
                );
                $(sanitize("#" + dat.FieldName + "_Icon")).attr(
                  "class",
                  "fa fa-caret-down"
                );
                $scope.fieldArr.sortBy[i].ColumnOrder = "Desc";
                orderFlag = false;
                break;
              } else {
                $scope.fieldArr.sortBy.splice(i, 1);
                orderFlag = false;
                $(sanitize("#" + dat.FieldName + "_icon")).attr(
                  "class",
                  "fa fa-minus fa-sm"
                );
                $(sanitize("#" + dat.FieldName + "_Icon")).removeAttr("class");
                break;
              }
            }
          }

          if (orderFlag) {
            $(sanitize("#" + dat.FieldName + "_icon")).attr(
              "class",
              "fa fa-long-arrow-up"
            );
            $(sanitize("#" + dat.FieldName + "_Icon")).attr(
              "class",
              "fa fa-caret-up"
            );
            $scope.fieldArr.sortBy.push({
              ColumnName: dat.FieldName,
              ColumnOrder: "Asc",
            });
          }
        } else {
          $(sanitize("#" + dat.FieldName + "_icon")).attr(
            "class",
            "fa fa-long-arrow-up"
          );
          $(sanitize("#" + dat.FieldName + "_Icon")).attr(
            "class",
            "fa fa-caret-up"
          );

          $scope.fieldArr.sortBy.push({
            ColumnName: dat.FieldName,
            ColumnOrder: "Asc",
          });
        }
        $scope.initCall($scope.queryForm($scope.fieldArr));
      };

      $scope.filterParams = {};
      $scope.selectedStatus = [];
      $scope.setStatusvalue = function (val, to) {
        var addme = true;
        if ($scope.selectedStatus.length) {
          for (k in $scope.selectedStatus) {
            if ($scope.selectedStatus[k] == val) {
              $(sanitize("#" + val)).css({
                "background-color": "#fff",
                "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
              });
              $scope.selectedStatus.splice(k, 1);

              addme = false;
              break;
            }
          }
          if (addme) {
            $(sanitize("#" + val)).css({
              "background-color": "#d8d5d5",
              "box-shadow": "",
            });
            $scope.selectedStatus.push(val);
          }
        } else {
          $(sanitize("#" + val)).css({
            "background-color": "#d8d5d5",
            "box-shadow": "",
          });
          $scope.selectedStatus.push(val);
        }
        to["Status"] = $scope.selectedStatus;
      };

      $scope.setEffectivedate = function (val, to) {
        to["EffectiveDate"] = val;
        if ($scope.selectedDate == val.displayvalue) {
          $scope.showCustom = false;
          $(".filterBydate").css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
          $scope.selectedDate = "";
        } else {
          $scope.showCustom = true;
          $scope.selectedDate = angular.copy(val.displayvalue);
          $(".filterBydate").css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
          $("#" + $scope.selectedDate.replace(/\s+/g, "")).css({
            "box-shadow": "1.18px 3px 2px 1px rgba(0,0,0,0.40)",
            "background-color": "#d8d5d5",
          });
        }

        if (typeof val.actualvalue == "object") {
          var date = [];
          for (k in val.actualvalue) {
            date.push(val.actualvalue[k]);
          }
          $("#customPicker")
            .find("input")
            .each(function (i) {
              if (i == 0) {
                if (date[i] < date[Number(i + 1)]) {
                  $(this).val(date[i]);
                  $(this)
                    .parent()
                    .children()
                    .each(function () {
                      $(this)
                        .css({
                          cursor: "not-allowed",
                        })
                        .attr("disabled", "disabled");
                    });
                } else {
                  $(this).val(date[Number(i + 1)]);
                  $(this)
                    .parent()
                    .children()
                    .each(function () {
                      $(this)
                        .css({
                          cursor: "not-allowed",
                        })
                        .attr("disabled", "disabled");
                    });
                }
              } else {
                $(this).val(date[Number(i - 1)]);
                $(this)
                  .parent()
                  .children()
                  .each(function () {
                    $(this)
                      .css({
                        cursor: "not-allowed",
                      })
                      .attr("disabled", "disabled");
                  });
              }
            });
        } else if (val.displayvalue == "Custom") {
          $("#customPicker")
            .find("input")
            .each(function (i) {
              $(this)
                .parent()
                .children()
                .each(function () {
                  $(this)
                    .css({
                      cursor: "pointer",
                    })
                    .removeAttr("disabled")
                    .val("");
                });
            });
        } else {
          $("#customPicker")
            .find("input")
            .each(function (i) {
              $(this).val(val.actualvalue);
              $(this)
                .parent()
                .children()
                .each(function () {
                  $(this)
                    .css({
                      cursor: "not-allowed",
                    })
                    .attr("disabled", "disabled");
                });
            });
        }
      };

      $scope.showCustom = false;
      $scope.selectedDate = "";

      $scope.clearSort = function (id) {
        $(id)
          .find("i")
          .each(function () {
            $(this).removeAttr("class").attr("class", "fa fa-minus fa-sm");
            $("#" + $(this).attr("id").split("_")[0] + "_Icon").removeAttr(
              "class"
            );
          });
        $scope.fieldArr.sortBy = [];
        $scope.initCall($scope.queryForm($scope.fieldArr));
      };

      $scope.fields = [
        {
          type: "string",
          label: "RolesAndPermissions.RoleType",
          name: "PartyCode",
        },
        {
          type: "string",
          label: "RolesAndPermissions.RoleName",
          name: "RoleName",
        },
        {
          type: "string",
          label: "securityRolesPermissions.Status",
          name: "Status",
        },
      ];

      $scope.buildFilter = function (argu1) {
        var argu2 = [];
        for (k in $scope.fields) {
          if ($scope.fields[k].type === "string") {
            argu2.push({
              columnName: $scope.fields[k].name,
              operator: "LIKE",
              value: argu1,
            });
          } else if (
            $scope.fields[k].type === "select" &&
            $scope.fields[k].name != "Status"
          ) {
            argu2.push({
              columnName: $scope.fields[k].name,
              operator: "=",
              value: argu1,
            });
          }
        }
        return argu2;
      };
      $scope.callAtTimeout = function () {
        $(".alert").hide();
      };

      $scope.gotoDeleteFn = function (resource, roleid) {
        $scope.deleteDisRole = roleid;
      };

      $scope.takeDeldata = function (roleid) {
        $scope.delObj = {};
        $scope.delObj.RoleID = roleid;
        $http
          .post(BASEURL + RESTCALL.CreateRole + "/delete", $scope.delObj)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data) {
              $scope.alerts = [
                {
                  type: "success",
                  msg: data.responseMessage,
                },
              ];
            } else {
              $scope.alerts = [
                {
                  type: "success",
                  msg: "Borrado exitosamente",
                },
              ];
            }
            setTimeout(function () {
              $scope.callAtTimeout();
            }, 3000);

            $(".collapse").collapse("hide");

            $scope.initCall($scope.queryForm($scope.fieldArr));
            for (var i in $scope.Status) {
              $scope.getCountbyStatus($scope.Status[i]);
            }

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;
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
                msg: data.error.message,
              },
            ];

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;

            setTimeout(function () {
              $scope.callAtTimeout();
            }, 3000);
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
        $(".modal").modal("hide");
        $("body").removeClass("modal-open");
      };

      $scope.searchFilter = function (val, flag) {
        val = removeEmptyValueKeys(val);

        $scope.fieldArr.start = 0;
        $scope.fieldArr.count = len;
        $scope.fieldArr.params = [];

        $scope.adFilter = {
          filters: {
            logicalOperator: "AND",
            groupLvl1: [
              {
                logicalOperator: "AND",
                groupLvl2: [
                  {
                    logicalOperator: "AND",
                    groupLvl3: [],
                  },
                ],
              },
            ],
          },
          sorts: [{ columnName: "RoleID", sortOrder: "Desc" }],
          start: $scope.fieldArr.start,
          count: $scope.fieldArr.count,
        };

        if (flag) {
          var keyArr = [];

          for (var inobj in val) {
            keyArr.push({
              ColumnName: inobj,
              ColumnValue: val[inobj],
              ColumnOperation: "LIKE",
            });
          }

          $scope.statusREST = {
            Queryfield: keyArr,
          };
          $scope.statusREST = constructQuery($scope.statusREST);

          $scope.adFilter.filters = $scope.statusREST.filters;
        } else {
          for (var i in $scope.fieldArr) {
            if (i == "sortBy") {
              for (var j in $scope.fieldArr[i]) {
                $scope.adFilter.sorts.push({
                  columnName: $scope.fieldArr[i][j].ColumnName,
                  sortOrder: $scope.fieldArr[i][j].ColumnOrder,
                });
              }
            }
          }

          for (var j in Object.keys(val)) {
            if (val[Object.keys(val)[j]]) {
              if (Object.keys(val)[j] == "Status") {
                $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3 = [
                  {
                    logicalOperator:
                      val[Object.keys(val)[j]].length >= 1 ? "OR" : "AND",
                    clauses: [],
                  },
                ];

                for (var i in val[Object.keys(val)[j]]) {
                  $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push(
                    {
                      columnName: Object.keys(val)[j],
                      operator: "=",
                      value: val[Object.keys(val)[j]][i],
                    }
                  );
                }
              } else if (Object.keys(val)[j] == "EffectiveDate") {
                $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push(
                  {
                    logicalOperator: "AND",
                    clauses: [
                      {
                        columnName: "EffectiveFromDate",
                        operator:
                          $("#startDate").val() == $("#endDate").val()
                            ? "="
                            : $("#startDate").val() > $("#endDate").val()
                            ? "<="
                            : ">=",
                        value: $("#startDate").val(),
                      },
                    ],
                  }
                );

                $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push(
                  {
                    logicalOperator: "AND",
                    clauses: [
                      {
                        columnName: "EffectiveFromDate",
                        operator:
                          $("#startDate").val() == $("#endDate").val()
                            ? "="
                            : $("#startDate").val() < $("#endDate").val()
                            ? "<="
                            : ">=",
                        value: $("#endDate").val(),
                      },
                    ],
                  }
                );
              } else if (Object.keys(val)[j] == "SearchSelect") {
                // val.SearchSelect = JSON.parse(val.SearchSelect)
                if (typeof val.SearchSelect == "string") {
                  val.SearchSelect = JSON.parse(val.SearchSelect);
                } else {
                  val.SearchSelect = val.SearchSelect;
                }

                $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push(
                  {
                    logicalOperator: "OR",
                    clauses: [
                      {
                        columnName: val.SearchSelect.name,
                        operator:
                          val.SearchSelect.type == "select" ? "=" : "LIKE",
                        value: val.keywordSearch,
                      },
                    ],
                  }
                );
              } else if (
                Object.keys(val)[j] == "keywordSearch" &&
                !val["SearchSelect"]
              ) {
                $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push(
                  {
                    logicalOperator: "OR",
                    clauses: $scope.buildFilter(val[Object.keys(val)[j]]),
                  }
                );
              }
            }
          }
        }
        $scope.initCall($scope.adFilter);
        setTimeout(function () {
          $("select[name=SearchSelect]").val(null).trigger("change");
        }, 100);
        $scope.filterParams = {};
        $(".filterBydate").each(function () {
          $(this).css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
        });

        $scope.selectedStatus = [];
        $(".filterBystatus").each(function () {
          $(this).css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
        });

        $scope.showCustom = false;
        $scope.selectedDate = "";
        $(".dropdown-menu").removeClass("show");
      };

      $scope.clearFilter = function () {
        $scope.fieldArr = {
          start: 0,
          count: 20,
          sortBy: [],
        };

        setTimeout(function () {
          $("select[name=SearchSelect]").val(null).trigger("change");
        }, 100);
        $scope.filterParams = {};
        $(".filterBydate").each(function () {
          $(this).css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
        });

        $scope.selectedStatus = [];
        $(".filterBystatus").each(function () {
          $(this).css({
            "background-color": "#fff",
            "box-shadow": "1.18px 2px 1px 1px rgba(0,0,0,0.40)",
          });
        });

        $scope.showCustom = false;
        $scope.selectedDate = "";
        $(".dropdown-menu").removeClass("show");
        // $('.customDropdown').removeClass('open');

        $scope.initCall($scope.queryForm($scope.fieldArr));
      };

      $scope.multiSortObj = [];
      $scope.printFn = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        window.print();
      };

      $scope.makeCall = function(format) {
        var data = {count: $scope.userRoles.length, start: 0, QueryOrder: [{ ColumnName: "RoleID", ColumnOrder: "Desc" }]}
        data = constructQuery(data);

        var rest=BASEURL + "/rest/v2/administration/roles/"+format
        $http
          .post(rest, data)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            $scope.dat = response.data.Data
            $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
            var dlnk = document.getElementById('dwnldLnk');
            dlnk.href = $scope.Details;
            dlnk.download =   response.data['filename']

            dlnk.click();
          }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
          });
      }
      
      function JSONToCSVConvertor(bankData, JSONData, ReportTitle, ShowLabel) {
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        CSV = "Reporte de Funcionalidades de roles" + '\r\n';
        CSV += "Fecha y Hora:   " + moment().format('DD/MM/YYYY HH:mm:ss') + '\r\n';
        if (ShowLabel) {
            var row = "";
            for (var index in arrData[0]) {
                if (index != 'IsSuperAdmin') {
                  row += (($filter("translate")("RolesAndPermissions." + index.replace(/\s/g, ""))).indexOf('RolesAndPermissions.') == -1 ? $filter("translate")("RolesAndPermissions." + index.replace(/\s/g, "")) : index)+ ',';
                }
            }
            row = row.slice(0, -1);
            CSV += row + '\r\n';
        }
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (var index in arrData[i]) {
                if (index != 'IsSuperAdmin') {
                    row += '' + JSON.stringify(arrData[i][index]) + ',';
                }
            }
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        if (CSV == '') { alert("Invalid data"); return; }
        bankData.exportToExcel(CSV, ReportTitle)
      }

      function JSONToCSVConvertorToTxt(bankData, JSONData, ReportTitle, ShowLabel, CSV) {
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        CSV = "Reporte de Funcionalidades de roles" + '\r\n';
        CSV += "Fecha y Hora:   " + moment().format('DD/MM/YYYY HH:mm:ss') + '\r\n';
        //This condition will generate the Label/Header
        if (ShowLabel) {
          var row = "";
          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {
            if (index != 'IsSuperAdmin') {
              //Now convert each value to string and comma-seprated
              row += index + ';';
            }
          }
          row = row.slice(0, -1);
          //append Label row with line break
          CSV += row + '\r\n';
        }
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
          var row = "";

          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
            if (index != 'IsSuperAdmin') {
              row += '' + JSON.stringify(arrData[i][index]) + ';';
            }
          }
          row.slice(0, row.length - 1);
          //add a line break after each row
          CSV += row + '\r\n';
        }

        if (CSV == '') {
          alert("Invalid data");
          return;
        }
        bankData.exportToTXT(CSV, ReportTitle)
      }
      $scope.ExportMore = function (argu, excelLimit,format) {
        if(format=='csv' || format=='txt' || format=='xls'){
          var rest=BASEURL + "/rest/v2/roles/achexportroles"
          if (argu > excelLimit) {
            JSONToCSVConvertor(
              bankData,
              $scope.dat,
              argu > excelLimit
                ? $scope.Title + "_" + ("" + excelLimit)[0]
                : $scope.Title,
              true
            );
            $scope.dat = [];
            excelLimit += 1000000;
          }
        }else{
          $scope.makeCall(format)
        }
      
        $http
          .get(rest)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            const { Colums, Data } = data;
            const col = Colums.map((c) => c.Column);
            col.sort((a, b) => {
              const order = {
                Rol: 1,
                NombredeRole: 2,
                "Código Entidad": 3,
                "Código del Servicio": 4,
                Estado: 5,
                "Activo Desde": 6,
                "Activo Hasta": 7,
                "Home Page": 8,
                "My Profile": 9,
                "Alerts & Notifications": 10,
                "All Payments": 11,
                "All Transactions": 11,
                "Received Instructions": 12,
                "Distributed Instructions": 13,
                "Closing Cycle": 14,
                "Bulk Load": 15,
                "Sanction Generation": 16,
                "Sanction Calculator By Cycle": 17,
                Commissions: 18,
                "Balance Screen": 19,
                "Consolidated Balance Screen": 20,
                "Close and Conciliation": 21,
                "User Management": 22,
                UserDetails: 23,
                Role: 24,
                RoleDetails: 25,
                "Unlock Users": 26,
                "ACH Session Management": 27,
                "Role Permissions": 28,
                Calendar: 29,
                Country: 30,
                Currency: 31,
                Branch: 32,
                Service: 33,
                Party: 34,
                Account: 35,
                Transport: 36,
                "Party Service Association": 37,
                "Method Of Payment": 38,
                "MOP Priority": 39,
                CutOff: 40,
                "Approval Condition": 41,
                "VolPay ID Configuration": 42,
                "Action Definition": 43,
                "Status Definition": 44,
                "Incidence Definition": 45,
                "Status Action": 46,
                "Log Configuration": 47,
                "Approval Condition": 48,
                "Route Registry": 49,
                "Service Registry": 50,
                "System Diagnosis": 51,
                Approvals: 52,
                Report: 53,
                "VPH Transaction Types": 54,
                "VPH Trx Type Constraints": 55,
                "Party Types": 56,
                "Admin Accounts": 57,
                LIMITS: 58,
                MinimumLimits: 59,
                AmountLimitProfile: 60,
                "ACH Register Accounts": 61,
                "VPH Authorized Account": 62,
                "Accounts Approve": 63,
                "VPH Daily Rates": 64,
                VPH_CYCLE_TIME: 65,
                "VPH CYCLE EXTENSION": 66,
                "VPH CYCLE EXTENSION ACH": 67,
                Notifications: 68,
 Inbox: 69,
              };

              const newA = order[a] || Object.keys(order).length;
              const newB = order[b] || Object.keys(order).length;

              return newA - newB;
            });
            const table = [];
            Data.forEach((item) => {
              const row = {};
              col.forEach((c) => {
                var colName = $filter("translate")(
                  "Sidebar." + c.replace(/\s/g, "")
                );
                if (c in item) {
                  row[colName] = item[c];
                } else {
                  if (item.Views != undefined) {
                    let colView = item.Views.find((v) => v.view == c);
                    if (colView) {
                      if (Array.isArray(colView.Permissions)) {
                        let permissions = colView.Permissions.reduce(
                          (acc, current) => {
                            var per = $filter("translate")(
                              "RolesAndPermissions." + current.Permission
                            );
                            acc = acc + per + " , ";
                            return acc;
                          },
                          ""
                        );
                        row[colName] = permissions.slice(0, -2);
                      } else if (typeof colView.Permissions == "object") {
                        row[colName] = Object.values(colView.Permissions);
                      }
                    } else {
                      row[colName] = "";
                    }
                  } else {
                    row[colName] = "";
                  }
                }
              });
              table.push(row);
            });

            $scope.dat = $scope.dat.concat(data);
            if (data.length >= 1000) {
              argu += 1000;
              $scope.ExportMore(argu, excelLimit);
            } else {
              /*
              response.data.forEach((element) => {
                element.ResourceName = $filter("translate")(
                  "Sidebar." + element.ResourceName.replace(/\s/g, "")
                );
              }); */
              if (format == 'csv') {
              JSONToCSVConvertor(
                bankData,
                table,
                argu > excelLimit
                  ? "Roles" + "_" + ("" + excelLimit)[0]
                  : "Roles",
                true
              );
            }
            if (format == 'txt') {
              JSONToCSVConvertorToTxt(
                bankData,
                table,
                argu > excelLimit
                  ? "Roles" + "_" + ("" + excelLimit)[0]
                  : "Roles",
                true,
                ''
              );
            }
            if (format == 'xls') {
              $scope.tablesToExcel(table)
            }
          }
          })
          .catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
          });
      };

      $scope.exportAsExcel = function (data) {
        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
          $scope.ExportMore(0, 1000000,data);
        } else {
          $scope.dat = angular.copy($scope.userRoles);
          $scope.dat.shift();
          JSONToCSVConvertor(bankData, $scope.dat, "Roles", true);
        }
      };

      var debounceHandler = _.debounce($scope.loadMore, 700, true);
      jQuery(function ($) {
        $(".listView").bind("scroll", function () {
          if (
            Math.round($(this).scrollTop() + $(this).innerHeight()) >=
            $(this)[0].scrollHeight
          ) {
            if ($scope.loadedData.length >= 20) {
              debounceHandler();
            }
          }
        });
        setTimeout(function () {}, 1000);
      });

      $scope.changevalue = false;
      $scope.checkBox = function (val, flag) {
        $scope.active = !$scope.active;

        if (!flag) {
          // $('#checkId').addClass('checked')
          $scope.changevalue = true;
          $scope.checkBoxChecked = true;

          $("#rolesTable td").css("padding", "6px 12px");
        } else {
          //$('#checkId').removeClass('checked')
          $scope.changevalue = false;
          $scope.checkBoxChecked = false;
          $("#rolesTable td").css("padding", "12px 12px");
        }
      };

      $scope.checkOpt = function (val) {
        var visible = $(val.currentTarget)
          .parent()
          .parent()
          .parent()
          .parent()
          .find(".visible");

        var visibleDropdown = $(val.currentTarget)
          .parent()
          .parent()
          .find("button:first-child")
          .find("span:first-child");

        var selEle = $(val.currentTarget).find("span");
        var selClass = selEle.attr("class");

        $(visibleDropdown)
          .removeAttr("class")
          .addClass("opt checkedDropdown")
          .addClass(selClass);
        $(visible).removeAttr("class").addClass("visible").addClass(selClass);
      };
      $scope.getAccordion = function (
        v1,
        v2,
        index,
        roletype,
        status,
        effectivedate,
        effectivetilldate
      ) {
        $scope.newObj = {};
        $scope.newObj.v1 = v1;
        $scope.newObj.v2 = v2;
        $scope.newObj.index = index;
        $scope.newObj.zero = 0;
        $scope.newObj.Roletype = roletype;
        $scope.newObj.Status = status;
        $scope.newObj.EffectiveDate = effectivedate;
        $scope.newObj.EffectiveTillDate = effectivetilldate;

        $state.go("app.viewresourcepermission", {
          input: {roledDetails:$scope.newObj},k
        });
      };

      $scope.AddNewRole = function () {
        $scope.editObj = {};
        $scope.editObj.FromRoles = false;
        sessionStorage.EditPage = false;
        $(".my-tooltip").tooltip("hide");
        $state.go("app.securityaddroles", {
          input: $scope.editObj,
        });
      };

      $scope.gotoEdit = function (v1, v2, Opt) {
        $scope.editObj = {};
        $scope.editObj.Resourcename = v1;
        $scope.editObj.RoleId = v2;
        $scope.editObj.ToEditPage = true;
        $scope.editObj.Operation = Opt;
        $scope.editObj.FromRoles = true;
        var dataObj = {}; // have to form the request payload
        dataObj["TableName"] = "Role";
        // dataObj['ActionName'] = actions.ActionName;
        dataObj["IsLocked"] = true;
        dataObj["BusinessPrimaryKey"] = JSON.stringify({ RoleID: v2 });

        var query = {
          RoleName: $scope.editObj.RoleId,
        };
        $http({
          method: "POST",
          url: BASEURL + "/rest/v2/administration/role/read",
          data: query,
        })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.rolesList = data;
            EntityLockService.checkEntityLock(dataObj)
              .then(function (data) {
                // opened modal dialog to process the payment
                sessionStorage.EditPage = true;
                $state.go("app.securityaddroles", {
                  input: $scope.rolesList,
                });
              })
              .catch(function (response) {
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                if (response.status === 400) {
                  var errMsg = response.data.error.message
                    ? response.data.error.message
                    : "Unknown issue";
                  $scope.alerts = [
                    {
                      type: "danger",
                      msg: errMsg,
                    },
                  ];
                  $("#actionForm").modal("hide");
                }
              });
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
                msg: data.error.message,
              },
            ];
          });
      };

      /*** On window resize ***/
      $(window).resize(function () {
        $scope.$apply(function () {
          $scope.alertWidth = $(".alertWidthonResize").width();
        });
      });

      $(".DatePicker")
        .datetimepicker({
          format: "YYYY-MM-DD",
          showClear: true,
          icons: datepickerFaIcons.icons,
        })
        .on("dp.change", function (ev) {
          $scope["filterParams"][$(ev.currentTarget).attr("id")] = $(
            ev.currentTarget
          ).val();
        })
        .on("dp.show", function (ev) {
          $(this).change();
        });

      $scope.TotalCount = 0;
      $scope.getCountbyStatus = function (argu) {
        $http
          .get(BASEURL + "/rest/v2/roles/" + argu.actualvalue + "/count")
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            argu.TotalCount = data.TotalCount;
            $scope.TotalCount = $scope.TotalCount + data.TotalCount;
            return data.TotalCount;
          })
          .catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      /*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/
      $scope.widthOnScroll = function () {
        var mq = window.matchMedia("(max-width: 991px)");
        var headHeight;
        if (mq.matches) {
          headHeight = 0;
          $scope.alertWidth = $(".pageTitle").width();
        } else {
          $scope.alertWidth = $(".pageTitle").width();
          headHeight = $(".main-header").outerHeight(true) + 10;
        }
        $scope.alertStyle = headHeight;
      };
      $scope.widthOnScroll();

      $scope.getCurrentDrafts = function () {
        $http
          .post(BASEURL + "/rest/v2/draft/Role/readall", {
            start: 0,
            count: 20,
          })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.draftdatas = data;
            $scope.dataLen = data;
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
                type: "Error",
                msg: data.responseMessage, //Set the message to the popup window  /v2/draft/read/{tableName}
              },
            ];
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.takeDelDraftdata = function (val, Id) {
        delData = val;
        $scope.delIndex = Id;
      };

      $scope.gotodeleteDraft = function () {
        $scope.deleteObj = {
          UserID: delData.UserID,
          Entity: delData.Entity,
          BPK: delData.BPK,
        };

        $http
          .post(BASEURL + "/rest/v2/draft/delete", $scope.deleteObj)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //if(status === 'Success'){
            $(".modal").modal("hide");
            $scope.alerts = [
              {
                type: "success",
                msg: "Borrado exitosamente",
              },
            ];

            $timeout(function () {
              $(".alert-success").hide();
            }, 4000);
            //}
          })
          .catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            /*$scope.alerts = [{
            	type : 'Error',
            	msg : data.responseMessage	
            }];*/
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      draftlen = 20;
      argu = {};
      var loadMoreDrafts = function () {
        if ($scope.dataLen.length >= 20) {
          argu.start = draftlen;
          argu.count = 20;

          $http
            .post(BASEURL + "/rest/v2/draft/Role/readall", argu)
            .then(function onSuccess(response) {
              // Handle success
              var data = response.data;
              var status = response.status;
              var statusText = response.statusText;
              var headers = response.headers;
              var config = response.config;

              $scope.dataLen = data;
              if (data.length != 0) {
                $scope.draftdatas = $scope.draftdatas.concat($scope.dataLen);
                draftlen = draftlen + 20;
              }
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
                  type: "Error",
                  msg: data.responseMessage,
                },
              ];
              errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        }
      };

      var debounceHandlerDraft = _.debounce(loadMoreDrafts, 700, true);
      setTimeout(function () {
        $(document).ready(function () {
          $(".FixHead").scroll(function (e) {
            var $tablesToFloatHeaders = $("table.maintable");

            $tablesToFloatHeaders.floatThead({
              useAbsolutePositioning: true,
              scrollContainer: true,
            });
            $tablesToFloatHeaders.each(function () {
              var $table = $(this);

              $table.closest(".FixHead").scroll(function (e) {
                $table.floatThead("reflow");
              });
            });
          });
          $(".FixHeadDraft").scroll(function (e) {
            var $tablesToFloatHeaders = $("table.drafttable");

            $tablesToFloatHeaders.floatThead({
              useAbsolutePositioning: true,
              scrollContainer: true,
            });
            $tablesToFloatHeaders.each(function () {
              var $table = $(this);

              $table.closest(".FixHeadDraft").scroll(function (e) {
                $table.floatThead("reflow");
              });
            });
          });

          $(".draftViewCls").on("scroll", function () {
            $scope.widthOnScroll();
            if (
              Math.round($(this).scrollTop() + $(this).innerHeight()) >=
              $(this)[0].scrollHeight
            ) {
              debounceHandlerDraft();
            }
          });
          $("#DraftListModal").on("shown.bs.modal", function (e) {
            $("body").css("padding-right", 0);
            $(".draftViewCls").scrollTop(0);
          });
          $("#Filter button:first-child").click(function () {
            setTimeout(function () {
              var parentElement = $(".parent");
              $("select[name=SearchSelect]").select2({
                allowClear: true,
                placeholder: $filter("translate")("Placeholder.Select"),
                dropdownParent: parentElement,
              });
            }, 500);
          });
        });
      }, 200);

      $scope.gotoEditDraft = function (opr, index, draftblob) {
        var gostateObj = {
          typeOfDraft: "",
          decrData: "",
          draftdata: draftblob,
          FromDraft: true,
        };
        var decryptedDraft = $filter("hex2a")(
          draftblob.Data ? draftblob.Data : draftblob.totData.Data
        );
        var jsonDraft = $filter("Xml2Json")(decryptedDraft);
        var backupWholeData = angular.copy(jsonDraft);

        for (i in backupWholeData) {
          for (j in backupWholeData[i]) {
            if (typeof backupWholeData[i][j] == "object") {
              var backupObj = backupWholeData[i][j];
              delete backupWholeData[i][j];
              backupWholeData[i][j] = [];
              backupWholeData[i][j].push(backupObj);
            }
          }
          backupWholeData[i] = cleantheinputdata(backupWholeData[i]);
          gostateObj.decrData = backupWholeData[i];
        }

        var specificReadObject = {
          UserID: gostateObj.draftdata.UserID,
          Entity: gostateObj.draftdata.Entity,
          BPK: gostateObj.draftdata.BPK,
        };

        $http
          .post(BASEURL + RESTCALL.DraftSpecificRead, specificReadObject)
          .then(
            function (response) {
              gostateObj.typeOfDraft = response.headers().type;
            },
            function (error) {
              $scope.alerts = [
                {
                  type: "Error",
                  msg: error.responseMessage,
                },
              ];
              errorservice.ErrorMsgFunction(error, $scope, $http, error.status);
            }
          );

        $state.go("app.addroles", {
          input: gostateObj,
        });
      };

      $http
        .get(BASEURL + RESTCALL.RolesPermissionPK)
        .then(function onSuccess(response) {
          // Handle success
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;

          $scope.primarykey = data.responseMessage.split(",");
          $rootScope.primarykey = data.responseMessage.split(",");
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
              msg: data.error.message,
            },
          ];

          $scope.alertStyle = alertSize().headHeight;
          $scope.alertWidth = alertSize().alertWidth;
          errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

      var reactivateObj = {};
      $scope.gotoReactivate = function (_data) {
        var GetPrimaryKeys = angular.copy($scope.primarykey);
        for (i in GetPrimaryKeys) {
          for (j in _data) {
            if (GetPrimaryKeys[i] == j) {
              reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
            }
          }
        }

        crudRequest("POST", "/rest/v2/roles/reactivate", reactivateObj).then(
          function (response) {
            $scope.alerts = [
              {
                type: "success",
                msg: response.data.data.responseMessage, //Set the message to the popup window
              },
            ];

            $scope.fieldArr = {
              start: 0,
              count: len,
            };

            $scope.initCall($scope.queryForm($scope.fieldArr));
          }
        );

        setTimeout(function () {
          $(".alert").hide();
        }, 4000);
      };
      
      $scope.changeDownloadOption = function(val) {
          $scope.downloadOptions = val;
      }
	
      $scope.enableDownloadBtns = function(format) {
          if($scope.downloadOptions == 'All') {
              return configData.exportAsExcel.allFilter.indexOf(format) != -1 ? true : false;
          }else {
              return configData.exportAsExcel.currentFilter.indexOf(format) != -1 ? true : false;
          }
      }

      $scope.tablesToExcel = function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
        {

        } else {

            var uri = 'data:application/vnd.ms-excel;base64,',
                tmplWorkbookXML = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
                '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>' +
                '<Styles>' +
                '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>' +
                '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>' +
                '</Styles>' +
                '{worksheets}</Workbook>',
                tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
                tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>',
                base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
                format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
            return function(table) {

                var ctx = "";
                var workbookXML = "";
                var worksheetsXML = "";
                var rowsXML = "";
                
                rowsXML += '<Row>'
                rowsXML += format(tmplCellXML, {
                  attributeStyleID: '',
                  nameType: 'String',
                  data: "Reporte de Funcionalidades de roles",
                  attributeFormula: ''
                });
                rowsXML += '</Row>'
                rowsXML += '<Row>'
                rowsXML += format(tmplCellXML, {
                  attributeStyleID: '',
                  nameType: 'String',
                  data: "Fecha y Hora: ",
                  attributeFormula: ''
                });
                rowsXML += format(tmplCellXML, {
                  attributeStyleID: '',
                  nameType: 'String',
                  data: moment().format('DD/MM/YYYY HH:mm:ss'),
                  attributeFormula: ''
                });
                rowsXML += '</Row>'
                
                var labels = Object.keys(table[0]);
                rowsXML += '<Row>'
                labels.forEach(label => {
                  ctx = {
                    attributeStyleID: '',
                    nameType: 'String',
                    data: label,
                    attributeFormula: ''
                  };
                  rowsXML += format(tmplCellXML, ctx);
                });
                rowsXML += '</Row>'


                table.forEach(row => {
                    rowsXML += '<Row>'
                    for (var k = 0; k < labels.length; k++) {
                        ctx = {
                            attributeStyleID: '',
                            nameType: 'String',
                            data: row[labels[k]],
                            attributeFormula: ''
                        };
                        rowsXML += format(tmplCellXML, ctx);
                    }
                    rowsXML += '</Row>'
                });
                ctx = { rows: rowsXML, nameWS: 'Roles' };
                worksheetsXML += format(tmplWorksheetXML, ctx);
                rowsXML = "";

                ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
                workbookXML = format(tmplWorkbookXML, ctx);

                var link = document.createElement("A");
                link.href = uri + base64(workbookXML);
                link.download ='Roles.xls';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }
    }();
    }
  );
