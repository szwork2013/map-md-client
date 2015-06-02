/**
 * Created by tiwen.wang on 6/2/2015.
 */
(function() {
    'use strict';

    angular.module('app.home.message', [])
        .factory('$mmdMessage', ['$window', '$timeout', '$mdToast',
            function ($window, $timeout, $mdToast) {

                var toastPosition = {
                    bottom: false,
                    top: true,
                    left: false,
                    right: true
                };
                var getToastPosition = function() {
                    return Object.keys(toastPosition)
                        .filter(function(pos) { return toastPosition[pos]; })
                        .join(' ');
                };
                var showMessage = function(content, position) {
                    var toast = $mdToast.simple()
                        .content(content)
                        .highlightAction(false)
                        .position(position || getToastPosition());

                    return $mdToast.show(toast);
                };

                return {
                    showMessage: showMessage
                };

            }])
    ;
})();