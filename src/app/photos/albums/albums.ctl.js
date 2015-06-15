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
        .controller('PhotosAlbumsCtrl', ['$scope', '$log', '$mmdPhotoDialog', 'Authenticate', 'Users', PhotosAlbumsCtrl])
    ;

    function PhotosAlbumsCtrl($scope, $log, $mmdPhotoDialog, Authenticate, Users) {
        var self = this;
        $scope.setPage("app.photos.albums");
        self.albums = [];
        var userId = 0, pageSize = 20, pageNo = -1;

        Authenticate.getUser().then(function(user) {
            userId = user.id;
            self.loadMoreAlbums();
        });

        self.loadMoreAlbums = function() {
            pageNo++;
            Users.getAlbums(userId).then(function(albums) {
                self.albums = self.albums.concat(albums);
            });
        };
    }
})();