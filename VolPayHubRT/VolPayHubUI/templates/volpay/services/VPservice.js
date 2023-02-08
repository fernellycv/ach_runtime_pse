angular.module('VolpayApp').service('ColpatriaService', function () {
    var data = {};
    data.clearingHouseValues = '';
    return data;
});

angular.module('VolpayApp').service('AdminService', function () {
    var data = {};
    data.adminLogin = false;
    data.corporateLogin = false;
    data.approverLogin = false;
    //data.sidebarVal = [];
    return data;
});

angular.module('VolpayApp').service('userProfileSave', function () {
    var data = {};
    data.themeSelected = false;
    data.languageSelected = 'es_ES';
    return data;
})

angular.module('VolpayApp').service('OnboardService', function () {
    var data = {};
    data.serviceDataShow = false;
    data.ReadyforBoarding = [];
    data.selectedIndex = -1;
    data.RequestID = -1;
    data.ClientName = -1;
    data.onBoardReqSaved = false;
    data.RequestDetailReqNo = -1;
    data.onboardReqData = '';
    data.deletedIndex = -1;

    data.onBoardReqSaved = false;
    data.currentServicePage = false;
    data.ReqInitiated = false;

    data.initiatedReqId = false;
    data.initiatedReqId = '';
    data.initiatedClientName = '';

    return data;
});

angular.module('VolpayApp').service('userMgmtService', function () {

    var data = {};
    data.userData = [];
    data.updated = false;
    data.created = false;

    return data;
});

angular.module('VolpayApp').service('DashboardService', function () {

    var data = {};
    data.allData = true;

    data.CurDis = true;
    data.InbndPayment = true;
    data.Mop = true;
    data.Status = true;

    return data;
});

angular.module('VolpayApp').service('CommonService', function () {

    var data = {};

    data.refDataApproved = {
        "flag": false,
        "msg": ''
    }
    data.sidebarCurrentVal = '';
    data.sidebarSubVal = '';

    /*Distribution Instructions*/
    data.distInstruction = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: false,
            today: true,
            week: false,
            month: false,
            custom: false
        },
        searchFound: true,
        customDate: {
            startDate: '',
            endDate: ''
        }
    }

    data.userMgmt = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }
    }
    data.alertLoadCnt = 0;

    return data;
});

angular.module('VolpayApp').service('ConfirmationService', function () {

    var data = {};

    data.refDataApproved = {
        "flag": false,
        "msg": ''
    }
    data.sidebarCurrentVal = '';
    data.sidebarSubVal = '';

    /*Distribution Instructions*/
    data.distInstruction = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }
    }

    data.userMgmt = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }
    }
    data.alertLoadCnt = 0;

    return data;
});

angular.module('VolpayApp').service('AttachMsgService', function () {

    var data = {};

    data.refDataApproved = {
        "flag": false,
        "msg": ''
    }
    data.sidebarCurrentVal = '';
    data.sidebarSubVal = '';

    /*Distribution Instructions*/
    data.distInstruction = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }

    }
    data.userMgmt = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }

    }
    data.alertLoadCnt = 0;

    return data;

})

angular.module('VolpayApp').service('SystemInteractionService', function () {

    var data = {};

    data.orderByField = 'BIDTimeStamp';
    data.sortReverse = false;
    data.sortType = 'Desc';
    data.isSortingClicked = false;

    data.refDataApproved = {
        "flag": false,
        "msg": ''
    }
    data.sidebarCurrentVal = '';
    data.sidebarSubVal = '';

    /*Distribution Instructions*/
    data.distInstruction = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }
    }

    data.userMgmt = {
        currentObj: {
            "sortBy": [],
            "params": [],
            "start": 0,
            "count": 20
        },
        uorVal: '',
        dateFilter: {
            all: true,
            today: false,
            week: false,
            month: false,
            custom: false
        },
        searchFound: false,
        customDate: {
            startDate: '',
            endDate: ''
        }
    }
    data.alertLoadCnt = 0;

    return data;

})

