/**
 * Created by tiwen.wang on 5/5/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('maps.geojson', {
                        url: '/geojson',
                        views: {
                            '': {
                                templateUrl: 'maps/geojson/geojson.tpl.html',
                                controller: 'MapsGeojsonCtrl'
                            }
                        },
                        resolve: {}
                    });
            }])
        .controller('MapsGeojsonCtrl', ['$scope', '$log', 'leafletData', '$http', MapsGeojsonCtrl])
    ;

    function MapsGeojsonCtrl($scope, $log, leafletData, $http) {

        $scope.setLegend({
            colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
            labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
        });

        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, feature, leafletEvent) {
            countryMouseover(feature, leafletEvent);
        });

        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, feature, leafletEvent) {
            countryClick(feature, leafletEvent);
        });

        function countryClick(country, event) {
            $log.info(country.properties.name);
        }

        var continentProperties= {
            "009": {
                name: 'Oceania',
                colors: [ '#CC0066', '#993366', '#990066', '#CC3399', '#CC6699' ]
            },
            "019": {
                name: 'America',
                colors: [ '#006699', '#336666', '#003366', '#3399CC', '#6699CC' ]
            },
            "150": {
                name: 'Europe',
                colors: [ '#FF0000', '#CC3333', '#990000', '#FF3333', '#FF6666' ]
            },
            "002": {
                name: 'Africa',
                colors: [ '#00CC00', '#339933', '#009900', '#33FF33', '#66FF66' ]
            },
            "142": {
                name: 'Asia',
                colors: [ '#FFCC00', '#CC9933', '#999900', '#FFCC33', '#FFCC66' ]
            }
        };

        // Get a country paint color from the continents array of colors
        function getColor(country) {
            if (!country || !country["region-code"]) {
                return "#FFF";
            }

            var colors = continentProperties[country["region-code"]].colors;
            var index = country["alpha-3"].charCodeAt(0) % colors.length ;
            return colors[index];
        }

        function style(feature) {
            return {
                fillColor: getColor($scope.countries[feature.id]),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
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
            $scope.selectedCountry = feature;
        }

        // Get the countries data from a JSON
        $http.get("json/all.json").success(function(data, status) {

            // Put the countries on an associative array
            $scope.countries = {};
            for (var i=0; i< data.length; i++) {
                var country = data[i];
                $scope.countries[country['alpha-3']] = country;
            }

            $http.get("json/countries.geo.json").success(function(data, status) {
                $scope.setGeojson({
                    data: data,
                    style: style,
                    resetStyleOnMouseout: true
                });
            });
        });

        $scope.$on('$destroy', function(e) {
            $scope.setGeojson({});
            $scope.setLegend({});
        });

    }
})();