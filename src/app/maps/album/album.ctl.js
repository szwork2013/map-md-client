/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.album', [
        'app.maps.album.fc',
        'app.maps.album.display'
    ])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.album', {
                        abstract: true,
                        url: '^/album',
                        templateUrl: 'maps/album/album.tpl.html',
                        controller: 'MapsAlbumCtrl as mac',
                        resolve: {}
                    });
            }])
        .controller('MapsAlbumCtrl', ['$scope', '$log', MapsAlbumCtrl]);

    function MapsAlbumCtrl($scope, $log) {

        var self = this;

        $scope.setGeoJSON = function(geojson) {
            try {
                $scope.setGeojson({
                    data: geojson,
                    style: function (feature) {
                        return angular.extend({}, geojson.properties.style, feature.properties.style);
                    },
                    resetStyleOnMouseout: true,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng);
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(feature.properties.name);
                        layer.on({
                            mouseover: function(e) {
                            },
                            click: function(e) {
                            },
                            mouseout: function(e) {
                                //resetHighlight
                            }
                        });
                    }
                });

            } catch (ex) {
                $log.debug(LOG_TAG + ex);
            } finally {
            }
        };

        $scope.$on('leafletDirectiveMap.geojsonCreated', function(e, geoJSON) {
            $scope.getMap().then(function(map) {
                map.fitBounds(geoJSON.getBounds());
            });
        });

        $scope.$on('$destroy', function(e) {
            $scope.getMap().then(function(map) {
            });
        });
    }
})();