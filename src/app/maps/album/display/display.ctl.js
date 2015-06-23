/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.album.display', [
        ])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.album.display', {
                        url: '^/{userName}/{albumName}',
                        templateUrl: 'maps/album/display/display.tpl.html',
                        controller: 'MapsAlbumDisplayCtrl as madc',
                        resolve: {
                            userName: ['$stateParams', function($stateParams){
                                return $stateParams.userName;
                            }],
                            albumName: ['$stateParams', function($stateParams){
                                return $stateParams.albumName;
                            }]
                        }
                    });
            }])
        .controller('MapsAlbumDisplayCtrl', ['$scope', '$log', 'Albums', 'userName', 'albumName',
            MapsAlbumDisplayCtrl]);

    function MapsAlbumDisplayCtrl($scope, $log, Albums, userName, albumName) {
        var self = this;

        Albums.getBy(userName, albumName).then(function(album) {
            self.album = album;
        });

        $scope.$on('$destroy', function(e) {
            $scope.getMap().then(function(map) {
            });
        });
    }
})();