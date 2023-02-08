angular.module('VolpayApp').controller('brdBusinessRulesCtrl3', function($scope, $stateParams, $http, $state, bankData, GlobalService, $timeout, Scopes3) {

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

function getObjects(array, key, value) {
    var objects = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            objects.push(array[i]);
        }
    }

    return objects;
}

/* function getObjectsVolante(array, key, value,key2,value2,key3,value3) {
	var objects = [];
	for (var i = 0; i < array.length; i++) {
		if ((array[i][key] === value)&&(array[i][key2] === value2)&&(array[i][key3] === value3)) {
			objects.push(array[i]);
		}
	}

	return objects;
} */


function getObjectsVolante(array, key, value, key2, value2, key3, value3, implType1, value4, implType2, value5) {
    var objects = [];
    if (value3 == 'RHS') {
        for (var i = 0; i < array.length; i++) {
            if ((array[i][key] === value) && (array[i][key2] === value2) && (array[i][key3] === value3) && (array[i][implType1] === value4) && (array[i]["type"] != 'Boolean')) {
                objects.push(array[i]);
            }
        }

    } else {
        for (var i = 0; i < array.length; i++) {
            if (((array[i][key] === value) && (array[i][key2] === value2) && (array[i][key3] === value3)) && (array[i][implType1] === value4)) {
                objects.push(array[i]);
            }
        }
    }

    return objects;
}


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

