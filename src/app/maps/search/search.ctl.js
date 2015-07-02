/**
 * Created by tiwen.wang on 7/1/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.maps.search
     */
    angular.module('app.maps.search', [
        'app.maps.search.photo',
        'app.maps.search.album',
        'app.maps.search.user',
        'app.maps.search.group'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.search', {
                        abstract: true,
                        url: '^/search',
                        templateUrl: 'maps/search/search.tpl.html',
                        resolve: {},
                        controller: "MapsSearchCtrl"
                    });
            }])
        .controller('MapsSearchCtrl',
        ['$scope', '$menuBottomSheet', 'ClusterControl', '$log', '$q',
            MapsSearchCtrl])
    ;

    var LOG_TAG = "[Maps Search] ";

    function MapsSearchCtrl($scope, $menuBottomSheet, ClusterControl, $log, $q) {
        var self = this;

        $scope.showBottomSheet = function($event) {
            $menuBottomSheet.show($event, [
                'app.maps.cluster.my',
                'app.maps.upload',
                'app.helps.upload']);
        };

        $scope.search = function(keyword) {
            $scope.$broadcast('search', keyword);
        };

        $scope.setKeyword = function(keyword) {
            $scope.keyword = keyword;
        };

        $scope.setTab = function(tabName) {
            $scope.tabName = tabName;
        };

        $scope.getMap().then(function(map) {
            self.clusterControl = new ClusterControl(map, '搜索结果');
        });

        $scope.clusterAddPhotos = function(photos) {
            self.clusterControl.addPhotos(photos);
        };

        $scope.clusterClear = function() {
            if(self.clusterControl) {
                self.clusterControl.clear();
            }
        };

        $scope.$on('$destroy', function(e) {
            if(self.clusterControl) {
                self.clusterControl.remove();
            }
        });
    }
})();