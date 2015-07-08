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
        .controller('UserGroupPageCtrl', ['$scope', '$state', '$log', '$mmdMessage', 'Groups', 'Users',
            UserGroupPageCtrl]);

    var LOG_TAG = "[User page] ";

    function userGroupPageDirective($mdTheming, $log) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                group: '=',
                authority: '='
            },
            link: link,
            controller: 'UserGroupPageCtrl as ugpc',
            templateUrl: 'user/group/group.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function UserGroupPageCtrl($scope, $state, $log, $mmdMessage, Groups, Users) {
        var self = this;

        self.group = $scope.group;
        Users.getAlbums($scope.group.id).then(function(albums) {
            self.albums = albums;
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

        /**
         * 解散群组(删除群组及内容)
         */
        self.remove = function() {
            $log.debug(LOG_TAG + "解散群组");
            Groups.remove(self.group.id).then(function(group) {
                $mmdMessage.success.remove();
            },function(err) {
                $mmdMessage.fail.remove(err.statusText);
            });
        };
    }
})();