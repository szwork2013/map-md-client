/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    angular.module('app', ['app.components', 'app.maps', 'app.home'])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {
                $urlRouterProvider
                    .otherwise('/maps');
            }])
        .run(['Oauth2Service', 'Authenticated', Run])

        .controller('AppCtrl',
        ['$scope', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$log', '$q',
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
     * @param $mdDialog
     * @param $log
     * @param $q
     * @constructor
     */
    function AppCtrl($scope, $mdSidenav, $mdBottomSheet, $mdDialog, $log, $q ) {
        var self = this;

        self.toggleList   = toggleUsersList;

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