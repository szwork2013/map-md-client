/**
 * Created by tiwen.wang on 4/30/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.user',
        ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.user', {
                        url: '/user/{id}',
                        views: {
                            '': {
                                templateUrl: 'maps/user/user.tpl.html',
                                controller: 'MapsUserCtrl'
                            }
                        },
                        resolve: {
                            userId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsUserCtrl', ['$scope', '$stateParams', '$log', 'Authenticate', 'Users', '$mmdLeafletUtil',
            MapsUserController]);

    var LOG_TAG = "MAPS-USER: ";

    /**
     *
     * @param $scope
     * @param $stateParams
     * @param $log
     * @param Authenticate
     * @param Users
     * @param $mmdLeafletUtil
     * @constructor
     */
    function MapsUserController($scope, $stateParams, $log, Authenticate, Users, $mmdLeafletUtil) {

        // configs
        var pageSize = 100;

        var userId = $stateParams.id;
        if(!userId) {
            Authenticate.getUser().then(function(user) {
                userId = user.id;
                init();
            });
        }else {
            init();
        }

        $log.debug("$stateParams user id is " + userId );

        // sidebar config
        if($scope.setMapBarConfig) {
            $scope.setMapBarConfig({noToolbar: true});
        }

        // 图片图标组层
        var markers;
        markers = L.markerClusterGroup();
        $scope.getMap().then(function(map) {
            map.addLayer(markers);
        });


        $scope.photos = [];

        function init() {
            // 获取用户信息
            Users.get(userId).then(function(user) {
                $scope.user = user;
            });

            $scope.photos = [];

            // 开始调用获取用户图片
            callGetPhotos(1);
        }

        /**
         * 递归获取用户图片
         * @param pageNo
         */
        function callGetPhotos(pageNo) {
            Users.getPhotos(userId, pageSize, pageNo).then(function(photos) {
                $scope.photos = $scope.photos.concat(photos);
                addClusterMarkers(photos);
                if(photos.length && photos.length == pageSize) {
                    callGetPhotos(pageNo+1);
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
            $scope.getMap().then(function(map) {
                angular.forEach(photos, function(photo, key) {
                    if(photo.point) {
                        markers.addLayer($mmdLeafletUtil.photoMarker(photo, map));
                    }
                });
            });
        }

        $scope.$on('$destroy', function(e) {
            markers.clearLayers();
            $scope.getMap().then(function(map) {
                map.removeLayer(markers);
            });
        });

        $scope.getLayers = function() {
            var layers = markers.getLayers();
            //$log.debug(layers);
        };
    }
})();