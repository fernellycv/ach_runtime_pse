angular.module('VolpayApp').controller('IntegrateERPCtrl', function($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService, CommonService, RefService, errorservice, EntityLockService) {


    var authenticationObject = $rootScope.dynamicAuthObj;
    $scope.spliceSearch = false;
    $scope.lskey = ["New Search"];
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 
    
    $scope.retainSavedSearch = function() {
        $scope.lskey = ["New Search"];

        $scope.uDetails = {
            "Queryfield": [{
                "ColumnName": "UserID",
                "ColumnOperation": "=",
                "ColumnValue": sessionStorage.UserID
            }],
            "Operator": "AND"
        }
        $scope.uDetails = constructQuery($scope.uDetails);

        $http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.uDetails).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.userFullObj = data[0];
            $scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))

            if (Object.keys($scope.uData).indexOf('savedSearch') != -1) {

                if ("ReceivedInsn" in $scope.uData.savedSearch) {
                    if ($scope.uData.savedSearch.ReceivedInsn.length) {
                        for (var i in $scope.uData.savedSearch.ReceivedInsn) {
                            $scope.lskey.push($scope.uData.savedSearch.ReceivedInsn[i].name)
                        }

                    } else {
                        $scope.uData.savedSearch.ReceivedInsn = [];
                        updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                    }
                } else {
                    $scope.uData.savedSearch.ReceivedInsn = [];
                    updateUserProfile(($filter('stringToHex')(JSON.stringify($scope.uData))), $http).then(function(response) {})
                }
            } else {
                userData.savedSearch.ReceivedInsn = [];
                updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function(response) {

                })
            }
            
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $translate.use("es_ES");
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.retainSavedSearch();

    $scope.buildSearchClicked = false;
    $rootScope.customDate = {};
    $scope.search = ($rootScope.search) ? $rootScope.search : {};
    $scope.dSearch = $scope.search;
    $scope.resetBtnClicked = false;
    $scope.newSearch = false;
   
    $scope.setSortMenu = function() {
        $scope.sortMenu = [
		 {
                "label": "IntegrateERP.ReqId",
                "fieldName": "ReqId",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "IntegrateERP.RequestDateTime",
                "fieldName": "ReqDateTime",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "IntegrateERP.Request Type",
                "fieldName": "ReqType",
                "visible": true,
                "searchVisible": true,
                "type": "dropdown"
            },
            {
                "label": "IntegrateERP.Clearing Date",
                "fieldName": "ClearingDate",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "IntegrateERP.Request",
                "fieldName": "Request",
                "visible": true,
                "searchVisible": false,
                "type": "text"
            },
            {
                "label": "IntegrateERP.Response",
                "fieldName": "Response",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            },
            {
                "label": "IntegrateERP.Response Date Time",
                "fieldName": "ResDateTime",
                "visible": true,
                "searchVisible": false,
                "type": "text"
            } ,{
                "label": "IntegrateERP.Status",
                "fieldName": "Status",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }, {
                "label": "IntegrateERP.Response code",
                "fieldName": "ResCode",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }, {
                "label": "IntegrateERP.Description",
                "fieldName": "DetailesStatusInfo",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }, {
                "label": "IntegrateERP.User",
                "fieldName": "CreatedBy",
                "visible": true,
                "searchVisible": true,
                "type": "text"
            }
            
        ]
    }
    $scope.setSortMenu()


    $scope.commonObj = CommonService.distInstruction;
    CommonService.distInstruction.currentObj.sortBy = [];



    $scope.dateSet = function() {
        $scope.dateFilter = CommonService.distInstruction.dateFilter;

        for (i in $scope.dateFilter) {
            if ($scope.dateFilter[i]) {
                $('#dropTxt').text($filter('ucwords')(i))
                for (var j = 0; j < $('.menuClass').length; j++) {
                    if ($($('.menuClass')[j]).text().toLowerCase().indexOf(i) != -1) {
                        $($('.menuClass')[j]).addClass('listSelected')
                    } else {
                        $($('.menuClass')[j]).removeClass('listSelected')
                    }
                }

            }
        }
    }
    $scope.dateSet()
    $scope.ClearingDate=moment(new Date()).format('YYYY-MM-DD')
    $scope.loadedData = '';
    $scope.uorVal = $scope.uorFound = $scope.commonObj.uorVal;

    $scope.fieldArr = $scope.commonObj.currentObj;
    $scope.fieldArr.start = 0;
    $scope.fieldArr.ClearingDate =  $scope.ClearingDate
    var len = 20;


    $scope.changeViewFlag = false;

    $scope.retExpResult = function() {
        if (!$scope.dateFilter.custom) {
            $scope.customDate = {
                startDate: '',
                endDate: ''
            }
        }

        if ($scope.dateFilter.all) {
            $scope.dateArr = [];
        } else if ($scope.dateFilter.today) {
            $scope.dateArr = [{
                "ColumnName": "GeneratedDate",
                "ColumnOperation": "=",
                "ColumnValue": todayDate()
            }]
        } else if ($scope.dateFilter.week) {
            $scope.dateArr = [{
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": ">=",
                    "ColumnValue": week().lastDate
                },
                {
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": "<=",
                    "ColumnValue": week().todayDate
                }
            ]
        } else if ($scope.dateFilter.month) {
            $scope.dateArr = [{
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": ">=",
                    "ColumnValue": month().lastDate
                },
                {
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": "<=",
                    "ColumnValue": month().todayDate
                }
            ]

        } else if ($scope.dateFilter.custom) {
            $scope.customDate.startDate = CommonService.distInstruction.customDate.startDate;
            $scope.customDate.endDate = CommonService.distInstruction.customDate.endDate;


            $('#customDate').modal('hide')
            $scope.dateArr = [{
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": ">=",
                    "ColumnValue": $scope.customDate.startDate
                },
                {
                    "ColumnName": "GeneratedDate",
                    "ColumnOperation": "<=",
                    "ColumnValue": $scope.customDate.endDate
                }
            ]

        }

        return $scope.dateArr;

    }
    $scope.retExpResult()

 
    /* Query Constructor */
    $scope.uorQueryConstruct = function(arr) {
   
        delete arr.sortBy
        delete arr.params
      
        CommonService.distInstruction.currentObj = arr;
        $scope.fieldArr = arr;


        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.ClearingDate = arr.ClearingDate;
       

        return $scope.Qobj;
    }


    $scope.initCall = function(_query) {
      
        sessionStorage.GetAlLconsumptionRESTCALL = BASEURL + RESTCALL.GetAlLconsumption;
        sessionStorage.distributedObj = JSON.stringify(_query)
        $http.post(BASEURL + RESTCALL.GetAlLconsumption, _query).then(function onSuccess(response) {
       
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

          
            $scope.datas = data;
	
            $scope.loadedData = data;
            $('.alert-danger').hide()
     
  
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.datas = [];
            $scope.loadedData = [];

            /* if (data.error.code == 401) {
            	LogoutService.Logout();
            } else { */
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];
            // }
    
        });
    }

    $scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

    $scope.FilterByDate = function (ClearingDate) {
      
        $scope.reqBodyObj = { ClearingDate : ClearingDate };
        $scope.reqBodyObj.start = 0;
        $scope.reqBodyObj.count=20
  
        $scope.initCall($scope.uorQueryConstruct($scope.reqBodyObj ))
        
      
    }



    $scope.refresh = function() {
        $scope.ClearingDate=moment(new Date()).format('YYYY-MM-DD')
        $scope.reqBodyObj = { ClearingDate : $scope.ClearingDate };
        $scope.reqBodyObj.start = 0;
        $scope.reqBodyObj.count=20
     
        $scope.initCall($scope.uorQueryConstruct($scope.reqBodyObj ))
         $scope.datasaudit=[]
        $('#InitiateRequests').hide();
        setTimeout(function() {
            $('.alert-success').hide();
            $('.alert-danger').hide()
        }, 2000)
     
        $('.table-responsive').find('table').find('thead').find('th').find('span').removeAttr('class')
         

    }


   

    $scope.triggerConditionOLD = function (arg) {

      var totalobject={
          "Status":"IN_PROGRESS",
          "ClearingDate":$scope.ClearingDate
      }


      $http.post(BASEURL + '/rest/v2/cycle/integrateerp',totalobject).then(function onSuccess(response) {
        // Handle success
        $('#InitiateRequests').hide();
        $('.modal-backdrop ').hide();
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.alerts = [{
            type: 'success',
            msg: data.responseMessage
        }];
        setTimeout(function() {
            $scope.refresh()
        }, 800)
        setTimeout(function() {
            $('.alert-success').hide();
        }, 2500)
     
    }).catch(function onError(response) {
        // Handle error
      
        $('#InitiateRequests').modal('hide')
      
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.alerts = [{
            type: 'danger',
            msg: data.error.message
        }];

        setTimeout(function() {
            $('.alert-danger').hide()
        }, 2000)

        

    });
      
        
    }
    
    $scope.triggerCondition = function (arg) {

      var totalobject={
          "Status":"IN_PROGRESS",
          "ClearingDate":$scope.ClearingDate
      }


      $http.post(BASEURL + '/rest/erp/settlement/send',totalobject).then(function onSuccess(response) {
        // Handle success
        $('#InitiateRequests').hide();
        $('.modal-backdrop ').hide();
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;
        $scope.alerts = [{
            type: 'success',
            msg: data.responseMessage
        }];
        setTimeout(function() {
            $scope.refresh()
        }, 800)
        setTimeout(function() {
            $('.alert-success').hide();
        }, 2500)
     
    }).catch(function onError(response) {
        // Handle error
      
        $('#InitiateRequests').modal('hide')
      
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.alerts = [{
            type: 'danger',
            msg: data.error.message
        }];

        setTimeout(function() {
            $('.alert-danger').hide()
        }, 2000)

        

    }); 
    }
  

    $scope.sortMenuaudit = [
        {
               "label": "CyclesModule.CycleID",
               "fieldName": "CycleID",
               "visible": true,
               "searchVisible": true,
               "type": "text"
           },
           {
               "label": "CyclesModule.Type",
               "fieldName": "Type",
               "visible": true,
               "searchVisible": true,
               "type": "text"
           },
           {
               "label": "CyclesModule.Event",
               "fieldName": "Event",
               "visible": true,
               "searchVisible": true,
               "type": "dropdown"
           },
           {
               "label": "CyclesModule.Actor",
               "fieldName": "Actor",
               "visible": true,
               "searchVisible": true,
               "type": "text"
           },
           {
               "label": "CyclesModule.AuditTimeStamp",
               "fieldName": "AuditTimeStamp",
               "visible": true,
               "searchVisible": false,
               "type": "text"
           },
           {
               "label": "CyclesModule.Description",
               "fieldName": "Description",
               "visible": true,
               "searchVisible": true,
               "type": "text"
           },
           {
               "label": "CyclesModule.ProcessingHost",
               "fieldName": "ProcessingHost",
               "visible": true,
               "searchVisible": false,
               "type": "text"
           }
           
       ]

   


   
    /* Load more */

    $scope.loadMore = function(query) {
        $scope.fieldArr.start = len;
        $scope.fieldArr.count = 20;
        $scope.fieldArr.ClearingDate =  $scope.ClearingDate
        $http.post(BASEURL + RESTCALL.GetAlLconsumption, $scope.uorQueryConstruct($scope.fieldArr)).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $scope.datas = $scope.datas.concat(data);

        $scope.rleasedisbale=headers().releaseflag
            $scope.loadedData = data;
            len = len + 20;
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



    $scope.setDateRange = function() {
  
        setTimeout(function() {
          
            $scope.remoteDataConfig()

        }, 100)

    }




    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    jQuery(
        function($) {
            $('.listView').bind('scroll', function() {
                if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                    if ($scope.loadedData.length >= 20) {
                        debounceHandler()
                    }
                }
            })
            setTimeout(function() {}, 1000)
        }
    );



   


  

    var textVal = ''


    $http.get(BASEURL + RESTCALL.UserProfile).then(function onSuccess(response) {
        // Handle success
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

        $scope.cData = data;
        $scope.backupData = angular.copy(data)
        $scope.profileName = $scope.cData.TimeZone;
        textVal = $scope.profileName;
    }).catch(function onError(response) {
        // Handle error
        var data = response.data;
        var status = response.status;
        var statusText = response.statusText;
        var headers = response.headers;
        var config = response.config;

 
    });


    function autoScrollDiv() {
        $(".dataGroupsScroll").scrollTop(0);
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

    });

    $(document).ready(function() {
        $(".FixHead").scroll(function(e) {
            var $tablesToFloatHeaders = $('table');
            $tablesToFloatHeaders.floatThead({
              
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
                if ($(".dataGroupsScroll").scrollTop() == 0) {
                    $(".dataGroupsScroll").scrollTop(50)
                }

            })
        

    })

    $scope.customDateRangePicker = function(sDate, eDate) {
        var startDate = new Date();
        var FromEndDate = new Date();
        var ToEndDate = new Date();
        ToEndDate.setDate(ToEndDate.getDate() + 365);

        $(sanitize('#' + sDate)).datepicker({
            weekStart: 1,
            startDate: '1900-01-01',
            minDate: 1,
            endDate: ToEndDate,
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true
        }).on('changeDate', function(selected) {
            startDate = new Date(selected.date.valueOf());
            startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
            $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
        });
    }
   

    $scope.customDateRangePicker('CstartDate', 'CendDate')



    $scope.datePlaceholderValue = "";
    $(document).ready(function() {
        $(".dateTypeKey").keypress(function(event) {
            var regex = /^[0-9]$/;
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (!(keycode == '8')) {
                if (regex.test(String.fromCharCode(keycode))) {
                    if ($(this).val().length == 4) {
                        $(this).val($(this).val() + "-");
                    } else if ($(this).val().length == 7) {
                        $(this).val($(this).val() + "-");
                    } else if ($(this).val().length >= 10) {
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                }
            }
        });

        $(".dateTypeKey").focus(function() {
            $scope.datePlaceholderValue = $(this).attr('placeholder');
            $(this).attr('placeholder', $filter('translate')('Placeholder.format'));
        }).blur(function() {
            $(this).attr('placeholder', $scope.datePlaceholderValue);
        })
    });


    $scope.View=function(data,label){
       $scope.showdata=data
       $scope.showlabel=label

    }

});
