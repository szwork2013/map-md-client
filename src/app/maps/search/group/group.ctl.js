/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.maps.search.group
     */
    angular.module('app.maps.search.group', [
        'app.maps.search'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.search.group', {
                        url: '/group?keyword',
                        templateUrl: 'maps/search/group/group.tpl.html',
                        resolve: {
                            keyword: ['$stateParams', function($stateParams){
                                return $stateParams.keyword;
                            }]
                        },
                        controller: "MapsSearchGroupCtrl as msgc"
                    });
            }])
        .controller('MapsSearchGroupCtrl',
        ['$scope', '$menuBottomSheet', '$log', '$q', 'Search', 'keyword',
            MapsSearchGroupCtrl])
    ;

    var LOG_TAG = "[Maps Search group] ";

    function MapsSearchGroupCtrl($scope, $menuBottomSheet, $log, $q, Search, keyword) {
        var self = this;
        var pageSize = 10;
        $scope.users = [];
        self.keyword = keyword;
        $scope.setKeyword(keyword);
        $scope.setTab('group');

        self.searchMore = function(pageNo) {
            var deferred = $q.defer();
            if(self.keyword) {
                Search.group(self.keyword, pageNo, pageSize).then(function(users) {
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