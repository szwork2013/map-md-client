/**
 * Created by tiwen.wang on 5/26/2015.
 */
(function() {
    'use strict';
    angular.module('app.core')
        .filter('distance', function () {
        return function (input) {
            if (input >= 1000) {
                return (input / 1000).toFixed(2) + 'km';
            } else {
                return input + 'm';
            }
        };
    })
    ;
})();