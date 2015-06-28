/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.album.fc.display', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.album.fc.display', {
                        url: '/{id}',
                        templateUrl: 'maps/album/fc/display/display.tpl.html',
                        controller: 'MapsAlbumFCDisplayCtrl as mafcdc',
                        resolve: {
                            albumId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsAlbumFCDisplayCtrl', ['$scope', '$log', '$FeatureCollection', 'ClusterControl', 'Albums', 'albumId',
            MapsAlbumFCDisplayCtrl]);

    function MapsAlbumFCDisplayCtrl($scope, $log, $FeatureCollection, ClusterControl, Albums, albumId) {
        var self = this;
        var clusterControl;

        Albums.get(albumId).then(function(album) {
            //$scope.setTitle(album.name, album.user);
            $scope.setAlbum(album);
            if(album.map) {
                $scope.setBaseLayer(album.map.baseLayer, album.map.name);
            }

            self.album = album;
            self.album.featureCollection = $FeatureCollection.detransform(self.album.featureCollection);
            $scope.setGeoJSON(self.album.featureCollection);
            addCluster(album);
        });

        function addCluster(album) {
            $scope.getMap().then(function(map) {
                clusterControl = new ClusterControl(map, album.photos, album.title);
            });
        }

        //$scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, oe) {
        //    self.feature = feature;
        //});

        $scope.$on('leafletDirectiveMap.geojsonMouseover', function(e, feature, oe) {
            oe.target.openPopup();
            self.feature = feature;
        });

        self.filterSecId = function(properties) {
            var result = {};
            angular.forEach(properties, function(value, key) {
                switch (key) {
                    case 'style':
                        break;
                    default :
                        result[key] = value;
                }
            });
            return result;
        };

        $scope.$on('$destroy', function(e) {
            if(clusterControl) {
                clusterControl.remove();
            }
            $scope.setGeoJSON();
        });
    }
})();