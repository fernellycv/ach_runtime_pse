angular.module('VolpayApp').controller('achreportsCtrl', function ($scope, $http, $state, $location, $stateParams, $timeout, GlobalService, LogoutService, $filter, $rootScope, errorservice, AllPaymentsGlobalData) {

    var authenticationObject = $rootScope.dynamicAuthObj;
    $('.select2-dropdown').css('display', 'none');
    $scope.madeChanges = false;
    $rootScope.$on("MyEvent", function (evt, data) {
        $("#changesLostModal").modal("show");
    });

    $scope.CurrentPage = 1;
    $scope.CurrentLimit = 20;
    $scope.TotalCount = 0;
    $scope.totalReportCount = 0;
    $scope.achReports = [];
    $scope.searchValue = $stateParams.reportId;

    function GetReportData(page, limit) {
        $scope.isLoading = true;

        let obj = {
            'start': (page - 1) * limit,
            'count': limit,
            // sorts: []
        };

        if ($scope.searchValue) {
            obj.Queryfield = [{
                "ColumnName": "reportId",
                "ColumnOperation": "=",
                "ColumnValue": $scope.searchValue
            }]
        }

        /** Sorting data */
        // obj.QueryOrder = [{
        //     "ColumnName": "generatedDate",
        //     "ColumnOrder": "Desc"
        // }];

        obj = constructQuery(obj)

        $http.post(BASEURL + "/rest/v2/ach/report/generic/readall", obj).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers();
            var config = response.config;

            $scope.achReports = $scope.achReports.concat(data);
            $scope.totalReportCount = headers.totalcount;
            $scope.TotalCount = $scope.achReports.length;
            $scope.isLoading = false;
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            // $scope.alerts = [{
            //     type: 'danger',
            //     msg: data.error.message
            // }]

            $scope.isLoading = false;
        });
    }

    $scope.loadMore = function () {
        if ($scope.CurrentPage * $scope.CurrentLimit <= $scope.TotalCount) {
            $scope.CurrentPage += 1;
            GetReportData($scope.CurrentPage, $scope.CurrentLimit);
        } else if ($scope.CurrentPage == 1 && $scope.TotalCount == 0) {
            GetReportData($scope.CurrentPage, $scope.CurrentLimit);
        }
    }
    $scope.loadMore();

    $scope.refresh = function () {
        $scope.CurrentPage = 1;
        $scope.CurrentLimit = 20;
        $scope.TotalCount = 0;
        $scope.totalReportCount = 0;
        $scope.achReports = [];
        $scope.quickSearch = undefined;
        $scope.loadMore();
    }

    $scope.clearSearch = function () {
        $scope.searchValue = null;
        $scope.quickSearch = undefined;
        // $stateParams.reportId = null;
        // $location.reload();
        $state.transitionTo($state.current, {
            reportId: null
        }, {
            reload: true,
            inherit: false,
            notify: true
        });
        $scope.refresh();
    }

    $scope.statusChecker = function (status) {
        return status.toUpperCase() != 'ACTIVE';
    };

    $scope.downloadFile = function (id, type) {
        $http({
            method: 'POST',
            url: BASEURL + '/rest/v2/ach/report/generic/download',
            params: { reportId: id },
            responseType: 'arraybuffer'
        }).then(function onSuccess(success_response) {
            headers = success_response.headers();

            // var filename = headers['x-filename'] || 'download.' + type.toLowerCase();
            var filename = headers['content-disposition'].split("filename=")[1];
            var contentType = headers['content-type'] || 'application/octet-stream';
            var json = JSON.stringify(success_response.data);

            var linkElement = document.createElement('a');
            // document.body.appendChild(linkElement);
            // linkElement.style = "display: none";
            try {
                var blob = new Blob([success_response.data], { type: contentType });
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                // linkElement.click();
                // window.URL.revokeObjectURL(linkElement);
                linkElement.dispatchEvent(clickEvent);
                if (id && success_response.status == 200) {
                    $http({
                        method: 'PUT',
                        url: BASEURL + '/rest/v2/ach/report/generic/sts',
                        params: { reportId: id }
                    }).then(function onSuccess(response) {
                        $scope.refresh();
                    }).catch(function onError(err) {
                        // Handle error
                        var data = err.data;
                        var status = err.status;
                        var config = err.config;

                        errorservice.ErrorMsgFunction(config, $scope, $http, status);
                    });
                }
            } catch (ex) {
                console.log(ex);
            }
        }).catch(function onError(err_response) {
            console.log(err_response);
        });
    };

    // Based on an implementation here: web.student.tuwien.ac.at/~e0427417/jsdownload.html
    $scope.downloadFiles = function (httpPath) {
        // Use an arraybuffer
        $http.get(httpPath, { responseType: 'arraybuffer' })
            .then(function onSuccess(success_response) {

                var octetStreamMime = 'application/octet-stream';
                var success = false;

                // Get the headers
                headers = success_response.headers();

                // Get the filename from the x-filename header or default to "download.bin"
                // var filename = headers['x-filename'] || 'download.bin';
                var filename = headers['content-disposition'].split("filename=")[1];
                // Determine the content type from the header or default to "application/octet-stream"
                var contentType = headers['content-type'] || octetStreamMime;

                try {
                    // Try using msSaveBlob if supported
                    console.log("Trying saveBlob method ...");
                    var blob = new Blob([success_response.data], { type: contentType });
                    if (navigator.msSaveBlob)
                        navigator.msSaveBlob(blob, filename);
                    else {
                        // Try using other saveBlob implementations, if available
                        var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                        if (saveBlob === undefined) throw "Not supported";
                        saveBlob(blob, filename);
                    }
                    console.log("saveBlob succeeded");
                    success = true;
                } catch (ex) {
                    console.log("saveBlob method failed with the following exception:");
                    console.log(ex);
                }

                if (!success) {
                    // Get the blob url creator
                    var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    if (urlCreator) {
                        // Try to use a download link
                        var link = document.createElement('a');
                        if ('download' in link) {
                            // Try to simulate a click
                            try {
                                // Prepare a blob URL
                                console.log("Trying download link method with simulated click ...");
                                var blob = new Blob([success_response.data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);
                                link.setAttribute('href', url);

                                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                link.setAttribute("download", filename);

                                // Simulate clicking the download link
                                var event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                link.dispatchEvent(event);
                                console.log("Download link method with simulated click succeeded");
                                success = true;

                            } catch (ex) {
                                console.log("Download link method with simulated click failed with the following exception:");
                                console.log(ex);
                            }
                        }

                        if (!success) {
                            // Fallback to window.location method
                            try {
                                // Prepare a blob URL
                                // Use application/octet-stream when using window.location to force download
                                console.log("Trying download link method with window.location ...");
                                var blob = new Blob([success_response.data], { type: octetStreamMime });
                                var url = urlCreator.createObjectURL(blob);
                                window.location = url;
                                console.log("Download link method with window.location succeeded");
                                success = true;
                            } catch (ex) {
                                console.log("Download link method with window.location failed with the following exception:");
                                console.log(ex);
                            }
                        }

                    }
                }

                if (!success) {
                    // Fallback to window.open method
                    console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                    window.open(httpPath, '_blank', '');
                }
            }).catch(function onError(err_response) {
                console.log("Request failed with status: " + err_response.status);

                // Optionally write the error out to scope
                $scope.errorDetails = "Request failed with status: " + err_response.status;
            });
    };

});