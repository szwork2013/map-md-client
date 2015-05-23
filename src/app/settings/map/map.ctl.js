/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function () {
    'use strict';

    angular.module('app.settings.map', ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.settings.map', {
                        url: '/map',
                        views: {
                            '': {
                                templateUrl: 'settings/map/map.tpl.html',
                                controller: 'SettingsMapCtrl'
                            }
                        },
                        resolve: {}
                    })
                ;
            }])
        .controller('SettingsMapCtrl', ['$scope', '$timeout', 'leafletData', SettingsMapCtrl])
    ;

    function SettingsMapCtrl($scope, $timeout, leafletData) {

        angular.extend($scope, {
            defaults: {
                tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
        });

        angular.extend($scope, {
            center: {
                lat: 34,
                lng: 110,
                zoom: 6
            }
            //layers: {
            //    //baselayers: {},
            //    overlays: {}
            //}
        });

        leafletData.getMap('settings-map').then(function(map) {
            // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
            $timeout(function () {
                map.invalidateSize(false);
            }, 500);
        });

        leafletData.getMap('min-map').then(function(map) {
            // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
            $timeout(function () {
                map.invalidateSize(false);
            }, 500);
        });
    }
})();