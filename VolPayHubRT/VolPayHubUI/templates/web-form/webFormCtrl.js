angular.module('VolpayApp').controller('webFormCtrl', ['http', '$scope', function(http, $scope) {
    $(document).ready(function() {

        var get_default_field_details = function(name, metainfo) {
            for (var field in metainfo['field']) {
                if (metainfo['field'][field]['name'] === name) {
                    return metainfo['field'][field];
                } else if (metainfo['field'][field]['type'] === 'Section') {
                    return get_default_field_details(name, metainfo['field'][field])
                }
            }
        }

        var find_value = function(name) {
            for (var data in $scope.outputdata) {
                if (data === name) {
                    return $scope.outputdata[data];
                } else if ($scope.outputdata[data] === 'object') {
                    return find_value(name);
                }
            }
        }

        var remove_empty_option = function(_this) {
            $(_this).find('option').each(function() {
                if ($(this).attr('value') == '' || $(this).text() === 'select' || $(this).text() === '') {
                    // $(this).remove();
                }

                if ($(this).text() === 'Select') {
                    $(this).remove();
                }
            });
            $(_this).val('').trigger('change.select2');
        }
        
        var update_URL = function(argu, field) {
            var _argu = angular.copy(argu);
            if (_argu.indexOf('/') !== -1) {
                var url = _argu.split('/');
                for (var links in url) {
                    if ((url[links].indexOf('{') !== -1) && (url[links].indexOf('}') !== -1)) {
                        var name = url[links].substring((Number(url[links].indexOf('{')) + 1), Number(url[links].indexOf('}')));
                        if (name && name.indexOf('[') !== -1) {
                            var parent_name = name.split('[')[0].trim();
                            $('[name1=' + parent_name + ']').on('change', function() {
                                var val = $(this).data('select2') ? $(this).select2('data')[0]['data'] : $(this).val();
                                if (val) {

                                } else {
                                    $('[name1=' + field['name'] + ']').val('').trigger('change');
                                }
                            })
                            var child_name = name.split('[')[1];
                            child_name = child_name.replace(']', '').trim();
                            var parent_value = $('[name1=' + parent_name + ']').data('select2') ? $('[name1=' + parent_name + ']').select2('data') : $('[name1=' + parent_name + ']').val();
                            if (parent_value && parent_value[0]['data'] && child_name in parent_value[0]['data']) {
                                _argu = _argu.replace(url[links], parent_value[0]['data'][child_name]);
                            }
                        } else {
                            var value_ = find_value(name.trim());
                            if (value_) {
                                _argu = _argu.replace(url[links], value_);
                            }
                        }
                    }
                }
            }
            return _argu
        }

        var check_multiple = function(details, select2_config) {
            if (select2_config == undefined) {
                select2_config = {}
            }
            details['renderer'][details['renderer']['type']]['choiceOptions'].forEach(function(options) {
                if (options['displayvalue'].toLowerCase() === 'multiselect') {
                    if (options['actualvalue']) {
                        remove_empty_option(select_box);
                        select2_config['multiple'] = true;
                    }
                } else if (options['displayvalue'].toLowerCase() === 'createtag') {
                    if (options['actualvalue']) {
                        var createTag = {
                            tags: true,
                            createTag: function(tag) {
                                return {
                                    id: tag.term,
                                    text: tag.term,
                                    tag: true
                                };
                            }
                        }
                        // select2_config = Object.assign(select2_config, createTag);
                        select2_config = $.extend(select2_config, createTag);
                        
                    }
                } else {
                    var option = new Option(options['displayvalue'], options['actualvalue']);
                    $(select_box).append(option).trigger('change.select2');
                }
            })
            return select2_config;
        }

        var set_value = function(_this, value) {
            $(_this).val(value).trigger('change.select2');
            if ($scope.outputdata && !value && ($(_this).attr('name1') in $scope.outputdata)) {
                $scope.$apply(function() {
                    delete $scope.outputdata[$(_this).attr('name1')];
                })
            }
        }

        var set_cstm_attr = function(value, cstmProp, flag) {

            if (flag == undefined) {
                flag = false;
            }
            value = value ? value.trim() : value;
            if (value in cstmProp) {
                Object.keys(cstmProp[value]).forEach(function(elem) {
                    (function(elem, prop) {
                        $('[name1=' + elem + ']').each(function(i) {
                            setDefaultAttr(this, prop, flag);
                        })

                        if ($('[name1=' + elem + ']').length > 1) {
                            $('[name1=' + elem + ']').each(function(i) {
                                if ($scope.pId > -1 && $scope.pId === i) {
                                    setDefaultAttr(this, get_default_field_details(elem, $scope.webformdata), flag);
                                }
                            })
                        } else if ($('[name1=' + elem + ']').length) {
                            setDefaultAttr($('[name1=' + elem + ']'), get_default_field_details(elem, $scope.webformdata), flag);
                        }

                        /*var elemIndex = -1;
                        if($('[name='+elem+']').closest('.anitem').length){
                        	elemIndex = Number($('[name='+elem+']').closest('.anitem').attr('id').split('_')[1]);
                        }
                        if(index > -1 && elemIndex > -1){
                        	setDefaultAttr($('[name='+elem+']')[index], cstmProp[value][elem], flag);
                        } else {
                        	$('[name='+elem+']').each(function(){
                        		setDefaultAttr(this, cstmProp[value][elem], flag);
                        	})
                        }*/
                    }(elem, cstmProp[value][elem]));
                })
            } else {
                for (prop in cstmProp) {
                    Object.keys(cstmProp[prop]).forEach(function(elem) {
                        (function(elem) {
                            $('[name1=' + elem + ']').each(function(i) {
                                    /*if($scope.pId > -1 && $scope.pId === i){
                                        setDefaultAttr(this, get_default_field_details(elem, $scope.webformdata), flag);
                                    }*/
                                    setDefaultAttr(this, get_default_field_details(elem, $scope.webformdata), flag);
                                })
                                /*var elemIndex = -1;
                                if($('[name='+elem+']').closest('.anitem').length){
                                    elemIndex = Number($('[name='+elem+']').closest('.anitem').attr('id').split('_')[1]);
                                }
                                if(index > -1 && elemIndex > -1){
                                    setDefaultAttr($('[name='+elem+']')[index], $scope.get_field_details(elem), flag);
                                } else {
                                    $('[name='+elem+']').each(function(){
                                        setDefaultAttr(this, $scope.get_field_details(elem), flag);
                                    })
                                }*/
                        }(elem));
                    })
                }
            }
        }

        var setDefaultAttr = function(_is, argu, flag) {
            var _is = _is;

            for (var opt in argu) {
                if (opt.toLowerCase() === 'enabled') {

                } else if (opt.toLowerCase() === 'visible') {
                    if (argu[opt]) {
                        $(_is).parent().attr('ng-hide', false);
                        $(_is).parent().prev().attr('ng-hide', false);
                        $(_is).parent().parent().removeClass('ng-hide');
                    } else {
                        $(_is).parent().attr('ng-hide', false);
                        $(_is).parent().prev().attr('ng-hide', false);

                    }
                    if (flag) {
                        set_value(_is, '');
                    }
                } else if (opt.toLowerCase() === 'notnull' || opt.toLowerCase() === 'mandatory') {
                    if (argu[opt]) {

                    } else {
                        $(_is).parent().prev().find('span').attr('ng-hide', false).removeClass('ng-hide')
                    }
                    $(_is).attr('required', !argu[opt])
                } else if (opt.toLowerCase() === 'createtag') {
                    /*var updatesDetails;
                    if(argu[opt] === false){
                    	updatesDetails = $(_is).attr('detailsoffield') ? JSON.parse($(_is).attr('detailsoffield')) : {};
                    	if(updatesDetails['Multiple']){
                    		for(var mul in updatesDetails['Multiple']){
                    			if(updatesDetails['Multiple'][mul]['displayvalue'].toLowerCase() === 'createtag'){
                    				updatesDetails['Multiple'][mul]['actualvalue'] = argu[opt];
                    			}
                    		}
                    	}
                    } else if(argu[opt]){
                    	updatesDetails = $(_is).attr('detailsoffield') ? JSON.parse($(_is).attr('detailsoffield')) : {};
                    }
                    select_fn(updatesDetails, _is);*/
                }
            }
        }



        var getFieldNameInExp = function(argu) {
            var query = argu;
            var indices = [];
            for (var i = 0; i < query.length; i++) {
                if (query[i].indexOf('{') !== -1) {
                    var index = {}
                    index.firstIndex = i + 1;
                    for (var j = i + 1; j < query.length; j++) {
                        if (query[j] === "}") {
                            index.lastIndex = j;
                            break;
                        }
                    }
                    indices.push(index);
                }
            }
            var reqId;
            for (var index in indices) {
                reqId = query.substring(indices[index].firstIndex, indices[index].lastIndex);
            }
            return reqId
        }

        var get_cstm_attr = function(value, attr, flag) {
            for (var at in attr) {
                (function(argu) {
                    if (argu['value']) {
                        var value = $.isArray(argu['value']) ? argu['value'].toString() : argu['value'];
                        var paramData = { method: 'POST', url: '/rest/v2/' + argu['attr'], data: value, query: {} }
                        http.crudRequest(paramData).then(function(response) {
                            (function(data) {
                                $scope.$watch(function() {
                                    var name = argu['at'].split('.')[argu['at'].split('.').length - 1];
                                    return angular.element('[name1=' + name + ']').is(':visible')
                                }, function(newValue, oldValue) {
                                    var fieldID = findUniqueElement(argu['at']);
                                    var elem = fieldID;
                                    if (fieldID.length) {
                                        $(fieldID).each(function(i) {
                                            if ($scope.pId === i) {
                                                elem = this;
                                                newValue = true;
                                            }
                                        })
                                    }

                                    if (newValue) {
                                        setDefaultAttr(elem, data, flag);
                                    }
                                });
                            }(response['data']))
                        })
                    }
                // }({ value, flag, 'attr': attr[at], at }))
            }(value, flag, attr[at], at))
            }
        }


        var check_ajax = function(details, select2_config) {
            if (select2_config == undefined) {
                select2_config = {};
            }
            if ('customattributes' in details['renderer'][details['renderer']['type']]) {
                var cstmAttr = {},
                    http = {
                        method: 'GET'
                    };
                details['renderer'][details['renderer']['type']]['customattributes']['property'].forEach(function(property) {
                    if (property['name'].toLowerCase().indexOf('method') !== -1) {
                        http['method'] = property['value'].toUpperCase();
                    } else if (property['name'].toLowerCase().indexOf('query') !== -1) {
                        http['query'] = JSON.parse(property['value']);
                        http['count'] = (http['query'] && (http['query']['count'] > 10)) ? http['query']['count'] : 500;
                    } else if (property['name'].toLowerCase().indexOf('optionskey') !== -1) {
                        select2_config['data'] = JSON.parse(property['value']);
                        http['optionskey'] = JSON.parse(property['value']);
                    } else if (property['name'].toLowerCase().indexOf('rest') !== -1) {
                        http['count'] = http['count'] || 500;
                        http['backUpUrl'] = angular.copy(property['value']);
                        http['url'] = update_URL(angular.copy(property['value']), details);
                    } else if (property['name'].toLowerCase().indexOf('value') !== -1) {
                        cstmAttr[property['name'].split('|')[1]] = cstmAttr[property['name'].split('|')[1]] ? $.extend(cstmAttr[property['name'].split('|')[1]], JSON.parse(property['value'])) : JSON.parse(property['value']);
                    } else if (property['name'].toLowerCase() === 'customattribute') {
                        $(select_box).on('change', function() {
                            get_cstm_attr($(this).val(), JSON.parse(property['value']), true)
                        })
                        get_cstm_attr(obtained_value, JSON.parse(property['value']));
                    } else {

                    }
                })
                if ('url' in http) {
                    select2_config['ajax'] = {
                        url: function(params) {
                            http['url'] = update_URL(angular.copy(http['backUpUrl']), details);
                            return BASEURL + "/rest/v2/" + http['url']
                        },
                        type: http['method'],
                        headers: {
                            "Authorization": "SessionToken:" + sessionStorage.SessionToken,
                            "source-indicator": configData.SourceIndicator,
                            "Content-Type": "application/json"
                        },
                        dataType: 'json',
                        delay: 250,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Cookie', sanitize(document.cookie)), xhr.withCredentials = true
                        },
                        crossDomain: true,
                        data: function(params) {
                            var query = {};
                            if (http['query']) {
                                query = JSON.stringify(http['query']);
                                if (query && (query.indexOf('{') !== -1)) {
                                    var fieldName = getFieldNameInExp(query);
                                    var elem = findUniqueElement(fieldName);
                                    $(elem).each(function(i) {
                                        query = '';
                                        if ($scope.pId === i) {
                                            query = $.isArray($(this).val()) ? $(this).val().toString() : $(this).val();
                                        }
                                    })
                                }
                            }
                            return query;
                           /* var query = {};
                            var backuphttp = angular.copy(http);
                            var query = {
                                start: params.page * backuphttp['count'] ? params.page * backuphttp['count'] : 0,
                                count: backuphttp['count']
                            };

                            if (params.term) {
                                if (backuphttp['query']) {
                                    // query = Object.assign(backuphttp['query'], query);
                                    query = $.extend(backuphttp['query'], query);
                                    
                                    query['filters']['groupLvl1'][0]['groupLvl2'][0]['groupLvl3'][0]['clauses'].push({
                                        columnName: (details['name'].toLowerCase().indexOf('accountno') !== -1) ? 'AccountNo' : details['name'],
                                        operator: 'LIKE',
                                        value: params.term
                                    })
                                    query = JSON.stringify(query);
                                    query = (query.indexOf('${') !== -1) ? update_query(query) : query;
                                } else {
                                    // query = Object.assign(query, { search: params.term });
                                    query = $.extend(query, { search: params.term });
                                    
                                    if (backuphttp['url'] && backuphttp['url'].indexOf('start') != -1 && backuphttp['url'].indexOf('count') != -1) {
                                        query = JSON.stringify({})
                                    }
                                }
                            } else {
                                if (backuphttp['query']) {
                                    // query = Object.assign(backuphttp['query'], query);
                                    query = $.extend(backuphttp['query'], query);
                                    query = JSON.stringify(backuphttp['query']);
                                    query = (query.indexOf('${') !== -1) ? update_query(query) : query;
                                }
                            }
                            return query;*/
                        },
                        processResults: function(data, params) {
                            params.page = params.page ? params.page : 0;
                            if (http['optionskey']) {

                            } else {
                                http['optionskey'] = { id: "actualvalue", text: "displayvalue" };
                            }
                            return {
                                results: $.map(data, function(item) {
                                    return {
                                        text: item[http['optionskey']['text']],
                                        id: item[http['optionskey']['id']],
                                        data: item
                                    }
                                }),
                                pagination: {
                                    more: data.length >= http['count']
                                }
                            };
                        },
                        cache: true
                    }
                }
                if (cstmAttr && Object.keys(cstmAttr).length) {
                    $(select_box).on('change', function() {
                        set_cstm_attr($(this).val(), cstmAttr, true);
                    })
                    set_cstm_attr(obtained_value, cstmAttr);
                }
            }
            return http;
        }

        // var crudReqInForloop = function(arg, callback) {
        //     //	{method, url, data, query}
        //     url = '/rest/v2/' + url
        //     http.crudRequest(arg).then(function(response) {
        //         $(arg['argu']).find('option').remove();
        //         response.data.forEach(function(item) {
        //             var option = new Option(item['displayvalue'], item['actualvalue']);
        //             $(arg['argu']).append(option).trigger('change.select2');
        //         })
        //         if ($scope.outputdata[$(arg['argu']).attr('name')] && $scope.outputdata[$(argu).attr('name')].indexOf(',') !== -1) {
        //             var value = $scope.outputdata[$(arg['argu']).attr('name')].split(',');
        //             $(arg['argu']).val(value).trigger('change.select2');
        //         } else {
        //             $(arg['argu']).val($scope.outputdata[$(arg['argu']).attr('name')]).trigger('change.select2');
        //         }
        //     })
        // }

        var crudReqInForloop = function({ method, url, data, query, argu }, callback) {
        //var crudReqInForloop = function(method, url, data, query, argu, callback) {           
            url = '/rest/v2/' + url
            http.crudRequest({ method, url, data, query }).then(function(response) {
            //http.crudRequest( method, url, data, query ).then(function(response) {
                var mySelect = $(argu);
                var len = mySelect[0].length;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        mySelect[0].remove(i);
                    }
                }
                // $(argu).find('option').remove();
                response.data.forEach(function(item) {
                    var option = new Option(item['displayvalue'], item['actualvalue'], false, false);
                    $(argu).append(option).trigger('change.select2');
                })
                if ($scope.outputdata[$(argu).attr('name1')] && $scope.outputdata[$(argu).attr('name1')].indexOf(',') !== -1) {
                    var value = $scope.outputdata[$(argu).attr('name1')].split(',');
                    $(argu).val(value).trigger('change.select2');
                } else {
                    $(argu).val($scope.outputdata[$(argu).attr('name1')]).trigger('change.select2');
                }
            })
        }

        var obtained_value, select_box = "";

        var findUniqueElement = function(uniqname) {
            var elem = $('#' + uniqname.split('.')[0])
            for (var i in uniqname.split('.')) {
                if (i !== '0') {
                    if (Number(i) === uniqname.split('.').length - 1) {
                        elem = $(elem).find('[name1=' + uniqname.split('.')[i] + ']');
                    } else {
                        elem = $(elem).find('#' + uniqname.split('.')[i]);
                    }
                }
            }
            return elem;
        }


        var select_fn = function(details) {

            if (details['uniqname']) {
                select_box = findUniqueElement(details['uniqname']);
            } else {
                select_box = $(sanitize('[name1=' + details['name'] + ']'));
            }
            $(select_box).each(function(i) {
                if ($scope.pId > -1 && $scope.pId === i) {
                    select_box = this;
                }
            })
            obtained_value = find_value(details['name']);

            $scope.select2_config = {
                placeholder: 'Select',
                minimumInputLength: 0,
                allowClear: true,
                tags: false
            };
            var multiple = check_multiple(details, $scope.select2_config);
            var http = check_ajax(details, $scope.select2_config);
            if (http && http['url']) {
                var _http = angular.copy(http);
                _http['argu'] = select_box;
                if (obtained_value) {
                    if (_http['method'].toLowerCase() === 'get') {
                        _http['query'] = $.isArray(obtained_value) ? obtained_value.toString() : obtained_value;
                    } else {
                        _http['data'] = $.isArray(obtained_value) ? obtained_value.toString() : obtained_value;
                        delete _http['query'];
                    }
                    crudReqInForloop(_http);
                }
            } else {
                $(select_box).val(obtained_value).trigger('change.select2');
            }
            $(select_box).select2($scope.select2_config).trigger('change.select2');
        }


        /*var set_on_change = function(from, to, value){
        	$('[name='+from+']').on('change', function(){
        		var obtained_value = $(this).val();
        		if(value){

        		}
        		$('[name='+to+']').val(obtained_value);
        	})
        }

        var convert_url = function(argu){
        	var query = angular.copy(argu);
        	var _kValue = angular.copy(argu);
        	var indices = [];
        	for(var i=0; i < query.length;i++) {												
        		if(query[i].indexOf('$') !== -1){
        			var index = {}
        			if(query[i+1] === "{"){
        				index.firstIndex = i+2;
        				for(var j=i+1; j<query.length; j++){
        					if(query[j] === "}"){
        						index.lastIndex = j;
        						break;
        					}
        				}
        			}
        			indices.push(index);
        		}
        	}
        	for(var index in indices){
        		var reqId = query.substring(indices[index].firstIndex, indices[index].lastIndex);
        		var obtained_value = set_on_change(reqId)
        		if(obtained_value){
        			_kValue = _kValue.replace('${'+reqId+'}', obtained_value);
        		}
        	}
        	return _kValue
        }*/

        var set_default_value = function(field) {
            var defaultvalue = angular.copy(field['defaultvalue']);
            if (field['defaultvalue'] && field['defaultvalue'].indexOf('${') !== -1) {
                /*if(field['defaultvalue'].indexOf('"url"') !== -1){
                	defaultvalue = defaultvalue.substring(1);
                	defaultvalue = JSON.parse(defaultvalue);
                	if(defaultvalue['query']){
                
                		if(defaultvalue['query']['filters'] && JSON.stringify(defaultvalue['query']['filters']).indexOf('${') !== -1 || defaultvalue['query']['sorts'] && JSON.stringify(defaultvalue['query']['sorts']).indexOf('${') !== -1){
                			convert_url(JSON.stringify(defaultvalue['query']));
                		}
                	}
                }else{
                	defaultvalue = defaultvalue.substring(2, defaultvalue.length-1);
                	if(defaultvalue.indexOf('||') !== -1){
                	
                	}else{
                		if(defaultvalue.indexOf('[') !== -1){
                			var from_field = defaultvalue.split('[')[0].trim();
                			var value = defaultvalue.split('[')[1].replace(']','').trim();
                			set_on_change(from_field, field['name'], value);
                		}
                	}
                }*/
            } else {

                $('[name1=' + field['name'] + ']').val(defaultvalue);
                $scope.outputdata[field['name']] = defaultvalue;
            }
        }

        var initFn = function(argu) {
            if (argu['field']) {
                argu['field'].forEach(function(field) {

                    if ((field.type == 'Integer') && (field['renderer']['type'] === 'Choice')) {
                        if ($scope.outputdata != undefined) {

                            if (typeof($scope.outputdata[field['name']]) === 'number') {
                                $scope.outputdata[field['name']] = JSON.stringify($scope.outputdata[field['name']])
                            }
                        }
                    }
                    if (field['type'].toLowerCase() === 'string' && field['renderer']['type'].toLowerCase() === 'choice') {
                        select_fn(field);
                    } else {
                        if (Object.keys(field).length && Object.keys(field).indexOf('defaultvalue') !== -1) {
                            set_default_value(field);
                        }
                    }
                })
            }
        }

        function corrector(vv) {

            if ((vv) && (vv['type'] == 'Section')) {
                for (i = 0; i < vv['field'].length; i++) {



                    if (vv['field'][i]['renderer'] != undefined) {

                        if ((vv['field'][i]['renderer']['Choice']) && (vv['field'][i]['renderer']['Choice']['customattributes']) && (vv['field'][i]['renderer']['Choice']['customattributes']['property'].length) > 1) {

                            val1111 = '';
                            for (kk in vv['field'][i]['renderer']['Choice']['customattributes']['property']) {


                                if (vv['field'][i]['renderer']['Choice']['customattributes']['property'][kk]['name'] == 'Choice') {
                                    val1111 = vv['field'][i]['renderer']['Choice']['customattributes']['property'][kk]['value']
                                }
                                if (vv['field'][i]['renderer']['Choice']['customattributes']['property'][kk]['name'] == 'REST') {

                                    if (vv['field'][i]['renderer']['Choice']['customattributes']['property'][kk]['value'].indexOf('{') != -1) {
                                        vv['field'][i]['renderer']['Choice']['customattributes']['property'][kk]['value'] = vv['field'][i]['renderer']['Choice']['customattributes']['property'][kk]['value'].split('{')[0] + '{' + val1111 + '}';
                                    }
                                }

                            }


                        }
                    }
                }
            }

            return vv;
        }

        if ($scope.webformdata != undefined) {
            corrector($scope.webformdata)
            initFn(angular.copy($scope.webformdata))
        }

    });

    /* function isEmptyObj(obj) {
        for (var val in obj) {
            if (val === '$$hashKey') {
                delete obj.$$hashKey;
            } else if (Array.isArray(obj[val])) {
                isEmptyObj(obj[val]);
            } else if (obj[val] === 'obj') {
                isEmptyObj(obj[val]);
            } else if (obj[val]) {
                return true;
            } else {
                return false
            }
        }
    } */


    function isEmptyObj(obj) {
        delete obj.$$hashKey;
        for (var val in obj) {
            if ($.isPlainObject(obj[val])) {
                var isEmpty = isEmptyObj(obj[val])
                if ($.isEmptyObject(isEmpty)) {
                    delete obj[val]
                }
            } else if (Array.isArray(obj[val]) && !obj[val].length) {
                delete obj[val]
            } else if (obj[val] === "" || obj[val] === undefined || obj[val] === null) {
                delete obj[val]
            }
        }
        return obj;
    }

    $scope.showMinoccures = {}
    $scope.addSection = function(argu, output) {
        $scope.showMinoccures[argu.name] = true;
        if (output && output[argu['name']]) {
            var isEmpty = $.isArray(output[argu['name']]) ? isEmptyObj(output[argu.name][output[argu.name].length - 1]) : isEmptyObj(output[argu.name]);
            if (!$.isEmptyObject(isEmpty) && (argu['maxoccurs'] == -1 || output[argu.name].length < argu.maxoccurs)) {

                output[argu.name].push({});

            }
        } else {
            if (argu['maxoccurs'] === 1) {
                output[argu.name] = {};
            } else {
                output[argu.name] = [{}];
            }
        }
        if (output[argu.name].length < argu['minoccurs']) {
            $scope.addSection(argu, output);
        }
    }

    $scope.removeSection = function(index, data, input) {
        if (data[input['name']].length !== input['minoccurs'] && data[input['name']].length > 1) {
            data[input['name']].splice(index, 1);

        } else if (data[input['name']].length !== input['minoccurs']) {
            delete data[input['name']];
            $scope.showMinoccures[input['name']] = false;
        }
    }

    $scope.setVal = function(arg, model) {

        arg['val'] = arg['val'].toString();

        var id = arg['fieldName'] + '_' + (arg['pId'] >= -1 ? arg['pId'] + '_' + arg['index'] : arg['index']);

        model = model.toString();

        //setTimeout(function(){
        $(sanitize('#' + id)).val(arg['val']);
        //},100)
    }

}]);

VolpayApp.directive('jsonText', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            function into(input) {
                return JSON.parse(input);
            }

            function out(data) {
                return JSON.stringify(data);
            }
            ngModel.$parsers.push(into);
            ngModel.$formatters.push(out);

        }
    };
});