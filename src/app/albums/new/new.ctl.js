/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function () {
    'use strict';

    angular.module('app.albums.new', ['app.albums'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.albums.new', {
                        url: '/new?user',
                        templateUrl: 'albums/new/new.tpl.html',
                        controller: 'AlbumsNewCtrl as anc',
                        resolve: {
                            userId: ['$stateParams', function($stateParams){
                                return $stateParams.user;
                            }]
                        }
                    })
                ;
            }])
        .controller('AlbumsNewCtrl', ['$scope', '$state', '$log', '$mmdMessage', '$MapSelectDialog',
            'Maps', 'Albums', 'userId', AlbumsNewCtrl])
    ;

    var LOG_TAG = "[Albums new]";

    function AlbumsNewCtrl($scope, $state, $log, $mmdMessage, $MapSelectDialog, Maps, Albums, userId) {
        var self = this;
        self.step = 1;
        self.tags = [];

        if(userId) {
            self.album = {
                type: "Base",
                tags: [],
                user: {
                    id: userId
                }
            };
        }

        self.types = [
            {code: "Base", name: "基本图片专辑"},
            {code: "FeatureCollection", name: "标记地图专辑"}
        ];

        self.save = function(e) {
            var album = angular.copy(self.album);
            if(self.map) {
                album.map = {id: self.map.id};
            }
            album.tags = self.tags;
            Albums.create(album).then(function(album) {
                self.album = album;
                $mmdMessage.success.create();
                $scope.albumNewForm.$setPristine();
                self.step = 2;
            },function(err) {
                $mmdMessage.fail.create(err.statusText);
            });
        };

        self.update = function(ev) {
            var album = angular.copy(self.album);
            if(self.map) {
                album.map = {id: self.map.id};
            }else {
                delete album.map;
            }
            album.tags = self.tags;

            Albums.modify(self.album.id, album).then(function(album) {
                $mmdMessage.success.update();
                $scope.albumForm.$setPristine();
            },function(err) {
                $mmdMessage.fail.update(err.statusText);
            });
        };

        $scope.getMaps = function(ev) {
            $MapSelectDialog.show(ev).then(function(map) {
                $log.debug(LOG_TAG + "selected map is " + map.name);
                self.map = map;
            });
        };
    }
})();