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
        .controller('PhotosAllCtrl', ['$scope', '$log', '$mmdPhotoDialog', '$mdDialog', '$mmdMessage',
            'Authenticate', 'Users', 'Photos', PhotosAllCtrl])
    ;

    function PhotosAllCtrl($scope, $log, $mmdPhotoDialog, $mdDialog, $mmdMessage, Authenticate, Users, Photos) {
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

        self.displayPhoto = function($event, photo) {
            $mmdPhotoDialog.show($event, {id: photo.id});
        };

        self.remove = function(ev) {
            $scope.showConfirm(ev).then(function(confirm) {
                angular.forEach(self.photos, function(photo, key) {
                    if(photo.actionSelected) {
                        Photos.remove(photo.id).then(function(res) {
                            self.photos.splice(self.photos.indexOf(photo), 1);
                            $mmdMessage.success.remove();
                        },function(err) {
                            $mmdMessage.fail.remove(err.statusText);
                        });
                    }
                });

            },function(cancel) {
            });
        };

        $scope.showConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('删除图片?')
                .content('确认删除选中的图片')
                .ariaLabel('Lucky day')
                .ok('确认')
                .cancel('取消')
                .targetEvent(ev);
            return $mdDialog.show(confirm);
        };

        $scope.moveSelect = false;
    }
})();