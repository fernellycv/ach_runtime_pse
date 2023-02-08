var myColors = ["#578ebe", "#e35b5a", "#8775a7", "#6D9B5B", "#ab7019", "#777", "#ff9933", "#ff0066", "#a24e4e", "#607D8B", "#d4638a", "#5d5d96", '#FA58F4', '#0174DF', '#FE642E', '#DF0101', '#64FE2E', '#8A0868', '#585858', '#4C0B5F', '#B18904', '#8A2908', '#F781BE', '#A9F5E1', '#f5a9d4', '#e5acac', '#5b5266', '#bc6145', '#826d31', '#ddd12a', '#b7ace5', '#ace5c4', '#d7e5ac'];

function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}

function compare(a, b) {
    if (a.Currency < b.Currency)
        return -1;
    if (a.Currency > b.Currency)
        return 1;
    return 0;
}

function compareWithName(a, b) {
    if (a.Name < b.Name)
        return -1;
    if (a.Name > b.Name)
        return 1;
    return 0;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function uniques(arr) {
    var a = [];
    if (arr && arr.length > 0) {
        for (var i = 0, l = arr.length; i < l; i++)
            if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                a.push(arr[i]);
    }
    return a;
}

function arr_diff(a1, a2) {

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
};


var originalHt = [{
    'id': 'test2',
    'ht': 265
},
{
    'id': 'CurDis',
    'ht': 260
},
{
    'id': 'MopBar',
    'ht': 260
}, {
    'id': 'sankeyChart',
    'ht': 260
},
{
    'id': 'InboundModal',
    'ht': 600
},
{
    'id': 'test2Custom',
    'ht': 265
},
{
    'id': 'CurDisCustom',
    'ht': 260
},
{
    'id': 'MopBarCustom',
    'ht': 260
}, {
    'id': 'sankeyChartCustom',
    'ht': 260
}, {
    'id': 'Custm1',
    'ht': 260
}, {
    'id': 'Custm2',
    'ht': 260
}]

function findHt(svgId) {
    for (var i in originalHt) {
        if (originalHt[i].id == svgId) {
            return originalHt[i].ht
        }
    }
}

var constructObject = {

    /*Filtering unique Values begins here*/
    getUniqueVal: function (obj, keyName) {
        var uniqueNames = [];
        for (i = 0; i < obj.length; i++) {
            if (uniqueNames.indexOf(obj[i][keyName]) === -1) {
                uniqueNames.push(obj[i][keyName]);
            }
        }
        return uniqueNames;
    },
    /*Filtering unique Values Ends here*/

    /*Constructing Object begins here*/
    constructObj: function (uniqueNames, obj, keyName) {
        var constObj = [];
        for (var i in uniqueNames) {
            var ObjValues = [];
            var TotalCount = TotalAmount = 0;
            for (var index in obj) {
                if (obj[index][keyName] == uniqueNames[i]) {
                    TotalCount += obj[index]['Count'];
                    TotalAmount += obj[index]['Amount'];
                    ObjValues.push(obj[index])
                }
            }
            constObj.push({
                "key": uniqueNames[i],
                "Amount": TotalAmount,
                "Count": TotalCount,
                "values": ObjValues
            })
        }

        return constObj;
    },
    /*Constructing Object Ends here*/
    constructTree: function (key, obj) {
        var treeObjFull = [];
        for (var i in obj) {
            if (key == obj[i].Name) {
                treeObjFull.push(obj[i])
            }
        }

        var treeObj = [];
        for (var i in treeObjFull) {
            treeObj.push({ 'name': treeObjFull[i].Currency + "(" + treeObjFull[i].Count + ")", 'parent': key })
        }
        return treeObj;
    },
    /*Constructing Object begins here --- File List*/
    constructObj1: function (uniqueNames, obj, keyName) {

        var constObj = [];
        for (var i in uniqueNames) {
            var ObjValues = [];
            var TotalCount = TotalAmount = 0;
            for (var index in obj) {
                if ((obj[index][keyName]) && (obj[index][keyName] == uniqueNames[i])) {
                    TotalCount += obj[index]['Count'];
                    TotalAmount += obj[index]['Amount'];
                }
            }
            if (uniqueNames[i]) {
                constObj.push({
                    "Name": uniqueNames[i],
                    "Amount": TotalAmount,
                    "Count": TotalCount
                    //"values": ObjValues
                })
            }
        }
        return constObj;
    },
    /*Constructing Object Ends here*/

    currencyWiseTotal: function (uniqCur, obj, keyName) {

        var constObj1 = [];
        for (var i in uniqCur) {
            var ObjValues1 = [];
            var TotalCount1 = TotalAmount1 = 0;
            var Currency = '';

            for (var index in obj) {
                if (obj[index][keyName] == uniqCur[i]) {
                    TotalCount1 += obj[index]['Count'];
                    TotalAmount1 += obj[index]['Amount'];
                    Currency = uniqCur[i];
                }
            }

            constObj1.push({ "Count": TotalCount1, "Amount": TotalAmount1, "Currency": Currency, "Ratio": "100%" })
        }

        return constObj1;
    },
    MOPWiseTotal: function (uniqCur, obj, keyName) {
        var constObj1 = [];
        for (var i in uniqCur) {
            var ObjValues1 = [];
            var TotalCount1 = TotalAmount1 = 0;
            var Currency = '';

            for (var index in obj) {
                if (obj[index][keyName] == uniqCur[i]) {
                    TotalCount1 += obj[index]['Count'];
                    TotalAmount1 += obj[index]['Amount'];
                    Currency = uniqCur[i];
                }
            }

            constObj1.push({ "Count": TotalCount1, "Amount": TotalAmount1, "Name": Currency, "Ratio": "100%" })
        }

        return constObj1;
    },

    /*Calculate Total Begins here*/
    calcTotal: function (objName, val) {
        var getTotal = 0;
        for (var k in objName) {
            getTotal += objName[k][val]
        }
        return getTotal
    },
    /*Calculate Total Ends here*/

}

function GlobalAllPaymentReset(GlobalService, AllPaymentsGlobalData) {

    GlobalService.logoutMessage = true;
    GlobalService.fileSrcChannelList = '';
    GlobalService.advancedSrcChannel = false;
    GlobalService.viewFlag = !0, GlobalService.FLuir = "", GlobalService.all = !0, GlobalService.today = !1, GlobalService.week = !1, GlobalService.month = !1, GlobalService.custom = !1, GlobalService.todayDate = "", GlobalService.weekStart = "", GlobalService.weekEnd = "", GlobalService.monthStart = "", GlobalService.monthEnd = "", GlobalService.selectCriteriaTxt = "All", GlobalService.selectCriteriaID = 1, GlobalService.prev = "all", GlobalService.prevSelectedTxt = "all", GlobalService.prevId = 1, GlobalService.startDate = "", GlobalService.endDate = "", GlobalService.ShowStartDate = "", GlobalService.ShowEndDate = "", GlobalService.searchClicked = !1, GlobalService.isEntered = !1, GlobalService.advancedSearch = !0, GlobalService.advancedSearchEnable = !1,

    GlobalService.searchNameDuplicated = !1, GlobalService.SelectSearchVisible = !1, GlobalService.searchname = "", GlobalService.myProfileFLindex = "",

    GlobalService.searchParams = {
        "InstructionData": {
            "EntryDate": {
                "Start": "",
                "End": ""
            }
        }
    };

    AllPaymentsGlobalData.myProfileFLindex = "", AllPaymentsGlobalData.orderByField = "ReceivedDate", AllPaymentsGlobalData.sortReverse = !1, AllPaymentsGlobalData.sortType = "Desc", AllPaymentsGlobalData.isSortingClicked = !1, AllPaymentsGlobalData.DataLoadedCount = 20, AllPaymentsGlobalData.all = !0, AllPaymentsGlobalData.today = !1, AllPaymentsGlobalData.week = !1, AllPaymentsGlobalData.month = !1, AllPaymentsGlobalData.custom = !1, AllPaymentsGlobalData.FLuir = "", AllPaymentsGlobalData.startDate = "", AllPaymentsGlobalData.endDate = "", AllPaymentsGlobalData.ShowStartDate = "", AllPaymentsGlobalData.ShowEndDate = "", AllPaymentsGlobalData.todayDate = "", AllPaymentsGlobalData.weekStart = "", AllPaymentsGlobalData.weekEnd = "", AllPaymentsGlobalData.monthStart = "", AllPaymentsGlobalData.monthEnd = "", AllPaymentsGlobalData.selectCriteriaTxt = "All", AllPaymentsGlobalData.selectCriteriaID = 1, AllPaymentsGlobalData.prev = "all", AllPaymentsGlobalData.prevSelectedTxt = "all", AllPaymentsGlobalData.prevId = 1, AllPaymentsGlobalData.searchClicked = !1, AllPaymentsGlobalData.isEntered = !1, AllPaymentsGlobalData.advancedSearchEnable = !1, AllPaymentsGlobalData.uirTxtValue = "", AllPaymentsGlobalData.searchNameDuplicated = !1, AllPaymentsGlobalData.SelectSearchVisible = !1, AllPaymentsGlobalData.searchname = "",

    AllPaymentsGlobalData.searchParams = {
        "InstructionData": {
            "ReceivedDate": {
                "Start": "",
                "End": ""
            },
            "ValueDate": {
                "Start": "",
                "End": ""
            },
            "Amount": {
                "Start": "",
                "End": ""
            }
        }
    }

    GlobalService.orderByField = 'EntryDate';
    GlobalService.sortReverse = false;
    GlobalService.sortType = 'Desc';
    GlobalService.isSortingClicked = false;
    GlobalService.DataLoadedCount = 20;

    GlobalService.sidebarCurrentVal = "";
    GlobalService.sidebarSubVal = "";
}

function dBoardtoFileList(GlobalService, status, PSACode, flag) {

    GlobalService.orderByField = 'EntryDate';
    GlobalService.sortReverse = false;
    GlobalService.sortType = 'Desc';
    GlobalService.isSortingClicked = false;
    GlobalService.DataLoadedCount = 20;
    GlobalService.responseMessage = "";
    GlobalService.UniqueRefID = -1;
    GlobalService.fileListIndex = -1;
    GlobalService.viewFlag = true;
    GlobalService.FLuir = '';
    GlobalService.all = true;
    GlobalService.today = false;
    GlobalService.week = false;
    GlobalService.month = false;
    GlobalService.custom = false;
    GlobalService.todayDate = '';
    GlobalService.weekStart = '';
    GlobalService.weekEnd = '';
    GlobalService.monthStart = '';
    GlobalService.monthEnd = '';
    GlobalService.selectCriteriaTxt = 'All';
    GlobalService.selectCriteriaID = 1;
    GlobalService.prev = 'all';
    GlobalService.prevSelectedTxt = 'all';
    GlobalService.prevId = 1;
    GlobalService.startDate = '';
    GlobalService.endDate = '';
    GlobalService.ShowStartDate = '';
    GlobalService.ShowEndDate = '';
    GlobalService.searchClicked = false;
    GlobalService.isEntered = false;
    GlobalService.searchNameDuplicated = false;
    GlobalService.SelectSearchVisible = false;
    GlobalService.searchname = '';
    GlobalService.fromMyProfilePage = false;
    GlobalService.editRuleBuilder = '';
    GlobalService.viewFlag = true;
    GlobalService.advancedSearchEnable = true;
    GlobalService.advancedSearch = true;
    GlobalService.advancedFileStatus = true;
    GlobalService.ViewClicked = true;
    GlobalService.fromDashboard = true;

    if (flag) {
        callCurrencyDis(GlobalService, status)
    } else {
        callThis(GlobalService, PSACode, status)
    }
}

function callThis(GlobalService, PSACode, status) {
    if (PSACode) {
        GlobalService.FieldArr = ["FileStatus=" + status, "InputReferenceCode=" + PSACode];
        GlobalService.searchParams = {
            "InputReferenceCode": [PSACode],
            "FileStatus": [status]
        }
    } else {
        GlobalService.FieldArr = ["FileStatus=" + status];
        GlobalService.searchParams = {
            "FileStatus": status
        }
    }
}

function callCurrencyDis(GlobalService, data) {
    GlobalService.FieldArr = ["InputReferenceCode=" + data.psa, "Currency=" + data.Cur];
    GlobalService.searchParams = {
        "InputReferenceCode": [data.psa],
        "Currency": [data.Cur]
    }
}

function srcChannelLegenColorGen(val) {
    var dumObj = {};
    var dumArr = [];
    var aaArr = [];

    for (var i = 0; i < val.length; i++) {
        dumArr.push(val[i].Name)
    }

    var unique = [];
    for (var i = 0; i < dumArr.length; i++) {
        if (unique.indexOf(dumArr[i]) == -1) {
            unique.push(dumArr[i]);
        }
    }

    for (var i = 0; i < unique.length; i++) {

        dumObj[i] = {};
        dumObj[i].Name = unique[i];
        dumObj[i].Currency = [];

        for (var j = 0; j < dumArr.length; j++) {
            if (val[j].Name == unique[i]) {

                dumObj[i].Currency.push({ "Cur": val[j].Currency, "Amount": val[j].Amount, "Count": val[j].Count, "color": myColors[j] })
            }
        }
    }
    return dumObj;
}

function filteredReset(AllPaymentsGlobalData) {
    AllPaymentsGlobalData.advancedSearchEnable = true;
    AllPaymentsGlobalData.fromDashboard = !0, AllPaymentsGlobalData.DataLoadedCount = 20, AllPaymentsGlobalData.FLuir = "", AllPaymentsGlobalData.SelectSearchVisible = !1, AllPaymentsGlobalData.ShowEndDate = "", AllPaymentsGlobalData.ShowStartDate = "", AllPaymentsGlobalData.all = !0,

    AllPaymentsGlobalData.custom = !1, AllPaymentsGlobalData.endDate = "", AllPaymentsGlobalData.isEntered = !1, AllPaymentsGlobalData.isSortingClicked = !1, AllPaymentsGlobalData.month = !1, AllPaymentsGlobalData.monthEnd = "", AllPaymentsGlobalData.monthStart = "", AllPaymentsGlobalData.myProfileFLindex = "", AllPaymentsGlobalData.orderByField = "ReceivedDate", AllPaymentsGlobalData.prev = "all", AllPaymentsGlobalData.prevId = 1, AllPaymentsGlobalData.prevSelectedTxt = "all", AllPaymentsGlobalData.searchClicked = !1, AllPaymentsGlobalData.searchNameDuplicated = !1, AllPaymentsGlobalData.searchname = "", AllPaymentsGlobalData.selectCriteriaID = 1, AllPaymentsGlobalData.selectCriteriaTxt = "All", AllPaymentsGlobalData.sortReverse = !1, AllPaymentsGlobalData.sortType = "Desc", AllPaymentsGlobalData.startDate = "", AllPaymentsGlobalData.today = !1, AllPaymentsGlobalData.todayDate = "", AllPaymentsGlobalData.uirTxtValue = "", AllPaymentsGlobalData.week = !1, AllPaymentsGlobalData.weekEnd = "", AllPaymentsGlobalData.weekStart = "";
}

var navFunctions = {

    forSrcChannel: function (val, AllPaymentsGlobalData) {

        if (val.key) {
            if ((val.key != 'TOTAL COUNT') && (val.key != 'TOTAL AMOUNT')) {
                AllPaymentsGlobalData.FromDashboardFieldArr = ['PartyServiceAssociationCode=' + val.Name, 'Currency=' + val.Currency];

                AllPaymentsGlobalData.FieldArr = ['PartyServiceAssociationCode=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Currency": [val.Currency],
                    "PartyServiceAssociationCode": [val.Name]
                }
            } else {

                AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + val.Currency];

                AllPaymentsGlobalData.FieldArr = ['Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Currency": [val.Currency]
                }
            }
        } else {

            AllPaymentsGlobalData.FromDashboardFieldArr = ['PartyServiceAssociationCode=' + val.Name, 'Currency=' + val.Currency];

            AllPaymentsGlobalData.FieldArr = ['PartyServiceAssociationCode=' + val.Name, 'Currency=' + val.Currency];
            AllPaymentsGlobalData.searchParams = {
                "Currency": [val.Currency],
                "PartyServiceAssociationCode": [val.Name]
            }
        }

        filteredReset(AllPaymentsGlobalData)
    },
    forPaymentStatus: function (val, AllPaymentsGlobalData) {

        if (val.key) {
            if ((val.key != 'TOTAL COUNT') && (val.key != 'TOTAL AMOUNT')) {
                AllPaymentsGlobalData.FieldArr = ['Status=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [val.Name],
                    "Currency": [val.Currency]
                }
            } else {
                AllPaymentsGlobalData.FieldArr = ['Currency=' + val.Currency];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Currency": [val.Currency]
                }
            }
        } else {
            if (val.Currency) {
                AllPaymentsGlobalData.FieldArr = ['Status=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [val.Name],
                    "Currency": [val.Currency]
                }
            } else {
                AllPaymentsGlobalData.FieldArr = ['Status=' + val.Name];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + val.Name];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [val.Name]
                }
            }
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forPaymentStatusalone: function (val, AllPaymentsGlobalData) {
        if (val.key) {
            if ((val.key != 'TOTAL COUNT') && (val.key != 'TOTAL AMOUNT')) {
                AllPaymentsGlobalData.FieldArr = ['Status=' + val.Name];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + val.Name];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [val.Name]
                }
            }
        } else {
            if (val.Currency) {
                AllPaymentsGlobalData.FieldArr = ['Status=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [val.Name],
                    "Currency": [val.Currency]
                }
            } else {
                AllPaymentsGlobalData.FieldArr = ['Status=' + val.Name];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + val.Name];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [val.Name]
                }
            }
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forMOP: function (val, AllPaymentsGlobalData) {
        if (val.key) {
            if ((val.key != 'TOTAL COUNT') && (val.key != 'TOTAL AMOUNT')) {

                AllPaymentsGlobalData.FromDashboardFieldArr = ['MethodOfPayment=' + val.Name, 'Currency=' + val.Currency];
                AllPaymentsGlobalData.FieldArr = ['MethodOfPayment=' + val.Name, 'Currency=' + val.Currency];

                AllPaymentsGlobalData.searchParams = {
                    "MethodOfPayment": [val.Name],
                    "Currency": [val.Currency]
                }
            } else {
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + val.Currency];
                AllPaymentsGlobalData.FieldArr = ['Currency=' + val.Currency];
                AllPaymentsGlobalData.searchParams = {
                    "Currency": [val.Currency]
                }
            }
        } else {
            AllPaymentsGlobalData.FromDashboardFieldArr = ['MethodOfPayment=' + val.Name, 'Currency=' + val.Currency];
            AllPaymentsGlobalData.FieldArr = ['MethodOfPayment=' + val.Name, 'Currency=' + val.Currency];
            AllPaymentsGlobalData.searchParams = {
                "MethodOfPayment": [val.Name],
                "Currency": [val.Currency]
            }
        }
        filteredReset(AllPaymentsGlobalData)
    }
}

