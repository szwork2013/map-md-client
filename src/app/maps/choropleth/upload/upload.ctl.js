/**
 * Created by tiwen.wang on 6/12/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.choropleth.upload', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.choropleth.upload', {
                        url: '/upload',
                        templateUrl: 'maps/choropleth/upload/upload.tpl.html',
                        controller: 'MapsChoroplethUploadCtrl as mcuc'
                    });
            }])
        .controller('MapsChoroplethUploadCtrl', ['$scope', '$log',
            MapsChoroplethUploadCtrl]);

    function MapsChoroplethUploadCtrl($scope, $log) {


    }
})();