/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function () {
    'use strict';

    angular.module('app.settings', ['app.settings.account', 'app.settings.map'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $urlRouterProvider
                    .when('/settings', '/settings/map');

                $stateProvider
                    .state('app.settings', {
                        abstract: true,
                        url: '/settings',
                        views: {
                            '': {
                                templateUrl: 'settings/setting.tpl.html',
                                controller: 'SettingsCtrl'
                            }
                        },
                        resolve: {}
                    })
                ;
            }])
        .controller('SettingsCtrl', ['$scope', '$state', '$log', '$mdSidenav', '$mdToast', SettingsCtrl])
    ;

    function SettingsCtrl($scope, $state, $log, $mdSidenav, $mdToast) {
        var self = this;

        $scope.linkItems = [
            {name: '账户', icon: 'action:account_box', state: 'app.settings.account'},
            {name: '地图', icon: 'maps:map', state: 'app.settings.map'}
        ];

        $scope.$watch('menuSelectedIndex', function(current, old){
            if(old!==undefined && current!==undefined) {
                $scope.navigateTo($scope.linkItems[current].state);
            }
        });

        $scope.navigateTo = function(state, event) {
            $state.go(state).then(function() {
                //self.close();
            });
        };

        $scope.close = self.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };

        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };
        $scope.showMessage = function(content) {
            var toast = $mdToast.simple()
                .content(content)
                .highlightAction(false)
                .position($scope.getToastPosition());
            $mdToast.show(toast).then(function() {
            });
        };

    }
})();