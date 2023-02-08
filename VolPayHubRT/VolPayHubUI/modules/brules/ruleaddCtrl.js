angular.module('VolpayApp').controller('ruleaddCtrl', function($scope, $stateParams, $http, $state, bankData, GlobalService, $timeout, Scopes) {


    delete sessionStorage.newRule;
    delete sessionStorage.newEditRule;
    delete sessionStorage.ruleJSONBinary;
    delete sessionStorage.buildedRule;

    $('.BNYM_BR_validate').live('keypress', function(e) {

        var regex = /^[a-zA-Z_0-9]$/;
        var key = String.fromCharCode(e.which);

        if (key == '"') {

            return false;
        } else {

            return true;
        }

    });

    $(".BNYM_BR_validateCP").live('input paste', function(e) {
        e.preventDefault();
    });

});

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i))
            continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == '') {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1) {
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i))
            continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i))
            continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

angular.module('VolpayApp').controller('QueryBuilderCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'Scopes', '$http', '$filter', 'GlobalService', function($scope, $state, $rootScope, $stateParams, Scopes, $http, $filter, GlobalService) {
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })




    $rootScope.params = $stateParams;
    Scopes.params = $stateParams;

    Scopes.store('QueryBuilderCtrl', $scope);

    var data = '{"group": {"operator": "AND","rules": []}}';

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
        if (!group)
            return "";
        for (var str = "(", i = 0; i < group.rules.length; i++) {
            i > 0 && (str += " <strong>" + group.operator + "</strong> ");

            if (group.rules[i].condition123 == 'formula') {
                if (group.rules[i].data1_Value != undefined) {
                    //group.rules[i].data1 = group.rules[i].data1.replace('"$url"', group.rules[i].data1_Value);
                    //group.rules[i].data11 = '('+group.rules[i].data1+' = '+group.rules[i].data1_Value+')';
                    group.rules[i].data11 = group.rules[i].data1.replace('$url', group.rules[i].data1_Value);
                    group.rules[i].data11 = group.rules[i].data11.replace('$value', group.rules[i].data1_Value);
                    //group.rules[i].data1 = group.rules[i].data1.replace('$value', group.rules[i].data1_Value);
                    group.rules[i].data = group.rules[i].data11;
                }
                if (group.rules[i].data2_Value != undefined) {
                    //group.rules[i].data2 = group.rules[i].data2.replace('"$url"', group.rules[i].data2_Value);
                    //group.rules[i].data2 = group.rules[i].data2.replace('$value', group.rules[i].data2_Value);
                    //group.rules[i].data12 = '('+group.rules[i].data2+' = '+group.rules[i].data2_Value+')';
                    //group.rules[i].data=group.rules[i].data+'.'+group.rules[i].data12;

                    group.rules[i].data12 = group.rules[i].data2.replace('$url', group.rules[i].data2_Value);
                    group.rules[i].data12 = group.rules[i].data2.replace('$value', group.rules[i].data2_Value);
                    group.rules[i].data = group.rules[i].data11 + '.' + group.rules[i].data12;
                }

                str += group.rules[i].group ?
                    computed(group.rules[i].group) :
                    group.rules[i].selectedChapter.name + "." + group.rules[i].data;
            } else {
                var data122 = '';
                if (group.rules[i].data1_value123 != null) {
                    data122 = group.rules[i].data1_value123.name;
                    group.rules[i].data = group.rules[i].data1_value123.code;
                } else {
                    data122 = group.rules[i].data;
                }
                str += (group.rules[i].group) ? (computed(group.rules[i].group)) : ((group.rules[i].selectedChapter) ? (group.rules[i].selectedChapter.name + " " +
                    htmlEntities(JSON.parse(group.rules[i].condition).operator) + " " + data122) : '');
            }
        }

        return str + ")";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function(newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
        //$scope.output = computed(newValue.group);
        $scope.output1 = newValue;
    }, true);

}]);

