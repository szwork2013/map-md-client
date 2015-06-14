/**
 * Created by tiwen.wang on 6/14/2015.
 */
(function () {
    'use strict';

    angular.module('app.photos', ['app', 'app.photos.all', 'app.photos.albums'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $urlRouterProvider
                    .when('/photos', '/photos/all');
                $stateProvider
                    .state('app.photos', {
                        abstract: true,
                        url: '/photos',
                        templateUrl: 'photos/photos.tpl.html',
                        controller: 'PhotosCtrl',
                        resolve: {}
                    })
                ;
            }])
        .controller('PhotosCtrl', ['$scope', '$state', '$log', PhotosCtrl])
    ;

    function PhotosCtrl($scope, $state, $log) {
        var self = this;

        $scope.linkItems = [
            {name: '全部', state: 'app.photos.all'},
            {name: '相册', state: 'app.photos.albums'}
        ];

        $scope.$watch('menuSelectedIndex', function(current, old){
            if(old!==undefined && current!==undefined) {
                $state.go($scope.linkItems[current].state);
            }
        });

    }
})();