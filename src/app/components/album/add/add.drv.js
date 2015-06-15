/**
 * Created by tiwen.wang on 6/15/2015.
 */
(function() {
    'use strict';

    angular.module('app.components.album.add', [])
        .factory('$albumAddPhoto', ['$mdDialog', '$log', '$albumNew', '$mmdMessage', 'Users', 'Albums',
            AlbumAddPhoto]);

    function AlbumAddPhoto($mdDialog, $log, $albumNew, $mmdMessage, Users, Albums) {

        return showAddPhotoDialog;

        function showAddPhotoDialog(ev, user, albums, photos) {
            return $mdDialog.show({
                controller: ['$scope', '$mdDialog', 'user', 'albums', 'photos', AlbumAddPhotoDialogController],
                templateUrl: 'components/album/add/add.tpl.html',
                targetEvent: ev,
                locals: {
                    user: user,
                    albums: albums,
                    photos: photos
                }
            });
        }

        function AlbumAddPhotoDialogController($scope, $mdDialog, user, albums, photos) {
            $scope.albums = [];
            if(!albums) {
                Users.getAlbums(user.id).then(function(albums) {
                    $scope.albums = albums;
                });
            }else {
                $scope.albums = albums;
            }

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            $scope.selectAlbum = function(album) {
                if($scope.selAlbum && $scope.selAlbum.id == album.id) {
                    $scope.selAlbum = null;
                }else {
                    $scope.selAlbum = album;
                }
            };

            $scope.addTo = function() {
                if(!$scope.selAlbum) {
                    $mmdMessage.fail.update("请选择一个相册");
                    return;
                }
                var photoIds = [];
                angular.forEach(photos, function(photo, key) {
                    this.push(photo.id);
                }, photoIds);
                Albums.addPhotos($scope.selAlbum.id, photoIds).then(function(album) {
                    $scope.selAlbum.photos = album.photos;
                    $mmdMessage.success.update();
                    $scope.answer($scope.albums);
                },function(err) {
                    $mmdMessage.fail.update(err.statusText);
                });
            };

            $scope.newAlbum = function(ev) {
                $albumNew(ev).then(function(album) {
                    $scope.selAlbum = album;
                    $scope.addTo();
                });
            };
        }
    }

})();