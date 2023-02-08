var d = new Date();
var n = d.toISOString();

angular.module('VolpayApp').directive('fileModel', ['$parse', function($parse) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

angular.module('VolpayApp').controller('fileuploadCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$filter', '$rootScope', 'LogoutService', 'GlobalService', 'errorservice', 'EntityLockService','GetPermissions', function($scope, $rootScope, $http, $timeout, $location, $filter, $rootScope, LogoutService, GlobalService, errorservice, EntityLockService, GetPermissions) {
    $scope.newPermission = GetPermissions("File Upload");
    $rootScope.$emit('MyEventforEditIdleTimeout', true);
    EntityLockService.flushEntityLocks(); 
   $rootScope.languageselected_=sessionStorage.sessionlang 
    $scope.$on('langChangeEvent', function () {  
        if(multilingualSearchData && multilingualSearchData.multilingualenable){     
            $('.lang').attr('checked', false)      
            $rootScope.languageselected_=sessionStorage.sessionlang 
    
            if (sessionStorage.sessionlang == 'en_US') {
                $('#lang_1').prop('checked', true)
            } else if (sessionStorage.sessionlang == 'es_ES'){
                $('#lang_2').prop('checked', true)
            } else {
                $('#lang_1').prop('checked', true)
            }
        }
    });
    // Jquery
    var PaymentModuleJQ = $('#PaymentModule');
    var uploadHereJQ = $('#uploadHere');
    var select2DropdownJQ = $(".select2Dropdown");
    // var thisJQ = $(this);
    var alertDangerJQ = $('.alert-danger');
    var alertSuccessJQ = $('.alert-success');
    var uploadBtnJQ = $('#uploadBtn');
    var FilechannelJQ = $('#Filechannel');

    var authenticationObject = $rootScope.dynamicAuthObj;
    var interval = "";
    clearInterval(interval)
    interval = setInterval(function() {
        if (!PaymentModuleJQ.hasClass('open')) {
            sidebarMenuControl('PaymentModule', 'FileUpload')
            clearInterval(interval)
        } else {
            clearInterval(interval)
        }
    }, 100)

    $scope.uploadedFileDetail = [];
    $scope.cloneUploadedFileDetails = [];
    $scope.AllowUpload = true;
    $scope.srcChannelArr = [];
    $scope.srcChannelData = [];
    $scope.selectOptions = [];

    $scope.fileSizeFormat = '';

    var srcChObj = {}
    srcChObj.UserId = sessionStorage.UserID;

    var add_method = "GET";

    $scope.qParam = {};

    $scope.dependentVals = {
        party: ["service", "inputformat", "psa"],
        service: ["inputformat", "psa"],
        inputformat: ["psa"]
    }

    uploadHereJQ.css({
        "pointer-events": "none",
        "opacity": 0.5
    });

    $scope.reverseArray = function(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newArray.push(arr[i]);
        }
        return newArray;
    }

    // $scope.update = function(name){
    // 	$scope.qParam[name] = $('#'+name).val();
    // }

    $(document).ready(function() {

        $scope.remoteDataConfig = function() {
            var pageLimitCount = 500;
            var add_method = 'GET';
            select2DropdownJQ.each(function() {

                $(this).select2({
                    ajax: {
                        url: function(params) {
                            if ($(this).attr('name') == 'party') {
                                $scope.links = BASEURL + "/rest/v2/parties/code"

                            } else if ($(this).attr('name') == 'service') {
                                if ($scope.qParam.party) {
                                    $scope.links = BASEURL + "/rest/v2/servicecode/" + $scope.qParam.party;
                                } else {
                                    $scope.links = "";
                                }

                            } else if ($(this).attr('name') == 'inputformat') {
                                if ($scope.qParam.party && $scope.qParam.service) {
                                    $scope.links = BASEURL + "/rest/v2/inputformat/" + $scope.qParam.party + "/" + $scope.qParam.service;
                                } else {
                                    $scope.links = "";
                                }
                            }
                            /* else if($(this).attr('name') == 'psa'){
                            if($scope.qParam.party && $scope.qParam.service && $scope.qParam.inputformat){
                            $scope.links = BASEURL +  "/rest/v2/getpsa/"+$scope.qParam.party+"/"+$scope.qParam.service+"/"+$scope.qParam.inputformat;
                            }
                            else{
                            $scope.links = "";
                            }
                            } */

                            if ($scope.links) {
                                return $scope.links;
                            }

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

                            if ($scope.links.indexOf('start') != -1 && $scope.links.indexOf('count') != -1) {
                                query = JSON.stringify({})
                            }

                            return query;
                        },
                        processResults: function(data, params) {
                            params.page = params.page ? params.page : 0;
                            var myarr = []
                            if (this.options.options.select2Id == "service" && sessionStorage.ROLE_ID.substring(0,3) == "FE_"){
                                for (j in data) {
                                    if(data[j].actualvalue == "PSE") continue
                                    myarr.push({
                                        'id': data[j].actualvalue,
                                        'text': data[j].displayvalue
                                    })
                                }
                            } else{
                                for (j in data) {
                                    myarr.push({
                                        'id': data[j].actualvalue,
                                        'text': data[j].displayvalue
                                    })
                                }
                            }
                            return {
                                results: myarr,
                                pagination: {
                                    more: data.length >= pageLimitCount
                                }
                            };
                        },

                        error: function(jqXHR, exception) {

                            if ((exception === 'error')) {
                                $scope.altMsg = jqXHR.responseJSON.error.message

                                //gotoShowAlert($scope.altMsg)

                                $scope.$apply(function() {

                                    $scope.alerts = [{
                                        type: 'danger',
                                        msg: $scope.altMsg
                                    }];

                                })
                                setTimeout(function() {
                                    alertDangerJQ.hide();
                                }, 5000)
                            }
                        },
                        cache: true
                    },
                    placeholder: 'Select',
                    minimumInputLength: 0,
                    allowClear: true
                });

                $(this).on("select2:unselect", function(e) {

                    uploadHereJQ.css({
                        "pointer-events": "none",
                        "opacity": 0.5
                    });

                    for (var i in $scope.dependentVals[$(this).attr('name')]) {
                        $("[name=" + $scope.dependentVals[$(this).attr('name')][i] + "]").val("").trigger("change")
                    }
                });

                $(this).on("select2:select", function(e) {

                    uploadBtnJQ.val('')
                    uploadHereJQ.css({
                        "pointer-events": "none",
                        "opacity": 0.5
                    });

                    for (var i in $scope.dependentVals[$(this).attr('name')]) {
                        var nameJQ = $("[name=" + $scope.dependentVals[$(this).attr('name')][i] + "]")
                        nameJQ.val("").trigger("change")
                    }

                    if ($(this).attr('name') == 'inputformat') {

                        if ($scope.qParam.party && $scope.qParam.service && $scope.qParam.inputformat) {
                            $http.get(BASEURL + "/rest/v2/getpsa/" + $scope.qParam.party + "/" + $scope.qParam.service + "/" + $scope.qParam.inputformat).then(function onSuccess(response) {
                                // Handle success
                                var data = response.data;
                                var status = response.status;
                                var statusText = response.statusText;
                                var headers = response.headers;
                                var config = response.config;

                                for (var i in data) {}
                                $scope.qParam.psa = data[i].displayvalue;
                                /* uploadBtnJQ.val('')
                                uploadHereJQ.css({"pointer-events": "none",
                                "opacity": 0.5
                                }); */
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
                                setTimeout(function() {
                                    alertDangerJQ.hide();
                                }, 5000)
                            });
                        }
                    }
                });
            });
        }
        $scope.remoteDataConfig()
    });

    if (sessionStorage.uploadedFileDetail) {
        $scope.showUploadedfileDetails = true;

        $scope.uploadedFile = JSON.parse(sessionStorage.uploadedFileDetail)

        $scope.uploadedFileDetail = JSON.parse(sessionStorage.uploadedFileDetail);
        //$scope.uploadedFileDetail.reverse();
        $scope.cloneUploadedFileDetails = $scope.reverseArray($scope.uploadedFileDetail)

    }

    $scope.uploaded = false;
    $scope.filesizeTooLarge = false;

    $scope.fileNameChanged = function(element) {

        setTimeout(function() {
            uploadHereJQ.css({
                "pointer-events": "auto",
                "opacity": 1
            });
        }, 200)

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

        var supportedFileFormat = ["1", "env","xml", "zip", "txt"];
        var str = file.name.split(".").pop().toLowerCase();
        if (supportedFileFormat.indexOf(str) != -1 || file.name.split(".").length == 1) {
            $scope.file = angular.copy($scope.DeepFile)

            // var str = file.name.split('.')[1];
            if (str == 'mt') {
                $scope.SwiftFileType = "text/plain"
                $scope.fileType = "text/plain";
            } else {
                $scope.SwiftFileType = "";
                $scope.fileType = $scope.file.type;
            }
            $scope.fileStatus = "File selected";
        
            if($scope.file.size > 0){
                if (($scope.file.size > 1024 * 1024)) {                
                    /*** for MB ***/
                    $scope.UploadedFileSize = $scope.file.size / 1024 / 1024; // Bytes to MB
                    if (($scope.UploadedFileSize * 1024) > fileUploadLimit) {
                        uploadBtnJQ.val('')
                        $scope.filesizeTooLarge = true;

                        $scope.alerts = [{
                            type: 'danger',
                            msg: `${$filter('translate')('FileUpload.ErrorSize')} ${fileUploadLimit / 1024} MB .`
                        }];

                    } else {
                        $scope.filesizeTooLarge = false;
                        alertDangerJQ.alert('close')
                    }

                    $scope.fileSizeFormat = 'MB';

                } else {                
                    /*** For KB ***/
                    $scope.UploadedFileSize = $scope.file.size / 1024;
                    if ($scope.UploadedFileSize > fileUploadLimit) {
                        uploadBtnJQ.val('')
                        $scope.filesizeTooLarge = true;
                        $scope.alerts = [{
                            type: 'danger',
                            msg: `${$filter('translate')('FileUpload.ErrorSize')} ${fileUploadLimit} KB.`
                        }];
                    } else {
                        $scope.filesizeTooLarge = false;
                        alertDangerJQ.alert('close')
                    }
                    $scope.fileSizeFormat = 'KB';
                }
            }else{                
                uploadBtnJQ.val('')
                //$scope.filesizeTooLarge = true;
                $scope.alerts = [{
                    type: 'danger',
                    msg: $filter('translate')('FileUpload.ErrorSizeEmpty').replace("??",file.name.split(".").pop())
                }];
            }

            if (uploadBtnJQ.val() != '') {
                $scope.showFileSize = true;
            } else {
                $scope.showFileSize = false;
            }
            $scope.Deepfile = angular.copy($scope.file)
        } else {
            $('#uploadBtn').val('')
            setTimeout(function() {
                $scope.file = {};
                $scope.fileStatus = '';
                $scope.uploaded = false;
                $scope.UploadedFileSize = '';
                $scope.SwiftFileType = "";
                $scope.fileType = "";
            }, 500);
            // $scope.filesizeTooLarge = true;
            $scope.alerts = [{
                type: 'danger',
                msg: $filter('translate')('FileUpload.ErrorFileType').replace("??",file.name.split(".").pop())
            }];
        }
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    uuidv4();

    $scope.alertMsg = false;
    $scope.UploadBtnTrigg = false;
    $scope.uploadFile = function() {
        $scope.UploadBtnTrigg = true;
        $scope.progress = 0;
        $scope.uploadTime = '';
        $scope.startTime = new Date().getTime();

        $scope.srcChannel = FilechannelJQ.val()

        uploadHereJQ.addClass('disabled');

        $scope.progress = 0;
        $scope.uploaded = true;
        var file = $scope.myFile;
        var binaryData;
        var uploadObj = {};

        $scope.uploadFileToUrl = function(file, srcChannel) {

            var reader = new FileReader();

            reader.onload = function(e) {
                //var encoded_file = toUTF8Array(e.target.result.toString());
                //var aa = btoa(e.target.result.toString());
                //var aa = $scope.Base64.encode(e.target.result.toString());                
				var aa = e.target.result.toString();
				//aa=aa.replace("data:application/octet-stream;base64,", "");
				aa = aa.substr(aa.indexOf(",")+1);
				//Remove BOM chrs
                if (aa.startsWith("77u/")) {
                  aa = aa.substr(4);
                }
                //uploadObj.UserId = sessionStorage.UserID;
                uploadObj.InstructionData = aa;
                uploadObj.InstructionFileName = file.name;
                uploadObj.PSACode = srcChannel;
				uploadObj.IsEncodedByUI = true;

                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", uploadComplete, false);
                xhr.addEventListener("error", uploadFailed, false);
                xhr.addEventListener("abort", uploadCanceled, false);
                xhr.withCredentials = true;
                xhr.open("POST", BASEURL + RESTCALL.FileUpload)

                xhr.setRequestHeader("Content-Type", sanitize("application/json"));
                xhr.setRequestHeader("Authorization", sanitize("SessionToken:" + sessionStorage.SessionToken));
                xhr.setRequestHeader("source-indicator", sanitize(configData.SourceIndicator)); 
                xhr.setRequestHeader("languageSelected", $rootScope.languageselected_); 
                         
                
                if(sessionStorage.idempotencykey){
                    var idemkey = sessionStorage.idempotencykey;
                     xhr.setRequestHeader("idempotency-key", idemkey);
                }else{
                    var idemkey = sanitize(uuidv4());
                    xhr.setRequestHeader("idempotency-key", idemkey); 
                    sessionStorage.idempotencykey = idemkey;                  
                }               
                
                if (configData.Authorization == 'External') {
                    xhr.setRequestHeader("X-CSRF-Token", sanitize(sessionStorage.CSRF));
                }
                xhr.send(JSON.stringify(uploadObj));

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {}
                };

                /*** Upload in Progress ***/

                function uploadProgress(evt) {
                    $scope.fileStatus = "Upload in progress";
                    $scope.$apply(function() {
                        if (evt.lengthComputable) {
                            $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                        } else {
                            $scope.progress = 0;
                        }
                    })
                }

                /*** Upload complete ***/

                function uploadComplete(evt) {
                    $scope.UploadBtnTrigg = false;
                    uploadHereJQ.removeClass('disabled');

                    if ((evt.currentTarget.readyState == 4) && ((evt.currentTarget.status == 202) || (evt.currentTarget.status == 201) || (evt.currentTarget.status == 200))) {
                        $scope.showUploadedfileDetails = true;

                        $scope.alerts = [{
                            type: 'success',
                            msg: JSON.parse(evt.currentTarget.response).responseMessage
                        }];

                        $scope.fileStatus = "Uploaded";

                        var timeTaken = new Date().getTime() - $scope.startTime;
                        $scope.uploadTime = timeConversion(timeTaken)

                        $timeout(function() {
                            /*$scope.alerts = [{
                            type : 'success',
                            msg : "File uploaded successfuly."
                            }
                            ];*/

                            $scope.alertStyle = alertSize().headHeight;
                            $scope.alertWidth = alertSize().alertWidth;

                            //$scope.srcChannel = "";
                            uploadBtnJQ.val('')
                            $scope.showFileSize = false;
                        }, 1000)

                        $timeout(function() {
                            alertSuccessJQ.alert('close')
                        }, 5000);

                        if (evt.currentTarget.status == 202) {

                            $scope.Dval1 = JSON.parse(evt.currentTarget.response).BusinessPrimaryKey[0].Value;
                            // $scope.Dval = $scope.Dval.split('[')
                            // $scope.Dval1 = $scope.Dval[1].split(']')
                            // $scope.Dval1 = $scope.Dval1[0]
                        } else {
                            /*$scope.Dval  =JSON.parse(evt.currentTarget.response)
                            $scope.Dval1 = $scope.Dval.Approval.ID;*/
                            $scope.Dval1 = JSON.parse(evt.currentTarget.response).BusinessPrimaryKey[0].Value;
                        }

                        $scope.fileInfo = {
                            "FileName": $scope.file.name,
                            "InstructionID": $scope.Dval1,
                            "PsaCode": $scope.srcChannel,
                            "FileSize": $filter('number', 2)($scope.UploadedFileSize) + ' ' + $scope.fileSizeFormat,
                            "TimeTaken": $scope.uploadTime,
                            "UploadTime": $filter('datetime')(new Date()),
                            "FileType": $scope.fileType
                        }

                        $scope.uploadedFileDetail.push($scope.fileInfo);
                        $scope.cloneUploadedFileDetails = $scope.reverseArray($scope.uploadedFileDetail)

                        //$scope.uploadedFileDetail.reverse();
                        delete sessionStorage.idempotencykey;

                        sessionStorage.uploadedFileDetail = JSON.stringify($scope.uploadedFileDetail);
                        $scope.uploadedFile = JSON.parse(sessionStorage.uploadedFileDetail)
                        $scope.showUploadedfileDetails = true;

                        setTimeout(function() {
                            $scope.file = {};
                            $scope.fileStatus = '';
                            $scope.uploaded = false;
                            $scope.UploadedFileSize = '';
                            $scope.SwiftFileType = ""
                            $scope.fileType = "";
                        }, 1500)
                    } else {
                        //uploadHereJQ.removeClass('disabled');
                        $scope.fileStatus = "Failed";
                        $scope.alerts = [{
                            type: 'danger',
                            msg: JSON.parse(evt.currentTarget.response).error.message
                        }];
                    }
                    /* This event is raised when the server send back a response */
                }

                function uploadFailed(evt) {
                    $scope.fileStatus = "Failed";
                    // alert("There was an error attempting to upload the file.")
                    $scope.alerts = [{
                        type: 'danger',
                        msg: $filter('translate')("Messages.Therewasanerrorattemptingtouploadthefile.")
                    }];
                }

                function uploadCanceled(evt) {

                    $scope.fileStatus = "Cancelled";
                    $scope.$apply(function() {
                        $scope.uploaded = false;
                    })

                    // alert("The upload has been canceled by the user or the browser dropped the connection.")
                    $scope.alerts = [{
                        type: 'danger',
                        msg: $filter('translate')("Messages.Theuploadhasbeencanceledbytheuserorthebrowserdroppedtheconnection.")
                    }];
                }
            };
            //reader.readAsText(file);
			reader.readAsDataURL(file);
        }

        if (!$scope.filesizeTooLarge) {
            $scope.uploadFileToUrl(file, $scope.srcChannel);
        }
    };

    function timeConversion(millisec) {

        var seconds = (millisec / 1000).toFixed(1);
        var minutes = (millisec / (1000 * 60)).toFixed(1);
        var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
        var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) {
            return seconds + " Sec";
        } else if (minutes < 60) {
            return minutes + " Min";
        } else if (hours < 24) {
            return hours + " Hrs";
        } else {
            return days + " Days"
        }
    }

    $scope.clickRefId = function(id) {
        let instrType = "Instruction";
        GlobalService.fileListId = id;
        $http.get(BASEURL + '/rest/v2/instructions/getInstrtype/' + id).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            instrType = data[0].displayvalue;
            if (instrType == 'statement') {
                $location.path('app/statementdetail')
            } else {
                $location.path('app/filedetail')
            }

        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

        });
        GlobalService.fileListId = id;
    }

    $scope.reverseArray = function(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newArray.push(arr[i]);
        }
        return newArray;
    }

     /**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info
*
**/
$scope.Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    // public method for encoding
    , encode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = $scope.Base64._utf8_encode(input);

        while (i < input.length)
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        } // Whend 

        return output;
    } // End Function encode 


    // public method for decoding
    ,decode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }

        } // Whend 

        output = $scope.Base64._utf8_decode(output);

        return output;
    } // End Function decode 


    // private method for UTF-8 encoding
    ,_utf8_encode: function (string)
    {
        var utftext = "";
        string = string.replace(/\r\n/g, "\n");

        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);

            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        } // Next n 

        return utftext;
    } // End Function _utf8_encode 

    // private method for UTF-8 decoding
    ,_utf8_decode: function (utftext)
    {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;
        c = c1 = c2 = 0;

        while (i < utftext.length)
        {
            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        } // Whend 

        return string;
    } // End Function _utf8_decode 

}

}]);
