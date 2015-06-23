/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function () {
    'use strict';

    angular.module('app.albums', ['app.albums.new'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $urlRouterProvider
                    .when('/albums', '/albums/new');

                $stateProvider
                    .state('app.albums', {
                        abstract: true,
                        url: '/albums',
                        templateUrl: 'albums/albums.tpl.html',
                        controller: 'AlbumsCtrl as ac',
                        resolve: {}
                    })
                ;
            }])
        .controller('AlbumsCtrl', ['$scope', '$state', '$log', '$mdSidenav', '$mdToast', AlbumsCtrl])
    ;

    function AlbumsCtrl($scope, $state, $log, $mdSidenav, $mdToast) {
        var self = this;
    }
})();