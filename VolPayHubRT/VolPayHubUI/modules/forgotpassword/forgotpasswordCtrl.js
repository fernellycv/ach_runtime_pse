angular.module('VolpayApp').controller('forgotpasswordCtrl', function($scope, $http, $state, $rootScope, $filter, $timeout, $location, GlobalService, errorservice, $translate, userProfileSave) {

    $('html').css({
        "background": "transparent"
    })

    $(".custmclock").css("color", '#d6d8dc')

    // $rootScope.$broadcast('footervisible', 'not_visible');

    $scope.fgpassword, $scope.resp = "";
    $scope.$on('$viewContentLoaded', function() {

        $timeout(function() {
            $('.main-sidebar').css({
                'display': 'none'
            });
            $('.notiIcons').css('display', 'none');
            $('.content-wrapper').css({
                'margin-left': '0px'
            });
        }, 200);
    });
    
    var userData = uProfileData;    
    userData.genSetting.languageSelected='es_ES'

    if(multilingualSearchData && multilingualSearchData.multilingualenable) {
        $scope.multilingualData = multilingualSearchData;
        for(i in $scope.multilingualData.supported_languages){ 
            if($scope.multilingualData.supported_languages[i].default === true){
                $scope.userselected = $scope.multilingualData.supported_languages[i].lang;
                userData.genSetting.languageSelected = $scope.userselected;
                userProfileSave.languageSelected = $scope.userselected;
                $scope.selectedLang = $scope.userselected;
                $translate.use($scope.userselected);           
                $http.get(BASEURL + RESTCALL.PasswordRules + "/" + $scope.userselected).then(function onSuccess(response) {
                    var data = response.data;
                    $scope.passwordRules = data.responseMessage;
                });
            }
        }
    } 

    $scope.onChangeDataSelect = function(data){ 
        $scope.selectedLang = $scope.userselected = data;
        userData.genSetting.languageSelected = $scope.userselected;
        userProfileSave.languageSelected = $scope.userselected; 
        data ? $translate.use(data) : $translate.use(userData.genSetting.languageSelected); 
        $http.get(BASEURL + RESTCALL.PasswordRules + "/" + $scope.userselected).then(function onSuccess(response) {
            var data = response.data;
            $scope.passwordRules = data.responseMessage;
        });
    }      

    $scope.clicked = false;
    $scope.forgotPassword = function(val) {
        $scope.clicked = true;
        $scope.backupData = angular.copy(val);
        if ($scope.resp == "") {
            $scope.URL = BASEURL + '/rest/v2/ach/passwardcreation/forgotpswd/otpgeneration';
        } else if ($scope.resp == 1) {
            $scope.URL = BASEURL + RESTCALL.ForgotPwdOTP;
            delete $scope.backupData.EmailId;
        } else if ($scope.resp == 2) {

            if ($scope.backupData.ConfirmPassword == $scope.backupData.Password) {
                $scope.URL = BASEURL + RESTCALL.ForgotPwdReset;
                delete $scope.backupData.EmailId;
                delete $scope.backupData.ConfirmPassword;
            } else {
                $scope.showMsg('danger', $filter('translate')('loginPage.PasswordCriteria9'));
                $('input[name="Password"]').focus();
                return false;
            }
        }
        $scope.RestCallFn();
    }

    $scope.RestCallFn = function() {

        $scope.objFgtPwd = $scope.backupData;
        $scope.objFgtPwd['languageSelected']=$scope.userselected
        $scope.objFgtPwd = JSON.stringify($scope.objFgtPwd);
        sessionStorage.ACHIND = btoa(btoa(JSON.parse($scope.objFgtPwd).OTP));
        headers = { 'ACHIND': sessionStorage.ACHIND }

        $http.post($scope.URL, $scope.objFgtPwd,{ headers: headers }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.clicked = false;
            $scope.resp = Number($scope.resp) + 1;
            $timeout(function() {
                $('[data-toggle="popover"]').popover();
            }, 200)
            $scope.showMsg('success', data.responseMessage);
            if ($scope.resp > 2) {
                $rootScope.alerts = [{
                        "type": "success",
                        "msg": data.responseMessage
                    }]
                    /* GlobalService.passwordChanged = true;
                    GlobalService.responseMessage = data.responseMessage;*/
                window.location.href = "#/login";
            }
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;

            $scope.clicked = false;
            $scope.showMsg('danger', data.error.message);
            errorservice.ErrorMsgFunction(config, $scope, $http, status)
        });
    }

    $scope.showMsg = function(x, y) {
        $scope.alerts = [{
            type: x,
            msg: y
        }];
        /*$timeout(function(){
        	$('.alert').hide();
        }, 4000);*/
        return $scope.alerts
    }

    $scope.pwCancel = function() {
        $('.top-menu').css('display', 'block')
        GlobalService.logoutMessage = false;
        $rootScope.logOutMsg = '';
        $location.path("login");
    }


    $scope.multipleEmptySpace = function(e) {

        if ($filter('removeSpace')($(e.currentTarget).val()).length == 0) {
            $(e.currentTarget).val('')
        }
    }

    $scope.validatePW = function(pw, userid, e) {
        if (pw) {
            headers = { 'ACHIND': sessionStorage.ACHIND }
            $http.post(BASEURL + '/rest/v2/ach/passwardcreation/user/creation', {
                'UserId': userid,
                'Password': pw,
                'languageSelected': $scope.userselected
            }, { headers: headers }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.clicked = false;

            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;

                $scope.clicked = false;
                $scope.showMsg('danger', data.error.message);
                $(e.currentTarget).val('');
                errorservice.ErrorMsgFunction(config, $scope, $http, status)
            });
        }
    }

    $scope.popupClick = function() {
        $('[data-toggle="popover"]').popover();
    }


    $scope.password_show_hide=function() {
        
        var x = document.getElementById("password");
        var show_eye = document.getElementById("show_eye");
        var hide_eye = document.getElementById("hide_eye");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
          x.type = "text";
          show_eye.style.display = "none";
          hide_eye.style.display = "block";
        } else {
          x.type = "password";
          show_eye.style.display = "block";
          hide_eye.style.display = "none";
        }
      
      }
      $scope.password_show_hides=function() {
        
        var x = document.getElementById("ConfirmPassword");
        var show_eye = document.getElementById("show_eyes");
        var hide_eye = document.getElementById("hide_eyes");
        hide_eye.classList.remove("d-none");
        if (x.type === "password") {
          x.type = "text";
          show_eye.style.display = "none";
          hide_eye.style.display = "block";
        } else {
          x.type = "password";
          show_eye.style.display = "block";
          hide_eye.style.display = "none";
        }
      
      }

    $scope.hidePassword = function() {

        $("#password").attr("type", "text")
        if ($("#password").attr("type") == "text") {

            setTimeout(function() {
                $("#password").attr("type", "password")
            }, 100)
        }
    }

    $scope.PasswordFocus = function() {

        $("#password").attr("type", "text")
        if ($("#password").attr("type") == "text") {

            setTimeout(function() {

                $("#password").attr("type", "password")
            }, 100)
        }
    }

    $scope.hideConfirmPassword = function() {

        $("#ConfirmPassword").attr("type", "text")
        if ($("#ConfirmPassword").attr("type") == "text") {

            setTimeout(function() {
                $("#ConfirmPassword").attr("type", "password")
            }, 100)
        }
    }

    $scope.ConfirmPasswordFocus = function() {

        $("#ConfirmPassword").attr("type", "text")
        if ($("#ConfirmPassword").attr("type") == "text") {

            setTimeout(function() {

                $("#ConfirmPassword").attr("type", "password")
            }, 100)
        }
    };

    $scope.emailValidate = function(email_entered) {

        if ($("#EmailId_ForgotPass").val() != "") {
            $scope.eFlag = emailValidation(email_entered, "#EmailId_ForgotPass")
            if (!$scope.eFlag) {
                $scope.alertStyle = alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.alerts = [{
                            type: 'danger',
                            msg: $filter('translate')('loginPage.PasswordCriteria10')
                        }];
                    })
                }, 200)
                return false;
            } else {
                $('.alert-danger').hide()
            }
        }
    };

});
