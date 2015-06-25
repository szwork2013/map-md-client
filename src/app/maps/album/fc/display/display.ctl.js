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
        .controller('MapsAlbumFCDisplayCtrl', ['$scope', '$log', 'Albums', 'albumId',
            MapsAlbumFCDisplayCtrl]);

    function MapsAlbumFCDisplayCtrl($scope, $log, Albums, albumId) {
        var self = this;

        Albums.get(albumId).then(function(album) {
            //$scope.setTitle(album.name, album.user);
            $scope.setAlbum(album);
            self.album = album;
            self.album.featureCollection = self.album.featureCollection||{
                    type: 'FeatureCollection',
                    properties: {style: {}},
                    features: []
                };
            if(angular.isString(self.album.featureCollection.properties.style)) {
                self.album.featureCollection.properties.style =
                    JSON.parse(self.album.featureCollection.properties.style);
            }
            angular.forEach(self.album.featureCollection.features, function(feature, key) {
                if(feature.properties && feature.properties.style) {
                    feature.properties.style = JSON.parse(feature.properties.style);
                }
            });
            $scope.setGeoJSON(self.album.featureCollection);
        });

        $scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, oe) {
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
            $scope.getMap().then(function(map) {
            });
        });
    }
})();