angular.module('VolpayApp').controller('approvalCtrl', function($scope,$filter, $rootScope, $state, $http, $timeout, GlobalService, CommonService, bankData, EntityLockService, LogoutService, errorservice, datepickerFaIcons) {
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks();  

    $scope.restVal = []
    $scope.loadmoreCalled = false;
    $scope.downloadOptions = "Current"
    $scope.adFilter = {
        "filters": {
            "logicalOperator": "AND",
            "groupLvl1": [{
                "logicalOperator": "AND",
                "groupLvl2": [{
                    "logicalOperator": "AND",
                    "groupLvl3": []
                }]
            }]
        },
        "sorts": [],
        "start": 0,
        "count": 20
    };


    $scope.sortMenu = [{
            "label": "Approvals.Approval ID",
            "FieldName": "ApprovalID",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Approvals.User ID",
            "FieldName": "UserID",
            "visible": true,
            "Type": "String"
        }, {
            "label": "Approvals.Table Name",
            "FieldName": "TableName",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Approvals.State",
            "FieldName": "State",
            "visible": true,
            "Type": "String"
        },
        {
            "label": "Approvals.Processed On",
            "FieldName": "ProcessedOn",
            "visible": true,
            "Type": "DateOnly"
        },
        {
            "label": "Approvals.Number of Levels Approved",
            "FieldName": "NumberOfLevelsApproved",
            "visible": true,
            "Type": "Number"
        },
        {
            "label": "Approvals.Business Key",
            "FieldName": "BusinessKey",
            "visible": true,
            "Type": "String"
        }
    ];

    $scope.filterBydate = [{
        'actualvalue': todayDate(),
        'displayvalue': 'filterBydate.Today'
    }, {
        'actualvalue': week(),
        'displayvalue': 'filterBydate.This Week'
    }, {
        'actualvalue': month(),
        'displayvalue': 'filterBydate.This Month'
    }, {
        'actualvalue': year(),
        'displayvalue': 'filterBydate.This Year'
    }, {
        'actualvalue': '',
        'displayvalue': 'filterBydate.Custom'
    }];

    $scope.showCustom = false;
    $scope.selectedDate = '';

    $scope.clearSort = function(id) {
        $(id).find('i').each(function() {
            $(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
            $('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
        });
        $scope.fieldArr.sortBy = [];
        $scope.readallFn($scope.queryForm($scope.fieldArr))
    }

    $scope.fields = [{
            'type': "string",
            'label': "Approvals.Approval ID",
            'name': "ApprovalID"
        },
        {
            'type': "string",
            'label': "Approvals.User ID",
            'name': "UserID"
        },
        {
            'type': "string",
            'label': "Approvals.Table Name",
            'name': "TableName"
        },
        {
            'type': "number",
            'label': "Approval Count",
            'name': "ApprovalCount"
        },
        {
            'type': "string",
            'label': "Approvals.State",
            'name': "State"
        },
        {
            'type': "string",
            'label': "Approvals.Business Key",
            'name': "BusinessKey"
        }
    ];

    $scope.restData = [];

    if (CommonService.refDataApproved.flag) {

        $scope.alerts = [{
            type: 'success',
            msg: CommonService.refDataApproved.msg
        }];
    }

    function autoScrollDiv() {
        $(".listView").scrollTop(0);
    }

    $scope.changeViewFlag = GlobalService.viewFlag;
    $scope.$watch('changeViewFlag', function(newValue, oldValue) {
        GlobalService.viewFlag = newValue;
        var checkFlagVal = newValue;
        if (checkFlagVal) {
            $("thead").hide();
            autoScrollDiv();
        } else {
            $("thead").show();
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $table = $("table.stickyheader")
                $table.floatThead('destroy');

            }
            autoScrollDiv();
        }
        // $scope.changeViewFlag = GlobalService.viewFlag;
    })

    function hex2a(hexx) {
        var hex = hexx.toString(); //force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    function a2hex(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i++) {
            var hex = Number(str.charCodeAt(i)).toString(16);
            arr.push(hex);
        }
        return arr.join('');
    }

    function formatXml(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    function htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    var x2js = new X2JS();

    function convertXml2JSon(hhhh) {

        var removeRuleStru = x2js.xml_str2json(hhhh);

        delete removeRuleStru.BusinessRules.RuleStructure;
        removeRuleStru.BusinessRules.Rule = htmlDecode(removeRuleStru.BusinessRules.Rule);

        return convertJSon2XML(removeRuleStru);
        //return removeRuleStru;
    }

    function convertJSon2XML(bbb) {
        var formatXMLData = '<?xml version="1.0" encoding="UTF-8"?>' + x2js.json2xml_str(bbb);

        return formatXml(formatXMLData);
    }

    /* function convertJSon2XML(bbb) {
    return x2js.json2xml_str(bbb);
    }  */

    $timeout(function() {
        CommonService.refDataApproved.flag = false;
        CommonService.refDataApproved.msg = '';
        $('.alert-success').hide()
    }, 5000)
    $scope.queriedCount = 0;

    $scope.readallFn = function(dataObj) {
        $scope.individualReadall = false;

        $http.defaults.headers.common['forcematchcount'] = true;
        $http.post(BASEURL + RESTCALL.ReferenceDataApproval + '/readall', dataObj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            if (data) {
                $scope.individualReadall = true;
            }
            $scope.totalData = headers().totalcount;
            $scope.restVal = data;
            $scope.totalCount = headers().totalcount;
            $scope.filteredCount = headers().filteredcount;
            $scope.queriedCount = headers().queriedcount;
            if ($scope.loadmoreCalled) {

                $scope.restData = $scope.restData.concat(data);
            } else {
                $scope.restData = data;
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].TableName == 'BusinessRules') {
                    data[i].NewData = convertXml2JSon(hex2a(data[i].NewData));
                    if (data[i].OldData != undefined) {
                        data[i].OldData = convertXml2JSon(hex2a(data[i].OldData));
                    }
                }
            }

            setTimeout(function() {
                if ($(window).height() >= 760) {
                    $('.listView').css({ 'max-height': ($(window).height() * 65) / 100 + 'px' })
                } else {
                    $('.listView').css({ 'max-height': ($(window).height() * 52) / 100 + 'px' })
                }
            }, 100)

            //$scope.restVal = data;

            /*if ($scope.restVal.length > 0) {
            $scope.dataFound = true;
            } else {
            $scope.dataFound = false; ;
            }*/
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            errorservice.ErrorMsgFunction(config, $scope, $http, status)
                /* if (status == 401) {
                	
                } else { */
            $scope.alerts = [{
                type: 'danger',
                msg: data.error.message
            }];

            // }
        });
    };

    var len = 20;

    var dataObj = {
        'Queryfield': [],
        'QueryOrder': [],
        'start': $scope.restVal.length >= 20 ? parseInt($scope.queriedCount) : 0,
        'count': len,
    };

    $scope.loadmoreCalled = false;
    $scope.initData = function() {

        len = 20;
        $scope.loadmoreCalled = false;
        dataObj = {
            'Queryfield': [],
            'QueryOrder': [],
            'start': 0,
            'count': len,
        };

        $scope.dupData = angular.copy(dataObj)
        dataObj = constructQuery(dataObj);
        dataObj.sorts=[{"columnName":"ApprovalID","sortOrder":"Desc"}]
        $scope.readallFn(dataObj)
        $(".listView").scrollTop(0);
    }

    $scope.initData();
    $scope.viewData = function(data) {
        $state.go('app.viewApprovalData', {
            input: data
        })
    }

    /*$scope.exportToExcel = function () {
    	
    	var table_html = $('#exportTable').html();
    	bankData.exportToExcelHtml(table_html, 'ReferenceDataForApproval')
    }*/


    $scope.ExportMore = function(argu, excelLimit,format) {
        if(format=='csv'){
            var rest=BASEURL + RESTCALL.ReferenceDataApproval + '/readall'
            if (argu > excelLimit) {
                //JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? $scope.Title + '_' + ('' + excelLimit)[0] : $scope.Title, true);
                JSONToExport(bankData,$scope.dat,(argu > excelLimit) ? $filter("translate")("Sidebar.Approvals") + '_' + ('' + excelLimit)[0] : $filter("translate")("Sidebar.Approvals"),true,$scope.sortMenu.map(col =>col.FieldName),'Approvals',$scope.colLabel());
                $scope.dat = [];
                excelLimit += 1000000
            }
            $scope.totalData = parseInt($scope.totalData)
        }else{
            $scope.totalData = parseInt($scope.totalData)
            var rest=BASEURL +'/rest/v2/administration/approvals/'+format
        }


        $http.post(rest, { "start": argu, "count": ($scope.totalData < 1000) ? 1000 : $scope.totalData,"sorts":[{"columnName":"ApprovalID","sortOrder":"Desc"}] }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            if(response.data['FileName']){
                response.data['filename'] = response.data['FileName']
            }
            for (var i in data) {
                delete data[i].OldData;
                delete data[i].NewData;
            }
            if(format=='csv'){
                $scope.dat = $scope.dat.concat(data)
                if (data.length >= 1000) {
                    argu += 1000;
                    $scope.ExportMore(argu, excelLimit)
                } else {
                    //JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? $filter("translate")("Sidebar.Approvals") + '_' + ('' + excelLimit)[0] : $filter("translate")("Sidebar.Approvals"), true);
                    JSONToExport(bankData,$scope.dat,(argu > excelLimit) ? $filter("translate")("Sidebar.Approvals") + '_' + ('' + excelLimit)[0] : $filter("translate")("Sidebar.Approvals"),true,$scope.sortMenu.map(col =>col.FieldName),'Approvals',$scope.colLabel());
                }
            }else{
                $scope.dat = response.data.Data
                $scope.Details = 'data:application/octet-stream;base64,' + $scope.dat;
                var dlnk = document.getElementById('dwnldLnk');
                dlnk.href = $scope.Details;
                dlnk.download = $filter("translate")("Sidebar.Approvals")+'.'+ response.data['filename'].split('.')[1];
                  
                dlnk.click();
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

    $scope.exportAsExcel = function(data) {

        $scope.dat = [];
        if ($("input[name=excelVal][value='All']").prop("checked")) {
            $scope.ExportMore(0, 1000000,data);
        } else {
            $scope.dat = angular.copy($scope.restData);

            for (var i in $scope.dat) {
                delete $scope.dat[i].OldData;
                delete $scope.dat[i].NewData;
            }
            //$scope.dat.shift();
            JSONToExport(bankData,$scope.dat,$filter("translate")("Sidebar.Approvals"),true,$scope.sortMenu.map(col =>col.FieldName),'Approvals',$scope.colLabel());
            //JSONToCSVConvertor(bankData, $scope.dat, $filter("translate")("Sidebar.Approvals"), true);
        }
    }

    $scope.colLabel = function() {
        let colLabel = [];
        $scope.sortMenu.forEach(item => {
            colLabel.push($filter('translate')(item.label));
        });
        return colLabel;
    }
    
    $scope.loadMore = function() {

        $scope.loadmoreCalled = true;
        dataObj.start = parseInt($scope.queriedCount);
        dataObj.count = 20;
        //dataObj.filters = $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3;
        if ($scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.length) {
            dataObj.filters = $scope.adFilter.filters;
        }

        if ($scope.adFilter.sorts.length) {
            dataObj.sorts = $scope.adFilter.sorts;
        }
        $scope.readallFn(dataObj)
        len = len + 20;
    }

    $scope.fieldArr = {
        "sortBy": [],
        "params": [],
        "start": 0,
        "count": 20
    }

    $scope.queryForm = function(arr) {
        $scope.fieldArr = arr;

        $scope.Qobj = {};
        $scope.Qobj.start = arr.start;
        $scope.Qobj.count = arr.count;
        $scope.Qobj.Queryfield = [];
        $scope.Qobj.QueryOrder = [];

        for (var i in arr) {
            if (i == 'params') {
                for (var j in arr[i]) {
                    $scope.Qobj.Queryfield.push(arr[i][j])
                }
            } else if (i == 'sortBy') {
                for (var j in arr[i]) {
                    $scope.Qobj.QueryOrder.push(arr[i][j])
                }
            }
        }

        $scope.Qobj = constructQuery($scope.Qobj);
        return $scope.Qobj;
    }

    $scope.gotoSorting = function(dat) {

        $scope.fieldArr.start = 0;
        $scope.fieldArr.count = len;
        $scope.fieldArr.sorts=[{"columnName":"ApprovalID","sortOrder":"Desc"}]
        $scope.loadmoreCalled = false;

        var orderFlag = true;
        if ($scope.fieldArr.sortBy.length) {
            for (var i in $scope.fieldArr.sortBy) {
                if ($scope.fieldArr.sortBy[i].ColumnName == dat.FieldName) {
                    if ($scope.fieldArr.sortBy[i].ColumnOrder == 'Asc') {
                        $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-down')
                        $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-down')
                        $scope.fieldArr.sortBy[i].ColumnOrder = 'Desc';
                        orderFlag = false;
                        break;
                    } else {
                        $scope.fieldArr.sortBy.splice(i, 1);
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
                $scope.fieldArr.sortBy.push({
                    "ColumnName": dat.FieldName,
                    "ColumnOrder": 'Asc'
                })
            }
        } else {

            $(sanitize('#' + dat.FieldName + '_icon')).attr('class', 'fa fa-long-arrow-up')
            $(sanitize('#' + dat.FieldName + '_Icon')).attr('class', 'fa fa-caret-up')

            $scope.fieldArr.sortBy.push({
                "ColumnName": dat.FieldName,
                "ColumnOrder": 'Asc'
            })
        }
        $scope.readallFn($scope.queryForm($scope.fieldArr))
    }

    /** List and Grid view Starts**/
    $scope.listTooltip = "List View";
    $scope.gridTooltip = "Grid View";
    // $scope.changeViewFlag = GlobalService.viewFlag;
    $scope.changeViewFlag = false;

    $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');

    if ($scope.changeViewFlag) {
        $('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
        $scope.changeViewFlag = true;

    } else {
        $('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
        $scope.changeViewFlag = false;
    }

    var debounceHandler = _.debounce($scope.loadMore, 700, true);

    $scope.hello = function(value, eve) {
        $(".listView").scrollTop(0);
        var hitId = eve.currentTarget.id;
        $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
        $('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

        if (value == "list") {
            $scope.changeViewFlag = !$scope.changeViewFlag;

        } else if (value == "grid") {
            $scope.changeViewFlag = !$scope.changeViewFlag;
        } else {
            $scope.changeViewFlag = !$scope.changeViewFlag;
        }

        GlobalService.viewFlag = $scope.changeViewFlag;
    }

    $scope.printFn = function() {
        window.print()
    }

    $scope.filterParams = {};
    $scope.selectedStatus = [];
    $scope.setEffectivedate = function(val, to) {

        to['EffectiveDate'] = val;
        if ($scope.selectedDate == val.displayvalue) {
            $scope.showCustom = false;
            $('.filterBydate').css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
            $scope.selectedDate = '';
        } else {
            $scope.showCustom = true;
            $scope.selectedDate = angular.copy(val.displayvalue);
            $('.filterBydate').css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
            $('#' + $scope.selectedDate.replace(/\s+/g, '')).css({ 'box-shadow': '1.18px 3px 2px 1px rgba(0,0,0,0.40)', 'background-color': '#d8d5d5' })
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
                            $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                        })
                    } else {
                        $(this).val(date[Number(i + 1)])
                        $(this).parent().children().each(function() {
                            $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                        })
                    }
                } else {
                    $(this).val(date[Number(i - 1)])
                    $(this).parent().children().each(function() {
                        $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                    })
                }
            })
        } else if (val.displayvalue == 'Custom') {
            $('#customPicker').find('input').each(function(i) {
                $(this).parent().children().each(function() {
                    $(this).css({ 'cursor': 'pointer' }).removeAttr('disabled').val('')
                })
            })
        } else {
            $('#customPicker').find('input').each(function(i) {
                $(this).val(val.actualvalue)
                $(this).parent().children().each(function() {
                    $(this).css({ 'cursor': 'not-allowed' }).attr('disabled', 'disabled')
                })
            })
        }
    }

    $scope.buildFilter = function(argu1) {

        $('alert-danger').hide();
        var argu2 = [];
        for (k in $scope.fields) {
            if ($scope.fields[k].type === 'string') {
                argu2.push({
                    "columnName": $scope.fields[k].name,
                    "operator": "LIKE",
                    "value": argu1
                })
            } else if ($scope.fields[k].type === 'select' && $scope.fields[k].name != 'Status') {
                argu2.push({
                    "columnName": $scope.fields[k].name,
                    "operator": "=",
                    "value": argu1
                })
            }
        }
        return argu2;
    }

    $(document).ready(function() {
        var parentElement = $(".parent");
        $('#SearchSelect').select2({
            placeholder: 'Select',
            allowClear: true,
            dropdownParent: parentElement
        })

    })

    $scope.searchFilter = function(val) {
        val = removeEmptyValueKeys(val)

        $scope.fieldArr.start = 0
        $scope.fieldArr.count = len;
        $scope.fieldArr.params = [];

        $scope.adFilter = {
            "filters": {
                "logicalOperator": "AND",
                "groupLvl1": [{
                    "logicalOperator": "AND",
                    "groupLvl2": [{
                        "logicalOperator": "AND",
                        "groupLvl3": []
                    }]
                }]
            },
          
            "sorts":  [{columnName:"ApprovalID",sortOrder:"Desc"}] ,
            "start": $scope.fieldArr.start,
            "count": $scope.fieldArr.count
        }


        for (var i in $scope.fieldArr) {
            if (i == 'sortBy') {
                for (var j in $scope.fieldArr[i]) {
                    $scope.adFilter.sorts.push({ "columnName": $scope.fieldArr[i][j].ColumnName, "sortOrder": $scope.fieldArr[i][j].ColumnOrder })

                }
            }
        }

        for (var j in Object.keys(val)) {
            if (val[Object.keys(val)[j]]) {
                if (Object.keys(val)[j] == 'Status') {
                    for (var i in val[Object.keys(val)[j]]) {
                        $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                            "logicalOperator": "OR",
                            "clauses": [{
                                "columnName": Object.keys(val)[j],
                                "operator": "=",
                                "value": val[Object.keys(val)[j]][i]
                            }]

                        })
                    }
                } else if (Object.keys(val)[j] == 'EffectiveDate') {

                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                            "columnName": "ProcessedOn",
                            "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
                            "value": $('#startDate').val()
                        }]
                    })

                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "AND",
                        "clauses": [{
                            "columnName": "ProcessedOn",
                            "operator": $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
                            "value": $('#endDate').val()
                        }]
                    })

                } else if (Object.keys(val)[j] == 'SearchSelect') {
                    val.SearchSelect = JSON.parse(val.SearchSelect)
                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": [{
                            "columnName": val.SearchSelect.name,
                            "operator": (val.SearchSelect.type == 'select') ? "=" : "LIKE",
                            "value": val.keywordSearch, 
                            'isCaseSensitive' : '0'
                        }]
                    })

                } else if (Object.keys(val)[j] == 'keywordSearch' && !val['SearchSelect']) {

                    $scope.adFilter.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                        "logicalOperator": "OR",
                        "clauses": $scope.buildFilter(val[Object.keys(val)[j]])
                    })

                }
            }
        }
        $scope.loadmoreCalled = false;

        //$scope.initCall($scope.queryForm($scope.fieldArr))
        $scope.readallFn($scope.adFilter)
        setTimeout(function() {
            $('select[name=SearchSelect]').val(null).trigger("change");
        }, 100)
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.showCustom = false;
        $scope.selectedDate = '';

        $('.alert-danger').hide();
        $('.dropdown-menu').removeClass('show'); 
    }

    $scope.clearFilter = function() {

        $('.listView').scrollTop(0)
        $('.alert-danger').hide();

        $scope.fieldArr = {
            "start": 0,
            "count": 20,
            "sortBy": []
        }
        len = 20;
        $scope.loadmoreCalled = false;
        setTimeout(function() {
            $('select[name=SearchSelect]').val(null).trigger("change");
        }, 100)
        $scope.filterParams = {};
        $('.filterBydate').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.selectedStatus = [];
        $('.filterBystatus').each(function() {
            $(this).css({ 'background-color': '#fff', 'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)' })
        })

        $scope.showCustom = false;
        $scope.selectedDate = '';
        // $('.customDropdown').removeClass('open');
        $('.dropdown-menu').removeClass('show'); 

        $scope.readallFn($scope.queryForm($scope.fieldArr))
    }

    $('.DatePicker').datetimepicker({
        format: "YYYY-MM-DD",
        showClear: true,
        icons: datepickerFaIcons.icons
    }).on('dp.change', function(ev) {
        $scope['filterParams'][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val()
    }).on('dp.show', function(ev) {
        $(this).change();
    })

    //jQuery(function ($) {
    $scope.scrollFn = function() {

        $('.listView').bind('scroll', function() {
            if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
                if ($scope.restVal.length >= 20 && $scope.individualReadall) {

                    debounceHandler()
                }
            }
        })
    }

    setTimeout(function() {
            $scope.scrollFn()
        }, 2000)
        //});

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
            if ($(".dataGroupsScroll").scrollTop() == 0) {
                $(".dataGroupsScroll").scrollTop(50)
            }

        })
        $(window).trigger('resize');

    })

    $scope.changeDownloadOption = function (val) {
        $scope.downloadOptions = val;
    }
    
    $scope.enableDownloadBtns = function(format){
        if($scope.downloadOptions == 'All'){
            return configData.exportAsExcel.allFilter.indexOf(format) != -1 ? true : false
        } else{
            return configData.exportAsExcel.currentFilter.indexOf(format) != -1 ? true : false
        }
    }

})
