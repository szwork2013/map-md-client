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

        $scope.$on('$destroy', function(e) {
            $scope.setGeoJSON({});
        });
    }

    function MapsGeojsonEditFeatureCtrl($scope, $log, $timeout, $q, $mmdMessage) {
        var self = this;

        $scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, fe) {
            angular.forEach($scope.geoJSON.data.features, function(f, key) {
                if(angular.equals(f, feature)) {
                    f.properties = f.properties || {};
                    f.properties.style = f.properties.style || {};
                    self.feature = f.properties;
                    self.properties = angular.copy(f.properties);
                }
            });
        });

        self.reset = function() {
            self.feature.style = angular.copy(self.properties.style);
            $scope.setGeoJSON($scope.geoJSON);
        };

        self.setGeoJSON = function() {
            $scope.setGeoJSON($scope.geoJSON);
        };
    }
})();