function toUTF8Array(str) {

    var utf8 = [];
    for (var j = 0; j < str.length; j++) {
        var charcode = str.charCodeAt(j);
        if (charcode < 0x80)
            utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            j++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

angular.module('VolpayApp').service('GlobalService', function () {
    var data = {};

    data.colorArr = {
        instruction: [],
        payments: []
    }
    data.fileDetailStatus = {
        "Status": "",
        "Msg": ""
    }

    data.sidebarCurrentVal = '';
    data.sidebarSubVal = '';

    data.specificData = {};
    data.Fxupdated = '';
    data.ViewClicked = true;
    data.fromAddNew = false;

    data.pwRest = false;
    data.userCreated = false;
    data.responseMessage = "";
    data.roleAdded = false;
    data.paymentRepaired = false;
    data.logoutMessage = false;
    data.passwordChanged = false;
    data.ApproveInitiated = false;
    data.PaymentApproved = false;
    data.data123_backup = -1;
    data.fileListId = -1;
    data.UniqueRefID = -1;
    data.fileListIndex = -1;
    data.enrichPaymentID = -1;
    data.enrichPaymentIDRevert = -1;
    data.ErrorMessage123 = -1;
    data.myProfileFLindex = '';
    data.editRuleBuilder = '';
    data.sidebarVal = '';
    data.viewFlag = true;

    /*** set the default sort properties ***/
    data.orderByField = 'EntryDate';
    data.sortReverse = false;
    data.sortType = 'Desc';
    data.isSortingClicked = false;
    data.DataLoadedCount = 20;

    data.fromDashboard = false;
    data.FLuir = '';
    data.all = true;
    data.today = false;
    data.week = false;
    data.month = false;
    data.custom = false;
    data.todayDate = '';
    data.weekStart = '';
    data.weekEnd = '';
    data.monthStart = '';
    data.monthEnd = '';
    data.selectCriteriaTxt = 'All';
    data.selectCriteriaID = 1;
    data.prev = 'all';
    data.prevSelectedTxt = 'all';
    data.prevId = 1;

    data.startDate = '';
    data.endDate = '';
    data.ShowStartDate = '';
    data.ShowEndDate = '';
    data.searchClicked = false;
    data.isEntered = false;
    data.advancedSearch = true;
    data.advancedSearchEnable = false;
    data.uirTxtValue = '';

    data.searchNameDuplicated = false;
    data.SelectSearchVisible = false;

    data.searchname = '';
    data.FieldArr = [];
    data.fromMyProfilePage = false;
    data.searchParams = {
        "InstructionData": {
            "EntryDate": {
                "Start": "",
                "End": ""
            }
        }
    };

    data.AandN = {
        'AlertId': '',
        'NotifCount': '',
        'NotifData': [],
        'functions': {}
    };

    if (configData) {
        if (Object.keys(configData).indexOf('isCaseSensitive') != -1) {
            if (configData['isCaseSensitive']) {
                data.isCaseSensitiveval = "1"
            } else {
                data.isCaseSensitiveval = "0"
            }
        }
    }

    data.AandN.functions = {
        anchorSmoothScroll: function (eID) {
            $('.panel-heading,.RowId').removeClass('alertHighlight');
            $('#' + eID).addClass('alertHighlight');
            $('#Row_' + eID).addClass('alertHighlight');
            $('#star_' + eID).find('i').addClass('fa-star-o').removeClass('fa-star');
            //var startY = currentYPosition();
            if (!data.viewFlag) {
                eID = 'Row_' + eID;
            }


            //	function scrollDown()
            //{
            //$("html, body").animate({ scrollTop: $(document).height() },'slow');
            $('.listView').animate({
                scrollTop: ($('#' + eID + '').offset().top) - $('.AlertandScroll').offset().top
            }, 'slow')
            //}

            //setInterval(scrollDown,1000);

            // var stopY = elmYPosition(eID) - 100;
            // var distance = stopY > startY ? stopY - startY : startY - stopY;
            // if (distance < 100) {
            // 	scrollTo(0, stopY); return;
            // }
            // var speed = Math.round(distance / 10);
            // if (speed >= 20) speed = 20;
            // var step = Math.round(distance / 25);
            // var leapY = stopY > startY ? startY + step : startY - step;
            // var timer = 0;
            // if (stopY > startY) {
            // 	for ( var i=startY; i<stopY; i+=step ) {
            // 		setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            // 		leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            // 	} return;
            // }
            // for ( var i=startY; i>stopY; i-=step ) {
            // 	setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            // 	leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            // }


            // function currentYPosition() {
            // 	// Firefox, Chrome, Opera, Safari
            // 	if (self.pageYOffset) return self.pageYOffset;
            // 	// Internet Explorer 6 - standards mode
            // 	if (document.documentElement && document.documentElement.scrollTop)
            // 		return document.documentElement.scrollTop;
            // 	// Internet Explorer 6, 7 and 8
            // 	if (document.body.scrollTop) return document.body.scrollTop;
            // 	return 0;
            // }


            // function elmYPosition(eID) {
            // 	var elm = document.getElementById(eID);
            // 	var y = elm.offsetTop;
            // 	var node = elm;
            // 	while (node.offsetParent && node.offsetParent != document.body) {
            // 		node = node.offsetParent;
            // 		y += node.offsetTop;
            // 	} return y;
            // }
        },
        assignClassName: function () {
            for (var k in data.AandN['NotifData'].NotifyContent) {
                if (data.AandN['NotifData'].NotifyContent[k]['status'] == true) {
                    $('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('a').attr('title', 'New');
                    $('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('i').addClass('fa-star').removeClass('fa-star-o');
                } else {
                    $('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('i').addClass('fa-star-o').removeClass('fa-star');
                    $('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('a').attr('title', 'Viewed');
                }
            }
        }
    }

    return data;
});

angular.module('VolpayApp').service('AllPaymentsGlobalData', function () {

    var data = {};

    /*** set the default sort properties ***/
    data.orderByField = 'ReceivedDate';
    data.sortReverse = false;
    data.sortType = 'Desc';
    data.isSortingClicked = false;

    data.DataLoadedCount = 20;
    data.myProfileFLindex = '';

    /*** Noramal Search ***/
    data.all = true;
    data.today = false;
    data.week = false;
    data.month = false;
    data.custom = false;

    data.FLuir = '';

    data.startDate = '';
    data.endDate = '';
    data.ShowStartDate = '';
    data.ShowEndDate = '';

    data.todayDate = '';
    data.weekStart = '';
    data.weekEnd = '';
    data.monthStart = '';
    data.monthEnd = '';

    data.selectCriteriaTxt = 'All';
    data.selectCriteriaID = 1;
    data.prev = 'all';
    data.prevSelectedTxt = 'all';
    data.prevId = 1;

    data.searchClicked = false;
    data.isEntered = false;

    data.fromDashboard = false;

    /****** Advanced Search ********/
    data.advancedSearchEnable = false;
    data.searchParams = {
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
            },
            "DebitFxRate": {
                "Start": "",
                "End": ""
            }
        }
    };

    data.searchNameDuplicated = false;
    data.SelectSearchVisible = false;
    data.searchname = '';

    data.fromMyProfilePage = false;
    data.FieldArr = [];
    data.FromDashboardFieldArr = [];
    data.CrossFilter = {};
    data.CrossFilterValues = {};
    data.allPaymentDetails = "";
    data.isAtchdandBIdBasedSearchClicked = false;
    data.AtchdandBIdTableName = '';
    data.AtchdandBIdStatus = '';

    return data;
});

angular.module('VolpayApp').service('AllBatchesGlobalData', function () {

    var data = {};

    /*** set the default sort properties ***/
    data.orderByField = 'EntryDate';
    data.sortReverse = false;
    data.sortType = 'Desc';
    data.isSortingClicked = false;

    data.DataLoadedCount = 20;
    data.myProfileFLindex = '';

    /*** Noramal Search ***/
    data.all = true;
    data.today = false;
    data.week = false;
    data.month = false;
    data.custom = false;

    data.FLuir = '';

    data.startDate = '';
    data.endDate = '';
    data.ShowStartDate = '';
    data.ShowEndDate = '';

    data.todayDate = '';
    data.weekStart = '';
    data.weekEnd = '';
    data.monthStart = '';
    data.monthEnd = '';

    data.selectCriteriaTxt = 'All';
    data.selectCriteriaID = 1;
    data.prev = 'all';
    data.prevSelectedTxt = 'all';
    data.prevId = 1;

    data.searchClicked = false;
    data.isEntered = false;

    data.fromDashboard = false;

    /****** Advanced Search ********/
    data.advancedSearchEnable = false;
    data.searchParams = {
        "InstructionData": {
            "EntryDate": {
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
            },
            "DebitFxRate": {
                "Start": "",
                "End": ""
            }
        }
    };

    data.searchNameDuplicated = false;
    data.SelectSearchVisible = false;
    data.searchname = '';

    data.fromMyProfilePage = false;
    data.FieldArr = [];
    data.FromDashboardFieldArr = [];
    data.CrossFilter = {};
    data.CrossFilterValues = {};
    data.allBatchDetails = "";
    data.isAtchdandBIdBasedSearchClicked = false;
    data.AtchdandBIdTableName = '';
    data.AtchdandBIdStatus = '';

    return data;
});

angular.module('VolpayApp').service('AllStmtGlobalData', function () {

    var data = {};

    /*** set the default sort properties ***/
    data.orderByField = 'ReceivedDate';
    data.sortReverse = false;
    data.sortType = 'Desc';
    data.isSortingClicked = false;

    data.DataLoadedCount = 20;
    data.myProfileFLindex = '';

    /*** Noramal Search ***/
    data.all = true;
    data.today = false;
    data.week = false;
    data.month = false;
    data.custom = false;

    data.FLuir = '';

    data.startDate = '';
    data.endDate = '';
    data.ShowStartDate = '';
    data.ShowEndDate = '';

    data.todayDate = '';
    data.weekStart = '';
    data.weekEnd = '';
    data.monthStart = '';
    data.monthEnd = '';

    data.selectCriteriaTxt = 'All';
    data.selectCriteriaID = 1;
    data.prev = 'all';
    data.prevSelectedTxt = 'all';
    data.prevId = 1;

    data.searchClicked = false;
    data.isEntered = false;

    data.fromDashboard = false;

    /****** Advanced Search ********/
    data.advancedSearchEnable = false;
    data.searchParams = {
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
    };

    data.searchNameDuplicated = false;
    data.SelectSearchVisible = false;
    data.searchname = '';

    data.fromMyProfilePage = false;
    data.FieldArr = [];
    data.FromDashboardFieldArr = [];
    data.CrossFilter = {};
    data.CrossFilterValues = {};
    data.allPaymentDetails = "";
    data.isAtchdandBIdBasedSearchClicked = false;
    data.AtchdandBIdTableName = '';
    data.AtchdandBIdStatus = '';

    return data;
});

angular.module('VolpayApp').filter('utf8Decode', function () {
    return function (utf8String) {
        if (typeof utf8String != 'string')
            throw new TypeError('parameter ‘utf8String’ is not a string');

        const unicodeString = utf8String.replace(
            /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
            function (c) {
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            }).replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g,
                function (c) {
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                }
            );

        return unicodeString;
    };
});

function underScrReplace(val) {
    return val.replace(/_/g, ' ');
}

angular.module('VolpayApp').filter("ucwords", function () {

    return function (input) {
        if (input) { //when input is defined the apply filter
            input = input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            });
        }

        return input;
    }
})

angular.module('VolpayApp').filter("jsonparse", function () {

    return function (input) {
        if (input) {
            input = JSON.parse(input)
        }

        return input;
    }
})

angular.module('VolpayApp').filter("numbers", function () {

    return function (input) {
        if (input) { //when input is defined the apply filter
            input = Number(input)
        }

        return input;
    }
});

angular.module('VolpayApp').filter('replaceASCII', function () {
    return function (value) {
        return (!value) ? '' : value.toString().replace(/&#193;/, "Á").replace(/&#225;/, "á")
            .replace(/&#201;/, "É").replace(/&#233;/, "é")
            .replace(/&#205;/, "Í").replace(/&#237;/, "í")
            .replace(/&#211;/, "Ó").replace(/&#243;/, "ó")
            .replace(/&#218;/, "Ú").replace(/&#250;/, "ú")
            .replace(/&#209;/, "Ñ").replace(/&#241;/, "ñ")
            .replace(/&#161;/, "¡")
            .replace(/&#180;/, "´")
            .replace(/&#193;/, "Á")
            .replace(/&#201;/, "É")
            .replace(/&#209;/, "Ñ")
            .replace(/&#211;/, "Ó")
            .replace(/&#215;/, "×")
            .replace(/&#217;/, "Ù")
            .replace(/&#218;/, "Ú")
            .replace(/&#224;/, "à")
            .replace(/&#225;/, "á")
            .replace(/&#232;/, "è")
            .replace(/&#233;/, "é")
            .replace(/&#236;/, "ì")
            .replace(/&#237;/, "í")
            .replace(/&#238;/, "î")
            .replace(/&#239;/, "ï")
            .replace(/&#240;/, "ð")
            .replace(/&#241;/, "ñ")
            .replace(/&#242;/, "ò")
            .replace(/&#243;/, "ó")
            .replace(/&#249;/, "ù")
            .replace(/&#250;/, "ú");

    };
});

angular.module('VolpayApp').filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});

angular.module('VolpayApp').filter('underscoreRemove', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/_/g, ' ');
    };
});

angular.module('VolpayApp').filter('removeSpace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/\s+/g, '');
    };
});
angular.module('VolpayApp').filter('addunderscore', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/\s+/g, '_');
    };
});

angular.module('VolpayApp').filter('camelCaseFormatter', function () {
    return function (string) {

        string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
        string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')

        return string;
    };
});

angular.module('VolpayApp').filter('firstCapital', function () {
    return function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
});

angular.module('VolpayApp').filter('dateFormat', function () {

    return function (val) {
        if (val) {
            var value = val.split('T');
            var dateVal = value[0];
            var time,
                timezone,
                stdFormat;

            time = value[1];
            stdFormat = dateVal + " | " + time;

            return stdFormat;
        }
    };
});

angular.module('VolpayApp').filter('dateFormatonlyfordate', function () {

    return function (val) {

        if (val) {
            var value = val.split('T');
            var dateVal = value[0];
            var time,
                timezone,
                stdFormat;

            time = value[1];
            stdFormat = dateVal;

            return stdFormat;
        }
    };
});

angular.module('VolpayApp').filter('datetime', function ($filter) {
    return function (input) {
        if (input == null) {
            return "";
        }
        var _date = $filter('date')(new Date(input), 'dd-MM-yyyy | HH:mm:ss' + ':' + new Date().getMilliseconds());

        return _date.toUpperCase();
    };
});

angular.module('VolpayApp').filter('HTMLEntityDecode', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/&#(\d{2});/g, ' ');
    };
});

angular.module('VolpayApp').filter('ParseLast2Char', function () {
    return function (value) {
        return (!value) ? '' : value.slice(-2);
    };
});

angular.module('VolpayApp').filter('hex2a', function () {
    return function (hex) {
        if (hex) {
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                var v = parseInt(hex.substr(i, 2), 16);
                if (v)
                    str += String.fromCharCode(v);
            }
            str = str.replace(/&lt;/g, '<');
            str = str.replace(/&gt;/g, '>');

            return str;
        }
    };
});

angular.module('VolpayApp').filter('Xml2Json', function () {
    return function (xml) {
        var x2js = new X2JS();

        return x2js.xml_str2json(xml);
    }
});

angular.module('VolpayApp').filter('stringToHex', function () {
    return function (str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }

        return hex;
    }
});

angular.module('VolpayApp').filter("cleanItem", function () {
    return function (text) {
        text = String(text).replace(",", ", ");

        return text ? String(text).replace(/"<[^>]+>/gm, ' ') : '';
    }
});

angular.module('VolpayApp').service('datepickerFaIcons', function () {
    var data = {};
    data.icons = {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-clock-o',
        clear: 'fa fa-trash-o',
        close: 'fa fa-remove'
    }

    return data;
});

function stringToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }

    return hex;
}

function hexToString(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v)
            str += String.fromCharCode(v);
    }
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');

    return str;
};

angular.module('VolpayApp').factory('dataFormatService', function () {

    function currencyConvert(data, keys, locale, currencyType) {
        // format number to currency type
        let USDollar = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyType
        });
        keys.forEach((key) => {
            data.forEach((obj) => {
                obj[key] = typeof (obj?.[key]) != 'undefined' && (typeof (obj?.[key]) == 'number' || typeof (obj?.[key]) == 'string') ? USDollar.format(obj[key]) : obj[key];
            });
        });
    }

    function booleanToString(data, keys) {
        keys.forEach((key, keyindex) => {
            data.forEach((obj, index, data) => {
                //obj[key] = obj[key].toString() == 'true' ? 'Yes' : 'No';
                stringValue = typeof (obj?.[key]) != 'undefined' ? obj?.[key].toString()?.toLowerCase()?.trim() : obj?.[key];
                switch (stringValue) {
                    case "true":
                        obj[key] = "Yes";
                        break;
                    case "yes":
                        obj[key] = "Yes";
                        break;
                    case "1":
                        obj[key] = "Yes";
                        break;
                    case "false":
                        obj[key] = "No";
                        break;
                    case "no":
                        obj[key] = "No";
                        break;
                    case "0":
                        obj[key] = "No";
                        break;
                    default:
                        obj[key] = obj[key];
                }
            });
        });
    }

    return {
        currencyConvert: currencyConvert,
        booleanToString: booleanToString
    };
});

angular.module('VolpayApp').filter('removeSlaceN', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/\n/g, '<br>');
    };
});

angular.module('VolpayApp').filter('removeSlaceNN', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/\\n/g, '<br>');
    };
});

angular.module('VolpayApp').filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

angular.module('VolpayApp').filter('string', function () {
    return function (input) {
        if (input) {
            return input.toString();
        }
    };
});

if (configData) {
    if (Object.keys(configData).indexOf('isCaseSensitive') != -1) {
        if (configData['isCaseSensitive']) {
            var isCaseSensitivevalforAdv = "1"
        } else {
            var isCaseSensitivevalforAdv = "0"
        }
    }
}

angular.module('VolpayApp').factory('PersonService', function ($http, $state, $rootScope, $location) {
    var items = [];
    var txtVal = ''
    var txtBoxVal = '';

    var fileObj = {};
    fileObj.UserId = '';
    fileObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {
        var Obj = {}
        obj.Operator = "AND";
        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        for (var i in WildcardSearchData) {
            if (WildcardSearchData[i].module == sessionStorage.selectedMenu) {
                for (var j in WildcardSearchData[i].wildCardSearchFields) {
                    if (WildcardSearchData[i].wildCardSearchFields[j] == ff[0]) {
                        WC = "like";
                        break;
                    }
                }
            }
        }

        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "EntryDate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "EntryDate"
        }

        if (val.indexOf("TransportName") > -1) {
            WC = "WC";
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'like') {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }


    /**
     * @name queryFinder
     * @param {*} fname
     * @returns obj.Queryfield
     * @description To check the mandatory in the form by using field name
     */
    function queryFinder() {
        if ($location.path() == '/app/accounts') {
            obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "==",
                "ColumnValue": "Account Information Request"
            },
            {
                "ColumnName": "InstructionType",
                "ColumnOperation": "==",
                "ColumnValue": "Account Information Response",
                "isCaseSensitive": false
            }
            ];
        } else if ($location.path() == '/app/instructions') {
            obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "Account Information Request"
            },
            {
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "Account Information Response",
                "isCaseSensitive": false
            }
            ];
        } else {
            obj.Queryfield = [];
        }

        return obj.Queryfield;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;

        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;

    return {
        totalFileStatus: function (fileStatusList) {

            //var ob={}
            //ob.UserId=sessionStorage.UserID;
            return $http.get(BASEURL + RESTCALL.UniqueFileListStatus).then(function (response) {
                items = response.data;

                return items;
            }, function (err) {

                return err;
            });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = count;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {

                return err;
            });
        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {

            if ((val1 != null) && (val2 != null)) {

                //fileObj.UserId = sessionStorage.UserID;
                // obj.UserId=sessionStorage.UserID;
                obj.QueryOrder = [];
                /*removed */
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

                if (obj.QueryOrder[0].ColumnName == 'EntryDate') {
                    obj.QueryOrder.push(objBuilderQueryOrder('InstructionID', 'Desc'))
                }
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                var dummy = {};
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                sessionStorage.currentObjs = JSON.stringify(obj);
                if ($location.path() == '/app/instructions') {
                    var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
                } else {
                    var url = BASEURL + RESTCALL.AllFileListREST
                }

                return $http.post(url, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {
            // fileObj.UserId = sessionStorage.UserID;
            //obj.UserId=sessionStorage.UserID;
            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        filterData: function (txtVal, dateSelected, orderByField, sortType) {
            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            // obj.Queryfield = [];
            obj.Queryfield = queryFinder();
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {}
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success'
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error'
                dummy.data = err.data;

                return dummy;
            });
        },
        filelistSearch: function (obj) {
            var temparr = angular.copy(obj.Queryfield);
            obj.Queryfield = queryFinder();
            obj.Queryfield = obj.Queryfield.concat(temparr);
            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);

            if (obj.QueryOrder[0].ColumnName == 'EntryDate') {
                obj.QueryOrder.push(objBuilderQueryOrder('InstructionID', 'Desc'))
            }

            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};


            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }

            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.delCnt = response.headers().deletecount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        StmtfilelistSearch: function (obj) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                /*removed */
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                // obj.Queryfield = [];
                obj.Queryfield = queryFinder();
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {

                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                sessionStorage.removeItem('currentObj');
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                sessionStorage.currentObjs = JSON.stringify(obj);
                var dummy = {};
                if ($location.path() == '/app/instructions') {
                    var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
                } else {
                    var url = BASEURL + RESTCALL.AllFileListREST
                }
                return $http.post(url, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, countVal, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            // obj.Queryfield = [];
            obj.Queryfield = queryFinder();
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        //New Impl
        retainStmtSearchResults: function (FieldArr, countVal, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);

            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {

                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        //New Impl
        customSearchloadmore: function (val1, val2, txtVal, startVal, orderByField, sortType) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];

                //obj.Queryfield = [];
                /*removed */
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.start = startVal;
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.start = startVal;
                }
                obj = constructQuery(obj);
                sessionStorage.currentObjs = JSON.stringify(obj);
                var dummy = {};
                if ($location.path() == '/app/instructions') {
                    var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
                } else {
                    var url = BASEURL + RESTCALL.AllFileListREST
                }

                return $http.post(url, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterDataLoadmore: function (txtVal, startVal, dateSelected, orderByField, sortType) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */

            obj.Queryfield = queryFinder();

            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.count = 20;
            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                obj.start = startVal;

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                obj.start = startVal;
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }

            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }

                // fileObj.Data = btoa(JSON.stringify(obj));

            }
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                }
                obj = constructQuery(obj);
                sessionStorage.currentObjs = JSON.stringify(obj);
                var dummy = {};

                if ($location.path() == '/app/instructions') {
                    var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
                } else {
                    var url = BASEURL + RESTCALL.AllFileListREST
                }
                return $http.post(url, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                /*removed */
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                // fileObj.Data = btoa(JSON.stringify(obj));
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                sessionStorage.currentObjs = JSON.stringify(obj);
                var dummy = {};
                if ($location.path() == '/app/instructions') {
                    var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
                } else {
                    var url = BASEURL + RESTCALL.AllFileListREST
                }

                return $http.post(url, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, fieldArr) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }

            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearch: function (fieldArr, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */

            if ($location.path() == '/app/instructions') {
                obj.Queryfield = [];
            } else {
                obj.Queryfield = queryFinder();
            }

            // obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {

                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.delCnt = response.headers().deletecount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            /*removed */
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            // obj.Queryfield = [];
            obj.Queryfield = queryFinder();
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customEndDate, "less"));
            obj.start = 0;
            obj.count = 20;

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }
            
            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (startVal, dateSelected, orderByField, sortType) {

            var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj.start = startVal;
            obj.count = 20;

            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }

            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearchLoadmore: function (startVal, customStrdDate, customEndDate, orderByField, sortType) {
            var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));
            obj.start = startVal;
            obj.count = 20;
            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = BASEURL + RESTCALL.AllFileListREST
            }

            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.currentObj);
            if (obj.QueryOrder[0].ColumnName == 'EntryDate') {
                obj.QueryOrder.push(objBuilderQueryOrder('InstructionID', 'Desc'))
            }

            obj = constructQuery(obj);
            sessionStorage.currentObjs = JSON.stringify(obj);
            var dummy = {};
            if ($location.path() == '/app/instructions') {
                var url = BASEURL + '/rest/v2/ach/instructions/instructionmop/readall'
            } else {
                var url = sessionStorage.FileListCurrentRESTCALL
            }

            return $http.post(url, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.delCnt = response.headers().deletecount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('AccountsPersonService', function ($http) {

    var items = [];
    var txtVal = ''
    var txtBoxVal = '';

    var fileObj = {};
    fileObj.UserId = '';
    fileObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {
        var Obj = {}
        obj.Operator = "AND";
        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "EntryDate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "EntryDate"
        }

        if (val.indexOf("TransportName") > -1) {
            WC = "WC";
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;
        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;

    return {
        totalFileStatus: function (fileStatusList) {

            //var ob={}
            //ob.UserId=sessionStorage.UserID;
            return $http.get(BASEURL + RESTCALL.UniqueFileListStatus).then(function (response) {
                items = response.data;
                return items;
            }, function (err) {
                return err;
            });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = count;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                return err;
            });

        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {

            if ((val1 != null) && (val2 != null)) {

                //fileObj.UserId = sessionStorage.UserID;
                // obj.UserId=sessionStorage.UserID;
                obj.QueryOrder = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                var dummy = {};
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {
            // fileObj.UserId = sessionStorage.UserID;
            //obj.UserId=sessionStorage.UserID;
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        filterData: function (txtVal, dateSelected, orderByField, sortType) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {}
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success'
                dummy.data = response.data
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error'
                dummy.data = err.data;

                return dummy;
            });
        },
        filelistSearch: function (obj) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        StmtfilelistSearch: function (obj) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            
            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {

                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                sessionStorage.removeItem('currentObj');
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, countVal, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        //New Impl
        retainStmtSearchResults: function (FieldArr, countVal, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            
            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        //New Impl
        customSearchloadmore: function (val1, val2, txtVal, startVal, orderByField, sortType) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];

                //obj.Queryfield = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.start = startVal;
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.start = startVal;
                }
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterDataLoadmore: function (txtVal, startVal, dateSelected, orderByField, sortType) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.count = 20;
            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                obj.start = startVal;

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                obj.start = startVal;
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }

            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }

                // fileObj.Data = btoa(JSON.stringify(obj));

            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                }
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                // fileObj.Data = btoa(JSON.stringify(obj));
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });

            }
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, fieldArr) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }
            obj = constructQuery(obj);
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearch: function (fieldArr, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {

                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);

            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customEndDate, "less"));
            obj.start = 0;
            obj.count = 20;

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (startVal, dateSelected, orderByField, sortType) {

            var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj.start = startVal;
            obj.count = 20;

            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearchLoadmore: function (startVal, customStrdDate, customEndDate, orderByField, sortType) {
            var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));
            obj.start = startVal;
            obj.count = 20;
            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.currentObj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(sessionStorage.FileListCurrentRESTCALL, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('StmtPersonService', function ($http) {

    var items = [];
    var txtVal = ''
    var txtBoxVal = '';

    var fileObj = {};
    fileObj.UserId = '';
    fileObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {
        var Obj = {}
        obj.Operator = "AND";
        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "EntryDate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "EntryDate"
        }

        if (val.indexOf("TransportName") > -1) {
            WC = "WC";
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;

        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;

    return {
        totalFileStatus: function (fileStatusList) {

            //var ob={}
            //ob.UserId=sessionStorage.UserID;
            return $http.get(BASEURL + RESTCALL.UniqueFileListStatus).then(function (response) {
                items = response.data;

                return items;
            }, function (err) {
                return err;
            });

        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = count;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                return err;
            });

        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {

            if ((val1 != null) && (val2 != null)) {

                //fileObj.UserId = sessionStorage.UserID;
                // obj.UserId=sessionStorage.UserID;
                obj.QueryOrder = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                var dummy = {};
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }

        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {
            // fileObj.UserId = sessionStorage.UserID;
            //obj.UserId=sessionStorage.UserID;
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        paymentListSearch: function (obj, WilcardOverride) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            obj = constructQuery(obj, WilcardOverride);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        filterData: function (txtVal, dateSelected, orderByField, sortType) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj, WilcardOverride)
            var dummy = {}

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success'
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error'
                dummy.data = err.data;

                return dummy;
            });
        },
        filelistSearch: function (obj) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj, WilcardOverride)
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        StmtfilelistSearch: function (obj) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                sessionStorage.removeItem('currentObj');
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};
                
                return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, countVal, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        //New Impl
        retainStmtSearchResults: function (FieldArr, countVal, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            /* obj.Queryfield = [{
                "ColumnName": "InstructionType",
                "ColumnOperation": "!=",
                "ColumnValue": "RESPONSE"
            }]; */
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        //New Impl
        customSearchloadmore: function (val1, val2, txtVal, startVal, orderByField, sortType) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];

                //obj.Queryfield = [];
                //obj.Queryfield = [];
                /* obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }]; */
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.start = startVal;
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.start = startVal;
                }
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });

            }
        },
        filterDataLoadmore: function (txtVal, startVal, dateSelected, orderByField, sortType) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.count = 20;
            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                obj.start = startVal;

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                obj.start = startVal;
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }

            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }

                // fileObj.Data = btoa(JSON.stringify(obj));

            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //   "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                }
                obj = constructQuery(obj);
                var dummy = {};
                return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                // fileObj.Data = btoa(JSON.stringify(obj));
                sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
                sessionStorage.currentObj = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, fieldArr) {

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }
            obj = constructQuery(obj);
            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearch: function (fieldArr, dateSelected, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType) {

            sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customEndDate, "less"));
            obj.start = 0;
            obj.count = 20;

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('currentObj');
            sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllStatementList;
            sessionStorage.currentObj = JSON.stringify(obj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        advancedSearchLoadmore: function (startVal, dateSelected, orderByField, sortType) {

            var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);
            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj.start = startVal;
            obj.count = 20;

            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearchLoadmore: function (startVal, customStrdDate, customEndDate, orderByField, sortType) {
            var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);

            obj.QueryOrder = [];
            //obj.Queryfield = [];
            //obj.Queryfield = [{
            //    "ColumnName": "InstructionType",
            //    "ColumnOperation": "!=",
            //    "ColumnValue": "RESPONSE"
            //}];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));
            obj.start = startVal;
            obj.count = 20;
            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllStatementList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.currentObj);
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(sessionStorage.FileListCurrentRESTCALL, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('RefService', function ($http) {

    var txtVal = '';
    var items = [];

    var PaymentObj = {};
    PaymentObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {

        var Obj = {};
        obj.Operator = "AND";

        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        for (var i in WildcardSearchData) {
            if (WildcardSearchData[i].module == sessionStorage.selectedMenu) {
                for (var j in WildcardSearchData[i].wildCardSearchFields) {
                    if (WildcardSearchData[i].wildCardSearchFields[j] == ff[0]) {
                        WC = "like";
                        break;
                    }
                }
            }
        }

        /*** To Add Entry Date in Advanced Search ***/
        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "ReceivedDate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "ReceivedDate"
        }

        /*** To Add Value Date in Advanced Search ***/
        if (val.indexOf("ValueStartDate") > -1) {
            WC = "great";
            Obj.ColumnName = "ValueDate";
        }

        if (val.indexOf("ValueEndDate") > -1) {
            WC = "less";
            Obj.ColumnName = "ValueDate"
        }

        /*** To Add Amount in Advanced Search ***/
        if (val.indexOf("AmountStart") > -1) {
            WC = "great";
            Obj.ColumnName = "Amount";
        }

        if (val.indexOf("AmountEnd") > -1) {
            WC = "less";
            Obj.ColumnName = "Amount"
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'like') {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;
        //obj.Operator = 'AND';
        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;
    obj.Operator = 'AND';

    return {
        GetUniquePaymentDropdown: function () {
            return $http.get(BASEURL + RESTCALL.UniquePaymentData).then(function (response) {
                items = response.data;
                return items;
            }, function (err) {
                return err;
            });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            if (orderByField !== 'PaymentID') {
                obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
            }

            obj.start = 0;
            obj.count = count;

            if (txtVal) {

                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};

            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        paymentListSearch: function (obj, WilcardOverride) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            obj = constructQuery(obj, WilcardOverride);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        filterData: function (txtVal, orderByField, sortType, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {

                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }

            }
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },

        filterDataLoadmore: function (txtVal, orderByField, sortType, startVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); //VOLPAY-10710
            obj.start = startVal;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {

                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }

            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        dropDownLoadMore: function (startVal) {
            obj.start = startVal;
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        customSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = startVal;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);
            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, FieldArr) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            if (obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3) {
                for (i in obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3) {
                    if (obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses[0].columnName == "PaymentID") {
                        obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses[0].isCaseSensitive = "1"
                    }
                }
            }

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });

            }

        },

        advancedSearch: function (fieldArr, orderByField, sortType, dateSelected, newobj) {
            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710: Duplicated Payments in List fix
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            if (obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3) {
                for (i in obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3) {
                    if (obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses[0].columnName == "PaymentID") {
                        obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses[0].isCaseSensitive = "1"
                    }
                }
            }

            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });

        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType, newobj) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (orderByField, sortType, startVal, dateSelected, FieldArr) {

            var REST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710

            obj.start = startVal;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomLoadmore: function (val1, val2, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                obj.start = startVal;
                obj.count = 20;
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, orderByField, sortType, countVal, dateSelected, crossObj) {

            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }
            /*
            if (crossObj) {


            obj.crossTableFilter = crossObj;

            } */

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            var dummy = {};
            return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;
                return dummy;
            });
        },
        retainCustomSearchResults: function (val1, val2, FieldArr, orderByField, sortType, countVal) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                for (var l = 0; l < FieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
                }

                sessionStorage.removeItem('AllPaymentsCurrentObject');
                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },

        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.AllPaymentsCurrentObject);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(sessionStorage.AllPaymentsCurrentRESTCALL, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('RefServicetransaction', function ($http) {

    var txtVal = '';
    var items = [];

    var PaymentObj = {};
    PaymentObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {

        var Obj = {};
        obj.Operator = "AND";

        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        for (var i in WildcardSearchData) {
            if (WildcardSearchData[i].module == sessionStorage.selectedMenu) {
                for (var j in WildcardSearchData[i].wildCardSearchFields) {
                    if (WildcardSearchData[i].wildCardSearchFields[j] == ff[0]) {
                        WC = "like";
                        break;
                    }
                }
            }
        }

        /*** To Add Entry Date in Advanced Search ***/
        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "ReceivedDate";
        }

        if (val.indexOf("DebitFxRateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "DebitFxRate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "ReceivedDate"
        }

        if (val.indexOf("DebitFxRateEndBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "DebitFxRate"
        }

        /*** To Add Value Date in Advanced Search ***/
        if (val.indexOf("ValueStartDate") > -1) {
            WC = "great";
            Obj.ColumnName = "ValueDate";
        }

        if (val.indexOf("ValueEndDate") > -1) {
            WC = "less";
            Obj.ColumnName = "ValueDate"
        }

        /*** To Add Amount in Advanced Search ***/
        if (val.indexOf("AmountStart") > -1) {
            WC = "great";
            Obj.ColumnName = "Amount";
        }

        if (val.indexOf("AmountEnd") > -1) {
            WC = "less";
            Obj.ColumnName = "Amount"
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'like') {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;
        //obj.Operator = 'AND';
        return Obj;
    }
    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;
    obj.Operator = 'AND';

    return {

        GetUniquePaymentDropdown: function () {
            return $http.get(BASEURL + RESTCALL.UniquePaymentData).then(function (response) {
                items = response.data;

                return items;
            }, function (err) {
                return err;
            });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected, dropdownSelecteddata) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            if (orderByField !== 'PaymentID') {
                obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
            }

            obj.start = 0;
            obj.count = count;

            if (txtVal) {

                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};

            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata };

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count, dropdownSelecteddata) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);
                headers = { "TransactionACH": dropdownSelecteddata };

                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        paymentListSearch: function (obj, WilcardOverride, dropdownSelecteddata) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            obj = constructQuery(obj, WilcardOverride);
            var dummy = {};
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        filterData: function (txtVal, orderByField, sortType, dateSelected, dropdownSelecteddata) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {

                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType, dropdownSelecteddata) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);
                headers = { "TransactionACH": dropdownSelecteddata }

                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;
                    
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;
                    
                    return dummy;
                });
            }
        },
        filterDataLoadmore: function (txtVal, orderByField, sortType, startVal, dateSelected, dropdownSelecteddata) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); //VOLPAY-10710
            obj.start = startVal;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        dropDownLoadMore: function (startVal) {
            obj.start = startVal;
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, startVal, dropdownSelecteddata) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = startVal;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                var dummy = {};
                obj = constructQuery(obj);
                headers = { "TransactionACH": dropdownSelecteddata }
                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected, dropdownSelecteddata) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr, dropdownSelecteddata) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata }
            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, FieldArr, dropdownSelecteddata) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata }
            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal, dropdownSelecteddata) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }
                var dummy = {};
                obj = constructQuery(obj);
                headers = { "TransactionACH": dropdownSelecteddata }

                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;
                    
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;
                   
                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr, dropdownSelecteddata) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;
                
                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;
                
                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr, dropdownSelecteddata) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

                obj = constructQuery(obj);
                headers = { "TransactionACH": dropdownSelecteddata }

                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;
                    
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearch: function (fieldArr, orderByField, sortType, dateSelected, newobj, dropdownSelecteddata) {

            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710: Duplicated Payments in List fix
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            var dummy = {};
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {

                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType, newobj, dropdownSelecteddata) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);
            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (orderByField, sortType, startVal, dateSelected, FieldArr, dropdownSelecteddata) {

            var REST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710

            obj.start = startVal;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};
            headers = { "TransactionACH": dropdownSelecteddata }
            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomLoadmore: function (val1, val2, orderByField, sortType, startVal, dropdownSelecteddata) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                obj.start = startVal;
                obj.count = 20;
                obj = constructQuery(obj);
                var dummy = {};
                headers = { "TransactionACH": dropdownSelecteddata }

                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;
                    
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;
                    
                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, orderByField, sortType, countVal, dateSelected, dropdownSelecteddata, crossObj) {

            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.QueryOrder.push(objBuilderQueryOrder('PaymentID', sortType)); // VOLPAY-10710
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }
            /*
            if (crossObj) {


            obj.crossTableFilter = crossObj;

            } */

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            var dummy = {};
            headers = { "TransactionACH": dropdownSelecteddata }

            return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;
                dummy.transactionvalue = response.headers().transactionvalue;
                dummy.transactionvolume = response.headers().transactionvolume;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        retainCustomSearchResults: function (val1, val2, FieldArr, orderByField, sortType, countVal, dropdownSelecteddata) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                for (var l = 0; l < FieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
                }

                sessionStorage.removeItem('AllPaymentsCurrentObject');
                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AlltransactionREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};
                headers = { "TransactionACH": dropdownSelecteddata }
                
                return $http.post(BASEURL + RESTCALL.AlltransactionREST, obj, { headers: headers }).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    dummy.transactionvalue = response.headers().transactionvalue;
                    dummy.transactionvolume = response.headers().transactionvolume;
                    
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;
                    
                    return dummy;
                });
            }
        },
        refreshAll: function (section) {
            var obj = JSON.parse(sessionStorage.AllPaymentsCurrentObject);
            var dummy = {};
            obj = constructQuery(obj);
            if (section != null && section != undefined && section != '') {
                headers = { "TransactionACH": section }
            }

            return $http.post(sessionStorage.AllPaymentsCurrentRESTCALL, obj, { headers: headers }).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('BatchRefService', function ($http) {

    var txtVal = '';
    var items = [];

    var BatchObj = {};
    BatchObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {

        var Obj = {};
        obj.Operator = "AND";

        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        /*** To Add Entry Date in Advanced Search ***/
        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "EntryDate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "EntryDate"
        }

        /*** To Add Value Date in Advanced Search ***/
        if (val.indexOf("ValueStartDate") > -1) {
            WC = "great";
            Obj.ColumnName = "ValueDate";
        }

        if (val.indexOf("ValueEndDate") > -1) {
            WC = "less";
            Obj.ColumnName = "ValueDate"
        }

        /*** To Add Amount in Advanced Search ***/
        if (val.indexOf("AmountStart") > -1) {
            WC = "great";
            Obj.ColumnName = "Amount";
        }

        if (val.indexOf("AmountEnd") > -1) {
            WC = "less";
            Obj.ColumnName = "Amount"
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;
        //obj.Operator = 'AND';

        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;
    obj.Operator = 'AND';

    return {
        GetUniquePaymentDropdown: function () {
            return $http.get(BASEURL + RESTCALL.UniquePaymentData).then(function (response) {
                items = response.data;
                return items;
            }, function (err) {
                return err;
            });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = count;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
            var dummy = {};

            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
                sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        paymentListSearch: function (obj, WilcardOverride) {
            sessionStorage.removeItem('currentObj');
            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
            obj = constructQuery(obj, WilcardOverride);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        filterData: function (txtVal, orderByField, sortType, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }
            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
                sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterDataLoadmore: function (txtVal, orderByField, sortType, startVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = startVal;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {

                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        dropDownLoadMore: function (startVal) {
            obj.start = startVal;
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = startVal;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }

                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, FieldArr) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },

        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
                }
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
                sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);

                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearch: function (fieldArr, orderByField, sortType, dateSelected, newobj) {
            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllBatchesCurrentObject');
            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType, newobj) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customEndDate, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllBatchesCurrentObject');
            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);
            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (orderByField, sortType, startVal, dateSelected, FieldArr) {

            var REST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            obj.start = startVal;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomLoadmore: function (val1, val2, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                obj.start = startVal;
                obj.count = 20;
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, orderByField, sortType, countVal, dateSelected, crossObj) {

            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }
            /*
            if (crossObj) {


            obj.crossTableFilter = crossObj;

            } */

            sessionStorage.removeItem('AllBatchesCurrentObject');
            sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
            sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        retainCustomSearchResults: function (val1, val2, FieldArr, orderByField, sortType, countVal) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

                for (var l = 0; l < FieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
                }

                sessionStorage.removeItem('AllBatchesCurrentObject');
                sessionStorage.AllBatchesCurrentRESTCALL = BASEURL + RESTCALL.AllBatchesREST;
                sessionStorage.AllBatchesCurrentObject = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllBatchesREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },

        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.AllBatchesCurrentObject);
            var dummy = {};
            obj = constructQuery(obj);
            return $http.post(sessionStorage.AllBatchesCurrentRESTCALL, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('StmtRefService', function ($http) {

    var txtVal = '';
    var items = [];

    var PaymentObj = {};
    PaymentObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {

        var Obj = {};
        obj.Operator = "AND";

        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        /*** To Add Entry Date in Advanced Search ***/
        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "ReceivedDate";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "ReceivedDate"
        }

        /*** To Add Value Date in Advanced Search ***/
        if (val.indexOf("ValueStartDate") > -1) {
            WC = "great";
            Obj.ColumnName = "ValueDate";
        }

        if (val.indexOf("ValueEndDate") > -1) {
            WC = "less";
            Obj.ColumnName = "ValueDate"
        }

        /*** To Add Amount in Advanced Search ***/
        if (val.indexOf("AmountStart") > -1) {
            WC = "great";
            Obj.ColumnName = "Amount";
        }

        if (val.indexOf("AmountEnd") > -1) {
            WC = "less";
            Obj.ColumnName = "Amount"
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;
        //obj.Operator = 'AND';
        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;
    obj.Operator = 'AND';

    return {
        GetUniquePaymentDropdown: function () {

            // return $http.get(BASEURL + RESTCALL.UniquePaymentData).then(function (response) {
            // items = response.data;
            // return items;
            // }, function (err) {

            // return err;
            // });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = count;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};

            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterData: function (txtVal, orderByField, sortType, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterDataLoadmore: function (txtVal, orderByField, sortType, startVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = startVal;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {

                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        dropDownLoadMore: function (startVal) {
            obj.start = startVal;
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = startVal;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }

                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, FieldArr) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
                }
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearch: function (fieldArr, orderByField, sortType, dateSelected, newobj) {
            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType, newobj) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);
            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (orderByField, sortType, startVal, dateSelected, FieldArr) {

            var REST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            obj.start = startVal;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomLoadmore: function (val1, val2, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                obj.start = startVal;
                obj.count = 20;
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, orderByField, sortType, countVal, dateSelected, crossObj) {

            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }
            /*
            if (crossObj) {


            obj.crossTableFilter = crossObj;

            } */

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        retainCustomSearchResults: function (val1, val2, FieldArr, orderByField, sortType, countVal) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

                for (var l = 0; l < FieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
                }

                sessionStorage.removeItem('AllPaymentsCurrentObject');
                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllstatementTxnList;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllstatementTxnList, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.AllPaymentsCurrentObject);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(sessionStorage.AllPaymentsCurrentRESTCALL, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('AllAccountService', function ($http) {

    var txtVal = '';
    var items = [];

    var PaymentObj = {};
    PaymentObj.UserId = sessionStorage.UserID;

    function objBuilderQueryField(val, WC) {

        var Obj = {};
        obj.Operator = "AND";

        var ff = val.split('=');
        Obj.ColumnName = ff[0];

        /*** To Add Entry Date in Advanced Search ***/
        if (val.indexOf("EntryDateBetween") > -1) {
            WC = "great";
            Obj.ColumnName = "ExecutionDateTime";
        }

        if (val.indexOf("EndDateBetween") > -1) {
            WC = "less";
            Obj.ColumnName = "ReceivedDate"
        }

        /*** To Add Value Date in Advanced Search ***/
        if (val.indexOf("ValueStartDate") > -1) {
            WC = "great";
            Obj.ColumnName = "ValueDate";
        }

        if (val.indexOf("ValueEndDate") > -1) {
            WC = "less";
            Obj.ColumnName = "ValueDate"
        }

        /*** To Add Amount in Advanced Search ***/
        if (val.indexOf("AmountStart") > -1) {
            WC = "great";
            Obj.ColumnName = "Amount";
        }

        if (val.indexOf("AmountEnd") > -1) {
            WC = "less";
            Obj.ColumnName = "Amount"
        }

        if (WC == "WC") {
            Obj.ColumnOperation = "like";
            Obj.ColumnValue = '%' + ff[1] + '%';
        } else if (WC == "less") {
            Obj.ColumnOperation = "<=";
            Obj.ColumnValue = ff[1];
        } else if (WC == 'great') {
            Obj.ColumnOperation = ">=";
            Obj.ColumnValue = ff[1];
        } else {
            Obj.ColumnOperation = "=";
            Obj.ColumnValue = ff[1];
        }

        return Obj;
    }

    function objBuilderQueryOrder(field, type) {
        var Obj = {}
        Obj.ColumnName = field;
        Obj.ColumnOrder = type;
        //obj.Operator = 'AND';
        return Obj;
    }

    //POSTING Object
    obj = {};
    //obj.IsReadAllRecord=true;
    //obj.UserId=sessionStorage.UserID;
    obj.start = 0;
    obj.count = 20;
    obj.Operator = 'AND';

    return {

        GetUniquePaymentDropdown: function () {
            return $http.get(BASEURL + RESTCALL.UniquePaymentData).then(function (response) {
                items = response.data;
                return items;
            }, function (err) {
                return err;
            });
        },
        getFeedNewAllSorting: function (txtVal, orderByField, sortType, count, dateSelected) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = count;

            if (txtVal) {

                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }

            } else {

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};

            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        getFeedNewAllCustomSorting: function (val1, val2, txtVal, orderByField, sortType, count) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = count;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterData: function (txtVal, orderByField, sortType, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (txtVal) {

                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            }
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearch: function (val1, val2, txtVal, orderByField, sortType) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        filterDataLoadmore: function (txtVal, orderByField, sortType, startVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = startVal;
            obj.count = 20;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {

                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        dropDownLoadMore: function (startVal) {
            obj.start = startVal;
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        customSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = startVal;
                obj.count = 20;

                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                }

                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        sortingLoadmore: function (txtVal, orderByField, sortType, countVal, dateSelected) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (txtVal) {
                obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            } else {
                if (dateSelected == "Today") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
                } else if (dateSelected == "Week") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
                } else if (dateSelected == "Month") {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
                }
            }
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSortingLoadmore: function (orderByField, sortType, countVal, dateSelected, FieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSortingLoadmore: function (val1, val2, orderByField, sortType, countVal, FieldArr) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;
            obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
            obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }

            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        sortingCustomSearchLoadmore: function (val1, val2, txtVal, orderByField, sortType, countVal) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if ((val1 != null) && (val2 != null)) {
                if (txtVal) {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));
                    obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
                } else {
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                    obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));

                }
                var dummy = {};
                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearchSorting: function (orderByField, sortType, countVal, dateSelected, fieldArr) {

            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomSorting: function (val1, val2, orderByField, sortType, countVal, fieldArr) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));

                for (var l = 0; l < fieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
                }

                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

                obj = constructQuery(obj);

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        advancedSearch: function (fieldArr, orderByField, sortType, dateSelected, newobj) {
            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(fieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
            }

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedCustomSearch: function (fieldArr, customStrdDate, customEndDate, orderByField, sortType, newobj) {
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = 20;

            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + customStrdDate, "great"));
            obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + customEndDate, "less"));

            for (var l = 0; l < fieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
            }

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
            var dummy = {};
            obj = constructQuery(obj);

            if (newobj) {
                if (newobj.flag) {
                    obj['crossTableFilter'] = newobj.crossFilter
                }
            }

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchLoadmore: function (orderByField, sortType, startVal, dateSelected, FieldArr) {

            var REST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

            obj.start = startVal;
            obj.count = 20;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
            }

            for (var l = 0; l < REST.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(REST[l]))
            }
            obj = constructQuery(obj);
            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        advancedSearchCustomLoadmore: function (val1, val2, orderByField, sortType, startVal) {
            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));

                obj.start = startVal;
                obj.count = 20;
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;

                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;

                    return dummy;
                });
            }
        },
        retainSearchResults: function (FieldArr, orderByField, sortType, countVal, dateSelected, crossObj) {

            sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(FieldArr);
            obj.QueryOrder = [];
            obj.Queryfield = [];
            obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
            obj.start = 0;
            obj.count = countVal;

            if (dateSelected == "Today") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + todayDate()));
            } else if (dateSelected == "Week") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + week().todayDate, "less"));
            } else if (dateSelected == "Month") {
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().lastDate, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + month().todayDate, "less"));
            }

            for (var l = 0; l < FieldArr.length; l++) {
                obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
            }
            /*
            if (crossObj) {


            obj.crossTableFilter = crossObj;

            } */

            sessionStorage.removeItem('AllPaymentsCurrentObject');
            sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
            sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

            obj = constructQuery(obj);

            var dummy = {};

            return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        },
        retainCustomSearchResults: function (val1, val2, FieldArr, orderByField, sortType, countVal) {

            if ((val1 != null) && (val2 != null)) {
                obj.QueryOrder = [];
                obj.Queryfield = [{
                    "ColumnName": "InstructionType",
                    "ColumnOperation": "!=",
                    "ColumnValue": "RESPONSE"
                }];
                obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
                obj.start = 0;
                obj.count = countVal;

                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val1, "great"));
                obj.Queryfield.push(objBuilderQueryField("ExecutionDateTime=" + val2, "less"));

                for (var l = 0; l < FieldArr.length; l++) {
                    obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
                }

                sessionStorage.removeItem('AllPaymentsCurrentObject');
                sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllAccountREST;
                sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
                obj = constructQuery(obj);
                var dummy = {};

                return $http.post(BASEURL + RESTCALL.AllAccountREST, obj).then(function (response) {
                    items = response.data;
                    dummy.response = 'Success';
                    dummy.data = response.data;
                    dummy.tCnt = response.headers().totalcount;
                    return dummy;
                }, function (err) {
                    dummy.response = 'Error';
                    dummy.data = err.data;
                    return dummy;
                });
            }
        },
        refreshAll: function () {
            var obj = JSON.parse(sessionStorage.AllPaymentsCurrentObject);
            var dummy = {};
            obj = constructQuery(obj);

            return $http.post(sessionStorage.AllPaymentsCurrentRESTCALL, obj).then(function (response) {
                items = response.data;
                dummy.response = 'Success';
                dummy.data = response.data;
                dummy.tCnt = response.headers().totalcount;

                return dummy;
            }, function (err) {
                dummy.response = 'Error';
                dummy.data = err.data;

                return dummy;
            });
        }
    }
});