var sankeyNavfunctions = {

    forSrcChannel: function (status, currency, AllPaymentsGlobalData) {

        AllPaymentsGlobalData.FromDashboardFieldArr = ['PartyServiceAssociationCode=' + status, 'Currency=' + currency];
        AllPaymentsGlobalData.FieldArr = ['PartyServiceAssociationCode=' + status, 'Currency=' + currency];

        AllPaymentsGlobalData.searchParams = {
            "Currency": [currency],
            "PartyServiceAssociationCode": [status]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forPaymentStatus: function (status, currency, AllPaymentsGlobalData) {

        AllPaymentsGlobalData.FieldArr = ['Status=' + status, 'Currency=' + currency];
        AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status, 'Currency=' + currency];
        AllPaymentsGlobalData.searchParams = {
            "Status": [status],
            "Currency": [currency]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forMOP: function (status, currency, AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FromDashboardFieldArr = ['MethodOfPayment=' + status, 'Currency=' + currency];
        AllPaymentsGlobalData.FieldArr = ['MethodOfPayment=' + status, 'Currency=' + currency];
        AllPaymentsGlobalData.searchParams = {
            "MethodOfPayment": [status],
            "Currency": [currency]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forSrcChannelRect: function (e, AllPaymentsGlobalData) {

        AllPaymentsGlobalData.FromDashboardFieldArr = ['PartyServiceAssociationCode=' + e.name];
        AllPaymentsGlobalData.FieldArr = ['PartyServiceAssociationCode=' + e.name];

        AllPaymentsGlobalData.searchParams = {
            "PartyServiceAssociationCode": [e.name]

        }
        filteredReset(AllPaymentsGlobalData)
    },
    forPaymentStatusRect: function (status, AllPaymentsGlobalData) {

        AllPaymentsGlobalData.FieldArr = ['Status=' + status];
        AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status];
        AllPaymentsGlobalData.searchParams = {
            "Status": [status]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forMOPRect: function (e, AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FromDashboardFieldArr = ['MethodOfPayment=' + e.name];
        AllPaymentsGlobalData.FieldArr = ['MethodOfPayment=' + e.name];
        AllPaymentsGlobalData.searchParams = {
            "MethodOfPayment": [e.name]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forCurrencyRect: function (currency, AllPaymentsGlobalData) {

        AllPaymentsGlobalData.FieldArr = ['Currency=' + currency];
        AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + currency];
        AllPaymentsGlobalData.searchParams = {
            "Currency": [currency]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forResetRect: function (AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FieldArr = [];
        AllPaymentsGlobalData.FromDashboardFieldArr = [];
        AllPaymentsGlobalData.searchParams = {
            "PartyServiceAssociationCode": []
        };
        filteredReset(AllPaymentsGlobalData)
    }
}

var horizontalSankey = {
    forSrcChannel: function (currency, e, AllPaymentsGlobalData) {
        var status, currency;
        if (currency != 'TOTAL') {
            status = e.source.name;
            currency = e.target.name;
            AllPaymentsGlobalData.FromDashboardFieldArr = ['PartyServiceAssociationCode=' + status, 'Currency=' + currency];
            AllPaymentsGlobalData.FieldArr = ['PartyServiceAssociationCode=' + status, 'Currency=' + currency];
            AllPaymentsGlobalData.searchParams = {
                "Currency": [currency],
                "PartyServiceAssociationCode": [status]
            }
        } else {
            currency = e.source.name;
            AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + currency];
            AllPaymentsGlobalData.FieldArr = ['Currency=' + currency];
            AllPaymentsGlobalData.searchParams = {
                "Currency": [currency],
            }
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forPaymentStatus: function (id, currency, e, AllPaymentsGlobalData) {

        AllPaymentsGlobalData.isAtchdandBIdBasedSearchClicked = false;
        var status, currency;
        if (currency != 'TOTAL') {
            if ((id == 'sankeyChart') || (id == 'sankeyChartCustom')) {
                status = e.source.name;
                currency = e.target.name;
            } else {
                status = e.source.name;
                currency = e.target.name;
            }
            AllPaymentsGlobalData.FieldArr = ['Status=' + status, 'Currency=' + currency];
            AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status, 'Currency=' + currency];
            AllPaymentsGlobalData.searchParams = {
                "Status": [status],
                "Currency": [currency]
            }
        } else {
            if ((id == 'CurDis') || (id == 'CurDisCustom')) {
                currency = e.source.name;
                AllPaymentsGlobalData.FieldArr = ['Currency=' + currency];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + currency];
                AllPaymentsGlobalData.searchParams = {
                    "Currency": [currency]
                }
            } else {
                status = e.source.name;

                AllPaymentsGlobalData.FieldArr = ['Status=' + status];
                AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status];
                AllPaymentsGlobalData.searchParams = {
                    "Status": [status]
                }
            }
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forMOP: function (currency, e, AllPaymentsGlobalData) {
        var status, currency;

        if (currency != 'TOTAL') {
            status = e.source.name;
            currency = e.target.name;
            AllPaymentsGlobalData.FromDashboardFieldArr = ['MethodOfPayment=' + e.source.name, 'Currency=' + e.target.name];
            AllPaymentsGlobalData.FieldArr = ['MethodOfPayment=' + e.source.name, 'Currency=' + e.target.name];
            AllPaymentsGlobalData.searchParams = {
                "MethodOfPayment": [e.source.name],
                "Currency": [e.target.name]
            }
        } else {
            AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + e.source.name];
            AllPaymentsGlobalData.FieldArr = ['Currency=' + e.source.name];
            AllPaymentsGlobalData.searchParams = {
                "Currency": [e.source.name]
            }
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forSrcChannelRect: function (e, AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FromDashboardFieldArr = ['PartyServiceAssociationCode=' + e.name];
        AllPaymentsGlobalData.FieldArr = ['PartyServiceAssociationCode=' + e.name];
        AllPaymentsGlobalData.searchParams = {
            "PartyServiceAssociationCode": [e.name]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forPaymentStatusRect: function (e, AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FieldArr = ['Status=' + e.name];
        AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + e.name];
        AllPaymentsGlobalData.searchParams = {
            "Status": [e.name]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forMOPRect: function (e, AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FromDashboardFieldArr = ['MethodOfPayment=' + e.name];
        AllPaymentsGlobalData.FieldArr = ['MethodOfPayment=' + e.name];
        AllPaymentsGlobalData.searchParams = {
            "MethodOfPayment": [e.name]
        }
        filteredReset(AllPaymentsGlobalData)
    },
    forCurrencyRect: function (e, AllPaymentsGlobalData) {
        AllPaymentsGlobalData.FieldArr = ['Currency=' + e.name];
        AllPaymentsGlobalData.FromDashboardFieldArr = ['Currency=' + e.name];
        AllPaymentsGlobalData.searchParams = {
            "Currency": [e.name]
        }
        filteredReset(AllPaymentsGlobalData)
    }
}

// Horizontal Sankey Chart
function d3sankey() {

    var sankey = {},
        nodeWidth = 20,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function (_) {
        if (!arguments.length)
            return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };

    sankey.nodePadding = function (_) {
        if (!arguments.length)
            return nodePadding;
        nodePadding = +_;
        return sankey;
    };

    sankey.nodes = function (_) {
        if (!arguments.length)
            return nodes;
        nodes = _;
        return sankey;
    };

    sankey.links = function (_) {
        if (!arguments.length)
            return links;
        links = _;
        return sankey;
    };

    sankey.size = function (_) {
        if (!arguments.length)
            return size;
        size = _;
        return sankey;
    };

    sankey.layout = function (iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
    };

    sankey.link = function () {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.sy + d.dy / 2,
                y1 = d.target.y + d.ty + d.dy / 2;
            return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
        }

        link.curvature = function (_) {
            if (!arguments.length)
                return curvature;
            curvature = +_;
            return link;
        };

        return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function (node) {

            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function (link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number")
                source = link.source = nodes[link.source];
            if (typeof target === "number")
                target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(
                d3.sum(node.sourceLinks, value),
                d3.sum(node.targetLinks, value));
        });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes,
            nextNodes,
            x = 0;
        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
                node.x = x;
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function (link) {
                    nextNodes.push(link.target);
                });
            });
            remainingNodes = nextNodes;
            ++x;
        }

        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
        nodes.forEach(function (node) {
            if (!node.targetLinks.length) {
                node.x = d3.min(node.sourceLinks, function (d) {
                    return d.target.x;
                }) - 1;
            }
        });
    }

    function moveSinksRight(x) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.x = x - 1;
            }
        });
    }

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.x *= kx;
        });
    }

    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function (d) {
                return d.x;
            })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function (d) {
                return d.values;
            });

        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
            relaxRightToLeft(alpha *= .99);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
        }

        function initializeNodeDepth() {
            var ky = d3.min(nodesByBreadth, function (nodes) {
                return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
            });

            nodesByBreadth.forEach(function (nodes) {
                nodes.forEach(function (node, i) {
                    node.y = i;
                    node.dy = node.value * ky;
                });
            });

            links.forEach(function (link) {
                link.dy = link.value * ky;
            });
        }

        function relaxLeftToRight(alpha) {
            nodesByBreadth.forEach(function (nodes, breadth) {
                nodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedSource(link) {
                return center(link.source) * link.value;
            }
        }

        function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedTarget(link) {
                return center(link.target) * link.value;
            }
        }

        function resolveCollisions() {
            nodesByBreadth.forEach(function (nodes) {
                var node,
                    dy,
                    y0 = 0,
                    n = nodes.length,
                    i;

                // Push any overlapping nodes down.
                nodes.sort(ascendingDepth);
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0)
                        node.y += dy;
                    y0 = node.y + node.dy + nodePadding;
                }

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];
                if (dy > 0) {
                    y0 = node.y -= dy;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0)
                            node.y -= dy;
                        y0 = node.y;
                    }
                }
            });
        }

        function ascendingDepth(a, b) {
            return a.y - b.y;
        }
    }

    function computeLinkDepths() {
        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
            var sy = 0,
                ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }
    }

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    return sankey;
};

