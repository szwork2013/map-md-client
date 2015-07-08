/**
 * Created by tiwen.wang on 6/14/2015.
 */
(function () {
    'use strict';

    angular.module('app.photos.albums', ['uiSelect'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.photos.albums', {
                        url: '/albums',
                        templateUrl: 'photos/albums/albums.tpl.html',
                        controller: 'PhotosAlbumsCtrl as pamc',
                        resolve: {}
                    })
                ;
            }])
        .controller('PhotosAlbumsCtrl', ['$scope', '$log', '$q', 'user', 'Users', PhotosAlbumsCtrl])
    ;

    function PhotosAlbumsCtrl($scope, $log, $q, user, Users) {
        var self = this;
        $scope.setPage("app.photos.albums");
        self.albums = [];
        var pageSize = 20;

        self.loadMoreAlbums = function(pageNo) {
            var deferred = $q.defer();
            Users.getAlbums(user.id, pageNo, pageSize).then(function(albums) {
                self.albums = self.albums.concat(albums);
                if(albums.length<pageSize) {
                    deferred.resolve(false);
                }else {
                    deferred.resolve(true);
                }
            },function() {
                deferred.resolve(false);
            });
            return deferred.promise;
        };

        self.loadReset = function() {
            self.albums.length = 0;
        };
    }
})();