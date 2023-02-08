angular.module('VolpayApp').controller('addrolesCtrl', function($scope, $stateParams, $rootScope, $filter, $http, $location, $state, $timeout, GlobalService, editservice, errorservice,  $interval, EntityLockService) {

    $scope.roleAdded = GlobalService.roleAdded;
    // $scope.madeChanges = true;
    $scope.role = {};

    $scope.toEdit_FromRoles = $state.params.input.FromRoles;

    $rootScope.$on("MyEvent", function(evt, data) {
            $("#changesLostModal").modal("show");
        })
        /*if($scope.roleAdded){
        $scope.alerts = [{
        type : 'success',
        msg : "Role added successfully"
        }];
        $scope.alertStyle =  alertSize().headHeight;
        $scope.alertWidth = alertSize().alertWidth;
        $timeout(callAtTimeout, 4000);
        GlobalService.roleAdded = false;

        }*/

    function callAtTimeout() {
        $('.alert-success').hide();
    }

    // $scope.role.Status=;

$rootScope.$on("MyEventforEditIdleTimeout", function(evt, data) {        
    $(window).off("mousemove keydown click");       
    $interval.cancel(findEvent);       
})

//idletime Start
var findEvent;
var secondfindEvent;
$scope.count = 0;
$scope.seccount = 10;  

function idletime(){ 
var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
// var editTimeoutCounter = 20;
 $scope.findIdleTime = function() {
     findEvent = $interval(function() {             
         $scope.count += 1;             
         if ($scope.count === editTimeoutCounter) {                 
                 $scope.unlockEntityToEdit();
                 $scope.stopIdleTimer();
                 $scope.stopsecondIdleTimer();
                //  $scope.gotoParent(); 
                $scope.GoBackFromRole();             
         }             
     }, 1000);
 };     
 $scope.findIdleTime();

$scope.callIdleTime = function() {         
    setTimeout(function() {
        $("#idletimeout_model").modal("show");
    }, 100)
    secondfindEvent = $interval(function() {             
        $(window).on("mousemove keydown click", function() { // find the window event
            $scope.stopsecondIdleTimer();
            $scope.seccount = 10;
            // $scope.findIdleTime();
            setTimeout(function() {
                $("#idletimeout_model").modal("hide");
            }, 100)
        });
        $scope.seccount -= 1;
        if ($scope.seccount === 0) {             
            $scope.stopsecondIdleTimer();
            $stateParams.input.Operation = "";
            // $scope.gotoParent();
            $scope.GoBackFromRole();
        }
    }, 1000);
}

}
idletime();

$scope.stopsecondIdleTimer = function() {
    if (angular.isDefined(secondfindEvent)) { 
        // $(window).off('mousemove keydown click', secondfindEvent); 
        $(window).off( "mousemove keydown click" );           
        // clearInterval(secondfindEvent)              
        $interval.cancel(secondfindEvent);
        secondfindEvent = undefined;
    }
};

$scope.stopIdleTimer = function() {
    if (angular.isDefined(findEvent)) {
        // $(window).off('mousemove keydown click', findEvent)ca; 
        // $(document).off( "mousemove" );           
        // clearInterval(findEvent)             
        $interval.cancel(findEvent);
        findEvent = undefined;
    }
};


    $scope.addroles = function(role) {
        $rootScope.dataModified = false;
        role.IsSuperAdmin = true;

        role = cleantheinputdata(role);

        if ($scope.HttpMethod) {
            if ($scope.HttpMethod == "Created") {
                $scope.updateEntity = false
                $scope.method = 'POST'
                $scope.addRoleandForseSaveRole($scope.method, role)
            } else {
                $scope.updateEntity = true;
                $scope.method = 'PUT';
                $("#draftOverWriteModal").modal("show");

            }
        } else {
            $scope.method = 'POST';
            $scope.addRoleandForseSaveRole($scope.method, role)
        }

    }

    $scope.backupdataDraft = function(getRole) {
        $scope.takerolebckup = getRole;
    }

    $scope.addRoleandForseSaveRole = function(method, roledata) {
        var createUserObj = {
            url: BASEURL + RESTCALL.CreateRole,
            method: method,
            data: roledata,
        }

        $http(createUserObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.roleAdded = true;
            $rootScope.roleAddedMesg = data;
            $rootScope.dataModified = false;
            $('.alert-danger').hide();
            $location.path('app/roles')
            $("#draftOverWriteModal").modal("hide");
            //$state.reload()
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.roleAdded = false;
            $scope.roleAdded = false;

            $("#draftOverWriteModal").modal("hide");
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                //  $scope.alerts = [{
                //                type : 'danger',
                //                msg : data.error.message
                //            }];
            var _cstmMsg = data.error.message;
            if (_cstmMsg.match(':') && _cstmMsg.split(':')[0] === 'The validation of uniqueness for field(s)') {

                if (_cstmMsg.split(':')[1].match('has failed')) {
                    var _cstmMsg1 = $filter('removeSpace')(_cstmMsg.split(':')[1].split('has failed')[0])
                    _cstmMsg = []
                    var noPrimarykey = true;

                    for (var _kee in $scope.role) {

                        if (_cstmMsg1.match(_kee)) {

                            _cstmMsg.push((_kee) + ' : ' + $scope.role[_cstmMsg1])
                            noPrimarykey = false;
                        }

                    }
                    if (noPrimarykey) {
                        for (var _kee in $scope.role) {

                            if (_cstmMsg1.match(_kee) && _kee != 'Status') {
                                _cstmMsg.push((_kee) + ' : ' + $scope.role[_cstmMsg1])
                                noPrimarykey = true
                            }

                        }
                    }
                    if (_cstmMsg.length > 1) {
                        _cstmMsg = _cstmMsg.toString() + ' already exists. Combination needs to be unique.'
                    } else if (_cstmMsg.length == 1) {
                        _cstmMsg = _cstmMsg.toString() + ' already exists. Value needs to be unique.'
                    } else {
                        _cstmMsg = data.error.message
                    }
                } else {
                    _cstmMsg = data.error.message
                }

            } else {
                _cstmMsg = data.error.message
            }

            $scope.alerts = [{
                type: 'danger',
                msg: _cstmMsg
            }];

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;
        });
    }

    $scope.resetAllDrafts = function() {
        $("#draftOverWriteModal").modal("hide");
        setTimeout(function() {
            $scope.updateEntity = false;
        }, 100)
    }

    $scope.updateRoles = function(role) {
        $rootScope.dataModified = false;
        role = cleantheinputdata(role)
        role.IsSuperAdmin = true;

        var changeMethod = ($stateParams.input.Operation == 'Clone') ? 'POST' : 'PUT';

        var roleObj = {
            url: BASEURL + RESTCALL.CreateRole,
            method: changeMethod,
            data: role,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        if ($stateParams.input.Operation == 'Clone') {
            roleObj.headers.clone = $stateParams.input.RoleId;
        }

        $http(roleObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            /*$scope.alerts = [{
            type : 'success',
            msg : data.responseMessage
            }
            ];*/
            GlobalService.roleAdded = true;
            $rootScope.roleAddedMesg = data;
            $rootScope.dataModified = false;
            $('.alert-danger').hide();

            $scope.unlockEntityToEdit();
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();

            $location.path('app/roles')

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;

        }).catch(function onError(response) {
            // Handle error
            $scope.unlockEntityToEdit();
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                // $scope.alerts = [{
                // 		type : 'danger',
                // 		msg : data.error.message
                // 	}
                // ];

            var _cstmMsg = data.error.message;
            if (_cstmMsg.match(':') && _cstmMsg.split(':')[0] === 'The validation of uniqueness for field(s)') {

                if (_cstmMsg.split(':')[1].match('has failed')) {
                    var _cstmMsg1 = $filter('removeSpace')(_cstmMsg.split(':')[1].split('has failed')[0])
                    _cstmMsg = []
                    var noPrimarykey = true;

                    for (var _kee in $scope.role) {
                        if (_cstmMsg1.match(_kee)) {
                            _cstmMsg.push((_kee) + ' : ' + $scope.role[_cstmMsg1])
                            noPrimarykey = false;
                        }
                    }
                    if (noPrimarykey) {
                        for (var _kee in $scope.role) {

                            if (_cstmMsg1.match(_kee) && _kee != 'Status') {
                                _cstmMsg.push((_kee) + ' : ' + $scope.role[_cstmMsg1])
                                noPrimarykey = true
                            }
                        }
                    }
                    if (_cstmMsg.length > 1) {
                        _cstmMsg = _cstmMsg.toString() + ' already exists. Combination needs to be unique.'
                    } else if (_cstmMsg.length == 1) {
                        _cstmMsg = _cstmMsg.toString() + ' already exists. Value needs to be unique.'
                    } else {
                        _cstmMsg = data.error.message
                    }
                } else {
                    _cstmMsg = data.error.message
                }

            } else {
                _cstmMsg = data.error.message
            }

            $scope.alerts = [{
                type: 'danger',
                msg: _cstmMsg
            }];

            $scope.alertStyle = alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;
        });
    }

    $scope.activatePicker = function(sDate, eDate) {

        var start = new Date();
        var endDate = new Date();
        var end = new Date(new Date().setYear(start.getFullYear() + 1));

        if ($scope.toEdit_FromRoles == true) {
            var forceParseValue = false;
        }

        $(sanitize('#' + sDate)).datepicker({
            startDate: start,
            endDate: end,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            forceParse: forceParseValue
        }).on('changeDate', function(selected) {

            // $(sanitize('#' + eDate)).datepicker('setStartDate', new Date($(this).val()));

            start = new Date(selected.date.valueOf());

            start.setDate(start.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + eDate)).datepicker('setStartDate', start);

        });

        $(sanitize('#' + eDate)).datepicker({
            startDate: start,
            endDate: end,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            forceParse: forceParseValue
        }).on('changeDate', function(selected) {

            //$(sanitize('#' + sDate)).datepicker('setEndDate', new Date($(this).val()));
            endDate = new Date(selected.date.valueOf());

            endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);

        });
        $(sanitize('#' + sDate)).on('keyup', function(ev) {
            if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                //$dates.datepicker('setDate', null);
                $(sanitize('#' + eDate)).datepicker('setStartDate', new Date());
            }
        })

        $(sanitize('#' + eDate)).on('keyup', function(ev) {
            if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                //$dates.datepicker('setDate', null);
                $(sanitize('#' + sDate)).datepicker('setEndDate', null);
            }
        })

        //$('#dtControl').datepicker('setDate', nextMonth);
    }

    $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')


    $scope.datePlaceholderValue = "";
    $(document).ready(function() {
        $(".dateTypeKey").keypress(function(event) {
            var regex = /^[0-9]$/;
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (!(keycode == '8')) {
                if (regex.test(String.fromCharCode(keycode))) {
                    if ($(this).val().length == 4) {
                        $(this).val($(this).val() + "-");
                    } else if ($(this).val().length == 7) {
                        $(this).val($(this).val() + "-");
                    } else if ($(this).val().length >= 10) {
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                }
            } else {
                return true;
            }
        });


        $(".dateTypeKey").focus(function() {
            $scope.datePlaceholderValue = $(this).attr('placeholder');
            $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
        }).blur(function() {

            $(this).attr('placeholder', $scope.datePlaceholderValue);
        })

    });

    $timeout(function() {
        $rootScope.formArrayWithVal = $('#AddEditDatas').serializeArray();
    }, 100)

    $scope.GoBackFromRole = function() {
        $location.path('app/roles')
    }

    if ($stateParams) {
        if ($stateParams.input) {
            if ($stateParams.input.ToEditPage) {
                $scope.getOprtion = $stateParams.input.Operation;
                $scope.toEdit = $stateParams.input.ToEditPage;
                var paramsData = {
                    'RoleID': $stateParams.input.RoleId
                }
                $http.post(BASEURL + RESTCALL.RoleSpecificRead, paramsData).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.role = data;

                    if ($scope.getOprtion == 'Clone') {
                        $scope.role.RoleID = '';
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

            } else {

                $scope.role = $stateParams.input.decrData;
                setTimeout(function() {
                    $scope.HttpMethod = $stateParams.input.typeOfDraft
                }, 100)
            }
        }

    }

    function isAnyFieldChanged() {
        setTimeout(function() {
            $("input[type='text']").on("keydown", function(e) {

                if ($(e.currentTarget).val()) {
                    $rootScope.dataModified = true;
                    $scope.madeChanges = $rootScope.dataModified;
                }
            });

            $("select").change(function() {
                if ($(this).val()) {
                    $rootScope.dataModified = true;
                    $scope.madeChanges = $rootScope.dataModified;
                }
            })

            $(".DatePicker").on("change", function() {
                var selected = $(this).val();
                if (selected) {
                    $rootScope.dataModified = true;
                    $scope.madeChanges = $rootScope.dataModified;
                }
            });

        }, 200)

    }

    // })

    isAnyFieldChanged()


    $scope.unlockEntityToEdit = function() {       

        var data = {}; // have to form the request payload
        data['TableName'] = 'Role';
        // data['ActionName'] = actions.ActionName;
        data['IsLocked'] = false;
        data['BusinessPrimaryKey'] = JSON.stringify({'RoleID' : $stateParams.input.RoleId});        

        EntityLockService.checkEntityLock(data).then(function(data){                 
            // $scope.gotoParent();
            $scope.GoBackFromRole();
         })
         .catch(function(response){          
            var status = response.status;
            var config = response.config;
            if (response.status === 400) {
                var errMsg = response.data.error.message ? response.data.error.message : 'Unknown issue';
                $scope.alerts = [{
                    type: 'danger',
                    msg: errMsg
                }];
            }
         }); 
    }


    $scope.gotoCancelFn = function() {
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $scope.unlockEntityToEdit();
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();               
            $scope.GoBackFromRole();
        }

    }

    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            $scope.unlockEntityToEdit();
               
            $scope.GoBackFromRole();
            $rootScope.dataModified = false;
        } else {
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();
            // $(document).off( "mousemove keydown click" ); 

            $rootScope.$emit("MyEvent2", true);

        }
    }

    $scope.gotoShowAlert = function() {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $scope.unlockEntityToEdit();
             
            $("#changesLostModal").modal("show");
        } else {
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();
            $(document).off( "mousemove keydown click" ); 
            $scope.GoBackFromRole();
        }
    }

    $scope.BackupDraft = '';
    $scope.primarykey = '';
    $scope.primaryKeyALert = false;

    $scope.takeBackupData = function(data) {
        $scope.BackupDraft = data ? data : {};
    }

    $http.get(BASEURL + RESTCALL.RolesPermissionPK).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.primarykey = data.responseMessage.split(',');
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

        $scope.alertStyle = alertSize().headHeight;
        $scope.alertWidth = alertSize().alertWidth;

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });

    function checkPrimaryKeyValues(getDta) {

        if ($.isEmptyObject(getDta)) {
            $scope.primaryKeyALert = true;
        } else {
            $.each(getDta, function(key, val) {
                for (i = 0; i < $scope.primarykey.length; i++) {
                    if (!getDta[$scope.primarykey[i]]) {
                        $scope.primaryKeyALert = true;
                    }
                }
            })

        }
    }

    $scope.SaveAsDraft = function(formDatas1) {
        $scope.primaryKeyALert = false;
        checkPrimaryKeyValues(formDatas1);
        if ($scope.primaryKeyALert) {
            $scope.madeChanges = false;
            $("#changesLostModal").modal('show');
        } else {
            $scope.callingDraftSave(formDatas1)
        }
        $scope.unlockEntityToEdit();
        $scope.stopIdleTimer();
        $scope.stopsecondIdleTimer();
    }

    $scope.SaveAsModalDraft = function() {
        $scope.callingDraftSave($scope.BackupDraft)
    }

    $scope.callingDraftSave = function(formDatas) {
        $rootScope.dataModified = false;
        var backupdata = angular.copy(formDatas);
        draftdata = cleanalltheinputdataObj(backupdata);
        $http({
            method: 'POST',
            url: BASEURL + RESTCALL.CreateRole,
            data: draftdata,
            headers: {
                draft: true
            }

        }).then(function(response) {
            $rootScope.dataModified = false;
            if (response.data.Status === "Saved as Draft") {
                $scope.input = {
                    'responseMessage': response.data.responseMessage
                }
                $state.go("app.roles", {
                    input: $scope.input
                })
            }
        }, function(resperr) {
            if (resperr.data.error.message == "Draft Already Exists") {
                $("#draftOverWriteModal").modal("show");
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: resperr.data.error.message
                }]
                errorservice.ErrorMsgFunction(resperr, $scope, $http, resperr.status)
            }

        })

    }

    $scope.forceSaveDraft = function() {
        $http({
            method: 'POST',
            url: BASEURL + RESTCALL.CreateRole,
            data: draftdata,
            headers: {
                draft: true,
                'Force-Save': true
            }

        }).then(function(response) {

            if (response.data.Status === "Draft Updated") {
                $("#draftOverWriteModal").modal("hide");
                $scope.input = {
                    'responseMessage': response.data.responseMessage
                }
                $state.go("app.roles", {
                    input: $scope.input
                })
            }
        }, function(resperr) {
            $("#draftOverWriteModal").modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: resperr.data.error.message
            }]
            errorservice.ErrorMsgFunction(resperr, $scope, $http, resperr.status)

        })
    }

    $(document).ready(function() {
        $('#changesLostModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0)
        })
        $('#changesLostModal').on('hidden.bs.modal', function(e) {
            $scope.fromCancelClick = false;
            $scope.breadCrumbClicked = false;
        })
        $('#draftOverWriteModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0)
        })
        $('#draftOverWriteModal').on('hidden.bs.modal', function(e) {

            setTimeout(function() {
                $scope.updateEntity = false;
            }, 100)
        });
    });

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    /*** To control Load more data ***/
    $(window).scroll(function() {
        $scope.widthOnScroll();
    });

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

    $(window).resize(function() {
        $scope.$apply(function() {
            $scope.alertWidth = $('.tab-content').width();
        });
    });

})
