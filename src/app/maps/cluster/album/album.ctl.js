/**
 * Created by tiwen.wang on 6/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.cluster.album', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.cluster.album', {
                        url: '/album/{id}',
                        templateUrl: 'maps/cluster/album/album.tpl.html',
                        controller: 'MapsClusterAlbumCtrl as mcac',
                        resolve: {
                            albumId: ['$stateParams', function ($stateParams) {
                                return $stateParams.id;
                            }],
                            album: ['$stateParams', function ($stateParams) {
                                return $stateParams.album;
                            }]
                        }
                    });
            }])
        .controller('MapsClusterAlbumCtrl', ['$scope', '$log', 'Albums', 'albumId', 'album',
            MapsClusterAlbumController]);

    var LOG_TAG = "[Maps Cluster Album] ";

    function MapsClusterAlbumController($scope, $log, Albums, albumId, album) {
        var self = this;

        Albums.get(albumId).then(function(album) {
            self.album = album;
            $log.debug(LOG_TAG + "album name is " + album.name);
            $scope.setUserTitle(album.user, album.title);
            addClusterMarkers(album);
        });

        /**
         * 往图标集图层添加图片
         * @param photos
         */
        function addClusterMarkers(album) {
            $scope.create(album.title, album.photos);
        }

        $scope.$on('$destroy', function(e) {
            $scope.clear();
        });
    }
})();