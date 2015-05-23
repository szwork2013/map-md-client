/**
 * Created by tiwen.wang on 5/5/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson',
        ['app.maps.geojson.choropleth'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson', {
                        abstract: true,
                        url: '/geojson',
                        views: {
                            '': {
                                templateUrl: 'maps/geojson/geojson.tpl.html',
                                controller: 'MapsGeojsonCtrl'
                            }
                        },
                        resolve: {}
                    });
            }])
        .controller('MapsGeojsonCtrl', ['$scope', '$log', 'leafletData', '$http', MapsGeojsonCtrl])
    ;

    function MapsGeojsonCtrl($scope, $log, leafletData, $http) {



    }
})();