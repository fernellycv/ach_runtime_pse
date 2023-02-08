angular.module('VolpayApp').controller('bankDataAddonViewCtrl', function($scope,$rootScope, $state, $timeout, $stateParams, $filter, $http, $translate, bankData, GlobalService, LogoutService, errorservice, EntityLockService, datepickerFaIcons, GetPermissions) {
    $scope.newPermission = GetPermissions($stateParams.input.gotoPage.Name);
    EntityLockService.flushEntityLocks();

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
    if ($stateParams.input.gotoPage.TableName == "LogConfig") {
        $scope.isLogCong = true;
    }


    /* for Crud operation*/

    /* Variable declaration Begins*/
    $scope.fieldDetails = {
        'Section': [],
        /* Field values */
        'Subsection': [],
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
    $scope.showPageTitle = $filter('removeSpace')(($stateParams.input.gotoPage.Name) ? $stateParams.input.gotoPage.Name : '');
    $scope.showsubTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.SubTitle'; /* used to display the discription */
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle'; /* used to display the parent name */

    $scope.changeViewFlag = false; /* used to store select view */
    $scope.restResponse = {}; /* used to store the rest response */

    $scope.ParentIconName = ($stateParams.input.gotoPage.ParentIcon) ? $stateParams.input.gotoPage.ParentIcon : ''
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
            if ($("thead")) {
                $("thead").hide();
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

            /* if (error && error.data.error.code == 401) {
            	if (configData.Authorization == 'External') {
            		window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
            	} else {
            		LogoutService.Logout();
            	}
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
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
                $timeout(callAtTimeout, 4000);
            }



            return $scope.restResponse
        })
    }


    function callforVisibility(x, y) {
        for (var k in x.customattributes.property) {
            if (x.customattributes.property[k].name === 'WebFormExcerptView') {
                return x.customattributes.property[k].value
            } else if (x.customattributes.property[k].name.match('|') && x.customattributes.property[k].name.split('|')[0] === 'VALUE') {
                $scope.fieldDetails.cstmAttr[y] = {};
                $scope.fieldDetails.cstmAttr[y][x.customattributes.property[k].name.split('|')[1]] = JSON.parse(x.customattributes.property[k].value)
            }
        }
    }

    function callDropvalRest(x, y, z, q, names) {
        //names = names.toUpperCase()
        //if( names != 'PARTYCODE' && names != 'CONNECTINGPARTY' && names != 'CURCORRESPARTYCODE' && names != 'ROUTINGAGENTPARTYCODE' &&  names != 'COUNTRYCORRESPARTYCODE' && names != 'PREFERREDACCOUNT'){
        if ('customattributes' in x) {
            if (x.customattributes.property[0].name === "REST") {

                /* return [{
                			actualvalue :	"REST",
                			displayvalue:	"LoadMore",
                			configDetails: {
                					'links'		: x.customattributes.property[0].value
                				}
                		}] */

                crudRequest("GET", x.customattributes.property[0].value, '', {
                    start: 0,
                    count: 100
                }).then(function(response) {
                    if (z == 'Section') {
                        $scope.fieldDetails[z][y]['ChoiceOptions'] = response.data.data
                        $scope.fieldDetails[z][y]['ChoiceOptions'][$scope.fieldDetails[z][y]['ChoiceOptions'].length - 1] = {
                            actualvalue: "REST",
                            displayvalue: "LoadMore",
                            configDetails: {
                                'links': x.customattributes.property[0].value,
                                'totalCount': response.totalCount
                            }
                        }
                    } else {
                        $scope.fieldDetails.Subsection[0].subSectionData[q]['ChoiceOptions'] = response.data.data
                        $scope.fieldDetails.Subsection[0].subSectionData[q]['ChoiceOptions'][$scope.fieldDetails.Subsection[0].subSectionData[q]['ChoiceOptions'].length - 1] = {
                            actualvalue: "REST",
                            displayvalue: "LoadMore",
                            configDetails: {
                                'links': x.customattributes.property[0].value,
                                'totalCount': response.totalCount
                            }
                        }
                    }
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
    $scope.MOPdata = []

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
                $scope.primarykey1 = $scope.primarykey[0].match(/_PK/g) ? '' : $scope.primarykey[0];
            }

         
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
                            'InputType': ('type' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? 'password' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? 'password' : obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
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
                            subSectionData.push({
                                'FieldName': ('name' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name : ''),
                                'Type': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].type : ''),
                                'Label': ('label' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
                                'customRenderer': ('customRenderer' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.customRenderer : ''),
                                'InputType': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
                                'MaxLength': ('width' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
                                'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                                'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                                'ChoiceOptions': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? callDropvalRest(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice, k,
                                    'Subsection', j) : '',
                                'Multiple': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
                                'Rows': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea") ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows : '',
                                'Visible': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name) : false,
                                'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
                                'View': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                                'visible': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                                'enabled': ('enabled' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : '')
                            })
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
            $scope.restInputData.start = len;
            $scope.restInputData.count = 20;
            crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", $scope.restInputData, '', true).then(function(response) {
                $scope.dataLen = response.data.data
                if (response.data.data.length != 0) {
                    $scope.readData = $scope.readData.concat($scope.dataLen)
                    $scope.readDataBkp = $scope.readDataBkp.concat($scope.dataLen)
                    len = len + 20;
                }
            })
        }

    }

    var debounceHandler = _.debounce(loadMore, 700, true);
    $('.listView').on('scroll', function() {
        $scope.widthOnScroll();
        if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
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
        /*setTimeout(function(){
        	$('.FakeHeader').each(function(i){
        		$(this).next().css('display','none');
        	})
        },100)*/
        var myVar = setInterval(function() {
            myTimer()
        }, 100);

        function myTimer() {
            $('.FakeHeader').each(function(i) {
                if ($(this).nextAll("thead")) {
                    $(this).nextAll("thead").css('display', 'none')
                    myStopFunction()
                }
            })
        }

        function myStopFunction() {
            clearInterval(myVar);
        }
    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    }

    $scope.ExportMore = function(argu, excelLimit,format) {

        $scope.details = JSON.parse(sessionStorage.allconfirmObj);
        $scope.details.count = ($rootScope.count) ? $rootScope.count : 100000


    crudRequest("POST", (format=='csv')?$stateParams.input.gotoPage.Link + "/readall":$stateParams.input.gotoPage.Link + "/"+format, $scope.details).then(function(response) {
      
if(format=='csv'){
      $scope.dat = $scope.dat.concat(response.data.data)
    JSONToCSVConvertor($scope.dat, $scope.Title, true);
}else{
	
      $scope.dat = response.data.data.Data
    $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
    var dlnk = document.getElementById('dwnldLnk');
    dlnk.href = $scope.Details;
    dlnk.download =   response.data.data['FileName']
      
    dlnk.click();
}
        

        })
        // if (argu > excelLimit) {
        //     JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? $scope.Title + '_' + ('' + excelLimit)[0] : $scope.Title, true);
        //     $scope.dat = [];
        //     excelLimit += 1000000
        // }
        // if (!$scope.TotalCount) {
        //     $scope.TotalCount = $scope.restResponse.totalCount
        // }
        // crudRequest("POST", $stateParams.input.gotoPage.Link + "/readall", {
        //     "start": argu,
        //      "count": ($scope.TotalCount) ? $scope.TotalCount : 10000
        // }).then(function(response) {
        //     $scope.dat = $scope.dat.concat(response.data.data)
        //     if (response.data.data.length >= 1000) {
        //         argu += 1000;
        //         $scope.ExportMore(argu, excelLimit)
        //     } else {
        //         JSONToCSVConvertor($scope.dat, (argu > excelLimit) ? $scope.Title + '_' + ('' + excelLimit)[0] : $scope.Title, true);
        //     }
        // })
    }

    $scope.exportAsExcel = function(format) {
       
        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
         
            $scope.ExportMore(0, 1000000,format);
            //JSONToCSVConvertor($scope.dat, $scope.Title, true);			
        } else {
            $scope.dat = angular.copy($scope.readDataBkp);
          
            // $scope.dat.shift();
          

            JSONToCSVConvertor($scope.dat, $scope.Title, true);
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
                    row += $scope.MOPdata[i].label + ',';
                }
            } else {
                for (i in $scope.fieldDetails.Section) {
           
                    if($scope.fieldDetails.Section[i].visible != false){
                        colName.push($scope.fieldDetails.Section[i].FieldName)
                        //row += $scope.fieldDetails.Section[i].Label + ',';
                          row += $filter('translate')($scope.fieldDetails.Section[i].Label) + ',';
                    }
                
                }

                for (i in $scope.fieldDetails.Subsection) {
                    colName.push($scope.fieldDetails.Subsection[i].FieldName)
                    row += $scope.fieldDetails.Subsection[i].Label + ',';
                }



            }
            row = row.slice(0, -1);
            CSV += row + '\n';

        }

        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (jk in colName) {
                if (JSON.stringify(arrData[i][colName[jk]]) != undefined) {

                    //row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';
                    if (typeof(arrData[i][colName[jk]]) === 'object') {

                        var cont = "";
                        for (var x in arrData[i][colName[jk]]) {
                            var dStr = JSON.stringify(arrData[i][colName[jk]][x]);
                            dStr = dStr.replace(/"/g, '')
                            cont += JSON.stringify(dStr);
                        }

                        row += cont;
                        row = row.replace(/""/g, "\n")
                    } else {
                        row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';

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
                $scope.CRUD = response.data.data.responseMessage ? response.data.data.responseMessage : "Borrado exitosamente";
                $scope.restInputData = {
                        "start": 0,
                        "count": 20,
                        "sorts": []
                    }
                    //applyRestData();
                $scope.applyRestData();
            }
        })
    };

    $scope.applyRestData = function(argu) {
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
            $scope.readData = response.data.data;
            $scope.readDataBkp  = angular.copy($scope.readData);
       
            $scope.totalForCountBar = $scope.restResponse.totalCount;
            //$scope.readData.splice(0, 0, {});
            $scope.dataLen = response.data.data
            if ($scope.readData.length === 1) {
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
            if($stateParams.input.gotoPage.Link == "vphauthorizedaccount"){
                crudRequest("GET", "vphauthorizedaccount/GetPartyDetails").then(function(response2) {
                    var details = response2.data.data;
                    $scope.readDataBkp.forEach(element => {
                        var lastPartyCode = details.find(obj => {
                            if(obj.PARTYCODE == element.PartyCode){
                                return obj.PARTYNAME;
                            }
                        });
                        var lastdebtorPartyId = details.find(obj => {
                            if(obj.PARTYEXTERNALIDENTIFIER == element.DebtorPartyID){
                                return obj.PARTYNAME;
                            }
                        });
                        element.PartyCode = lastPartyCode.PARTYNAME;
                        element.DebtorPartyID = lastdebtorPartyId.PARTYNAME;
                    })
                })
            }
        })
        $scope.TotalCount = 0;
        for (j in $scope.Status) {
            $scope.getCountbyStatus($scope.Status[j])
        }
    }
    $scope.loadData = function() {
        $scope.disablethesavebutton=false
        $(".headershide").find("thead").hide();
        $scope.showtable=false
        $scope.selectedRow = null;
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
        })
    })

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
                if ($scope.fieldDetails.Section[k].Type == 'String' && $scope.fieldDetails.Section[k].FieldName != 'Status' && $scope.fieldDetails.Section[k].FieldName != 'Rule' && $scope.fieldDetails.Section[k].FieldName != 'RulePhase') {
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

    $scope.searchFilter = function(_val) {
        //var _val = angular.copy(val)
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
                            "value": _val.keywordSearch,
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
        params.urlIdForAddon = $filter('removeSpace')(inputData.gotoPage.Name).toLowerCase();
        params.urlOperationForAddon = $filter('removeSpace')(inputData.Operation).toLowerCase();
        params.input = inputData
        $state.go('app.addonoperation', params);
    }

    $scope.goToEditOperation = function(viewParam) {           
        data ={
            TableName: $stateParams.input.gotoPage.Link || '',
            BusinessPrimaryKey : {},
            IsLocked: true
        };
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
    }


    $scope.gotoView = function(inputData) {
        inputData['pageTitle'] = $scope.Title;
        inputData['ulName'] = $scope.ulName;
        inputData['parentLink'] = $stateParams.input.gotoPage.Link;
        inputData['pageInfo'] = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? $scope.MOPdata : $scope.fieldDetails
        inputData['primarykey'] = $scope.primarykey;
        inputData['gotoPage'] = $stateParams.input.gotoPage

        params = {};
        params.urlIdForAddon = $filter('removeSpace')(inputData.gotoPage.Name).toLowerCase();
        params.input = inputData
        $state.go('app.addonview', params);
    }


    $scope.$watch('restInputData', function(newValue, oldValue, scope) {
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
            var $tablesToFloatHeaders = $('table');
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

        $('.appendSelect2').each(function() {
            $(this).select2({
                width: '100%',
                placeholder: $filter('translate')('Placeholder.Select'),
                allowClear: true
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
    $scope.Reload = function() {
        $http.get(BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + '/reload').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

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

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            $scope.alerts = [{
                type: 'Error',
                msg: data.responseMessage //Set the message to the popup window
            }];
        });
    }
    $scope.clearEntityCache = function() {
        $http.get(BASEURL + "/rest/v2/" + $stateParams.input.gotoPage.Link + '/reload').then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

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

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
            $scope.alerts = [{
                type: 'Error',
                msg: data.responseMessage //Set the message to the popup window
            }];
        });
    }

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
                msg: response.data.data.responseMessage //Set the message to the popup window
            }];

            // $scope.restInputData.start = 0;
            // $scope.restInputData.count = len;
            $scope.restInputData = {
                start: 0,
                count: len
            };
            $scope.applyRestData();
        })

        setTimeout(function() {
            $(".alert").hide();
        }, 4000)

    }
    $scope.StylesForPage= function(nameField, titlePage){
        if(nameField=== 'Transactions'){
            return {'text-align':'right'};
        }
        else if(nameField=== 'Status'){
            return {'text-align':'center'};
        }
        if(titlePage == 'VPHDailyRates.PageTitle'){
            if(nameField === 'Exoneratedbanks'){
                return {'text-align':'center'};
            }else{
                return {'text-align':'right'};
            }
        }
    }

