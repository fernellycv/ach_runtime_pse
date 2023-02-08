angular.module('VolpayApp').controller('AppConfigCtrl', function($scope, $state, $timeout, $http, $filter, bankData, GlobalService, LogoutService, errorservice) {

    $scope.permission = {
        'C': false,
        'D': false,
        'R': false,
        'U': false
    }

    $http.post(BASEURL + RESTCALL.ResourcePermission, {
        "RoleId": sessionStorage.ROLE_ID,
        "ResourceName": "Application Config"
    }).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        for (k in data) {
            for (j in Object.keys($scope.permission)) {
                if (Object.keys($scope.permission)[j] == data[k].ResourcePermission) {
                    $scope.permission[Object.keys($scope.permission)[j]] = true;
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

    $scope.sortMenu = [{
        "label": "Name",
        "FieldName": "Name",
        "visible": true,
        "Type": "String"
    }, {
        "label": "Value",
        "FieldName": "Value",
        "visible": true,
        "Type": "String"
    }, {
        "label": "Type",
        "FieldName": "Type",
        "visible": true,
        "Type": "String"
    }]


    var restServer = RESTCALL.AppConfig + 'readall';
    var delData = {};
    $scope.backUp = {};
    $scope.viewMe = true;
    $scope.dataFound = false;
    $scope.loadMorecalled = false;
    $scope.backuup = {};
    $scope.CRUD = "";
    $scope.restVal = [];
    $scope.indexx = undefined;
    $scope.came = undefined;
    $scope.prev = undefined;


    $scope.deletedFlag = false;
    /*** Sorting ***/
    $scope.orderByField = 'Name';
    $scope.AppcofigSortReverse = false;
    $scope.AppcofigSortType = 'Asc';

    //I Load the initial set of data onload

    var len = 20;
    $scope.initData = function() {
        $(".listView").scrollTop(0);
        /* $scope.AppConfigData ={};
         $scope.AppConfigData.start=0;
         $scope.AppConfigData.count=20;*/

        restServer = RESTCALL.AppConfig + 'readall';

        $scope.loadMorecalled = false;

        $scope.AppConfigData = {
            "start": 0,
            "count": 20,
            "Queryfield": [],
            "QueryOrder": []
        }

        len = 20;

        $scope.dupBankData = angular.copy($scope.AppConfigData)
        $scope.AppConfigData = constructQuery($scope.AppConfigData);
        $scope.CRUD = "";
        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);
    }

    $scope.initData()
        //I Load More data on scroll


    $scope.loadMore = function() {

        $scope.loadMorecalled = true;
        $scope.AppConfigData.start = len;
        $scope.AppConfigData.count = 20;

        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);
        len = len + 20;
    }

    // I process the Create Data Request.
    $scope.createData = function(newData) {
        //$scope.AppConfigData.Data = btoa(JSON.stringify(newData))
        newData = removeEmptyValueKeys(newData)
        $scope.AppConfigData = newData;

        restServer = RESTCALL.AppConfig;

        $scope.deletedFlag = false;

        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(getData, errorFunc);
        //$scope.CRUD = "Created Successfully";
        $scope.newData = ""; // Reset the form once values have been consumed.

        if (newData.Name == "FILESIZERESTRICTION") {
            sessionStorage.fileUploadLimit = Number(newData.value);
        }
    };


    $scope.resetAddNewFields = function() {
        $scope.newData = {}
    }

    $scope.newRecordAdd = function() {
        $scope.creatingWindow = !$scope.creatingWindow;
        $scope.submitted = false;
    }


    // I update the given data to the Restserver.
    $scope.updateData = function(editedData) {
        delete editedData.$$hashKey;
        $scope.loadMorecalled = false;
        $scope.deletedFlag = false;
        editedData = removeEmptyValueKeys(editedData);

        $scope.sessionTimeoutName = editedData.Name;


        restServer = RESTCALL.AppConfig;
        bankData.crudRequest("PUT", restServer, editedData).then(getData, errorFunc);

        //$scope.CRUD = "Updated Successfully";
        //uiConfiguration();

        //frontRotate(180,0,$('#listViewPanelHeading_'+x));
        //frontRotate(0,180,$('#collapse'+x),x);
        $timeout(function() {
            //$scope.restVal[$scope.indexx] = $scope.backUp
            $scope.indexx = undefined;
            $scope.ctId = undefined;
            $scope.came = undefined;
            $scope.prev = undefined;
        }, 800)

        if (editedData.Name == "FILESIZERESTRICTION") {
            sessionStorage.fileUploadLimit = Number(editedData.Value);
        }

    };

    // I delete the given data from the Restserver.
    $scope.deleteData = function() {
        delete delData.$$hashKey
            /*$scope.AppConfigData.Data = btoa(JSON.stringify({
              "Records" : [{
            					"ColumnName" : "Name",
            					"ColumnValue" : delData.Name
            				}]
              
            }))*/

        $scope.loadMorecalled = false;
        restServer = RESTCALL.AppConfig + 'delete';
        bankData.crudRequest("POST", restServer, {
            "Name": delData.Name
        }).then(getData, errorFunc);
        $('.modal').modal("hide");
        $scope.deletedFlag = true;
        //	$scope.CRUD = "Borrado exitosamente";
    };

    // I load the rest data from the server.
    function getData(response) {

        $scope.CRUD = response.data.responseMessage;
        $scope.loadMorecalled = false;
        $scope.AppConfigData = {}

        $scope.AppConfigData.start = 0;
        $scope.AppConfigData.count = 20;

        len = 20;

        //$scope.AppConfigData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : 20}));

        restServer = RESTCALL.AppConfig + 'readall';
        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);


    }

    // I apply the rest data to the local scope.	
    function applyRestData(restDat) {
        var restData = restDat.data;
        $scope.restData = restData;
        $scope.totalForCountbar = restDat.headers().totalcount;
        if ($scope.restData.length == 0 && !$scope.loadMorecalled) {
            $('.stickyheader').css('visibility', 'hidden');
        } else {
            $('.stickyheader').css('visibility', 'visible');
        }
        if ($scope.loadMorecalled) {
            $scope.restVal = $scope.restVal.concat(restData);
        } else {

            if (restData.length == 0) {
                $scope.dataFound = true;
            } else {
                $scope.dataFound = false;
            }

            $scope.restVal = restData;
            if ($scope.CRUD != "") {
                $scope.alerts = [{
                    type: 'success',
                    msg: $scope.CRUD //Set the message to the popup window
                }];

                //$timeout(callAtTimeout, 4000);
                $timeout(function() {
                    $scope.CRUD = '';
                    $('.alert-success').hide()
                }, 4000)
            } else {
                $('.alert-danger').hide()
            }
        }

        if (($scope.sessionTimeoutName == 'SESSIONTIMEOUT') || ($scope.sessionTimeoutName == 'FILESIZERESTRICTION')) {
            uiConfiguration();
        }


        //$scope.feedMore = bankData.loadMoredata(restData.length)

    }

    // I apply the Error Message to the Popup Window.
    function errorFunc(errorMessag) {
        var errorMessage = errorMessag.data;
        errorservice.ErrorMsgFunction(errorMessag, $scope, $http, errorMessag.status)
            /* if (errorMessag.status == 401) {
            	
            } else { */
        var _cstmMsg = errorMessage.error.message
        if (_cstmMsg.match(':') && _cstmMsg.split(':')[0] === 'The validation of uniqueness for field(s)') {
            if (_cstmMsg.split(':')[1].match('has failed')) {
                var _cstmMsg1 = $filter('removeSpace')(_cstmMsg.split(':')[1].split('has failed')[0])
                if (_cstmMsg1.match('Name')) {
                    _cstmMsg = 'Name : ' + $scope.AppConfigData['Name'] + ' already exists. Value needs to be unique.'
                } else {
                    _cstmMsg = errorMessage.error.message
                }
            } else {
                _cstmMsg = errorMessage.error.message
            }

        } else {
            _cstmMsg = errorMessage.error.message
        }

        $scope.alerts = [{
            type: 'danger',
            msg: _cstmMsg //Set the message to the popup window
        }];

        // }
    }

    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });

        $scope.AppConfigData.sorts = [];

        //$scope.bankData = constructQuery($scope.bankData);

        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);
    }

    function callAtTimeout() {
        $('.alert').hide();
    }


    //  $timeout(function()
    //  {
    //      if($scope.AppConfigData.QueryOrder.length){
    //          for(k in $scope.AppConfigData.QueryOrder){
    //              if($scope.AppConfigData.QueryOrder[k].ColumnOrder == 'Asc'){
    //                 $('#'+$scope.AppConfigData.QueryOrder[k].ColumnName+'_Icon').attr('class','fa fa-caret-up')

    //              }
    //              else{
    //                   $('#'+$scope.AppConfigData.QueryOrder[k].ColumnName+'_Icon').attr('class','fa fa-caret-down')
    //              }
    //          }
    //      }
    //  },100)

    $scope.gotoSorting = function(dat) {

        // $scope.AppConfigData.start = 0;
        // $scope.AppConfigData.count = len;

        $scope.dupBankData.start = 0;
        $scope.dupBankData.count = len;

        $scope.loadMorecalled = false;

        var orderFlag = true;
        if ($scope.dupBankData.QueryOrder.length) {
            for (k in $scope.dupBankData.QueryOrder) {
                if ($scope.dupBankData.QueryOrder[k].ColumnName == dat.FieldName) {
                    if ($scope.dupBankData.QueryOrder[k].ColumnOrder == 'Asc') {
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.dupBankData.QueryOrder[k].ColumnOrder = 'Desc'
                        orderFlag = false;
                        break;
                    } else {
                        $scope.dupBankData.QueryOrder.splice(k, 1);
                        orderFlag = false;
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-minus fa-sm')
                        $(sanitize('#' + dat.FieldName + '_Icon')).removeAttr('class')
                        break;
                    }
                }
            }
            if (orderFlag) {
                $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
                $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')
                $scope.dupBankData.QueryOrder.push({
                    "ColumnName": dat.FieldName,
                    "ColumnOrder": 'Asc'
                })

            }
        } else {

            $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')
            $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $scope.dupBankData.QueryOrder.push({
                "ColumnName": dat.FieldName,
                "ColumnOrder": 'Asc'
            })

        }
        $scope.AppConfigData = constructQuery($scope.dupBankData);
        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);
    }

    $scope.Sorting = function(orderByField) {
        $scope.CRUD = "";
        $scope.loadMorecalled = false;
        $scope.orderByField = orderByField;

        if ($scope.AppcofigSortReverse == false) {
            $scope.AppcofigSortType = 'Desc';
            $scope.AppcofigSortReverse = true;
        } else {
            $scope.AppcofigSortType = 'Asc';
            $scope.AppcofigSortReverse = false;
        }

        var QueryOrder = {};
        QueryOrder.ColumnName = orderByField;
        QueryOrder.ColumnOrder = $scope.AppcofigSortType;
        len = 20;
        var sortObj = {};
        //sortObj.IsReadAllRecord = true;
        sortObj.QueryOrder = [QueryOrder];
        sortObj.start = 0;
        sortObj.count = 20;

        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData, errorFunc);
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);
    /*** To control Load more data ***/

    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                //$scope.widthOnScroll();
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.restData.length >= 20) {
                        debounceHandler()
                            // $scope.loadMore();
                    }
                }
            })
            setTimeout(function() {}, 1000)
        }
    );


    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
    }

    /** List and Grid view Starts**/
    $scope.listTooltip = "List View";
    $scope.gridTooltip = "Grid View";
    $scope.changeViewFlag = GlobalService.viewFlag;

    $scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
        GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
            $(".floatThead ").find("thead").hide();
            autoScrollDiv();
        } else {
            $(".floatThead ").find("thead").show();
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $table = $("table.stickyheader")
                $table.floatThead('destroy');

            }
            autoScrollDiv();
        }

    })

    /*$scope.viewType = function (value, eve) {
    	
    	var hitId = eve.currentTarget.id;
    	$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
    	$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

    	if (value == "list") {
    		$scope.changeViewFlag = !$scope.changeViewFlag;					
    		if(($scope.indexx != undefined)&&($scope.indexx != $scope.ctId)){
    			$scope.ctId = $scope.indexx;
    			$timeout(function(){
    				$scope.flip($scope.indexx)
    			},100)
    		}
    	} else if (value == "grid") {
    		$scope.changeViewFlag = !$scope.changeViewFlag;	
    		if(($scope.indexx != undefined)&&($scope.indexx != $scope.ctId)){
    			$scope.ctId = $scope.indexx;
    			$timeout(function(){
    				$scope.slideDown($scope.indexx)
    			},100)
    		}
    	} else {
    		$scope.changeViewFlag = !$scope.changeViewFlag;
    	}

    	GlobalService.viewFlag = $scope.changeViewFlag;
    }*/

    /** List and Grid view Ends**/


    /*** Print function ***/

    $scope.printFn = function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
        window.print()

    }

    $scope.exportToExcel = function() {
        var tabledata = angular.element(document.querySelector('#DummyExportContent'));
        var table_html = $(tabledata).html();
        bankData.exportToExcelHtml(table_html, 'ApplicationConfig')
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
            if ($('.flip')[0]) {
                $('#' + ($($('.flip')[0]).attr('id'))).parent().css({ 'height': $('.outerCrcle').outerHeight() + $('#collapse' + ($($('.flip')[0]).attr('id')).split("_")[1]).outerHeight() + 'px', 'width': $('#' + ($($('.flip')[0]).attr('id'))).parent().parent().width() + 'px' });
            }
        });

    });

    /*** On click resize ***/
    $(window).click(function() {
        if ((sessionStorage.sidebarToggleClosed != undefined) && ($('.flip')[0] != undefined)) {
            $('#' + ($($('.flip')[0]).attr('id'))).parent().css({ 'width': $('#' + ($($('.flip')[0]).attr('id'))).parent().parent().width() + 'px' });
        }
    });
    $scope.takeBackup = function(val, Id, v) {

        if ($scope.changeViewFlag) {
            $scope.flip(Id);
        } else if (!$scope.changeViewFlag) {
            $scope.slideDown(Id)
        }

        $scope.viewMe = v;
        $scope.backUp = angular.copy(val);
        $scope.indexx = angular.copy(Id);
        $scope.takeDeldata(val, Id);
    };

    $scope.changeviewMe = function(v) {
        $scope.viewMe = v;
    };

    $scope.takeDeldata = function(val, Id) {
        delData = val;
        $scope.delIndex = Id;
    };

    $scope.slideUp = function(Id) {
        $('#editingWindow_' + Id).collapse('hide');
        $('.editHere').removeClass('trHilght');
        $('#displayingWindow_' + Id).collapse('show');
        $('#editingWindow_' + Id).on('hidden.bs.collapse', function() {
            $scope.restVal[$scope.indexx] = $scope.backUp;
            $scope.indexx = undefined;
            $scope.ctId = undefined;
            $scope.came = undefined;
            $scope.prev = undefined;
        });

    };

    $scope.slideDown = function(Id) {

        if (($scope.prev != undefined) && ($scope.prev != Id)) {
            $('#collapse' + $scope.prev).collapse('hide');
        }

        $scope.prev = Id;
        $('#displayingWindow_' + Id).collapse('hide');
        $('.displayWindow').collapse('show');
        $('.editWindow').collapse('hide');
        $('#editingWindow_' + Id).collapse('show');
        $('.editHere').removeClass('trHilght');
        $('#editHere_' + Id).addClass('trHilght');
    };

    $scope.flip = function(x) {
        if (($scope.came != undefined) && ($scope.came != x)) {
            frontRotate(180, 0, $('#listViewPanelHeading_' + $scope.came));
            frontRotate(0, 180, $('#collapse' + $scope.came), $scope.came);
        }

        $('#listViewPanelHeading_' + x).parent().css({ 'width': $('#listViewPanelHeading_' + x).parent().outerWidth() + 'px', 'position': 'relative' });
        $('#listViewPanelHeading_' + x).parent().animate({ 'height': $('.outerCrcle').outerHeight() + $('#collapse' + x).outerHeight() + 'px' }, {
            duration: 100,
            easing: "linear",
        });
        $('#listViewPanelHeading_' + x).addClass('flip');
        $('#collapse' + x).removeClass('hideMe').addClass('flip');

        frontRotate(0, 180, $('#listViewPanelHeading_' + x));
        frontRotate(180, 0, $('#collapse' + x));
        $scope.came = x;
    };

    $scope.flipReverse = function(x) {

        frontRotate(180, 0, $('#listViewPanelHeading_' + x));
        frontRotate(0, 180, $('#collapse' + x), x);

        $('#editingWindow_' + x).collapse('hide');
        $('.editHere').removeClass('trHilght');
        $('#displayingWindow_' + x).collapse('show');
        $timeout(function() {
            $scope.restVal[$scope.indexx] = $scope.backUp
            $scope.indexx = undefined;
            $scope.ctId = undefined;
            $scope.came = undefined;
            $scope.prev = undefined;
        }, 800)
    };

    $scope.multipleEmptySpace = function(e) {
        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('');
        }
    };

    function frontRotate(frm, to, Id1, go) {
        $({ deg: frm }).animate({ deg: to }, {
            duration: 800,
            step: function(now, fx) {
                Id1.css({
                    transform: "rotateY(" + now + "deg)",
                    perspective: now,
                    backfaceVisibility: "hidden"
                });

            },
            complete: function() {
                if (go != undefined) {
                    $('#listViewPanelHeading_' + go).removeClass('flip').removeAttr('style');
                    $('#collapse' + go).addClass('hideMe').removeClass('flip').removeAttr('style');
                    $('#listViewPanelHeading_' + go).parent().animate({ 'height': $('.outerCrcle').outerHeight() + $('#listViewPanelHeading_' + go).outerHeight() + 'px' }, {
                        duration: 100,
                        easing: "linear",
                        complete: function() {
                            $('#listViewPanelHeading_' + go).parent().removeAttr('style');
                        }
                    });
                }
            }
        });
    };

    $(document).ready(function() {
        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table');

            $tablesToFloatHeaders.floatThead({
                useAbsolutePositioning: true,
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
            }, 300)



        })
        $(window).trigger('resize');
    });

    $scope.buildFilter = function(argu1, argu2) {
        for (k in $scope.sortMenu) {
            if ($scope.sortMenu[k].Type == 'String') {
                argu2.push({
                    "columnName": $scope.sortMenu[k].FieldName,
                    "operator": "LIKE",
                    "value": argu1
                })
            }
        }
        return argu2;

    };

    $scope.searchFilter = function(val) {
        len = 20;
        $scope.loadMorecalled = false;
        $scope.AppConfigData.start = 0;

        val = removeEmptyValueKeys(val)
        $scope.AppConfigData.filters = removeEmptyValueKeys($scope.AppConfigData.filters)
        $scope.AppConfigData.filters = {
            "logicalOperator": "AND",
            "groupLvl1": [{
                "logicalOperator": "AND",
                "groupLvl2": [{
                    "logicalOperator": "AND",
                    "groupLvl3": []
                }]
            }]
        }

        for (j in Object.keys(val)) {
            $scope.AppConfigData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                "logicalOperator": "OR",
                "clauses": []
            })
            if (Object.prototype.toString.call(val[Object.keys(val)[j]]) === '[object Array]') {
                for (i in val[Object.keys(val)[j]]) {
                    $scope.AppConfigData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
                        "columnName": Object.keys(val)[j],
                        "operator": "=",
                        "value": val[Object.keys(val)[j]][i]
                    })
                }
            } else {
                if (typeof(val[Object.keys(val)[j]]) === 'object') {
                    $scope.AppConfigData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
                        "columnName": "EffectiveFromDate",
                        "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                        "value": $('#startDate').val()
                    })
                    $scope.AppConfigData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
                        "columnName": "EffectiveFromDate",
                        "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                        "value": $('#endDate').val()
                    })
                } else {
                    $scope.buildFilter(val[Object.keys(val)[j]], $scope.AppConfigData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses)
                }

            }
        }
        //$scope.AppConfigData = constructQuery($scope.AppConfigData)
        $scope.filterParams = {};
        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);

    };

    $scope.clearFilter = function() {
        //$('.listView').scrollTop(0);
        $scope.restVal = [];
        $scope.AppConfigData = {
            "start": 0,
            "count": len,
            "sorts": []
        }
        $scope.showCustom = false;
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({ 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })
        $('.customDropdown').removeClass('open');
        $scope.AppConfigData = constructQuery($scope.AppConfigData)
        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData, errorFunc);

    };

});