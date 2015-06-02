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
                        controller: 'MapsGeojsonUploadCtrl'
                    });
            }])
        .controller('MapsGeojsonUploadCtrl', ['$scope', '$log', '$timeout', '$q',
            MapsGeojsonUploadCtrl])
    ;

    var LOG_TAG = "Maps-Geojson-Upload: ";

    function MapsGeojsonUploadCtrl($scope, $log, $timeout, $q) {

        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "green",
            color: "green",
            weight: 0,
            opacity: 0.5,
            fillOpacity: 0.5
        };

        function getGeojsonFromFile(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.deferred = deferred;
            reader.onload = function(e) {
                if (e.target.result) {
                    this.deferred.resolve(e.target.result);
                }
            };
            $timeout(function () {
                reader.readAsText(file);
            });
            return deferred.promise;
        }

        function setGeojson(geojson) {
            $scope.china = JSON.stringify(geojson);
            try {
                $scope.setGeojson({
                    data: geojson,
                    //style: {
                    //    weight: 1,
                    //    color: "#0BF",
                    //    opacity: 0.5,
                    //    fillOpacity: 0
                    //},
                    resetStyleOnMouseout: true,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                });
            } catch (ex) {
                $log.debug(LOG_TAG + ex);
            } finally {
            }
        }

        $scope.fileSelected = function(files, e) {
            if(files.length) {
                $scope.uploading = true;
            }
            var counts = 0, china = {"type":"FeatureCollection","features":[]};
            angular.forEach(files, function(file, key) {
                getGeojsonFromFile(file).then(function(data) {
                    counts++;
                    var geojson = JSON.parse(data);
                    china.features = china.features.concat(geojson.features);
                    if(counts === files.length) {
                        $scope.uploading = false;
                        setGeojson(china);
                    }
                });
            });

        };
    }
})();