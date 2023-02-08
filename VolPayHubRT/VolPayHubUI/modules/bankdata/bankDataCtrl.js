angular.module('VolpayApp').controller('bankDataCtrl', function($scope, $state, $timeout, $stateParams, $filter, $http, $translate, bankData, GlobalService, EntityLockService, LogoutService, $rootScope, errorservice, datepickerFaIcons, GetPermissions, dataFormatService) {
    $scope.newPermission = GetPermissions($stateParams.input.gotoPage.Name);
    $scope.masking = true;
    $scope.PageName = $stateParams.input.gotoPage.Name;
    
    EntityLockService.flushEntityLocks();
    $scope.downloadOptions = "Current"

    /* for Crud operation*/
    $scope.ResourcePermissionCall = function() {
        $scope.permission = {
            'C': false,
            'D': false,
            'R': false,
            'U': false,
            'ReActivate': false
        }
        crudRequest("POST", "roles/resourcepermission", {
            "RoleId": sessionStorage.ROLE_ID,
            "ResourceName": $stateParams.input.gotoPage.Name
        }).then(function(response) {
            if (response.Status == "Success") {

                for (k in response.data.data) {
                    for (j in Object.keys($scope.permission)) {
                        if (Object.keys($scope.permission)[j] == response.data.data[k].ResourcePermission) {
                            $scope.permission[Object.keys($scope.permission)[j]] = true;
                        }
                    }
                }
            }
        })

    }
    $scope.ResourcePermissionCall();

    $scope.isLogCong = false;
    if ($stateParams.input.gotoPage.TableName == "LogConfig" || $stateParams.input.gotoPage.TableName == "BankDirectoryPlus") {
        $scope.isLogCong = true;
    }

    $scope.loadMorecalled = false;

    /* for Crud operation*/

    /* Variable declaration Begins*/
    $scope.fieldDetails = {
        'Section': [],
        /* Field values */
        'Subsection': [],
        /* SubField values */
        'secondLevelsection': [],
        /* SubField values */
        'cstmAttr': {} /* Custom Attribute values */
    };
    $scope.CRUD = ($stateParams.input.responseMessage) ? ($stateParams.input.responseMessage) : ""; /* Response Message stored here */
    $scope.colSpanVal = "" /* used in slider insertion */
    $scope.ulName = ($stateParams.input.gotoPage.ParentName) ? $stateParams.input.gotoPage.ParentName : ''; /* used to display the parent name */
    $scope.dataLen = '' /* used to store the data length in loadmore */
    $scope.readData = [] /* used to store the data */
    $scope.Title = ($stateParams.input.gotoPage.Name) ? $stateParams.input.gotoPage.Name : '' /* used to display the title in add new */
    $scope.IconName = ($stateParams.input.gotoPage.IconName) ? $stateParams.input.gotoPage.IconName : '' /* used to display the title in add new */
    $scope.ParentIconName = ($stateParams.input.gotoPage.ParentIcon) ? $stateParams.input.gotoPage.ParentIcon : '' /* used to display the parent icon in breadcrumb */
    $scope.showPageTitle = $filter('removeSpace')(($stateParams.input.gotoPage.Name) ? $stateParams.input.gotoPage.Name : '');
    $scope.showsubTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.SubTitle'; /* used to display the discription */
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle'; /* used to display the parent name */

    // $scope.changeViewFlag = GlobalService.viewFlag; /* used to store select view */
    $scope.changeViewFlag = false; /* used to store select view */
    $scope.restResponse = {}; /* used to store the rest response */
    /* Variable declaration Ends */

    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
        /*setTimeout(function () {
            if ($(".dataGroupsScroll").scrollTop() != 0) {
                $(".dataGroupsScroll").scrollTop(0);
            } else {
                $(".dataGroupsScroll").scrollTop(0);
            }
        }, 300)*/
    }

    /* used to store select view in the global variable for furture use */
    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        // GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
            //  $(".floatThead ").find("thead").hide();
            // 	$('thead.OrigHeader').hide();
            // 	$('thead.FakeHeader').hide();
            if ($(".maintable > thead")) {
                $(".maintable > thead").hide();
            }
            autoScrollDiv();
        } else {
            $(".floatThead ").find("thead").show();
            $('thead.OrigHeader').show();
            $timeout(function() {
                $(".FixHead").scrollTop($(".FixHead").scrollTop() + 2)
            }, 10)
            if ($(".FixHead").scrollTop() == 0) {
                $table = $("table.stickyheader")
                $table.floatThead('destroy');

            }
            autoScrollDiv();
        }
    })

    /* used for all the crud request */
    function crudRequest(_method, _url, _data, _params, getCount) {
        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _params
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }
            if (getCount) {
                $scope.restResponse.totalCount = $scope.restResponse.totalCount ? $scope.restResponse.totalCount : response.headers().totalcount ? response.headers().totalcount : response.data.TotalCount ? response.data.TotalCount : ''
            }
            return $scope.restResponse
        }, function(error) {
            /* if (error.status == 401) {
            	
            } */

            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
            if (error && error.data && error.data.error) {
                $scope.restResponse = {
                    'Status': 'Error',
                    'data': error.data.error.message
                }

                $('.modal').modal("hide");
                $scope.alerts = [{
                    type: 'danger',
                    msg: error.data.error.message //Set the message to the popup window
                }];
                $timeout(callAtTimeout, 5000);
            }

            return $scope.restResponse
        })
    }


    function callforVisibility(x, y) {
        for (var k in x.customattributes.property) {
            if (x.customattributes.property[k].name === 'WebFormExcerptView') {
                return x.customattributes.property[k].value
            } else if (x.customattributes.property[k].name.match('|') && x.customattributes.property[k].name.split('|')[0] === 'VALUE') {
                $scope.fieldDetails.cstmAttr[y] = $.extend({}, $scope.fieldDetails.cstmAttr[y]);
                $scope.fieldDetails.cstmAttr[y][x.customattributes.property[k].name.split('|')[1]] = JSON.parse(x.customattributes.property[k].value)
            } else if (x.customattributes.property[k].name.match('{')) {
                $scope.fieldDetails.cstmAttr[y] = $.extend({}, $scope.fieldDetails.cstmAttr[y]);
                $scope.fieldDetails.cstmAttr[y] = $.extend(JSON.parse(x.customattributes.property[k].name), JSON.parse(x.customattributes.property[k].value))
            }
        }
    }

    function callDropvalRest(x, y, z, q, names) {
        //names = names.toUpperCase()
        //if( names != 'PARTYCODE' && names != 'CONNECTINGPARTY' && names != 'CURCORRESPARTYCODE' && names != 'ROUTINGAGENTPARTYCODE' &&  names != 'COUNTRYCORRESPARTYCODE' && names != 'PREFERREDACCOUNT'){
        if ('customattributes' in x) {
            if (x.customattributes.property[0].name === "REST") {

                crudRequest("GET", x.customattributes.property[0].value, '', {
                    start: 0,
                    count: 100
                }).then(function(response) {
                    if (z == 'Section') {
                        $scope.fieldDetails[z][y]['ChoiceOptions'] = response.data.data;
                        if ($scope.fieldDetails[z][y]['ChoiceOptions'].length) {
                            $scope.fieldDetails[z][y]['ChoiceOptions'][$scope.fieldDetails[z][y]['ChoiceOptions'].length - 1] = {
                                actualvalue: "REST",
                                displayvalue: "LoadMore",
                                configDetails: {
                                    'links': x.customattributes.property[0].value,
                                    'totalCount': response.totalCount
                                }
                            }
                        } else {
                            $scope.fieldDetails[z][y]['ChoiceOptions'].push({
                                actualvalue: "REST",
                                displayvalue: "LoadMore",
                                configDetails: {
                                    'links': x.customattributes.property[0].value,
                                    'totalCount': response.totalCount
                                }
                            })
                        }
                    } else if (z == 'secondLevelsection') {
                        for (var _nam in $scope.fieldDetails.secondLevelsection) {
                            if ($scope.fieldDetails.secondLevelsection[_nam].FieldName === names) {

                                $scope.fieldDetails.secondLevelsection[_nam].secondlevelSectionData[q]['ChoiceOptions'] = response.data.data;
                                $scope.fieldDetails.secondLevelsection[_nam].secondlevelSectionData[q]['ChoiceOptions'].push({
                                    actualvalue: "REST",
                                    displayvalue: "LoadMore",
                                    configDetails: {
                                        'links': x.customattributes.property[0].value,
                                        'totalCount': response.totalCount
                                    }
                                })
                            }
                        }
                    } else {
                        for (var _nam in $scope.fieldDetails.Subsection) {
                            if ($scope.fieldDetails.Subsection[_nam].FieldName === names) {
                                $scope.fieldDetails.Subsection[_nam].subSectionData[q]['ChoiceOptions'] = response.data.data;
                                $scope.fieldDetails.Subsection[_nam].subSectionData[q]['ChoiceOptions'].push({
                                    actualvalue: "REST",
                                    displayvalue: "LoadMore",
                                    configDetails: {
                                        'links': x.customattributes.property[0].value,
                                        'totalCount': response.totalCount
                                    }
                                })
                            }
                        }
                    }
                    return response.data.data
                })
            } else if (x.customattributes.property[0].name === "Choice") {
                return x.customattributes.property
            } else {
                return x.choiceOptions
            }
        } else {
            return x.choiceOptions
        }
        //}
    }

    function callDropvalRest1(argu, name) {
        if ('customattributes' in argu) {
            for (k in argu.customattributes.property) {
                if (argu.customattributes.property[k].name == "REST") {
                    return [{
                            actualvalue: "REST",
                            displayvalue: "LoadMore",
                            configDetails: {
                                'links': argu.customattributes.property[0].value
                            }
                        }]
                        /*crudRequest("GET",argu.customattributes.property[k].value,"").then(function(response){
                            for(k in $scope.MOPdata){
                                if($scope.MOPdata[k].name == name){
                                    $scope.MOPdata[k].ChoiceOptions = response.data.data;
                                }
                            }
                        })*/
                } else if (argu.customattributes.property[k].name === "Choice") {
                    return argu.customattributes.property
                } else {
                    return argu.choiceOptions
                }
            }
        } else {
            return argu.choiceOptions
        }
    }

    $scope.getTextAreaRows = function(val1) {
        return Math.ceil(val1);
    }
    $scope.MOPdata = [];
    $scope.isMetaInfoLoaded = false;

    function buildFields(argu, fieldset) {
        $scope.MOPdata.push({
            'FieldSet': fieldset,
            'cstmcolumnspan': false,
            'name': ('name' in argu ? argu.name : ''),
            'type': ('type' in argu ? argu.type : ''),
            'columnspan': ('columnspan' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.columnspan : ''),
            'enabled': ('enabled' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : ''),
            'label': ('label' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
            'labelposition': ('labelposition' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.labelposition : ''),
            'newrow': ('newrow' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.newrow : ''),
            'notnull': ('notnull' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
            'renderer': ('renderer' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer : ''),
            'rowspan': ('rowspan' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.rowspan : ''),
            'visible': ('visible' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
            'enabled': ('enabled' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : ''),
            'WebFormExcerptView': ('customattributes' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], argu.name) : false,
            'ChoiceOptions': ('Choice' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer) ? callDropvalRest1(argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice, argu.name) : '',
            'Multiple': ('Choice' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer) ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
            'PrimaryKey': (argu.name == $scope.primarykey) ? true : false,
            'property': ('customattributes' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false
        })
        if ('label' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 && argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.label == 'Status' && 'Choice' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer) {
            $scope.Status = argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions;
        }
    }

    $scope.primarykey = '';
    $scope.primarykey1 = '';
    $scope.Status = '';
    //Get Field Values
    crudRequest("GET", $stateParams.input.gotoPage.Link + '/metainfo', "").then(function(response) {
        crudRequest("GET", $stateParams.input.gotoPage.Link + "/primarykey", '').then(function(res) {
            if (res.data.data.responseMessage) {
                $scope.primarykey = res.data.data.responseMessage.split(',');
                $rootScope.primarykeyValues = $scope.primarykey;
                $scope.primarykey1 = $scope.primarykey[0].match(/_PK/g) ? '' : $scope.primarykey[0];
            }

            $scope.isMetaInfoLoaded = true;
            var obtainedFields = response.data.data.Data.webformuiformat.fields.field

            $scope.colSpanVal = obtainedFields.length;
            $scope.truetag = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? false : true;
            if ($stateParams.input.gotoPage.Link == 'methodofpayments') {
                var fieldset = false;
                var FieldGroupval = 0;
                $scope.colspanArr = [];
                for (k in obtainedFields) {
                    if (obtainedFields[k].name == "FieldGroup" || obtainedFields[k].name == "FieldGroupEnd") {
                        fieldset = 'fieldGroup1' in obtainedFields[k] ? obtainedFields[k].fieldGroup1.webformsectiongroup : false;
                        if (obtainedFields[k].name == "FieldGroup") {
                            FieldGroupval = k;
                        }
                        if (obtainedFields[k].name == "FieldGroupEnd") {
                            $scope.colspanArr.push(k - FieldGroupval - 1)
                                //$scope.MOPdata[FieldGroupval].cstmcolumnspan =  k - FieldGroupval -1
                        }
                    } else {
                        buildFields(obtainedFields[k], fieldset)
                    }
                }
                var j1 = 0;
                for (k in $scope.MOPdata) {
                    if ($scope.MOPdata[k].FieldSet && $scope.MOPdata[k].FieldSet.sectionheader != $scope.MOPdata[k - 1].FieldSet.sectionheader) {
                        $scope.MOPdata[k].cstmcolumnspan = $scope.colspanArr[j1];
                        j1++;
                    }
                }
            } else {
                for (k in obtainedFields) {
                    if ("webformfieldgroup" in obtainedFields[k].fieldGroup1) {
                        $scope.fieldDetails.Section.push({
                            'FieldName': ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
                            'Type': ('type' in obtainedFields[k] ? obtainedFields[k].type : ''),
                            'customRenderer': ('customRenderer' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.customRenderer : ''),
                            'Label': ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
                            'dateformat': ('dateformat' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.dateformat : ''),
                            'DefaultValue': ('defaultvalue' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.defaultvalue : (obtainedFields[k].type === 'Boolean' && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type === 'Choice') ? false : ''),
                            'InputType': ('type' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == 'Choice' && obtainedFields[k].type == 'Boolean') ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choicerenderer : ('Choice' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choicerenderer == 'RadioChoiceRenderer') ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choicerenderer : obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
                            'MaxLength': ('width' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
                            'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                            'ChoiceOptions': (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? callDropvalRest(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice, k,
                                'Section', '', obtainedFields[k].name) : obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes,
                            'Multiple': (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].choiceOptions : '',
                            'Rows': (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea") ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows : '',
                            'PrimaryKey': (obtainedFields[k].name == $scope.primarykey) ? true : false,
                            'Visible': ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], obtainedFields[k].name) : false,
                            'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
                            'View': ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                            'visible': ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                            'enabled': ('enabled' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : '')
                        })

                        if ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label == 'Status' && 'Choice' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer) {
                            $scope.Status = obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions;

                        }
                    } else {
                        var subSectionData = [];
                        for (j in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field) {
                            if ("webformfieldgroup" in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1) {
                                subSectionData.push({
                                    'FieldName': ('name' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name : ''),
                                    'Type': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].type : ''),
                                    'Label': ('label' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
                                    'DefaultValue': ('defaultvalue' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.defaultvalue : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].type === 'Boolean' && obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type === 'Choice') ? false : ''),
                                    'customRenderer': ('customRenderer' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.customRenderer : ''),
                                    'InputType': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == 'Choice' && obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].type == 'Boolean') ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choicerenderer : obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
                                    'MaxLength': ('width' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
                                    'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                                    'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                                    'ChoiceOptions': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? callDropvalRest(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice, k,
                                        'Subsection', j, obtainedFields[k].name) : '',
                                    'Multiple': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
                                    'Rows': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea") ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows : '',
                                    'Visible': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name) : false,
                                    'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
                                    'View': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                                    'visible': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                                    'enabled': ('enabled' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : '')
                                })
                            } else {
                                var secondLevelSectionData = [];
                                for (var j2 in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field) {
                                    secondLevelSectionData.push({
                                        'FieldName': ('name' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].name : ''),
                                        'Type': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].type : ''),
                                        'Label': ('label' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
                                        'customRenderer': ('customRenderer' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.customRenderer : ''),
                                        'InputType': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == 'Choice' && obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].type == 'Boolean') ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choicerenderer : obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
                                        'MaxLength': ('width' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
                                        'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                                        'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                                        'ChoiceOptions': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? callDropvalRest(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice, j, 'secondLevelsection', j2, obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name) : '',
                                        'Multiple': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
                                        'Rows': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea") ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows : '',
                                        'Visible': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].name) : false,
                                        'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
                                        'View': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                                        'visible': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                                        'enabled': ('enabled' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field[j2].fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : '')
                                    })
                                }
                                $scope.fieldDetails.secondLevelsection.push({
                                    'Type': 'Subsection',
                                    'Mandatory': ('showsectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.showsectionheader : ''),
                                    'Label': ('sectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.sectionheader : ''),
                                    'MaxOccarance': ('maxoccurs' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.maxoccurs : ''),
                                    'FieldName': ('name' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name : ''),
                                    'secondlevelSectionData': secondLevelSectionData,
                                    'PrimaryKey': (obtainedFields[k].name == $scope.primarykey) ? true : false,
                                    'ParentName': ('name' in obtainedFields[k] ? obtainedFields[k].name : '')
                                })
                            }
                        }
                        $scope.fieldDetails.Subsection.push({
                            'Type': 'Subsection',
                            'Mandatory': ('showsectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.showsectionheader : ''),
                            'Label': ('sectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.sectionheader : ''),
                            'MaxOccarance': ('maxoccurs' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.maxoccurs : ''),
                            'FieldName': ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
                            'subSectionData': subSectionData,
                            'PrimaryKey': (obtainedFields[k].name == $scope.primarykey) ? true : false
                        })
                    }
                }
            }

            if (response.Status === "Success") {
                $scope.restInputData = {
                    "start": 0,
                    "count": 20,
                    "sorts": []
                }
                if ($stateParams.input.gotoPage.Link == 'businessprocesses') {
                    $scope.restInputData.sorts = [{
                            "columnName": "ProcessCode",
                            "sortOrder": "Asc"
                        },
                        {
                            "columnName": "WorkFlowCode",
                            "sortOrder": "Asc"
                        },
                        {
                            "columnName": "ActivityIndex",
                            "sortOrder": "Asc"
                        }
                    ]
                } else if ($stateParams.input.gotoPage.Link == 'approvalcondition') {
                    $scope.restInputData.filters = {
                        "logicalOperator": "AND",
                        "groupLvl1": [{
                            "logicalOperator": "AND",
                            "groupLvl2": [{
                                "logicalOperator": "AND",
                                "groupLvl3": [{
                                    "logicalOperator": "AND",
                                    "clauses": [{
                                        "columnName": "RoleID",
                                        "operator": "=",
                                        "value": "ALL",
                                        "isCaseSensitive": false
                                    }]
                                }]
                            }]
                        }]
                    }
                }
                //$scope.$watch('restInputData',function(){

                $timeout(function() {
                    for (j in $scope.restInputData.sorts) {
                        if ($scope.restInputData.sorts[j].sortOrder == "Asc") {
                            $(sanitize('#' + $scope.restInputData.sorts[j].columnName + '_Icon')).attr('class', 'fa fa-caret-up')
                            $(sanitize('#' + $scope.restInputData.sorts[j].columnName + '_icon')).attr('class', 'fa fa-long-arrow-up')

                        }
                        if ($scope.restInputData.sorts[j].sortOrder == "Desc") {
                            $(sanitize('#' + $scope.restInputData.sorts[j].columnName + '_Icon')).attr('class', 'fa fa-caret-down')
                            $(sanitize('#' + $scope.restInputData.sorts[j].columnName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        }
                    }
                }, 500)

                //	})
                $scope.applyRestData();
            }
        })
    })


    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    }

    //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {

            $scope.loadMorecalled = true;
            $scope.restInputData.start = len;
            $scope.restInputData.count = 20;
            crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", $scope.restInputData, '', true).then(function(response) {
                $scope.dataLen = response.data.data
                if (response.data.data.length != 0) {
                    $scope.readData = $scope.readData.concat($scope.dataLen)
                    len = len + 20;
                }
            })
        }
    }

    var debounceHandler = _.debounce(loadMore, 200, true);
    $('.listView').on('scroll', function() {
        $scope.widthOnScroll();
        if (Math.ceil($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
            debounceHandler();
        }
    });

    /*** Print function ***/

    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print();
    }

    window.addEventListener("afterprint", myFunction);

    function myFunction() {
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome) {
            setTimeout(function() {
                $('.FakeHeader').each(function(i) {
                    if ($(this).hasClass("FakeHeader")) {
                        $(this).siblings('thead').not(".OrigHeader").css('display', 'none');
                    }
                })
            }, 100)
        }
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.checkDefined = function(value){
        return angular.isDefined(value);
    }

    $scope.ExportMore = function(argu, excelLimit,format) {

        $scope.details = JSON.parse(sessionStorage.allconfirmObj);
        $scope.details.count = ($rootScope.count) ? $rootScope.count : 100000

        if($stateParams.input.gotoPage.Link == 'methodofpayments' || $stateParams.input.gotoPage.Link == 'logconfig'){
            crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", $scope.details).then(function(response) {
                $scope.dat = $scope.dat.concat(response.data.data)
                if(angular.isArray($scope.dat)) {
                    dataFormatService.booleanToString($scope.dat, ['PassiveTransport','CompressOutput','IsThrottlingRequired']);
                }
                JSONToCSVConvertor($scope.dat, $filter('translate')($scope.showPageTitle), true);
            });
                    
        } else {
            crudRequest("POST", $stateParams.input.gotoPage.Link + "/"+format, $scope.details).then(function(response) {
                $scope.dat = $scope.dat.concat(response.data.data)
                
                $scope.dat = response.data.data.Data
                if(angular.isArray($scope.dat)) {
                    dataFormatService.booleanToString($scope.dat, ['PassiveTransport','CompressOutput','IsThrottlingRequired']);
                }
                $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
                var dlnk = document.getElementById('dwnldLnk');
                dlnk.href = $scope.Details;
                dlnk.download =   $filter('translate')($scope.showPageTitle)+'.'+response.data.data['FileName'].split('.')[1];
                
                dlnk.click();
            });
        }
    }

    $scope.exportAsExcel = function(format) {
        $scope.dat = [];
        if($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.ExportMore(0, 1000000,format);
            //JSONToCSVConvertor($scope.dat, $scope.Title, true);			
        } else {
            $scope.dat = angular.copy($scope.readData);
            //$scope.dat.shift();
            
            if(angular.isArray($scope.dat)) {
                dataFormatService.booleanToString($scope.dat, ['PassiveTransport','CompressOutput','IsThrottlingRequired']);
            }
            JSONToCSVConvertor($scope.dat,$filter('translate')($scope.showPageTitle), true);
        }
        //bankData.exportToExcel($scope.dat, $scope.Title)

    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = ""; //This loop will extract the label from 1st index of on array
            var colName = [];
            if ($stateParams.input.gotoPage.Link == 'methodofpayments') {
                for (i in $scope.MOPdata) {
                    colName.push($scope.MOPdata[i].name)
                    row += $filter('translate')($scope.MOPdata[i].label) + ',';
                }
            } else {
                for (i in $scope.fieldDetails.Section) {
                    colName.push($scope.fieldDetails.Section[i].FieldName)
                    row += $filter('translate')($scope.fieldDetails.Section[i].Label) + ',';
                }
                if($scope.PageName != "Party Service Association"){
                    for (i in $scope.fieldDetails.Subsection) {
                        colName.push($scope.fieldDetails.Subsection[i].FieldName)
                        row += $filter('translate')($scope.fieldDetails.Subsection[i].Label) + ',';
                    }
                }
            }
            row = row.slice(0, -1);
            CSV += row + '\n';

        }

        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (jk in colName) {
                if (JSON.stringify(arrData[i][colName[jk]]) != undefined) {

                    if ($.isArray(arrData[i][colName[jk]])) {

                        var cont = "";
                        for (var x in arrData[i][colName[jk]]) {
                            var dStr = JSON.stringify(arrData[i][colName[jk]][x]);
                            dStr = dStr.replace(/"/g, '')
                            cont += JSON.stringify(dStr);
                        }

                        row += cont;
                        row = row.replace(/""/g, "\n")
                    } else if (typeof(arrData[i][colName[jk]]) === 'object' && $scope.PageName != "Party Service Association") {

                        var cont = "";
                        var dStr = JSON.stringify(arrData[i][colName[jk]]);
                        dStr = dStr.replace(/"/g, '')
                        row += JSON.stringify(dStr);
                        row = row.replace(/""/g, "\n")
                    } else {
                        if (arrData[i][colName[jk]].toString().indexOf('{') != -1 && $scope.PageName != "Party Service Association") {
                            var cont = "";
                            var dStr = JSON.stringify(arrData[i][colName[jk]]);
                            dStr = dStr.replace(/"/g, '')
                            row += JSON.stringify(dStr);
                            row = row.replace(/""/g, "\n") + ',';
                        } else {
                            row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';
                        }

                    }
                } else {
                    row += '' + ',';
                }
            }
            row.slice(0, row.length - 1);
            CSV += row + '\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        bankData.exportToExcel(CSV, ReportTitle)
    }

    $scope.showCol = false;
    $scope.colLimit = 6;
    $scope.dataContainer = '';
    var colsplicearr = [];
    $scope.splitData = function(dat, size) {
        var dataArr = angular.copy(dat);
        var arr = [];
        while (dataArr.length > 0) {
            arr.push(dataArr.splice(0, size));
        }
        for (a in arr) {
            if (a != 0) {
                colsplicearr[a] = arr[a].length + colsplicearr[Number(a - 1)];
            } else {
                colsplicearr[a] = arr[a].length;
            }
        }
        return true;
    }
    var indexPsnt = false;
    var k = 0;
    $scope.insertSlider = function(index) {
        for (a in colsplicearr) {
            if (colsplicearr[a] === index) {
                indexPsnt = true;
                k = colsplicearr[a]
            } else {
                indexPsnt = false;
            }
        }
        if (k < index) {
            return indexPsnt;
        } else {
            return !indexPsnt;
        }
    }

    $scope.gotoshowCol = function() {
        $scope.showCol = !$scope.showCol;
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

    /*** On window resize ***/
    $(window).resize(function() {
        $scope.$apply(function() {
            $scope.alertWidth = $('.alertWidthonResize').width();
        });
        //$scope.setClass();
    });

    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete delData.$$hashKey
        $scope.delval = {}
        for (var j in $scope.primarykey) {
            $scope.delval[$scope.primarykey[j]] = delData[$scope.primarykey[j]]
        }

        crudRequest("POST", $stateParams.input.gotoPage.Link + '/delete', $scope.delval).then(function(response) {
            if (response.Status === 'Success') {
                $('.modal').modal("hide");
           
                $scope.CRUD = response.data.data.responseMessage ? response.data.data.responseMessage : $filter('translate')('Transport.DeletedSuccessfully');
         
                $scope.restInputData = {
                        "start": 0,
                        "count": len,
                        "sorts": []
                    }
                    //applyRestData();
                $scope.applyRestData();
            }
        }, function(error) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
        })
    };

    var count = 0;
    $scope.applyRestData = function(argu) {
        count++;
        if (argu) {
            $scope.restInputData = {
                "start": 0,
                "count": 20,
                "sorts": []
            }
        }
        sessionStorage.allconfirmObj = JSON.stringify($scope.restInputData)
        crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", $scope.restInputData, '', true).then(function(response) {

            if (response.data.headers().totalcount) {
                $rootScope.count = response.data.headers().totalcount
            }

            if (count == 1) {
                $scope.initialTotalCount = angular.copy($scope.restResponse.totalCount)
            }

            $scope.readData = response.data.data;
            $scope.totalForCountBar = $scope.restResponse.totalCount;
            if ($scope.readData.length == 0 && !$scope.loadMorecalled) {
                $('.stickyheader').css('visibility', 'hidden');
            } else {
                $('.stickyheader').css('visibility', 'visible');
            }

            //$scope.readData.splice(0, 0, {});

            $scope.dataLen = response.data.data
            if ($scope.readData.length >0) {
                $scope.dataFound = true;
            } else {
                $scope.dataFound = false;
            }
            if ($scope.CRUD != "") {
                $scope.alerts = [{
                    type: 'success',
                    msg: $scope.CRUD //Set the message to the popup window
                }];
                $scope.CRUD = ""
                $timeout(callAtTimeout, 4000);
            }

            if (response.Status != "Error" && $stateParams.input.UserProfileDraft) {
                $scope.gotoEditDraft($stateParams.input)
            }

        })
        $scope.TotalCount = 0;
        for (j in $scope.Status) {
            //getCountbyStatus($scope.Status[j])
        }
    }
    $scope.loadData = function() {
        $scope.loadMorecalled = false;
        $scope.restInputData = {
            "start": 0,
            "count": 20
        }
        len = 20;
        $('.listView').scrollTop(0)
        $scope.clearSort('#sort');
        $scope.clearFilter();
        $scope.ResourcePermissionCall();
    }

    function callAtTimeout() {
        $('#statusBox').hide();
    }

    $scope.allowOnlyNumbersAlone = function(e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

    }

    $scope.multipleEmptySpace = function(e) {

        var classname = e.currentTarget.id;
        if (($filter('removeSpace')($('#' + classname).val()).length) > 0) {
            $('#' + classname).val($filter('removeSpace')($('#' + classname).val()));
        } else {
            $('#' + classname).val('');
            //$('#'+classname).focus();
        }
    }

    $scope.callStyle = function() {
        return $('#listViewPanelHeading_1').outerHeight();
    }

    $scope.filterBydate = [{
            'actualvalue': custmtodayDate(),
            'displayvalue': 'filterBydate.Today'
        },
        {
            'actualvalue': week(),
            'displayvalue': 'filterBydate.This Week'
        },
        {
            'actualvalue': month(),
            'displayvalue': 'filterBydate.This Month'
        },
        {
            'actualvalue': year(),
            'displayvalue': 'filterBydate.This Year'
        },
        {
            'actualvalue': '',
            'displayvalue': 'filterBydate.Custom'
        }
    ]

    $scope.showCustom = false;
    $scope.selectedDate = '';

    $scope.clearFilter = function() {
        if ('filters' in $scope.restInputData) {
            //$scope.applyRestData();
            $scope.restInputData["start"] = 0;
            $scope.restInputData["count"] = len;
            if ($stateParams.input.gotoPage.Link == 'businessprocesses') {
                delete $scope.restInputData.filters;
                $scope.restInputData.sorts = [{
                        "columnName": "ProcessCode",
                        "sortOrder": "Asc"
                    },
                    {
                        "columnName": "WorkFlowCode",
                        "sortOrder": "Asc"
                    },
                    {
                        "columnName": "ActivityIndex",
                        "sortOrder": "Asc"
                    }
                ]
            } else if ($stateParams.input.gotoPage.Link == 'approvalcondition') {
                $scope.restInputData.sorts = [];
                $scope.restInputData.filters = {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": "RoleID",
                                    "operator": "=",
                                    "value": "ALL",
                                    "isCaseSensitive": false
                                }]
                            }]
                        }]
                    }]
                }
            } else {
                delete $scope.restInputData.filters;
                $scope.restInputData.sorts = [];
            }

            $scope.showCustom = false;
            $scope.filterParams = {};
            $('.filterBydate').each(function() {
                $(this).css({
                    'background-color': '#fff',
                    'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
                })
            })

            $scope.selectedStatus = [];
            $('.filterBystatus').each(function() {
                $(this).css({
                    'background-color': '#fff',
                    'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
                })
            })
            // $('.customDropdown').removeClass('open');
            $('.dropdown-menu').removeClass('show'); 
            $scope.applyRestData();
        } else {
            $scope.showCustom = false;
            $scope.filterParams = {};
            $('.filterBydate').each(function() {
                $(this).css({
                    'background-color': '#fff',
                    'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
                })
            })

            $scope.selectedStatus = [];
            $('.filterBystatus').each(function() {
                $(this).css({
                    'background-color': '#fff',
                    'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
                })
            })
            // $('.customDropdown').removeClass('open');
            $('.dropdown-menu').removeClass('show'); 
        }
    }

    $scope.showAlert = false

    $(document).ready(function() {
        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            //useCurrent: true,
            showClear: true,
            icons: datepickerFaIcons.icons
        }).on('dp.change', function(ev) {
            $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
        }).on('dp.show', function(ev) {
            $(this).change();
        })
    })


    $scope.triggerpicker = function() {
        //$scope['filterParams'][$(ev.currentTarget).attr('id')]
        $scope.filterParams = {};
        $scope.showCustom = false;
        setTimeout(function() {
            var start = new Date();
            var endDate = new Date();
            var end = new Date(new Date().setYear(start.getFullYear() + 1));

            $('.DatePicker').datetimepicker({
                format: "YYYY-MM-DD",
                startDate: start,
                endDate: end,
                useCurrent: true,
                showClear: true,
                icons: datepickerFaIcons.icons
            }).on('dp.change', function(ev) {
                $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
            }).on('dp.show', function(ev) {
                $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
                    //$scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
            }).on('dp.hide', function(ev) {
                $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
                    //$scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
            })
        }, 500)
    }

    $scope.buildFilter = function(argu1) {
        var argu2 = []
        if ($stateParams.input.gotoPage.Link == 'methodofpayments') {
            for (k in $scope.MOPdata) {
                if ($scope.MOPdata[k].type == 'String' && $scope.MOPdata[k].name != 'Status') {
                    argu2.push({
                        "columnName": $scope.MOPdata[k].name,
                        "operator": "LIKE",
                        "value": argu1
                    })
                }
            }
        } else {
            for (k in $scope.fieldDetails.Section) {
                if ($scope.fieldDetails.Section[k].Type == 'String' && $scope.fieldDetails.Section[k].FieldName != 'Status' && $scope.fieldDetails.Section[k].FieldName != 'MandateSchemeData' && $scope.fieldDetails.Section[k].FieldName != 'Rule' && $scope.fieldDetails.Section[k].FieldName != 'RulePhase' && $scope.fieldDetails.Section[k].FieldName != 'UsageMechanism') {
                    argu2.push({
                        "columnName": $scope.fieldDetails.Section[k].FieldName,
                        "operator": "LIKE",
                        "value": argu1
                    })
                }
            }
        }
        return argu2;
    }

    $scope.searchFilter = function(_val, isDraftSearch) {
        //var _val = angular.copy(val)
        $scope.loadMorecalled = false;
        $scope.restInputData["start"] = 0;
        $scope.restInputData["count"] = len;


        $scope.restInputData.filters = {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": []
                    }]
                }]
            }
            /* if(!('filters' in $scope.restInputData)){
            	$scope.restInputData.filters = {  
								"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND",
								"groupLvl3":[]
								}]}]
							}			
            }
            $scope.restInputData.filters = removeEmptyValueKeys($scope.restInputData.filters) */

        for (var j in Object.keys(_val)) {
            if (_val[Object.keys(_val)[j]]) {
                if (Object.keys(_val)[j] == 'Status') {
                    for (var i in _val[Object.keys(_val)[j]]) {
                        if ($scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.length && i > 0) {
                            $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({
                                "columnName": Object.keys(_val)[j],
                                "operator": "=",
                                "value": _val[Object.keys(_val)[j]][i]
                            })
                        } else {
                            $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                                "logicalOperator": "OR",
                                "clauses": [{
                                    "columnName": Object.keys(_val)[j],
                                    "operator": "=",
                                    "value": _val[Object.keys(_val)[j]][i]
                                }]
                            })
                        }
                    }
                } else if (Object.keys(_val)[j] == 'EffectiveDate') {
                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                                "columnName": "EffectiveFromDate",
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                                "value": $('#startDate').val()
                            },
                            {
                                "columnName": "EffectiveFromDate",
                                "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                                "value": $('#endDate').val()
                            }
                        ]
                    })
                } else if (Object.keys(_val)[j] == 'SearchSelect') {
                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": _val.SearchSelect,
                            "operator": "LIKE",
                            "value": _val.keywordSearch.toUpperCase(),
                            'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                        }]
                    })
                } else if (Object.keys(_val)[j] == 'keywordSearch' && !_val['SearchSelect']) {
                    $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": $scope.buildFilter(_val[Object.keys(_val)[j]])
                    })
                }
            }
        }

        $scope.applyRestData();

        setTimeout(function() {
            $('select[name=SearchSelect]').val(null).trigger("change");
        }, 100)
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
        })

        $scope.showCustom = false;
        $scope.selectedDate = '';
        $('.dropdown-menu').removeClass('show'); 
    }

    $scope.filterParams = {};
    $scope.selectedStatus = [];
    $scope.setStatusvalue = function(val, to) {
        var addme = true;
        if ($scope.selectedStatus.length) {
            for (k in $scope.selectedStatus) {
                if ($scope.selectedStatus[k] == val) {
                    $(sanitize('#' + val)).css({
                        'background-color': '#fff',
                        'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
                    })
                    $scope.selectedStatus.splice(k, 1);
                    addme = false
                    break
                }
            }
            if (addme) {
                $(sanitize('#' + val)).css({
                    'background-color': '#d8d5d5',
                    'box-shadow': ''
                })
                $scope.selectedStatus.push(val);
            }
        } else {
            $(sanitize('#' + val)).css({
                'background-color': '#d8d5d5',
                'box-shadow': ''
            })
            $scope.selectedStatus.push(val);
        }
        to['Status'] = $scope.selectedStatus;
    }

    $scope.setEffectivedate = function(val, to) {
        to['EffectiveDate'] = val;
        if ($scope.selectedDate == val.displayvalue) {
            $scope.showCustom = false;
            $('.filterBydate').css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
            $scope.selectedDate = '';
        } else {
            $scope.showCustom = true;
            $scope.selectedDate = angular.copy(val.displayvalue);
            $('.filterBydate').css({
                'background-color': '#fff',
                'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
            })
            $('#' + $scope.selectedDate.replace(/\s+/g, '')).css({
                'box-shadow': '1.18px 3px 2px 1px rgba(0,0,0,0.40)',
                'background-color': '#d8d5d5'
            })
        }
        if (typeof(val.actualvalue) == "object") {
            var date = []
            for (k in val.actualvalue) {
                date.push(val.actualvalue[k])
            }
            $('#customPicker').find('input').each(function(i) {
                if (i == 0) {
                    if (date[i] < date[Number(i + 1)]) {
                        $(this).val(date[i])
                        $(this).parent().children().each(function() {
                            $(this).css({
                                'cursor': 'not-allowed'
                            }).attr('disabled', 'disabled')
                        })
                    } else {
                        $(this).val(date[Number(i + 1)])
                        $(this).parent().children().each(function() {
                            $(this).css({
                                'cursor': 'not-allowed'
                            }).attr('disabled', 'disabled')
                        })
                    }
                } else {
                    $(this).val(date[Number(i - 1)])
                    $(this).parent().children().each(function() {
                        $(this).css({
                            'cursor': 'not-allowed'
                        }).attr('disabled', 'disabled')
                    })
                }
            })
        } else if (val.displayvalue == 'filterBydate.Custom') {
            $('#customPicker').find('input').each(function(i) {
                $(this).parent().children().each(function() {
                    $(this).css({
                        'cursor': 'pointer'
                    }).removeAttr('disabled').val('')
                })
            })
        } else {
            $('#customPicker').find('input').each(function(i) {
                $(this).val(val.actualvalue)
                $(this).parent().children().each(function() {
                    $(this).css({
                        'cursor': 'not-allowed'
                    }).attr('disabled', 'disabled')
                })
            })
        }
    }

    $scope.gotoState = function(inputData) {
        $('.my-tooltip').tooltip('hide');
        inputData['pageTitle'] = $scope.Title;
        inputData['ulName'] = $scope.ulName;
        inputData['parentLink'] = $stateParams.input.gotoPage.Link;
        inputData['pageInfo'] = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? $scope.MOPdata : $scope.fieldDetails;
        inputData['primarykey'] = $scope.primarykey;
        inputData['gotoPage'] = $stateParams.input.gotoPage;

        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
        params.input = inputData
        $state.go('app.operation', params);
    }


    $scope.goToEditOperation = function(viewParam) { 
        if($stateParams.input.gotoPage.Link == 'approvalcondition'){                    
            data = {
                TableName:'ResourceApprovalPermission',
                BusinessPrimaryKey : {},
                IsLocked: true
            };            
        }else{
            data = {
                TableName: $stateParams.input.gotoPage.Link || '',
                BusinessPrimaryKey : {},
                IsLocked: true
            };

        }       
       
        if($scope.primarykey && $scope.primarykey.length > 0) {
            for (let i = 0; i < $scope.primarykey.length; i++) {              
                data.BusinessPrimaryKey[$scope.primarykey[i]] = viewParam.fieldData ? viewParam.fieldData[$scope.primarykey[i]] : ''; 
            }           
        }
        data.BusinessPrimaryKey  = JSON.stringify(data.BusinessPrimaryKey);       
       
        EntityLockService.checkEntityLock(data).then(function(data){                   
            $scope.gotoState(viewParam);
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
         $('.my-tooltip').tooltip('hide'); 
    }

    $scope.gotoView = function(inputData) {
        inputData['pageTitle'] = $scope.Title;
        inputData['ulName'] = $scope.ulName;
        inputData['parentLink'] = $stateParams.input.gotoPage.Link;
        inputData['pageInfo'] = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? $scope.MOPdata : $scope.fieldDetails
        inputData['primarykey'] = $scope.primarykey;
        inputData['gotoPage'] = $stateParams.input.gotoPage

        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.input = inputData;
        $state.go('app.view', params);
    }

    $scope.$watch('restInputData', function(newValue, oldValue, scope) {
        // do something here
        $scope.savedQueryOrder = [];
        $scope.savedQueryfield = [];
        if (newValue) {
            for (order in newValue.QueryOrder) {
                $scope.savedQueryOrder.push({
                    'fieldName': newValue.QueryOrder[order].ColumnName,
                    'fieldValue': newValue.QueryOrder[order].ColumnOrder
                })
            }
            for (field in newValue.Queryfield) {
                $scope.savedQueryfield.push({
                    'fieldName': newValue.Queryfield[field].ColumnName,
                    'fieldValue': newValue.Queryfield[field].ColumnValue
                })
            }

        }
    }, true);

    $scope.gotoSorting = function(dat) {
        $scope.loadMorecalled = false;
        $scope.restInputData.start = 0;
        $scope.restInputData.count = len;

        var orderFlag = true;
        if ('sorts' in $scope.restInputData && $scope.restInputData.sorts.length) {
            for (k in $scope.restInputData.sorts) {
                if ($scope.restInputData.sorts[k].columnName == dat) {
                    if ($scope.restInputData.sorts[k].sortOrder == 'Asc') {
                        $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.restInputData.sorts[k].sortOrder = 'Desc'
                        orderFlag = false;
                        break;
                    } else {
                        $scope.restInputData.sorts.splice(k, 1);
                        orderFlag = false;
                        $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-minus fa-sm')
                        $(sanitize('#' + dat + '_Icon')).removeAttr('class')
                        $timeout(function() {
                            $(".alert-danger").hide();
                        }, 1000)
                        break;
                    }
                }
            }
            if (orderFlag) {
                $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-long-arrow-up')
                $(sanitize('#' + dat + '_Icon')).attr('class', 'fa fa-caret-up')
                $scope.restInputData.sorts.push({
                    "columnName": dat,
                    "sortOrder": 'Asc'
                })
            }
        } else {
            $(sanitize('#' + dat + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat + '_Icon')).attr('class', 'fa fa-caret-up')
            $scope.restInputData.sorts.push({
                "columnName": dat,
                "sortOrder": 'Asc'
            })
        }
        $scope.applyRestData();
    }

    $(document).ready(function() {
        $(".FakeHeader").hide();
        $(".FixHead").scroll(function(e) {
            $(".FakeHeader").show();
            var $tablesToFloatHeaders = $('table.maintable');
            $tablesToFloatHeaders.floatThead({
                //useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);
                $table.closest('.FixHead').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        })
        $(".FixHeadDraft").scroll(function(e) {
            var $tablesToFloatHeaders = $('table.drafttable');
            $tablesToFloatHeaders.floatThead({
                useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);
                $table.closest('.FixHeadDraft').scroll(function(e) {
                    $table.floatThead('reflow');
                });
            });
        })

        $(window).bind("resize", function() {
            setTimeout(function() {
                autoScrollDiv();
                $(".listView").scrollLeft(10)
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(5)
            }

        })
        $(window).trigger('resize');
        var parentElement = $(".parent");
        $('.appendSelect2').each(function() {
            $(this).select2({
                width: '100%',
                placeholder: $filter('translate')('Placeholder.Select'),
                allowClear: true,
                dropdownParent: parentElement
            })
            $(this).next().find('.select2-selection').each(function() {
                $(this).css({
                    'height': '34px',
                    'padding': '2px',
                    'border': '1px solid #e5e5e5',
                    'border-right': 'none'
                })
            })
        })

        $('select[name=SearchSelect]').on('change', function() {
            if ($(this).val()) {} else {
                $scope.filterParams.keywordSearch = ''
                $('input[name=keywordSearch]').val('')
            }

        })

    })

    $scope.gotoFilter = function(argu) {

    }
    $scope.gotoSort = function(argu) {}

    $scope.keywordSearchdata = {}
    $scope.inputType = ''

    $scope.keywordSearch = function(val) {
        $scope.restInputData.Queryfield = [{
            "ColumnName": val.selectBox,
            "ColumnOperation": "=",
            "ColumnValue": val.searchBox
        }]
        if ($scope.regex[$scope.inputType].regex) {
            if ($scope.regex[$scope.inputType].regex.test($('#searchBox').val())) {
                $scope.applyRestData();
            } else {
                $scope.restInputData.Queryfield = [];
            }
        } else {
            $scope.applyRestData();
        }
    }
    $scope.regex = {
        'Integer': {
            'regex': /^[0-9]$/,
            'className': '',
            'placeholder': 'Type Number Only',
            'errorMsg': 'Please fill out this field.'
        },
        'BigDecimal': {
            'regex': /^[0-9.]$/,
            'className': '',
            'placeholder': 'Type Number Only',
            'errorMsg': 'Please fill out this field.'
        },
        'String': {
            'regex': /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i,
            'className': '',
            'placeholder': 'Type here to Search...',
            'errorMsg': 'Please fill out this field.'
        },
        'Boolean': {
            'regex': /^true$|^false$/i,
            'className': '',
            'placeholder': 'Type true or false Only',
            'errorMsg': 'Boolean'
        },
        'DateOnly': {
            'regex': '',
            'className': 'date date-picker',
            'placeholder': 'YYYY-MM-DD',
            'errorMsg': 'DateOnly'
        },
        'DateTime': {
            'regex': '',
            'className': 'date form_cstm_datetime',
            'placeholder': 'YYYY-MM-DD T HH:MM',
            'errorMsg': 'DateTime'
        },
        'TimeOnly': {
            'regex': '',
            'className': 'timepicker timepicker-24',
            'placeholder': 'HH:MM:SS',
            'errorMsg': 'TimeOnly'
        }
    }

    $scope.setInputtype = function(id, x) {
        $('#searchBox').datepicker('remove');
        $('#searchBox').get(0).setCustomValidity('');
        $scope.keywordSearchdata = {
            'selectBox': x,
            'searchBox': ''
        }

        for (k in $scope.fieldDetails.Section) {
            if ($scope.fieldDetails.Section[k].FieldName === x) {
                $scope.inputType = $scope.fieldDetails.Section[k].Type
                $scope.cstmPlaceholder = $scope.regex[$scope.inputType].placeholder;
                $scope.className = $scope.regex[$scope.inputType].className;
            }
        }
    }


    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
                $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
                $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
            })
            /* if('sorts' in $scope.restInputData && $scope.restInputData.sorts.length){
            } */
        $scope.restInputData.sorts = [];
        $scope.applyRestData();
    }

    $scope.clearfromSearch = function(index, to, flag) {
        if (flag) {
            $scope.clearSort('#sort');
            $scope.clearFilter();
            $scope.keywordSearchdata.searchBox = '';
        } else {
            $scope.restInputData[to].splice(index, 1)
            $scope.applyRestData();
        }
    }

    /*Save Search begins Here*/
    $scope.triggerSave = false;
    $scope.dummy = [];
    $scope.calltriggerSave = function() {
        $scope.triggerSave = !$scope.triggerSave;
    }
    $scope.savedSearch = [];
    $scope.savedQueryOrder = [];
    $scope.searchedParams = {
        'fieldName': '',
        'fieldValue': '',
    };

    if ('triggerIs' in $stateParams.input) {
        setTimeout(function() {
            if ($stateParams.input.triggerIs.val.Operation == 'View') {
                $scope.gotoView({
                    'Permission': $scope.permission,
                    'Operation': $stateParams.input.triggerIs.val.Operation,
                    'fieldData': $stateParams.input.triggerIs.val.fieldData,
                    'primarykey': $stateParams.input.triggerIs.val.primarykey
                })
            } else {
                $scope.gotoState({
                    'Permission': $scope.permission,
                    'Operation': $stateParams.input.triggerIs.val.Operation,
                    'fieldData': $stateParams.input.triggerIs.val.fieldData,
                    'primarykey': $stateParams.input.triggerIs.val.primarykey
                })
            }
        }, 1000)
    }

    /* Get count */
    $scope.getCountbyStatus = function(argu) {
            crudRequest("GET", $stateParams.input.gotoPage.Link + '/' + argu.actualvalue + '/count', "").then(function(response) {
                argu.TotalCount = response.data.data.TotalCount;
                $scope.TotalCount = $scope.TotalCount + response.data.data.TotalCount;
                return response.data.data.TotalCount
            })
        }
        /* Get count */

    $scope.callforPermission = function(_permission, _status) {
        if ((_status.match(/WAITFORAPPROVAL/g) || _status.match(/DELETED/g)))
            return '{C: false, D: false, R: false, U: false}'
        else
            return _permission
    }

    $scope.clearEntityCache = function() {
        RESTPATH = "/rest/v2/"
        var url = BASEURL + RESTPATH + $stateParams.input.gotoPage.Link + '/reload'
        $http.get(url).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            uiConfiguration();
            $scope.alerts = [{
                type: 'success',
                msg: data.responseMessage //Set the message to the popup window
            }];
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'Error',
                msg: data.responseMessage //Set the message to the popup window
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    //var draftlen = 0;
    $scope.getCurrentDrafts = function() {
        var url = BASEURL + "/rest/v2/draft/" + $stateParams.input.gotoPage.TableName + '/readall'
        $http.post(url, {
            'start': 0,
            'count': 20
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.draftdatas = data;
            $scope.dataLen = data;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'Error',
                msg: data.responseMessage //Set the message to the popup window  /v2/draft/read/{tableName}
            }];
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.gotoEditDraft = function(draftblob) {
        var gotostateObj = {
            'Operation': draftblob.Operation,
            'Permission': draftblob.Permission,
            'totData': draftblob.totData,
            'fieldData': "",
            'FromDraft': true,
            'typeOfDraft': "",
            'frommodule': 'entitydraft'
        }

        var specificReadObject = {
            "UserID": gotostateObj.totData.UserID,
            "Entity": gotostateObj.totData.Entity,
            "BPK": gotostateObj.totData.BPK
        }
        $http.post(BASEURL + RESTCALL.DraftSpecificRead, specificReadObject).then(function(response) {

            gotostateObj.typeOfDraft = response.headers().type;

            var decryptedDraft = $filter('hex2a')(response.data.Data)
            var jsonDraft = $filter('Xml2Json')(decryptedDraft)
            var backupWholeData = angular.copy(jsonDraft)
            for (i in backupWholeData) {
                for (j in backupWholeData[i]) {
                    backupWholeData[i][j] = (backupWholeData[i][j] == 'true') ? true : (backupWholeData[i][j] == 'false') ? false : backupWholeData[i][j];
                    if (j == 'UsageMechanism' || j == 'ResponseConfig') {
                        for (k in backupWholeData[i][j]) {
                            backupWholeData[i][j][k] = (backupWholeData[i][j][k] == 'true') ? true : (backupWholeData[i][j][k] == 'false') ? false : backupWholeData[i][j][k];
                        }
                    } else {
                        if (typeof backupWholeData[i][j] == 'object') {
                            var backupObj = backupWholeData[i][j];
                            delete backupWholeData[i][j];
                            backupWholeData[i][j] = [];
                            backupWholeData[i][j].push(backupObj);
                        }
                    }
                }
                backupWholeData[i] = cleantheinputdata(backupWholeData[i])
                gotostateObj.fieldData = backupWholeData[i];
            }

        }, function(error) {

            $scope.alerts = [{
                type: 'Error',
                msg: error.responseMessage
            }];
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
        })

        setTimeout(function() {
            $scope.gotoState(gotostateObj)
        }, 100)
    }

    $scope.gotodeleteDraft = function() {

        $scope.deleteObj = {
            'UserID': delData.UserID,
            'Entity': delData.Entity,
            'BPK': delData.BPK
        }
        var url = BASEURL + "/rest/v2/draft/delete";
        $http.post(url, $scope.deleteObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            //if(response.Status === 'Success'){
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'success',
                msg: $filter('translate')('Transport.DeletedSuccessfully')
            }];
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

    draftlen = 20;
    argu = {};
    var loadMoreDrafts = function() {
        if (($scope.dataLen.length >= 20)) {
            argu.start = draftlen;
            argu.count = 20;

            var url = BASEURL + "/rest/v2/draft/" + $stateParams.input.gotoPage.TableName + '/readall';

            $http.post(url, argu).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.dataLen = data;
                if (data.length != 0) {
                    $scope.draftdatas = $scope.draftdatas.concat($scope.dataLen)
                    draftlen = draftlen + 20;
                }
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.alerts = [{
                    type: 'Error',
                    msg: data.responseMessage
                }];
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }
    }

    var debounceHandlerDraft = _.debounce(loadMoreDrafts, 200, true);
    setTimeout(function() {

        $(document).ready(function() {

            $('.draftViewCls').on('scroll', function() {

                $scope.widthOnScroll();
                if (Math.ceil($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    debounceHandlerDraft();
                }
            });
            $('#DraftListModal').on('shown.bs.modal', function(e) {

                $('body').css('padding-right', 0);
                $(".draftViewCls").scrollTop(0);
            })

        })

    }, 200)

    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {

        var GetPrimaryKeys = angular.copy($scope.primarykey);

        for (i in GetPrimaryKeys) {
            for (j in _data) {
                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }

        crudRequest("POST", $stateParams.input.gotoPage.Link + "/reactivate", reactivateObj).then(function(response) {
            $scope.alerts = [{
                type: 'success',
                msg: response.data.data.responseMessage  // Set the message to the popup window
            }];
            $timeout(callAtTimeout, 5000);

            // $scope.restInputData.start = 0;
            // $scope.restInputData.count = len;
            $scope.restInputData = {
                start: 0,
                count: len
            };
            $scope.applyRestData();
        }, function(error) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
        })
        setTimeout(function() {
            $(".alert").hide();
        }, 4000)

    }

    $scope.Unmask = function() {
        $scope.masking = !$scope.masking;
    }
	$scope.showAsXML = function(data) {
        var xmlData = hexToString(data)
        if (xmlData) {
            return $filter('beautify')(xmlData)
        } else {
            return data
        }
    }

    $scope.changeDownloadOption = function (val) {
        $scope.downloadOptions = val;
    }

    $scope.enableDownloadBtns = function(format) {
        if($scope.downloadOptions == 'All'){
            return configData.exportAsExcel.allFilter.indexOf(format) != -1 ? true : false
        } else{
            return configData.exportAsExcel.currentFilter.indexOf(format) != -1 ? true : false
        }
    }

});
