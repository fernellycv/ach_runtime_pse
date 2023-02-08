angular.module('VolpayApp').controller('initiateTransactionCtrl', function($scope, $http, $state, $location, $timeout, GlobalService, LogoutService, $filter, getMethodService, $translate, $rootScope, errorservice, EntityLockService, datepickerFaIcons) {
    var authenticationObject = $rootScope.dynamicAuthObj;
    $timeout(function() {
        $('.select2-container').removeClass('select2-container--open')
    }, 0)
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 

    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })

    $scope.PaymentDetails = {};
    $scope.OrderingCustomer = {};
    $scope.BeneficiaryBank = {};
    $scope.Beneficiary = {};
    $scope.RemittanceInformation = {};
    $scope.DiscountAppliedAmount = {};
    $scope.ReferedDocInforation = {};
    $scope.UltimateDebtor = {};
    $scope.UltimateCreditor = {};
    $scope.IntermediaryBankDetails123 = []
    $scope.TemplateDetails = {};
    $scope.PartySelectedFlag = false;
    $scope.ProductsSupported123 = "";
    $scope.ServiceNotAvailable = "";
    $scope.PSANotAvailable = "";
    $scope.SaveTemplate = false;
    $scope.Templateloading = false;
    $scope.RemitInfoMaxLength = 140;
    $scope.DescriptionMaxLength = 3000;

    $scope.TrasactionIDLength = 75;

    $scope.CXCFlag = false;

    /**
     * 
     * */
    $scope.refferdDocInfoData = { originalCreditTransfer: { name: 'OCT', isMandate: false, value: '' }, date: { name: 'relDate', isMandate: false, value: '' } };

    $scope.daaCodes = [{ actualvalue: 'FULL', displayvalue: 'Full', isDisabled: false }, { actualvalue: 'DSCT', displayvalue: 'Discount', isDisabled: false }, { actualvalue: 'ORIG', displayvalue: 'Original', isDisabled: false }];
    $scope.discountAppliedAmountGrp = [{ daaCodes: $scope.daaCodes, code: '-1', value: '', isDisabaled: false, isValueMandate: false, isCodeMandate: false }];
    $scope.removeFormGrp = function(index) {
        $scope.discountAppliedAmountGrp.splice(index, 1)
    };
    $scope.addFormGrp = function() {
        if ($scope.discountAppliedAmountGrp.length < 2) {
            $scope.discountAppliedAmountGrp.push({});
        }
    };
    $scope.allowNumberWithDecimal = function(event) {

        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            var keyArr = [8, 35, 36, 37, 39, 46]

            function chkKey(key) {
                if (keyArr.indexOf(key) != -1) {
                    return false;
                } else {
                    return true;
                }
            }

            $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));
            if ((chkKey(event.keyCode)) && (event.which != 46 || $(event.currentTarget).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        } else {
            if ((event.keyCode == 46) || (event.charCode == 46)) {
                $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));

            }

            if ((event.which != 46 || $(event.currentTarget).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        }

    }
    $scope.addOptionalItem = function(group) {
        // group.isAdded = true;
        var bkpdaaCodes = angular.copy($scope.daaCodes);
        $scope.discountAppliedAmountGrp.pop();
        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: group.code || '-1', value: group.value || '', isDisabled: true, isValueMandate: true, isCodeMandate: false });
        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isAdded: true, isValueMandate: true, isCodeMandate: false });
    };
    $scope.removeOptionalItem = function(group) {

        var bkpdaaCodes = angular.copy($scope.daaCodes);
        $scope.discountAppliedAmountGrp.pop();
        if ($scope.discountAppliedAmountGrp.length > 1) {
            var lastElem = $scope.discountAppliedAmountGrp[$scope.discountAppliedAmountGrp.length - 1];
            if (lastElem.code === 'FULL') {
                $scope.discountAppliedAmountGrp.pop();
                $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: group.code || '-1', value: group.value || '', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false });
            } else {
                $scope.discountAppliedAmountGrp.pop();
                $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: lastElem.code || '', value: lastElem.value || '', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false });
            }
        }
    };
    $scope.onChangeDAASelect = function(group) {
        if (group.code !== '-1') {
            if (group.code === 'DSCT') {
                group.isValueMandate = true;

                var bkpdaaCodes = angular.copy($scope.daaCodes);
                for (var i in bkpdaaCodes) {
                    if (bkpdaaCodes[i].actualvalue !== 'FULL') {
                        bkpdaaCodes[i].isDisabled = true;
                    }

                }
                if ($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                    if ($scope.discountAppliedAmountGrp.length <= 2) {
                        if ($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isValueMandate: true, isCodeMandate: false });
                    }
                } else if ($scope.PaymentDetails.MessageType === 'Request for Payment') {
                    if ($scope.discountAppliedAmountGrp.length <= 3) {
                        if ($scope.discountAppliedAmountGrp.length === 3) {
                            $scope.discountAppliedAmountGrp.splice(-2, 2);
                        }
                        if ($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isAdded: false, isValueMandate: true, isCodeMandate: false });
                    }
                }

                // if($scope.discountAppliedAmountGrp.length <= 2){
                //     if($scope.discountAppliedAmountGrp.length === 2) {
                //         $scope.discountAppliedAmountGrp.pop();
                //     }
                //     if($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isValueMandate: true, isCodeMandate: false});
                //     } else if($scope.PaymentDetails.MessageType === 'Request for Payment') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'FULL', isDisabled: true, isAdded: false, isValueMandate: true, isCodeMandate: false});
                //     }
                // }
            } else if (group.code === 'FULL') {
                group.isValueMandate = true;

                var bkpdaaCodes = angular.copy($scope.daaCodes);
                for (var i in bkpdaaCodes) {
                    if (bkpdaaCodes[i].actualvalue !== 'DSCT') {
                        bkpdaaCodes[i].isDisabled = true;
                    }
                }
                if ($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                    if ($scope.discountAppliedAmountGrp.length <= 2) {
                        if ($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'DSCT', isDisabled: true, isValueMandate: true, isCodeMandate: false });
                    }
                } else if ($scope.PaymentDetails.MessageType === 'Request for Payment') {
                    if ($scope.discountAppliedAmountGrp.length <= 3) {
                        if ($scope.discountAppliedAmountGrp.length === 3) {
                            $scope.discountAppliedAmountGrp.splice(-2, 2);
                        }
                        if ($scope.discountAppliedAmountGrp.length === 2) {
                            $scope.discountAppliedAmountGrp.pop();
                        }
                        $scope.discountAppliedAmountGrp.push({ daaCodes: bkpdaaCodes, code: 'DSCT', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false });
                    }
                }
                // if($scope.discountAppliedAmountGrp.length <= 2){
                //     if($scope.discountAppliedAmountGrp.length === 2) {
                //         $scope.discountAppliedAmountGrp.pop();
                //     }
                //     if($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'DSCT', isDisabled: true, isValueMandate: true, isCodeMandate: false});
                //     } else if($scope.PaymentDetails.MessageType === 'Request for Payment') {
                //         $scope.discountAppliedAmountGrp.push({daaCodes: bkpdaaCodes, code: 'DSCT', isAdded: false, isDisabled: true, isValueMandate: true, isCodeMandate: false});
                //     }
                // }
            } else {
                if ($scope.discountAppliedAmountGrp.length > 1) {
                    $scope.discountAppliedAmountGrp.pop();
                }
            }
        } else {
            group.isCodeMandate = false;
            group.isValueMandate = false;
            group.isDisabaled = false;
            group.value = '';
            if ($scope.PaymentDetails.MessageType === 'Customer Credit Transfer') {
                if ($scope.discountAppliedAmountGrp.length > 1) {
                    $scope.discountAppliedAmountGrp.pop();
                }
            } else if ($scope.PaymentDetails.MessageType === 'Request for Payment') {
                if ($scope.discountAppliedAmountGrp.length > 2) {
                    $scope.discountAppliedAmountGrp.splice(-2, 2);
                } else {
                    $scope.discountAppliedAmountGrp.pop();
                }
            }

        }
    };

    $scope.makeMandate = function(group, index) {
        if (group.value && group.value.length > 0) {
            group.isCodeMandate = true;
        } else {
            group.isCodeMandate = false;
        }
    }

    $scope.makeManadateRDI = function() {
            if ($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length !== 0 && $.trim($scope.refferdDocInfoData.date.value).length !== 0) {
                $scope.refferdDocInfoData.date.isMandate = false;
                $scope.refferdDocInfoData.originalCreditTransfer.isMandate = false;
            } else {
                if (($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length === 0) && ($.trim($scope.refferdDocInfoData.date.value).length === 0)) {
                    $scope.refferdDocInfoData.date.isMandate = false;
                    $scope.refferdDocInfoData.originalCreditTransfer.isMandate = false;
                } else if (($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length > 0) && ($.trim($scope.refferdDocInfoData.date.value).length === 0)) {
                    $scope.refferdDocInfoData.date.isMandate = true;
                    $scope.refferdDocInfoData.originalCreditTransfer.isMandate = false;
                } else if (($.trim($scope.refferdDocInfoData.originalCreditTransfer.value).length === 0) && ($.trim($scope.refferdDocInfoData.date.value).length > 0)) {
                    $scope.refferdDocInfoData.date.isMandate = false;
                    $scope.refferdDocInfoData.originalCreditTransfer.isMandate = true;
                }
            }

        }
        /** */
    $scope.tiggerTemplate = function() {
        $rootScope.dataModified = false;
        $scope.SaveTemplate = !$scope.SaveTemplate;
        $scope.SaveTemplateCollapsed = false;
        setTimeout(function() {
            $scope.remoteDataConfig21()
        }, 100)

        setTimeout(function() {
            $('.DatePicker').datepicker({
                format: "yyyy-mm-dd",
                showClear: true,
                autoclose: true,
                icons: datepickerFaIcons.icons,
                startDate: new Date()

            })
            $('.input-group-text').on('click focus', function(e) {
                $(this).prev().focus().click()
            });
        }, 1000)

    }

    $(document).ready(function() {

        $scope.select2Arr = [{
                "name": "party",
                "key": "PartyName",
                "url": "/rest/v2/parties/readall",
                "method": "POST"
            }]
            //remoteDataConfig('AllAccountNumber','AccountName', '/rest/v2/accounts/readall', 'POST')

        $scope.currentSelect2 = {};

        $scope.limit = 500;
        var ddddd = {
            "start": 0,
            "count": 500
        };
        var newObj = JSON.stringify(ddddd);

        $scope.querySearchContructor = function(key, value123, start, count) {

            $scope.query = {
                "Queryfield": [{
                    "ColumnName": key,
                    "ColumnOperation": "like",
                    "ColumnValue": value123
                }, {
                    "ColumnName": "Status",
                    "ColumnOperation": "=",
                    "ColumnValue": "ACTIVE"
                }],
                "start": start * count ? start * count : 0,
                "count": count
            }
            if (value123 != '') {
                $scope.query = constructQuery($scope.query);
            } else {
                $scope.query = {
                    "start": 0,
                    "count": count,
                    "Queryfield": [{
                        "ColumnName": "Status",
                        "ColumnOperation": "=",
                        "ColumnValue": "ACTIVE"
                    }]
                };
                $scope.query = constructQuery($scope.query);
            }
            return $scope.query;
        }

        var _flag = 0;
        var remoteDataConfig = function(ID, key, RESTCALL, METHOD) {

            $('.appendselect2').select2({
                ajax: {
                    url: function() {
                        for (var i in $scope.select2Arr) {
                            if ($scope.select2Arr[i].name == $(this).attr('name')) {
                                $scope.currentSelect2 = $scope.select2Arr[i];
                                return BASEURL + $scope.select2Arr[i].url
                            }
                        }
                    },
                    method: "POST",
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
                    },
                    crossDomain: true,
                    data: function(params) {
                        var query = $scope.querySearchContructor('', '', params.page, $scope.limit);
                        if (params.term) {
                            query = $scope.querySearchContructor($scope.currentSelect2.key, params.term, params.page, $scope.limit);
                        }
                        return JSON.stringify(query);
                    },
                    processResults: function(data, params) {


                        params.page = params.page ? params.page : 0;
                        var myarr = [];
                        _flag++;
                        for (j in data) {

                            if (data[j][$scope.currentSelect2.key] == undefined) {
                                myarr.push({
                                    'id': JSON.stringify(data[j]),
                                    'text': data[j].PartyCode
                                })
                            } else {
                                if ($scope.currentSelect2.key == 'PartyName') {
                                    myarr.push({
                                        'id': JSON.stringify(data[j]),
                                        'text': data[j][$scope.currentSelect2.key]
                                            //'text' : data[j][$scope.currentSelect2.key]+ "  - "+data[j].PartyCode
                                    })
                                } else {
                                    myarr.push({
                                        'id': JSON.stringify(data[j]),
                                        'text': data[j][$scope.currentSelect2.key]
                                            //'text' : data[j][$scope.currentSelect2.key]+ "  - "+data[j].PartyCode
                                    })
                                }
                            }
                            $scope.Party_New_Rest = myarr;
                            if (_flag == 1) {
                                $scope.Party_New_Rest_alldata = myarr;
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
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            }).on('select2:select', function() {

                if ($(this).attr('name') == 'templates') {
                    $scope.tempVal = JSON.parse($(this).val());
                    $scope.tempVal.Template = $filter('hex2a')($scope.tempVal.Template)
                    $scope.tempVal.Template = JSON.parse($scope.tempVal.Template)
                    $scope.tempQuery = $scope.querySearchContructor("PartyCode", $scope.tempVal.Template.Party, 0, 500);

                    $http.post(BASEURL + '/rest/v2/parties/readall', $scope.tempQuery).then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        $scope.partyOptions = data;
                        setTimeout(function() {
                            delete data[0].$$hashKey;
                            $scope.party = JSON.stringify(data[0]);

                            $('select[name=party]').val($scope.party)
                        }, 100)

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
            })
        }
        $timeout(function() {
            remoteDataConfig()
        })
        var pageLimitCount = 100;
        $scope.limit = 500;
        var remoteDataConfig2 = function() {

            $('.appendselect212').select2({
                ajax: {
                    url: function(params) {
                        // var query = "?start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) +"&count=" + pageLimitCount;
                        // if (params.term) {
                        // 	query = "?search="+ params.term + "&start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) +"&count=" + pageLimitCount;
                        // }
                        return BASEURL + '/rest/v2/manualpaymentinitiationtemplate/parties/rolesaccessible/readall';
                    },
                    method: "GET",
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
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
                        return query;
                    },
                    processResults: function(data, params) {
                        var myarr = []
                        for (j in data) {

                            myarr.push({
                                'id': JSON.stringify(data[j]),
                                'text': data[j].TemplateName + '(' + data[j].PartyCode + ')'
                            })
                        }
                        return {
                            results: myarr,
                        };
                    },
                    cache: true
                },
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            })
        }
        remoteDataConfig2()

        $scope.ROLESOptions123 = [];
        $scope.remoteDataConfig21 = function() {

            $('.appendselect21211').select2({
                ajax: {
                    url: BASEURL + '/rest/v2/roles/readall',
                    method: "POST",
                    headers: authenticationObject,
                    dataType: 'json',
                    data: function(params) {

                        var query = $scope.querySearchContructor('', '', params.page, $scope.limit);

                        if (params.term) {
                            query = $scope.querySearchContructor("RoleName", params.term, params.page, $scope.limit);

                        }

                        return JSON.stringify(query);
                    },
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCrendentials = true
                    },
                    crossDomain: true,
                    processResults: function(data, params) {

                        params.page = params.page ? params.page : 0;
                        var myarr = []
                        for (j in data) {

                            myarr.push({
                                'id': data[j].RoleID,
                                'text': data[j].RoleName
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
                placeholder: '--Select--',
                minimumInputLength: 0,
                allowClear: true
            })

        }
        $scope.remoteDataConfig21()
    })

    var today = new Date();
    var month = '';
    if ((today.getMonth() + 1) <= 9) {
        month = '0' + (today.getMonth() + 1);
    } else {
        month = today.getMonth() + 1;
    }
    var date = todayDate();
    $scope.date = todayDate();

    $scope.getServiceList = function(party, flag) {

        if (party) {
            $scope.dropdownPartyValue = party;
            $scope.getPartySubtype = JSON.parse(party).PartySubType;
            $rootScope.dataModified = true;
            if ($scope.PartySelectedFlag == false) {
                $scope.query = {
                    "Queryfield": [{
                        "ColumnName": "PartyCode",
                        "ColumnOperation": "=",
                        "ColumnValue": JSON.parse(party).PartyCode
                    }, {
                        "ColumnName": "Status",
                        "ColumnOperation": "=",
                        "ColumnValue": "ACTIVE"
                    }],
                    "start": 0,
                    "count": 1000
                }

                $scope.query = constructQuery($scope.query);

                $http({
                    url: BASEURL + '/rest/v2/partyserviceassociations/readall',
                    method: "POST",
                    data: $scope.query,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    if (data.length >= 1) {
                        $scope.query_Service = {
                            "Queryfield": [],
                            "start": 0,
                            "count": 1000
                        }

                        if (data.length > 1) {
                            for (i = 0; i < data.length; i++) {
                                $scope.query_Service.Queryfield.push({
                                    "ColumnName": "ServiceCode",
                                    "ColumnOperation": "=",
                                    "ColumnValue": data[i].ServiceCode
                                })
                            }
                            $scope.query_Service.Queryfield.push({
                                "ColumnName": "Status",
                                "ColumnOperation": "=",
                                "ColumnValue": "ACTIVE"
                            })
                        } else {
                            $scope.query_Service.Queryfield.push({
                                "ColumnName": "ServiceCode",
                                "ColumnOperation": "=",
                                "ColumnValue": data[0].ServiceCode
                            })
                            $scope.query_Service.Queryfield.push({
                                "ColumnName": "Status",
                                "ColumnOperation": "=",
                                "ColumnValue": "ACTIVE"
                            })
                        }

                        $scope.query_for_serive = constructQuery($scope.query_Service);
                        $scope.service123 = "";
                        $http({
                            url: BASEURL + '/rest/v2/services/readall',
                            method: "POST",
                            data: $scope.query_for_serive,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function onSuccess(response) {
                            // Handle success
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            if (data.length > 1) {

                            } else if (data.length == 1) {

                                $scope.service11 = JSON.stringify(data[0]);
                                $scope.service123 = data[0];
                                $scope.serviceIsNotSingle = false;

                                $scope.getMessageType(party, JSON.stringify(data[0]))
                            }

                            $scope.serviceOptions = data;
                            $timeout(function() {
                                $('select[name=service11]').select2()
                            }, 500)
                        }).catch(function onError(response) {
                            // Handle error
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                        });
                    } else {
                        $scope.ServiceAvailabilty = false;
                        $scope.ServiceNotAvailable = JSON.parse(party).PartyName;
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
                $scope.PartySelectedFlag = true;
            } else {

                var txt;
                var r = confirm("Please note: currently selected values may be lost.");
                if (r == true) {
                    $rootScope.dataModified = false;
                    $state.reload()
                } else {}

            }
            $scope.PaymentDetails.ValueDate = date;
            $scope.PaymentDetails.RequestedExecutionDate = date;
        }
    }

    $scope.alreadyExists = false;
    $scope.NewPartyRestCall = function(templateValues) {
        if (templateValues) {
            if ($scope.dropdownPartyValue) {
                $http({
                    url: BASEURL + '/rest/v2/manualpaymentinitiationtemplate/party/' + templateValues + '/' + JSON.parse($scope.dropdownPartyValue).PartyCode,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.alreadyExists = false;
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.alreadyExists = true;
                    $scope.alertMessage = data.error.message;
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            }
        }
    }

    setTimeout(function() {
        $("input[type='text']").on("keydown", function(e) {

            if ($(e.currentTarget).val()) {
                $rootScope.dataModified = true;
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

    }, 100)

    $scope.gotoClickedPage = function() {
        $rootScope.$emit("MyEvent2", true);
    }


    $scope.getUniqueCurrency = function(AllCurrency) {
        var Currencies123 = [];
        for (i = 0; i < AllCurrency.length; i++) {
            Currencies123.push(AllCurrency[i].actualvalue);
        }
        return uniques(Currencies123);
    }

    function uniques(arr) {
        var a = [];
        for (var i = 0, l = arr.length; i < l; i++)
            if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                a.push(arr[i]);
        return a.sort();
    }


    $scope.party123 = '';


    $scope.fetchClientData1 = function(ClientData, Party) {
        $scope.party123 = JSON.parse(Party);


        if ($scope.party123.PartyName != undefined) {
            if ($scope.getPartySubtype == 'TPS') {
                $scope.OrderingCustomer.ClientName = '';
            } else {
                $scope.OrderingCustomer.ClientName = $scope.party123.PartyName;
            }
        }
        if ($scope.party123.AddressLine1 != undefined) {

            $scope.OrderingCustomer.ClientAddressLine1 = $scope.party123.AddressLine1;
        }
        if ($scope.party123.AddressLine2 != undefined) {

            $scope.OrderingCustomer.ClientAddressLine2 = $scope.party123.AddressLine2;
        }
        if ($scope.party123.City != undefined) {

            $scope.OrderingCustomer.City = $scope.party123.City;
        }
        if ($scope.party123.State != undefined) {

            $scope.OrderingCustomer.State = $scope.party123.State;
        }
        if ($scope.party123.PostCode != undefined) {

            $scope.OrderingCustomer.PostCode = $scope.party123.PostCode;
        }
        if ($scope.party123.CountryCode != undefined) {

            $scope.OrderingCustomer.Country = $scope.party123.CountryCode;
        }

    }


    $scope.getMessageType = function(party, service) {

        $scope.CXCFlag = false;
        var Service = JSON.parse(service).ServiceCode;

        if (Service == 'RPX') {
            $scope.RemitInfoMaxLength = 35 * 4;
            $scope.TrasactionIDLength = 35;


            $scope.MessageType = [{
                "actualValue": "Customer Credit Transfer",
                "displayValue": "Customer Credit Transfer"
            }, {
                "actualValue": "Request for Payment",
                "displayValue": "Request for Payment"
            }];

        } else if ((Service == 'GVP') || (Service == 'GLV')) {

            $scope.MessageType = [{
                    "actualValue": "Customer Credit Transfer",
                    "displayValue": "Customer Credit Transfer"
                }

            ];
            $scope.PaymentDetails.MessageType = "Customer Credit Transfer";
            $scope.RemitInfoMaxLength = 35 * 10;

            //$scope.getPaymentType11 = function (mtype, Service, party)

            $scope.getPaymentType11("Customer Credit Transfer", service, party)

        } else if ((Service == 'CXC')) {

            $scope.MessageType = [{
                    "actualValue": "Customer Credit Transfer-Standard",
                    "displayValue": "Customer Credit Transfer Standard"
                }, {
                    "actualValue": "Customer Credit Transfer-Expedited",
                    "displayValue": "Customer Credit Transfer Expedited"
                }

            ];
            $scope.RemitInfoMaxLength = 140;
            $scope.CXCFlag = true;

        } else {
            $http.get(BASEURL + '/rest/v2/messagetypes/readall?start=0&count=1000').then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.MessageType = data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });

            $http.get(BASEURL + '/rest/v2/debtorcustomer/code?start=0&count=1000').then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.DebtorCustomerProprietaryCode = data;
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

        $timeout(function() {
            $('select[name=MessageType]').select2()
        }, 500)

        if (JSON.parse(service).InstructionCurrencies == 'ALL') {

            $scope.CurrencyAll = false;
            $http.get(BASEURL + '/rest/v2/currencies/code?start=0&count=1000').then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (JSON.parse($scope.getUniqueCurrency(data)).length == 1) {
                    $scope.PaymentDetails.PaymentCurrency = JSON.parse($scope.getUniqueCurrency(data))[0];
                }
                $scope.PaymentCurrency = $scope.getUniqueCurrency(data);
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status);
            });
        } else {
            if (getCSVtoArray(JSON.parse(service).InstructionCurrencies).length == 1) {

                $scope.PaymentDetails.PaymentCurrency = getCSVtoArray(JSON.parse(service).InstructionCurrencies)[0];
            }
            $scope.PaymentCurrency = getCSVtoArray(JSON.parse(service).InstructionCurrencies);

        }
    }

    $scope.getPaymentType11 = function(mtype, Service, party) {

        var ServiceTemp = JSON.parse(Service).ServiceCode;

        $scope.psaCode11 = '';
        $scope.selectOptions = [];
        $scope.branchList = '';
        $scope.PaymentDetails.LocalInstrument = '';
        $scope.LocalInstrument = [];
        $http({
            url: BASEURL + '/rest/v2/partyserviceassociations/initiatetransaction/querypsa',
            method: "POST",
            data: {
                "PartyCode": JSON.parse(party).PartyCode,
                "ServiceCode": JSON.parse(Service).ServiceCode,
                "MessageInput": mtype
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.selectOptions = data;
            if (data.length == 1) {
                $scope.psaCode11 = JSON.stringify(data[0]);
                $scope.getPaymentDetailsByPSA(data[0])
            } else {

            }
            $scope.PSANotAvailable = '';
            $('select[name=psaCode]').select2();
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.PSANotAvailable = data.error.message;
            $scope.PaymentBranch = '';
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

        if (ServiceTemp == 'CXC') {
            $scope.DebtorCustomerProprietaryCode = [{
                "actualValue": "b2c",
                "displayValue": "B2C"
            }];
        } else {
            $scope.DebtorCustomerProprietaryCode = [{
                "actualValue": "CONSUMER",
                "displayValue": "CONSUMER"
            }, {
                "actualValue": "BUSINESS",
                "displayValue": "BUSINESS"
            }];

        }


        if (mtype == 'Request for Payment') {
            $scope.PaymentDetails.TransactionID = '';
            $scope.LocalInstrument = [{
                "actualValue": "INTERMEDIARY",
                "displayValue": "INTERMEDIARY"
            }, {
                "actualValue": "STANDARD",
                "displayValue": "STANDARD"
            }, {
                "actualValue": "ZELLE",
                "displayValue": "ZELLE"
            }];
        } else {
            $scope.LocalInstrument = [{
                "actualValue": "FOREIGN AFFILIATE",
                "displayValue": "FOREIGN AFFILIATE"
            }, {
                "actualValue": "INTERMEDIARY",
                "displayValue": "INTERMEDIARY"
            }, {
                "actualValue": "STANDARD",
                "displayValue": "STANDARD"
            }, {
                "actualValue": "ZELLE",
                "displayValue": "ZELLE"
            }];
            delete $scope.PaymentDetails['RequestedExecutionTime'];
            delete $scope.PaymentDetails['AmountModificationAllowed'];
            delete $scope.PaymentDetails['EarlyPaymentAllowed'];
            delete $scope.PaymentDetails['GuaranteedPaymentRequested'];
            delete $scope.PaymentDetails['RFPExpiryDate'];
            delete $scope.PaymentDetails['RFPExpiryTime'];
        }

        $scope.AmountModificationAllowed = [{
            "actualValue": true,
            "displayValue": "YES"
        }, {
            "actualValue": false,
            "displayValue": "NO"
        }];
        $scope.EarlyPaymentAllowed = [{
            "actualValue": true,
            "displayValue": "YES"
        }, {
            "actualValue": false,
            "displayValue": "NO"
        }];
        $scope.GuaranteedPaymentRequested = [{
            "actualValue": true,
            "displayValue": "YES"
        }, {
            "actualValue": false,
            "displayValue": "NO"
        }];
        $('select[name=DebtorCustomerProprietaryCode]').select2()
        $('select[name=LocalInstrument]').select2()
        $scope.getPaymentType(mtype);
        $scope.callPicker();

        /**1577*/
        if (mtype == 'Request for Payment') {
            // $scope.refferdDocInfoData = {originalCreditTransfer: {name:'OCT', isMandate: false, value: ''}, date: {name: 'relDate', isMandate: false, value: ''}};
            $scope.daaCodes = [{ actualvalue: 'FULL', displayvalue: 'Full', isDisabled: false }, { actualvalue: 'DSCT', displayvalue: 'Discount', isDisabled: false }];
            $scope.discountAppliedAmountGrp = [{ daaCodes: $scope.daaCodes, code: '-1', value: '', isDisabaled: false, isValueMandate: false, isCodeMandate: false }];
        }
        if (mtype == 'Customer Credit Transfer') {
            $scope.refferdDocInfoData = { originalCreditTransfer: { name: 'OCT', isMandate: false, value: '' }, date: { name: 'relDate', isMandate: false, value: '' } };
            $scope.daaCodes = [{ actualvalue: 'FULL', displayvalue: 'Full', isDisabled: false }, { actualvalue: 'DSCT', displayvalue: 'Discount', isDisabled: false }, { actualvalue: 'ORIG', displayvalue: 'Original', isDisabled: false }];
            $scope.discountAppliedAmountGrp = [{ daaCodes: $scope.daaCodes, code: '-1', value: '', isDisabaled: false, isValueMandate: false, isCodeMandate: false }];
        }
        /**1577*/
    }

    $scope.checkPaymentMandatory = function(PaymentDetails) {
        var isBoolean = [true, false, "true", "false"];
        $scope.condition = {
            AmountModificationAllowed: isBoolean.indexOf(PaymentDetails.EarlyPaymentAllowed) != -1 || isBoolean.indexOf(PaymentDetails.GuaranteedPaymentRequested) != -1,
            EarlyPaymentAllowed: isBoolean.indexOf(PaymentDetails.AmountModificationAllowed) != -1 || isBoolean.indexOf(PaymentDetails.GuaranteedPaymentRequested) != -1,
            GuaranteedPaymentRequested: isBoolean.indexOf(PaymentDetails.AmountModificationAllowed) != -1 || isBoolean.indexOf(PaymentDetails.EarlyPaymentAllowed) != -1
        }
    }

    $scope.getPaymentType = function(MessageType) {
        $http.get(BASEURL + '/rest/v2/paymenttype/' + encodeURI(MessageType) + '?start=0&count=1000').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.PaymentTypePushPull = data;
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

    function getCSVtoArray(val) {

        var gSPArray = [];
        val1 = val.split(',');
        for (i = 0; i < val1.length; i++) {
            if (val1[i].trim().length > 0) {
                gSPArray.push(val1[i]);
            }
        }

        return gSPArray;
    }

    function getSupportedProducts(val) {

        var gSPArray = [];
        val1 = val.split(',');
        for (i = 0; i < val1.length; i++) {
            if (val1[i].trim().length > 0) {
                gSPArray.push(val1[i]);
            }
        }

        if (gSPArray.length == 1) {
            $scope.ProductsSupported123 = gSPArray[0];

            $scope.getPaymentTypeDetails($scope.ProductsSupported123, $scope.party, JSON.parse($scope.service11).ServiceCode)
        }
        $('select[name=productsupported]').select2()
        return gSPArray;
    }

    $scope.ignoreEmptyValue = function(Arr) {
        var CCValue = [];
        for (i = 0; i < Arr.length; i++) {
            if (Arr[i].SupportedChargeCodes != undefined) {
                CCValue.push(Arr[i])
            }
        }
        if (CCValue.length >= 1) {
            return CCValue;
        } else {
            CCValue = '';
            return CCValue;
        }
    }

    $scope.getPaymentDetailsByPSA = function(PSACODE) {

        $scope.PaymentBranch = '';
        $scope.branchList = '';
        $scope.ProductsSupported = '';
        if ($scope.Templateloading == false) {
            $scope.ProductsSupported123 = '';
        }
        if (PSACODE != undefined) {
            $scope.PaymentBranch = '';
            PSACODE = (typeof(PSACODE) == 'string') ? JSON.parse(PSACODE) : PSACODE
            $scope.PSAvalue = PSACODE;
            $scope.ProductsSupported = getSupportedProducts(PSACODE.ProductsSupported);
            var inputObj = '';
            $scope.branchList = '';
            if (PSACODE.DeriveBranchCode == false) {

                inputObj = {
                    "filters": {
                        "logicalOperator": "AND",
                        "groupLvl1": [{
                            "logicalOperator": "AND",
                            "groupLvl2": [{
                                "logicalOperator": "AND",
                                "groupLvl3": [{
                                    "logicalOperator": "AND",
                                    "clauses": [{
                                        "columnName": "BranchCode",
                                        "operator": "=",
                                        "value": PSACODE.BranchCode
                                    }, {
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE"
                                    }]
                                }]
                            }]
                        }]
                    },
                    "start": 0,
                    "count": 1000
                }


                $http({
                    url: BASEURL + '/rest/v2/branches/readall',
                    method: "POST",
                    data: inputObj,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.branchList = data;
                    if (data.length == 1) {
                        $scope.PaymentBranch = JSON.stringify(data[0]);
                    }
                    if (data.length > 0) {
                        $scope.branchList = data;
                    } else {}
                    $('select[name=Branch]').select2()
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    /* if (err.status == 401) {
                        if (configData.Authorization == 'External') {
                            window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                        } else {
                            LogoutService.Logout();
                        }
                    } else { */
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    // }
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            } else {

                inputObj = {
                    "ServiceCode": PSACODE.ServiceCode
                }

                $http({
                    url: BASEURL + '/rest/v2/services/read',
                    method: "POST",
                    data: inputObj,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.multipleOfferedEntity = getCSVtoArray(data.OfferedByEntity)
                    $scope.query_Service_forBranch = {
                        "Queryfield": [{
                            "ColumnName": "Status",
                            "ColumnOperation": "=",
                            "ColumnValue": "ACTIVE"
                        }],
                        "start": 0,
                        "count": 1000
                    }

                    if ($scope.multipleOfferedEntity.length > 1) {
                        for (i = 0; i < $scope.multipleOfferedEntity.length; i++) {
                            $scope.query_Service_forBranch.Queryfield.push({
                                "ColumnName": "BranchCode",
                                "ColumnOperation": "=",
                                "ColumnValue": $scope.multipleOfferedEntity[i]
                            })
                        }
                    } else {
                        $scope.query_Service_forBranch.Queryfield.push({
                            "ColumnName": "BranchCode",
                            "ColumnOperation": "=",
                            "ColumnValue": $scope.multipleOfferedEntity[0]
                        })
                    }

                    $scope.query_Service_forBranch = constructQuery($scope.query_Service_forBranch);


                    $http({
                        url: BASEURL + '/rest/v2/branches/readall',
                        method: "POST",
                        data: $scope.query_Service_forBranch,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        if (data.length == 1) {
                            $scope.PaymentBranch = JSON.stringify(data[0]);
                        }
                        if (data.length > 0) {
                            $scope.branchList = data;
                        } else {}
                    }).catch(function onError(response) {
                        // Handle error
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        /* if (err.status == 401) {
                            if (configData.Authorization == 'External') {
                                window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                            } else {
                                LogoutService.Logout();
                            }
                        } else { */
                        $scope.alerts = [{
                            type: 'danger',
                            msg: data.error.message
                        }];
                        // }
                        errorservice.ErrorMsgFunction(config, $scope, $http, status)
                    });
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    /* if (err.status == 401) {
                        if (configData.Authorization == 'External') {
                            window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                        } else {
                            LogoutService.Logout();
                        }
                    } else { */
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    // }
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            }
        }
    }

    $scope.getPaymentTypeDetails = function(ProductsSupported, Party, Service) {

        $scope.Templateloading = false;

        if (Service == 'RPX') {
            $scope.RemitInfoMaxLength = 35 * 4;
        } else if ((Service == 'GVP') || (Service == 'GLV')) {
            $scope.RemitInfoMaxLength = 35 * 10;
        } else if ((Service == 'CXC')) {
            $scope.RemitInfoMaxLength = 140;
        }
        //$scope.loadBenenficiaryBankDetails($scope.ProductsSupported123)

        if ($scope.ProductsSupported123 != '') {

            inputObj21 = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                        "columnName": "ProductCode",
                                        "operator": "=",
                                        "value": ProductsSupported
                                    },
                                    {
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE"
                                    }
                                ]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }

            $scope.ChargeCode = '';

            $http({
                url: BASEURL + '/rest/v2/methodofpayments/readall',
                method: "POST",
                data: inputObj21,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.BankIdentifierTypeData = data;
                $scope.BankIdentifierTypeData_1 = data;
                if (data.length == 1) {
                    $scope.BeneficiaryBank.BankIdentifierType = data[0].ClearingSchemeCode;
                    $scope.ChargeCodelength = 1;
                    $scope.PaymentDetails.ChargeCode = $scope.ignoreEmptyValue(data[0]);
                    $scope.getBankIdentifierCode($scope.BeneficiaryBank.BankIdentifierType)
                }
                if (data.length > 1) {
                    $scope.ChargeCodelength = data.length;
                    $scope.ChargeCode = $scope.ignoreEmptyValue(data);
                }
                $('select[name=BankIdentifierType1]').select2()
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

        $timeout(function() {
            $('select[name=MessageType]').select2()
            $('select[name=DebtorCustomerProprietaryCode]').select2()
        }, 500)

        var ClientID1234 = '';
        $http.get(BASEURL + '/rest/v2/party/code/' + JSON.parse(Party).PartyCode).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.length == 1) {
                $scope.OrderingCustomer.ClientID = data[0].actualvalue;
            }

            $scope.ClientID123 = data;
            ClientID1234 = data;
            fetchClientData($scope.ClientID123, Party)

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status);
        });

        $timeout(function() {
            getMethodService.fetchData(BASEURL + '/rest/v2/party/code/' + JSON.parse(Party).PartyCode).then(function(d) {
                ClientID1234 = d;
            });
        }, 500)


        function fetchClientData(ClientData, Party) {

            $scope.party123 = JSON.parse(Party);


            if ($scope.party123.PartyName != undefined) {
                if ($scope.getPartySubtype == 'TPS') {
                    $scope.OrderingCustomer.ClientName = '';
                } else {
                    $scope.OrderingCustomer.ClientName = $scope.party123.PartyName;
                }
            }
            if ($scope.party123.AddressLine1 != undefined) {

                $scope.OrderingCustomer.ClientAddressLine1 = $scope.party123.AddressLine1;
            }
            if ($scope.party123.AddressLine2 != undefined) {

                $scope.OrderingCustomer.ClientAddressLine2 = $scope.party123.AddressLine2;
            }
            if ($scope.party123.City != undefined) {

                $scope.OrderingCustomer.City = $scope.party123.City;
            }
            if ($scope.party123.State != undefined) {

                $scope.OrderingCustomer.State = $scope.party123.State;
            }
            if ($scope.party123.PostCode != undefined) {

                $scope.OrderingCustomer.PostCode = $scope.party123.PostCode;
            }
            if ($scope.party123.CountryCode != undefined) {

                $scope.OrderingCustomer.Country = $scope.party123.CountryCode;
            }



            $scope.OrderingCustomerAccountNumber = '';
            $scope.OrderingCustomer.AccountCurrency = '';
            $scope.OrderingCustomer.AccountName = '';

            inputObj3 = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "PartyCode",
                                    "operator": "=",
                                    "value": ClientData[0].actualvalue
                                }, {
                                    "columnName": "AccountType",
                                    "operator": "=",
                                    "value": "DDA"
                                }, {
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE"
                                }]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }



            $http({
                url: BASEURL + '/rest/v2/accounts/readall',
                method: "POST",
                data: inputObj3,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (data.length == 1) {
                    $scope.OrderingCustomerAccountNumber_length = 1;
                    $scope.OrderingCustomerAccountNumber = JSON.stringify(data[0]);
                    $scope.OrderingCustomer_AccountCurrency = getCSVtoArray(data[0].AccountCurrency);
                    $scope.OrderingCustomer.AccountCurrency = data[0].DefaultCurrency;
                    $scope.OrderingCustomer.AccountName = data[0].AccountName;
                    $scope.getAccountNumberCurrency(JSON.stringify(data[0]));
                    $scope.AccountNumber11 = data;
                } else if (data.length == 0) {
                    $scope.OrderingCustomerAccountNumber_length = 0;
                }
                $scope.AccountNumber11 = data;
                $scope.AccountNumber11 =_.sortBy( data, function( item ) {return +item.AccountNo;})
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                /* if (err.status == 401) {
                    if (configData.Authorization == 'External') {
                        window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                    } else {
                        LogoutService.Logout();
                    }
                } else { */
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
                // }
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }

        $timeout(function() {
            $('select[name=MessageType]').select2()
            $('select[name=psaCode]').select2()
            $('select[name=Branch]').select2()
            $('select[name=PaymentType]').select2()
            $('select[name=ClientID]').select2()
            $('select[name=PaymentCurrency]').select2()
            $('select[name=OrderingCustomer_AccountNumber]').select2()
            $('select[name=AccountDomiciledCountry]').select2()
            $('select[name=AccountCurrency]').select2()
        }, 500)

    }

    $scope.ClientIDTextbox = false;
    $scope.getClientID = function(cid) {
        $scope._PartyDatas = $scope.Party_New_Rest_alldata;
        for (kdata in $scope._PartyDatas) {
            if (JSON.parse($scope._PartyDatas[kdata].id).PartyCode == cid) {
                $scope.getPartySubtype = JSON.parse($scope._PartyDatas[kdata].id).PartySubType;

                if ($scope.getPartySubtype == 'TPS') {
                    $scope.OrderingCustomer.ClientName = '';
                } else {
                    $scope.OrderingCustomer.ClientName = $scope.party123.PartyName;
                }
            }

        }
        //$scope.Templateloading=false;
        if (cid.length == '0') {
            //$scope.getAllCountryList123()
            $scope.ClientIDTextbox = true;
        }
    }

    $scope.searchParam123 = {
        "filters": {
            "logicalOperator": "AND",
            "groupLvl1": [{
                "logicalOperator": "AND",
                "groupLvl2": [{
                    "logicalOperator": "AND",
                    "groupLvl3": [{
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": "Status",
                            "operator": "=",
                            "value": "ACTIVE"
                        }, {
                            "columnName": "Status",
                            "operator": "=",
                            "value": "ACTIVE-WAITFORAPPROVAL"
                        }]
                    }]
                }]
            }]
        },
        "start": 0,
        "count": 1000
    }

    $scope.getAllCountryList123 = function() {

        $http({
            url: BASEURL + '/rest/v2/countries/readall',
            method: "POST",
            data: $scope.searchParam123,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.AccountDomiciledCountry = data;
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

    $scope.getAccountNumberCurrency = function(AccNum) {

        if ((AccNum != '') || (AccNum != undefined)) {

            $scope.AccNum1 = JSON.parse(AccNum);

            $scope.OrderingCustomer.AccountNumber = $scope.AccNum1.AccountNo;
            $scope.OrderingCustomer_AccountCurrency = getCSVtoArray($scope.AccNum1.AccountCurrency);
            $scope.OrderingCustomer.AccountCurrency = $scope.AccNum1.DefaultCurrency;
            $scope.OrderingCustomer.AccountName = $scope.AccNum1.AccountName;
            //$scope.OrderingCustomer.AccountDomiciledCountry = 'US';
            if ($scope.AccNum1.BranchCode == undefined) {

                $http({
                    url: BASEURL + '/rest/v2/countries/readall',
                    method: "POST",
                    data: $scope.searchParam123,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    if (data.length > 0) {
                        $scope.AccountDomiciledCountry = data;
                    } else {}
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    /* if (err.status == 401) {
                        if (configData.Authorization == 'External') {
                            window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                        } else {
                            LogoutService.Logout();
                        }
                    } else { */
                    $scope.alerts = [{
                        type: 'danger',
                        msg: data.error.message
                    }];
                    // }
                    errorservice.ErrorMsgFunction(config, $scope, $http, status)
                });
            } else {

                inputObj = {
                    "filters": {
                        "logicalOperator": "AND",
                        "groupLvl1": [{
                            "logicalOperator": "AND",
                            "groupLvl2": [{
                                "logicalOperator": "AND",
                                "groupLvl3": [{
                                    "logicalOperator": "AND",
                                    "clauses": [{
                                            "columnName": "BranchCode",
                                            "operator": "=",
                                            "value": $scope.AccNum1.BranchCode
                                        },
                                        {
                                            "columnName": "Status",
                                            "operator": "=",
                                            "value": "ACTIVE"
                                        }
                                    ]
                                }]
                            }]
                        }]
                    },
                    "start": 0,
                    "count": 1000
                }

                $http({
                    url: BASEURL + '/rest/v2/branches/readall',
                    method: "POST",
                    data: inputObj,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    $scope.AccountDomiciledCountry123 = data;
                    if (data.length > 0) {
                        //$scope.branchList = data;

                        $http({
                            url: BASEURL + '/rest/v2/countries/readall',
                            method: "POST",
                            data: $scope.searchParam123,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function onSuccess(response) {
                            // Handle success
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            if (data.length > 0) {
                                $scope.AccountDomiciledCountry = data;
                            } else {
                                $scope.AccountDomiciledCountry = data;
                            }
                        }).catch(function onError(response) {
                            // Handle error
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            /* if (err.status == 401) {
                                if (configData.Authorization == 'External') {
                                    window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                                } else {
                                    LogoutService.Logout();
                                }
                            } else { */
                            $scope.alerts = [{
                                type: 'danger',
                                msg: data.error.message
                            }];
                            // }
                            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                        });
                    } else {
                        $http({
                            url: BASEURL + '/rest/v2/countries/readall',
                            method: "POST",
                            data: $scope.searchParam123,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function onSuccess(response) {
                            // Handle success
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            if (data.length > 0) {
                                $scope.AccountDomiciledCountry = data;

                            } else {
                                $scope.AccountDomiciledCountry = data;
                            }
                        }).catch(function onError(response) {
                            // Handle error
                            var data = response.data;
                            var status = response.status;
                            var statusText = response.statusText;
                            var headers = response.headers;
                            var config = response.config;

                            /* if (err.status == 401) {
                                if (configData.Authorization == 'External') {
                                    window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                                } else {
                                    LogoutService.Logout();
                                }
                            } else { */
                            $scope.alerts = [{
                                type: 'danger',
                                msg: data.error.message
                            }];
                            // }
                            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                        });
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

        } else {

            $scope.OrderingCustomer.AccountNumber = '';
            $scope.OrderingCustomer_AccountCurrency = '';
            $scope.OrderingCustomer.AccountCurrency = '';
            $scope.OrderingCustomer.AccountName = '';
        }
        $timeout(function() {
            $('select[name=ClientID]').select2()
            $('select[name=AccountNumber]').select2()
            $scope.OrderingCustomer.AccountCurrency = $scope.AccNum1.DefaultCurrency;
        }, 500)

    }

    $scope.getBankIdentifierCode = function(BankIdentifierType) {


        $scope.BankIdentifierCode123 = '';

        //$scope.BeneficiaryBank={}
        $scope.BankIdentifierCode123 = '';
        if ((BankIdentifierType != '') && (BankIdentifierType != undefined)) {
            //BankIdentifierType = JSON.parse(BankIdentifierType);
            inputObj = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                        "columnName": "SchemeCode",
                                        "operator": "=",
                                        "value": BankIdentifierType
                                    },
                                    {
                                        "columnName": "Status",
                                        "operator": "=",
                                        "value": "ACTIVE"
                                    }
                                ]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }


            $http({
                //url : BASEURL + '/rest/v2/memberships/readall', /v2/initiatetransaction/memebership/{product}
                url: BASEURL + '/rest/v2/initiatetransaction/memebership/' + $scope.ProductsSupported123,
                method: "POST",
                data: inputObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

               // $scope.BankIdentifierCode123 = data;
                $scope.BankIdentifierCode123 = _.sortBy(data, 'SchemeParticipantIdentifer'); //sort by SchemeParticipantIdentifer 
                if ($scope.Templateloading != true) {
                    $scope.Beneficiary = {}
                }

                if (data.length > 0) {
                    //$scope.branchList = data;
                } else {}

                $('select[name=BankIdentifierType]').select2()
                $('select[name=BIC1]').select2()
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        } else {

            $http({
                url: BASEURL + '/rest/v2/accounts/readall',
                method: "POST",
                data: {
                    "start": 0,
                    "count": 200
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.AccountNumberDrop = data;
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

    $scope.BIT_reselect = false;
    $scope.getBankIdentifierCode1 = function(BankIdentifierType, index) {


        $scope.IntermediaryBankDetails123[index].BankIdentifierCode = '';
        //$scope.BeneficiaryBank={}
        $scope.BankIdentifierCode1234 = '';
        if ((BankIdentifierType != '') && (BankIdentifierType != undefined)) {
            var BIT
            if (BankIdentifierType.indexOf('{') != -1) {
                BankIdentifierType = JSON.parse(BankIdentifierType);
                BIT = BankIdentifierType.ClearingSchemeCode;
            } else {
                BIT = BankIdentifierType;
            }
            inputObj = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "SchemeCode",
                                    "operator": "=",
                                    "value": BIT
                                }, {
                                    "columnName": "Status",
                                    "operator": "=",
                                    "value": "ACTIVE"
                                }]
                            }]
                        }]
                    }]
                },
                "start": 0,
                "count": 1000
            }


            $http({
                url: BASEURL + '/rest/v2/memberships/readall',
                method: "POST",
                data: inputObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.BIT_reselect = true;
                $scope.BankIdentifierCode1234 = data;

                if (data.length > 0) {
                    //$scope.branchList = data;
                } else {}

                $('select[name=BankIdentifierType2]').select2()
                $('select[name=BIC]').select2()

            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        } else {}
    }

    $scope.Reload = function() {

        $rootScope.dataModified = false;
        $state.reload();
        $scope.isPaymentDetailsCollapsed = true;
        $scope.isOrderingCustomerCollapsed = true;
        $scope.isBenenficiaryBankDetailsCollapsed = true;
        $scope.isBenenficiaryDetailsCollapsed = true;
        $scope.isPaymentInfoCollapsed = true;
        $scope.isRemittanceInformationCollapsed = true;
        $scope.isRefferdDocInfoCollapsed = true;
        $scope.isDiscountAppliedAmountCollapsed = true;
        $scope.isUltimateDebtorCollapsed = true;
        $scope.isUltimateCreditorCollapsed = true;
        $scope.SaveTemplateCollapsed = true;

        $scope.activatePicker();

    }

    $scope.callPicker = function() {

        setTimeout(function() {
            $('.DatePicker').datepicker({
                format: "yyyy-mm-dd",
                showClear: true,
                autoclose: true,
                startDate: new Date(),
                icons: datepickerFaIcons.icons
            })
            $('.TimePicker').datetimepicker({
                format: 'HH:mm:ss',
                useCurrent: true,
                icons: datepickerFaIcons.icons
            })
            $('.input-group-text').on('click focus', function(e) {
                $(this).prev().focus().click()
            });
        }, 1000)
    }

    $scope.activatePicker = function() {

        var prev = null;
        $('.DatePicker').datepicker({
            format: "yyyy-mm-dd",
            showClear: true,
            startDate: new Date(), 
            icons: datepickerFaIcons.icons

        }).on('dp.change', function(ev) {
            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: false, 
            icons: datepickerFaIcons.icons
            
        }).on('dp.change', function(ev) {
            $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

    }

    function d2h(d) {
        return d.toString(16);
    }

    function h2d(h) {
        return parseInt(h, 16);
    }

    function stringToHex(tmp) {

        var str = '',
            i = 0,
            tmp_len = tmp.length,
            c;

        for (; i < tmp_len; i += 1) {
            c = tmp.charCodeAt(i);
            str += d2h(c);
        }

        return str;
    }

    function addNewlines(str) {

        var result = '';
        while (str.length > 0) {
            result += str.substring(0, 35) + '\\n';
            str = str.substring(35);
        }

        return JSON.stringify(result);
    }

    $scope.templateOverride = false;
    $scope.checkTemplateName = function(checkTemplateName) {
        if (($scope.templateName === checkTemplateName) && (checkTemplateName != '')) {
            $scope.templateOverride = true;
        }
    }

    $scope.addIntermediaryBankDetails = function() {

        var ggg = {}
        ggg.BankIdentifierType = "";
        ggg.BankIdentifierCode = "";
        ggg.BankAddressLine1 = "";
        ggg.BankAddressLine2 = "";
        ggg.City = "";
        ggg.State = "";
        ggg.PostCode = "";
        ggg.Country = "";
        if ($scope.IntermediaryBankDetails123.length <= 2) {
            $scope.IntermediaryBankDetails123.push(ggg)
        } else {
            $scope.IntermediaryBankDetailsMaxError = "Max occurs 3"
        }

        setTimeout(function() {
            for (i = 0; i < $scope.IntermediaryBankDetails123.length; i++) {
                delete $scope.IntermediaryBankDetails123[i].$$hashKey;
            }
        }, 100)


    }

    $scope.removeIntermediaryBankDetails = function(remove) {

        delete $scope.IntermediaryBankDetails123.splice(remove, 1);
    }
    if (($scope.loadTemplateData != true) && ($scope.ServiceCodeForConditions != 'RPX')) {
        $scope.addIntermediaryBankDetails();
    }

    function cleantheinputdata(newData) {

        $.each(newData, function(key, value) {
            if (key == '$$hashkey') {
                delete newData.$$hashkey;
            }

            if ($.isPlainObject(value)) {

                var isEmptyObj = cleantheinputdata(value)
                if ($.isEmptyObject(isEmptyObj)) {
                    delete newData[key]
                    newData[key]
                }
            } else if (Array.isArray(value) && !value.length) {
                delete newData[key]
            } else if (value === "" || value === undefined || value === null) {
                delete newData[key]
            }
        })
        return newData
    }

    function removeHashKey(val) {
        var json = JSON.stringify(val, function(key, value) {
            if (key === "$$hashKey") {
                return undefined;
            }
            return value;
        });
        return JSON.parse(json);
    }

    function objectFilter(val) {

        var filttered = val.filter(function(a) {
            var temp = Object.keys(a).map(function(k) {
                    return a[k];
                }),
                k = temp.join('|');

            if (!this[k] && temp.join('')) {
                this[k] = true;
                return true;
            }
        }, Object.create(null));

        return filttered;

    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
        // if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
        //     $(e.currentTarget).data("DateTimePicker").hide();
        // }
    }

    function getThePartyObj(party, service, messageType) {
        $http({
            url: BASEURL + '/rest/v2/parties/read',
            method: "POST",
            data: {
                "PartyCode": party
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.partyOptions = []
            $scope.partyOptions.push(data);
            $scope.party = JSON.stringify(data);
            $scope.fetchClientData1('', $scope.party)
            $scope.getServiceList($scope.party, $scope.PartySelectedFlag)
            getTheServiceObj($scope.party, service, messageType)
                //$scope.PartySelectedFlag = true;
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

    function getTheServiceObj(party, service, messageType) {
        $http({
            url: BASEURL + '/rest/v2/services/read',
            method: "POST",
            data: {
                "ServiceCode": service
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.service123 = data;
            //$scope.serviceOptions = []
            //$scope.serviceOptions.push(data);
            $scope.service11 = JSON.stringify(data);
            $('select[name=service11]').select2()
            $scope.getMessageType(party, $scope.service11)
            $scope.getPaymentType11(messageType, $scope.service11, party)
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

    function getThePSAObj(val) {
        $http({
            url: BASEURL + '/rest/v2/partyserviceassociations/read',
            method: "POST",
            data: {
                "PartyServiceAssociationCode": val
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.selectOptions = []
            $scope.selectOptions.push(data);
            $scope.psaCode11 = JSON.stringify(data);
            $('select[name=psaCode]').select2()
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

    function getTheBranchObj(val) {

        $http({
            url: BASEURL + '/rest/v2/branches/read',
            method: "POST",
            data: {
                "BranchCode": val
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.branchList = []
            $scope.branchList.push(data);
            $scope.PaymentBranch = JSON.stringify(data);
            $('select[name=Branch]').select2()
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

    function cleanArray(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }

    function getCountryCodeList() {
        $http({
            url: BASEURL + '/rest/v2/countries/readall',
            method: "POST",
            data: $scope.searchParam123,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.length > 0) {
                $scope.AccountDomiciledCountry = data;
            } else {}
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

    $scope.SubmitButtonTiggered = false;
    $scope.TemplateAndSubmitButtonTiggered = false;

    $scope.CXCFieldsClear = function(PaymentObj) {
        if ((PaymentObj.PaymentDetails != '') && (PaymentObj.PaymentDetails != undefined)) {
            //delete PaymentObj.PaymentDetails.DebtorCustomerProprietaryCode;
            delete PaymentObj.PaymentDetails.LocalInstrument;
            delete PaymentObj.PaymentDetails.ChargeCode;
        }
        if ((PaymentObj.OrderingCustomer != '') && (PaymentObj.OrderingCustomer != undefined)) {
            delete PaymentObj.OrderingCustomer.AccountNumber;
            delete PaymentObj.OrderingCustomer.AccountCurrency;
            delete PaymentObj.OrderingCustomer.AccountName;
            delete PaymentObj.OrderingCustomer.AccountDomiciledCountry;
        }
        if ((PaymentObj.BeneficiaryBank != '') && (PaymentObj.BeneficiaryBank != undefined)) {
            delete PaymentObj.BeneficiaryBank;
        }
        if ((PaymentObj.RemittanceInformation != '') && (PaymentObj.RemittanceInformation != undefined)) {
            delete PaymentObj.RemittanceInformation.RemittanceID;
        }
        if ((PaymentObj.IntermediaryBankDetails != '') && (PaymentObj.IntermediaryBankDetails != undefined)) {
            delete PaymentObj.IntermediaryBankDetails;
        }

        if ((PaymentObj.Beneficiary != '') && (PaymentObj.Beneficiary != undefined)) {
            delete PaymentObj.Beneficiary.AccountNumber
            delete PaymentObj.Beneficiary.Name
        }
        return PaymentObj;
    }

    $scope.NonCXCFieldsClear = function(PaymentObj) {
        if ((PaymentObj.PaymentDetails != '') && (PaymentObj.PaymentDetails != undefined)) {
            delete PaymentObj.NumberOfHoldDays;
        }
        if ((PaymentObj.Beneficiary != '') && (PaymentObj.Beneficiary != undefined)) {
            delete PaymentObj.Beneficiary.PayeeFirstName
            delete PaymentObj.Beneficiary.PayeeLastName
            delete PaymentObj.Beneficiary.PayeeIdType
            delete PaymentObj.Beneficiary.Token
        }
        return PaymentObj;
    }

    $scope.createData = function(PaymentDetails, OrderingCustomer, BeneficiaryBank, Beneficiary, RemittanceInformation, refferdDocInfoData, discountAppliedAmountGrp, UltimateDebtor, UltimateCreditor, IntermediaryBankDetails123, party, service11, ProductsSupported123, psaCode11, PaymentBranch, EndToEndId, TemplateDetails, SaveTemplate) {

        $rootScope.dataModified = false;

        $scope.finalPaymentObj = {}
        $scope.finalPaymentObj.Party = JSON.parse(party).PartyCode;
        $scope.finalPaymentObj.Service = JSON.parse(service11).ServiceCode;
        $scope.finalPaymentObj.PartyServiceAssociationCode = JSON.parse(psaCode11).PartyServiceAssociationCode;
        $scope.finalPaymentObj.BranchCode = JSON.parse(PaymentBranch).BranchCode;
        $scope.finalPaymentObj.ProductsSupported = ProductsSupported123;
        $scope.finalPaymentObj.EndToEndId = EndToEndId;
        $scope.finalPaymentObj.PaymentDetails = cleantheinputdata(PaymentDetails);
        $scope.finalPaymentObj.OrderingCustomer = cleantheinputdata(OrderingCustomer);
        $scope.finalPaymentObj.BeneficiaryBank = cleantheinputdata(BeneficiaryBank);
        $scope.finalPaymentObj = cleantheinputdata($scope.finalPaymentObj);

        if (PaymentDetails.MessageType != 'Request for Payment' && $scope.finalPaymentObj.PaymentDetails.RequestedExecutionDate) {
            delete $scope.finalPaymentObj.PaymentDetails.RequestedExecutionDate
        }

        if ($scope.Templateloading == true) {
            if ($scope.finalPaymentObj.BeneficiaryBank) {
                $scope.finalPaymentObj.BeneficiaryBank.BankIdentifierType = BeneficiaryBank.BankIdentifierType;
                $scope.finalPaymentObj.BeneficiaryBank.BankIdentifierCode = BeneficiaryBank.BankIdentifierCode;
            }

            if ((IntermediaryBankDetails123 != undefined) && ($scope.finalPaymentObj.Service != "RPX")) {
                IntermediaryBankDetails123 = IntermediaryBankDetails123.filter(String);
                if (IntermediaryBankDetails123.length >= 1) {
                    $scope.finalPaymentObj.IntermediaryBankDetails = []
                    for (i = 0; i < IntermediaryBankDetails123.length; i++) {
                        if (IntermediaryBankDetails123[i] != undefined) {
                            IntermediaryBankDetails123[i] = cleantheinputdata(IntermediaryBankDetails123[i]);
                            delete IntermediaryBankDetails123[i].$$hashKey;
                        }
                    }

                }
                $scope.finalPaymentObj.IntermediaryBankDetails = IntermediaryBankDetails123;
            }

        } else {

            if ((IntermediaryBankDetails123 != undefined) && ($scope.finalPaymentObj.Service != "RPX")) {
                if (IntermediaryBankDetails123.length >= 1) {

                    for (i = 0; i < IntermediaryBankDetails123.length; i++) {
                        if (IntermediaryBankDetails123[i] != undefined) {
                            IntermediaryBankDetails123[i] = cleantheinputdata(IntermediaryBankDetails123[i]);
                            delete IntermediaryBankDetails123[i].$$hashKey;
                            if ($.isEmptyObject(IntermediaryBankDetails123[i])) {
                                delete IntermediaryBankDetails123[i];
                            }
                        }
                    }

                    IntermediaryBankDetails123 = cleanArray(IntermediaryBankDetails123);

                    if ((IntermediaryBankDetails123.length >= 1) && (IntermediaryBankDetails123 != null)) {
                        $scope.finalPaymentObj.IntermediaryBankDetails = []
                        $scope.finalPaymentObj.IntermediaryBankDetails = IntermediaryBankDetails123;
                    }
                }
            }

        }
        $scope.finalPaymentObj.Beneficiary = cleantheinputdata(Beneficiary);
        $scope.finalPaymentObj.RemittanceInformation = cleantheinputdata(RemittanceInformation);

        if (UltimateDebtor && Object.values(UltimateDebtor).length) {
            $scope.finalPaymentObj.UltimateDebtor = cleantheinputdata(UltimateDebtor);
        }
        if (UltimateCreditor && Object.values(UltimateCreditor).length) {
            $scope.finalPaymentObj.UltimateCreditor = cleantheinputdata(UltimateCreditor);
        }

        $scope.finalPaymentObj = cleantheinputdata($scope.finalPaymentObj);

        $scope.finalPaymentObj = JSON.parse(JSON.stringify($scope.finalPaymentObj).replace('"IntermediaryBankDetails":[{}],', ''));

        TemplateDetails.Template = stringToHex(JSON.stringify($scope.finalPaymentObj))
        TemplateDetails.Creator = sessionStorage.UserID;
        if ((TemplateDetails.RolesAccessible == "") || (TemplateDetails.RolesAccessible == undefined)) {
            delete TemplateDetails.RolesAccessible;
        }

        if ($scope.finalPaymentObj.Service == 'CXC') {
            $scope.finalPaymentObj = $scope.CXCFieldsClear($scope.finalPaymentObj);
        } else {
            $scope.finalPaymentObj = $scope.NonCXCFieldsClear($scope.finalPaymentObj);
        }

        if (refferdDocInfoData) {
            var refferedDocInfoFinalData = {};
            if (refferdDocInfoData.date && refferdDocInfoData.date.value) {
                refferedDocInfoFinalData['RelatedDate'] = refferdDocInfoData.date.value;
                $scope.finalPaymentObj['ReferredDocumentInformation'] = refferedDocInfoFinalData;
            }
            if (refferdDocInfoData.originalCreditTransfer && refferdDocInfoData.originalCreditTransfer.value) {
                refferedDocInfoFinalData['OriginalCreditTransfer'] = refferdDocInfoData.originalCreditTransfer.value;
                $scope.finalPaymentObj['ReferredDocumentInformation'] = refferedDocInfoFinalData;
            }
        }
        if (discountAppliedAmountGrp) {
            var discountAppliedAmountData = [];
            for (var i in discountAppliedAmountGrp) {
                if (discountAppliedAmountGrp[i].code !== '-1' && discountAppliedAmountGrp[i].value !== '')
                    discountAppliedAmountData.push({ Code: discountAppliedAmountGrp[i].code, Value: discountAppliedAmountGrp[i].value })
            }
            if (discountAppliedAmountData.length > 0) {
                $scope.finalPaymentObj['DiscountAppliedAmount'] = discountAppliedAmountData;
            }
        }

        $scope.SubmitButtonTiggered = true;
        $http({
            url: BASEURL + '/rest/v2/payments/initiation/' + $scope.finalPaymentObj.PartyServiceAssociationCode,
            method: "POST",
            data: $scope.finalPaymentObj,
            headers: {
                'Content-Type': 'application/json',
                'template-name': TemplateDetails.TemplateName
            }
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.PaymentIntiated = data;
            GlobalService.advancedSearchEnable = true;
            GlobalService.searchParams = {
                "InstructionData": {
                    "EntryDate": {
                        "Start": "",
                        "End": ""
                    }
                },
                'InstructionID': data.BusinessPrimaryKey[0].Value
            }

            sessionStorage.menuSelection = JSON.stringify({
                "val": "PaymentModule",
                "subVal": "ReceivedInstructions"
            })

            //GlobalService.FLuir = data.BusinessPrimaryKey[0].Value;
            var iId = ["InstructionID=" + data.BusinessPrimaryKey[0].Value];

            sessionStorage.advancedSearchFieldArr = JSON.stringify(iId);
            sessionStorage.currentObj = JSON.stringify({
                "start": 0,
                "count": 20,
                "Queryfield": [{
                    "ColumnName": "InstructionID",
                    "ColumnOperation": "=",
                    "ColumnValue": data.BusinessPrimaryKey[0].Value,
                    "advancedSearch": false
                }],
                "QueryOrder": [{
                    "ColumnName": "EntryDate",
                    "ColumnOrder": "Desc"
                }]
            })

            if (SaveTemplate == true) {
                $scope.saveAsTemplate()

            } else {
                $location.path('app/instructions');
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.SubmitButtonTiggered = false;
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });

        //if(SaveTemplate == true) {
        $scope.saveAsTemplate = function() {

            if ($scope.templateName === TemplateDetails.TemplateName) {
                $scope.method = "PUT";
            } else {
                delete TemplateDetails.MPITemplate_PK;
                $scope.method = "POST";
            }
            $scope.TemplateAndSubmitButtonTiggered = true;

            if ($scope.Templateloading != true) {
                if (TemplateDetails.RolesAccessible != undefined) {
                    $scope.roles12345 = [];

                    for (i = 0; i < TemplateDetails.RolesAccessible.length; i++) {
                        if (TemplateDetails.RolesAccessible[i].indexOf('{') != -1) {
                            $scope.roles12345.push(JSON.parse(TemplateDetails.RolesAccessible[i]).RoleID);
                        } else {
                            $scope.roles12345.push(TemplateDetails.RolesAccessible[i]);
                        }
                    }
                    $scope.TemplateDetails.RolesAccessible = $scope.roles12345.toString();
                }
            } else {
                if (TemplateDetails.RolesAccessible != undefined) {
                    $scope.roles12345 = [];

                    for (i = 0; i < TemplateDetails.RolesAccessible.length; i++) {
                        if (TemplateDetails.RolesAccessible[i].indexOf('{') != -1) {
                            $scope.roles12345.push(JSON.parse(TemplateDetails.RolesAccessible[i]).RoleID);
                        } else {
                            $scope.roles12345.push(TemplateDetails.RolesAccessible[i]);
                        }
                    }
                    $scope.TemplateDetails.RolesAccessible = $scope.roles12345.toString();
                }
            }

            var myData_OrderingCus = JSON.parse($filter('hex2a')(TemplateDetails.Template))
            if (myData_OrderingCus.Service == 'CXC') {

                TemplateDetails.Template = stringToHex(JSON.stringify($scope.CXCFieldsClear(myData_OrderingCus)));
            } else {
                TemplateDetails.Template = stringToHex(JSON.stringify($scope.NonCXCFieldsClear(myData_OrderingCus)));
            }

            $http({
                url: BASEURL + '/rest/v2/manualpaymentinitiationtemplate',
                method: $scope.method,
                data: TemplateDetails,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $rootScope.PaymentIntiated1 = data;
                $location.path('app/instructions');
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.TemplateAndSubmitButtonTiggered = false;
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message
                }];
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }
    }

    $scope.loadTemplateData = function(templatedata) {
        if (templatedata) {
            if (JSON.parse(templatedata).TemplateName == undefined) {
                var templateName = JSON.parse(templatedata).actualvalue;
                $scope.templateName = JSON.parse(templatedata).actualvalue;
            } else {
                var templateName = JSON.parse(templatedata).TemplateName;
                $scope.templateName = JSON.parse(templatedata).TemplateName;
            }
            var TemplateName_PartyCode_Value = JSON.parse(templatedata).PartyCode;
            $http({
                url: BASEURL + '/rest/v2/manualpaymentinitiationtemplate/read',
                method: "POST",
                data: {
                    TemplateName: templateName,
                    PartyCode: TemplateName_PartyCode_Value
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.loadTemplateDataNew(JSON.stringify(data))
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
        }
    }
    $scope.loadTemplateDataNew = function(templatedata) {
        if (templatedata) {
            $scope.templateName = JSON.parse(templatedata).TemplateName;
            $scope.MPITemplate_PK = JSON.parse(templatedata).MPITemplate_PK;
            $scope.SaveTemplate = true;
            $scope.Templateloading = true;
            $scope.TemplateData = JSON.parse($filter('hex2a')(JSON.parse(templatedata).Template));
            $scope.EndToEndId = $scope.TemplateData.EndToEndId;
            $scope.MessageType = [];
            $scope.MessageType.push($scope.TemplateData.PaymentDetails.MessageType);
            $scope.PaymentDetails.MessageType = $scope.TemplateData.PaymentDetails.MessageType;

            getThePartyObj($scope.TemplateData.Party, $scope.TemplateData.Service, $scope.PaymentDetails.MessageType);
            //getTheServiceObj($scope.TemplateData.Party,$scope.TemplateData.Service);
            getThePSAObj($scope.TemplateData.PartyServiceAssociationCode)

            $scope.ProductsSupported = [];
            $scope.ProductsSupported.push($scope.TemplateData.ProductsSupported);
            $scope.ProductsSupported123 = $scope.TemplateData.ProductsSupported;

            //$scope.DebtorCustomerProprietaryCode = [];
            //$scope.DebtorCustomerProprietaryCode.push($scope.TemplateData.PaymentDetails.DebtorCustomerProprietaryCode);

            $scope.PaymentDetails.DebtorCustomerProprietaryCode = $scope.TemplateData.PaymentDetails.DebtorCustomerProprietaryCode;
            $scope.PaymentDetails.NumberOfHoldDays = $scope.TemplateData.PaymentDetails.NumberOfHoldDays;
            $scope.PaymentCurrency = [];
            $scope.PaymentCurrency.push($scope.TemplateData.PaymentDetails.PaymentCurrency);
            $scope.PaymentDetails.PaymentCurrency = $scope.TemplateData.PaymentDetails.PaymentCurrency;
            $scope.PaymentDetails.TransactionID = $scope.TemplateData.PaymentDetails.TransactionID;
            $scope.OrderingCustomer = $scope.TemplateData.OrderingCustomer;

            $scope.ClientID123 = [];
            $scope.ClientID123.push($scope.TemplateData.OrderingCustomer.ClientID);
            $scope.OrderingCustomer.ClientID = $scope.TemplateData.OrderingCustomer.ClientID;
            //$('select[name=ClientID]').select2()
            /*  */
            $scope.AccountDomiciledCountry11 = [];
            $scope.AccountDomiciledCountry11.push($scope.TemplateData.OrderingCustomer.AccountDomiciledCountry);
            //getCountryCodeList()
            $scope.OrderingCustomer.AccountDomiciledCountry = $scope.TemplateData.OrderingCustomer.AccountDomiciledCountry;

            $scope.AccountNumber11 = [];
            $scope.AccountNumber11.push($scope.TemplateData.OrderingCustomer.AccountNumber);
            $scope.OrderingCustomerAccountNumber = $scope.TemplateData.OrderingCustomer.AccountNumber;
            $('select[name=OrderingCustomer_AccountNumber]').select2()
            $scope.OrderingCustomer_AccountCurrency = [];
            $scope.OrderingCustomer_AccountCurrency.push($scope.TemplateData.OrderingCustomer.AccountCurrency);
            $scope.OrderingCustomer.AccountCurrency = $scope.TemplateData.OrderingCustomer.AccountCurrency;
            $scope.BeneficiaryBank = $scope.TemplateData.BeneficiaryBank;
            $('select[name=AccountCurrency]').select2()

            $scope.BankIdentifierTypeData = [];

            if ($scope.TemplateData.BeneficiaryBank) {
                $scope.BankIdentifierTypeData.push($scope.TemplateData.BeneficiaryBank.BankIdentifierType);
                $scope.BeneficiaryBank.BankIdentifierType = $scope.TemplateData.BeneficiaryBank.BankIdentifierType;

                $('select[name=BankIdentifierType1]').select2()


                $scope.BankIdentifierCode123 = [];
                // $scope.BankIdentifierCode123.push($scope.TemplateData.BeneficiaryBank.BankIdentifierCode);
                $scope.BankIdentifierCode123.push({
                    'SchemeParticipantIdentifer': $scope.TemplateData.BeneficiaryBank.BankIdentifierCode
                })

                $scope.BeneficiaryBank.BankIdentifierCode = $scope.TemplateData.BeneficiaryBank.BankIdentifierCode;
                $('select[name=BIC1]').select2()
            }

            $scope.Beneficiary = $scope.TemplateData.Beneficiary;

            $scope.RemittanceInformation = $scope.TemplateData.RemittanceInformation;
            $scope.UltimateDebtor = $scope.TemplateData.UltimateDebtor;
            $scope.UltimateCreditor = $scope.TemplateData.UltimateCreditor;
            $scope.TemplateDetails = JSON.parse(templatedata);

            if ($scope.TemplateData.IntermediaryBankDetails != undefined) {
                $scope.IntermediaryBankDetails123 = $scope.TemplateData.IntermediaryBankDetails;
                $scope.BankIdentifierTypeData_1 = [];
                $scope.BankIdentifierCode1234 = [];

                for (i = 0; i < $scope.IntermediaryBankDetails123.length; i++) {

                    if ($scope.IntermediaryBankDetails123[i].BankIdentifierType.indexOf('{') != -1) {
                        $scope.BankIdentifierTypeData_1.push(JSON.parse($scope.IntermediaryBankDetails123[i].BankIdentifierType).ClearingSchemeCode);
                        $scope.IntermediaryBankDetails123[i].BankIdentifierType = JSON.parse($scope.IntermediaryBankDetails123[i].BankIdentifierType).ClearingSchemeCode;
                    } else {
                        $scope.BankIdentifierTypeData_1.push($scope.IntermediaryBankDetails123[i].BankIdentifierType);
                    }



                    $scope.BankIdentifierCode1234.push($scope.IntermediaryBankDetails123[i].BankIdentifierCode);
                    $scope.IntermediaryBankDetails123[i].BankIdentifierCode = $scope.IntermediaryBankDetails123[i].BankIdentifierCode;
                }
            } else {
                $scope.IntermediaryBankDetails123[0].BankIdentifierType = '';
            }

            function arrayTrim(val) {
                var ff = [];
                for (i = 0; i < val.length; i++) {
                    ff.push(val[i].trim());
                }
                return ff;
            }

            //$scope.ROLESOptions=["Super Admin", "Approver"];
            if ($scope.TemplateDetails.RolesAccessible != undefined) {

                var RolesAccessible = $scope.TemplateDetails.RolesAccessible.split(',');
                var Queryfield = [];
                for (i = 0; i < RolesAccessible.length; i++) {
                    Queryfield.push({
                        "ColumnName": "RoleID",
                        "ColumnOperation": "=",
                        "ColumnValue": RolesAccessible[i].trim()
                    })

                }

                var dd = {
                    "start": 0,
                    "count": 100,
                    "Queryfield": Queryfield,
                    "Operator": "AND"
                }

                setTimeout(function() {
                    $scope.remoteDataConfig21()
                }, 100)

                $http({
                    url: BASEURL + '/rest/v2/roles/readall',
                    method: "POST",
                    data: constructQuery(dd),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;
                    $scope.ROLESOptions123 = data;
                    $scope.TemplateDetails.RolesAccessible = arrayTrim($scope.TemplateDetails.RolesAccessible.split(','));

                    $('select[name=RolesAccessible]').val($scope.TemplateDetails.RolesAccessible)
                    $('select[name=RolesAccessible]').select2()
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
                    errorservice.ErrorMsgFunction(config, $scope, $http, status);
                });
            } else {
                setTimeout(function() {
                    $scope.remoteDataConfig21()
                        //$('select[name=RolesAccessible]').select2()
                }, 100)
            }

            $timeout(function() {
                getTheBranchObj($scope.TemplateData.BranchCode)
                $scope.PaymentDetails.ValueDate = '';
                $scope.PaymentDetails.RequestedExecutionDate = '';
                $('select[name=MessageType]').select2()
                $('select[name=psaCode]').select2()
                $('select[name=Branch]').select2()
                $('select[name=PaymentType]').select2()
                $('select[name=ClientID]').select2()
                $('select[name=PaymentCurrency]').select2()
                $('select[name=OrderingCustomer_AccountNumber]').select2()
                $('select[name=AccountDomiciledCountry]').select2()
                $('select[name=AccountCurrency]').select2()
                $('select[name=BankIdentifierType]').select2()
                $('select[name=BankIdentifierType1]').select2()
                $('select[name=BIC1]').select2()
            }, 500)
        }
    }

    $scope.collapseAll = function() {
        $scope.isPaymentDetailsCollapsed = true;
        $scope.isOrderingCustomerCollapsed = true;
        $scope.isBenenficiaryBankDetailsCollapsed = true;
        $scope.isBenenficiaryDetailsCollapsed = true;
        $scope.isPaymentInfoCollapsed = true;
        $scope.isRemittanceInformationCollapsed = true;
        $scope.isRefferdDocInfoCollapsed = true;
        $scope.isDiscountAppliedAmountCollapsed = true;
        $scope.isUltimateDebtorCollapsed = true;
        $scope.isUltimateCreditorCollapsed = true;
        $scope.SaveTemplateCollapsed = true;
        $scope.activatePicker();
        if ($(".addCollapse").hasClass('show')) {
            $(".addCollapse").removeClass('show');
        }
    }

    $scope.expandAll = function() {
        $scope.isPaymentDetailsCollapsed = false;
        $scope.isOrderingCustomerCollapsed = false;
        $scope.isBenenficiaryBankDetailsCollapsed = false;
        $scope.isBenenficiaryDetailsCollapsed = false;
        $scope.isPaymentInfoCollapsed = false;
        $scope.isRemittanceInformationCollapsed = false;
        $scope.isRefferdDocInfoCollapsed = false;
        $scope.isDiscountAppliedAmountCollapsed = false;
        $scope.isUltimateDebtorCollapsed = false;
        $scope.isUltimateCreditorCollapsed = false;
        $scope.SaveTemplateCollapsed = false;
        $scope.activatePicker();
        $(".addCollapse").addClass('show').css({
            'height': 'auto'
        });
    }

    $scope.expandAllManually = function() {
        $scope.expandAll();
        $(".addCollapse").addClass('show').css({
            'height': 'auto'
        });
    }

    $scope.payidtype = function() {
        $scope.Beneficiary.Token = '';
    }

    $scope.allowOnlyNumbersAlone = function(event) {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            var keyArr = [8, 9, 35, 36, 37, 39, 46]


            function chkKey(key) {
                if (keyArr.indexOf(key) != -1) {
                    return false;
                } else {
                    return true;
                }
            }

            $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));
            if ((chkKey(event.keyCode)) && (event.which != 46 || $(event.currentTarget).val().indexOf('.') == -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        } else {
            if ((event.keyCode == 46) || (event.charCode == 46)) {
                $(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g, ''));

            }

            if ((event.which != 46 || $(event.currentTarget).val().indexOf('.') == -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

        }

    }
    $(document).on("keypress", 'input, textarea, select', function(e) {
        var code = e.keyCode || e.which;

        if (!$(this).is('textarea')) {
            if (code == 13) {
                e.preventDefault();
                return false;
            }
        }
    });

});

angular.module('VolpayApp').factory('getMethodService', function($http) {
    var getMethodService = {
        fetchData: function(url) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(url).then(function(response) {

                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getMethodService;
});

angular.module('VolpayApp').directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

angular.module('VolpayApp').directive('validAlphaNum', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/^(\s\s?)*$/, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            /* 
      			element.bind('keypress', function (event) {
      				if (event.keyCode === 32) {
      					event.preventDefault();
      				}
      			}); */
        }
    };
});

angular.module('VolpayApp').directive('myDirective', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./1-9]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('myDirective3', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^~`]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('myDirective2', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^&|'"<>!*~]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('myDirective21', function() {
    function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^&|"<>!*~]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
                return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});

angular.module('VolpayApp').directive('checkEmailOnBlur', function() {
    var EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ctrl) {

            if (attr.type === 'radio' || attr.type === 'checkbox') return;
            //elm.unbind('input').unbind('keydown').unbind('change');

            elm.bind('blur', function() {
                scope.$apply(function() {
                    if (EMAIL_REGX.test(elm.val())) {
                        ctrl.$setValidity('emails', true);
                    } else {
                        ctrl.$setValidity('emails', false);
                    }
                });
            });
        }
    };

});