function objectFindByKeyRHS(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if ((array[i][key] === value) && (array[i]['supportedContext'] == 'RHS')) {
            return array[i];
        }
    }
    return null;
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function JSONReBuild(JSONDATA, LHS_field, Operators, RHS_field) {

    var LHSVALUE123 = [];
    var RHSVALUE123 = [];
    if (JSONDATA.group.rules != undefined) {
        for (var h in JSONDATA.group.rules) {
            if (Object.keys(JSONDATA.group.rules[h]).indexOf('group') != -1) {
                JSONReBuild(JSONDATA.group.rules[h], LHS_field, Operators, RHS_field)
            } else {

                var conditionCount = '';
                var RHSconditionCount = '';

                JSONDATA.group.rules[h].category = '';
                JSONDATA.group.rules[h].data = '';
                JSONDATA.group.rules[h].otherTransactions = [];



                if (JSONDATA.group.rules[h].lhsmetadata != undefined) {
                    JSONDATA.group.rules[h].field = JSON.stringify(objectFindByKey(LHS_field, 'code', JSONDATA.group.rules[h].lhsmetadata.substring(1, JSONDATA.group.rules[h].lhsmetadata.length - 1).split('}.{')[0]))
                    JSONDATA.group.rules[h].parsedField = objectFindByKey(LHS_field, 'code', JSONDATA.group.rules[h].lhsmetadata.substring(1, JSONDATA.group.rules[h].lhsmetadata.length - 1).split('}.{')[0])
                    conditionCount = JSONDATA.group.rules[h].lhsmetadata.substring(1, JSONDATA.group.rules[h].lhsmetadata.length - 1).split('}.{');
                }

                if (JSONDATA.group.rules[h].rhsmetadata != undefined) {
                    RHSconditionCount = JSONDATA.group.rules[h].rhsmetadata.substring(1, JSONDATA.group.rules[h].rhsmetadata.length - 1).split('}.{');
                }

                //LHSVALUE123[h]
                if (JSONDATA.group.rules[h].lhsvalue != undefined) {
                    LHSVALUE123[h] = (JSONDATA.group.rules[h].lhsvalue).substring(0, JSONDATA.group.rules[h].lhsvalue.length - 1).split(';,');
                }
                if (JSONDATA.group.rules[h].rhsvalue != undefined) {
                    RHSVALUE123[h] = (JSONDATA.group.rules[h].rhsvalue).substring(0, JSONDATA.group.rules[h].rhsvalue.length - 1).split(';,');
                }


                if (conditionCount.length > 1) {

                    var _k = 0;

                    for (i = 1; i < conditionCount.length; i++) {
                        var ff = {}
                        var condition = ''
                        if (i == 0) {
                            condition = objectFindByKey(LHS_field, 'code', conditionCount[i])
                        } else {
                            condition = objectFindByKey(Operators, 'code', conditionCount[i])
                            if (condition == null) {
                                condition = objectFindByKey(LHS_field, 'code', conditionCount[i])
                            }
                        }



                        ff.condition = JSON.stringify(condition)
                        ff.operatorList = getObjectsVolante(Operators, 'dataType', condition.dataType, 'supportedPane', 'CONDITION', 'supportedContext', 'LHS');
                        ff.parameterCount = {};
                        ff.parameterCount.count = [];
                        count1 = [];
                        if (condition.parameterCount != undefined) {

                            j11 = 0;
                            for (j = _k; j < _k + condition.parameterCount; j++) {

                                var dd = objectFindByKey(RHS_field, 'code', LHSVALUE123[h][j].split('$value:')[1])
                                if (dd == null) {
                                    ff['Value_' + j11] = LHSVALUE123[h][j].split('$value:')[1];
                                    count1.push(j11)
                                } else {
                                    ff.parameterCount.operatorList = getObjects(RHS_field, 'type', dd.type);
                                    ff['Value_' + j11] = (dd.name + ' - ' + dd.type).toString();
                                    count1.push(j11)
                                }
                                j11++;
                            }

                            _k = _k + condition.parameterCount;

                            ff.parameterCount.count = count1;
                        }

                        JSONDATA.group.rules[h].otherTransactions.push(ff)
                    }

                }
                if (RHSVALUE123[h] != undefined) {

                    var tempConditionObj = objectFindByKey(Operators, 'code', JSONDATA.group.rules[h].condition)
                    var ff = {}
                    ff.condition = JSON.stringify(tempConditionObj)
                    ff.operatorList = getObjectsVolante(Operators, 'dataType', tempConditionObj.dataType, 'supportedPane', 'CONDITION', 'supportedContext', 'LHS');
                    ff.parameterCount = {};
                    ff.parameterCount.count = [];
                    count1 = [];

                    var dd = objectFindByKey(RHS_field, 'code', RHSVALUE123[h][0].split('$value:')[1])
                    if (dd == null) {
                        ff['Value_' + 0] = RHSVALUE123[h][0].split('$value:')[1];
                        count1.push(0)

                    } else {
                        ff.parameterCount.operatorList = getObjects(RHS_field, 'type', dd.type);
                        ff['Value_' + 0] = (dd.name + ' - ' + dd.type).toString();
                        count1.push(0)

                    }
                    ff.parameterCount.count = count1;
                    JSONDATA.group.rules[h].otherTransactions.push(ff)
                }
                if (RHSconditionCount.length >= 1) {
                    for (i = 0; i < RHSconditionCount.length; i++) {
                        var ff = {}
                        RHSconditionObj = objectFindByKey(Operators, 'code', RHSconditionCount[i]);
                        ff.condition = JSON.stringify(objectFindByKeyRHS(Operators, 'code', RHSconditionCount[i]))
                        ff.operatorList = getObjectsVolante(Operators, 'dataType', RHSconditionObj.dataType, 'supportedPane', 'CONDITION', 'supportedContext', 'RHS');
                        ff.parameterCount = {};
                        ff.parameterCount.count = [];
                        count1 = [];

                        if (RHSconditionObj.parameterCount != undefined) {

                            for (j = 0; j < RHSconditionObj.parameterCount; j++) {
                                var dd = objectFindByKey(RHS_field, 'code', RHSVALUE123[h][j + 1].split('$value:')[1])
                                if (dd == null) {
                                    ff['Value_' + j] = RHSVALUE123[h][j + 1].split('$value:')[1];
                                    count1.push(j)
                                } else {
                                    ff.parameterCount.operatorList = removeDuplicates(getObjects(RHS_field, 'type', dd.type), "implType");
                                    ff['Value_' + j] = (dd.name + ' - ' + dd.type).toString();
                                    count1.push(j)
                                }

                            }

                            ff.parameterCount.count = count1;
                        }

                        JSONDATA.group.rules[h].otherTransactions.push(ff)
                    }
                }



            }
        }
    }


    return JSONDATA;
}

