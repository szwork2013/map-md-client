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
                        views: {
                            '': {
                                templateUrl: 'maps/heatmap/heatmap.tpl.html',
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
                        radius: 50,
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