/**
 * Created by tiwen.wang on 7/8/2015.
 */
(function() {
    'use strict';

    /**
     *
     * @ngdoc module
     * @name app.components.album.albumsCard
     */
    angular.module('app.components.album.albumsCard', [])
        .directive('albumsCard', ['$mdDialog', '$log', 'UrlService', '$state',
            albumsCardDirective])
        .controller('AlbumsCardController', ['$scope', '$q', 'Users', AlbumsCardController])
    ;

    function albumsCardDirective($mdDialog, $log, UrlService, $state) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                user: '=',
                authority: '=',
                pageSize: '@?',
                add: '&?albumsAdd'
            },
            templateUrl: 'components/album/albumsCard/albumsCard.tpl.html',
            controller: 'AlbumsCardController as acc'
        };

        function link(scope, element, attrs) {
        }
    }

    function AlbumsCardController($scope, $q, Users) {
        $scope.pageSize = $scope.pageSize||20;
        $scope.albums = [];

        $scope.loadMore = function(pageNo) {
            var deferred = $q.defer();
            Users.getAlbums($scope.user.id, pageNo, $scope.pageSize).then(function(albums) {
                $scope.albums = $scope.albums.concat(albums);
                if(albums.length<$scope.pageSize) {
                    deferred.resolve(false);
                }else {
                    deferred.resolve(true);
                }
            },function() {
                deferred.resolve(false);
            });
            return deferred.promise;
        };

        $scope.loadReset = function() {
            $scope.albums.length = 0;
        };
    }
})();