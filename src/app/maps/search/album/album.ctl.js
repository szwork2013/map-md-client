/**
 * Created by tiwen.wang on 7/1/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.maps.search.album
     */
    angular.module('app.maps.search.album', [
        'app.maps.search'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.search.album', {
                        url: '/album?keyword',
                        templateUrl: 'maps/search/album/album.tpl.html',
                        resolve: {
                            keyword: ['$stateParams', function($stateParams){
                                return $stateParams.keyword;
                            }]
                        },
                        controller: "MapsSearchAlbumCtrl as msac"
                    });
            }])
        .controller('MapsSearchAlbumCtrl',
        ['$scope', '$menuBottomSheet', '$log', '$q', 'Search', 'keyword',
            MapsSearchAlbumCtrl])
    ;

    var LOG_TAG = "[Maps Search photo] ";

    function MapsSearchAlbumCtrl($scope, $menuBottomSheet, $log, $q, Search, keyword) {
        var self = this;
        var pageSize = 10;
        $scope.albums = [];
        self.keyword = keyword;
        $scope.setKeyword(keyword);
        $scope.setTab('album');

        self.searchMore = function(pageNo) {
            var deferred = $q.defer();
            if(self.keyword) {
                Search.album(self.keyword, pageNo, pageSize).then(function(albums) {
                    //$log.debug(photos);
                    $scope.albums = $scope.albums.concat(albums);
                    //$scope.clusterAddPhotos(albums);
                    if(albums.length<pageSize) {
                        deferred.resolve(false);
                    }else {
                        deferred.resolve(true);
                    }
                    $scope.$broadcast('mmd-photo-wall-resize');
                },function() {
                    deferred.resolve(false);
                });
            }else {
                deferred.resolve(false);
            }
            return deferred.promise;
        };

        self.searchReset = function() {
            $scope.albums = [];
            $scope.clusterClear();
        };

        $scope.$on('search', function(e, keyword) {
            self.keyword = keyword;
            self.searchReset();
            $scope.$broadcast('async-card-init');
        });

        if(keyword) {
            $scope.$broadcast('async-card-init');
        }

        $scope.display = function(album) {

        };

        $scope.$on('$destroy', function(e) {
            $scope.clusterClear();
        });
    }
})();