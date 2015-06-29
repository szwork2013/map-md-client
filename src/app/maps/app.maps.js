/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps', [
        'app.maps.popular',
        'app.maps.user',
        'app.maps.cluster',
        'app.maps.upload',
        'app.maps.geojson',
        'app.maps.travel',
        'app.maps.heatmap',
        'app.maps.track',
        'app.maps.choropleth',
        'app.maps.album'])

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
        ['$rootScope', '$scope', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$log', '$q', '$timeout',
            'leafletData', '$mmdPhotoDialog', '$mmdUtil', 'LocationHashManager', '$location', 'mapCode',
            '$state', MapsCtrl])
        .controller('GridBottomSheetCtrl', ['$scope', '$mdBottomSheet', '$state', 'items', GridBottomSheetCtrl])
        .controller('DialogController', ['$scope', '$mdDialog', DialogController])
    ;

    var LOG_TAG = "[Maps] ";

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
     *
     * @param $rootScope
     * @param $scope
     * @param $mdSidenav
     * @param $mdBottomSheet
     * @param $mdDialog
     * @param $log
     * @param $q
     * @param $timeout
     * @param leafletData
     * @param $mmdPhotoDialog
     * @param $mmdUtil
     * @param LocationHashManager
     * @param $location
     * @param mapCode
     * @param $state
     * @constructor
     */
    function MapsCtrl( $rootScope, $scope, $mdSidenav, $mdBottomSheet, $mdDialog, $log, $q, $timeout,
                       leafletData, $mmdPhotoDialog, $mmdUtil, LocationHashManager, $location, mapCode,
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
                    $log.debug(LOG_TAG + 'right sidenav closed');
                });
        }

        $scope.stateGo = function(state, params) {
            $state.go(state, params);
        };

        angular.extend($scope, {
            defaults: {
            },
            options: {
                //drawControl: true
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

        /**
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
                code: "Esri.WorldImagery",
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
            },
            "MapBoxDaithStar": {
                name: "MapBox DaithStar",
                code: 'MapBox.DaithStar'
            },
            "MarsSatellite": {
                name: "MapBox MarsSatellite",
                code: 'MapBox.MarsSatellite'
            }
        };
        */

        var controlLayers = L.control.layersManager({},{},{autoZIndex: false});

        leafletData.getMap('main-map').then(function(map) {

            self.map = map;

            // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
            $timeout(function() {
                map.invalidateSize(false);
            }, 500);

            controlLayers.addTo(map);


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

        $scope.$on("centerUrlHash", function(event, centerHash) {
            $scope.changeMapLocation(centerHash);
        });

        $scope.changeMapLocation = function(centerHash) {
            $location.hash($mmdUtil.param({ c: centerHash }));
        };

        $scope.setBaseLayer = function(map) {
            controlLayers.addMap(map);
        };

        //var mapBaseLayer = "MapBox.DaithStar", mapOverLayers;
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.Outdoors";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.Streets";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.Penil";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.Hike";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.Pirate";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.Dark";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "MapBox.SatelliteStreets";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        ////mapBaseLayer = "Esri.WorldImagery";
        ////controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "QQMap";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        //mapBaseLayer = "AMap.Base";
        //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
        controlLayers.addMap({
            id: "1",
            name: "嘎嘎哦的",
            baseLayer: 'AMap.Base'
        });

        getLocationSearch();
        $scope.$on('$locationChangeSuccess', function (e) {
            //$log.debug('scope $locationChangeSuccess changed!' + new Date());
            getLocationSearch();
        });

        function getLocationSearch() {
            var search = $location.search();
            if(search.l && search.l!==mapBaseLayer) {
                controlLayers.setBaseLayer(search.l, search.l);
                mapBaseLayer = search.l;
            }
            if(search.o && search.o!==mapOverLayers) {
                var overLayers = search.o.split(",");
                var mapCodes = {};
                angular.forEach(overLayers, function(overLayer, key) {
                    mapCodes[overLayer] = overLayer;
                });
                controlLayers.setOverLayers(mapCodes);
                mapOverLayers = search.o;
            }
        }

        $scope.getMap = function() {
            if(self.map) {
                return $q.when(self.map);
            }else {
                return leafletData.getMap('main-map');
            }
        };

        $scope.getGeoJSON = function() {
            return leafletData.getGeoJSON('main-map');
        };
    }

})();