function JSONActionReBuild(JSONDATA, LHS_field, Operators, RHS_field) {
    var LHSVALUE123 = [];
    var RHSVALUE123 = [];
    if (JSONDATA.Data.Action.group.actions != undefined) {
        for (h = 0; h < JSONDATA.Data.Action.group.actions.length; h++) {
            JSONDATA.Data.Action.group.actions[h].field = JSON.stringify(objectFindByKey(LHS_field, 'code', JSONDATA.Data.Action.group.actions[h].lhsmetadata.substring(1, JSONDATA.Data.Action.group.actions[h].lhsmetadata.length - 1).split('}.{')[0]))
            JSONDATA.Data.Action.group.actions[h].parsedField = objectFindByKey(LHS_field, 'code', JSONDATA.Data.Action.group.actions[h].lhsmetadata.substring(1, JSONDATA.Data.Action.group.actions[h].lhsmetadata.length - 1).split('}.{')[0])
            JSONDATA.Data.Action.group.actions[h].category = '';
            JSONDATA.Data.Action.group.actions[h].data = '';
            JSONDATA.Data.Action.group.actions[h].otherTransactions = [];
            var conditionCount = '';
            if (JSONDATA.Data.Action.group.actions[h].lhsmetadata != undefined) {
                conditionCount = JSONDATA.Data.Action.group.actions[h].lhsmetadata.substring(1, JSONDATA.Data.Action.group.actions[h].lhsmetadata.length - 1).split('}.{');
            }
            var RHSconditionCount = '';

            if (JSONDATA.Data.Action.group.actions[h].rhsmetadata != undefined) {
                RHSconditionCount = JSONDATA.Data.Action.group.actions[h].rhsmetadata.substring(1, JSONDATA.Data.Action.group.actions[h].rhsmetadata.length - 1).split('}.{');
            }
            //LHSVALUE123[h]
            var values = '';
            if (JSONDATA.Data.Action.group.actions[h].lhsvalue != undefined) {
                LHSVALUE123[h] = (JSONDATA.Data.Action.group.actions[h].lhsvalue).substring(0, JSONDATA.Data.Action.group.actions[h].lhsvalue.length - 1).split(';,');
            }
            if (JSONDATA.Data.Action.group.actions[h].rhsvalue != undefined) {
                RHSVALUE123[h] = (JSONDATA.Data.Action.group.actions[h].rhsvalue).substring(0, JSONDATA.Data.Action.group.actions[h].rhsvalue.length - 1).split(';,');
            }
            if (conditionCount.length > 1) {
                for (i = 1; i < conditionCount.length; i++) {
                    var ff = {}
                    var condition = ''
                    if (i == 0) {
                        condition = objectFindByKey(LHS_field, 'code', conditionCount[i])
                    } else {
                        condition = objectFindByKey(Operators, 'code', conditionCount[i])
                        if (condition == null) {
                            condition = objectFindByKey(LHS_field, 'code', conditionCount[i])
                        }
                    }
                    ff.condition = JSON.stringify(condition)
                    ff.operatorList = getObjectsVolante(Operators, 'dataType', condition.dataType, 'supportedPane', 'ACTION', 'supportedContext', 'LHS'); //getObjects(Operators, 'type', "Boolean");
                    ff.parameterCount = {};
                    ff.parameterCount.count = [];
                    count1 = [];
                    if (condition.parameterCount != undefined) {

                        for (j = 0; j < condition.parameterCount; j++) {
                            var dd = objectFindByKey(RHS_field, 'code', LHSVALUE123[h][j].split('$value:')[1])
                            if (dd == null) {
                                ff['Value_' + j] = LHSVALUE123[h][j].split('$value:')[1];
                                count1.push(j)
                            } else {
                                ff.parameterCount.operatorList = getObjects(RHS_field, 'type', dd.type);
                                ff['Value_' + j] = (dd.name + ' - ' + dd.type).toString();
                                count1.push(j)
                            }

                        }
                        ff.parameterCount.count = count1;
                    }

                    JSONDATA.Data.Action.group.actions[h].otherTransactions.push(ff)
                }

            }
            if (RHSVALUE123[0] != undefined) {
                var tempActionObj = objectFindByKey(Operators, 'code', JSONDATA.Data.Action.group.actions[h].condition);
                var ff = {}
                ff.condition = JSON.stringify(objectFindByKey(Operators, 'code', JSONDATA.Data.Action.group.actions[h].condition))
                ff.operatorList = getObjectsVolante(Operators, 'dataType', tempActionObj.dataType, 'supportedPane', 'ACTION', 'supportedContext', 'LHS'); //Operators;
                ff.parameterCount = {};
                ff.parameterCount.count = [];
                count1 = [];
                var dd = objectFindByKey(RHS_field, 'code', RHSVALUE123[h][0].split('$value:')[1])
                if (dd == null) {
                    ff['Value_' + 0] = RHSVALUE123[h][0].split('$value:')[1];
                    count1.push(0)

                } else {
                    ff.parameterCount.operatorList = getObjects(RHS_field, 'type', dd.type);
                    ff['Value_' + 0] = (dd.name + ' - ' + dd.type).toString();
                    count1.push(0)

                }
                ff.parameterCount.count = count1;
                JSONDATA.Data.Action.group.actions[h].otherTransactions.push(ff)
            }
            if (RHSconditionCount.length > 0) {
                for (i = 0; i < RHSconditionCount.length; i++) {
                    var ff = {}
                    RHSconditionObj = objectFindByKey(Operators, 'code', RHSconditionCount[i]);
                    ff.condition = JSON.stringify(objectFindByKey(Operators, 'code', RHSconditionCount[i]))
                    ff.operatorList = getObjectsVolante(Operators, 'dataType', RHSconditionObj.dataType, 'supportedPane', 'ACTION', 'supportedContext', 'RHS');
                    ff.parameterCount = {};
                    ff.parameterCount.count = [];
                    count1 = [];

                    if (RHSconditionObj.parameterCount != undefined) {

                        for (j = 0; j < RHSconditionObj.parameterCount; j++) {
                            var dd = objectFindByKey(RHS_field, 'code', RHSVALUE123[h][j + 1].split('$value:')[1])
                            if (dd == null) {
                                ff['Value_' + j] = RHSVALUE123[h][j + 1].split('$value:')[1];
                                count1.push(j)
                            } else {
                                ff.parameterCount.operatorList = removeDuplicates(getObjects(RHS_field, 'type', dd.type), "implType");
                                ff['Value_' + j] = (dd.name + ' - ' + dd.type).toString();
                                count1.push(j)
                            }

                        }

                        ff.parameterCount.count = count1;
                    }

                    JSONDATA.Data.Action.group.actions[h].otherTransactions.push(ff)
                }
            }

        }
    }
    return JSONDATA;
}


