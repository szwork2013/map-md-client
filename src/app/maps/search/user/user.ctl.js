/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.maps.search.user
     */
    angular.module('app.maps.search.user', [
        'app.maps.search'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.search.user', {
                        url: '/user?keyword',
                        templateUrl: 'maps/search/user/user.tpl.html',
                        resolve: {
                            keyword: ['$stateParams', function($stateParams){
                                return $stateParams.keyword;
                            }]
                        },
                        controller: "MapsSearchUserCtrl as msuc"
                    });
            }])
        .controller('MapsSearchUserCtrl',
        ['$scope', '$menuBottomSheet', '$log', '$q', 'Search', 'keyword',
            MapsSearchUserCtrl])
    ;

    var LOG_TAG = "[Maps Search user] ";

    function MapsSearchUserCtrl($scope, $menuBottomSheet, $log, $q, Search, keyword) {
        var self = this;
        var pageSize = 10;
        $scope.users = [];
        self.keyword = keyword;
        $scope.setKeyword(keyword);
        $scope.setTab('user');

        self.searchMore = function(pageNo) {
            var deferred = $q.defer();
            if(self.keyword) {
                Search.user(self.keyword, pageNo, pageSize).then(function(users) {
                    $scope.users = $scope.users.concat(users);
                    //$scope.clusterAddPhotos(albums);
                    if(users.length<pageSize) {
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
            $scope.users = [];
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