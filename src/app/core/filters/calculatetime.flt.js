/**
 * Created by tiwen.wang on 4/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .filter('calculatetime', function() {
            return function(time) {
                if(!time || !angular.isNumber(time)) {
                    return "";
                }
                var date = new Date(time),
                    cuTime = new Date();
                var diff = cuTime - date;
                var day = Math.round(diff / (1000 * 60 * 60 * 24));
                if(day < 1) {
                    var hour = Math.round(diff / (1000 * 60 * 60));
                    if(hour < 1) {
                        var minute = Math.round(diff / (1000 * 60)) + 1;
                        return minute+"分钟前";
                    }else {
                        return hour+"小时前";
                    }
                }else if(day > 5) {
                    return time;
                }else {
                    return day+"天前";
                }
            };
        })
        .filter('bytes', function() {
            return function(bytes, precision) {
                if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                    return '-';
                }
                if (typeof precision === 'undefined') {
                    precision = 1;
                }
                var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                    number = Math.floor(Math.log(bytes) / Math.log(1024));
                return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
            };
        });
})();