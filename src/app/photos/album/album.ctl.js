/**
 * Created by tiwen.wang on 6/15/2015.
 */
(function () {
    'use strict';

    angular.module('app.photos.album', ['uiSelect'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.photos.album', {
                        url: '/album/{id:[0-9]{1,30}}',
                        templateUrl: 'photos/album/album.tpl.html',
                        controller: 'PhotosAlbumCtrl as pac',
                        resolve: {
                            id: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    })
                ;
            }])
        .controller('PhotosAlbumCtrl', ['$scope', '$log', 'Albums', 'id', '$mmdMessage', 'Maps',
            PhotosAlbumCtrl])
    ;

    function PhotosAlbumCtrl($scope, $log, Albums, id, $mmdMessage, Maps) {
        var self = this;
        var originalAlbum = {};
        self.album = {tags: []};

        Albums.get(id).then(function(album) {
            self.album = album;
            originalAlbum = angular.copy(album);
            $scope.setPage("app.photos.album", self.album.title, {id: self.album.id});
        });

        self.save = function(ev) {
            var album = {
                name: self.album.name,
                title: self.album.title,
                description: self.album.description,
                tags: self.album.tags
            };
            if(self.album.map) {
                album.map = {
                  id: self.album.map.id
                };
            }

            Albums.modify(self.album.id, album).then(function(album) {
                $mmdMessage.success.update();
                $scope.albumForm.$setPristine();
            },function(err) {
                $mmdMessage.fail.update(err.statusText);
            });
        };

        self.cancel = function(ev) {
            self.album.name = originalAlbum.name;
            self.album.description = originalAlbum.description;
            self.album.tags = originalAlbum.tags;
            $scope.albumForm.$setPristine();
        };

        self.deleteAlbum = function(ev) {
            $scope.showConfirm(ev, '删除相册?', '删除此相册，里面的图片会一起删除。').then(function(confirm) {
                Albums.remove(self.album.id)
                    .then(function(album) {
                        $mmdMessage.success.remove();
                        // 转向相册列表页面
                        $scope.go("app.photos.albums");
                    }, function(err) {
                        $mmdMessage.fail.remove(err.statusText);
                    });
            });
        };

        self.removePhotos = function(ev) {
            var photos = getSelectPhotos(self.album);
            if(!photos.length) {
                $scope.showSelectPrompt(ev);
                return;
            }
            $scope.showConfirm(ev, '移出图片?', '从本相册中移出选中的图片，图片并未删除。').then(function(confirm) {
                Albums.removePhotos(self.album.id, getPhotoIds(photos))
                    .then(function(album) {
                        removePhotos(photos);
                        $mmdMessage.success.remove();
                    }, function(err) {
                        $mmdMessage.fail.remove(err.statusText);
                });
            });
        };

        self.deletePhotos = function(ev) {
            var photos = getSelectPhotos(self.album);
            if(!photos.length) {
                $scope.showSelectPrompt(ev);
                return;
            }
            $scope.showConfirm(ev, '删除图片?', '从本相册中删除选中的图片，图片会被删除。').then(function(confirm) {
                Albums.deletePhotos(self.album.id, getPhotoIds(photos))
                    .then(function(album) {
                        removePhotos(photos);
                        $mmdMessage.success.remove();
                    }, function(err) {
                        $mmdMessage.fail.remove(err.statusText);
                    });
            });
        };

        self.select = function() {
            self.all = !self.all;
            if(self.all) {
                self.selectAll();
            } else {
                self.cancelSelect();
            }
        };

        self.selectAll = function(ev) {
            angular.forEach(self.album.photos, function(photo, key) {
                photo.actionSelected = true;
            });
        };

        self.cancelSelect = function(ev) {
            angular.forEach(self.album.photos, function(photo, key) {
                photo.actionSelected = false;
            });
        };

        function getSelectPhotos(album) {
            var photos = [];
            angular.forEach(album.photos, function(photo, key) {
                if(photo.actionSelected) {
                    this.push(photo);
                }
            }, photos);
            return photos;
        }

        function getPhotoIds(photos) {
            var photoIds = [];
            angular.forEach(photos, function(photo, key) {
                if(photo.actionSelected) {
                    this.push(photo.id);
                }
            }, photoIds);
            return photoIds;
        }

        function removePhotos(photos) {
            angular.forEach(photos, function(photo, key) {
                self.album.photos.splice(self.album.photos.indexOf(photo), 1);
            });
        }

        $scope.getMaps = function() {
            Maps.getAll().then(function(maps) {
                self.maps = maps;
            });
        };
    }
})();