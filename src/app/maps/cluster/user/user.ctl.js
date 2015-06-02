/**
 * Created by tiwen.wang on 5/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.cluster.user', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.cluster.user', {
                        url: '/user/{id}',
                        templateUrl: 'maps/cluster/user/user.tpl.html',
                        controller: 'MapsClusterUserCtrl',
                        resolve: {
                            userId: ['$stateParams', function ($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsClusterUserCtrl', ['$scope', '$log', 'Users', 'userId', 'Authenticate',
            MapsClusterUserController]);

    var LOG_TAG = "Maps-Cluster-User: ";

    function MapsClusterUserController($scope, $log, Users, userId, Authenticate) {

        $scope.showBottomSheet = function($event) {
            $scope.showGridBottomSheet($event, [
                { name: '我的热点', icon: 'social:person', link: 'app.maps.heatmap.user', params:{id:''} },
                { name: '上传', icon: 'image:camera', link: 'app.maps.upload', params:{id:''} },
                { name: 'Help', icon: 'action:help' , link: 'app.helps.cluster'}
            ]).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        // configs
        $scope.loadMoreDisabled = false;
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
            Users.get(userId).then(function(user) {
                $scope.user = user;
            });

            photos = [];

            // 开始调用获取用户图片
            callGetPhotos(userId, 1);
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

        $scope.loadMorePhotos = function() {
            $scope.photosLimitTo = $scope.photosLimitTo + limitPageSize;
            $log.debug(LOG_TAG + "load more..." + $scope.photosLimitTo);
            if($scope.photos && $scope.photosLimitTo > $scope.photos.length) {
                $scope.loadMoreDisabled = true;
            }
            $scope.$broadcast('mmd-photo-wall-resize');
        };

        $scope.$on('$destroy', function(e) {
            $scope.clear();
        });
    }
})();