//Vertical Sankey Chart
function d3VerticalSankey() {

    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8, // was 8, needs to be much bigger. these numbers are actually overwritten in the html when we instantiate the viz!
        size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function (_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };

    sankey.nodePadding = function (_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
    };

    sankey.nodes = function (_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
    };

    sankey.links = function (_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
    };

    sankey.size = function (_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
    };

    sankey.layout = function (iterations) {
        computeNodeLinks();
        computeNodeValues();

        computeNodeDepths();
        computeNodeBreadths(iterations);

        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
    };

    sankey.link = function () {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.sy + d.dy / 2,
                x1 = d.target.x + d.ty + d.dy / 2,
                y0 = d.source.y + nodeWidth,
                y1 = d.target.y,
                yi = d3.interpolateNumber(y0, y1),
                y2 = yi(curvature),
                y3 = yi(1 - curvature);

            // ToDo - nice to have - allow flow up or down! Plenty of use cases for starting at the bottom,
            // but main one is trickle down (economics, budgets etc), not up

            return "M" + x0 + "," + y0 // start (of SVG path)
                +
                "C" + x0 + "," + y2 // CP1 (curve control point)
                +
                " " + x1 + "," + y3 // CP2
                +
                " " + x1 + "," + y1; // end
        }

        link.curvature = function (_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
        };

        return link;
    };

    function computeNodeLinks() {
        nodes.forEach(function (node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function (link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(
                d3.sum(node.sourceLinks, value),
                d3.sum(node.targetLinks, value)
            );
        });
    }

    function computeNodeBreadths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function (d) { return d.y; })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function (d) { return d.values; }); // values! we are using the values also as a way to seperate nodes (not just stroke width)?

        var ky = (size[0] - (nodesByBreadth[0].length - 1) * nodePadding) / d3.sum(nodesByBreadth[0], value);
        nodesByBreadth.forEach(function (nodes) {
            nodes.forEach(function (node, i) {
                node.x = i;
                node.dy = node.value * ky;
            });
        });

        links.forEach(function (link) {
            link.dy = link.value * ky;
        });

        resolveCollisions();

        for (var alpha = 1; iterations > 0; --iterations) {
            relaxLeftToRight(alpha);
            resolveCollisions();

            relaxRightToLeft(alpha *= .99);
            resolveCollisions();
        }

        function relaxLeftToRight(alpha) {
            nodesByBreadth.forEach(function (nodes, breadth) {
                nodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                        node.x += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedSource(link) {
                return center(link.source) * link.value;
            }
        }

        function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                        node.x += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedTarget(link) {
                return center(link.target) * link.value;
            }
        }

        function resolveCollisions() {
            nodesByBreadth.forEach(function (nodes) {
                var node,
                    dy,
                    x0 = 0,
                    n = nodes.length,
                    i;

                nodes.sort(ascendingDepth);
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = x0 - node.x;
                    if (dy > 0) node.x += dy;
                    x0 = node.x + node.dy + nodePadding;
                }

                dy = x0 - nodePadding - size[0]; // was size[1]
                if (dy > 0) {
                    x0 = node.x -= dy;
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.x + node.dy + nodePadding - x0; // was y0
                        if (dy > 0) node.x -= dy;
                        x0 = node.x;
                    }
                }
            });
        }

        function ascendingDepth(a, b) {
            return b.x - a.x; // flows go down
        }
    }

    function moveSinksDown(y) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.y = y - 1;
            }
        });
    }

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.y *= kx;
        });
    }

    function computeNodeDepths() {
        var remainingNodes = nodes,
            nextNodes,
            y = 0;

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
                node.y = y;
                node.sourceLinks.forEach(function (link) {
                    if (nextNodes.indexOf(link.target) < 0) {
                        nextNodes.push(link.target);
                    }
                });
            });
            remainingNodes = nextNodes;
            ++y;
        }
        moveSinksDown(y);

        scaleNodeBreadths((size[1] - nodeWidth) / (y - 1));
    }

    function computeLinkDepths() {
        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
            var sy = 0,
                ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.x - b.source.x;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.x - b.target.x;
        }
    }

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    return sankey;
};

