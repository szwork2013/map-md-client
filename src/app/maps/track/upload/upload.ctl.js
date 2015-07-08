/**
 * Created by tiwen.wang on 5/24/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.track.upload', ['ngFileUpload', 'ngSanitize'])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.track.upload', {
                        url: '/upload',
                        templateUrl: 'maps/track/upload/upload.tpl.html',
                        resolve: {},
                        controller: "MapsTrackUploadCtrl"
                    });
            }])
        .controller('MapsTrackUploadCtrl',
        ['$scope', '$timeout', '$log', '$q', '$FeatureCollection',
            MapsTrackUploadCtrl])
        .controller('trackCtl',
        ['$scope', '$log', '$q', '$FeatureCollection', 'Tracks', '$mmdMessage',
            TrackCtl])
    ;

    var LOG_TAG = "[Maps upload] ";

    function MapsTrackUploadCtrl( $scope, $timeout, $log, $q, $FeatureCollection) {
        var self = this;

        // 正在加载标志
        $scope.uploading = false;
        $scope.tracks = [];

        $scope.cancel = function(index) {
            $scope.removeTrack($scope.tracks[index]);
            $scope.tracks.splice(index, 1);
        };

        $scope.fileSelected = function(files, e, type) {
            var file;
            if(files.length) {
                $log.debug(LOG_TAG + "type = " + type);
                file = files[0];
                var reader = new FileReader();
                reader.onload = onload;
                $scope.uploading = true;
                $timeout(function() {
                    reader.readAsText(file);
                });
            }

            function onload(e) {
                $scope.getMap().then(function(map) {
                    var elevation = L.control.elevation();

                    var track = {};

                    var gjl = L.geoJson(null, {
                        onEachFeature: elevation.addData.bind(elevation)
                    });

                    var runLayer;
                    if(file.type == "application/vnd.google-earth.kml+xml") {
                        gjl = L.geoJson(null, {
                            onEachFeature: function(data, layer) {
                                if(data.geometry.type == 'Point') {
                                    if(data.properties.name) {
                                        track.name = data.properties.name;
                                        layer.bindPopup("<p>"+data.properties.name+"</p><pre>"+data.properties.description+"</pre>");
                                    }
                                    if(data.properties.description) {
                                        track.description = data.properties.description;
                                    }
                                }else {
                                    elevation.addData.bind(elevation)(data, layer);
                                }
                            }
                        });
                        runLayer = omnivore.kml.parse(e.target.result, {}, gjl);
                        //runLayer = addKml(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.csv$")) {
                        runLayer = omnivore.csv.parse(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.geojson$")) {
                        runLayer = L.geoJson(JSON.parse(e.target.result), {
                            onEachFeature: function(data, layer) {
                                elevation.addData.bind(elevation)(data, layer);
                            }
                        });
                    }else if(file.name.match("\\.wkt$")) {
                        gjl = L.geoJson(null, {
                            onEachFeature: function(data, layer) {
                                if(data.type == 'MultiPoint') {
                                    //if(data.properties.name) {
                                    //    track.name = data.properties.name;
                                    //    layer.bindPopup("<p>"+data.properties.name+"</p>");
                                    //}
                                    //if(data.properties.desc) {
                                    //    track.description = data.properties.desc;
                                    //}
                                    //if(data.properties.time) {
                                    //    track.time = data.properties.time;
                                    //}
                                }
                                elevation.addData.bind(elevation)(data, layer);
                            }
                        });
                        runLayer = omnivore.wkt.parse(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.gpx$")){
                        gjl = L.geoJson(null, {
                            onEachFeature: function(data, layer) {
                                if(data.geometry.type == 'LineString') {
                                    if(data.properties.name) {
                                        track.name = data.properties.name;
                                        layer.bindPopup("<p>"+data.properties.name+"</p>");
                                    }
                                    if(data.properties.desc) {
                                        track.description = data.properties.desc;
                                    }
                                    if(data.properties.time) {
                                        track.time = data.properties.time;
                                    }

                                    //if(!data.geometry.coordinates.length) {
                                    //    data.geometry.coordinates = data.geometry.coordinates.line;
                                    //}
                                }
                                elevation.addData.bind(elevation)(data, layer);
                            }
                        });
                        runLayer = omnivore.gpx.parse(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.polyline$")) {
                        runLayer = omnivore.polyline.parse(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.topojson$")) {
                        runLayer = omnivore.topojson.parse(e.target.result, {}, gjl);
                    }else {
                        return $scope.uploading = false;
                    }

                    runLayer.addTo(map);
                    var bounds = runLayer.getBounds();
                    if(bounds.isValid()) {
                        map.fitBounds(bounds);
                    }

                    track.fileName = file.name;
                    track.fileSize = file.size;
                    track.type = 1;
                    track.elevation = elevation;
                    track.layer = gjl;
                    track.geoJson = runLayer.toGeoJSON();

                    $scope.addTrack(track, file.name);

                    $scope.tracks.push(track);

                    $scope.uploading = false;
                }, function(error) {
                    $scope.uploading = false;
                });
            }

            $scope.$on('$destroy', function(e) {
                angular.forEach($scope.tracks, function(track, key) {
                    $scope.removeTrack(track);
                });
                $scope.tracks = [];
            });
        };

    }

    /**
     *
     * @param $scope
     * @param $log
     * @param $q
     * @param Tracks
     * @param $mmdMessage
     * @constructor
     */
    function TrackCtl($scope, $log, $q, $FeatureCollection, Tracks, $mmdMessage) {

        var self = this;

        this.trackTypes = [{
            id: 'maps:place',
            name: "地点",
            value: 'place'
        }];

        self.difficulties = [{
            name: "简单",
            value: '1'
        },
            {
                name: "适中",
                value: '2'
            },
            {
                name: "困难",
                value: '3'
            },
            {
                name: "非常困难",
                value: '4'
            },
            {
                name: "砖家级",
                value: '5'
            }];

        self.privacy = [{
            name: "公开",
            value: 0
        }, {
            name: "隐私",
            value: 1
        }
        ];

        self.submit = function(track) {
            Tracks.create({
                title: track.name,
                description: track.description,
                geo_json: JSON.stringify(track.geoJson)
            }).then(function() {
                $mmdMessage.success.save();
            },function(err) {
                $mmdMessage.fail.save(err.statusText);
            });
        };
    }

})();