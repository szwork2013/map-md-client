/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.choropleth', [
        'app.maps.choropleth.upload'
    ])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.choropleth', {
                        url: '^/choropleth',
                        templateUrl: 'maps/choropleth/choropleth.tpl.html',
                        controller: 'MapsChoroplethCtrl as mcc',
                        resolve: {
                            id: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsChoroplethCtrl', ['$scope', '$log', 'leafletData', '$http', 'id',
            MapsChoroplethCtrl]);

    function MapsChoroplethCtrl($scope, $log, leafletData, $http, id) {

        //$scope.setLegend({
        //    colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
        //    labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
        //});

        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, feature, leafletEvent) {
            countryMouseover(feature, leafletEvent);
        });

        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, feature, leafletEvent) {
            countryClick(feature, leafletEvent);
        });

        function countryClick(country, event) {
            $log.info(country.properties.name);
        }

        // Get a country paint color from the continents array of colors
        function getColor(feature) {
            if (!feature || !feature["id"]) {
                return "#FFF";
            }
            var color = $scope.data.legend.colors[0];
            var value = $scope.data.regions[feature.id];
            angular.forEach($scope.data.legend.ranges, function(val, key) {
                if(val[0] <= value && ( !val[1] ? true : val[1] >= value)) {
                    color = $scope.data.legend.colors[key];
                }
            });

            return color;
        }

        function style(feature) {
            return {
                fillColor: getColor(feature),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.3
            };
        }

        // Mouse over function, called from the Leaflet Map Events
        function countryMouseover(feature, leafletEvent) {
            var layer = leafletEvent.target;
            layer.setStyle({
                weight: 2,
                color: '#666',
                fillColor: 'white'
            });
            layer.bringToFront();
            $scope.selectedFeature = feature;
        }

        $scope.$on('$destroy', function(e) {
            $scope.setGeojson({});
            //$scope.setLegend();
        });

    }


})();