//Maintain dashboard top widgets size
function mediaMatches() {


    // var mq = window.matchMedia("(max-width: 991px)");
    // if (mq.matches) {
    //     $('.widgetVisual').css({ 'padding-top': "10px" })
    //     $('.DboardFont').css({ 'line-height': "86px" })
    //     if ((($('.statusBox').width() * 13) / 100) > 83) {
    //         $('.DboardFont').css({ 'font-size': "65px" })
    //     } else {
    //         $('.DboardFont').css({ 'font-size': ($('.statusBox').width() * 13) / 100 + "px" })
    //     }

    //     if ((((($('.statusBox').width() * 35) / 100) / 10) > 23) || (((($('.statusBox').width() * 35) / 100) / 10) < 13)) {
    //         $('.payStatus').css('font-size', "18px")
    //     }
    //     else {
    //         $('.payStatus').css('font-size', (($('.statusBox').width() * 35) / 100) / 8 + "px")
    //     }
    // }
    // else {

    //     $('.widgetVisual').css({ 'padding-top': ($('.statusBox').width() * 15 / 100) / 5 + "px" })
    //     if (($('.statusBox').width() * 38 / 100) > 90) {
    //         $('.DboardFont').css({ 'line-height': "80px" })
    //         $('.DboardFont').css({ 'font-size': "65px" })
    //     }
    //     else {

    //         $('.DboardFont').css({ 'line-height': ($('.statusBox').width() * 32 / 100) + "px" })
    //         $('.DboardFont').css({ 'font-size': ($('.statusBox').width() * 27) / 100 + "px" })
    //     }

    //     if (($('.statusBox').width() * 18 / 100) / 2 > 17) {
    //         $('.payStatus').css('font-size', "17px")
    //         // $('.details').css({ 'padding-right': '15px' })
    //     }
    //     if (($('.statusBox').width() * 18 / 100) / 2 < 13) {
    //         $('.payStatus').css('font-size', "14px")
    //         // $('.details').css({ 'padding-right': '5px' })
    //     }
    // }
}

var paymentStatusColor = [{ "Status": "REPAIR", "Color": "#e35b5a" }, { "Status": "WAREHOUSED", "Color": "#8775a7" }, { "Status": "FOR_BULKING", "Color": "#ab7019" }, { "Status": "WAITING", "Color": "#6D9B5B" }, { "Status": "HOLD", "Color": "#F97108" }, { "Status": "WAITFORAPPROVAL", "Color": "#777" }, { "Status": "COMPLETED", "Color": "#5d5d96" }, { "Status": "APPROVED", "Color": "#ff9933" }, { "Status": "REPAIRAPPROVED", "Color": "#ff0066" }, { "Status": "DELETED", "Color": "#607D8B" }, { "Status": "TOBEDELETED", "Color": "#d4638a" }, { "Status": "WAITATCHECKPOINT", "Color": "#1d5286" }, { "Status": "REJECTED", "Color": "#bb2f5e" }, { "Status": "DUPLICATE", "Color": "#ff9933" }, { "Status": "REPAIRED", "Color": "#3d6577" }, { "Status": "BULKING_INPROGRESS", "Color": "#53878c" }, { "Status": "TOBEPROCESSED", "Color": "#6f574f" }, { "Status": "IN_PROGRESS", "Color": "#6d7521" }, { "Status": "RECOVERY", "Color": "#009688" }, { "Status": "INVESTIGATION", "Color": "#f96899" }, { "Status": "RISK_FILTER_HOLD", "Color": "#00B8D4" }, { "Status": "WAITING_OFACRESPONSE", "Color": "#009688" }, { "Status": "REPAIR-WAITFORUSERACTION", "Color": "#1565C0" }]

var commonFunctions = {

    textForPie: function (arg) {
        var totCount = 0;
        var totInboundAmt = 0;
        var cenTxt, cenVal;
        var parId;
        //   var cntAmt;
        if (arg.id == 'test2') {
            parId = 'inbndChart';
        } else if (arg.id == 'CurDis') {
            parId = 'pymtCurDisChart'
        }

        angular.forEach(arg.data, function (value, key) {
            totCount = totCount + value[arg.donutData];
        })

        totCount = arg.filter('currency')(totCount, '', 0);
        cenVal = totCount;
        if (arg.id == 'InboundModal') {
            $(sanitize('#InboundTotalforModal')).html($(sanitize('#resizeWindow')).find('.caption').find('span').text() + " - " + name + ' (' + cenVal + ')')
        } else if ((arg.id == 'test2') || (arg.id == 'test2Custom')) {
            parId = 'inbndChart';

            $('#' + parId).find('.InboundTotal').html("Inbound Payments - " + name + ' (' + cenVal + ')')
        } else if ((arg.id == 'CurDis') || (arg.id == 'CurDisCustom')) {
            parId = 'pymtCurDisChart'
            $('#' + parId).find('.InboundTotal').html("Payments Currency Distribution  - " + name + ' (' + cenVal + ')')
        } else if ((arg.id == 'MopBar') || (arg.id == 'MopBarCustom')) {
            parId = 'MOPDist';
            $('#' + parId).find('.InboundTotal').html("Method of Payment  - " + name + ' (' + cenVal + ')')
        } else if ((arg.id == 'sankeyChart') || (arg.id == 'sankeyChartCustom')) {
            parId = 'paymentStatusDist';
            $('#' + parId).find('.InboundTotal').html("Payment Status  - " + name + ' (' + cenVal + ')')
        }
    },
    centerTextforDonut: function (arg) {

        var totCount = 0;
        var totInboundAmt = 0;
        var fontSize;

        if (arg.id != 'InboundModal') {
            fontSize = 14;
        } else {
            fontSize = 20;
        }
        d3.select('#' + arg.id).selectAll('text').each(function () {
            if ($(this).attr('class') == 'middle') {
                d3.select(this).each(function () {
                    $(this).text('')
                    $(this).html('')
                })
            }
        })
        var cenTxt, cenVal;
        return function () {
            var svg = d3.select("#" + arg.id);
            var donut = svg.selectAll("g.nv-slice").filter(
                function (d, i) {
                    return i == 0;
                });
            // Insert second line of text into middle of donut pie chart

            angular.forEach(arg.data, function (value, key) {
                totCount = totCount + value[arg.selectVal];
            })
            totCount = arg.filter('currency')(totCount, '', 0);

            cenTxt = arg.selectVal;
            cenVal = totCount;
            if (arg.selectVal == 'Count') { cenTxt = 'Total Count'; } else if (arg.selectVal == 'Amount') { cenTxt = 'Total Inbound'; }

            donut.insert("text", "g")
                .text(cenTxt).attr("class", "middle").attr("text-anchor", "middle").attr("dy", "-.55em")
                .style("fill", "#000").style("font-size", fontSize + "px").style("font-family", "'Open Sans', sans-serif");

            donut.insert("text", "g")
                .text(cenVal).attr("class", "middle").attr("text-anchor", "middle").attr("dy", ".85em")
                .style("fill", "#000").style("font-size", fontSize - 2 + "px").style("font-family", "'Open Sans', sans-serif")

            return arg.selectVal;
        }
    },
    selectStatuscolor: function (status) {
        for (i in paymentStatusColor) {
            if (status == paymentStatusColor[i].Status) {
                return paymentStatusColor[i].Color
            }
        }
    },
    currencySymbol: function (cur, Amt, $filter) {

        currencyVal = $filter('isoCurrency')(Amt, cur, 'Symbolfalse')
        // currencyVal = Amt;
        return currencyVal;
    },

    formatingData: function (dupDataSrcChannel) {
        var uniqChannel = '';
        var uniqChannel1 = [];

        for (var i in dupDataSrcChannel) {
            uniqChannel1.push(dupDataSrcChannel[i].Name)
        }

        uniqChannel = uniques(uniqChannel1)
        var resetData = [];
        var aaArr = [];

        for (var i in uniqChannel) {
            resetData = [];
            for (var j in dupDataSrcChannel) {
                if (uniqChannel[i] == dupDataSrcChannel[j].Name) {
                    resetData.push(dupDataSrcChannel[j])
                }
            }
            aaArr.push(resetData)
        }
        var channelArr = [];
        var category = [];
        for (var i in aaArr) {
            category = [];
            for (var j in aaArr[i]) {
                category.push({ 'Name': aaArr[i][j].Name, 'Count': aaArr[i][j].Count, 'Amount': aaArr[i][j].Amount, "Currency": aaArr[i][j].Currency })
            }
            channelArr.push({ "Name": category[0].Name, "categoryStatus": category })
        }
        var genUnique = '';
        var genUnique1 = [];
        for (var i in channelArr) {
            var hh1 = []
            for (var j in channelArr[i].categoryStatus) {
                genUnique1.push(channelArr[i].categoryStatus[j].Currency);
            }
        }
        genUnique = uniques(genUnique1)
        for (var i in channelArr) {
            var hh1 = [];
            for (var j in channelArr[i].categoryStatus) {
                hh1.push(channelArr[i].categoryStatus[j].Currency);
            }

            var missingStatus = arr_diff(genUnique, hh1);
            for (var k in missingStatus) {
                var toPushObj = {};
                toPushObj.Currency = missingStatus[k];
                toPushObj.Count = 0;
                toPushObj.Amount = 0;
                toPushObj.Name = channelArr[i].Name;

                channelArr[i].categoryStatus.push(toPushObj);
            }
        }
        var formatedData = [];
        for (var i in channelArr) {
            for (var j in channelArr[i].categoryStatus) {
                formatedData.push({ 'Name': channelArr[i].categoryStatus[j].Name, 'Count': channelArr[i].categoryStatus[j].Count, 'Currency': channelArr[i].categoryStatus[j].Currency, 'Amount': channelArr[i].categoryStatus[j].Amount })
            }
        }

        return formatedData;
    },

    forMatforInstn: function (dupDataSrcChannel) {
        var uniqChannel = '';
        var uniqChannel1 = [];

        for (var i in dupDataSrcChannel) {
            if (dupDataSrcChannel[i].Currency) {
                uniqChannel1.push(dupDataSrcChannel[i].PSACode)
            }

        }

        uniqChannel = uniques(uniqChannel1)
        var resetData = [];
        var aaArr = [];

        for (var i in uniqChannel) {
            resetData = [];
            for (var j in dupDataSrcChannel) {
                if (dupDataSrcChannel[j].Currency) {
                    if (uniqChannel[i] == dupDataSrcChannel[j].PSACode) {
                        resetData.push(dupDataSrcChannel[j])
                    }
                }
            }
            aaArr.push(resetData)
        }

        var channelArr = [];
        var category = [];
        for (var i in aaArr) {
            category = [];
            for (var j in aaArr[i]) {

                //  if(aaArr[i].Currency)
                //{
                category.push({ 'Name': aaArr[i][j].PSACode, 'Count': aaArr[i][j].Count, 'Amount': aaArr[i][j].Amount, "Currency": aaArr[i][j].Currency })
                //}

            }

            var uCur = [];
            for (var k in category) {
                uCur.push(category[k].Currency)
            }

            uCur = uniques(uCur)

            channelArr.push({ "Name": category[0].Name, "categoryStatus": category, "uCurrency": uCur })
        }

        function channelConst(val, cur) {
            var newObj = {
                Name: '',
                Count: 0,
                Currency: '',
                Amount: 0
            }
            var newArr = [];
            for (var i in cur) {
                newObj = {
                    Name: '',
                    Count: 0,
                    Currency: '',
                    Amount: 0
                }

                for (var j in val) {
                    if (cur[i] == val[j].Currency) {
                        newObj.Count = newObj.Count + val[j].Count;
                        newObj.Amount = newObj.Amount + val[j].Amount;
                        newObj.Name = val[j].Name;
                        newObj.Currency = val[j].Currency;
                    }
                }

                newArr.push(newObj)
            }
            return newArr;

        }

        for (var i in channelArr) {
            channelArr[i].categoryStatus = channelConst(channelArr[i].categoryStatus, channelArr[i].uCurrency)
        }
        var genUnique = '';
        var genUnique1 = [];
        for (var i in channelArr) {
            var hh1 = []
            for (var j in channelArr[i].categoryStatus) {
                if (channelArr[i].categoryStatus[j].Currency) {
                    genUnique1.push(channelArr[i].categoryStatus[j].Currency);
                }
            }
        }
        genUnique = uniques(genUnique1)
        for (var i in channelArr) {
            var hh1 = [];
            for (var j in channelArr[i].categoryStatus) {
                if (channelArr[i].categoryStatus[j].Currency) {
                    hh1.push(channelArr[i].categoryStatus[j].Currency);
                }

            }

            var missingStatus = arr_diff(genUnique, hh1);
            for (var k in missingStatus) {

                var toPushObj = {};
                toPushObj.Currency = missingStatus[k];
                toPushObj.Count = 0;
                toPushObj.Amount = 0;
                toPushObj.Name = channelArr[i].Name;

                channelArr[i].categoryStatus.push(toPushObj);
            }
        }
        var formatedData = [];
        for (var i in channelArr) {
            for (var j in channelArr[i].categoryStatus) {
                formatedData.push({ 'Name': channelArr[i].categoryStatus[j].Name, 'Count': channelArr[i].categoryStatus[j].Count, 'Currency': channelArr[i].categoryStatus[j].Currency, 'Amount': channelArr[i].categoryStatus[j].Amount })
            }
        }

        return formatedData;
    },
    ChartToPaymentsNav: function (arg) {
        arg.data.Name = arg.filter('addunderscore')(arg.data.Name)

        if ((arg.chartId == 'test2') || (arg.chartId == 'test2Custom')) // Source Channel
        {

            $('.nvtooltip').css({
                'display': 'none'
            });
            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
            navFunctions.forSrcChannel(arg.data, arg.globalData)
        } else if (arg.chartId == 'sankeyChart') {
            $('.nvtooltip').css({
                'display': 'none'
            });
            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
            navFunctions.forPaymentStatusalone(arg.data, arg.globalData)
        } else if ((arg.chartId == 'CurDis') || (arg.chartId == 'CurDisCustom') || (arg.chartId == 'sankeyChartCustom')) {

            $('.nvtooltip').css({
                'display': 'none'
            });
            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
            navFunctions.forPaymentStatus(arg.data, arg.globalData)
        } else if ((arg.chartId == 'MopBar') || (arg.chartId == 'MopBarCustom')) {
            $('.nvtooltip').css({
                'display': 'none'
            });
            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
            navFunctions.forMOP(arg.data, arg.globalData)
        } else if ((arg.chartId == 'Custm1')) {
            $('.nvtooltip').css({
                'display': 'none'
            });
            arg.globalData.isAtchdandBIdBasedSearchClicked = true;
            arg.globalData.AtchdandBIdTableName = 'ATTACHEDMESSAGE';
            arg.globalData.AtchdandBIdStatus = arg.data.Name;
        } else if ((arg.chartId == 'Custm2')) {
            $('.nvtooltip').css({
                'display': 'none'
            });
            arg.globalData.isAtchdandBIdBasedSearchClicked = true;
            arg.globalData.AtchdandBIdTableName = 'BANKINTERACTIONDATA';
            arg.globalData.AtchdandBIdStatus = arg.data.Name;
        } else if (arg.chartId == 'verticalChart') {

            // dBoardtoFileList(arg.globalData,{'Cur':arg.data.Currency,'psa':arg.data.Name},'',true)
            // arg.location.path('/app/instructions')
            // $('.nvtooltip').css({'display' : 'none'});
            // $('.toggleTop').click()

            // navFunctions.instructionNav(arg.data,arg.globalData)
        } else {
            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
        }

        arg.location.path('/app/allpayments')
        $('#rstDashboard').click()

        /* if(arg.from == 'instructions')
         {   
             arg.location.path('/app/instructions')
         }else{
             arg.location.path('/app/allpayments')
         }*/
        // arg.location.path('/app/allpayments')
        // $('#rstDashboard').click()

    }
}

