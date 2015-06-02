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
                        templateUrl: 'settings/account/account.tpl.html',
                        controller: 'SettingsAccountCtrl as sac',
                        resolve: {}
                    })
                ;
            }])
        .controller('SettingsAccountCtrl', ['$scope', '$log', '$mdDialog', 'UserSettings', 'Authenticate', SettingsAccountCtrl])
    ;

    var LOG_TAG = "Settings-Account: ";

    function SettingsAccountCtrl($scope, $log, $mdDialog, UserSettings, Authenticate) {
        var self = this;
        self.settings = {};
        $scope.Authenticate = Authenticate;

        Authenticate.getUser().then(function(user) {
            UserSettings.get(user.id).then(function(settings) {
                self.settings  = settings;
                $scope.reset();
            });
        });

        $scope.reset = function() {
            $scope.settings = angular.copy(self.settings);
            $scope.accountForm.$setPristine();
        };

        self.submit = function(settings) {
            self.saving = true;
            settings.saveAccount().then(function() {
                self.saving = false;
                $scope.accountForm.$setPristine();
                $scope.showMessage("保存成功");
            });
        };

        self.changeAvatar = function(ev) {
            $mdDialog.show({
                controller: 'AvatarUploadCtrl',
                templateUrl: 'home/avatar/avatar.tpl.html',
                targetEvent: ev
            }).then(function(user) {
                Authenticate.user.avatar = user.avatar;
            });
        };
    }
})();