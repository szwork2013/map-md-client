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

        $scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, oe) {
            $log.debug("feature clicked");
            self.properties = feature.properties;
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

        self.like = {
            liking: false,
            icon: 'action:favorite_outline',
            listener: function(e) {
                var self = this;
                if(this.liking) {
                    GeoJSONs.unLike(geoJSONId).then(function() {
                        self.setLike(false);
                    },function(err) {
                        $mmdMessage.fail.save(err.statusText);
                    });
                }else {
                    GeoJSONs.like(geoJSONId).then(function() {
                        self.setLike(true);
                    },function(err) {
                        $mmdMessage.fail.save(err.statusText);
                    });
                }
            },
            setLike: function(like) {
                this.liking = like;
                this.icon = this.liking ? 'action:favorite' : 'action:favorite_outline';
            },
            label: '喜欢'
        };

        // 登录用户是否like
        GeoJSONs.isLike(geoJSONId).then(function(result) {
            self.like.setLike(result);
            $scope.addToolbarAction(self.like);
        });

        $scope.$on('$destroy', function(e) {
            $scope.setGeoJSON({});
            $scope.removeToolbarAction();
        });
    }
})();