var paymentConsObj = {
    getCurrencySymbol: function (dCntAmt, keyName, $filter) {

        dCntAmt = String(dCntAmt);
        var xx = $filter('isoCurrency')(dCntAmt, keyName, 'Symbolfalse')
        if (xx.indexOf(',') != -1) {
            var yy = xx.split(',');
            xx = '';
            for (var i in yy) {
                xx = xx + yy[i]
            }
        }
        xx = xx.replace(dCntAmt, '');
        xx = xx.split('.')[0];
        if (xx.indexOf('0') != -1) {
            xx = xx.replace('0', '')
            xx = xx + " " + keyName
        } else {
            xx = xx.split('.')[0] + " " + keyName;
        }
        return xx;
    }
}

var chartFunctions = {

    DonutChart: function (arg) {
        d3.scale.myColors = function () {
            return d3.scale.ordinal().range(myColors);
        };

        d3.select('#' + arg.id).selectAll('text').each(function () {
            d3.select(this).each(function () {
                $(this).text('');
                $(this).html('');
            })
        })

        donutData = arg.selectVal;
        nv.addGraph(function () {
            nv.addGraph(function () {
                var Inboundchart = nv.models.pieChart()
                    .x(function (d) {

                        return d.Name;
                    }).y(function (d) {
                        return d[donutData];
                    })
                    .showLegend(false).showLabels(true).donut(true).donutRatio(0.48).labelType('percent').labelThreshold(.035).labelSunbeamLayout(true).margin({ top: 0, bottom: 0, left: 0, right: 0 })
                    .tooltipContent(function (key, y, e, graph) {

                        if (arg.id != 'InboundModal') {
                            newDonutCntAmt = $('#' + arg.id).parent().parent().parent().find('.portlet-title').find('.actions').find('.custDropDown button span').text()
                        } else {
                            newDonutCntAmt = $('#' + arg.id).parent().parent().parent().parent().parent().parent().find('.portlet-title').find('.actions').find('.custDropDownInsideModal button span').text();
                        }

                        var currencyVal;
                        if (newDonutCntAmt == 'Amount') {
                            currencyVal = commonFunctions.currencySymbol(key.data['Currency'], key.data[newDonutCntAmt], arg.filter)
                        } else {
                            currencyVal = key.data[newDonutCntAmt];
                        }

                        var container = '<div style="padding:7px 4px;"><div style="float:left;"><div class="tooltipBox" style="margin-top:7px;background-color:' + key.color + '"></div></div><div style="float:left;margin-left:5px;margin-top:3.5px;">' + key.data.Name + ((key.data.Currency) ? "(" + key.data.Currency + ")" : '') + '</div><br/><div class="txtCenter" style="float:left;width:100%;margin-top:3.5px;margin-bottom:7px;">' + currencyVal + '</div></div>'

                        return container;
                    }).valueFormat(function (d) {
                        if (donutData == 'Count') {
                            return d3.format('')(d);
                        } else if (donutData == 'Amount') {
                            return d3.format('$,')(d);
                        }
                    })
                    .growOnHover(true).labelSunbeamLayout(false).titleOffset(-10)

                if (arg.id == "Custm1" || arg.id == "Custm2") {
                    if (arg.clr) {
                        var clr = [];

                        if (Array.isArray(arg.clr)) {
                            clr = arg.clr;
                        } else {
                            clr.push(arg.clr)
                        }

                        d3.scale.clr = function () {
                            return d3.scale.ordinal().range(clr);
                        };

                        Inboundchart.color(d3.scale.clr().range())
                    } else {
                        d3.scale.myColors = function () {
                            return d3.scale.ordinal().range(myColors);
                        };

                        Inboundchart.color(d3.scale.myColors().range())
                    }
                } else {
                    d3.scale.myColors = function () {
                        return d3.scale.ordinal().range(myColors);
                    };

                    Inboundchart.color(d3.scale.myColors().range())
                }

                d3.select("#" + arg.id).datum(arg.data).attr('style', 'word-wrap: break-word; text-align:center;').call(Inboundchart);
                d3.select("#" + arg.id).call(commonFunctions.centerTextforDonut({ 'data': arg.data, 'selectVal': donutData, 'id': arg.id, 'filter': arg.filter, 'globalData': arg.globalData, 'location': arg.location }));
                Inboundchart.pie.dispatch.on("elementClick", function (e) {
                    if (arg.id != 'InboundModal') {
                        commonFunctions.ChartToPaymentsNav({ 'data': e.data, 'chartId': arg.id, 'filter': arg.filter, 'globalData': arg.globalData, 'location': arg.location })
                    }
                });
                nv.utils.windowResize(function (d) {
                    if (arg.location.path() == '/app/dashboard') { Inboundchart.update(); }
                });

                // $('#resizeWindow').bind('resize', function (e) {
                //     if ($scope.inbndModalDefChart == 'donut') {
                //         Inboundchart.update();
                //         var wid = $('#resizeWindow').width()
                //         var hgt = $('#resizeWindow').height()
                //         $('.inbndModalBody').css({ 'width': wid - 32 + "px", 'height': hgt - 120 + "px" })
                //         $('#InboundModal').css({ 'width': wid + "px", 'height': hgt - 350 + "px" })
                //         $('.modaltestBlock').height($('#InboundModal').height())
                //     }
                // });
                return Inboundchart;
            });
        });
    },
    PieChart: function (arg) {
        d3.scale.myColors = function () {
            return d3.scale.ordinal().range(myColors);
        };

        d3.select('#' + arg.id).selectAll('text').each(function () {
            d3.select(this).each(function () {
                $(this).text('')
                $(this).html('')
            })
        })
        Flag = arg.flag;

        donutData = arg.selectVal;
        nv.addGraph(function () {
            nv.addGraph(function () {
                var Inboundchart = nv.models.pieChart()
                    .x(function (d) {
                        return d.Name;
                    }).y(function (d) {
                        return d[donutData];
                    })
                    .showLegend(false).showLabels(true).donut(false).donutRatio(0.48).color(d3.scale.myColors().range()).labelType('percent').labelThreshold(.035).labelSunbeamLayout(true)
                    .margin({ top: 0, bottom: 0, left: 0, right: 0 })
                    .tooltipContent(function (key, y, e, graph) {

                        var newCntAmt = '';

                        if (arg.id != 'InboundModal') {
                            newCntAmt = $('#' + arg.id).parent().parent().parent().find('.portlet-title').find('.actions').find('.custDropDown button span').text()
                        } else {
                            newCntAmt = $('#' + arg.id).parent().parent().parent().parent().parent().parent().find('.portlet-title').find('.actions').find('.custDropDownInsideModal button span').text();
                        }

                        var currencyVal;
                        if (newCntAmt == 'Amount') {
                            currencyVal = commonFunctions.currencySymbol(key.data['Currency'], key.data[newCntAmt], arg.filter)
                        } else {
                            currencyVal = key.data[newCntAmt];
                        }

                        //key.data.Name = $filter('underscoreRemove')(key.data.Name)

                        var container = '<div style="padding:7px 4px;"><div style="float:left;"><div class="tooltipBox" style="margin-top:7px;background-color:' + key.color + '"></div></div><div style="float:left;margin-left:5px;margin-top:3.5px;">' + key.data.Name + ((key.data.Currency) ? "(" + key.data.Currency + ")" : '') + '</div><br/><div class="txtCenter" style="float:left;width:100%;margin-top:3.5px;margin-bottom:7px;">' + currencyVal + '</div></div>'

                        return container;
                    })
                    .valueFormat(function (d) {

                        if (donutData == 'Count') {
                            return d3.format('')(d);
                        } else if (donutData == 'Amount') {
                            return d3.format('$,')(d);
                        }
                    })
                    .growOnHover(true).labelSunbeamLayout(false).titleOffset(-10)
                if (arg.id == "Custm1" || arg.id == "Custm2") {
                    if (arg.clr) {
                        var clr = [];

                        if (Array.isArray(arg.clr)) {
                            clr = arg.clr;
                        } else {
                            clr.push(arg.clr)
                        }

                        d3.scale.clr = function () {
                            return d3.scale.ordinal().range(clr);
                        };

                        Inboundchart.color(d3.scale.clr().range())
                    } else {
                        d3.scale.myColors = function () {
                            return d3.scale.ordinal().range(myColors);
                        };

                        Inboundchart.color(d3.scale.myColors().range())
                    }
                } else {
                    d3.scale.myColors = function () {
                        return d3.scale.ordinal().range(myColors);
                    };

                    Inboundchart.color(d3.scale.myColors().range())
                }

                d3.select("#" + arg.id).datum(arg.data).attr('style', 'word-wrap: break-word; text-align:center;').call(Inboundchart);

                commonFunctions.textForPie({ 'donutData': donutData, 'data': arg.data, 'all': "All", 'id': arg.id, 'filter': arg.filter, 'location': arg.location })

                Inboundchart.pie.dispatch.on("elementClick", function (e) {
                    if (arg.id != 'InboundModal') {
                        commonFunctions.ChartToPaymentsNav({ 'data': e.data, 'chartId': arg.id, 'filter': arg.filter, 'globalData': arg.globalData, 'location': arg.location })
                    }
                });

                nv.utils.windowResize(function (d) {
                    if (arg.location.path() == '/app/dashboard') { Inboundchart.update(); }
                });

                // $('#resizeWindow').bind('resize', function (e) {
                //     if (($scope.inbndModalDefChart == 'pie')) {
                //         Inboundchart.update();
                //         var wid = $('#resizeWindow').width()
                //         var hgt = $('#resizeWindow').height()
                //         $('.inbndModalBody').css({ 'width': wid - 32 + "px", 'height': hgt - 120 + "px" })
                //         $('#InboundModal').css({ 'width': wid + "px", 'height': hgt - 350 + "px" })
                //         $('.modaltestBlock').height($('#InboundModal').height())
                //     }
                // });
                return Inboundchart;
            });
        });
    },
    SankeyChart: function (arg) {

        $('#' + arg.id).html('');
        $('#' + arg.id).empty();
        var wid = $('#' + arg.id).parent().width() - 50;
        var units = " ";
        d3.select('#' + arg.id).selectAll('text').each(function () {
            d3.select(this).each(function () {
                $(this).text('')
                $(this).html('')
            })
        })

        var margin = { top: 10, right: 0, bottom: 10, left: 10 },
            width = wid - margin.left - margin.right;
        if (arg.id == 'InboundModal') {
            height = $('#' + arg.id).height() - 40;
        } else {
            height = 280 - margin.top - margin.bottom;
        }
        var formatNumber = d3.format(",.0f"), // zero decimal places
            format = function (d) {
                return formatNumber(d) + " " + units;
            },
            color = d3.scale.category20();
        var svg = d3.select("#" + arg.id)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
        // Set the sankey diagram properties
        var sankey = d3sankey()
            .nodeWidth(17)
            .nodePadding(27)
            .size([width, height]);
        var path = sankey.link();
        sankey.nodes(arg.data.nodes)
            .links(arg.data.links)
            .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(arg.data.links).enter().append("path").attr("class", "link").attr("d", path).style("fill", "none")
            .style("stroke", function (d) {
                return myColors[d.source.node]
            })
            .style("stroke-opacity", ".2")
            .on("mouseover", function () {
                d3.select(this).style("stroke-opacity", ".5")
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke-opacity", ".2")
            })
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            });

        // add the link titles
        link.append("title")
            .text(function (d) {
                return d.source.name + "->" + d.target.name + "\n" + d.value;
            });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(arg.data.nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.behavior.drag()
                .origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    this.parentNode.appendChild(this);
                }).on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = myColors[d.node]; //color(d.name.replace('/ .*/', ""));
            })
            .style("fill-opacity", ".9")
            .style("shape-rendering", "crispEdges")
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + d.value;
            });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em").attr("text-anchor", "end").attr("text-shadow", "0 1px 0 #fff").attr("transform", null)
            .text(function (d) {
                return d.name;
            }).filter(function (d) {
                return d.x < width / 2;
            }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");

        var flag = 0;

        $('#' + arg.id + ' .link').on("click", function (evt) {

            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
            var sankeyNav = $(this).find('title').text().split('->');
            var status, currency;
            id = $(evt.currentTarget.farthestViewportElement).attr('id')
            d3.select(this).selectAll('title').each(function (e) {
                e.source.name = arg.filter('addunderscore')(e.source.name)
                e.target.name = arg.filter('addunderscore')(e.target.name)
                currency = e.target.name;
                if (id != 'InboundModal') {
                    if ((id == 'test2') || (id == 'test2Custom')) {

                        horizontalSankey.forSrcChannel(currency, e, arg.globalData)
                    }
                    if ((id == 'sankeyChart') || (id == 'CurDis') || (id == 'sankeyChartCustom') || (id == 'CurDisCustom')) {


                        horizontalSankey.forPaymentStatus(id, currency, e, arg.globalData)
                    }
                    if ((id == 'MopBar') || (id == 'MopBarCustom')) {

                        horizontalSankey.forMOP(currency, e, arg.globalData)
                    }
                    $('.nvtooltip').css({
                        'display': 'none'
                    });

                    arg.location.path('/app/allpayments')
                    $('#rstDashboard').click()
                }
            })
        })

        var curPos = [];
        var chooseId = arg.id + " rect";
        $('#' + chooseId).mousedown(function (e) {
            curPos = [e.pageX, e.pageY]
        });
        $('#' + chooseId).mouseup(function (e) {
            arg.globalData.isAtchdandBIdBasedSearchClicked = false;
            if ((curPos[0] == e.pageX) && (curPos[1] == e.pageY) && (arg.id != 'InboundModal')) {

                d3.select(this).selectAll('title').each(function (e) {
                    e.name = arg.filter('addunderscore')(e.name);

                    if (((arg.id == 'test2') || (arg.id == 'test2Custom')) && (e.name != 'TOTAL') && (e.type != 'Currency')) {
                        horizontalSankey.forSrcChannelRect(e, arg.globalData)
                    } else if (((arg.id == 'sankeyChart') || (arg.id == 'CurDis')) && (e.name != 'TOTAL') && (e.type != 'Currency')) {

                        horizontalSankey.forPaymentStatusRect(e, arg.globalData)
                    } else if (((arg.id == 'MopBar') || (arg.id == 'MopBarCustom')) && (e.name != 'TOTAL') && (e.type != 'Currency')) {
                        horizontalSankey.forMOPRect(e, arg.globalData)
                    } else if (e.type == 'Currency') {
                        horizontalSankey.forCurrencyRect(e, arg.globalData)
                    } else {
                        sankeyNavfunctions.forResetRect(arg.globalData)
                    }
                    arg.location.path('/app/allpayments')
                    $('#rstDashboard').click()
                })
            }
        });

        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))) + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        };
    },
    verticalSankeyChart: function (arg) {

        $('#' + arg.id).html('');
        $('#' + arg.id).empty();

        var wid = $('#' + arg.id).parent().width() - 50;
        var units = " ";
        var margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = wid - margin.left - margin.right;
        if (arg.id == 'InboundModal') {
            height = $('#' + arg.id).height() - 40;
        } else {
            height = 250 - margin.top - margin.bottom;
        }
        var margin = { top: 20, right: 1, bottom: 6, left: 0 },
            width = wid - margin.left - margin.right; // was 960
        var formatNumber = d3.format(",.0f"),
            format = function (d) { return formatNumber(d) + ""; },
            color = d3.scale.category20();

        var svg = d3.select("#" + arg.id)
            .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var sankey = d3VerticalSankey()
            .nodeWidth(25) // was 15
            .nodePadding(20) // was 10
            .size([width, height]);

        var path = sankey.link();

        sankey
            .nodes(arg.data.nodes)
            .links(arg.data.links)
            .layout(32); // what is this? iterations

        var link = svg.append("g").selectAll(".link")
            .data(arg.data.links).enter().append("path").attr("class", "link").attr("d", path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .style("stroke", function (d) { return d.source.color = color(d.source.name.replace(/ .*/, "")); })
            .sort(function (a, b) { return b.dy - a.dy; });

        link.append("title")
            .text(function (d) { return d.source.name + "->" + d.target.name + "\n" + d.value });

        var node = svg.append("g").selectAll(".node")
            .data(arg.data.nodes).enter().append("g").attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.behavior.drag().origin(function (d) { return d; })
                .on("dragstart", function () { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        node.append("rect")
            .attr("height", sankey.nodeWidth())
            .attr("width", function (d) { return d.dy; })
            .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
            .append("title").text(function (d) { return d.name + "\n" + d.value });

        node.append("text")
            .attr("text-anchor", "middle").attr("x", function (d) { return d.dy / 2 }).attr("y", sankey.nodeWidth() / 2).attr("dy", ".35em").text(function (d) { return d.name; })
            .filter(function (d) { return d.x < width / 2; });

        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + (d.x = Math.max(0, Math.min(width - d.dy, d3.event.x))) + "," + d.y + ")");
            sankey.relayout();
            link.attr("d", path);
        }

        $('#' + arg.id + ' .link').on("click", function (e) {

            arg.id = $(e.currentTarget.farthestViewportElement).attr('id')
            var status, currency;
            var sankeyNav = $(this).find('title').text().split('->');
            var status, currency;
            d3.select(this).selectAll('title').each(function (e) {

                currency = e.target.name;
                arg.globalData.isAtchdandBIdBasedSearchClicked = false
                if (arg.id != 'InboundModal') {
                    if ((arg.id == 'test2') || (arg.id == 'test2Custom')) {
                        status = e.target.name;
                        currency = e.source.name;
                        status = arg.filter('addunderscore')(status);

                        sankeyNavfunctions.forSrcChannel(status, currency, arg.globalData)
                    }
                    if ((arg.id == 'sankeyChart') || (arg.id == 'CurDis') || (arg.id == 'sankeyChartCustom') || (arg.id == 'CurDisCustom')) {
                        if ((arg.id == 'sankeyChart') || (arg.id == 'sankeyChartCustom')) {
                            status = e.source.name;
                            currency = e.target.name;
                        } else {
                            status = e.target.name;
                            currency = e.source.name;
                        }
                        status = arg.filter('addunderscore')(status);
                        currency = arg.filter('addunderscore')(currency);
                        sankeyNavfunctions.forPaymentStatus(status, currency, arg.globalData)
                    }

                    if ((arg.id == 'MopBar') || (arg.id == 'MopBarCustom')) {
                        status = e.target.name;
                        currency = e.source.name;
                        status = arg.filter('addunderscore')(status);
                        sankeyNavfunctions.forMOP(status, currency, arg.globalData)
                    }
                    $('.nvtooltip').css({ 'display': 'none' });
                    arg.location.path('/app/allpayments')
                    $('#rstDashboard').click()
                }
            })
        })

        var curPos = [];
        var chooseId = arg.id + " rect";
        $('#' + chooseId).mousedown(function (e) {
            curPos = [e.pageX, e.pageY]
        });
        $('#' + chooseId).mouseup(function (e) {
            arg.globalData.isAtchdandBIdBasedSearchClicked = false
            if ((curPos[0] == e.pageX) && (curPos[1] == e.pageY) && (arg.id != 'InboundModal')) {
                d3.select(this).selectAll('title').each(function (e) {
                    if (((arg.id == 'test2') || (arg.id == 'test2Custom')) && (e.type != 'Currency')) {
                        sankeyNavfunctions.forSrcChannelRect(e, arg.globalData)
                    } else if (((arg.id == 'sankeyChart') || (arg.id == 'CurDis') || (arg.id == 'sankeyChartCustom') || (arg.id == 'CurDisCustom')) && (e.type != 'Currency')) {
                        var status = e.name;
                        status = arg.filter('addunderscore')(status);
                        sankeyNavfunctions.forPaymentStatusRect(status, arg.globalData)
                    } else if (((arg.id == 'MopBar') || (arg.id == 'MopBarCustom')) && (e.type != 'Currency')) {
                        e.name = arg.filter('addunderscore')(e.name)
                        sankeyNavfunctions.forMOPRect(e, arg.globalData)
                    } else if (e.type == 'Currency') {
                        var currency = e.name;
                        sankeyNavfunctions.forCurrencyRect(currency, arg.globalData);
                    } else {
                        sankeyNavfunctions.forResetRect(arg.globalData);
                    }
                    arg.location.path('/app/allpayments')
                    $('#rstDashboard').click()
                })
            }
        });

        function Chartwidth() {

            var textWidth,
                rectwidth;

            d3.select('#' + arg.id).select('g').selectAll(".node").selectAll("rect").each(function (d) {
                rectwidth = d.dy;
                textWidth = d3.select(this.parentNode).select('text').node().getComputedTextLength();

                if (rectwidth < textWidth) {
                    d3.select(this.parentNode).select('text').remove()
                }
            })
        }
        Chartwidth();
    },
    VerticalMultibarChart: function (arg) {

        setTimeout(function () {
            d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
            d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('#TotalVal').remove();
        }, 100)

        ///setTimeout(function(){
        var uniqueStoreStatus = [];
        var uniqueStoreCurrency = [];

        uniqueStoreStatus = constructObject.getUniqueVal(arg.data, "Name")
        uniqueStoreCurrency = constructObject.getUniqueVal(arg.data, "Currency")

        var genObj = constructObject.constructObj(constructObject.getUniqueVal(arg.data, "Name"), arg.data, "Name");

        var curWiseTot = constructObject.currencyWiseTotal(constructObject.getUniqueVal(arg.data, "Currency"), arg.data, "Currency");
        var percentVal = '';
        for (var i in genObj) {
            percentVal = '';
            for (var j in genObj[i].values) {
                for (var k in curWiseTot) {
                    if (curWiseTot[k].Currency == genObj[i].values[j].Currency) {
                        genObj[i].values[j].Ratio = Math.round(genObj[i].values[j][arg.selectVal] / curWiseTot[k][arg.selectVal] * 100) + "%";
                    }
                }
            }

            if ((arg.id == 'CurDis') || (arg.id == 'sankeyChart') || (arg.id == 'CurDisCustom') || (arg.id == 'sankeyChartCustom') || ((arg.id == 'InboundModal') && (arg.basedOn == 'PaymentStatus'))) {
                genObj[i].color = commonFunctions.selectStatuscolor(genObj[i].key)

                if (genObj[i].color == undefined) {
                    genObj[i].color = myColors[i];
                }
            } else {
                genObj[i].color = myColors[i];
            }
        }

        var totvalForVertical;
        if (arg.selectVal == 'Count') {
            totvalForVertical = "TOTAL COUNT";
        } else {
            totvalForVertical = "TOTAL AMOUNT";
        }

        genObj.push({
            "Amount": "",
            "Count": "",
            "key": totvalForVertical,
            "color": "#a94442",
            "values": curWiseTot
        });

        var NewGenObj = angular.copy(genObj)

        for (var i = 0; i < NewGenObj.length; i++) {
            if ((NewGenObj[i].key == "TOTAL COUNT") || (NewGenObj[i].key == "TOTAL AMOUNT")) {
                NewGenObj.splice(i, 1);
            }
        }

        $('#' + arg.id).html('');

        var MultiChart = nv.models.multiBarChart();
        MultiChart.x(function (d) {
            return paymentConsObj.getCurrencySymbol(d[arg.selectVal], d.Currency, arg.filter)

        });
        MultiChart.y(function (d) {
            return d[arg.selectVal];
        });
        MultiChart.showLegend(true);
        MultiChart.groupSpacing(0.3);
        MultiChart.noData("There is no Data to display");
        MultiChart.showControls(true);
        MultiChart.tooltipContent(function (key) {
            var currencyVal;
            if (arg.selectVal == 'Amount') {
                currencyVal = commonFunctions.currencySymbol(key.data.Currency, key.series[0].value, arg.filter)
            } else {
                currencyVal = key.series[0].value;
            }
            // key.data.key = $filter('underscoreRemove')(key.data.key)

            var container = '<div style="padding:5px;"> <div class="bold" style="width:auto;float:left;"> ' + key.data.Currency + ' </div>  <div class="bold" style="float:left;margin-left:10px;"> ' + key.data.Ratio + '</div> <br/> <div style="float:left;"> <div class="tooltipBox" style="background-color:' + key.color + '"></div>  </div>  <div style="float:left;margin-left:5px;">' + key.data.key + '</div>  <div style="float:left;margin-left:5px;">' + currencyVal + '</div></div>'
            
            return container;
        })

        MultiChart.multibar.dispatch.on("elementClick", function (e) {
            if (arg.id != 'InboundModal' && arg.id != 'verticalChart') {
                commonFunctions.ChartToPaymentsNav({ 'data': e.data, 'chartId': arg.id, 'filter': arg.filter, 'globalData': arg.globalData, 'location': arg.location, 'from': arg.from })
            }
        });

        MultiChart.duration(100)
        MultiChart.margin({
            left: 100
        })
        MultiChart.xAxis.axisLabel("Currency vs. " + arg.selectVal);
        MultiChart.rotateLabels(-40);
        MultiChart.yAxis.axisLabel(arg.selectVal);

        d3.select('#' + arg.id)
            .datum(genObj)
            .transition()
            .call(MultiChart);

        var changeValuei = 0;
        var changeValuej = 0;
        var stackedStatus = false;
        var disabledStatus = [];
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        d3.selectAll('.nv-multiBarWithLegend g:nth-child(1) g:nth-child(1)').each(function (group) {
            if (d3.select(this).attr('transform') != null) {
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
                {
                    if (changeValuei == 0) {
                        changeValuej = d3.select(this).attr('transform').split(' ')[1].split(')')[0]
                    }
                } else // If another browser, return 0
                {
                    if (changeValuei == 0) {
                        changeValuej = d3.select(this).attr('transform').split(',')[1].split(')')[0]
                    }
                }
            }
            changeValuei++;
        })


        d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
        d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('#TotalVal').remove();

        var Multibarstacked = false;
        MultiChart.dispatch.on('renderEnd', function () {
            MultibarshowLabels(Multibarstacked);

            d3.select('#' + arg.id).each(function () {
                d3.select(this.parentNode).select('.nv-axislabel').attr('y', Number(d3.select(this.parentNode).select('.nv-axislabel').attr('y')) + 10)
            });
        })

        MultiChart.dispatch.on('stateChange', function (e) {
            d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
            d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('#TotalVal').remove();

            Multibarstacked = e.stacked
            if (e.stacked) {
                d3.select('#' + arg.id).datum(NewGenObj).transition().call(MultiChart);
            } else if (!e.stacked) {
                d3.select('#' + arg.id).datum(genObj).transition().call(MultiChart);
            }
        });

        MultiChart.legend.dispatch.on('legendClick', function (e) {
            d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
            d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('#TotalVal').remove();
        });

        nv.utils.windowResize(function () {
            if (arg.location.path() == '/app/dashboard') {
                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('#TotalVal').remove();
                // MultiChart.update();
            }
        });

        var heig = {};

        function MultibarshowLabels(view) {
            var valss = {
                'height': [],
                'width': [],
                'transform': [],
                'TotalVal': [],
                'Currency': []
            };
            setTimeout(function () {
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
                {
                    var maxhei = d3.select('#' + arg.id).select('.nv-x').attr('transform').split(" ")[1].split(")")[0];
                } else {
                    var maxhei = d3.select('#' + arg.id).select('.nv-x').attr('transform').split(",")[1].split(")")[0];
                }

                var widthReached = false;

                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('#TotalVal').remove();

                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').each(function (e, i) {
                    var count = i;

                    d3.select(this).selectAll('rect').each(function (e, i) {
                        if (view && (d3.select(this).attr('width') > 55)) {
                            widthReached = true;
                            if (count != 0) {
                                valss['height'][i] += Number(d3.select(this).attr('height'))
                                valss['TotalVal'][i] += e.y
                            } else {
                                valss.height.push(Number(d3.select(this).attr('height')))
                                valss.width.push(Number(d3.select(this).attr('width') / 2))
                                valss.transform.push(d3.select(this).attr('transform'))
                                valss.TotalVal.push(e.y)
                                valss.Currency.push(paymentConsObj.getCurrencySymbol(e[arg.selectVal], e.Currency, arg.filter))
                            }
                        } else {
                            widthReached = false;
                        }

                        if (d3.select(this).attr('width') > 23) {
                            if (d3.select(this).attr('height') > 10) {
                                d3.select(this).attr('style', '')

                                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
                                {
                                    var x = d3.select(this).attr('transform').split(')')[0];
                                } else {
                                    var x = d3.select(this).attr('transform').split(',')[0];
                                }

                                if (view) {
                                    d3.select(this.parentNode).append('text').attr({ 'x': (d3.select(this).attr('width') / 2), 'y': d3.select(this).attr('y'), 'transform': x + ',' + (d3.select(this).attr('height') / 2) + ')' }).attr({ 'style': 'stroke: rgb(51, 51, 51);text-anchor:middle' }).text(e.Ratio);
                                } else if (!view) {
                                    d3.select(this.parentNode).append('text').attr({ 'x': (Number(d3.select(this).attr('x')) + Number(d3.select(this).attr('width') / 2)), 'y': d3.select(this).attr('y'), 'transform': x + ',' + (d3.select(this).attr('height') / 2) + ')' }).attr({ 'style': 'stroke: rgb(51, 51, 51);text-anchor:middle' }).text(e.Ratio);
                                }
                            }
                        }
                    })
                })
            }, 100)
        }
        return MultiChart;
        //},500)

    },
    HorizontalMultibarChart: function (arg) {
        var uniqMOP = [];
        var uniqCur = [];
        uniqMOP = constructObject.getUniqueVal(arg.data, "Name")
        uniqCur = constructObject.getUniqueVal(arg.data, "Currency")
        var MOPObj = constructObject.constructObj(constructObject.getUniqueVal(arg.data, "Currency"), arg.data, "Currency");
        var MOPWiseTot = constructObject.MOPWiseTotal(constructObject.getUniqueVal(arg.data, "Name"), arg.data, "Name");
        var percentVal = '';
        for (var i in MOPObj) {
            percentVal = '';
            for (var j in MOPObj[i].values) {
                for (var k in MOPWiseTot) {
                    if (MOPWiseTot[k].Name == MOPObj[i].values[j].Name) {
                        MOPObj[i].values[j].Ratio = Math.round(MOPObj[i].values[j][arg.selectVal] / MOPWiseTot[k][arg.selectVal] * 100) + "%";
                    }
                }
            }
            MOPObj[i].color = myColors[i];
        }
        $('#' + arg.id).html('');
        nv.addGraph(function () {
            var chart2 = nv.models.multiBarHorizontalChart()
                .x(function (d) {
                    return d.Name
                })
                .y(function (d) {
                    return d[arg.selectVal]
                })
                .margin({ top: 30, right: 20, bottom: 50, left: 120 })
                .showValues(true).showControls(true).stacked(true)
            chart2.yAxis
                .tickFormat(d3.format(',.0f'));
            chart2.tooltipContent(function (key) {
                var currencyVal;
                if (arg.selectVal == 'Amount') {
                    currencyVal = commonFunctions.currencySymbol(key.data.key, key.data.y, arg.filter)
                } else {
                    currencyVal = key.data.y;
                }
                //key.data.Name = $filter('underscoreRemove')(key.data.Name)
                var container = '<div style="padding:5px;"> <div class="bold" style="width:auto;float:left;"> ' + key.data.Name + ' </div>  <div class="bold" style="float:left;margin-left:10px;"> ' + key.data.Ratio + '</div> <br/> <div style="float:left;"> <div class="tooltipBox" style="background-color:' + key.color + '"></div>  </div>  <div style="float:left;margin-left:5px;">' + key.data.key + '</div>  <div style="float:left;margin-left:5px;">' + currencyVal + '</div></div>'
                return container;
            })

            d3.select('#' + arg.id)
                .datum(MOPObj)
                .transition().duration(100)
                .call(chart2)

            //d3.select('#test2').select('.nv-wrap .nv-axis').selectAll('.tick').
            //d3.select('#' + arg.id).select('.nv-wrap .nv-axis').select(".tick").selectAll("text").each(function(i, e)	
            //d3.selectAll(".nv-x.nv-axis .tick text").each(function(i, e) 

            function wordBreak() {

                d3.select('#' + arg.id).selectAll(".nv-x.nv-axis .tick text").each(function (i, e) {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),

                        word, line = [],
                        lineNumber = 0,
                        lineHeight = 1.0, // ems
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    var txt = [];
                    for (var i in words) {
                        if (words[i].indexOf('_') != -1) {
                            var tArr = words[i].split('_');

                            for (var i in tArr) {
                                txt.push(tArr[i])
                            }
                        } else {
                            txt = words;
                        }
                    }
                    words = txt;

                    // word = word.replace(/_/g,' ')
                    words.reverse()

                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        // TDOD : Make 80 a dynamic value based on the bar width/height
                        if (tspan.node().getComputedTextLength() > 80) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });

            }
            wordBreak();

            setTimeout(function () {
                d3.select('#' + arg.id).call(chart2showLabels)
                /* d3.select('#' + arg.id).call(wrap, x0.rangeBand()); */
            }, 200)

            chart2.multibar.dispatch.on("elementClick", function (e) {
                if (arg.id != 'InboundModal') {
                    commonFunctions.ChartToPaymentsNav({ 'data': e.data, 'chartId': arg.id, 'filter': arg.filter, 'globalData': arg.globalData, 'location': arg.location })
                }
            });
            var stacked = '';
            chart2.dispatch.on('renderEnd', function () {
                stacked = true;
            });
            chart2.dispatch.on('stateChange', function (e) {
                if (e.stacked) {
                    stacked = true;
                    setTimeout(function () {
                        chart2showLabels()

                    }, 500)
                    setTimeout(function () {
                        wordBreak()
                    }, 0)
                } else if (!e.stacked) {
                    stacked = false;
                    setTimeout(function () {
                        chart2showLabels()
                    }, 500)

                    setTimeout(function () {
                        wordBreak()
                    }, 0);
                }
            })
            //  $scope.customStackCtrl = true;
            NewMOPObj = angular.copy(MOPObj)
            chart2.legend.dispatch.on('legendClick', function (e, i) {
                if (stacked) {
                    setTimeout(function () {
                        chart2showLabels()
                    }, 500)
                }
            });

            function chart2showLabels() {
                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').selectAll('text').remove();
                d3.select('#' + arg.id).select('.nv-barsWrap').select('.nv-groups').selectAll('.nv-group').each(function () {
                    d3.select(this).selectAll('rect').each(function (e) {
                        if (d3.select(this).attr('width') > 20) {
                            d3.select(this.parentNode).append('text').attr({ 'x': (d3.select(this).attr('width') / 2) - 13, 'y': (d3.select(this).attr('height') / 2) }).attr('style', 'stroke: rgb(51, 51, 51)').text(e.Ratio)
                        }
                    })
                })
            }
            nv.utils.windowResize(function () {
                if (arg.location.path() == '/app/dashboard') {
                    setTimeout(function () {
                        chart2showLabels()
                    }, 500)
                    // chart2.update();
                }
            });

            return chart2;
        })
    }
}

