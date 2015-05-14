/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson.heatmap', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson.heatmap', {
                        url: '^/heatmap',
                        views: {
                            '': {
                                templateUrl: 'maps/geojson/heatmap/heatmap.tpl.html',
                                controller: 'MapsHeatmapCtrl'
                            }
                        },
                        resolve: {
                            mapCode: ['$stateParams', function($stateParams){
                                return $stateParams.mc;
                            }]
                        }
                    });
            }])
        .controller('MapsHeatmapCtrl', ['$scope', '$log', 'leafletData', '$http', 'mapCode', MapsHeatmapCtrl])
    ;

    function MapsHeatmapCtrl($scope, $log, leafletData, $http, mapCode) {

        // sidebar config
        if($scope.setMapBarConfig) {
            $scope.setMapBarConfig({noToolbar: true});
        }

        $http.get("json/heat-points.json").success(function(data) {
            $scope.layers.overlays = {
                heat: {
                    name: 'Heat Map',
                    type: 'heat',
                    data: data,
                    layerOptions: {
                        radius: 20,
                        blur: 10
                        //gradient: {
                        //    0.4: 'lightgreen',
                        //    0.65: 'green',
                        //    1:    'red'
                        //}
                    },
                    visible: true
                }
            };

            center();
        });

        function center() {
            leafletData.getMap().then(function(map) {
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

        $scope.$on('$destroy', function(e) {
            delete $scope.layers.overlays.heat;
        });
    }
})();