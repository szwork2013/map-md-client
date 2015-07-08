/**
 * Created by tiwen.wang on 6/14/2015.
 */
(function () {
    'use strict';

    angular.module('app.photos.all', ['uiSelect', 'ui.router'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.photos.all', {
                        url: '/all',
                        templateUrl: 'photos/all/all.tpl.html',
                        controller: 'PhotosAllCtrl as pac',
                        resolve: {}
                    })
                ;
            }])
        .controller('PhotosAllCtrl', ['$scope', '$log', '$q', '$mmdMessage', 'Users', 'Photos',
            '$albumAddPhoto', 'user', PhotosAllCtrl])
    ;

    /**
     * 用户全部图片的页面控制器
     * @param $scope
     * @param $log
     * @param $q
     * @param $mmdMessage
     * @param Users
     * @param Photos
     * @param $albumAddPhoto
     * @param user
     * @constructor
     */
    function PhotosAllCtrl($scope, $log, $q, $mmdMessage, Users, Photos, $albumAddPhoto, user) {
        var self = this;
        var pageSize = 50;
        self.photos = [];
        self.user = user;

        /**
         *
         */
        self.loadMorePhotos = function(pageNo) {
            var deferred = $q.defer();
            Users.getPhotos(user.id, pageSize, pageNo).then(function(photos) {
                angular.forEach(photos, function(photo, key) {
                    colRowSpan(photo);
                });
                self.photos = self.photos.concat(photos);
                if(photos.length<pageSize) {
                    deferred.resolve(false);
                }else {
                    deferred.resolve(true);
                }
            },function() {
                deferred.resolve(false);
            });

            return deferred.promise;
        };

        self.loadReset = function() {
            self.photos.length = 0;
        };

        /*function colRowSpan(photo) {
            if(photo.width > photo.height) {
                photo.colspan = 5;
                photo.rowspan = Math.round(photo.height/(photo.width/5));
            }else {
                photo.rowspan = 5;
                photo.colspan = Math.round(photo.width/(photo.height/5));
            }
        }*/

        function colRowSpan(photo) {
            if(photo.width > photo.height) {
                photo.colspan = Math.round(photo.width/photo.height);
                photo.rowspan = 1;
                if(photo.colspan < photo.width/photo.height) {
                    photo.style = {
                        height: '100%',
                        'max-width': '100%',
                        margin: '0 -' + (((photo.width/photo.height)-photo.colspan)/photo.colspan/2)*100 + '%'
                    };
                }else {
                    photo.style = {
                        width: '100%'
                    };
                }
            }else {
                photo.rowspan = Math.round(photo.height/photo.width);
                photo.colspan = 1;
                if(photo.rowspan > photo.height/photo.width) {
                    photo.style = {
                        height: '100%',
                        'max-width': '100%',
                        margin: '0 -' + ((photo.rowspan-(photo.height/photo.width))/photo.rowspan/2)*100 + '%'
                    };
                }else {
                    photo.style = {
                        width: '100%'
                    };
                }
            }
        }

        self.remove = function(ev) {
            var photos = getSelectPhotos();
            if(!photos.length) {
                $scope.showSelectPrompt(ev);
                return;
            }
            $scope.showConfirm(ev, '删除图片?', '确认删除选中的图片').then(function(confirm) {
                angular.forEach(photos, function(photo, key) {
                    Photos.remove(photo.id).then(function(res) {
                        self.photos.splice(self.photos.indexOf(photo), 1);
                        $mmdMessage.success.remove();
                    },function(err) {
                        $mmdMessage.fail.remove(err.statusText);
                    });
                });
            },function(cancel) {
            });
        };

        self.addToAlbum = function(ev) {
            var photos = getSelectPhotos();
            if(!photos.length) {
                $scope.showSelectPrompt(ev);
                return;
            }
            if(self.albums) {
                $albumAddPhoto(ev, {id: self.user.id}, self.albums, photos );
            }else {
                $albumAddPhoto(ev, {id: self.user.id}, self.albums, photos )
                    .then(function(albums) {
                        self.albums = albums;
                    });
            }
        };

        function getSelectPhotos() {
            var photos = [];
            angular.forEach(self.photos, function(photo, key) {
                if(photo.actionSelected) {
                    this.push(photo);
                }
            }, photos);
            return photos;
        }

        $scope.moveSelect = false;
    }
})();