var setChartProp = {

    donut: function (chartId) {
        $('#' + chartId.parentId).find('.InboundTotal').css('visibility', 'hidden')
        $('#' + chartId.parentId).find('.legendHolder').css('display', 'block')
        $('#' + chartId.parentId).find('.legendHolder').find('.chartLegends').css('display', 'none')
        $('#' + chartId.parentId).find('.legendHolder').find('.donutChartSelected').css('display', 'block')
        $('#' + chartId.id).parent().css('height', findHt(chartId.id) + $('#' + chartId.parentId).find('.InboundTotal').outerHeight() + "px")
        $('#' + chartId.parentId).find('.InboundTotal').css('display', 'none')
    },
    pie: function (chartId) {
        $('#' + chartId.parentId).find('.InboundTotal').css('display', 'block')
        $('#' + chartId.parentId).find('.InboundTotal').css('visibility', 'visible')
        $('#' + chartId.parentId).find('.legendHolder').css('display', 'block')
        var legHt = $('#' + chartId.parentId).find('.legendHolder').height();
        $('#' + chartId.parentId).find('.legendHolder').find('.chartLegends').css('display', 'none')
        $('#' + chartId.parentId).find('.legendHolder').find('.pieChartSelected').css('display', 'block')
        $('#' + chartId.id).parent().css('height', findHt(chartId.id) + "px")
    },
    sankey: function (arg) {
        $('#' + arg.parentId).find('.InboundTotal').css('visibility', 'hidden')
        $('#' + arg.parentId).find('.legendHolder').css('display', 'block')
        var legHt = $('#' + arg.parentId).find('.legendHolder').height();
        $('#' + arg.parentId).find('.legendHolder').find('.chartLegends').css('display', 'none')
        $('#' + arg.parentId).find('.legendHolder').find('.sankeyChartSelected').css('display', 'block')
        $('#' + arg.id).parent().css('height', findHt(arg.id) + $('#' + arg.parentId).find('.InboundTotal').outerHeight() + "px")
        // $('#' + arg.id).css('margin-left', '20px')
        $('#' + arg.parentId).find('.InboundTotal').css('display', 'none')
    },
    horizontalVertical: function (chartId) {
        $('#' + chartId.parentId).find('.InboundTotal').css('visibility', 'hidden')
        var legHt = $('#' + chartId.parentId).find('.legendHolder').height();
        $('#' + chartId.parentId).find('.legendHolder').css('display', 'none')

        $('#' + chartId.id).parent().css('height', findHt(chartId.id) + legHt + $('#' + chartId.parentId).find('.InboundTotal').outerHeight() + "px")
        $('#' + chartId.parentId).find('.InboundTotal').css('display', 'none')
    }
}