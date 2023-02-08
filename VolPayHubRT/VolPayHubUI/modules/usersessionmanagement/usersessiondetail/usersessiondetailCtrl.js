angular.module('VolpayApp').controller('usersessiondetailCtrl', function($scope, $rootScope, $stateParams, $http, $filter, $state, userMgmtService, CommonService, $timeout, bankData, GlobalService, $location, LogoutService, editservice, errorservice, $interval, EntityLockService, GetPermissions) {
    //  $scope.madeChanges = true;
    $scope.newPermission = GetPermissions('User Session Management');
    var authenticationObject = $rootScope.dynamicAuthObj;
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    });

    if (!$stateParams.input) {
        $state.go('app.usersession');
    }
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
    //var editTimeoutCounter = 20;
     $scope.findIdleTime = function() {
         findEvent = $interval(function() {             
             $scope.count += 1;             
             if ($scope.count === editTimeoutCounter) {                 
                     $scope.unlockEntityToEdit();
                     $scope.stopIdleTimer();
                     $scope.stopsecondIdleTimer();
                    //  $scope.gotoParent();               
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
                $scope.gotoParent();
            }
        }, 1000);
    }
    
    }
   
    if($stateParams.input.Operation === 'Edit'){
        idletime();
    } 
    
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
   
    $scope.parentInput = angular.copy($stateParams.input);
    $scope.userId = sessionStorage.UserId;

    $scope.userId = sessionStorage.UserID;
    $scope.data = $stateParams.input.Data;   
   
    $scope.data.RoleID1 = $scope.ArrVal;

    $scope.permission = $stateParams.permission;
    $scope.isSuperAdmin = sessionStorage.ROLE_ID;
    $scope.cUser = sessionStorage.UserId;
    $scope.selectOptions = [];
    $scope.pushAllRoleValues = [];
    $scope.entityDraft = $stateParams.input.DraftTotObj
    $scope.setInitVal = function(_query) {
        return $http({
            method: "GET",
            url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + RESTCALL.CreateRole,
            params: ($scope.data.UserID === $scope.userId) ? '' : _query
        }).then(function(response) {
            // $scope.selectOptions = response.data;            
        })
    }
    $scope.objRolename = []
    if ($scope.data.UserID === $scope.userId) {
        $http({
            method: "GET",
            url: BASEURL + '/rest/v2/roles',
            params: ''
        }).then(function(res) {
            $scope.objRolename = res.data;

            setTimeout(function() {
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()
                });
            }, 500);
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }
   

    $scope.selectMultOptions = [];
    $scope.selectOptions = [];
    $scope.pushAllRoleValues = [];
    
    $scope.setInitMultipleVal = function(_multiplequery, IndexVal) {
        
        $http({
            method: "GET",
            url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + RESTCALL.CreateRole,
            params: ($scope.data.UserID === $scope.userId) ? '' : _multiplequery
        }).then(function(response) {
            if (response.data.length > 0) {
                for (i in response.data) {
                    for (var rolename in $scope.objRolename) {
                        if ($scope.objRolename[rolename].RoleID === response.data[i].RoleID) {
                            response.data[i]['RoleName'] = $scope.objRolename[rolename].RoleName;
                        }
                    }

                    var flag = false;

                    for (var j in $scope.selectMultOptions) {

                        if ($scope.selectMultOptions[j]['RoleID'] == response.data[i]['RoleID']) {
                            flag = true
                            return;
                        } else {
                            flag = false;
                        }
                    }

                    if (!flag) {
                        $scope.selectMultOptions.push(response.data[i])
                        $scope.pushAllRoleValues.push(response.data[i])
                    }

                    // $scope.selectMultOptions.push(response.data[i]);
                    // $scope.pushAllRoleValues.push(response.data[i]);
                    $scope.selectOptions = removeDuplicates($scope.pushAllRoleValues, 'RoleID');
                    setTimeout(function() {
                        $scope.remoteDataConfig()
                    }, 100)
                }
            } else {
                $scope.data.UserRoleAssociation.splice(IndexVal, 1)
                if ($scope.data.UserRoleAssociation.length != 0) {
                    for (kj in $scope.data.UserRoleAssociation) {
                        $scope.setInitMultipleVal($scope.data.UserRoleAssociation[kj], kj)
                    }
                }
                // $scope.setInitMultipleVal()


            }
            setTimeout(function() {
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()
                });
            }, 500);
        })
    }


    function triggerSelectDrops() {
        // $scope.select2Arr = ["RoleID","Subsec_Status"]
        $(document).ready(function() {
            $("[name='Subsec_Status']").select2({
                placeholder: 'Select an option',
                minimumInputLength: 0,
                allowClear: true
            })
        })

    }
    setTimeout(function() {
        triggerSelectDrops();

    }, 100)

    function triggerSelectDrops_() {

        $scope.select2Arr = ["IsForceReset", "Status", "TimeZone", "Subsec_Status", "Department", "Country"]
        $(document).ready(function() {

            for (var i in $scope.select2Arr) {
                $(sanitize("select[name=" + $scope.select2Arr[i] + "]")).select2({
                    placeholder: 'Select an option',
                    minimumInputLength: 0,
                    allowClear: true
                })

                if ($scope.select2Arr[i] == 'TimeZone') {

                    $scope.timezoneOptions = timeZoneDropValues.TimeZone
                }
                if ($scope.select2Arr[i] == 'Country') {
                    $scope.countryOption = countryDropValues
                }
            }
        })

    }
    setTimeout(function() {
        triggerSelectDrops_();
    }, 1000);

    $scope.roleArrvalues = [];

    $timeout(function() {

        if (!$scope.data.View) {
            $scope.data.View = false;

            _query = {
                // search : $scope.data.RoleID,
                start: 0,
                count: 100
            }

            $scope.setInitVal(_query);
            for (k in $scope.data.UserRoleAssociation) {

                _queryvals = {
                    search: $scope.data.UserRoleAssociation[k].RoleID,
                    start: 0,
                    count: 100
                }
                $scope.setInitMultipleVal(_queryvals, k);
            }

            $scope.remoteDataConfig()
            $('.appendSelect2').select2()


            $scope.madeChanges = false;
            $scope.listen = function() {

                var Operation = 'Edit';
                setTimeout(function() {
                    editservice.listen($scope, $scope.data, Operation, 'UserManagement');
                }, 100)
            }
            $scope.listen();
        }
    }, 100)

    setTimeout(function() {

        $('#myRoleId').on('select2:select', function(e) {
            var data = e.params.data;
            $scope.updatesubmitted = false;
            $(e.currentTarget).find("option:selected:last").remove();
            if ($scope.data.UserID === $scope.userId) {
                delete data.other.User_ID;
                if (!$scope.data.UserRoleAssociation) {
                    $scope.data.UserRoleAssociation = [];
                }
                $scope.data.UserRoleAssociation.push(data.other)
            } else {
                $scope.data.UserRoleAssociation.push({
                    'RoleID': data.id
                })
            }
            $timeout(function() {
                $scope.remoteDataConfig();
                triggerSelectDrops();
                // $scope.activatePicker(e);
                for (i in $scope.data.UserRoleAssociation) {
                    _set_queryvals = {
                        search: $scope.data.UserRoleAssociation[i].RoleID,
                        start: 0,
                        count: 100
                    }

                    $scope.setInitMultipleVal(_set_queryvals, i);

                }
            }, 100)
        });
    }, 100)


    setTimeout(function() {
        $('#myRoleId').on('select2:unselect', function(e) {
            var data = e.params.data;
            for (i in $scope.data.UserRoleAssociation) {
                if ($scope.data.UserRoleAssociation[i].RoleID == data.id) {
                    $scope.data.UserRoleAssociation.splice(i, 1);
                }
            }

            for (j in $scope.selectMultOptions) {
                if ($scope.selectMultOptions[j].RoleID == data.id) {

                    $scope.selectMultOptions.splice(j, 1);
                }
            }
            for (m in $scope.selectOptions) {
                if ($scope.selectOptions[m].RoleID == data.id) {

                    $scope.selectOptions.splice(m, 1);
                }
            }
            for (l in $scope.pushAllRoleValues) {
                if ($scope.pushAllRoleValues[l].RoleID == data.id) {

                    $scope.pushAllRoleValues.splice(l, 1);
                }
            }

            for (k in $scope.data.UserRoleAssociation) {
                _set_queryvals = {
                    search: $scope.data.UserRoleAssociation[k].RoleID,
                    start: 0,
                    count: 100
                }
                $scope.setInitMultipleVal(_set_queryvals, k);
            }

            $timeout(function() {
                $scope.remoteDataConfig();
                triggerSelectDrops();
                // $scope.activatePicker(e);

            }, 100)
        });
    }, 50)

    $scope.createDynamicSubsection = function(RoleArr) {
        var roleFlag = false;
        for (s in RoleArr) {
            if (RoleArr[s] == $scope.data.RoleID) {
                roleFlag = true;
            }
        }
        if (!roleFlag) {
            setTimeout(function() {
                $($('.radiobtns')[0]).prop('checked', true);
            }, 100)
        }
        setTimeout(function() {
            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click()
            });
        }, 500)
    }

   $scope.editedLog = [];

    if ($scope.data.View) {       
        var len = 0;
        $http.post(BASEURL + RESTCALL.userSessionAudiLog + '?count=' + 20 + '&start=' + len, {
            'UserId': $scope.data.UserId
        }).then(function onSuccess(response) {
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
                    if (keyj == 'oldData' || keyj == 'newData') {
                        $scope.editedLog[j][keyj] = $filter('hex2a')($scope.editedLog[j][keyj])
                        if ($scope.editedLog[j][keyj].match(/</g) && $scope.editedLog[j][keyj].match(/>/g)) {
                            var xmlDoc = $.parseXML($scope.editedLog[j][keyj]); //is valid XML
                            var xmlData = xmlDoc.getElementsByTagName($scope.editedLog[j].tableName);
                            var constuctfromXml = {};
                            var constuctfromXmlObj = {};
                            var constuctfromXmlarr = [];
                            $(xmlDoc).children().each(function(e) {
                                $(this).children().each(function(e) {
                                    var parentName = $(this).prop("tagName")
                                    if ($(this).children().length) {
                                        constuctfromXml[parentName] = constuctfromXmlarr
                                        $(this).children().each(function(e) {
                                            constuctfromXmlObj[$(this).prop("tagName")] = $(this).text()
                                            constuctfromXmlarr.push(constuctfromXmlObj)
                                            constuctfromXmlObj = {}
                                        })
                                    } else {
                                        constuctfromXml[parentName] = $(this).text()
                                    }
                                })
                            });
                            $scope.editedLog[j][keyj] = constuctfromXml
                        } else {
                            $scope.editedLog[j][keyj] = false
                        }
                    }
                }
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });
    }

   

    //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {
            $http.post(BASEURL + RESTCALL.userSessionAudiLog + '?count=' + 20 + '&start=' + len, {
                'UserId': $scope.data.UserId
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.dataLen = data;
                if (data.length != 0) {
                    $scope.editedLog = $scope.editedLog.concat($scope.dataLen)
                    len = len + 20;
                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        }
    }

    $(document).ready(function() {
        //var debounceHandler = _.debounce(loadMore, 700, true);
        $('.editBody').on('scroll', function() {
            if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                //debounceHandler();
            }
        });
    })

    $scope.auditLogDetails = "";
    $scope.commentVal = "";

    $scope.costructAudit = function(argu) {

        $scope.auditLogDetails = argu
        $('#auditModel').find('tbody').html('')

        if (argu.oldData && argu.newData) {
            $('#auditModel').find('tbody').append('<tr><th>Field</th><th>Old Data</th><th>New Data</th></tr>')
        } else {
            $('#auditModel').find('tbody').append('<tr><th>Field</th><th>Data</th></tr>')
        }
        var _keys = ''

        if ($.isPlainObject(argu.oldData) && $.isPlainObject(argu.newData)) {
            _keys = (Object.keys(argu.oldData).length >= Object.keys(argu.newData).length) ? Object.keys(argu.oldData) : Object.keys(argu.newData)
        } else if ($.isPlainObject(argu.oldData)) {
            _keys = Object.keys(argu.oldData)
        } else if ($.isPlainObject(argu.newData)) {
            _keys = Object.keys(argu.newData)
        }


        for (var j in _keys) {
            if (!_keys[j].match(/_PK/g)) {
                var _tr = ""
                if (j % 2) {
                    _tr = "<tr style='background-color: rgb(245, 245, 245)'>"
                } else {
                    _tr = "<tr style='background-color: #fff'>"
                }
                _tr = _tr + "<td>" + $filter('camelCaseFormatter')(_keys[j]) + "</td>";
                if (argu.oldData && argu.newData) {
                    if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (argu.oldData[_keys[j]]) {
                            if (typeof(argu.oldData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                            } else {


                                if (is_hexadecimal(argu.oldData[_keys[j]]) && argu.oldData[_keys[j]].length != 1) {
                                    _tr = _tr + "<pre>" + $filter('beautify')($filter('hex2a')(argu.oldData[_keys[j]])) + "</pre>";
                                } else {
                                    _tr = _tr + argu.oldData[_keys[j]];
                                }


                            }
                        }
                        _tr = _tr + "</td>"
                    }
                    if (argu.newData) {
                        if (argu.newData[_keys[j]]) {
                            if (argu.oldData && argu.newData[_keys[j]] != argu.oldData[_keys[j]]) {
                                _tr = _tr + "<td class=\"modifiedClass\" id=" + _keys[j] + ">"
                                var myId_ = _keys[j]
                                if (Array.isArray(argu.newData[_keys[j]])) {
                                    if (argu.newData[_keys[j]].length == argu.oldData[_keys[j]].length) {
                                        for (k in argu.newData[_keys[j]]) {
                                            for (m in argu.oldData[_keys[j]]) {
                                                for (my_keys in argu.newData[_keys[j]][k]) {
                                                    for (my_oldkeys in argu.oldData[_keys[j]][m]) {
                                                        if (my_keys == my_oldkeys) {
                                                            if (argu.oldData[_keys[j]][m][my_oldkeys] == argu.newData[_keys[j]][k][my_keys]) {
                                                                setTimeout(function() {
                                                                    $("#UserRoleAssociation").removeClass('modifiedClass')
                                                                }, 100)
                                                            }

                                                        }
                                                    }

                                                }
                                            }
                                        }
                                    }

                                }

                            } else {
                                _tr = _tr + "<td>"
                            }
                            if (typeof(argu.newData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                            } else {

                                if (is_hexadecimal(argu.newData[_keys[j]]) && argu.newData[_keys[j]].length != 1) {
                                    _tr = _tr + "<pre>" + $filter('beautify')($filter('hex2a')(argu.newData[_keys[j]])) + "</pre>";
                                } else {
                                    _tr = _tr + argu.newData[_keys[j]];
                                }


                                //	_tr = _tr + argu.newData[_keys[j]];
                            }
                            _tr = _tr + "</td>"
                        }
                    }
                } else {
                    if (argu.newData) {
                        _tr = _tr + "<td>"
                        if (argu.newData[_keys[j]]) {
                            if (typeof(argu.newData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                            } else {

                                if (is_hexadecimal(argu.newData[_keys[j]]) && argu.newData[_keys[j]]) {
                                    _tr = _tr + "<pre>" + $filter('beautify')($filter('hex2a')(argu.newData[_keys[j]])) + "</pre>";
                                } else {
                                    _tr = _tr + argu.newData[_keys[j]];
                                }


                                //_tr = _tr + argu.newData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    } else if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (argu.oldData[_keys[j]]) {
                            if (typeof(argu.oldData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                            } else {

                                if (is_hexadecimal(argu.oldData[_keys[j]]) && argu.oldData[_keys[j]]) {
                                    _tr = _tr + "<pre>" + $filter('beautify')($filter('hex2a')(argu.oldData[_keys[j]])) + "</pre>";
                                } else {
                                    _tr = _tr + argu.oldData[_keys[j]];
                                }

                                //_tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                }
                $('#auditModel').find('tbody').append(_tr)
            }
        }

        if ((argu.action).match(/:/g)) {
            $scope.commentVal = (argu.action).split(/:(.+)/)
        } else {
            $scope.commentVal = ""
        }
    }

    $scope.unlockEntityToEdit = function() {       

        var data = {}; // have to form the request payload
        data['TableName'] = 'UserProfileLog';
        // data['ActionName'] = arg.ActionName;
        data['IsLocked'] = false;
        data['BusinessPrimaryKey'] = JSON.stringify({'UserId' : $scope.data.UserId});        

        EntityLockService.checkEntityLock(data).then(function(data){                 
            $scope.gotoParent();
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

    $scope.showaudit = function(argu) {

        $scope.costructAudit(argu)
        $('#auditModel').modal('toggle');
    }
    var _quer;

    $scope.gotoEdit = function() {
        idletime();
        $scope.data.View = false;

        _query = {
            search: $scope.data.RoleID,
            start: 0,
            count: 100
        }
        $scope.setInitVal(_query);

        // for (k in $scope.data.UserRoleAssociation) {

        //     _queryvals = {
        //         // search: $scope.data.UserRoleAssociation[k].RoleID,
        //         start: 0,
        //         count: 100
        //     }
        //     $scope.setInitMultipleVal(_queryvals, k);
        // }

        $timeout(function() {

            $scope.remoteDataConfig()
            $('.appendSelect2').select2()
        }, 100)

        $scope.madeChanges = false;
        $scope.listen = function() {
            var Operation = 'Edit';
            setTimeout(function() {
                editservice.listen($scope, $scope.data, Operation, 'UserManagement');
            }, 100)
        }
        $scope.listen();
    }


    $scope.goToEditOperation = function() {           
       
        var dataObj = {}; // have to form the request payload
        dataObj['TableName'] = 'UserProfileLog';
        // dataObj['ActionName'] = actions.ActionName;
        dataObj['IsLocked'] = true;
        dataObj['BusinessPrimaryKey'] = JSON.stringify({'UserId' : $scope.data.UserId});      
       
        EntityLockService.checkEntityLock(dataObj).then(function(data){                   
            $scope.gotoEdit();
         })
         .catch(function(response){            
            var status = response.status;
            var config = response.config;
            if (response.status === 400) {
                var errMsg = response.data.error.message ? response.data.error.message : 'Unknown issue';
                $scope.alerts1 = [{
                    type: 'danger',
                    msg: errMsg
                }];
               
            }            
            
         });  
    }




    $scope.gotoParent = function() {
        $scope.stopIdleTimer();
        $scope.stopsecondIdleTimer();
        $(window).off( "mousemove keydown click" );

        $state.go('app.usersession')
    }

    $scope.gotoCancelFn = function() {
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $scope.unlockEntityToEdit();
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer(); 
            $scope.gotoParent();
        }

    }

    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            $rootScope.dataModified = false;
            $scope.gotoParent();
        } else {
            $rootScope.$emit("MyEvent2", true);
        }
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
          
            $scope.unlockEntityToEdit();         

            $scope.gotoParent();
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

            $scope.gotoParent();
        }
    }

    var delData = '';
    $scope.takeDeldata = function(val, Id) {
        delData = $scope.data;
        //$scope.delIndex = Id;
    }

    $scope.deleteData = function() {
        delete $scope.data.$$hashKey;

        $scope.delObj = {};
        $scope.delObj.UserId = $scope.data.UserID;
        var restServer = RESTCALL.UserSessionData + '/delete';

        $http.post(BASEURL + restServer, $scope.delObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.alertData = (data) ? data.responseMessage : 'Borrado exitosamente'
            $state.go('app.usersession')
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
        $('.modal').modal("hide");
        $('body').removeClass('modal-open')
    };


    $scope.activatePicker = function(sDate, eDate) {
        $(document).ready(function() {
            var start = new Date();
            var endDate = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));

            $(sanitize('#' + sDate)).datepicker({
                startDate: start,
                endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                forceParse: false
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
                forceParse: false

            }).on('changeDate', function(selected) {
                //$(sanitize('#' + sDate)).datepicker('setEndDate', new Date($(this).val()));
                endDate = new Date(selected.date.valueOf());
                endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);
            });
            $(sanitize('#' + sDate)).keyup(function(ev) {
                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {
                    //$dates.datepicker('setDate', null);
                    $(sanitize('#' + eDate)).datepicker('setStartDate', new Date());
                }
            })
            $(sanitize('#' + eDate)).keyup(function(ev) {
                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {
                    //$dates.datepicker('setDate', null);
                    $(sanitize('#' + sDate)).datepicker('setEndDate', null);
                }
            })
        })
    }
    $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate')


    $scope.triggerPicker = function(e) {
        if ($(e.currentTarget).prev().is('.DatePicker')) {
            $scope.activatePicker('EffectiveFromDate', 'EffectiveTillDate');
            //$(e.currentTarget).prev().data("DateTimePicker").show();
            $(e.currentTarget).prev().datepicker("show");
        }
    };
    
    $scope.addNewRoleSection = function(index, e) {
        var Objkey = [];
        if ($scope.data.UserRoleAssociation[index] && $scope.data.UserRoleAssociation[index].$$hashKey) {
            delete $scope.data.UserRoleAssociation[index].$$hashKey;
        }

        Object.keys($scope.data.UserRoleAssociation[index]).forEach(function(key, value) {

            if ($scope.data.UserRoleAssociation[index][key] != '') {
                Objkey.push(key)
            }
        })
        if (Objkey.length >= 3) {
            // $('.setDynamicWidth').css({'height':'102px'})
            $('.setDynamicWidth').animate({
                scrollTop: ($("#" + index).outerHeight() * (index + 1)) + 'px'
            });
            $scope.data.UserRoleAssociation.push({});
            $timeout(function() {
                $scope.remoteDataConfig();
                triggerSelectDrops();
                $scope.activatePicker(e);
                $('.input-group-addon').on('click focus', function(e) {
                    $(this).prev().focus().click()
                });
            }, 500)
        }
    }

    $scope.removeCurrentRoleSection = function(index) {
        $scope.data.UserRoleAssociation.splice(index, 1);
        $('#RoleId' + index).select2('destroy')
            // To Remove select old option elements
        var mySelect = $$('#RoleId' + index);
        var len = mySelect[0].length;
        if (len) {
            for (var i = 0; i < len; i++) {
                mySelect[0].remove(i);
            }
        }
        // $('#RoleId' + index).find('option').remove('option')
        for (var jk in $scope.data.UserRoleAssociation) {
            //  $('#RoleId'+index).append('<option value='+$scope.data.UserRoleAssociation[jk].RoleID+'>'+$scope.data.UserRoleAssociation[jk].RoleID+'</option>')   
        }

        if ($scope.data.UserRoleAssociation[index]) {
            if ($scope.data.UserRoleAssociation[index].RoleID) {
                for (i in $scope.data.UserRoleAssociation) {
                    _set_queryvals = {
                        search: $scope.data.UserRoleAssociation[i].RoleID,
                        start: 0,
                        count: 100
                    }
                    $scope.setInitMultipleVal(_set_queryvals, i);
                    $('#RoleId' + index).val($scope.data.UserRoleAssociation[index].RoleID)
                }
            } else {
                setTimeout(function() {

                    if ($('#RoleId' + index).find('option').val().indexOf('undefined') != -1) {
                        // To Remove select old option elements
                        var mySelect = $$('#RoleId' + index).find('option');
                        var len = mySelect.length;
                        if (len) {
                            for (var i = 0; i < len; i++) {
                                mySelect.remove(i);
                            }
                        }
                        // $('#RoleId' + index).find('option').remove('option')
                    }
                }, 100)
            }
        }
        $('#RoleId' + index).select2({
            ajax: {
                url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + RESTCALL.CreateRole,
                headers: authenticationObject,
                dataType: 'json',
                delay: 250,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                        xhr.withCredentials = true
                },
                crossDomain: true,
                data: function(params) {
                    var query = {
                        start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                        count: $scope.limit
                    }
                    if (params.term) {
                        query = {
                            search: params.term,
                            start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                            count: $scope.limit
                        };
                    }
                    if ($scope.data.UserID === $scope.userId) {
                        query = ''
                    }
                    return query;
                },
                processResults: function(data, params) {
                    params.page = params.page ? params.page : 0;
                    var myarr = []
                    if ($scope.data.UserID === $scope.userId) {
                        for (j in data) {
                            myarr.push({
                                'id': data[j].RoleID,
                                'text': data[j].RoleID,
                                'other': data[j]
                            })
                        }
                    } else {
                        for (j in data) {
                            myarr.push({
                                'id': data[j].RoleID,
                                'text': data[j].RoleName + '(' + data[j].RoleID + ')'
                            })
                        }
                    }
                    return {
                        results: myarr,
                        pagination: {
                            more: data.length >= $scope.limit
                        }
                    };

                },
                cache: true
            },
            placeholder: 'Select an option',
            minimumInputLength: 0,
            allowClear: true
        })
        setTimeout(function() {
            triggerSelectDrops();

        }, 100)
    }

    $scope.activatePickerSub = function(sDate, eDate, index) {

        var start = new Date();
        var endDate = new Date();
        var end = new Date(new Date().setYear(start.getFullYear() + 1));
        $(document).ready(function() {

            $('#' + sDate + index).datepicker({
                startDate: start,
                endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                useCurrent: false,
                showClear: true,
                forceParse: false
            }).on('changeDate', function(selected) {
                //$('#' + eDate+index).datepicker('setStartDate', new Date($(this).val()));
                start = new Date(selected.date.valueOf());
                start.setDate(start.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + eDate)).datepicker('setStartDate', start);
            });

            $('#' + eDate + index).datepicker({
                startDate: start,
                //endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                useCurrent: false,
                showClear: true,
                forceParse: false
            }).on('changeDate', function(selected) {
                //$('#' + sDate+index).datepicker('setEndDate', new Date($(this).val()));
                endDate = new Date(selected.date.valueOf());
                endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
                $(sanitize('#' + sDate)).datepicker('setEndDate', endDate);
            });
            $('#' + sDate + index).keyup(function(ev) {

                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                    //$dates.datepicker('setDate', null);
                    $('#' + eDate + index).datepicker('setStartDate', new Date());
                }
            })
            $('#' + eDate + index).keyup(function(ev) {

                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                    //$dates.datepicker('setDate', null);
                    $('#' + sDate + index).datepicker('setEndDate', null);
                }
            })
            setTimeout(function() {
                regexCheck();
                //FocusBlur();
            }, 100)
        })
    }

    $scope.activatePickerSubsec = function(e, index) {
        //index = $(e.currentTarget).attr("id")[($(e.currentTarget).attr("id").length) - 1]
        $scope.activatePickerSub('Subsec_EffectiveFromDate', 'Subsec_EffectiveTillDate', index);
        setTimeout(function() {
            if ($(e.currentTarget).attr('id') == 'Subsec_EffectiveFromDate' + index) {
                $('#Subsec_EffectiveFromDate' + index).datepicker('show');
            } else {
                $('#Subsec_EffectiveTillDate' + index).datepicker('show');
            }
        }, 100)
    }

    $scope.triggerPickerSubSec = function(e, index) {
        $scope.activatePickerSubsec('Subsec_EffectiveFromDate', 'Subsec_EffectiveTillDate', index);
        //$(e.currentTarget).prev().datepicker("show");
    };

    $scope.datePlaceholderValue = "";

    function regexCheck() {
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
                }
            });
        });
    }

    function FocusBlur() {
        $(document).ready(function() {

            $(".dateTypeKey").focus(function() {

                $scope.datePlaceholderValue = $(this).attr('placeholder');

                $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
            }).blur(function() {

                $(this).attr('placeholder', $scope.datePlaceholderValue);
            })
        })
    }

    regexCheck();
    FocusBlur();
  
    $scope.updateData = function(data) {
            delete data.IsAPIUser;
            delete data.$$hashKey;
            delete data.IsForceReset;
            delete data.UserRoleAssociation;
            delete data.RoleID;
            delete data.RoleID1;
            delete data.Status;
            delete data.View; 
            // data.NoOfAttempts = 0;

            if(data.UserStatus == 'Locked'){
                $scope.alerts = [{
                    type: 'danger',
                    msg:  'User Status is Mandatory.',                   
                }];
                return;
               }
            var changeMethod = ($stateParams.input.DraftTotObj) ? 'POST' : 'PUT';

            var userObj = {
                // url: BASEURL + RESTCALL.CreateNewUser,
                url: BASEURL + '/rest/v2/usersession',
                method: changeMethod,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            $http(userObj).then(function onSuccess(response) {               
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $rootScope.alertData = data.responseMessage;
                $rootScope.dataModified = false;
                CommonService.alertLoadCnt = 0;
                $rootScope.NotifLoaded = false;
                // $rootScope.$emit("CallParentMethod", {});               
                $state.go('app.usersession')
                
                $scope.unlockEntityToEdit();
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
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
                     
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
                $rootScope.erroralertData =  data.error.message;
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
                $timeout(callAtTimeout,4000);
            });       
    }

    $scope.limit = 100;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {

            $(".appendRoleId").select2({
                ajax: {
                    url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + RESTCALL.CreateRole,
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCredentials = true
                    },
                    crossDomain: true,
                    data: function(params) {
                        var query = {
                            start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                            count: $scope.limit
                        }

                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                                count: $scope.limit
                            };
                        }
                        if ($scope.data.UserID === $scope.userId) {
                            query = ''
                        }
                        return query;
                    },
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = []
                        if ($scope.data.UserID === $scope.userId) {
                            for (j in data) {
                                for (var rolename in $scope.objRolename) {
                                    if ($scope.objRolename[rolename].RoleID === data[j].RoleID) {
                                        myarr.push({
                                            'id': data[j].RoleID,
                                            'text': $scope.objRolename[rolename].RoleName + '(' + data[j].RoleID + ')',
                                            'other': data[j]
                                        })
                                    }
                                }
                            }
                        } else {
                            for (j in data) {
                                myarr.push({
                                    'id': data[j].RoleID,
                                    'text': data[j].RoleName + '(' + data[j].RoleID + ')'
                                })
                            }
                        }
                        return {
                            results: myarr,
                            pagination: {
                                more: data.length >= $scope.limit
                            }
                        };
                    },
                    cache: true
                },
                placeholder: 'Select an option',
                minimumInputLength: 0,
                allowClear: true
            })
        }
    });

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

    $(window).scroll(function() {
        $scope.widthOnScroll()
    })
    $scope.widthOnScroll()
    var backupdata;
    $scope.primarykey = $rootScope.primarykey;

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
    };

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

    $scope.takeBackupData = function(data) {
        $scope.BackupDraft = data;
    }

    $scope.callingDraftSave = function(formDatas) {
        backupdata = angular.copy(formDatas);
        delete backupdata.View;
        delete backupdata.$$hashKey;
        delete backupdata.RoleID1;
        backupdata.RoleID = $(".radiobtns:checked").val();
        backupdata = cleantheinputdata(backupdata);
        backupdata.UserRoleAssociation = cleantheinputdata(backupdata.UserRoleAssociation);
        $rootScope.dataModified = false;
        $http({
            method: 'POST',
            url: BASEURL + RESTCALL.UserSessionData,
            data: backupdata,
            headers: {
                draft: true
            }
        }).then(function(response) {
            $rootScope.dataModified = false;
            if (response.data.Status === "Saved as Draft") {
                $scope.input = {
                    'responseMessage': response.data.Status
                }
                $state.go("app.usersession", {
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
            $timeout(callAtTimeout, 4000);
        })
    }

    $scope.forceSaveDraft = function() {
        $http({
            method: 'POST',
            url: BASEURL + RESTCALL.UserSessionData,
            data: backupdata,
            headers: {
                draft: true,
                'Force-Save': true
            }
        }).then(function(response) {
            if (response.data.Status === "Draft Updated") {
                $("#draftOverWriteModal").modal("hide");
                $scope.input = {
                    'responseMessage': response.data.Status
                }
                $state.go("app.usersession", {
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
        })
    })

    var delData = '';
    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    }

    function callAtTimeout() {
        $('.alert').hide();
    }

    $scope.deletedData = false;
    $scope.gotodeleteDraft = function() {

        $scope.deleteObj = {
            'UserID': delData.UserID,
            'Entity': delData.Entity,
            'BPK': delData.BPK
        }
        $http.post(BASEURL + "/rest/v2/draft/delete", $scope.deleteObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //if(response.Status === 'Success'){
            $scope.deletedData = true;
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: "Borrado exitosamente"
            }];

            $timeout(callAtTimeout, 4000);
            //}
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                /*$scope.alerts = [{
                    type : 'Error',
                    msg : data.responseMessage	
                }];*/
        });
    }

    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {
        var GetPrimaryKeys = angular.copy($rootScope.primarykey);
        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }

        $http({
            method: 'POST',
            url: BASEURL + "/rest/v2/users/reactivate",
            data: reactivateObj
        }).then(function(response) {
            $rootScope.alertData = response.data.responseMessage;
            $state.go('app.usersession')
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
    }
    
});
