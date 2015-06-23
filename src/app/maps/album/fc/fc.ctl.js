/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.album.fc', [
        'app.maps.album.fc.edit',
        'app.maps.album.fc.display'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.album.fc', {
                        abstract: true,
                        url: '/fc',
                        templateUrl: 'maps/album/fc/fc.tpl.html',
                        controller: 'MapsFcCtrl',
                        resolve: {
                        }
                    });
            }])
        .controller('MapsFcCtrl', ['$scope', '$log', 'Albums', MapsFcCtrl]);

    function MapsFcCtrl($scope, $log, Albums) {

        $scope.setTitle = function(title) {
            $scope.title = title;
        };
    }
})();