angular.module('VolpayApp').controller('initiateLineTransferCtrl', function($http, $scope) {

    $scope.reset_data = function() {
        $scope.data = {
            PaymentDetails: {
                PSA: 'GSBI_LINETRANSFER_LineMovement_API'
            },
            SourceAccount: {},
            DestinationAccount: {}
        };
        $('select').each(function() {
            $(this).val('').trigger('change.select2');
        });
        $('input').each(function() {
            if ($(this).attr('name') !== 'PSA') {
                $(this).val('');
            }
        });
    }

    $scope.onSubmit = function(argu) {
        var params = {
            method: 'POST',
            url: BASEURL + "/rest/v2/payments/linemovement",
            data: {
                PSA: argu['PaymentDetails']['PSA'],
                Amount: argu['PaymentDetails']['Amount'],
                Currency: argu['PaymentDetails']['Currency'],
                ValueDate: argu['PaymentDetails']['ValueDate'],
                SourceAccount: argu['SourceAccount']['SourceAccountNo'],
                DestinationAccount: argu['DestinationAccount']['DestinationAccountNo']
            },
            headers: {
                "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                "source-indicator": "API",
                "Content-Type": "application/json"
            }
        }
        crudRequest(params).then(success, failure)
    }

    var depended_fields = {
        Party: [{
                name: 'BIC',
                value: 'PartyExternalIdentifier'
            },
            {
                name: 'PartyName',
                value: 'PartyName'
            },
            {
                name: 'AddressLine1',
                value: 'AddressLine1'
            },
            {
                name: 'AddressLine2',
                value: 'AddressLine2'
            },
            {
                name: 'City',
                value: 'City'
            },
            {
                name: 'State',
                value: 'State'
            },
            {
                name: 'PostCode',
                value: 'PostCode'
            },
            {
                name: 'Country',
                value: 'Country'
            },
        ],
        AccountNumber: [{
            name: 'AccountCurrency',
            value: 'DefaultCurrency|AccountCurrency'
        }]
    }

    var set_value = function(field, value, index) {
        field.forEach(function(fields) {
            if (fields['value'].indexOf('|')) {
                var values = fields['value'].split('|');
                fields['value'] = values[0] || values[1];
            }
            var _value = value[fields['value']] ? value[fields['value']] : '';
            $('[name1=' + fields['name'] + ']').each(function(i) {
                if (index === i) {
                    $(this).val(_value);
                }
            })
        })
    }
    var update_depended_value = function(value, index) {
        Object.keys(depended_fields).forEach(function(field) {
            set_value(depended_fields[field], value[field], index);
        })
    }

    var on_account_number_change = function(index) {
        $(this).on('change', function() {
            var value = $(this).select2('data')[0];
            value = value['data'] ? value['data'] : '';
            if (value['PartyCode']) {
                var params = {
                    method: 'POST',
                    url: BASEURL + "/rest/v2/parties/readall",
                    data: { "start": 0, "count": 1, "sorts": [], "filters": { "logicalOperator": "AND", "groupLvl1": [{ "logicalOperator": "AND", "groupLvl2": [{ "logicalOperator": "AND", "groupLvl3": [{ "logicalOperator": "OR", "clauses": [{ "columnName": "PartyCode", "operator": "=", "value": value['PartyCode'] }] }] }] }] } }
                }
                crudRequest(params).then(function(response) {
                    if (response['data'] && response['data'].length) {
                        update_depended_value({ 'AccountNumber': value, 'Party': response['data'][0] }, index);
                    }
                })
            } else {
                update_depended_value({ 'AccountNumber': {}, 'Party': {} }, index);
            }
        })
    }

    var initfn = function() {
        $(document).ready(function() {
            $('[name1=SourceAccountNo], [name1=DestinationAccountNo]').each(on_account_number_change);
        })
    }

    var hide_alert = function() {
        $('.autoAdjustAlert').hide();
    }

    var success = function(response) {
        $scope.reset_data();
        $scope.alerts = [{
            type: 'success',
            msg: response.data.responseMessage
        }];
        setTimeout(hide_alert, 3000);
        return response;
    }

    var failure = function(error) {
        console.error(error);
        $scope.alerts = [{
            type: 'danger',
            msg: error.data.error.message
        }]
        setTimeout(hide_alert, 3000);
        return error
    }

    var crudRequest = function({ method, url, data, params, headers }) {
        return $http({
            method,
            url,
            data,
            params,
            headers
        })
    }

    $scope.metaInfo = {};
    $scope.data = {};
    (function() {
        if ($.isEmptyObject($scope.metaInfo)) {
            var params = {
                method: 'GET',
                url: 'modules/initiatelinetransfer/metainfo.json'
            }
            crudRequest(params).then(function(response) {
                $scope.metaInfo = beautifyObj(response.data);
                setTimeout(initfn, 100);
            }, function(error) {

            })
        }
    }())
});