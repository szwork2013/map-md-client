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
        .controller('MapsClusterUserCtrl', ['$scope', '$log', 'Users', 'userId', MapsClusterUserController]);

    var LOG_TAG = "Maps-Cluster-User: ";

    function MapsClusterUserController($scope, $log, Users, userId) {

        // sidebar config
        if($scope.setMapBarConfig) {
            $scope.setMapBarConfig({noToolbar: false, title: "用户的图片"});
        }

        $scope.userId = userId;

        // configs
        var pageSize = 100;

        $scope.photos = [];

        init();

        function init() {
            // 获取用户信息
            Users.get(userId).then(function(user) {
                $scope.user = user;
            });

            $scope.photos = [];

            // 开始调用获取用户图片
            callGetPhotos(userId, 1);
        }

        /**
         * 递归获取用户图片
         * @param userId
         * @param pageNo
         */
        function callGetPhotos(userId, pageNo) {
            Users.getPhotos(userId, pageSize, pageNo).then(function(photos) {
                $scope.photos = $scope.photos.concat(photos);
                addClusterMarkers(photos);
                if(photos.length && photos.length == pageSize) {
                    callGetPhotos(userId, pageNo+1);
                }else {
                    $log.debug(LOG_TAG + "photos length = " + $scope.photos.length);
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

        $scope.$on('$destroy', function(e) {
            $scope.clear();
        });
    }
})();