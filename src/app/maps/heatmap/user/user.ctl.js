/**
 * Created by tiwen.wang on 5/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.heatmap.user', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.heatmap.user', {
                        url: '/user/{id}',
                        templateUrl: 'maps/heatmap/user/user.tpl.html',
                        controller: 'MapsHeatmapUserCtrl',
                        resolve: {
                            userId: ['$stateParams', function ($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsHeatmapUserCtrl', ['$scope', '$log', 'userId', 'Users', 'Authenticate',
            MapsHeatmapUserCtrl])
    ;

    var LOG_TAG = "Maps-Heatmap-User: ";

    function MapsHeatmapUserCtrl($scope, $log, userId, Users, Authenticate) {

        // configs
        var pageSize = 100;
        $scope.photos = [];

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
                $scope.user = user;
            });

            $scope.photos = [];

            // 开始调用获取用户图片
            callGetPhotos(userId, 0);
        }

        /**
         * 递归获取用户图片
         * @param userId
         * @param pageNo
         */
        function callGetPhotos(userId, pageNo) {
            Users.getPhotos(userId, pageSize, pageNo).then(function(photos) {
                $scope.photos = $scope.photos.concat(photos);
                //addClusterMarkers(photos);
                if(photos.length && photos.length == pageSize) {
                    callGetPhotos(userId, pageNo+1);
                }else {
                    $log.debug(LOG_TAG + "photos length = " + $scope.photos.length);
                    setHeatMap($scope.photos);
                }
            });
        }

        function setHeatMap(photos) {
            var heatData = [];
            angular.forEach(photos, function(photo, key) {
                if(photo.location) {
                    heatData.push([photo.location.position[1], photo.location.position[0]]);
                }
            });
            $scope.setHeatMap("User " + userId, heatData);
        }

        $scope.$on('$destroy', function(e) {
            $scope.removeHeatMap("User " + userId);
        });
    }

})();