angular.module('VolpayApp').controller('QueryBuilderCtrl_3', ['$scope', '$state', '$rootScope', '$stateParams', 'Scopes3', '$http', '$filter', 'GlobalService', function($scope, $state, $rootScope, $stateParams, Scopes3, $http, $filter, GlobalService) {

    $scope.madeChanges = $rootScope.dataModified;

    $rootScope.params = $stateParams;
    Scopes3.params = $stateParams;
    Scopes3.store('QueryBuilderCtrl_3', $scope);

    var editRule = JSON.parse(hexToString(GlobalService.editRuleBuilder));
    var LHS_field = JSON.parse(hexToString(sessionStorage.RULE_LHS_field))
    var Operators = JSON.parse(hexToString(sessionStorage.BROPERATORS))
    var RHS_field = JSON.parse(hexToString(sessionStorage.ACTION_LHS_field))

    var data = JSONReBuild(editRule.Data.Rule, LHS_field, Operators, RHS_field);

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
                    group.rules[i].data11 = group.rules[i].data1.replace('$url', group.rules[i].data1_Value);
                    group.rules[i].data11 = group.rules[i].data11.replace('$value', group.rules[i].data1_Value);
                    group.rules[i].data = group.rules[i].data11;
                }
                if (group.rules[i].data2_Value != undefined) {
                    group.rules[i].data12 = group.rules[i].data2.replace('$url', group.rules[i].data2_Value);
                    group.rules[i].data12 = group.rules[i].data2.replace('$value', group.rules[i].data2_Value);
                    group.rules[i].data = group.rules[i].data11 + '.' + group.rules[i].data12;
                }
                str += group.rules[i].group ? computed(group.rules[i].group) : group.rules[i].selectedChapter.name + "." + group.rules[i].data;
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
    $scope.filter = data;
    $scope.$watch('filter', function(newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output1 = newValue;
    }, true);

}]);

