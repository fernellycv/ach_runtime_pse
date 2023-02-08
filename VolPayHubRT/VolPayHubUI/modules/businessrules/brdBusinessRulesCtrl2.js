angular.module('VolpayApp').controller('brdBusinessRulesCtrl2', function($scope, $http, $state, bankData, GlobalService, $timeout) {

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

angular.module('VolpayApp').controller('QueryBuilderCtrl', ['$scope', 'Scopes', '$http', function($scope, Scopes, $http) {

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


            //if(group.rules[i].selectedChapter!=undefined){
            if (group.rules[i].condition == 'formula') {
                str += group.rules[i].group ?
                    computed(group.rules[i].group) :
                    group.rules[i].selectedChapter.Name + "." + group.rules[i].data;
            } else {
                str += (group.rules[i].group) ? (computed(group.rules[i].group)) : ((group.rules[i].selectedChapter) ? (group.rules[i].selectedChapter.Name + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data) : '');

                //group.rules[i].selectedChapter.Name + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
            }
            //}
        }

        return str + ")";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function(newValue) {

        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output = computed(newValue.group);
        $scope.output1 = newValue;
    }, true);

}]);

angular.module('VolpayApp').controller('ActionQueryBuilderCtrl', ['$scope', '$http', '$location', 'Scopes', function($scope, $http, $location, Scopes) {
    Scopes.store('ActionQueryBuilderCtrl', $scope);
    var data = '{"group": {"operator": "AND","actions": []}}';

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
        if (!group)
            return "";
        for (var str = "(", i = 0; i < group.actions.length; i++) {
            i > 0 && (str += " ; ");
            str += group.actions[i].group ?
                computed(group.actions[i].group) :
                group.actions[i].field + " " + htmlEntities(group.actions[i].condition) + " " + group.actions[i].data;
        }

        return str + ")";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function(newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);

        $scope.output = computed(newValue.group);

        //$scope.getActionType($scope.json)

        $scope.output1 = $scope.json;
    }, true);

    sessionStorage.newRule = false;
    $scope.confirmRule = function() {

        //$location.path('app/businessrules');
        sessionStorage.newRule = true;
        $location.path('app/businessrulesdetails')

        //window.location.href = '#/app/businessrules'
    }

    $scope.cancelpressed = function() {
        delete sessionStorage.newEditRule;
        delete sessionStorage.newRuleFormData;
        delete sessionStorage.newRule;
        delete sessionStorage.ruleJSONBinary;
        delete sessionStorage.buildedRule;
        $location.path('app/businessrulesdetails')
            //window.location.href = '#/app/businessrulesdetails'
    }

    $scope.buttonClick = function() {

        function ruleGenerator(AllRuleValues) {
            $scope.ggg = [];

            $scope.ggg.push(ruleArray(AllRuleValues))

            for (var k = 0; k < AllRuleValues.length; k++) {

                if (ruleArray(AllRuleValues[k]).length > 0) {
                    $scope.ggg.push(ruleArray(AllRuleValues[k]))
                }
                if (AllRuleValues[k].group != undefined) {
                    if (ruleArray(AllRuleValues[k].group).length > 0) {
                        $scope.ggg.push(ruleArray(AllRuleValues[k].group))
                    }
                }

            }

            return $scope.ggg;
        }

        function ruleArray(ruleArrayValue) {
            $scope.finalRules = [];
            for (var k = 0; k < ruleArrayValue.length; k++) {
                var rules111 = ruleArrayValue[k];
                $scope.finalRules.push({
                    "category": rules111.category.Category,
                    "field": rules111.field.Name,
                    "type": rules111.field.Type,
                    "condition": rules111.condition,
                    "data": rules111.data
                })
            }
            return $scope.finalRules;
        }

        function unwantedObj(rObj) {
            for (var i = 0; i < rObj.group.rules.length; i++) {
                if (rObj.group.rules[i].category != undefined) {
                    delete rObj.group.rules[i].category.Fields;
                }
                delete rObj.group.rules[i].selectedChapters;
                delete rObj.group.rules[i].selectedChapter;
                delete rObj.group.rules[i].selectedTitles;
                if (rObj.group.rules[i].group != undefined) {
                    unwantedObj(rObj.group.rules[i])
                }
            }

            return rObj;
        }

        function getCategory(Obj) {
            return Obj.Category;
        }

        function getfield(Obj1) {
            return Obj1.Name;
        }

        function getfieldType(Obj11) {
            return Obj11.Type;
        }

        function convert(val1) {
            output = {};
            output.value = "";
            for (i = 0; i < val1.length; i++) {
                output.value += val1[i].charCodeAt(0).toString(2) + " ";
            }
            return output.value;
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

        var ActionVariable1 = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleVariables, 'Category', 'Action');

        $scope.fields1 = ActionVariable1.Fields;

        function getActionType(val1) {

            //scope.type = objectFindByKey(scope.fields, 'Name', val1).Type;
            $scope.jj1 = JSON.parse(val1);
            for (var i1 = 0; i1 < $scope.jj1.group.actions.length; i1++) {

                $scope.jj1.group.actions[i1].type = objectFindByKey($scope.fields1, 'Name', $scope.jj1.group.actions[i1].field).Type;
                //$scope.jj1.actions[i1].type="String";
                delete $scope.jj1.group.actions[i1].$$hashKey;
            }
            return $scope.jj1;
        }

        function currectStru(ruleObj) {
            for (var i1 = 0; i1 < ruleObj.group.rules.length; i1++) {
                if (ruleObj.group.rules[i1].selectedChapter != undefined) {
                    ruleObj.group.rules[i1].field = ruleObj.group.rules[i1].selectedChapter.Name
                    ruleObj.group.rules[i1].type = ruleObj.group.rules[i1].selectedChapter.Type
                    ruleObj.group.rules[i1].category = ruleObj.group.rules[i1].selectedChapter.category
                    delete ruleObj.group.rules[i1].selectedChapters;
                }

                if (ruleObj.group.rules[i1].group != undefined) {
                    currectStru(ruleObj.group.rules[i1])
                }
            }
            return ruleObj;
        }

        var ruletoBlob = angular.copy(Scopes.get('QueryBuilderCtrl').output1);
        var ruletoBlob1 = angular.copy(Scopes.get('QueryBuilderCtrl').output1);
        var actiontoBlob = angular.copy(Scopes.get('ActionQueryBuilderCtrl').output1);

        var ToBLOBData = {
            Rule: "",
            Action: ""
        };
        ToBLOBData.Rule = currectStru(ruletoBlob1);
        ToBLOBData.Action = getActionType(actiontoBlob);
        //var ToBLOBData1 = JSON.stringify(ToBLOBData).replace(/(")/gm, "'");
        var ToBLOBData1 = JSON.stringify(ToBLOBData);

        sessionStorage.ruleJSONBinary = stringToHex(ToBLOBData1);

        $scope.ruleArrayFinal = JSON.stringify(unwantedObj(currectStru(ruletoBlob)), null, 2);
        $scope.ActionArrayFinal = JSON.stringify(getActionType(Scopes.get('ActionQueryBuilderCtrl').output1), null, 2)

        $scope.FinalJSON = '{\n "Rule":' + $scope.ruleArrayFinal + ',\n "Action":' + $scope.ActionArrayFinal + ' \n}';

        var someText = $scope.FinalJSON.replace(/(\r\n|\n|\r)/gm, "");

        var toBlob = JSON.stringify({
            "Rule": JSON.stringify(Scopes.get('QueryBuilderCtrl').output1),
            "Action": (Scopes.get('ActionQueryBuilderCtrl').output1).replace(/(\r\n|\n|\r)/gm, "")
        });

        function hex2a(hex) {
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                var v = parseInt(hex.substr(i, 2), 16);
                if (v)
                    str += String.fromCharCode(v);
            }
            return str;
        }


        var b64Rule = btoa($scope.FinalJSON);


        _url1 = BASEURL + RESTCALL.BankBusinessRuleREST + 'rulebuilder';

        $http({
            method: "POST",
            url: _url1,
            data: $.param({
                "jsonData": $scope.FinalJSON
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
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

        });
    };
}]);

