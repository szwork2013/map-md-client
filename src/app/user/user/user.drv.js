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
        .controller('UserUserPageCtrl', ['$scope', '$log', 'Users', '$state', 'Authenticate',
            UserUserPageCtrl]);

    function userUserPageDirective($mdTheming, $log) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: '=',
                editable: '=owned'
            },
            link: link,
            controller: 'UserUserPageCtrl as uupc',
            templateUrl: 'user/user/user.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function UserUserPageCtrl($scope, $log, Users, $state, Authenticate) {
        var self = this;

        $scope.$watch('user', function(user) {
            if(user) {
                self.user = user;
                Authenticate.isMe(user).then(function(res) {
                    $scope.editable = res;
                });
                Users.getAlbums(user.id).then(function(albums) {
                    // TODO
                    angular.forEach(albums, function(album, key) {
                        if(!album.cover) {
                            album.cover = album.photos[0];
                        }
                    });
                    self.albums = albums;
                });
                Users.getGroups(user.id).then(function(groups) {
                    self.groups = groups;
                });
            }
        });

        $scope.go = function(state, params) {
            $state.go(state, params);
        };
    }
})();