angular.module('VolpayApp').controller('ActionQueryBuilderCtrl_3', ['$scope', '$rootScope', '$state', '$http', '$location', 'Scopes3', '$stateParams', 'GlobalService', '$filter', function ($scope, $rootScope, $state, $http, $location, Scopes3, $stateParams, GlobalService, $filter) {

    var editRule = JSON.parse(hexToString(GlobalService.editRuleBuilder));
    var LHS_field = JSON.parse(hexToString(sessionStorage.RULE_LHS_field))
    var Operators = JSON.parse(hexToString(sessionStorage.BROPERATORS))
    var ACTION_LHS_field = JSON.parse(hexToString(sessionStorage.ACTION_LHS_field))

    Scopes3.store('ActionQueryBuilderCtrl_3', $scope);
    var data1 = {
        "group": {
            "operator": "AND",
            "actions": []
        }
    };
    var editRule = JSON.parse(hexToString(GlobalService.editRuleBuilder));
    for (i = 0; i < editRule.Data.Action.group.actions.length; i++) {
        data1.group.actions.push(editRule.Data.Action.group.actions[i]);
    }

    var data = JSONActionReBuild(editRule, ACTION_LHS_field, Operators, LHS_field).Data.Action;

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
            str += group.actions[i].group ? computed(group.actions[i].group) : group.actions[i].selectedChapter.name + " = " + group.actions[i].data;
        }
        return str + ")";
    }

    $scope.json = null;

    $scope.filter = data;

    $scope.$watch('filter', function(newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output1 = $scope.json;
    }, true);

    sessionStorage.newRule = false;

    $scope.confirmRule = function() {
        sessionStorage.newRule = true;
        //$rootScope.params.input.params.Operation = 'Edit';
        $rootScope.params.input.params.fieldData["Rule"] = sessionStorage.buildedRule;
        $rootScope.params.input.params.fieldData["RuleStructure"] = sessionStorage.ruleJSONBinary;
        $rootScope.params.input.params.frommodule = "ruleedit";

        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.params.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.params.Operation).toLowerCase();
        params.input = $rootScope.params.input.params;
        $state.go('app.operation', params);
    }

    var AllOperators = JSON.parse(hexToString(sessionStorage.BROPERATORS))

    $scope.cancelpressed = function() {
        delete sessionStorage.newEditRule;
        delete sessionStorage.newRuleFormData;
        delete sessionStorage.newRule;
        $rootScope.params.input.params.frommodule = "ruleedit";

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

            if (Obj.group.actions[h].lhsvalue != '') {
                Obj.group.actions[h].lhsvalue = JSON.parse(JSON.stringify(Obj.group.actions[h].lhsvalue).replace(/;;/g, ';'))
            }
            if (Obj.group.actions[h].rhsvalue != '') {
                Obj.group.actions[h].rhsvalue = JSON.parse(JSON.stringify(Obj.group.actions[h].rhsvalue).replace(/;;/g, ';'))
            }
            if (Obj.group.actions[h].lhsmetadata != '') {
                Obj.group.actions[h].lhsmetadata = JSON.parse(JSON.stringify(Obj.group.actions[h].lhsmetadata).replace(/},{/g, '}.{'))
            }
            if (Obj.group.actions[h].rhsmetadata != '') {
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
                    if (intObj.group.actions[h].otherTransactions[i].parameterCount != '') {
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

            }

            intObj.group.actions[h].lhsmetadata = intObj.group.actions[h].lhsmetadata1.toString()
            intObj.group.actions[h].lhsvalue = intObj.group.actions[h].lhsvalue1.toString()
            intObj.group.actions[h].rhsmetadata = intObj.group.actions[h].rhsmetadata1.toString()
            intObj.group.actions[h].rhsvalue = intObj.group.actions[h].rhsvalue1.toString()
        }
        return intObj;
    }

    $scope.buttonClick = function() {
        var ruletoBlob = angular.copy(Scopes3.get('QueryBuilderCtrl_3').output1);
        var ruletoBlob1 = angular.copy(Scopes3.get('QueryBuilderCtrl_3').output1);
        var actiontoBlob = angular.copy(Scopes3.get('ActionQueryBuilderCtrl_3').output1);


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

angular.module('VolpayApp').directive('actionBuilder3', ['$compile', '$http', '$timeout', '$stateParams', function($compile, $http, $timeout, $stateParams) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/actionBuilderDirective3.html',
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
                    scope.UUID = Math.floor((Math.random() * 1000) + 1)
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
                            scope.removeAction(index1)
                        }
                    }
                }
            }
        }
    }
}]);

angular.module('VolpayApp').directive('queryBuilder3', ['$compile', '$http', '$timeout', '$stateParams', function($compile, $http, $timeout, $stateParams) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective3.html',
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
                }).catch(function onError(response) {
                    // Handle error
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                });

                scope.addCondition = function() {
                    if (scope.group.rules == undefined) {
                        scope.group.rules = [];
                    }
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

                var backupselectOperatortype = ''
                scope.onselectOperator = function(rule, rule_condition, index, flag, _Arr) {

                    scope.OperatorSelectedFlag = false;
                    scope.UUID = Math.floor((Math.random() * 1000) + 1)
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

                directive || (directive = $compile(content));
                element.append(directive(scope, function($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);

angular.module('VolpayApp').factory('Scopes3', function($rootScope) {
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