angular.module('VolpayApp').factory('PersonService1', function ($http) {
    return {
        GetChart1: function () {
            // 'config/chartData.json'
            return $http.get(CONFIG_JSON.chartData).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                return data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                return data;
            });
        }
    }
})

angular.module('VolpayApp').factory('ForcePWChange', function ($http) {

    return {
        log: function (loginData) {
            var loginObj = {};
            loginObj.UserId = loginData.UserId;
            loginObj.Data = btoa(JSON.stringify(loginData));
            headers = { 'ACHIND': sessionStorage.ACHIND }
            $http.post(BASEURL + RESTCALL.LoginREST, loginObj, { headers: headers }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                return data;
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                return data;
            });
        }
    }
});

angular.module('VolpayApp').factory('EntityLockService', function ($http, $q, $location) {
    return {
        checkEntityLock: function (data) {
            _data = data;

            if (data && data.IsLocked) {
                sessionStorage.previousLockedActionObj = JSON.stringify(data);
            } else {
                sessionStorage.removeItem('previousLockedActionObj');
            }

            var deferred = $q.defer();
            $http.post(BASEURL + '/rest/v2/entitylock', _data).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        },
        flushEntityLocks: function () {
            /**
             * Flush the enity lock, unlock all the locked one
             */
            if (sessionStorage.previousLockedActionObj) {
                var data = { 'TableName': JSON.parse(sessionStorage.previousLockedActionObj)['TableName'] };
                $http.post(BASEURL + '/rest/v2/flushentity', data).then(function (response) {
                    sessionStorage.removeItem('previousLockedActionObj');
                }).catch(function (response) {
                    // console.log('some internal server error occured');
                });
            }
        }
    }
});

