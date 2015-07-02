/**
 * Created by tiwen.wang on 7/1/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.maps.search.photo
     */
    angular.module('app.maps.search.photo', [
        'app.maps.search'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.search.photo', {
                        url: '/photo?keyword',
                        templateUrl: 'maps/search/photo/photo.tpl.html',
                        resolve: {
                            keyword: ['$stateParams', function($stateParams){
                                return $stateParams.keyword;
                            }]
                        },
                        controller: "MapsSearchPhotoCtrl as mspc"
                    });
            }])
        .controller('MapsSearchPhotoCtrl',
        ['$scope', '$menuBottomSheet', '$log', '$q', 'Search', 'keyword',
            MapsSearchPhotoCtrl])
    ;

    var LOG_TAG = "[Maps Search photo] ";

    function MapsSearchPhotoCtrl($scope, $menuBottomSheet, $log, $q, Search, keyword) {
        var self = this;
        var pageSize = 20;
        $scope.photos = [];
        self.keyword = keyword;
        $scope.setKeyword(keyword);
        $scope.setTab('photo');

        self.searchMore = function(pageNo) {
            var deferred = $q.defer();
            if(self.keyword) {
                Search.photo(self.keyword, pageNo, pageSize).then(function(photos) {
                    //$log.debug(photos);
                    $scope.photos = $scope.photos.concat(photos);
                    $scope.clusterAddPhotos(photos);
                    if(photos.length<pageSize) {
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
            $scope.photos = [];
            $scope.clusterClear();
        };

        $scope.searchReset = function() {
            $scope.photos = [];
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

        $scope.$on('$destroy', function(e) {
            $scope.clusterClear();
        });
    }
})();