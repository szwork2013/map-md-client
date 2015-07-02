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
        .controller('MapsClusterCtrl', ['$scope', '$log', 'ClusterControl', '$menuBottomSheet', MapsClusterCtrl]);

    function MapsClusterCtrl($scope, $log, ClusterControl, $menuBottomSheet) {
        var self = this;

        $scope.setUserTitle = function(user, title) {
            self.user = user;
            self.title = title;
        };

        $scope.showBottomSheet = function($event) {
            $menuBottomSheet.show($event, [
                'app.maps.popular',
                'app.maps.heatmap.my',
                'app.maps.upload',
                'app.helps.upload']);
        };

        // 图片图标组层
        $scope.create = function(name, photos) {
            $scope.getMap().then(function(map) {
                self.clusterControl = new ClusterControl(map, name);
                self.clusterControl.addPhotos(photos);
                self.clusterControl.fitBounds();
            });
        };

        $scope.addLayer = function(photo) {
            self.clusterControl.addPhotos(photo);
            self.clusterControl.fitBounds();
        };

        $scope.clear = function() {
            self.clusterControl.clear();
        };

        $scope.$on('$destroy', function(e) {
            if(self.clusterControl) {
                self.clusterControl.remove();
            }
        });
    }
})();