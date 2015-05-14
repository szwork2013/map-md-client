/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    var GeoSearchControl;

    angular.module('app.maps',
        [ 'app.maps.popular', 'app.maps.upload', 'app.maps.user', 'app.maps.cluster',
            'app.maps.geojson', 'app.maps.travel'])

        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $urlRouterProvider
                    .when('/maps', '/maps/popular');

                $stateProvider
                    .state('app.maps', {
                        abstract: true,
                        url: '/maps?mc',
                        views: {
                            '': {
                                templateUrl: 'maps/maps.tpl.html',
                                controller: 'MapsCtrl'
                            }
                        },
                        resolve: {
                            mapCode: ['$stateParams', function($stateParams){
                                return $stateParams.mc;
                            }]
                        }
                    })
                ;
            }])
        .controller('MapsCtrl',
        ['$scope', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$log', '$q', '$timeout',
            'leafletData', '$mmdPhotoDialog', 'LocationSearchManager', 'LocationHashManager', '$location', 'mapCode',
            MapsCtrl])
        .controller('GridBottomSheetCtrl', ['$scope', '$mdBottomSheet', '$state', GridBottomSheetCtrl])
        .controller('DialogController', ['$scope', '$mdDialog', DialogController])
        .controller('MapsGeoSearch', ['$scope', '$log', 'QQWebapi', 'OSMWS', MapsGeoSearch])
    ;

    var LOG_TAG = "maps: ";
    function GridBottomSheetCtrl($scope, $mdBottomSheet, $state) {
        $scope.items = [
            { name: 'Upload', icon: 'upload', link: 'app.maps.upload' },
            { name: 'Mail', icon: 'mail', link: 'app.maps.popular' },
            { name: 'Person', icon: 'social:person' , link: 'app.maps.user'},
            { name: 'Geojson', icon: 'social:person' , link: 'app.maps.geojson.choropleth'},
            { name: 'Heatmap', icon: 'social:person' , link: 'app.maps.geojson.heatmap'}
        ];

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $state.go(clickedItem.link);
            $mdBottomSheet.hide(clickedItem);
        };
    }

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    /**
     * Main map controller for client
     * @param $scope
     * @param $mdSidenav
     * @param $mdBottomSheet
     * @param $log
     * @param $q
     * @param leafletData
     * @constructor
     */
    function MapsCtrl( $scope, $mdSidenav, $mdBottomSheet, $mdDialog, $log, $q, $timeout,
                       leafletData, $mmdPhotoDialog, LocationSearchManager, LocationHashManager, $location, mapCode) {
        var self = this;

        self.toggleRight = $scope.toggleRightSidenav = toggleRight;

        $scope.showGridBottomSheet = function($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'home/bottom-sheet-grid.tpl.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.showAdvancedDialog = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'home/photo-dialog.tpl.html',
                    targetEvent: ev
                })
                .then(function(answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };

        function toggleRight() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function(){
                $mdSidenav('right').toggle();
            });
        }

        angular.extend($scope, {
            defaults: {
                tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                path: {
                    weight: 10,
                    color: '#800000',
                    opacity: 1
                }
            }
        });

        // TODO
        //L.FeatureGroup.EVENTS = "";
        angular.extend($scope, {
            center: {
                lat: 34,
                lng: 110,
                zoom: 6
            },
            layers: {
                baselayers: {},
                overlays: {}
            }
        });

        $scope.markers = [];
        $scope.setMarkers = function(markers) {
            $scope.markers = markers;
        };

        $scope.geojson = {};
        $scope.setGeojson = function(geojson) {
            $scope.geojson = geojson;
        };

        $scope.legend = {};
        $scope.setLegend = function(legend) {
            $scope.legend = legend;
        };

        $scope.paths = {};
        $scope.setPaths = function(paths) {
            $scope.paths = paths;
        };

        var currentMap;
        var baseMaps = {
            StamenWatercolor: {
                name: "Stamen Watercolor",
                code: 'Stamen.Watercolor'
            },
            amapSatellite: {
                name: "高德卫星",
                code: 'AMap.Satellite',
                overlay: {
                    'AMap roads': 'AMap.roads'
                }
            },
            amap: {
                active: true,
                name: "高德",
                code: 'AMap.base'
            },
            CartoDBDarkMatterNoLabels: {
                name: "CartoDB DarkMatterNoLabels",
                code: "CartoDB.DarkMatterNoLabels"

            },
            NASAGIBSViirsEarthAtNight2012: {
                name: "NASAGIBS ViirsEarthAtNight2012",
                code: "NASAGIBS.ViirsEarthAtNight2012"
            },
            QQMap: {
                name: "QQMap",
                code: 'QQMap'
            },
            OpenTopoMap: {
                name: "OpenTopoMap",
                code: "OpenTopoMap"
            },
            EsriWorldImagery: {
                name: "Esri.WorldImagery",
                code: "Esri.WorldImagery"
            },
            MapQuestOpenAerial: {
                name: "MapQuestOpen.Aerial",
                code: 'MapQuestOpen.Aerial',
                overlay: {
                    "MapQuestOpen HybridOverlay": "MapQuestOpen.HybridOverlay"
                }
            },
            "MapBoxPenil": {
                name: "MapBox Penil",
                code: 'MapBox.Penil'
            },
            "MapBoxSatellite": {
                name: "MapBox Satellite",
                code: 'MapBox.Satellite'
            },
            "MapBoxSatelliteStreets": {
                name: "MapBox SatelliteStreets",
                code: 'MapBox.SatelliteStreets'
            },
            "MapBoxLight": {
                name: "MapBox Light",
                code: 'MapBox.Light'
            }
        };

        $scope.setMapLayer = function(mapCode) {
            var baseLayer;
            for(var i in baseMaps) {
                if(baseMaps[i].code == mapCode) {
                    baseMaps[i].active = true;
                    if(currentMap) {
                        baseLayer = currentMap.baseLayer;
                        currentMap.active = false;
                    }
                    currentMap = baseMaps[i];
                }
            }
            if(currentMap && currentMap.baseLayer) {
                leafletData.getMap('main-map').then(function(map) {
                    currentMap.baseLayer.addTo(map);
                    if(baseLayer) {
                        map.removeLayer(baseLayer);
                    }
                });
            }
        };

        leafletData.getMap('main-map').then(function(map) {

            // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
            $timeout(function() {
                map.invalidateSize(false);
            }, 500);

            var baseLayers = {}, overlays = {};
            for(var name in baseMaps) {
                var provider = baseMaps[name];
                if(provider.active) {
                    currentMap = provider;
                }
                var baseLayer, overlay;
                baseLayer = L.tileLayer.provider(provider.code);
                if(provider.active) {
                    baseLayer.addTo(map);
                }
                provider.baseLayer = baseLayer;
                provider.overlays = {};
                for(var i in provider.overlay) {
                    overlay = L.tileLayer.provider(provider.overlay[i]);
                    if(provider.active) {
                        overlay.addTo(map);
                    }
                    overlays[i] = overlay;
                    provider.overlays[i] = overlay;
                }

                baseLayers[provider.name] = baseLayer;
            }

            var controlLayers = L.control.layers(baseLayers, overlays).addTo(map);

            map.on('photoClick', onMapPhotoClicked);
        });

        function onMapPhotoClicked(ev) {
            $mmdPhotoDialog.show({target: ev.originEvent.target._icon}, {id: ev.photoId});
        }

        var lhm = new LocationHashManager($scope, $location);
        var lsm = new LocationSearchManager($scope, $location);
        $scope.$on("centerUrlHash", function(event, centerHash) {
            lsm.set("c", centerHash);
        });

        lsm.watch("c", function (centerHash) {
            $log.debug(LOG_TAG+centerHash);
            if(centerHash) {
                var center = centerHash.split(":");
                $scope.center.lat = Number(center[0]);
                $scope.center.lng = Number(center[1]);
                $scope.center.zoom = Number(center[2]);
            }
        });

        lhm.watch("mc", function(mapCode) {
            $scope.setMapLayer(mapCode);
        });


        $scope.config = {};
        $scope.setMapBarConfig = function(config){
            $scope.config = angular.extend($scope.config, config);
        };

        $scope.getMap = function() {
            return leafletData.getMap('main-map');
        };
    }

    //function mapLayersManager(map) {
    //
    //    this.map = map;
    //
    //    this.control = L.control.layers({}, {}).addTo(map);
    //
    //    this.baseLayers = {};
    //
    //    this.addBaseLayer = function(code, name) {
    //        if(!name) {
    //            name = code;
    //        }
    //        this.baseLayers[name] = L.tileLayer.provider(code);
    //        this.control.addBaseLayer(this.baseLayers[name]);
    //    };
    //
    //    this.addGroupLayer = function(baseLayer) {
    //        this.baseLayers[name] = L.tileLayer.provider(code);
    //        //this.control
    //    };
    //}

    function MapsGeoSearch($scope, $log, QQWebapi, OSMWS) {

        var geoSearchControl, loc = 1;
        $scope.getMap().then(function(map) {
            geoSearchControl = new GeoSearchControl();
            geoSearchControl.addTo(map);
        });

        $scope.geoSearch = function(text) {
            if(text && text.length && text.length > 1) {

                if(loc == 1) {
                    QQWebapi.geocoder(text).then(function(res) {
                        $log.debug(LOG_TAG + " results:");
                        $log.debug(res);

                        $scope.ress = decodeQQ(res.result);
                        if($scope.ress.length) {
                            $scope.locate($scope.ress[0]);
                        }else {
                            $scope.message = "未查到结果";
                        }
                        $log.debug(LOG_TAG + " got results for " + text);
                    });
                }else {
                    OSMWS.geocoder(text).then(function(res) {
                        $scope.ress = decodeOSM(res);
                        if($scope.ress.length) {
                            $scope.locate($scope.ress[0]);
                        }else {
                            $scope.message = "未查到结果";
                        }

                        $log.debug(LOG_TAG + " got results for " + text);
                    });
                }
            }
        };

        $scope.locate = function(res) {
            geoSearchControl.locate(res);
        };

        $scope.onTabSelect = function(index) {
            loc = index;
        };

        $scope.$watch('search', function() {
            $scope.ress = [];
            $scope.message = "";
            if(geoSearchControl) {
                geoSearchControl.reset();
            }
        });

        function decodeQQ(result) {
            var locations = [];
            var name = result.address_components.province +
                         result.address_components.city +
                         result.address_components.district +
                         result.address_components.street +
                         result.address_components.street_number;

            var location = {
                location: result.location,
                display_name: name,
                address: result.address_components
            };

            locations.push(location);
            return locations;
        }

        function decodeOSM(result) {

            angular.forEach(result, function(location, key) {
                location.location = {
                    lat: location.lat,
                    lng: location.lon
                };
            });
            return result;
        }
    }

    GeoSearchControl = function() {};

    angular.extend(GeoSearchControl.prototype, {
        _marker: null,
        locate: function(result) {
            if(!this._marker) {
                this._marker = L.marker(result.location);
            }else {
                this._marker.setLatLng(L.latLng(result.location));
            }

            if(!this._map.hasLayer(this.marker)) {
                this._marker.addTo(this._map);
            }
            if(result.class == "boundary") {
                this._map.fitBounds([[result.boundingbox[0], result.boundingbox[2]],
                    [result.boundingbox[1], result.boundingbox[3]]]);
            }else {
                this._map.setView(this._marker.getLatLng());
            }


        },
        addTo: function(map) {
            this._map = map;
        },
        remove: function() {
            this._map.removeLayer(this._marker);
            this._map = null;
        },
        reset: function() {
            if(this._marker && this._map.hasLayer(this._marker)) {
                this._map.removeLayer(this._marker);
            }
        }
    });

})();