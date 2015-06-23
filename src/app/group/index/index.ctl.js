/**
 * Created by tiwen.wang on 6/18/2015.
 */
(function () {
    'use strict';

    angular.module('app.group.index', ['app.group'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.group.index', {
                        url: '/{name}',
                        templateUrl: 'group/index/index.tpl.html',
                        controller: 'GroupIndexCtrl as gic',
                        resolve: {
                            name: ['$stateParams', function($stateParams){
                                return $stateParams.name;
                            }]
                        }
                    })
                ;
            }])
        .controller('GroupIndexCtrl', ['$scope', '$state', '$log', '$mmdMessage', 'name', 'Groups', '$albumNew',
            GroupIndexCtrl])
    ;

    function GroupIndexCtrl($scope, $state, $log, $mmdMessage, name, Groups, $albumNew) {
        var self = this;

        Groups.getByName(name).then(function(group) {
            self.group = group;
            Groups.getAlbums(group.id).then(function(albums) {
                self.albums = albums;
            });
        });

        function isApplyJoin() {

        }

        self.applyJoin = function() {
            Groups.applyJoin(self.group.id).then(function(group) {
                $mmdMessage.success.update("已申请");
                self.applyJoined = true;
            },function(err) {
                $mmdMessage.fail.update(err);
            });
        };

        self.goEdit = function(album) {
            $scope.go("app.maps.album.fc.edit", {id: album.id});
        };
    }
})();