angular.module('VolpayApp').controller('ActionQueryBuilderCtrl', ['$scope', '$rootScope', '$state', '$http', '$location', 'Scopes', '$stateParams', '$filter', function ($scope, $rootScope, $state, $http, $location, Scopes, $stateParams, $filter) {
    Scopes.store('ActionQueryBuilderCtrl', $scope);

    var data = '{"group": {"operator": "AND","actions": []}}';

    //var data = (GlobalService.editRuleBuilder)?JSON.stringify(JSON.parse($filter('hex2a')(GlobalService.editRuleBuilder)).Rule):data1;


    $scope.madeChanges = $rootScope.dataModified;


    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            $rootScope.dataModified = false;
            $scope.cancelpressed();
        } else {
            $rootScope.$emit("MyEvent2", true);

        }
    }
    $scope.gotoShowAlert = function() {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $("#changesLostModal").modal("show");
        } else {
            $scope.cancelpressed();
        }
    }

    $scope.gotoCancelFn = function() {
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            $scope.cancelpressed();
        }

    }



    $(document).ready(function() {
        $('#changesLostModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0)
        })
        $('#changesLostModal').on('hidden.bs.modal', function(e) {
            $scope.fromCancelClick = false;
            $scope.breadCrumbClicked = false;
        })
    })



    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
        if (!group)
            return "";
        for (var str = "(", i = 0; i < group.actions.length; i++) {
            i > 0 && (str += " ; ");

            if (group.actions[i].condition123 != undefined) {
                group.actions[i].selectedChapter.name + " " + htmlEntities(group.actions[i].condition123) + " " + group.actions[i].data;
            } else {}

            str += group.actions[i].group ?
                computed(group.actions[i].group) :
                group.actions[i].selectedChapter.name + " = " + group.actions[i].data;
        }

        return str + ")";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function(newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);

        //$scope.output = computed(newValue.group);

        //$scope.getActionType($scope.json)

        $scope.output1 = $scope.json;
    }, true);

    sessionStorage.newRule = false;
    $scope.confirmRule = function() {
        sessionStorage.newRule = true;

        $rootScope.params.input.params.Operation = ' Add';
        $rootScope.params.input.params.fieldData["Rule"] = sessionStorage.buildedRule;
        $rootScope.params.input.params.fieldData["RuleStructure"] = sessionStorage.ruleJSONBinary;

        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.params.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.params.Operation).toLowerCase();
        params.input = $rootScope.params.input.params;
        $state.go('app.operation', params);
        //$location.path('app/businessrulesdetails')
        //window.location.href = '#/app/businessrules'
    }

    var AllOperators = JSON.parse(hexToString(sessionStorage.BROPERATORS))

    $scope.cancelpressed = function() {
        delete sessionStorage.newEditRule;
        delete sessionStorage.newRuleFormData;
        delete sessionStorage.newRule;

        $rootScope.params.input.params.Operation = ' Add';
        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.params.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.params.Operation).toLowerCase();
        params.input = $rootScope.params.input.params;
        $state.go('app.operation', params);
    }

    function conCatenation(val) {
        var cc = "";
        for (i = 0; i < val.length; i++) {
            if (i == 0) {
                cc = val[i];
            }
            if (i > 0) {
                cc = cc + '.' + val[i];
            }
        }
        return cc;
    }

    function ObjCleanup(Obj) {

        for (var i in Obj.group.rules) {

            if (Object.keys(Obj.group.rules[i]).indexOf('group') != -1) {
                ObjCleanup(Obj.group.rules[i])
            } else {

                var keyArr = ["lhsmetadata1", "lhsvalue1", "rhsmetadata1", "rhsvalue1", "otherTransactions", "category", "data", "field", "parsedField"];

                for (var _i in keyArr) {
                    delete Obj.group.rules[i][keyArr[_i]]
                }


                if (Obj.group.rules[i].lhsvalue) {
                    Obj.group.rules[i].lhsvalue = JSON.parse(JSON.stringify(Obj.group.rules[i].lhsvalue).replace(/;;/g, ';'))
                }
                if (Obj.group.rules[i].rhsvalue) {
                    Obj.group.rules[i].rhsvalue = JSON.parse(JSON.stringify(Obj.group.rules[i].rhsvalue).replace(/;;/g, ';'))
                }

                if (Obj.group.rules[i].lhsmetadata) {
                    Obj.group.rules[i].lhsmetadata = JSON.parse(JSON.stringify(Obj.group.rules[i].lhsmetadata).replace(/},{/g, '}.{'))
                }
                if (Obj.group.rules[i].rhsmetadata) {
                    Obj.group.rules[i].rhsmetadata = JSON.parse(JSON.stringify(Obj.group.rules[i].rhsmetadata).replace(/},{/g, '}.{'))
                    Obj.group.rules[i].rhsmetadata = Obj.group.rules[i].rhsmetadata.replace('{' + Obj.group.rules[i].condition + '}', '')
                }


                if (Obj.group.rules[i].lhsvalue == '') {
                    delete Obj.group.rules[i].lhsvalue;
                }

                if (Obj.group.rules[i].rhsvalue == '') {
                    delete Obj.group.rules[i].rhsvalue;
                }

                if (Obj.group.rules[i].lhsmetadata == '') {
                    delete Obj.group.rules[i].lhsmetadata;
                }

                if (Obj.group.rules[i].rhsmetadata == '') {
                    delete Obj.group.rules[i].rhsmetadata;
                }
                Obj.group.rules[i] = JSON.parse(JSON.stringify(Obj.group.rules[i]).replace('"rhsmetadata":".{', '"rhsmetadata":"{'))

            }


        }
        return cleantheinputdata(Obj);
    }

    function ObjCleanupforAction(Obj) {
        for (h = 0; h < Obj.group.actions.length; h++) {
            delete Obj.group.actions[h].$$hashKey
            delete Obj.group.actions[h].lhsmetadata1
            delete Obj.group.actions[h].lhsvalue1
            delete Obj.group.actions[h].rhsmetadata1
            delete Obj.group.actions[h].rhsvalue1
            delete Obj.group.actions[h].otherTransactions
            delete Obj.group.actions[h].category
            delete Obj.group.actions[h].data
            delete Obj.group.actions[h].field
            delete Obj.group.actions[h].parsedField

            if (Obj.group.actions[h].lhsvalue != undefined) {
                Obj.group.actions[h].lhsvalue = JSON.parse(JSON.stringify(Obj.group.actions[h].lhsvalue).replace(/;;/g, ';'))
            }
            if (Obj.group.actions[h].rhsvalue != undefined) {
                Obj.group.actions[h].rhsvalue = JSON.parse(JSON.stringify(Obj.group.actions[h].rhsvalue).replace(/;;/g, ';'))
            }
            if (Obj.group.actions[h].lhsmetadata != undefined) {
                Obj.group.actions[h].lhsmetadata = JSON.parse(JSON.stringify(Obj.group.actions[h].lhsmetadata).replace(/},{/g, '}.{'))
            }
            if (Obj.group.actions[h].rhsmetadata != undefined) {
                Obj.group.actions[h].rhsmetadata = JSON.parse(JSON.stringify(Obj.group.actions[h].rhsmetadata).replace(/},{/g, '}.{'))
                Obj.group.actions[h].rhsmetadata = Obj.group.actions[h].rhsmetadata.replace('{' + Obj.group.actions[h].condition + '}', '')
                    //Obj.group.actions[h].rhsmetadata.replace('{assign($URL:String)}.','')
            }
            if (Obj.group.actions[h].lhsvalue == '') {
                delete Obj.group.actions[h].lhsvalue;
            }

            if (Obj.group.actions[h].rhsvalue == '') {
                delete Obj.group.actions[h].rhsvalue;
            }

            if (Obj.group.actions[h].lhsmetadata == '') {
                delete Obj.group.actions[h].lhsmetadata;
            }

            if (Obj.group.actions[h].rhsmetadata == '') {
                delete Obj.group.actions[h].rhsmetadata;
            }
            Obj.group.actions[h] = JSON.parse(JSON.stringify(Obj.group.actions[h]).replace('"rhsmetadata":".{', '"rhsmetadata":"{'))
        }
        return cleantheinputdata(Obj);
    }

    function currectRulesStru(intObj) {

        for (var i in intObj.group.rules) {

            if (Object.keys(intObj.group.rules[i]).indexOf('group') != -1) {
                currectRulesStru(intObj.group.rules[i])
            } else {
                if (intObj.group.rules[i].field != '') {
                    intObj.group.rules[i].lhsmetadata1 = [];
                    intObj.group.rules[i].rhsmetadata1 = [];
                    intObj.group.rules[i].lhsvalue1 = [];
                    intObj.group.rules[i].rhsvalue1 = [];
                    if (intObj.group.rules[i].field != undefined) {
                        intObj.group.rules[i].lhsmetadata1.push('{' + JSON.parse(intObj.group.rules[i].field).code + '}')
                    }
                    var rhs_meta_flag = false
                    if (intObj.group.rules[i].otherTransactions != undefined) {

                        for (var j in intObj.group.rules[i].otherTransactions) {

                            if (intObj.group.rules[i].otherTransactions[j].condition != undefined) {
                                if (JSON.parse(intObj.group.rules[i].otherTransactions[j].condition).implType == 'OPERATOR') {
                                    intObj.group.rules[i].condition = JSON.parse(intObj.group.rules[i].otherTransactions[j].condition).code;
                                    rhs_meta_flag = true;
                                } else {}

                                if (rhs_meta_flag == true) {

                                    if (j > 0) {
                                        if (intObj.group.rules[i].otherTransactions[j].condition != undefined) {
                                            intObj.group.rules[i].rhsmetadata1.push('{' + JSON.parse(intObj.group.rules[i].otherTransactions[j].condition).code + '}')
                                        }
                                    }
                                    if (intObj.group.rules[i].otherTransactions[j].parameterCount.count != undefined) {
                                        for (var k in intObj.group.rules[i].otherTransactions[j].parameterCount.count) {
                                            if (intObj.group.rules[i].otherTransactions[j]['Value_' + k] != undefined) {

                                                if (intObj.group.rules[i].otherTransactions[j]['Value_' + k].indexOf(' - ') != -1) {
                                                    intObj.group.rules[i].rhsvalue1.push('$value:' + objectFindByKey(intObj.group.rules[i].otherTransactions[j].parameterCount.operatorList, 'name', intObj.group.rules[i].otherTransactions[j]['Value_' + k].split(' - ')[0]).code + ';')
                                                } else {
                                                    intObj.group.rules[i].rhsvalue1.push('$value:' + intObj.group.rules[i].otherTransactions[j]['Value_' + k] + ';')
                                                }
                                            }
                                        }
                                    }

                                } else {
                                    intObj.group.rules[i].lhsmetadata1.push('{' + JSON.parse(intObj.group.rules[i].otherTransactions[j].condition).code + '}')
                                    if (intObj.group.rules[i].otherTransactions[j].parameterCount.count != undefined) {
                                        for (var _k in intObj.group.rules[i].otherTransactions[j].parameterCount.count) {

                                            if (intObj.group.rules[i].otherTransactions[j]['Value_' + _k] != undefined) {

                                                if (intObj.group.rules[i].otherTransactions[j]['Value_' + _k].indexOf(' - ') != -1) {
                                                    intObj.group.rules[i].lhsvalue1.push('$value:' + objectFindByKey(intObj.group.rules[i].otherTransactions[j].parameterCount.operatorList, 'name', intObj.group.rules[i].otherTransactions[j]['Value_' + _k].split(' - ')[0]).code + ';')
                                                } else {
                                                    intObj.group.rules[i].lhsvalue1.push('$value:' + intObj.group.rules[i].otherTransactions[j]['Value_' + _k] + ';')
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }

                    if (!rhs_meta_flag) {
                        intObj.group.rules[i].condition = "FORMULA";
                    }

                    if (intObj.group.rules[i].condition != undefined) {
                        if (JSON.stringify(intObj.group.rules[i].condition).indexOf(':') != -1) {
                            intObj.group.rules[i].type = objectFindByKey(AllOperators, 'type', intObj.group.rules[i].condition.substring(0, [intObj.group.rules[i].condition.length - 1]).split(':')[1]).type
                        } else {
                            if (intObj.group.rules[i].lhsmetadata1.length > 1) {

                                intObj.group.rules[i].type = objectFindByKey(AllOperators, 'code', intObj.group.rules[i].lhsmetadata1[intObj.group.rules[i].lhsmetadata1.length - 1].substring(1, intObj.group.rules[i].lhsmetadata1[intObj.group.rules[i].lhsmetadata1.length - 1].length - 1)).type
                            }
                        }
                    }

                    intObj.group.rules[i].lhsmetadata = intObj.group.rules[i].lhsmetadata1.toString()
                    intObj.group.rules[i].lhsvalue = intObj.group.rules[i].lhsvalue1.toString()
                    intObj.group.rules[i].rhsmetadata = intObj.group.rules[i].rhsmetadata1.toString()
                    intObj.group.rules[i].rhsvalue = intObj.group.rules[i].rhsvalue1.toString()

                }

            }

        }

        return intObj;
    }

    function currectActionStru(intObj) {
        for (h = 0; h < intObj.group.actions.length; h++) {
            intObj.group.actions[h].lhsmetadata1 = [];
            intObj.group.actions[h].rhsmetadata1 = [];
            intObj.group.actions[h].lhsvalue1 = [];
            intObj.group.actions[h].rhsvalue1 = [];

            intObj.group.actions[h].lhsmetadata1.push('{' + JSON.parse(intObj.group.actions[h].field).code + '}')
            intObj.group.actions[h].type = JSON.parse(intObj.group.actions[h].field).type
            var rhs_meta_flag = false

            if (JSON.parse(intObj.group.actions[h].otherTransactions[0].condition).code) {
                intObj.group.actions[h].condition = JSON.parse(intObj.group.actions[h].otherTransactions[0].condition).code;
            }

            for (i = 0; i < intObj.group.actions[h].otherTransactions.length; i++) {
                if (intObj.group.actions[h].otherTransactions[i].parameterCount != undefined) {
                    if (i > 0) {
                        if (intObj.group.actions[h].otherTransactions[i].condition != undefined) {
                            intObj.group.actions[h].rhsmetadata1.push('{' + JSON.parse(intObj.group.actions[h].otherTransactions[i].condition).code + '}')
                        }
                    }
                    for (j = 0; j < (intObj.group.actions[h].otherTransactions[i].parameterCount.count.length); j++) {

                        if (intObj.group.actions[h].otherTransactions[i]['Value_' + j] != undefined) {

                            if (intObj.group.actions[h].otherTransactions[i]['Value_' + j].indexOf(' - ') != -1) {
                                intObj.group.actions[h].rhsvalue1.push('$value:' + objectFindByKey(intObj.group.actions[h].otherTransactions[i].parameterCount.operatorList, 'name', intObj.group.actions[h].otherTransactions[i]['Value_' + j].split(' - ')[0]).code + ';')
                            } else {
                                intObj.group.actions[h].rhsvalue1.push('$value:' + intObj.group.actions[h].otherTransactions[i]['Value_' + j] + ';')
                            }
                        }
                    }
                }

            }

            intObj.group.actions[h].lhsmetadata = intObj.group.actions[h].lhsmetadata1.toString()
            intObj.group.actions[h].lhsvalue = intObj.group.actions[h].lhsvalue1.toString()
            intObj.group.actions[h].rhsmetadata = intObj.group.actions[h].rhsmetadata1.toString()
            intObj.group.actions[h].rhsvalue = intObj.group.actions[h].rhsvalue1.toString()
            if (intObj.group.actions[h].group != undefined) {
                currectActionStru(intObj.group.actions[h])
            }
        }
        return intObj;
    }

    $scope.buttonClick = function() {

        var ruletoBlob = angular.copy(Scopes.get('QueryBuilderCtrl').output1);
        var ruletoBlob1 = angular.copy(Scopes.get('QueryBuilderCtrl').output1);
        var actiontoBlob = angular.copy(Scopes.get('ActionQueryBuilderCtrl').output1);
        var FinalRule = JSON.stringify(ObjCleanup(currectRulesStru(ruletoBlob)));
        var FinalAction = JSON.stringify(ObjCleanupforAction(currectActionStru(JSON.parse(actiontoBlob))));
        FinalRule = FinalRule.replace(',"condition":"FORMULA"', '')
        $scope.FinalJSON = '{"Data":{"Rule":' + FinalRule + ',"Action":' + FinalAction + '}}';
        sessionStorage.ruleJSONBinary = stringToHex($scope.FinalJSON);

        _url1 = BASEURL + RESTCALL.BankBusinessRuleREST + $stateParams.input.params.fieldData.WorkFlowCode + '/rulebuilder';

        $http({
            method: "POST",
            url: _url1,
            data: $scope.FinalJSON,
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

            sessionStorage.buildedRule = data.responseMessage;
            $scope.buildedRule = data.responseMessage;
            $scope.confirmRule();
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
        });
    };

}]);

angular.module('VolpayApp').directive('actionBuilder', ['$compile', '$http', '$timeout', '$stateParams', function($compile, $http, $timeout, $stateParams) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/actionBuilderDirective.html',
        compile: function(element, attrs) {
            var content,
                directive;
            content = element.contents().remove();
            return function(scope, element, attrs) {
                scope.operators = [{
                    name: 'AND'
                }, {
                    name: 'OR'
                }];

                var tempInIbj = {
                    "type": "ALL",
                    "pane": "ACTION",
                    "context": "LHS",
                    "code": "string",
                    "workflow": $stateParams.input.params.fieldData.WorkFlowCode,
                    "implType": "XPATH"
                }

                $http({
                    //url : BASEURL + '/rest/v2/rulebuilders/action?workflow=' + $stateParams.input.params.fieldData.WorkFlowCode + '&start=0&count=200',
                    url: BASEURL + '/rest/v2/rulebuilders/lhs/fields?' + 'start=0&count=200',
                    method: "POST",
                    data: tempInIbj,
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    scope.ACTIONoptions = data.ruleVariables;
                    //$('select[name=rulefield]').select2()
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                });

                var backupselectOperatortype = ''
                scope.onselectActionOperator = function(rule, rule_condition, index, flag, _Arr) {

                    scope.OperatorSelectedFlag = false;
                    for (i = 0; i < rule.otherTransactions.length; i++) {
                        if (rule.otherTransactions[i].condition) {
                            var OprCheck = JSON.parse(rule.otherTransactions[i].condition).implType;
                            if (OprCheck == 'OPERATOR') {
                                scope.OperatorSelectedFlag = true;
                            }
                        }
                    }

                    if (index != -1 && !flag) {
                        selectOperator = JSON.parse(rule_condition)
                    } else if (flag) {
                        selectOperator = objectFindByKey(_Arr, 'name', rule_condition.split(' - ')[0])
                    } else {
                        selectOperator = JSON.parse(rule.field)
                    }

                    rule.parsedField = JSON.parse(rule.field);

                    if (rule.parsedField.type == 'Date') {

                        setTimeout(function() {
                            $('.DatePicker').datepicker({
                                format: 'yyyy-mm-dd',
                                autoclose: true
                            });

                            $('.input-group-addon').on('click focus', function(e) {
                                $(this).prev().focus().click()
                            });

                        }, 200)

                    }

                    if (rule.parsedField.type == 'DateTime') {

                        setTimeout(function() {
                            $('.DateTimePicker').datepicker({
                                format: 'yyyy-mm-dd' + ' 00:00:00',
                                autoclose: true
                            });

                            $('.input-group-addon').on('click focus', function(e) {
                                $(this).prev().focus().click()
                            });

                        }, 200)

                    }

                    var paramsCount = []
                    for (i = 0; i < selectOperator.parameterCount; i++) {
                        paramsCount.push(i)
                    }

                    var tempInIbj = {
                        "type": backupselectOperatortype ? backupselectOperatortype : selectOperator.type,
                        "pane": "ACTION",
                        "context": (index != -1) ? (selectOperator.implType == "FORMULA") ? "LHS" : "RHS" : "LHS",
                        "code": selectOperator.code,
                        "workflow": $stateParams.input.params.fieldData.WorkFlowCode,
                        "implType": (index != -1) ? (selectOperator.implType == "FORMULA") ? "FORMULA" : "FORMULA" : "OPERATOR"
                    }
                    var url = '/v2/rulebuilders/operators';
                    if (selectOperator.url) {
                        url = selectOperator.url
                        backupselectOperatortype = (selectOperator.implType == "FORMULA") ? selectOperator.type : '';
                        tempInIbj.implType = 'XPATH'
                        tempInIbj.type = selectOperator.code.split(':')[1].substring(0, selectOperator.code.split(':')[1].length - 1)
                    } else {
                        if (flag) {
                            tempInIbj.type = backupselectOperatortype ? backupselectOperatortype : selectOperator.type
                            backupselectOperatortype = '';
                        } else {
                            tempInIbj.type = selectOperator.type
                        }

                        if (scope.OperatorSelectedFlag) {
                            tempInIbj.context = 'RHS';
                            tempInIbj.implType = 'FORMULA'
                        }

                    }


                    $http({
                        url: BASEURL + '/rest' + url + '?start=0&count=200',
                        method: "POST",
                        data: tempInIbj,
                    }).then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        if (index == -1) {
                            rule.otherTransactions = []
                            rule.otherTransactions.push({
                                "operatorList": data.ruleVariables
                            })
                        } else {
                            if (flag) {
                                if (data.ruleVariables) {
                                    rule.otherTransactions.push({
                                        "operatorList": data.ruleVariables
                                    })
                                }
                            } else {
                                if (index < rule.otherTransactions.length - 1) {
                                    if (selectOperator.url) {
                                        rule.otherTransactions.splice(index + 1, rule.otherTransactions.length - 1)
                                        var _back_up = rule.otherTransactions[index]
                                        rule.otherTransactions[index] = {
                                            'condition': _back_up.condition,
                                            'operatorList': _back_up.operatorList,
                                            'parameterCount': {
                                                "count": paramsCount,
                                                'operatorList': data.ruleVariables
                                            }
                                        }
                                    } else {
                                        rule.otherTransactions.splice(index + 2, rule.otherTransactions.length - 1)
                                        var _back_up = rule.otherTransactions[index]
                                        rule.otherTransactions[index] = {
                                            'condition': _back_up.condition,
                                            'operatorList': _back_up.operatorList,
                                            'parameterCount': {
                                                "count": paramsCount,
                                                'operatorList': data.ruleVariables
                                            }
                                        }
                                    }
                                } else if (index > rule.otherTransactions.length - 1) {} else {
                                    if (selectOperator.url) {
                                        rule.otherTransactions[index].parameterCount = {
                                            'count': paramsCount,
                                            'operatorList': data.ruleVariables
                                        }
                                        if (index < rule.otherTransactions.length - 1) {
                                            rule.otherTransactions.splice(index + 1, rule.otherTransactions.length - 1)
                                        }
                                    } else {
                                        if (index < rule.otherTransactions.length - 1) {
                                            rule.otherTransactions[index].operatorList = data.ruleVariables
                                        } else {
                                            var _back_up = rule.otherTransactions[index]
                                            rule.otherTransactions[index] = {
                                                'condition': _back_up.condition,
                                                'operatorList': _back_up.operatorList,
                                                'parameterCount': {
                                                    "count": paramsCount
                                                }
                                            }
                                            rule.otherTransactions.push({
                                                "operatorList": data.ruleVariables
                                            })
                                        }
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

                    });
                }

                scope.addAction = function() {
                    scope.group.actions.push({
                        condition: '=',
                        field: '',
                        data: '',
                        type: 'String',
                        otherTransactions: []
                    });
                };

                scope.removeAction = function(index) {
                    scope.group.actions.splice(index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function($compile) {
                    return $compile;
                }));

                function uniques(arr) {
                    var a = [];
                    for (var i = 0, l = arr.length; i < l; i++)
                        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                            a.push(arr[i]);
                    return a;
                }

                scope.validateAction = function(value, index1) {
                    for (var i = 0; i < index1; i++) {
                        var fieldValue1 = $("#actionField" + i).val()
                        var fieldValue2 = $("#actionField" + index1).val()
                        if (fieldValue1 == fieldValue2) {
                            alert("Action field should be unique");
                            //$("#actionField"+index1).val("select");
                            scope.removeAction(index1)
                        }
                    }
                }
            }
        }
    }
}]);

angular.module('VolpayApp').directive('queryBuilder', ['$compile', '$http', '$timeout', '$stateParams', function($compile, $http, $timeout, $stateParams) {


    return {

        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function(element, attrs) {
            var content,
                directive;
            content = element.contents().remove();
            return function(scope, element, attrs) {

                scope.operators = [{
                    name: 'AND'
                }, {
                    name: 'OR'
                }];

                scope.rules11 = [];
                scope.optionsRHS = [];
                scope.options = [];

                scope.nonBoolean = false;
                scope.nonBoolean1 = {};

                var tempInIbj = {
                    "type": "ALL",
                    "pane": "CONDITION",
                    "context": "LHS",
                    "code": "string",
                    "workflow": $stateParams.input.params.fieldData.WorkFlowCode,
                    "implType": "XPATH"
                }

                $http({
                    //url : BASEURL + '/rest/v2/rulebuilders/action?workflow=' + $stateParams.input.params.fieldData.WorkFlowCode + '&start=0&count=200',
                    url: BASEURL + '/rest/v2/rulebuilders/lhs/fields?' + 'start=0&count=200',
                    method: "POST",
                    data: tempInIbj,
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    scope.options = data.ruleVariables;
                    //$('select[name=rulefield]').select2()
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                });

                scope.addCondition = function() {
                    scope.group.rules.push({
                        condition: '==',
                        category: '',
                        field: '',
                        data: '',
                        type: '',
                        otherTransactions: []
                    });
                    $timeout(function() {
                        $('select[name=rulefield]').select2()
                    }, 100)

                };

                function objectFindByKey(array, key, value) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i][key] === value) {
                            return array[i];
                        }
                    }
                    return null;
                }

                scope.removeCondition = function(index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function() {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function() {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                var backupselectOperatortype = ''
                scope.onselectOperator = function(rule, rule_condition, index, flag, _Arr) {
                    scope.UUID = Math.floor((Math.random() * 1000) + 1)
                    scope.OperatorSelectedFlag = false;
                    for (i = 0; i < rule.otherTransactions.length; i++) {
                        if (rule.otherTransactions[i].condition) {
                            var OprCheck = JSON.parse(rule.otherTransactions[i].condition).implType;
                            if (OprCheck == 'OPERATOR') {
                                scope.OperatorSelectedFlag = true;
                            }
                        }
                    }

                    if (index != -1 && !flag) {
                        selectOperator = JSON.parse(rule_condition)
                    } else if (flag) {
                        selectOperator = objectFindByKey(_Arr, 'name', rule_condition.split(' - ')[0])
                    } else {
                        selectOperator = JSON.parse(rule.field)
                    }
                    rule.parsedField = JSON.parse(rule.field);

                    if (rule.parsedField.type == 'Date') {

                        setTimeout(function() {
                            $('.DatePicker').datepicker({
                                format: 'yyyy-mm-dd',
                                autoclose: true
                            });

                            $('.input-group-addon').on('click focus', function(e) {
                                $(this).prev().focus().click()
                            });

                        }, 200)

                    }

                    if (rule.parsedField.type == 'DateTime') {

                        setTimeout(function() {
                            $('.DateTimePicker').datepicker({
                                format: 'yyyy-mm-dd' + ' 00:00:00',
                                autoclose: true
                            });

                            $('.input-group-addon').on('click focus', function(e) {
                                $(this).prev().focus().click()
                            });

                        }, 200)

                    }

                    var paramsCount = []
                    for (i = 0; i < selectOperator.parameterCount; i++) {
                        paramsCount.push(i)
                    }
                    var tempInIbj = {
                        "type": backupselectOperatortype ? backupselectOperatortype : selectOperator.type,
                        "pane": "CONDITION",
                        "context": (index != -1) ? (selectOperator.implType == "FORMULA" || selectOperator.implType == "XPATH") ? "LHS" : "RHS" : "LHS",
                        "code": selectOperator.code,
                        "workflow": $stateParams.input.params.fieldData.WorkFlowCode,
                        "implType": (index != -1) ? (selectOperator.implType == "FORMULA" || selectOperator.implType == "XPATH") ? "FORMULA,OPERATOR" : "FORMULA" : "FORMULA,OPERATOR"
                    }


                    var url = '/v2/rulebuilders/operators';
                    if (selectOperator.url) {
                        url = selectOperator.url
                        backupselectOperatortype = (selectOperator.implType == "FORMULA") ? selectOperator.type : '';
                        tempInIbj.implType = 'XPATH'
                        tempInIbj.type = selectOperator.code.split(':')[1].substring(0, selectOperator.code.split(':')[1].length - 1)
                    } else {
                        if (flag) {
                            tempInIbj.type = backupselectOperatortype ? backupselectOperatortype : selectOperator.type
                            backupselectOperatortype = '';
                        } else {
                            tempInIbj.type = selectOperator.type
                        }
                        if (scope.OperatorSelectedFlag) {
                            tempInIbj.context = 'RHS';
                            tempInIbj.implType = 'FORMULA'
                        }

                    }

                    $http({
                        url: BASEURL + '/rest' + url + '?start=0&count=200',
                        method: "POST",
                        data: tempInIbj,
                    }).then(function onSuccess(response) {
                        // Handle success
                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;

                        if (index == -1) {
                            rule.otherTransactions = []
                            rule.otherTransactions.push({
                                "operatorList": data.ruleVariables
                            })

                        } else {
                            if (flag) {
                                if (data.ruleVariables) {

                                    if (tempInIbj.type != 'Boolean') {
                                        rule.otherTransactions.push({
                                            "operatorList": data.ruleVariables
                                        })
                                    }
                                }
                            } else {
                                if (index < rule.otherTransactions.length - 1) {
                                    if (selectOperator.url) {
                                        rule.otherTransactions.splice(index + 1, rule.otherTransactions.length - 1)
                                        var _back_up = rule.otherTransactions[index]
                                        rule.otherTransactions[index] = {
                                            'condition': _back_up.condition,
                                            'operatorList': _back_up.operatorList,
                                            'parameterCount': {
                                                "count": paramsCount,
                                                'operatorList': data.ruleVariables
                                            }
                                        }
                                    } else {
                                        rule.otherTransactions.splice(index + 2, rule.otherTransactions.length - 1)
                                        var _back_up = rule.otherTransactions[index]
                                        rule.otherTransactions[index] = {
                                            'condition': _back_up.condition,
                                            'operatorList': _back_up.operatorList,
                                            'parameterCount': {
                                                "count": paramsCount,
                                                'operatorList': data.ruleVariables
                                            }
                                        }

                                    }
                                } else if (index > rule.otherTransactions.length - 1) {} else {

                                    if (selectOperator.url) {
                                        rule.otherTransactions[index].parameterCount = {
                                            'count': paramsCount,
                                            'operatorList': data.ruleVariables
                                        }
                                        if (index < rule.otherTransactions.length - 1) {
                                            rule.otherTransactions.splice(index + 1, rule.otherTransactions.length - 1)
                                        }
                                    } else {

                                        if (index < rule.otherTransactions.length - 1) {
                                            rule.otherTransactions[index].operatorList = data.ruleVariables
                                        } else {

                                            var _back_up = rule.otherTransactions[index]
                                            rule.otherTransactions[index] = {
                                                'condition': _back_up.condition,
                                                'operatorList': _back_up.operatorList,
                                                'parameterCount': {
                                                    "count": paramsCount
                                                }
                                            }
                                            if (selectOperator.type != "Boolean") {
                                                rule.otherTransactions.push({
                                                    "operatorList": data.ruleVariables
                                                })
                                            }
                                        }

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

                    });
                }
                directive || (directive = $compile(content));
                element.append(directive(scope, function($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);

angular.module('VolpayApp').factory('Scopes', function($rootScope) {
    var mem = {};

    return {
        store: function(key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
        },
        get: function(key) {
            return mem[key];
        }
    };
});