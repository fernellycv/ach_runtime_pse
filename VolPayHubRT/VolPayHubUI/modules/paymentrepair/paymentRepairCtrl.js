angular.module('VolpayApp').controller('paymentRepairCtrl', function($scope, $state, $http, httpCall, GlobalService, $filter, errorservice, $rootScope, $interval, EntityLockService) {

    //$filter('hex2a')($scope.tempVal.Template)
    $scope.input = $state.params.input;
    /** Idletimeout Listener */
    $rootScope.$on("MyEvent", function(evt, data) {
        $("#changesLostModal").modal("show");
    })
    $rootScope.$on("MyEventforEditIdleTimeout", function(evt, data) {
        $(window).off("mousemove keydown click");
        $interval.cancel(findEvent);
    })
    /** Idletimeout Listener */

    /** Idletimeout clock timer block*/
    var findEvent;
    var secondfindEvent;
    $scope.count = 0;
    $scope.seccount = 10;   
    var editTimeoutCounter = sessionStorage.entityEditTimeout * 60;
    //editTimeoutCounter = 15;
    $scope.IdleTimerStart = function () {
        $scope.count = 0;
        $scope.seccount = 10; 
        $scope.findIdleTime(); // call this method in the Modal popup triggers
    };
    $scope.IdleTimeStop = function() {
        $scope.count = 0;
        $scope.seccount = 10;   
        $scope.stopIdleTimer();
        $scope.stopsecondIdleTimer();
        $(window).off( "mousemove keydown click" );
    };
    
    $scope.findIdleTime = function() {
        findEvent = $interval(function() {
            $(window).off().on("mousemove keydown click", function() { // find the window event
                //if( $("#overRide").data('bs.modal').isShown ) {
                    // $scope.findIdleTime();
                    // $scope.stopIdleTimer();
                    $scope.count = 0;
                //} 
            });
            $scope.count += 1;
            if ($scope.count === editTimeoutCounter) {
                    $scope.unlockActionEntity();
                    $scope.stopIdleTimer(); 
                    // $scope.callIdleTime();
                    // hide the modal popup
                   // $('#overRide').modal('hide');
            }
        }, 1000);
    };

    $scope.callIdleTime = function() {
        setTimeout(function() {
            $("#idletimeout_model").modal("show");
        }, 100)

        secondfindEvent = $interval(function() {
            $(window).on("mousemove keydown click", function() { // find the window event
                $scope.stopsecondIdleTimer();
                $scope.seccount = 10;
                setTimeout(function() {
                    $("#idletimeout_model").modal("hide");
                }, 100)
            });
            $scope.seccount -= 1;
            
            if ($scope.seccount === 0) {
                $scope.stopsecondIdleTimer();
                $scope.unlockActionEntity();
               // $("#idletimeout_model").modal("hide");
                //$('#overRide').modal('hide');
            }
        }, 1000);
    }
    
        $scope.stopsecondIdleTimer = function() {
        if (angular.isDefined(secondfindEvent)) { 
            $(window).off( "mousemove keydown click" );           
            $interval.cancel(secondfindEvent);
            secondfindEvent = undefined;
            }
    };

    $scope.stopIdleTimer = function() {
        if (angular.isDefined(findEvent)) {
            $interval.cancel(findEvent);
            findEvent = undefined;
            }
    };

    //    $("#overRide").on("hidden.bs.modal", function () {
    //     // put your default event here
    //         $scope.IdleTimeStop();
    //     });
    /** Idletimeout clock timer block */


    $scope.repairPaymetcall = {
        "PaymentID": $scope.input.data.PaymentID,
        "RepairID": $scope.input.data.RepairID
    }

    httpCall.crudRequest('POST', '/rest/v2/payments', $scope.repairPaymetcall).then(function(data) {
        var rPaymentData = data.data;
        $scope.backupRepair = angular.copy(rPaymentData)
        $scope.repairPayment = rPaymentData
        httpCall.crudRequest('GET', '/rest/v2/payments/metainfo', {}).then(function(data) {
            $scope.IdleTimerStart();
          
            var inputObjRepCheck = {}
            inputObjRepCheck["PaymentID"] = $scope.input.data.PaymentID
            inputObjRepCheck["RepairID"] = $scope.input.data.RepairID
            inputObjRepCheck["RepairNeedsToLock"] = true

            $http.post(BASEURL + '/rest/v2/payments/repair/useraction', inputObjRepCheck).then(function(repairChk) {
               
                constructwebformFields(data)

            }, function(err) {
                $scope.alerts = [{
                    type: 'danger',
                    msg: err.data.error.message
                }];

                errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
            })

        }, errorFunction)

    }, errorFunction)

    function errorFunction(data) {
        $scope.alerts = [{
            type: 'danger',
            msg: data.data.error.message
        }];
        errorservice.ErrorMsgFunction(data, $scope, $http, data.status)
    }

    function constructwebformFields(data) {

        $scope.webformFields = [];
        for (field in data.data.Data.webformuiformat.fields.field) {

            if ('webformfieldgroup' in data.data.Data.webformuiformat.fields.field[field].fieldGroup1) {
                $scope.webformFields.push({
                    'header': '',
                    'Stage': '1',
                    'data': {
                        'name': data.data.Data.webformuiformat.fields.field[field].name,
                        'type': data.data.Data.webformuiformat.fields.field[field].type,
                        'label': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label,
                        'inputType': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].type,
                        'maxlength': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width,
                        'required': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible
                    }
                })
            } else {
                $scope.section = [];
                for (subfield in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field) {
                    if ('webformfieldgroup' in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1) {
                        $scope.section.push({
                            'name': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].name,
                            'type': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].type,
                            'label': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label,
                            'inputType': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].type,
                            'maxlength': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width,
                            'required': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible,
                            'options': 'choiceOptions' in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].choiceOptions : ''
                        })

                    } else {
                        $scope.subSection = [];
                        for (subsubfield in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field) {
                            $scope.subSection.push({
                                'name': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].name,
                                'type': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].type,
                                'label': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label,
                                'inputType': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].type,
                                'maxlength': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width,
                                'required': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible
                            })
                        }
                        $scope.section.push({
                            'header': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.sectionheader,
                            'name': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].name,
                            'maxoccurs': (data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.maxoccurs == -1) ? true : false,
                            'Stage': '3',
                            'data': $scope.subSection
                        })
                    }
                }
                $scope.webformFields.push({
                    'header': data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.sectionheader,
                    'maxoccurs': (data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.maxoccurs == -1) ? true : false,
                    'name': data.data.Data.webformuiformat.fields.field[field].name,
                    'Stage': '2',
                    'data': $scope.section
                })
            }
        }
        for (var fields in $scope.webformFields) {
            if ('maxoccurs' in $scope.webformFields[fields] && $scope.webformFields[fields]['maxoccurs']) {
                $scope.repairPayment[$scope.webformFields[fields]['name']] = $scope.repairPayment[$scope.webformFields[fields]['name']] ? $scope.repairPayment[$scope.webformFields[fields]['name']] : [{}]
            }
        }
    }

    $scope.addsubSection = function(x, y, z) {
        delete y.$$hashKey;
        $(sanitize('#' + z.name)).css({ 'height': $(sanitize('#' + z.name + '_' + x)).outerHeight() + 'px' })
        y = removeEmptyValueKeys(y)
        $scope.repairPayment[z.name] = removeEmptyValueKeys($scope.repairPayment[z.name])
        if (Object.keys(y).length !== 0) {
            $scope.repairPayment[z.name].push({})
        }
        $(sanitize('#' + z.name)).animate({ scrollTop: ($(sanitize('#' + z.name + '_' + x)).outerHeight() * (x + 1)) + 'px' });
    }

    $scope.removesubSection = function(x, y) {
        if (y.length > 1) {
            y.splice(x, 1)
        }
    }

    $scope.setHeights = function(x) {
        setTimeout(function() {
            $(sanitize('#' + x)).css({
                'height': Math.round($(sanitize('#' + x)).find('.anitem').outerHeight()) + 'px'
            })
        }, 500)
    }


    $scope.lockUnlockActionEntity = function(data) {
        EntityLockService.checkEntityLock(data).then(function(res){                   
            // opened modal dialog to process the payment
            // console.log('unlocked---2');
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
                $('#overRide').modal('hide');
            }
         });  
    }

    $scope.unlockActionEntity = function () {       
        var data = {}; // have to form the request payload
        data['TableName'] = 'PaymentRepairDetails';
        data['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' :  $scope.input.data.PaymentID});
        data['IsLocked'] = false;
        EntityLockService.checkEntityLock(data).then(function(data){                   
            // opened modal dialog to process the payment
            // console.log('unlocked---1');
             $state.go('app.paymentdetail')
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
                $scope.closeDialog();
            }
         });  
         
    }

    $scope.repairSubmit = function(repairedData) {
        repairedData = cleantheArraydataforrepair(repairedData)
        httpCall.crudRequest('PUT', '/rest/v2/payments/repair', repairedData).then(function(data) {
             // unlock forceaction entity 
             var dataObj = {}; // have to form the request payload
             dataObj['TableName'] = 'PaymentRepairDetails';
             dataObj['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : repairedData.PaymentID});
             dataObj['IsLocked'] = false;
             $scope.lockUnlockActionEntity(dataObj);
            //  $scope.IdleTimeStop();
            $scope.input = {
                'responseMessage': [{
                    type: 'success',
                    msg: data.data.responseMessage
                }]
            }
            $state.go('app.payments', {
                input: $scope.input
            })
        }, errorFunction)
    }

    $scope.gotoPaymentDetail = function() {


        $scope.Obj = {
            'uor': '',
            'nav': {
                'UIR': $scope.input.data.InstructionID,
                'PID': $scope.input.data.PaymentID
            },
            'from': GlobalService.fromPage
        }
        // unlock forceaction entity 
        var dataObj = {}; // have to form the request payload
        dataObj['TableName'] = 'PaymentRepairDetails'; 
        dataObj['BusinessPrimaryKey'] = JSON.stringify({'PaymentID' : $scope.input.data.PaymentID});
        dataObj['IsLocked'] = false;
        $scope.lockUnlockActionEntity(dataObj);
        $scope.IdleTimeStop();
        $state.go('app.paymentdetail', {
            input: $scope.Obj
        })

        //$state.go('app.paymentdetail',{input:$scope.input})
    }

    $scope.resetRepair = function() {
        $scope.repairPayment = angular.copy($scope.backupRepair)
    }

    $scope.CancelRepair = function() {
        var inputObjRepCheck = {}
        inputObjRepCheck["PaymentID"] = $scope.input.data.PaymentID
        inputObjRepCheck["RepairID"] = $scope.input.data.RepairID
        inputObjRepCheck["RepairNeedsToLock"] = false

        $http.post(BASEURL + '/rest/v2/payments/repair/useraction', inputObjRepCheck).then(function(repairChk) {

            $scope.gotoPaymentDetail()

        }, function(err) {
            $scope.alerts = [{
                type: 'danger',
                msg: err.data.error.message
            }];

            errorservice.ErrorMsgFunction(err, $scope, $http, err.status)
        })

    }

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
        if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $(e.currentTarget).data("DateTimePicker").hide();
        }
    }

    $scope.allowData = function($event, type) {


        var regex = {
            'Integer': /^\d+$/,
            'Binary': /^[01]+$/
        }
        if (type != 'String' && type != 'BigDecimal') {
            if (regex[type].test($event.key) || $event.which <= 35 || $event.which <= 40 || $event.which == 46 || $event.which == 8 || $event.which == 9) {} else {
                $event.preventDefault()
            }
        } else if (type == 'BigDecimal') {
            $($event.currentTarget).val($($event.currentTarget).val().replace(/[^0-9\.]/g, ''));
            if (($event.which != 46 || $($event.currentTarget).val().indexOf('.') != -1) && ($event.which < 48 || $event.which > 57)) {
                $event.preventDefault();
            }
        }
    }

    $scope.activatePicker = function(e) {

        var prev = null;
        $('.DatePicker').datetimepicker({
            format: "YYYY-MM-DD",
            useCurrent: true,
            showClear: true
        }).on('dp.change', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[').length == 3) {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().attr('id');
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][pId][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.DateTimePicker').datetimepicker({
            format: "YYYY-MM-DDTHH:mm:ss",
            useCurrent: true,
            showClear: true
        }).on('dp.change', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[').length == 3) {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().attr('id');
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][pId][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.TimePicker').datetimepicker({
            format: 'HH:mm:ss',
            useCurrent: true
        }).on('dp.change', function(ev) {
            if ($(ev.currentTarget).attr('ng-model').split('[').length == 3) {
                var pId = $(ev.currentTarget).parent().parent().parent().parent().attr('id');
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][pId][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            } else {
                $scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
            }
        }).on('dp.show', function(ev) {}).on('dp.hide', function(ev) {});

        $('.input-group-addon').on('click focus', function(e) {
            $(this).prev().focus().click()
        });
    }

    $scope.triggerPicker = function(e) {
        if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
            $scope.activatePicker($(e.currentTarget).prev());
        }
    };

    $scope.closeDialog = function() {
        dlgElem.modal("hide");
        $scope.unlockActionEntity();
        $scope.IdleTimeStop();
    };

});