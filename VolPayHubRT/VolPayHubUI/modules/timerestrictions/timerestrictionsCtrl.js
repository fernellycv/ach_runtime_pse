angular.module('VolpayApp').controller('timeRestrictionsCtrl', function ($scope, $timeout, $stateParams, $http, datepickerFaIcons, $filter, moment, GetPermissions) {
    $scope.newPermission = GetPermissions("Time Restrictions");
    const default_timeRestrictionsData = {
        "Entity": sessionStorage.getItem('EntityUser'),
        "IsWeekday": false,
        "IsMonDay": false,
        "IsTuesDay": false,
        "IsWednesDay": false,
        "IsThursDay": false,
        "IsFriDay": false,
        "IsSaturDay": false,
        "IsSunDay": false,
        "EmailIds": []
    };

    $scope.init = function () {
        $scope.timeRestrictionsData = angular.copy(default_timeRestrictionsData);
        $scope.timeRestrictionsData.TimePeriodType = "24/7";
        $scope.parentInput = angular.copy($stateParams.input);
        $scope.Roles = [];
        $scope.field = {
            "type": "TimeOnly"
        }

        $http.get(BASEURL + '/rest/v2/timerestrictions/role/readall').then(function onSuccess(response) {
            var data = response.data;

            $scope.Roles = data.Role;

            $timeout(function () {
                $(".alert-success").hide();
            }, 5000);
        }).catch(function onError(error) {
            // Handle error
            var data = error.data;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];

            $timeout(function () {
                $(".alert-danger").hide();
            }, 5000);
        });

    }
    $scope.init();

    $scope.reset = function (form) {
        $timeout(() => {
            $('select[name=RoleId]').val(null).trigger("change");
            delete $scope.timeRestrictionsData["RoleId"];
            $scope.init();
            form.$setPristine(true);
            form.$setUntouched();
        }, 10);
    }

    $scope.submitTimeRestrictions = function (form, payload, isFormValid) {
        if (payload && isFormValid) {
            if (payload.TimePeriodType == "24/7") {
                dataObj = {
                    "RoleId": angular.copy(payload.RoleId),
                    "Entity": angular.copy(payload.Entity),
                    "TimePeriodType": angular.copy(payload.TimePeriodType),
                    "EmailIds": angular.copy(payload.EmailIds)
                }
            } else {
                dataObj = angular.copy(payload);
            }

            if(dataObj.EmailIds.length) {
                dataObj.EmailIds = [...new Set(dataObj.EmailIds)];
                delete payload.EmailIdsExt;
            }
            
            if(dataObj.EmailIdsExt){
                delete dataObj.EmailIdsExt;
            }

            $http.post(BASEURL + '/rest/v2/timerestrictions/data', dataObj).then(function onSuccess(response) {
                var data = response.data;

                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }];

                $timeout(function(){
                    $scope.reset(form);
                    // form.$setValidity();
                    // form.$setPristine(true);
                    // form.$setUntouched();
                });

                $timeout(function () {
                    $(".alert-success").hide();
                }, 5000);
            }).catch(function onError(error) {
                // Handle error
                var data = error.data;

                $scope.alerts = [{
                    type: 'danger',
                    msg: data.responseMessage
                }];

                $timeout(function () {
                    $(".alert-danger").hide();
                }, 5000);
            });
        }
    }

    $scope.timeDetails = function (timePayload) {
        if (timePayload && timePayload.RoleId) {
            const dataObj = {
                "RoleId": timePayload.RoleId,
                "Entity": timePayload.Entity
            }

            $http.post(BASEURL + '/rest/v2/timerestrictions/search', dataObj).then(function onSuccess(response) {
                var data = response.data;

                if (!angular.equals({}, data)) {
                    $scope.timeRestrictionsData = angular.copy(data);
                    $scope.timeRestrictionsData.Entity = sessionStorage.getItem('EntityUser');
                } else {
                    $scope.timeRestrictionsData = angular.copy(dataObj);
                    $scope.timeRestrictionsData.Entity = sessionStorage.getItem('EntityUser');
                    $scope.timeRestrictionsData.TimePeriodType = "24/7";
                }
                if(!$scope.timeRestrictionsData.EmailIds){
                    // $scope.timeRestrictionsData.EmailIds = $scope.timeRestrictionsData.EmailIds[0].split(',');
                    $scope.timeRestrictionsData.EmailIds = [];
                }
            }).catch(function onError(error) {
                // Handle error
                var data = error.data;

                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];

                $timeout(function () {
                    $(".alert-danger").hide();
                }, 5000);
            });

        } else {
            $scope.timeRestrictionsData = angular.copy(default_timeRestrictionsData);
            $scope.timeRestrictionsData.TimePeriodType = "24/7";
        }
    }

    $scope.checkWeekdays = function (params) {
        if (params.IsWeekday) {
            $scope.timeRestrictionsData.IsMonDay = !params.IsWeekday;
            $scope.timeRestrictionsData.IsTuesDay = !params.IsWeekday;
            $scope.timeRestrictionsData.IsWednesDay = !params.IsWeekday;
            $scope.timeRestrictionsData.IsThursDay = !params.IsWeekday;
            $scope.timeRestrictionsData.IsFriDay = !params.IsWeekday;

            if (params.WeekdaysStartTime) {
                $scope.timeRestrictionsData.MondayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.TuesdayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.WednesdayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.ThursdayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.FridayStartTime = params.WeekdaysStartTime;
            } else {
                $scope.timeRestrictionsData.MondayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.TuesdayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.WednesdayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.ThursdayStartTime = params.WeekdaysStartTime;
                $scope.timeRestrictionsData.FridayStartTime = params.WeekdaysStartTime;
            }

            if (params.WeekdaysEndTime) {
                $scope.timeRestrictionsData.MondayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.TuesdayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.WednesdayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.ThursdayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.FridayEndTime = params.WeekdaysEndTime;
            } else {
                $scope.timeRestrictionsData.MondayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.TuesdayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.WednesdayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.ThursdayEndTime = params.WeekdaysEndTime;
                $scope.timeRestrictionsData.FridayEndTime = params.WeekdaysEndTime;
            }
        }
    }

    $scope.checkTimePeriodType = function (timeType) {
        if (timeType == "24/7") {
            $scope.timeRestrictionsData = Object.assign({}, angular.copy(default_timeRestrictionsData), { "TimePeriodType": timeType, "RoleId": $scope.timeRestrictionsData.RoleId, "EmailIds": $scope.timeRestrictionsData.EmailIds });
        } else if (timeType == "Daily") {
            $scope.timeRestrictionsData = Object.assign({}, angular.copy(default_timeRestrictionsData), $scope.timeRestrictionsData);
        }
    }

    $scope.checkDate = function (modelData, startDate, endDate) {
        if (moment(modelData[endDate], 'HH:mm:ss').diff(moment(modelData[startDate], 'HH:mm:ss'), 'time') < 0) {
            $scope.timeRestrictionsData[endDate] = "";
        }
    }

    $scope.add = function (emailid) {
        if (emailid && $scope.timeRestrictionsData.EmailIds.indexOf(emailid) == -1) {
            $scope.timeRestrictionsData.EmailIds.push(emailid);
            delete $scope.timeRestrictionsData.EmailIdsExt;
        }
    }

    $scope.del = function (i) {
        $scope.timeRestrictionsData.EmailIds.splice(i, 1);
    }

    $scope.checkTimeRequiredFlds = function(val){
        return val
    }

    $scope.triggerPicker = function (e) {
        if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $('input[name=' + $(e.currentTarget).prev().attr('name') + ']').data("DateTimePicker").show();
        }
    };

    $scope.multipleEmptySpace = function (e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
        if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $(e.currentTarget).data("DateTimePicker").hide();
        }
        if ($(e.currentTarget).hasClass('LeadingZero')) {
            var _val = $(e.currentTarget).val()
            if ($(e.currentTarget).val().length && $(e.currentTarget).val().length < $(e.currentTarget).attr('maxlength')) {
                _val = '0' + $(e.currentTarget).val()
                $(e.currentTarget).val(_val)
                $scope[$(e.currentTarget).attr('ng-model').split('[')[0]][$(e.currentTarget).attr('name')] = _val;
                $scope.multipleEmptySpace(e)
            }
        }
    }

});