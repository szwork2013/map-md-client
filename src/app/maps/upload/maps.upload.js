/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.upload', ['ngFileUpload', 'ngSanitize'])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.upload', {
                        url: '/upload',
                        templateUrl: 'maps/upload/maps.upload.tpl.html',
                        resolve: {},
                        controller: "MapsUploadCtrl"
                    });
            }])
        .controller('MapsUploadCtrl',
        ['$scope', '$mdSidenav', '$log', '$q', 'Restangular',
            MapsUploadCtrl])
        .controller('trackCtl',
        ['$scope', '$log', '$q', 'Restangular',
            TrackCtl])
    ;

    var LOG_TAG = "maps-upload: ";

    function MapsUploadCtrl( $scope, $mdSidenav, $log, $q, Restangular) {
        var self = this;

        $scope.setMapBarConfig({noToolbar: false, title: "上传Track"});

        $scope.tracks = [];

        var ecl;
        $scope.getMap().then(function(map) {
            ecl = new ElevationControl(map);
        });

        $scope.cancel = function(index) {
            $scope.tracks.splice(index, 1);
            ecl.remove(index);
        };

        $scope.fileSelected = function(files, e) {
            $log.debug(LOG_TAG + "files size = " + files.length);

            var file;

            if(files.length) {
                //$log.debug(files[0]);
                file = files[0];
                var reader = new FileReader();
                reader.onload = onload;
                reader.readAsText(file);
            }

            function onload(e) {
                $scope.getMap().then(function(map) {

                    var el = ecl.newEcl();

                    var track = {};

                    var gjl = L.geoJson(null, {
                        onEachFeature: el.addData.bind(el)
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
                                    el.addData.bind(el)(data, layer);
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
                                el.addData.bind(el)(data, layer);
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
                                el.addData.bind(el)(data, layer);
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
                                el.addData.bind(el)(data, layer);
                            }
                        });
                        runLayer = omnivore.gpx.parse(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.polyline$")) {
                        runLayer = omnivore.polyline.parse(e.target.result, {}, gjl);
                    }else if(file.name.match("\\.topojson$")) {
                        runLayer = omnivore.topojson.parse(e.target.result, {}, gjl);
                    }

                    gjl.on('click', function(e) {
                        ecl.activeEcl(el);
                    });

                    runLayer.addTo(map);
                    var bounds = runLayer.getBounds();
                    if(bounds.isValid()) {
                        map.fitBounds(bounds);
                    }

                    track.fileName = file.name;
                    track.fileSize = file.size;
                    track.type = 1;
                    track.el = el;

                    $scope.tracks.push(track);

                    ecl.add(gjl, el, file.name);
                    ecl.activeEcl(el);
                });

            }

            $scope.active = function(track) {
                ecl.activeEcl(track.el);
            };

            $scope.$on('$destroy', function(e) {
                ecl.clear();
                $scope.tracks = [];
            });
        };

        function ElevationControl(map) {

            var activedEcl;

            var eControls = [], gControls = [];
            var geojsonControl;

            this.newEcl = function() {
                return L.control.elevation();
            };

            this.activeEcl = function(el) {
                if(activedEcl) {
                    if(el!==activedEcl) {
                        map.removeControl(activedEcl);
                        el.addTo(map);
                        activedEcl = el;
                    }
                }else {
                    el.addTo(map);
                    activedEcl = el;
                }
                if(eControls.indexOf(el) > -1) {
                    var bounds = gControls[eControls.indexOf(el)].getBounds();
                    if(bounds.isValid()) {
                        map.fitBounds(bounds);
                    }
                }
            };

            this.deactiveEcl = function(el) {
                if(activedEcl && el===activedEcl) {
                    map.removeControl(activedEcl);
                    activedEcl = null;
                }
            };

            this.remove = function(index) {
                this.deactiveEcl(eControls[index]);
                eControls.splice(index, 1);
                map.removeLayer(gControls[index]);
                geojsonControl.removeLayer(gControls[index]);
                gControls.splice(index, 1);
                if(!gControls.length) {
                    map.removeControl(geojsonControl);
                    geojsonControl = null;
                }
            };

            this.add = function(geosjon, el, name) {
                eControls.push(el);
                gControls.push(geosjon);
                geosjon.addTo(map);
                if(!geojsonControl) {
                    geojsonControl = L.control.layers({}, {});
                    map.addControl(geojsonControl);
                }
                geojsonControl.addOverlay(geosjon, name);
            };

            this.clear = function() {
                var self = this;
                angular.forEach(eControls, function(el, key) {
                    self.remove(key);
                });
            };
        }
    }

    /**
     *
     * @param $scope
     * @param $log
     * @param $q
     * @param Restangular
     * @constructor
     */
    function TrackCtl($scope, $log, $q, Restangular) {

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
    }

})();