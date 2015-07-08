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
        .controller('SettingsAccountCtrl', ['$scope', '$log', '$mdDialog', 'Users', 'Authenticate',
            'user', SettingsAccountCtrl])
    ;

    var LOG_TAG = "Settings-Account: ";

    function SettingsAccountCtrl($scope, $log, $mdDialog, Users, Authenticate, user) {
        var self = this;
        self.settings = {};
        $scope.Authenticate = Authenticate;
        self.user = user;

        Users.getUser(user.id).then(function(settings) {
            self.settings  = settings;
            $scope.reset();
        });

        $scope.reset = function() {
            $scope.settings = angular.copy(self.settings);
            $scope.accountForm.$setPristine();
        };

        self.submit = function(settings) {
            self.saving = true;
            Users.saveAccount(settings).then(function(setting) {
                self.saving = false;
                $scope.accountForm.$setPristine();
                $scope.showMessage("保存成功");
                Authenticate.user.name = setting.name;
                Authenticate.user.description = setting.description;
            }, function(error) {
                $scope.showMessage(error.statusText);
            });
        };

        self.changeAvatar = function(ev) {
            $mdDialog.show({
                controller: 'AvatarUploadCtrl',
                templateUrl: 'home/avatar/avatar.tpl.html',
                targetEvent: ev
            }).then(function(avatar) {
                Authenticate.setAvatarCover(avatar);
            });
        };
    }
})();