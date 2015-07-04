/**
 * Created by tiwen.wang on 5/22/2015.
 */
(function() {
    'use strict';

    /**
     * 用户所有图片的地图聚集模块
     *   在地图上以聚集的方式显示用户所有图片
     * @ngdoc module
     * @name app.maps.cluster.user
     */
    angular.module('app.maps.cluster.user', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.cluster.user', {
                        url: '/user/{id}',
                        templateUrl: 'maps/cluster/user/user.tpl.html',
                        controller: 'MapsClusterUserCtrl as mcuc',
                        resolve: {
                            userId: ['$stateParams', function ($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsClusterUserCtrl', ['$scope', '$log', '$q', 'Users', 'userId', 'Authenticate',
            MapsClusterUserController]);

    var LOG_TAG = "Maps-Cluster-User: ";

    function MapsClusterUserController($scope, $log, $q, Users, userId, Authenticate) {
        var self = this;

        // configs
        $scope.photosLimitTo = 20;
        var pageSize = 100, limitPageSize = 20;
        var photos = [];

        // Get user's id for initial this controller
        $scope.userId = userId;
        if(!$scope.userId) {
            Authenticate.getUser().then(function(user) {
                $scope.userId = userId = user.id;
                init();
            });
        }else {
            init();
        }

        function init() {
            // 获取用户信息
            Users.getUser(userId).then(function(user) {
                $scope.setUserTitle(user, user.name+"的图片");
                $scope.user = user;
                $scope.create(user.name, []);
                photos = [];
                // 开始调用获取用户图片
                callGetPhotos(userId, 0);
            });
        }

        /**
         * 递归获取用户图片
         * @param userId
         * @param pageNo
         */
        function callGetPhotos(userId, pageNo) {
            Users.getPhotos(userId, pageSize, pageNo).then(function(data) {
                photos = photos.concat(data);
                addClusterMarkers(data);
                if(data.length && data.length == pageSize) {
                    callGetPhotos(userId, pageNo+1);
                }else {
                    $scope.photos = photos;
                }
            });
        }

        /**
         * 往图标集图层添加图片
         * @param photos
         */
        function addClusterMarkers(photos) {
            $scope.addLayer(photos);
        }

        self.loadMorePhotos = function(pageNo) {
            var deferred = $q.defer();
            $scope.photosLimitTo = limitPageSize*(pageNo+1);
            if($scope.photos && $scope.photosLimitTo > $scope.photos.length) {
                deferred.resolve(false);
            }else {
                deferred.resolve(true);
            }
            $scope.$broadcast('mmd-photo-wall-resize');
            return deferred.promise;
        };

        self.loadReset = function() {
            $scope.photosLimitTo = limitPageSize;
        };

        $scope.$on('$destroy', function(e) {
            $scope.clear();
        });
    }
})();