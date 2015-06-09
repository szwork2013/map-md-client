/**
 * Created by tiwen.wang on 6/5/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson.display', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson.display', {
                        url: '/{id:[0-9]{1,30}}',
                        templateUrl: 'maps/geojson/display/display.tpl.html',
                        controller: 'MapsGeojsonDisplayCtrl as mgdc',
                        resolve:{
                            geoJSONId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsGeojsonDisplayCtrl', ['$scope', '$log', '$timeout', '$q', 'GeoJSONs',
            '$mmdMessage', 'geoJSONId',
            MapsGeojsonDisplayCtrl])
    ;

    var LOG_TAG = "Maps-Geojson-Display: ";

    function MapsGeojsonDisplayCtrl($scope, $log, $timeout, $q, GeoJSONs, $mmdMessage, geoJSONId) {

        var self = this;
        self.properties = {};

        GeoJSONs.get(geoJSONId).then(function(geoJSON) {
            $scope.setTitle(geoJSON.name);
            self.geoJSON = geoJSON;
            self.geoJSON.data = JSON.parse(geoJSON.data);
            if(self.geoJSON.data.properties &&
                self.geoJSON.data.properties.style) {
                self.geoJSON.style = self.geoJSON.data.properties.style;
            }
            $scope.setGeoJSON(self.geoJSON, {
                mouseover: onFeatureMouseover
            });

            self.geoJSONString = JSON.stringify(self.geoJSON.data);
        });

        function onFeatureMouseover(e, feature) {
            self.properties = feature.properties;
        }

        //$scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, oe) {
        //    $log.debug("feature clicked");
        //    if(feature.geometry.type === "Point") {
        //
        //    }else {
        //        $scope.getMap().then(function(map) {
        //            map.fitBounds(oe.target.getBounds());
        //        });
        //    }
        //
        //});

        $scope.$on('$destroy', function(e) {
            $scope.setGeoJSON({});
        });
    }
})();