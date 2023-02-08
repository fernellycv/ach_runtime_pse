angular.module('VolpayApp').controller('bankDataFunctions', function($scope, $rootScope, $state, $timeout, $interval, $stateParams, $filter, $http, bankData, GlobalService, EntityLockService, LogoutService, editservice, errorservice, customAttrRestIndex, datepickerFaIcons, Idle) {
    var authenticationObject = $rootScope.dynamicAuthObj;

    function convertXml2JSon(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json(xml);
    }

    $rootScope.$on("MyEvent", function(evt, data) {
        // $scope.stopIdleTimer();
        // $scope.stopsecondIdleTimer();
        //$(window).off( "mousemove keydown click" );
        $("#changesLostModal").modal("show");
        //$interval.cancel(findEvent);
        // handler code here });
    })
    $rootScope.$on("MyEventforEditIdleTimeout", function(evt, data) {
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
    var secondfindEvent;
    $scope.count = 0;
    $scope.seccount = 10;   
    var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
    
    if ($stateParams.input.Operation === 'Edit') {
        $scope.findIdleTime = function() {
            findEvent = $interval(function() {
                $(window).on("mousemove keydown click", function() { // find the window event
                    $scope.stopIdleTimer();
                    $scope.count = 0;
                    $scope.findIdleTime();
                });
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

        $scope.callIdleTime = function() {
            
            setTimeout(function() {
                $("#idletimeout_model").modal("show");
            }, 100)

            secondfindEvent = $interval(function() {
               
                $(window).on("mousemove keydown click", function() { // find the window event
                    $scope.stopsecondIdleTimer();
                    $scope.seccount = 10;
                    // $scope.findIdleTime();
                    setTimeout(function() {
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
    }else{
    //    $scope.stopIdleTimer();
    //    $scope.stopsecondIdleTimer();
    }
    
   
       $scope.stopsecondIdleTimer = function() {
           if (angular.isDefined(secondfindEvent)) { 
               // $(window).off('mousemove keydown click', secondfindEvent); 
               $(window).off( "mousemove keydown click" );           
               // clearInterval(secondfindEvent)              
               $interval.cancel(secondfindEvent);
               secondfindEvent = undefined;
            }
       };
   
       $scope.stopIdleTimer = function() {
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

    setTimeout(function() {
        $scope.HttpMethod = $stateParams.input.typeOfDraft ? $stateParams.input.typeOfDraft : ''
    }, 100)

    $scope.parentInput = angular.copy($stateParams.input);
    $scope.fieldData = ($stateParams.input.fieldData) ? $stateParams.input.fieldData : {};

    $scope.ParentIconName = ($stateParams.input.gotoPage.ParentIcon) ? $stateParams.input.gotoPage.ParentIcon : ''

    $scope.Title = $scope.parentInput.pageTitle;
    $scope.ulName = $scope.parentInput.ulName;
    $scope.IconName = ($scope.parentInput.gotoPage.IconName) ? $scope.parentInput.gotoPage.IconName : ''
    $scope.showPageTitle = $filter('nospace')($scope.Title);
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle);
    $scope.showsubTitle = $scope.showPageTitle + '.Edit';
    $scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle';

    $scope.subDataObj = {};
    $scope.subSectionfieldData = {};
    $scope.secondLevelSectionfieldData = {};

    function getSecondLevelVal(argu) {
        var data = {};
        for (var L in $scope.parentInput.pageInfo['secondLevelsection']) {
            if (argu['FieldName'] === $scope.parentInput.pageInfo.secondLevelsection[L]['ParentName']) {
                if ($scope.parentInput.pageInfo.secondLevelsection[L].MaxOccarance > 1 || $scope.parentInput.pageInfo.secondLevelsection[L].MaxOccarance == -1) {
                    data[$scope.parentInput.pageInfo.secondLevelsection[L]['FieldName']] = [{}];
                } else {
                    data[$scope.parentInput.pageInfo.secondLevelsection[L]['FieldName']] = {};
                }
                break;
            }
        }
        return data
    }

    if ($scope.parentInput.parentLink != 'methodofpayments') {
        if ('Subsection' in $scope.parentInput.pageInfo) {
            for (k in $scope.parentInput.pageInfo.Subsection) {
                $scope.subSectionfield = $scope.parentInput.pageInfo.Subsection[k].subSectionData;
                if ($scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName]) {
                    $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = $scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName];
                } else {
                    if ($scope.parentInput.pageInfo.Subsection[k].MaxOccarance > 1 || $scope.parentInput.pageInfo.Subsection[k].MaxOccarance == -1) {
                        $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = [{}];
                        for (var L in $scope.parentInput.pageInfo['secondLevelsection']) {
                            if ($scope.parentInput.pageInfo.Subsection[k]['FieldName'] === $scope.parentInput.pageInfo.secondLevelsection[L]['ParentName']) {
                                $scope.secondLevelSectionfieldData = {};
                                if ($scope.parentInput.pageInfo.secondLevelsection[L].MaxOccarance > 1 || $scope.parentInput.pageInfo.secondLevelsection[L].MaxOccarance == -1) {
                                    $scope.secondLevelSectionfieldData[$scope.parentInput.pageInfo.secondLevelsection[L]['FieldName']] = [{}];
                                } else {
                                    $scope.secondLevelSectionfieldData[$scope.parentInput.pageInfo.secondLevelsection[L]['FieldName']] = {};
                                }
                                $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = [$scope.secondLevelSectionfieldData];
                            }
                        }
                    } else {
                        $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = {};
                        for (var L in $scope.parentInput.pageInfo['secondLevelsection']) {
                            if ($scope.parentInput.pageInfo.Subsection[k]['FieldName'] === $scope.parentInput.pageInfo.secondLevelsection[L]['ParentName']) {
                                $scope.secondLevelSectionfieldData = {};
                                if ($scope.parentInput.pageInfo.secondLevelsection[L].MaxOccarance > 1 || $scope.parentInput.pageInfo.secondLevelsection[L].MaxOccarance == -1) {
                                    $scope.secondLevelSectionfieldData[$scope.parentInput.pageInfo.secondLevelsection[L]['FieldName']] = [{}];
                                } else {
                                    $scope.secondLevelSectionfieldData[$scope.parentInput.pageInfo.secondLevelsection[L]['FieldName']] = {};
                                }
                                if ($scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName]) {
                                    $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = $.extend($scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName], $scope.secondLevelSectionfieldData);
                                } else {
                                    $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = $scope.secondLevelSectionfieldData;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = ($scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName]) ? $scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] : [{}]
            $scope.subSectionfield = [{}]
        }
    }

    formArrayWithVal = [];
    $scope.fieldData11 = $scope.fieldData;
    $scope.subSectionfieldData11 = $scope.subSectionfieldData;

    setTimeout(function() {
        var formArray = $('#dynamicModuleForm').serializeArray();
        formArrayWithVal = formArray
    }, 200)

    $scope.gotoParent = function(alertMsg) {
        $scope.stopIdleTimer();
        $scope.stopsecondIdleTimer();
        $(window).off( "mousemove keydown click" );

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

    $scope.gotoShowAlert = function() {
        $scope.breadCrumbClicked = true;
        if ($scope.madeChanges) {
            $("#changesLostModal").modal("show");
        } else {
            $scope.stopIdleTimer();
            $scope.stopsecondIdleTimer();
            $(window).off( "mousemove keydown click" );
            $scope.gotoParent();
        }
    }

    $scope.gotoClickedPage = function() {
        if ($scope.fromCancelClick || $scope.breadCrumbClicked) {
            if($scope.parentInput.Operation === 'Edit') {
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

    $scope.madeChanges = false;
    $scope.listen = function() {
        editservice.listen($scope, $scope.fieldData, $stateParams.input.Operation, $stateParams.input.pageTitle);
        editservice.listen($scope, $scope.subSectionfieldData, $stateParams.input.Operation, $stateParams.input.pageTitle, 'Subsection');
    }
    $scope.listen();

    $scope.gotoCancelFn = function() {
        $('.my-tooltip').tooltip('hide');
        $rootScope.dataModified = $scope.madeChanges;
        $scope.fromCancelClick = true;
        if (!$scope.madeChanges) {
            if($scope.parentInput.Operation === 'Edit') {
                $scope.unlockEntityToEdit();
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
                $(window).off( "mousemove keydown click" ); 
            } else {              
                $scope.stopIdleTimer();
                $scope.stopsecondIdleTimer();
                $(window).off( "mousemove keydown click" ); 
                $scope.gotoParent();
            }
        }
    }

    $scope.unlockEntityToEdit = function(alertmsg) {
        if($stateParams.input.gotoPage.Link == 'approvalcondition'){                    
            data = {
                TableName:'ResourceApprovalPermission',
                BusinessPrimaryKey : {},
                IsLocked: false
            };            
        }else{
            data = {
                TableName: $stateParams.input.gotoPage.Link || '',
                BusinessPrimaryKey : {},
                IsLocked: false
            };

        }
        if($scope.parentInput.primarykey && $scope.parentInput.primarykey.length > 0) {
            for (let i = 0; i < $scope.parentInput.primarykey.length; i++) {               
                data.BusinessPrimaryKey[$scope.parentInput.primarykey[i]] = $scope.parentInput.fieldData ? $scope.parentInput.fieldData[$scope.parentInput.primarykey[i]] : '';
            }
            // $scope.parentInput.primarykey.forEach(element => {
            //     data.BusinessPrimaryKey[element] = $scope.parentInput.fieldData ? $scope.parentInput.fieldData[element] : '';
            // });
        }
        data.BusinessPrimaryKey  = JSON.stringify(data.BusinessPrimaryKey);

        EntityLockService.checkEntityLock(data).then(function(data){
                 
            $scope.gotoParent(alertmsg);
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

    var PrimKeyVals;
    $scope.primaryKeyALert = false;
    $scope.madeChanges = false;
    $scope.DraftDetails;

    function checkPrimaryKeyValues(sectionDatas, subSectionDatas) {
        $scope.primaryKeyALert = false;
        PrimKeyVals = $rootScope.primarykeyValues;

        if ($.isEmptyObject(sectionDatas)) {
            $scope.primaryKeyALert = true;
        } else {
            $.each(sectionDatas, function(key, val) {
                if (PrimKeyVals) {
                    for (i = 0; i < PrimKeyVals.length; i++) {
                        if (!sectionDatas[PrimKeyVals[i]]) {
                            $scope.primaryKeyALert = true;
                        }
                    }
                }
            })
        }

    }

    $scope.SaveAsDraft = function() {
        $scope.primaryKeyALert = false;
        checkPrimaryKeyValues($scope.fieldData11, $scope.subSectionfieldData11)
        if ($scope.primaryKeyALert) {
            $scope.madeChanges = false;
            $("#changesLostModal").modal('show');
        } else {
            $scope.callingDraftSave()
        }
    }

    $scope.callingDraftSave = function() {
        //var backupSection = $scope.fieldData11;
        $rootScope.dataModified = false;
        var backupSubSection = angular.copy($scope.fieldData11);
        backupSubSection = $scope.cleantheinputdata(backupSubSection);
        $scope.DraftDetails = jQuery.extend(backupSubSection, $scope.subSectionfieldData11)
        $scope.backupreplaceFieldData = $scope.replaceFieldData ? angular.copy($scope.replaceFieldData) : '';
        if ($scope.parentInput.parentLink === 'schedulerprofile') {
            $scope.backupreplaceFieldData = cleantheinputdata($scope.backupreplaceFieldData)
        } else {
            $scope.backupreplaceFieldData = $scope.cleantheinputdata($scope.backupreplaceFieldData)
        }

        if ($scope.backupreplaceFieldData && $scope.nameofthefield) {
            $scope.DraftDetails[$scope.nameofthefield] = JSON.stringify($scope.backupreplaceFieldData)
        }

        $http({
            method: 'POST',
            url: BASEURL + '/rest/v2/' + $scope.parentInput.parentLink,
            data: $scope.DraftDetails,
            headers: {
                draft: true
            }

        }).then(function(response) {
            if (response.data.Status === "Saved as Draft") {
                $rootScope.dataModified = false;
                $scope.gotoParent(response.data.responseMessage);
            }
        }, function(resperr) {

            if (resperr.data.error.message == 'Draft Already Exists') {
                $("#draftOverWriteModal").modal("show");
            } else {
                $scope.alerts = [{
                    type: 'danger',
                    msg: resperr.data.error.message
                }]
                errorservice.ErrorMsgFunction(resperr, $scope, $http, resperr.data.error.code)
            }
        })
    }

    $scope.forceSaveDraft = function() {
        $http({
            method: 'POST',
            url: BASEURL + '/rest/v2/' + $scope.parentInput.parentLink,
            data: $scope.DraftDetails,
            headers: {
                draft: true,
                'Force-Save': true
            }
        }).then(function(response) {

            if (response.data.Status === "Draft Updated") {
                $("#draftOverWriteModal").modal("hide");
                $scope.gotoParent(response.data.responseMessage);
            }
        }, function(resperr) {
            $("#draftOverWriteModal").modal("hide");
            $scope.alerts = [{
                type: 'danger',
                msg: resperr.data.error.message
            }]
            errorservice.ErrorMsgFunction(resperr, $scope, $http, resperr.data.error.code)
        })
    }

    if ($scope.parentInput.Operation == 'Clone') {
        if (Object.keys($scope.parentInput).indexOf('frommodule') == -1 && $scope.parentInput.frommodule != 'ruleedit' && $scope.parentInput.frommodule != 'entitydraft') {
            for (var k = 0; k < $scope.parentInput.primarykey.length; k++) {
                if ($scope.parentInput.fieldData) {
                    if ($scope.parentInput.parentLink != 'workorder') {
                        $scope.fieldData[$scope.parentInput.primarykey[k]] = '';
                    } else if ($scope.parentInput.primarykey[k] == 'WorkOrderId') {
                        $scope.fieldData[$scope.parentInput.primarykey[k]] = '';
                    }
                    if ($scope.parentInput.primarykey[k] == 'PartyServiceAssociationCode') {
                        var PSAdepended = ['PartyCode', 'ServiceCode', 'InputFormat', 'PermittedAccountNos', 'PreferredAccount', 'UsageMechanism']
                        for (j in PSAdepended) {
                            $scope.fieldData[PSAdepended[j]] = '';
                        }
                    }
                }
            }
        }
    }
    $scope.calldisabled = function(x) {

        /*if(($scope.parentInput.parentLink == 'businessrules')&&(x == 'Rule'))
        {
            return true;
        }*/


        if (($scope.parentInput.Operation != 'Clone') && ($scope.parentInput.Operation != ' Add')) {
            if (($scope.parentInput.parentLink == 'partyserviceassociations') && ((($scope.parentInput.fieldData) && ('PartyCode' === x)) || (($scope.parentInput.fieldData) && ('ServiceCode' === x)) || (($scope.parentInput.fieldData) && ('InputFormat' === x)) || (($scope.parentInput.fieldData) && ('UsageMechanism' === x)))) {
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

    $scope.setSubHeights = function(x, y) {
        setTimeout(function() {
            $(sanitize('#' + x['FieldName'])).css({
                'height': Math.round($(sanitize('#' + x['FieldName'] + '_' + y)).outerHeight()) + 10 + 'px'
            })
        }, 100)
    }

    $scope.setHeights = function(x) {
        setTimeout(function() {
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

    $scope.setSubHeights = function(x, y) {
        setTimeout(function() {
            $(sanitize('#' + x)).css({
                'height': Math.round($(sanitize('#' + x + '_' + y)).outerHeight()) + 10 + 'px'
            })
        }, 500)
    }

    $scope.remove_Section = function(x, y, z) {
        $('.my-tooltip').tooltip('hide');
        if (y[z].length > 1) {
            y[z].splice(x, 1)
        } else {}
        $('.my-tooltip').tooltip('hide');
    }

    $scope.removesubSection = function(x, y, z) {
        if ($scope.subSectionfieldData[z].length > 1) {
            $scope.subSectionfieldData[z].splice(x, 1)
            if ($scope.parentInput.parentLink === 'cutoffs' && $scope.parentInput.Operation === 'Edit') {
                $scope.custmalerts = [{
                    type: 'warning',
                    msg: 'Deleting the Cut off time will affect the attached MOP'
                }];
            }
        } else {}
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
            return $scope.restResponse
        })
    }

    $scope.cleantheinputdata = function(argu) {
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
                    } else {}
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

    function cleantheinputdata(argu) {
        for (var k in argu) {
            if ($.isPlainObject(argu[k])) {
                var isEmptyObj = cleantheinputdata(argu[k])
                if ($.isEmptyObject(isEmptyObj)) {
                    delete argu[k]
                }
            } else if (Array.isArray(argu[k])) {
                for (var n in argu[k]) {
                    var isEmptyObj1 = cleantheinputdata(argu[k][n])
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

    $scope.disableSubmit = false;
    // I process the Create Data Request.
    $scope.createData = function(newData, subSectionNewData) {
        $scope.disableSubmit = true;
        $scope.backupSubsection = subSectionNewData ? angular.copy(subSectionNewData) : ''
        $scope.backupNewData = newData ? angular.copy(newData) : ''
        $scope.backupreplaceFieldData = $scope.replaceFieldData ? angular.copy($scope.replaceFieldData) : ''
        if ($scope.backupSubsection && $.isPlainObject($scope.backupSubsection)) {
            if ($scope.parentInput.parentLink === 'schedulerprofile') {
                $scope.backupSubsection = cleantheinputdata($scope.backupSubsection)
                $scope.backupNewData = jQuery.extend($scope.backupNewData, $scope.backupSubsection)
            } else {

                $scope.backupSubsection = $scope.cleantheinputdata($scope.backupSubsection)
                $scope.backupNewData = jQuery.extend($scope.backupNewData, $scope.backupSubsection)
            }
        }

        if ($scope.parentInput.parentLink === 'schedulerprofile') {
            $scope.backupNewData = cleantheinputdata($scope.backupNewData)
            $scope.backupreplaceFieldData = $scope.cleantheinputdata($scope.backupreplaceFieldData)
        } else {
            $scope.backupNewData = $scope.cleantheinputdata($scope.backupNewData)
            $scope.backupreplaceFieldData = $scope.cleantheinputdata($scope.backupreplaceFieldData)
        }
        if ($scope.backupreplaceFieldData && $scope.nameofthefield) {
            $scope.backupNewData[$scope.nameofthefield] = JSON.stringify($scope.backupreplaceFieldData)
        }
        if ($scope.parentInput.parentLink == 'partyserviceassociations') {
            for (var sec in subSectionNewData) {
                for (var _sec in subSectionNewData[sec]) {
                    if (!subSectionNewData[sec][_sec] && subSectionNewData[sec][_sec] !== false) {
                        delete subSectionNewData[sec][_sec];
                    }
                }
                $scope.backupNewData[sec] = subSectionNewData[sec]
            }
        }

        // ACH-2348
        let urlmodified = '';
        if($scope.parentInput.parentLink == 'parties' && $scope.parentInput.Operation != 'Add'){
           urlmodified = $scope.parentInput.parentLink + '/update';
         } else {
            urlmodified = $scope.parentInput.parentLink;
         }

        if ($scope.HttpMethod) {
            $scope.method = ($scope.HttpMethod == "Created") ? "POST" : "PUT";

            if ($scope.method == "POST") {
                $scope.updateEntity = false
                $scope.addAndForceSaveBankData($scope.method, urlmodified, $scope.backupNewData, subSectionNewData)
            } else {
                $scope.updateEntity = true;
                $("#draftOverWriteModal").modal("show");
                $scope.takebankdatabckup = $scope.backupNewData;
                $scope.takebankdatabckuplink = $scope.parentInput.parentLink;
                $scope.subSectionNewData1 = subSectionNewData;
            }

        } else {
            $scope.method = ($scope.parentInput.Operation != 'Edit') ? "POST" : "PUT";
            $scope.addAndForceSaveBankData($scope.method, urlmodified, $scope.backupNewData, subSectionNewData)

        }
    };

    $scope.invokeMinLimitCreateAPI = function(link, _method, _url, _data, _query){
        // Auto Mininmum Limit Create for PSA based on business condition
        if(link == 'partyserviceassociations'){
            $http({
                method: _method,
                url: BASEURL + "/rest/v2/" + _url,
                data: _data,
                params: _query
            }).then(function(response) {
                
            }, function(error) {
                
            });
        }
    }

    $scope.addAndForceSaveBankData = function(method, parentLink, backupNewData, subSectionNewData) {
        crudRequest(method, parentLink, backupNewData).then(function(response) {
            $scope.disableSubmit = false;
            $rootScope.dataModified = false;
            if (response.Status === "Success") {
                $rootScope.dataModified = false;
                if($scope.parentInput.Operation === 'Edit') {
                    $scope.unlockEntityToEdit(response.data.data.responseMessage);
                    $scope.stopIdleTimer();
                    $scope.stopsecondIdleTimer();
                    $(window).off( "mousemove keydown click" );
                        if($scope.parentInput.parentLink == 'volpayconfigurations' && response.data.config.data.Name == 'SESSIONTIMEOUT'){            
                        sessionStorage.sessionTimeLimit = response.data.config.data.Value;
                        Idle.setIdle(sessionStorage.sessionTimeLimit * 60);                        
                    }                    
                }else{                  
                    $scope.stopIdleTimer();
                    $scope.stopsecondIdleTimer();
                    $(window).off( "mousemove keydown click" );                    
                    $scope.gotoParent(response.data.data.responseMessage);
                }
                $scope.invokeMinLimitCreateAPI($scope.parentInput.parentLink, 'POST', 'ach/partyserviceassociations/minlimitcreate', backupNewData);
            } else {
                $scope.subSectionfieldData = subSectionNewData;
            }
        });
        $("#draftOverWriteModal").modal("hide");
    }

    $scope.resetAllDrafts = function() {
        $("#draftOverWriteModal").modal("hide");
        setTimeout(function() {
            $scope.updateEntity = false;
        }, 100)
    }

    $scope.checkType = function(eve, type) {
        var compareVal = '';
        var regex = {
            'Integer': /^[0-9]$/,
            'BigDecimal': /^[0-9.]$/,
            'String': /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i
        }
        if(eve.currentTarget.attributes.name.nodeValue == "UserSuffix"){
            var regularexpression = /^[a-zA-Z0-9_]*$/;
            if(regularexpression.test(eve.key)){
                return true
            } else {
                eve.preventDefault();
            }
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
    $scope.paste = function(name, eve) {
        if(name == "UserSuffix"){
            eve.preventDefault();
        }
    }
    $scope.multipleEmptySpace = function(e) {
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

    $scope.addsubfieldedSection = function(x, y, z) {
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

    $scope.removesubfieldedSection = function(x, y, z) {
        if ($scope.replaceFieldData[z].length > 1) {
            $scope.replaceFieldData[z].splice(x, 1)
        } else {}
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
                $scope.replaceField.cstmAttr[y] = $.extend({}, $scope.replaceField.cstmAttr[y]);
                $scope.replaceField.cstmAttr[y][x.customattributes.property[k].name.split('|')[1]] = JSON.parse(x.customattributes.property[k].value)
            }
        }
    }

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
                    'dateformat': ('dateformat' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.dateformat : ''),
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
                    })
                }
                $scope.replaceField.Subsection.push({
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

        // if(Object.keys($scope.replaceField['cstmAttr']).length){
        //	Object.keys($scope.replaceField['cstmAttr']).forEach(function(id){
        //		setTimeout(function(name){
        //			$('[name='+name+']').on('change', function(){
        //				set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '', true);
        //			})
        //			if($('[name='+name+']').val()){
        //				set_cstm_attr($('[name='+name+']').val(), $scope.replaceField['cstmAttr'][id], '');
        //			}
        //		}, 100, id)
        //		
        //	})
        //}

        if (Object.keys($scope.replaceField['cstmAttr']).length) {
            Object.keys($scope.replaceField['cstmAttr']).forEach(function(id) {
                setTimeout(function(name) {
                    $('[name=' + name + ']').on('change', function() {

                        if (($(this).attr('name') == 'EODFILESTATUS') && ($('#EODSTATUSREPORTINDICATOR').val() == 'E') && ($("input[name='EODFILESTATUS']:checked").val() == 'true')) {
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODREPORTEMAIL.Enabled = true
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODTRANSMISSIONSITE.Enabled = false
                            set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '', true);
                        } else if (($(this).attr('name') == 'EODFILESTATUS') && ($('#EODSTATUSREPORTINDICATOR').val() == 'T') && ($("input[name='EODFILESTATUS']:checked").val() == 'true')) {
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODREPORTEMAIL.Enabled = false
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODTRANSMISSIONSITE.Enabled = true
                            set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '', true);
                        } else if (($(this).attr('name') == 'EODFILESTATUS') && ($('#EODSTATUSREPORTINDICATOR').val() == 'B') && ($("input[name='EODFILESTATUS']:checked").val() == 'true')) {
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODREPORTEMAIL.Enabled = true
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODTRANSMISSIONSITE.Enabled = true
                            set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '', true);
                        } else if (($(this).attr('name') == 'EODFILESTATUS') && ($('#EODSTATUSREPORTINDICATOR').val() == '') && ($("input[name='EODFILESTATUS']:checked").val() == 'true')) {
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODREPORTEMAIL.Enabled = false
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODTRANSMISSIONSITE.Enabled = false
                            set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '', true);
                        } else if (($('#EODSTATUSREPORTINDICATOR').val() == '') && ($("input[name='EODFILESTATUS']:checked").val() == 'true')) {

                            $("#EODREPORTEMAIL").prop("disabled", true);
                            $("#EODTRANSMISSIONSITE").prop("disabled", true);

                        } else if (($('#EODSTATUSREPORTINDICATOR').val() == '') && ($("input[name='EODFILESTATUS']:checked").val() == 'false')) {

                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODSTATUSREPORTINDICATOR.Enabled = false
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODREPORTEMAIL.Enabled = false
                            $scope.replaceField['cstmAttr'][id][$(this).val()].EODTRANSMISSIONSITE.Enabled = false
                            set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '');
                        } else {
                            set_cstm_attr($(this).val(), $scope.replaceField['cstmAttr'][id], '', true);
                        }
                    })
                    if ($('[name=' + name + ']').val()) {
                        if ($("input[name='EODFILESTATUS']:checked").val() == 'false') {
                            if ($scope.replaceField['cstmAttr'][id][$("input[name='EODFILESTATUS']:checked").val()]) {
                                $scope.replaceField['cstmAttr'][id][$("input[name='EODFILESTATUS']:checked").val()].EODSTATUSREPORTINDICATOR.Enabled = false
                                $scope.replaceField['cstmAttr'][id][$("input[name='EODFILESTATUS']:checked").val()].EODREPORTEMAIL.Enabled = false
                                $scope.replaceField['cstmAttr'][id][$("input[name='EODFILESTATUS']:checked").val()].EODTRANSMISSIONSITE.Enabled = false
                                set_cstm_attr(false, $scope.replaceField['cstmAttr'][id], '');
                            }
                        } else {

                            set_cstm_attr($('[name=' + name + ']').val(), $scope.replaceField['cstmAttr'][id], '');
                        }
                        //	set_cstm_attr($('[name=' + name + ']').val(), $scope.replaceField['cstmAttr'][id], '');
                    }
                }, 100, id)
            })
        }
        return $scope.replaceField;
    }

    var update_URL = function(argu, field) {
        var _argu = angular.copy(argu);
        if (_argu.indexOf('/') !== -1) {
            var url = _argu.split('/');
            for (var links in url) {
                if ((url[links].indexOf('{') !== -1) && (url[links].indexOf('}') !== -1)) {
                    var name = url[links].substring((Number(url[links].indexOf('{')) + 1), Number(url[links].indexOf('}')));
                    var value_ = $scope.fieldData[name];
                    if (value_) {
                        _argu = _argu.replace(url[links], value_);
                    }
                }
            }
        }
        return _argu
    }

    $scope.convertUrl = function(argu) {
        var query = angular.copy(argu);
        var _kValue = angular.copy(argu);
        var indices = [];
        for (var i = 0; i < query.length; i++) {
            if (query[i].indexOf('$') !== -1) {
                var index = {}
                if (query[i + 1] === "{") {
                    index.firstIndex = i + 2;
                    for (var j = i + 1; j < query.length; j++) {
                        if (query[j] === "}") {
                            index.lastIndex = j;
                            break;
                        }
                    }
                }
                indices.push(index);
            }
        }
        for (var index in indices) {
            var reqId = query.substring(indices[index].firstIndex, indices[index].lastIndex);
            if ($scope.fieldData[reqId]) {
                _kValue = _kValue.replace('${' + reqId + '}', $scope.fieldData[reqId]);
            } else {
                _kValue = '';
                break;
            }
        }
        return _kValue
    }

    //$scope.checkIfthereIs = false;
    $scope.dependedDropval = function(x, y, z, z1, z2) {

        $scope.dependedval = {
            'Direction': ['ReferenceCode', 'TransportType', 'TransportMode'],
            'TransportType': ['TransportMode'],
            'InputFormat': ['FileDuplicateCheck-Parameters', 'AdditionalConfig'],
            'IncidenceCode': ['ProcessStatus'],
            'ServiceCode': ['PermittedAccountNumbers', 'AdditionalConfig'],
            'WorkFlowCode': ['ProcessStatus', 'Action', 'RulePhase'],
            'ResourceName': ['Operation', 'AttributeName'],
            'ProcessCode': ['WorkFlowCode', 'RulePhase'],
            'ProcessName': ['PartyServiceAssociationCode'],
            'AgentBankPartyCode': ['AgentAccount'],
            'PartyCode': ['PermittedAccountNumbers', 'AdditionalConfig', 'SecondaryAccountOwners', 'BillingAccount'],
            'PermittedAccountNos': ['PreferredAccount'],
            'ParentBranchCode': ['PartyCode'],
            'SchemeID': ['MandateSchemeData']
        }

        //$scope.nameofthefield = '';
        for (var chk in $scope.backupCstmdrop) {
            for (k in $scope.dependedval[z]) {
                if ($scope.backupCstmdrop[chk].FieldName === $scope.dependedval[z][k]) {
                    if ($scope.backupCstmdrop[chk].FieldName in $scope.fieldData && z2) {
                        if ($scope.backupCstmdrop[chk].FieldName == 'FDCParameters') {} else {
                            $scope.fieldData[$scope.backupCstmdrop[chk].FieldName] = $scope.backupCstmdrop[chk].FieldName != 'TransportType' && $scope.backupCstmdrop[chk].FieldName != 'AdditionalConfig' ? '' : $scope.fieldData[$scope.backupCstmdrop[chk].FieldName]
                        }
                    }
                    if (($scope.backupCstmdrop[chk].FieldName == 'AdditionalConfig') || ($scope.backupCstmdrop[chk].FieldName == 'MandateSchemeData')) {
                        if (z1) {
                            $scope.setInitval(z1)
                        }
                        var _droplink = 'property' in $scope.backupCstmdrop[chk] ? $scope.backupCstmdrop[chk].property : $scope.backupCstmdrop[chk].ChoiceOptions;
                        var build_Query = {};
                        var build_Link = '';
                        for (var k in _droplink) {
                            if ($scope.backupCstmdrop[chk].FieldName == 'MandateSchemeData') {
                                if ((_droplink[k].name == 'Choice') || (_droplink[k].value == 'SchemeID')) {
                                    if ($scope.fieldData[_droplink[k].value]) {
                                        build_Query[_droplink[k].value] = $scope.fieldData[_droplink[k].value]
                                    } else {
                                        build_Query = {}
                                        break;
                                    }
                                }
                            } else {
                                if (_droplink[k].name == 'Choice' && _droplink[k].value.indexOf(',') != -1) {
                                    for (var input_Val in _droplink[k].value.split(',')) {
                                        if ($scope.fieldData[_droplink[k].value.split(',')[input_Val]]) {
                                            build_Query[_droplink[k].value.split(',')[input_Val]] = $scope.fieldData[_droplink[k].value.split(',')[input_Val]]
                                        } else {
                                            build_Query = {}
                                            break;
                                        }
                                    }
                                }
                            }

                            if (_droplink[k].name == 'REST-WEBFORM') {
                                build_Link = _droplink[k].value
                            }
                        }

                        if (Object.keys(build_Query).length) {

                            if ($scope.backupCstmdrop[chk].FieldName == 'MandateSchemeData') {
                                $scope.nameofthefield = 'MandateSchemeData';
                            } else {
                                $scope.nameofthefield = 'AdditionalConfig';
                            }

                            var inputData = ($scope.nameofthefield in $scope.fieldData && $scope.fieldData[$scope.nameofthefield]) ? ($scope.fieldData[$scope.nameofthefield][0] == '{') ? JSON.parse($scope.fieldData[$scope.nameofthefield]) : '' : '';
                            crudRequest("GET", build_Link, '', build_Query).then(function(response) {
                                if (Object.keys(response.data.data).length) {
                                    $scope.fieldAddedDetails = BuildnReplaceField(response, inputData);
                                } else {
                                    build_Query = {}
                                    $scope.replaceField = [];
                                    $scope.replaceFieldData = {};
                                    $scope.fieldAddedDetails = [];
                                    $scope.nameofthefield = '';
                                }
                            })
                        } else {
                            $scope.replaceField = [];
                            $scope.replaceFieldData = {};
                            $scope.fieldAddedDetails = [];
                            $scope.nameofthefield = '';
                        }
                        /* 
                        var saveDropval = '';
                        setTimeout(function () {
                            for (var k in droplink) {
                                if (droplink[k].name.match(/\|/g) && droplink[k].name.split('|')[0] == $("[name=" + z + "]").val()) {
                                    saveDropval = droplink[k].name.split('|')[0];
                                    $scope.nameofthefield = 'AdditionalConfig'; 
                                    var inputData = ($scope.nameofthefield in $scope.fieldData && $scope.fieldData[$scope.nameofthefield]) ? ($scope.fieldData[$scope.nameofthefield][0] == '{') ? JSON.parse($scope.fieldData[$scope.nameofthefield]) : '' : '';
                                    crudRequest("GET", droplink[k].value, '').then(function (response) {
                                        $scope.fieldAddedDetails = BuildnReplaceField(response, inputData);
                                    })
                                    break;
                                }
                            }
                        }, 2500) 
                        
                        if (saveDropval) {
                            $scope.replaceField = [];
                            $scope.replaceFieldData = {};
                            $scope.fieldAddedDetails = [];
                            $scope.nameofthefield = '';
                        }*/
                    } else {
                        var observedIndex = chk;
                        var droplink = angular.copy($scope.backupCstmdrop[chk].ChoiceOptions);
                        droplink = 'property' in $scope.backupCstmdrop[chk] ? $scope.backupCstmdrop[chk].property : droplink
                        if ((droplink && droplink[0].value === $filter('removeSpace')(z))) {
                            var links = '';
                            for (var k in droplink) {
                                if ((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) == 'InputFormat')) {
                                    $scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
                                    links = droplink[k].value.split('/')[0] + '/' + y
                                    setTimeout(function() {
                                        $("[name=" + $scope.staticInputbox + "]").attr({ 'multiple': true, 'data-placeholder': 'Select an option...' })
                                        if (!$("[name=" + $scope.staticInputbox + "]").find('option:first-child').attr('value')) {
                                            // To Remove select old option elements
                                            var mySelect = $("[name=" + $scope.staticInputbox + "]").find('option:first-child');
                                            var len = mySelect.length;
                                            if (len) {
                                                for (var i = 0; i < len; i++) {
                                                    mySelect[0].remove(i);
                                                }
                                            }
                                            //$("[name=" + $scope.staticInputbox + "]").find('option:first-child').remove()
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
                                    something('GET', droplink[k].value.split('/')[0] + '/' + y, observedIndex, '', {
                                        start: 0,
                                        count: 500
                                    })
                                } else if ((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) == 'PartyCode') && $scope.Title == "Branch") {
                                    $scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
                                    links = '';
                                    if (z1) {
                                        $scope.setInitval(z1)
                                    }
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
                                                        crudRequest("GET", linkss, '', '').then(function(response) {
                                                            $scope.parentInput.pageInfo.Subsection[0].subSectionData[keysss].ChoiceOptions = response.data.data;
                                                        })
                                                    }
                                                    //break;
                                                }
                                            }
                                        }
                                    } //else{
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
                                } else if ($scope.parentInput.pageTitle == 'Branch') {
                                    if (y) {
                                        if (droplink[k].value.match('{' + $filter('removeSpace')(z) + '}')) {
                                            links = droplink[k].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
                                        } else {
                                            links = droplink[k].value.split('/')[0] + "/" + y
                                        }
                                    }
                                    if (z1 && z1.FieldName === 'ParentBranchCode') {
                                        $scope.setInitval(z1)
                                    }
                                } else if ($scope.parentInput.pageTitle == 'Party Service Association' && droplink && (droplink[0].value.indexOf(z) != -1)) {
                                    if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName === 'BillingAccount') {
                                        var convertedUrl = ''
                                        if (droplink[k].name == 'REST') {
                                            convertedUrl = update_URL(angular.copy(droplink[k].value));
                                        }
                                        if (convertedUrl) {

                                            something('GET', convertedUrl, observedIndex, '', { start: 0, count: 500, search: $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName] });
                                        }
                                    } else {
                                        if ($scope.fieldData[z] && droplink[k].name == 'REST') {
                                            crudRequest('POST', droplink[k].value, $scope.fieldData[z].toString(), '').then(function(response) {
                                                $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                                                    placeholder: 'Select',
                                                    minimumInputLength: 0,
                                                    allowClear: true,
                                                    multiple: $scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT'
                                                })
                                                if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {
                                                    setTimeout(function() {
                                                        if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {

                                                            if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].indexOf(',') !== -1) {
                                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(',')).trigger("change.select2");
                                                            } else {
                                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]).trigger("change.select2");
                                                            }
                                                        }
                                                    }, 0)
                                                } else {
                                                    setTimeout(function() {
                                                        if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {
                                                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val([]).trigger('change.select2')
                                                        } else {
                                                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val('').trigger('change.select2')
                                                        }
                                                    }, 0)
                                                }


                                            })

                                        }
                                    }

                                } else if (droplink[k]['name'] && droplink[k]['name'].toLowerCase().indexOf('rest') !== -1) {
                                    if ($scope.parentInput['parentLink'] === "statementbulker" || $scope.parentInput['parentLink'] === "workorder") {

                                        var i_arr = ["SubclientNumber", "WorkOrderSubType", "WorkOrderExt"];
                                        if ($scope.parentInput['parentLink'] === "workorder") {
                                            i_arr.push("PartyCode");
                                        }
                                        for (var _z in $scope.parentInput.pageInfo.Section) {
                                            for (var _y in i_arr) {
                                                if (i_arr[_y] == $scope.parentInput.pageInfo.Section[_z]['FieldName']) {
                                                    $scope.parentInput.pageInfo.Section[_z]['visible'] = false;

                                                    $(sanitize('[name=' + $scope.parentInput.pageInfo.Section[_z]['FieldName'] + ']')).parent().parent().find('label').attr('ng-hide', true).addClass('ng-hide');
                                                    $(sanitize('[name=' + $scope.parentInput.pageInfo.Section[_z]['FieldName'] + ']')).parent().parent().find('div').attr('ng-hide', true).addClass('ng-hide')

                                                }
                                            }

                                        }

                                        setTimeout(depDrop, 100, $scope.parentInput.pageInfo.Section[chk], y, droplink[k].value, droplink[k - 1]);
                                    }
                                } else if ($scope.parentInput.pageTitle == 'Account') {
                                    if (droplink[k].name === 'REST') {
                                        if (z1) {
                                            $scope.setInitval(z1)
                                        }
                                        var convertedUrl = $scope.convertUrl(droplink[k].value);
                                        if (convertedUrl) {
                                            if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {
                                                setTimeout(function() {
                                                    $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).attr('multiple', true);
                                                    if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName] && $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].indexOf(',') !== -1) {
                                                        for (var _search in $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(',')) {
                                                            $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = [];
                                                            something('GET', convertedUrl, observedIndex, '', { start: 0, count: 500, search: $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(',')[_search] }, true);
                                                        }
                                                    } else {
                                                        something('GET', convertedUrl, observedIndex, '', { start: 0, count: 500, search: $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName] });
                                                    }

                                                }, 100)
                                            } else {
                                                something('GET', convertedUrl, observedIndex, '', { start: 0, count: 500 });
                                            }
                                        }
                                    }
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

                                    if ($scope.parentInput.pageTitle == 'Branch') {
                                        if($scope.fieldData){
                                            if((Object.keys($scope.fieldData).indexOf('PartyCode') != -1) ){
                                              if ($(sanitize('select[name="PartyCode"]')).hasClass("select2-hidden-accessible")) {
                                                  $(sanitize('select[name="PartyCode"]')).find('option:nth-child(2)').remove()
                                              }
                                             }
                                          }
                                           
                                    }else{
                                       something('GET', links, observedIndex, '', '')
                                    }
                                }
                            }
                        } else if (droplink && ('value' in droplink[0] && droplink[0].value.match('&&')) && droplink[0].value.indexOf('&&') > -1) {
                            var queryParams = [];
                            for (j in droplink[0].value.split('&&')) {
                                queryParams.push(droplink[0].value.split('&&')[j].trim())
                            }
                            setTimeout(function() {
                                for (k in droplink) {
                                    if (droplink[k].name == 'REST') {
                                        var k = droplink[k].value
                                        for (u in queryParams) {
                                            if (k.indexOf(queryParams[u]) > -1) {
                                                if ($("select[name=" + queryParams[u] + "]").val()) {
                                                    k = k.replace('{' + queryParams[u] + '}', $("select[name=" + queryParams[u] + "]").val())
                                                } else {
                                                    k = ''
                                                }

                                            }
                                        }
                                        if (k) {
                                            var _query_field = {
                                                start: 0,
                                                count: 500
                                            }
                                            something('GET', k, observedIndex, '', _query_field)
                                                // something('GET', k, observedIndex, '', '')
                                        }

                                    }
                                }
                            }, 750)
                        } else if ($scope.parentInput.pageTitle == 'Party Service Association' && droplink && (droplink[0].value.indexOf(z) != -1)) {
                            if (z1) {
                                $scope.setInitval(z1)
                            }
                            if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName === 'PermittedAccountNos') {
                                var _kUrl = ''
                                var convertedUrl = ''
                                for (k in droplink) {
                                    if (droplink[k].name == 'Choice') {
                                        convertedUrl = $scope.convertUrl(angular.copy(droplink[k].value));
                                        //_kValue = droplink[k].value
                                        /*var indices = [];
                                        var query = angular.copy(droplink[k].value);
                                        for(var i=0; i<query.length;i++) {
                                            if (query[i] === "$"){
                                                var index = {}
                                                if(query[i+1] === "{"){
                                                    index.firstIndex = i+2;
                                                    for(var j=i+1; j<query.length; j++){
                                                        if(query[j] === "}"){
                                                            index.lastIndex = j;
                                                            break;
                                                        }
                                                    }
                                                }
                                                indices.push(index);
                                            }
                                        }
                                        _kValue = angular.copy(query);
                                        for(var index in indices){
                                            var reqId = query.substring(indices[index].firstIndex,indices[index].lastIndex)
                                            if($scope.fieldData[reqId]){
                                                _kValue = _kValue.replace('${'+reqId+'}',$scope.fieldData[reqId]);
                                            }
                                            else{
                                                _kValue = '';
                                                break;
                                            }
                                        }*/
                                    }
                                    if (droplink[k].name == 'REST') {
                                        _kUrl = angular.copy(droplink[k].value);
                                    }
                                }
                                if (convertedUrl) {
                                    var _datafield = JSON.parse(convertedUrl);
                                    var _bakup_kvalue = angular.copy(convertedUrl);
                                    if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {

                                        var values$ = ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].indexOf(',') != -1) ? $scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].indexOf(',') : [$scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]]
                                        for (var _Q in values$) {
                                            _datafield["filters"]["groupLvl1"][0]["groupLvl2"][_datafield["filters"]["groupLvl1"][0]["groupLvl2"].length - 1]["groupLvl3"][0]["clauses"].push({
                                                columnName: $scope.parentInput.pageInfo.Section[observedIndex].FieldName,
                                                operator: "like",
                                                value: values$[_Q]
                                            });
                                        }
                                        convertedUrl = JSON.stringify(_datafield);
                                    }
                                    makeitSelect2('POST', _kUrl, observedIndex, convertedUrl, '', _bakup_kvalue);
                                }
                            } else {
                                setTimeout(function() {
                                    var _kUrl = ''
                                    var _kValue = ''
                                    for (k in droplink) {
                                        if (droplink[k].name == 'Choice') {
                                            //_kValue = droplink[k].value
                                            var indices = [];
                                            var query = angular.copy(droplink[k].value);
                                            for (var i = 0; i < query.length; i++) {
                                                if (query[i] === "$") {
                                                    var index = {}
                                                    if (query[i + 1] === "{") {
                                                        index.firstIndex = i + 2;
                                                        for (var j = i + 1; j < query.length; j++) {
                                                            if (query[j] === "}") {
                                                                index.lastIndex = j;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    indices.push(index);
                                                }
                                            }
                                            _kValue = query;
                                            for (var index in indices) {
                                                var reqId = query.substring(indices[index].firstIndex, indices[index].lastIndex)
                                                if ($scope.fieldData[reqId]) {
                                                    _kValue = _kValue.replace('${' + reqId + '}', $scope.fieldData[reqId]);
                                                } else {
                                                    _kValue = '';
                                                    break;
                                                }
                                            }
                                        }
                                        if (droplink[k].name == 'REST') {
                                            _kUrl = angular.copy(droplink[k].value);
                                        }
                                    }
                                    if (_kValue) {
                                        setTimeout(function() {
                                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).find('option').each(function() {
                                                if (!$(this).text()) {
                                                    // To Remove select old option elements
                                                    var mySelect = $(this);
                                                    var len = mySelect[0].length;
                                                    if (len) {
                                                        for (var i = 0; i < len; i++) {
                                                            mySelect[0].remove(i);
                                                        }
                                                    }
                                                    // $(this).remove()
                                                }
                                            })
                                        }, 100)
                                        crudRequest('POST', _kUrl, _kValue, '').then(function(response) {
                                            $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
                                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).attr('multiple', true)
                                            if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {
                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val('')
                                                setTimeout(function() {
                                                    $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(','))
                                                    $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                                                        minimumInputLength: 0,
                                                        allowClear: true
                                                    })
                                                }, 3000)
                                            } else {
                                                //Permitted Account Numbers
                                                //setTimeout(function(){
                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).find('option').each(function() {
                                                    if (!$(this).val() && $(this).text() == 'Select') {
                                                        // To Remove select old option elements
                                                        var mySelect = $(this);
                                                        var len = mySelect[0].length;
                                                        if (len) {
                                                            for (var i = 0; i < len; i++) {
                                                                mySelect[0].remove(i);
                                                            }
                                                        }
                                                        // $(this).remove();
                                                        $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val('')
                                                    }
                                                })
                                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                                                    placeholder: 'Select',
                                                    allowClear: true
                                                })
                                            }
                                        })
                                    }
                                }, 1000)
                            }
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

    var makeitSelect2 = function(meth, links, observedIndex, datafield, queryfield, backupdatafield) {
        crudRequest(meth, links, datafield, queryfield).then(function(response) {
            $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                ajax: {
                    url: function() {
                        return BASEURL + "/rest/v2/" + links
                    },
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
                    method: meth,
                    crossDomain: true,
                    data: function(params) {
                        var query = {
                            start: params.page * 500 ? params.page * 500 : 0,
                            count: 500
                        }
                        if (params.term) {
                            query = {
                                search: { columnName: $scope.parentInput.pageInfo.Section[observedIndex].FieldName, operator: "like", value: params.term },
                                start: params.page * 500 ? params.page * 500 : 0,
                                count: 500,
                                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                            };
                        }
                        if (links.indexOf('start') != -1 && links.indexOf('count') != -1) {
                            query = JSON.stringify({})
                        }
                        if (backupdatafield) {
                            var _datafield = JSON.parse(backupdatafield);
                            if (query.search) {
                                _datafield["filters"]["groupLvl1"][0]["groupLvl2"][_datafield["filters"]["groupLvl1"][0]["groupLvl2"].length - 1]["groupLvl3"][0]["clauses"].push(query.search);
                            }
                            //query = Object.assign(_datafield,query);		
                            query = $.extend(_datafield, query);
                            delete query.search
                            query = JSON.stringify(query);
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
                                more: data.length >= 500
                            }
                        };
                    },
                    cache: true
                },
                placeholder: 'Select',
                minimumInputLength: 0,
                multiple: true
            })
            if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {
                setTimeout(function() {
                    if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {
                        if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].indexOf(',') !== -1) {
                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(',')).trigger("change.select2");
                        } else {
                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]).trigger("change.select2");
                        }
                    }
                }, 0)
            } else {
                setTimeout(function() {
                    if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {
                        $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val([]).trigger('change.select2')
                    } else {
                        $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val('').trigger('change.select2')
                    }
                }, 0)
            }

        })
    }

    var something = function(meth, links, observedIndex, datafield, queryfield, pushData) {
        crudRequest(meth, links, datafield, queryfield).then(function(response) {
            if (pushData) {
                for (var _datas in response.data.data) {
                    $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions.push(response.data.data[_datas]);
                }

            } else {
                $scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
            }

            if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName == "BillingAccount" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "ReferenceCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "WorkFlowCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "PartyCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "PartyServiceAssociationCode" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "RulePhase" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "PermittedAccountNos" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "AgentAccount" || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "SecondaryAccountOwners") {
                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                    ajax: {
                        url: function() {
                            return BASEURL + "/rest/v2/" + links
                        },
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
                                start: params.page * 500 ? params.page * 500 : 0,
                                count: 500
                            }
                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * 500 ? params.page * 500 : 0,
                                    count: 500,
                                    'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                                };
                            }
                            if (links.indexOf('start') != -1 && links.indexOf('count') != -1) {
                                query = JSON.stringify({})
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
                if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName]) {
                    setTimeout(function() {
                        if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {
                            if ($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].indexOf(',') !== -1) {
                                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val($scope.fieldData[$scope.parentInput.pageInfo.Section[observedIndex].FieldName].split(',')).trigger("change");
                            }
                        }
                    }, 100)
                } else {
                    setTimeout(function() {
                        if ($scope.parentInput.pageInfo.Section[observedIndex]['Multiple'][$scope.parentInput.pageInfo.Section[observedIndex]['Multiple'].length - 1].displayvalue === 'MULTISELECT') {
                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val([]).trigger('change.select2')
                        } else {
                            $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).val('').trigger('change.select2')
                        }
                    }, 100)
                }
            } else if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName == "ProcessStatus" && $scope.parentInput.pageTitle != 'Incidence Definition' || $scope.parentInput.pageInfo.Section[observedIndex].FieldName == "Action") {
                $(sanitize('select[name=' + $scope.parentInput.pageInfo.Section[observedIndex].FieldName + ']')).select2({
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true
                })
            }
        })
    }

    $scope.custmalerts = []
    $scope.activatePicker = function(e) {

        if ($scope.parentInput.parentLink == 'volpayconfigurations') {
            var mindate = new Date();
            mindate.setSeconds(0);
            mindate.setMinutes(0);
            mindate.setHours(0);
            mindate.setMilliseconds(0);
            $("[name='EffectiveFromDate']").datetimepicker({
                locale: 'es',
                format: "YYYY-MM-DD",
                showClear: true,
                icons: datepickerFaIcons.icons,
                useCurrent: false,
                minDate: mindate
            }).on('dp.show', function(ev) {
    
                $(ev.target).next().css({
                    bottom: 'auto'
                });
    
            })
    
        }
        $('.DatePicker').datetimepicker({
            locale: 'es',
            format: "YYYY-MM-DD",
            useCurrent: false,
            showClear: true,
            icons: datepickerFaIcons.icons
        }).on('dp.change', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function(ev) {
            //datePlaceholder = $(ev.currentTarget).attr('placeholder')
            $(ev.target).next().css({
                bottom: 'auto'
            });

            $('.picker-switch').off('click')
            $('.picker-switch').on('click', function() {
                $(ev.currentTarget).val('')
                if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                    $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = ''
                } else {
                    var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                    $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = ''
                }
            })
            //$(ev.currentTarget).attr('placeholder', 'YYYY MM DD')

            $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                "overflow-y": ""
            });
            if ($scope.parentInput.parentLink != 'mandate') {
                if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
                    $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                        if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) {} else {
                            $(this).css({
                                "display": "none"
                            });
                        }
                    })
                }
            }
        }).on('dp.hide', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
            }
            //$(ev.currentTarget).attr('placeholder', 'Please Enter ' + $(ev.currentTarget).attr('id'))
            if ($(ev.currentTarget).parent().parent().parent().parent().attr('id')) {
                var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
                var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0];
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                    $(this).css({
                        "display": ""
                    });
                })
                $('#' + y).animate({
                    scrollTop: ($('#' + y + '_' + x).outerHeight() * (x + 1)) + 'px'
                }, 0);
            }
        });

        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: false,
            showClear: true,
            icons: datepickerFaIcons.icons
        }).on('dp.change', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function(ev) {
            $('.picker-switch').off('click')
            $('.picker-switch').on('click', function() {
                $(ev.currentTarget).val('')
                if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                    $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = ''
                } else {
                    var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                    $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = ''
                }
            })
            $(ev.currentTarget).attr('placeholder', 'HH MM SS')
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
            if ($scope.parentInput.parentLink === 'cutoffs' && $scope.parentInput.Operation === 'Edit') {
                $scope.custmalerts = [{
                    type: 'warning',
                    msg: 'Editing the Cut off time will affect the attached MOP'
                }];
            }
        }).on('dp.hide', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
                $scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
            }
            $(ev.currentTarget).attr('placeholder', 'Please Enter ' + $(ev.currentTarget).attr('id'))
            if ($(ev.currentTarget).parent().parent().parent().parent().attr('id')) {
                var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
                var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
                $(ev.currentTarget).parent().parent().parent().parent().parent().css({
                    "overflow-y": "auto"
                });
                $(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function() {
                    $(this).css({
                        "display": ""
                    });
                })
                $('#' + y).animate({
                    scrollTop: ($('#' + y + '_' + x).outerHeight() * (x + 1)) + 'px'
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

    $scope.triggerPicker = function(e) {

        if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $scope.activatePicker($(e.currentTarget).prev());
            $(sanitize('input[name=' + $(e.currentTarget).prev().attr('name') + ']')).data("DateTimePicker").show();
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
    $scope.select2Loadmore = function(argu, _link) {
        if ($scope.fieldData[argu.FieldName]) {
            var _query = {
                search: $scope.fieldData[argu.FieldName],
                start: 0,
                count: 500,
                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
            }
            crudRequest('GET', _link, '', _query).then(function(response) {
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
                    url: function() {
                        return BASEURL + "/rest/v2/" + _link
                    },
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
                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                            count: pageLimitCount
                        }
                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount,
                                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                            };
                        }
                        if (_link.indexOf('start') != -1 && _link.indexOf('count') != -1) {
                            query = JSON.stringify({})
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
    $scope.placeholder=function()
    {
        let nombreselect = ['MOPCategory', 'MessageReleasePreference', 'Status']
        for (var i in nombreselect) {
            $("select[name='" + nombreselect[i] + "']").select2({
                placeholder: $filter('translate')('Placeholder.Select')
            });
        }
    }

    $(document).ready(function() {
        $scope.placeholder();
        isIE = /*@cc_on!@*/ false || !!document.documentMode;
        setTimeout(function() {
            if (($scope.parentInput.Operation == 'Add') || ($scope.parentInput.Operation == ' Add')) {
                var pageLimitCount = 500;
                $("select").each(function() {
                    var details = $(this).attr('detailsoffield') ? JSON.parse($(this).attr('detailsoffield')) : {};
                    if ('Multiple' in details && details.Multiple[details.Multiple.length - 1].displayvalue == 'MULTISELECT' && details.Multiple[details.Multiple.length - 1].actualvalue) {
                        $(this).find('option').each(function() {
                                if ($(this).attr('value') == '') {
                                    // To Remove select old option elements
                                    var mySelect = $(this);
                                    var len = mySelect[0].length;
                                    if (len) {
                                        for (var i = 0; i < len; i++) {
                                            mySelect[0].remove(i);
                                        }
                                    }
                                    // $(this).remove();
                                }
                            })
                            // To Remove select old option elements
                        var mySelect = $(this).find('option:first-child');
                        var len = mySelect[0].length;
                        if (len) {
                            for (var i = 0; i < len; i++) {
                                mySelect[0].remove(i);
                            }
                        }
                        // $(this).find('option:first-child').remove()
                        $(this).val('')
                        if ($scope.parentInput.parentLink === 'partyserviceassociations' && ($(this).attr('name') === 'PermittedAccountNos' || $(this).attr('name') === 'PreferredAccount')) {
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
                                    $(sanitize('input[name=' + inputName[inputName.length - 1] + ']')).on('blur', function() {
                                        var kash;
                                        saveLink = details.property[details.property.length - 1].value
                                        for (u in inputName) {
                                            if ($(sanitize('input[name=' + inputName[u] + ']')).val() == '') {
                                                kash = false
                                                saveLink = details.property[details.property.length - 1].value
                                                if (_links._name == 'FieldName') {
                                                    if ($(sanitize('select[name=' + details.FieldName + ']')).hasClass("select2-hidden-accessible")) {
                                                        $(sanitize('select[name=' + details.FieldName + ']')).select2('destroy')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).val('')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).find('option:nth-child(2)').remove()
                                                    }
                                                    $scope.parentInput.pageInfo.Section[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
                                                } else {
                                                    if ($(sanitize('select[name=' + details.FieldName + ']')).hasClass("select2-hidden-accessible")) {
                                                        $(sanitize('select[name=' + details.FieldName + ']')).select2('destroy')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).val('')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).find('option:nth-child(2)').remove()
                                                    }
                                                    $scope.parentInput.pageInfo[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions
                                                }
                                                break;
                                            } else {
                                                kash = true
                                                saveLink = saveLink.replace('{' + inputName[u] + '}', $(sanitize('input[name=' + inputName[u] + ']')).val());
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
                remoteDataConfig = function() {
                    var add_method = 'GET'
                        //setTimeout(function(){
                    $(".appendSelect2").each(function() {
                            $scope.chkREST = JSON.parse($(this).attr('detailsoffield'));
                            if (($(this).attr('name') == 'FieldPath' || $(this).attr('name') == 'fldName' || $(this).attr('name') == 'AcctField' || $(this).attr('name') == 'Value' || $(this).attr('name') == 'Name') && $scope.chkREST.property[0].name == 'REST') {
                                add_method = 'POST'
                            } else {
                                add_method = 'GET'
                            }
                            $(this).select2({
                                ajax: {
                                    url: function(params) {
                                        var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                                            '_data': $scope.parentInput.pageInfo.Section,
                                            '_name': 'FieldName'
                                        } : {
                                            '_data': $scope.parentInput.pageInfo,
                                            '_name': 'name'
                                        };
                                        for (k in _link._data) {
                                            // if (_link._data[k][_link._name] == $(this).attr('name')) {
                                            //     $scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length - 1].configDetails.links
                                            // }
                                            if (_link._data[k][_link._name] == $(this).attr('name')) {
                                                if (_link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length - 1].configDetails) {
                                                    $scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length - 1].configDetails.links;
                                                } else {
                                                    for (var _ln in _link._data[k]['property']) {
                                                        if (_link._data[k]['property'][_ln]['name'].indexOf('REST') !== -1) {
                                                            $scope.links = _link._data[k]['property'][_ln]['value'];
                                                            if ($scope.links.indexOf('{') !== -1) {
                                                                var _url, _id, backUpUrl = $scope.links;
                                                                for (var url in $scope.links.split('/')) {
                                                                    if ($scope.links.split('/')[url].indexOf('{') !== -1) {
                                                                        _url = $scope.links.split('/')[url];
                                                                        _id = _url.substring($scope.links.split('/')[url].indexOf('{') + 1, $scope.links.split('/')[url].indexOf('}'));
                                                                        var $this = this;
                                                                        $('[name=' + _id + ']').change(function() {
                                                                            // setValSelect2($this, '');
                                                                            delete $scope.fieldData[$($this).attr('name')];
                                                                        })
                                                                        if ($scope.fieldData[_id]) {
                                                                            backUpUrl = backUpUrl.replace(_url, $scope.fieldData[_id]);
                                                                        } else {
                                                                            backUpUrl = $scope.links;
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                $scope.links = backUpUrl
                                                            }
                                                        }
                                                    }
                                                }
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
                                                                        $scope.links = $scope.links.replace($scope.links.split('/')[j], $(sanitize('select[name=' + inputs + ']')).val())
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
                                            /*for(kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData){
                                                if($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == $(this).attr('name')){
                                                  	
                                                    $scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value
                                                  }
                                            }*/
                                            for (var _sub_name in $scope.parentInput.pageInfo.Subsection) {
                                                for (var _sub_name_lvl1 in $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData) {
                                                    if ($scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].FieldName === $(this).attr('name')) {
                                                        $scope.links = $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].property[0].value
                                                    }
                                                }
                                            }
                                        }
                                        $scope.chkREST = JSON.parse($(this).attr('detailsoffield'));
                                        if ($scope.links && $scope.links.indexOf('/') === -1) {
                                            for (var _link in $scope.chkREST['property']) {
                                                if ($scope.chkREST['property'][_link]['name'] === 'REST') {
                                                    $scope.links = $scope.chkREST['property'][_link]['value'];
                                                }
                                            }
                                            for (var urlLink in $scope.links.split('/')) {
                                                if ($scope.links.split('/')[urlLink][0].indexOf('{') !== -1 && $scope.links.split('/')[urlLink][$scope.links.split('/')[urlLink].length - 1].indexOf('}') !== -1) {
                                                    var replacedName = $scope.links.split('/')[urlLink];
                                                    replacedName = replacedName.replace('{', '');
                                                    replacedName = replacedName.replace('}', '');
                                                    var _name = $(this).attr('name')
                                                    $('[name=' + replacedName + ']').change(function() {
                                                        $('[name=' + _name + ']').each(function() {
                                                                $(this).val('').trigger("change.select2");
                                                                $(this).trigger("change")
                                                            })
                                                            //$('[name='+_name+']').val('').trigger("change.select2");
                                                            //$('[name='+_name+']').trigger("change")
                                                    })
                                                    var indexx_ = $(this).parent().parent().parent().parent().attr('id').split('_')[1];
                                                    if ($scope.replaceWithValue(replacedName, indexx_)) {
                                                        $scope.links = $scope.links.replace($scope.links.split('/')[urlLink], $scope.replaceWithValue(replacedName, indexx_));
                                                    }
                                                }
                                            }
                                        }

                                        return BASEURL + "/rest/v2/" + $scope.links
                                    },
                                    type: add_method,
                                    headers: {
                                        "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                                        "source-indicator": configData.SourceIndicator,
                                        "Content-Type": "application/json"
                                    },
                                    dataType: 'json',
                                    delay: 250,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    beforeSend: function(xhr) {

                                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)), xhr.withCredentials = true
                                    },
                                    crossDomain: true,
                                    data: function(params) {

                                        var query = {
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount
                                        }
                                        if (params.term) {
                                            query = {
                                                search: params.term,
                                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                                count: pageLimitCount,
                                                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                                            };
                                        }

                                        if ($scope.links && $scope.links.indexOf('start') != -1 && $scope.links.indexOf('count') != -1) {
                                            query = JSON.stringify({})
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
                                                more: data.length >= pageLimitCount
                                            }
                                        };
                                    },
                                    cache: true
                                },
                                placeholder: $filter('translate')('Placeholder.Select'),
                                minimumInputLength: 0,
                                allowClear: true
                                    /*,closeOnSelect: false
                                    ,tags: true,
                                    createTag: function (tag) {
                                    return {
                                    id: tag.term,
                                    text: tag.term,
                                    tag: true
                                    };
                                    }*/
                            });
                        })
                        //},0)


                }
                remoteDataConfig();
            } else {
                $("select").each(function() {
                    var details = $(this).attr('detailsoffield') ? JSON.parse($(this).attr('detailsoffield')) : ''
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
                                    $(sanitize('input[name=' + inputName[inputName.length - 1] + ']')).on('blur', function() {
                                        var kash;
                                        saveLink = details.property[details.property.length - 1].value
                                        for (u in inputName) {
                                            if ($('input[name=' + inputName[u] + ']').val() == '') {
                                                kash = false
                                                saveLink = details.property[details.property.length - 1].value
                                                if (_links._name == 'FieldName') {
                                                    if ($(sanitize('select[name=' + details.FieldName + ']')).hasClass("select2-hidden-accessible")) {
                                                        $(sanitize('select[name=' + details.FieldName + ']')).select2('destroy')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).val('')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).find('option:nth-child(2)').remove()
                                                    }
                                                    $scope.parentInput.pageInfo.Section[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
                                                } else {
                                                    if ($(sanitize('select[name=' + details.FieldName + ']')).hasClass("select2-hidden-accessible")) {
                                                        $(sanitize('select[name=' + details.FieldName + ']')).select2('destroy')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).val('')
                                                        $(sanitize('select[name=' + details.FieldName + ']')).find('option:nth-child(2)').remove()
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

                remoteDataConfig = function() {
                    var add_method = 'GET'
                        //setTimeout(function(){
                    $(".appendSelect2").each(function() {

                            $scope.chkREST = JSON.parse($(this).attr('detailsoffield'))

                            if (($(this).attr('name') == 'FieldPath' || $(this).attr('name') == 'fldName' || $(this).attr('name') == 'AcctField' || $(this).attr('name') == 'Value' || $(this).attr('name') == 'Name') && $scope.chkREST.property[0].name == 'REST') {
                                add_method = 'POST'
                            } else {
                                add_method = 'GET'
                            }
                            $(this).select2({
                                ajax: {
                                    url: function(params) {
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
                                                                        $scope.links = $scope.links.replace($scope.links.split('/')[j], $(sanitize('select[name=' + inputs + ']')).val())
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

                                            for (var _sub_name in $scope.parentInput.pageInfo.Subsection) {
                                                for (var _sub_name_lvl1 in $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData) {
                                                    if ($scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].FieldName === $(this).attr('name')) {
                                                        $scope.links = $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].property[0].value
                                                    }
                                                }
                                            }
                                        }
                                        $scope.chkREST = JSON.parse($(this).attr('detailsoffield'))
                                        if ($scope.links && $scope.links.indexOf('/') === -1) {
                                            for (var _link in $scope.chkREST['property']) {
                                                if ($scope.chkREST['property'][_link]['name'] === 'REST') {
                                                    $scope.links = $scope.chkREST['property'][_link]['value'];
                                                }
                                            }
                                            for (var urlLink in $scope.links.split('/')) {
                                                if ($scope.links.split('/')[urlLink][0].indexOf('{') !== -1 && $scope.links.split('/')[urlLink][$scope.links.split('/')[urlLink].length - 1].indexOf('}') !== -1) {
                                                    var replacedName = $scope.links.split('/')[urlLink];
                                                    replacedName = replacedName.replace('{', '');
                                                    replacedName = replacedName.replace('}', '');
                                                    var indexx_ = $(this).parent().parent().parent().parent().attr('id').split('_')[1];
                                                    if ($scope.replaceWithValue(replacedName, indexx_)) {
                                                        $scope.links = $scope.links.replace($scope.links.split('/')[urlLink], $scope.replaceWithValue(replacedName, indexx_));
                                                    }
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
                                    beforeSend: function(xhr) {
                                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                            xhr.withCredentials = true
                                    },
                                    crossDomain: true,
                                    data: function(params) {
                                        var query = {
                                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                            count: pageLimitCount
                                        }
                                        if (params.term) {
                                            query = {
                                                search: params.term,
                                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                                count: pageLimitCount,
                                                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                                            };
                                        }

                                        if ($scope.links && $scope.links.indexOf('start') != -1 && $scope.links.indexOf('count') != -1) {
                                            query = JSON.stringify({})
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
                remoteDataConfig();
            }

            if ($rootScope.BrFields) {
                for (var i in $rootScope.BrFields) {
                    $(sanitize('select[name=' + $rootScope.BrFields[i] + ']')).select2()
                }
            }

            $("select").on("change", function(e) {
                if ($scope.parentInput.pageTitle === 'Party Service Association') {
                    if (($(e.currentTarget).attr('name') == 'PartyCode') || ($(e.currentTarget).attr('name') == 'ServiceCode') || ($(e.currentTarget).attr('name') == 'InputFormat')) {
                        $('input[name=PartyServiceAssociationCode]').val($('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=ServiceCode]').val() + '_' + $('select[name=InputFormat]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() : $('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=ServiceCode]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() + '_' + $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() : '')

                        if ($('input[name=UsageMechanism]').attr('radioattr') != '' || $('input[name=UsageMechanism]').attr('radioattr') != 'UI') {
                            $('input[name=PartyServiceAssociationCode]').val($('input[name=PartyServiceAssociationCode]').val() + ($('input[name=UsageMechanism]').attr('radioattr') == 'API' ? '_API' : ($('input[name=UsageMechanism]').attr('radioattr') == 'Transport') ? '_Tr' : ''))
                        }

                        $scope.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
                            //$scope.parentInput.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
                    }
                }
            });

            $scope.appendWithPSAcode = function(getActualValue) {

                if (getActualValue) {
                    if ($('input[name=PartyServiceAssociationCode]').val().indexOf('API') == -1 && $('input[name=PartyServiceAssociationCode]').val().indexOf('Tr') == -1) {
                        $('input[name=PartyServiceAssociationCode]').val($('input[name=PartyServiceAssociationCode]').val() + ((getActualValue == 'API') ? '_API' : (getActualValue == 'Transport') ? '_Tr' : ''))
                    } else {
                        var text = $('input[name=PartyServiceAssociationCode]').val()
                        if ($('input[name=PartyServiceAssociationCode]').val().indexOf('API') != -1) {
                            var ReplacethisVal = (getActualValue == 'Transport') ? '_Tr' : ''
                            $('input[name=PartyServiceAssociationCode]').val(text.replace('_API', ReplacethisVal))
                        } else if ($('input[name=PartyServiceAssociationCode]').val().indexOf('Tr') != -1) {
                            var ReplacethisVal = (getActualValue == 'API') ? '_API' : ''
                            $('input[name=PartyServiceAssociationCode]').val(text.replace('_Tr', ReplacethisVal))
                        }

                    }

                    $scope.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val();

                }
            }

            $('input[type=radio]').each(function() {
                if ($(this).val() == 'false' && $scope.parentInput.Operation == 'Add') {
                    var parentId = $(this).parent().parent().parent().parent().parent().parent().attr('id')
                    if (parentId in $scope.subSectionfieldData) {
                        if ($(this).attr('ng-model').indexOf('fieldData') == -1) {
                            $scope.subSectionfieldData[parentId][$scope.subSectionfieldData[parentId].length - 1][$(this).attr('name')] = false;
                        } else {
                            $scope.subSectionfieldData[parentId][$(this).attr('name')] = false;
                        }
                    } else {
                        $scope.fieldData[$(this).attr('name')] = false;
                    }
                }

            })



            for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
                $(sanitize('[name=' + _fieldName + ']')).each(function() {
                    if ($(this).attr('type') == 'radio') {
                        if ($scope.parentInput.Operation == 'Clone' && $scope.parentInput.frommodule != 'entitydraft') {

                            $scope.cstmAttrfn(this, true)
                        } else {
                            $scope.cstmAttrfn(this)
                        }
                    } else {
                        if ($(this).val() && $scope.parentInput.frommodule != 'entitydraft') {
                            $scope.cstmAttrfn(this)
                        }
                        if ($scope.parentInput.Operation == 'Clone' || $scope.parentInput.Operation == 'Edit') {
                            if (($scope.parentInput.parentLink === 'workorder') && ($(this).attr('name') === 'WorkOrderType')) {
                                if ($(this).val()) {
                                    set_cstm_attr($(this).val(), $scope.parentInput.pageInfo.cstmAttr[$(this).attr('name')]);
                                } else {
                                    set_cstm_attr($(this).val(), $scope.parentInput.pageInfo.cstmAttr[$(this).attr('name')], true);
                                }
                            }
                        }

                        if (($scope.parentInput.Operation == 'Clone' || $scope.parentInput.Operation == 'Edit') && ($scope.parentInput.parentLink === 'mandate')) {

                            if (($(this).is(":checked")) && ($scope.parentInput.parentLink === 'mandate') && ($(this).attr('name') === 'InheritMandateFromParent')) {
                                set_cstm_attr($(this).val(), $scope.parentInput.pageInfo.cstmAttr[_fieldName]);
                            } else {
                                $scope.cstmAttrfn(this);
                            }
                        }
                    }
                })
            }

        }, 1000)

        $scope.backupcstmAttr = {}
        for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
            $('[name=' + _fieldName + ']').on('change', function() {
                if (($scope.parentInput.parentLink === 'workorder') && ($(this).attr('name') === 'WorkOrderType')) {

                    set_cstm_attr($(this).val(), $scope.parentInput.pageInfo.cstmAttr[$(this).attr('name')], true);
                } else if (($scope.parentInput.parentLink === 'mandate') && ($(this).attr('name') === 'InheritMandateFromParent')) {

                    set_cstm_attr($(this).val(), $scope.parentInput.pageInfo.cstmAttr[$(this).attr('name')], true);
                } else {
                    $scope.cstmAttrfn(this, true);
                }
            })
        }

        function remoteDataConfig1() {
            var pageLimitCount = 500
            var add_method = 'GET'
                //setTimeout(function(){
            $(".appendSelect2").each(function() {

                    if ($(this).attr('name') == 'FieldPath' || $(this).attr('name') == 'fldName' || $(this).attr('name') == 'batchfldName') {
                        add_method = 'POST'
                    } else {
                        add_method = 'GET'
                    }
                    $(this).select2({
                        ajax: {
                            url: function(params) {
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
                                                $scope.links = _link._data[k]['webform'].Subsection[0].subSectionData[jk].property[0].value

                                                if ($scope.links.match('{')) {
                                                    for (var j in $scope.links.split('/')) {
                                                        if ($scope.links.split('/')[j].match('{') && $scope.links.split('/')[j].match('}')) {
                                                            var inputs = $scope.links.split('/')[j].replace('{', '').replace('}', '')
                                                            $scope.links = $scope.links.replace($scope.links.split('/')[j], $(sanitize('select[name=' + inputs + ']')).val())
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
                                if (_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]) {
                                    /*for(kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData){
                                    	if($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == $(this).attr('name')){
                                    		$scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value
                                     	}
                                    }*/
                                    for (var _sub_name in $scope.parentInput.pageInfo.Subsection) {
                                        for (var _sub_name_lvl1 in $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData) {
                                            if ($scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].FieldName === $(this).attr('name')) {
                                                $scope.links = $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].property[0].value
                                            }
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
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                                    xhr.withCredentials = true
                            },
                            crossDomain: true,
                            data: function(params) {
                                var query = {
                                    start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                    count: pageLimitCount
                                }
                                if (params.term) {
                                    query = {
                                        search: params.term,
                                        start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                        count: pageLimitCount,
                                        'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                                    };
                                }
                                if ($scope.links && $scope.links.indexOf('start') != -1 && $scope.links.indexOf('count') != -1) {
                                    query = JSON.stringify({})
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
                                        more: data.length >= pageLimitCount
                                    }
                                };
                            },
                            cache: true
                        },
                        placeholder: filter('translate')('Placeholder.Select'),
                        minimumInputLength: 0,
                        allowClear: true

                    });
                })
                //},0)
        }

        $scope.cstmAttrBackup = {};
        $scope.cstmAttrfn = function(_this, flag) {
            var inputs = $(_this).val();

            if ($scope.parentInput.parentLink === 'transports' || $scope.parentInput.parentLink === 'businessrules' || $scope.parentInput.parentLink === 'parties') {
                if (Object.keys($scope.cstmAttrBackup).length === 0) {
                    for (var attr in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                        for (var sec in $scope.parentInput.pageInfo.Section) {
                            if ($scope.parentInput.pageInfo.Section[sec].FieldName == attr) {
                                $scope.cstmAttrBackup[attr] = {
                                    id: sec,
                                    value: angular.copy($scope.parentInput.pageInfo.Section[sec])
                                }
                            }
                        }
                    }
                }
                if ($scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                    for (var attr in $scope.cstmAttrBackup) {
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Visible'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['visible'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['View'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['enabled'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Enabled']
                         $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Mandatory'] = $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Notnull'];
                        $('[name=' + attr + ']').parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                        if (($scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Visible']) && ($('[name=' + attr + ']').val())) {

                        } else {
                         
                            $scope.fieldData[attr] = ''
                        }
                        // $scope.fieldData[attr] = '';
                    }
                } else {
                    for (var attr in $scope.cstmAttrBackup) {

                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Visible'] = $scope.cstmAttrBackup[attr]['value']['visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['visible'] = $scope.cstmAttrBackup[attr]['value']['visible'];
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['View'] = $scope.cstmAttrBackup[attr]['value']['visible']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['enabled'] = $scope.cstmAttrBackup[attr]['value']['enabled']
                        $scope.parentInput.pageInfo.Section[$scope.cstmAttrBackup[attr]['id']]['Mandatory'] = $scope.cstmAttrBackup[attr]['value']['Mandatory']
                        $scope.fieldData[attr] = ''
                    }
                }
            }
            if ($scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs] && $(_this).is(":checked")) {
                //$scope.backupcstmAttr[$(_this).attr('name')] = {}
                for (var attr in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                    for (var sec in $scope.parentInput.pageInfo.Section) {
                        if ($scope.parentInput.pageInfo.Section[sec].FieldName == attr) {
                            $scope.parentInput.pageInfo.Section[sec]['Visible'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : '';
                            $scope.parentInput.pageInfo.Section[sec]['visible'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : '';
                            $scope.parentInput.pageInfo.Section[sec]['View'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : '';
                            $scope.parentInput.pageInfo.Section[sec]['enabled'] = 'Enabled' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Enabled'] : ''
                            $scope.parentInput.pageInfo.Section[sec]['Mandatory'] = 'NotNull' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['NotNull'] : ''
                            $('[name=' + attr + ']').parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                            if (flag && $scope.fieldData[attr]) {
                                if (typeof($scope.fieldData[attr]) == 'object') {
                                    if ($scope.fieldData[attr].Fields) {
                                        $scope.fieldData[attr].Fields = [{}]
                                    }
                                } else {
                                    $scope.fieldData[attr] = ''
                                }
                            }
                            if ('webform' in $scope.parentInput.pageInfo.Section[sec]) {
                                for (var kk in $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData) {
                                    $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['Visible'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : '';
                                    $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['visible'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : '';
                                    $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['View'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : '';
                                    $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['enabled'] = 'Enabled' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Enabled'] : '';
                                    $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['Mandatory'] = 'NotNull' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['NotNull'] : ''
                                    if (flag) {
                                        $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['ChoiceOptions'] = $scope.parentInput.pageInfo.Section[sec].webform.Subsection[0].subSectionData[kk]['Multiple']
                                    }
                                }
                            }
                            setTimeout(function() {
                                remoteDataConfig1()
                            }, 100)
                        }
                    }
                    for (var subsec in $scope.parentInput.pageInfo.Subsection) {
                        for (var subsecdata in $scope.parentInput.pageInfo.Subsection[subsec].subSectionData) {
                            if ($scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata].FieldName == attr) {
                                $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['Visible'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['Visible'];
                                $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['visible'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['visible'];
                                $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['View'] = 'Visible' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Visible'] : $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['View']
                                $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['enabled'] = 'Enabled' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['Enabled'] : $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['enabled']
                                $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['Mandatory'] = 'NotNull' in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr] ? $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]['NotNull'] : $scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['Mandatory']
                                    /* if($scope.parentInput.pageInfo.Subsection[subsec].subSectionData[subsecdata]['Mandatory']){
                                        $('[name='+attr+']').parent().parent().prev().find('span').attr('ng-hide',true).addClass('ng-hide')
                                    }
                                    else{
                                        $('[name='+attr+']').parent().parent().prev().find('span').attr('ng-hide',false).removeClass('ng-hide')	
                                    } */
                                if (inputs == "false" || inputs == 'UI') {
                                    if ($('[name=' + attr + ']').attr('type') == 'radio') {
                                        $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[subsec].FieldName][attr] = false;
                                    } else {
                                        if ($(sanitize('select[name=' + attr + ']')).hasClass("select2-hidden-accessible")) {
                                            for (var _subsecin in $scope.parentInput.pageInfo.Subsection[subsec].subSectionData) {
                                                if ($scope.parentInput.pageInfo.Subsection[subsec].subSectionData[_subsecin].FieldName === attr) {
                                                    $scope.setInitsubval($scope.parentInput.pageInfo.Subsection[subsec].subSectionData[_subsecin], $scope.parentInput.pageInfo.Subsection[subsec])
                                                }
                                            }
                                            delete $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[subsec].FieldName][attr];
                                        } else {
                                            $scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[subsec].FieldName][attr] = '';
                                        }
                                    }
                                }

                            }
                        }
                    }
                }

            }

            if ($scope.parentInput.parentLink === 'distributionformatpreference' && ($scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs])) {
                var indexx_ = $(_this).parent().parent().parent().parent().attr('id').split('_')[1];
                var id_ = $(_this).parent().parent().parent().parent().attr('id').split('_')[0];
                for (var attr in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs]) {
                    for (var opt in $scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr]) {
                        $('[name=' + attr + ']').each(function(i) {
                            if (Number(indexx_) === i) {
                                if (opt.toLowerCase() === 'enabled') {
                                    $(this).attr('readonly', !$scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr][opt])
                                    $(this).attr('disabled', !$scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr][opt])
                                    if (!$scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr][opt]) {
                                        $(this).val('');
                                        if (attr in $scope.subSectionfieldData[id_][indexx_]) {
                                            delete $scope.subSectionfieldData[id_][indexx_][attr];
                                        }
                                    }
                                } else if (opt.toLowerCase() === 'visible') {

                                } else if (opt.toLowerCase() === 'notnull') {
                                    if ($scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr][opt]) {
                                        $(this).parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                                    } else if (!$scope.parentInput.pageInfo.cstmAttr[$(_this).attr('name')][inputs][attr][opt]) {
                                        $(this).parent().prev().find('span').attr('ng-hide', true).addClass('ng-hide')
                                    }
                                }
                            }
                        })
                    }
                }
            }
            if ($scope.parentInput.parentLink === 'schedulerprofile' || $scope.parentInput.parentLink === 'workorder' || $scope.parentInput.parentLink === 'workorderextensionprofile') {
                inputs = inputs.replace("? string:", "");
                inputs = inputs.replace(" ?", "")

                // if(inputs.indexOf('? boolean:') != -1){


                inputs = inputs.replace("? boolean:", "");
                inputs = inputs.replace(" ?", "");

                if (inputs == 'true') {
                    // inputs = true;
                } else if (inputs == 'false') {
                    // inputs = false;
                }




                if ($scope.parentInput.pageInfo.cstmAttr[_this.getAttribute('name')][inputs]) {
                    $scope.cstmAttrBackup[_this.getAttribute('name')] = $scope.parentInput.pageInfo.cstmAttr[_this.getAttribute('name')][inputs];
                }


                var $id, $argu, $index, id_;

                if ($scope.parentInput.pageInfo.cstmAttr[_this.getAttribute('name')]) {

                    for (var _attr in $scope.cstmAttrBackup[_this.getAttribute('name')]) {
                        $id = $(sanitize('[name=' + _attr + ']')).length ? $(sanitize('[name=' + _attr + ']')) : '';

                        if ($(_this).closest('.anitem').length) {
                            $index = $(_this).closest('.anitem').attr('id').split('_')[1];
                            id_ = $(_this).closest('.anitem').attr('id').split('_')[0]
                            $id = $id ? $id : $('[name=' + _attr + '_' + $index + ']');
                            $($id).each(function(i) {
                                if (Number($index) === i) {
                                    $id = this;
                                }
                            })

                            if (flag) {
                                if ($.isArray($scope.subSectionfieldData[id_])) {
                                    checkRecursiveData($scope.subSectionfieldData[id_][Number($index)], _attr)
                                } else {
                                    checkRecursiveData($scope.subSectionfieldData[id_], _attr)
                                }
                                clearselectonchange($id);
                            }
                        } else if (flag) {
                            if (_attr in $scope.fieldData) {
                                delete $scope.fieldData[_attr];
                            }
                            clearselectonchange($id);
                        }
                        if ($scope.parentInput.pageInfo.cstmAttr[_this.getAttribute('name')][inputs]) {
                            $argu = $scope.parentInput.pageInfo.cstmAttr[_this.getAttribute('name')][inputs][_attr];
                        } else {
                            $argu = $($id).attr('detailsoffield') ? JSON.parse($($id).attr('detailsoffield')) : $($id).attr('detailsofsubfield') ? JSON.parse($($id).attr('detailsofsubfield')) : '';
                        }

                        setDefaultAttr($id, $argu);
                    }
                    if ($scope.cstmAttrBackup[_this.getAttribute('name')]) {
                        hideSection($scope.cstmAttrBackup[_this.getAttribute('name')], Number($index), id_);
                    }
                }
            }

            $scope.$apply(function() {
                $scope.parentInput.pageInfo = $scope.parentInput.pageInfo;
            })
        }
        $("select").each(function() {
            var details = $(this).attr('details_field') ? JSON.parse($(this).attr('details_field')) : {};
            if (Object.keys(details).length) {
                select_fn(details, this);
            }
        })
    })

    /** Dynamic Functionality */
    var obtained_value, select_box = "";

    var select_fn = function(details, select_box) {
        var obtained_value, index = '';
        if ($(select_box).closest('.anitem').length) {
            if ($(select_box).closest('.anitem').attr('id').indexOf('_') !== -1) {
                index = Number($(select_box).closest('.anitem').attr('id').split('_')[1]);
            }
        }
        obtained_value = find_value(details['FieldName'], $scope.fieldData, index) ? find_value(details['FieldName'], $scope.fieldData, index) : find_value(details['FieldName'], $scope.subSectionfieldData, index);

        //obtained_value = $scope.find_value(details['FieldName'], index);
        $scope.select2_config = {
            placeholder: 'Select',
            minimumInputLength: 0,
            allowClear: true,
            tags: false
        };

        var multiple = check_multiple(details, $scope.select2_config);
        var http = check_ajax(select_box, $scope.select2_config);
        if (http['url']) {
            /*var field_details = get_field_details(details['FieldName']);
            field_details['ChoiceOptions'] = [];*/

            var input = {
                url: http['url'],
                method: http['method'],
                data: {},
                query: { start: 0, count: 500 },
                argu: select_box
            }
            if (obtained_value) {
                obtained_value = (obtained_value.indexOf(',') !== -1) ? obtained_value.split(',') : obtained_value;
                if (Array.isArray(obtained_value)) {
                    for (var val in obtained_value) {
                        var query = { start: 0, count: 500, search: obtained_value[val] };
                        input = Object.assign(input, { query, obtained_value });
                        crudReq_in_loop(input);
                    }
                } else {
                    input['query']['search'] = obtained_value;
                    input['obtained_value'] = obtained_value;
                    crudReq_in_loop(input);
                }
            }
        }
        $(select_box).select2($scope.select2_config).trigger('change.select2');
        if (obtained_value) {
            $(select_box).val(obtained_value).trigger('change.select2');
        } else {
            setTimeout(set_value, 200, select_box, '')
        }
    }

    var check_multiple = function(details, select2_config = {}) {
        details['Multiple'].forEach(function(options) {
            if (options['displayvalue'].toLowerCase() === 'multiselect') {
                if (options['actualvalue']) {
                    remove_empty_option(select_box);
                    select2_config['multiple'] = true;
                }
            } else if (options['displayvalue'].toLowerCase() === 'createtag') {
                if (options['actualvalue']) {
                    var createTag = {
                        tags: true,
                        createTag: function(tag) {
                            return {
                                id: tag.term,
                                text: tag.term,
                                tag: true
                            };
                        }
                    }
                    select2_config = Object.assign(select2_config, createTag);
                }
            } else {
                //var option = new Option(options['displayvalue'], options['actualvalue']);											
                //$(select_box).append(option).trigger('change.select2');
            }
        })
        return select2_config;
    }

    var check_ajax = function(select_box, select2_config = {}, flag = false) {
        var cstmAttr = {},
            http = {
                method: 'GET'
            },
            depended_field, match_depended_field_value, depende_field_value, index = -1;
        if ($(select_box).closest('.anitem').length) {
            if ($(select_box).closest('.anitem').attr('id').indexOf('_') !== -1) {
                index = Number($(select_box).closest('.anitem').attr('id').split('_')[1]);
            }
        }
        var details = $(select_box).attr('details_field') ? JSON.parse($(select_box).attr('details_field')) : {};
        if (details['property']) {
            details['property'].forEach(function(property) {
                if (property['name'].toLowerCase().indexOf('choice') !== -1) {
                    if (property['value'].indexOf('&&') !== -1) {
                        depended_field = [];
                        var _id = property['value'].split('&&');
                        _id.forEach(function(i) {
                            depended_field.push(i.trim());
                            if (index > -1) {
                                $($('[name=' + i.trim() + ']')[index]).each(function() {
                                    $(this).on('change', function() {
                                        $($('[name=' + details["FieldName"] + ']')[index]).val('').trigger('change');
                                    })
                                })
                            } else {
                                $('[name=' + i.trim() + ']').each(function() {
                                    $(this).on('change', function() {
                                        $('[name=' + details["FieldName"] + ']').val('').trigger('change');
                                    })
                                })
                            }
                        })
                    } else {
                        depended_field = property['value'].trim();
                        $('[name=' + property['value'].trim() + ']').each(function(i) {
                            if (i === index) {
                                $(this).on('change', function() {
                                    $(select_box).val('').trigger('change');
                                    if (!flag) {
                                        check_ajax(select_box, select2_config, true);
                                    }
                                })
                            }
                        })
                    }
                } else if (property['name'].toLowerCase().indexOf('rest') !== -1) {
                    if (property['name'].indexOf('|') !== -1) {
                        var match_depended_field_value_ = property['name'].split('|')[0] ? property['name'].split('|')[0].trim() : ''
                        var value = find_value(depended_field, $scope.fieldData) ? find_value(depended_field, $scope.fieldData) : find_value(depended_field, $scope.subSectionfieldData, index);
                        if (value) {
                            depende_field_value = value;
                        } else {
                            $('[name=' + depended_field + ']').each(function(i) {
                                if (index === i) {
                                    depende_field_value = $(this).val() ? $(this).val().trim() : '';
                                }
                            })
                        }
                        if (depende_field_value && match_depended_field_value_) {
                            if (depende_field_value === match_depended_field_value_) {
                                match_depended_field_value = angular.copy(match_depended_field_value_);
                                http['count'] = 500;
                                http['backUpUrl'] = angular.copy(property['value']);
                                http['url'] = update_URL(angular.copy(property['value']), select_box);
                            }
                        }
                    } else {
                        http['count'] = 500;
                        http['backUpUrl'] = angular.copy(property['value']);
                        http['url'] = update_URL(angular.copy(property['value']), select_box);
                    }
                } else if (property['name'].toLowerCase().indexOf('value') !== -1) {
                    //cstmAttr[property['name'].split('|')[1]] = cstmAttr[property['name'].split('|')[1]] ? Object.assign(cstmAttr[property['name'].split('|')[1]], JSON.parse(property['value'])) : JSON.parse(property['value']);
                } else {}
            })
        }
        if ('url' in http) {
            select2_config['ajax'] = {
                url: function(params) {
                    http['url'] = update_URL(angular.copy(http['backUpUrl']), select_box);
                    return BASEURL + "/rest/v2/" + http['url']
                },
                type: http['method'],
                headers: {
                    "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                    "source-indicator": configData.SourceIndicator,
                    "Content-Type": "application/json"
                },
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
                    var query = {};
                    if (http['query']) {
                        query = JSON.stringify(http['query']);
                    } else {
                        query = {
                            start: params.page * http['count'] ? params.page * http['count'] : 0,
                            count: http['count']
                        }
                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * http['count'] ? params.page * http['count'] : 0,
                                count: http['count']
                            };
                        }
                        if (http['url'] && http['url'].indexOf('start') != -1 && http['url'].indexOf('count') != -1) {
                            query = JSON.stringify({})
                        }
                    }
                    return query;
                },
                processResults: function(data, params) {
                    params.page = params.page ? params.page : 0;
                    if (http['optionskey']) {

                    } else {
                        http['optionskey'] = { id: "actualvalue", text: "displayvalue" };
                    }
                    return {
                        results: $.map(data, function(item) {
                            return {
                                text: item[http['optionskey']['text']],
                                id: item[http['optionskey']['id']],
                                data: item
                            }
                        }),
                        pagination: {
                            more: data.length >= http['count']
                        }
                    };
                },
                cache: true
            }

        }
        /*if(cstmAttr && Object.keys(cstmAttr).length){
            $(select_box).on('change', function(){
                set_cstm_attr($(this).val(), cstmAttr, true);
            })
            set_cstm_attr(obtained_value, cstmAttr);
        }*/
        if (depende_field_value && match_depended_field_value) {
            if (depende_field_value === match_depended_field_value) {
                $(select_box).select2(select2_config).trigger('change.select2');
                depende_field_value = match_depended_field_value = '';
            }
        }
        return http;
    }

    var hide_section = function(id, arr, flag) {
        var ids = [];
        $(sanitize('#' + id)).find('.form-control').each(function(index, _this) {
            if ($(_this).parent().parent().hasClass('ng-hide')) {
                if (ids.indexOf(_this.getAttribute('name')) === -1)
                    ids.push(_this.getAttribute('name'))
            }
        })
        if (JSON.stringify(ids) === JSON.stringify(arr)) {
            $(sanitize('#' + id)).parent().addClass('ng-hide');
            //if(flag){
            if ($.isArray($scope.subSectionfieldData[id])) {
                $scope.subSectionfieldData[id].splice(1, $scope.subSectionfieldData[id].length - 1);
            } else if ($.isArray($scope.subSectionfieldData[id][id])) {
                //$scope.subSectionfieldData[id][id].splice(1, $scope.subSectionfieldData[id][id].length-1);
                $scope.subSectionfieldData[id][id] = [{}];
            }
            // }
        } else {
            $(sanitize('#' + id)).parent().removeClass('ng-hide');
        }
    }



    var delete_value = function(name, input, index) {
        for (var data in input) {
            if (data === name) {
                return delete input[data];
            } else if ($.isArray(input[data])) {
                return delete_value(name, input[data][index], index);
            } else if (typeof(input[data]) === 'object') {
                return delete_value(name, input[data], index);
            }
        }
    }

    var set_default_attr = function(_is, argu, flag, index) {
        for (var opt in argu) {
            var id = $(_is).attr('name');
            if (opt.toLowerCase() === 'enabled') {
                $(_is).attr('readonly', !argu[opt])
                $(_is).attr('disabled', !argu[opt])
            } else if (opt.toLowerCase() === 'visible') {
                if (argu[opt]) {
                    $(_is).parent().removeClass('ng-hide');
                    $(_is).parent().prev().removeClass('ng-hide');
                    $(_is).parent().attr('ng-hide', false);
                    $(_is).parent().prev().attr('ng-hide', false);
                    $(_is).parent().parent().removeClass('ng-hide');
                } else {
                    $(_is).parent().addClass('ng-hide');
                    $(_is).parent().prev().addClass('ng-hide');
                    $(_is).parent().attr('ng-hide', true);
                    $(_is).parent().prev().attr('ng-hide', true);
                    $(_is).parent().parent().addClass('ng-hide');
                }
                if (flag) {
                    set_value(_is, '');
                    var value = delete_value(id.trim(), $scope.fieldData) ? delete_value(id.trim(), $scope.fieldData) : delete_value(id.trim(), $scope.subSectionfieldData, index);

                }
            } else if (opt.toLowerCase() === 'notnull' || opt.toLowerCase() === 'mandatory') {
                if (argu[opt]) {
                    $(_is).parent().prev().find('span').attr('ng-hide', true).addClass('ng-hide');
                } else {
                    $(_is).parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                }
                $(_is).attr('required', !argu[opt])
            } else if (opt.toLowerCase() === 'createtag') {
                /*var updatesDetails;
                if(argu[opt] === false){
                    updatesDetails = $(_is).attr('detailsoffield') ? JSON.parse($(_is).attr('detailsoffield')) : {};
                    if(updatesDetails['Multiple']){
                        for(var mul in updatesDetails['Multiple']){
                            if(updatesDetails['Multiple'][mul]['displayvalue'].toLowerCase() === 'createtag'){
                                updatesDetails['Multiple'][mul]['actualvalue'] = argu[opt];
                            }
                        }
                    }
                } else if(argu[opt]){
                    updatesDetails = $(_is).attr('detailsoffield') ? JSON.parse($(_is).attr('detailsoffield')) : {};
                }
                select_fn(updatesDetails, _is);*/
            }
        }
    }

    var update_URL = function(argu, _this) {
        var _argu = angular.copy(argu);
        if (_argu.indexOf('/') !== -1) {
            var url = _argu.split('/');
            for (var links in url) {
                if ((url[links].indexOf('{') !== -1) && (url[links].indexOf('}') !== -1)) {
                    var field_name, index, value;
                    if ($(_this).closest('.anitem').length) {
                        if ($(_this).closest('.anitem').attr('id').indexOf('_') !== -1) {
                            index = Number($(_this).closest('.anitem').attr('id').split('_')[1]);
                        }
                    }
                    field_name = url[links].substring((Number(url[links].indexOf('{')) + 1), Number(url[links].indexOf('}')));
                    $('[name=' + field_name + ']').on("change", function() {
                        var change_index = -1;
                        if ($(this).closest('.anitem').length) {
                            if ($(this).closest('.anitem').attr('id').indexOf('_') !== -1) {
                                change_index = Number($(this).closest('.anitem').attr('id').split('_')[1]);
                            }
                        }
                        if (change_index > -1) {
                            if (index === change_index) {
                                //$scope.clear_value(_this);
                            }
                        } else {
                            //$scope.clear_value(_this);
                        }
                    });
                    value = find_value(field_name.trim(), $scope.fieldData) ? find_value(field_name.trim(), $scope.fieldData) : find_value(field_name.trim(), $scope.subSectionfieldData, index);
                    if (value) {
                        _argu = _argu.replace(url[links], value);
                    }

                }
            }
        }
        return _argu
    }

    var crudReq_in_loop = function({ method, url, data, query, argu, obtained_value }, callback) {
        crudRequest(method, url, data, query).then(function(response) {
            $(argu).find('option').remove();
            if (response['Status'] === 'Success') {
                response.data.data.forEach(function(item) {
                    var option = new Option(item['displayvalue'], item['actualvalue']);
                    $(argu).append(option).trigger('change.select2');
                })
                if (obtained_value) {
                    $(argu).val(obtained_value).trigger('change.select2');
                }
            }
        })
    }

    var get_field_details = function(argu) {
        var flag = false;
        for (var section in $scope.parentInput.pageInfo['Section']) {
            if ($scope.parentInput.pageInfo['Section'][section]['FieldName'] === argu) {
                flag = true;
                return $scope.parentInput.pageInfo['Section'][section];
            }
        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['Subsection']) {
                for (var subsectionSec in $scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData']) {
                    if ($scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName'] === argu) {
                        return $scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec];
                    }
                }
            }

        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['secondLevelsection']) {
                for (var subsectionSec in $scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData']) {
                    if ($scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec]['FieldName'] === argu) {
                        return $scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec];
                    }
                }
            }

        }
    }

    var set_value = function(_this, value) {
        $(_this).val(value).trigger('change.select2');
    }

    var remove_empty_option = function(_this) {
        $(_this).find('option').each(function() {
            if ($(this).attr('value') == '' || $(this).text() === 'select' || $(this).text() === '') {
                $(this).remove();
            }
        });
        $(_this).val('').trigger('change.select2');
    }

    var find_value = function(name, input, index) {
        for (var data in input) {
            if (data === name) {
                return input[data];
            }
        }
        for (var data in input) {
            if ($.isArray(input[data])) {
                return find_value(name, input[data][index], index);
            }
        }
        for (var data in input) {
            if (typeof(input[data]) === 'object') {
                return find_value(name, input[data], index);
            }
        }
    }




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

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    function clearselectonchange(attr) {
        setTimeout(function() {
            $(attr).val('').trigger("change.select2");
        }, 100)
    }

    function checkRecursiveData(obj, fieldname) {
        for (var key in obj) {
            if (key === '$$hashKey') {
                delete obj[key];
            }
            if (typeof(obj[key]) === 'object') {
                checkRecursiveData(obj[key], fieldname);
            } else if (obj[fieldname]) {
                delete obj[fieldname];
            }
        }
    }

    $scope.setInitval = function(argu, a, b, c, d) {
        // var _timeout = (d === 'Add') ? 10 : 3500;
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

            crudRequest('GET', argu.property[0].value, '', _query).then(function(response) {
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
                        multipleVal.push($scope.fieldData[_name].split(',')[k])
                        crudRequest('GET', argu.property[0].value, '', _query).then(function(response) {
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
            var _$links
            for (var _ln in argu['property']) {
                if (argu['property'][_ln]['name'].indexOf('REST') !== -1) {
                    _$links = angular.copy(argu.property[_ln].value)
                    if (_$links.indexOf('{') !== -1) {
                        var _url, _id, backUpUrl = _$links;
                        for (var url in _$links.split('/')) {
                            if (_$links.split('/')[url].indexOf('{') !== -1) {
                                _url = _$links.split('/')[url];
                                _id = _url.substring(_$links.split('/')[url].indexOf('{') + 1, _$links.split('/')[url].indexOf('}'));
                                // setTimeout(dependedonchange, 100, _id, _name, $scope.fieldData[_name]);
                                if ($scope.fieldData[_id]) {
                                    backUpUrl = backUpUrl.replace(_url, $scope.fieldData[_id]);
                                } else {
                                    backUpUrl = _$links;
                                    break;
                                }
                            }
                        }
                        _$links = angular.copy(backUpUrl);
                    }
                }
            }

            crudRequest('GET', _$links, '', _query).then(function(response) {
                if (response.data.data.length == 0) {
                    $scope.fieldData[_name] = '';
                }
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
                        if (!$(sanitize('select[name=' + inputs + ']')).val()) {
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
                    crudRequest('POST', l_link, _query).then(function(response) {
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
                    crudRequest('POST', l_link, _query).then(function(response) {
                        argu.ChoiceOptions = response.data.data;
                    });
                }
            }
        } else {
            if ($scope.parentInput.parentLink === 'distributionformatpreference' || $scope.parentInput.parentLink === 'workorder' || $scope.parentInput.parentLink === 'workorderextensionprofile' || $scope.parentInput.parentLink === 'mandate') {

                var url;
                for (var isTag in argu['property']) {
                    if (argu['property'][isTag]['name'] == 'REST' && argu['property'][isTag]['value'].indexOf('/') !== -1) {
                        url = argu['property'][isTag]['value'];
                        for (var urlLink in argu['property'][isTag]['value'].split('/')) {
                            if (argu['property'][isTag]['value'].split('/')[urlLink][0].indexOf('{') !== -1 && argu['property'][isTag]['value'].split('/')[urlLink][argu['property'][isTag]['value'].split('/')[urlLink].length - 1].indexOf('}') !== -1) {
                                var replacedName = argu['property'][isTag]['value'].split('/')[urlLink];
                                replacedName = replacedName.replace('{', '');
                                replacedName = replacedName.replace('}', '');
                                if ($(sanitize('[name=' + replacedName + ']')).val()) {
                                    url = url.replace(argu['property'][isTag]['value'].split('/')[urlLink], $scope.replaceWithValue(replacedName, a));
                                } else {
                                    setTimeout(function(name, index) {
                                        if ($(sanitize('[name=' + name + ']')).closest('.anitem').length) {
                                            var _name = $(sanitize('[name=' + name + ']')).closest('.anitem').parent().attr('id');
                                            if ($scope.subSectionfieldData[_name] && $.isArray($scope.subSectionfieldData[_name]) && $scope.subSectionfieldData[_name].length) {

                                                if ($scope.parentInput.parentLink != 'workorder') {
                                                    $scope.subSectionfieldData[_name].splice(1, $scope.subSectionfieldData[_name].length - 1);
                                                    if (Object.keys($scope.subSectionfieldData[_name][$scope.subSectionfieldData[_name].length - 1])) {
                                                        Object.keys($scope.subSectionfieldData[_name][$scope.subSectionfieldData[_name].length - 1]).forEach(function(key) {
                                                            delete $scope.subSectionfieldData[_name][$scope.subSectionfieldData[_name].length - 1][key];
                                                            setTimeout(function() {
                                                                for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
                                                                    $(sanitize('[name=' + _fieldName + ']')).each(function() {
                                                                        $scope.cstmAttrfn(this);
                                                                        $(this).on('change', function() {
                                                                            $scope.cstmAttrfn(this, true)
                                                                        })
                                                                    })
                                                                }
                                                            }, 500)
                                                        })
                                                    }
                                                }

                                            }
                                        }
                                    }, 0, argu.FieldName, a)
                                }
                            }
                        }
                        if ($scope.parentInput.parentLink === 'workorder' || $scope.parentInput.parentLink === 'workorderextensionprofile') {
                            var _multiple = false;
                            for (var mul in argu['Multiple']) {
                                if (argu['Multiple'][mul].displayvalue === 'MULTISELECT') {
                                    _multiple = true;
                                    $(sanitize('select[name=' + _name + ']')).attr('multiple', true);
                                }
                            }
                            var ifMulData = $scope.replaceWithValue(argu['FieldName'], a);
                            var query = {
                                start: 0,
                                count: 500
                            };
                            ifMulData = (ifMulData && ifMulData.indexOf(',') !== -1) ? ifMulData.split(',') : ifMulData;

                            if (url.indexOf('{') === -1 || (url.indexOf('/{SubclientNumber}') != -1)) {

                                if (_multiple && Array.isArray(ifMulData)) {
                                    for (k in ifMulData) {
                                        query = {
                                            start: 0,
                                            count: 500,
                                            search: ifMulData[k]
                                        }


                                        crudReqInForloop({
                                            method: 'GET',
                                            url,
                                            'data': '',
                                            query,
                                            argu
                                        });
                                    }
                                } else {
                                    if (ifMulData) {
                                        query['search'] = ifMulData;

                                        crudReqInForloop({
                                            method: 'GET',
                                            url,
                                            'data': '',
                                            query,
                                            argu
                                        });
                                    }
                                }
                            }
                        } else {
                            var query = {
                                start: 0,
                                count: 500
                            };
                            var ifMulData = $scope.replaceWithValue(argu['FieldName'], a)
                            if (ifMulData) {
                                query['search'] = Array.isArray(ifMulData) ? ifMulData.toString() : ifMulData;

                                crudRequest('GET', url, '', query).then(function(response) {

                                    argu.ChoiceOptions = argu.ChoiceOptions.concat(response.data.data);
                                    argu.ChoiceOptions = $scope.UniqueOptions(argu.ChoiceOptions);
                                    for (var mul in argu['Multiple']) {
                                        if (argu['Multiple'][mul].displayvalue === 'MULTISELECT') {
                                            $(sanitize('select[name=' + _name + ']')).attr('multiple', true);
                                        }
                                    }

                                    // $($('[name='+argu.FieldName+']')[a]).attr('multiple', true);
                                    setTimeout(function() {
                                        $($(sanitize('[name=' + argu.FieldName + ']'))[a]).find('option').each(function() {
                                            if ($(this).attr('value') == '' || $(this).attr('text') == 'select') {
                                                $(this).remove();
                                            }
                                        })
                                        if ('search' in query && query['search'].indexOf(',') !== -1) {
                                            $($(sanitize('[name=' + argu.FieldName + ']'))[a]).val(query['search'].split(','));
                                        } else {
                                            $($(sanitize('[name=' + argu.FieldName + ']'))[a]).val(query['search']);
                                        }
                                        if (!$($(sanitize('[name=' + argu.FieldName + ']'))[$(sanitize('[name=' + argu.FieldName + ']')).length - 1]).val()) {
                                            $($(sanitize('[name=' + argu.FieldName + ']'))[$(sanitize('[name=' + argu.FieldName + ']')).length - 1]).find('option').each(function() {
                                                if ($(this).attr('value') == '' || $(this).attr('text') == 'select') {
                                                    $(this).remove();
                                                }
                                            })
                                            $($(sanitize('[name=' + argu.FieldName + ']'))[$(sanitize('[name=' + argu.FieldName + ']')).length - 1]).val('');
                                        }
                                    }, 100)



                                });
                            }
                        }
                    }
                }
            }
        }
        setTimeout(function() {
            var pageLimitCount = 500;
            if ($scope.parentInput.parentLink === 'workorder') {
                for (var mul in argu['Multiple']) {
                    if (argu['Multiple'][mul].displayvalue === 'MULTISELECT') {
                        $($(sanitize('select[name=' + _name + ']'))[a]).attr('multiple', true).find('option').each(function() {
                            if ($(this).attr('value') == '' || $(this).attr('value').indexOf('undefined') !== -1 || $(this).attr('value').indexOf('? string:') !== -1 || $(this).attr('value').indexOf('? boolean:') !== -1 || $(this).attr('text') == 'select') {

                                // $(this).remove();
                            }
                        })
                        var $value = $scope.replaceWithValue(argu['FieldName'], a);
                        if ($value && $value.indexOf(',') !== -1) {
                            $value = $value.split(',');
                        }
                        $($(sanitize('select[name=' + _name + ']'))[a]).val($value).trigger("change.select2");
                    }
                }
            } else {
                if (argu.Multiple[argu.Multiple.length - 1].displayvalue == 'MULTISELECT') {
                    $(sanitize('select[name=' + _name + ']')).attr('multiple', true);
                    if (multipleVal.length) {
                        if ($(sanitize('select[name=' + _name + ']')).length > 1) {
                            $(sanitize('select[name=' + _name + ']')).each(function(e) {
                                if ($($(sanitize('select[name=' + _name + ']'))[e]).val() != multipleVal[e]) {
                                    $($(sanitize('select[name=' + _name + ']'))[e]).val(multipleVal[e])
                                } else {}
                            })

                        } else {
                            $(sanitize('select[name=' + _name + ']')).val(multipleVal)
                        }

                    } else {

                        if ($(sanitize('select[name=' + _name + ']')).find('option:first').val().match('undefined:undefined') || $('select[name=' + _name + ']').find('option:first').val().match('string:')) {
                            $(sanitize('select[name=' + _name + ']')).find('option:first').remove()
                        } else {

                        }
                    }
                }
            }
            if (argu.Multiple[argu.Multiple.length - 1].displayvalue == 'MULTISELECT') {
                $(sanitize('select[name=' + _name + ']')).attr('multiple', true);
                if (multipleVal.length) {
                    if ($(sanitize('select[name=' + _name + ']')).length > 1) {
                        $(sanitize('select[name=' + _name + ']')).each(function(e) {
                            if ($($(sanitize('select[name=' + _name + ']'))[e]).val() != multipleVal[e]) {
                                $($(sanitize('select[name=' + _name + ']'))[e]).val(multipleVal[e])
                            } else {}
                        })
                    } else {
                        $(sanitize('select[name=' + _name + ']')).val(multipleVal)
                    }

                } else {

                    var url;

                    if ($(sanitize('select[name=' + _name + ']')).find('option:first').val().match('undefined:undefined') || $('select[name=' + _name + ']').find('option:first').val().match('string:')) {
                        // To Remove select old option elements
                        var mySelect = $('select[name=' + _name + ']').find('option:first');
                        var len = mySelect[0].length;
                        if (len) {
                            for (var i = 0; i < len; i++) {
                                mySelect[0].remove(i);
                            }
                        }
                        // $('select[name=' + _name + ']').find('option:first').remove();
                    } else {

                    }
                }
            }
            $("select").each(function($index) {
                $(this).attr('id', $(this).attr('id') + '_' + $index);
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
                                for (u in inputName) {
                                    if ($(sanitize('input[name=' + inputName[u] + ']')).val() != '') {

                                        saveLink = saveLink.replace('{' + inputName[u] + '}', $(sanitize('input[name=' + inputName[u] + ']')).val());
                                    }
                                }

                                $scope.select2Loadmore(details, saveLink);
                            }
                        }

                    }
                }

            })
            $(sanitize('select[name=' + _name + ']')).select2({
                ajax: {
                    url: function(params) {
                        var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
                            '_data': $scope.parentInput.pageInfo.Section,
                            '_name': 'FieldName'
                        } : {
                            '_data': $scope.parentInput.pageInfo,
                            '_name': 'name'
                        };
                        for (k in _link._data) {
                            if (_link._data[k][_link._name] == _name) {
                                //$scope.links = _link._data[k].property[0].value
                                for (var _ln in _link._data[k]['property']) {
                                    if (_link._data[k]['property'][_ln]['name'].indexOf('REST') !== -1) {
                                        $scope.links = _link._data[k].property[_ln].value
                                        if ($scope.links.indexOf('{') !== -1) {
                                            var _url, _id, backUpUrl = $scope.links;
                                            for (var url in $scope.links.split('/')) {
                                                if ($scope.links.split('/')[url].indexOf('{') !== -1) {
                                                    _url = $scope.links.split('/')[url];
                                                    _id = _url.substring($scope.links.split('/')[url].indexOf('{') + 1, $scope.links.split('/')[url].indexOf('}'));
                                                    $this = this
                                                    $('[name=' + _id + ']').change(function() {
                                                        // setValSelect2($this, '');
                                                        delete $scope.fieldData[$($this).attr('name')];
                                                    })
                                                    if ($scope.fieldData[_id]) {
                                                        backUpUrl = backUpUrl.replace(_url, $scope.fieldData[_id]);
                                                    } else {
                                                        backUpUrl = $scope.links;
                                                        break;
                                                    }
                                                }
                                            }
                                            $scope.links = backUpUrl
                                        }
                                    }
                                }
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
                                                        $scope.links = $scope.links.replace($scope.links.split('/')[j], $(sanitize('select[name=' + inputs + ']')).val())
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]) {

                            for (var _sub_name in $scope.parentInput.pageInfo.Subsection) {
                                for (var _sub_name_lvl1 in $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData) {
                                    if ($scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].FieldName === _name) {
                                        $scope.links = $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].property[0].value
                                    }
                                }
                            }
                        }

                        if ($scope.links && $scope.links.indexOf('/') === -1) {
                            for (var _sub_name in $scope.parentInput.pageInfo.Subsection) {
                                for (var _sub_name_lvl1 in $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData) {
                                    if ($scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].FieldName === _name) {
                                        for (var _link in $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].property) {
                                            if ($scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1]['property'][_link]['name'] === 'REST') {
                                                $scope.links = $scope.parentInput.pageInfo.Subsection[_sub_name].subSectionData[_sub_name_lvl1].property[_link]['value'];
                                            }
                                        }
                                    }
                                }
                            }

                            for (var urlLink in $scope.links.split('/')) {
                                if ($scope.links.split('/')[urlLink][0].indexOf('{') !== -1 && $scope.links.split('/')[urlLink][$scope.links.split('/')[urlLink].length - 1].indexOf('}') !== -1) {
                                    var replacedName = $scope.links.split('/')[urlLink];
                                    replacedName = replacedName.replace('{', '');
                                    replacedName = replacedName.replace('}', '');
                                    var indexx_ = $(this).parent().parent().parent().parent().attr('id').split('_')[1];
                                    if ($scope.replaceWithValue(replacedName, indexx_)) {
                                        $scope.links = $scope.links.replace($scope.links.split('/')[urlLink], $scope.replaceWithValue(replacedName, indexx_));
                                    }
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
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Cookie', sanitize(document.cookie)),
                            xhr.withCredentials = true
                    },
                    crossDomain: true,
                    data: function(params) {
                        var query = {
                            start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                            count: pageLimitCount
                        }
                        if (params.term) {
                            query = {
                                search: params.term,
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount,
                                'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                            };
                        }
                        if ($scope.links.indexOf('start') != -1 && $scope.links.indexOf('count') != -1) {
                            query = JSON.stringify({})
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
        }, 5000);
    }

    var crudReqInForloop = function({
        method,
        url,
        data,
        query,
        argu
    }) {
        crudRequest(method, url, data, query).then(function(response) {

            argu.ChoiceOptions = argu.ChoiceOptions.concat(response.data.data);
            argu.ChoiceOptions = $scope.UniqueOptions(argu.ChoiceOptions);
        })
    }



    function updateTextarea(_link, _input, _index) {
        crudRequest("GET", _link, '').then(function(response) {
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
                //$scope.fieldData[$scope.parentInput.pageInfo.Section[_index].FieldName] = {}
                for (k in $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection) {
                    if ($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].FieldName == 'fldName') {
                        $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.splice($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.length - 1, 1)
                    } else if ($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].FieldName == "Configs" && $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].FieldName == 'Name') {}
                }
            }
        })
    }

    for (k in $scope.parentInput.pageInfo.Section) {
        if ($scope.parentInput.pageInfo.Section[k].InputType == 'TextArea' && 'property' in $scope.parentInput.pageInfo.Section[k] && $scope.parentInput.pageInfo.Section[k].property && $scope.parentInput.pageInfo.Section[k].property[0].name == 'REST-WEBFORM') {
            if ($scope.parentInput.pageInfo.Section[k].FieldName in $scope.fieldData) {
                if (Array.isArray($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])) {} else if (($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].match(/</g)) && ($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].match(/>/g))) {

                    if ($scope.parentInput.pageInfo.Section[k].FieldName == 'APEntryConfig' || $scope.parentInput.pageInfo.Section[k].FieldName == 'APGroupConfig') {
                        xmlDoc = angular.copy($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]);

                        var backupData = convertXml2JSon(xmlDoc)

                        delete $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName];
                        $scope.fieldData[Object.keys(backupData)[0]] = backupData[[Object.keys(backupData)][0]];

                        for (var _i in $scope.fieldData[Object.keys(backupData)[0]]) {
                            var tempArr = [];
                            if (!$.isArray($scope.fieldData[Object.keys(backupData)[0]][_i]) && typeof($scope.fieldData[Object.keys(backupData)[0]][_i]) != 'string') {
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
                        $(xmlDoc).children().each(function(e) {
                            $(this).children().each(function(e) {
                                var parentName = $(this).prop("tagName")
                                if ($(this).children().length) {
                                    constuctfromXml[parentName] = constuctfromXmlarr
                                    $(this).children().each(function(e) {
                                        constuctfromXmlObj[$(this).prop("tagName")] = $(this).text()
                                        constuctfromXmlarr.push(constuctfromXmlObj)
                                        constuctfromXmlObj = {}
                                    })
                                } else {
                                    constuctfromXml[parentName] = $(this).text()
                                }
                            })
                        });

                        $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = constuctfromXml
                    }
                } else if (typeof($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]) == 'string' && $scope.parentInput.pageInfo.Section[k].FieldName.toUpperCase() != 'APSELECTIONCRITERIA') {

                    $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = JSON.parse($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])
                    for (j in $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields) {
                        if (Object.values($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0].match(',')) {
                            $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j][Object.keys($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0]] = Object.values($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0].split(',')
                        }

                    }
                } else if (typeof($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]) == 'string' && $scope.parentInput.pageInfo.Section[k].FieldName.toUpperCase() == 'APSELECTIONCRITERIA') {
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

    $scope.fileNameChanged = function(element) {

        var fileToLoad = element.files[0];

        var model = $(element).attr('ng-model');
        model = model.split('[')[0];

        $scope.$apply(function() {
            if ($(element).attr('name') == 'AggrementImage') {
                $scope[model]['AggrementImageName'] = angular.copy(fileToLoad.name);
            } else if ($(element).attr('name') == 'D_Signature') {
                $scope[model]['D_SignatureName'] = angular.copy(fileToLoad.name);
            }
        })

        var fileReader = new FileReader();

        if (fileToLoad) {

            if ((fileToLoad.type == 'image/jpeg') || (fileToLoad.type == 'image/png')) {
                fileReader.onload = function(fileLoadedEvent) {
                    var base64value = fileLoadedEvent.target.result;
                    $scope.$apply(function() {

                        $scope[model][$(element).attr('name')] = angular.copy(base64value);
                    })

                };
                fileReader.readAsDataURL(fileToLoad);

            } else {
                fileReader.onload = function(fileLoadedEvent) {
                    var base64value = fileReader.result;
                    $scope.$apply(function() {
                        $scope[model][$(element).attr('name')] = angular.copy(base64value);
                    })
                };
                fileReader.readAsDataURL(fileToLoad);
            }
        }
    }

    $scope.add_Section = function(x, y, z, z1, z2) {
        delete y[z][x].$$hashKey;
        //$('#'+z1).css({'height':$('#'+z1+'_'+x).outerHeight()+10+'px'})
        y[z][x] = removeEmptyValueKeys(y[z][x])
        if (Object.keys(y[z][x]).length !== 0) {
            y[z].push({})
            setTimeout(function() {

                for (var j in z2.subSectionData) {
                    $scope.setInitval(z2.subSectionData[j], z1.split('_')[1], z1.split('_')[0], x, 'Add')

                }
            }, 100)

        }
        $('.my-tooltip').tooltip('hide');
        //$('#'+z1).animate({scrollTop: ($('#'+z1+'_'+x).outerHeight() * (x + 1 )) + 'px'});
    }

    $scope.addsubSection = function(x, y, z) {
        delete y.$$hashKey;
        $(sanitize('#' + z.FieldName)).css({
            'max-height': $(sanitize('#' + z.FieldName + '_' + x)).outerHeight() + 10 + 'px'
        })
        y = removeEmptyValueKeys(y)
        $scope.subSectionfieldData[z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.FieldName])
        for (var _v in $scope.subSectionfieldData[z.FieldName]) {
            for (var __v in $scope.subSectionfieldData[z.FieldName][_v]) {
                if (typeof($scope.subSectionfieldData[z.FieldName][_v][__v]) === 'object') {
                    var idName = '#' + __v + '_' + _v
                    $(sanitize('#' + z.FieldName + '_' + _v)).find('#' + __v).each(function() {
                        setTimeout(function() {
                            $(sanitize('.secondlevelSec')).css({
                                'max-height': $(sanitize(idName)).outerHeight() + 10 + 'px'
                            })
                        }, 300)
                    })
                }

            }
        }

        if (Object.keys(y).length !== 0) {
            $scope.subSectionfieldData[z.FieldName].push(getSecondLevelVal(z));
            for (var j in z.subSectionData) {
                if ($scope.parentInput.parentLink === 'distributionformatpreference' || $scope.parentInput.parentLink === 'workorder' || $scope.parentInput.parentLink === 'workorderextensionprofile' || $scope.parentInput.parentLink === 'mandate') {



                    for (var sec in $scope.subSectionfieldData[z.FieldName]) {
                        for (var isTag in z.subSectionData[j]['property']) {

                            if (z.subSectionData[j]['property'][isTag].actualvalue == 'REST' || z.subSectionData[j]['property'][isTag].name == 'REST') {

                                $scope.setInitval(z.subSectionData[j], Number(sec))
                            }
                        }
                    }
                } else {
                    if (z.subSectionData[j].ChoiceOptions && z.subSectionData[j].ChoiceOptions.length && (z.subSectionData[j].ChoiceOptions[z.subSectionData[j].ChoiceOptions.length - 1].actualvalue == 'REST')) {
                        $scope.setInitval(z.subSectionData[j])
                    }
                }
            }
            setTimeout(function() {
                for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
                    $(sanitize('[name=' + _fieldName + ']')).each(function() {
                        $scope.cstmAttrfn(this);
                        $(this).on('change', function() {
                            $scope.cstmAttrfn(this, true)
                        })
                    })
                }
                $scope.activatePicker()
            }, 500)
        }
        $(sanitize('#' + z.FieldName)).animate({
            scrollTop: ($(sanitize('#' + z.FieldName + '_' + x)).outerHeight() * (x + 1)) + 'px'
        });
        $('.my-tooltip').tooltip('hide');
    }

    $scope.addsecondlevelSection = function(x, y, z, parentIndex, flag) {
        delete y.$$hashKey;
        /*$('#' + z.ParentName + '_' + parentIndex).find('.secondlevelSec').each(function () {
        	$(this).css({
        		'height': $('#' + z.FieldName + '_' + x).outerHeight() + 10 + 'px'
        	})
        })*/

        y = removeEmptyValueKeys(y);
        if (parentIndex !== 'no') {
            $scope.subSectionfieldData[z.ParentName][parentIndex][z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.ParentName][parentIndex][z.FieldName]);
            if (!flag) {
                if (Object.keys(y).length !== 0) {
                    $scope.subSectionfieldData[z.ParentName][parentIndex][z.FieldName].push({})
                    setTimeout(function() {
                        $scope.activatePicker()
                    }, 500)
                }
            }

            if ($scope.parentInput.parentLink == 'partyserviceassociations') {
                setTimeout(function() {
                    $("select").each(function() {
                        var details = $(this).attr('details_field') ? JSON.parse($(this).attr('details_field')) : {};
                        if (Object.keys(details).length) {
                            //select_fn(details, this);
                            setTimeout(select_fn, 100, details, this);
                        }
                    })
                }, 100)
            } else {
                for (var j in z.secondlevelSectionData) {
                    for (var sec in $scope.secondLevelSectionfieldData[z.FieldName]) {
                        for (var isTag in z.secondlevelSectionData[j]['property']) {
                            if (z.secondlevelSectionData[j]['property'][isTag].actualvalue == 'REST' || z.secondlevelSectionData[j]['property'][isTag].name == 'REST') {
                                $scope.setInitval(z.secondlevelSectionData[j], Number(sec), '', '', '', Number(parentIndex));
                            }
                        }
                    }
                }
            }

            setTimeout(function() {
                for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
                    $(sanitize('[name=' + _fieldName + ']')).each(function() {
                        $scope.cstmAttrfn(this);
                        $(this).on('change', function() {
                            $scope.cstmAttrfn(this, true)
                        })
                    })
                }
                $(sanitize('#' + z.ParentName + '_' + parentIndex)).find('.secondlevelSec').each(function() {
                    $(this).css({
                        'max-height': $(sanitize('#' + z.FieldName + '_' + x)).outerHeight() + 10 + 'px'
                    })
                    $(this).animate({
                        scrollTop: ($(sanitize('#' + z.FieldName + '_' + x)).outerHeight() * (x + 1)) + 'px'
                    });
                });
            }, 500)
        } else {
            $scope.subSectionfieldData[z.ParentName][z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.ParentName][z.FieldName]);
            if (!flag) {
                if (Object.keys(y).length !== 0) {
                    $scope.subSectionfieldData[z.ParentName][z.FieldName].push({})
                    setTimeout(function() {
                        $scope.activatePicker()
                    }, 500)
                }
            }

            if ($scope.parentInput.parentLink == 'partyserviceassociations') {
                setTimeout(function() {
                    $("select").each(function() {
                        var details = $(this).attr('details_field') ? JSON.parse($(this).attr('details_field')) : {};
                        if (Object.keys(details).length) {
                            select_fn(details, this);
                        }
                    })
                }, 100)
            } else {
                for (var j in z.secondlevelSectionData) {
                    for (var sec in $scope.secondLevelSectionfieldData[z.FieldName]) {
                        for (var isTag in z.secondlevelSectionData[j]['property']) {
                            if (z.secondlevelSectionData[j]['property'][isTag].actualvalue == 'REST' || z.secondlevelSectionData[j]['property'][isTag].name == 'REST') {
                                $scope.setInitval(z.secondlevelSectionData[j], Number(sec), '', '', '');
                            }
                        }
                    }
                }
            }
            setTimeout(function() {
                for (var _fieldName in $scope.parentInput.pageInfo.cstmAttr) {
                    $(sanitize('[name=' + _fieldName + ']')).each(function() {
                        $scope.cstmAttrfn(this);
                        $(this).on('change', function() {
                            $scope.cstmAttrfn(this)
                        })
                    })
                }
                $(sanitize('#' + z.ParentName)).find('.secondlevelSec').each(function() {
                    $(this).css({
                        'max-height': $(sanitize('#' + z.FieldName + '_' + x)).outerHeight() + 10 + 'px'
                    })
                    $(this).animate({
                        scrollTop: ($(sanitize('#' + z.FieldName + '_' + x)).outerHeight() * (x + 1)) + 'px'
                    });
                });
            }, 500)
        }
        $('.my-tooltip').tooltip('hide');
    } 

    $scope.removesecondlevelSection = function(x, y, z, parentIndex) {
        if (parentIndex === 'no') {
            if ($scope.subSectionfieldData[z.ParentName][z.FieldName].length > 1) {
                $scope.subSectionfieldData[z.ParentName][z.FieldName].splice(x, 1)
            }
        } else {
            if ($scope.subSectionfieldData[z.ParentName][parentIndex][z.FieldName].length > 1) {
                $scope.subSectionfieldData[z.ParentName][parentIndex][z.FieldName].splice(x, 1)
                if ($scope.parentInput.parentLink === 'cutoffs' && $scope.parentInput.Operation === 'Edit') {
                    $scope.custmalerts = [{
                        type: 'warning',
                        msg: 'Deleting the Cut off time will affect the attached MOP'
                    }];
                }
            }
        }
        $('.my-tooltip').tooltip('hide');
    }

    /* $scope.addsubSection = function(x,y,z){
    	delete y.$$hashKey;
    	$('#'+z.FieldName).css({'height':$('#'+z.FieldName+'_'+x).outerHeight()+10+'px'})
    	y = removeEmptyValueKeys(y)
    	$scope.subSectionfieldData[z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.FieldName])
    		if(Object.keys(y).length !== 0){
    			$scope.subSectionfieldData[z.FieldName].push({})
    			//setTimeout(function(){
    				for(var j in z.subSectionData){
    					if(z.subSectionData[j].ChoiceOptions && z.subSectionData[j].ChoiceOptions[z.subSectionData[j].ChoiceOptions.length-1].actualvalue == 'REST'){
    						$scope.setInitval(z.subSectionData[j])												
    					}					
    			}
    		//	},500)
    			
    		}
    	$('#'+z.FieldName).animate({scrollTop: ($('#'+z.FieldName+'_'+x).outerHeight() * (x + 1 )) + 'px'});
    	
    } */

    $scope.toRuleBuilder = function(ss, index) {

        $stateParams.input.fieldData = ss;
        var LHSInObj = {
            "type": "ALL",
            "pane": "CONDITION",
            "context": "LHS",
            "code": "string",
            "workflow": ss.WorkFlowCode,
            "implType": "XPATH"
        }

        $http({
            url: BASEURL + '/rest/v2/rulebuilders/lhs/fields?start=0&count=200',
            method: "POST",
            data: LHSInObj,
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data.ruleVariables) {
                sessionStorage.RULE_LHS_field = stringToHex(JSON.stringify(data.ruleVariables));
            }

            var ActionLHSInObj = {
                "type": "ALL",
                "pane": "ACTION",
                "context": "LHS",
                "code": "string",
                "workflow": ss.WorkFlowCode,
                "implType": "XPATH"
            }
            if (ss.RuleType != "" || ss.RuleSubType != "") {


                if (ss.RuleType) {
                    ActionLHSInObj['RuleType'] = ss.RuleType
                }
                if (ss.RuleSubType) {
                    ActionLHSInObj['RuleSubType'] = ss.RuleSubType
                }
            }
            $http({
                url: BASEURL + '/rest/v2/rulebuilders/lhs/fields?start=0&count=200',
                method: "POST",
                data: ActionLHSInObj,
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                if (data.ruleVariables) {
                    sessionStorage.ACTION_LHS_field = stringToHex(JSON.stringify(data.ruleVariables));
                }

                var AllOperatorsObj = {
                    "workflow": ss.WorkFlowCode,
                    "implType": "FORMULA,OPERATOR"
                }

                $http({
                    url: BASEURL + '/rest/v2/rulebuilders/alloperators?start=0&count=200',
                    method: "POST",
                    data: AllOperatorsObj,
                }).then(function onSuccess(response) {
                    // Handle success
                    var data = response.data;
                    var status = response.status;
                    var statusText = response.statusText;
                    var headers = response.headers;
                    var config = response.config;

                    if (data.ruleVariables) {
                        sessionStorage.BROPERATORS = stringToHex(JSON.stringify(data.ruleVariables));
                    }

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
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.checkModule = function(pLink, fields) {}

    $scope.setisreq = function(argu) {
        for (j in argu.$error.required) {
            if (argu.$error.required[j].$error.required) {
                $('.panel').find('#' + argu.$error.required[j].$name).each(function() {
                    var _par = $(this).closest('.panel-collapse')
                    if (!$(_par).hasClass('in')) {
                        $(_par).collapse('show')
                            //$(this).parentsUntil('.panel')
                    }
                })
            }
        }
    }

    $scope.checkmultiselect = function(argu) {
        if (isIE) {
            $('.appendSelect2').each(function() {
                if ($(this).attr('multiple') == 'multiple') {
                    if (!argu[$(this).attr('name')].$invalid) {
                        if ($(this).val().length) {
                            $(this).attr('required', '')
                        } else {
                            $(this).attr('required', true)

                        }
                    }
                }
            })
        }
    }

    $(document).ready(function() {
        $('#changesLostModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0)
        });
        $('#changesLostModal').on('hidden.bs.modal', function(e) {
            $scope.fromCancelClick = false;
            $scope.breadCrumbClicked = false;
        })
        $('#draftOverWriteModal').on('shown.bs.modal', function(e) {
            $('body').css('padding-right', 0)
            $scope.disableSubmit = false;
            $(".alert-danger").hide();

        })
        $('#draftOverWriteModal').on('hidden.bs.modal', function(e) {

            setTimeout(function() {
                $scope.updateEntity = false;
            }, 100)
        })
    })

    $scope.setInitvals = function(argu, index) {
        setTimeout(function() {
            var links, mulSelect, editcreateTag;
            for (var lnk in argu['property']) {
                if (argu['property'][lnk].name.indexOf('REST') !== -1) {
                    links = argu['property'][lnk].value
                }
            }
            for (var lnk in argu['Multiple']) {
                if (argu['Multiple'][lnk].displayvalue === 'MULTISELECT') {
                    mulSelect = true;
                } else if (argu['Multiple'][lnk].displayvalue === 'CREATETAG') {
                    editcreateTag = true;
                }
            }
            var ifMulData = $scope.replaceWithValue(argu['FieldName'], index);
            if (links && links.indexOf('/')) {
                for (var urlLink in links.split('/')) {
                    if (links.split('/')[urlLink][0].indexOf('{') !== -1 && links.split('/')[urlLink][links.split('/')[urlLink].length - 1].indexOf('}') !== -1) {
                        var replacedName = links.split('/')[urlLink];
                        replacedName = replacedName.replace('{', '');
                        replacedName = replacedName.replace('}', '');
                        var indexx_ = $(this).parent().parent().parent().parent().attr('id') ? $(this).parent().parent().parent().parent().attr('id').split('_')[1] : '';
                        if ($scope.replaceWithValue(replacedName, indexx_)) {
                            links = links.replace(links.split('/')[urlLink], $scope.replaceWithValue(replacedName, indexx_));
                        }
                    }
                }

                var query = {
                    start: 0,
                    count: 500
                };

                if (ifMulData) {
                    //query['search'] = Array.isArray(ifMulData) ? ifMulData.toString() : ifMulData;
                    crudRequest('GET', links, '', query).then(function(response) {
                        argu.ChoiceOptions = response.data.data;

                        if (mulSelect) {
                            setTimeout(function() {
                                if (index >= 0) {

                                } else {
                                    $(sanitize('[name=' + argu.FieldName + ']')).attr('multiple', true);
                                    $(sanitize('[name=' + argu.FieldName + ']')).find('option').each(function() {
                                        if ($(this).attr('value') == '' || $(this).attr('text') == 'select') {
                                            // To Remove select old option elements
                                            var mySelect = $(this);
                                            var len = mySelect[0].length;
                                            if (len) {
                                                for (var i = 0; i < len; i++) {
                                                    mySelect[0].remove(i);
                                                }
                                            }
                                            // $(this).remove();
                                        }
                                    })
                                    var val = (ifMulData && ifMulData.indexOf(',') !== -1) ? ifMulData.split(',') : ifMulData
                                    $(sanitize('[name=' + argu.FieldName + ']')).val(val).trigger("change.select2");
                                }

                            }, 0)
                        }
                    });
                }
                /*if ($scope[$('#' + argu.FieldName).attr('ng-model').split('[')[0]][argu.FieldName]) {
                    var _querys = {
                        search: $scope[$('#' + argu.FieldName).attr('ng-model').split('[')[0]][argu.FieldName],
                        start: 0,
                        count: 500
                    }
                    crudRequest('GET', links, '', _querys).then(function (response) {
                        if (response.data.data.length == 0) {
                            $scope[$('#' + argu.FieldName).attr('ng-model').split('[')[0]][argu.FieldName] = '';
                        }
                        argu.ChoiceOptions = response.data.data
                    });
                }*/

                var pageLimitCount = 500;
                $(sanitize('select[name=' + argu.FieldName + ']')).select2({
                    ajax: {
                        url: function(params) {
                            return BASEURL + "/rest/v2/" + links
                        },
                        type: 'GET',
                        headers: {
                            "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                            "source-indicator": configData.SourceIndicator,
                            "Content-Type": "application/json"
                        },
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
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            }
                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                    count: pageLimitCount,
                                    'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                                };
                            }

                            if (argu.property[0].value.indexOf('start') != -1 && argu.property[0].value.indexOf('count') != -1) {
                                query = JSON.stringify({})
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
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },
                        cache: true
                    },
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    multiple: mulSelect,
                    allowClear: true,
                    closeOnSelect: true,
                    tags: editcreateTag,
                    createTag: function(tag) {
                        return {
                            id: tag.term,
                            text: tag.term,
                            tag: editcreateTag
                        };
                    }
                })
            } else {
                if (mulSelect) {
                    setTimeout(function() {
                        if (index >= 0) {

                        } else {
                            $(sanitize('[name=' + argu.FieldName + ']')).attr('multiple', true);
                            $(sanitize('[name=' + argu.FieldName + ']')).find('option').each(function() {
                                if ($(this).attr('value') == '' || $(this).attr('text') == 'select') {
                                    // To Remove select old option elements
                                    var mySelect = $(this);
                                    var len = mySelect[0].length;
                                    if (len) {
                                        for (var i = 0; i < len; i++) {
                                            mySelect[0].remove(i);
                                        }
                                    }
                                    // $(this).remove();
                                }
                            })
                            var val = (ifMulData && ifMulData.indexOf(',') !== -1) ? ifMulData.split(',') : ifMulData
                            $(sanitize('[name=' + argu.FieldName + ']')).val(val).trigger("change.select2");
                        }

                    }, 0)
                }
                $(sanitize('select[name=' + argu.FieldName + ']')).select2({
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    multiple: mulSelect,
                    allowClear: true,
                    closeOnSelect: true,
                    tags: editcreateTag,
                    createTag: function(tag) {
                        return {
                            id: tag.term,
                            text: tag.term,
                            tag: editcreateTag
                        };
                    }
                })
            }
        }, 0)
    }

    $scope.setInitsubval = function(argu, parentArgu) {

        var isMultiSelect, isRest = false;
        for (var multiSelect in argu['Multiple']) {
            if (argu['Multiple'][multiSelect]['displayvalue'] === "MULTISELECT") {
                isMultiSelect = argu['Multiple'][multiSelect]['actualvalue']
            } else if (argu['Multiple'][multiSelect]['actualvalue'] === "REST") {
                isRest = true;
            }
        }
        // isMultiSelect = false;
        setTimeout(function() {
            if (isMultiSelect) {
                $(sanitize('select[name=' + argu.FieldName + ']')).attr('multiple', isMultiSelect);
                if ($scope['fieldData'][parentArgu['FieldName']]) {
                    for (var itterateVal in $scope['fieldData'][parentArgu['FieldName']]) {
                        if (itterateVal === argu.FieldName) {
                            $(sanitize('select[name=' + argu.FieldName + ']')).val($scope['fieldData'][parentArgu['FieldName']][itterateVal].split(',')).trigger("change.select2");
                        }
                    }
                }
                setTimeout(function() {
                    if (!$(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').text() || $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').text() === 'Select') {

                        if (Array.isArray($(sanitize('select[name=' + argu.FieldName + ']')).val())) {
                            for (var _tvalue in $(sanitize('select[name=' + argu.FieldName + ']')).val()) {
                                if (!$(sanitize('select[name=' + argu.FieldName + ']')).val()[_tvalue] || $(sanitize('select[name=' + argu.FieldName + ']')).val()[_tvalue].match('object:') || $(sanitize('select[name=' + argu.FieldName + ']')).val()[_tvalue].match('undefined:')) {
                                    // To Remove select old option elements
                                    var mySelect = $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child');
                                    var len = mySelect[0].length;
                                    if (len) {
                                        for (var i = 0; i < len; i++) {
                                            mySelect[0].remove(i);
                                        }
                                    }
                                    // $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').remove();
                                    $(sanitize('select[name=' + argu.FieldName + ']')).val('').trigger("change.select2");
                                }
                            }
                        }
                        if (!$(sanitize('select[name=' + argu.FieldName + ']')).val() || !$(sanitize('select[name=' + argu.FieldName + ']')).val().length) {
                            // To Remove select old option elements
                            var mySelect = $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child');
                            var len = mySelect[0].length;
                            if (len) {
                                for (var i = 0; i < len; i++) {
                                    mySelect[0].remove(i);
                                }
                            }
                            //$(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').remove();
                            $(sanitize('select[name=' + argu.FieldName + ']')).val('').trigger("change.select2");
                        } else if ($scope.parentInput.Operation == 'Add') {
                            // To Remove select old option elements
                            var mySelect = $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child');
                            var len = mySelect.length;
                            if (len) {
                                for (var i = 0; i < len; i++) {
                                    mySelect[0].remove(i);
                                }
                            }
                            // $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').remove();
                            $(sanitize('select[name=' + argu.FieldName + ']')).val('').trigger("change.select2");
                        }

                        if ($(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').text() === 'Select') {

                            // To Remove select old option elements
                            var mySelect = $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child');
                            var len = mySelect.length;
                            if (len) {
                                for (var i = 0; i < len; i++) {
                                    mySelect[0].remove(i);
                                }
                            }
                            // $(sanitize('select[name=' + argu.FieldName + ']')).find('option:first-child').remove();
                            $(sanitize('select[name=' + argu.FieldName + ']')).trigger("change.select2");
                        }

                    }
                }, 0)
            }

            var pageLimitCount = 500;
            var url_link = JSON.parse($(sanitize('select[name=' + argu.FieldName + ']')).attr('detailsofsubfield'))
            if (isRest) {
                $(sanitize('select[name=' + argu.FieldName + ']')).select2({
                    ajax: {
                        url: function(params) {
                            for (var url in url_link['property']) {
                                if (url_link['property'][url]['name'] === 'REST') {
                                    $scope.subLinks_ = url_link['property'][url]['value']
                                }
                            }
                            return BASEURL + "/rest/v2/" + $scope.subLinks_
                        },
                        type: 'GET',
                        headers: {
                            "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                            "source-indicator": configData.SourceIndicator,
                            "Content-Type": "application/json"
                        },
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function(xhr) {

                            xhr.setRequestHeader('Cookie', sanitize(document.cookie)), xhr.withCredentials = true
                        },
                        crossDomain: true,
                        data: function(params) {
                            var query = {
                                start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                count: pageLimitCount
                            }
                            if (params.term) {
                                query = {
                                    search: params.term,
                                    start: params.page * pageLimitCount ? params.page * pageLimitCount : 0,
                                    count: pageLimitCount,
                                    'isCaseSensitive' : GlobalService.isCaseSensitiveval || '0'
                                };
                            }
                            if ($scope.subLinks_ && $scope.subLinks_.indexOf('start') != -1 && $scope.subLinks_.indexOf('count') != -1) {
                                query = JSON.stringify({})
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
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },
                        cache: true
                    },
                    placeholder: $filter('translate')('Placeholder.Select'),
                    minimumInputLength: 0,
                    allowClear: true
                }).trigger("change.select2");
            } else {
                $(sanitize('select[name=' + argu.FieldName + ']')).find('option[value = ""]').remove();
                $(sanitize('select[name=' + argu.FieldName + ']')).select2({
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true,
                    multiple: isMultiSelect
                }).trigger("change.select2")
            }

        }, 0)
    }

    $scope.replaceWithValue = function(argu, prevSecIdIndex, parentIndex) {
        var flag = false;
        for (var section in $scope.parentInput.pageInfo['Section']) {
            if ($scope.parentInput.pageInfo['Section'][section]['FieldName'] === argu) {
                flag = true;
                return $scope.fieldData[argu];
            }
        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['Subsection']) {
                for (var subsectionSec in $scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData']) {
                    if ($scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName'] === argu) {
                        if ($scope.subSectionfieldData[$scope.parentInput.pageInfo['Subsection'][subsection]['FieldName']][prevSecIdIndex] && argu in $scope.subSectionfieldData[$scope.parentInput.pageInfo['Subsection'][subsection]['FieldName']][prevSecIdIndex]) {
                            flag = true;
                            return $scope.subSectionfieldData[$scope.parentInput.pageInfo['Subsection'][subsection]['FieldName']][prevSecIdIndex][argu];
                        }
                    }
                }
            }

        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['secondLevelsection']) {
                for (var subsectionSec in $scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData']) {
                    if ($scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec]['FieldName'] === argu) {
                        if ($scope.subSectionfieldData[$scope.parentInput.pageInfo['secondLevelsection'][subsection]['ParentName']][parentIndex][$scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName']][prevSecIdIndex] && argu in $scope.subSectionfieldData[$scope.parentInput.pageInfo['secondLevelsection'][subsection]['ParentName']][parentIndex][$scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName']][prevSecIdIndex]) {
                            flag = true;
                            return $scope.subSectionfieldData[$scope.parentInput.pageInfo['secondLevelsection'][subsection]['ParentName']][parentIndex][$scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName']][prevSecIdIndex][argu];
                        }
                    }
                }
            }

        }
        if (!flag) {
            for (var section in $scope.fieldAddedDetails['Section']) {
                if ($scope.fieldAddedDetails['Section'][section]['FieldName'] === argu) {
                    flag = true;
                    return $scope.replaceFieldData[argu];
                }
            }

        }
        if (!flag) {
            for (var subsection in $scope.fieldAddedDetails['Subsection']) {
                for (var subsectionSec in $scope.fieldAddedDetails['Subsection'][subsection]['subSectionData']) {
                    if ($scope.fieldAddedDetails['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName'] === argu) {
                        if ($scope.subfieldedData[$scope.fieldAddedDetails['Subsection'][subsection]['FieldName']][prevSecIdIndex] && argu in $scope.subfieldedData[$scope.fieldAddedDetails['Subsection'][subsection]['FieldName']][prevSecIdIndex]) {
                            return $scope.subfieldedData[$scope.fieldAddedDetails['Subsection'][subsection]['FieldName']][prevSecIdIndex][argu];
                        }
                    }
                }
            }

        }
    }
    var result = [];
    $scope.UniqueOptions = function(oldVal) {

        $.each(oldVal, function(i, e) {
            var matchingItems = $.grep(result, function(item) {
                return item.actualvalue === e.actualvalue && item.displayvalue === e.displayvalue;
            });
            if (matchingItems.length === 0) {
                if (!e.name)
                    result.push(e);
            }
        });
        return result
    }
    $scope.removeEmptyOption = function(argu) {
        setTimeout(function() {
            if ($(argu).attr('value') == '' || $(argu).text() === 'select' || $(argu).text() === '') {
                // To Remove select old option elements
                var mySelect = $(argu);
                var len = mySelect[0].length;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        mySelect[0].remove(i);
                    }
                }
                // $(argu).remove();
            }
        }, 100)
    }

    $scope.LeadingZero = function(argu) {
        $(argu.currentTarget).addClass('LeadingZero')
        if ($(argu.currentTarget).val()) {

        }
    }

    var set_cstm_attr = function(value, cstmProp, flag = false) {

        value = value ? value.trim() : value;
        if (value in cstmProp) {
            Object.keys(cstmProp[value]).forEach(function(elem) {
                (function(elem, prop) {

                    var elemIndex, index = -1,
                        elemId;
                    if ($('[name=' + elem + ']').closest('.anitem').length) {
                        elemIndex = Number($('[name=' + elem + ']').closest('.anitem').attr('id').split('_')[1]);
                        elemId = $('[name=' + elem + ']').closest('.anitem').attr('id').split('_')[0];

                    }
                    if (index > -1 && elemIndex > -1) {
                        set_default_attr($('[name=' + elem + ']')[index], cstmProp[value][elem], flag);
                    } else {
                        $('[name=' + elem + ']').each(function(i) {
                            set_default_attr(this, cstmProp[value][elem], flag, i);
                            if (elemId) {
                                hide_section(elemId, Object.keys(cstmProp[value]), flag);
                            }
                        })
                    }
                }(elem, cstmProp[value][elem]));
            })
        } else {
            for (prop in cstmProp) {
                Object.keys(cstmProp[prop]).forEach(function(elem) {
                    (function(elem) {

                        var elemIndex, index = -1;
                        if ($('[name=' + elem + ']').closest('.anitem').length) {
                            elemIndex = Number($('[name=' + elem + ']').closest('.anitem').attr('id').split('_')[1]);
                        }
                        if (index > -1 && elemIndex > -1) {

                            set_default_attr($('[name=' + elem + ']')[index], get_field_details(elem), flag);
                        } else {
                            $('[name=' + elem + ']').each(function(i) {
                                set_default_attr(this, get_field_details(elem), flag, i);
                            })
                        }
                    }(elem));
                })
            }
        }
        if (flag) {
            setTimeout(function() {
                $("select").each(function() {
                    var details = $(this).attr('details_field') ? JSON.parse($(this).attr('details_field')) : {};
                    if (Object.keys(details).length) {
                        select_fn(details, this);
                    }
                })
            }, 100)
        }
    }




    /** Dynamic Functionality */

    function hideSection(cstmAttr, $index, val) {
        var flag;
        for (var subsection in $scope.parentInput.pageInfo['Subsection']) {
            for (var subsectionSec in $scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData']) {
                if ($.inArray($scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName'], Object.keys(cstmAttr)) !== -1) {
                    for (var opt in cstmAttr[$scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName']]) {
                        if (opt.toLowerCase() === 'visible') {
                            if (cstmAttr[$scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName']][opt] === false) {
                                flag = true;
                            } else {
                                flag = false;
                                break;
                            }
                        }
                    }
                } else {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                $(sanitize('#' + $scope.parentInput.pageInfo['Subsection'][subsection]['FieldName'])).parent().css({
                    display: 'none !important'
                });
            } else {
                $(sanitize('#' + $scope.parentInput.pageInfo['Subsection'][subsection]['FieldName'])).parent().css({
                    display: ''
                })
            }
        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['secondLevelsection']) {
                if ($scope.parentInput.pageInfo['secondLevelsection'][subsection]['ParentName'] === val) {
                    for (var subsectionSec in $scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData']) {
                        if ($.inArray($scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec]['FieldName'], Object.keys(cstmAttr)) !== -1) {
                            if (cstmAttr[$scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec]['FieldName']]['Visible'] === false) {
                                flag = true;
                            } else {
                                flag = false;
                                break;
                            }
                        } else {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        $(sanitize('#' + $scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName'])).parent().css({
                            display: 'none'
                        });
                        if ($scope.parentInput.pageInfo['secondLevelsection'][subsection]['MaxOccarance'] === -1 || $scope.parentInput.pageInfo['secondLevelsection'][subsection]['MaxOccarance'] > 1) {
                            $scope.subSectionfieldData[val][$scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName']] = [{}];
                        } else if ($scope.parentInput.pageInfo['secondLevelsection'][subsection]['MaxOccarance'] !== -1 && $scope.parentInput.pageInfo['secondLevelsection'][subsection]['MaxOccarance'] <= 1) {
                            $scope.subSectionfieldData[val][$scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName']] = {};
                        }
                    } else {
                        $(sanitize('#' + $scope.parentInput.pageInfo['secondLevelsection'][subsection]['FieldName'])).parent().css({
                            display: ''
                        })
                    }
                }
            }

        }
    }

    function setDefaultAttr(_is, argu, flag) {
        for (var opt in argu) {
            if (opt.toLowerCase() === 'enabled') {
                $(_is).attr('readonly', !argu[opt])
                $(_is).attr('disabled', !argu[opt])
            } else if (opt.toLowerCase() === 'visible') {
                if (argu[opt]) {
                    $(_is).parent().attr('ng-hide', false).removeClass('ng-hide')
                    $(_is).parent().prev().attr('ng-hide', false).removeClass('ng-hide')
                } else {
                    $(_is).parent().attr('ng-hide', true).addClass('ng-hide')
                    $(_is).parent().prev().attr('ng-hide', true).addClass('ng-hide');
                }
                if (flag) {
                    $scope.clear_value(_is);
                }
            } else if (opt.toLowerCase() === 'notnull' || opt.toLowerCase() === 'mandatory') {
                if (argu[opt]) {
                    $(_is).parent().prev().find('span').attr('ng-hide', true).addClass('ng-hide');
                } else {
                    $(_is).parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                }
                $(_is).attr('required', !argu[opt])
            } else if (opt.toLowerCase() === 'createtag') {
                /*var updatesDetails;
                if(argu[opt] === false){
                    updatesDetails = $(_is).attr('detailsoffield') ? JSON.parse($(_is).attr('detailsoffield')) : {};
                    if(updatesDetails['Multiple']){
                        for(var mul in updatesDetails['Multiple']){
                            if(updatesDetails['Multiple'][mul]['displayvalue'].toLowerCase() === 'createtag'){
                                updatesDetails['Multiple'][mul]['actualvalue'] = argu[opt];
                            }
                        }
                    }
                } else if(argu[opt]){
                    updatesDetails = $(_is).attr('detailsoffield') ? JSON.parse($(_is).attr('detailsoffield')) : {};
                }
                setTimeout(select_fn, 100, updatesDetails, _is);*/
            }
        }
    }

    $scope.clear_value = function(_this) {
        if ($(_this).attr('name') in $scope.replaceFieldData) {
            delete $scope.replaceFieldData[$(_this).attr('name')];
            $(_this).val('');
        }
        /*$(_this).val('').trigger('change.select2');
        $(_this).trigger('change');
        var index;
        if($(_this).closest('.anitem').length && $(_this).closest('.anitem').attr('id').indexOf('_') !== -1){
            index = Number($(_this).closest('.anitem').attr('id').split('_')[1]);
        }
        var val = $scope.find_value_1($(_this).attr('name'), index);
        if(val && val[$(_this).attr('name')]){
            delete val[$(_this).attr('name')];
        }*/

    }

    $scope.get_field_details = function(argu) {
        var flag = false;
        for (var section in $scope.parentInput.pageInfo['Section']) {
            if ($scope.parentInput.pageInfo['Section'][section]['FieldName'] === argu) {
                flag = true;
                return $scope.parentInput.pageInfo['Section'][section];
            }
        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['Subsection']) {
                for (var subsectionSec in $scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData']) {
                    if ($scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName'] === argu) {
                        return $scope.parentInput.pageInfo['Subsection'][subsection]['subSectionData'][subsectionSec];
                    }
                }
            }

        }
        if (!flag) {
            for (var section in $scope.replaceField['Section']) {
                if ($scope.replaceField['Section'][section]['FieldName'] === argu) {
                    flag = true;
                    return $scope.replaceField['Section'][section];
                }
            }
        }
        if (!flag) {
            for (var subsection in $scope.replaceField['Subsection']) {
                for (var subsectionSec in $scope.replaceField['Subsection'][subsection]['subSectionData']) {
                    if ($scope.replaceField['Subsection'][subsection]['subSectionData'][subsectionSec]['FieldName'] === argu) {
                        return $scope.replaceField['Subsection'][subsection]['subSectionData'][subsectionSec];
                    }
                }
            }

        }
        if (!flag) {
            for (var subsection in $scope.parentInput.pageInfo['secondLevelsection']) {
                for (var subsectionSec in $scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData']) {
                    if ($scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec]['FieldName'] === argu) {
                        return $scope.parentInput.pageInfo['secondLevelsection'][subsection]['secondlevelSectionData'][subsectionSec];
                    }
                }
            }

        }
    }

    var update_query = function(argu) {
        var indices = [];
        var query = angular.copy(argu);
        for (var i = 0; i < query.length; i++) {
            if (query[i] === "$") {
                var index = {}
                if (query[i + 1] === "{") {
                    index.firstIndex = i + 2;
                    for (var j = i + 1; j < query.length; j++) {
                        if (query[j] === "}") {
                            index.lastIndex = j;
                            break;
                        }
                    }
                }
                indices.push(index);
            }
        }
        var _kValue = angular.copy(query);
        for (var index in indices) {
            var reqId = query.substring(indices[index].firstIndex, indices[index].lastIndex)
            if ($scope.fieldData[reqId]) {
                _kValue = _kValue.replace('${' + reqId + '}', $scope.fieldData[reqId]);
            } else {
                _kValue = '';
                break;
            }
        }
        return _kValue;
    }
    $scope.CompareDates= function(){
        if($scope.fieldData['EffectiveFromDate'] > $scope.fieldData['EffectiveTillDate']){
            if($scope.fieldData['EffectiveTillDate']){
                return true;
            }else{
                return false;
            }
        }
    }
});