var todayDate = function () {
    var date = new Date();
    FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

    return FromDate;
}

var custmtodayDate = function () {
    var date = new Date();
    FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

    return {
        todayDate: FromDate,
        lastDate: FromDate
    };
}

var todayDateForRemark = function () {

    var date = new Date();
    //FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    FromDate = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();

    return FromDate;
}

var week = function () {

    var today = new Date();
    var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    var lastDate = lastWeek.getFullYear() + '-' + ('0' + (lastWeek.getMonth() + 1)).slice(-2) + '-' + ('0' + lastWeek.getDate()).slice(-2);

    return {
        todayDate: todayDate,
        lastDate: lastDate
    };
}

var month = function () {

    var today = new Date()
    var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    var priorDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 31);
    var lastDate = priorDate.getFullYear() + '-' + ('0' + (priorDate.getMonth() + 1)).slice(-2) + '-' + ('0' + priorDate.getDate()).slice(-2);

    return {
        todayDate: todayDate,
        lastDate: lastDate
    };
}

var year = function () {

    var today = new Date()
    var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    var lastDate = today.getFullYear() + '-' + '01' + '-' + '01';

    return {
        todayDate: todayDate,
        lastDate: lastDate
    };
}

var clrs = {
    "ACTIVE": "#4155c3",
    "SUSPENDED": "#00BCD4",
    "CREATED": "#03a9f4",
    "WAITINGFORAPPROVAL": "#CDDC39",
    "APPROVED": "#4caf50",
    "FORREVISION": "#673ab7",
    "REJECTED": "#d81f12",
    "DELETED": "#708090",
    "PENDINGAPPROVAL": "#ff9800",
    "ERROR": "#a94442",
    "SUCCESSFUL": "#056b35",
    "FAILED": "#c1272d"
}

