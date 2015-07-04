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
        .controller('MapsClusterAlbumCtrl', ['$scope', '$log', '$q', 'Albums', 'albumId', 'album',
            MapsClusterAlbumController]);

    var LOG_TAG = "[Maps Cluster Album] ";

    function MapsClusterAlbumController($scope, $log, $q, Albums, albumId, album) {
        var self = this;
        self.comments = [];
        $scope.photosLimitTo = 20;
        var pageSize = 100, limitPageSize = 20;

        Albums.get(albumId).then(function(album) {
            self.album = album;
            if(album.map) {
                $scope.setBaseLayer(album.map);
            }
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

        self.loadMorePhotos = function(pageNo) {
            var deferred = $q.defer();
            if(self.album) {
                $scope.photosLimitTo = limitPageSize*(pageNo+1);
                if(self.album.photos && $scope.photosLimitTo > self.album.photos.length) {
                    deferred.resolve(false);
                }else {
                    deferred.resolve(true);
                }
                $scope.$broadcast('mmd-photo-wall-resize');
            }else {
                deferred.reject();
            }

            return deferred.promise;
        };

        self.loadReset = function() {
            $scope.photosLimitTo = limitPageSize;
        };

        self.commentCreated = function(comment) {
            self.comments.splice(0,0,comment);
        };

        $scope.$on('$destroy', function(e) {
            $scope.clear();
        });
    }
})();