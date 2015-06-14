/**
 * Created by tiwen.wang on 6/5/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson.edit', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson.edit', {
                        url: '/edit/{id:[0-9]{1,30}}',
                        templateUrl: 'maps/geojson/edit/edit.tpl.html',
                        controller: 'MapsGeojsonEditCtrl as mgec',
                        resolve:{
                            geoJSONId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsGeojsonEditCtrl', ['$scope', '$log', '$timeout', '$q', 'GeoJSONs',
            '$mmdMessage', 'geoJSONId',
            MapsGeojsonEditCtrl])
        .directive('mmdMapGeojsonEditFeature', ['$mdTheming','$log', mmdMapGeojsonEditFeatureDirective])
        .controller('MapsGeojsonEditFeatureCtrl', ['$scope', '$log', '$timeout', '$q', '$mmdMessage',
            MapsGeojsonEditFeatureCtrl])
    ;

    var LOG_TAG = "Maps-Geojson-Edit: ";

    function MapsGeojsonEditCtrl($scope, $log, $timeout, $q, GeoJSONs, $mmdMessage, geoJSONId) {
        var self = this;

        $scope.setTitle("编辑");

        GeoJSONs.get(geoJSONId).then(function(geoJSON) {
            $scope.geoJSON = self.geoJSON = geoJSON;
            self.geoJSON.data = JSON.parse(geoJSON.data);
            if(self.geoJSON.data.properties &&
                self.geoJSON.data.properties.style) {
                self.geoJSON.style = self.geoJSON.data.properties.style;
            }
            $scope.setGeoJSON(self.geoJSON);
        });

        self.submit = function(geoJSON) {
            $scope.setGeoJSON(geoJSON);
            $scope.submit(geoJSON);
        };

        $scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, fe) {
            angular.forEach($scope.geoJSON.data.features, function(f, key) {
                if(angular.equals(f, feature)) {
                    f.properties = f.properties || {};
                    f.properties.style = angular.extend({}, self.geoJSON.style, f.properties.style);
                    self.features = [f];
                }
            });
        });

        self.featurePropsUpdated = function(properties) {
            if(self.features[0]) {
                self.features[0].properties = properties;
            }
            $scope.setGeoJSON(self.geoJSON);
        };

        $scope.$on('$destroy', function(e) {
            $scope.setGeoJSON({});
        });
    }

    function mmdMapGeojsonEditFeatureDirective($mdTheming, $log) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                feature: '=',
                updated: '='
            },
            link: link,
            controller: 'MapsGeojsonEditFeatureCtrl as mgefc',
            templateUrl: 'maps/geojson/edit/feature.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function MapsGeojsonEditFeatureCtrl($scope, $log, $timeout, $q, $mmdMessage) {
        var self = this;

        self.feature = $scope.feature.properties;
        self.properties = angular.copy($scope.feature.properties);

        self.reset = function() {
            self.feature.style = angular.copy(self.properties.style);
            $scope.updated(self.feature);
            $scope.featureForm.$setPristine();
        };

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
    }
})();