/**
 * Created by tiwen.wang on 6/23/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.user.group
     */
    angular.module('app.user.group', [
    ])
        .directive('userGroupPage', ['$mdTheming', '$log', userGroupPageDirective])
        .controller('UserGroupPageCtrl', ['$scope', '$state', 'Groups', '$q', '$mmdMessage',
            UserGroupPageCtrl]);

    function userGroupPageDirective($mdTheming, $log) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                group: '='
            },
            link: link,
            controller: 'UserGroupPageCtrl as ugpc',
            templateUrl: 'user/group/group.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function UserGroupPageCtrl($scope, $state, Groups, $q, $mmdMessage) {
        var self = this;

        $scope.$watch('group', function(group) {
            if(group) {
                self.group = group;
                Groups.getAlbums(group.id).then(function(albums) {
                    self.albums = albums;
                });
            }
        });
        $scope.applyJoin = function() {
            Groups.applyJoin(self.group.id).then(function(group) {
                $mmdMessage.success.update("已申请");
                self.applyJoined = true;
            },function(err) {
                $mmdMessage.fail.update(err);
            });
        };

        $scope.go = function(state, params) {
            $state.go(state, params);
        };

        $scope.goEdit = function(album) {
            $state.go("app.maps.album.fc.edit", {id: album.id});
        };
    }
})();