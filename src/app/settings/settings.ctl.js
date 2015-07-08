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
                        templateUrl: 'settings/setting.tpl.html',
                        controller: 'SettingsCtrl as sc',
                        resolve: {
                            user: ['Authenticate', function(Authenticate) {
                                return Authenticate.getUser();
                            }]
                        }
                    })
                ;
            }])
        .controller('SettingsCtrl', ['$scope', '$state', '$log', 'user', '$mdToast', 'Authenticate', SettingsCtrl])
    ;

    var LOG_TAG = "[Settings] ";

    function SettingsCtrl($scope, $state, $log, user, $mdToast, Authenticate) {
        var self = this;
        self.mastheadUploaded = mastheadUploaded;
        self.user = user;

        $scope.linkItems = [
            {name: '账户', icon: 'action:account_box', state: 'app.settings.account'},
            {name: '地图', icon: 'maps:map', state: 'app.settings.map'}
        ];

        self.tabSelected = function(item) {
            if(self.item&&(self.item.name == item.name)) {
            }else {
                self.item = item;
                $scope.navigateTo(item.state);
            }
        };

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

        function mastheadUploaded(cover) {
            Authenticate.setMastheadCover(cover);
        }
    }
})();