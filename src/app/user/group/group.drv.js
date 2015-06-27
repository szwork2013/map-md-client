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
        .controller('UserGroupPageCtrl', ['$scope', '$state', 'Groups', '$log', '$mmdMessage', 'Authenticate',
            UserGroupPageCtrl]);

    var LOG_TAG = "[User page] ";

    function userGroupPageDirective($mdTheming, $log) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                group: '=',
                owned: '='
            },
            link: link,
            controller: 'UserGroupPageCtrl as ugpc',
            templateUrl: 'user/group/group.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function UserGroupPageCtrl($scope, $state, Groups, $log, $mmdMessage, Authenticate) {
        var self = this;

        $scope.$watch('group', function(group) {
            if(group) {
                self.group = group;
                setEditable(self.group);
                Groups.getAlbums(group.id).then(function(albums) {
                    // TODO
                    angular.forEach(albums, function(album, key) {
                        if(!album.cover) {
                            album.cover = album.photos[0];
                        }
                    });
                    self.albums = albums;
                });
            }
        });

        /**
         * 设置登录用户是否可编辑
         */
        function setEditable(group) {
            $scope.editable = false;
            $scope.owned = false;
            Authenticate.getUser().then(function(user) {
                angular.forEach(group.members, function(member, key) {
                    if(member.id == user.id) {
                        $scope.editable = true;
                    }
                });
                if(user.id == group.user.id) {
                    $scope.owned = true;
                }
            });
        }

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
            if(album.type=='Base') {
                $state.go("app.maps.album.fc.edit", {id: album.id});
            }else {
                $state.go("app.maps.album.fc.edit", {id: album.id});
            }
        };
        $scope.goDisplay = function(album) {
            $state.go("app.maps.album.display", {userName: self.group.username, albumName: album.name});
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