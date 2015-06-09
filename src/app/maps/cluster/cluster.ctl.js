/**
 * Created by tiwen.wang on 4/30/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.cluster', ['app.maps.cluster.user'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.cluster', {
                        abstract: true,
                        url: '^/cluster',
                        templateUrl: 'maps/cluster/cluster.tpl.html',
                        controller: 'MapsClusterCtrl',
                        resolve: {}
                    });
            }])
        .controller('MapsClusterCtrl', ['$scope', '$log', '$mmdLeafletUtil', MapsClusterCtrl]);

    function MapsClusterCtrl($scope, $log, $mmdLeafletUtil) {

        // 图片图标组层
        var clusterGroup = L.markerClusterGroup();
        $scope.getMap().then(function(map) {
            map.addLayer(clusterGroup);
        });

        $scope.addLayer = function(photo) {
            $scope.getMap().then(function(map) {
                if (angular.isArray(photo)) {
                    angular.forEach(photo, function (photo, key) {
                        if(photo.location) {
                            clusterGroup.addLayer($mmdLeafletUtil.photoMarker(photo, map));
                        }
                    });
                } else if (angular.isObject(photo)) {
                    if(photo.location) {
                        clusterGroup.addLayer($mmdLeafletUtil.photoMarker(photo, map));
                    }
                }
            });
        };

        $scope.clear = function() {
            clusterGroup.clearLayers();
        };

        $scope.$on('$destroy', function(e) {
            $scope.clear();
            $scope.getMap().then(function(map) {
                map.removeLayer(clusterGroup);
            });
        });
    }
})();