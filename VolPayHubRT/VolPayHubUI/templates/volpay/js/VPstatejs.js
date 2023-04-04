angular.module('VolpayApp').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    var n = new Date().getTime()

    if (configData.Authorization == 'Internal') {
        $urlRouterProvider.otherwise("/login");
    }

    if (configData.Authorization == 'External') {
        /*if(sessionStorage.SessionToken==null || sessionStorage.UserID==null){
          window.location = "/VolPayUI/errorpages/401.html";
        }
        $urlRouterProvider.otherwise("/app/dashboard");*/
        $urlRouterProvider.otherwise("/app/homeprofile");
    }

    $stateProvider
        .state('hybridlogin', {
            url: "/hybridlogin",
            templateUrl: "templates/hybrid/VPhybridlogin.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "hybridloginCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'templates/hybrid/VPhybridloginCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "templates/login/VPlogin.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "loginCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'templates/login/VPloginCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app', {
            url: "/app",
            templateUrl: "modules/app.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                details: null
            },
            controller: "appCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'templates/sidebar/VPsidebar.css',
                            'templates/sidebar/VPsidebarCtrl.js',

                            'templates/header/VPheaderCtrl.js',
                            'templates/header/VPheader.css',

                            'modules/appCtrl.js',

                            'templates/volpay/js/VPdirectivejs.js',
                            'templates/web-form/webFormCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.paymentsummary', {
            url: "/dashboard",
            templateUrl: "modules/paymentdashboard/dashboard.html?a=" + n,
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "dashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/paymentdashboard/dashboardController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.routeregistry', {
            url: "/routeregistry",
            templateUrl: "modules/routeregistry/routeregistry.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "routeregistryCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/routeregistry/routeregistry.js'
                        ]
                    });
                }]
            }
        })
        .state('app.serviceregistry', {
            url: "/serviceregistry",
            templateUrl: "modules/serviceregistry/serviceregistry.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "serviceregistryCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/serviceregistry/serviceregistryCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.systemdiagnosis', {
            url: "/systemdiagnosis",
            templateUrl: "modules/systemdiagnosis/systemdiagnosis.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "systemdiagnosisCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/systemdiagnosis/systemdiagnosisCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.viewsystemdiagnosis', {
            url: "/viewsystemdiagnosis",
            templateUrl: "modules/systemdiagnosis/viewsystemdiagnosis/viewsystemdiagnosis.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "systemdiagnosisDetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/systemdiagnosis/viewsystemdiagnosis/viewsystemdiagnosisCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.scheduledroutelogaudit', {
            url: "/scheduledroutelogaudit",
            templateUrl: "modules/scheduledroutelogaudit/scheduledroutelogaudit.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "scheduledroutelogauditCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/scheduledroutelogaudit/scheduledroutelogauditCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.sodhealthcheck', {
            url: "/sodhealthcheck",
            templateUrl: "modules/sodhealthcheck/sodhealthcheck.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "sodhealthcheckCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/sodhealthcheck/sodhealthcheckCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.transactions', {
            url: "/alltransaction",
            templateUrl: "modules/alltransaction/alltransaction.html?a=" + n,
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "alltransactionCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/alltransaction/alltransactionController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.payments', {
            url: "/allpayments",
            templateUrl: "modules/allpayments/allpayments.html?a=" + n,
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "allPaymentsCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allpayments/allPaymentsController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.paymentdetail', {
            url: "/paymentdetail",
            templateUrl: "modules/paymentdetail/paymentdetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "paymentDetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/paymentdetail/paymentDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.accountinformation', {
            url: "/allaccounts",
            templateUrl: "modules/allaccountinformation/allaccountinformation.html?a=" + n,
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "allaccountinformationCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allaccountinformation/allaccountinformationController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.accountdetail', {
            url: "/accountdetail",
            templateUrl: "modules/allaccountinformation/accountdetail/accountdetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "accountDetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/allaccountinformation/accountdetail/accountDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.bulkoverride', {
            url: "/bulkoverride",
            templateUrl: "modules/bulkoverride/bulkoverride.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: ''
            },
            controller: "bulkoverride",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/bulkoverride/bulkoverride.js'
                        ]
                    });
                }]
            }
        })
        .state('app.payment-repair', {
            url: "/payment-repair",
            templateUrl: "modules/paymentrepair/payment-repair.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: ''
            },
            controller: "paymentRepairCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/paymentrepair/paymentRepairCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.filesummary', {
            url: "/filedashboard",
            templateUrl: "modules/filedashboard/fileDashboard.html?a=" + n,
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "fileDashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/filedashboard/fileDashboardController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.instructions', {
            url: "/instructions",
            templateUrl: "modules/allfiles/filelist.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "fileListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allfiles/fileListController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.accounts', {
            url: "/accounts",
            templateUrl: "modules/allaccounts/accountsList.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "accountsListCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allaccounts/accountsListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.receivedaccountslist', {
            url: "/receivedaccountslist",
            templateUrl: "modules/allaccounts/receivedAccountsList/receivedAccountsList.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "receivedAccountsListCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allaccounts/receivedAccountsList/receivedAccountsListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.statements', {
            url: "/statements",
            templateUrl: "modules/allstatements/statementlist.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "statementListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allstatements/statementListController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.allstatemententries', {
            url: "/allstatemententries",
            templateUrl: "modules/allstatemententries/allstatemententries.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "allstatemententriesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allstatemententries/allstatemententriesCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.manualmatching', {
            url: "/manualmatching",
            templateUrl: "modules/manualmatching/manualmatching.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "manualMatchingCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/manualmatching/manualmatchingCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.matchingcriteria', {
            url: "/matchingcriteria",
            templateUrl: "modules/manualmatching/manualmatching.html?a=" + n,
            data: {
                pageTitle: ''
            },
            controller: "manualMatchingCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/manualmatching/manualmatchingCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.confirmation', {
            url: "/confirmation",
            templateUrl: "modules/allconfirmation/allconfirmation.html",
            data: {
                pageTitle: ''
            },
            controller: "allconfirmationCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allconfirmation/allconfirmationCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.attachmessages', {
            url: "/attachmessages",
            templateUrl: "modules/attachmessages/attachmessages.html",
            data: {
                pageTitle: ''
            },
            controller: "attachmessagesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/attachmessages/attachmessagesCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.systeminteraction', {
            url: "/systeminteraction",
            templateUrl: "modules/systeminteraction/systeminteraction.html",
            data: {
                pageTitle: ''
            },
            controller: "systeminteractionCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/systeminteraction/systeminteractionCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.distributedstatements', {
            url: "/distributedstatements",
            templateUrl: "modules/distributedstatements/distributedstatements.html",
            data: {
                pageTitle: 'Distributed Instructions'
            },
            params: {
                input: ''
            },
            controller: "distributedstatementsctrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/distributedstatements/distributedstatementsctrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.distributedinstructions', {
            url: "/distributedinstructions",
            templateUrl: "modules/distributedinstructions/distributedinstructions.html",
            data: {
                pageTitle: 'Distributed Instructions'
            },
            params: {
                input: ''
            },
            controller: "distributedinstructionsctrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/distributedinstructions/distributedinstructionsctrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.distributeddetail', {
            url: "/distributeddetail",
            templateUrl: "modules/distributeddetail/distributeddetail.html",
            data: {
                pageTitle: 'Distributed Details'
            },
            params: {
                input: null
            },
            controller: "distributedDetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/distributeddetail/distributeddetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.allbatches', {
            url: "/allbatches",
            templateUrl: "modules/allbatches/allbatches.html?a=" + n,
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "allBatchesCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/allbatches/allbatchesController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.allbatchesdetail', {
            url: "/allbatchesdetail",
            templateUrl: "modules/allbatchesdetail/allbatchesdetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: ''
            },
            controller: "allBatchesDetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/allbatchesdetail/allbatchesDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.outputpaymentsummary', {
            url: "/outputpaymentsummary",
            templateUrl: "modules/paymentsummary/outputpaymentsummary.html",
            data: {
                pageTitle: 'Output Payment Summary'
            },
            params: {
                input: ''
            },
            controller: "outputpaymentsummaryctrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/paymentsummary/outputpaymentsummaryctrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.statementsummary', {
            url: "/statementsummary",
            templateUrl: "modules/statementsummary/statementsummary.html",
            data: {
                pageTitle: 'Output Statement Summary'
            },
            params: {
                input: ''
            },
            controller: "statementsummaryctrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/statementsummary/statementsummaryctrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.filedetail', {
            url: "/filedetail",
            templateUrl: "modules/filedetail/filedetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },
            controller: "filedetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/filedetail/filedetailCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.statementdetail', {
            url: "/statementdetail",
            templateUrl: "modules/statementdetail/statementdetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },
            controller: "statementdetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/statementdetail/statementdetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.initiatetransaction', {
            url: "/initiatetransaction",
            templateUrl: "modules/initiatetransation/initiateTransaction.html?a=" + n,
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "initiateTransactionCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/initiatetransation/initiateTransactionCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.fileupload', {
            url: "/fileupload",
            templateUrl: "modules/fileupload/fileupload.html?a=" + n,
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "fileuploadCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/fileupload/fileuploadCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.paymentrecovery', {
            url: "/paymentrecovery",
            templateUrl: "modules/paymentrecovery/paymentrecovery.html?a=" + n,
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "paymentrecoveryCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/paymentrecovery/paymentrecoveryCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.myprofile', {
            url: "/myprofile",
            templateUrl: "modules/myprofile/myprofile.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "myprofileCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'lib/bootstrap-toggle-master/css/bootstrap-toggle.min.css',
                            'lib/bootstrap-toggle-master/js/bootstrap-toggle.min.js',
                            'modules/myprofile/myprofileCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.homeprofile', {
            url: "/homeprofile",
            templateUrl: "modules/homeprofile/homeprofile.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "homeprofileCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/homeprofile/homeprofileCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.notifications', {
            url: "/AlertsandNotification",
            templateUrl: "modules/alertsnotification/AlertandNotific.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "AlertandNotifiCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/alertsnotification/alertnotification.css',
                            'modules/alertsnotification/AlertandNotifiCtrl.js'
                        ]
                    });
                }]
            }
        })
        // User Management
        .state('app.users', {
            url: "/usermanagement",
            templateUrl: "modules/usermanagement/usermanagement.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "userMgmtController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/usermanagement/userManagementCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.userdetail', {
            url: "/userdetail",
            templateUrl: "modules/usermanagement/userdetail/usermanagementdetail.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null,
                permission: null
            },
            controller: "usermanagementdetail",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/usermanagement/userdetail/usermanagementdetail.js'
                        ]
                    });
                }]
            }
        })
        // User Session Management
        .state('app.usersession', {
            url: "/usersessionmanagement",
            templateUrl: "modules/usersessionmanagement/usersessionmanagement.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "userSessionMgmtController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/usersessionmanagement/usersessionmanagementCtrl.js'
                        ]
                    });
                }]
            }
        })
        //User Session Details
        .state('app.usersessiondetail', {
            url: "/usersessiondetail",
            templateUrl: "modules/usersessionmanagement/usersessiondetail/usersessiondetail.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null,
                permission: null
            },
            controller: "usersessiondetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/usersessionmanagement/usersessiondetail/usersessiondetailCtrl.js'
                        ]
                    });
                }]
            }
        })

        // User Session Delete Management
        .state('app.usersdeletesession', {
            url: "/usersdeletesession",
            templateUrl: "modules/usersessiondeletemanagement/usersessionmanagement.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "userdeleteSessionMgmtController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/usersessiondeletemanagement/usersessionmanagementCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Add user
        .state('app.adduser', {
            url: "/adduser",
            templateUrl: "modules/adduser/adduser.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "adduserCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/adduser/adduserCtrl.js'
                        ]
                    });
                }]
            }
        })
        //Roles and Responsibilities
        .state('app.roles', {
            url: "/roles",
            templateUrl: "modules/rolesandpermission/roles.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "rolesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/rolesandpermission/rolesCtrl.js'
                        ]

                    });
                }]
            }
        })
        // Time Restrictions
        .state('app.timerestrictions', {
            url: "/timerestrictions",
            templateUrl: "modules/timerestrictions/timerestrictions.html",
            data: {
                pageTitle: 'Time resttrictions Template'
            },
            params: {
                input: null
            },
            controller: "timeRestrictionsCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/timerestrictions/timerestrictionsCtrl.js'
                        ]

                    });
                }]
            }
        })
        .state('app.viewresourcepermission', {
            url: "/viewresourcepermission",
            templateUrl: "modules/rolesandpermission/viewresourcepermission/viewresourcepermission.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "viewresourcepermissionCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/rolesandpermission/viewresourcepermission/viewresourcepermissionCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Security Add user
        .state('app.securityaddroles', {
            url: "/securityaddroles",
            templateUrl: "modules/securityaddrole/securityaddroles.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "securityaddrolesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/securityaddrole/securityaddrolesCtrl.js'
                        ]
                    });
                }]
            }
        })

        // Security Roles and Responsibilities
        .state('app.securityroles', {
            url: "/securityroles",
            templateUrl: "modules/securityrolesandpermission/securityroles.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "securityrolesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/securityrolesandpermission/securityrolesCtrl.js'
                        ]

                    });
                }]
            }
        })
        .state('app.securityviewresourcepermission', {
            url: "/securityviewresourcepermission",
            templateUrl: "modules/securityrolesandpermission/securityviewresourcepermission/securityviewresourcepermission.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "securityviewresourcepermissionCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/securityrolesandpermission/securityviewresourcepermission/securityviewresourcepermissionCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.mpitemplate', {
            url: "/mpitemplate",
            templateUrl: "modules/mpitemplate/mpitemplate.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },
            controller: "mpitemplateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/mpitemplate/mpitemplateCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.mpidetail', {
            url: "/mpidetail",
            templateUrl: "modules/mpitemplate/mpidetail/mpidetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },
            controller: "mpidetailsCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/mpitemplate/mpidetail/mpidetailsCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.ruleadd', {
            url: "/addrule",
            templateUrl: "modules/brules/ruleadd.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },

            resolve: {
                "check": function ($location, $stateParams) {
                    if (!$stateParams.input) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/brules/ruleaddCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.rulegenerate', {
            url: "/rulegenerate",
            templateUrl: "modules/brules/rulegenerate.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },
            resolve: {
                "check": function ($location, $stateParams) {
                    if (!$stateParams.input) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/brules/rulegenerate.js'
                        ]
                    });
                }]
            }
        })

        //Application configuration
        .state('app.configurations', {
            url: "/AppConfig",
            templateUrl: "modules/appconfig/AppConfig.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "AppConfigCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'modules/appconfig/AppConfigCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Volpayidconfig
        .state('app.idconfigurations', {
            url: "/volpayidconfig",
            templateUrl: "modules/volpayidconfig/volpayIdConfig.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "volpayidConfigCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/volpayidconfig/volpayidConfigCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Volpayidconfig Details
        .state('app.volpayidconfigdetail', {
            url: "/volpayidconfigdetail",
            templateUrl: "modules/volpayidconfig/viewvolpayidconfig/viewVolpayIdConfig.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: null
            },
            controller: "volpayidConfigDetailCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [

                            'modules/volpayidconfig/viewvolpayidconfig/volpayidConfigDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        //Bank Data approvals
        .state('app.approvals', {
            url: "/approval",
            templateUrl: "modules/approvals/approval.html?a=" + n,
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "approvalCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/approvals/approvalCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.viewApprovalData', {
            url: "/approval",
            templateUrl: "modules/approvals/viewapproval/viewApprovalData.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "viewApprovalDataCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/approvals/viewapproval/viewApprovalDataCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Add Roles
        .state('app.addroles', {
            url: "/addroles",
            templateUrl: "modules/addrole/addroles.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            params: {
                input: null
            },
            controller: "addrolesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/addrole/addrolesCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Forgot Password
        .state('forgotpassword', {
            url: "/forgotpassword",
            templateUrl: "modules/forgotpassword/forgotpassword.html",
            data: {
                pageTitle: 'forgotpasswordCtrl'
            },
            controller: "forgotpasswordCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/forgotpassword/forgotpasswordCtrl.js'
                        ]
                    });
                }]
            }
        })

        //Create Password
        .state('createpassword', {
            url: "/createpassword?resetLink",
            templateUrl: "modules/createpassword/createpassword.html",
            data: {
                pageTitle: 'createpasswordCtrl'
            },
            controller: "createpasswordCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/createpassword/createpasswordCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.closingcycle', {
            url: "/closingcycle",
            templateUrl: "modules/closingcycle/closingcycle.html",
            data: {
                pageTitle: 'AngularJS Closing Cycle'
            },
            controller: "closingcycleCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/closingcycle/closingcycleController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.IntegrateERP', {
            url: "/IntegrateERP",
            templateUrl: "modules/IntegrateERP/IntegrateERP.html",
            data: {
                pageTitle: 'AngularJS Integrate ERP'
            },
            controller: "IntegrateERPCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/IntegrateERP/IntegrateERPController.js'
                        ]
                    });
                }]
            }
        })
        .state('app.RefundReport', {
            url: "/RefundReport",
            templateUrl: "modules/RefundReport/RefundReport.html",
            data: {
                pageTitle: 'AngularJS RefundReport'
            },
            controller: "RefundReportCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/RefundReport/RefundReport.js'
                        ]
                    });
                }]
            }
        })
        .state('app.sanctiongenerator', {
            url: "/sanctiongenerator",
            templateUrl: "modules/sanction/santions.html",
            data: {
                pageTitle: 'AngularJS Sanction Generator'
            },
            controller: "sanctiongeneratorCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/sanction/sanctions.js'
                        ]
                    });
                }]
            }
        })

        .state('app.sanctioncycle', {
            url: "/sanctioncycle",
            templateUrl: "modules/sanctioncycle/sanctioncycle.html",
            data: {
                pageTitle: 'AngularJS Sanction Cycle'
            },
            controller: "sanctioncycleCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/sanctioncycle/sanctioncycle.js'
                        ]
                    });
                }]
            }
        })

        .state('app.bankworksheet', {
            url: "/bankworksheet",
            templateUrl: "modules/bankworksheet/bankworksheet.html",
            data: {
                pageTitle: 'AngularJS bankworksheet'
            },
            controller: "bankworksheetCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/bankworksheet/bankworksheet.js'
                        ]
                    });
                }]
            }
        })
        .state('app.balancesheet', {
            url: "/balancesheet",
            templateUrl: "modules/balancesheet/balancesheet.html",
            data: {
                pageTitle: 'AngularJS Compensation'
            },
            controller: "balancesheetCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/balancesheet/balancesheet.js'
                        ]
                    });
                }]
            }
        })
        .state('app.commissions', {
            url: "/commissions",
            templateUrl: "modules/commissions/commissions.html",
            data: {
                pageTitle: 'AngularJS Compensation'
            },
            controller: "commissionsCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/commissions/commissions.js'
                        ]
                    });
                }]
            }
        })
        .state('app.cylesummary', {
            url: "/cylesummary",
            templateUrl: "modules/cylesummary/cylesummary.html",
            data: {
                pageTitle: 'AngularJS Compensation'
            },
            controller: "cylesummaryCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/cylesummary/cylesummary.js'
                        ]
                    });
                }]
            }
        })
        .state('app.reportsdetail', {
            url: "/reportsdetail",
            templateUrl: "modules/reports/reportsdetail/reportsDetail.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "reportsDetailCtrl",

            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/reports/reportsdetail/reportsDetailCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.reportgenerate', {
            url: "/reportgenerate",
            templateUrl: "modules/reports/reportgenerate/reportgenerate.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "reportGenerateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/reports/reportgenerate/reportGenerateCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.StatisticsReports', {
            url: "/StatisticsReports",
            templateUrl: "modules/achreports/achreportsreportgenerate.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "achreportsreportgenerateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/achreports/achreportsreportgenerateCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.StatisticsReportsCENIT', {
            url: "/StatisticsReportsCENIT",
            templateUrl: "modules/achreportsCENIT/achreportsreportCENITgenerate.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "achreportsreportCENITgenerateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'modules/achreportsCENIT/achreportsreportCENITgenerateCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.achreports', {
            url: "/achreports?reportId",
            templateUrl: "modules/achreportsfile/achreports.html",
            params: {
                reportId: null,
            },
            data: {
                pageTitle: 'ACH Reports'
            },
            controller: "achreportsCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/achreportsfile/achreports.js'
                        ]
                    });
                }]
            }
        })

        //Bank Data
        .state('app.executeadhoc', {
            url: "/executeadhoc",
            templateUrl: "modules/executeadhoc/executeadhoc.html",
            data: {
                pageTitle: ''
            },
            controller: "executeadhocCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/executeadhoc/executeadhocCtrl.js'
                        ]
                    });
                }]
            }
        })
        // PSE
        .state('app.receivedtransactionpse', {
            url: "/receivedtransactionpse",
            templateUrl: "modules/pse/receivedtransactionpse/receivedtransactionpse.html",
            data: {
                pageTitle: ''
            },
            controller: "receivedTransactionPSECtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/receivedtransactionpse/receivedtransactionpseCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.resendtxnsclearedpse', {
            url: "/resendtxnsclearedpse",
            templateUrl: "modules/pse/resendtransactionsclearedpse/resendtxnsclearedpse.html",
            data: {
                pageTitle: ''
            },
            controller: "resendTxnsClearedPSECtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/resendtransactionsclearedpse/resendtxnsclearedpseCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.txfrompsevsclearingintegra', {
            url: "/txfrompsevsclearingintegra",
            templateUrl: "modules/pse/txfrompsevsclearingintegra/txfrompsevsclearingintegra.html",
            data: {
                pageTitle: ''
            },
            controller: "txfrompsevsclearingintegraCrtl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/txfrompsevsclearingintegra/txfrompsevsclearingintegraCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.pseassistedtransactionquery', {
            url: "/pseassistedtransactionquery",
            templateUrl: "modules/pse/pseassistedtransactionquery/PSEAssistedTransactionQuery.html",
            data: {
                pageTitle: ''
            },
            controller: "PSEAssistedTransactionQueryCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/pseassistedtransactionquery/PSEAssistedTransactionQueryCtrl.js'
                        ]
                    });
                }]
            }
        }).state('app.ADFQueryConsolidatedByProcessingDate', {
            url: "/ADFQueryConsolidatedByProcessingDate",
            templateUrl: "modules/pse/ADFQueryConsolidated/ConsolidatedADFByProcessingDate.html",
            data: {
                pageTitle: ''
            },
            controller: "ADFQueryConsolidatedByProcessingDateCrtl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/ADFQueryConsolidated/ConsolidatedADFByProcessingDateCrtl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.ADFQueryConsolidatedByState', {
            url: "/ADFQueryConsolidatedByState",
            templateUrl: "modules/pse/ADFQueryConsolidated/ConsolidatedADFByState.html",
            data: {
                pageTitle: ''
            },
            controller: "ConsolidatedADFqueryByStateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/ADFQueryConsolidated/ConsolidatedADFByStateCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.queryrejectedmessages', {
            url: "/queryrejectedmessages",
            templateUrl: "modules/pse/queryrejectedmessages/queryrejectedmessages.html",
            data: {
                pageTitle: ''
            },
            controller: "QueryRejectedMessagesCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/pse/queryrejectedmessages/queryrejectedmessagesCtrl.js'
                        ]
                    });
                }]
            }
        })
        //Bank Data
        .state('app.bankData', {
            url: "/:urlId",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            },
            templateUrl: "modules/bankdata/bankData.html",
            data: {
                pageTitle: ''
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "bankDataCtrl",
            resolve: {
                "check": function ($location, $stateParams, $rootScope) {
                    $rootScope.$emit('MyEventforEditIdleTimeout', true);
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/bankdata/bankDataCtrl.js'
                        ]
                    });
                }]
            }
        })


        //Dynamic Forms
        .state('app.dynamicForms', {
            url: "/dynamicForms/:urlId",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            },
            templateUrl: "modules/dynamicforms/list.html",
            data: {
                pageTitle: ''
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "listCtrl",
            resolve: {
                "check": function ($location, $stateParams) {
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/dynamicforms/list.js'
                        ]
                    });
                }]
            }
        })

        .state('app.dynamicFormsOperation', {
            url: "/dynamicForms/:urlId/:urlOperation",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlId = $filter('removeSpace')($stateParams['input']['urlLink']['Name']).toLowerCase();
                $stateParams.urlOperation = $stateParams.input.Operation.toLowerCase();
            },
            templateUrl: "modules/dynamicforms/operation/operation.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "operation",
            resolve: {
                "check": function ($location, $stateParams) {
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'lib/spectrum/spectrum.css',
                            'lib/spectrum/spectrum.js',
                            'modules/dynamicforms/operation/operation.js'
                        ]
                    });
                }]
            }
        })

        .state('app.webformPlugin', {
            url: "/addons/:urlIdForAddon",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlIdForAddon = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            },
            templateUrl: "modules/webformaddons/webformPlugin.html",
            data: {
                pageTitle: ''
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "bankDataAddonCtrl",
            resolve: {
                "check": function ($location, $stateParams) {
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/webformaddons/bankDataAddonCtrl.js'
                        ]
                    });
                }]
            }
        })

        .state('app.webformPlugins', {
            url: "/addons/:urlIdForAddons",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlIdForAddons = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            },
            templateUrl: "modules/webformaddons/bankdataview/bankdataview.html",

            // templateUrl: "modules/webformaddons/webformPlugin.html",
            data: {
                pageTitle: ''
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "bankDataAddonViewCtrl",
            resolve: {
                "check": function ($location, $stateParams) {
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',

                        files: [
                            'modules/webformaddons/bankdataview/bankdataviewCtrl.js'
                        ]
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('app.view', {
            url: "/:urlId/view",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            },
            templateUrl: "modules/bankdata/bankdatafunctions/viewBankData.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "viewBankData",
            resolve: {
                "check": function ($location, $stateParams) {

                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/bankdata/bankdatafunctions/viewBankData.js'
                        ]
                    });
                }]
            }
        })

        //Addon view
        .state('app.addonview', {
            url: "/addons/:urlIdForAddon/view",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlIdForAddon = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
            },
            templateUrl: "modules/webformaddons/bankdatafunctions/viewBankData.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "webviewBankData",
            resolve: {
                "check": function ($location, $stateParams) {
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/webformaddons/bankdatafunctions/viewBankData.js'
                        ]
                    });
                }]
            }
        })

        //Addon Operation
        .state('app.addonoperation', {
            url: "/addons/:urlIdForAddon/:urlOperationForAddon",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlIdForAddon = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
                $stateParams.urlOperationForAddon = $stateParams.input.Operation.toLowerCase();
            },
            templateUrl: "modules/webformaddons/bankdatafunctions/bankDataFunctions.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "webbankDataFunctions",
            resolve: {
                "check": function ($location, $stateParams) {

                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'modules/webformaddons/bankdatafunctions/bankDataFunctions.js'
                        ]
                    });
                }]
            }
        })
        .state('app.newmodules', {
            url: '/plugins/:newUrl',
            templateUrl: function (aa) {
                if (aa.input.tempUrl != null) {
                    return aa.input.tempUrl + '/' + aa.input.url + '.html'
                }
            },
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.newUrl = $stateParams.input.url;
            },
            data: {
                pageTitle: 'Dynamic Modules'
            },
            controllerProvider: function ($stateParams) {
                return $stateParams.input.contrl
            },
            params: {
                input: {
                    dunamic: true
                }
            },
            resolve: {
                "check": function ($location, $stateParams) {
                    if ($stateParams.input.tempUrl == null) {

                        $location.path('app/dashboard')
                    }
                },
                otherFeature: function ($ocLazyLoad, $stateParams) {
                    if ($stateParams.input.tempUrl != null) {
                        return $ocLazyLoad.load({
                            name: "VolpayApp",
                            files: [$stateParams.input.tempUrl + '/' + $stateParams.input.contrl + '.js']
                        })
                    }

                }
            }
        })
        .state('app.operation', {
            url: "/:urlId/:urlOperation",
            onEnter: function ($state, $stateParams, $cookies, $filter) {
                $stateParams.urlId = $filter('removeSpace')($stateParams.input.gotoPage.Name).toLowerCase();
                $stateParams.urlOperation = $stateParams.input.Operation.toLowerCase();
            },
            templateUrl: "modules/bankdata/bankdatafunctions/bankDataFunctions.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            params: {
                input: {
                    dynamic: true
                }
            },
            controller: "bankDataFunctions",
            resolve: {
                "check": function ($location, $stateParams) {
                    if (($stateParams['input'] && $stateParams['input']['dynamic']) || $stateParams['input'] == undefined) {
                        $location.path('/app')
                    }
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        files: [
                            'lib/spectrum/spectrum.css',
                            'lib/spectrum/spectrum.js',
                            'modules/bankdata/bankdatafunctions/bankDataFunctions.js'
                        ]
                    });
                }]
            }
        })
        .state('app.bulkload', {
            url: "/bulkload",
            templateUrl: "modules/bulkload/bulkload.html",
            data: {
                pageTitle: 'AngularJS Bulk Load'
            },
            controller: "bulkloadCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'VolpayApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'modules/bulkload/bulkloadCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('app.externalLink', {
            url: "/external",
            templateUrl: "modules/external/external.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "externalCtrl",
            params: {
                url: null,
            },
            resolve: {
                "check": function ($location, $stateParams) {
                    if ($stateParams.url == null) {
                        $location.path('app/dashboard')
                    }
                },
                otherFeature: function ($ocLazyLoad, $stateParams) {
                    return $ocLazyLoad.load({
                        name: "VolpayApp",
                        files: ["modules/external/externalCtrl.js"]
                    })
                }
            }
        })
}]);
