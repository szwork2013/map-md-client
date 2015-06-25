/**
 * Created by tiwen.wang on 4/30/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.cluster', [
        'app.maps.cluster.user',
        'app.maps.cluster.album'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.cluster', {
                        abstract: true,
                        url: '^/cluster',
                        templateUrl: 'maps/cluster/cluster.tpl.html',
                        controller: 'MapsClusterCtrl as mcc',
                        resolve: {}
                    });
            }])
        .controller('MapsClusterCtrl', ['$scope', '$log', '$mmdLeafletUtil', MapsClusterCtrl]);

    function MapsClusterCtrl($scope, $log, $mmdLeafletUtil) {
        var self = this;

        $scope.setUserTitle = function(user, title) {
            self.user = user;
            self.title = title;
        };

        $scope.showBottomSheet = function($event) {
            $scope.showGridBottomSheet($event, [
                { name: '我的热点', icon: 'social:person', link: 'app.maps.heatmap.user', params:{id:''} },
                { name: '上传', icon: 'image:camera', link: 'app.maps.upload', params:{id:''} },
                { name: 'Help', icon: 'action:help' , link: 'app.helps.cluster'}
            ]).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        // 图片图标组层
        var clusterGroup = L.markerClusterGroup();
        $scope.getMap().then(function(map) {
            map.addLayer(clusterGroup);
        });

        self.photos = [];
        $scope.addLayer = function(photo) {
            $scope.getMap().then(function(map) {
                if (angular.isArray(photo)) {
                    angular.forEach(photo, function (photo, key) {
                        if(photo.location) {
                            clusterGroup.addLayer($mmdLeafletUtil.photoMarker(photo, map));
                            self.photos.push(photo);
                        }
                    });
                } else if (angular.isObject(photo)) {
                    if(photo.location) {
                        clusterGroup.addLayer($mmdLeafletUtil.photoMarker(photo, map));
                        self.photos.push(photo);
                    }
                }

                map.fitBounds(clusterGroup.getBounds());

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