angular.module('VolpayApp').filter('chooseStatus', function () {
    return function (val) {
        if (val) {
            val = val.toUpperCase();
            val = val.replace(/\s+/g, '');
            return clrs[val]
        } else {
            return '#666'
        }
    }
});

var alertSize = function () {
    var mq = window.matchMedia("(max-width: 991px)");
    var headHeight,
        alertWidth;
    if (mq.matches) {
        headHeight = 0;
        alertWidth = $('.tab-content').width();
    } else {
        alertWidth = $('.tab-content').width();
        headHeight = $('.page-header').outerHeight(true) + 10;
    }
    return {
        headHeight: headHeight,
        alertWidth: alertWidth
    };
}

function getTime() {
    var now = new Date();
    let timeConstObj = ((now.getMonth() + 1) + '-' + (now.getDate()) + '-' + now.getFullYear() + " " + now.getHours() + '-' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
    return timeConstObj;
}

function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str).
        // Note that although RFC3986 reserves "!", RFC5987 does not,
        // so we do not need to escape it
        replace(/['()]/g, escape). // i.e., %27 %28 %29
        replace(/\*/g, '%2A').
        // The following are not required for percent-encoding per RFC5987,
        // so we can allow for a little better readability over the wire: |`^
        replace(/%(?:7C|60|5E)/g, unescape);
}

var idleService = function ($rootScope, $timeout, $log) {
    var idleTimer = null,
        startTimer = function () {
            idleTimer = $timeout(timerExpiring, 10000);
        },
        stopTimer = function () {
            if (idleTimer) {
                $timeout.cancel(idleTimer);
            }
        },
        resetTimer = function () {
            stopTimer();
            startTimer();
        },
        timerExpiring = function () {
            stopTimer();
            $rootScope.$broadcast('sessionExpiring');
        };

    startTimer();

    return {
        startTimer: startTimer,
        stopTimer: stopTimer,
        resetTimer: resetTimer
    };
};

angular.module('VolpayApp').filter('slashRemover', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/\//g, '/\n');
    };
});

angular.module('VolpayApp').filter('specialCharactersRemove', function () {
    return function (value) {
        if (value) {
            return value.replace(/[^a-zA-Z0-9]/g, "")
        }
    };
});

angular.module('VolpayApp').filter('trim', function () {
    return function (value) {
        return value.replace(/' '/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});

angular.module('VolpayApp').filter('trimLTSpace', function () {
    return function (value) {
        if (!angular.isString(value)) {
            return value;
        }
        return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});

/*** Mod 3 ***/
angular.module('VolpayApp').filter('mod3', function () {
    return function (value) {
        return (value / 3).toFixed(1).split('.')[1]
    };
});

angular.module('VolpayApp').filter('pwFormat', function () {
    return function (value) {
        if (value) {
            var a = '';
            for (var i = 0; i < value.length; i++) {
                a = a + '*';
            }
            return a;
        }
    }
});

var fetchErrorMessage = function (error) {

    html = $.parseHTML(error),
        nodeNames = [];
    html1 = $.parseHTML(html[6].innerHTML),
        nodeNames = [];

    var t = html1[2].innerHTML;
    var objs = JSON.parse(t);
    return objs.ErrorMessage;
}

function allowOnlyNumbersAlone(eve) {
    if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
        return true;
    } else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
        return false;
    } else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
        return false;
    } else {
        return true;
    }
}

function keyupfn(eve) {
    if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
        return true;
    } else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
        return false;
    } else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
        var a = $(eve.currentTarget).val()
        var b = a.replace(/[^0-9]/gi, '')
        $(eve.currentTarget).val(b)
        return false;
    } else {
        return true;
    }
}

function allowOnlyNumbersDecimalAlone(eve) {
    if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
        return true;
    } else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
        return true;
    } else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
        return false;
    } else {
        return true;
    }
}

function decimalKeyup(eve) {
    if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
        return true;
    } else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
        return true;
    } else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
        var a = $(eve.currentTarget).val()
        var b = a.replace(/[^0-9]/gi, '')
        $(eve.currentTarget).val(b)
        return false;
    } else {
        return true;
    }
}

/*function removeTags(eve){

}*/

function removeFromArr(arr) {
    var what,
        a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function tabOrder(eve) {
    if ($(eve.currentTarget).hasClass('DatePicker') || $(eve.currentTarget).hasClass('TimePicker')) {
        var regex = /^[0-9]$/
        if (regex.test(eve.key)) {
            return true
        } else {
            return false;
        }

    } else {
        if ((eve.keyCode == 8) || (eve.keyCode == 9)) {
            return true
        } else {
            return false;
        }
    }
}

function spaceNotAllowed(eve) {
    if (eve.keyCode == 32) {
        return false;
    } else {
        return true;
    }
}

angular.module('VolpayApp').factory('LogoutService', function ($http, $location, $rootScope, $timeout) {
    var time = new Date().getTime()
    return {
        Logout: function (flag) {
            $http.defaults.headers.common['Authorization'] = 'SessionToken:' + sessionStorage.SessionToken;
            $http.defaults.headers.common['source-indicator'] = configData.SourceIndicator;
            var logoutObj = {};
            logoutObj['SessionToken'] = sessionStorage.SessionToken;
            $http({
                url: BASEURL + RESTCALL.LogoutREST,
                method: "POST",
                data: logoutObj,
                headers: {
                    "Content-Type": "application/json",
                    "languageSelected": sessionStorage.sessionlang,
                    "userid": sessionStorage.UserID
                }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                //$rootScope.logOutMsg = data.responseMessage;
                $timeout(function () {
                    if (!flag) {
                        $rootScope.alerts = [{
                            "type": "success",
                            "msg": data.responseMessage
                        }]
                    }
                }, 500);

                //$rootScope.NotifLoaded = false;
                //logoutMsg = data.responseMessage;
                localStorage.logOutMsg = data.responseMessage;

                delete $http.defaults.headers.common['Authorization'];
                sessionStorage.clear()
                delete localStorage.ROLE_ID;
                delete localStorage.UserID;
                uiConfiguration()

                if (configData.Authorization == 'External') {
                    if (diffRestServer.LogoutUrl != undefined) {
                        window.location.href = diffRestServer.LogoutUrl + '?a=' + time;
                    } else {
                        window.location.href = configData['LogoutUrl'] + '?a=' + time;
                    }
                } else {
                    if (configData.IsRESTServerInSameMachine.toUpperCase() == 'NO') {
                        if (diffRestServer.LogoutUrl != undefined) {
                            window.location.href = diffRestServer.LogoutUrl + '?a=' + time;
                        } else {
                            window.location.href = configData['LogoutUrl'] + '?a=' + time;
                        }
                    } else {
                        // window.location.href = "/VolPayHubUI/#/login?a=" + time;
                        window.location.href = "/VolPayHubUI/#/hybridlogin?a=" + time;
                    }

                }

                /*  $('[title]').trigger('mouseleave');
                  $('[title]').css('display','none');
                  $('[data-toggle="tooltip"]').trigger('mouseleave');*/
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                delete $http.defaults.headers.common['Authorization'];
                sessionStorage.clear();
                uiConfiguration()

                if (configData.Authorization == 'External') {
                    if (diffRestServer.LogoutUrl != undefined) {
                        window.location.href = diffRestServer.LogoutUrl + '?a=' + time;
                    } else {
                        window.location.href = configData['LogoutUrl'] + '?a=' + time;
                    }
                } else {
                    if (configData.IsRESTServerInSameMachine.toUpperCase() == 'NO') {
                        if (diffRestServer.LogoutUrl != undefined) {
                            window.location.href = diffRestServer.LogoutUrl + '?a=' + time;
                        } else {
                            window.location.href = configData['LogoutUrl'] + '?a=' + time;
                        }
                    } else {
                        //  window.location.href = "/VolPayHubUI/#/login?a=" + time;
                        window.location.href = "/VolPayHubUI/#/hybridlogin?a=" + time;
                    }
                }
            });
            $rootScope.$broadcast('footervisible', 'visible');
        }
    }
});

function s2ab(s) {

    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);

    for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i);
    }

    return view;
}

angular.module('VolpayApp').service("bankData", function ($http, $q, FileSaver, Blob) {

    // Return rest request.
    return ({
        loadMoredata: loadMoredata,
        crudRequest: crudRequest,
        exportToExcel: exportToExcel,
        exportToTXT: exportToTXT,
        textDownload: textDownload,
        ApplyTimeZone: ApplyTimeZone,
        exportToExcelHtml: exportToExcelHtml
    });

    //On Scroll Load more data from rest
    function loadMoredata(len) {
        if (len >= 20) {
            feedMore = "loadMore()";
        } else {
            feedMore = "";
        }
        return feedMore;
    }

    // I add a friend with the given name to the remote collection.
    function crudRequest(_method, _url, _data) {
        var request = $http({
            method: _method,
            url: BASEURL + _url,
            data: _data
        });
        return (request.then(handleSuccess, handleError));
    }

    // I transform the error response, unwrapping the application data from the Rest Server.
    function handleError(response) {
        return ($q.reject(response));
    }

    // I transform the successful response, unwrapping the application data from the Rest Server.
    function handleSuccess(response, headers) {
        return (response);
    }

    function exportToExcel(content, name) {

        var BOM = "\uFEFF";
        var csvData = BOM + content;
        var blob = new Blob([content], { type: "text/csv;charset=utf-8" });
        FileSaver.saveAs(blob, name + '.csv');

        /* var data = new Blob([s2ab(content)], {
           type: 'application/vnd.sun.xml.calc;charset=utf-8'
        });
        FileSaver.saveAs(data, name + '.csv');*/

        /*  var data = new Blob([content], { type: 'application/vnd.sun.xml.calc;charset=utf-8' });
        FileSaver.saveAs(data, name+'.csv');

        var data = new Blob([content], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(data, 'text.txt');*/
    }

    function exportToTXT(content, name) {
        var data = new Blob([content], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(data, name + '.txt');
    }

    function exportToExcelHtml(content, name) {
        var data = new Blob([content], {
            type: 'application/vnd.sun.xml.calc;charset=utf-8'
        });
        FileSaver.saveAs(data, name + '.xls');
    }

    function textDownload(content, name) {
        var data = new Blob([content], {
            type: 'text/plain;charset=utf-8'
        });
        FileSaver.saveAs(data, name);
    }

    function ApplyTimeZone(dataArr) {
        var totArr = dataArr;
        for (var k = 0; k < totArr.length; k++) {
            var tabSelectLen = $('.' + totArr[k]).length;
            var sel;
            for (var j = 0; j < tabSelectLen; j++) {
                var dropValues = '';
                for (var i in timeZoneDropValues.TimeZone) {
                    if ($(sanitize('#' + totArr[k] + '_' + j)).attr('dropval') == timeZoneDropValues.TimeZone[i].TimeZoneId) {
                        sel = 'selected'
                    } else {
                        sel = ''
                    }
                    dropValues = '<option value="' + timeZoneDropValues.TimeZone[i].TimeZoneId + '" ' + sel + '>' + timeZoneDropValues.TimeZone[i].TimeZoneId + '</option>' + dropValues;
                }
                $(sanitize('#' + totArr[k] + '_' + j)).append(dropValues)
            }
        }
    }
});

angular.module('VolpayApp').service('editservice', function ($rootScope) {
    this.listen = function ($scope, formData, Operation, pageTitle, isSubsec) {
        $rootScope.dataModified = false;
        var newvalen,
            oldvalen;
        var nwValLength,
            olValLength;
        var newObjLen,
            oldObjLen;
        var count,
            count1;
        count = 0;
        count1 = 0;

        $scope.$watch(function () {
            return formData
        }, function (newval, oldval) {

            if (Operation == "Add") {
                if (isSubsec) {
                    for (i in newval) {
                        for (j in newval[i]) {
                            if (Object.keys(newval[i][j]).length > 1) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            }
                        }
                    }
                } else {
                    if (!$.isEmptyObject(oldval) && pageTitle != "Party Service Association") {
                        if (pageTitle == 'UserManagement') {
                            if (Object.keys(newval).length > 2) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            } else {
                                $scope.madeChanges = false;
                                $rootScope.dataModified = false;
                            }
                        } else {
                            $scope.madeChanges = true;
                            $rootScope.dataModified = true;
                        }
                    } else if ($.isEmptyObject(oldval) && pageTitle != "Party Service Association") {
                        count++;
                        if (!$.isEmptyObject(newval)) {
                            if (Object.keys(newval).length == 1) {
                                Object.keys(newval).forEach(function (keys) {
                                    if (typeof newval[keys] == 'boolean') {
                                        $scope.madeChanges = false;
                                        $rootScope.dataModified = false;
                                    } else {
                                        if (pageTitle == "Service") {
                                            $scope.madeChanges = false;
                                            $rootScope.dataModified = false;
                                        } else {
                                            $scope.madeChanges = true;
                                            $rootScope.dataModified = true;
                                        }
                                    }
                                })

                            }
                        } else {
                            $scope.madeChanges = false;
                            $rootScope.dataModified = false;
                        }

                    } else if (pageTitle == "Party Service Association") {

                        count1++;
                        Object.keys(oldval).forEach(function (getKey2) {
                            if (typeof oldval[getKey2] == 'object') {
                                olValLength = Object.keys(oldval).length;
                            }
                        });

                        Object.keys(newval).forEach(function (getKey) {
                            if (typeof newval[getKey] == 'boolean') {
                                if (newval[getKey] != false) {
                                    $scope.madeChanges = true;
                                    $rootScope.dataModified = true;
                                }
                            } else if (typeof newval[getKey] == 'object') {
                                nwValLength = Object.keys(newval).length;
                            }
                        });

                        if (count1 > 4) {
                            if (nwValLength > olValLength) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            }
                        }
                    }
                }

            } else {

                Object.keys(newval).forEach(function (getKey) {
                    if (typeof newval[getKey] != 'object') {
                        newvalen = Object.keys(newval).length;
                    } else {
                        for (i in newval[getKey]) {
                            if (Array.isArray(newval[getKey][i])) {
                                for (j in newval[getKey][i]) {
                                    newObjLen = Object.keys(newval[getKey][i][j]).length
                                }
                            } else if (typeof newval[getKey][i] == 'object') {
                                newObjLen = Object.keys(newval[getKey][i]).length
                            }
                        }
                    }
                })
                Object.keys(oldval).forEach(function (getKey2) {
                    if (typeof oldval[getKey2] != 'object') {
                        oldvalen = Object.keys(oldval).length;
                    } else {
                        for (i in oldval[getKey2]) {
                            if (Array.isArray(oldval[getKey2][i])) {
                                for (j in oldval[getKey2][i]) {
                                    oldObjLen = Object.keys(oldval[getKey2][i][j]).length
                                }
                            } else if (typeof oldval[getKey2][i] == 'object') {
                                oldObjLen = Object.keys(oldval[getKey2][i]).length
                            }
                        }
                    }
                })

                if (pageTitle == "Party Service Association") {
                    count++;
                    if (Operation == 'Clone') {
                        if (count > 4) {
                            if (newvalen != oldvalen) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            } else if (newObjLen != oldObjLen) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            } else {
                                $scope.madeChanges = false;
                                $rootScope.dataModified = false;
                            }
                        }
                    } else {
                        if (count > 3) {
                            if (newvalen != oldvalen) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            } else if (newObjLen != oldObjLen) {
                                $scope.madeChanges = true;
                                $rootScope.dataModified = true;
                            } else {
                                $scope.madeChanges = false;
                                $rootScope.dataModified = false;
                            }
                        }
                    }
                } else if (pageTitle == "Service") {
                    count++;
                    if (count > 2) {
                        if (newvalen != oldvalen) {
                            $scope.madeChanges = true;
                            $rootScope.dataModified = true;
                        } else if (newObjLen != oldObjLen) {
                            $scope.madeChanges = true;
                            $rootScope.dataModified = true;
                        } else {
                            $scope.madeChanges = false;
                            $rootScope.dataModified = false;
                        }
                    }
                } else {
                    if (newvalen != oldvalen) {

                        $scope.madeChanges = true;
                        $rootScope.dataModified = true;
                    } else if (newObjLen != oldObjLen) {

                        $scope.madeChanges = true;
                        $rootScope.dataModified = true;
                    } else {

                        if (pageTitle == 'Roles' || pageTitle == 'VolPayIdConfig') {
                            Object.keys(formData).forEach(function (key) {
                                $.each($rootScope.formArrayWithVal, function () {
                                    if (formData[this.name]) {
                                        if (formData[this.name].toString() != this.value) {
                                            $scope.madeChanges = true;
                                            $rootScope.dataModified = true;
                                        }

                                    }
                                })

                            })

                        } else {
                            $scope.madeChanges = false;
                            $rootScope.dataModified = false;
                        }
                    }
                }

            }
        }, function watchCallback(newValue1, oldValue1) {
            //react on value change here

        });
    }
});