angular.module('VolpayApp').directive('actionBuilder', ['$compile', '$http', function($compile, $http) {
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
                var ActionVariable = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleVariables, 'Category', 'Action');
                scope.fields = ActionVariable.Fields;
                scope.conditions = [{
                    name: '='
                }, ];

                scope.addAction = function() {
                    scope.group.actions.push({
                        condition: '=',
                        field: '',
                        data: '',
                        type: 'String'
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

angular.module('VolpayApp').directive('queryBuilder', ['$compile', '$http', function($compile, $http) {
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
                scope.addCondition = function() {
                    scope.group.rules.push({
                        condition: '==',
                        category: '',
                        field: '',
                        data: '',
                        type: ''
                    });
                };

                var json1 = JSON.parse(atob(sessionStorage.RuleBaseObjs));

                scope.operator = json1.RuleOperators;

                function getRuleConditions(RVArr) {
                    scope.options = [];
                    scope.optionsRHS = [];
                    for (var i = 0; i < RVArr.length; i++) {
                        scope.rules11.push({
                            "Category": RVArr[i].Category
                        })
                        scope.options.push({
                            "Category": RVArr[i].Category,
                            "Fields": []
                        })
                        for (var j = 0; j < RVArr[i].Fields.length; j++) {
                            RVArr[i].Fields[j].category = RVArr[i].Category;
                            scope.options[i].Fields.push(RVArr[i].Fields[j])
                            scope.optionsRHS.push(RVArr[i].Fields[j])
                        }
                    }
                }

                var ruleVariables11 = json1.RuleVariables;
                scope.rules = [];

                for (var i = 0; i < ruleVariables11.length; i++) {

                    if (ruleVariables11[i].Category != 'Action') {
                        scope.rules.push(ruleVariables11[i]);
                    }
                }

                getRuleConditions(scope.rules)

                function arrayTrim(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        arr[i] = arr[i].trim();
                    }
                    return arr
                }

                scope.onBookChange = function(b, book) {

                    b.selectedChapters = objectFindByKey(json1.RuleVariables, 'Category', book).Fields;
                    //b.selectedChapters = book.Fields;
                }
                scope.inputTypeDate = false;

                scope.onChapterChange = function(b, cha, index) {

                    b.selectedChapter = JSON.parse(cha);
                    b.selectedChapters = objectFindByKey(json1.RuleVariables, 'Category', b.selectedChapter.category).Fields;

                    b.selectedTitles = arrayTrim(getObjects(scope.operator, 'Type', JSON.parse(cha).Type)[0].Operations.split(","));

                    if ((b.selectedChapter.Type == 'Date')) {
                        setTimeout(function() {
                            /*$('.DatePicker').datetimepicker({
                            	format : 'YYYY-MM-DD',
                            	autoclose : true,
                            	pickTime : false
                            })*/
                            $('.DatePicker').datepicker({
                                format: 'yyyy-mm-dd',
                                autoclose: true
                            });

                            $('.input-group-addon').on('click focus', function(e) {
                                $(this).prev().focus().click()
                            });

                        }, 200)
                    }

                    if (b.selectedChapter.Type == 'DateTime') {

                        setTimeout(function() {
                            $('.DateTimePicker').datepicker({
                                format: 'yyyy-mm-dd' + 'T00:00:00',
                                autoclose: true
                            });

                            $('.input-group-addon').on('click focus', function(e) {

                                $(this).prev().focus().click()
                            });

                        }, 200)
                    }
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