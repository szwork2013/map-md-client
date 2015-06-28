/**
 * Created by tiwen.wang on 6/28/2015.
 */
(function() {
    'use strict';
    angular.module('app.core.filters')
        .filter('gps', ['$mmdUtil', function ($mmdUtil) {
            return function (input) {
                return $mmdUtil.map.GPS.convert(input);
            };
        }])
    ;
})();