/**
 * Created by tiwen.wang on 6/23/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.user.user
     */
    angular.module('app.user.user', [
    ])
        .directive('userUserPage', ['$mdTheming', '$log', userUserPageDirective])
        .controller('UserUserPageCtrl', ['$scope', '$log', 'Users', '$q', '$mmdMessage',
            UserUserPageCtrl]);

    function userUserPageDirective($mdTheming, $log) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: '='
            },
            link: link,
            controller: 'UserUserPageCtrl as uupc',
            templateUrl: 'user/user/user.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function UserUserPageCtrl($scope, $log, Users, $q, $mmdMessage) {
        var self = this;

        $scope.$watch('user', function(user) {
            if(user) {
            }
        });
    }
})();