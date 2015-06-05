/**
 * Created by tiwen.wang on 6/1/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson.upload', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson.upload', {
                        url: '/upload',
                        templateUrl: 'maps/geojson/upload/upload.tpl.html',
                        controller: 'MapsGeojsonUploadCtrl as mguc'
                    });
            }])
        .controller('MapsGeojsonUploadCtrl', ['$scope', '$log', '$timeout', '$q', 'GeoJSONs', '$mmdMessage',
            MapsGeojsonUploadCtrl])
    ;

    var LOG_TAG = "Maps-Geojson-Upload: ";

    function MapsGeojsonUploadCtrl($scope, $log, $timeout, $q, GeoJSONs, $mmdMessage) {

        var self = this;
        $scope.setTitle("上传GeoJSON");

        var defalutStyle = {
            weight: 1,
            radius: 8,
            fillColor: "green",
            color: "green",
            opacity: 0.5,
            fillOpacity: 0.5,
            dashArray: 3
        };

        self.geojsons = [];

        function getGeojsonFromFile(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.deferred = deferred;
            reader.onload = function(e) {
                if (e.target.result) {
                    this.deferred.resolve(e.target.result);
                }
            };
            reader.readAsText(file);
            return deferred.promise;
        }

        $scope.fileSelected = function(files, e) {
            if(files.length) {
                var file = files[0];
                var geojson = {
                    style: angular.copy(defalutStyle)
                };

                $scope.uploading = true;
                $timeout(function () {
                    getGeojsonFromFile(file).then(function(data) {
                        $scope.uploading = false;
                        geojson.data = JSON.parse(data);
                        geojson.data.properties = geojson.data.properties || {};
                        //geojson.data.properties.style = geojson.data.properties.style || {};
                        //geojson.data.properties.style = angular.extend(geojson.data.properties.style, defalutStyle);
                        setGeoJSON(geojson);
                        self.geojsons = [geojson];
                        self.geoJSON = geojson;
                    });
                });
            }

            //var counts = 0, china = {"type":"FeatureCollection","features":[]};
            //angular.forEach(files, function(file, key) {
            //    getGeojsonFromFile(file).then(function(data) {
            //        counts++;
            //        var geojson = JSON.parse(data);
            //        china.features = china.features.concat(geojson.features);
            //        if(counts === files.length) {
            //            $scope.uploading = false;
            //            setGeojson(china);
            //        }
            //    });
            //});

        };

        function onFeatureClick(e, feature) {
            self.properties = feature.properties;
            angular.forEach(self.geoJSON.data.features, function(f, key) {
                if(angular.equals(f, feature)) {
                    f.properties = f.properties || {};
                    f.properties.style = f.properties.style || {};
                    self.style = f.properties.style;
                }
            });
        }

        $scope.$on('leafletDirectiveMap.geojsonClick', function(e) {
        });

        $scope.$on('leafletDirectiveMap.geojsonMouseover', function(e) {
        });

        $scope.$on('leafletDirectiveMap.geojsonMouseout', function(e) {
        });

        function setGeoJSON(geoJSON) {
            $scope.setGeoJSON(geoJSON, {
                click: onFeatureClick
            });
        }

        self.submit = function(geoJSON) {
            setGeoJSON(geoJSON);
            $scope.submit(geoJSON);
        };

        $scope.$on('$destroy', function(e) {
            $scope.setGeoJSON({});
        });
    }
})();