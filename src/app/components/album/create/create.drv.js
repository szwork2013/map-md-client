/**
 * Created by tiwen.wang on 6/15/2015.
 */
(function() {
    'use strict';

    angular.module('app.components.album.create', [])
        .factory('$albumNew', ['$mdDialog', '$log', '$mmdMessage', 'Albums',
            NewAlbumFactory]);

    function NewAlbumFactory($mdDialog, $log, $mmdMessage, Albums) {

        return showNewAlbumDialog;

        function showNewAlbumDialog(ev, type) {
            return $mdDialog.show({
                controller: ['$scope', '$mdDialog', 'type', AlbumNewDialogController],
                templateUrl: 'components/album/create/create.tpl.html',
                targetEvent: ev,
                locals: {
                    type: type
                }
            });
        }

        function AlbumNewDialogController($scope, $mdDialog, type) {

            $scope.album = {
                type: type || "Base"
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.create = function(album) {
                Albums.create(album).then(function(album) {
                    $mmdMessage.success.create();
                    $mdDialog.hide(album);
                },function(err) {
                    $mmdMessage.fail.create(err.statusText);
                });
            };
        }
    }
})();