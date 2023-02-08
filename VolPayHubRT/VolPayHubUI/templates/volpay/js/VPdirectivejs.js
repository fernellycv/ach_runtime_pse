angular.module('VolpayApp').directive('webForm', ['$compile', '$http', function ($compile, $http) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            webformdata: '=input',
            outputdata: '=output',
            configdata: '=config',
            pId: '=ids'
        },
        controller: 'webFormCtrl',
        templateUrl: 'templates/web-form/webForm.html',
        compile: function (tElement, tAttr, transclude) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function (scope, iElement, iAttr) {
                if (!compiledContents) {
                    compiledContents = $compile(contents, transclude);
                }
                compiledContents(scope, function (clone, scope) {
                    iElement.append(clone);
                });
            };
        }
    };
}]);

var sectionRemovekey = ['Header', 'Trailer', 'Data', 'webformuiformat', 'fields', 'fieldGroup1', 'webformfieldgroup', 'webformfieldgroup_2', 'webformsectiongroup'];

var $metaInfoStorage = {};

var _name = ''

function beautifyObj(obj) {
    for (let key in obj) {
        if ($.inArray(key, sectionRemovekey) !== -1) {
            $.extend(obj, obj[key]);
            delete obj[key];
            if (typeof (obj) === 'object') {
                beautifyObj(obj)
            }
        }
        if ($.isArray(obj[key])) {
            for (let field in obj[key]) {
                //obj[key][field] = beautifyObj(obj[key][field]); before Interfacebulking mergeAttributes

                if (obj[key][field]['type'] === 'Section') {
                    _name = _name ? _name + '.' + obj[key][field]['name'] : obj[key][field]['name'];
                    obj[key][field] = beautifyObj(obj[key][field]);
                    if (_name.split('.').indexOf(obj[key][field]['name']) !== -1) {
                        if (_name.split('.').indexOf(obj[key][field]['name']) === 0) {
                            _name = ''
                        } else {
                            var arr = _name.split('.');
                            arr.splice(arr.indexOf(obj[key][field]['name']), (arr.length - arr.indexOf(obj[key][field]['name'])));
                            _name = arr.join('.')
                        }
                    }
                } else {
                    obj[key][field] = beautifyObj(obj[key][field]);
                    if (_name) {
                        obj[key][field]['uniqname'] = _name + '.' + obj[key][field]['name'];
                    }
                }

            }
        }
    }
    return obj
}

function checkWebformFormat(obj) {
    var flag = false;
    obj['field'].forEach(function (item, index, array) {
        if (item['type'] === 'FieldGroup') {
            $.extend(item, { type: 'Section', name: item['sectionheader'].replace(/[\s]/g, ''), field: [] });
            flag = index;
        } else if (item['type'] === 'FieldGroupEnd') {
            flag = false;
            array[index] = '';
        } else if (flag !== false && flag !== index) {
            array[flag]['field'].push(item)
            array[index] = '';
        }
    })
    obj['field'] = obj['field'].filter(function (item, index) {
        if (item) {
            return obj['field']
        }
    })
    return obj
}

angular.module('VolpayApp').directive('cstmTable', ['$compile', '$http', function ($compile, $http) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            webformdata: '=input',
            outputdata: '=output'
        },
        controller: 'cstmTableCtrl',
        templateUrl: 'templates/cstm-table/cstmTable.html',
        compile: function (tElement, tAttr, transclude) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function (scope, iElement, iAttr) {
                if (!compiledContents) {
                    compiledContents = $compile(contents, transclude);
                }
                compiledContents(scope, function (clone, scope) {
                    iElement.append(clone);
                });
            };
        }
    };
}]);

