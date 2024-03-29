/**
 * Created by tiwen.wang on 5/5/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson', [
        'app.maps.geojson.upload',
        'app.maps.geojson.display',
        'app.maps.geojson.edit',
        'app.maps.geojson.search',
        'app.maps.geojson.my'
    ])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson', {
                        abstract: true,
                        url: '^/geojson',
                        templateUrl: 'maps/geojson/geojson.tpl.html',
                        controller: 'MapsGeojsonCtrl as mgc',
                        resolve: {}
                    });
            }])
        .controller('MapsGeojsonCtrl', ['$scope', '$log', 'GeoJSONs', '$mmdMessage', MapsGeojsonCtrl])
    ;

    var LOG_TAG = "Maps-Geojson: ";

    function MapsGeojsonCtrl($scope, $log, GeoJSONs, $mmdMessage) {
        $scope.setAppTitle("GeoJSON");

        var self = this;

        $scope.showBottomSheet = function($event) {
            $scope.showGridBottomSheet($event, [
                { name: '我的', icon: 'social:person', link: 'app.maps.geojson.my' },
                { name: '上传', icon: 'image:camera', link: 'app.maps.geojson.upload' },
                { name: '搜索', icon: 'action:search', link: 'app.maps.geojson.search' },
                { name: 'Help', icon: 'action:help' , link: 'app.helps.geojson'}
            ]).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.setTitle = function(title) {
            self.title = title;
        };

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                dashArray: '',
                fillOpacity: 0.3
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
        }

        $scope.setGeoJSON = function(geojson, layerEventListeners) {
            layerEventListeners = layerEventListeners || {};
            try {
                $scope.setGeojson({
                    data: geojson.data,
                    style: function (feature) {
                        return angular.extend({}, geojson.style, feature.properties.style);
                    },
                    resetStyleOnMouseout: true,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng);
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(feature.properties.name);
                        layer.on({
                            mouseover: function(e) {
                                highlightFeature.call(this, e);
                                if(layerEventListeners.mouseover) {
                                    layerEventListeners.mouseover.call(this, e, feature);
                                }
                            },
                            click: function(e) {
                                if(layerEventListeners.click) {
                                    layerEventListeners.click.call(this, e, feature);
                                }
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
            $log.debug("geojson created");
            $scope.getMap().then(function(map) {
                map.fitBounds(geoJSON.getBounds());
            });
        });

        $scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, oe) {
            $log.debug("feature clicked");
            if(feature.geometry.type === "Point") {

            }else {
                $scope.getMap().then(function(map) {
                    map.fitBounds(oe.target.getBounds());
                });
            }
        });

        /**
         * 提交保存数据
         * @param geoJSON
         */
        $scope.submit = function(geoJSON) {
            geoJSON.saving = true;
            geoJSON.data.properties = geoJSON.data.properties || {};
            geoJSON.data.properties.style = geoJSON.style;
            if(geoJSON.id) {
                GeoJSONs.update({
                    id: geoJSON.id,
                    name: geoJSON.name,
                    description: geoJSON.description,
                    data: JSON.stringify(geoJSON.data)
                }).then(function() {
                    geoJSON.saving = false;
                    $mmdMessage.success.update();
                },function(err) {
                    geoJSON.saving = false;
                    $mmdMessage.fail.update(err.statusText);
                });
            }else {
                GeoJSONs.create({
                    name: geoJSON.name,
                    description: geoJSON.description,
                    data: JSON.stringify(geoJSON.data)
                }).then(function(res) {
                    geoJSON.id = res.id;
                    geoJSON.saving = false;
                    $mmdMessage.success.save();
                },function(err) {
                    geoJSON.saving = false;
                    $mmdMessage.fail.save(err.statusText);
                });
            }
        };

        self.toolbarActions = [];
        $scope.addToolbarAction = function(action) {
            self.toolbarActions.push(action);
        };
        $scope.removeToolbarAction = function() {
            self.toolbarActions = [];
        };

        $scope.$on('$destroy', function(e) {
            self.toolbarActions = [];
        });
    }
})();