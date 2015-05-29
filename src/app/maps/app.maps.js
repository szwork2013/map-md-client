/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps',
        [ 'app.maps.popular', 'app.maps.user', 'app.maps.cluster', 'app.maps.upload',
            'app.maps.geojson', 'app.maps.travel', 'app.maps.heatmap', 'app.maps.track'])

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
            '$state',
            MapsCtrl])
        .controller('GridBottomSheetCtrl', ['$scope', '$mdBottomSheet', '$state', 'items', GridBottomSheetCtrl])
        .controller('DialogController', ['$scope', '$mdDialog', DialogController])
    ;

    var LOG_TAG = "Maps: ";

    function GridBottomSheetCtrl($scope, $mdBottomSheet, $state, items) {
        $scope.items = items;

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $state.go(clickedItem.link, clickedItem.params);
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
                       leafletData, $mmdPhotoDialog, LocationSearchManager, LocationHashManager, $location, mapCode,
                       $state) {
        var self = this;

        self.toggleRight = $scope.toggleRightSidenav = toggleRight;
        $scope.closeRightSidenav = closeRightSidenav;

        $scope.showGridBottomSheet = function($event, items) {
            //$scope.alert = '';
            return $mdBottomSheet.show({
                templateUrl: 'home/bottom-sheet-grid.tpl.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event,
                locals: {items: items}
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

        function closeRightSidenav() {
            $mdSidenav('right')
                .close()
                .then(function(){
                    $log.debug('closed');
                });
        }

        $scope.stateGo = function(state, params) {
            $state.go(state, params);
        };

        angular.extend($scope, {
            defaults: {
            },
            options: {
                drawControl: true
                //editable: true
            }
        });

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

            L.control.locate({
                icon: "fa fa-dot-circle-o"
            }).addTo(map);

            L.easyButton('fa-angle-right',
                function (){
                    $scope.toggleLeftBar();
                },
                'Interact with the map'
            ).addTo(map);

            L.easyButton('fa-angle-left',
                function (){
                    $scope.toggleRightSidenav();
                },
                {
                    position: 'bottomright'
                }
            ).addTo(map);

        });

        function onMapPhotoClicked(ev) {
            $mmdPhotoDialog.show({target: ev.originEvent.target._icon}, {id: ev.photoId});
        }

        //var lhm = new LocationHashManager($scope, $location);
        //var lsm = new LocationSearchManager($scope, $location);
        //$scope.$on("centerUrlHash", function(event, centerHash) {
        //    lsm.set("c", centerHash);
        //});

        //lsm.watch("c", function (centerHash) {
        //    $log.debug(LOG_TAG+centerHash);
        //    if(centerHash) {
        //        var center = centerHash.split(":");
        //        $scope.center.lat = Number(center[0]);
        //        $scope.center.lng = Number(center[1]);
        //        $scope.center.zoom = Number(center[2]);
        //    }
        //});

        //lhm.watch("mc", function(mapCode) {
        //    $scope.setMapLayer(mapCode);
        //});


        $scope.config = {
            title: ""
        };
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

})();