angular.module('VolpayApp').controller('viewApprovalDataCtrl', function($scope, $state, $stateParams, $http, $timeout, $interval, $filter, CommonService, GlobalService, errorservice) {
    function formatDataintoJSON(argu, fieldName) {
        if (argu) {
            if (isHex(argu) && (!fieldName || fieldName === 'statementData' || fieldName === 'PaymentData' || fieldName === 'AccountPostingDetails')) {
                argu = hex2a(argu);
            }
            if (isXML(argu)) {
                argu = convertXml2JSon(argu);
                if (Object.keys(argu)[0] === Object.keys(argu[Object.keys(argu)[0]])[0]) {
                    argu = argu[Object.keys(argu)[0]];
                }
            }
            if (typeof(argu) === 'object') {
                for (let fieldName in argu) {
                    argu[fieldName] = formatDataintoJSON(argu[fieldName], fieldName);
                }
            }
        }
        return argu;
    }

    function buildMetainfo(fieldDetails, output) {
        if (typeof(fieldDetails) === 'object') {
            for (let name in fieldDetails) {
                var field = {
                    'name': name,
                    'label': name,
                    'type': (typeof(fieldDetails[name]) === 'object') ? 'Section' : typeof(fieldDetails[name])
                }
                if (typeof(fieldDetails[name]) === 'object') {
                    field['field'] = buildMetainfo(fieldDetails[name], [])
                }
                output.push(field);
            }
        }
        return output;
    }

    $scope.buildTable = function(argu, data) {
        var table = document.createElement("table");
        table.style.margin = '0';
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        table.className = "table table-striped table-bordered table-hover";
        var thead = table.createTHead();

        var buildThead = function(field) {
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(field['name']));
            th.setAttribute('nowrap', 'nowrap');
            return th;
        }

        var buildRow = function() {
            var trow = document.createElement("tr");
            var generaatedTh = argu['field'].map(buildThead);
            generaatedTh.forEach(function(th) {
                trow.appendChild(th);
            })
            return trow;
        }

        var buildBody = function() {
            data = data[argu['name']];
            var trow = document.createElement("tr");
            argu['field'].forEach(function(field) {
                let td = document.createElement("td");
                if (typeof(data[field['name']]) === 'object') {
                    td.style.padding = '0';
                    td.style.border = 'none';
                    var div = document.createElement("div");
                    div.setAttribute('id', field['name'] + field['field'][0]['name']);
                    //div.classList.add("scroll-flex");
                    td.appendChild(div);
                    setTimeout($scope.buildTable, 100, field, data);
                } else {
                    td.appendChild(document.createTextNode(data[field['name']]));
                }
                trow.appendChild(td);
            });
            //tbody.appendChild();
            return trow
        }
        thead.append(buildRow());
        tbody.appendChild(buildBody());
        setTimeout(function(table, id) {
            if (document.getElementById(id)) {
                document.getElementById(id).appendChild(table);
            }
        }, 100, table, argu['name'] + argu['field'][0]['name']);
    }

    //var max = 300;

    $scope.ApproveDetail = {
        approved: false,
        rejected: false
    }


    $scope.data = $stateParams.input;


    $scope.delArr = ["mpitemplate", "configurations", "idconfigurations", "routeregistry"];

    $scope.bankDataArr = [];

    GlobalService.sidebarVal = GlobalService.sidebarVal ? GlobalService.sidebarVal : JSON.parse(sessionStorage.menuList)

    GlobalService.sidebarVal.forEach(function(val) {
        if (val.Link == 'bankData') {
            val.subMenu.forEach(function(menu) {
                if ($scope.delArr.indexOf(menu.Link) == -1) {
                    $scope.bankDataArr.push({
                        "Name": menu.TableName,
                        "Link": menu.Link
                    })
                }

            })
        }
    })


    $scope.fieldDetails = [];

    function crudRequest(_method, _url, _data, _params) {
        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _params
        }).then(function(response) {

            $scope.restResponse = {
                data: response
            }

            return $scope.restResponse
        }, function(error) {
            errorservice.ErrorMsgFunction(error, $scope, $http, error.data.error.code)
        })
    }


    var max = 270
    $("#idforNotes").keydown(function(e) {
        $("#lCnt").text((max - $(this).val().length) + " Characters Left");
    });




    $scope.approvalNotes = '';
    if ($scope.data.TableName == 'BusinessRules') {

        splitData($scope.data.OldData, $scope.data.NewData)

    }
    $timeout(function() {
        if ($('.newData').height() > $('.oldData').height()) {
            $('.preData').height($('.newData').height())
        } else {
            $('.preData').height($('.oldData').height())
        }
    }, 100)

    $scope.approveData = {};
    $scope.approveData.IsApproved = false;

    $scope.approveRefData = function(notes, flag) {
        var dataObj = {};
        dataObj.ApproveID = $scope.data.ApprovalID;
        dataObj.isApproved = flag;
        dataObj.Notes = notes ? notes.approvalNotes : '';


        $scope.ApproveDetail.approved = true;
        /*$scope.ApproveDetail = {
        	approved:flag?true:false,
        	rejected:!flag?true:false
        }*/
 
        $http.put(BASEURL + RESTCALL.ApproveReairedPayment, dataObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            CommonService.refDataApproved.flag = true;
            CommonService.refDataApproved.msg = data.responseMessage;

            $scope.ApproveDetail.approved = false;
            // $scope.ApproveDetail = {
            // 	approved:false,
            // 	rejected:false
            // }
            $state.go('app.approvals')
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            CommonService.refDataApproved.flag = false;
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            $timeout(function() {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
            }, 100)

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.cancelApproval = function() {
        $state.go('app.approvals');
    }

    $scope.alertWidth = 0;
    $scope.widthOnScroll = function() {
        var mq = window.matchMedia("(max-width: 991px)");
        var headHeight
        if (mq.matches) {
            headHeight = 0;
            $timeout(function() {
                $scope.alertWidth = $('.pageTitle').width();
            }, 100)
        } else {
            $timeout(function() {
                $scope.alertWidth = $('.pageTitle').width();
            }, 100)
            headHeight = $('.main-header').outerHeight(true) + 10;
        }

        $scope.alertStyle = headHeight;

    }
    $scope.widthOnScroll();

    $(window).scroll(function() {
        $scope.widthOnScroll();
    });

    $scope.multipleEmptySpace = function(e) {
        $(e.currentTarget).val($filter('removeSpace')($(e.currentTarget).val()))

        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
        $("#lCnt").text(max - $(e.currentTarget).val().length + " Characters Left");
    }

    var nodeText1 = [],
        nodeText2 = [];
    var difference = [];
    $scope.NewDataLabel = [];
    $scope.ApprovalNewData = [];
    $scope.ApprovalNewLabel = [];
    $scope.ApprovalOldData = [];
    $scope.ApprovalOldLabel = [];

    function getVal1() {

        nodeText1.push(comp1.trim());
    }

    function getVal2() {
        nodeText2.push(comp2.trim());
    }

    if ($scope.data.TableName.toUpperCase() == 'ROLERESOURCEPERMISSION') {

        conversion($scope.data.OldData, $scope.data.NewData)

    }

    function conversion(OldData, NewData) {
        $scope.xmlData = [{
            'hexdata': OldData,
            'convXml': ''
        }]

        $scope.xmlNewData = [{
            'hexdata': NewData,
            'convXml': ''
        }]

        if ($scope.xmlData[0].hexdata) {

            for (var k = 0; k < $scope.xmlData.length; k++) {
                for (var i = 0; i < $scope.xmlData[k].hexdata.length; i += 2) {
                    var v = parseInt($scope.xmlData[k].hexdata.substr(i, 2), 16);
                    if (v)
                        $scope.xmlData[k].convXml += String.fromCharCode(v);
                }
                $scope.xmlData[k].convXml = $scope.xmlData[k].convXml.replace(/&lt;/g, '<');
                $scope.xmlData[k].convXml = $scope.xmlData[k].convXml.replace(/&gt;/g, '>');
            }

        }


        for (var k = 0; k < $scope.xmlNewData.length; k++) {
            for (var i = 0; i < $scope.xmlNewData[k].hexdata.length; i += 2) {
                var v = parseInt($scope.xmlNewData[k].hexdata.substr(i, 2), 16);
                if (v)
                    $scope.xmlNewData[k].convXml += String.fromCharCode(v);
            }
            $scope.xmlNewData[k].convXml = $scope.xmlNewData[k].convXml.replace(/&lt;/g, '<');
            $scope.xmlNewData[k].convXml = $scope.xmlNewData[k].convXml.replace(/&gt;/g, '>');
        }

        return $scope.xmlData,
            $scope.xmlNewData;

    }

    function splitData(OldData, NewData) {


        $scope.xmlData = [{
            'convXml': OldData
        }]

        $scope.xmlNewData = [{
            'convXml': NewData
        }]

    }

    for (k in $scope.xmlNewData) {

        $($scope.xmlNewData[k].convXml).children().each(function() {
            if ($(this).children().length) {
                $(this).children().each(function() {
                    if ($(this).children().length) {
                        $(this).children().each(function() {

                            $scope.NewDataLabel.push(this.nodeName);
                            $scope.ApprovalNewLabel.push(this.nodeName)
                            $scope.ApprovalNewData.push($(this).text().trim())
                            comp2 = $(this).text();
                            getVal2();
                        })
                    } else {

                        $scope.NewDataLabel.push(this.nodeName);
                        $scope.ApprovalNewLabel.push(this.nodeName)
                        $scope.ApprovalNewData.push($(this).text().trim())

                        comp2 = $(this).text();
                        getVal2();
                    }
                })
            } else {
                if (this.nodeName.indexOf("_PK") == -1) {
                    $scope.NewDataLabel.push(this.nodeName);
                    $scope.ApprovalNewLabel.push(this.nodeName)
                    $scope.ApprovalNewData.push($(this).text().trim())
                    comp2 = $(this).text();
                    getVal2();
                }
            }

        })

    }

    for (k in $scope.xmlData) {

        $($scope.xmlData[k].convXml).children().each(function() {

            if ($(this).children().length) {
                $(this).children().each(function() {
                    if ($(this).children().length) {
                        $(this).children().each(function() {
                            $scope.ApprovalOldLabel.push(this.nodeName)
                            $scope.ApprovalOldData.push($(this).text().trim())
                            comp1 = $(this).text();
                            getVal1();
                        })
                    } else {

                        $scope.ApprovalOldLabel.push(this.nodeName)
                        $scope.ApprovalOldData.push($(this).text().trim())
                        comp1 = $(this).text();
                        getVal1();
                    }
                })
            } else {
                if (this.nodeName.indexOf("_PK") == -1) {
                    $scope.ApprovalOldLabel.push(this.nodeName)
                    $scope.ApprovalOldData.push($(this).text().trim())
                    comp1 = $(this).text();
                    getVal1();
                }
            }

        })

    }

    /*function arr_diff(a1, a2) {
	
    		var a = [],
    		diff = [];
	
    		for (var i = 0; i < a1.length; i++) {
    			a[a1[i]] = true;
    		}
	
    		for (var i = 0; i < a2.length; i++) {
    			if (a[a2[i]]) {
    				delete a[a2[i]];
    			} else {
    				a[a2[i]] = true;
    			}
    		}
	
    		for (var k in a) {
    			diff.push(k);
    		}
	
    		return diff;
    	};*/

    var DiffArr = arr_diff($scope.ApprovalNewLabel, $scope.ApprovalOldLabel)

    function approvalDataDiff(Label, NData, OData, Diffs) {
        var aDD = [];
        if (OData.length > 0) {

            for (i = 0; i < Diffs.length; i++) {

                for (j = 0; j < Label.length; j++) {

                    var tempObj = {};
                    if (Label[j].indexOf("_PK") == -1) {
                        if (aDD.length <= j) {

                            if (Diffs[i] == Label[j] && OData[j] != NData[j] || OData[j] == undefined) {
                                tempObj.Label = Label[j];
                                tempObj.NewData = NData[j]
                                tempObj.OldData = OData[j];
                                tempObj.Difference = true;
                                aDD.push(tempObj);
                            } else {
                                tempObj.Label = Label[j];
                                tempObj.NewData = NData[j]
                                tempObj.OldData = OData[j];
                                tempObj.Difference = false;
                                aDD.push(tempObj);
                            }
                        } else {
                            if (Diffs[i] == Label[j] && OData[j] != NData[j] || OData[j] == undefined) {
                                aDD[j].Difference = true;
                            }
                        }
                    }

                }
            }
        } else {
            for (j = 0; j < Label.length; j++) {
                var tempObj = {};
                tempObj.Label = Label[j]
                tempObj.NewData = NData[j]
                tempObj.OldData = OData[j]
                tempObj.Difference = false;
                aDD.push(tempObj);
            }
        }
        return aDD;
    }

    if (nodeText1.length != 0 && nodeText2.length != 0) {
        jQuery.grep(nodeText2, function(el) {
            if (jQuery.inArray(el, nodeText1) == -1) {
                difference.push(el);

            }
        });

    }

    var DiffArrForEDITED = [];

    function findLabels(difference) {
        for (i = 0; i < difference.length; i++) {

            DiffArrForEDITED.push($scope.ApprovalNewLabel[$scope.ApprovalNewData.indexOf(difference[i])])
        }

        return DiffArrForEDITED;
    }
    findLabels(difference)

    if (DiffArrForEDITED.length > 0) {
        $scope.approvalDataDiffData = approvalDataDiff($scope.ApprovalNewLabel, $scope.ApprovalNewData, $scope.ApprovalOldData, DiffArrForEDITED);
    } else {
        $scope.approvalDataDiffData = approvalDataDiff($scope.ApprovalNewLabel, $scope.ApprovalNewData, $scope.ApprovalOldData, DiffArr);
    }

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    function RPRestuctureObj(OldDataArray_1, NewDataArray_1) {
        var FinalArray = [];

        OldDataArray = Array.isArray(OldDataArray_1) ? OldDataArray_1 : [OldDataArray_1];
        NewDataArray = Array.isArray(NewDataArray_1) ? NewDataArray_1 : [NewDataArray_1];
        for (i = 0; i < NewDataArray.length; i++) {
            var ObjTemp = {};
            ObjTemp.ResourceName = NewDataArray[i].ResourceName;
            if (objectFindByKey(OldDataArray, 'ResourceName', NewDataArray[i].ResourceName) != null) {
                ObjTemp.OldPermission = Array.isArray(OldDataArray[i].PermissionList) ? OldDataArray[i].PermissionList : [OldDataArray[i].PermissionList];
            }
            ObjTemp.NewPermission = Array.isArray(NewDataArray[i].PermissionList) ? NewDataArray[i].PermissionList : [NewDataArray[i].PermissionList];
            FinalArray.push(ObjTemp)
        }
        return FinalArray;
    }

    if ($scope.data.TableName.toUpperCase() == 'ROLERESOURCEPERMISSION') {
        var x2js = new X2JS();
        $scope.RPApprovalOldData = x2js.xml_str2json($scope.xmlData[0].convXml);
        $scope.RPApprovalNewData = x2js.xml_str2json($scope.xmlNewData[0].convXml);
        $scope.RPApprovalFinalData = RPRestuctureObj($scope.RPApprovalOldData.GroupResourcePermissions.ResourceGroupPermissions, $scope.RPApprovalNewData.GroupResourcePermissions.ResourceGroupPermissions)

    }

    function hex2a(hexx) {
        var hex = hexx.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    function getMainKeysFromJSON(jsonData) {
        for (var k in jsonData) {
            return k
        }
    }

    function getKeysFromJSON(jsonData) {
        var keys = [];
        for (var k in jsonData) {
            for (var i in jsonData[k]) {
                if (i.indexOf("_PK") == -1) {
                    keys.push(i);
                }
            }
        }
        return keys;
    }
    function getKeysFromJSONPerRoleNTable(jsonData,tableName,roleName) {
		var keys = [];
		for (var k in jsonData) {
			for (var i in jsonData[k]) {
				if (i.indexOf("_PK") == -1) {
					if (tableName == 'Processing Information' && roleName.toUpperCase().indexOf("CLIENT") != -1) {
						var labelsPSA = ["PartyServiceAssociationCode", "PartyCode", "AdditionalConfiguration", "Status"];
						if (labelsPSA.includes(i))
							keys.push(i);
					}
					else { keys.push(i); }
				}
			}
		}
		return keys;
	}
    //$scope.MOPdata = []
    function buildFields(argu, fieldset) {
        $scope.fieldDetails.push({
            'FieldName': ('name' in argu ? argu.name : ''),
            'Label': ('label' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
        });


    }



    var OldData = $scope.data.OldData;
    var NewData = $scope.data.NewData;
    var Oldarr = [];


    function Meta_Info_CallData(response) {
        var obtainedFields = response.data.data.Data.webformuiformat.fields.field;
        for (k in obtainedFields) {
            if ("webformfieldgroup" in obtainedFields[k].fieldGroup1) {

                $scope.fieldDetails.push({
                    'FieldName': ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
                    'Label': ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : '')
                })
            } else {
                var subSectionData = [];
                for (j in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field) {
                    subSectionData.push({
                        'FieldName': ('name' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name : ''),
                        'Label': ('label' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : '')
                    })

                }
                $scope.fieldDetails.push({
                    'Label': ('sectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.sectionheader : ''),
                    'FieldName': ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
                })
            }
        }
    }

    var ruleObj = {
        "ruleOldData": [],
        "ruleNewData": []

    }

    var finalLabels = [];
    var finalLabelsOld = [];

    function keyvalueForBR(XML, keysval) {
        $(sanitize(XML)).children().each(function() {

            if ($(this).children().length) {
                $(this).children().each(function() {
                    if ($(this).children().length) {
                        $(this).children().each(function() {
                            var nodeNames = this.nodeName;
                            var textValus = $(this).text().trim();
                            //ruleObj[keysval].push({key:nodeNames,value:textValus})
                            ruleObj[keysval][nodeNames] = textValus;
                        })
                    } else {
                        var nodeNames = this.nodeName;
                        var textValus = $(this).text().trim();
                        //ruleObj[keysval].push({key:nodeNames,value:textValus})
                        ruleObj[keysval][nodeNames] = textValus;
                    }
                })
            } else {
                if (this.nodeName.indexOf("_PK") == -1) {
                    var nodeNames = this.nodeName;
                    var textValus = $(this).text().trim();
                    //ruleObj[keysval].push({key:nodeNames,value:textValus})
                    ruleObj[keysval][nodeNames] = textValus;

                }
            }

        })
        return ruleObj;
    }


    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };

    function jsondiff(obj1, obj2) {
        var result = {};
        var change;
        for (var key in obj1) {
            if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object') {
                change = jsondiff(obj1[key], obj2[key]);
                if (isEmptyObject(change) === false) {
                    result[key] = change;
                }
            } else if (obj2[key] != obj1[key]) {
                result[key] = obj2[key];
            }
        }
        return result;
    };

    var keyArrObj = {

        "FDCParameters": {
            "oldData": [],
            "newData": []

        },
        "PDCParameters": {
            "oldData": [],
            "newData": []
        },
        "AdditionalConfig": {
            "oldData": [],
            "newData": []
        }

    }

    //var keyArr = [];
    $scope.paramval = {
        "FDCParameters": {
            "oldData": [],
            "newData": [],
            "header": "FileDuplicateCheckConfig"

        },
        "PDCParameters": {
            "oldData": [],
            "newData": [],
            "header": "PaymentDuplicateCheckConfig"
        },
        "AdditionalConfig": {
            "oldData": [],
            "newData": [],
            "header": "Additional Config"
        }
    };
    var count = {
        "FDCParameters": {
            "oldData": [],
            "newData": []

        },
        "PDCParameters": {
            "oldData": [],
            "newData": []
        },
        "AdditionalConfig": {
            "oldData": [],
            "newData": []
        }
    };
    //var nn = [];
    var newNN = [{
        'label': '',
        'arr': []
    }]

    $scope.viewbutnspdf = function(PDF) {
        var pdfWindow = window.open("")
        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + PDF + "'></iframe>")
    }

    function viewNewAppData(dataa) {
        var NewData = $scope.data.NewData;
        var OldData = $scope.data.OldData;

        if ($scope.data.TableName == 'BusinessRules') {
            NDXML = NewData;
            keyvalueForBR(NDXML, 'ruleNewData');
            finalLabels = Object.keys(ruleObj['ruleNewData'])
            $scope.checkOdataLength = Object.keys(ruleObj['ruleOldData']).length;
            $scope.FinalDataArray = getFinalData(ruleObj['ruleOldData'], ruleObj['ruleNewData'], finalLabels)


            //	$('#QComment').text(databack.replace(/\r\n/g,EOL));


        } else if ($scope.data.TableName == 'ApprovalMsg') {
            $scope.ApprovalData = {};
            if ($scope.data['NewData']) {
                $scope.ApprovalData['NewData'] = {
                    'data': formatDataintoJSON(angular.copy($scope.data['NewData']))
                };
                $scope.ApprovalData['NewData']['field'] = buildMetainfo($scope.ApprovalData['NewData']['data'], []);
                $scope.ApprovalData['NewData']['data'] = $scope.ApprovalData['NewData']['data'][$scope.data['TableName']];
                $scope.ApprovalData['NewData']['field'] = $scope.ApprovalData['NewData']['field'][0]['field'];
            }
            if ($scope.data['OldData']) {
                $scope.ApprovalData['OldData'] = {
                    'data': formatDataintoJSON(angular.copy($scope.data['OldData']))
                };
                $scope.ApprovalData['OldData']['field'] = buildMetainfo($scope.ApprovalData['OldData']['data'], []);
            }
        }else if ($stateParams.input.TableName == 'User Administration') {
			var NewData = $stateParams.input.NewData;
			NDXML = hex2a(NewData);
			NDJSON = convertXml2JSon(NDXML);
			var query = {
				UserID: NDJSON.UserProfile.UserID
			}


            $http({
            	url: BASEURL + '/rest/v2/administration/profileuser/ReadApprovalProfile',
                method: "POST",
                data: query,
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

                NDXML = hex2a(NewData);
				NDJSON = convertXml2JSon(NDXML);
				NDJSON.UserProfile = Object.assign(NDJSON.UserProfile, data);
				var mainKey = getMainKeysFromJSON(NDJSON);
				var finalLabels = getKeysFromJSONPerRoleNTable(NDJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
				$scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                CommonService.refDataApproved.flag = false;
				// $scope.alerts = [{
				// 	type: 'danger',
				// 	msg: data.error.message
				// }];
				// $timeout(function () {
				// 	$scope.alertStyle = alertSize().headHeight;
				// 	$scope.alertWidth = alertSize().alertWidth;
				// }, 100)
				// errorservice.ErrorMsgFunction(config, $scope, $http, status)
           
            });

		
			var mainKey = getMainKeysFromJSON(NDJSON);
			var finalLabels = getKeysFromJSONPerRoleNTable(NDJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
			$scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
		} else if ($stateParams.input.TableName == 'Role Management') {
			//NDXML = hex2a(NewData);
			//NDJSON = convertXml2JSon(NDXML);
			var query = { "ApprovalID": $stateParams.input.ApprovalID }

            $http({
            	url: BASEURL + '/rest/v2/administration/approvals/read',
                method: "POST",
                data: query,
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

                $scope.data = data;
				var NewData = data.NewData;
				NDXML = hex2a(NewData);
				NDJSON = convertXml2JSon(NDXML);
				var mainKey = getMainKeysFromJSON(NDJSON);
				var finalLabels = getKeysFromJSONPerRoleNTable(NDJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
				$scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
				$scope.createfirst($scope.FinalDataArray[0]);
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                CommonService.refDataApproved.flag = false;
				// $scope.alerts = [{
				// 	type: 'danger',
				// 	msg: data.error.message
				// }];
				// $timeout(function () {
				// 	$scope.alertStyle = alertSize().headHeight;
				// 	$scope.alertWidth = alertSize().alertWidth;
				// }, 100)
				// errorservice.ErrorMsgFunction(config, $scope, $http, status)
           
            });


		
		} else if ($scope.data.TableName == 'PaymentControlData') {

            if (dataa) {
                if (Object.keys(dataa).indexOf('ReconForceComplete') !== -1) {
                    if (Object.keys(dataa.ReconForceComplete).indexOf('Account') !== -1) {


                        NDXML = hex2a(NewData);
                        NDJSON = convertXml2JSon(NDXML);

                        NDJSON['PaymentControlData']['Account'] = dataa['ReconForceComplete']['Account']

                        var mainKey = getMainKeysFromJSON(NDJSON);
                        var finalLabels = getKeysFromJSON(NDJSON);


                        $scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
                    }

                } else {

                    if ($scope.checkOdataLength == '0') {
                        ODXML = hex2a(OldData);
                        ODJSON = convertXml2JSon(ODXML);
                        var mainKey = getMainKeysFromJSON(ODJSON);
                        var finalLabels = getKeysFromJSON(ODJSON);
                        $scope.FinalDataArraypcd = getFinalData(Oldarr, ODJSON[mainKey], finalLabels)
                    }
                    NDXML = hex2a(NewData);
                    NDJSON = convertXml2JSon(NDXML);
                    var mainKey = getMainKeysFromJSON(NDJSON);
                    var finalLabels = getKeysFromJSON(NDJSON);
                    $scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)

                }

            } else {

                NDXML = hex2a(NewData);
                NDJSON = convertXml2JSon(NDXML);
                var mainKey = getMainKeysFromJSON(NDJSON);
                var finalLabels = getKeysFromJSON(NDJSON);
                $scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
            }


        } else {
            NDXML = hex2a(NewData);
            NDJSON = convertXml2JSon(NDXML);
            var mainKey = getMainKeysFromJSON(NDJSON);
            var finalLabels = getKeysFromJSON(NDJSON);
            $scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)

            if ($scope.FinalDataArray) {
                for (i in $scope.FinalDataArray) {
                    if ($scope.FinalDataArray[i].label == 'MandateSchemeData') {

                        if (Object.keys($scope.FinalDataArray[i]).indexOf('updatedData') !== -1) {

                            $scope.objectvalue = JSON.parse($scope.FinalDataArray[i].updatedData)
                            $scope.FinalDataArray[i].updatedData = $scope.objectvalue
                        }
                    }
                }
            }
        }
    }


	$scope.initialCall = function (data) {
		var retData = {};
		retData.label = data.label;
		if (typeof (data.updatedData) == 'string') {
			retData.isArr = false;
			retData.updatedData = data.updatedData;
		} else {
			retData.isArr = true;
			var values = [];
			for (var k in data.updatedData) {
				var obj = { fieldname: k, value: data.updatedData[k] };
				values.push(obj);
			}
			retData.updatedData = values;
		}
		return retData;
	}

    $scope.opentab = function (event, index, key) {
		$(".tablinks").removeClass('active')
		$(event.currentTarget).addClass('active')
		$scope.arrayValue = $scope.initialCall(key);
	}
	$scope.createfirst = function (data) {
		$scope.arrayValue = $scope.initialCall(data);
	}

    if ($scope.data.OldData && $scope.data.NewData) {
      

        var OldData = $scope.data.OldData;
        var NewData = $scope.data.NewData;

        if ($scope.data.TableName == 'BusinessRules') {
            ODXML = OldData;
            NDXML = NewData;
            keyvalueForBR(ODXML, 'ruleOldData')
            keyvalueForBR(NDXML, 'ruleNewData')
            finalLabels = Object.keys(ruleObj['ruleNewData'])
            $scope.checkOdataLength = Object.keys(ruleObj['ruleOldData']).length;
            $scope.FinalDataArray = getFinalData(ruleObj['ruleOldData'], ruleObj['ruleNewData'], finalLabels)
        }else if ($stateParams.input.TableName == 'User Administration') {//For Approval on Edit
			var OldData = $stateParams.input.OldData;
			var NewData = $stateParams.input.NewData;
			ODXML = hex2a(OldData);
			NDXML = hex2a(NewData);
			NDJSON = convertXml2JSon(NDXML);
			var query = {
				UserID: NDJSON.UserProfile.UserID
			}


            $http({
            	url: BASEURL + '/rest/v2/administration/profileuser/ReadApprovalProfile',
                method: "POST",
                data: query,
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
                ODXML = hex2a(OldData);
				ODJSON = convertXml2JSon(ODXML);
				var tmpOldData = convertXml2JSon(hex2a(data.OldData));
				NDXML = hex2a(NewData);
				NDJSON = convertXml2JSon(NDXML);
				var tmpNewData = convertXml2JSon(hex2a(data.NewData));
				ODJSON.UserProfile = Object.assign(ODJSON.UserProfile, tmpOldData.UserRoleDetails);
				NDJSON.UserProfile = Object.assign(NDJSON.UserProfile, tmpNewData.UserRoleDetails);
				var finalLabels = getKeysFromJSONPerRoleNTable(NDJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
				var mainKey = getMainKeysFromJSON(NDJSON);
				var mainKey2 = getMainKeysFromJSON(ODJSON);
				$scope.FinalDataArray = getFinalData(ODJSON[mainKey], NDJSON[mainKey], finalLabels)
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                CommonService.refDataApproved.flag = false;
				$scope.alerts = [{
					type: 'danger',
					msg: data.error.message
				}];
			
           
            });

			ODJSON = convertXml2JSon(ODXML);
			NDJSON = convertXml2JSon(NDXML);
			var finalLabels = getKeysFromJSONPerRoleNTable(NDJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
			var mainKey = getMainKeysFromJSON(NDJSON);
			var mainKey2 = getMainKeysFromJSON(ODJSON);
			if (mainKey != mainKey2) {
				$scope.checkOdataLength = 0;
			} else {
				$scope.checkOdataLength = Object.keys(ODJSON).length;
			}
			var keydiff = jsondiff(ODJSON, NDJSON)
			for (i in keydiff) {
				for (j in keydiff[i]) {
					if (keydiff[i][j] == undefined) {
						var index = Object.keys(ODJSON[i]).indexOf(j);
						finalLabels.splice(index, 0, j);
					}
				}
			}
			if (ODJSON[mainKey] != undefined) {
				$scope.FinalDataArray = getFinalData(ODJSON[mainKey], NDJSON[mainKey], finalLabels)
			} else {
				viewNewAppData();
			}
		} else if ($stateParams.input.TableName == 'Role Management') {
		
			var query = { "ApprovalID": $stateParams.input.ApprovalID }




            $http({
            	url: BASEURL + '/rest/v2/administration/approvals/read',
                method: "POST",
                data: query,
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
                var OldData = data.OldData;
				var NewData = data.NewData;
				ODXML = hex2a(OldData);
				ODJSON = convertXml2JSon(ODXML);
				var tmpOldData = convertXml2JSon(ODXML);
				NDXML = hex2a(NewData);
				NDJSON = convertXml2JSon(NDXML);
				var tmpNewData = convertXml2JSon(NDXML);
				var oldfinalLabels = getKeysFromJSONPerRoleNTable(ODJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
				var newfinalLabels = getKeysFromJSONPerRoleNTable(NDJSON, $stateParams.input.TableName, sessionStorage.ROLE_ID);
				var finalLabels = oldfinalLabels.concat(newfinalLabels);
				var finalLabels = finalLabels.filter(function (item, index, inputArray) {
					if (inputArray.indexOf('EffectiveTillDate') != -1) {
						var swap = function (inputArray, indexA, indexB) {
							var temp = inputArray[indexA];
							inputArray[indexA] = inputArray[indexB];
							inputArray[indexB] = temp;
						};
						swap(inputArray, (inputArray.indexOf('EffectiveFromDate') + 1), inputArray.indexOf('EffectiveTillDate'));
					}
					return inputArray.indexOf(item) == index;
				});
				var mainKey = getMainKeysFromJSON(NDJSON);
				var mainKey2 = getMainKeysFromJSON(ODJSON);
				$scope.FinalDataArray = getFinalData(ODJSON[mainKey], NDJSON[mainKey], finalLabels)
				$scope.first($scope.FinalDataArray[0]);
            }).catch(function onError(response) {
                // Handle error
        
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                CommonService.refDataApproved.flag = false;
            	$scope.alerts = [{
					type: 'danger',
					msg: data.error.message
				}];




           
            });






		} else {
            ODXML = hex2a(OldData);
            NDXML = hex2a(NewData);
            ODJSON = convertXml2JSon(ODXML);
            NDJSON = convertXml2JSon(NDXML);
            var finalLabels = getKeysFromJSON(NDJSON);
            var mainKey = getMainKeysFromJSON(NDJSON);
            var mainKey2 = getMainKeysFromJSON(ODJSON);
            if (mainKey != mainKey2) {
                $scope.checkOdataLength = 0;
            } else {

                $scope.checkOdataLength = Object.keys(ODJSON).length;
            }

            var keydiff = jsondiff(ODJSON, NDJSON)
            for (i in keydiff) {
                for (j in keydiff[i]) {
                    if (keydiff[i][j] == undefined) {
                        var index = Object.keys(ODJSON[i]).indexOf(j);
                        //finalLabels[index] = j;
                        finalLabels.splice(index, 0, j);

                    }
                }
            }


            if (ODJSON[mainKey] != undefined) {
                $scope.FinalDataArray = getFinalData(ODJSON[mainKey], NDJSON[mainKey], finalLabels)

                if ($scope.FinalDataArray) {
                    for (i in $scope.FinalDataArray) {

                        if ($scope.FinalDataArray[i].label == 'MandateSchemeData') {

                            if (Object.keys($scope.FinalDataArray[i]).indexOf('updatedData') !== -1) {

                                $scope.objectvalue = JSON.parse($scope.FinalDataArray[i].updatedData)
                                $scope.FinalDataArray[i].updatedData = $scope.objectvalue


                            }
                            if (Object.keys($scope.FinalDataArray[i]).indexOf('currentData') !== -1) {

                                $scope.objectvalue = JSON.parse($scope.FinalDataArray[i].currentData)
                                $scope.FinalDataArray[i].currentData = $scope.objectvalue


                            }
                        }
                    }

                }

            } else {

                if ($scope.data.TableName == 'PaymentControlData') {
                    viewNewAppData(ODJSON);
                } else {
                    viewNewAppData();
                }

            }
        }
    } else {
        viewNewAppData();
    }

    $scope.editinitialCall = function (data) {
	
		var retData = {};
		retData.label = data.label;

		if (typeof (data.currentData) == 'string') {
        
            if (data.currentData.indexOf("{") != -1) {
				retData.isArr = true;
				retData.currentData = JSON.parse(data.currentData);
	
				var values = [];
				for (var k in retData.currentData) {
					var obj = { fieldname: k, value: retData.currentData[k] };
					values.push(obj);
				}
				retData.currentData = values;

			} else {
				retData.isArr = false;
				retData.currentData = data.currentData;
			
			}
			// retData.isArr = false;

			// retData.currentData = data.currentData;
		

		} else {
			retData.isArr = true;
			var values = [];
		
			for (var x in data.currentData) {
			
				var obj = { fieldname: x, value: data.currentData[x] };
				values.push(obj);
			}
			retData.currentData = values;
		}
		
		if (typeof (data.updatedData) == 'string') {
			if (data.updatedData.indexOf("{") != -1) {
				retData.isArr = true;
				retData.updatedData = JSON.parse(data.updatedData);
	
				var values = [];
				for (var k in retData.updatedData) {
					var obj = { fieldname: k, value: retData.updatedData[k] };
					values.push(obj);
				}
				retData.updatedData = values;

			} else {
				retData.isArr = false;
				retData.updatedData = data.updatedData;
			
			}
		}
	
		return retData;

	}
	$scope.editopentab = function (event, index, key) {
		if (typeof (key.updatedData) == 'object') {
		
			key.updatedData = JSON.stringify(key.updatedData);
		
		} else {
			key.updatedData = key.updatedData;
		}
       
		$(".tablinks").removeClass('active')
		$(event.currentTarget).addClass('active')
	
		if (key.diffence == true) {
			$("#newdata").addClass("td_diff");
		
		} else {
		
			$("#newdata").removeClass("td_diff");
		}
	
		$scope.arrayValue = $scope.editinitialCall(key);

	}

	$scope.first = function (data) {
		$scope.arrayValue = $scope.editinitialCall(data);

	}

    //if ( $scope.data.State == 'CREATED' || $scope.data.State == 'Instruction Uploaded' || $scope.data.State == 'File Uploaded' || $scope.data.State == 'Request For Information Generated' || $scope.data.State == 'Response To Request For Information Generated' || $scope.data.State == 'Return Of Funds Generated' || $scope.data.State == 'Response To Return Of Funds Generated' || $scope.data.State == 'Response To Request For Payment Generated') {

    // if($scope.stateArr.indexOf($scope.data.State) != -1)
    // {		

    //}

    var newObj = {
        "FDCParameters": {
            "oldData": [],
            "newData": []

        },
        "PDCParameters": {
            "oldData": [],
            "newData": []
        },
        "AdditionalConfig": {
            "oldData": [],
            "newData": []
        }
    }

    var key = '';

    function iterate(obj, label, dType, key) {

        for (var property in obj) {
            if (typeof(obj[property]) == 'object') {

                newObj[label][dType].push({
                    'key': property,
                    'value': JSON.stringify(obj[property]),
                    'isobject': true
                })

            } else {
                newObj[label][dType].push({
                    'key': property,
                    'value': obj[property],
                    'isobject': false
                })
            }

        }
    }
    $scope.sendXML = function(getval, label, dType) {

        var data = (dType == 'oldData') ? getval['currentData'] : (getval['updatedData']) ? getval['updatedData'] : '';
        if ((data.indexOf('<') != -1) || (data.indexOf('{') != -1)) {
            if (data) {
                if (data.indexOf('<') != -1) {
                    $scope.FdcPdcparam = convertXml2JSon(data)
                } else {
                    $scope.FdcPdcparam = JSON.parse(data);
                }
                iterate($scope.FdcPdcparam, label, dType)
            }
        } else {
            $timeout(function() {
                $('#' + getval.Origlabel + dType).html(data)
            }, 100)
        }
    }

    setTimeout(function() {
        for (var i in newObj) {
            for (var j in newObj[i]) {
                for (var k in newObj[i][j]) {
                    keyArrObj[i][j].push(newObj[i][j][k].key)
                }
            }
        }

        for (var i in keyArrObj) {
            for (var j in keyArrObj[i]) {
                keyArrObj[i][j].forEach(function(k) {
                    count[i][j][k] = (count[i][j][k] || 0) + 1;
                });
            }
        }

        for (var i in count) {
            //nn = [];
            newNN = [{
                'label': '',
                'arr': []
            }]

            for (var j in count[i]) {
                //nn = [];
                newNN = [{
                    'label': '',
                    'arr': []
                }]

                for (var k in newObj[i][j]) {

                    for (var l in count[i][j]) {

                        if ((l == newObj[i][j][k].key) && (count[i][j][l] == 1)) {
                            //nn = [];
                            newNN = [{
                                'label': '',
                                'header': '',
                                'arr': []
                            }]
                            $scope.paramval[i][j].push({
                                'key': l,
                                'value': newObj[i][j][k].value,
                                'isobject': newObj[i][j][k].isobject
                            })
                        } else if ((l == newObj[i][j][k].key) && (count[i][j][l] != 1)) {
                            newNN[0].label = l;
                            newNN[0].arr.push(newObj[i][j][k].value)
                        }

                    }
                }

                for (var x in newNN) {
                    $scope.paramval[i][j].push({
                        'key': newNN[x].label,
                        'value': newNN[x].arr,
                    })

                }
            }

        }


        var tD = "";
        var list = '';
        var inTable, inTd, prevLabel = '';
        var rowSpan = 0;
        var nPrev = '';


        for (var i in $scope.paramval) {
            tD = "";
            list = "";
            for (var j in $scope.paramval[i]) {
                tD = "";
                list = "";

                for (var k in $scope.paramval[i][j]) {

                    if ($scope.paramval[i][j][k].value instanceof Array && !$scope.paramval[i][j][k].isobject) {
                        for (var m = 0; m < $scope.paramval[i][j][k].value.length; m++) {
                            list = list + "<li>" + $scope.paramval[i][j][k].value[m] + "</li>"
                        }
                        if ($scope.paramval[i][j][k].key) {
                            tD = tD + "<tr><td>" + $scope.paramval[i][j][k].key + "</td>" + "<td><ul>" + list + "</ul></td></tr>"

                        }

                    } else if ($scope.paramval[i][j][k].isobject) {

                        inTable = '';
                        inTd = '';
                        prevLabel = '';
                        rowSpan = '';
                        var nObj = [];
                        inTd = '';
                        list = ''
                        var iList = '';

                        $scope.paramval[i][j][k].value = JSON.parse($scope.paramval[i][j][k].value)
                        for (var m = 0; m < $scope.paramval[i][j][k].value.length; m++) {

                            for (var x in $scope.paramval[i][j][k].value[m]) {
                                nObj.push({
                                    key: x,
                                    val: $scope.paramval[i][j][k].value[m][x]
                                })

                            }
                        }

                        if (i != 'AdditionalConfig') {
                            var res = nObj.reduce(function(res, currentValue) {
                                if (res.indexOf(currentValue.key) === -1) {
                                    res.push(currentValue.key);
                                }
                                return res;
                            }, []).map(function(key) {
                                return {
                                    key: key,
                                    val: nObj.filter(function(_el) {
                                        return _el.key === key;
                                    }).map(function(_el) {
                                        return _el.val;
                                    })
                                }
                            });




                            var listFlag = false;
                            for (var t in res) {
                                for (var u in res[t].val) {
                                    if (res[t].val.length == 1) {
                                        listFlag = false;
                                        list = list + "<li class='tableRow'><span>" + res[t].key + "</span>" + "<span class='tableCell'>" + res[t].val[u] + "</span></li>"
                                    } else {
                                        listFlag = true;
                                        iList = iList + "<li>" + res[t].val[u] + "</li>"



                                    }

                                }

                                if (listFlag) {
                                    list = list + "<li><b>" + res[t].key + "</b><ul class='innerlist'>" + iList + "</ul></li>"
                                }
                            }


                            tD = tD + "<tr><td>" + $scope.paramval[i][j][k].key + "</td>" + "<td><ul>" + list + "</ul></td></tr>"

                        } else {
                            for (s in nObj) {
                                list = list + "<li class='tableRow " + (nObj[0].key == nObj[s].key ? 'borderCls' : '') + "'><span>" + nObj[s].key + "</span><span class='tableCell'>" + nObj[s].val + "</span></li>";

                                // list = list + "<li class='tableRow' " + 'ng-class' +"="+(nObj[0].key == nObj[s].key ? 'cls1' : 'cls2'  )+" ><span>" +nObj[s].key+"</span>"+ "<span class='tableCell'>"+nObj[s].val + "</span></li>"

                            }
                            tD = tD + "<tr><td>" + $scope.paramval[i][j][k].key + "</td>" + "<td><ul>" + list + "</ul></td></tr>";
                        }
                    } else {
                        tD = tD + "<tr><td class=" + k + ">" + $scope.paramval[i][j][k].key + "</td>" + "<td>" + $scope.paramval[i][j][k].value + "</td></tr>"
                    }

                }
                $('#' + i + j).html("<table class='table table-bordered dynamicborder'><tbody><tr><th colspan='2'>" + $scope.paramval[i].header + "</th></tr>" + tD + "</tbody></table>")

            }
        }



        $('.tableRow').parent().css({
            'display': 'table',
            'width': '100%'
        });


        if ($(".dynamicborder").find("ul").find("li:first").hasClass("borderCls")) {
            $(".dynamicborder").find("ul").find("li:first").removeClass("borderCls")
        }
        // $('.borderCls').each(function(index,item){
        // 	if(parseInt(index)%2 != 0 && index != 0)
        // 	{

        // 		$($('.borderCls')[index+1]).css("background-color","rgb(242, 242, 242)");
        // 	}
        // });


    }, 100)



    function getFinalData(ODJSON, NDJSON, finalLabels) {

        var approvalDataArray = [];
        if (Object.keys(ODJSON).length > 0) {
            for (i = 0; i < finalLabels.length; i++) {
                var tempObj = {};



                if ((ODJSON[finalLabels[i]]) != undefined) {
                    if (typeof ODJSON[finalLabels[i]] == "object" || typeof NDJSON[finalLabels[i]] == "object") {
                        NDJSON[finalLabels[i]] = JSON.stringify(NDJSON[finalLabels[i]])
                        ODJSON[finalLabels[i]] = JSON.stringify(ODJSON[finalLabels[i]])
                    }

                    if (NDJSON[finalLabels[i]] != ODJSON[finalLabels[i]]) {
                        tempObj.label = finalLabels[i];
                        tempObj.Origlabel = finalLabels[i];
                        tempObj.updatedData = NDJSON[finalLabels[i]];
                        tempObj.currentData = ODJSON[finalLabels[i]];
                        tempObj.diffence = true;
                    } else {
                        tempObj.label = finalLabels[i];
                        tempObj.Origlabel = finalLabels[i];
                        tempObj.updatedData = NDJSON[finalLabels[i]];
                        tempObj.currentData = ODJSON[finalLabels[i]];
                        tempObj.diffence = false;
                    }
                } else {
                    tempObj.label = finalLabels[i];
                    tempObj.Origlabel = finalLabels[i];

                    tempObj.updatedData = NDJSON[finalLabels[i]];
                    tempObj.currentData = "";
                    tempObj.diffence = true;
                }
                approvalDataArray.push(tempObj);
            }

        } else {
            for (j = 0; j < finalLabels.length; j++) {
                var tempObj = {};
                tempObj.label = finalLabels[j];
                tempObj.Origlabel = finalLabels[j];
                tempObj.updatedData = NDJSON[finalLabels[j]];
                tempObj.currentData = ODJSON[finalLabels[j]];
                tempObj.diffence = false;
                approvalDataArray.push(tempObj);

            }
        }

        $scope.bankDataArr.forEach(function(val) {
            if ((val.Name == $scope.data.TableName) && (val.Link != 'methodofpayments')) {
                crudRequest("GET", val.Link + '/metainfo', "").then(function(response) {

                    Meta_Info_CallData(response)

                    $scope.fieldDetails.forEach(function(val) {
                        for (var j in approvalDataArray) {
                            if ($scope.data.TableName != 'BusinessRules') {
                                if (val.FieldName == approvalDataArray[j].label) {
                                    approvalDataArray[j].Origlabel = angular.copy(approvalDataArray[j].label);
                                    approvalDataArray[j].label = val.Label;

                                }

                            } else if ($scope.data.TableName == 'BusinessRules') {
                                if (val.FieldName.toUpperCase() == approvalDataArray[j].label) {
                                    approvalDataArray[j].Origlabel = angular.copy(approvalDataArray[j].label);
                                    approvalDataArray[j].label = val.Label;
                                }
                            }
                        }
                        if (val.FieldName == 'AdditionalConfig') {

                            var InputFormat_val, PartyCode_val, ServiceCode_val;
                            $scope.FinalDataArray.forEach(function(value) {
                                if (value.Origlabel == 'InputFormat') {
                                    InputFormat_val = value.updatedData;
                                } else if (value.Origlabel == 'PartyCode') {
                                    PartyCode_val = value.updatedData;
                                } else if (value.Origlabel == 'ServiceCode') {
                                    ServiceCode_val = value.updatedData;
                                }
                            })

                            crudRequest("GET", 'psa/checkadditinalconfig?InputFormat=' + InputFormat_val + '&PartyCode=' + PartyCode_val + '&ServiceCode=' + ServiceCode_val, "").then(function(response) {
                                Meta_Info_CallData(response)
                                    /*$scope.fieldDetails.forEach(function (fielddata) {
                                        if ($scope.paramval.AdditionalConfig) {
                                            $scope.paramval.AdditionalConfig.newData.forEach(function (keyvalue, index) {
                                                if (fielddata.FieldName == keyvalue.key) {
                                                    $("." + index).text(fielddata.Label)
                                                }
                                            })
                                        }
                                    })*/
                                setTimeout(function() {
                                    var index = 0;
                                    var old_data_index = 0;
                                    $scope.fieldDetails.forEach(function(fielddata) {
                                        if ($scope.paramval.AdditionalConfig) {
                                            $scope.paramval.AdditionalConfig.newData.forEach(function(keyvalue) {
                                                if (fielddata.FieldName == keyvalue.key) {
                                                    var _tdcount = $("." + index).length - 1;
                                                    $($("." + index)[_tdcount]).each(function() {
                                                        $(this).text(fielddata.Label);
                                                        $(this).next().text(keyvalue.value)
                                                    })
                                                    index += 1;
                                                }
                                            })
                                            $scope.paramval.AdditionalConfig.oldData.forEach(function(keyvalue) {
                                                if (fielddata.FieldName == keyvalue.key) {
                                                    $($("." + old_data_index)[0]).each(function() {
                                                        $(this).text(fielddata.Label);
                                                        $(this).next().text(keyvalue.value)
                                                    })
                                                    old_data_index += 1;
                                                }
                                            })

                                        }
                                    })
                                }, 100)

                            })
                        }
                    })


                    return approvalDataArray;
                })
            } else if ((val.Link == 'methodofpayments') && (val.Name == $scope.data.TableName)) {
                crudRequest("GET", val.Link + '/metainfo', "").then(function(response) {
                    var fieldset = false;
                    var FieldGroupval = 0;
                    $scope.colspanArr = [];
                    var obtainedFields = response.data.data.Data.webformuiformat.fields.field;
                    for (k in obtainedFields) {
                        if (obtainedFields[k].name == "FieldGroup" || obtainedFields[k].name == "FieldGroupEnd") {
                            fieldset = 'fieldGroup1' in obtainedFields[k] ? obtainedFields[k].fieldGroup1.webformsectiongroup : false;
                            if (obtainedFields[k].name == "FieldGroup") {
                                FieldGroupval = k;
                            }
                            if (obtainedFields[k].name == "FieldGroupEnd") {
                                $scope.colspanArr.push(k - FieldGroupval - 1)
                            }
                        } else {
                            buildFields(obtainedFields[k], fieldset)
                        }
                    }

                    $scope.fieldDetails.forEach(function(val) {
                        for (var j in approvalDataArray) {
                            if (val.FieldName == approvalDataArray[j].label) {
                                approvalDataArray[j].label = val.Label
                            }
                        }
                    })
                    return approvalDataArray;

                })
            }
        })

        return approvalDataArray;
    };

    $scope.is_hexadecimal = function(str) {
        regexp = /^[0-9a-fA-F]+$/;

        if (regexp.test(str)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.atobConversion = function(data) {
        return atob(data)
    };

    function isHex(s) {
        return /[0-9A-Fa-f]{6}/g.test(s);
    }

    function isXML(xml) {
        try {
            return $.parseXML(xml);
        } catch (err) {
            return false;
        }
    }
})

angular.module('VolpayApp').filter('highlightchanges', function($sce) {
    return function(value, comparevalue) {
        var valueArr = value.split('\n');
        var comparevalueArr = comparevalue.split('\n');
        for (var val in valueArr) {
            if (valueArr[val] !== comparevalueArr[val]) {
                valueArr[val] = "<mark style='background-color: #ffffb8;'>" + valueArr[val] + "</mark>";
            }
        }
        return $sce.trustAsHtml(valueArr.join(''));
    };
});
