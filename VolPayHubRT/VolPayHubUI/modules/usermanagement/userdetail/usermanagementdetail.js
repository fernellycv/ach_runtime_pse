angular.module('VolpayApp').controller('usermanagementdetail', function($scope, $rootScope, $stateParams, $http, $filter, $state, userMgmtService, CommonService, $timeout, bankData, GlobalService, $location, LogoutService, editservice, errorservice, $interval, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions('UserDetails');
    var authenticationObject = $rootScope.dynamicAuthObj;
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    });

    if (!$stateParams.input) {
        $state.go('app.users');
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

    function idletime() {
        var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
        // var editTimeoutCounter = 10;
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


    $scope.stopsecondIdleTimer = function() {
        if (angular.isDefined(secondfindEvent)) {
            // $(window).off('mousemove keydown click', secondfindEvent); 
            $(window).off("mousemove keydown click");
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




    $scope.viewData = $stateParams.input.Data.View;
    $scope.flag = false;
    $scope.userviewObj = {
        "UserID": $stateParams.input.Data.UserID
    }



    $http.post(BASEURL + '/rest/v2/administration/profileuser/read', $scope.userviewObj).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        
        $scope.data = data;
        $scope.tempdata = angular.copy($scope.data)
        $scope.data.UserID = $scope.data.UserID;
        $scope.data.EmailAddress = $scope.data.EmailAddress;
        $scope.data.RoleID = $scope.data.RoleID;
        $scope.data.IDType = $scope.ValueDocumentType($scope.data.IDType);
        $scope.data.Status = $scope.data.Status;
        $scope.data.UserRoleAssociation[0].Status = $scope.data.UserRoleAssociation[0].Status;
        if (sessionStorage.UserID == $scope.data.UserID) {
            $scope.editpermission = false;
        } else {
            $scope.editpermission = true;
        }

        for (var kk in $scope.tempdata) {
            if (removeArray.indexOf(kk) > -1) {
                delete $scope.tempdata[kk];
            }
        }
        $scope.afterloading()
        $scope.datview()
        $scope.createfn($scope.data)
        $scope.timeZone()

    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });

    $http.get(BASEURL + "/rest/v2/administration/user/roleType").then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.partyOptions = data;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        errorservice.ErrorMsgFunction(config, $scope, $http, status)
    });






    $scope.paymentLimitFlag = false;
    $scope.limitValidation = function(paymentAmount, fileAmount) {
        $scope.paymentLimitFlag = false;
        if ((paymentAmount != undefined && paymentAmount > 2147483647) || (fileAmount != undefined && fileAmount > 2147483647)) {
            $scope.paymentLimitFlag = true;
            $scope.alerts = [{
                type: 'danger',
                msg: "Release limit Value are exceeds maximum limit"
            }];

            setTimeout(function() {
                $('.alert-danger').alert('close');
            }, 10000)
        } else {
            setTimeout(function() {
                $('.alert-danger').alert('close');
            }, 100)
        }
    }


    if (!$stateParams.input) {
        $state.go('app.users');
    }
    var removeArray = ['AdditionalDetails', 'Password', 'IsForceReset', 'IsAPIUser', 'NewData', 'OldData'];
    $scope.userId = sessionStorage.UserID;
    $scope.afterloading = function() {
        if ($scope.data) {
            $scope.maskedEmail = emailMasking($scope.data.EmailAddress)
            $scope.MaskMailId = function(data_email) {
                return emailMasking(data_email);
            }

            for (let i in $scope.data.UserRoleAssociation) {
                $scope.ArrVal.push($scope.data.UserRoleAssociation[i].RoleID)
            }
            $scope.data.RoleID1 = $scope.ArrVal[0];
        }


    }
    $scope.changedEmailInput = function(ev, updatedinput) {
        $scope.data.EmailAddress = updatedinput;
    }
    $scope.ArrVal = [];
    $scope.permission = $stateParams.permission;
    $scope.isSuperAdmin = sessionStorage.ROLE_ID;
    $scope.cUser = sessionStorage.UserID;
    $scope.selectOptions = [];
    $scope.pushAllRoleValues = [];
    $scope.entityDraft = $stateParams.input.DraftTotObj
    $scope.setInitVal = function(_query) {
        return $http({
            method: "GET",
            url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + '/rest/v2/administration/partyroles',
            params: ($scope.data.UserID === $scope.userId) ? '' : _query
        }).then(function(response) {
            // $scope.selectOptions = response.data;

            // $("[name=RoleID]").select2('destroy')

            // $("[name=RoleID]").val($scope.ArrVal);
            // $("[name=RoleID]").select2();


            //return $scope.selectOptions;
        })
    }
    $scope.objRolename = []
    if ($scope.data) {
        if ($scope.data.UserID === $scope.userId) {
            $http({
                method: "GET",
                url: BASEURL + '/rest/v2/administration/partyroles',
                params: ''
            }).then(function(res) {

                $scope.objRolename = res.data
            }, function(err) {
                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            })
        }
    }
    $scope.setInitMultipleVal = function(_multiplequery, IndexVal) {
        $scope.selectMultOptions = [];
        $scope.selectOptions = [];
        $scope.pushAllRoleValues = [];
        $http({
            method: "GET",
            url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + '/rest/v2/administration/partyroles',
            params: ($scope.data.UserID === $scope.userId) ? '' : _multiplequery
        }).then(function(response) {
            if (response.data.length > 0) {
                for (i in response.data) {
                    for (var rolename in $scope.objRolename) {
                        if ($scope.objRolename[rolename].RoleID === response.data[i].RoleID) {
                            response.data[i]['RoleName'] = $scope.objRolename[rolename].RoleName;
                        }
                    }
                    $scope.selectMultOptions.push(response.data[i]);
                    $scope.pushAllRoleValues.push(response.data[i]);
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
        })
    }

    // $scope.timeZone = function() {
    //     $timeout(function() {
    //         $scope.tZoneOptions = [];
    //         $scope.tZoneOptions.push($scope.data.TimeZone)
    //     }, 100)
    // }

    function triggerSelectDrops_() {

        $scope.select2Arr = ["TimeZone"]
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
              
            }
        })

    }
    setTimeout(function() {
        triggerSelectDrops_();
    }, 1000);

    $(document).ready(function() {
        $scope.limit = 20;
        $scope.triggerOrganization = function() {

            setTimeout(function() {

                $(".partiesOrganization").select2({
                    //Get method
                    ajax: {
                        url: BASEURL + '/rest/v2/administration/user/roleType',
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
                        method: "GET",
                        crossDomain: true,
                        processResults: function(data, params) {

                            $scope.partyOptions = data;

                            params.page = params.page ? params.page : 0;
                            var myarr = []

                            for (j in data.PartyCode) {

                                myarr.push({
                                    'id': data.PartyCode[j],
                                    'text': data.PartyCode[j]
                                })
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
            }, 1000)
        }
    })

    setTimeout(function() {
        $scope.triggerOrganization();
    }, 200)

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


    // $('#userFormTimeZone').select2().on("select2:open", function(evt) {
    //     $(this).find('option').remove('option')
    //     $(this).append('<option value="">--Select--</option>')
    //     for (var jk in timeZoneDropValues.TimeZone) {
    //         $(this).append('<option value=' + timeZoneDropValues.TimeZone[jk].TimeZoneId + '>' + timeZoneDropValues.TimeZone[jk].TimeZoneId + '</option>')
    //     }
    //     $(this).val($scope.data.TimeZone)

    // });
    // $('#userFormTimeZone').select2().on("select2:close", function(evt) {
    //     $(this).find('option').remove('option')
    //     $(this).append('<option value="">--Select--</option><option value=' + $scope.data.TimeZone + '>' + $scope.data.TimeZone + '</option>')
    //     $(this).val($scope.data.TimeZone)
    // });


    $scope.roleArrvalues = [];

    $scope.view = function() {
        $timeout(function() {
            if (!$scope.viewData) {
                $scope.viewData = false;

                _query = {
                    // search : $scope.data.RoleID,
                    start: 0,
                    count: 100,
                    partycode: $scope.data.PartyCode,
                    filter: false
                }

                $scope.setInitVal(_query);


                for (k in $scope.data.UserRoleAssociation) {

                    _queryvals = {
                        search: $scope.data.UserRoleAssociation[k].RoleID,
                        start: 0,
                        count: 100,
                        partycode: $scope.data.PartyCode,
                        filter: false
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

    }



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
                    if($scope.data.UserRoleAssociation.length>1){
                        $scope.data.UserRoleAssociation.splice(0,1)
                    }
                    _set_queryvals = {
                        search: $scope.data.UserRoleAssociation[i].RoleID,
                        start: 0,
                        count: 100,
                        partycode: $scope.data.PartyCode,
                        filter: false
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
            for (k in $scope.data.UserRoleAssociation) {
                _set_queryvals = {
                    search: $scope.data.UserRoleAssociation[k].RoleID,
                    start: 0,
                    count: 100,
                    partycode: $scope.data.PartyCode,
                    filter: false
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

    $scope.limitperFlag = false;
    $scope.createDynamicSubsection = function(RoleArr) {

       
        if(RoleArr){
       
        var roleFlag = false;
        $scope.obj = []
        if ($scope.viewData) {
            for (var i in RoleArr.UserRoleAssociation) {
                $scope.obj.push({ 'RoleID': RoleArr.UserRoleAssociation[i].RoleID })
            }
        } else {
            for (var i in RoleArr) {
                $scope.obj.push({ 'RoleID': RoleArr[i] })
            }
        }
        if (RoleArr == undefined) {
            // $scope.limitperFlag = false;
            $scope.data.PaymentReleaseAmount = ''
            $scope.data.PaymentReleaseCurrency = ''
            $scope.data.FileReleaseCurrency = ''
            $scope.data.FileReleaseAmount = ''
        }

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
     }
    }




    $scope.editedLog = [];
    $scope.datview = function() {
            if ($scope.viewData) {
                var len = 0;

                $http.post(BASEURL + RESTCALL.userAudiLog + '?count=' + 20 + '&start=' + len, {
                    'UserID': $scope.data.UserID
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
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });


            }
        }
        //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {


            $http.post(BASEURL + RESTCALL.userAudiLog + '?count=' + 20 + '&start=' + len, {
                'UserID': $scope.data.UserID
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
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });


        }
    }
    $scope.currencyList = [
        'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNH/CNY', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'GBP', 'GEL', 'GHS', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MGA', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SLL', 'SRD', 'SSP', 'STN', 'SZL', 'THB', 'TJS', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'
    ];
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
            $('#auditModel').find('tbody').append('<tr><th>'+$filter('translate')('ApprovalDts.Field')+'</th><th>'+$filter('translate')('ApprovalDts.OldData')+'</th><th>'+$filter('translate')('ApprovalDts.NewData')+'</th></tr>')
        } else {
            $('#auditModel').find('tbody').append('<tr><th>'+$filter('translate')('ApprovalDts.Field')+'</th><th>'+$filter('translate')('ApprovalDts.Data')+'</th></tr>')
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
                _tr = _tr + "<td>" +$filter('translate')('UserManagement.'+_keys[j]) + "</td>";
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

    $scope.showaudit = function(argu) {

        $scope.costructAudit(argu)
        $('#auditModel').modal('toggle');
    }
    var _quer;


    $scope.createfn = function(input) {
        $scope.createDynamicSubsection(input)
    }


    $scope.setEnableDisable = function(_query) {


        $http.post(BASEURL + '/rest/v2/administration/user/edit', _query).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.setEnableDisable_ = data;


        }).catch(function onError(response) {
            // Handle error

            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;


        });
    }


    $scope.gotoEdit = function() {
        $scope.viewData = false;
        $('.my-tooltip').tooltip('hide');
        _query = {
            search: $scope.data.RoleID,
            start: 0,
            count: 100,
            partycode: $scope.data.PartyCode,
            filter: false
        }
        $scope.setInitVal(_query);

        for (k in $scope.data.UserRoleAssociation) {

            _queryvals = {
                search: $scope.data.UserRoleAssociation[k].RoleID,
                start: 0,
                count: 100,
                partycode: $scope.data.PartyCode,
                filter: false
            }

            $scope.setInitMultipleVal(_queryvals, k);
        }



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
        $scope.userviewObj = {
            "UserID": $stateParams.input.Data.UserID
        }

        $scope.setEnableDisable($scope.userviewObj)
    }


    $scope.gotoParent = function() {

        $state.go('app.users')

    }



    $scope.gotoCancelFn = function() {
        $('.my-tooltip').tooltip('hide');
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
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
    }

    $scope.gotoShowAlert = function() {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $("#changesLostModal").modal("show");
        } else {
            $scope.gotoParent();
        }
    }





    $scope.activatePicker = function(sDate, eDate) {
        $(document).ready(function() {
            var start = new Date();
            var endDate = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));

            $('#' + sDate).datepicker({
                startDate: start,
                endDate: end,
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                forceParse: false


            }).on('changeDate', function(selected) {

                //$('#' + eDate).datepicker('setStartDate', new Date($(this).val()));
                start = new Date(selected.date.valueOf());

                start.setDate(start.getDate(new Date(selected.date.valueOf())));
                $('#' + eDate).datepicker('setStartDate', start);

            });
            $('#' + eDate).datepicker({
                startDate: start,
                endDate: end,
                autoclose: true,
                format: 'yyyy-mm-dd',
                todayHighlight: true,
                forceParse: false

            }).on('changeDate', function(selected) {

                //$('#' + sDate).datepicker('setEndDate', new Date($(this).val()));
                endDate = new Date(selected.date.valueOf());

                endDate.setDate(endDate.getDate(new Date(selected.date.valueOf())));
                $('#' + sDate).datepicker('setEndDate', endDate);
            });


            $('#' + sDate).keyup(function(ev) {

                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                    //$dates.datepicker('setDate', null);
                    $('#' + eDate).datepicker('setStartDate', new Date());
                }
            })
            $('#' + eDate).keyup(function(ev) {

                if (ev.keyCode == 8 || ev.keyCode == 46 && !$(this).val()) {

                    //$dates.datepicker('setDate', null);
                    $('#' + sDate).datepicker('setEndDate', null);
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
            }, 500)
        }


    }

    $scope.removeCurrentRoleSection = function(index) {
        $scope.data.UserRoleAssociation.splice(index, 1);
        $('#RoleId' + index).select2('destroy')
        $('#RoleId' + index).find('option').remove('option')
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
                        $('#RoleId' + index).find('option').remove('option')
                    }
                }, 100)
            }
        }
        $('#RoleId' + index).select2({
            ajax: {
                url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + '/rest/v2/administration/partyroles',
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
                            count: $scope.limit,
                            partycode: $scope.data.PartyCode,
                            filter: false
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
                                // 'text': data[j].RoleName + '(' + data[j].RoleID + ')'
                                'text': data[j].RoleName
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
                $('#' + eDate).datepicker('setStartDate', start);

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
                $('#' + sDate).datepicker('setEndDate', endDate);

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
        index = $(e.currentTarget).attr("id")[($(e.currentTarget).attr("id").length) - 1]
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

        // $scope.validation();
        if (data['CreatedDate'] && data['LastLoggedIn']) {
            delete data['CreatedDate']
            delete data['LastLoggedIn']
        }
        if(data['IsUserEditable']){
            delete data['IsUserEditable']
        }

        if (data.RoleID1 != undefined) {
            if ($scope.flag) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: "Mandatory field Release limits are not set"
                        }];
                    })
                    $scope.alertStyle = alertSize().headHeight;
                    $scope.alertWidth = alertSize().alertWidth;
                }, 1000)
                setTimeout(function() {
                    $('.alert-danger').alert('close');
                }, 5000)
            } else if ($scope.paymentLimitFlag) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: "Release limit Value are exceeds maximum limit"
                        }];
                    })
                }, 1000)
                setTimeout(function() {
                    $('.alert-danger').alert('close');
                }, 5000)
            } else {
                $scope.backupRoleId1 = angular.copy(data.RoleID1);
                delete data.View;
                delete data.$$hashKey;
                delete data.RoleID1;

                data.RoleID = $(".radiobtns:checked").val();
                $scope.roleIDbackup = angular.copy(data.RoleID);
                data = cleantheinputdata(data);
                data.UserRoleAssociation = cleantheinputdata(data.UserRoleAssociation)
                var changeMethod = ($stateParams.input.DraftTotObj) ? 'POST' : 'PUT';
                if(changeMethod == 'PUT') {
                    Object.assign(data, {'CreatedDate': Date().toString()})
                }
                var userObj = {
                    url: BASEURL + '/rest/v2/administration/usercreate',
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
                    $state.go('app.users')


                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.data.RoleID1 = $scope.backupRoleId1;
                    $scope.data.RoleID = $scope.roleIDbackup;
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });


            }

        }
    }

    $scope.limit = 100;
    $(document).ready(function() {
        $scope.remoteDataConfig = function() {

            $(".appendRoleId").select2({
                ajax: {
                    url: ($scope.data.UserID === $scope.userId) ? BASEURL + '/rest/v2/userrole/self/readall' : BASEURL + '/rest/v2/administration/partyroles',
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
                            count: $scope.limit,
                            partycode: $scope.data.PartyCode,
                            filter: false
                        }

                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * $scope.limit ? params.page * $scope.limit : 0,
                                count: $scope.limit,
                                partycode: $scope.data.PartyCode,
                                filter: false
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
                                    //'text': data[j].RoleName + '(' + data[j].RoleID + ')'
                                    'text': data[j].RoleName
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
            url: BASEURL + RESTCALL.CreateNewUser,
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
                $state.go("app.users", {
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
            url: BASEURL + RESTCALL.CreateNewUser,
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
                $state.go("app.users", {
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
            $scope.deletedData = true;
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: "Borrado exitosamente"
            }];

            $timeout(callAtTimeout, 4000);


        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
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
            url: BASEURL + "/rest/v2/administration/partyusers/reactivate",
            data: reactivateObj
        }).then(function(response) {
            $rootScope.alertData = response.data.responseMessage;
            $state.go('app.users')
        }, function(err) {
            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })
        $('.my-tooltip').tooltip('hide');

    }

    $scope.emailValidate = function(email_entered) {

        if ($("#EmailAddress_UMPage").val() != "") {
            $scope.eFlag = emailValidation(email_entered, "#EmailAddress_UMPage")
            if (!$scope.eFlag) {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: "Please Enter Valid Email Address"
                        }];
                    })
                }, 200)
                return false;
            } else {
                $('.alert-danger').hide()
            }

        }

    }
    $scope.clearPartycode = function() {
        $scope.data.RoleID = '';
        for (var j in $scope.data.UserRoleAssociation) {
            $scope.data.UserRoleAssociation[j].RoleID = '';
            $('#RoleId').find('option').remove('option')
            $scope.removeCurrentRoleSection();
        }
    }
    
    $scope.ValueDocumentType = function(TypeID){
        switch(TypeID){
            case "Cédula de Ciudadanía":
                return "Identitycard";
            case  "Tarjeta de Identidad":
                return "identitycardforminors";
            case "Pasaporte":
                return "passport";
            case "Cédula Extranjería":
                return "foreignidentificationcard";
            case "Tarjeta Extranjería":
                return "foreigncard";
            case "Documento Identidad Extranjería":
                return "foreignidentitydocument";
        default:
            return TypeID;
        }
    }

});
