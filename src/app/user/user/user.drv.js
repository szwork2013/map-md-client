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
        .controller('UserUserPageCtrl', ['$scope', '$log', 'Users', '$state', UserUserPageCtrl]);

    function userUserPageDirective($mdTheming, $log) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: '=',
                authority: '='
            },
            link: link,
            controller: 'UserUserPageCtrl as uupc',
            templateUrl: 'user/user/user.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function UserUserPageCtrl($scope, $log, Users, $state) {
        var self = this;

        self.user = $scope.user;

        Users.getGroups($scope.user.id).then(function(groups) {
            self.groups = groups;
        });

        $scope.go = function(state, params) {
            $state.go(state, params);
        };
    }
})();