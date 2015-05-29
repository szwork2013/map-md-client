/**
 * Created by tiwen.wang on 5/28/2015.
 */
(function() {
    'use strict';
    angular.module('app.core')
        .factory('rgbHex', ['$q',  function ($q) {

            function isNumeric(arg) {
                return !isNaN(parseFloat(arg)) && isFinite(arg);
            }

            function trim(arg) {
                return arg.replace(/^\s+|\s+$/g, "");
            }

            function isRgb(arg) {
                if(angular.isString(arg)) {
                    arg = trim(arg);
                }

                return isNumeric(arg) && arg >= 0 && arg <= 255;
            }

            function isHex(arg) {
                return (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i).test(trim(arg));
            }

            function rgbToHex(arg) {
                arg = parseInt(arg, 10).toString(16);
                return arg.length === 1 ? '0' + arg : arg;
            }

            function hexToRgb(arg) {
                return parseInt(arg, 16).toString();
            }

            function processRgb(arg) {
                if(!angular.isArray(arg)) {
                    arg = arg.split(',');
                }

                if ( (arg.length === 3 || arg.length === 4) && isRgb(arg[0]) && isRgb(arg[1]) && isRgb(arg[2]) ) {
                    if (arg.length === 4 && !isNumeric(arg[3])) { return null; }
                    return '#' + rgbToHex(arg[0]).toUpperCase() + rgbToHex(arg[1]).toUpperCase() + rgbToHex(arg[2]).toUpperCase();
                }
                else {
                    return null;
                }
            }

            function processHex(arg) {
                if (isHex(arg)) {
                    if (arg.length === 3) { arg = arg.charAt(0) + arg.charAt(0) + arg.charAt(1) + arg.charAt(1) + arg.charAt(2) + arg.charAt(2); }

                    return 'rgb(' + hexToRgb(arg.substr(0,2)) + ',' + hexToRgb(arg.substr(2,2)) + ',' + hexToRgb(arg.substr(4,2)) + ')';
                }
            }

            function removeWhitespace(arg) {
                return arg.replace(/\s/g, '');
            }

            return function(arg) {
                if(!arg) { return null; }

                var code = null,
                    rgbRegex = /^rgba?\((.*)\);?$/,
                    hexRegex = /^#/;

                if(angular.isArray(arg)) {
                    return processRgb(arg);
                }
                arg = trim(arg.toString());
                if (arg === 'transparent' || removeWhitespace(arg) === 'rgba(0,0,0,0)') {
                    return 'transparent';
                }
                else if (rgbRegex.test(arg)) {
                    return processRgb(arg.match(rgbRegex)[1]);
                }
                else if (hexRegex.test(arg)) {
                    return processHex(arg.split('#').reverse()[0]);
                }
                //try to parse the string without rgb or #
                else {
                    code = arg.split(',');

                    if (code.length === 1) { return processHex(arg); }
                    else if (code.length === 3 || code.length === 4) { return processRgb(arg); }
                }
            };
        }])
    ;

})();