angular.module('VolpayApp').directive('dtpicker', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            $(element).next().click(function () {
                $(element).focus();
            })

            function checkforFormat() {
                var attr = JSON.parse(attrs['dtpicker']);
                var format = 'YYYY-MM-DD';
                if (attr['type'] === 'DateOnly') {
                    format = 'YYYY-MM-DD';
                } else if (attr['type'] === 'TimeOnly') {
                    format = 'HH:mm:ss';
                } else if (attr['type'] === 'DateTime') {
                    format = 'YYYY-MM-DD HH:mm:ss';
                }
                return format;
            }

            function initiate(argu) {
                argu.datetimepicker({
                    format: checkforFormat(),
                    useCurrent: false,
                    showClear: true
                })
            }

            initiate(element);

            if (!ngModel) return; // do nothing if no ng-model

            ngModel.$render = function () {
                element.val(ngModel.$viewValue || '');
            }

            element.on('dp.change', function () {
                scope.$apply(setVal);
            });

            element.on('dp.show', function (ev) {
                $('.bootstrap-datetimepicker-widget, .datepicker-days').css({
                    'display': 'block'
                });
                if ($(element).closest('.sec-body').length) {
                    $('.rpSec').each(function () {
                        if ($(this).has(element).length) {
                            $(this).closest('.sec-body').css({ 'overflow': '' });
                        } else {
                            $(this).css({ 'display': 'none' });
                        }
                    });
                }

            });
            element.on('dp.hide', function (ev) {
                if ($(element).closest('.sec-body').length) {
                    $('.rpSec').each(function () {
                        $(this).css({ 'display': 'block' });
                        $(this).closest('.sec-body').css({ 'overflow': 'auto' });
                    })
                }
            });

            setVal();

            function setVal() {
                if (element.val()) {
                    ngModel.$setViewValue(element.val());
                }
            }
        }
    }
});

angular.module('VolpayApp').directive('colorpicker', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            $(element).spectrum({
                //color:  "#000",
                showPalette: true,
                //hideAfterPaletteSelect:true,
                showPaletteOnly: true,
                togglePaletteOnly: true,
                togglePaletteMoreText: 'more',
                togglePaletteLessText: 'less',
                palette: [
                    ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                    ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                    ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                    ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                    ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                    ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                    ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                    ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                ],
                preferredFormat: "hex",
                allowEmpty: true,
                move: function (color) {
                    $(this).val(color.toHexString())
                },
                change: function () {

                }
            }).show();
            $(element).on('focus', function (e) {
                $(this).click();
                return false;
            })
            $(element).on('click', function (e) {
                $(this).spectrum("show");
                return false;
            })
        }
    }
});

