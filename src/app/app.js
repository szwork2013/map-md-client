/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    angular.module('app', ['app.core', 'app.components', 'app.home', 'app.maps', 'app.settings',
        'ui.router', 'ngMaterial', 'leaflet-directive', 'templates-app', 'templates-common'])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {
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
        .run(['Oauth2Service', 'Authenticated', Run])

        .controller('AppCtrl',
        ['$scope', '$mdSidenav', '$mdBottomSheet', '$mdMedia', '$log', '$q',
            AppCtrl])
        ;

    function Run(Oauth2Service, Authenticated) {
        // 待刷新token后再获取登录用户
        Oauth2Service.refresh().then(function() {
            // init logged user
            Authenticated.getUser();
        });
    }

    /**
     *
     * @param $scope
     * @param $mdSidenav
     * @param $mdBottomSheet
     * @param $mdMedia
     * @param $log
     * @param $q
     * @constructor
     */
    function AppCtrl($scope, $mdSidenav, $mdBottomSheet, $mdMedia, $log, $q ) {
        var self = this;

        self.toggleList   = toggleUsersList;

        $scope.toggleLeftBar = self.toggleList;
        $scope.$mdMedia = $mdMedia;

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
    }
})();