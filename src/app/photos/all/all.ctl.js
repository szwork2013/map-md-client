/**
 * Created by tiwen.wang on 6/14/2015.
 */
(function () {
    'use strict';

    angular.module('app.photos.all', ['uiSelect'])
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
        .controller('PhotosAllCtrl', ['$scope', '$log', '$mmdPhotoDialog', '$mmdMessage',
            'Authenticate', 'Users', 'Photos', '$albumAddPhoto', PhotosAllCtrl])
    ;

    function PhotosAllCtrl($scope, $log, $mmdPhotoDialog, $mmdMessage, Authenticate,
                           Users, Photos, $albumAddPhoto) {
        var self = this;
        self.photos = [];
        var userId = 0, pageSize = 50, pageNo = -1;

        Authenticate.getUser().then(function(user) {
            userId = user.id;
            self.loadMorePhotos();
        });

        /**
         *
         */
        self.loadMorePhotos = function() {
            pageNo++;
            Users.getPhotos(userId, pageSize, pageNo).then(function(photos) {
                angular.forEach(photos, function(photo, key) {
                    colRowSpan(photo);
                });
                self.photos = self.photos.concat(photos);
            });
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
                $albumAddPhoto(ev, {id: userId}, self.albums, photos );
            }else {
                $albumAddPhoto(ev, {id: userId}, self.albums, photos )
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