angular.module('VolpayApp').controller('businessRuleDetailsCtrl', function($scope, $http, $location, $filter, $stateParams, GlobalService, errorservice) {
    var authenticationObject = $rootScope.dynamicAuthObj;
    if ($stateParams.input) {
        $scope.permission = {
            'C': $stateParams.input["C"],
            'D': $stateParams.input["D"],
            'R': $stateParams.input["R"],
            'U': $stateParams.input["U"]
        }
    }


    $scope.strData = [];
    $scope.BusinessRule = GlobalService.specificData;

    $scope.fromAddNew = GlobalService.fromAddNew;
    // GlobalService.ViewClicked = false;
    $scope.ViewClicked = GlobalService.ViewClicked;
    //$scope.ViewClicked = false;

    $.each($scope.BusinessRule, function(k, v) {
        //display the key and value pair
        $scope.strData.push({
            'label': k,
            'value': v
        })

    });
    $scope.BusinessRuleCreate = {};

    $scope.newRule123 = false;

    $(document).ready(function() {

        $scope.limit = 500;
        $scope.remoteDataConfig = function() {

            $("select[name='OfficeCode']").select2({
                ajax: {
                    url: BASEURL + RESTCALL.OfficeCode,
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
                        return query;
                    },
                    processResults: function(data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = []

                        for (j in data) {
                            myarr.push({
                                'id': data[j].actualvalue,
                                'text': data[j].displayvalue
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
        }

        $scope.remoteDataConfig()
    })

    if ((sessionStorage.newRule == 'true') || (sessionStorage.newRule == true)) {

        //$scope.creatingWindow = false;
        $scope.newRule123 = true;
        $scope.ViewClicked = false;
        $scope.BusinessRuleCreate = JSON.parse(sessionStorage.newRuleFormData);
        $scope.BusinessRuleCreate.Rule = sessionStorage.buildedRule;

        sessionStorage.newRule = false;

        setTimeout(function() {

            $scope.remoteDataConfig()
        }, 100)

    }


    if ((sessionStorage.newEditRule == true) || (sessionStorage.newEditRule == 'true')) {
        //setTimeout(function () {


        $scope.ViewClicked = false;
        $scope.BusinessRule = JSON.parse(sessionStorage.newEditRuleFormData);
        $scope.BusinessRule.Rule = sessionStorage.buildedRule;
        $scope.editedRule = sessionStorage.buildedRule;
        //$('#RuleCode_' + sessionStorage.editWindowID).focus();
        //$('#RuleCode_' + sessionStorage.editWindowID).blur();

    }


    function crudRequest(_method, _url, _data, _query) {
        return $http({
            method: _method,
            url: _url,
            data: _data,
            params: _query
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }
            return $scope.restResponse
        }, function(error) {
            if (error.status == 401) {
                errorservice.ErrorMsgFunction(error, $scope, $http)
            }
            $scope.restResponse = {
                'Status': 'Error',
                'data': error.data
            }
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            /* $timeout(function(){
            	$('#statusBox').hide();
            }, 4000); */
            return $scope.restResponse
        })
    }

    $scope.setIntiVal = function() {
        var _query = {
            search: $scope.BusinessRule.OfficeCode,
            start: 0,
            count: 500
        }
        crudRequest('GET', BASEURL + RESTCALL.OfficeCode, '', _query).then(function(response) {
            $scope.officeCodeVal = response.data.data;
        });
    }

    $scope.rulePhaseDropVal = function() {

        $http.get(BASEURL + RESTCALL.BusinessRulePhase).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.rulePhaseValue = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        });
    }
    $scope.rulePhaseDropVal()

    $scope.toRuleBuilderEdit = function(ss, index) {
        sessionStorage.newEditRuleFormData = JSON.stringify(ss);
        sessionStorage.editWindowID = index;
        GlobalService.editRuleBuilder = ss.RuleStructure;

        $location.path("app/businessrules3")
    }


    $scope.gotoEdit = function() {
        $scope.ViewClicked = false;
        setTimeout(function() {
            $scope.remoteDataConfig()
            $('.DatePicker').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true
            });

            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click()
            });

        }, 200)
        setTimeout(function() {
            $(".alert-danger").hide();
        }, 10)
    }
    $scope.gotoParent = function() {
        delete sessionStorage.newRule;
        delete sessionStorage.newRuleFormData;
        //delete sessionStorage.ruleJSONBinary;
        //delete sessionStorage.buildedRule;

        delete sessionStorage.newRule;
        delete sessionStorage.newRuleFormData;
        delete sessionStorage.ruleJSONBinary;
        delete sessionStorage.buildedRule;
        delete sessionStorage.newEditRule;
        delete sessionStorage.editWindowID;
        delete sessionStorage.newEditRuleFormData;
        delete sessionStorage.editruleJSONBinary;

        $scope.newRule123 = false;
        $location.path('app/businessrules')
    }

    $scope.createData = function(newData) {
        $scope.dateArr = ["RuleCreationDate", "EffectiveFromDate", "EffectiveTillDate"];

        for (var i in $scope.dateArr) {
            newData[$scope.dateArr[i]] = $('[name=' + $scope.dateArr[i] + ']').val()
        }

        newData.RuleStructure = sessionStorage.ruleJSONBinary;
        newData = removeEmptyValueKeys(newData)
        $http.post(BASEURL + RESTCALL.BankBusinessRuleREST, newData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.Fxupdated = data.responseMessage;
            //delete sessionStorage.newRuleFormData;
            $location.path('app/businessrules')
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message //Set the message to the popup window
            }];
        });
    }

    $scope.updateData = function(editedData) {
        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.BankBusinessRuleREST;

        if (sessionStorage.editruleJSONBinary != undefined) {
            editedData.RuleStructure = sessionStorage.editruleJSONBinary;
        }

        $http.put(BASEURL + RESTCALL.BankBusinessRuleREST, editedData).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.Fxupdated = data.responseMessage;
            $location.path('app/businessrules')
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message //Set the message to the popup window
            }];
        });
        //bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
    }



    $scope.deleteData = function() {



        $scope.delObj = {};
        $scope.delObj.OfficeCode = $scope.BusinessRule['OfficeCode'];
        $scope.delObj.RuleCode = $scope.BusinessRule['RuleCode'];


        $http.post(BASEURL + RESTCALL.BankBusinessRuleREST + 'delete', $scope.delObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            GlobalService.Fxupdated = data.responseMessage;
            $location.path('app/businessrules')
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message //Set the message to the popup window
            }];
        });
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
        /*if($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')){
        	$(e.currentTarget).data("DateTimePicker").hide();
        }*/
    }

    $scope.toRuleBuilder = function(ss) {

        $scope.RBwarning = false;
        if (ss != "") {

            /*$scope.RBwarning = false;
            sessionStorage.newRuleFormData = JSON.stringify(ss);
            $location.path("app/businessrules2")*/


            if ((ss.OfficeCode == "") || (ss.OfficeCode == undefined)) {
                $scope.RBwarning = true;

            } else {

                $scope.RBwarning = false;
                sessionStorage.newRuleFormData = JSON.stringify(ss);
                $location.path("app/businessrules2")
            }


            /*sessionStorage.newRuleFormData = JSON.stringify(ss);
            $location.path("app/businessrules2")*/




        } else {
            $scope.RBwarning = true;
        }
    }
    $scope.activatePicker = function(e) {

            var prev = null;
            $('.DatePicker').datetimepicker({
                format: "YYYY-MM-DD",
                useCurrent: true,
                showClear: true
            }).on('dp.change', function(ev) {



                $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('ng-model').split('.')[1]] = $(ev.currentTarget).val();

            }).on('dp.show', function(ev) {

            }).on('dp.hide', function(ev) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                    $(this).css({
                        "display": ""
                    });
                })
            });



            $('.TimePicker').datetimepicker({
                format: 'HH:mm:ss',
                useCurrent: true
            }).on('dp.change', function(ev) {


                if ($(ev.currentTarget).attr('ng-model').split('.')[0] != 'subData') {
                    $scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
                } else {
                    var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                    $scope.subSectionfieldData[pId][$('#' + pId).children().length - 2][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
                }


            }).on('dp.show', function(ev) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": ""
                });
                if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
                    $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                        if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) {} else {
                            $(this).css({
                                "display": "none"
                            });
                        }
                    })
                }
            }).on('dp.hide', function(ev) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                    $(this).css({
                        "display": ""
                    });
                })
            });

            $('.input-group-addon').on('click focus', function(e) {
                $(this).prev().focus().click()
            });
        }
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

    $(window).scroll(function() {
        $scope.widthOnScroll();
    })

    if (!GlobalService.fromAddNew) {
        $scope.editedLog = [];
        $scope.auditLogObj = {
            "OfficeCode": $scope.BusinessRule['OfficeCode'],
            "RuleCode": $scope.BusinessRule['RuleCode']
        };
        $http.post(BASEURL + RESTCALL.BankBusinessRuleREST + 'audit/readall', $scope.auditLogObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            for (i in data) {
                if (data[i].tableName == 'BusinessRules') {
                    $scope.editedLog.push(data[i])
                }
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.error.code != "404") {
                $scope.alerts = [{
                    type: 'danger',
                    msg: data.error.message //Set the message to the popup window
                }];
            }
        });
    }

})