angular
  .module("VolpayApp")
  .controller(
    "viewresourcepermissionCtrl",
    function (
      $scope,
      $rootScope,
      $stateParams,
      $http,
      $state,
      $location,
      $filter,
      userMgmtService,
      $timeout,
      GlobalService,
      LogoutService,
      errorservice,
      EntityLockService,
      GetPermissions
    ) {
      $scope.newPermission = GetPermissions("Roles & Permissions");

      $scope.sKey = "";

      $scope.permission = {
        C: false,
        D: false,
        R: false,
        U: false,
        ReActivate: false,
      };
      $scope.detailExpanded = false;
      $scope.Obj = {};
      //$scope.rG="AddOns";
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
                Object.keys($scope.permission)[j] == data[k].ResourcePermission
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

      function CRUDReConstruct(Array123) {
        for (i = 0; i < Array123.length; i++) {
          if (Array123[i] == "C") {
            Array123[i] = "Create";
          }
          if (Array123[i] == "R") {
            Array123[i] = "Read";
          }
          if (Array123[i] == "U") {
            Array123[i] = "Update";
          }
          if (Array123[i] == "D") {
            Array123[i] = "Delete";
          }
        }
        return Array123;
      }

      function CRUDReConstruct123(Array123) {
        for (i = 0; i < Array123.Operations.length; i++) {
          if (Array123.Operations[i].Operation == "C") {
            Array123.Operations[i].Operation = "Create";
          }
          if (Array123.Operations[i].Operation == "R") {
            Array123.Operations[i].Operation = "Read";
          }
          if (Array123.Operations[i].Operation == "U") {
            Array123.Operations[i].Operation = "Update";
          }
          if (Array123.Operations[i].Operation == "D") {
            Array123.Operations[i].Operation = "Delete";
          }
        }

        return Array123;
      }

      $scope.resourceAttributes = "";
      $scope.trial = {};

      $scope.getResourceAttributes = function (index, val, roleID, event) {
        $scope._ResourceName = angular.copy(val);
        $scope.action123 = false;

        for (var i in $scope.Obj) {
          $scope.Obj[i] = false;
        }

        var currentEvent = $(event.currentTarget).parent().parent().next(); //expandrow
        var $expandrow_id = $(event.currentTarget)
          .parent()
          .parent()
          .next()
          .attr("id"); //expandrow
        var $display = $(event.currentTarget)
          .parent()
          .parent()
          .next()
          .attr("style");

        var none = $(".expandRow").css("display", "none");
        $(".attrIcon").removeClass("fa fa-compress").addClass("fa fa-expand");

        if ($display.indexOf("none") != -1) {
          currentEvent.css("display", "table-row");
          $(event.currentTarget).addClass("fa fa-compress");
        } else if ($display.indexOf("table-row") != -1) {
          currentEvent.css("display", "none");
          $(event.currentTarget)
            .removeClass("fa fa-compress")
            .addClass("fa fa-expand");
        }

        $http
          .post(BASEURL + "/rest/v2/roles/attributes/read", {
            RoleId: roleID,
            ResourceName: val,
          })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.IsRoleEditable = data.IsRoleEditable;
            $scope.test111 = [];
            for (var i in data.Attributes) {
              $scope.test111.push({
                key: val,
                cnt: i,
                value: [],
              });
              for (var j in data.Attributes[i].Permissions) {
                if (data.Attributes[i].Permissions[j].Permission) {
                  $scope.test111[i].value.push(
                    data.Attributes[i].Permissions[j].Operation
                  );
                }
              }
            }

            setTimeout(function () {
              for (var i in $scope.test111) {
                var selectName = $filter("removeSpace")(
                  'select[name="select_' + val + "_" + i + '"]'
                );
                $(selectName).val($scope.test111[i].value);
                $(selectName).select2();
              }
            }, 10);
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

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });

        var query = {
          RoleName: roleID,
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
        $http
          .post(BASEURL + "/rest/v2/roles/attributes/attributenames", {
            ResourceName: val,
          })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.attributes = data;
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

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });

        $http
          .post(BASEURL + "/rest/v2/roles/operationlist", {
            ResourceName: val,
          })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            setTimeout(function () {
              $(".js-select2-multiple").select2();
            }, 1000);
            $scope.operationlist = data;
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

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

      $scope.checkBoxChecked = false;
      $scope.active = false;

      $scope.tabClickCnt = 0;

      function removeCheckTrue(Arr12345) {
        for (i = 0; i < Arr12345.length; i++) {
          for (j = 0; j < Arr12345[i].PermissionList.length; j++) {
            delete Arr12345[i].PermissionList[j].check;
          }
        }
        return Arr12345;
      }

      $scope.currentActiveTab = "";

      $scope.saveAll = function (toUpdateData, RoleID, index) {
        $scope.changevalue = false;
        $scope.updateData = {};
        $scope.updateData.RoleID = RoleID;
        var element = $(".tabbable-custom")
          .find("ul:first-child")
          .find(".active");
        $scope.updateData.ResourceGroupName = element.data("resource");
        //$scope.updateData.ResourceGroupName = $('#collapse' + index).find('.listGroup').find('.active').text().trim();
        $scope.currentActiveTab = $(".tabbable-custom")
          .find("ul:first-child")
          .find(".active")
          .text()
          .trim();
        $scope.updateData.ResourceGroupPermissions =
          removeCheckTrue(toUpdateData);

        $scope.active = false;
        $scope.checkBoxChecked = false;

        $http({
          method: "PUT",
          url: BASEURL + "/rest/v2/roles/achgroupresourcepermission",
          data: $scope.updateData,
        })
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];

            $(".collapse").collapse("hide");

            setTimeout(function () {
              $(".alert-success").hide();
            }, 3000);

            //$state.reload();
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.userRoles = [];
      $http
        .get(BASEURL + RESTCALL.CreateRole)
        .then(function onSuccess(response) {
          // Handle success
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;

          //$scope.userRoles = data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].RoleID != "Super Admin") {
              $scope.userRoles.push(data[i]);
            }
          }

          if ($scope.userRoles.length > 0) {
            $scope.showAlert = false;
          } else {
            $scope.showAlert = true;
          }
        })
        .catch(function onError(response) {
          // Handle error
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;

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

      function removeAdminPanel(Arr12344) {
        var rGroupFinal = [];
        for (i = 0; i < Arr12344.length; i++) {
          if (Arr12344[i].ResourceGroupName != "Admin Panel") {
            rGroupFinal.push({
              ResourceGroupName: Arr12344[i].ResourceGroupName,
            });
          }
        }

        return rGroupFinal;
      }

      if ($stateParams.input != null) {
        $http
          .post(BASEURL + "/rest/v2/roles/achgetresourcegroupname", {
            roleId:
              "roledDetails" in $stateParams.input
                ? $stateParams.input.roledDetails.v2
                : $stateParams.input.v2,
          })
          .then(function onSuccess(response) {
            // Handle success

            var data = response.data;

            var status = response.status;

            var statusText = response.statusText;

            var headers = response.headers;

            var config = response.config;

            data.sort((a, b) => {
              const order = {
                "Home": 1,
                "Payment Module": 2,
                "Cycle Module": 3,
                "Sanction Module": 4,
                "Commission Module": 5,
                "Clearing Report": 6,
                "Users Roles": 7,
                "PSE":8,
                "Reference Data": 9,
                "Onboarding Data": 10,
                "Distribution Data": 11,
                "System Data": 12,
                "System Monitoring": 13,
                "Security": 14,
                "Reports": 15,
                "Add On": 16,
              };

              const newA =
                order[a.ResourceGroupName] || Object.keys(order).length;

              const newB =
                order[b.ResourceGroupName] || Object.keys(order).length;

              return newA - newB;
            });

            $scope.resourceGroup = data;

            $scope.rG = data[0].ResourceGroupName;

            if (!$stateParams.input) {
              $location.path("app/roles");
            }
            if ("roledDetails" in $stateParams.input) {
              $scope.getGroupPermission(
                $scope.rG,
                $stateParams.input.roledDetails.v2,
                $stateParams.input.roledDetails.index,
                $stateParams.input.roledDetails.zero
              );
      
              $scope.getEditStructure($stateParams.input.roledDetails.v2);
            } else if ("v1" in $stateParams.input) {
              $scope.getGroupPermission(
                $scope.rG,
                $stateParams.input.v2,
                $stateParams.input.index,
                $stateParams.input.zero
              );
      
              $scope.getEditStructure($stateParams.input.v2);
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
      } else {
        $state.go("app.roles");
      }
      $scope.roleFlag = false;

      $scope.showRoles1 = false;
      $scope.showRoles2 = true;

      $scope.currentIndex = "";

      $scope.gotoEdit = function (v1, v2, Opt) {
        $scope.editObj = {};
        $scope.editObj.Resourcename = v1;
        $scope.editObj.RoleId = v2;
        $scope.editObj.ToEditPage = true;
        $scope.editObj.Operation = Opt;
        var dataObj = {}; // have to form the request payload
        dataObj["TableName"] = "Role";
        // dataObj['ActionName'] = actions.ActionName;
        dataObj["IsLocked"] = true;
        dataObj["BusinessPrimaryKey"] = JSON.stringify({ RoleID: v2 });

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
      };

      $scope.getGroupName = function ($event) {
        $scope.grpName = $($event.currentTarget)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .find("ul")
          .find(".active")
          .text()
          .trim();
      };

      $scope.setDefault = function ($event) {
        $("#resetRoleBox").modal("hide");

        $http
          .post(BASEURL + RESTCALL.ACHDefaultPermision, {
            RoleId: $scope.RoleID,
          })
          .then(function (response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            var element = $(".tabbable-custom")
              .find("ul:first-child")
              .find(".active");
            var content = element.data("resource");
            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];
            $http
              .post(BASEURL + RESTCALL.GetAllResourcePermission + "/readall", {
                RoleID: $scope.RoleID,
                ResourceGroupName: content,
              })
              .then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                getActionHeaders(data);
                $scope.resourcePermission = data;
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
                errorservice.ErrorMsgFunction(config, $scope, $http, status);
              });
            setTimeout(function () {
              $(".alert-success").hide();
            }, 3000);
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.callAtTimeout = function () {
        $(".alert").hide();
      };

      $scope.prevIndex = "";

      $scope.getAccordion = function (v1, v2, index) {
        $location.path("app/viewresourcepermission");

        // $scope.currentIndex = index;
        // if ($('#collapse' + $scope.prevIndex).hasClass('in')) {

        // 	if ($scope.active) {
        // 		$('#roleEdit1').modal('show')
        // 		$scope.newObj = {};
        // 		$scope.newObj.v1 = v1;
        // 		$scope.newObj.v2 = v2;
        // 		$scope.newObj.index = index;
        // 		$scope.newObj.zero = 0;

        // 	} else {

        // 		$scope.active = false;
        // 		$('.checkClass').removeClass('checked')
        // 		$scope.checkBoxChecked = false;
        // 		$('.collapse').collapse('hide')
        // 		$('#collapse' + index).collapse('show')
        // 		$scope.prevIndex = index;
        // 		$scope.getGroupPermission(v1, v2, index, 0);
        // 	}
        // } else {
        // 	$scope.active = false;
        // 	$('.checkClass').removeClass('checked')
        // 	$scope.checkBoxChecked = false;
        // 	$('#collapse' + index).collapse('show')
        // 	$scope.prevIndex = index;
        // 	$scope.getGroupPermission(v1, v2, index, 0);
        // }

        // $scope.showRoles1 = false
        // 	$scope.showRoles2 = true;

        // setTimeout(function () {
        // 	$('#tab_' + index).css('display', 'block');
        // }, 100)

        // if(!$scope.checkBoxChecked)
        // {
        // 	$('.listGroupList').removeClass('active')
        // 	$("#listGroupListID_" + v2 + "_0").addClass('active')
        // }
      };

      $scope.updateExistingRoles = function (role) {
        role.IsSuperAdmin = true;
        $http
          .put(BASEURL + RESTCALL.CreateRole, role)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];

            $(".collapse").collapse("hide");

            setTimeout(function () {
              $scope.callAtTimeout();
            }, 4000);

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

            setTimeout(function () {
              $scope.callAtTimeout();
            }, 4000);

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.looseChanges1 = function () {
        $scope.changevalue = false;

        $("#roleEdit1").modal("hide");
        $scope.active = false;
        $(".checkClass").removeClass("checked");
        $scope.checkBoxChecked = false;

        $(".collapse").collapse("hide");
        $("#collapse" + $scope.currentIndex).collapse("show");
        $scope.prevIndex = $scope.currentIndex;
        $("#rolesTable td").css("padding", "12px");
        $scope.getAccordion(
          $scope.newObj.v1,
          $scope.newObj.v2,
          $scope.newObj.index
        );
      };

      $scope.looseChanges = function () {
        $scope.changevalue = false;

        $("#roleEdit").modal("hide");

        if ($("#collapse" + $scope.currentIndex).hasClass("in")) {
          $scope.showRoles1 = true;
          $scope.showRoles2 = false;
          $scope.active = false;
          $scope.checkBoxChecked = false;
        }
        /* else{
        $('#collapse'+index).collapse('show')
        $scope.showRoles1 = true
        $scope.showRoles2 = false;
        }*/
      };

      $scope.keepOriginal = function () {
        $scope.changevalue = false;
        $scope.checkBoxChecked = false;
        $scope.active = false;
        $("#rolesTable td").css("padding", "12px");
        $(".alert-danger").hide();

        $state.go("app.roles");
      };

      $scope.GoBackFromRole = function (index) {
        $scope.active = false;
        $("#collapse" + index).collapse("hide");
      };

      $scope.enableStatus = function (cTab) {
        //$scope.active = true;
        $scope.changevalue = false;
        $scope.CurrentTab = cTab;
        $scope.checkBoxChecked = false;
        $scope.rG = cTab;
        $scope.active = false;
        setTimeout(function () {
          $("#checkId").removeClass("checked");
        }, 100);
      };

      $scope.callAtTimeout = function () {
        $(".alert").hide();
      };

      $scope.fromMod = "";
      $scope.gotoDeleteFn = function (resource, roleid) {
        $scope.deleteDisRole = roleid;
        $scope.fromMod = true;
      };

      $scope.takeDeldata = function (roleid) {
        $scope.delObj = {};
        $scope.delObj.RoleID = $scope.deleteDisRole;
        $http
          .post(BASEURL + RESTCALL.CreateRole + "/delete", $scope.delObj)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.roleAdded = true;
            if (data) {
              $rootScope.roleAddedMesg = data;
            } else {
              $rootScope.roleAddedMesg = {
                responseMessage: "Borrado exitosamente",
              };
            }

            $(".alert-danger").hide();
            $location.path("app/roles");

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

      function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == "object") {
            objects = objects.concat(getObjects(obj[i], key, val));
          }
          //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
          else if ((i == key && obj[i] == val) || (i == key && val == "")) {
            //
            objects.push(obj);
          } else if (obj[i] == val && key == "") {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1) {
              objects.push(obj);
            }
          }
        }
        return objects;
      }

      function getActionHeaders(rpArray) {
        $scope.aheader = [];
        for (i = 0; i < rpArray.length; i++) {
          for (j = 0; j < rpArray[i].PermissionList.length; j++) {
            $scope.aheader.push(rpArray[i].PermissionList[j].Operation);
          }
        }

        return _.uniq($scope.aheader);
      }
      $scope.attrHide = false;
      $scope.getGroupPermission = function (gName, roleID, parentId, curId) {
        $scope.dataContain = $stateParams.input.roledDetails;
        $scope.grpName = gName;
        $scope.RoleID = roleID;
        $scope.RoleType = $stateParams.input.roledDetails.Roletype;
        $scope.StatusFromRole = $stateParams.input.roledDetails.Status;
        $scope.EffectivedateFromRole = $stateParams.input.roledDetails.EffectiveDate;
        $scope.EffectivedateTillRole = $stateParams.input.roledDetails.EffectiveTillDate;

        $scope.toPostData = {};
        $scope.toPostData.RoleID = roleID;
        $scope.toPostData.ResourceGroupName = gName;
        $http
          .post(
            BASEURL + RESTCALL.GetAllResourcePermission + "/readall",
            $scope.toPostData
          )
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            data.forEach((item) => {
              if (item.PermissionList) {
                const order = item.PermissionList.sort((a, b) => {
                  switch (a.Operation) {
                    case "C":
                      return 1;

                    case "R":
                      if (b.Operation === "C") {
                        return -1;
                      } else {
                        return 1;
                      }

                    case "U":
                      if (b.Operation === "C" || b.Operation === "R") {
                        return -1;
                      } else {
                        return 1;
                      }

                    case "D":
                      if (
                        b.Operation === "C" ||
                        b.Operation === "R" ||
                        b.Operation === "U"
                      ) {
                        return -1;
                      } else {
                        return 1;
                      }

                    default:
                      return -1;
                  }
                });

                item.PermissionList = order.reverse();
              } else {
                item.PermissionList = [];
              }
            });
            $scope.actionHeader123 = getActionHeaders(data);
            $scope.resourcePermission = data;
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
      };
      $scope.getEditStructure = function (roleID) {
        var query = {
          RoleName: roleID,
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
            $scope.IsRoleEditable = data.IsRoleEditable;
            $scope.rolesList = data;
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
      /*   $http.get('roles.json').then(function onSuccess(response) {
    	// Handle success
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;
    	$scope.rolesData = data;
    }).catch(function onError(response) {
    	// Handle error
    	var data = response.data;
    	var status = response.status;
    	var statusText = response.statusText;
    	var headers = response.headers;
    	var config = response.config;

    }); */



      $stateParams.input.responseMessage
        ? ($scope.alerts = [
            {
              type: "success",
              msg: $stateParams.input.responseMessage,
            },
          ])
        : "";

      $scope.users = [
        {
          name: "All Clients",
          value: "All Clients",
        },
        {
          name: "System",
          value: "System",
        },
        {
          name: "Client Id",
          value: "Client Id",
        },
      ];
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

      /* $scope.getRoleDetail = function(index){
    if($('#collapse'+index).hasClass('in')){

    if($scope.showRoles){
    $('#collapse'+index).collapse('hide')
    $scope.showRoles = false;
    }
    else{
    $('#collapse'+index).collapse('show')
    $scope.showRoles = true;
    }

    }
    else{


    if($scope.showRoles){
    $('#collapse'+index).collapse('hide')
    $scope.showRoles = false;
    }
    else{
    $('#collapse'+index).collapse('show')
    $scope.showRoles = true;
    }
    }

    }*/

      $scope.AddNewRole = function () {
        $location.path("app/addroles");
      };

      $scope.AddNewPermissions = function () {
        $location.path("app/addpermissions");
      };

      /*** On window resize ***/
      $(window).resize(function () {
        $scope.$apply(function () {
          $scope.alertWidth = $(".alertWidthonResize").width();
        });
      });

      $scope.action123 = false;
      $scope.buttonStatus = 0;
      $scope.editAllAttribute = function (val, flag) {
        if (val == "" || val == false) {
          $scope.action123 = true;
        }
        //else {
        // 	$scope.action123 = false;
        // }
      };

      $scope.operators = ["=", "!=", "<", ">", "<=", ">=", "IN"];

      $scope.addAttribute = function (as, asd, ResourceName, uRoles, key) {
        setTimeout(function () {
          $(".js-select2-multiple").select2();
        }, 0);

        if (key == undefined) {
          key = 0;
        }
        $scope.Obj[key] = true;
        if ($scope.trial.Attributes == undefined) {
          $scope.trial.Attributes = [];
        }
        $scope.attributeObj = {};
        $scope.attributeObj.AttributeName = "";
        $scope.attributeObj.Operator = "";
        $scope.attributeObj.AttributeValue = "";
        $scope.attributeObj.Permissions = [];
        $scope.attributeObj.Permissions123 = [];
        /* $scope.attributeObj.Permissions = [{
        "Operation" : "C",
        "Permission" : false
        }, {
        "Operation" : "R",
        "Permission" : false
        }, {
        "Operation" : "U",
        "Permission" : false
        }, {
        "Operation" : "D",
        "Permission" : false
        }
        ]; */

        $scope.trial.Attributes.push($scope.attributeObj);
      };

      function AttributeObjRestructure(Arr) {
        for (i = 0; i < Arr.length; i++) {
          var InnerArr = Arr[i].Permissions;

          for (j = 0; j < InnerArr.length; j++) {
            if (
              j == 0 &&
              InnerArr[j].Permission == true &&
              InnerArr[j].Permission != ""
            ) {
              InnerArr[j].Permission = "C";
            } else {
              delete InnerArr[j];
            }

            if (
              j == 1 &&
              InnerArr[j].Permission == true &&
              InnerArr[j].Permission != ""
            ) {
              InnerArr[j].Permission = "R";
            } else {
              delete InnerArr[j];
            }

            if (
              j == 2 &&
              InnerArr[j].Permission == true &&
              InnerArr[j].Permission != ""
            ) {
              InnerArr[j].Permission = "U";
            } else {
              delete InnerArr[j];
            }

            if (
              j == 3 &&
              InnerArr[j].Permission == true &&
              InnerArr[j].Permission != ""
            ) {
              InnerArr[j].Permission = "D";
            } else {
              delete InnerArr[j];
            }

            /*
                if(InnerArr[j].Permission==false){
                delete InnerArr[j];
                } */
          }
          delete Arr[i].Permissions123;
        }

        return Arr;
      }

      function AttributeObjRestructure2(Arr) {
        for (i = 0; i < Arr.length; i++) {
          var InnerArr = Arr[i].Permissions;

          for (j = 0; j < InnerArr.length; j++) {
            if (j == 0 && InnerArr[j].Permission == "C") {
              InnerArr[j].Permission = true;
            } else {
              delete InnerArr[j].Permission;
            }
            if (j == 1 && InnerArr[j].Permission == "R") {
              InnerArr[j].Permission = true;
            } else {
              delete InnerArr[j].Permission;
            }
            if (j == 2 && InnerArr[j].Permission == "U") {
              InnerArr[j].Permission = true;
            } else {
              delete InnerArr[j].Permission;
            }
            if (j == 3 && InnerArr[j].Permission == "D") {
              InnerArr[j].Permission = true;
            } else {
              delete InnerArr[j];
            }
          }
        }
        return Arr;
      }

      function UniqueArrayofObject(array) {
        var flags = [],
          output = [],
          l = array.length,
          i;
        for (i = 0; i < l; i++) {
          if (flags[array[i].Operation]) continue;
          flags[array[i].Operation] = true;
          var _dataObject = {};
          _dataObject.Operation = array[i].Operation;
          _dataObject.Permission = array[i].Permission;
          output.push(_dataObject);
        }
        return output;
      }

      function AttributeObjRestructure3(Arr) {
        var myVar = [];

        for (i = 0; i < Arr.length; i++) {
          var InnerArr = Arr[i].Permissions123;

          var _ArrayFlag = false;

          if (
            !$.isArray(InnerArr[0]) &&
            JSON.stringify(InnerArr[0]).indexOf("{") != -1
          ) {
            for (let i in InnerArr) {
              if (InnerArr[i].Permission) {
                myVar.push(InnerArr[i]);
              }
            }
            InnerArr = UniqueArrayofObject(myVar);
          } else {
            _ArrayFlag = true;
          }

          delete Arr[i].Permissions;
          Arr[i].Permissions = [];
          for (j = 0; j < InnerArr.length; j++) {
            var OP123 = {};

            if ($scope.RoleType != "Approver") {
              /*if (InnerArr[j] == 'Create') {
                    		OP123.Operation = InnerArr[j];
                    		OP123.Permission = true;
                    		}
					
                    		if (InnerArr[j] == 'Read') {
                    			OP123.Operation = InnerArr[j];
                    			OP123.Permission = true;
                    		}
                    		if (InnerArr[j] == 'Update') {
                    			OP123.Operation = InnerArr[j];
                    			OP123.Permission = true;
                    		}
                    		if (InnerArr[j] == 'Delete') {
                    			OP123.Operation = InnerArr[j];
                    			OP123.Permission = true;
                    		}*/
              if (_ArrayFlag) {
                OP123.Operation = InnerArr[j];
                OP123.Permission = true;
              } else {
                OP123 = InnerArr[j];
              }
            } else {
              if (InnerArr[j] == "approve1") {
                OP123.Operation = InnerArr[j];
                OP123.Permission = true;
              }
              if (InnerArr[j] == "approve2") {
                OP123.Operation = InnerArr[j];
                OP123.Permission = true;
              }
              if (InnerArr[j] == "approve3") {
                OP123.Operation = InnerArr[j];
                OP123.Permission = true;
              }
              if (InnerArr[j] == "approve4") {
                OP123.Operation = InnerArr[j];
                OP123.Permission = true;
              }
              if (InnerArr[j] == "approve5") {
                OP123.Operation = InnerArr[j];
                OP123.Permission = true;
              }
            }
            Arr[i].Permissions.push(OP123);
          }
          delete Arr[i].Permissions123;
        }
        return Arr;
      }
      $scope._ResourceName = "";
      $scope.submitAllAttribute = function (
        attributeArray,
        ResourceName,
        RoleID
      ) {
        $(".expandRow ").css("display", "none");

        $scope.Obj = {};
        var FinalObj = {};
        FinalObj.ResourceName = ResourceName;
        FinalObj.RoleID = RoleID;

        FinalObj.Attributes = AttributeObjRestructure3(
          attributeArray.Attributes
        );
        //FinalObj.Attributes = attributeArray.Attributes;

        $http
          .post(BASEURL + "/rest/v2/roles/attributes", FinalObj)
          .then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [
              {
                type: "success",
                msg: data.responseMessage,
              },
            ];

            //$('.collapse').collapse('hide');

            setTimeout(function () {
              $(".alert-success").hide();
            }, 4000);

            $scope.action123 = false;
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
            errorservice.ErrorMsgFunction(config, $scope, $http, status);
          });
      };

      $scope.toggleAll = function (permissionArr, value111) {
        angular.forEach(permissionArr, function (itm) {
          itm.Permission = value111;
        });
      };

      $scope.attributeCollapse = function () {
        $scope.Obj = {};
        $scope.action123 = true;
      };

      $scope.deleteRow = function (rowNum) {
        var Attributes123 = $scope.trial.Attributes;
        Attributes123.splice(rowNum, 1);
      };

      //$scope.jjj_0=false;
      $scope.editRow = function (rowNum) {
        $scope.Obj[rowNum] = true;
        //$scope.jjj_0=true;
        //editRow
      };

      $scope.getActionValue123 = function (v1, Arr123) {
        for (i = 0; i < Arr123.length; i++) {
          if (Arr123[i].Operation == v1) {
            Arr123[i].check = true;
            return Arr123[i];
          }
        }
      };

      $scope.changeValue = function (val, Arr) {
        var array = Arr;

        for (i in array) {
          var array1 = array[i].PermissionList;
          for (j in array1) {
            array1[j].Permission = val;
          }
        }

        return Arr;
        //	$scope.checkBoxChecked = true;
      };

      $http
        .post(
          BASEURL + RESTCALL.RoleAuditLog + "?count=" + 20 + "&start=" + 0,
          {
            RoleID: $scope.RoleID,
          }
        )
        .then(function onSuccess(response) {
          // Handle success
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;

          $scope.editedLog = data;
          $scope.dataLen = data;

          for (var j in $scope.editedLog) {
            for (var keyj in $scope.editedLog[j]) {
              if (keyj == "oldData" || keyj == "newData") {
                $scope.editedLog[j][keyj] = $filter("hex2a")(
                  $scope.editedLog[j][keyj]
                );

                if (
                  $scope.editedLog[j][keyj].match(/</g) &&
                  $scope.editedLog[j][keyj].match(/>/g)
                ) {
                  var xmlDoc = $.parseXML($scope.editedLog[j][keyj]); //is valid XML
                  var xmlData = xmlDoc.getElementsByTagName(
                    $scope.editedLog[j].tableName
                  );
                  var constuctfromXml = {};
                  var constuctfromXmlObj = {};
                  var constuctfromXmlarr = [];
                  $(xmlDoc)
                    .children()
                    .each(function (e) {
                      $(this)
                        .children()
                        .each(function (e) {
                          var parentName = $(this).prop("tagName");
                          if ($(this).children().length) {
                            constuctfromXml[parentName] = constuctfromXmlarr;
                            $(this)
                              .children()
                              .each(function (e) {
                                constuctfromXmlObj[$(this).prop("tagName")] =
                                  $(this).text();
                                constuctfromXmlarr.push(constuctfromXmlObj);
                                constuctfromXmlObj = {};
                              });
                          } else {
                            constuctfromXml[parentName] = $(this).text();
                          }
                        });
                    });
                  $scope.editedLog[j][keyj] = constuctfromXml;
                } else {
                  $scope.editedLog[j][keyj] = false;
                }
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

          errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

      var len = 20;
      var loadMore = function () {
        if ($scope.dataLen.length >= 20) {
          $http
            .post(
              BASEURL +
                RESTCALL.RoleAuditLog +
                "?count=" +
                20 +
                "&start=" +
                len,
              {
                RoleID: $scope.RoleID,
              }
            )
            .then(function onSuccess(response) {
              // Handle success
              var data = response.data;
              var status = response.status;
              var statusText = response.statusText;
              var headers = response.headers;
              var config = response.config;

              $scope.dataLen = data;
              if (data.length != 0) {
                $scope.editedLog = $scope.editedLog.concat($scope.dataLen);

                len = len + 20;
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
                  type: "danger",
                  msg: data.error.message,
                },
              ];

              $scope.alertStyle = alertSize().headHeight;
              $scope.alertWidth = alertSize().alertWidth;
              errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        }
      };

      $(document).ready(function () {
        // var debounceHandler = _.debounce(loadMore, 700, true);
        $(".editBody").on("scroll", function () {
          if (
            Math.round($(this).scrollTop() + $(this).innerHeight()) >=
            $(this)[0].scrollHeight
          ) {
          }
        });
      });

      $scope.auditLogDetails = "";
      $scope.commentVal = "";

      $scope.costructAudit = function (argu) {
        $scope.auditLogDetails = argu;
        $("#auditModel").find("tbody").html("");

        if (argu.oldData && argu.newData) {
          $("#auditModel")
            .find("tbody")
            .append(
              "<tr><th>" +
                $filter("translate")("ApprovalDts.Field") +
                "</th><th>" +
                $filter("translate")("ApprovalDts.OldData") +
                "</th><th>" +
                $filter("translate")("ApprovalDts.NewData") +
                "</th></tr>"
            );
        } else {
          $("#auditModel")
            .find("tbody")
            .append(
              "<tr><th>" +
                $filter("translate")("ApprovalDts.Field") +
                "</th><th>" +
                $filter("translate")("ApprovalDts.Data") +
                "</th></tr>"
            );
        }
        var _keys = "";

        if ($.isPlainObject(argu.oldData) && $.isPlainObject(argu.newData)) {
          _keys =
            Object.keys(argu.oldData).length >= Object.keys(argu.newData).length
              ? Object.keys(argu.oldData)
              : Object.keys(argu.newData);
        } else if ($.isPlainObject(argu.oldData)) {
          _keys = Object.keys(argu.oldData);
        } else if ($.isPlainObject(argu.newData)) {
          _keys = Object.keys(argu.newData);
        }

        for (var j in _keys) {
          if (!_keys[j].match(/_PK/g)) {
            var _tr = "";
            if (j % 2) {
              _tr = "<tr style='background-color: rgb(245, 245, 245)'>";
            } else {
              _tr = "<tr style='background-color: #fff'>";
            }
            _tr =
              _tr +
              "<td>" +
              $filter("translate")("RolesAndPermissions." + _keys[j]) +
              "</td>";
            if (argu.oldData && argu.newData) {
              if (argu.oldData) {
                _tr = _tr + "<td>";
                if (argu.oldData[_keys[j]]) {
                  if (typeof argu.oldData[_keys[j]] == "object") {
                    _tr =
                      _tr +
                      "<pre>" +
                      $filter("json")(argu.oldData[_keys[j]]) +
                      "</pre>";
                  } else {
                    _tr = _tr + argu.oldData[_keys[j]];
                  }
                }
                _tr = _tr + "</td>";
              }
              if (argu.newData) {
                if (argu.newData[_keys[j]]) {
                  if (
                    argu.oldData &&
                    argu.newData[_keys[j]] != argu.oldData[_keys[j]]
                  ) {
                    _tr = _tr + '<td class="modifiedClass">';
                  } else {
                    _tr = _tr + "<td>";
                  }
                  if (typeof argu.newData[_keys[j]] == "object") {
                    _tr =
                      _tr +
                      "<pre>" +
                      $filter("json")(argu.newData[_keys[j]]) +
                      "</pre>";
                  } else {
                    _tr = _tr + argu.newData[_keys[j]];
                  }
                  _tr = _tr + "</td>";
                }
              }
            } else {
              if (argu.newData) {
                _tr = _tr + "<td>";
                if (argu.newData[_keys[j]]) {
                  if (typeof argu.newData[_keys[j]] == "object") {
                    _tr =
                      _tr +
                      "<pre>" +
                      $filter("json")(argu.newData[_keys[j]]) +
                      "</pre>";
                  } else {
                    _tr = _tr + argu.newData[_keys[j]];
                  }
                }
                _tr = _tr + "</td>";
              } else if (argu.oldData) {
                _tr = _tr + "<td>";
                if (argu.oldData[_keys[j]]) {
                  if (typeof argu.oldData[_keys[j]] == "object") {
                    _tr =
                      _tr +
                      "<pre>" +
                      $filter("json")(argu.oldData[_keys[j]]) +
                      "</pre>";
                  } else {
                    _tr = _tr + argu.oldData[_keys[j]];
                  }
                }
                _tr = _tr + "</td>";
              }
            }
            $("#auditModel").find("tbody").append(_tr);
          }
        }

        if (argu.action.match(/:/g)) {
          $scope.commentVal = argu.action.split(/:(.+)/);
        } else {
          $scope.commentVal = "";
        }
      };

      $scope.sTrial = "";
      $scope.sResource = "";
      $scope.sRoleid = "";
      $scope.setKey = function (key, trial, resource, roleid) {
        $scope.sKey = key;
        $scope.sTrial = trial;
        $scope.sResource = resource;
        $scope.sRoleid = roleid;
        $scope.fromMod = false;
      };

      $scope.submitDeldata = function () {
        var Attributes123 = $scope.sTrial.Attributes;
        Attributes123.splice($scope.sKey, 1);
        $("#delPopup").modal("hide");
        $scope.submitAllAttribute(
          $scope.sTrial,
          $scope.sResource,
          $scope.sRoleid
        );
        //$scope.detailExpanded = false;
      };

      $scope.cancelClear = function () {
        $(".expandRow ").css("display", "none");
      };
      $scope.showaudit = function (argu) {
        $scope.costructAudit(argu);
        $("#auditModel").modal("toggle");
      };

      var reactivateObj = {};

      $scope.gotoReactivate = function (_data) {
        var GetPrimaryKeys = angular.copy($rootScope.primarykey);
        reactivateObj["RoleID"] = _data;
        var paramsData = {
          method: "POST",
          url: BASEURL + "/rest/v2/roles/reactivate",
          data: reactivateObj,
        };
        $http(paramsData).then(
          function (response) {
            $scope.input = {
              responseMessage: response.data.responseMessage,
            };
            $state.go("app.roles", {
              input: $scope.input,
            });
          },
          function (err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status);
          }
        );
      };
      
      $scope.EditPermission = function(){
        if ($scope.IsRoleEditable && $scope.newPermission.U && ($stateParams.input.roledDetails.v2.indexOf('FE_', 0) != 0) 
        && ($stateParams.input.roledDetails.v2.indexOf('ACH_', 0) != 0) && ($stateParams.input.roledDetails.v2.indexOf('DefaultIO_', 0) != 0) && ($stateParams.input.roledDetails.v2.indexOf('DefaultPSE_', 0) != 0)){
          return true;
        }else{
          return false;
        }
      }
    }
  );
