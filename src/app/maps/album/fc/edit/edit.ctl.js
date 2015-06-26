/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.album.fc.edit', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.album.fc.edit', {
                        url: '/?id',
                        templateUrl: 'maps/album/fc/edit/edit.tpl.html',
                        controller: 'MapsFcEditCtrl as mfec',
                        resolve: {
                            albumId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsFcEditCtrl', ['$scope', '$log', '$q', '$timeout', 'Albums', 'albumId',
            '$mmdMessage', '$FeatureCollection',
            MapsFcEditCtrl]);

    var LOG_TAG = "Maps-Album-Fc-Edit: ";
    function MapsFcEditCtrl($scope, $log, $q, $timeout, Albums, albumId, $mmdMessage, $FeatureCollection) {
        var self = this;

        var defalutStyle = {
            weight: 1,
            radius: 8,
            fillColor: "green",
            color: "green",
            opacity: 0.5,
            fillOpacity: 0.5,
            dashArray: 3
        };

        var drawnItems, drawControl;
        // init map draw tool
        $scope.getMap().then(function(map) {

            drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            drawControl = new L.Control.Draw({
                draw: {
                    position: 'topleft',
                    polygon: {
                        title: 'Draw a sexy polygon!',
                        allowIntersection: false,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        },
                        showArea: true
                    },
                    polyline: {
                        metric: false
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    }
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            map.addControl(drawControl);
            map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;
                if (type === 'marker') {
                    layer.bindPopup('A popup!');
                }
                drawnItems.addLayer(layer);
            });
        });

        /**
         * 退出时清除地图控件
         */
        $scope.$on('$destroy', function(e) {
            $scope.getMap().then(function(map) {
                if(drawnItems) {
                    map.removeLayer(drawnItems);
                }
                if(drawControl) {
                    map.removeControl(drawControl);
                }
            });
        });

        /**
         * 获取专辑
         */
        Albums.get(albumId).then(function(album) {
            $scope.setAlbum(album);
            self.album = album;
            self.album.featureCollection = self.album.featureCollection||{
                    type: 'FeatureCollection',
                    properties: {style: angular.copy(defalutStyle)},
                    features: []
                };
            if(angular.isString(self.album.featureCollection.properties.style)) {
                self.album.featureCollection.properties.style =
                    JSON.parse(self.album.featureCollection.properties.style);
            }
            angular.forEach(self.album.featureCollection.features, function(feature, key) {
                if(feature.properties && feature.properties.style) {
                    feature.properties.style = JSON.parse(feature.properties.style);
                }
            });
            resetGeoJSON();
        });

        /**
         * 加载文件内容
         * @param file
         * @returns {*}
         */
        function getGeojsonFromFile(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.deferred = deferred;
            reader.onload = function(e) {
                if (e.target.result) {
                    this.deferred.resolve(JSON.parse(e.target.result));
                }
            };
            reader.readAsText(file);
            return deferred.promise;
        }

        /**
         * 文件加载
         * @param files
         * @param e
         */
        $scope.fileSelected = function(files, e) {
            if (files.length) {
                var file = files[0];
                $scope.uploading = true;
                $timeout(function () {
                    getGeojsonFromFile(file).then(function (geojson) {
                        $scope.uploading = false;
                        self.album.featureCollection.features =
                            self.album.featureCollection.features.concat(geojson.features||[]);
                        resetGeoJSON();
                    });
                });
            }
        };

        /**
         * feature点击事件
         */
        $scope.$on('leafletDirectiveMap.geojsonClick', function(e, feature, fe) {
            angular.forEach(self.album.featureCollection.features, function(f, key) {
                if(angular.equals(f, feature)) {
                    f.properties = f.properties || {};
                    f.properties.style = angular.extend({}, f.properties.style);
                    self.features = [f];
                }
            });
        });

        self.modifyAlbum = function() {

            Albums.modify(self.album.id, {
                    name: self.album.name,
                    description: self.album.description
                })
                .then(function(album) {
                    $scope.albumForm.$setPristine();
                    $mmdMessage.success.save();
                },function(err) {
                    $mmdMessage.fail.save(err.statusText);
                });
        };

        /**
         * 保存专辑
         */
        self.save = function() {
            $log.debug(LOG_TAG + " tojson");
            var newGeoJSON = drawnItems.toGeoJSON();
            $log.debug(newGeoJSON);
            self.album.featureCollection.features =
                self.album.featureCollection.features.concat(newGeoJSON.features);
            // 保存成功后删除draw工具里的feature layers
            drawnItems.clearLayers();
            Albums.modifyFC(self.album.id, $FeatureCollection.tranform(self.album.featureCollection))
                .then(function(album) {
                    $mmdMessage.success.save();
                },function(err) {
                    $mmdMessage.fail.save(err.statusText);
                });
        };

        /**
         * 删除feature
         * @param feature
         */
        self.featureRemove = function(feature) {
            if(feature.id) {
                Albums.removeFeature(self.album.id, feature.id).then(function() {
                    $mmdMessage.success.remove();
                    removeFeature(feature);
                    self.features = [];
                },function(err) {
                    $mmdMessage.fail.remove(err.statusText);
                });
            }else {
                removeFeature(feature);
                self.features = [];
            }

        };

        /**
         * 从地图上删除feature
         * @param feature
         */
        function removeFeature(feature) {
            var features = self.album.featureCollection.features;
            angular.forEach(features, function(f, key) {
                if(angular.equals(f, feature)) {
                    features.splice(features.indexOf(f), 1);
                }
            });
            resetGeoJSON();
        }

        // 重新显示
        function resetGeoJSON() {
            $scope.setGeoJSON(self.album.featureCollection);
        }
        self.resetGeoJSON = resetGeoJSON;

        self.featurePropsUpdated = function(properties) {
            if(self.features[0]) {
                self.features[0].properties = properties;
            }
            resetGeoJSON();
        };
    }
})();