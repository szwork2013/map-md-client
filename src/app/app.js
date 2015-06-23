/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.components',
        'app.home',
        'app.maps',
        'app.photos',
        'app.group',
        'app.user',
        'app.albums',
        'app.settings',
        'ui.router',
        'ngMaterial',
        'leaflet-directive',
        'templates-app',
        'templates-common'])
        //.value('staticCtx', 'http://static.photoshows.cn')
        .value('staticCtx', 'http://test.photoshows.cn')
        //.value('serverBaseUrl', 'http://www.photoshows.cn')
        .value('serverBaseUrl', 'http://localhost:8080')
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider', '$locationProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider, $locationProvider) {

                $locationProvider.html5Mode(false).hashPrefix('!');

                $urlRouterProvider
                    .when('/', '/maps/popular')
                    .when('', '/maps/popular');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '',
                        views: {
                            'sidenav': {
                                templateUrl: 'home/sidenav/sidenav.tpl.html',
                                controller: 'SidenavCtrl'
                            },
                            '': {
                                template: '<div ui-view flex layout-fill layout="column"></div>',
                                controller: function(){}
                            }
                        },
                        resolve: {}
                    })
                ;
            }])
        .run(['$rootScope', 'Oauth2Service', 'Authenticate', '$log', '$location', Run])
        .controller('AppCtrl',
        ['$scope', '$mdSidenav', '$mdBottomSheet', '$mdMedia', '$state', '$q', 'UrlService', 'staticCtx',
            AppCtrl])
        ;

    function Run($rootScope, Oauth2Service, Authenticate, $log, $location) {

        // 待刷新token后再获取登录用户
        Oauth2Service.refresh().then(function() {
            // init logged user
            Authenticate.getUser();
        });

        $rootScope.setAppTitle = function(title) {
            $rootScope.appTitle = title;
        };
    }

    /**
     *
     * @param $scope
     * @param $mdSidenav
     * @param $mdBottomSheet
     * @param $mdMedia
     * @param $state
     * @param $q
     * @param staticCtx
     * @constructor
     */
    function AppCtrl($scope, $mdSidenav, $mdBottomSheet, $mdMedia, $state, $q, UrlService, staticCtx) {
        var self = this;

        self.toggleList   = toggleUsersList;

        $scope.toggleLeftBar = self.toggleList;
        $scope.$mdMedia = $mdMedia;

        $scope.UrlService = UrlService;
        $scope.staticCtx = staticCtx;

        /**
         * First hide the bottomsheet IF visible, then
         * hide or Show the 'left' sideNav area
         */
        function toggleUsersList() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }

        $scope.go = function(state, params) {
            $state.go(state, params);
        };
    }
})();