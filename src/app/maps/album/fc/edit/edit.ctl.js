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
        .controller('MapsFcEditCtrl', ['$scope', '$log', '$q', '$timeout', 'Albums', 'albumId', '$mmdMessage',
            MapsFcEditCtrl]);

    var LOG_TAG = "Maps-Album-Fc-Edit: ";
    function MapsFcEditCtrl($scope, $log, $q, $timeout, Albums, albumId, $mmdMessage) {
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
            var features = [];
            for(var i in self.album.featureCollection.features) {
                var feature = self.album.featureCollection.features[i];
                var newFeature = {
                        type: feature.type,
                        properties: feature.properties,
                        geometry: feature.geometry
                    };
                if(feature.id) {
                    newFeature.id = feature.id;
                }
                features.push(newFeature);
            }
            var fc = {
                type: self.album.featureCollection.type,
                properties: angular.copy(self.album.featureCollection.properties),
                features: features
            };
            fc.properties.style = JSON.stringify(fc.properties.style);
            Albums.modifyFC(self.album.id, fc)
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