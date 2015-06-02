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
                        templateUrl: 'settings/map/map.tpl.html',
                        controller: 'SettingsMapCtrl',
                        resolve: {}
                    })
                ;
            }])
        .controller('SettingsMapCtrl', ['$scope', '$timeout', 'leafletData', '$mmdLeafletUtil',
            SettingsMapCtrl])
    ;

    function SettingsMapCtrl($scope, $timeout, leafletData, $mmdLeafletUtil) {
        var self = this;

        $scope.providers = angular.copy($mmdLeafletUtil.providers);

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

        var control = L.control.layersManager({}, {}, {autoZIndex: false});
        $scope.changeTiles = function(provider) {
            if(provider.overlay) {
                var overlay = {};
                overlay[provider.name] = provider.code;
                control.setOverLayers(overlay);
            }else {
                control.clear();
                control.setBaseLayer(provider.code, provider.name);
            }
        };

        leafletData.getMap('settings-map').then(function(map) {
            // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
            $timeout(function () {
                map.invalidateSize(false);
            }, 500);

            control.addTo(map);
        });

        //leafletData.getMap('min-map').then(function(map) {
        //    // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
        //    $timeout(function () {
        //        map.invalidateSize(false);
        //    }, 500);
        //});
    }
})();