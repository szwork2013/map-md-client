/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps',
        [ 'app.maps.popular', 'app.maps.upload', 'app.maps.user', 'app.maps.cluster',
            'app.maps.geojson', 'app.maps.travel',
            'ngMaterial', 'leaflet-directive', 'templates-app',
            'templates-common', 'ui.router' ])

        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $urlRouterProvider
                    .when('/maps', '/maps/popular');

                $stateProvider
                    .state('maps', {
                        abstract: true,
                        url: '/maps',
                        views: {
                            'sidenav': {
                                templateUrl: 'home/sidenav/sidenav.tpl.html',
                                controller: 'SidenavCtrl'
                            },
                            '': {
                                templateUrl: 'maps/maps.tpl.html',
                                controller: 'MapsCtrl'
                            }
                        },
                        resolve: {}
                    })
                ;
            }])
        .controller('MapsCtrl',
        ['$scope', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$log', '$q', '$timeout',
            'leafletData', 'Panoramios', '$mmdUtil', '$mmdPhotoDialog', '$location',
            MapsCtrl])
        .controller('GridBottomSheetCtrl', ['$scope', '$mdBottomSheet', GridBottomSheetCtrl])
        .controller('DialogController', ['$scope', '$mdDialog', DialogController])
    ;

    function GridBottomSheetCtrl($scope, $mdBottomSheet) {
        $scope.items = [
            { name: 'Upload', icon: 'upload', link: 'maps.upload' },
            { name: 'Mail', icon: 'mail', link: 'maps.popular' },
            { name: 'Person', icon: 'social:person' , link: 'maps.user'}
        ];

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
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
                       leafletData, Panoramios, $mmdUtil, $mmdPhotoDialog, $location) {
        var self = this;

        self.close = closeRight;

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

        function closeRight() {
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
        L.FeatureGroup.EVENTS = "";
        angular.extend($scope, {
            center: {
                lat: 34,
                lng: 110,
                zoom: 6
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    Thunderforest: {
                        name: 'Thunderforest',
                        url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                        options: {
                            attribution: '{attribution.OpenCycleMap}'
                        },
                        type: 'xyz'
                    },
                    QQMap: {
                        name: "QQmap",
                        url: 'http://rt2.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0&v=1.1',
                        //url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        options: {
                            attribution: '&copy; <a href="http://qq.com">QQMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                            minZoom: 4,
                            tms: true
                        },
                        type: 'xyz'
                    },
                    AMapMap: {
                        name: "AMap",
                        url: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                        //url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        options: {
                            attribution: '&copy; <a href="http://amap.com">AMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                            minZoom: 1
                        },
                        type: 'xyz'
                    }
                },
                overlays: {
                }
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

        leafletData.getMap('main-map').then(function(map) {

            // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
            $timeout(function() {
                map.invalidateSize(false);
            }, 500);

        });

        $scope.$on("centerUrlHash", function(event, centerHash) {
            //console.log("url", centerHash);
            $location.search({ c: centerHash });
        });

        $scope.config = {};
        $scope.setMapBarConfig = function(config){
            $scope.config = angular.extend($scope.config, config);
        };
    }

})();