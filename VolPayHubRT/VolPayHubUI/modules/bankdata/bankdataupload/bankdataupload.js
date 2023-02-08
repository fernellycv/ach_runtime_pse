var d = new Date();
var n = d.toISOString();


angular.module('VolpayApp').directive('fileModel', ['$parse', function($parse) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var model = $parse(attrs.fileModel);
            //var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

angular.module('VolpayApp').controller('bankdatauploadCtrl', ['$scope', '$state', '$timeout', '$stateParams', '$filter', '$http', '$translate', 'bankData', 'GlobalService', 'LogoutService', '$rootScope', function($scope, $state, $timeout, $stateParams, $filter, $http, $translate, bankData, GlobalService, LogoutService, $rootScope) {


    $scope.uploadedFileDetail = [];
    $scope.AllowUpload = true;
    $scope.srcChannelArr = [];
    $scope.srcChannelData = [];
    $scope.selectOptions = []

    var srcChObj = {}
    srcChObj.UserId = sessionStorage.UserID;

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

    $scope.fileuploaddata = {
        "PPKFileData": "string",
        "PPKFileName": "string",
        "TransportCode": $scope.fieldData.TransportCode,
        "TransportType": $scope.fieldData.TransportType
    }

    var add_method = "GET";

    $scope.qParam = {};

    $scope.dependentVals = {
        party: ["service", "inputformat", "psa"],
        service: ["inputformat", "psa"],
        inputformat: ["psa"]
    }

    /* $('#uploadHere').css({"pointer-events": "none",
        "opacity": 0.5
		}); */

    $(document).ready(function() {
        //$scope.remoteDataConfig()
    })

    if (sessionStorage.uploadedFileDetail1) {
        $scope.showUploadedfileDetails = true;

        $scope.uploadedFile = JSON.parse(sessionStorage.uploadedFileDetail1)

        $scope.uploadedFileDetail = JSON.parse(sessionStorage.uploadedFileDetail1);
        $scope.uploadedFileDetail.reverse();

    }

    $scope.uploaded = false;
    $scope.filesizeTooLarge = false;

    $scope.fileNameChanged = function(element) {
        var fileUploadLimit = sessionStorage.fileUploadLimit * 1024;
        var file = element.files[0]
        $scope.DeepFile = {
            "name": element.files[0].name,
            "size": element.files[0].size,
            "type": element.files[0].type,
            "webkitRelativePath": element.files[0].webkitRelativePath,
            "lastModifiedDate": element.files[0].lastModifiedDate,
            "lastModified": element.files[0].lastModified
        }

        $scope.file = angular.copy($scope.DeepFile)

        var str = file.name.split('.')[1];
        if (str == 'mt') {
            $scope.SwiftFileType = "text/plain"
            $scope.fileType = "text/plain";
        } else {
            $scope.SwiftFileType = "";
            $scope.fileType = $scope.file.type;
        }
        $scope.fileStatus = "File selected";

        if (($scope.file.size > 1024 * 1024)) {
            /*** for MB ***/
            $scope.UploadedFileSize = $scope.file.size / 1024 / 1024; // Bytes to MB
            if (($scope.UploadedFileSize * 1024) > fileUploadLimit) {
                $('#uploadBtn').val('')

                $scope.filesizeTooLarge = true;

                $scope.alerts = [{
                    type: 'danger',
                    msg: "Your file size too large to upload. Maximum file upload limit is " + fileUploadLimit / 1024 + " MB ."
                }];

            } else {
                $scope.filesizeTooLarge = false;
                $('.alert-danger').alert('close')
            }

        } else {
            /*** For KB ***/
            $scope.UploadedFileSize = $scope.file.size / 1024;
            if ($scope.UploadedFileSize > fileUploadLimit) {
                $('#uploadBtn').val('')
                $scope.filesizeTooLarge = true;
                $scope.alerts = [{
                    type: 'danger',
                    msg: "Your file size too large to upload. Maximum file upload limit is " + fileUploadLimit + "KB."
                }];
            } else {
                $scope.filesizeTooLarge = false;
                $('.alert-danger').alert('close')
            }

        }

        if ($("#uploadBtn").val() != '') {
            $scope.showFileSize = true;
        } else {
            $scope.showFileSize = false;
        }
        $scope.Deepfile = angular.copy($scope.file)

    }

    $scope.alertMsg = false;

    $scope.uploadFile = function(location) {
        $scope.progress = 0;
        $scope.uploadTime = '';
        $scope.startTime = new Date().getTime();

        $scope.srcChannel = $('#Filechannel').val()

        //	$('#uploadHere').addClass('disabled');

        $scope.progress = 0;
        $scope.uploaded = true;
        var file = $scope.myFile;
        var binaryData;
        var uploadObj = {};

        $scope.uploadFileToUrl = function(file, srcChannel) {

            var reader = new FileReader();

            reader.onload = function(e) {
                var encoded_file = toUTF8Array(e.target.result.toString());
                var aa = textToBin(e.target.result.toString())

                //uploadObj.UserId = sessionStorage.UserID;
                uploadObj.PPKFileData = aa;
                uploadObj.PPKFileName = file.name;
                uploadObj.TransportCode = srcChannel.TransportCode;
                uploadObj.TransportType = srcChannel.TransportType;
                uploadObj.FileLocation = location;



                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", uploadComplete, false);
                xhr.addEventListener("error", uploadFailed, false);
                xhr.addEventListener("abort", uploadCanceled, false);
                xhr.withCredentials = true;
                xhr.open("POST", BASEURL + RESTCALL.transportfileupload)

                xhr.setRequestHeader("Content-Type", sanitize("application/json"));
                xhr.setRequestHeader("Authorization", sanitize("SessionToken:" + sessionStorage.SessionToken));
                xhr.setRequestHeader("source-indicator", sanitize(configData.SourceIndicator));
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
                                //$scope.progress = Math.ceil((evt.loaded / evt.total) * 100);


                        } else {
                            $scope.progress = 0;
                        }

                    })
                }

                /*** Upload complete ***/

                function uploadComplete(evt) {

                    /* $('#uploadHere').removeClass('disabled'); */

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
                            $('#uploadBtn').val('')
                            $scope.showFileSize = false;
                        }, 1000)

                        $timeout(function() {

                            $('.alert-success').alert('close')

                        }, 5000);



                        if (evt.currentTarget.status == 202) {

                            $scope.Dval1 = JSON.parse(evt.currentTarget.response).BusinessPrimaryKey[0].Value;
                        } else {
                            $scope.Dval1 = JSON.parse(evt.currentTarget.response).BusinessPrimaryKey[0].Value;
                        }



                        $scope.fileInfo = {
                            "FileName": $scope.file.name,
                            "InstructionID": $scope.Dval1,
                            "PsaCode": $scope.srcChannel,
                            "FileSize": $scope.UploadedFileSize,
                            "TimeTaken": $scope.uploadTime,
                            "UploadTime": $filter('datetime')(new Date()),
                            "FileType": $scope.fileType
                        }



                        $scope.uploadedFileDetail.push($scope.fileInfo);
                        $scope.uploadedFileDetail.reverse();

                        sessionStorage.uploadedFileDetail1 = JSON.stringify($scope.uploadedFileDetail);
                        $scope.uploadedFile = JSON.parse(sessionStorage.uploadedFileDetail1)
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
                        //$('#uploadHere').removeClass('disabled');
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
                        msg: "There was an error attempting to upload the file."
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
                        msg: "The upload has been canceled by the user or the browser dropped the connection."
                    }];
                }

            };

            reader.readAsText(file);

        }

        if (!$scope.filesizeTooLarge) {
            $scope.uploadFileToUrl(file, $scope.fileuploaddata);
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

        GlobalService.fileListId = id;
        $location.path('app/transport')
    }

}]);