angular.module('VolpayApp').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
angular.module('VolpayApp').directive('select2ModelAppend', ['$sce', function ($sce) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            angular.element(element).addClass('select2-class');
            var isSelect = element.is('select');
            var isMultiple = angular.isDefined(attr.multiple);

            if (!ngModel) return; // do nothing if no ng-model

            scope.$watch(attr.ngModel, function (current, old) {
                if (!current && current !== false && current !== "") {
                    if (current === null && !old) {
                        current = typeof current === "boolean" ? JSON.stringify(current) : current
                        ngModel.$setViewValue(current);
                    } else {
                        old = typeof old === "boolean" ? JSON.stringify(old) : old
                        ngModel.$setViewValue(old);
                    }
                } else {
                    current = typeof current === "boolean" ? JSON.stringify(current) : current
                    ngModel.$setViewValue(current);
                }
            }, true)

            //$this becomes element
            element.select2({
                //options removed for clarity
                placeholder: sessionStorage.sessionlang == 'en_US' ? 'Select' : 'Seleccionar'
            });

            scope.$on('langChangeEvent', function () {
                if (sessionStorage.sessionlang == 'en_US') {
                    $(".select2-class").select2({ placeholder: "Select", allowClear: true });
                } else {
                    $(".select2-class").select2({ placeholder: "Seleccionar", allowClear: true });
                }
            });

            element.on('blur keyup change', function () {
                scope.$apply(function () {
                    optionElement = (element.data('select2') && typeof element.select2("val") == "string") ? (!element.select2("val").match('string:') && !element.select2("val").match('undefined:') && !element.select2("val").match('object:') && !element.select2("val").match('null:')) : true;
                    //will cause the ng-model to be updated.
                    if (element.data('select2') && optionElement) {
                        ngModel.$setViewValue(element.select2("val"));
                    }
                });
            });
            ngModel.$render = function () {
                //if this is called, the model was changed outside of select, and we need to set the value
                element.value = ngModel.$viewValue;
                // element.select2("val", ngModel.$viewValue);
            }
        }
    }
}]);
angular.module('VolpayApp').directive('select2ModelAppend1', ['$sce', function ($sce) {
    return {
        restrict: 'AC',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {

            // //$this becomes element
            // element.select2({
            //     //options removed for clarity
            // });

            element.on('change', function () {
                scope.$apply(function () {
                    //will cause the ng-model to be updated.
                    ngModel.$setViewValue(element.select2("val"));
                });
            });

            ngModel.$render = function () {
                //if this is called, the model was changed outside of select, and we need to set the value
                // element.value = ngModel.$viewValue;
                element.select2("val", ngModel.$viewValue);
            }
        }
    }
}]);
angular.module('VolpayApp').directive('customTooltip', function ($transitions) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.hover(function () {
                // on mouseenter
                element.tooltip('show');
            }, function () {
                // on mouseleave
                element.tooltip('hide');
            });

            element.click(function () {
                element.tooltip('hide');
                if ($(".tooltip").length) {
                    $(".tooltip").remove();
                }
            });

            $transitions.onSuccess({}, function ($transition) {
                element.tooltip('hide');
                if ($(".tooltip").length) {
                    $(".tooltip").remove();
                }
            });
        }
    };
});
angular.module('VolpayApp').directive("select2", function ($timeout, $filter) {
    return {
        restrict: 'AC',
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            angular.element(element).addClass('select2-class');
            var isSelect = element.is('select');
            var isMultiple = angular.isDefined(attrs.multiple);
            // var preselectedData = 

            $timeout(function () {
                var ele = element.select2({
                    placeholder: sessionStorage.sessionlang == 'en_US' ? 'Select' : 'Seleccionar',
                    allowClear: true,
                    delay: 250
                });
            });

            scope.$on('langChangeEvent', function () {
                if (sessionStorage.sessionlang == 'en_US') {
                    $(".select2-class").select2({ placeholder: "Select", allowClear: true });
                } else {
                    $(".select2-class").select2({ placeholder: "Seleccionar", allowClear: true });
                }
            });

            if (attrs.multiple) {
                scope.$watch(attrs.ngModel, function (current, old) {
                    // Delayed so that the options have time to be rendered
                    if (!current && current != undefined) {
                        return;
                    } else if (angular.equals(current, old)) {
                        return;
                    } else if ([[], "", '', null, undefined].indexOf(current)) {
                        $timeout(function () {
                            angular.element(element).data(null)
                            angular.element(element).trigger('change.select2');
                        });
                    }
                    $timeout(function () {
                        model.$render();
                    });
                }, true);
            }

            model.$render = function () {
                element.select2("val", model.$viewValue);
            };

            element.on('change', function () {
                scope.$apply(function () {
                    model.$setViewValue(element.select2("val"));
                });
            });

            element.on('select2:clear', function (event) {
                scope.$apply(function () {
                    angular.element(element).data(null)
                    $timeout(function () {
                        event.stopPropagation();
                        angular.element(element).trigger('change');
                    }, 1000);
                });
            });
        }
    };
});
angular.module('VolpayApp').constant("moment", moment);
angular.module('VolpayApp').directive('custimepicker', function (moment, datepickerFaIcons) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            // $(element).next().click(function () {
            //     $(element).focus();
            // });

            function checkforFormat() {
                var attr = JSON.parse(attrs['custimepicker']);
                var format = 'YYYY-MM-DD';
                if (attr['type'] === 'DateOnly') {
                    format = 'YYYY-MM-DD';
                } else if (attr['type'] === 'TimeOnly') {
                    format = 'HH:mm:ss';
                } else if (attr['type'] === 'DateTime') {
                    format = 'YYYY-MM-DD HH:mm:ss';
                }
                return format;
            }

            function initiate(argu) {
                argu.datetimepicker({
                    format: attrs.format ? attrs.format : checkforFormat(),
                    // useCurrent: true,
                    showClear: true,
                    icons: datepickerFaIcons.icons,
                    defaultDate: 'now',
                    useCurrent: false
                });
            }

            initiate(element);

            var picker = element.data("DateTimePicker");

            if (!ngModel) return; // do nothing if no ng-model

            ngModel.$render = function () {
                element.val(ngModel.$viewValue || '');
            }

            element.on('dp.change', function () {
                if (element.val() != ("" || '')) {
                    scope.$apply(setVal);
                } else {
                    picker.clear();
                    ngModel.$setViewValue(element.val());
                }
            });

            element.on('dp.show', function (ev) {
                $('.bootstrap-datetimepicker-widget, .datepicker-days').css({
                    'display': 'block'
                });
                if ($(element).closest('.sec-body').length) {
                    $('.rpSec').each(function () {
                        if ($(this).has(element).length) {
                            $(this).closest('.sec-body').css({ 'overflow': '' });
                        } else {
                            $(this).css({ 'display': 'none' });
                        }
                    });
                }

                // dynamic day based time restriction in timepicker
                if (attrs.timerestriction) {
                    if (attrs.timepickertype == 'start') {
                        picker.minDate(attrs.timepickertype == 'start' ? moment().startOf(attrs.timerestriction) : false);
                        picker.maxDate(attrs.timepickertype == 'start' ? moment().endOf(attrs.timerestriction) : false);
                    } else if (attrs.timepickertype == 'end') {
                        picker.minDate(attrs.timepickertype == 'end' ? attrs.startdate ? moment(attrs.startdate, 'HH:mm:ss')._d : false : false);
                        picker.maxDate(attrs.timepickertype == 'end' ? moment().endOf(attrs.timerestriction) : false);
                    }
                }

                if (element.val() != ("" || '')) {
                    scope.$apply(setVal);
                } else {
                    picker.clear();
                    // element.val(ngModel.$viewValue || '');
                    ngModel.$setViewValue(element.val());
                }

            });

            element.on('dp.hide', function (ev) {
                if ($(element).closest('.sec-body').length) {
                    $('.rpSec').each(function () {
                        $(this).css({ 'display': 'block' });
                        $(this).closest('.sec-body').css({ 'overflow': 'auto' });
                    })
                }
            });

            element.on('dp.update', function () {
                scope.$apply(setVal);
            });

            setVal();

            function setVal() {
                if (element.val()) {
                    ngModel.$setViewValue(element.val());
                }
            }
        }
    }
});
angular.module('VolpayApp').directive('infinityscroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('scroll', function () {
                if ((element[0].scrollTop + element[0].offsetHeight) >= element[0].scrollHeight - 5) {
                    //scroll reach to end
                    scope.$apply(attrs.infinityscroll)
                }
            });
        }
    }
});
angular.module('VolpayApp').directive('dateMonthYearPicker', function (moment, datepickerFaIcons) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            var parent = $(element);
            var dtp = parent.datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                icons: datepickerFaIcons.icons,
                defaultDate: 'now'
            });

            dtp.on("dp.change", function (e) {
                ngModelCtrl.$setViewValue(moment(e.date).format("MM/YYYY"));
                scope.$apply();
            });

            dtp.on('dp.show', function (ev) {
            });
        }
    };
});
angular.module('VolpayApp').directive('allowOnlyNumbers', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                var $input = $(this);
                var value = $input.val();
                value = value.replace(/[^0-9]/g, '');
                $input.val(value);
                if (event.which == 64 || event.which == 16) {
                    // to allow numbers  
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number  
                    return true;
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows  
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others  
                    // Sorry Only Numbers Allowed 
                    return false;
                }
            });
        }
    }
});
