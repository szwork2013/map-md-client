/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function () {
    'use strict';

    angular.module('app.settings.account', ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.settings.account', {
                        url: '/account',
                        views: {
                            '': {
                                templateUrl: 'settings/account/account.tpl.html',
                                controller: 'SettingsAccountCtrl'
                            }
                        },
                        resolve: {}
                    })
                ;
            }])
        .controller('SettingsAccountCtrl', ['$scope', SettingsAccountCtrl])
    ;

    function SettingsAccountCtrl($scope) {

        $scope.items = [
          1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23
        ];
    }
})();