$scope.CUURENTDATE=moment(new Date()).format('YYYY-MM-DD');

    $scope.Generatexml=function(data){


$http.post(BASEURL + '/rest/v2/xmlfilegeneration/generatexml', data).then(function onSuccess(response) {
    // Handle success
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;

   
        $scope.alerts = [{
            type: 'success',
            msg: data.responseMessage
        }];
     
     
        $scope.loadData();
        


    }).catch(function onError(response) {
    // Handle error
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;
    $scope.alerts = [{
                    type: 'danger',
                    msg:data.error.message
                }]
 

     });


    }

    $scope.GeneratePendings=function(data){


        $http.post(BASEURL + '/rest/v2/xmlfilegeneration/generatepending', data).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
        
           
                $scope.alerts = [{
                    type: 'success',
                    msg: data.responseMessage
                }];
             
             
                $scope.loadData();
                
        
        
            }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.alerts = [{
                            type: 'danger',
                            msg:data.error.message
                        }]
         
        
             });
        
        
            }

    $scope.downloadxml = function(data) {

      

        $http.post(BASEURL + '/rest/v2/xmlfilegeneration/export', data).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
         
            $scope.dat = response.data.Data
            $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
            var dlnk = document.getElementById('dwnldLnk');
            dlnk.href = $scope.Details;
            dlnk.download = response.data['FileName']
            
            dlnk.click();

 
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
    $scope.choices= [];
    $(document).ready(function() {

        $('.EntityName').select2();

})

    $scope.initCall = function() {
        
        
        $http.get(BASEURL + '/rest/v2/xmlfilegeneration/partyname').then(function onSuccess(response) {
        
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

             $scope.parties = data;
    
                
        }).catch(function onError(response) {
            // Handle error
           
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
          
        });
    }

    $scope.initCall()

    $scope.totalAmount = function(datas){
        $scope.total = 0;
        if (Object.keys(datas).indexOf('Returns') != -1) {
            for(count=0;count<datas.Returns.length;count++){
                $scope.total += parseFloat(datas.Returns[count].TransactionAmount);
            }
            return $scope.total;
        }else{
            return $scope.total;
        }
      
    };
   
    function add(accumulator, a) {
        return accumulator + a;
      }

    $scope.Totalamountcalculate = function(Amounts,totamnt){
  
      // string to number
      var numberArray = [];
    for (var i = 0; i < totamnt.length; i++){
        // strintonum
        if(!(totamnt[i]=='')){
            numberArray.push(parseFloat(totamnt[i]));
            var sum = numberArray.reduce(add, 0); // with initial value to avoid when the array is empty
        }

    }
        $scope.total=sum
  
    }





    $scope.rowHighilited=function(row)
    {
       
      $scope.selectedRow = row;    
    }
    
    $scope.disablethesavebutton=false
$scope.showtables=function(data){
    
    if ((Object.keys(data).indexOf('GeneratedFile') != -1)||(data['Status']=='DELETED')) {
        $scope.disablethesavebutton=true
       
    }else{
        $scope.disablethesavebutton=false
    }
  
    $rootScope.individualobj=data
    $scope.showtable=true

    $http.post(BASEURL + '/rest/v2/xmlfilegeneration/readxmlrefunds', data).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.datas=data

     
      if (Object.keys($scope.datas).indexOf('Returns') != -1) {
        $scope.totalAmount($scope.datas)
                $scope.choices = [];
                $scope.EntityExists = [];
                $scope.EntityName = [];
                $scope.TransactionCode = [];
                $scope.TransactionAmount = [];
                $scope.XMLEntityNIT = [];
                $scope.EntityAccount = [];
                $scope.XMLPortfolio = [];
                $scope.DescriptionOfTheReturn = [];
                for (var i = 0; i < $scope.datas.Returns.length; i++) {
                    $scope.choices.push({'id' :  i});
                    $scope.EntityExists.push($scope.datas.Returns[i].EntityExists);
                    $scope.EntityName.push($scope.datas.Returns[i].EntityName);
                    $scope.TransactionCode.push($scope.datas.Returns[i].TransactionCode);
                    $scope.TransactionAmount.push($scope.datas.Returns[i].TransactionAmount);
                   
                    $scope.XMLEntityNIT.push($scope.datas.Returns[i].XMLEntityNIT);
                    $scope.EntityAccount.push($scope.datas.Returns[i].EntityAccount);
                    $scope.XMLPortfolio.push($scope.datas.Returns[i].XMLPortfolio);
                    $scope.DescriptionOfTheReturn.push($scope.datas.Returns[i].DescriptionOfTheReturn);
                }
            }else{
                $scope.totalAmount($scope.datas)
                 $scope.EntityExists=[]
                 $scope.EntityExists[0]='No';
                $scope.EntityName = [];
                $scope.TransactionCode = [];
                $scope.TransactionAmount = [];
                $scope.XMLEntityNIT = [];
                $scope.EntityAccount = [];
                $scope.XMLPortfolio = [];
                $scope.DescriptionOfTheReturn = [];
                $scope.choices = [];
		     	$scope.choices.push({id: '1'})
               
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

$scope.checkinfos=function(value,index,c){


$http.get(BASEURL + "/rest/v2/xmlfilegeneration/partydetails?party=" + value).then(function onSuccess(response) {
    // Handle success
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;
    $scope.XMLEntityNIT[index]=data.XMLEntityNIT
    $scope.EntityAccount[index]=data.EntityAccount
    $scope.XMLPortfolio[index]=data.XMLPortfolio

   
}).catch(function onError(response) {
    // Handle error
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;

    
});

}

$scope.addSection=function(i){
    $scope.EntityExists[i+1]='No'
   var newItemNo = $scope.choices.length+1;
    $scope.choices.push({'id' :  newItemNo});
}

$scope.removeSection=function(i,individualamnt){
  
    if(individualamnt){
        $scope.total=$scope.total-individualamnt
    }
       $scope.EntityExists.splice(i,1)
       $scope.EntityName.splice(i,1)
       $scope.TransactionCode.splice(i,1)
       $scope.TransactionAmount.splice(i,1)
       $scope.XMLEntityNIT.splice(i,1)
       $scope.EntityAccount.splice(i,1)
       $scope.XMLPortfolio.splice(i,1)
       $scope.DescriptionOfTheReturn.splice(i,1)

      var newItemNo = $scope.choices.length-1;
      if ( newItemNo !== 0 ) {
         $scope.choices.pop();
      }
}
$scope.showChoice = function(choice) {
    return choice.id === $scope.choices[$scope.choices.length-1].id;
   };
$scope.savechanges = function(){
    $scope.finalobj={}
    $scope.finalobj['InstructionID']=$rootScope.individualobj['InstructionID']
    $scope.getEntitydetails = [];
    let isFull = true;
    for (var i = 0; i < $scope.choices.length; i++) {
        if(
            $scope.TransactionCode[i]==''||
            $scope.TransactionAmount[i]==''||
            $scope.XMLEntityNIT[i]==''||
            $scope.EntityAccount[i]==''||
            $scope.XMLPortfolio[i]==''||
            $scope.DescriptionOfTheReturn[i]==''
        ){
            isFull = false;
            break;
        }else{
            var tmpObj = {
                "EntityExists" : $scope.EntityExists[i],
                "EntityName": $scope.EntityName[i], 
                "TransactionCode": $scope.TransactionCode[i],
                "TransactionAmount": $scope.TransactionAmount[i] == '' ? '0' : $scope.TransactionAmount[i],
                "XMLEntityNIT": $scope.XMLEntityNIT[i],
                "EntityAccount": $scope.EntityAccount[i],
                "XMLPortfolio": $scope.XMLPortfolio[i],
                "DescriptionOfTheReturn": $scope.DescriptionOfTheReturn[i]
            }
            $scope.getEntitydetails.push(tmpObj);
        }
    }
    $scope.finalobj['Returns']=$scope.getEntitydetails
    if(isFull){
        $http({
            method: 'POST',
            url: BASEURL + '/rest/v2/xmlfilegeneration/saverefunds',
            data: $scope.finalobj,

        }).then(function(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.showtable=false

            $scope.alerts = [{
            type: 'success',
            msg: data.responseMessage
            }];
            setTimeout(function() {
                $scope.loadData()
                $('.alert-success').hide();
            }, 2000)
        }, function(response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];

        })
    }else{
        $scope.alerts = [{
            type: 'danger',
            msg: $filter('translate')('Xmlfile.FieldsRequiredMessage')
        }];
        setTimeout(function() {
            $('.alert-danger').hide();
        }, 2000)
    }
}

});
