angular.module('VolpayApp').controller('bulkoverride', function($scope, $http, $location, $translate, $rootScope, $state, $filter, $stateParams, bankData, LogoutService, $timeout, errorservice) {

    $scope.stateparams = $stateParams.input;

    function iterateSubObj(argu, group, flag) {
        $scope.section = {};

        $scope.section = {

            'name': group.name,
            'type': group.type,
            'showsectionheader': group.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': group.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': group.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': group.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': group.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': group.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': []
        }

        var iArr = [];

        for (var i in argu) {

            if (argu[i].type != 'Section') {
                $scope.section.subArr.push($scope.objectIttration(argu[i]))
            } else {
                $scope.section = subsectionIterate($scope.section, argu[i], argu[i].fieldGroup1.webformsectiongroup.fields.field)
            }

            $scope.iteratedObj = {}
        }
        return $scope.section;
    }

    function iterateSubArr(argu, group, flag) {

        $scope.section = {};

        $scope.section = {
            'name': group.name,
            'type': group.type,
            'showsectionheader': group.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': group.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': group.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': group.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': group.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': group.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': []
        }

        var iArr = [];
        for (var i in argu) {

            if (argu[i].type != 'Section') {

                iArr.push($scope.objectIttration(argu[i]))
            } else {
                $scope.section.subArr.push({ 'fields': iArr });
                subsectionIterateArr($scope.section, argu[i], argu[i].fieldGroup1.webformsectiongroup.fields.field)
            }

            $scope.iteratedObj = {}
        }

        for (var x in $scope.fieldDetails, $scope.globalObj.CData[$scope.fieldDetails.subSection[0].name][group.name]) {
            $scope.section.subArr.push({ 'fields': iArr });
        }

        iArr = [];
        return $scope.section;
    }

    function subsectionIterate(obj, arg1, arg2) {
        $scope.subArr = {
            'name': arg1.name,
            'type': arg1.type,
            'showsectionheader': arg1.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': arg1.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': arg1.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': arg1.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': arg1.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': arg1.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': []
        };


        for (var i in arg2) {
            $scope.subArr.subArr.push($scope.objectIttration(arg2[i]))
        }

        obj.subArr.push($scope.subArr)

        return obj;
    }

    function subsectionIterateArr(obj, arg1, arg2) {
        $scope.subArr = {
            'name': arg1.name,
            'type': arg1.type,
            'showsectionheader': arg1.fieldGroup1.webformsectiongroup.showsectionheader,
            'sectionheader': arg1.fieldGroup1.webformsectiongroup.sectionheader,
            'indentsubfields': arg1.fieldGroup1.webformsectiongroup.indentsubfields,
            'customsectionlayout': arg1.fieldGroup1.webformsectiongroup.customsectionlayout,
            'minoccurs': arg1.fieldGroup1.webformsectiongroup.minoccurs,
            'maxoccurs': arg1.fieldGroup1.webformsectiongroup.maxoccurs,
            'subArr': []
        };

        var iArr1 = [];
        for (var i in arg2) {
            iArr1.push($scope.objectIttration(arg2[i]))
            $scope.iteratedObj = {}
        }

        $scope.subArr.subArr = iArr1
        iArr1 = [];
        obj.subArr[0].fields.push($scope.subArr);
        obj.subArr.splice(0, 1)
        return obj;
    }

    function webformIttration(argu) {

        $scope.iteratedObj = {};
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        var obtainedFields = argu.webformuiformat.fields.field;
        $scope.obtainThisKeys = ['name', 'type', 'columnspan', 'rowspan', 'enabled', 'label', 'labelposition', 'newrow', 'notnull', 'visible', 'width', 'renderer', 'customsectionlayout', 'indentsubfields', 'maxoccurs', 'minoccurs', 'sectionheader', 'showsectionheader', 'dateformat', 'property', 'choiceOptions']
        var k = '';
        var j = '';

        for (j in obtainedFields) {

            if ('webformfieldgroup' in obtainedFields[j].fieldGroup1) {
                $scope.iteratedObj = {};
                $scope.fieldDetails.section.push($scope.objectIttration(obtainedFields[j]))

            } else {
                if (obtainedFields[j].type != 'Section') {

                    $scope.fieldDetails.section.push($scope.objectIttration(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field))
                } else if (obtainedFields[j].type == 'Section') {

                    $scope.iteratedObj['sectionlabel'] = obtainedFields[j].name;
                    $scope.fieldDetails.subSection.push({
                        'name': ('name' in obtainedFields[j] ? obtainedFields[j].name : ''),
                        'type': ('type' in obtainedFields[j] ? obtainedFields[j].type : ''),
                        'showsectionheader': ('showsectionheader' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.showsectionheader : ''),
                        'sectionheader': ('sectionheader' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.sectionheader : ''),
                        'indentsubfields': ('indentsubfields' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.indentsubfields : ''),
                        'customsectionlayout': ('customsectionlayout' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.customsectionlayout : ''),
                        'minoccurs': ('minoccurs' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.minoccurs : ''),
                        'maxoccurs': ('maxoccurs' in obtainedFields[j].fieldGroup1.webformsectiongroup ? obtainedFields[j].fieldGroup1.webformsectiongroup.maxoccurs : ''),
                        'subArr': []
                    })

                    for (k in obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field) {
                        if (obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].type == "Section") {
                            if (obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.maxoccurs == -1) {
                                $scope.fieldDetails.subSection[j]['subArr'].push(iterateSubArr(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k], false))
                            } else {
                                $scope.fieldDetails.subSection[j]['subArr'].push(iterateSubObj(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k], false))
                            }
                        }

                        for (l in Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)) {
                            if (($scope.obtainThisKeys).indexOf(Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]) != -1) {

                                $scope.iteratedObj[Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]] = Object.values(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]
                            }
                        }
                        $scope.iteratedObj = {}
                    }
                }

            }
        }

        for (var x in $scope.fieldDetails.section) {
            if ('Choice' in $scope.fieldDetails.section[x].renderer) {
                if ($scope.fieldDetails.section[x].renderer.Choice.choiceOptions[0].actualvalue == 'REST') {
                    var prop = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value


                    if ($scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value.indexOf('{') != -1) {
                        $scope.restPath = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value.split('{')[0] + $scope[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property[0].value];
                    } else {
                        $scope.restPath = $scope.fieldDetails.section[x].renderer.Choice.customattributes.property[$scope.fieldDetails.section[x].renderer.Choice.customattributes.property.length - 1].value
                    }
                    getChoiceOption('GET', $scope.restPath, x)
                }
            }
        }
        return $scope.fieldDetails
    }


    function getChoiceOption(_method, url, x) {
        return $http({
            method: _method,
            url: BASEURL + '/rest/v2/' + url
        }).then(function(response) {

            $scope.fieldDetails.section[x].renderer.Choice.choiceOptions = response.data;
            return response.data;
        }, function(error) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
        })
    }

    $scope.objectIttration = function(argu, k, l) {

        for (var key in argu) {

            if (argu.hasOwnProperty(key)) {
                if (typeof(argu[key]) == 'object') {

                    $scope.objectIttration(argu[key], k, l);
                    if (($scope.obtainThisKeys).indexOf(key) != -1 && !(key in $scope.iteratedObj)) {
                        $scope.iteratedObj[key] = argu[key]
                    }
                } else {
                    if (($scope.obtainThisKeys).indexOf(key) != -1 && !(key in $scope.iteratedObj)) {
                        $scope.iteratedObj[key] = argu[key]
                    }
                }
            }
        }
        return $scope.iteratedObj
    }

    $scope.fieldData = {};

    $scope.pIds = $stateParams.input.payments;


    $scope.callInterfaceOverride = function() {

        $scope.iteratedObj = {};
        $scope.fieldDetails = {
            section: [],
            subSection: []
        };
        $scope.fieldData = {};

        $scope.paymentsArr = '';

        for (var i in $scope.pIds) {
            $scope.paymentsArr = $scope.paymentsArr + ((i != 0) ? "," : '') + $scope.pIds[i];
            //$scope.paymentsArr.push({'PaymentID':$stateParams.input.payments[i]}) 
        }

        $http.post(BASEURL + '/rest' + $scope.stateparams.url, { PaymentID: $scope.paymentsArr }).then(function(val) {

            $scope.allResponse = val;
            $scope.globalObj = angular.copy(val.data);
            $scope.globalObj.CMetaInfo = JSON.parse(atob($scope.globalObj.metaInfo)).Data;
            $scope.globalObj.CData = JSON.parse(atob($scope.globalObj.data));

            $timeout(function() {
                $scope.fieldData = $scope.globalObj.CData;
            }, 100)
            $scope.backupData = angular.copy($scope.globalObj.CData)

            $scope.fieldDetails = [];
            $scope.iteratedObj = {}

            webformIttration($scope.globalObj.CMetaInfo)

        }, function(data) {
            $scope.alerts = [{
                type: 'danger',
                msg: data.data.error.message
            }];
            errorservice.ErrorMsgFunction(data, $scope, $http, data.status)

        })
    }

    $scope.callInterfaceOverride()

    $scope.iteratedFields = [];

    function constructObj(inFields) {

        for (var i in inFields) {
            if (inFields[i].type != 'Section') {} else if (inFields[i].type == 'Section') {

                $scope.iteratedFields.push({
                    'name': inFields[i].name,
                    'type': inFields[i].type,
                    'showsectionheader': inFields[i].fieldGroup1.webformsectiongroup.showsectionheader,
                    'sectionheader': inFields[i].fieldGroup1.webformsectiongroup.sectionheader,
                    'indentsubfields': inFields[i].fieldGroup1.webformsectiongroup.indentsubfields,
                    'customsectionlayout': inFields[i].fieldGroup1.webformsectiongroup.customsectionlayout,
                    'minoccurs': inFields[i].fieldGroup1.webformsectiongroup.minoccurs,
                    'maxoccurs': inFields[i].fieldGroup1.webformsectiongroup.maxoccurs,
                    'group': []

                })
                $scope.TempVal = [];


                for (var j in inFields[i].fieldGroup1.webformsectiongroup.fields.field) {
                    if (inFields[i].fieldGroup1.webformsectiongroup.fields.field[j].type == 'Section') {

                        constructObj(inFields[i].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field)

                    }
                }
                $scope.iteratedObj = {}
            }
        }
    }

    $scope.getTextAreaRows = function(val1) {
        return Math.ceil(val1);
    }

    $scope.cleantheinputdata = function(newData) {

        $.each(newData, function(key, value) {
            delete newData.$$hashkey;

            if ($.isPlainObject(value)) {
                var isEmptyObj = $scope.cleantheinputdata(value)
                if ($.isEmptyObject(isEmptyObj)) {
                    delete newData[key]
                }
            } else if (Array.isArray(value)) {
                $.each(value, function(k, v) {
                    var isEmptyObj = $scope.cleantheinputdata(v)
                })
            } else if (value === "" || value === undefined || value === null) {
                delete newData[key]
            }
        })

        return newData
    }


    $scope.formSubmitted = false;
    $scope.interfaceSubmit = function(val) {
        $scope.formSubmitted = true;
        val = $scope.cleantheinputdata(val)

        $scope.paymentsId = '';
        for (var i in $scope.pIds) {
            $scope.paymentsId = $scope.paymentsId + ((i != 0) ? "," : '') + $scope.pIds[i];
        }


        $scope.responseObj = {
            "paymentID": $scope.paymentsId,
            "domainInWebFormName": $scope.globalObj.metaInfoName,
            "DomainIn": btoa(JSON.stringify(val))
        }

        $rootScope.bulkOverride = '';
        $http.post(BASEURL + RESTCALL.BulkOverridResponse, $scope.responseObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $rootScope.bulkOverride = data.responseMessage;
            $state.go('app.payments')
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

    var fArr = [];
    var prevArr = [];
    var prevObj = {};

    $scope.diabledFields = function(val, field) {
        for (var k in prevObj[field.name]) {
            $(sanitize('[name=' + prevObj[field.name][k] + ']')).removeAttr('disabled', 'disabled')
        }

        prevObj[field.name] = [];

        for (var i in field.property) {
            if (val == field.property[i].name) {
                fArr = field.property[i].value.split(',');
                for (var j in fArr) {
                    $(sanitize('[name=' + fArr[j] + ']')).attr('disabled', 'disabled')
                    $scope.fieldData[fArr[j]] = '';
                }
                prevObj[field.name] = fArr;
            }
        }
    }
    $scope.resetInterface = function() {
        $state.go('app.payments')
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }

        if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $(e.currentTarget).data("DateTimePicker").hide();
        }
    }
    $scope.checkType = function(eve, type) {

        var compareVal = '';
        var regex = {
            'Integer': /^[0-9]$/,
            'BigDecimal': /^[0-9.]$/,
            'Double': /^[0-9.]$/,
            'String': /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i
        }
        for (var keys in regex) {
            if (type === keys) {
                compareVal = regex[type]
            }
        }

        if (compareVal.test(eve.key) || eve.keyCode == 16 || eve.keyCode == 36 || eve.keyCode == 46 || eve.keyCode == 8 || eve.keyCode == 9 || eve.keyCode == 35 || eve.keyCode == 37 || eve.keyCode == 39 || eve.keyCode == 38 || eve.keyCode == 40) {
            return true
        } else {
            eve.preventDefault();
        }
    }


})