angular.module('VolpayApp').service("http", function ($http, $q) {

    return ({
        crudRequest: crudRequest,
        localRequest: localRequest
    });

    function crudRequest(arg) {
        var request = $http({
            method: arg['method'] ? arg['method'] : 'GET',
            url: BASEURL + arg['url'],
            data: arg['data'],
            params: arg['query'],
            async: false,
            cache: false,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (request.then(handleSuccess, handleError));
    }

    function localRequest(method, url, data, query) {
        var request = $http({
            method: method ? method : 'GET',
            url: url,
            data: data ? data : {},
            params: query ? query : {},
            async: false,
            cache: false,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        return ($q.reject(response));
    }

    function handleSuccess(response) {
        return (response);
    }
});

angular.module('VolpayApp').service('errorservice', ["LogoutService", "$compile", function (LogoutService, $compile) {
    return ({
        ErrorMsgFunction: ErrorMsgFunction,
        consoleProdMode: consoleProdMode
    })

    function ErrorMsgFunction(error, scope, http, status_num) {
        if (status_num == 401) {
            if (configData.Authorization == 'External') {
                // window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                if ((configData.RetryFor401 == true)) {
                    if (error.config) {
                        retryMethodWithPopup(error.config, scope, $compile, http, LogoutService)
                    } else {
                        retryMethodWithPopup(error, scope, $compile, http, LogoutService)
                    }
                } else {
                    window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
                }

            } else {
                LogoutService.Logout();
            }
        }
    }

    function consoleProdMode(visible) {
        if (visible) {
            console.log = function () { }
        }
    }
}]);

var mydata = {};

function sendRetryRequest() {
    var obj = {
        method: mydata.dataobject.method,
        url: mydata.dataobject.url
    };

    if (mydata.dataobject.data) {
        obj['data'] = mydata.dataobject.data
    } else if (mydata.dataobject.params) {
        obj['params'] = mydata.dataobject.params
    }

    mydata.httpmethod(obj).then(function (response) { }, function (err) { })
    $('#retryPopup').modal("hide")
}

function LogoutFunc() {
    $('#retryPopup').modal("hide");
    $('.modal-backdrop').hide();
    mydata._logoutservic.Logout();
}

function retryMethodWithPopup(req_data, $scope, compile, http, logoutserv) {
    mydata = {
        'dataobject': req_data,
        'httpmethod': http,
        '_logoutservic': logoutserv
    }

    // }
    var elemnt = "<div class='modal fade' id='retryPopup' role='dialog' tabindex='-1'><div class='modal-dialog'><div class='modal-content' style='border:2px solid #243250a6;'><div class='modal-body'><h4>Please select...</h4></div><div class='modal-footer'><button type='button' class='btn btnStyle' onclick='sendRetryRequest()'>Retry</button><button type='button' class='btn btnStyle' onclick='LogoutFunc()'>Logout</button></div></div></div></div>"

    if (!$('.contentContainer').find('#retryPopup').length) {
        $('.contentContainer').append(elemnt);
    }
    compile(elemnt)($scope);
    $('#retryPopup').modal("show")
}

angular.module('VolpayApp').service("httpCall", function ($http, $q, FileSaver, Blob) {
    return ({
        crudRequest: crudRequest
    });

    // I add a friend with the given name to the remote collection.
    function crudRequest(_method, _url, _data) {
        var request = $http({
            method: _method,
            url: BASEURL + _url,
            data: _data
        });
        return (request.then(handleSuccess, handleError));
    }

    // I transform the error response, unwrapping the application data from the Rest Server.
    function handleError(response) {
        return ($q.reject(response));
    }

    // I transform the successful response, unwrapping the application data from the Rest Server.
    function handleSuccess(response) {
        return (response);
    }

});

function toUTF8Array(str) {

    var utf8 = [];
    for (var j = 0; j < str.length; j++) {
        var charcode = str.charCodeAt(j);
        if (charcode < 0x80)
            utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            j++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }

    return utf8;
}

function bin2String(array) {
    return String.fromCharCode.apply(String, array);
}

function textToBin(text) {

    var length = text.length,
        output = [];
    for (var i = 0; i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);

        output.push(Array(8 - bin.length + 1).join("0") + bin);
    }

    return output.join("");
}

function encrypt(message, passphrase) {

    // generate 256 bit salt
    var salt = CryptoJS.lib.WordArray.random(256 / 8);

    // generate derived key from passphrase using SHA256, 10 iterations
    var key = CryptoJS.PBKDF2(passphrase, salt, {
        iterations: 10,
        hasher: CryptoJS.algo.SHA256
    });

    // generate 128 bit IV
    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    // key is already in WordArray format, so custom IV accepted
    var encrypted = CryptoJS.AES.encrypt(message, key, {
        iv: iv
    });

    // cipher paramaters to be returned. Encoded for storage
    var cp = {};

    // encode ciphertext into base46
    cp.ciphertext = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

    // encode salt and iv to string representing hexedecimal
    cp.salt = CryptoJS.enc.Hex.stringify(salt);
    cp.iv = CryptoJS.enc.Hex.stringify(iv);

    // generate HMAC
    key_str = CryptoJS.enc.Hex.stringify(key);
    var HMAC = CryptoJS.HmacSHA256(cp.ciphertext + cp.iv, key_str);
    cp.HMAC = CryptoJS.enc.Hex.stringify(HMAC);

    return cp;
}

function decrypt(cp, passphrase) {

    // decode iv and salt from string to type WordArray
    var iv = CryptoJS.enc.Hex.parse(cp.iv);
    var salt = CryptoJS.enc.Hex.parse(cp.salt);

    // generate derived key from passphrase using SHA256, 10 iterations
    var key = CryptoJS.PBKDF2(passphrase, salt, {
        iterations: 10,
        hasher: CryptoJS.algo.SHA256
    });

    // decode ciphertext from base64 string to WordArray
    ciphertext = CryptoJS.enc.Base64.parse(cp.ciphertext);

    // calculate HMAC
    var key_str = CryptoJS.enc.Hex.stringify(key);
    var HMAC = CryptoJS.HmacSHA256(cp.ciphertext + cp.iv, key_str);
    var HMAC_str = CryptoJS.enc.Hex.stringify(HMAC);

    // compare HMACs
    if (HMAC_str != cp.HMAC) {
        return;
    }

    var _cp = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
    });

    var decrypted = CryptoJS.AES.decrypt(_cp, key, {
        iv: iv
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

angular.module('VolpayApp').filter('statusFilter', function () {
    return function (value) {
        if (value) {
            return "Just Now"
        } else {
            return "Viewed"
        }
        //return value.replace(/' '/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});

angular.module('VolpayApp').filter('camelCaseSpacing', function () {
    return function (value) {
        return value.replace(/([A-Z])/g, ' $1')
    };
});

angular.module('VolpayApp').filter('capitalize', function () {
    return function (value) {
        return (!!value) ? value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() : '';
    }
});

angular.module('VolpayApp').filter('titleCase', function () {
    return function (input) {
        input = input || '';
        return input.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
});

angular.module('VolpayApp').filter('beautify', function () {

    return function (value) {
        var source = value,
            output,
            opts = {};

        opts.indent_size = $('#tabsize').val();
        opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
        opts.max_preserve_newlines = $('#max-preserve-newlines').val();
        opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
        opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
        opts.break_chained_methods = $('#break-chained-methods').prop('checked');
        opts.indent_scripts = $('#indent-scripts').val();
        opts.brace_style = $('#brace-style').val();
        opts.space_before_conditional = $('#space-before-conditional').prop('checked');
        opts.unescape_strings = $('#unescape-strings').prop('checked');
        opts.jslint_happy = $('#jslint-happy').prop('checked');
        opts.end_with_newline = $('#end-with-newline').prop('checked');
        opts.wrap_line_length = $('#wrap-line-length').val();
        opts.indent_inner_html = $('#indent-inner-html').prop('checked');
        opts.comma_first = $('#comma-first').prop('checked');
        opts.e4x = $('#e4x').prop('checked');

        if (looks_like_html(source)) {
            output = html_beautify(source, opts);
        } else {
            if ($('#detect-packers').prop('checked')) {
                source = unpacker_filter(source);
            }
            output = js_beautify(source, opts);
        }

        if (the.editor) {
            the.editor.setValue(output);
        } else {
            return output;
        }
    };
});

var the = {
    use_codemirror: (!window.location.href.match(/without-codemirror/)),
    beautify_in_progress: false,
    editor: null // codemirror editor
};

function run_tests() {
    var st = new SanityTest();
    run_javascript_tests(st, Urlencoded, js_beautify, html_beautify, css_beautify);
    run_css_tests(st, Urlencoded, js_beautify, html_beautify, css_beautify);
    run_html_tests(st, Urlencoded, js_beautify, html_beautify, css_beautify);
    JavascriptObfuscator.run_tests(st);
    P_A_C_K_E_R.run_tests(st);
    Urlencoded.run_tests(st);
    MyObfuscate.run_tests(st);
    var results = st.results_raw()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '&nbsp;')
        .replace(/\r/g, '·')
        .replace(/\n/g, '<br>');
    $('#testresults').html(results).show();
}

function any(a, b) {
    return a || b;
}

function read_settings_from_cookie() {
    $('#tabsize').val(any($.cookie('tabsize'), '4'));
    $('#brace-style').val(any($.cookie('brace-style'), 'collapse'));
    $('#detect-packers').prop('checked', $.cookie('detect-packers') !== 'off');
    $('#max-preserve-newlines').val(any($.cookie('max-preserve-newlines'), '5'));
    $('#keep-array-indentation').prop('checked', $.cookie('keep-array-indentation') === 'on');
    $('#break-chained-methods').prop('checked', $.cookie('break-chained-methods') === 'on');
    $('#indent-scripts').val(any($.cookie('indent-scripts'), 'normal'));
    $('#space-before-conditional').prop('checked', $.cookie('space-before-conditional') !== 'off');
    $('#wrap-line-length').val(any($.cookie('wrap-line-length'), '0'));
    $('#unescape-strings').prop('checked', $.cookie('unescape-strings') === 'on');
    $('#jslint-happy').prop('checked', $.cookie('jslint-happy') === 'on');
    $('#end-with-newline').prop('checked', $.cookie('end-with-newline') === 'on');
    $('#indent-inner-html').prop('checked', $.cookie('indent-inner-html') === 'on');
    $('#comma-first').prop('checked', $.cookie('comma-first') === 'on');
    $('#e4x').prop('checked', $.cookie('e4x') === 'on');
}

function store_settings_to_cookie() {

    var opts = {
        expires: 360
    };

    $.cookie('tabsize', $('#tabsize').val(), opts);
    $.cookie('brace-style', $('#brace-style').val(), opts);
    $.cookie('detect-packers', $('#detect-packers').prop('checked') ? 'on' : 'off', opts);
    $.cookie('max-preserve-newlines', $('#max-preserve-newlines').val(), opts);
    $.cookie('keep-array-indentation', $('#keep-array-indentation').prop('checked') ? 'on' : 'off', opts);
    $.cookie('break-chained-methods', $('#break-chained-methods').prop('checked') ? 'on' : 'off', opts);
    $.cookie('space-before-conditional', $('#space-before-conditional').prop('checked') ? 'on' : 'off', opts);
    $.cookie('unescape-strings', $('#unescape-strings').prop('checked') ? 'on' : 'off', opts);
    $.cookie('jslint-happy', $('#jslint-happy').prop('checked') ? 'on' : 'off', opts);
    $.cookie('end-with-newline', $('#end-with-newline').prop('checked') ? 'on' : 'off', opts);
    $.cookie('wrap-line-length', $('#wrap-line-length').val(), opts);
    $.cookie('indent-scripts', $('#indent-scripts').val(), opts);
    $.cookie('indent-inner-html', $('#indent-inner-html').prop('checked') ? 'on' : 'off', opts);
    $.cookie('comma-first', $('#comma-first').prop('checked') ? 'on' : 'off', opts);
    $.cookie('e4x', $('#e4x').prop('checked') ? 'on' : 'off', opts);
}

function unpacker_filter(source) {
    var trailing_comments = '',
        comment = '',
        unpacked = '',
        found = false;

    // cut trailing comments
    do {
        found = false;
        if (/^\s*\/\*/.test(source)) {
            found = true;
            comment = source.substr(0, source.indexOf('*/') + 2);
            source = source.substr(comment.length).replace(/^\s+/, '');
            trailing_comments += comment + "\n";
        } else if (/^\s*\/\//.test(source)) {
            found = true;
            comment = source.match(/^\s*\/\/.*/)[0];
            source = source.substr(comment.length).replace(/^\s+/, '');
            trailing_comments += comment + "\n";
        }
    } while (found);

    var unpackers = [P_A_C_K_E_R, Urlencoded, /*JavascriptObfuscator,*/ MyObfuscate];
    for (var i = 0; i < unpackers.length; i++) {
        if (unpackers[i].detect(source)) {
            unpacked = unpackers[i].unpack(source);
            if (unpacked != source) {
                source = unpacker_filter(unpacked);
            }
        }
    }

    return trailing_comments + source;
}

/* function beautify(default_text) {
if (the.beautify_in_progress) return;

store_settings_to_cookie();

the.beautify_in_progress = true;

var source = default_text,
output,
opts = {};

opts.indent_size = $('#tabsize').val();
opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
opts.max_preserve_newlines = $('#max-preserve-newlines').val();
opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
opts.break_chained_methods = $('#break-chained-methods').prop('checked');
opts.indent_scripts = $('#indent-scripts').val();
opts.brace_style = $('#brace-style').val();
opts.space_before_conditional = $('#space-before-conditional').prop('checked');
opts.unescape_strings = $('#unescape-strings').prop('checked');
opts.jslint_happy = $('#jslint-happy').prop('checked');
opts.end_with_newline = $('#end-with-newline').prop('checked');
opts.wrap_line_length = $('#wrap-line-length').val();
opts.indent_inner_html = $('#indent-inner-html').prop('checked');
opts.comma_first = $('#comma-first').prop('checked');
opts.e4x = $('#e4x').prop('checked');

if (looks_like_html(source)) {
output = html_beautify(source, opts);
} else {
if ($('#detect-packers').prop('checked')) {
source = unpacker_filter(source);
}
output = js_beautify(source, opts);
}
if (the.editor) {
the.editor.setValue(output);
} else {
return output;
}

the.beautify_in_progress = false;
} */

function looks_like_html(source) {
    var trimmed = source.replace(/^[ \t\n\r]+/, '');
    var comment_mark = '<' + '!-' + '-';
    return (trimmed && (trimmed.substring(0, 1) === '<' && trimmed.substring(0, 4) !== comment_mark));
}

angular.module('VolpayApp').filter('beautify2', function () {
    return function (default_text) {
        if (the.beautify_in_progress)
            return;

        store_settings_to_cookie();

        the.beautify_in_progress = true;

        var source = default_text,
            output,
            opts = {};

        opts.indent_size = $('#tabsize').val();
        opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
        opts.max_preserve_newlines = $('#max-preserve-newlines').val();
        opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
        opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
        opts.break_chained_methods = $('#break-chained-methods').prop('checked');
        opts.indent_scripts = $('#indent-scripts').val();
        opts.brace_style = $('#brace-style').val();
        opts.space_before_conditional = $('#space-before-conditional').prop('checked');
        opts.unescape_strings = $('#unescape-strings').prop('checked');
        opts.jslint_happy = $('#jslint-happy').prop('checked');
        opts.end_with_newline = $('#end-with-newline').prop('checked');
        opts.wrap_line_length = $('#wrap-line-length').val();
        opts.indent_inner_html = $('#indent-inner-html').prop('checked');
        opts.comma_first = $('#comma-first').prop('checked');
        opts.e4x = $('#e4x').prop('checked');

        if (looks_like_html(source)) {
            output = html_beautify(source, opts);
        } else {
            if ($('#detect-packers').prop('checked')) {
                source = unpacker_filter(source);
            }
            output = js_beautify(source, opts);
        }

        if (the.editor) {
            the.editor.setValue(output);
        } else {
            return output;
        }

        the.beautify_in_progress = false;
        return default_text;
    };
});

function removeEmptyValueKeys(obj) {

    $.each(obj, function (key, value) {
        if (value === "" || value === undefined || value === null) {
            delete obj[key];
        }
    });

    return obj;
}

function removeHashkeyValue(obj) {
    $.each(obj, function (key, value) {
        if (value === "") {
            delete obj[key];
        }
    });

    return obj;
}

function callOnTimeOut() {
    $('.alert').hide()
}

angular.module('VolpayApp').filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
/* 
var clrs = {
    "ACTIVE" : "#4155c3",
    "SUSPENDED" : "#00BCD4",
    "CREATED" : "#03a9f4",
    "WAITINGFORAPPROVAL" : "#CDDC39",
    "APPROVED" : "#4caf50",
    "FORREVISION" : "#673ab7",
    "REJECTED" : "#d81f12",
    "DELETED" : "#708090",
    "PENDINGAPPROVAL" : "#ff9800"
}

angular.module('VolpayApp').filter('chooseStatus', function () {

    return function (val) {
        if (val) {
            val = val.toUpperCase();
            val = val.replace(/\s+/g, '');
            return clrs[val]

        } else {
            return '#666'
        }
    }
})*/

angular.module('VolpayApp').filter('chooseColor', function () {

    return function (val) {

        if (val && ('Status' in val)) {
            var clrs = [{
                "status": "ACTIVE",
                "color": "#4155c3"
            }, {
                "status": "SUSPENDED",
                "color": "#00BCD4"
            }, {
                "status": "CREATED",
                "color": "#03a9f4"
            }, {
                "status": "WAITINGFORAPPROVAL",
                "color": "#CDDC39"
            }, {
                "status": "APPROVED",
                "color": "#4caf50"
            }, {
                "status": "FORREVISION",
                "color": "#673ab7"
            }, {
                "status": "REJECTED",
                "color": "#d81f12"
            }, {
                "status": "DELETED",
                "color": "#708090"
            }, {
                "status": "PENDINGAPPROVAL",
                "color": "#ff9800"
            }]
            val = val['Status']
            val = val.toUpperCase();
            val = val.replace(/\s+/g, '');
            for (var i in clrs) {
                if (clrs[i].status == val) {
                    return clrs[i].color
                }
            }
        } else {
            return '#666'
        }
    }
});

function removeCommas(nStr) {
    if (nStr == null || nStr == "")
        return "";
    return nStr.toString().replace(/,/g, "");
}

function NumbersOnly(myfield, e, dec, neg) {

    if (isNaN(removeCommas(myfield.value)) && myfield.value != "-") {
        return false;
    }
    var allowNegativeNumber = neg || false;
    var key;
    var keychar;

    if (window.event)
        key = window.event.keyCode;
    else if (e)
        key = e.which;
    else
        return true;
    keychar = String.fromCharCode(key);
    var srcEl = e.srcElement ? e.srcElement : e.target;
    // control keys
    if ((key == null) || (key == 0) || (key == 8) ||
        (key == 9) || (key == 13) || (key == 27))
        return true;

    // numbers
    else if ((("0123456789").indexOf(keychar) > -1))
        return true;

    // decimal point jump
    else if (dec && (keychar == ".")) {
        //myfield.form.elements[dec].focus();
        return srcEl.value.indexOf(".") == -1;
    }

    //allow negative numbers
    else if (allowNegativeNumber && (keychar == "-")) {
        return (srcEl.value.length == 0 || srcEl.value == "0.00")
    } else
        return false;
}

function sidebarMenuControl(pID, cID) {

    $(sanitize('#' + cID)).parent().parent().parent().find('.menuli').each(function () {
        if ($(this).attr('id') == pID) {
            $(this).addClass('open').find('.sidebarSubMenu').slideDown();
            $(this).find('.ParentMenu').addClass('sidebarSubMenuSelected').find("span").next().removeAttr('class').attr('class', 'fa fa-plus');

            $(this).find("a span").next().removeAttr('class').attr('class', 'fa fa-minus');
            $('.sidebar-menu').each(function () {
                $(this).find('.sidebarSubMenu').find('li').each(function () {
                    if ($(this).attr('id') == cID) {
                        if (!($(this).hasClass('sideMenuSelected'))) {
                            $(this).addClass('sideMenuSelected');
                        }
                    } else {
                        $(this).removeClass('sideMenuSelected');
                    }
                });
            });
        } else {
            $(this).removeClass('open').find('.sidebarSubMenu').slideUp();
            $(this).removeClass('open').find('.ParentMenu').removeClass('sidebarSubMenuSelected').find("span").next().removeAttr('class').attr('class', 'fa fa-minus');
            $(this).find("a span").next().removeAttr('class').attr('class', 'fa fa-plus');
            $(this).find('.sidebarSubMenu li').find('li').removeClass('sideMenuSelected');
        }
    })
}
var menuInterval = "";

function checkMenuOpen() {
    if (sessionStorage.menuSelection != undefined) {
        var menus = JSON.parse(sessionStorage.menuSelection);
        clearInterval(menuInterval)

        menuInterval = setInterval(function () {
            var flag1 = $(sanitize('#' + menus.val)).hasClass('open')
            var flag2 = $(sanitize('#' + menus.subVal)).hasClass('sideMenuSelected');

            if (!flag1) {
                sidebarMenuControl(menus.val, menus.subVal)
            } else {
                clearInterval(menuInterval)
            }
        }, 100)
    } else {
        clearInterval(menuInterval)
    }
}

checkMenuOpen()

function multipleSortParams(field, Target, multiSortObj) {
    var isAvailable = false;
    if (multiSortObj.length == 0) {
        multiSortObj.push({
            'Field': field,
            'SortType': 'Asc',
            'Count': 0
        });
    } else {
        for (var i in multiSortObj) {
            if (field == multiSortObj[i].Field) {
                isAvailable = true;
                var SortCnt = 1 + multiSortObj[i].Count++;
                multiSortObj[i].Field = field;
                multiSortObj[i].Count = SortCnt;

                if (multiSortObj[i].SortType == 'Asc') {
                    multiSortObj[i].SortType = 'Desc';
                } else {
                    multiSortObj[i].SortType = 'Asc';
                }
                if (SortCnt == 2) {
                    multiSortObj.splice(i, 1)
                }
            }
        }

        if (!isAvailable) {
            multiSortObj.push({
                'Field': field,
                'SortType': 'Asc',
                'Count': 0
            });
        }
    }

    return multiSortObj
}

function updateUserProfile(uProfileData, $http, data) {
    var restResponse = {};
    var localObj = {};
    localObj.UserID = sessionStorage.UserID;
    localObj.ProfileData = uProfileData;
    localObj.UserProfileData_PK = sessionStorage.UserProfileDataPK;

    return $http({
        method: 'PUT',
        url: BASEURL + RESTCALL.userProfileData,
        data: localObj
    }).then(function (response) {
        restResponse = {
            'Status': 'success',
            'data': response
        }
        return restResponse;
    }, function (error) {
        restResponse = {
            'Status': 'danger',
            'data': error
        }
        return restResponse;
    })
}

function JSONToCSVConvertor(bankData, JSONData, ReportTitle, ShowLabel) {

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = 'sep=,' + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            if (index != 'IsSuperAdmin') {
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (index != 'IsSuperAdmin') {
                row += '' + JSON.stringify(arrData[i][index]) + ',';
            }
        }

        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    bankData.exportToExcel(CSV, ReportTitle)
}

function JSONToCSVConvertorToTxt(bankData, JSONData, ReportTitle, ShowLabel) {

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            if (index != 'IsSuperAdmin') {
                //Now convert each value to string and comma-seprated
                row += index + ';';
            }
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (index != 'IsSuperAdmin') {
                row += '' + JSON.stringify(arrData[i][index]) + ';';
            }
        }

        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    bankData.exportToTXT(CSV, ReportTitle)
}

function JSONToExport(bankData, JSONData, ReportTitle, ShowLabel, col, moduletitle, labels) {

    var colName = col;
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    if (col) {
        colName = col;
    } else {
        colName = [];
        for (var y in arrData[0]) {
            if (typeof (arrData[0][y]) != 'object') {
                colName.push(y)
            }
        }
    }

    if (((moduletitle == 'usermanagament') || (moduletitle == 'rolemanagament') || (moduletitle === 'distributedinstructions') || (moduletitle == 'allpayments') || (moduletitle == 'Approvals'))) {
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            //var colName = [];
            for (var i in labels) {
                row += labels[i] + ',';
            }
            row = row.slice(0, -1);
            CSV += row + '\n';
        }
    } else {
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            //var colName = [];
            for (var i in colName) {
                row += colName[i] + ',';
            }
            row = row.slice(0, -1);
            CSV += row + '\n';
        }
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var bData = angular.copy(arrData[i])
        for (var l in arrData[i]) {
            if (typeof (arrData[i][l]) == 'object') {
                for (var x in bData[l]) {
                    arrData[i][x] = bData[l][x];
                }
            }
        }

        var row = "";
        for (var jk in colName) {
            if (JSON.stringify(arrData[i][colName[jk]]) != undefined) {
                if (typeof (arrData[i][colName[jk]]) === 'object') {
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
    bankData.exportToExcel(CSV, ReportTitle)
}

function cleantheinputdata(newData) {
    $.each(newData, function (key, value) {
        delete newData.$$hashkey;
        if ($.isPlainObject(value)) {
            var isEmptyObj = cleantheinputdata(value)
            if ($.isEmptyObject(isEmptyObj)) {
                delete newData[key]
            }
        } else if (Array.isArray(value) && !value.length) {
            delete newData[key]
        } else if (value === "" || value === undefined || value === null) {
            delete newData[key]
        }
    })
    return newData
}

function cleantheArraydataforrepair(data) {
    $.each(data, function (x, y) {
        if (Array.isArray(data[x])) {
            $.each(data[x], function (x1, y1) {
                $.each(data[x][x1], function (x2, y2) {
                    if (x2 == '$$hashKey') {
                        delete data[x]
                    }
                })
            })
        }
    })
    return data
}

function cleanalltheinputdataObj(argu) {
    for (var k in argu) {
        if ($.isPlainObject(argu[k])) {
            var isEmptyObj = cleanalltheinputdataObj(argu[k])
            if ($.isEmptyObject(isEmptyObj)) {
                delete argu[k]
            } else {
                argu[k] = JSON.stringify(argu[k])
            }
        } else if (Array.isArray(argu[k])) {
            for (var n in argu[k]) {
                var isEmptyObj1 = cleanalltheinputdataObj(argu[k][n])
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

function customDateRangePicker(sDate, eDate) {
    var startDate = new Date();
    var FromEndDate = new Date();
    var ToEndDate = new Date();

    ToEndDate.setDate(ToEndDate.getDate() + 365);

    $(sanitize('#' + sDate)).datepicker({
        language: "es",
        weekStart: 1,
        startDate: '1900-01-01',
        minDate: 1,
        endDate: FromEndDate,
        autoclose: true,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (selected) {
        startDate = new Date(selected.date.valueOf());
        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
        $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);
    });

    $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);

    $(sanitize('#' + eDate)).datepicker({
        language: "es",
        weekStart: 1,
        startDate: startDate,
        endDate: ToEndDate,
        autoclose: true,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (selected) {
        FromEndDate = new Date(selected.date.valueOf());
        FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
        $(sanitize('#' + sDate)).datepicker('setEndDate', FromEndDate);
    });
    $(sanitize('#' + eDate)).datepicker('setStartDate', startDate);

    $(sanitize('#' + eDate)).on('keyup', function () {
        if (!$(this).val()) {
            $(sanitize('#' + sDate)).datepicker('setEndDate', new Date());
        }
    })
}

function is_hexadecimal(str) {
    regexp = /^[0-9a-fA-F]+$/;
    if (regexp.test(str)) {
        myRegEx = /^[0-9]*$/;
        if (myRegEx.test(str)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function getArrVal(str) {
    str = str.substring(str.lastIndexOf("[") + 1, str.lastIndexOf("]")).split(',');
    return str;
}

function constructQuery(inObj, WilcardOverride) {
    var keyArr = [];
    var obj = {
        "filters": {
            "logicalOperator": "AND",
            "groupLvl1": [{
                "logicalOperator": "AND",
                "groupLvl2": [{
                    "logicalOperator": WilcardOverride ? WilcardOverride : "AND",
                    "groupLvl3": []
                }]
            }]
        },
        "sorts": [],
        "start": inObj.start,
        "count": inObj.count
    };

    if ((Object.keys(inObj).indexOf('start') == -1) || (inObj.start == undefined)) {
        delete obj.start;
    }

    if ((Object.keys(inObj).indexOf('count') == -1) || (inObj.count == undefined)) {
        delete obj.count;
    }

    if (Object.keys(inObj).indexOf('Queryfield') != -1) {
        if (inObj.Queryfield.length != 0) {
            for (var i in inObj.Queryfield) {
                keyArr.push({
                    'key': inObj.Queryfield[i].ColumnName,
                    'value': inObj.Queryfield[i].ColumnValue,
                    'operator': inObj.Queryfield[i].ColumnOperation
                })
            }
            repeatingArrElem(keyArr, obj)
        } else {
            delete obj.filters;
        }
    } else {
        delete obj.filters;
    }

    if (Object.keys(inObj).indexOf('QueryOrder') != -1) {
        if (inObj.QueryOrder.length != 0) {
            for (var i in inObj.QueryOrder) {
                obj.sorts.push({
                    'columnName': inObj.QueryOrder[i].ColumnName,
                    'sortOrder': inObj.QueryOrder[i].ColumnOrder
                })
            }
        } else {
            delete obj.sorts;
        }
    } else {
        delete obj.sorts;
    }
    
    return obj;
}

function sortFn(arr) {
    var keys = ["ReceivedDate", "ValueDate", "EntryDate", "GeneratedDate"];

    /*if(keys.indexOf(arr.key) != -1)
    {
        arr.array.sort()
    }
    else{
        arr.array.sort(function(a, b){return a - b});
    }*/
    if (keys.indexOf(arr.key) != -1) {
        arr.array.sort()
    }
    
    return arr;
}

function repeatingArrElem(arr, obj) {

    var keyPairArr = [];
    arr.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].key != current) {
            if (cnt > 0) {
                keyPairArr.push({
                    'key': current,
                    'value': cnt,
                    'array': [],
                    'obj': []
                })
            }
            current = arr[i].key;
            cnt = 1;
        } else {
            cnt++;
        }
    }

    if (cnt > 0) {
        keyPairArr.push({
            'key': current,
            'value': cnt,
            'operator': '',
            'array': [],
            'obj': []
        })
    }

    function sortbased(arr) {
        for (var i in arr.obj) {
            if (arr.obj[i].operator == '>=') {
                arr.array[0] = arr.obj[i].value
            } else if (arr.obj[i].operator == '<=') {
                arr.array[1] = arr.obj[i].value
            }
        }
        
        return arr;
    }

    for (var i in keyPairArr) {
        for (var j in arr) {
            if (keyPairArr[i].key == arr[j].key) {
                keyPairArr[i].array.push(arr[j].value)
                keyPairArr[i].obj.push(arr[j])
                keyPairArr[i].operator = arr[j].operator
            }
        }

        keyPairArr[i] = sortbased(keyPairArr[i])
    }

    obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3 = [];
    for (var i in keyPairArr) {
        if ((keyPairArr[i].array.length > 1) && (keyPairArr[i].key != 'ReceivedDate') && (keyPairArr[i].key != 'DebitFxRate') && (keyPairArr[i].key != 'ValueDate') && (keyPairArr[i].key != 'Amount') && (keyPairArr[i].key != 'EntryDate') && (keyPairArr[i].key != 'GeneratedDate') && (keyPairArr[i].key != 'InstructionType')) {
            obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                'logicalOperator': 'OR',
                'clauses': []
            })
        } else {

            obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                'logicalOperator': 'AND',
                'clauses': []
            })
        }

        //keyPairArr[i] = sortFn(keyPairArr[i])
        for (var j in keyPairArr[i].array) {
            if ((keyPairArr[i].key != 'ReceivedDate') && (keyPairArr[i].key != 'DebitFxRate') && (keyPairArr[i].key != 'ValueDate') && (keyPairArr[i].key != 'EntryDate') && (keyPairArr[i].key != 'GeneratedDate') && (keyPairArr[i].key != 'Amount')) {
                obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses.push({
                    'columnName': keyPairArr[i].key,
                    'operator': keyPairArr[i].operator,
                    'value': keyPairArr[i].array[j],
                    'isCaseSensitive': isCaseSensitivevalforAdv
                })

            } else {
                obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses.push({
                    'columnName': keyPairArr[i].key,
                    'operator': (keyPairArr[i].array.length == 1) ? '=' : (j == 0) ? '>=' : '<=',
                    'value': keyPairArr[i].array[j],
                    'isCaseSensitive': isCaseSensitivevalforAdv
                })
            }
        }
    }
}

function joinQueryRepeatElem(arr, obj1) {

    var keyPairArr1 = [];
    arr.sort();
    var current = null;
    var cnt = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].columnName != current) {
            if (cnt > 0) {
                keyPairArr1.push({
                    'key': current,
                    'value': cnt,
                    'array': [],
                    'obj': []
                })
            }
            current = arr[i].columnName;
            cnt = 1;
        } else {
            cnt++;
        }
    }

    if (cnt > 0) {
        keyPairArr1.push({
            'key': current,
            'value': cnt,
            'operator': '',
            'array': [],
            'obj': []
        })
    }
    for (var i in keyPairArr1) {
        for (var j in arr) {
            if (keyPairArr1[i].key == arr[j].columnName) {
                keyPairArr1[i].array.push(arr[j].columnValue)
                keyPairArr1[i].obj.push(arr[j])
                keyPairArr1[i].operator = '='
            }
        }
    }

    obj1.groupLvl1[0].groupLvl2[0].groupLvl3 = [];
    for (var i in keyPairArr1) {
        if ((keyPairArr1[i].array.length > 1)) {
            obj1.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                'logicalOperator': 'OR',
                'clauses': []
            })
        } else {

            obj1.groupLvl1[0].groupLvl2[0].groupLvl3.push({
                'logicalOperator': 'AND',
                'clauses': []
            })
        }

        for (var j in keyPairArr1[i].array) {
            obj1.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses.push({
                'columnName': keyPairArr1[i].key,
                'operator': keyPairArr1[i].operator,
                'value': keyPairArr1[i].array[j],
                'isCaseSensitive': false
            })
        }

    }
    return obj1;
}

function emailValidation(get_entered_email, getID) {

    // var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;OLD
    // var email_regex =  /^[a-zA-Z]+[+-._0-9]?[a-zA-Z0-9+]+[@]([a-zA-Z0-9]+([\-]?[a-zA-Z0-9]+)?\.)+[a-zA-Z]{2,}$/;HSBC

    var email_regex = /^[A-Za-z0-9]([!#$%&'*+-/=?^`_{|.+]?[A-Za-z0-9])*@[A-Za-z0-9]([-]?[A-Za-z0-9])*(\.\w{2,4})+$/
    var eFlag = "";

    var currentID = get_entered_email;
    if (!email_regex.test(get_entered_email)) {

        $("div").find(getID).css("border", "2px solid #ff6363")
        eFlag = false;
    } else {
        $("div").find(getID).removeAttr("style");
        eFlag = true;
    }
    return eFlag;
}

function removeDuplicates(originalArray, objKey) {
    var trimmedArray = [];
    var values = [];
    var value;

    for (var i = 0; i < originalArray.length; i++) {
        value = originalArray[i][objKey];

        if (values.indexOf(value) === -1) {
            trimmedArray.push(originalArray[i]);
            values.push(value);
        }
    }

    return trimmedArray;
}

function removeDuplicatesFromArr(originalArray, prop, sortType, orderByField) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }

    if (sortType !== 'Desc') {
        newArray = _.sortBy(newArray, orderByField);
    } else {
        newArray = _.sortBy(newArray, orderByField).reverse();
    }

    return newArray;
}

function sanitize(cookie) {
    if (cookie != null) {
        cookie = cookie.replace(/(\r\n\t|\n|\r\t)/gm, "");
        cookie = cookie.replace(/(\r\n\t|\n|\r\t)/gm, "");
    }
    return cookie;
}

function sanitizeCookie(cookie) {
    if (cookie != null) {
        cookie = cookie.replace(/(\r\n\t|\n|\r\t)/gm, "");
        cookie = cookie.replace(/(\r\n\t|\n|\r\t)/gm, "");
    }
    return cookie;
}

// function emailMasking(useremail) {
// 	return useremail.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => {
// 		a + b.replace(/./g, '*') + c
// 	});
// }
function emailMasking(useremail) {
    var maskid = "";
    var maskid2 = "";
    if (useremail) {
        var prefix = useremail.substring(0, useremail.lastIndexOf("@"));
        var postfix = useremail.substring(useremail.lastIndexOf("@"));
        for (var i = 0; i < prefix.length; i++) {
            if (i == 0 || (i == prefix.length - 1 && prefix.length > 9)) {
                maskid = maskid + prefix[i].toString();
            } else {
                maskid = maskid + "*";
            }
        }

        for (var i = 0; i < postfix.length; i++) {
            if (i == 0 || i == 1) {
                maskid2 = maskid2 + postfix[i].toString();
            } else if (i < postfix.length - 4) {
                maskid2 = maskid2 + "*";
            } else {
                maskid2 = maskid2 + postfix[i].toString();
            }
        }

        maskid = maskid + maskid2;
        return maskid;
    }
}

function findLandingModule(data, state) {
    state.go('app.' + data.name, data.stateParams);
}

function uiConfiguration() {

    if (configData.Authorization == "External") {
        var sessionData = function () {
            return $.ajax({
                url: BASEURL + '/rest/v2/ui/configuration',
                cache: false,
                headers: {
                    'X-CSRF-Token': 'Fetch'
                },
                async: false,
                type: 'GET',
                dataType: 'json',
                success: function (data, textStatus, request) {
                    sessionStorage.CSRF = request.getResponseHeader('X-CSRF-Token');
                }
            }).responseJSON;
        }
    } else {
        var sessionData = function () {
            return $.ajax({
                url: BASEURL + '/rest/v2/ui/configuration',
                cache: false,
                async: false,
                type: 'GET',
                dataType: 'json',
            }).responseJSON;
        }
    }

    var sData = sessionData();
    for (i in sData) {
        if (sData[i].Name.toUpperCase() == 'FILESIZERESTRICTION') {
            sessionStorage.fileUploadLimit = sData[i].Value;
        } else if (sData[i].Name.toUpperCase() == 'SESSIONTIMEOUT') {
            sessionStorage.sessionTimeLimit = sData[i].Value;
        } else if (sData[i].Name.toUpperCase() == 'ENTITYEDITTIMEOUT') {
            sessionStorage.entityEditTimeout = sData[i].Value;
        }
    }

}
uiConfiguration();

function genProperties() {
    // var applicationInfo = function () {
    // 	return $.ajax({
    // 		url: BASEURL + RESTCALL.appInfo,
    // 		cache: false,
    // 		async: false,
    // 		type: 'GET',
    // 		dataType: 'json'
    // 	}).responseJSON;
    // }
    // var aData = applicationInfo();
    // sessionStorage.VersionInfo = aData.Version

    var ColpatriaAddonFunction = function () {
        return $.ajax({
            url: 'plug-ins/instructionprocess.json',
            cache: false,
            async: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }
    var ColpData = ColpatriaAddonFunction();
    sessionStorage.ColpData = btoa(JSON.stringify(ColpData));

    var allBatchesFunction = function () {
        return $.ajax({
            url: 'plug-ins/batchinstructionprocess.json',
            cache: false,
            async: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }
    var ColbatchData = allBatchesFunction();
    sessionStorage.ColbatchData = btoa(JSON.stringify(ColbatchData));

    var PopUpAddonFunction = function () {
        return $.ajax({
            url: 'plug-ins/paymentdetail-buttons.json',
            cache: false,
            async: false,
            type: 'GET',
            dataType: 'json'
        }).responseJSON;
    }
    var PopUpAddonData = PopUpAddonFunction();
    sessionStorage.PopUpAddonData = btoa(JSON.stringify(PopUpAddonData));
}

genProperties()

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

/* Specically for remove duplicates*/
function removeDuplicatesupdate(arr) {

    var result = [];
    var duplicatesIndices = [];
    // Loop through each item in the original array
    if (arr && arr.length) {
        arr.forEach(function (current, index) {
            if (duplicatesIndices.includes(index)) return;
            result.push(current);
            // Loop through each other item on array after the current one
            for (var comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
                var comparison = arr[comparisonIndex];
                var currentKeys = Object.keys(current);
                var comparisonKeys = Object.keys(comparison);
                // Check number of keys in objects
                if (currentKeys.length !== comparisonKeys.length) continue;
                // Check key names
                var currentKeysString = currentKeys.sort().join("").toLowerCase();
                var comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
                if (currentKeysString !== comparisonKeysString) continue;
                // Check values
                var valuesEqual = true;
                for (var i = 0; i < currentKeys.length; i++) {
                    var key = currentKeys[i];
                    if (current[key] !== comparison[key]) {
                        valuesEqual = false;
                        break;
                    }
                }
                if (valuesEqual) duplicatesIndices.push(comparisonIndex);
            } // end for loop
        }); // end arr.forEach()
        return result;
    }
}

// Roleid split specific for roles
angular.module('VolpayApp').filter('splitunderscore', function () {
    return function (val) {
        if (val && val.indexOf('_') != -1) {
            var value1 = val.split('_');
            var strval = "";
            if (value1.length > 2) {
                value1.splice(0, 1);
                strval = value1.join("_");
            } else {
                strval = value1[1];
            }
            return strval;
        } else {
            return val;
        }
    }
});

angular.module('VolpayApp').filter("RoleNameReplace", function () {
    return function (input) {
        var field1 = OverrideFieldnames;
        var keepGoing = true;
        if (field1) {
            field1[0].Changes.forEach(function (key, value) {
                if (keepGoing) {
                    if (key['Field'] == input) {
                        input = key['ReplaceField'];
                        keepGoing = false;
                    }
                }
            })
        }
        return input;
    }
});

angular.module('VolpayApp').filter("AccMasking", function () {
    return function (acc) {
        if (acc && acc.length > 4) {
            var _prefix = '';
            for (i = 0; i < acc.length - 4; i++) {
                _prefix = _prefix + 'X';
            }
            acc = _prefix + acc.substring((acc.length - 4), acc.length);
        } else {
            acc = acc;
        }
        return acc
    }
});

angular.module('VolpayApp').filter("htmlSafe", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);

angular.module('VolpayApp').filter('removeAndFilter', function () {
    return function (item) {
        return item.replace(/&amp;/g, '&');
    }
});

angular.module('VolpayApp').service('customAttrRestIndex', function () {
    return function (item) {
        return item[item.length - 1].name.toLowerCase() == 'rest' ? item.length - 1 : 0;
    }
});
