/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.heatmap', ['app.maps.heatmap.user', 'app.maps.heatmap.travel'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.heatmap', {
                        abstract: true,
                        url: '^/heatmap',
                        templateUrl: 'maps/heatmap/heatmap.tpl.html',
                        controller: 'MapsHeatmapCtrl',
                        resolve: {
                            mapCode: ['$stateParams', function($stateParams){
                                return $stateParams.mc;
                            }]
                        }
                    });
            }])
        .controller('MapsHeatmapCtrl', ['$scope', '$log', 'mapCode', MapsHeatmapCtrl])
    ;

    function MapsHeatmapCtrl($scope, $log, mapCode) {

        // sidebar config
        if($scope.setMapBarConfig) {
            $scope.setMapBarConfig({noToolbar: true});
        }

        $scope.heatMap = {};
        $scope.setHeatMap = function(name, data) {

            $scope.layers.overlays = {
                heat: {
                    name: name,
                    type: 'heat',
                    data: data,
                    layerOptions: {
                        "maxOpacity": 0.8,
                        "scaleRadius": true,
                        radius: 20,
                        blur: 10,
                        "useLocalExtrema": true,
                        gradient: {
                            '.5': 'blue',
                            '.8': 'red',
                            '.95': 'white'
                        }
                    },
                    max: 8,
                    visible: true
                }
            };

            center();

            $scope.heatMap.size = data.length;
        };

        function center() {
            $scope.getMap().then(function(map) {
                var latlngs = [];
                var points = $scope.layers.overlays.heat.data;
                for (var k in points) {
                    latlngs.push(L.GeoJSON.coordsToLatLng([points[k][1], points[k][0]]));
                }
                map.fitBounds(latlngs);
            });
        }

        if(mapCode) {
            $scope.setMapLayer(mapCode);
        }

        $scope.removeHeatMap = function(name) {
            angular.forEach($scope.layers.overlays, function(overlay, key) {
                if(overlay.type == "heat" && overlay.name == name) {
                    delete $scope.layers.overlays[key];
                }
            });
        };

        $scope.$on('$destroy', function(e) {
            delete $scope.layers.overlays.heat;
        });
    }
})();