/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function() {
    'use strict';

    /**
     * 选择专辑dialog
     * @ngdoc module
     * @name app.components.album.select
     */
    angular.module('app.components.album.select', [])
        .factory('$albumSelect', ['$mdDialog', '$q', '$albumNew', '$mmdMessage', 'Users', 'Albums',
            AlbumSelectFactory])
        .directive('albumSelect', ['$mdTheming', '$log', '$albumSelect', 'Albums', AlbumSelectDirective])
    ;

    function AlbumSelectFactory($mdDialog, $q, $albumNew, $mmdMessage, Users, Albums) {

        return showSelectDialog;

        function showSelectDialog(ev, user, albums) {
            return $mdDialog.show({
                controller: ['$scope', '$mdDialog', 'UrlService', 'user', 'albums', AlbumSelectDialogController],
                templateUrl: 'components/album/select/select.tpl.html',
                targetEvent: ev,
                locals: {
                    user: user,
                    albums: albums
                }
            });
        }

        function AlbumSelectDialogController($scope, $mdDialog, UrlService, user, albums) {
            $scope.UrlService = UrlService;
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

            $scope.save = function() {
                $scope.answer($scope.selAlbum);
            };

            $scope.newAlbum = function(ev) {
                var deferred = $q.defer();
                $scope.answer(deferred.promise);
                $albumNew(ev).then(function(album) {
                    deferred.resolve(album);
                });
            };
        }
    }

    function AlbumSelectDirective($mdTheming, $log, $albumSelect, Albums) {
        return {
            restrict: 'AE',
            scope: {
                albumSelected: '&?',
                user: '=',
                albums: '=?',
                preselectAlbumId: '=?'
            },
            link: link,
            templateUrl: 'components/album/select/albumSelect.tpl.html'
        };

        function link(scope, element, attrs) {

            if(scope.preselectAlbumId) {
                getAlbum(scope.preselectAlbumId);
            }

            function getAlbum(albumId) {
                Albums.get(albumId).then(function(album) {
                    setAlbum(album);
                });
            }

            function setAlbum(album) {
                scope.album = album;
                scope.albumSelected({$album: album});
            }

            scope.select = function(ev) {
                $albumSelect(ev, scope.user, scope.albums ).then(function(album) {
                    if(angular.isFunction(album.then)) {
                        album.then(function(album) {
                            setAlbum(album);
                        });
                    }else {
                        setAlbum(album);
                    }
                });
            };
        }
    }

})();