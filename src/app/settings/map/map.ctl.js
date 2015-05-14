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
        .controller('SettingsMapCtrl', ['$scope', SettingsMapCtrl])
    ;

    function SettingsMapCtrl($scope) {

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
                baselayers: {},
                overlays: {}
            }
        });
    }
})();