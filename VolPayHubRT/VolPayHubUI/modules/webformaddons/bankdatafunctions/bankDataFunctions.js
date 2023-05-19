angular.module('VolpayApp').controller('webbankDataFunctions', function ($scope, $rootScope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService, errorservice, editservice, $interval, EntityLockService, datepickerFaIcons, GetPermissions) {
    var authenticationObject = $rootScope.dynamicAuthObj;

    $scope.newPermission = GetPermissions($stateParams.input.gotoPage.Name);


    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    $rootScope.$on("MyEvent", function (evt, data) {
        $("#changesLostModal").modal("show");
    })

    $rootScope.$on("MyEventforEditIdleTimeout", function (evt, data) {
        // $scope.stopIdleTimer();
        // $scope.stopsecondIdleTimer();
        // $scope.madeChanges = false;
        $(window).off("mousemove keydown click");
        //$("#changesLostModal").modal("show");
        $interval.cancel(findEvent);
        // handler code here });
    })

    //idletime Start
    var findEvent;
    var alertDangerJQ = $('.alert-danger');
    var alertSuccessJQ = $('.alert-success');
    var secondfindEvent;
    $scope.count = 0;
    $scope.seccount = 10;
    $scope.uploadFiles = false;
    var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
    if ($stateParams.input.Operation === 'Edit') {
        if (($stateParams.input.gotoPage.Link === "vphcycleextensionef" || $stateParams.input.gotoPage.Link === "vphcycleextensionach")) {
            $stateParams.input.fieldData.Entity = $stateParams.input.fieldData.PartyCode
        }

        $scope.findIdleTime = function () {
            findEvent = $interval(function () {
                // $(window).on("mousemove keydown click", function() { // find the window event
                //     $scope.stopIdleTimer();
                //     $scope.count = 0;
                //     $scope.findIdleTime();
                // });
                $scope.count += 1;

                if ($scope.count === editTimeoutCounter) {
                    // $scope.stopIdleTimer();
                    // $stateParams.input.Operation = "";
                    // $scope.callIdleTime();
                    if ($scope.parentInput.Operation === 'Edit') {
                        $scope.unlockEntityToEdit();
                        $scope.stopIdleTimer();
                        $scope.stopsecondIdleTimer();
                        $scope.gotoParent();
                    }
                }
            }, 1000);
        };
        $scope.findIdleTime();

        $scope.callIdleTime = function () {

            setTimeout(function () {
                $("#idletimeout_model").modal("show");
            }, 100)

            secondfindEvent = $interval(function () {
                $(window).on("mousemove keydown click", function () { // find the window event
                    $scope.stopsecondIdleTimer();
                    $scope.seccount = 10;
                    // $scope.findIdleTime();
                    setTimeout(function () {
                        $("#idletimeout_model").modal("hide");
                    }, 100)

                });
                $scope.seccount -= 1;
                if ($scope.seccount === 0) {
                    $scope.stopsecondIdleTimer();
                    $stateParams.input.Operation = "";
                    $scope.gotoParent();
                }
            }, 1000);
        }
    } else {
        //    $scope.stopIdleTimer();
        //    $scope.stopsecondIdleTimer();
    }

    $scope.stopsecondIdleTimer = function () {
        if (angular.isDefined(secondfindEvent)) {
            // $(window).off('mousemove keydown click', secondfindEvent); 
            $(window).off("mousemove keydown click");
            // clearInterval(secondfindEvent)              
            $interval.cancel(secondfindEvent);
            secondfindEvent = undefined;
        }
    };

    $scope.stopIdleTimer = function () {
        if (angular.isDefined(findEvent)) {
            // $(window).off('mousemove keydown click', findEvent)ca; 
            // $(document).off( "mousemove" );           
            // clearInterval(findEvent)             
            $interval.cancel(findEvent);
            findEvent = undefined;
        }
    };
    

    $scope.bankDataForm = {};
    $scope.madeChanges = false;

    $scope.parentInput = angular.copy($stateParams.input);
    $scope.fieldData = ($stateParams.input.fieldData) ? $stateParams.input.fieldData : {};
    if($scope.fieldData['Sanction'] == "SI"){
        $scope.fieldData['Sanction'] = "1";
    }else if($scope.fieldData['Sanction'] == "NO"){
        $scope.fieldData['Sanction'] = "1";
    }

    if (($scope.parentInput.parentLink == 'xmlfilegeneration') && ($scope.parentInput.Operation == 'Add')) {
        $scope.fieldData['Clearingdate'] = moment(new Date()).format('YYYY-MM-DD');;
    }

    $scope.Title = $scope.parentInput.pageTitle;
    $scope.ulName = $scope.parentInput.ulName;
    $scope.IconName = ($scope.parentInput.gotoPage.IconName) ? $scope.parentInput.gotoPage.IconName : ''
    $scope.showPageTitle = $filter('nospace')($scope.Title);
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle);
    $scope.showsubTitle = $scope.showPageTitle + '.Edit';
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle';

    $scope.ParentIconName = ($stateParams.input.gotoPage.ParentIcon) ? $stateParams.input.gotoPage.ParentIcon : ''

    $scope.subDataObj = {};

    $scope.subSectionfieldData = {};

    if ($scope.parentInput.parentLink != 'methodofpayments') {
        if ('Subsection' in $scope.parentInput.pageInfo) {
            for (k in $scope.parentInput.pageInfo.Subsection) {
                $scope.subSectionfield = $scope.parentInput.pageInfo.Subsection[k].subSectionData;
                $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = ($scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName]) ? $scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] : [{}];
            }
        } else {
            $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = ($scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName]) ? $scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] : [{}]
            $scope.subSectionfield = [{}]
        }
    }

    formArrayWithVal = [];
    $scope.fieldData11 = $scope.fieldData;
    $scope.subSectionfieldData11 = $scope.subSectionfieldData;

    setTimeout(function () {
        var formArray = $('#dynamicModuleForm').serializeArray();
        formArrayWithVal = formArray
    }, 200);

    $scope.gotoParent = function (alertMsg) {
        $scope.stopIdleTimer();
        $scope.stopsecondIdleTimer();
        $(window).off("mousemove keydown click");

        $scope.input = {
            'gotoPage': $stateParams.input.gotoPage,
            'responseMessage': alertMsg
        }
        params = {};
        params.urlIdForAddon = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
        params.query = $scope.parentInput.ulName.replace(/\s+/g, '');
        params.input = $scope.input;

        if ($scope.parentInput.parentLink == 'xmlfilegeneration') {
            params.urlIdForAddons = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            $state.go('app.webformPlugins', params);
        } else {
            $state.go('app.webformPlugin', params);
        }
    }

    $scope.gotoShowAlert = function () {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $("#changesLostModal").modal("show");
        } else {
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();
            $(window).off("mousemove keydown click");
            $scope.gotoParent();
        }
    }
    $scope.madeChanges = false;
    // var newvalen, oldvalen;
    // $scope.$watch('subSectionfieldData', function(newval, oldval) {

    //     Object.keys(newval).forEach(function(getKey) {
    //         newvalen = newval[getKey].length
    //     })
    //     Object.keys(oldval).forEach(function(getKey2) {
    //         oldvalen = oldval[getKey2].length
    //     })

    //     if (newvalen != oldvalen) {
    //         $scope.madeChanges = true;
    //     }
    // }, true);

    $scope.listen = function () {
        editservice.listen($scope, $scope.fieldData, $stateParams.input.Operation, $stateParams.input.pageTitle);
        editservice.listen($scope, $scope.subSectionfieldData, $stateParams.input.Operation, $stateParams.input.pageTitle, 'Subsection');
    }
    $scope.listen();

    $scope.gotoClickedPage = function () {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            if ($scope.parentInput.Operation === 'Edit') {
                $scope.unlockEntityToEdit();
            }

            $scope.gotoParent();
            $rootScope.dataModified = false;
        } else {
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();
            // $(document).off( "mousemove keydown click" ); 

            $rootScope.$emit("MyEvent2", true);
        }
    }

    $scope.gotoCancelFn = function () {

        Object.keys($scope.fieldData11).forEach(function (key) {
            $.each(formArrayWithVal, function () {

                if ($scope.fieldData11[this.name]) {

                    if ($scope.fieldData11[this.name].toString() != this.value) {
                        $scope.madeChanges = true;
                    }

                }
            })
        });

        $('.my-tooltip').tooltip('hide');

        Object.keys($scope.subSectionfieldData11).forEach(function (subseckey) {
            $.each(formArrayWithVal, function (ArrKey, ArrVal) {

                if (typeof $scope.subSectionfieldData11[subseckey] == 'object') {
                    $.each($scope.subSectionfieldData11[subseckey], function (key1, val1) {
                        delete val1.$$hashKey;
                        if (Object.keys(val1).length) {
                            var tempArray = ArrVal.name.split('_')
                            if (tempArray[1]) {
                                if (tempArray[1] == key1) {
                                    if ($scope.subSectionfieldData11[subseckey][Number(tempArray[1])][tempArray[0]] != ArrVal.value) {

                                        $scope.madeChanges = true;
                                    }
                                }
                            }
                        }
                    })
                }
            })
        })
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            if ($scope.parentInput.Operation === 'Edit') {
                $scope.unlockEntityToEdit();
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
                $(window).off("mousemove keydown click");
            } else {
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
                $(window).off("mousemove keydown click");
                $scope.gotoParent();
            }
        }
    }

    if ($scope.parentInput.Operation == 'Clone') {
        for (var k = 0; k < $scope.parentInput.primarykey.length; k++) {
            if ($scope.parentInput.fieldData) {
                $scope.fieldData[$scope.parentInput.primarykey[k]] = ''
            }
        }
    }

    $scope.unlockEntityToEdit = function (alertmsg) {
        data = {
            TableName: $scope.parentInput.parentLink || '',
            BusinessPrimaryKey: {},
            IsLocked: false
        };
        if ($scope.parentInput.primarykey && $scope.parentInput.primarykey.length > 0) {
            for (let i = 0; i < $scope.parentInput.primarykey.length; i++) {
                data.BusinessPrimaryKey[$scope.parentInput.primarykey[i]] = $scope.parentInput.fieldData ? $scope.parentInput.fieldData[$scope.parentInput.primarykey[i]] : '';
            }
        }
        data.BusinessPrimaryKey = JSON.stringify(data.BusinessPrimaryKey);

        EntityLockService.checkEntityLock(data).then(function (data) {
            $scope.gotoParent(alertmsg);
        }).catch(function (response) {
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

    $scope.calldisabled = function (x) {

        if (x == 'Cycle' && $scope.Title == "XML File Generation") {
            if ($scope.fieldData.Position == "A favor de ACH Dev" || $scope.fieldData.Position == "En contra de ACH Dev") {
                return true;
            }
            //return false;
        }

        if ($scope.parentInput.parentLink == 'xmlfilegeneration') {
            if ($scope.parentInput.Operation == 'Add') {
                if ('ClosewithoutresponseBR' == x) {
                    $('input[name=ClosewithoutresponseBR]').attr('disabled', true)
                    return true
                }
            }

            if ($scope.parentInput.Operation == 'Edit') {
                if ($scope.parentInput.fieldData['GeneratedFile']) {
                    if ('Position' == x) {
                        $('input[name=Position]').attr('disabled', true)
                        return true
                    }

                    if ('Cycle' == x) {
                        $('input[name=Cycle]').attr('disabled', true)
                        return true
                    }

                } else {
                    if ('ClosewithoutresponseBR' == x) {
                        $('input[name=ClosewithoutresponseBR]').attr('disabled', true)
                        return true
                    }

                }
            }
        }


        /*if(($scope.parentInput.parentLink == 'businessrules')&&(x == 'Rule'))
        {
            return true;
        }*/


        if (($scope.parentInput.Operation != 'Clone') && ($scope.parentInput.Operation != ' Add')) {
            if (($scope.parentInput.parentLink == 'partyserviceassociations') && ((($scope.parentInput.fieldData) && ('PartyCode' === x)) || (($scope.parentInput.fieldData) && ('ServiceCode' === x)) || (($scope.parentInput.fieldData) && ('InputFormat' === x)))) {
                return true
            } else if (($scope.parentInput.parentLink == 'partyserviceassociations') && ('PartyServiceAssociationCode' === x)) {
                $('input[name=PartyServiceAssociationCode]').attr('placeholder', 'Select Party Code, Service Code and Input Format')
                return true
            }

            for (var k = 0; k < $scope.parentInput.primarykey.length; k++) {
                if (($scope.parentInput.fieldData) && ($scope.parentInput.primarykey[k] === x)) {
                    return true
                }
            }
        }

        if (($scope.parentInput.parentLink == 'partyserviceassociations') && ('PartyServiceAssociationCode' === x)) {
            $('input[name=PartyServiceAssociationCode]').attr('placeholder', 'Select Party Code, Service Code and Input Format')
            return true
        }
    }

    $scope.setHeights = function (x) {
        setTimeout(function () {
            var subsec = 'Subsection' in $scope.parentInput.pageInfo ? $scope.parentInput.pageInfo.Subsection.length ? $scope.parentInput.pageInfo.Subsection : $scope.replaceField.Subsection.length ? $scope.replaceField.Subsection : '' : ''
            if (subsec) {
                for (k in subsec) {
                    $(sanitize('#' + subsec[k].FieldName)).css({
                        'height': Math.round($(sanitize('#' + subsec[k].FieldName)).find('.anitem').outerHeight()) + 10 + 'px'
                    })
                }
            }
        }, 500)
    }


    $scope.remove_Section = function (x, y, z) {

        if (y[z].length > 1) {
            y[z].splice(x, 1)
        } else { }
        $('.my-tooltip').tooltip('hide');
    }

    $scope.removesubSection = function (x, y, z) {
        if ($scope.subSectionfieldData[z].length > 1) {
            $scope.subSectionfieldData[z].splice(x, 1)
            if ($scope.parentInput.parentLink === 'cutoffs' && $scope.parentInput.Operation === 'Edit') {

                $scope.custmalerts = [{
                    type: 'warning',
                    msg: 'Deleting the Cut off time will affect the attached MOP'
                }];
            }
        } else {
            //$scope.subSectionNewData[y] = {}

        }
        $('.my-tooltip').tooltip('hide');
    }

    /** List and Grid view Ends**/
    $scope.restResponse = {};

    function crudRequest(_method, _url, _data, _query) {
        return $http({
            method: _method,
            url: BASEURL + "/rest/v2/" + _url,
            data: _data,
            params: _query
        }).then(function (response) {
            $scope.restResponse = {
                'Status': 'Success',
                'data': response
            }
            return $scope.restResponse
        }, function (error) {

            /* if (error.status == 401) {
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
                    'data': error.data
                }

                var _cstmMsg = error.data.error.message
                if (_cstmMsg.match(':') && _cstmMsg.split(':')[0] === 'The validation of uniqueness for field(s)') {

                    if (_cstmMsg.split(':')[1].match('has failed')) {
                        var _cstmMsg1 = $filter('removeSpace')(_cstmMsg.split(':')[1].split('has failed')[0])
                        _cstmMsg = []
                        var noPrimarykey = true;

                        for (var _kee in $scope.parentInput.primarykey) {
                            if (_cstmMsg1.match($scope.parentInput.primarykey[_kee])) {
                                _cstmMsg.push($scope.parentInput.primarykey[_kee] + ' : ' + $scope.backupNewData[$scope.parentInput.primarykey[_kee]])
                                noPrimarykey = false
                            }
                        }

                        if (noPrimarykey) {
                            for (var _kee in $scope.backupNewData) {
                                //if(_cstmMsg1.match(_kee)){
                                if (_cstmMsg1.match(_kee) && _kee != 'Status') {
                                    _cstmMsg.push(_kee + ' : ' + $scope.backupNewData[_kee])
                                    noPrimarykey = true
                                }

                            }
                        }

                        if (_cstmMsg.length > 1) {
                            _cstmMsg = _cstmMsg.toString() + ' already exists. Combination needs to be unique.'
                        } else if (_cstmMsg.length == 1) {
                            _cstmMsg = _cstmMsg.toString() + ' already exists. Value needs to be unique.'
                        } else {
                            _cstmMsg = error.data.error.message
                        }
                    } else {
                        _cstmMsg = error.data.error.message
                    }

                } else {
                    _cstmMsg = error.data.error.message
                }

                $scope.alerts = [{
                    type: 'danger',
                    msg: _cstmMsg //Set the message to the popup window
                    //msg : ($scope.parentInput.pageTitle == 'Party' && error.data.error.message == 'The validation of uniqueness for field(s): PartyCode has failed. Please revalidate.') ? 'Entered PartyCode already exists' : error.data.error.message //Set the message to the popup window
                }];

            }
            /* $timeout(function(){
            $('#statusBox').hide();
            }, 4000); */
            return $scope.restResponse
        });
    }

    $scope.cleantheinputdata = function (argu) {

        for (var k in argu) {

            if ($.isPlainObject(argu[k])) {
                var isEmptyObj = $scope.cleantheinputdata(argu[k])
                if ($.isEmptyObject(isEmptyObj)) {
                    delete argu[k]
                } else {
                    argu[k] = JSON.stringify(argu[k])
                }
            } else if (Array.isArray(argu[k])) {

                for (var n in argu[k]) {
                    var isEmptyObj1 = $scope.cleantheinputdata(argu[k][n])
                    if ($.isEmptyObject(isEmptyObj1)) {
                        argu[k].splice(n, 1);
                    } else if (isEmptyObj1.$$hashKey) {
                        delete isEmptyObj1.$$hashKey
                    }
                }
                if (argu[k].length) {
                    var _val_ = true;
                    for (var j in argu[k]) {
                        if ($.isPlainObject(argu[k][j])) {
                            //argu[k][j] = JSON.stringify(argu[k][j])	
                            _val_ = false
                        }
                    }
                    if (_val_) {
                        argu[k] = argu[k].toString()
                    } else {

                    }
                } else {
                    delete argu[k]
                }
            } else if (argu[k] === "" || argu[k] === undefined || argu[k] === null) {
                delete argu[k]
            } else {
                argu[k] = argu[k]
            }
        }
        return argu
    }

    function base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toUpperCase();
    }

    $scope.createDataOnFiles = function (newData, subSectionNewData) {

        if ($scope.parentInput.parentLink == "notifront") {

            var reader = new FileReader();

            reader.onload = function (e) {
                //var encoded_file = toUTF8Array(e.target.result.toString());

                //subSectionNewData['attachment_list']['content'] = base64ToHex(btoa(e.target.result.toString()));

                var attachment_list = [{"name":subSectionNewData['attachment_list']['name'],"content":base64ToHex(btoa(e.target.result)),"sizeFile":subSectionNewData['attachment_list']['sizeFile'],"type":subSectionNewData['attachment_list']['type'],"description":subSectionNewData['attachment_list']['description']}];

                $scope.backupSubsection = attachment_list ? {"attachment_list":attachment_list} : ''
                $scope.backupNewData = newData ? angular.copy(newData) : ''
                $scope.backupreplaceFieldData = $scope.replaceFieldData ? angular.copy($scope.replaceFieldData) : ''
                if ($scope.backupSubsection && $.isPlainObject($scope.backupSubsection)) {
                    $scope.backupSubsection = $scope.cleantheinputdata($scope.backupSubsection)
                    $scope.backupNewData = jQuery.extend($scope.backupNewData, $scope.backupSubsection)
                }
                $scope.backupNewData = $scope.cleantheinputdata($scope.backupNewData)

                $scope.backupreplaceFieldData = $scope.cleantheinputdata($scope.backupreplaceFieldData)

                $scope.method = ($scope.parentInput.Operation != 'Edit') ? "POST" : "PUT"
                crudRequest($scope.method, $scope.parentInput.parentLink, $scope.backupNewData).then(function (response) {
                    /*if (response.Status === "Success") {
                        $rootScope.dataModified = false;
                        $scope.gotoParent(response.data.data.responseMessage);
                    } else {
                        $scope.subSectionfieldData = subSectionNewData;
                    }*/
                    if (response.Status === "Success") {
                        $rootScope.dataModified = false;
                        if ($scope.parentInput.Operation === 'Edit') {
                            if (response.data.data['Status'] == 'ERROR') {
                                $scope.alerts = [{
                                    type: 'danger',
                                    msg: response.data.data.responseMessage
                                }]
                            } else {
                                $scope.unlockEntityToEdit(response.data.data.responseMessage);
                            }

                            $scope.stopIdleTimer();
                            $scope.stopsecondIdleTimer();
                            $(window).off("mousemove keydown click");
                        } else {
                            $scope.stopIdleTimer();
                            $scope.stopsecondIdleTimer();
                            $(window).off("mousemove keydown click");
                            $scope.gotoParent(response.data.data.responseMessage);
                        }
                    } else {
                        $scope.subSectionfieldData = subSectionNewData;
                    }
                });
            };
            reader.readAsBinaryString(subSectionNewData['attachment_list']['content']);
          } else {
            var reader = new FileReader();

            reader.onload = function (e) {
                //var encoded_file = toUTF8Array(e.target.result.toString());

                //uploadObj.UserId = sessionStorage.UserID;
                newData['value'] = base64ToHex(btoa(e.target.result.toString()));

                $scope.method = ($scope.parentInput.Operation != 'Edit') ? "POST" : "PUT"
                crudRequest($scope.method, $scope.parentInput.parentLink, newData).then(function (response) {
                    /*if (response.Status === "Success") {
                        $rootScope.dataModified = false;
                        $scope.gotoParent(response.data.data.responseMessage);
                    } else {
                        $scope.subSectionfieldData = subSectionNewData;
                    }*/
                    if (response.Status === "Success") {
                        $rootScope.dataModified = false;
                        if ($scope.parentInput.Operation === 'Edit') {
                            if (response.data.data['Status'] == 'ERROR') {
                                $scope.alerts = [{
                                    type: 'danger',
                                    msg: response.data.data.responseMessage
                                }]
                            } else {
                                $scope.unlockEntityToEdit(response.data.data.responseMessage);
                            }

                            $scope.stopIdleTimer();
                            $scope.stopsecondIdleTimer();
                            $(window).off("mousemove keydown click");
                        } else {
                            $scope.stopIdleTimer();
                            $scope.stopsecondIdleTimer();
                            $(window).off("mousemove keydown click");
                            $scope.gotoParent(response.data.data.responseMessage);
                        }
                    } else {
                        $scope.subSectionfieldData = subSectionNewData;
                    }
                });
            };
            reader.readAsBinaryString(newData['value']);
        }
    };

    // I process the Create Data Request.
    $scope.createData = function (newData, subSectionNewData) {
        var hasFile = false;
        Object.entries(newData).forEach(([key, value]) => {
            if (value instanceof File) {
                hasFile = true;
            }
        });

        Object.entries(subSectionNewData).forEach(([key, value]) => {
            Object.entries(value).forEach(([subKey, subValue]) => {
                if (subValue instanceof File) {
                    hasFile = true;
                }
            });
        });

        if (!hasFile) {
            $scope.backupSubsection = subSectionNewData ? angular.copy(subSectionNewData) : ''
            $scope.backupNewData = newData ? angular.copy(newData) : ''
            $scope.backupreplaceFieldData = $scope.replaceFieldData ? angular.copy($scope.replaceFieldData) : ''
            if ($scope.backupSubsection && $.isPlainObject($scope.backupSubsection)) {
                $scope.backupSubsection = $scope.cleantheinputdata($scope.backupSubsection)
                $scope.backupNewData = jQuery.extend($scope.backupNewData, $scope.backupSubsection)
            }
            $scope.backupNewData = $scope.cleantheinputdata($scope.backupNewData)
            $scope.backupreplaceFieldData = $scope.cleantheinputdata($scope.backupreplaceFieldData)

            if ($scope.backupreplaceFieldData && $scope.nameofthefield) {
                $scope.backupNewData[$scope.nameofthefield] = JSON.stringify($scope.backupreplaceFieldData)
            }

            $scope.method = ($scope.parentInput.Operation != 'Edit') ? "POST" : "PUT"
            crudRequest($scope.method, $scope.parentInput.parentLink, $scope.backupNewData).then(function (response) {
                /*if (response.Status === "Success") {
                    $rootScope.dataModified = false;
                    $scope.gotoParent(response.data.data.responseMessage);
                } else {
                    $scope.subSectionfieldData = subSectionNewData;
                }*/
                if (response.Status === "Success") {
                    $rootScope.dataModified = false;
                    if ($scope.parentInput.Operation === 'Edit') {
                        if (response.data.data['Status'] == 'ERROR') {
                            $scope.alerts = [{
                                type: 'danger',
                                msg: response.data.data.responseMessage
                            }]
                        } else {
                            $scope.unlockEntityToEdit(response.data.data.responseMessage);
                        }

                        $scope.stopIdleTimer();
                        $scope.stopsecondIdleTimer();
                        $(window).off("mousemove keydown click");
                    } else {
                        $scope.stopIdleTimer();
                        $scope.stopsecondIdleTimer();
                        $(window).off("mousemove keydown click");
                        $scope.gotoParent(response.data.data.responseMessage);
                    }
                } else {
                    $scope.subSectionfieldData = subSectionNewData;
                }
            });
        }
        else {
            $scope.createDataOnFiles(newData, subSectionNewData);
        }
    };

    $scope.checkType = function (eve, type) {
        var compareVal = '';
        var regex = {
            'Integer': /^[0-9]$/,
            'BigDecimal': /^[0-9.]$/,
            'BigInteger': /^[0-9.]$/,
            'String': /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ |áéíóúÁÉÍÓÚñÑ]*$/i
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

    $scope.multipleEmptySpace = function (e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
        if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $(e.currentTarget).data("DateTimePicker").hide();
        }
        if ($(e.currentTarget).hasClass('LeadingZero')) {
            var _val = $(e.currentTarget).val()
            if ($(e.currentTarget).val().length && $(e.currentTarget).val().length < $(e.currentTarget).attr('maxlength')) {
                _val = '0' + $(e.currentTarget).val()
                $(e.currentTarget).val(_val)
                $scope[$(e.currentTarget).attr('ng-model').split('[')[0]][$(e.currentTarget).attr('name')] = _val;
                $scope.multipleEmptySpace(e)
            }
        }
    }

    $scope.addsubfieldedSection = function (x, y, z) {
        delete y.$$hashKey;
        $(sanitize('#' + z)).css({
            'height': $(sanitize('#' + z + '_' + x)).outerHeight() + 10 + 'px'
        })
        y = removeEmptyValueKeys(y)
        $scope.replaceFieldData[z] = removeEmptyValueKeys($scope.replaceFieldData[z])
        if (Object.keys(y).length !== 0) {
            $scope.replaceFieldData[z].push({})
        }
        $(sanitize('#' + z)).animate({
            scrollTop: ($(sanitize('#' + z + '_' + x)).outerHeight() * (x + 1)) + 'px'
        });
        $('.my-tooltip').tooltip('hide');
    }

    $scope.removesubfieldedSection = function (x, y, z) {
        if ($scope.replaceFieldData[z].length > 1) {
            $scope.replaceFieldData[z].splice(x, 1)
        } else {

        }
        $('.my-tooltip').tooltip('hide');
    }

    $scope.backupCstmdrop = angular.copy($scope.parentInput.pageInfo.Section)
    $scope.replaceField = [];
    $scope.replaceFieldData = {};
    $scope.fieldAddedDetails = [];
    $scope.nameofthefield = '';

    function callforVisibility(x, y) {
        for (var k in x.customattributes.property) {
            if (x.customattributes.property[k].name === 'WebFormExcerptView') {
                return x.customattributes.property[k].value
            } else if (x.customattributes.property[k].name.match('|') && x.customattributes.property[k].name.split('|')[0] === 'VALUE') {
                $scope.replaceField.cstmAttr[y] = {};
                $scope.replaceField.cstmAttr[y][x.customattributes.property[k].name.split('|')[1]] = JSON.parse(x.customattributes.property[k].value)
            }
        }
    }

    $scope.validate = function (element, label) {

        if (label == 'Notifications.Type') {
            if (element.value == "FILESALERT") {
                $scope.parentInput.pageInfo.Section[8].visible = true;

                $scope.parentInput.pageInfo.Subsection[0].subSectionData[0].visible = true;
                $scope.parentInput.pageInfo.Subsection[0].subSectionData[1].visible = true;
                $scope.parentInput.pageInfo.Subsection[0].subSectionData[2].visible = true;
                $scope.parentInput.pageInfo.Subsection[0].subSectionData[3].visible = true;
                $scope.uploadFiles = true;
            } else {

                $scope.parentInput.pageInfo.Section[8].visible = false;

                $scope.parentInput.pageInfo.Subsection[0].subSectionData[0].visible = false;
                $scope.parentInput.pageInfo.Subsection[0].subSectionData[1].visible = false;
                $scope.parentInput.pageInfo.Subsection[0].subSectionData[2].visible = false;
                $scope.parentInput.pageInfo.Subsection[0].subSectionData[3].visible = false;
                $scope.uploadFiles = false;
            }
        }
    };
    

    $scope.fileNameChanged = function (element, subIndex) {
        /* uploadHereJQ.css({"pointer-events": "auto",
        "opacity": 1
        }); */
        
        var fileUploadLimit = sessionStorage.fileUploadLimit * 1024;
        var file = element.files[0]
        $scope.DeepFile = {
            "name": element.files[0].name,
            "size": element.files[0].size,
            "type": element.files[0].type ? element.files[0].type : file.name.split(".").pop().toUpperCase(),
            "webkitRelativePath": element.files[0].webkitRelativePath,
            "lastModifiedDate": element.files[0].lastModifiedDate,
            "lastModified": element.files[0].lastModified
        }
        
        if ($scope.parentInput.parentLink == "notifront") {
            var supportedFileFormat = ["1", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "xml", "csv", "zip"];
        } else {
            var supportedFileFormat = ["1", "jpg", "jpeg","jfif", "png", "svg"];
        }
        
        var str = file.name.split(".").pop().toLowerCase();
        if (supportedFileFormat.indexOf(str) != -1) {
            $scope.file = angular.copy($scope.DeepFile)
            // var str = file.name.split('.')[1];
            if (str == 'mt') {
                $scope.SwiftFileType = "*/*"
                $scope.fileType = "*/*";
            } else {
                $scope.SwiftFileType = "";
                $scope.fileType = $scope.file.type;
            }
            $scope.fileStatus = "File selected";
            if ($scope.parentInput.parentLink == "notifront") {
                if ($scope.file.name.length > 200) {
                    $scope.subSectionfieldData['attachment_list']['name'] = $scope.file.namesubstring(0, 200);
                } else {
                    $scope.subSectionfieldData['attachment_list']['name'] = $scope.file.name;
                }
                $scope.subSectionfieldData['attachment_list']['type'] = $scope.file.type;
                $scope.subSectionfieldData['attachment_list']['content'] =  element.files[0];
            } else {
                if ($scope.file.name.length > 200) {
                    $scope.fieldData['fileName'] = $scope.file.namesubstring(0, 200);
                } else {
                    $scope.fieldData['fileName'] = $scope.file.name;
                }
            }
            if (($scope.file.size > 1024 * 1024)) {
                /*** for MB ***/
                $scope.UploadedFileSize = $scope.file.size / 1024 / 1024; // Bytes to MB
                if (($scope.UploadedFileSize * 1024) > fileUploadLimit) {
                    $scope.filesizeTooLarge = true;
                    $scope.alerts = [{
                        type: 'danger',
                        msg: `${$filter('translate')('FileUpload.ErrorSize')} ${fileUploadLimit / 1024} MB .`
                    }];
                } else {
                    $scope.filesizeTooLarge = false;
                    if ($scope.parentInput.parentLink != "notifront") {
                        $scope.fieldData['fileSize'] = $scope.file.size + " MB";
                    }
                    if ($scope.parentInput.parentLink == "notifront") {
                        $scope.subSectionfieldData['attachment_list']['sizeFile'] = $scope.file.size + " MB";
                        if($scope.parentInput.Operation != 'Edit'){
                            $scope.alerts = [{
                                type: 'success',
                                msg: $filter('translate')('FileUpload.NotifyFileSucess')
                            }];
                        }
                    }
                    
                    alertDangerJQ.alert('close')
                }
                $scope.fileSizeFormat = 'MB';
            } else {
                /*** For KB ***/
                $scope.UploadedFileSize = $scope.file.size / 1024;
                if ($scope.UploadedFileSize > fileUploadLimit) {
                    $scope.filesizeTooLarge = true;
                    $scope.alerts = [{
                        type: 'danger',
                        msg: `${$filter('translate')('FileUpload.ErrorSize')} ${fileUploadLimit} KB.`
                    }];
                } else {
                    $scope.filesizeTooLarge = false;
                    if ($scope.parentInput.parentLink != "notifront") {
                        $scope.fieldData['fileSize'] = $scope.file.size + " KB";
                    }
                    if ($scope.parentInput.parentLink == "notifront") {
                        $scope.subSectionfieldData['attachment_list']['sizeFile'] = $scope.file.size + " KB";
                        
                    }
                    $scope.notificactionforFile = document.getElementById('uploadBtn').addEventListener('change', (e) => {
                        e.preventDefault();
                        var file = e.target.files[0];
                        var fileExtension = file.name.split('.').pop().toLowerCase();
                        var supportedExtensions = ["jpg", "jpeg", "png"];
                        if (supportedExtensions.includes(fileExtension)) {
                            $scope.$apply(() => {
                                $scope.alerts.length = 0;
                                $scope.alerts.push({
                                    type: 'success',
                                    msg: $filter('translate')('FileUpload.NotifyFileSucess')
                                });
                            });
                            setTimeout(() => {
                                $scope.$apply(() => {
                                    $('.alert-success').hide();
                                });
                            }, 3500);
                        }
                    });
                    
                    alertDangerJQ.alert('close');
                    
                }            
                $scope.fileSizeFormat = 'KB';
            }
            
            $scope.Deepfile = angular.copy($scope.file);
        } else {
            
            setTimeout(function () {
                $scope.file = {};
                $scope.fileStatus = '';
                $scope.uploaded = false;
                $scope.UploadedFileSize = '';
                $scope.SwiftFileType = "";
                $scope.fileType = "";
            }, 100);
            // $scope.filesizeTooLarge = true;
            if ($scope.parentInput.parentLink == "notifront") {
                $scope.alerts = [{
                    type: 'danger',
                    msg: $filter('translate')('FileUpload.NotifyErrorFileType').replace("??", file.name.split(".").pop())
                }];
                setTimeout(function () {
                    $('.alert-danger').hide();
                }, 3500);
                
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: $filter('translate')('FileUpload.NotifyErrorImageType').replace("??", file.name.split(".").pop())
                }];
                setTimeout(function () {
                    $('.alert-danger').hide();
                }, 3500);
            }

            
        }
    }


    //
    

    function BuildnReplaceField(argu, argu1) {

        var obtainedFields = argu.data.data.Data.webformuiformat.fields.field;

        $scope.replaceField = {
            'Section': [],
            /* Field values */
            'Subsection': [],
            /* SubField values */
            'cstmAttr': {}
        };
        $scope.replaceFieldData = {};
        $scope.fieldAddedDetails = [];
        if (argu1) {
            $scope.replaceFieldData = argu1;
        }

        for (k in obtainedFields) {
            if ("webformfieldgroup" in obtainedFields[k].fieldGroup1) {
                $scope.replaceField.Section.push({
                    'FieldName': ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
                    'Type': ('type' in obtainedFields[k] ? obtainedFields[k].type : ''),
                    'Label': ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
                    'DefaultValue': ('defaultvalue' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.defaultvalue : (obtainedFields[k].type === 'Boolean' && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type === 'Choice') ? false : ''),
                    'InputType': ('type' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
                    'MaxLength': ('width' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
                    'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                    'ChoiceOptions': (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
                    'Multiple': (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].choiceOptions : '',
                    'Rows': (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea") ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows : '',
                    'PrimaryKey': (obtainedFields[k].name == $scope.primarykey) ? true : false,
                    'Visible': ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], obtainedFields[k].name) : false,
                    'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
                    'View': ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                    'visible': ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                    'enabled': ('enabled' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : '')
                });

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
                        'DefaultValue': ('defaultvalue' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.defaultvalue : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].type === 'Boolean' && obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type === 'Choice') ? false : ''),
                        'InputType': ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
                        'MaxLength': ('width' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
                        'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                        'Mandatory': ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
                        'ChoiceOptions': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
                        'Multiple': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions : '',
                        'Rows': (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea") ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows : '',
                        'Visible': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type], obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name) : false,
                        'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
                        'View': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                        'visible': ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
                        'enabled': ('enabled' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : '')
                    });
                }
                $scope.replaceField.Subsection.push({
                    'Type': 'Subsection',
                    'Mandatory': ('showsectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.showsectionheader : ''),
                    'Label': ('sectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.sectionheader : ''),
                    'MaxOccarance': ('maxoccurs' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.maxoccurs : ''),
                    'FieldName': ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
                    'subSectionData': subSectionData,
                    'PrimaryKey': (obtainedFields[k].name == $scope.primarykey) ? true : false
                });
            }
        }

        if ('Subsection' in $scope.replaceField) {
            for (k in $scope.replaceField.Subsection) {
                if (!$scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName]) {
                    if ('DefaultValue' in $scope.replaceField.Subsection[k]) {
                        $scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName] = $scope.replaceField.Section[k].DefaultValue
                    } else {
                        $scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName] = [{}]
                    }
                }
            }
        }

        if ('Section' in $scope.replaceField) {
            for (k1 in $scope.replaceField.Section) {
                if (!$scope.replaceFieldData[$scope.replaceField.Section[k1].FieldName]) {

                    if ('DefaultValue' in $scope.replaceField.Section[k1]) {
                        $scope.replaceFieldData[$scope.replaceField.Section[k1].FieldName] = $scope.replaceField.Section[k1].DefaultValue
                    }
                }
            }
        }
        var _jkjkj = angular.copy($scope.replaceField)
        return $scope.replaceField;
    }

    //$scope.checkIfthereIs = false;
    $scope.dependedDropval = function (x, y, z, z1, z2) {

        $scope.dependedval = {
            'Direction': ['Reference Code', 'Transport Type', 'Transport Mode'],
            'TransportType': ['Transport Mode'],
            'InputFormat': ['File Duplicate Check - Parameters'],
            'IncidenceCode': ['Process Status'],
            'ServiceCode': ['Additional Config'],
            'WorkFlowCode': ['Process Status', 'Action', 'Rule Phase', 'Reference Code'],
            'ResourceName': ['Operation', 'Attribute Name'],
            'ProcessCode': ['WorkFlow Code'],
            'ProcessName': ['Party Service Association Code'],
            'AgentBankPartyCode': ['Agent Account'],
            'PartyCode': ['Permitted Account Numbers', 'Account Number'],
            'PermittedAccountNos': ['Preferred Account']
        }

        //$scope.nameofthefield = '';
        for (var chk in $scope.backupCstmdrop) {
            for (k in $scope.dependedval[z]) {
                if ($scope.backupCstmdrop[chk].Label === $scope.dependedval[z][k]) {
                    if ($scope.backupCstmdrop[chk].FieldName in $scope.fieldData && z2) {
                        if ($scope.backupCstmdrop[chk].FieldName == 'FDCParameters') { } else {
                            $scope.fieldData[$scope.backupCstmdrop[chk].FieldName] = $scope.backupCstmdrop[chk].FieldName != 'TransportType' && $scope.backupCstmdrop[chk].FieldName != 'AdditionalConfig' ? '' : $scope.fieldData[$scope.backupCstmdrop[chk].FieldName]
                        }
                    }
                    var observedIndex = chk;
                    var droplink = angular.copy($scope.backupCstmdrop[chk].ChoiceOptions);

                    if ($scope.backupCstmdrop[chk].Label == 'Additional Config') {
                        //$scope.fieldAddedDetails = [];	
                        var saveDropval = '';
                        if (z1) {
                            $scope.setInitval(z1)
                        }
                        //droplink = 'property' in droplink ? droplink.property : droplink
                        droplink = 'property' in $scope.backupCstmdrop[chk] ? $scope.backupCstmdrop[chk].property : droplink

                        setTimeout(function () {
                            for (var k in droplink) {
                                /*	RPX Supported		*/
                                if (droplink[k].name.match(/\|/g) && droplink[k].name.split('|')[0] == $(sanitize("[name=" + z + "]")).val()) {

                                    //if(droplink[k].name.match(/\|/g) && droplink[k].name.split('|')[0] == $("[name="+z+"]").val() && $("[name="+z+"]").val() != 'RPX'){
                                    saveDropval = droplink[k].name.split('|')[0];
                                    if (saveDropval == 'CXC') {
                                        $('select[name=PreferredAccount]').attr('required', true).parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                                    }
                                    $scope.nameofthefield = 'AdditionalConfig';
                                    var inputData = ($scope.nameofthefield in $scope.fieldData && $scope.fieldData[$scope.nameofthefield]) ? ($scope.fieldData[$scope.nameofthefield][0] == '{') ? JSON.parse($scope.fieldData[$scope.nameofthefield]) : '' : '';
                                    crudRequest("GET", droplink[k].value, '').then(function (response) {
                                        $scope.fieldAddedDetails = BuildnReplaceField(response, inputData);
                                    })
                                    break;
                                }
                            }
                        }, 2500);

                        if (saveDropval == '') {
                            $scope.replaceField = [];
                            $scope.replaceFieldData = {};
                            $scope.fieldAddedDetails = [];
                            $scope.nameofthefield = '';
                            $('select[name=PreferredAccount]').attr('required', false).parent().prev().find('span').attr('ng-hide', true).addClass('ng-hide')
                        }
                    } else {

                        droplink = 'property' in $scope.backupCstmdrop[chk] ? $scope.backupCstmdrop[chk].property : droplink;

                        if ((droplink && droplink[0].value === $filter('removeSpace')(z))) {
                            var links = '';
                            for (var k in droplink) {
                                if ((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) == 'InputFormat')) {
                                    $scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
                                    links = droplink[k].value.split('/')[0] + '/' + y
                                    setTimeout(function () {
                                        $("[name=" + $scope.staticInputbox + "]").attr({ 'multiple': true, 'data-placeholder': 'Select an option...' })
                                        if (!$("[name=" + $scope.staticInputbox + "]").find('option:first-child').attr('value')) {
                                            $("[name=" + $scope.staticInputbox + "]").find('option:first-child').remove()
                                            $("[name=" + $scope.staticInputbox + "]").select2();
                                            $("[name=" + $scope.staticInputbox + "]").select2('val', $scope.fieldData['FDCParameters'])
                                        } else {
                                            $("[name=" + $scope.staticInputbox + "]").val($scope.fieldData['FDCParameters'])
                                        }

                                        if (z1) {
                                            $scope.setInitval(z1)
                                        }
                                    }, 500)

                                } else if ((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) == 'WorkFlowCode')) {
                                    $scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
                                    links = '';
                                    if (z1) {
                                        $scope.setInitval(z1)
                                    }
                                    //links = droplink[k].value.split('/')[0]+'/'+y
                                    something('GET', droplink[k].value.split('/')[0] + '/' + y, observedIndex, '', {
                                        start: 0,
                                        count: 500
                                    })
                                } else if (droplink[k].name.split('|')[0] == y) {
                                    links = droplink[k].value
                                } else if (droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) {
                                    if ($filter('removeSpace')(z) == 'ResourceName') {
                                        var linkss;
                                        for (jk in $scope.dependedval[z]) {
                                            for (kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData) {
                                                if ($scope.dependedval[z][jk] == $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].Label) {
                                                    var keysss = kj
                                                    if (y) {
                                                        if ($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[1].value.match('{' + $filter('removeSpace')(z) + '}')) {
                                                            if (z1) {
                                                                $scope.setInitval(z1)
                                                            }
                                                            linkss = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[1].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
                                                        } else {
                                                            linkss = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[1].value.split('/')[0] + "/" + y
                                                        }
                                                        crudRequest("GET", linkss, '', '').then(function (response) {
                                                            $scope.parentInput.pageInfo.Subsection[0].subSectionData[keysss].ChoiceOptions = response.data.data;
                                                        })
                                                    }
                                                    //break;
                                                }
                                            }
                                        }
                                    }
                                    //else{
                                    if (y) {
                                        if (droplink[k].value.match('{' + $filter('removeSpace')(z) + '}')) {
                                            if (z1) {
                                                $scope.setInitval(z1)
                                            }
                                            links = droplink[k].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
                                        } else {
                                            links = droplink[k].value.split('/')[0] + "/" + y
                                        }
                                    }
                                    //}
                                    //},100)
                                } else if ($scope.parentInput.pageTitle == 'Bank Routing') {
                                    if (y) {
                                        if (droplink[k].value.match('{' + $filter('removeSpace')(z) + '}')) {
                                            links = droplink[k].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
                                        } else {
                                            links = droplink[k].value.split('/')[0] + "/" + y
                                        }
                                    }
                                    if (z1 && z1.FieldName === 'AgentBankPartyCode') {
                                        $scope.setInitval(z1)
                                    }
                                } else if ($scope.parentInput.pageTitle == 'Business Rules') {

                                    if (y) {
                                        if (droplink[k].value.match('{' + $filter('removeSpace')(z) + '}')) {
                                            links = droplink[k].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
                                        } else {
                                            links = droplink[k].value.split('/')[0] + "/" + y
                                        }
                                    }
                                    if (z1 && z1.FieldName === 'ProcessCode') {
                                        $scope.setInitval(z1)
                                    }
                                } else if ($scope.parentInput.pageTitle == 'Party Service Association' && droplink && (droplink[0].value.indexOf(z) != -1)) {
                                    setTimeout(function () {
                                        var _kUrl = ''
                                        var _kValue = ''
                                        for (k in droplink) {
                                            if (droplink[k].name == 'Choice') {
                                                _kValue = droplink[k].value
                                                _kValue = $scope.fieldData[z].toString()
                                            }
                                            if (droplink[k].name == 'REST') {
                                                _kUrl = droplink[k].value
                                            }
                                        }
                                        if ($(sanitize("select[name=" + z + "]")).val()) {
                                            crudRequest('POST', _kUrl, _kValue, '').then(function (response) {
                                                $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                                                    placeholder: 'Select',
                                                    minimumInputLength: 0,
                                                    allowClear: true
                                                })
                                            })
                                        }
                                    }, 100)

                                }
                            }

                            if (links) {
                                var _query_field = {
                                    start: 0,
                                    count: 500
                                }
                                if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {
                                    _query_field.search = $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]
                                    something('GET', links, observedIndex, '', _query_field)
                                } else {
                                    something('GET', links, observedIndex, '', '')
                                }
                            }
                        } else if (droplink && ('value' in droplink[0] && droplink[0].value.match('&&')) && droplink[0].value.indexOf('&&') > -1) {

                            var queryParams = [];
                            for (j in droplink[0].value.split('&&')) {
                                queryParams.push(droplink[0].value.split('&&')[j].trim())
                            }

                            setTimeout(function () {
                                for (k in droplink) {
                                    if (droplink[k].name == 'REST') {
                                        var k = droplink[k].value
                                        for (u in queryParams) {
                                            if (k.indexOf(queryParams[u]) > -1) {
                                                if ($(sanitize("select[name=" + queryParams[u] + "]")).val()) {
                                                    k = k.replace('{' + queryParams[u] + '}', $(sanitize("select[name=" + queryParams[u] + "]")).val())
                                                } else {
                                                    k = ''
                                                }

                                            }
                                        }
                                        if (k) {
                                            something('GET', k, observedIndex, '', '')
                                        }

                                    }
                                }
                            }, 750)
                        } else if ($scope.parentInput.pageTitle == 'Party Service Association' && droplink && (droplink[0].value.indexOf(z) != -1)) {
                            setTimeout(function () {

                                var _kUrl = ''
                                var _kValue = ''
                                for (k in droplink) {
                                    if (droplink[k].name == 'Choice') {
                                        _kValue = droplink[k].value
                                        _kValue = _kValue.replace('${' + z + '}', $(sanitize("select[name=" + z + "]")).val())
                                    }
                                    if (droplink[k].name == 'REST') {
                                        _kUrl = droplink[k].value
                                    }
                                }

                                if ($(sanitize("select[name=" + z + "]")).val()) {
                                    setTimeout(function () {
                                        $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).find('option').each(function () {
                                            if (!$(this).text()) {
                                                $(this).remove()
                                            }
                                        })
                                    }, 100)
                                    crudRequest('POST', _kUrl, _kValue, '').then(function (response) {
                                        $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
                                        $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).attr('multiple', true)
                                        if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {
                                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val('')
                                            setTimeout(function () {

                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(','))
                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                                                    minimumInputLength: 0,
                                                    allowClear: true
                                                })
                                            }, 3000)
                                        } else {
                                            //Permitted Account Numbers
                                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                                                placeholder: 'Select'
                                            })
                                        }

                                    })
                                }
                            }, 100)
                        } else {
                            if (z1 && z1.FieldName === 'InputFormat') {

                                $scope.setInitval(z1)
                            }
                            $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = $scope.backupCstmdrop[observedIndex].ChoiceOptions
                        }

                    }

                }
            }

        }
    }
    
    var something = function (meth, links, observedIndex, datafield, queryfield) {

        crudRequest(meth, links, datafield, queryfield).then(function (response) {
            $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
            if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName == "ReferenceCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "WorkFlowCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "PartyServiceAssociationCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "RulePhase" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "PermittedAccountNos" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "AgentAccount") {

                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                    ajax: {
                        url: function () {
                            return BASEURL + "/rest/v2/" + links
                        },
                        headers: authenticationObject,
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                xhr.withCredentials = true
                        },
                        crossDomain: true,
                        data: function (params) {

                            var query = {
                                start: params.page * 500 ? params.page * 500 : 0,
                                count: 500
                            }
                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * 500 ? params.page * 500 : 0,
                                    count: 500
                                };
                            }
                            return query;
                        },
                        processResults: function (data, params) {

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
                                    more: data.length >= 500
                                }
                            };
                        },
                        cache: true
                    },
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true,

                })
            } else if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName == "ProcessStatus" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "Action") {
                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true
                })
            }

        })
    }
    $scope.custmalerts = []

    $scope.activatePicker = function (e) {
        var start = new Date();
        function rulesMinDate() {
            if ($scope.parentInput.parentLink == 'vphregisterrefund') {
                return start.setYear(start.getFullYear() - 1000)
            }
            return start.setDate(start.getDate() - 1)
        }

        function rulesMaxDate() {
            if ($scope.parentInput.parentLink == 'vphregisterrefund') {
                return new Date()
            }
            if ( $scope.parentInput.parentLink == 'vphcycleextensionach') {
                return start.setDate(start.getDate() + 1)
            }
            if ( $scope.parentInput.parentLink == 'vphcycleextensionef') {
                return start.setDate(start.getDate() + 1)
            }
            return start.setYear(start.getFullYear() + 1000)
        }

        $('.DatePicker').datetimepicker({
            locale: 'es',
            minDate: rulesMinDate(),
            maxDate: rulesMaxDate(),
            format: "YYYY-MM-DD",
            useCurrent: false,
            showClear: true,
            icons: datepickerFaIcons.icons
        }).on('dp.change', function (ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function (ev) {
            //datePlaceholder = $(ev.currentTarget).attr('placeholder')
            $(ev.target).next().css({
                bottom: 'auto'
            });
            //$(ev.currentTarget).attr('placeholder', 'YYYY MM DD')

            $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                "overflow-y": ""
            });
            if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
                    if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) { } else {
                        $(this).css({
                            "display": "none"
                        });
                    }
                })
            }
        }).on('dp.hide', function (ev) {
            //$(ev.currentTarget).attr('placeholder', 'Please Enter ' + $(ev.currentTarget).attr('id'))
            if ($(ev.currentTarget).parent().parent().parent().parent().attr('id')) {
                var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
                var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
                    $(this).css({
                        "display": ""
                    });
                })
                $(sanitize('#' + y)).animate({
                    scrollTop: ($(sanitize('#' + y + '_' + x)).outerHeight() * (x + 1)) + 'px'
                }, 0);
            }
        });

        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: false,
            showClear: true,
            icons: datepickerFaIcons.icons
        }).on('dp.change', function (ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function (ev) {
            $(ev.currentTarget).attr('placeholder', 'HH MM SS')
            $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                "overflow-y": ""
            });
            if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
                    if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) { } else {
                        $(this).css({
                            "display": "none"
                        });
                    }
                })
            }
            if ($scope.parentInput.parentLink === 'cutoffs' && $scope.parentInput.Operation === 'Edit') {
                $scope.custmalerts = [{
                    type: 'warning',
                    msg: 'Editing the Cut off time will affect the attached MOP'
                }];
            }
        }).on('dp.hide', function (ev) {
            $(ev.currentTarget).attr('placeholder', 'Please Enter ' + $(ev.currentTarget).attr('id'))
            if ($(ev.currentTarget).parent().parent().parent().parent().attr('id')) {
                var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
                var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
                    $(this).css({
                        "display": ""
                    });
                })
                $(sanitize('#' + y)).animate({
                    scrollTop: ($(sanitize('#' + y + '_' + x)).outerHeight() * (x + 1)) + 'px'
                }, 0);
            }
        });
        /* var prevPH = ''
        $('.DatePicker, .TimePicker').focus(function(){
            prevPH = $(this).attr('placeholder')
            $(this).attr('placeholder', $(this).hasClass('DatePicker') ? 'YYYY MM DD' : $(this).hasClass('TimePicker') ? 'HH MM SS' : 'Please Enter '+$(this).attr('id'))
        })
        $('.DatePicker, .TimePicker').blur(function(){
            $(this).attr('placeholder', prevPH)
        }) */
    }

    $scope.triggerPicker = function (e) {

        if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $scope.activatePicker($(e.currentTarget).prev());
            $('input[name=' + $(e.currentTarget).prev().attr('name') + ']').data("DateTimePicker").show();
        }
    };

    /*
    $scope.dateRangePickerFn = function(){
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.0/locales/bootstrap-datepicker.ar.min.js", function(){
    var startDate = new Date();
    var FromEndDate = new Date();
    var ToEndDate = new Date();
    ToEndDate.setDate(ToEndDate.getDate()+365);


    $('#EntryStartDate').datepicker({
    weekStart: 1,
    startDate: '1900-01-01',
    minDate:1,
    endDate: FromEndDate,
    autoclose: true,
    format: 'yyyy-mm-dd'
    })
    .on('changeDate', function(selected){
    startDate = new Date(selected.date.valueOf());
    startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
    $('#EntryEndDate').datepicker('setStartDate', startDate);

    });

    $('#EntryStartDate').datepicker('setEndDate', FromEndDate);

    $('#EntryEndDate')
    .datepicker({
    weekStart: 1,
    startDate: startDate,
    endDate: ToEndDate,
    autoclose: true,
    format: 'yyyy-mm-dd'
    })
    .on('changeDate', function(selected){
    FromEndDate = new Date(selected.date.valueOf());
    FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
    $('#EntryStartDate').datepicker('setEndDate', FromEndDate);
    });

    $('#EntryEndDate').datepicker('setStartDate', startDate);
    });

    }

    $scope.dateRangePickerFn();
     */

    $scope.Autodatepopulate = function (choiceOptions, fieldName) {
        if(choiceOptions == "[object Object]"){
            $scope.fieldData[fieldName]  = "";
        }
        if ($scope.parentInput.pageTitle === 'Register Accounts') {

            $http.get(BASEURL + '/rest/v2/limits/days?LimitName=' + choiceOptions).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                $scope.totalData = data[0]
                if ($scope.totalData) {
                    if ($scope.totalData['ValidTillDate']) {
                        var Currentdate = new Date();

                        Currentdate.setDate(Currentdate.getDate() + parseInt($scope.totalData.ValidTillDate));
                        $scope.fieldData['ValidTillDate'] = $filter('date')(Currentdate, 'yyyy-MM-dd')
                    }

                    if ($scope.totalData['CreationDate']) {
                        $scope.fieldData['CreationDate'] = $scope.totalData.CreationDate.split('T')[0]
                    }

                    if ($scope.totalData['ApprovalTillDate']) {
                        var Currentdate_ = new Date();
                        Currentdate_.setDate(Currentdate_.getDate() + parseInt($scope.totalData.ApprovalTillDate));
                        $scope.fieldData['ApprovalTillDate'] = $filter('date')(Currentdate_, 'yyyy-MM-dd')
                    }

                }
            })
        }

        if($scope.parentInput.pageTitle === 'Notifications') {
            if(fieldName == "type") {
                $timeout(() => {
                    $('select[name="party"]').val('').trigger("change");
                }, 5);
            }
        }

    }

    $scope.NumberCalculation = function (val) {
        if ($scope.parentInput.pageTitle === 'VPH Daily Rates') {
            if (val['RateOfTheDay'] && val['PointsDiscountROD']) {
                $scope.fieldData['RateWithDiscount'] = val['RateOfTheDay'] - val['PointsDiscountROD']
            }
            if (val['DTF'] && val['DiscountPointsDTF']) {
                $scope.fieldData['DTFWithDiscount'] = val['DTF'] - val['DiscountPointsDTF']
            }
        }
    }

    $scope.select2Loadmore = function (argu, _link) {
        if ($scope.fieldData[argu.FieldName]) {
            var _query = {
                search: $scope.fieldData[argu.FieldName],
                start: 0,
                count: 500
            }

            crudRequest('GET', _link, '', _query).then(function (response) {
                for (hj in $scope.parentInput.pageInfo.Section) {
                    if ($scope.parentInput.pageInfo.Section[hj].FieldName == argu.FieldName) {
                        $scope.parentInput.pageInfo.Section[hj].ChoiceOptions = response.data.data
                    }
                }
            });
        }
        //	else{

            var pageLimitCount = 500;
            $(sanitize('select[name=' + argu.FieldName + ']')).select2({
                ajax: {
                    url: function () {
                        return BASEURL + "/rest/v2/" + _link
                    },
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCredentials = true
                    },
                    crossDomain: true,
                    data: function (params) {
                        var query = {
                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                            count: pageLimitCount
                        }
                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            };
                        }
                        return query;
                    },
                    processResults: function (data, params) {
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
                                more: data.length >= pageLimitCount
                            }
                        };
                    },
                    cache: true
                },
                placeholder: 'Select',
                minimumInputLength: 0,
                allowClear: true,

            })
        //	}
    }

    $scope.dependedInputval = ['ConnectingParty', 'ParentEntity', 'RedirectionParticipantID']

    $scope.getSelectplaceholder = function (val) {
        var fieldLabel = typeof (val) == "string" ? JSON.parse(val).FieldName : val.FieldName
        if (($stateParams.input.parentLink == 'vphtrxtypeconstraintscontrols') && (fieldLabel == "Banco Origen" || fieldLabel == "Banco Destino" || fieldLabel == "TRXTYPECODE")) {
            return "El campo vacío indica TODAS";
        }
        else if(($stateParams.input.parentLink == 'notifront') && (fieldLabel == "party")){
            return $filter('translate')('Placeholder.All');
        } else {
            return $filter('translate')('Placeholder.Select');
        }
    }

    function loadURLToInputFiled(imgBlob, fileName, types) {
        // Load img blob to input
        // WIP: UTF8 character error
        let file = new File([imgBlob], fileName, { type: types, lastModified: new Date().getTime() }, 'utf-8');
        let container = new DataTransfer();
        container.items.add(file);
        if($scope.parentInput.parentLink == 'notifront'){
            var el = document.getElementById('content');
        }
        else{
            var el = document.getElementById('uploadBtn');
        }
        el.files = container.files;
        $scope.fileNameChanged(el,0);
    }

    $(document).ready(function () {

        if($scope.Title == "OTPException" && document.getElementById("OTPException.ExpirationTime")){
            document.getElementById("OTPException.ExpirationTime").addEventListener("keyup",validateOnlyNumbers )
            function validateOnlyNumbers (eve) {
                if(eve.target.id === "OTPException.ExpirationTime" && !eve.target.value.match(/^[0-9]*$/mg)){
                    eve.target.value = "";
                    $scope.alerts = [{
                        type: 'danger',
                        msg: $filter('translate')('OTPException.InvalidExpirationTimeOnlyNumbers')
                    }]
                }
            }
        }

        setTimeout(function () {
            if (($scope.parentInput.Operation == 'Add') || ($scope.parentInput.Operation == ' Add')) {
                var pageLimitCount = 500;
                $("select").each(function () {
                    var details = $(this).attr('detailsoffield') ? JSON.parse($(this).attr('detailsoffield')) : '';
                    if (details) {
                        if ('Multiple' in details && details.Multiple[details.Multiple.length - 1].displayvalue == 'MULTISELECT' && details.Multiple[details.Multiple.length - 1].actualvalue) {
                            $(this).find('option').each(function () {
                                if ($(this).attr('value') == '') {
                                    $(this).remove();
                                }
                            })
                            $(this).find('option:first-child').remove()
                            $(this).val('')

                            if ($scope.parentInput.parentLink === 'partyserviceassociations' && $(this).attr('name') === 'PermittedAccountNos') {
                                $(this).append('<option value="">Select</option>')
                            } else {
                                $(this).attr('multiple', true)
                            }
                        }

                        for (j in $scope.dependedInputval) {
                            if ($scope.dependedInputval[j] == details.FieldName) {
                                var saveLink = details.property[details.property.length - 1].value;
                                var inputName = []
                                var _links = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                                    '_data': $scope.parentInput.pageInfo.Section,
                                    '_name': 'FieldName'
                                } : {
                                    '_data': $scope.parentInput.pageInfo,
                                    '_name': 'name'
                                };

                                for (k in _links._data) {
                                    if (_links._data[k][_links._name] == details.FieldName) {
                                        $scope.dependedInputvalchoice = {
                                            '_index': k,
                                            '_data': _links._data[k]
                                        }
                                    }
                                }

                                for (v in saveLink.split('/')) {
                                    if (saveLink.split('/')[v].match('{')) {
                                        inputName.push(saveLink.split('/')[v].replace('{', '').replace('}', ''))
                                        $('input[name=' + inputName[inputName.length - 1] + ']').on('blur', function () {
                                            var kash;
                                            saveLink = details.property[details.property.length - 1].value
                                            for (u in inputName) {
                                                if ($('input[name=' + inputName[u] + ']').val() == '') {
                                                    kash = false
                                                    saveLink = details.property[details.property.length - 1].value

                                                    if (_links._name == 'FieldName') {
                                                        if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
                                                            $('select[name=' + details.FieldName + ']').select2('destroy')
                                                            $('select[name=' + details.FieldName + ']').val('')
                                                            $('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
                                                        }
                                                        $scope.parentInput.pageInfo.Section[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
                                                    } else {
                                                        if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
                                                            $('select[name=' + details.FieldName + ']').select2('destroy')
                                                            $('select[name=' + details.FieldName + ']').val('')
                                                            $('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
                                                        }
                                                        $scope.parentInput.pageInfo[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
                                                    }
                                                    break;
                                                } else {
                                                    kash = true
                                                    saveLink = saveLink.replace('{' + inputName[u] + '}', $('input[name=' + inputName[u] + ']').val());
                                                }
                                            }
                                            if (kash) {
                                                $scope.select2Loadmore(details, saveLink);
                                            }
                                        })
                                    }
                                }

                            }
                        }
                    }
                })
                
                remoteDataConfig = function () {

                    var add_method = 'GET';
                    //setTimeout(function(){
                    $(".appendSelect2").each(function () {

                        $scope.chkREST = $(this).attr('detailsoffield') ? JSON.parse($(this).attr('detailsoffield')) : '';

                        if (($(this).attr('name') == 'FieldPath' || $(this).attr('name') == 'fldName' || $(this).attr('name') == 'AcctField' || $(this).attr('name') == 'Value' || $(this).attr('name') == 'Name') && $scope.chkREST.property[0].name == 'REST') {
                            add_method = 'POST'
                        } else {
                            add_method = 'GET'
                        }

                        $(this).select2({
                            ajax: {
                                url: function (params) {
                                    var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                                        '_data': $scope.parentInput.pageInfo.Section,
                                        '_name': 'FieldName'
                                    } : {
                                        '_data': $scope.parentInput.pageInfo,
                                        '_name': 'name'
                                    };
                                    for (k in _link._data) {
                                        if (_link._data[k][_link._name] == $(this).attr('name')) {
                                            $scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length - 1].configDetails.links
                                        }
                                        if ('webform' in _link._data[k]) {
                                            for (jk in _link._data[k]['webform'].Subsection[0].subSectionData) {
                                                if (_link._data[k]['webform'].Subsection[0].subSectionData[jk][_link._name] == $(this).attr('name')) {

                                                    if ($.isArray(_link._data[k]['webform'].Subsection[0].subSectionData[jk].property)) {
                                                        $scope.links = _link._data[k]['webform'].Subsection[0].subSectionData[jk].property[0].value;

                                                        if ($scope.links.match('{')) {
                                                            for (var j in $scope.links.split('/')) {
                                                                if ($scope.links.split('/')[j].match('{') && $scope.links.split('/')[j].match('}')) {
                                                                    var inputs = $scope.links.split('/')[j].replace('{', '').replace('}', '')
                                                                    $scope.links = $scope.links.replace($scope.links.split('/')[j], $('select[name=' + inputs + ']').val())
                                                                }
                                                            }
                                                        }

                                                        var query = "?start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                                                        if (params.term) {
                                                            query = "?search=" + params.term + "&start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                                                        }
                                                        $scope.links = $scope.links + query
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]) {
                                        for (kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData) {
                                            if ($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == $(this).attr('name')) {

                                                $scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value
                                            }
                                        }
                                    }
                                    return BASEURL + "/rest/v2/" + $scope.links
                                },
                                type: add_method,
                                headers: authenticationObject,
                                dataType: 'json',
                                delay: 250,
                                xhrFields: {
                                    withCredentials: true
                                },
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                    xhr.withCredentials = true
                                },
                                crossDomain: true,
                                data: function (params) {
                                    var query = {
                                        start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                        count: pageLimitCount
                                    }

                                    if (params.term) {
                                        query = {
                                            search: params.term.toUpperCase(),
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount
                                        };
                                    }

                                    if($scope.links == 'notifications/party' &&$scope.fieldData['type'] && ($scope.fieldData['type'] == "IO BROADCAST" || $scope.fieldData['type'] == "IO Alert")){
                                        query['type'] = $scope.fieldData['type'];
                                    }
                                    return query;
                                },
                                /*transport: function(params) {
                                var callback = params.success;
                                params.success = function(data, textStatus, jqXHR) {
                                $scope.responseHeaderTcount = jqXHR.getResponseHeader('totalCount')
                                callback({
                                items: data,
                                total: jqXHR.getResponseHeader('totalCount')
                                }, textStatus, jqXHR);
                                };
                                return $.ajax(params);
                                },*/
                                processResults: function (data, params) {
                                    params.page = params.page ? params.page : 0;
                                    var myarr = []
                                    for (j in data) {
                                        myarr.push({
                                            'id': data[j].actualvalue,
                                            'text': $filter('translate')(data[j].displayvalue)
                                        })
                                    }
                                    return {
                                        results: myarr,
                                        pagination: {
                                            more: data.length >= pageLimitCount
                                        }
                                    };
                                },
                                cache: true
                            },
                            placeholder: $scope.getSelectplaceholder($(this).attr('detailsoffield')),
                            minimumInputLength: 0,
                            allowClear: true

                        });
                    })
                    //},0)

                }
                remoteDataConfig();
            } else {
                if ($scope.parentInput.parentLink == 'notifront') {
                    $scope.parentInput.pageInfo.Subsection[0].subSectionData[0].visible = true;
                    $scope.parentInput.pageInfo.Subsection[0].subSectionData[1].visible = true;
                    $scope.parentInput.pageInfo.Subsection[0].subSectionData[2].visible = true;
                    $scope.parentInput.pageInfo.Subsection[0].subSectionData[3].visible = true;

                    $scope.uploadFiles = true;
                    $scope.$apply();
                    if ($scope.parentInput.fieldData.attachment_list) {
                        loadURLToInputFiled($scope.parentInput.fieldData.attachment_list.content, $scope.parentInput.fieldData.attachment_list.name, $scope.parentInput.fieldData.attachment_list.type)
                        $scope.parentInput.pageInfo.Section[8].visible = true;
                    }
                }
                else if($scope.parentInput.parentLink == 'ACHmailConfig'){
                    loadURLToInputFiled($scope.parentInput.fieldData.value, $scope.parentInput.fieldData.fileName,"");
                    if($scope.parentInput.Operation != 'Clone'){$scope.parentInput.pageInfo.Section[0].enabled = false;}
                }

                $("select").each(function () {
                    var details = $(this).attr('detailsoffield') ? JSON.parse($(this).attr('detailsoffield')) : '';
                    for (j in $scope.dependedInputval) {
                        if ($scope.dependedInputval[j] == details.FieldName) {
                            var saveLink = details.property[details.property.length - 1].value;
                            var inputName = []
                            var _links = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                                '_data': $scope.parentInput.pageInfo.Section,
                                '_name': 'FieldName'
                            } : {
                                '_data': $scope.parentInput.pageInfo,
                                '_name': 'name'
                            };

                            for (k in _links._data) {
                                if (_links._data[k][_links._name] == details.FieldName) {
                                    $scope.dependedInputvalchoice = {
                                        '_index': k,
                                        '_data': _links._data[k]
                                    }
                                }
                            }

                            for (v in saveLink.split('/')) {
                                if (saveLink.split('/')[v].match('{')) {
                                    inputName.push(saveLink.split('/')[v].replace('{', '').replace('}', ''))
                                    $('input[name=' + inputName[inputName.length - 1] + ']').on('blur', function () {
                                        var kash;
                                        saveLink = details.property[details.property.length - 1].value
                                        for (u in inputName) {
                                            if ($('input[name=' + inputName[u] + ']').val() == '') {
                                                kash = false
                                                saveLink = details.property[details.property.length - 1].value

                                                if (_links._name == 'FieldName') {
                                                    if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
                                                        $('select[name=' + details.FieldName + ']').select2('destroy')
                                                        $('select[name=' + details.FieldName + ']').val('')
                                                        $('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
                                                    }
                                                    $scope.parentInput.pageInfo.Section[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
                                                } else {
                                                    if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
                                                        $('select[name=' + details.FieldName + ']').select2('destroy')
                                                        $('select[name=' + details.FieldName + ']').val('')
                                                        $('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
                                                    }
                                                    $scope.parentInput.pageInfo[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions
                                                }
                                                break;
                                            } else {
                                                kash = true
                                                saveLink = saveLink.replace('{' + inputName[u] + '}', $('input[name=' + inputName[u] + ']').val());
                                            }
                                        }
                                        if (kash) {
                                            $scope.select2Loadmore(details, saveLink);
                                        }
                                    })
                                }
                            }

                        }
                    }
                })
            }

            if($scope.parentInput.parentLink === 'limits' && $scope.parentInput.Operation === "Edit" && $scope.parentInput.SelectedChoiceLimitis.length > 0){
                var data = $scope.parentInput.SelectedChoiceLimitis.map(item =>{
                    return{
                        id: item.actualvalue,
                        text: item.displayvalue
                    }
                });
                var x=document.getElementById("Limits.TipoTransacciones")
                if(x.length >0){
                    for (i = 0; i < x.length; i++) {
                        if ($scope.parentInput.SelectedChoiceLimitis.map(i => i.actualvalue).includes(x.options[i].value)) {
                            x.options[i].setAttribute('selected', 'selected')
                        }else{
                            x.options[i].remove();
                            i=i-1;
                        }
                    }
                } else{
                    data.forEach(item=>{
                        var opt = document.createElement('option');
                        opt.value = item.id;
                        opt.innerHTML = item.text;
                        opt.setAttribute('selected', 'selected');
                        console.log(opt);
                        x.appendChild(opt);
                    })

                }
            }

            if ($rootScope.BrFields) {
                for (var i in $rootScope.BrFields) {
                    $('select[name=' + $rootScope.BrFields[i] + ']').select2()
                }
            }


            $("select").on("change", function (e) {
                if ($scope.parentInput.pageTitle === 'Party Service Association') {
                    //			
                    if (($(e.currentTarget).attr('name') == 'PartyCode') || ($(e.currentTarget).attr('name') == 'ServiceCode') || ($(e.currentTarget).attr('name') == 'InputFormat')) {
                        $('input[name=PartyServiceAssociationCode]').val($('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=ServiceCode]').val() + '_' + $('select[name=InputFormat]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() : $('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=ServiceCode]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() + '_' + $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() : '')
                        $scope.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
                        //$scope.parentInput.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
                    }
                }
            });

            $('input[type=radio]').each(function () {
                if ($(this).val() == 'false' && $scope.parentInput.Operation == 'Add') {
                    $scope.fieldData[$(this).attr('name')] = false
                }
            })

            for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
                $('[name=' + _fieldName + ']').each(function () {
                    if ($(this).attr('type') == 'radio') {
                        if ($(this).prop('checked') && $(this).val() == 'true') {
                            $scope.cstmAttrfn(this, true, true)
                        }
                    } else {
                        if ($(this).val()) {
                            $scope.cstmAttrfn(this)
                        }
                    }
                })
            }

        }, 1000)

        $scope.backupcstmAttr = {}
        for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
            $('[name=' + _fieldName + ']').on('change', function () {
                $scope.cstmAttrfn(this)
            })
        }

        function remoteDataConfig1() {
            var pageLimitCount = 500

            var add_method = 'GET'
            //setTimeout(function(){
            $(".appendSelect2").each(function () {

                if ($(this).attr('name') == 'FieldPath' || $(this).attr('name') == 'fldName') {
                    add_method = 'POST';
                } else {
                    add_method = 'GET';
                }

                $(this).select2({
                    ajax: {
                        url: function (params) {
                            var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                                '_data': $scope.parentInput.pageInfo.Section,
                                '_name': 'FieldName'
                            } : {
                                '_data': $scope.parentInput.pageInfo,
                                '_name': 'name'
                            };

                            for (k in _link._data) {
                                if (_link._data[k][_link._name] == $(this).attr('name')) {
                                    $scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length - 1].configDetails.links
                                }

                                if ('webform' in _link._data[k]) {
                                    for (jk in _link._data[k]['webform'].Subsection[0].subSectionData) {
                                        if (_link._data[k]['webform'].Subsection[0].subSectionData[jk][_link._name] == $(this).attr('name')) {

                                            if ($.isArray(_link._data[k]['webform'].Subsection[0].subSectionData[jk].property)) {

                                                $scope.links = _link._data[k]['webform'].Subsection[0].subSectionData[jk].property[0].value

                                                if ($scope.links.match('{')) {
                                                    for (var j in $scope.links.split('/')) {
                                                        if ($scope.links.split('/')[j].match('{') && $scope.links.split('/')[j].match('}')) {
                                                            var inputs = $scope.links.split('/')[j].replace('{', '').replace('}', '')
                                                            $scope.links = $scope.links.replace($scope.links.split('/')[j], $('select[name=' + inputs + ']').val())
                                                        }
                                                    }
                                                }

                                                var query = "?start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                                                if (params.term) {
                                                    query = "?search=" + params.term + "&start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                                                }
                                                $scope.links = $scope.links + query
                                            }
                                        }
                                    }
                                }
                            }

                            if (_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]) {
                                for (kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData) {
                                    if ($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == $(this).attr('name')) {
                                        $scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value;
                                    }
                                }
                            }

                            return BASEURL + "/rest/v2/" + $scope.links
                        },
                        type: add_method,
                        headers: authenticationObject,
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                xhr.withCredentials = true
                        },
                        crossDomain: true,
                        data: function (params) {

                            var query = {
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            }
                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                    count: pageLimitCount
                                };
                            }
                            return query;
                        },
                        /*transport: function(params) {
                        var callback = params.success;
                        params.success = function(data, textStatus, jqXHR) {
                        $scope.responseHeaderTcount = jqXHR.getResponseHeader('totalCount')
                        callback({
                        items: data,
                        total: jqXHR.getResponseHeader('totalCount')
                        }, textStatus, jqXHR);
                        };
                        return $.ajax(params);
                        },*/
                        processResults: function (data, params) {
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
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },
                        cache: true
                    },
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true

                });
            })
            //},0)

        }

        $scope.cstmAttrfn = function (_this, flag, flag1) {
            var inputs = ''
            if (flag) {
                inputs = Boolean($(_this).val())
            } else {
                inputs = $(_this).val()
            }

            if ($scope.parentInput.parentLink === 'xmlfilegeneration') {

                // if (Object.keys($scope.cstmAttrBackup).length === 0) {
                //     for (var attr in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                //         for (var sec in $scope.parentInput.pageInfo.Section) {
                //             if ($scope.parentInput.pageInfo.Section[sec].FieldName == attr) {
                //                 $scope.cstmAttrBackup[attr] = {
                //                     id: sec,
                //                     value: angular.copy($scope.parentInput.pageInfo.Section[sec])
                //                 }
                //             }
                //         }
                //     }
                // }

                if ($scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                    for (var attr in $scope.cstmAttrBackup) {
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Visible'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['visible'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['View'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['enabled'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Enabled']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Mandatory'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['NotNull'];
                        $('[name=' + attr + ']').parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')

                        //    $scope.fieldData[attr] = '';

                        if (($scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Visible']) && ($('[name=' + attr + ']').val())) {

                        } else {
                            $scope.fieldData[attr] = ''
                        }
                    }
                } else {
                    for (var attr in $scope.cstmAttrBackup) {

                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Visible'] = $scope.cstmAttrBackup[attr]['value']['visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['visible'] = $scope.cstmAttrBackup[attr]['value']['visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['View'] = $scope.cstmAttrBackup[attr]['value']['visible']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['enabled'] = $scope.cstmAttrBackup[attr]['value']['enabled']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Mandatory'] = !$scope.cstmAttrBackup[attr]['value']['notnull']
                        $scope.fieldData[attr] = ''
                    }
                }
            }

            if ($scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                $scope.backupcstmAttr[$(_this).attr('name')] = {}
                for (var attr in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {

                    for (var sec in $scope.parentInput.pageInfo.Section) {
                        if ($scope.parentInput.pageInfo.Section[sec].FieldName == attr) {
                            $scope.backupcstmAttr[$(_this).attr('name')][attr] = {
                                'index': sec,
                                'value': angular.copy($scope.parentInput.pageInfo.Section[sec])
                            }
                            if (flag1 && 'webform' in $scope.backupcstmAttr[$(_this).attr('name')][attr].value) {
                                for (var kk in $scope.backupcstmAttr[$(_this).attr('name')][attr].value.webform.Subsection[0].subSectionData) {
                                    $scope.backupcstmAttr[$(_this).attr('name')][attr].value.webform.Subsection[0].subSectionData[kk].ChoiceOptions = $scope.backupcstmAttr[$(_this).attr('name')][attr].value.webform.Subsection[0].subSectionData[kk].Multiple
                                }
                            }

                            for (var attrs in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]) {
                                $scope.parentInput.pageInfo.Section[sec][attrs == 'NotNull' ? 'Mandatory' : attrs.toLowerCase()] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr][attrs]
                            }
                            $('[name=' + attr + ']').parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                        }
                    }
                }

            } else {
                for (var attr in $scope.backupcstmAttr[$(_this).attr('name')]) {
                    if ($scope.parentInput.pageInfo.Section[$scope.backupcstmAttr[$(_this).attr('name')][attr].index].FieldName == attr) {
                        $scope.parentInput.pageInfo.Section[$scope.backupcstmAttr[$(_this).attr('name')][attr].index] = $scope.backupcstmAttr[$(_this).attr('name')][attr].value
                        $('[name=' + attr + ']').parent().prev().find('span').attr('ng-hide', true).addClass('ng-hide')
                        
                        if ($scope.fieldData[attr]) {
                            if (typeof ($scope.fieldData[attr]) == 'object') {
                                if ($scope.fieldData[attr].Fields) {
                                    $scope.fieldData[attr].Fields = [{}]
                                }
                            } else {
                                $scope.fieldData[attr] = ''
                            }
                        }
                    }
                }

            }

            setTimeout(function () {
                remoteDataConfig1()
            }, 100)

            $scope.$apply(function () {
                $scope.parentInput.pageInfo = $scope.parentInput.pageInfo;
            })
        }
        if($scope.parentInput.parentLink === 'limits' && $scope.parentInput.Operation === "Edit"){
            //'Limits.TipoTransacciones'
            if($scope.parentInput.fieldData.EnabledTrxTypes){
                let selectOptions = $scope.parentInput.fieldData.EnabledTrxTypes.split(',')
                if (selectOptions.length >0 && $scope.parentInput.pageInfo.Section.findIndex( sec => sec.FieldName === "EnabledTrxTypes") > -1) {
                    let {ChoiceOptions} = $scope.parentInput.pageInfo.Section.find( sec => sec.FieldName === "EnabledTrxTypes")
                    $("#Limits.TipoTransacciones").select2('val', ChoiceOptions);
                }
            }

        }
    });

    $(document).ready(function () {
        $('#changesLostModal').on('shown.bs.modal', function (e) {
            $('body').css('padding-right', 0)
        });
        $('#changesLostModal').on('hidden.bs.modal', function (e) {
            $scope.fromCancelClick = false;
            $scope.breadCrumbClicked = false;
        })
    });

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    $scope.setInitval = function (argu, a, b, c, d) {

        var __method = 'GET'
        $scope.multipleFlag = false;
        var _name = ($scope.parentInput.parentLink != 'methodofpayments') ? argu.FieldName : argu.name;
        var _query = {}
        var multipleVal = []

        if ($scope.fieldData[_name] && $scope.fieldData[_name].match(/\,/g)) {
            argu.ChoiceOptions = []

            _query = {
                start: 0,
                count: 500
            }

            crudRequest('GET', argu.property[0].value, '', _query).then(function (response) {
                for (k in $scope.fieldData[_name].split(',')) {
                    multipleVal.push($scope.fieldData[_name].split(',')[k])
                    argu.ChoiceOptions.push(objectFindByKey(response.data.data, 'actualvalue', $scope.fieldData[_name].split(',')[k]))
                }

                if ($scope.fieldData[_name].split(',').length != argu.ChoiceOptions.length) {
                    argu.ChoiceOptions = []
                    for (k in $scope.fieldData[_name].split(',')) {
                        _query = {
                            search: $scope.fieldData[_name].split(',')[k],
                            start: 0,
                            count: 500
                        }
                        if($scope.parentInput.pageTitle == "Notifications" && $scope.fieldData['type'] && ($scope.fieldData['type'] == "IO BROADCAST" || $scope.fieldData['type'] == "IO Alert")){
                            _query['type'] = $scope.fieldData['type'];
                        }
                        multipleVal.push($scope.fieldData[_name].split(',')[k])
                        crudRequest('GET', argu.property[0].value, '', _query).then(function (response) {
                            for (k in response.data.data) {
                                //argu.ChoiceOptions.push(response.data.data[k])
                                argu.ChoiceOptions.push(response.data.data[k])
                            }
                        });
                    }
                }

            });
        } else if ($scope.fieldData[_name]) {
            argu.ChoiceOptions = []
            _query = {
                //search : $filter('nospace')($scope.fieldData[_name]),
                search: $scope.fieldData[_name],
                start: 0,
                count: 500
            }
            if($scope.parentInput.pageTitle == "Notifications" && $scope.fieldData['type'] && ($scope.fieldData['type'] == "IO BROADCAST" || $scope.fieldData['type'] == "IO Alert")){
                _query['type'] = $scope.fieldData['type'];
            }
            crudRequest('GET', argu.property[0].value, '', _query).then(function (response) {
                argu.ChoiceOptions = response.data.data
            });
        } else if (a && b) {

            var seta_Flag = true;
            var backupChoiceOptions = angular.copy(argu.ChoiceOptions);
            var backupMultiple = angular.copy(argu.Multiple)
            var MsgSection = angular.copy($scope.fieldData[a][b])

            //argu.ChoiceOptions = []
            var l_link = argu.property[0].value
            if (l_link.match('{')) {
                for (var j in l_link.split('/')) {
                    if (l_link.split('/')[j].match('{') && l_link.split('/')[j].match('}')) {
                        var inputs = l_link.split('/')[j].replace('{', '').replace('}', '')
                        l_link = l_link.replace(l_link.split('/')[j], $scope.fieldData[inputs])

                        if (!$('select[name=' + inputs + ']').val()) {
                            seta_Flag = false;
                        }
                    }
                }
            }

            __method = 'POST'

            var newSelectionObj = {};
            var newSelect = [];

            for (var ms in MsgSection) {
                if ($.isPlainObject(MsgSection[ms]) && $.isEmptyObject(MsgSection[ms])) {
                    MsgSection.splice(ms, 1)
                }
            }

            if (a.toUpperCase() == 'APENTRYCONFIG' || a.toUpperCase() == 'APGROUPCONFIG' || a.toUpperCase() == 'APSELECTIONCRITERIA') {
                newSelect = [];
                newSelectionObj = {};

                for (var ms in MsgSection) {
                    newSelectionObj = {};
                    newSelectionObj[argu.FieldName] = MsgSection[ms][argu.FieldName]
                    newSelect.push(newSelectionObj)
                }

                if (c == 0 && $scope.fieldData[a][b][c][_name] && seta_Flag || d == 'Add' && argu.property[0].name == 'REST') {
                    _query = {
                        "MsgSection": newSelect
                    }
                    crudRequest('POST', l_link, _query).then(function (response) {
                        argu.ChoiceOptions = response.data.data;
                    });
                }
            } else {

                for (var ms in MsgSection) {
                    if ($.isPlainObject(MsgSection[ms]) && $.isEmptyObject(MsgSection[ms])) {
                        MsgSection.splice(ms, 1)
                    }
                }

                if (c == 0 && $scope.fieldData[a][b][c][_name] && seta_Flag || d == 'Add') {
                    _query = {
                        "MsgSection": MsgSection
                    }

                    crudRequest('POST', l_link, _query).then(function (response) {
                        argu.ChoiceOptions = response.data.data;
                    });
                }
            }
        }

        setTimeout(function () {
            var pageLimitCount = 500;
            if (argu.Multiple[argu.Multiple.length - 1].displayvalue == 'MULTISELECT') {
                $('select[name=' + _name + ']').attr('multiple', true)
                if (multipleVal.length) {

                    if ($('select[name=' + _name + ']').length > 1) {
                        $('select[name=' + _name + ']').each(function (e) {
                            if ($($('select[name=' + _name + ']')[e]).val() != multipleVal[e]) {

                                $($('select[name=' + _name + ']')[e]).val(multipleVal[e])
                            } else {

                            }
                        })

                    } else {
                        $('select[name=' + _name + ']').val(multipleVal)
                    }

                } else {

                    if ($('select[name=' + _name + ']').find('option:first').val().match('undefined:undefined') || $('select[name=' + _name + ']').find('option:first').val().match('string:')) {
                        $('select[name=' + _name + ']').find('option:first').remove()
                    } else {

                    }
                }
            }

            $("select").each(function () {
                var details = $(this).attr('detailsoffield') ? JSON.parse($(this).attr('detailsoffield')) : '';
                for (j in $scope.dependedInputval) {
                    if ($scope.dependedInputval[j] == details.FieldName) {

                        var saveLink = details.property[details.property.length - 1].value;
                        var inputName = []
                        var _links = ($scope.parentInput.parentLink != 'methodofpayments') ? { '_data': $scope.parentInput.pageInfo.Section, '_name': 'FieldName' } : { '_data': $scope.parentInput.pageInfo, '_name': 'name' };
                        for (k in _links._data) {
                            if (_links._data[k][_links._name] == details.FieldName) {
                                $scope.dependedInputvalchoice = {
                                    '_index': k,
                                    '_data': _links._data[k]
                                }
                            }
                        }
                        for (v in saveLink.split('/')) {
                            if (saveLink.split('/')[v].match('{')) {
                                inputName.push(saveLink.split('/')[v].replace('{', '').replace('}', ''))
                                for (u in inputName) {
                                    if ($('input[name=' + inputName[u] + ']').val() != '') {
                                        saveLink = saveLink.replace('{' + inputName[u] + '}', $('input[name=' + inputName[u] + ']').val());
                                    }
                                }
                                $scope.select2Loadmore(details, saveLink);
                            }
                        }

                    }
                }

            })

            $('select[name=' + _name + ']').select2({
                ajax: {
                    url: function (params) {
                        var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                            '_data': $scope.parentInput.pageInfo.Section,
                            '_name': 'FieldName'
                        } : {
                            '_data': $scope.parentInput.pageInfo,
                            '_name': 'name'
                        };

                        for (k in _link._data) {
                            if (_link._data[k][_link._name] == _name) {

                                $scope.links = _link._data[k].property[0].value
                            }

                            if ('webform' in _link._data[k]) {
                                for (jk in _link._data[k]['webform'].Subsection[0].subSectionData) {
                                    if (_link._data[k]['webform'].Subsection[0].subSectionData[jk][_link._name] == $(this).attr('name')) {

                                        if ($.isArray(_link._data[k]['webform'].Subsection[0].subSectionData[jk].property)) {
                                            $scope.links = _link._data[k]['webform'].Subsection[0].subSectionData[jk].property[0].value

                                            if ($scope.links.match('{')) {
                                                for (var j in $scope.links.split('/')) {
                                                    if ($scope.links.split('/')[j].match('{') && $scope.links.split('/')[j].match('}')) {
                                                        var inputs = $scope.links.split('/')[j].replace('{', '').replace('}', '')
                                                        $scope.links = $scope.links.replace($scope.links.split('/')[j], $('select[name=' + inputs + ']').val())
                                                    }
                                                }
                                            }
                                        }


                                    }
                                }
                            }
                        }
                        
                        if (_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]) {
                            for (kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData) {
                                if ($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == _name) {

                                    $scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value
                                }
                            }
                        }

                        if (__method == 'POST') {
                            var query = "?start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                            if (params.term) {
                                query = "?search=" + params.term + "&start=" + (params.page * pageLimitCount ? params.page * pageLimitCount : 0) + "&count=" + pageLimitCount;
                            }
                            $scope.links = $scope.links + query
                        }
                        return BASEURL + "/rest/v2/" + $scope.links
                    },
                    type: __method,
                    headers: authenticationObject,
                    dataType: 'json',
                    delay: 250,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCredentials = true
                    },
                    crossDomain: true,
                    data: function (params) {
                        var query = {
                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                            count: pageLimitCount
                        }
                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            };
                        }

                        if($scope.links == 'notifications/party' && $scope.fieldData['type'] && ($scope.fieldData['type'] == "IO BROADCAST" || $scope.fieldData['type'] == "IO Alert")){
                            query['type'] = $scope.fieldData['type'];
                        }

                        return query;
                    },
                    processResults: function (data, params) {
                        params.page = params.page ? params.page : 0;
                        var myarr = []
                        for (j in data) {
                            myarr.push({
                                'id': data[j].actualvalue,
                                'text': $filter('translate')(data[j].displayvalue)
                            })
                        }

                        return {
                            results: myarr,
                            pagination: {
                                more: data.length >= pageLimitCount
                            }
                        };
                    },
                    cache: true
                },
                placeholder: $scope.getSelectplaceholder(argu),
                minimumInputLength: 0,
                allowClear: true
            })
        }, 2000);
    }

    function updateTextarea(_link, _input, _index) {
        crudRequest("GET", _link, '').then(function (response) {
            $scope.parentInput.pageInfo.Section[_index]['webform'] = BuildnReplaceField(response, _input);
            if (!_input) {
                if ('Subsection' in $scope.parentInput.pageInfo.Section[_index]['webform']) {
                    $scope.fieldData[$scope.parentInput.pageInfo.Section[_index].FieldName] = {}
                    for (k in $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection) {
                        if ($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].FieldName == 'fldName') {
                            $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.splice($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.length - 1, 1)
                        }
                        $scope.fieldData[$scope.parentInput.pageInfo.Section[_index].FieldName][$scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].FieldName] = [{}]
                    }
                }
            } else {
                for (k in $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection) {
                    if ($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].FieldName == 'fldName') {
                        $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.splice($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.length - 1, 1)
                    } else if ($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].FieldName == "Configs" && $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].FieldName == 'Name') {

                    }
                }
            }
        });
    }

    for (k in $scope.parentInput.pageInfo.Section) {
        if ($scope.parentInput.pageInfo.Section[k].InputType == 'TextArea' && 'property' in $scope.parentInput.pageInfo.Section[k] && $scope.parentInput.pageInfo.Section[k].property && $scope.parentInput.pageInfo.Section[k].property[0].name == 'REST-WEBFORM') {

            if ($scope.parentInput.pageInfo.Section[k].FieldName in $scope.fieldData) {
                if (Array.isArray($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])) { } else if (($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].match(/</g)) && ($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].match(/>/g))) {

                    if ($scope.parentInput.pageInfo.Section[k].FieldName == 'APEntryConfig' || $scope.parentInput.pageInfo.Section[k].FieldName == 'APGroupConfig') {
                        xmlDoc = angular.copy($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]);

                        var backupData = convertXml2JSon(xmlDoc)

                        delete $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName];
                        $scope.fieldData[Object.keys(backupData)[0]] = backupData[[Object.keys(backupData)][0]];

                        for (var _i in $scope.fieldData[Object.keys(backupData)[0]]) {
                            var tempArr = [];
                            if (!$.isArray($scope.fieldData[Object.keys(backupData)[0]][_i]) && typeof ($scope.fieldData[Object.keys(backupData)[0]][_i]) != 'string') {
                                tempArr.push($scope.fieldData[Object.keys(backupData)[0]][_i])
                                $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName][_i] = [];
                                $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName][_i] = tempArr;
                            }
                        }
                    } else {
                        xmlDoc = $.parseXML($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]); //is valid XML
                        var xmlData = xmlDoc.getElementsByTagName("duplicateCheckThreshold");
                        var constuctfromXml = {};
                        var constuctfromXmlObj = {};
                        var constuctfromXmlarr = [];
                        $(xmlDoc).children().each(function (e) {
                            $(this).children().each(function (e) {
                                var parentName = $(this).prop("tagName")
                                if ($(this).children().length) {
                                    constuctfromXml[parentName] = constuctfromXmlarr
                                    $(this).children().each(function (e) {
                                        constuctfromXmlObj[$(this).prop("tagName")] = $(this).text();
                                        constuctfromXmlarr.push(constuctfromXmlObj);
                                        constuctfromXmlObj = {};
                                    })
                                } else {
                                    constuctfromXml[parentName] = $(this).text();
                                }
                            })
                        });

                        $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = constuctfromXml
                    }
                } else if (typeof ($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]) == 'string' && $scope.parentInput.pageInfo.Section[k].FieldName.toUpperCase() != 'APSELECTIONCRITERIA') {
                    $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = JSON.parse($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])
                    for (j in $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields) {
                        if (Object.values($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0].match(',')) {
                            $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j][Object.keys($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0]] = Object.values($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0].split(',')
                        }
                    }
                } else if (typeof ($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]) == 'string' && $scope.parentInput.pageInfo.Section[k].FieldName.toUpperCase() == 'APSELECTIONCRITERIA') {
                    var APSelectionCriteria = $scope.fieldData['APSelectionCriteria'].split(',');
                    for (var _j in APSelectionCriteria) {
                        var obj_ = {}
                        APSelectionCriteria[_j] = {
                            'Name': "PCD." + APSelectionCriteria[_j].split(':')[0],
                            'Value': APSelectionCriteria[_j].split(':')[1]
                        }
                    }

                    $scope.fieldData['APSelectionCriteria'] = {
                        "Configs": APSelectionCriteria
                    }
                }
            }
            updateTextarea($scope.parentInput.pageInfo.Section[k].property[0].value, $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName], k)
        }
    }

    $scope.add_Section = function (x, y, z, z1, z2) {
        delete y[z][x].$$hashKey;
        //$('#'+z1).css({'height':$('#'+z1+'_'+x).outerHeight()+10+'px'})
        y[z][x] = removeEmptyValueKeys(y[z][x])
        if (Object.keys(y[z][x]).length !== 0) {
            y[z].push({})
            setTimeout(function () {
                for (var j in z2.subSectionData) {
                    $scope.setInitval(z2.subSectionData[j], z1.split('_')[1], z1.split('_')[0], x, 'Add');
                }
            }, 100)
        }
        //$('#'+z1).animate({scrollTop: ($('#'+z1+'_'+x).outerHeight() * (x + 1 )) + 'px'});
        $('.my-tooltip').tooltip('hide');
    }

    $scope.addsubSection = function (x, y, z) {

        delete y.$$hashKey;

        $(sanitize('#' + z.FieldName)).css({
            'height': $(sanitize('#' + z.FieldName + '_' + x)).outerHeight() + 10 + 'px'
        });
        y = removeEmptyValueKeys(y)
        $scope.subSectionfieldData[z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.FieldName])
        if (Object.keys(y).length !== 0) {

            $scope.subSectionfieldData[z.FieldName].push({})
            for (var j in z.subSectionData) {
                if (z.subSectionData[j].ChoiceOptions && z.subSectionData[j].ChoiceOptions[z.subSectionData[j].ChoiceOptions.length - 1].actualvalue == 'REST') {
                    $scope.setInitval(z.subSectionData[j])
                }
            }

            setTimeout(function () {
                $scope.activatePicker()
            }, 500)
        }
        
        $(sanitize('#' + z.FieldName)).animate({ scrollTop: ($(sanitize('#' + z.FieldName + '_' + x)).outerHeight() * (x + 1)) + 'px' });
        $('.my-tooltip').tooltip('hide');
    }

    $scope.toRuleBuilder = function (ss, index) {
        $stateParams.input.fieldData = ss;

        if ($stateParams.input.Operation == "Edit" || $stateParams.input.Operation == "Clone") {
            var ruleObj = {
                newRuleFormData: JSON.stringify(ss),
                editRuleBuilder: ss.RuleStructure
            }

            GlobalService.editRuleBuilder = ss.RuleStructure;
            $state.go('app.rulegenerate', {
                'input': {
                    'params': $stateParams.input,
                    'ruleObj': ruleObj
                }
            })
        } else if (($stateParams.input.Operation == "Add") || ($stateParams.input.Operation == " Add")) {
            GlobalService.editRuleBuilder = ss.RuleStructure;
            $stateParams.input.fieldData = $scope.fieldData;
            $state.go('app.ruleadd', {
                'input': {
                    'params': $stateParams.input
                }
            })
        }
    }

    $scope.checkModule = function (pLink, fields) {

    }

    $scope.setisreq = function (argu) {
        for (j in argu.$error.required) {
            if (argu.$error.required[j].$error.required) {
                $('.panel').find('#' + argu.$error.required[j].$name).each(function () {
                    var _par = $(this).closest('.panel-collapse')
                    if (!$(_par).hasClass('in')) {
                        $(_par).collapse('show')
                        //$(this).parentsUntil('.panel')
                    }
                })
            }
        }
    }

    if ($scope.parentInput.Operation != 'Add') {
        setTimeout(function () {
            $('.key').each(function () {
                if ($(this).val()) {
                    $(this).css('font-family', 'password')
                } else {
                    $(this).css('font-family', 'inherit')
                }
            })
        }, 100)
    }

    $scope.changetoPasswordFormat = function (event, modelvalue) {
        if (!modelvalue) {
            $(event.currentTarget).css('font-family', 'inherit')
        } else {
            $(event.currentTarget).css('font-family', 'password')
        }
    }

    $scope.LeadingZero = function (argu) {
        $(argu.currentTarget).addClass('LeadingZero')
        if ($(argu.currentTarget).val()) {

        }
    }
    
    $scope.CompareDates = function () {
        if ($scope.fieldData['EffectiveFromDate'] > $scope.fieldData['EffectiveTillDate']) {
            if ($scope.fieldData['EffectiveTillDate']) {
                return true;
            } else {
                return false;
            }
        }
    }

});
