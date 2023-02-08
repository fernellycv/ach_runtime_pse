angular.module('VolpayApp').controller('viewBankData', function($scope, $state, $timeout, $rootScope, $stateParams, $filter, $http, bankData, GlobalService, EntityLockService, LogoutService, errorservice, GetPermissions) {
    $scope.newPermission = GetPermissions($stateParams.input.gotoPage.Name);
    $scope.masking = true;
    $scope.auditError404 = true
    $scope.parentInput = $stateParams.input;
    $scope.fieldData = ($stateParams.input.fieldData) ? $stateParams.input.fieldData : {};
    $scope.IconName = ($scope.parentInput.gotoPage.IconName) ? $scope.parentInput.gotoPage.IconName : ''
    
    EntityLockService.flushEntityLocks();

    $scope.Section = angular.copy($scope.parentInput.pageInfo.Section)

    for (i in $scope.Section) {
        if ($scope.parentInput.pageTitle == 'Mandate') {

            if ($scope.Section[i]['dateformat'] == 'ImageUpload') {

                $scope.Imgfile = $scope.fieldData[$scope.Section[i]['FieldName']]

                if ($scope.Imgfile) {
                    if ($scope.Imgfile.indexOf('data:application/pdf') !== -1) {
                        $scope.filenameinurl = $scope.fieldData['AggrementImageName']

                        $scope.Viewfilelink = function() {

                            var pdfWindow = window.open("")
                            pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $scope.Imgfile + "'></iframe>")
                                // "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                                // encodeURI(yourDocumentBase64VarHere) + "'></iframe>"

                        }
                        $scope.pdfview = true
                    }
                    if ($scope.Imgfile.indexOf('data:image/jpeg') !== -1) {
                        $scope.jpegview = true
                        $scope.imagname = $scope.fieldData.AggrementImageName
                    }
                    if ($scope.Imgfile.indexOf('data:image/png;') !== -1) {
                        $scope.imagname = $scope.fieldData.AggrementImageName
                        $scope.pnggview = true
                    }
                }
            }


            if ($scope.Section[i].FieldName.indexOf('MandateSchemeData') !== -1) {

                $scope.obej = $scope.fieldData[$scope.Section[i]['FieldName']]
                if ($scope.obej) {
                    if ($scope.obej.indexOf('D_Signature') !== -1) {

                        $scope.ShowforDsignature = true

                        $scope.objvalue = JSON.parse($scope.obej)
                        $scope.Dvalue = JSON.parse($scope.obej).D_Signature

                        if ($scope.Dvalue.indexOf('data:application/pdf') !== -1) {
                            $scope.filenameinurl_ = $scope.objvalue.D_SignatureName

                            $scope.Viewfilelink_ = function() {
                                var pdfWindow = window.open("")
                                pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $scope.Dvalue + "'></iframe>")

                            }
                            $scope.pdfview_ = true
                        }

                        if ($scope.Dvalue.indexOf('data:image/jpeg') !== -1) {
                            $scope.filenameinurl_img = $scope.objvalue.D_SignatureName
                            $scope.ViewFile_ = function() {

                                $scope.ViewFile($scope.Dvalue)
                            }
                            $scope.jpegview_ = true

                        }
                        if ($scope.Dvalue.indexOf('data:image/png;') !== -1) {
                            $scope.filenameinurl_img = $scope.objvalue.D_SignatureName

                            $scope.ViewFile_ = function() {
                                $scope.ViewFile($scope.Dvalue)

                            }
                            $scope.pnggview_ = true
                        }


                    } else {
                        $scope.ShowforDsignature = true

                        $scope.objvalue_ = JSON.parse($scope.obej)



                        $scope.ShowforDsignature = false
                    }

                }

            }
        }


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
        if($scope.parentInput.primarykey && $scope.parentInput.primarykey.length > 0) {
            for (let i = 0; i < $scope.parentInput.primarykey.length; i++) {               
                data.BusinessPrimaryKey[$scope.parentInput.primarykey[i]] = viewParam.fieldData ? viewParam.fieldData[$scope.parentInput.primarykey[i]] : '';
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
                $scope.alerts1 = [{
                    type: 'danger',
                    msg: errMsg
                }];
            }
         }); 
         $('.my-tooltip').tooltip('hide');
    }
    
    $scope.ViewFile = function(flag) {



        for (i in $scope.Section) {

            if ($scope.Section[i]['dateformat'] == 'ImageUpload') {

                if (flag) {

                    $scope.Imgfile = flag
                } else {

                    $scope.Imgfile = $scope.fieldData[$scope.Section[i]['FieldName']]
                }

                var imgupload = document.getElementById('preview')

                imgupload.setAttribute('src', sanitize($scope.Imgfile));
                $(sanitize("#preview")).show();

            }
        }
    }




    $scope.ParentIconName = ($stateParams.input.gotoPage.ParentIcon) ? $stateParams.input.gotoPage.ParentIcon : ''
        //if(('FDCParameters' in $scope.fieldData) && ($scope.fieldData['FDCParameters'].match(/</g)) && ($scope.fieldData['FDCParameters'].match(/>/g))){
    $scope.showPageTitle = $filter('removeSpace')(($stateParams.input.gotoPage.Name) ? $stateParams.input.gotoPage.Name : '');
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle';

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    $scope.gotoState = function(inputData) {
        $scope.parentInput['Operation'] = inputData['Operation']
        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.urlOperation = $filter('removeSpace')($stateParams.input.Operation).toLowerCase();
        params.input = $scope.parentInput;
        params.query = $scope.parentInput.ulName.replace(/\s+/g, '');
        $state.go('app.operation', params);
        $('.my-tooltip').tooltip('hide');
    }

    $scope.gotoParent = function(alertMsg) {
        $scope.input = {
            'gotoPage': $stateParams.input.gotoPage,
            'responseMessage': alertMsg
        }
        params = {};
        params.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.query = $scope.parentInput.ulName.replace(/\s+/g, '');
        params.input = $scope.input;
        $state.go('app.bankData', params);
    }

    /** List and Grid view Ends**/
    $scope.restResponse = {};

    function crudRequest(_method, _url, _data, _query) {
        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _query
        }).then(function(response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }
            return $scope.restResponse
        }, function(error) {

            /* if (error.status == 401) {
            	
            } */
            errorservice.ErrorMsgFunction(error, $scope, $http, error.status)
            $scope.restResponse = {
                'Status': 'Error',
                'data': error.data.error.message
            }
            $('.modal').modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: error.data.error.message //Set the message to the popup window
            }];
            return $scope.restResponse
        })
    }

    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete $scope.fieldData.$$hashKey
        $scope.delval = {}
        for (var j in $scope.parentInput.primarykey) {
            $scope.delval[$scope.parentInput.primarykey[j]] = $scope.fieldData[$scope.parentInput.primarykey[j]]
        }

        crudRequest("POST", $scope.parentInput.parentLink + '/delete', $scope.delval).then(function(response) {
            $scope.auditError404 = true;
            if (response.Status === 'Success') {
                $scope.gotoParent(response.data.data.responseMessage ? response.data.data.responseMessage : "Borrado exitosamente");
            }
        })
    }
    $scope.editedLog = [];
    $scope.dataLen = [];
    $scope.auditVal = {}
    for (var j in $scope.parentInput.primarykey) {
        $scope.auditVal[$scope.parentInput.primarykey[j]] = $scope.fieldData[$scope.parentInput.primarykey[j]]
    }
    if ($scope.parentInput.parentLink != 'logconfig') {
        crudRequest("POST", $scope.parentInput.parentLink + '/audit/readall', $scope.auditVal, {
            'start': 0,
            'count': 20
        }).then(function(response) {
            $scope.convertXmltoJson(response)
        })
    }

    $scope.convertXmltoJson = function(argu) {
        if ((argu.Status == 'Error') && (!argu.data.data)) {
            $scope.auditError404 = false;
        } else {
            for (var j in argu.data.data) {
                for (var keyj in argu.data.data[j]) {
                    if (keyj == 'oldData' || keyj == 'newData') {
                        argu.data.data[j][keyj] = $filter('hex2a')(argu.data.data[j][keyj])
                        if (argu.data.data[j][keyj].match(/</g) && argu.data.data[j][keyj].match(/>/g)) {
                            var xmlDoc;
                            if (argu.data.data[j].tableName == "PartyServiceAssociation") {
                                if ($(sanitize(argu.data.data[j][keyj])) && $(sanitize(argu.data.data[j][keyj])).find('FDCParameters').html() && $(sanitize(argu.data.data[j][keyj])).find('FDCParameters').html().indexOf('<!--?') != -1) {
                                    var _fdcStringfy = argu.data.data[j][keyj].substring(argu.data.data[j][keyj].indexOf('<FDCParameters>') + '<FDCParameters>'.length, argu.data.data[j][keyj].indexOf('</FDCParameters>'))
                                    argu.data.data[j][keyj] = argu.data.data[j][keyj].replace(_fdcStringfy, JSON.stringify(convertXml2JSon(_fdcStringfy)))
                                }
                                if ($(sanitize(argu.data.data[j][keyj])) && $(sanitize(argu.data.data[j][keyj])).find('PDCParameters').html() && $(sanitize(argu.data.data[j][keyj])).find('PDCParameters').html().indexOf('<!--?') != -1) {
                                    var _fdcStringfy = argu.data.data[j][keyj].substring(argu.data.data[j][keyj].indexOf('<PDCParameters>') + '<PDCParameters>'.length, argu.data.data[j][keyj].indexOf('</PDCParameters>'))
                                    argu.data.data[j][keyj] = argu.data.data[j][keyj].replace(_fdcStringfy, JSON.stringify(convertXml2JSon(_fdcStringfy)))
                                }
                            }
                            var demoval = convertXml2JSon(argu.data.data[j][keyj])
                            if (!demoval) {
                                xmlDoc = argu.data.data[j][keyj] ? argu.data.data[j][keyj] : '';
                                if (xmlDoc) {
                                    var newTxt = xmlDoc.split('<');
                                    var genkeys = []
                                    for (var i = 1; i < newTxt.length; i++) {
                                        if (newTxt[i].split('>')[0] && newTxt[i].split('>')[0].indexOf('/') == -1) {
                                            genkeys.push(newTxt[i].split('>')[0])
                                        }
                                    }
                                    var constuctfromXml = {};
                                    var constuctfromXmlObj = {};
                                    var constuctfromXmlarr = [];
                                    $(sanitize(xmlDoc)).children().each(function(e) {
                                        $(this).each(function(e) {
                                            for (var keys in genkeys) {
                                                if (genkeys[keys].toUpperCase() == $(this).prop("tagName")) {
                                                    var parentName = genkeys[keys];
                                                }
                                            }
                                            if ($(this).children().length) {
                                                constuctfromXml[parentName] = constuctfromXmlarr
                                                $(this).children().each(function(e) {
                                                    for (var keys in genkeys) {
                                                        if (genkeys[keys].toUpperCase() == $(this).prop("tagName")) {
                                                            constuctfromXmlObj[genkeys[keys]] = $(this).text()
                                                        }
                                                    }
                                                })
                                                constuctfromXmlarr.push(constuctfromXmlObj)
                                                constuctfromXmlObj = {}
                                            } else {
                                                constuctfromXml[parentName] = $(this).text()
                                            }
                                        })
                                    });
                                    argu.data.data[j][keyj] = constuctfromXml;
                                }
                            } else {
                                for (var expout in demoval) {
                                    argu.data.data[j][keyj] = demoval[expout]
                                }
                            }


                        } else {
                            argu.data.data[j][keyj] = (argu.data.data[j][keyj].indexOf('{') != -1) ? JSON.parse(argu.data.data[j][keyj]) : false
                        }
                    }
                }
            }
            $scope.editedLog = $scope.editedLog.concat(argu.data.data)
            $scope.dataLen = $scope.dataLen.concat(argu.data.data)
        }
    }

    $scope.auditLogDetails = "";
    $scope.commentVal = "";
    $scope.costructAudit = function(argu) {
        // $scope.pdetailsLatestJsonEntries = [];
        // $scope.pdetailsOldJsonEntries = [];
        // $scope.pdetailsNewJsonEntries = [];
        $scope.auditLogDetails = argu
        $('#auditModel').find('tbody').html('')

        if (argu.oldData && argu.newData) {
            $('#auditModel').find('tbody').append('<tr><th>'+$filter('translate')('ApprovalDts.Field')+'</th><th>'+$filter('translate')('ApprovalDts.OldData')+'</th><th>'+$filter('translate')('ApprovalDts.NewData')+'</th></tr>')
        } else {
            $('#auditModel').find('tbody').append('<tr><th>'+$filter('translate')('ApprovalDts.Field')+'</th><th>'+$filter('translate')('ApprovalDts.Data')+'</th></tr>')
        }
        var _keys = ''

        if ($.isPlainObject(argu.oldData) && $.isPlainObject(argu.newData)) {
            _keys = angular.equals(argu.oldData, argu.newData) ? Object.keys(argu.oldData) : Object.keys(argu.newData)
            
            // _keys = (Object.keys(argu.oldData).length >= Object.keys(argu.newData).length) ? Object.keys(argu.oldData) : Object.keys(argu.newData)
        } else if ($.isPlainObject(argu.oldData)) {
            _keys = Object.keys(argu.oldData)
        } else if ($.isPlainObject(argu.newData)) {
            _keys = Object.keys(argu.newData)
        }

        for (var j in _keys) {
            let pdetailsLatestJsonEntries = [];
            let pdetailsOldJsonEntries = [];
            let pdetailsNewJsonEntries = [];
            if (!_keys[j].match(/_PK/g)) {
                var _tr = ""
                if (j % 2) {
                    _tr = "<tr style='background-color: rgb(245, 245, 245)'>"
                } else {
                    _tr = "<tr style='background-color: #fff'>"
                }
                _tr = _tr + "<td>" +$filter('translate')($scope.dataLen[0].tableName+'.'+_keys[j]) + "</td>";
                if (argu.oldData && argu.newData) {
                    if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (typeof(argu.oldData[_keys[j]]) == 'object') {
                            _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                        } else if (argu.tableName != "BusinessRules" && argu.oldData[_keys[j]] && typeof(argu.oldData[_keys[j]]) !== 'number' && argu.oldData[_keys[j]].match('{')) {
                            var _parsedJson = JSON.parse(argu.oldData[_keys[j]])
                            var olddata = ""
                            var oldkeys = Object.keys(_parsedJson);
                            if (oldkeys.length > 0) {
                                for (var i = 0; i < oldkeys.length; i++) {
                                    var eachKey = oldkeys[i];
                                    if (_.isArray(JSON.parse(argu.oldData[_keys[j]])[oldkeys[i]])) {
                                        for (var ii = 0; ii < JSON.parse(argu.oldData[_keys[j]])[oldkeys[i]].length; ii++) {
                                            pdetailsOldJsonEntries.push({ key: eachKey, value: _parsedJson[oldkeys[i]][ii] });
                                        }
                                    } else {
                                        var oldValue = _parsedJson[eachKey];
                                        pdetailsOldJsonEntries.push({ key: eachKey, value: oldValue });
                                    }
                                }
                            }



                            for (var i = 0; i < pdetailsOldJsonEntries.length; i++) {
                                if (typeof(pdetailsOldJsonEntries[i].value) == 'object') {
                                    olddata = olddata + '<div> <span> ' + pdetailsOldJsonEntries[i].key + '</span>  <span>' + ' : ' + ($filter('json')(pdetailsOldJsonEntries[i].value)) + '</span> </div>'
                                } else {

                                    if ($scope.parentInput.pageTitle == 'Mandate') {

                                        if (pdetailsOldJsonEntries[i].key == 'D_Signature') {
                                            if ((pdetailsOldJsonEntries[i].value.indexOf('data:image/jpeg;base64') != -1) || (pdetailsOldJsonEntries[i].value.indexOf('data:image/png;base64') != -1)) {

                                                var imgg = '<img id="preview_" src=" ' + pdetailsOldJsonEntries[i].value + '" height="200px" width="200px" class="img-responsive">'
                                            } else if ((pdetailsOldJsonEntries[i].value.indexOf('data:application/pdf') != -1)) {
                                                var imgg = '<button type="button" ng-if="pdfview"  id="viewbutn__" class="btn btnStyle " ng-click=viewbuttonspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'


                                                $rootScope.pdff_ = pdetailsOldJsonEntries[i].value
                                                $(document).on("click", "#viewbutn__", function(e) {
                                                    var pdfWindow = window.open("")
                                                    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdff_ + "'></iframe>")
                                                })

                                            }


                                            olddata = olddata + '<div> <span> ' + pdetailsOldJsonEntries[i].key + '</span>  <span>' + ' : ' + (imgg) + '</span> </div>'
                                        } else {
                                            olddata = olddata + '<div> <span> ' + pdetailsOldJsonEntries[i].key + '</span>  <span>' + ' : ' + (pdetailsOldJsonEntries[i].value) + '</span> </div>'
                                        }
                                        // olddata = olddata + '<div> <span> ' + $scope.pdetailsOldJsonEntries[i].key + '</span>  <span>' + ' : ' + ($scope.pdetailsOldJsonEntries[i].value) + '</span> </div>'

                                    } else {

                                        olddata = olddata + '<div> <span> ' + pdetailsOldJsonEntries[i].key + '</span>  <span>' + ' : ' + (pdetailsOldJsonEntries[i].value) + '</span> </div>'
                                    }

                                }
                            }
                            if ($scope.parentInput.pageTitle == 'Mandate') {

                                // _tr = _tr + "<table  class='changeClass'>" + $filter('beautify')(olddata) + "</table>"

                                _tr = _tr + "<pre  class='changeClass'>" + $filter('beautify')(olddata) + "</pre>"

                            } else {

                                _tr = _tr + "<pre  class='changeClass'>" + $filter('beautify')(olddata) + "</pre>"
                            }
                        } else if (argu.tableName == "BusinessRules" && _keys[j] == "RuleStructure") {
                            _tr = _tr + "<pre>" + $filter('beautify')(hexToString(argu.oldData[_keys[j]])) + "</pre>"
                        } else {
                            if (argu.oldData[_keys[j]]) {


                                if ($scope.parentInput.pageTitle == 'Mandate') {
                                    if (Object.keys(argu.oldData).indexOf('AggrementImage') !== -1) {

                                        var filedata = argu.oldData['AggrementImage']
                                        var filename = argu.oldData['AggrementImageName']

                                        if (filedata) {
                                            if (filedata.indexOf('data:application/pdf') !== -1) {
                                                $scope.filenameinurll = filename

                                                if (_keys[j] == 'AggrementImage') {

                                                    _tr = _tr + '<button type="button" ng-if="pdfview"  id="viewbuttonspdf" class="btn btnStyle " ng-click=viewbuttonspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'

                                                } else {
                                                    _tr = _tr + argu.oldData[_keys[j]];
                                                }
                                                $("#viewbuttonspdf").click(function() {
                                                    var pdfWindow = window.open("")
                                                    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + filedata + "'></iframe>")

                                                });


                                            }
                                            if (filedata.indexOf('data:image/jpeg') !== -1) {

                                                $scope.imagnamee = filename

                                                if (_keys[j] == 'AggrementImage') {
                                                    // _tr = _tr + '<button type="button"  data-toggle="modal" id="viewbuttons" data-target="#img" class="btn btnStyle " ng-click=viewbuttons()><i class="fa fa-file-image-o " aria-hidden="true "></i>jpg</button>'
                                                    _tr = _tr + '<img id="preview_" src=" ' + filedata + '" height="300px" width="300px" class="img-responsive">'

                                                } else {
                                                    _tr = _tr + argu.oldData[_keys[j]];
                                                }




                                            }
                                            if (filedata.indexOf('data:image/png;') !== -1) {
                                                $scope.imagnamee_ = filename


                                                if (_keys[j] == 'AggrementImage') {
                                                    _tr = _tr + '<img id="preview_" src=" ' + filedata + '" height="300px" width="300px" class="img-responsive">'
                                                } else {
                                                    _tr = _tr + argu.oldData[_keys[j]];
                                                }


                                            }
                                        }

                                    } else {
                                        _tr = _tr + argu.oldData[_keys[j]];
                                    }

                                } else {

                                    _tr = _tr + argu.oldData[_keys[j]];
                                }

                                // _tr = _tr + argu.oldData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                    if (argu.newData) {
                        if (argu.oldData && argu.newData[_keys[j]] != argu.oldData[_keys[j]]) {
                            if (typeof(argu.newData[_keys[j]]) == 'object' && typeof(argu.oldData[_keys[j]]) == 'object') {
                                if (JSON.stringify(argu.newData[_keys[j]]) === JSON.stringify(argu.oldData[_keys[j]])) {
                                    _tr = _tr + "<td>"
                                } else {
                                    _tr = _tr + "<td class=\"modifiedClass\">"
                                }
                            } else {
                                argu.newData[_keys[j]] = argu.newData[_keys[j]] !== undefined && typeof(argu.newData[_keys[j]]) == 'object' ? JSON.stringify(argu.newData[_keys[j]]) : argu.newData[_keys[j]];
                                if (argu.oldData[_keys[j]] !== undefined && argu.newData[_keys[j]] !== undefined && argu.newData[_keys[j]].indexOf('{') != -1) {
                                    var keys = Object.keys(JSON.parse(argu.newData[_keys[j]]));
                                    //var keys = ((argu.newData[_keys[j]].indexOf('{') != -1) ? Object.keys(JSON.parse(argu.newData[_keys[j]])): argu.newData[_keys[j]]);
                                    if (keys.length > 0) {
                                        var old = (!!argu.oldData[_keys[j]] && argu.oldData[_keys[j]].indexOf('{') != -1) ? JSON.parse(argu.oldData[_keys[j]]) : argu.oldData[_keys[j]];
                                        var newkey = (!!argu.newData[_keys[j]] && argu.newData[_keys[j]].indexOf('{') != -1) ? JSON.parse(argu.newData[_keys[j]]) : argu.newData[_keys[j]];
                                        for (var i = 0; i < keys.length; i++) {
                                            var eachKey = keys[i];
                                            if (_.isArray(JSON.parse(argu.newData[_keys[j]])[keys[i]])) {
                                                for (var ii = 0; ii < JSON.parse(argu.newData[_keys[j]])[keys[i]].length; ii++) {
                                                    pdetailsLatestJsonEntries.push({ key: eachKey, value: newkey[keys[i]][ii], highlight: (_.isEqual(old[keys[i]][ii], newkey[keys[i]][ii])) });
                                                }
                                            } else {
                                                // var eachKey = keys[i];
                                                var oldValue = old[eachKey];
                                                var newValue = newkey[eachKey];
                                                var highlightStatus = oldValue == newValue;
                                                if (typeof(newValue) != "number") {
                                                    if (typeof(newValue) == "object") {
                                                        newValue = JSON.stringify(newValue);
                                                    } else {
                                                        newValue = "\"" + newValue + "\"";
                                                    }
                                                }
                                                pdetailsLatestJsonEntries.push({ key: eachKey, value: newkey[eachKey], highlight: highlightStatus });
                                            }
                                        }

                                        _tr = _tr + "<td>"
                                    } else {
                                        _tr = _tr + "<td class=\"modifiedClass\">"
                                    }
                                } else {

                                    if ($scope.parentInput.pageTitle == 'Mandate') {


                                        if (argu.newData[_keys[j]].indexOf('data:image/png;') !== -1) {

                                            var img = '<img id="preview_1" src=" ' + argu.newData[_keys[j]] + '" height="300px" width="300px" class="img-responsive">'

                                            _tr = _tr + ('<td class=\"modifiedClass\">' + img + '</td>')


                                        } else if (argu.newData[_keys[j]].indexOf('data:image/jpeg') !== -1) {

                                            var img = '<img id="preview_1" src=" ' + argu.newData[_keys[j]] + '" height="300px" width="300px" class="img-responsive">'

                                            _tr = _tr + ('<td class=\"modifiedClass\">' + img + '</td>')

                                        } else if (argu.newData[_keys[j]].indexOf('data:application/pdf') !== -1) {
                                            var filenae = argu.newData['AggrementImageName']
                                            var btn = '<button type="button"  id="viewspdf" class="btn btnStyle " ng-click=viewbutnspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'
                                            _tr = _tr + ('<td id="viewbutnspdf" onclick=viewbutnspdf()  class=\"modifiedClass\">' + btn + '</td>')

                                            $rootScope.pdff = argu.newData[_keys[j]]
                                            $(document).on("click", "#viewspdf", function(e) {
                                                var pdfWindow = window.open("")
                                                pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdff + "'></iframe>")
                                            })





                                        } else {

                                            _tr = _tr + "<td class=\"modifiedClass\">"
                                        }

                                    } else {
                                        _tr = _tr + "<td class=\"modifiedClass\">"
                                    }

                                }
                            }
                        } else {

                            if ($scope.parentInput.pageTitle == 'Mandate') {


                                if ((argu.newData[_keys[j]].indexOf('data:image/jpeg') !== -1) && (argu.newData[_keys[j]].indexOf('{') == -1)) {

                                    var img = '<img id="preview_1" src=" ' + argu.newData[_keys[j]] + '" height="300px" width="300px" class="img-responsive">'

                                    _tr = _tr + ('<td >' + img + '</td>')

                                } else if ((argu.newData[_keys[j]].indexOf('data:image/png;') !== -1) && (argu.newData[_keys[j]].indexOf('{') == -1)) {

                                    var img = '<img id="preview_1" src=" ' + argu.newData[_keys[j]] + '" height="300px" width="300px" class="img-responsive">'

                                    _tr = _tr + ('<td >' + img + '</td>')


                                } else if ((argu.newData[_keys[j]].indexOf('data:application/pdf') !== -1) && (argu.newData[_keys[j]].indexOf('{') == -1)) {

                                    var btn = '<button type="button"  id="viewbutn" class="btn btnStyle " ng-click=viewbutnspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'
                                    _tr = _tr + ('<td >' + btn + '</td>')

                                    $rootScope.pdff_ = argu.newData[_keys[j]]
                                    $(document).on("click", "#viewbutn", function(e) {

                                        var pdfWindow = window.open("")
                                        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdff_ + "'></iframe>")
                                    })

                                } else if (argu.newData[_keys[j]] !== undefined && argu.newData[_keys[j]].indexOf('{') != -1) {
                                    $scope.details = []
                                    var _parsedJson = JSON.parse(argu.newData[_keys[j]])
                                    var newData = ""
                                    var oldkeys = Object.keys(_parsedJson);
                                    if (oldkeys.length > 0) {
                                        for (var i = 0; i < oldkeys.length; i++) {
                                            var eachKey = oldkeys[i];
                                            var Newvalue = _parsedJson[eachKey];
                                            $scope.details.push({ key: eachKey, value: Newvalue });
                                        }
                                    }

                                    for (i in $scope.details) {

                                        if ($scope.details[i].key == 'D_Signature') {
                                            if (($scope.details[i].value.indexOf('data:image/jpeg;base64') != -1) || ($scope.details[i].value.indexOf('data:image/png;base64') != -1)) {

                                                var imgg = '<img id="preview_" src=" ' + $scope.details[i].value + '" height="200px" width="200px" class="img-responsive">'
                                            } else if (($scope.details[i].value.indexOf('data:application/pdf') != -1)) {
                                                var imgg = '<button type="button" ng-if="pdfview"  id="viewbutn__1" class="btn btnStyle " ng-click=viewbuttonspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'

                                                $rootScope.pdff__ = $scope.details[i].value
                                                $(document).on("click", "#viewbutn__1", function(e) {
                                                    var pdfWindow = window.open("")
                                                    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdff__ + "'></iframe>")
                                                })

                                            }

                                            newData = newData + '<div> <span> ' + $scope.details[i].key + '</span>  <span>' + ' : ' + (imgg) + '</span> </div>'
                                        } else {
                                            newData = newData + '<div> <span> ' + $scope.details[i].key + '</span>  <span>' + ' : ' + ($scope.details[i].value) + '</span> </div>'
                                        }

                                    }

                                    _tr = _tr + ('<td> <pre  class=changeClass>' + $filter('beautify')(newData) + '</pre> </td>')
                                } else {

                                    _tr = _tr + "<td>"
                                }
                            } else {

                                _tr = _tr + "<td>"
                            }
                            // _tr = _tr + "<td>"

                        }
                        if (argu.newData[_keys[j]] !== undefined && typeof(argu.newData[_keys[j]]) == 'object') {
                            _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                        } else if (argu.tableName != "BusinessRules" && argu.newData[_keys[j]] && typeof(argu.newData[_keys[j]]) !== 'number' && argu.newData[_keys[j]].match('{')) {
                            if (pdetailsLatestJsonEntries.length > 0) {
                                var test = '';
                                for (var i = 0; i < pdetailsLatestJsonEntries.length; i++) {
                                    if (!pdetailsLatestJsonEntries[i].highlight) {

                                        if ($scope.parentInput.pageTitle == 'Mandate' || typeof(pdetailsLatestJsonEntries[i].value) == "object") {

                                            if (pdetailsLatestJsonEntries[i].key == 'D_Signature') {
                                                if ((pdetailsLatestJsonEntries[i].value.indexOf('data:image/jpeg;base64') != -1) || (pdetailsLatestJsonEntries[i].value.indexOf('data:image/png;base64') != -1)) {

                                                    var imgg = '<img id="preview_" src=" ' + pdetailsLatestJsonEntries[i].value + '" height="200px" width="200px" class="img-responsive">'
                                                } else if ((pdetailsLatestJsonEntries[i].value.indexOf('data:application/pdf') != -1)) {

                                                    var imgg = '<button type="button" ng-if="pdfview"  id="viewbuttonspdf" class="btn btnStyle " onclick="viewbuttonspdf(pdetailsLatestJsonEntries[i].value);"><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'

                                                    $rootScope.pdf = pdetailsLatestJsonEntries[i].value
                                                    $(document).on("click", "#viewbuttonspdf", function(e) {

                                                        var pdfWindow = window.open("")
                                                        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdf + "'></iframe>")
                                                    })

                                                }

                                                test = test + '<div  class="modifiedClass"> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>' + ' : ' + '<span>' + (imgg) + '</span> </div>'

                                            } else {
                                                test = test + '<div class="modifiedClass"> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>' + ' : ' + '<span>' + (pdetailsLatestJsonEntries[i].value) + '</span> </div>'
                                            }
                                            // test = test + '<div class="modifiedClass"> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>' + ' : ' + '<span>' + (pdetailsLatestJsonEntries[i].value) + '</span> </div>'

                                        } else {
                                            test = test + '<div class="modifiedClass"> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>' + ' : ' + '<span>' + (pdetailsLatestJsonEntries[i].value) + '</span> </div>'
                                        }
                                    } else {

                                        if ($scope.parentInput.pageTitle == 'Mandate') {


                                            if (pdetailsLatestJsonEntries[i].key == 'D_Signature') {

                                                if ((pdetailsLatestJsonEntries[i].value.indexOf('data:image/jpeg;base64') != -1) || (pdetailsLatestJsonEntries[i].value.indexOf('data:image/png;base64') != -1)) {

                                                    var imgg = '<img id="preview_" src=" ' + pdetailsLatestJsonEntries[i].value + '" height="200px" width="200px" class="img-responsive">'
                                                } else if ((pdetailsLatestJsonEntries[i].value.indexOf('data:application/pdf') != -1)) {
                                                    var imgg = '<button type="button" ng-if="pdfview"  id="viewbuttf" class="btn btnStyle " ng-click=viewbuttonspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'

                                                    $rootScope.pdfv = pdetailsLatestJsonEntries[i].value
                                                    $(document).on("click", "#viewbuttf", function(e) {

                                                        var pdfWindow = window.open("")
                                                        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdfv + "'></iframe>")
                                                    })
                                                }


                                                test = test + '<div> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>  <span>' + ' : ' + (imgg) + '</span> </div>'

                                            } else {


                                                test = test + '<div> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>  <span>' + ' : ' + (pdetailsLatestJsonEntries[i].value) + '</span> </div>'
                                            }
                                            // test = test + '<div> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>  <span>' + ' : ' + (pdetailsLatestJsonEntries[i].value) + '</span> </div>'

                                        } else {

                                            test = test + '<div> <span> ' + pdetailsLatestJsonEntries[i].key + '</span>  <span>' + ' : ' + (pdetailsLatestJsonEntries[i].value) + '</span> </div>'
                                        }
                                    }
                                }
                                if ($scope.parentInput.pageTitle == 'Mandate') {
                                    // _tr = _tr + "<table class='changeClass'>" + $filter('beautify')(test) + "</table>"
                                    _tr = _tr + "<pre class='changeClass'>" + $filter('beautify')(test) + "</pre>"
                                } else {
                                    _tr = _tr + "<pre class='changeClass'>" + $filter('beautify')(test) + "</pre>"
                                }

                            } else {
                                var _parsedJson1 = JSON.parse(argu.newData[_keys[j]])
                                var data = ""
                                var newkeys = Object.keys(_parsedJson1);
                                if (newkeys.length > 0) {
                                    for (var i = 0; i < newkeys.length; i++) {
                                        var eachKey = newkeys[i];
                                        var newValue = _parsedJson1[eachKey];
                                        pdetailsNewJsonEntries.push({ key: eachKey, value: newValue });
                                    }
                                }
                                for (var i = 0; i < pdetailsNewJsonEntries.length; i++) {
                                    data = data + '<div> <span> ' + pdetailsNewJsonEntries[i].key + '</span>  <span>' + ' : ' + (pdetailsNewJsonEntries[i].value) + '</span> </div>'
                                }
                                _tr = _tr + "<pre  class='changeClass'>" + $filter('beautify')(argu.newData[_keys[j]]) + "</pre>"

                            }
                        } else if (argu.tableName == "BusinessRules" && _keys[j] == "RuleStructure") {
                            _tr = _tr + "<pre>" + $filter('beautify')(hexToString(argu.newData[_keys[j]])) + "</pre>"
                        } else {
                            if (argu.newData[_keys[j]] !== undefined && argu.newData[_keys[j]]) {
                                _tr = _tr + argu.newData[_keys[j]];
                            }
                        }
                        _tr = _tr + "</td>"
                    }
                } else {
                    if (argu.newData) {
                        _tr = _tr + "<td>"
                        if (argu.newData[_keys[j]] !== undefined && argu.newData[_keys[j]]) {
                            if (argu.newData[_keys[j]] !== undefined && typeof(argu.newData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.newData[_keys[j]]) + "</pre>"
                            } else {
                                if ($scope.parentInput.pageTitle == 'Mandate') {

                                    if (Object.keys(argu.newData).indexOf('AggrementImage') !== -1) {

                                        var filedata = argu.newData['AggrementImage']
                                        var filename = argu.newData['AggrementImageName']

                                        if (filedata) {
                                            if (filedata.indexOf('data:application/pdf') !== -1) {
                                                $scope.filenameinurll = filename

                                                if (_keys[j] == 'AggrementImage') {

                                                    _tr = _tr + '<button type="button" ng-if="pdfview"  id="viewbuttonspdf" class="btn btnStyle " ng-click=viewbuttonspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'

                                                } else {
                                                    _tr = _tr + argu.newData[_keys[j]];
                                                }
                                                $("#viewbuttonspdf").click(function() {
                                                    var pdfWindow = window.open("")
                                                    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + filedata + "'></iframe>")

                                                });
                                            }
                                            if (filedata.indexOf('data:image/jpeg') !== -1) {

                                                $scope.imagnamee = filename

                                                if (_keys[j] == 'AggrementImage') {

                                                    _tr = _tr + '<img id="preview_" src=" ' + filedata + '" height="300px" width="300px" class="img-responsive">'

                                                } else {
                                                    _tr = _tr + argu.newData[_keys[j]];
                                                }

                                            }
                                            if (filedata.indexOf('data:image/png;') !== -1) {
                                                $scope.imagnamee_ = filename


                                                if (_keys[j] == 'AggrementImage') {
                                                    _tr = _tr + '<img id="preview_" src=" ' + filedata + '" height="300px" width="300px" class="img-responsive">'
                                                } else {
                                                    _tr = _tr + argu.newData[_keys[j]];
                                                }


                                            }
                                        } else {
                                            _tr = _tr + argu.newData[_keys[j]];
                                        }

                                    } else {


                                        if (Object.keys(argu.newData).indexOf('MandateSchemeData') !== -1) {

                                            if (argu.newData[_keys[j]].indexOf('{') !== -1) {

                                                if (Object.keys(JSON.parse(argu.newData[_keys[j]])).indexOf('D_Signature') !== -1) {
                                                    $scope.details_ = []
                                                    var _parsedJson = JSON.parse(argu.newData[_keys[j]])
                                                    var newData = ""
                                                    var oldkeys = Object.keys(_parsedJson);
                                                    if (oldkeys.length > 0) {
                                                        for (var i = 0; i < oldkeys.length; i++) {
                                                            var eachKey = oldkeys[i];
                                                            var Newvalue = _parsedJson[eachKey];
                                                            $scope.details_.push({ key: eachKey, value: Newvalue });
                                                        }
                                                    }


                                                    for (i in $scope.details_) {

                                                        if ($scope.details_[i].key == 'D_Signature') {
                                                            if (($scope.details_[i].value.indexOf('data:image/jpeg;base64') != -1) || ($scope.details_[i].value.indexOf('data:image/png;base64') != -1)) {

                                                                var imgg = '<img id="preview_" src=" ' + $scope.details_[i].value + '" height="200px" width="200px" class="img-responsive">'
                                                            } else if (($scope.details_[i].value.indexOf('data:application/pdf') != -1)) {
                                                                var imgg = '<button type="button" ng-if="pdfview"  id="viewbutn__11" class="btn btnStyle " ng-click=viewbuttonspdf()><i class="fa fa-file-image-o " aria-hidden="true "></i>View</button>'
                                                                $rootScope.pdff__1 = $scope.details_[i].value
                                                                $(document).on("click", "#viewbutn__11", function(e) {
                                                                    var pdfWindow = window.open("")
                                                                    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + $rootScope.pdff__1 + "'></iframe>")
                                                                })

                                                            }


                                                            newData = newData + '<div> <span> ' + $scope.details_[i].key + '</span>  <span>' + ' : ' + (imgg) + '</span> </div>'
                                                        } else {
                                                            newData = newData + '<div> <span> ' + $scope.details_[i].key + '</span>  <span>' + ' : ' + ($scope.details_[i].value) + '</span> </div>'
                                                        }


                                                    }

                                                    _tr = _tr + (' <pre  class=changeClass>' + $filter('beautify')(newData) + '</pre> ')

                                                } else {
                                                    _tr = _tr + argu.newData[_keys[j]];
                                                }

                                            } else {
                                                _tr = _tr + argu.newData[_keys[j]];
                                            }

                                        } else {
                                            _tr = _tr + argu.newData[_keys[j]];
                                        }

                                    }

                                } else {

                                    _tr = _tr + argu.newData[_keys[j]];
                                }

                            }
                        }
                        _tr = _tr + "</td>"
                    } else if (argu.oldData) {
                        _tr = _tr + "<td>"
                        if (argu.oldData[_keys[j]]) {
                            if (typeof(argu.oldData[_keys[j]]) == 'object') {
                                _tr = _tr + "<pre>" + $filter('json')(argu.oldData[_keys[j]]) + "</pre>"
                            } else {
                                _tr = _tr + argu.oldData[_keys[j]];
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

    $scope.getDisplayValue = function(cmprWith, cmprThiz) {
        if (cmprThiz || cmprThiz == false) {
            cmprThiz = cmprThiz.toString()
            for (k in cmprWith) {
                if (cmprWith[k].actualvalue == cmprThiz) {
                    return cmprWith[k].displayvalue
                }
            }
            return cmprThiz
        } else {
            return cmprThiz
        }
    }
    $scope.AssociatedVal = [];
    $scope.ReqAssociated = [{
            'AssociatedKey': [{
                    'FieldName': "ServiceCode",
                    'Label': "Service Code"
                },
                {
                    'FieldName': "ServiceName",
                    'Label': "Service Name"
                },
                {
                    'FieldName': "EffectiveFromDate",
                    'Label': "Effective From Date"
                },
                {
                    'FieldName': "EffectiveTillDate",
                    'Label': "Effective Till Date"
                },
                {
                    'FieldName': "Status",
                    'Label': "Status"
                },
            ],
            'gotoLink': 'services',
            'parentInfo': {
                'Link': 'servicegroups',
                'Label': 'Service Group',
                'fieldName': 'ServiceGroupCode'
            },
            'Key': [],
            'Data': []
        },
        {
            'AssociatedKey': [{
                    'FieldName': "BranchCode",
                    'Label': "Branch Code"
                },
                {
                    'FieldName': "BranchName",
                    'Label': "Branch Name"
                },
                {
                    'FieldName': "EffectiveFromDate",
                    'Label': "Effective From Date"
                },
                {
                    'FieldName': "EffectiveTillDate",
                    'Label': "Effective Till Date"
                },
                {
                    'FieldName': "Status",
                    'Label': "Status"
                },
            ],
            'gotoLink': 'branches',
            'parentInfo': {
                'Link': 'offices',
                'Label': 'Office',
                'fieldName': 'OfficeCode'
            },
            'Key': [],
            'Data': []
        }
    ]

    for (linking in $scope.ReqAssociated) {
        if ($scope.ReqAssociated[linking].parentInfo.Link == $scope.parentInput.parentLink) {
            $scope.AssociatedVal = $scope.ReqAssociated[linking];
            $scope.AssociatesInputData = {
                "filters": {
                    "logicalOperator": "AND",
                    "groupLvl1": [{
                        "logicalOperator": "AND",
                        "groupLvl2": [{
                            "logicalOperator": "AND",
                            "groupLvl3": [{
                                "logicalOperator": "AND",
                                "clauses": [{
                                    "columnName": $scope.AssociatedVal.parentInfo.fieldName,
                                    "operator": "=",
                                    "value": $scope.parentInput.fieldData[$scope.AssociatedVal.parentInfo.fieldName]
                                }]
                            }]
                        }]
                    }]
                },
                "sorts": [],
                "start": 0,
                "count": 20
            }
            gotoLoadmore($scope.AssociatedVal.gotoLink, $scope.AssociatesInputData)
        }
    }
    $scope.dtLen = 0

    function gotoLoadmore(argu1, argu2) {
        crudRequest("POST", argu1 + '/readall', argu2).then(function(response) {
            if (response.data.data.length != 0) {
                $scope.dtLen = response.data.data;
                $scope.AssociatedVal.Data = $scope.AssociatedVal.Data.concat(response.data.data);
                crudRequest("GET", argu1 + '/primarykey', '').then(function(response) {
                    $scope.setprimarykey = response.data.data.responseMessage
                })
            }
        })
    }

    $(document).ready(function() {
        $('.listView').on('scroll', function() {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                debounceHandler();
            }
        });

        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table');
            $tablesToFloatHeaders.floatThead({
                //useAbsolutePositioning: true,
                scrollContainer: true
            })
            $tablesToFloatHeaders.each(function() {
                var $table = $(this);
            });
        })



        $(window).bind("resize", function() {
            setTimeout(function() {
                $(".listView").scrollLeft(30)
            }, 300)
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }

        })
        $(window).trigger('resize');
    })

    //I Load More datas on scroll
    var loadMore = function() {
        if ($scope.dtLen.length >= 20) {
            $scope.AssociatesInputData.start += 20;
            gotoLoadmore($scope.AssociatedVal.gotoLink, $scope.AssociatesInputData)
        }

    }

    var debounceHandler = _.debounce(loadMore, 700, true);


    $scope.gotoService = function(argu) {
        if (!argu.fieldData) {
            argu.fieldData = {}
            argu.fieldData[$scope.AssociatedVal.parentInfo.fieldName] = $scope.parentInput.fieldData[$scope.AssociatedVal.parentInfo.fieldName];
        }
        $scope.serviceInput = {
            'toPage': $scope.AssociatedVal.gotoLink,
            'val': argu
        }

        $state.go('app', {
            details: $scope.serviceInput
        }, {
            'reload': true
        });
    }

    $scope.callforPermission = function(_permission, _status) {
        if ((_status.match(/WAITFORAPPROVAL/g) || _status.match(/DELETED/g)))
            return '{C: false, D: false, R: false, U: false}'
        else
            return _permission
    }


    //I Load More datas on scroll
    var len = 20;
    var loadMore = function() {
        if (($scope.dataLen.length >= 20)) {
            crudRequest("POST", $scope.parentInput.parentLink + '/audit/readall', $scope.auditVal, {
                'start': len,
                'count': 20
            }).then(function(response) {
                $scope.dataLen = response.data.data
                if (response.data.data.length != 0) {
                    $scope.convertXmltoJson(response)
                        //$scope.editedLog = $scope.editedLog.concat($scope.dataLen)
                    len = len + 20;
                }
            })
        }
    }

    var debounceHandler = _.debounce(loadMore, 700, true);
    $('.editBody').on('scroll', function() {
        if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
            //debounceHandler(); //Don't uncomment this line 

        }
    });

    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
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

            $('.modal').modal("hide");
            $scope.deletedData = true;
            //if(data.Status === 'Success'){

            //$scope.CRUD = data.responseMessage ? data.responseMessage : "Borrado exitosamente";	

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

    var reactivateObj = {};

    $scope.gotoReactivate = function(_data) {

        var GetPrimaryKeys = angular.copy($scope.parentInput.primarykey);

        for (i in GetPrimaryKeys) {
            for (j in _data) {

                if (GetPrimaryKeys[i] == j) {
                    reactivateObj[GetPrimaryKeys[i]] = _data[GetPrimaryKeys[i]];
                }
            }
        }

        crudRequest("POST", $stateParams.input.gotoPage.Link + "/reactivate", reactivateObj).then(function(response) {
            $scope.gotoParent(response.data.data.responseMessage)
        })
        $('.my-tooltip').tooltip('hide');
    };

    $scope.showAsXML = function(data) {
        var xmlData = hexToString(data)
        if (xmlData) {
            return $filter('beautify')(xmlData)
        } else {
            return data
        }
    }

    $scope.Unmask = function() {
        $scope.masking = !$scope.masking;
    }

});
